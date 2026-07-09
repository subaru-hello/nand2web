import type { Simulation, StepMeta } from "@nand2web/sim-core";

// ---------------------------------------------------------------------------
// Step type
// ---------------------------------------------------------------------------

export interface SortStep {
  /** Full array snapshot at this point in time. */
  readonly array: readonly number[];
  /** Pair of indices being compared. */
  readonly compare?: readonly [number, number];
  /** Element written to a position. */
  readonly write?: readonly {
    readonly index: number;
    readonly value: number;
  }[];
  /** Everything at index < sortedUpTo is in its final sorted position. */
  readonly sortedUpTo?: number;
  readonly meta: StepMeta;
}

export interface SortResult {
  readonly comparisons: number;
  readonly writes: number;
}

// ---------------------------------------------------------------------------
// Algorithm metadata
// ---------------------------------------------------------------------------

export interface SortMeta {
  readonly id: string;
  readonly name: string;
  readonly best: string;
  readonly average: string;
  readonly worst: string;
  readonly space: string;
  readonly stable: boolean;
  readonly inPlace: boolean;
}

export const SORT_META: readonly SortMeta[] = [
  {
    id: "bubble",
    name: "Bubble Sort",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: true,
    inPlace: true,
  },
  {
    id: "insertion",
    name: "Insertion Sort",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: true,
    inPlace: true,
  },
  {
    id: "selection",
    name: "Selection Sort",
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: false,
    inPlace: true,
  },
  {
    id: "merge",
    name: "Merge Sort",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
    stable: true,
    inPlace: false,
  },
  {
    id: "quick",
    name: "Quick Sort",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",
    stable: false,
    inPlace: true,
  },
  {
    id: "heap",
    name: "Heap Sort",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(1)",
    stable: false,
    inPlace: true,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Emit a compare step, incrementing the counter. */
function* emitCompare(
  arr: number[],
  i: number,
  j: number,
  label: string,
  comparisons: { n: number },
  sortedUpTo?: number,
): Generator<SortStep, void, void> {
  comparisons.n++;
  yield {
    array: [...arr],
    compare: [i, j],
    ...(sortedUpTo !== undefined ? { sortedUpTo } : {}),
    meta: { label, highlights: [String(i), String(j)] },
  };
}

/** Emit a write step (one or two positions updated). */
function* emitWrite(
  arr: number[],
  writes: readonly { index: number; value: number }[],
  label: string,
  writeCounter: { n: number },
  sortedUpTo?: number,
): Generator<SortStep, void, void> {
  writeCounter.n += writes.length;
  for (const w of writes) {
    arr[w.index] = w.value;
  }
  yield {
    array: [...arr],
    write: writes,
    ...(sortedUpTo !== undefined ? { sortedUpTo } : {}),
    meta: {
      label,
      highlights: writes.map((w) => String(w.index)),
    },
  };
}

// ---------------------------------------------------------------------------
// Bubble Sort
// ---------------------------------------------------------------------------

export function* bubbleSort(
  input: readonly number[],
): Simulation<SortStep, SortResult> {
  const arr = [...input];
  const n = arr.length;
  const cmp = { n: 0 };
  const wrt = { n: 0 };

  for (let pass = 0; pass < n - 1; pass++) {
    let swapped = false;
    for (let i = 0; i < n - 1 - pass; i++) {
      yield* emitCompare(
        arr,
        i,
        i + 1,
        `Compare [${i}] and [${i + 1}]`,
        cmp,
        n - pass,
      );
      if ((arr[i] as number) > (arr[i + 1] as number)) {
        const a = arr[i] as number;
        const b = arr[i + 1] as number;
        yield* emitWrite(
          arr,
          [
            { index: i, value: b },
            { index: i + 1, value: a },
          ],
          `Swap [${i}] ↔ [${i + 1}]`,
          wrt,
          n - pass,
        );
        swapped = true;
      }
    }
    if (!swapped) break;
  }

  // Final state — fully sorted
  yield { array: [...arr], sortedUpTo: n, meta: { label: "Sorted" } };
  return { comparisons: cmp.n, writes: wrt.n };
}

// ---------------------------------------------------------------------------
// Insertion Sort
// ---------------------------------------------------------------------------

export function* insertionSort(
  input: readonly number[],
): Simulation<SortStep, SortResult> {
  const arr = [...input];
  const n = arr.length;
  const cmp = { n: 0 };
  const wrt = { n: 0 };

  for (let i = 1; i < n; i++) {
    const key = arr[i] as number;
    let j = i - 1;
    while (j >= 0) {
      yield* emitCompare(arr, j, i, `Compare [${j}] and key ${key}`, cmp, i);
      if ((arr[j] as number) > key) {
        yield* emitWrite(
          arr,
          [{ index: j + 1, value: arr[j] as number }],
          `Shift [${j}] right`,
          wrt,
          i,
        );
        j--;
      } else {
        break;
      }
    }
    yield* emitWrite(
      arr,
      [{ index: j + 1, value: key }],
      `Insert key ${key} at [${j + 1}]`,
      wrt,
      i + 1,
    );
  }

  yield { array: [...arr], sortedUpTo: n, meta: { label: "Sorted" } };
  return { comparisons: cmp.n, writes: wrt.n };
}

// ---------------------------------------------------------------------------
// Selection Sort
// ---------------------------------------------------------------------------

export function* selectionSort(
  input: readonly number[],
): Simulation<SortStep, SortResult> {
  const arr = [...input];
  const n = arr.length;
  const cmp = { n: 0 };
  const wrt = { n: 0 };

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield* emitCompare(
        arr,
        j,
        minIdx,
        `Compare [${j}] and min [${minIdx}]`,
        cmp,
        i,
      );
      if ((arr[j] as number) < (arr[minIdx] as number)) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      const a = arr[i] as number;
      const b = arr[minIdx] as number;
      yield* emitWrite(
        arr,
        [
          { index: i, value: b },
          { index: minIdx, value: a },
        ],
        `Swap min [${minIdx}] to [${i}]`,
        wrt,
        i + 1,
      );
    } else {
      // No swap needed but position is now settled — emit a step showing it
      yield {
        array: [...arr],
        sortedUpTo: i + 1,
        meta: { label: `[${i}] already minimum`, highlights: [String(i)] },
      };
    }
  }

  yield { array: [...arr], sortedUpTo: n, meta: { label: "Sorted" } };
  return { comparisons: cmp.n, writes: wrt.n };
}

