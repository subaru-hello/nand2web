import type { Simulation, StepMeta } from "@nand2web/sim-core";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SchedulingAlgorithm = "FCFS" | "SJF" | "RR" | "MLFQ";

export interface ProcessSpec {
  readonly id: string;
  readonly name: string;
  readonly arrival: number;
  readonly burst: number;
}

export interface SchedulingInput {
  readonly processes: readonly ProcessSpec[];
  readonly algorithm: SchedulingAlgorithm;
  /** Quantum for RR (default 2). MLFQ uses its own fixed quanta. */
  readonly quantum?: number;
}

export interface SchedulingStep {
  /** Current time (start of this time unit). */
  readonly time: number;
  /** Process id running this unit, or null if idle. */
  readonly running: string | null;
  /** Ready queue ids (for MLFQ: q0 = highest priority). */
  readonly readyQueue: readonly string[];
  /** MLFQ sub-queues by level (index 0 = highest priority). */
  readonly mlfqQueues?: readonly (readonly string[])[];
  /** Ids of completed processes so far. */
  readonly finished: readonly string[];
  readonly meta: StepMeta;
}

export interface ProcessResult {
  readonly id: string;
  readonly waiting: number;
  readonly turnaround: number;
  readonly response: number;
}

export interface GanttEntry {
  readonly time: number;
  readonly id: string | null; // null = idle
}

export interface SchedulingResult {
  readonly processes: readonly ProcessResult[];
  readonly avgWaiting: number;
  readonly avgTurnaround: number;
  readonly gantt: readonly GanttEntry[];
}

// ---------------------------------------------------------------------------
// Algorithm metadata (for comparison table)
// ---------------------------------------------------------------------------

export interface AlgorithmMeta {
  readonly id: SchedulingAlgorithm;
  readonly preemptive: boolean;
  readonly starvation: boolean;
  readonly description: string;
}

export const ALGORITHM_META: readonly AlgorithmMeta[] = [
  {
    id: "FCFS",
    preemptive: false,
    starvation: false,
    description: "First-Come, First-Served — simple FIFO, no preemption.",
  },
  {
    id: "SJF",
    preemptive: false,
    starvation: true,
    description:
      "Shortest-Job-First (non-preemptive) — optimal average waiting time, but long jobs may starve.",
  },
  {
    id: "RR",
    preemptive: true,
    starvation: false,
    description:
      "Round-Robin — each process gets a fixed quantum before being rotated out.",
  },
  {
    id: "MLFQ",
    preemptive: true,
    starvation: false,
    description:
      "Multi-Level Feedback Queue — 3 queues with doubling quanta; priority boost prevents starvation.",
  },
];

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

interface MutableProc {
  id: string;
  remaining: number;
  arrival: number;
  burst: number;
  /** First time unit the process actually ran (response time). */
  firstRun: number | null;
  finishTime: number | null;
}

function buildProcs(specs: readonly ProcessSpec[]): MutableProc[] {
  return specs.map((p) => ({
    id: p.id,
    remaining: p.burst,
    arrival: p.arrival,
    burst: p.burst,
    firstRun: null,
    finishTime: null,
  }));
}

function computeResults(
  procs: MutableProc[],
  gantt: GanttEntry[],
): SchedulingResult {
  const results: ProcessResult[] = procs.map((p) => {
    const finish = p.finishTime ?? 0;
    const turnaround = finish - p.arrival;
    const waiting = turnaround - p.burst;
    const response = (p.firstRun ?? finish) - p.arrival;
    return { id: p.id, waiting, turnaround, response };
  });
  const n = results.length;
  const avgWaiting =
    n === 0 ? 0 : results.reduce((s, r) => s + r.waiting, 0) / n;
  const avgTurnaround =
    n === 0 ? 0 : results.reduce((s, r) => s + r.turnaround, 0) / n;
  return { processes: results, avgWaiting, avgTurnaround, gantt };
}

