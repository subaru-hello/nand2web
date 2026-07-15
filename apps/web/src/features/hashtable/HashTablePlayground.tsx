import type {
  BucketSnapshot,
  HashStrategy,
  HashTableStep,
} from "@nand2web/hashtable";
import { HashTable } from "@nand2web/hashtable";
import { collectSteps } from "@nand2web/sim-core";
import { useCallback, useMemo, useRef, useState } from "react";
import { usePlayback } from "../playback/usePlayback";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RANDOM_KEYS = [
  "alpha",
  "beta",
  "gamma",
  "delta",
  "epsilon",
  "zeta",
  "eta",
  "theta",
  "iota",
  "kappa",
  "lambda",
  "mu",
  "nu",
  "xi",
  "omicron",
  "pi",
  "rho",
  "sigma",
  "tau",
  "upsilon",
  "phi",
  "chi",
  "psi",
  "omega",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomKey(): string {
  const idx = Math.floor(Math.random() * RANDOM_KEYS.length);
  return RANDOM_KEYS[idx] ?? "key";
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ChainBucket({
  bucketIdx,
  snapshot,
  highlight,
  isHashed,
  isProbed,
}: {
  bucketIdx: number;
  snapshot: BucketSnapshot;
  highlight: boolean;
  isHashed: boolean;
  isProbed: boolean;
}) {
  const bg = isHashed
    ? "border-sky-400 bg-sky-950"
    : isProbed
      ? "border-yellow-400 bg-yellow-950"
      : "border-zinc-700 bg-zinc-900";

  return (
    <div
      className={`rounded border ${bg} p-1.5 transition-colors duration-100`}
    >
      <div className="mb-1 font-mono text-[10px] text-zinc-500">
        [{bucketIdx}]
      </div>
      {snapshot.chain.length === 0 ? (
        <div className="font-mono text-[10px] text-zinc-600">∅</div>
      ) : (
        <div className="space-y-0.5">
          {snapshot.chain.map((entry, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: chain positions are ordinal
              key={i}
              className={`rounded px-1 py-0.5 font-mono text-[10px] ${
                highlight
                  ? "bg-yellow-400/20 text-yellow-200"
                  : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {entry.key}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OASlot({
  slotIdx,
  snapshot,
  isHashed,
  isProbed,
}: {
  slotIdx: number;
  snapshot: BucketSnapshot;
  isHashed: boolean;
  isProbed: boolean;
}) {
  const { slot } = snapshot;
  const bg =
    slot.state === "tombstone"
      ? "border-red-700 bg-red-950"
      : isHashed
        ? "border-sky-400 bg-sky-950"
        : isProbed
          ? "border-yellow-400 bg-yellow-950"
          : slot.state === "occupied"
            ? "border-zinc-600 bg-zinc-900"
            : "border-zinc-800 bg-zinc-950";

  const text =
    slot.state === "occupied"
      ? (slot.entry?.key ?? "")
      : slot.state === "tombstone"
        ? "✕"
        : "—";

  const textColor =
    slot.state === "tombstone"
      ? "text-red-400"
      : slot.state === "occupied"
        ? "text-zinc-200"
        : "text-zinc-600";

  return (
    <div
      className={`flex flex-col items-center rounded border ${bg} px-1 py-1.5 transition-colors duration-100`}
    >
      <span className="font-mono text-[9px] text-zinc-500">[{slotIdx}]</span>
      <span
        className={`font-mono text-[10px] ${textColor} truncate max-w-[48px] text-center`}
      >
        {text}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function HashTablePlayground() {
  const [strategy, setStrategy] = useState<HashStrategy>("chaining");
  const [inputKey, setInputKey] = useState("alpha");
  const [steps, setSteps] = useState<readonly HashTableStep[]>([]);
  const [resetKey, setResetKey] = useState(0);

  // The hash table instance persists across operations but resets on strategy change.
  const tableRef = useRef<HashTable>(new HashTable("chaining"));

  // Stats derived from the last completed operation result.
  const [stats, setStats] = useState({
    loadFactor: 0,
    bucketCount: 7,
    probeCount: 0,
    resized: false,
    size: 0,
  });

  const playback = usePlayback(steps.length, resetKey, false);

  const currentStep =
    playback.cursor > 0 ? steps[playback.cursor - 1] : undefined;

  // Snapshot to display: either the current step's buckets or the table's current state.
  const displayBuckets: readonly BucketSnapshot[] = useMemo(() => {
    if (currentStep) return currentStep.buckets;
    return tableRef.current.snapshot();
  }, [currentStep]);

  const runOperation = useCallback(
    (op: "insert" | "find" | "remove", key: string) => {
      const table = tableRef.current;
      let sim: ReturnType<typeof table.insert>;
      if (op === "insert") sim = table.insert(key);
      else if (op === "find") sim = table.find(key);
      else sim = table.remove(key);

      const { steps: newSteps, result } = collectSteps(sim);
      setSteps(newSteps);
      setResetKey((k) => k + 1);
      if (result) {
        setStats({
          loadFactor: result.loadFactor,
          bucketCount: result.bucketCount,
          probeCount: result.probeCount,
          resized: result.resized,
          size: table.size,
        });
      }
    },
    [],
  );

  const handleStrategyChange = useCallback((s: HashStrategy) => {
    setStrategy(s);
    tableRef.current = new HashTable(s);
    setSteps([]);
    setResetKey((k) => k + 1);
    setStats({
      loadFactor: 0,
      bucketCount: tableRef.current.bucketCount,
      probeCount: 0,
      resized: false,
      size: 0,
    });
  }, []);

  const handleReset = useCallback(() => {
    tableRef.current = new HashTable(strategy);
    setSteps([]);
    setResetKey((k) => k + 1);
    setStats({
      loadFactor: 0,
      bucketCount: tableRef.current.bucketCount,
      probeCount: 0,
      resized: false,
      size: 0,
    });
  }, [strategy]);

  const hashedBucket = currentStep?.hashedBucket ?? -1;
  const probeSet = new Set(currentStep?.probeSequence ?? []);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
        {/* Strategy toggle */}
        <div className="space-y-1">
          <span className="text-xs text-zinc-500">Strategy</span>
          <div className="flex rounded border border-zinc-700 bg-zinc-900 p-0.5">
            {(["chaining", "open-addressing"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleStrategyChange(s)}
                className={`rounded px-3 py-1 text-xs transition-colors ${
                  strategy === s
                    ? "bg-sky-700 text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {s === "chaining" ? "Chaining" : "Open Addressing"}
              </button>
            ))}
          </div>
        </div>

        {/* Key input */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-500" htmlFor="ht-key">
            Key
          </label>
          <input
            id="ht-key"
            type="text"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="w-32 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 font-mono text-sm text-zinc-200"
            placeholder="key"
          />
        </div>

        {/* Random key */}
        <button
          type="button"
          onClick={() => setInputKey(randomKey())}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-700"
        >
          Random
        </button>

        {/* Operations */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => runOperation("insert", inputKey)}
            disabled={!inputKey.trim()}
            className="rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-40"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => runOperation("find", inputKey)}
            disabled={!inputKey.trim()}
            className="rounded-md bg-sky-700 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-sky-600 disabled:opacity-40"
          >
            Find
          </button>
          <button
            type="button"
            onClick={() => runOperation("remove", inputKey)}
            disabled={!inputKey.trim()}
            className="rounded-md bg-red-800 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-40"
          >
            Remove
          </button>
        </div>

        {/* Reset */}
        <button
          type="button"
          onClick={handleReset}
          className="ml-auto rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-700"
        >
          Reset
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2 font-mono text-xs text-zinc-500">
        <span>
          entries <span className="text-zinc-200">{stats.size}</span>
        </span>
        <span>
          buckets <span className="text-zinc-200">{stats.bucketCount}</span>
        </span>
        <span>
          load factor{" "}
          <span
            className={
              stats.loadFactor > 0.7 ? "text-red-400" : "text-emerald-400"
            }
          >
            {stats.loadFactor.toFixed(2)}
          </span>
        </span>
        <span>
          probes/comparisons{" "}
          <span className="text-yellow-400">{stats.probeCount}</span>
        </span>
        {stats.resized && <span className="text-sky-400">↑ resized</span>}
      </div>

      {/* Bucket visualisation */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-4">
        {strategy === "chaining" ? (
          <div className="flex flex-wrap gap-2">
            {displayBuckets.map((snap, idx) => (
              <ChainBucket
                // biome-ignore lint/suspicious/noArrayIndexKey: bucket index is stable identity
                key={idx}
                bucketIdx={idx}
                snapshot={snap}
                highlight={idx === hashedBucket}
                isHashed={idx === hashedBucket}
                isProbed={probeSet.has(idx)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {displayBuckets.map((snap, idx) => (
              <OASlot
                // biome-ignore lint/suspicious/noArrayIndexKey: slot index is stable identity
                key={idx}
                slotIdx={idx}
                snapshot={snap}
                isHashed={idx === hashedBucket}
                isProbed={probeSet.has(idx) && idx !== hashedBucket}
              />
            ))}
          </div>
        )}
      </div>

      {/* Step label */}
      {currentStep?.meta.label && (
        <p className="font-mono text-xs text-zinc-400">
          {currentStep.meta.label}
        </p>
      )}

      {/* Resize notice */}
      {currentStep?.resizing && (
        <div className="rounded-lg border border-sky-800 bg-sky-950/40 px-4 py-2 font-mono text-xs text-sky-300">
          Resize + rehash triggered — buckets before:{" "}
          {currentStep.bucketsBeforeResize?.length ?? "?"} → after:{" "}
          {currentStep.buckets.length}
        </div>
      )}

      {/* Transport */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5">
        <button
          type="button"
          onClick={playback.playing ? playback.pause : playback.play}
          disabled={steps.length === 0}
          className="rounded-md bg-sky-600 px-4 py-1 font-medium text-sm text-white transition-colors hover:bg-sky-500 disabled:opacity-40"
        >
          {playback.playing ? "pause" : "play"}
        </button>
        <button
          type="button"
          onClick={playback.stepBack}
          disabled={playback.cursor === 0}
          className="rounded-md bg-zinc-800 px-3 py-1 font-mono text-sm text-zinc-200 hover:bg-zinc-700 disabled:opacity-40"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={playback.stepForward}
          disabled={playback.cursor >= playback.total}
          className="rounded-md bg-zinc-800 px-3 py-1 font-mono text-sm text-zinc-200 hover:bg-zinc-700 disabled:opacity-40"
        >
          ›
        </button>
        <input
          type="range"
          min={0}
          max={playback.total}
          value={playback.cursor}
          onChange={(e) => playback.seek(Number(e.target.value))}
          className="min-w-40 flex-1 accent-sky-400"
          aria-label="Playback position"
        />
        <label className="flex items-center gap-1.5 font-mono text-xs text-zinc-500">
          speed
          <select
            value={playback.speed}
            onChange={(e) => playback.setSpeed(Number(e.target.value))}
            className="rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-zinc-300"
          >
            <option value={0.35}>slow</option>
            <option value={1}>1×</option>
            <option value={3}>3×</option>
            <option value={8}>8×</option>
          </select>
        </label>
        <span className="font-mono text-xs text-zinc-500">
          step {playback.cursor}/{playback.total}
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 font-mono text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm border border-sky-400 bg-sky-950" />
          hashed bucket
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm border border-yellow-400 bg-yellow-950" />
          probe / chain traversal
        </span>
        {strategy === "open-addressing" && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm border border-red-700 bg-red-950" />
            tombstone
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm border border-zinc-600 bg-zinc-900" />
          occupied
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm border border-zinc-800 bg-zinc-950" />
          empty
        </span>
      </div>
    </div>
  );
}
