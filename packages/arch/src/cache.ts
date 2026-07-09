/**
 * Set-associative cache simulator (direct-mapped = 1-way).
 *
 * Config: { lines (total cache lines), associativity: 1|2|4, blockSize, policy: "LRU" }
 * Direct-mapped is 1-way as a special case.
 *
 * Input: address trace (array of word addresses).
 * Generator: 1 access = 1 step.
 */

import type { Simulation, StepMeta } from "@nand2web/sim-core";
import { createRng } from "@nand2web/sim-core";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CacheConfig {
  /** Total number of cache lines. Must be divisible by associativity. */
  readonly lines: number;
  /** Set associativity: 1 = direct-mapped, 2 = 2-way, 4 = 4-way. */
  readonly associativity: 1 | 2 | 4;
  /** Block size in words (must be a power of 2). */
  readonly blockSize: number;
  /** Replacement policy (only LRU implemented). */
  readonly policy: "LRU";
}

export interface AddressBreakdown {
  readonly tag: number;
  readonly index: number;
  readonly offset: number;
}

export interface CacheLine {
  readonly valid: boolean;
  readonly tag: number;
  /** LRU timestamp (higher = more recently used). */
  readonly lruTime: number;
}

export type CacheSet = readonly CacheLine[];

export interface CacheStep {
  readonly access: number;
  readonly address: number;
  readonly breakdown: AddressBreakdown;
  readonly hit: boolean;
  readonly evictedTag: number | undefined;
  readonly sets: readonly CacheSet[];
  readonly meta: StepMeta;
}

export interface CacheResult {
  readonly hits: number;
  readonly misses: number;
  readonly hitRate: number;
}

// ---------------------------------------------------------------------------
// Address decomposition
// ---------------------------------------------------------------------------

/** Number of bits needed to represent values in [0, n). n must be a power of 2. */
function log2(n: number): number {
  return Math.log2(n) | 0;
}

export function decomposeAddress(
  address: number,
  config: CacheConfig,
): AddressBreakdown {
  const numSets = config.lines / config.associativity;
  const offsetBits = log2(config.blockSize);
  const indexBits = log2(numSets);
  const offset = address & ((1 << offsetBits) - 1);
  const index = (address >> offsetBits) & ((1 << indexBits) - 1);
  const tag = address >> (offsetBits + indexBits);
  return { tag, index, offset };
}

/** Reconstruct original block-aligned address from tag+index. */
export function reconstructAddress(
  breakdown: AddressBreakdown,
  config: CacheConfig,
): number {
  const numSets = config.lines / config.associativity;
  const offsetBits = log2(config.blockSize);
  const indexBits = log2(numSets);
  return (
    (breakdown.tag << (offsetBits + indexBits)) |
    (breakdown.index << offsetBits)
  );
}

// ---------------------------------------------------------------------------
// Cache simulator
// ---------------------------------------------------------------------------

export function runCache(
  trace: readonly number[],
  config: CacheConfig,
): Simulation<CacheStep, CacheResult> {
  return cacheGen(trace, config);
}

function* cacheGen(
  trace: readonly number[],
  config: CacheConfig,
): Simulation<CacheStep, CacheResult> {
  const numSets = config.lines / config.associativity;
  const ways = config.associativity;

  // Initialize cache: all lines invalid
  const emptyLine: CacheLine = { valid: false, tag: 0, lruTime: 0 };
  const sets: CacheLine[][] = Array.from({ length: numSets }, () =>
    Array.from({ length: ways }, () => ({ ...emptyLine })),
  );

  let hits = 0;
  let misses = 0;
  let time = 0;

  for (const address of trace) {
    time++;
    const bd = decomposeAddress(address, config);
    const set = sets[bd.index];
    if (set === undefined) continue;

    // Check for hit
    let hitWay = -1;
    for (let w = 0; w < ways; w++) {
      const line = set[w];
      if (line?.valid && line.tag === bd.tag) {
        hitWay = w;
        break;
      }
    }

    let evictedTag: number | undefined;
    const hit = hitWay >= 0;

    if (hit) {
      hits++;
      // Update LRU timestamp
      const line = set[hitWay] as CacheLine;
      set[hitWay] = { ...line, lruTime: time };
    } else {
      misses++;
      // Find victim: invalid line first, then LRU
      let victimWay = -1;
      let minTime = Number.POSITIVE_INFINITY;
      for (let w = 0; w < ways; w++) {
        const line = set[w];
        if (line === undefined) continue;
        if (!line.valid) {
          victimWay = w;
          break;
        }
        if (line.lruTime < minTime) {
          minTime = line.lruTime;
          victimWay = w;
        }
      }
      if (victimWay >= 0) {
        const victim = set[victimWay] as CacheLine;
        evictedTag = victim.valid ? victim.tag : undefined;
        set[victimWay] = { valid: true, tag: bd.tag, lruTime: time };
      }
    }

    // Snapshot sets (deep copy)
    const setsSnapshot: CacheSet[] = sets.map((s) => [...s]);

    yield {
      access: hits + misses,
      address,
      breakdown: bd,
      hit,
      evictedTag,
      sets: setsSnapshot,
      meta: {
        label: hit ? `HIT  addr=${address}` : `MISS addr=${address}`,
        highlights: [bd.index.toString()],
      },
    };
  }

  const total = hits + misses;
  return {
    hits,
    misses,
    hitRate: total > 0 ? hits / total : 0,
  };
}

