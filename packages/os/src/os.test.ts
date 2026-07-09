import { collectSteps } from "@nand2web/sim-core";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import type { PageAlgorithm } from "./paging.ts";
import { simulatePaging, translateAddress } from "./paging.ts";
import type { ProcessSpec, SchedulingAlgorithm } from "./scheduling.ts";
import { simulate } from "./scheduling.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function runScheduling(
  processes: readonly ProcessSpec[],
  algorithm: SchedulingAlgorithm,
  quantum = 2,
) {
  const { steps, result } = collectSteps(
    simulate({ processes, algorithm, quantum }),
  );
  if (!result) throw new Error("simulation did not return a result");
  return { steps, result };
}

function runPaging(
  referenceString: readonly number[],
  frameCount: number,
  algorithm: PageAlgorithm,
) {
  const { steps, result } = collectSteps(
    simulatePaging({ referenceString, frameCount, algorithm }),
  );
  if (!result) throw new Error("paging simulation did not return a result");
  return { steps, result };
}

// ---------------------------------------------------------------------------
// Reference implementations for property tests
// ---------------------------------------------------------------------------

function referenceFifo(
  refStr: readonly number[],
  frameCount: number,
): { hits: number; faults: number } {
  const frames: (number | null)[] = Array<number | null>(frameCount).fill(null);
  const queue: number[] = [];
  let hits = 0;
  let faults = 0;
  for (const page of refStr) {
    if (frames.includes(page)) {
      hits++;
    } else {
      faults++;
      const empty = frames.indexOf(null);
      if (empty !== -1) {
        frames[empty] = page;
        queue.push(page);
      } else {
        const victim = queue.shift()!;
        frames[frames.indexOf(victim)] = page;
        queue.push(page);
      }
    }
  }
  return { hits, faults };
}

function referenceLru(
  refStr: readonly number[],
  frameCount: number,
): { hits: number; faults: number } {
  const frames: (number | null)[] = Array<number | null>(frameCount).fill(null);
  const order: number[] = [];
  let hits = 0;
  let faults = 0;
  for (const page of refStr) {
    if (frames.includes(page)) {
      hits++;
      const idx = order.indexOf(page);
      if (idx !== -1) order.splice(idx, 1);
      order.push(page);
    } else {
      faults++;
      const empty = frames.indexOf(null);
      if (empty !== -1) {
        frames[empty] = page;
        order.push(page);
      } else {
        const victim = order.shift()!;
        frames[frames.indexOf(victim)] = page;
        order.push(page);
      }
    }
  }
  return { hits, faults };
}

// ---------------------------------------------------------------------------
// Scheduling: deterministic tests
// ---------------------------------------------------------------------------

describe("scheduling — FCFS", () => {
  it("completes in arrival order when all arrive at time 0", () => {
    const { steps, result } = runScheduling(
      [
        { id: "P1", name: "P1", arrival: 0, burst: 3 },
        { id: "P2", name: "P2", arrival: 0, burst: 2 },
        { id: "P3", name: "P3", arrival: 0, burst: 1 },
      ],
      "FCFS",
    );
    const runningSeq = steps.map((s) => s.running).filter(Boolean);
    // P1 first, then P2, then P3
    expect(runningSeq.slice(0, 3).every((id) => id === "P1")).toBe(true);
    expect(runningSeq.slice(3, 5).every((id) => id === "P2")).toBe(true);
    expect(runningSeq.slice(5, 6).every((id) => id === "P3")).toBe(true);
    // turnaround = waiting + burst
    for (const pr of result.processes) {
      const spec = [
        { id: "P1", burst: 3 },
        { id: "P2", burst: 2 },
        { id: "P3", burst: 1 },
      ].find((p) => p.id === pr.id)!;
      expect(pr.turnaround).toBe(pr.waiting + spec.burst);
    }
  });

  it("handles idle gaps (P2 arrives after P1 finishes)", () => {
    const { result } = runScheduling(
      [
        { id: "P1", name: "P1", arrival: 0, burst: 2 },
        { id: "P2", name: "P2", arrival: 5, burst: 3 },
      ],
      "FCFS",
    );
    const p2 = result.processes.find((p) => p.id === "P2")!;
    expect(p2.waiting).toBe(0); // P2 waited 0 (CPU was idle before it)
    expect(p2.turnaround).toBe(3);
  });
});

describe("scheduling — SJF", () => {
  it("picks shortest first among concurrent arrivals", () => {
    const { steps } = runScheduling(
      [
        { id: "A", name: "A", arrival: 0, burst: 4 },
        { id: "B", name: "B", arrival: 0, burst: 2 },
        { id: "C", name: "C", arrival: 0, burst: 1 },
      ],
      "SJF",
    );
    const runningSeq = steps.map((s) => s.running).filter(Boolean);
    expect(runningSeq[0]).toBe("C");
    // B should come before A
    const bIdx = runningSeq.indexOf("B");
    const aIdx = runningSeq.indexOf("A");
    expect(bIdx).toBeLessThan(aIdx);
  });
});