// ---------------------------------------------------------------------------
// FCFS
// ---------------------------------------------------------------------------

function* fcfs(
  input: SchedulingInput,
): Simulation<SchedulingStep, SchedulingResult> {
  const procs = buildProcs(input.processes);
  // Sort by arrival, then input order (stable).
  const order = [...procs].sort((a, b) => a.arrival - b.arrival);
  const finished: string[] = [];
  const gantt: GanttEntry[] = [];
  let time = 0;

  for (const proc of order) {
    // Idle gap
    if (time < proc.arrival) {
      while (time < proc.arrival) {
        const readyQueue = order
          .filter(
            (p) => p.arrival <= time && p.finishTime === null && p !== proc,
          )
          .map((p) => p.id);
        const step: SchedulingStep = {
          time,
          running: null,
          readyQueue,
          finished: [...finished],
          meta: { label: `t=${time}: idle` },
        };
        gantt.push({ time, id: null });
        yield step;
        time++;
      }
    }

    proc.firstRun = time;
    while (proc.remaining > 0) {
      const readyQueue = order
        .filter((p) => p.arrival <= time && p.finishTime === null && p !== proc)
        .map((p) => p.id);
      const step: SchedulingStep = {
        time,
        running: proc.id,
        readyQueue,
        finished: [...finished],
        meta: { label: `t=${time}: running ${proc.id}`, highlights: [proc.id] },
      };
      gantt.push({ time, id: proc.id });
      yield step;
      proc.remaining--;
      time++;
    }
    proc.finishTime = time;
    finished.push(proc.id);
  }

  return computeResults(procs, gantt);
}

// ---------------------------------------------------------------------------
// SJF (non-preemptive)
// ---------------------------------------------------------------------------

function* sjf(
  input: SchedulingInput,
): Simulation<SchedulingStep, SchedulingResult> {
  const procs = buildProcs(input.processes);
  const done = new Set<string>();
  const finished: string[] = [];
  const gantt: GanttEntry[] = [];
  let time = 0;
  const total = procs.length;

  while (finished.length < total) {
    // Collect arrived and not-done processes
    const ready = procs.filter((p) => p.arrival <= time && !done.has(p.id));
    if (ready.length === 0) {
      // Idle
      gantt.push({ time, id: null });
      yield {
        time,
        running: null,
        readyQueue: [],
        finished: [...finished],
        meta: { label: `t=${time}: idle` },
      };
      time++;
      continue;
    }

    // Pick shortest burst among ready
    const proc = ready.reduce((best, p) => (p.burst < best.burst ? p : best));
    proc.firstRun = time;

    while (proc.remaining > 0) {
      const readyQueue = procs
        .filter((p) => p.arrival <= time && !done.has(p.id) && p !== proc)
        .map((p) => p.id);
      gantt.push({ time, id: proc.id });
      yield {
        time,
        running: proc.id,
        readyQueue,
        finished: [...finished],
        meta: { label: `t=${time}: running ${proc.id}`, highlights: [proc.id] },
      };
      proc.remaining--;
      time++;
    }
    proc.finishTime = time;
    done.add(proc.id);
    finished.push(proc.id);
  }

  return computeResults(procs, gantt);
}

// ---------------------------------------------------------------------------
// Round-Robin
// ---------------------------------------------------------------------------