// ---------------------------------------------------------------------------
// Merge Sort
// ---------------------------------------------------------------------------

export function* mergeSort(
  input: readonly number[],
): Simulation<SortStep, SortResult> {
  const arr = [...input];
  const cmp = { n: 0 };
  const wrt = { n: 0 };

  yield* mergeSortRange(arr, 0, arr.length - 1, cmp, wrt);

  yield { array: [...arr], sortedUpTo: arr.length, meta: { label: "Sorted" } };
  return { comparisons: cmp.n, writes: wrt.n };
}

function* mergeSortRange(
  arr: number[],
  lo: number,
  hi: number,
  cmp: { n: number },
  wrt: { n: number },
): Generator<SortStep, void, void> {
  if (lo >= hi) return;
  const mid = (lo + hi) >> 1;
  yield* mergeSortRange(arr, lo, mid, cmp, wrt);
  yield* mergeSortRange(arr, mid + 1, hi, cmp, wrt);
  yield* merge(arr, lo, mid, hi, cmp, wrt);
}

function* merge(
  arr: number[],
  lo: number,
  mid: number,
  hi: number,
  cmp: { n: number },
  wrt: { n: number },
): Generator<SortStep, void, void> {
  const left = arr.slice(lo, mid + 1);
  const right = arr.slice(mid + 1, hi + 1);
  let i = 0;
  let j = 0;
  let k = lo;

  while (i < left.length && j < right.length) {
    const li = left[i] as number;
    const rj = right[j] as number;
    cmp.n++;
    yield {
      array: [...arr],
      compare: [lo + i, mid + 1 + j],
      meta: {
        label: `Merge: compare ${li} and ${rj}`,
        highlights: [String(lo + i), String(mid + 1 + j)],
      },
    };
    if (li <= rj) {
      yield* emitWrite(
        arr,
        [{ index: k, value: li }],
        `Write ${li} to [${k}]`,
        wrt,
      );
      i++;
    } else {
      yield* emitWrite(
        arr,
        [{ index: k, value: rj }],
        `Write ${rj} to [${k}]`,
        wrt,
      );
      j++;
    }
    k++;
  }

  while (i < left.length) {
    const li = left[i] as number;
    yield* emitWrite(
      arr,
      [{ index: k, value: li }],
      `Write ${li} to [${k}]`,
      wrt,
    );
    i++;
    k++;
  }

  while (j < right.length) {
    const rj = right[j] as number;
    yield* emitWrite(
      arr,
      [{ index: k, value: rj }],
      `Write ${rj} to [${k}]`,
      wrt,
    );
    j++;
    k++;
  }
}

// ---------------------------------------------------------------------------
// Quick Sort
// ---------------------------------------------------------------------------

export function* quickSort(
  input: readonly number[],
): Simulation<SortStep, SortResult> {
  const arr = [...input];
  const cmp = { n: 0 };
  const wrt = { n: 0 };

  yield* quickSortRange(arr, 0, arr.length - 1, cmp, wrt);

  yield { array: [...arr], sortedUpTo: arr.length, meta: { label: "Sorted" } };
  return { comparisons: cmp.n, writes: wrt.n };
}

function* quickSortRange(
  arr: number[],
  lo: number,
  hi: number,
  cmp: { n: number },
  wrt: { n: number },
): Generator<SortStep, void, void> {
  if (lo >= hi) return;
  const pivotIdx = yield* partition(arr, lo, hi, cmp, wrt);
  yield* quickSortRange(arr, lo, pivotIdx - 1, cmp, wrt);
  yield* quickSortRange(arr, pivotIdx + 1, hi, cmp, wrt);
}

