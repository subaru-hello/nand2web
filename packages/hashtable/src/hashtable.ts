import type { Simulation, StepMeta } from "@nand2web/sim-core";

// ---------------------------------------------------------------------------
// Strategy
// ---------------------------------------------------------------------------

export type HashStrategy = "chaining" | "open-addressing";

// ---------------------------------------------------------------------------
// Slot types
// ---------------------------------------------------------------------------

/** A single entry stored in a bucket (chaining) or slot (open addressing). */
export interface HashEntry {
  readonly key: string;
  readonly value: number;
}

/** Open-addressing slot states. */
export type SlotState = "empty" | "occupied" | "tombstone";

export interface OpenSlot {
  readonly state: SlotState;
  readonly entry?: HashEntry;
}

// ---------------------------------------------------------------------------
// Step types
// ---------------------------------------------------------------------------

/**
 * A snapshot of the hash table at one point during an operation.
 * The UI renders whichever strategy is active and uses `highlightBucket`,
 * `probeSequence`, and `collisions` to drive animation.
 */
export interface HashTableStep {
  /** Which bucket the hash function mapped the key to (index into `buckets`). */
  readonly hashedBucket: number;
  /**
   * Sequence of bucket indices visited so far during probing or chain traversal.
   * For chaining: the chain position within the bucket (always length ≤ 1 here
   * since chaining visits one bucket and then chain slots). Represented as the
   * bucket index repeated per slot visited in the chain.
   * For open addressing: the probe sequence of slot indices.
   */
  readonly probeSequence: readonly number[];
  /** Number of collisions encountered so far in this operation. */
  readonly collisions: number;
  /** Current state of the buckets — snapshot for rendering. */
  readonly buckets: readonly BucketSnapshot[];
  /** Whether a resize/rehash was triggered by this step. */
  readonly resizing: boolean;
  /** Buckets before resize (only set during resize steps). */
  readonly bucketsBeforeResize?: readonly BucketSnapshot[];
  /** Human-readable step description. */
  readonly meta: StepMeta;
}

/** A snapshot of one bucket for the step payload (strategy-agnostic). */
export interface BucketSnapshot {
  /** For chaining: all entries currently in the chain. */
  readonly chain: readonly HashEntry[];
  /** For open addressing: the slot state at this index. */
  readonly slot: OpenSlot;
}

// ---------------------------------------------------------------------------
// Result
// ---------------------------------------------------------------------------

export interface HashTableResult {
  readonly loadFactor: number;
  readonly bucketCount: number;
  /** Total probes/comparisons for this operation. */
  readonly probeCount: number;
  /** Whether a resize occurred during this operation. */
  readonly resized: boolean;
}

// ---------------------------------------------------------------------------
// Hash function
// ---------------------------------------------------------------------------

const INITIAL_BUCKET_COUNT = 7;
/** Load factor threshold that triggers resize + rehash (open addressing). */
const LOAD_FACTOR_THRESHOLD_OA = 0.75;
/** Load factor threshold for chaining (buckets become too long). */
const LOAD_FACTOR_THRESHOLD_CH = 1.0;

/**
 * A simple, visualizable polynomial hash for short integer-like strings.
 * Returns a value in [0, buckets).
 */
export function hashKey(key: string, buckets: number): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return h % buckets;
}

// ---------------------------------------------------------------------------
// Internal mutable state (not exposed; only snapshots in steps)
// ---------------------------------------------------------------------------

interface ChainingState {
  readonly strategy: "chaining";
  chains: Array<HashEntry[]>;
  size: number;
  bucketCount: number;
}

interface OpenAddressingState {
  readonly strategy: "open-addressing";
  slots: OpenSlot[];
  size: number;
  bucketCount: number;
}

type TableState = ChainingState | OpenAddressingState;

function makeSnapshot(state: TableState): readonly BucketSnapshot[] {
  if (state.strategy === "chaining") {
    return state.chains.map((chain) => ({
      chain: chain.map((e) => ({ ...e })),
      slot: { state: "empty" as SlotState },
    }));
  }
  return state.slots.map((slot) => ({
    chain: [],
    slot: { ...slot },
  }));
}

function loadFactor(state: TableState): number {
  return state.size / state.bucketCount;
}