function* rr(
  input: SchedulingInput,
): Simulation<SchedulingStep, SchedulingResult> {
  const quantum = input.quantum ?? 2;
  const procs = buildProcs(input.processes);
  const done = new Set<string>();
  const finished: string[] = [];
  const gantt: GanttEntry[] = [];
  let time = 0;
  const total = procs.length;

  // Order by arrival for initial queue population (stable)
  const byArrival = [...procs].sort((a, b) => a.arrival - b.arrival || 0);
  const queue: MutableProc[] = [];
  let nextArrivalIdx = 0;

  const enqueueArrivals = (t: number) => {
    while (
      nextArrivalIdx < byArrival.length &&
      (byArrival[nextArrivalIdx]?.arrival ?? Infinity) <= t
    ) {
      const p = byArrival[nextArrivalIdx];
      if (p !== undefined) queue.push(p);
      nextArrivalIdx++;
    }
  };

  enqueueArrivals(0);

  while (finished.length < total) {
    if (queue.length === 0) {
      // Idle
      gantt.push({ time, id: null });
      yield {
        time,
        running: null,
        readyQueue: [],
        finished: [...finished],
        meta: { label: `t=${time}: idle` },
      };
      time++;
      enqueueArrivals(time);
      continue;
    }

    const proc = queue.shift()!;
    proc.firstRun ??= time;
    const slice = Math.min(quantum, proc.remaining);

    for (let q = 0; q < slice; q++) {
      enqueueArrivals(time);
      const readyQueue = queue.map((p) => p.id);
      gantt.push({ time, id: proc.id });
      yield {
        time,
        running: proc.id,
        readyQueue,
        finished: [...finished],
        meta: {
          label: `t=${time}: running ${proc.id} (${q + 1}/${slice})`,
          highlights: [proc.id],
        },
      };
      proc.remaining--;
      time++;
      enqueueArrivals(time);
    }

    if (proc.remaining > 0) {
      queue.push(proc);
    } else {
      proc.finishTime = time;
      done.add(proc.id);
      finished.push(proc.id);
    }
  }

  return computeResults(procs, gantt);
}

// ---------------------------------------------------------------------------
// MLFQ (3 queues, quanta [1,2,4], periodic priority boost)
// ---------------------------------------------------------------------------

const MLFQ_QUANTA = [1, 2, 4] as const;
const MLFQ_BOOST_INTERVAL = 10;

function* mlfq(
  input: SchedulingInput,
): Simulation<SchedulingStep, SchedulingResult> {
  const procs = buildProcs(input.processes);
  const done = new Set<string>();
  const finished: string[] = [];
  const gantt: GanttEntry[] = [];
  let time = 0;
  const total = procs.length;

  // Per-proc queue level
  const level = new Map<string, number>(procs.map((p) => [p.id, 0]));
  // Three queues
  const queues: MutableProc[][] = [[], [], []];

  const byArrival = [...procs].sort((a, b) => a.arrival - b.arrival);
  let nextArrivalIdx = 0;

  const enqueueArrivals = (t: number) => {
    while (
      nextArrivalIdx < byArrival.length &&
      (byArrival[nextArrivalIdx]?.arrival ?? Infinity) <= t
    ) {
      const p = byArrival[nextArrivalIdx];
      if (p !== undefined) {
        queues[0]!.push(p);
        level.set(p.id, 0);
      }
      nextArrivalIdx++;
    }
  };

  const priorityBoost = () => {
    for (let lvl = 1; lvl < 3; lvl++) {
      const q = queues[lvl];
      if (q !== undefined) {
        while (q.length > 0) {
          const p = q.shift()!;
          queues[0]!.push(p);
          level.set(p.id, 0);
        }
      }
    }
  };

  enqueueArrivals(0);
  let lastBoost = 0;

  while (finished.length < total) {
    // Priority boost
    if (time > lastBoost && time - lastBoost >= MLFQ_BOOST_INTERVAL) {
      priorityBoost();
      lastBoost = time;
    }

    // Find highest-priority non-empty queue
    let chosenQueue: MutableProc[] | undefined;
    let chosenLevel = 0;
    for (let lvl = 0; lvl < 3; lvl++) {
      const q = queues[lvl];
      if (q !== undefined && q.length > 0) {
        chosenQueue = q;
        chosenLevel = lvl;
        break;
      }
    }

    if (chosenQueue === undefined) {
      // Idle
      gantt.push({ time, id: null });
      yield {
        time,
        running: null,
        readyQueue: queues.flat().map((p) => p.id),
        mlfqQueues: queues.map((q) => q.map((p) => p.id)),
        finished: [...finished],
        meta: { label: `t=${time}: idle` },
      };
      time++;
      enqueueArrivals(time);
      continue;
    }

    const proc = chosenQueue.shift()!;
    proc.firstRun ??= time;
    const quantum = MLFQ_QUANTA[chosenLevel] ?? 1;
    let usedQuantum = 0;

    for (let q = 0; q < quantum && proc.remaining > 0; q++) {
      enqueueArrivals(time);
      // Boost check mid-slice
      if (time > lastBoost && time - lastBoost >= MLFQ_BOOST_INTERVAL) {
        // Put proc back and boost
        const lvl = level.get(proc.id) ?? 0;
        queues[lvl]!.unshift(proc);
        priorityBoost();
        lastBoost = time;
        // Restart outer loop
        break;
      }

      gantt.push({ time, id: proc.id });
      yield {
        time,
        running: proc.id,
        readyQueue: queues.flat().map((p) => p.id),
        mlfqQueues: queues.map((q2) => q2.map((p) => p.id)),
        finished: [...finished],
        meta: {
          label: `t=${time}: running ${proc.id} Q${chosenLevel} (${q + 1}/${quantum})`,
          highlights: [proc.id],
        },
      };
      proc.remaining--;
      time++;
      usedQuantum++;
      enqueueArrivals(time);
    }

    if (proc.remaining <= 0) {
      proc.finishTime = time;
      done.add(proc.id);
      finished.push(proc.id);
    } else if (usedQuantum >= quantum) {
      // Demote to next queue
      const newLevel = Math.min(chosenLevel + 1, 2);
      level.set(proc.id, newLevel);
      queues[newLevel]!.push(proc);
    }
    // If boost interrupted, proc was already put back above
  }

  return computeResults(procs, gantt);
}

