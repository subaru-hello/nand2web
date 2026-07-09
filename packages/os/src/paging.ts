import type { Simulation, StepMeta } from "@nand2web/sim-core";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PageAlgorithm = "FIFO" | "LRU" | "Clock";

export interface PagingInput {
  readonly referenceString: readonly number[];
  readonly frameCount: number;
  readonly algorithm: PageAlgorithm;
}

export interface PagingStep {
  /** Page being accessed. */
  readonly access: number;
  /** Whether this access was a hit. */
  readonly hit: boolean;
  /** Current frame contents (null = empty). */
  readonly frames: readonly (number | null)[];
  /** Page evicted this step, if any. */
  readonly evicted?: number;
  /** Clock hand position (Clock algorithm only). */
  readonly clockHand?: number;
  /** Use bits (Clock algorithm only). */
  readonly useBits?: readonly boolean[];
  readonly meta: StepMeta;
}

export interface PagingResult {
  readonly hits: number;
  readonly faults: number;
}

// ---------------------------------------------------------------------------
// FIFO
// ---------------------------------------------------------------------------

function* fifo(input: PagingInput): Simulation<PagingStep, PagingResult> {
  const { referenceString, frameCount } = input;
  const frames: (number | null)[] = Array<number | null>(frameCount).fill(null);
  let hits = 0;
  let faults = 0;
  const fifoQueue: number[] = []; // tracks insertion order (oldest first)

  for (let i = 0; i < referenceString.length; i++) {
    const page = referenceString[i] ?? 0;
    const inFrames = frames.includes(page);

    let evicted: number | undefined;
    if (inFrames) {
      hits++;
    } else {
      faults++;
      const emptyIdx = frames.indexOf(null);
      if (emptyIdx !== -1) {
        frames[emptyIdx] = page;
        fifoQueue.push(page);
      } else {
        // Evict oldest
        const victim = fifoQueue.shift()!;
        evicted = victim;
        const idx = frames.indexOf(victim);
        frames[idx] = page;
        fifoQueue.push(page);
      }
    }

    yield {
      access: page,
      hit: inFrames,
      frames: [...frames],
      ...(evicted !== undefined ? { evicted } : {}),
      meta: {
        label: `access ${page}: ${inFrames ? "HIT" : "FAULT"}${evicted !== undefined ? ` (evict ${evicted})` : ""}`,
        highlights: [String(page)],
      },
    };
  }

  return { hits, faults };
}

// ---------------------------------------------------------------------------
// LRU
// ---------------------------------------------------------------------------

function* lru(input: PagingInput): Simulation<PagingStep, PagingResult> {
  const { referenceString, frameCount } = input;
  const frames: (number | null)[] = Array<number | null>(frameCount).fill(null);
  let hits = 0;
  let faults = 0;
  // Tracks recency: index 0 = least recently used
  const lruOrder: number[] = [];

  for (let i = 0; i < referenceString.length; i++) {
    const page = referenceString[i] ?? 0;
    const inFrames = frames.includes(page);

    let evicted: number | undefined;
    if (inFrames) {
      hits++;
      // Move to most-recent end
      const lruIdx = lruOrder.indexOf(page);
      if (lruIdx !== -1) lruOrder.splice(lruIdx, 1);
      lruOrder.push(page);
    } else {
      faults++;
      const emptyIdx = frames.indexOf(null);
      if (emptyIdx !== -1) {
        frames[emptyIdx] = page;
        lruOrder.push(page);
      } else {
        // Evict least recently used
        const victim = lruOrder.shift()!;
        evicted = victim;
        const idx = frames.indexOf(victim);
        frames[idx] = page;
        lruOrder.push(page);
      }
    }

    yield {
      access: page,
      hit: inFrames,
      frames: [...frames],
      ...(evicted !== undefined ? { evicted } : {}),
      meta: {
        label: `access ${page}: ${inFrames ? "HIT" : "FAULT"}${evicted !== undefined ? ` (evict ${evicted})` : ""}`,
        highlights: [String(page)],
      },
    };
  }

  return { hits, faults };
}