function threshold(state: TableState): number {
  return state.strategy === "chaining"
    ? LOAD_FACTOR_THRESHOLD_CH
    : LOAD_FACTOR_THRESHOLD_OA;
}

// ---------------------------------------------------------------------------
// Resize helpers
// ---------------------------------------------------------------------------

function nextBucketCount(current: number): number {
  // Double and find next odd number (simple prime-ish sizing).
  let n = current * 2 + 1;
  // Ensure it's at least odd (reducing collision groupings).
  if (n % 2 === 0) n++;
  return n;
}

function* rehashChaining(
  state: ChainingState,
  bucketsSnapshot: readonly BucketSnapshot[],
): Generator<HashTableStep, void, void> {
  const newCount = nextBucketCount(state.bucketCount);
  const newChains: Array<HashEntry[]> = Array.from(
    { length: newCount },
    () => [],
  );

  // Collect all entries.
  const allEntries: HashEntry[] = [];
  for (const chain of state.chains) {
    for (const e of chain) allEntries.push(e);
  }

  // Rehash each entry into the new chains.
  for (const entry of allEntries) {
    const b = hashKey(entry.key, newCount);
    (newChains[b] as HashEntry[]).push(entry);
  }

  // Mutate state in place.
  state.chains = newChains;
  state.bucketCount = newCount;

  const newSnap = makeSnapshot(state);
  yield {
    hashedBucket: 0,
    probeSequence: [],
    collisions: 0,
    buckets: newSnap,
    resizing: true,
    bucketsBeforeResize: bucketsSnapshot,
    meta: {
      label: `Resize → ${newCount} buckets (rehash ${allEntries.length} entries)`,
    },
  };
}

function* rehashOpenAddressing(
  state: OpenAddressingState,
  bucketsSnapshot: readonly BucketSnapshot[],
): Generator<HashTableStep, void, void> {
  const newCount = nextBucketCount(state.bucketCount);
  const newSlots: OpenSlot[] = Array.from({ length: newCount }, () => ({
    state: "empty" as SlotState,
  }));

  // Collect all live entries (skip tombstones).
  const allEntries: HashEntry[] = [];
  for (const slot of state.slots) {
    if (slot.state === "occupied" && slot.entry) allEntries.push(slot.entry);
  }

  // Rehash into new slots via linear probing.
  for (const entry of allEntries) {
    let b = hashKey(entry.key, newCount);
    while ((newSlots[b] as OpenSlot).state === "occupied") {
      b = (b + 1) % newCount;
    }
    newSlots[b] = { state: "occupied", entry };
  }

  // Mutate state.
  state.slots = newSlots;
  state.bucketCount = newCount;
  state.size = allEntries.length; // tombstones cleared

  const newSnap = makeSnapshot(state);
  yield {
    hashedBucket: 0,
    probeSequence: [],
    collisions: 0,
    buckets: newSnap,
    resizing: true,
    bucketsBeforeResize: bucketsSnapshot,
    meta: {
      label: `Resize → ${newCount} buckets (rehash ${allEntries.length} live entries, tombstones cleared)`,
    },
  };
}

// ---------------------------------------------------------------------------
// Chaining generators
// ---------------------------------------------------------------------------