// ---------------------------------------------------------------------------
// Public factory
// ---------------------------------------------------------------------------

export function simulate(
  input: SchedulingInput,
): Simulation<SchedulingStep, SchedulingResult> {
  switch (input.algorithm) {
    case "FCFS":
      return fcfs(input);
    case "SJF":
      return sjf(input);
    case "RR":
      return rr(input);
    case "MLFQ":
      return mlfq(input);
  }
}

// ---------------------------------------------------------------------------
// Preset workloads
// ---------------------------------------------------------------------------

export interface ProcessPreset {
  readonly id: string;
  readonly name: string;
  readonly processes: readonly ProcessSpec[];
}

export const PROCESS_PRESETS: readonly ProcessPreset[] = [
  {
    id: "classic",
    name: "Classic",
    processes: [
      { id: "P1", name: "P1", arrival: 0, burst: 6 },
      { id: "P2", name: "P2", arrival: 2, burst: 4 },
      { id: "P3", name: "P3", arrival: 4, burst: 2 },
    ],
  },
  {
    id: "starvation",
    name: "Starvation demo",
    processes: [
      { id: "P1", name: "P1", arrival: 0, burst: 1 },
      { id: "P2", name: "P2", arrival: 1, burst: 8 },
      { id: "P3", name: "P3", arrival: 1, burst: 1 },
      { id: "P4", name: "P4", arrival: 1, burst: 1 },
    ],
  },
  {
    id: "burst-mix",
    name: "Burst mix",
    processes: [
      { id: "P1", name: "P1", arrival: 0, burst: 8 },
      { id: "P2", name: "P2", arrival: 0, burst: 4 },
      { id: "P3", name: "P3", arrival: 0, burst: 2 },
      { id: "P4", name: "P4", arrival: 3, burst: 1 },
      { id: "P5", name: "P5", arrival: 6, burst: 3 },
    ],
  },
];