function* partition(
  arr: number[],
  lo: number,
  hi: number,
  cmp: { n: number },
  wrt: { n: number },
): Generator<SortStep, number, void> {
  // Median-of-three pivot selection to avoid worst-case on sorted input
  const mid = (lo + hi) >> 1;
  if ((arr[mid] as number) < (arr[lo] as number)) {
    const a = arr[lo] as number;
    const b = arr[mid] as number;
    yield* emitWrite(
      arr,
      [
        { index: lo, value: b },
        { index: mid, value: a },
      ],
      `Median pivot: swap [${lo}] ↔ [${mid}]`,
      wrt,
    );
  }
  if ((arr[hi] as number) < (arr[lo] as number)) {
    const a = arr[lo] as number;
    const b = arr[hi] as number;
    yield* emitWrite(
      arr,
      [
        { index: lo, value: b },
        { index: hi, value: a },
      ],
      `Median pivot: swap [${lo}] ↔ [${hi}]`,
      wrt,
    );
  }
  if ((arr[mid] as number) < (arr[hi] as number)) {
    const a = arr[mid] as number;
    const b = arr[hi] as number;
    yield* emitWrite(
      arr,
      [
        { index: mid, value: b },
        { index: hi, value: a },
      ],
      `Median pivot: swap [${mid}] ↔ [${hi}]`,
      wrt,
    );
  }
  // Pivot is now at hi
  const pivot = arr[hi] as number;
  let storeIdx = lo;

  for (let i = lo; i < hi; i++) {
    yield* emitCompare(
      arr,
      i,
      hi,
      `Compare [${i}]=${arr[i]} with pivot ${pivot}`,
      cmp,
    );
    if ((arr[i] as number) <= pivot) {
      if (storeIdx !== i) {
        const a = arr[storeIdx] as number;
        const b = arr[i] as number;
        yield* emitWrite(
          arr,
          [
            { index: storeIdx, value: b },
            { index: i, value: a },
          ],
          `Swap [${storeIdx}] ↔ [${i}]`,
          wrt,
        );
      }
      storeIdx++;
    }
  }

  // Place pivot
  if (storeIdx !== hi) {
    const a = arr[storeIdx] as number;
    const b = arr[hi] as number;
    yield* emitWrite(
      arr,
      [
        { index: storeIdx, value: b },
        { index: hi, value: a },
      ],
      `Place pivot ${pivot} at [${storeIdx}]`,
      wrt,
    );
  }

  return storeIdx;
}

// ---------------------------------------------------------------------------
// Heap Sort
// ---------------------------------------------------------------------------

export function* heapSort(
  input: readonly number[],
): Simulation<SortStep, SortResult> {
  const arr = [...input];
  const n = arr.length;
  const cmp = { n: 0 };
  const wrt = { n: 0 };

  // Build max-heap in place (Floyd's algorithm)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapSiftDown(arr, i, n, cmp, wrt);
  }

  // Extract elements
  for (let end = n - 1; end > 0; end--) {
    // Swap root (max) with last unsorted element
    const rootVal = arr[0] as number;
    const endVal = arr[end] as number;
    yield* emitWrite(
      arr,
      [
        { index: 0, value: endVal },
        { index: end, value: rootVal },
      ],
      `Place max ${rootVal} at [${end}]`,
      wrt,
      end + 1,
    );
    yield* heapSiftDown(arr, 0, end, cmp, wrt);
  }

  yield { array: [...arr], sortedUpTo: n, meta: { label: "Sorted" } };
  return { comparisons: cmp.n, writes: wrt.n };
}

function* heapSiftDown(
  arr: number[],
  root: number,
  heapSize: number,
  cmp: { n: number },
  wrt: { n: number },
): Generator<SortStep, void, void> {
  let i = root;
  for (;;) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let largest = i;

    if (left < heapSize) {
      cmp.n++;
      yield {
        array: [...arr],
        compare: [left, largest],
        meta: {
          label: `Sift: compare [${left}] and [${largest}]`,
          highlights: [String(left), String(largest)],
        },
      };
      if ((arr[left] as number) > (arr[largest] as number)) {
        largest = left;
      }
    }
    if (right < heapSize) {
      cmp.n++;
      yield {
        array: [...arr],
        compare: [right, largest],
        meta: {
          label: `Sift: compare [${right}] and [${largest}]`,
          highlights: [String(right), String(largest)],
        },
      };
      if ((arr[right] as number) > (arr[largest] as number)) {
        largest = right;
      }
    }

    if (largest === i) break;

    const a = arr[i] as number;
    const b = arr[largest] as number;
    yield* emitWrite(
      arr,
      [
        { index: i, value: b },
        { index: largest, value: a },
      ],
      `Sift: swap [${i}] ↔ [${largest}]`,
      wrt,
    );
    i = largest;
  }
}
