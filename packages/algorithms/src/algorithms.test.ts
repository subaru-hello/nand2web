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
        // Last step's array should be sorted
        const lastStep = steps[steps.length - 1];
        if (input.length === 0) {
          expect(steps.length).toBeGreaterThanOrEqual(0);
          return;
        }
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
