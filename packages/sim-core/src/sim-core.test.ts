import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createRng, randomInt, shuffle } from "./random.ts";
import { collectSteps, foldSteps } from "./replay.ts";

function* countUp(n: number): Generator<number, string, void> {
  for (let i = 0; i < n; i++) {
    yield i;
  }
  return "done";
}

describe("collectSteps", () => {
  it("captures every step and the final result", () => {
    const { steps, result, truncated } = collectSteps(countUp(5));
    expect(steps).toEqual([0, 1, 2, 3, 4]);
    expect(result).toBe("done");
    expect(truncated).toBe(false);
  });

  it("truncates unbounded simulations at the limit", () => {
    function* forever(): Generator<number, void, void> {
      while (true) {
        yield 1;
      }
    }
    const { steps, result, truncated } = collectSteps(forever(), 100);
    expect(steps).toHaveLength(100);
    expect(result).toBeUndefined();
    expect(truncated).toBe(true);
  });

  it("collects exactly n steps for any n", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 500 }), (n) => {
        const { steps, truncated } = collectSteps(countUp(n));
        return steps.length === n && !truncated;
      }),
    );
  });
});

describe("foldSteps", () => {
  it("derives aggregates from step sequences", () => {
    const { steps } = collectSteps(countUp(10));
    const sum = foldSteps(steps, (acc, step) => acc + step, 0);
    expect(sum).toBe(45);
  });
});

describe("createRng", () => {
  it("is deterministic for a given seed", () => {
    fc.assert(
      fc.property(fc.integer(), (seed) => {
        const a = createRng(seed);
        const b = createRng(seed);
        for (let i = 0; i < 20; i++) {
          if (a() !== b()) return false;
        }
        return true;
      }),
    );
  });

  it("produces values in [0, 1)", () => {
    fc.assert(
      fc.property(fc.integer(), (seed) => {
        const rng = createRng(seed);
        for (let i = 0; i < 100; i++) {
          const v = rng();
          if (v < 0 || v >= 1) return false;
        }
        return true;
      }),
    );
  });
});

describe("randomInt", () => {
  it("stays within [min, max] inclusive", () => {
    fc.assert(
      fc.property(
        fc.integer(),
        fc.integer({ min: -100, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (seed, min, span) => {
          const rng = createRng(seed);
          const max = min + span;
          for (let i = 0; i < 50; i++) {
            const v = randomInt(rng, min, max);
            if (v < min || v > max || !Number.isInteger(v)) return false;
          }
          return true;
        },
      ),
    );
  });
});

describe("shuffle", () => {
  it("returns a permutation of the input", () => {
    fc.assert(
      fc.property(fc.integer(), fc.array(fc.integer()), (seed, items) => {
        const shuffled = shuffle(createRng(seed), items);
        return (
          shuffled.length === items.length &&
          [...shuffled].sort((a, b) => a - b).join(",") ===
            [...items].sort((a, b) => a - b).join(",")
        );
      }),
    );
  });

  it("does not mutate the input", () => {
    const input = [1, 2, 3, 4, 5];
    shuffle(createRng(42), input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});