function* chainingInsert(
  state: ChainingState,
  key: string,
  value: number,
): Generator<HashTableStep, HashTableResult, void> {
  const b = hashKey(key, state.bucketCount);
  const chain = state.chains[b] as HashEntry[];
  let collisions = 0;
  let resized = false;

  // Highlight the hashed bucket first.
  yield {
    hashedBucket: b,
    probeSequence: [b],
    collisions: 0,
    buckets: makeSnapshot(state),
    resizing: false,
    meta: { label: `hash("${key}") → bucket ${b}`, highlights: [String(b)] },
  };

  // Traverse chain to check for duplicate or find insert position.
  for (let i = 0; i < chain.length; i++) {
    const entry = chain[i] as HashEntry;
    if (entry.key === key) {
      // Update existing.
      chain[i] = { key, value };
      yield {
        hashedBucket: b,
        probeSequence: [b],
        collisions,
        buckets: makeSnapshot(state),
        resizing: false,
        meta: {
          label: `Update existing key "${key}" in bucket ${b}`,
          highlights: [String(b)],
        },
      };
      return {
        loadFactor: loadFactor(state),
        bucketCount: state.bucketCount,
        probeCount: i + 1,
        resized: false,
      };
    }
    collisions++;
    yield {
      hashedBucket: b,
      probeSequence: [b],
      collisions,
      buckets: makeSnapshot(state),
      resizing: false,
      meta: {
        label: `Chain slot ${i}: key "${entry.key}" ≠ "${key}" (collision)`,
        highlights: [String(b)],
      },
    };
  }

  // Append to chain.
  chain.push({ key, value });
  state.size++;

  yield {
    hashedBucket: b,
    probeSequence: [b],
    collisions,
    buckets: makeSnapshot(state),
    resizing: false,
    meta: {
      label: `Inserted "${key}" at chain position ${chain.length - 1} in bucket ${b}`,
      highlights: [String(b)],
    },
  };

  // Check resize.
  if (loadFactor(state) > threshold(state)) {
    const snap = makeSnapshot(state);
    yield* rehashChaining(state, snap);
    resized = true;
  }

  return {
    loadFactor: loadFactor(state),
    bucketCount: state.bucketCount,
    probeCount: collisions + 1,
    resized,
  };
}

function* chainingFind(
  state: ChainingState,
  key: string,
): Generator<HashTableStep, HashTableResult, void> {
  const b = hashKey(key, state.bucketCount);
  const chain = state.chains[b] as HashEntry[];
  let collisions = 0;

  yield {
    hashedBucket: b,
    probeSequence: [b],
    collisions: 0,
    buckets: makeSnapshot(state),
    resizing: false,
    meta: { label: `hash("${key}") → bucket ${b}`, highlights: [String(b)] },
  };

  for (let i = 0; i < chain.length; i++) {
    const entry = chain[i] as HashEntry;
    if (entry.key === key) {
      yield {
        hashedBucket: b,
        probeSequence: [b],
        collisions,
        buckets: makeSnapshot(state),
        resizing: false,
        meta: {
          label: `Found "${key}" at chain position ${i} in bucket ${b}`,
          highlights: [String(b)],
        },
      };
      return {
        loadFactor: loadFactor(state),
        bucketCount: state.bucketCount,
        probeCount: i + 1,
        resized: false,
      };
    }
    collisions++;
    yield {
      hashedBucket: b,
      probeSequence: [b],
      collisions,
      buckets: makeSnapshot(state),
      resizing: false,
      meta: {
        label: `Chain slot ${i}: key "${entry.key}" ≠ "${key}"`,
        highlights: [String(b)],
      },
    };
  }

  yield {
    hashedBucket: b,
    probeSequence: [b],
    collisions,
    buckets: makeSnapshot(state),
    resizing: false,
    meta: {
      label: `"${key}" not found in bucket ${b} (chain exhausted)`,
      highlights: [String(b)],
    },
  };

  return {
    loadFactor: loadFactor(state),
    bucketCount: state.bucketCount,
    probeCount: collisions,
    resized: false,
  };
}

function* chainingRemove(
  state: ChainingState,
  key: string,
): Generator<HashTableStep, HashTableResult, void> {
  const b = hashKey(key, state.bucketCount);
  const chain = state.chains[b] as HashEntry[];
  let collisions = 0;

  yield {
    hashedBucket: b,
    probeSequence: [b],
    collisions: 0,
    buckets: makeSnapshot(state),
    resizing: false,
    meta: { label: `hash("${key}") → bucket ${b}`, highlights: [String(b)] },
  };

  for (let i = 0; i < chain.length; i++) {
    const entry = chain[i] as HashEntry;
    if (entry.key === key) {
      chain.splice(i, 1);
      state.size--;
      yield {
        hashedBucket: b,
        probeSequence: [b],
        collisions,
        buckets: makeSnapshot(state),
        resizing: false,
        meta: {
          label: `Removed "${key}" from chain position ${i} in bucket ${b}`,
          highlights: [String(b)],
        },
      };
      return {
        loadFactor: loadFactor(state),
        bucketCount: state.bucketCount,
        probeCount: i + 1,
        resized: false,
      };
    }
    collisions++;
    yield {
      hashedBucket: b,
      probeSequence: [b],
      collisions,
      buckets: makeSnapshot(state),
      resizing: false,
      meta: {
        label: `Chain slot ${i}: key "${entry.key}" ≠ "${key}"`,
        highlights: [String(b)],
      },
    };
  }

  yield {
    hashedBucket: b,
    probeSequence: [b],
    collisions,
    buckets: makeSnapshot(state),
    resizing: false,
    meta: {
      label: `"${key}" not found — nothing removed`,
      highlights: [String(b)],
    },
  };

  return {
    loadFactor: loadFactor(state),
    bucketCount: state.bucketCount,
    probeCount: collisions,
    resized: false,
  };
}