// ---------------------------------------------------------------------------
// Reference (naive) implementation — used by property tests
// ---------------------------------------------------------------------------

export function naiveCache(
  trace: readonly number[],
  config: CacheConfig,
): { hitMask: readonly boolean[] } {
  const numSets = config.lines / config.associativity;
  const ways = config.associativity;
  // Each set: array of {tag, lruTime} for valid lines
  const sets: Array<Array<{ tag: number; lruTime: number }>> = Array.from(
    { length: numSets },
    () => [],
  );
  let time = 0;
  const hitMask: boolean[] = [];
  for (const address of trace) {
    time++;
    const bd = decomposeAddress(address, config);
    const set = sets[bd.index] ?? [];
    const hitIdx = set.findIndex((l) => l.tag === bd.tag);
    if (hitIdx >= 0) {
      hitMask.push(true);
      // update LRU
      const line = set[hitIdx] as { tag: number; lruTime: number };
      line.lruTime = time;
    } else {
      hitMask.push(false);
      if (set.length < ways) {
        set.push({ tag: bd.tag, lruTime: time });
      } else {
        // evict LRU
        let minIdx = 0;
        for (let i = 1; i < set.length; i++) {
          if (
            (set[i]?.lruTime ?? Infinity) < (set[minIdx]?.lruTime ?? Infinity)
          ) {
            minIdx = i;
          }
        }
        set[minIdx] = { tag: bd.tag, lruTime: time };
      }
      sets[bd.index] = set;
    }
  }
  return { hitMask };
}

// ---------------------------------------------------------------------------
// Trace generators
// ---------------------------------------------------------------------------

export type TraceKind = "sequential" | "strided" | "random" | "loop";

export function generateTrace(
  kind: TraceKind,
  length: number,
  seed = 42,
): readonly number[] {
  const rng = createRng(seed);
  const addresses: number[] = [];
  switch (kind) {
    case "sequential":
      for (let i = 0; i < length; i++) addresses.push(i);
      break;
    case "strided":
      for (let i = 0; i < length; i++) addresses.push(i * 4);
      break;
    case "random":
      for (let i = 0; i < length; i++) addresses.push(Math.floor(rng() * 64));
      break;
    case "loop": {
      const loopSize = 8;
      for (let i = 0; i < length; i++) addresses.push(i % loopSize);
      break;
    }
  }
  return addresses;
}

export interface CachePreset {
  readonly id: TraceKind;
  readonly name: string;
  readonly description: string;
}

export const CACHE_PRESETS: readonly CachePreset[] = [
  {
    id: "sequential",
    name: "Sequential",
    description: "Access addresses 0, 1, 2, … — high spatial locality",
  },
  {
    id: "strided",
    name: "Strided ×4",
    description:
      "Access every 4th word — may cause conflict misses in small caches",
  },
  {
    id: "random",
    name: "Random",
    description: "Uniformly random addresses — poor locality, stress test",
  },
  {
    id: "loop",
    name: "Loop (size 8)",
    description:
      "Repeatedly access the same 8 addresses — fits in any ≥8 line cache",
  },
];
