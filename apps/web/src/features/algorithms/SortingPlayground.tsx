import type { SortMeta, SortResult, SortStep } from "@nand2web/algorithms";
import {
  bubbleSort,
  heapSort,
  insertionSort,
  mergeSort,
  quickSort,
  SORT_META,
  selectionSort,
} from "@nand2web/algorithms";
import { collectSteps, createRng, shuffle } from "@nand2web/sim-core";
import { useMemo, useState } from "react";
import { usePlayback } from "../playback/usePlayback";

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

type AlgoId = (typeof SORT_META)[number]["id"];

const ALGO_FNS: Record<
  AlgoId,
  (input: readonly number[]) => Generator<SortStep, SortResult, void>
> = {
  bubble: bubbleSort,
  insertion: insertionSort,
  selection: selectionSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort,
};

const DEFAULT_SIZE = 20;
const MIN_SIZE = 8;
const MAX_SIZE = 48;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildArray(size: number, seed: number): readonly number[] {
  const rng = createRng(seed);
  const base = Array.from({ length: size }, (_, i) => i + 1);
  return shuffle(rng, base);
}

function barColor(
  index: number,
  step: SortStep | undefined,
  inputLength: number,
): string {
  if (!step) return "bg-zinc-600";
  // Priority: active compare/write first, then sorted membership, then default.
  if (step.compare && (step.compare[0] === index || step.compare[1] === index))
    return "bg-yellow-400";
  if (step.write?.some((w) => w.index === index)) return "bg-red-500";
  if (step.sortedIndices?.includes(index)) return "bg-emerald-500";
  // All indices sorted when sortedIndices covers the whole array
  if ((step.sortedIndices?.length ?? 0) === inputLength)
    return "bg-emerald-500";
  return "bg-zinc-600";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SortingPlayground() {
  const [algoId, setAlgoId] = useState<AlgoId>("bubble");
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [seed, setSeed] = useState(1);

  const input = useMemo(() => buildArray(size, seed), [size, seed]);

  const { steps, result } = useMemo(() => {
    // ALGO_FNS covers every AlgoId; the fallback to bubbleSort is unreachable.
    const fn = ALGO_FNS[algoId] ?? bubbleSort;
    return collectSteps(fn(input));
  }, [algoId, input]);

  const resetKey = useMemo(
    () => `${algoId}|${seed}|${size}`,
    [algoId, seed, size],
  );

  const playback = usePlayback(steps.length, resetKey, false);

  const currentStep =
    playback.cursor > 0 ? steps[playback.cursor - 1] : undefined;

  // Live counter: fold steps up to cursor
  const liveCounters = useMemo(() => {
    let cmp = 0;
    let wrt = 0;
    for (let i = 0; i < playback.cursor; i++) {
      const s = steps[i];
      if (!s) continue;
      if (s.compare) cmp++;
      if (s.write) wrt += s.write.length;
    }
    return { comparisons: cmp, writes: wrt };
  }, [steps, playback.cursor]);

  const totalCounters = result ?? { comparisons: 0, writes: 0 };
  const displayArray = currentStep?.array ?? input;

  const maxVal = Math.max(...displayArray, 1);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
        {/* Algorithm selector */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-500" htmlFor="algo-select">
            Algorithm
          </label>
          <select
            id="algo-select"
            value={algoId}
            onChange={(e) => setAlgoId(e.target.value as AlgoId)}
            className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200"
          >
            {SORT_META.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Array size */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-500" htmlFor="size-range">
            Array size: {size}
          </label>
          <input
            id="size-range"
            type="range"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-32 accent-sky-400"
          />
        </div>

        {/* Shuffle */}
        <button
          type="button"
          onClick={() => {
            playback.pause();
            setSeed((s) => s + 1);
          }}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-700"
        >
          Shuffle
        </button>

        {/* Counters */}
        <div className="ml-auto flex gap-4 font-mono text-xs text-zinc-500">
          <span>
            compare{" "}
            <span className="text-yellow-400">{liveCounters.comparisons}</span>
            {playback.cursor === steps.length && (
              <span className="text-zinc-600">
                {" "}
                / {totalCounters.comparisons}
              </span>
            )}
          </span>
          <span>
            write <span className="text-red-400">{liveCounters.writes}</span>
            {playback.cursor === steps.length && (
              <span className="text-zinc-600"> / {totalCounters.writes}</span>
            )}
          </span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="relative flex min-h-48 items-end gap-px overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 px-2 py-2">
        {Array.from(displayArray).map((val, position) => {
          const color = barColor(position, currentStep, input.length);
          const heightPct = (val / maxVal) * 100;
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: bars are positional slots — keying by index lets React animate value/color changes in place as the array reorders, rather than moving DOM nodes
              key={position}
              className={`flex-1 rounded-sm transition-all duration-75 ${color}`}
              style={{ height: `${heightPct}%`, minHeight: "2px" }}
              title={`[${position}] = ${val}`}
            />
          );
        })}
      </div>

      {/* Label */}
      {currentStep?.meta.label && (
        <p className="font-mono text-xs text-zinc-500">
          {currentStep.meta.label}
        </p>
      )}

      {/* Transport */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5">
        <button
          type="button"
          onClick={playback.playing ? playback.pause : playback.play}
          className="rounded-md bg-sky-600 px-4 py-1 font-medium text-sm text-white transition-colors hover:bg-sky-500"
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
          <span className="inline-block h-3 w-3 rounded-sm bg-yellow-400" />
          comparing
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-red-500" />
          writing
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-emerald-500" />
          sorted
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-zinc-600" />
          unsorted
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Big-O comparison table
// ---------------------------------------------------------------------------

export function ComplexityTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full font-mono text-sm">
        <thead className="bg-zinc-900 text-left text-zinc-400">
          <tr>
            <th className="px-4 py-2 font-sans">Algorithm</th>
            <th className="px-4 py-2">Best</th>
            <th className="px-4 py-2">Average</th>
            <th className="px-4 py-2">Worst</th>
            <th className="px-4 py-2">Space</th>
            <th className="px-4 py-2 font-sans">Stable</th>
            <th className="px-4 py-2 font-sans">In-place</th>
          </tr>
        </thead>
        <tbody>
          {SORT_META.map((m: SortMeta) => (
            <tr
              key={m.id}
              className="border-zinc-800/70 border-t text-zinc-300"
            >
              <td className="px-4 py-2 font-sans font-medium text-sky-300">
                {m.name}
              </td>
              <td className="px-4 py-2 text-emerald-400">{m.best}</td>
              <td className="px-4 py-2">{m.average}</td>
              <td className="px-4 py-2 text-red-400">{m.worst}</td>
              <td className="px-4 py-2 text-zinc-400">{m.space}</td>
              <td className="px-4 py-2">
                <span
                  className={m.stable ? "text-emerald-400" : "text-zinc-500"}
                >
                  {m.stable ? "yes" : "no"}
                </span>
              </td>
              <td className="px-4 py-2">
                <span
                  className={m.inPlace ? "text-emerald-400" : "text-zinc-500"}
                >
                  {m.inPlace ? "yes" : "no"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