// ---------------------------------------------------------------------------
// Clock (second-chance)
// ---------------------------------------------------------------------------

function* clock(input: PagingInput): Simulation<PagingStep, PagingResult> {
  const { referenceString, frameCount } = input;
  const frames: (number | null)[] = Array<number | null>(frameCount).fill(null);
  const useBits: boolean[] = Array<boolean>(frameCount).fill(false);
  let hits = 0;
  let faults = 0;
  let hand = 0;

  for (let i = 0; i < referenceString.length; i++) {
    const page = referenceString[i] ?? 0;
    const frameIdx = frames.indexOf(page);
    const inFrames = frameIdx !== -1;

    let evicted: number | undefined;
    if (inFrames) {
      hits++;
      useBits[frameIdx] = true;
    } else {
      faults++;
      const emptyIdx = frames.indexOf(null);
      if (emptyIdx !== -1) {
        frames[emptyIdx] = page;
        useBits[emptyIdx] = true;
        hand = (emptyIdx + 1) % frameCount;
      } else {
        // Advance hand to find victim
        while (useBits[hand]) {
          useBits[hand] = false;
          hand = (hand + 1) % frameCount;
        }
        evicted = frames[hand] ?? undefined;
        frames[hand] = page;
        useBits[hand] = true;
        hand = (hand + 1) % frameCount;
      }
    }

    yield {
      access: page,
      hit: inFrames,
      frames: [...frames],
      ...(evicted !== undefined ? { evicted } : {}),
      clockHand: hand,
      useBits: [...useBits],
      meta: {
        label: `access ${page}: ${inFrames ? "HIT" : "FAULT"}${evicted !== undefined ? ` (evict ${evicted})` : ""}`,
        highlights: [String(page)],
      },
    };
  }

  return { hits, faults };
}

// ---------------------------------------------------------------------------
// Public factory
// ---------------------------------------------------------------------------

export function simulatePaging(
  input: PagingInput,
): Simulation<PagingStep, PagingResult> {
  switch (input.algorithm) {
    case "FIFO":
      return fifo(input);
    case "LRU":
      return lru(input);
    case "Clock":
      return clock(input);
  }
}

// ---------------------------------------------------------------------------
// Virtual address translation (static, no generator — for page-table walk)
// ---------------------------------------------------------------------------

export interface TranslateResult {
  readonly virtualAddress: number;
  readonly pageSize: number;
  readonly pageNumber: number;
  readonly offset: number;
  readonly frameNumber: number | null;
  readonly physicalAddress: number | null;
  /** True if the page is not present in physical memory. */
  readonly pageFault: boolean;
}

/**
 * Decompose a virtual address into page number + offset, then
 * look up the frame in `pageTable` (index = page number, value = frame or null).
 */
export function translateAddress(
  virtualAddr: number,
  pageSize: number,
  pageTable: readonly (number | null)[],
): TranslateResult {
  const pageNumber = Math.floor(virtualAddr / pageSize);
  const offset = virtualAddr % pageSize;
  const frameNumber = pageTable[pageNumber] ?? null;
  const physicalAddress =
    frameNumber !== null ? frameNumber * pageSize + offset : null;
  return {
    virtualAddress: virtualAddr,
    pageSize,
    pageNumber,
    offset,
    frameNumber,
    physicalAddress,
    pageFault: frameNumber === null,
  };
}

// ---------------------------------------------------------------------------
// Preset reference strings
// ---------------------------------------------------------------------------

export interface PagingPreset {
  readonly id: string;
  readonly name: string;
  readonly referenceString: readonly number[];
  readonly defaultFrameCount: number;
}

export const PAGING_PRESETS: readonly PagingPreset[] = [
  {
    id: "classic",
    name: "Classic (Belady's)",
    referenceString: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5],
    defaultFrameCount: 3,
  },
  {
    id: "locality",
    name: "Locality",
    referenceString: [1, 1, 2, 2, 3, 3, 1, 1, 2, 2, 4, 4, 1, 1],
    defaultFrameCount: 3,
  },
  {
    id: "random",
    name: "Thrashing",
    referenceString: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
    defaultFrameCount: 3,
  },
];