// ---------------------------------------------------------------------------
// Open-addressing generators
// ---------------------------------------------------------------------------

function* oaInsert(
  state: OpenAddressingState,
  key: string,
  value: number,
): Generator<HashTableStep, HashTableResult, void> {
  const home = hashKey(key, state.bucketCount);
  let idx = home;
  const probeSeq: number[] = [];
  let collisions = 0;
  let resized = false;
  let firstTombstone: number | null = null;

  yield {
    hashedBucket: home,
    probeSequence: [home],
    collisions: 0,
    buckets: makeSnapshot(state),
    resizing: false,
    meta: {
      label: `hash("${key}") → slot ${home}`,
      highlights: [String(home)],
    },
  };

  for (let probe = 0; probe < state.bucketCount; probe++) {
    probeSeq.push(idx);
    const slot = state.slots[idx] as OpenSlot;

    if (slot.state === "empty") {
      // Insert here (or at first tombstone if found earlier).
      const insertAt = firstTombstone !== null ? firstTombstone : idx;
      state.slots[insertAt] = { state: "occupied", entry: { key, value } };
      if (firstTombstone === null) state.size++;
      // If we re-used a tombstone, size unchanged (no new occupied → slot was already "used").
      // Actually for open-addressing we track live entries in `size`; tombstone re-use = net 0.

      yield {
        hashedBucket: home,
        probeSequence: [...probeSeq],
        collisions,
        buckets: makeSnapshot(state),
        resizing: false,
        meta: {
          label:
            firstTombstone !== null
              ? `Inserted "${key}" at tombstone slot ${insertAt} (found empty at ${idx})`
              : `Inserted "${key}" at empty slot ${insertAt}`,
          highlights: [String(insertAt)],
        },
      };

      if (firstTombstone === null) {
        // Only check resize when we actually consumed a new slot.
        if (loadFactor(state) > threshold(state)) {
          const snap = makeSnapshot(state);
          yield* rehashOpenAddressing(state, snap);
          resized = true;
        }
      }

      return {
        loadFactor: loadFactor(state),
        bucketCount: state.bucketCount,
        probeCount: probe + 1,
        resized,
      };
    }

    if (slot.state === "tombstone") {
      if (firstTombstone === null) firstTombstone = idx;
      yield {
        hashedBucket: home,
        probeSequence: [...probeSeq],
        collisions,
        buckets: makeSnapshot(state),
        resizing: false,
        meta: {
          label: `Slot ${idx}: tombstone (skip, continue probing)`,
          highlights: [String(idx)],
        },
      };
      idx = (idx + 1) % state.bucketCount;
      continue;
    }

    // Occupied.
    if ((slot.entry as HashEntry).key === key) {
      // Update.
      state.slots[idx] = { state: "occupied", entry: { key, value } };
      yield {
        hashedBucket: home,
        probeSequence: [...probeSeq],
        collisions,
        buckets: makeSnapshot(state),
        resizing: false,
        meta: {
          label: `Updated existing key "${key}" at slot ${idx}`,
          highlights: [String(idx)],
        },
      };
      return {
        loadFactor: loadFactor(state),
        bucketCount: state.bucketCount,
        probeCount: probe + 1,
        resized: false,
      };
    }

    collisions++;
    yield {
      hashedBucket: home,
      probeSequence: [...probeSeq],
      collisions,
      buckets: makeSnapshot(state),
      resizing: false,
      meta: {
        label: `Slot ${idx}: occupied by "${(slot.entry as HashEntry).key}" ≠ "${key}" (collision, probe +1)`,
        highlights: [String(idx)],
      },
    };
    idx = (idx + 1) % state.bucketCount;
  }

  // Table full (shouldn't happen if resize works correctly, but guard it).
  yield {
    hashedBucket: home,
    probeSequence: [...probeSeq],
    collisions,
    buckets: makeSnapshot(state),
    resizing: false,
    meta: { label: `Table full — could not insert "${key}"` },
  };

  return {
    loadFactor: loadFactor(state),
    bucketCount: state.bucketCount,
    probeCount: state.bucketCount,
    resized: false,
  };
}

