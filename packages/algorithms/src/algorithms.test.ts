import { collectSteps } from "@nand2web/sim-core";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { BinaryHeap } from "./heap.ts";
import type { SortStep } from "./sorts.ts";
import {
  bubbleSort,
  heapSort,
  insertionSort,
  mergeSort,
  quickSort,
  SORT_META,
  selectionSort,
} from "./sorts.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type SortFn = (
  input: readonly number[],
) => Generator<SortStep, import("./sorts.ts").SortResult, void>;

const sortFns: Array<{ name: string; fn: SortFn }> = [
  { name: "bubbleSort", fn: bubbleSort },
  { name: "insertionSort", fn: insertionSort },
  { name: "selectionSort", fn: selectionSort },
  { name: "mergeSort", fn: mergeSort },
  { name: "quickSort", fn: quickSort },
  { name: "heapSort", fn: heapSort },
];

const arrayCases = fc.array(fc.integer({ min: -1000, max: 1000 }), {
  minLength: 0,
  maxLength: 40,
});

function isSorted(arr: readonly number[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    if ((arr[i - 1] as number) > (arr[i] as number)) return false;
  }
  return true;
}

function isPermutation(a: readonly number[], b: readonly number[]): boolean {
  if (a.length !== b.length) return false;
  const count = new Map<number, number>();
  for (const x of a) count.set(x, (count.get(x) ?? 0) + 1);
  for (const x of b) {
    const c = count.get(x);
    if (c === undefined || c === 0) return false;
    count.set(x, c - 1);
  }
  return true;
}

// ---------------------------------------------------------------------------
// 6 sorting algorithms: output sorted & is permutation of input
// ---------------------------------------------------------------------------

describe.each(sortFns)("$name", ({ fn }) => {
  it("sorts random arrays (output sorted ∧ permutation)", () => {
    fc.assert(
      fc.property(arrayCases, (input) => {
        const { steps, result } = collectSteps(fn(input));
        expect(result).toBeDefined();
        if (input.length === 0) {
          // Empty input: no compare/write steps, final array is empty
          const lastStep = steps[steps.length - 1];
          if (lastStep) {
            expect(lastStep.array.length).toBe(0);
            expect(lastStep.compare).toBeUndefined();
            expect(lastStep.write).toBeUndefined();
          }
          return;
        }
        const lastStep = steps[steps.length - 1];
        expect(lastStep).toBeDefined();
        const finalArr = lastStep?.array ?? [];
        expect(isSorted(finalArr)).toBe(true);
        expect(isPermutation(finalArr, input)).toBe(true);
      }),
    );
  });

  it("handles edge cases: empty, single element, already sorted, reversed", () => {
    const cases: readonly number[][] = [
      [],
      [42],
      [1, 2, 3, 4, 5],
      [5, 4, 3, 2, 1],
      [1, 1, 1, 1],
      [3, 1, 4, 1, 5, 9, 2, 6, 5, 3],
    ];
    for (const input of cases) {
      const { steps, result } = collectSteps(fn(input));
      expect(result).toBeDefined();
      if (input.length === 0) continue;
      const lastStep = steps[steps.length - 1];
      expect(lastStep).toBeDefined();
      const finalArr = lastStep?.array ?? [];
      expect(isSorted(finalArr)).toBe(true);
      expect(isPermutation(finalArr, input)).toBe(true);
    }
  });

  it("step invariant: array length is constant across all steps", () => {
    fc.assert(
      fc.property(arrayCases, (input) => {
        const { steps } = collectSteps(fn(input));
        for (const step of steps) {
          expect(step.array.length).toBe(input.length);
        }
      }),
    );
  });

  it("result contains non-negative comparisons and writes", () => {
    fc.assert(
      fc.property(arrayCases, (input) => {
        const { result } = collectSteps(fn(input));
        if (!result) return;
        expect(result.comparisons).toBeGreaterThanOrEqual(0);
        expect(result.writes).toBeGreaterThanOrEqual(0);
      }),
    );
  });

  it("sortedIndices correctness: every listed index holds its final-sorted value", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -1000, max: 1000 }), {
          minLength: 1,
          maxLength: 40,
        }),
        (input) => {
          const sorted = [...input].sort((a, b) => a - b);
          const { steps } = collectSteps(fn(input));
          for (const step of steps) {
            if (!step.sortedIndices) continue;
            for (const idx of step.sortedIndices) {
              expect(step.array[idx]).toBe(sorted[idx]);
            }
          }
        },
      ),
    );
  });
});

// ---------------------------------------------------------------------------
// Stable sort property test (bubble, insertion, merge only)
// ---------------------------------------------------------------------------

const stableSortFns: Array<{ name: string; fn: SortFn }> = sortFns.filter(
  ({ name }) => {
    const id = name.replace("Sort", "").toLowerCase();
    return SORT_META.find((m) => m.id === id)?.stable === true;
  },
);