describe("scheduling — RR", () => {
  it("rotates processes with quantum=2", () => {
    const { steps } = runScheduling(
      [
        { id: "P1", name: "P1", arrival: 0, burst: 4 },
        { id: "P2", name: "P2", arrival: 0, burst: 4 },
      ],
      "RR",
      2,
    );
    const running = steps.map((s) => s.running);
    // Should alternate: P1,P1,P2,P2,P1,P1,P2,P2
    expect(running[0]).toBe("P1");
    expect(running[1]).toBe("P1");
    expect(running[2]).toBe("P2");
    expect(running[3]).toBe("P2");
  });
});

describe("scheduling — MLFQ", () => {
  it("runs short process faster than long one (priority via queues)", () => {
    // P1 arrives at 0 with burst 10, P2 arrives at 0 with burst 1
    // Both start in Q0. P1 gets 1 unit, demoted. P2 gets 1 unit and finishes.
    const { result } = runScheduling(
      [
        { id: "P1", name: "P1", arrival: 0, burst: 10 },
        { id: "P2", name: "P2", arrival: 0, burst: 1 },
      ],
      "MLFQ",
    );
    const p2 = result.processes.find((p) => p.id === "P2")!;
    const p1 = result.processes.find((p) => p.id === "P1")!;
    // P2 (short) should finish faster than P1 (long)
    expect(p2.turnaround).toBeLessThan(p1.turnaround);
  });
});

// ---------------------------------------------------------------------------
// Scheduling: property tests
// ---------------------------------------------------------------------------

const processArb = fc
  .array(
    fc.record({
      id: fc.constantFrom("P1", "P2", "P3", "P4"),
      arrival: fc.integer({ min: 0, max: 5 }),
      burst: fc.integer({ min: 1, max: 6 }),
    }),
    { minLength: 1, maxLength: 4 },
  )
  .map((procs) => {
    // Deduplicate by id (last wins)
    const seen = new Map<
      string,
      { id: string; name: string; arrival: number; burst: number }
    >();
    for (const p of procs) {
      seen.set(p.id, {
        id: p.id,
        name: p.id,
        arrival: p.arrival,
        burst: p.burst,
      });
    }
    return [...seen.values()];
  })
  .filter((procs) => procs.length >= 1);

describe("scheduling — properties", () => {
  const algorithms: SchedulingAlgorithm[] = ["FCFS", "SJF", "RR", "MLFQ"];

  for (const alg of algorithms) {
    it(`${alg}: burst conservation (gantt count = burst for each process)`, () => {
      fc.assert(
        fc.property(processArb, (procs) => {
          const { steps } = runScheduling(procs, alg);
          const counts = new Map<string, number>();
          for (const step of steps) {
            if (step.running !== null) {
              counts.set(step.running, (counts.get(step.running) ?? 0) + 1);
            }
          }
          return procs.every((p) => counts.get(p.id) === p.burst);
        }),
        { numRuns: 50 },
      );
    });

    it(`${alg}: no process runs before arrival`, () => {
      fc.assert(
        fc.property(processArb, (procs) => {
          const { steps } = runScheduling(procs, alg);
          return steps.every((step) => {
            if (step.running === null) return true;
            const spec = procs.find((p) => p.id === step.running);
            return spec !== undefined && step.time >= spec.arrival;
          });
        }),
        { numRuns: 50 },
      );
    });

    it(`${alg}: work-conserving (no idle when ready processes exist)`, () => {
      fc.assert(
        fc.property(processArb, (procs) => {
          const { steps } = runScheduling(procs, alg);
          // Track which processes have finished at each step
          return steps.every((step) => {
            if (step.running !== null) return true;
            // Idle step: no ready process should exist
            const anyReady = procs.some(
              (p) => p.arrival <= step.time && !step.finished.includes(p.id),
            );
            return !anyReady;
          });
        }),
        { numRuns: 50 },
      );
    });

    it(`${alg}: turnaround = waiting + burst`, () => {
      fc.assert(
        fc.property(processArb, (procs) => {
          const { result } = runScheduling(procs, alg);
          return result.processes.every((pr) => {
            const spec = procs.find((p) => p.id === pr.id);
            if (!spec) return false;
            return pr.turnaround === pr.waiting + spec.burst;
          });
        }),
        { numRuns: 50 },
      );
    });
  }

  it("FCFS: completion order = arrival order (tie-breaking by input order)", () => {
    fc.assert(
      fc.property(processArb, (procs) => {
        // Sort by arrival, input order for ties
        const expectedOrder = [...procs]
          .sort((a, b) => a.arrival - b.arrival)
          .map((p) => p.id);
        const { result } = runScheduling(procs, "FCFS");
        // finished order in gantt
        const ganttOrder = result.gantt
          .filter((g) => g.id !== null)
          .map((g) => g.id as string);
        const actualFinishOrder: string[] = [];
        for (const id of ganttOrder) {
          if (!actualFinishOrder.includes(id)) {
            // first appearance = first time running
            // We detect finish by: last occurrence of an id in gantt
          }
        }
        // Verify the finish sequence from processes result
        // Each process's turnaround should be non-decreasing in arrival order
        // (FCFS: earlier arrival => finishes in same or earlier relative order)
        const procResults = result.processes;
        return expectedOrder.every((id, i) => {
          const pr = procResults.find((p) => p.id === id)!;
          if (i === 0) return true;
          const prevId = expectedOrder[i - 1]!;
          const prevPr = procResults.find((p) => p.id === prevId)!;
          // FCFS: each process starts after the previous finishes (or after arrival)
          // turnaround of later process >= turnaround of earlier process - burst difference
          // The key invariant: finish time is non-decreasing in arrival order
          const finishCurrent =
            pr.turnaround + procs.find((p) => p.id === id)!.arrival;
          const finishPrev =
            prevPr.turnaround + procs.find((p) => p.id === prevId)!.arrival;
          return finishCurrent >= finishPrev;
        });
      }),
      { numRuns: 50 },
    );
  });
});