function* oaFind(
  state: OpenAddressingState,
  key: string,
): Generator<HashTableStep, HashTableResult, void> {
  const home = hashKey(key, state.bucketCount);
  let idx = home;
  const probeSeq: number[] = [];
  let collisions = 0;

  yield {
    hashedBucket: home,
    probeSequence: [home],
    collisions: 0,
    buckets: makeSnapshot(state),
    resizing: false,
    meta: {
      label: `hash("${key}") → slot ${home}`,
      highlights: [String(home)],
    },
  };

  for (let probe = 0; probe < state.bucketCount; probe++) {
    probeSeq.push(idx);
    const slot = state.slots[idx] as OpenSlot;

    if (slot.state === "empty") {
      yield {
        hashedBucket: home,
        probeSequence: [...probeSeq],
        collisions,
        buckets: makeSnapshot(state),
        resizing: false,
        meta: {
          label: `Slot ${idx}: empty — "${key}" not in table`,
          highlights: [String(idx)],
        },
      };
      return {
        loadFactor: loadFactor(state),
        bucketCount: state.bucketCount,
        probeCount: probe + 1,
        resized: false,
      };
    }

    if (slot.state === "tombstone") {
      yield {
        hashedBucket: home,
        probeSequence: [...probeSeq],
        collisions,
        buckets: makeSnapshot(state),
        resizing: false,
        meta: {
          label: `Slot ${idx}: tombstone (skip, continue probing)`,
          highlights: [String(idx)],
        },
      };
      idx = (idx + 1) % state.bucketCount;
      continue;
    }

    if ((slot.entry as HashEntry).key === key) {
      yield {
        hashedBucket: home,
        probeSequence: [...probeSeq],
        collisions,
        buckets: makeSnapshot(state),
        resizing: false,
        meta: {
          label: `Found "${key}" at slot ${idx}`,
          highlights: [String(idx)],
        },
      };
      return {
        loadFactor: loadFactor(state),
        bucketCount: state.bucketCount,
        probeCount: probe + 1,
        resized: false,
      };
    }

    collisions++;
    yield {
      hashedBucket: home,
      probeSequence: [...probeSeq],
      collisions,
      buckets: makeSnapshot(state),
      resizing: false,
      meta: {
        label: `Slot ${idx}: "${(slot.entry as HashEntry).key}" ≠ "${key}" (probe +1)`,
        highlights: [String(idx)],
      },
    };
    idx = (idx + 1) % state.bucketCount;
  }

  yield {
    hashedBucket: home,
    probeSequence: [...probeSeq],
    collisions,
    buckets: makeSnapshot(state),
    resizing: false,
    meta: { label: `"${key}" not found (full probe sequence exhausted)` },
  };

  return {
    loadFactor: loadFactor(state),
    bucketCount: state.bucketCount,
    probeCount: state.bucketCount,
    resized: false,
  };
}