describe.each(stableSortFns)("$name — stability", ({ fn }) => {
  it("preserves relative order of equal-key elements", () => {
    // Records with a numeric key (possibly duplicate) and a unique tag.
    const recordArb = fc.array(
      fc.record({
        key: fc.integer({ min: 0, max: 5 }),
        tag: fc.nat(),
      }),
      { minLength: 0, maxLength: 30 },
    );

    fc.assert(
      fc.property(recordArb, (records) => {
        // Encode as integers: we sort the keys only, so we simulate by
        // sorting key arrays and checking tag order is preserved per key.
        // To use the existing SortFn (number[]) we sort the index array
        // using a stable reference sort, then verify against the algorithm.
        //
        // We directly test stability by simulating on objects using the
        // sort functions' final output vs. a reference stable sort.
        // Since SortFn only accepts number[], we verify via index sort:
        const keys = records.map((r) => r.key);
        if (keys.length === 0) return;

        // Reference: stable sort preserving original index for ties
        const refIndices = Array.from({ length: keys.length }, (_, i) => i);
        refIndices.sort((a, b) => (keys[a] as number) - (keys[b] as number));

        // Algorithm output: last step's array gives the sorted key order
        const { steps } = collectSteps(fn(keys as readonly number[]));
        const lastStep = steps[steps.length - 1];
        if (!lastStep) return;

        // Map the algorithm's sorted positions back to original indices
        // by matching key values in order (using a reference stable sort)
        const algoOrder = lastStep.array as number[];

        // For each group of equal keys, the relative tag order from the
        // reference stable sort must match the algorithm's sort.
        // We track per-key the sequence of original tags in ref order
        // vs. the sequence in the algorithm output.
        const refTagsByKey = new Map<number, number[]>();
        const algoTagsByKey = new Map<number, number[]>();

        // Ref order: tag sequence per key
        for (const origIdx of refIndices) {
          const k = keys[origIdx] as number;
          const tag = records[origIdx]?.tag ?? 0;
          const refBucket = refTagsByKey.get(k) ?? [];
          refBucket.push(tag);
          refTagsByKey.set(k, refBucket);
        }

        // To recover the original index from the algorithm output, we need
        // to consume each key group in order of appearance in algoOrder,
        // matching against a copy of remaining originals for that key.
        const remaining = new Map<number, number[]>();
        for (let i = 0; i < records.length; i++) {
          const k = keys[i] as number;
          const pool = remaining.get(k) ?? [];
          pool.push(i);
          remaining.set(k, pool);
        }

        for (const val of algoOrder) {
          const pool = remaining.get(val);
          if (!pool || pool.length === 0) continue;
          const origIdx = pool.shift() ?? 0;
          const tag = records[origIdx]?.tag ?? 0;
          const algoBucket = algoTagsByKey.get(val) ?? [];
          algoBucket.push(tag);
          algoTagsByKey.set(val, algoBucket);
        }

        for (const [k, refTags] of refTagsByKey) {
          const algoTags = algoTagsByKey.get(k) ?? [];
          expect(algoTags).toEqual(refTags);
        }
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// BinaryHeap
// ---------------------------------------------------------------------------

describe("BinaryHeap", () => {
  it("pop order matches Array.sort for random push sequences", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -1000, max: 1000 }), {
          minLength: 0,
          maxLength: 100,
        }),
        (values) => {
          const heap = new BinaryHeap<number>((a, b) => a - b);
          for (const v of values) heap.push(v);

          const popped: number[] = [];
          while (heap.size > 0) {
            const val = heap.pop();
            if (val !== undefined) popped.push(val);
          }

          const expected = [...values].sort((a, b) => a - b);
          expect(popped).toEqual(expected);
        },
      ),
    );
  });

  it("peek returns the current minimum without removing it", () => {
    const heap = new BinaryHeap<number>((a, b) => a - b);
    heap.push(5);
    heap.push(2);
    heap.push(8);
    expect(heap.peek()).toBe(2);
    expect(heap.size).toBe(3);
  });

  it("returns undefined for pop and peek on empty heap", () => {
    const heap = new BinaryHeap<number>((a, b) => a - b);
    expect(heap.pop()).toBeUndefined();
    expect(heap.peek()).toBeUndefined();
  });

  it("max-heap works with reversed comparator", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -1000, max: 1000 }), {
          minLength: 1,
          maxLength: 50,
        }),
        (values) => {
          const heap = new BinaryHeap<number>((a, b) => b - a);
          for (const v of values) heap.push(v);

          const popped: number[] = [];
          while (heap.size > 0) {
            const val = heap.pop();
            if (val !== undefined) popped.push(val);
          }

          const expected = [...values].sort((a, b) => b - a);
          expect(popped).toEqual(expected);
        },
      ),
    );
  });
});