// ---------------------------------------------------------------------------
// Paging: deterministic tests
// ---------------------------------------------------------------------------

describe("paging — FIFO", () => {
  it("classic 3-frame Belady example", () => {
    // Reference: 1,2,3,4,1,2,5,1,2,3,4,5 with 3 frames
    // Known fault count: 9
    const { result } = runPaging(
      [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5],
      3,
      "FIFO",
    );
    expect(result.faults).toBe(9);
    expect(result.hits).toBe(3);
  });
});

describe("paging — LRU", () => {
  it("classic 3-frame example", () => {
    // Reference: 1,2,3,4,1,2,5,1,2,3,4,5 with 3 frames → 10 faults, 2 hits
    const { result } = runPaging(
      [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5],
      3,
      "LRU",
    );
    expect(result.faults).toBe(10);
    expect(result.hits).toBe(2);
  });
});

describe("paging — Clock", () => {
  it("hits + faults = reference string length", () => {
    const { result } = runPaging([1, 2, 3, 1, 4, 2, 5], 3, "Clock");
    expect(result.hits + result.faults).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// Paging: property tests
// ---------------------------------------------------------------------------

const refStringArb = fc.array(fc.integer({ min: 0, max: 7 }), {
  minLength: 1,
  maxLength: 20,
});
const frameCountArb = fc.integer({ min: 1, max: 5 });

describe("paging — properties", () => {
  const pagingAlgs: PageAlgorithm[] = ["FIFO", "LRU", "Clock"];

  for (const alg of pagingAlgs) {
    it(`${alg}: hits + faults = access count`, () => {
      fc.assert(
        fc.property(refStringArb, frameCountArb, (refStr, frameCount) => {
          const { result } = runPaging(refStr, frameCount, alg);
          return result.hits + result.faults === refStr.length;
        }),
        { numRuns: 100 },
      );
    });

    it(`${alg}: no duplicate pages in frames`, () => {
      fc.assert(
        fc.property(refStringArb, frameCountArb, (refStr, frameCount) => {
          const { steps } = runPaging(refStr, frameCount, alg);
          return steps.every((step) => {
            const present = step.frames.filter((f) => f !== null);
            return present.length === new Set(present).size;
          });
        }),
        { numRuns: 100 },
      );
    });
  }

  it("FIFO: matches reference implementation", () => {
    fc.assert(
      fc.property(refStringArb, frameCountArb, (refStr, frameCount) => {
        const { result } = runPaging(refStr, frameCount, "FIFO");
        const ref = referenceFifo(refStr, frameCount);
        return result.hits === ref.hits && result.faults === ref.faults;
      }),
      { numRuns: 100 },
    );
  });

  it("LRU: matches reference implementation", () => {
    fc.assert(
      fc.property(refStringArb, frameCountArb, (refStr, frameCount) => {
        const { result } = runPaging(refStr, frameCount, "LRU");
        const ref = referenceLru(refStr, frameCount);
        return result.hits === ref.hits && result.faults === ref.faults;
      }),
      { numRuns: 100 },
    );
  });

  it("LRU: stack property — more frames never increases faults", () => {
    fc.assert(
      fc.property(
        refStringArb,
        fc.integer({ min: 1, max: 4 }),
        (refStr, frameCount) => {
          const { result: r1 } = runPaging(refStr, frameCount, "LRU");
          const { result: r2 } = runPaging(refStr, frameCount + 1, "LRU");
          return r2.faults <= r1.faults;
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Virtual address translation
// ---------------------------------------------------------------------------

describe("translateAddress", () => {
  it("decomposes address correctly", () => {
    // virtualAddr=13, pageSize=4 → pageNumber=3, offset=1
    const result = translateAddress(13, 4, [10, 11, 12, 5]);
    expect(result.pageNumber).toBe(3);
    expect(result.offset).toBe(1);
    expect(result.frameNumber).toBe(5);
    expect(result.physicalAddress).toBe(5 * 4 + 1); // 21
    expect(result.pageFault).toBe(false);
  });

  it("reports page fault when page not in table", () => {
    // page 2 not mapped
    const result = translateAddress(8, 4, [0, 1, null, 3]);
    expect(result.pageNumber).toBe(2);
    expect(result.pageFault).toBe(true);
    expect(result.physicalAddress).toBe(null);
  });
});