function* oaRemove(
  state: OpenAddressingState,
  key: string,
): Generator<HashTableStep, HashTableResult, void> {
  const home = hashKey(key, state.bucketCount);
  let idx = home;
  const probeSeq: number[] = [];
  let collisions = 0;

  yield {
    hashedBucket: home,
    probeSequence: [home],
    collisions: 0,
    buckets: makeSnapshot(state),
    resizing: false,
    meta: {
      label: `hash("${key}") → slot ${home}`,
      highlights: [String(home)],
    },
  };

  for (let probe = 0; probe < state.bucketCount; probe++) {
    probeSeq.push(idx);
    const slot = state.slots[idx] as OpenSlot;

    if (slot.state === "empty") {
      yield {
        hashedBucket: home,
        probeSequence: [...probeSeq],
        collisions,
        buckets: makeSnapshot(state),
        resizing: false,
        meta: {
          label: `Slot ${idx}: empty — "${key}" not found, nothing removed`,
          highlights: [String(idx)],
        },
      };
      return {
        loadFactor: loadFactor(state),
        bucketCount: state.bucketCount,
        probeCount: probe + 1,
        resized: false,
      };
    }

    if (slot.state === "tombstone") {
      yield {
        hashedBucket: home,
        probeSequence: [...probeSeq],
        collisions,
        buckets: makeSnapshot(state),
        resizing: false,
        meta: {
          label: `Slot ${idx}: tombstone (skip)`,
          highlights: [String(idx)],
        },
      };
      idx = (idx + 1) % state.bucketCount;
      continue;
    }

    if ((slot.entry as HashEntry).key === key) {
      // Place tombstone.
      state.slots[idx] = { state: "tombstone" };
      state.size--;
      yield {
        hashedBucket: home,
        probeSequence: [...probeSeq],
        collisions,
        buckets: makeSnapshot(state),
        resizing: false,
        meta: {
          label: `Removed "${key}" at slot ${idx} — placed tombstone`,
          highlights: [String(idx)],
        },
      };
      return {
        loadFactor: loadFactor(state),
        bucketCount: state.bucketCount,
        probeCount: probe + 1,
        resized: false,
      };
    }

    collisions++;
    yield {
      hashedBucket: home,
      probeSequence: [...probeSeq],
      collisions,
      buckets: makeSnapshot(state),
      resizing: false,
      meta: {
        label: `Slot ${idx}: "${(slot.entry as HashEntry).key}" ≠ "${key}" (probe +1)`,
        highlights: [String(idx)],
      },
    };
    idx = (idx + 1) % state.bucketCount;
  }

  yield {
    hashedBucket: home,
    probeSequence: [...probeSeq],
    collisions,
    buckets: makeSnapshot(state),
    resizing: false,
    meta: { label: `"${key}" not found (probe sequence exhausted)` },
  };

  return {
    loadFactor: loadFactor(state),
    bucketCount: state.bucketCount,
    probeCount: state.bucketCount,
    resized: false,
  };
}

// ---------------------------------------------------------------------------
// Public API — HashTable class wrapping the generators
// ---------------------------------------------------------------------------

/**
 * A visualizable hash table. Operations return Simulation generators that
 * yield HashTableStep values while mutating internal state.
 */
export class HashTable {
  private _state: TableState;

  constructor(
    strategy: HashStrategy = "chaining",
    initialBuckets = INITIAL_BUCKET_COUNT,
  ) {
    if (strategy === "chaining") {
      this._state = {
        strategy: "chaining",
        chains: Array.from({ length: initialBuckets }, () => []),
        size: 0,
        bucketCount: initialBuckets,
      } satisfies ChainingState;
    } else {
      this._state = {
        strategy: "open-addressing",
        slots: Array.from({ length: initialBuckets }, () => ({
          state: "empty" as SlotState,
        })),
        size: 0,
        bucketCount: initialBuckets,
      } satisfies OpenAddressingState;
    }
  }

  get strategy(): HashStrategy {
    return this._state.strategy;
  }

  get size(): number {
    return this._state.size;
  }

  get bucketCount(): number {
    return this._state.bucketCount;
  }

  get currentLoadFactor(): number {
    return loadFactor(this._state);
  }

  insert(key: string, value = 0): Simulation<HashTableStep, HashTableResult> {
    if (this._state.strategy === "chaining") {
      return chainingInsert(this._state, key, value);
    }
    return oaInsert(this._state, key, value);
  }

  find(key: string): Simulation<HashTableStep, HashTableResult> {
    if (this._state.strategy === "chaining") {
      return chainingFind(this._state, key);
    }
    return oaFind(this._state, key);
  }

  remove(key: string): Simulation<HashTableStep, HashTableResult> {
    if (this._state.strategy === "chaining") {
      return chainingRemove(this._state, key);
    }
    return oaRemove(this._state, key);
  }

  /** Return a snapshot of the current bucket state (no operation). */
  snapshot(): readonly BucketSnapshot[] {
    return makeSnapshot(this._state);
  }
}
