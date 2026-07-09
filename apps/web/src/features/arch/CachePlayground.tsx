import {
  CACHE_PRESETS,
  type CacheConfig,
  type CacheStep,
  generateTrace,
  runCache,
  type TraceKind,
} from "@nand2web/arch";
import { collectSteps } from "@nand2web/sim-core";
import React, { useMemo, useState } from "react";
import { usePlayback } from "../playback/usePlayback";

const TRACE_LENGTH = 32;

type Associativity = 1 | 2 | 4;

export function CachePlayground() {
  const [traceKind, setTraceKind] = useState<TraceKind>("sequential");
  const [lines, setLines] = useState(8);
  const [assoc, setAssoc] = useState<Associativity>(2);
  const [blockSize, setBlockSize] = useState(2);

  const config: CacheConfig = useMemo(
    () => ({ lines, associativity: assoc, blockSize, policy: "LRU" }),
    [lines, assoc, blockSize],
  );

  const trace = useMemo(
    () => generateTrace(traceKind, TRACE_LENGTH),
    [traceKind],
  );

  const { steps, result } = useMemo(() => {
    const { steps: s, result: r } = collectSteps(runCache(trace, config));
    return { steps: s as CacheStep[], result: r };
  }, [trace, config]);

  const resetKey = useMemo(
    () => `${traceKind}|${lines}|${assoc}|${blockSize}`,
    [traceKind, lines, assoc, blockSize],
  );
  const playback = usePlayback(steps.length, resetKey, false);

  const currentStep =
    playback.cursor > 0 ? steps[playback.cursor - 1] : undefined;

  // Compare 1/2/4-way hit rates for current trace & other config
  const hitRates = useMemo(() => {
    return ([1, 2, 4] as Associativity[]).map((a) => {
      const cfg: CacheConfig = {
        lines,
        associativity: a,
        blockSize,
        policy: "LRU",
      };
      const { result: r } = collectSteps(runCache(trace, cfg));
      return { assoc: a, hitRate: r?.hitRate ?? 0 };
    });
  }, [trace, lines, blockSize]);

  // Address bit widths
  const numSets = lines / assoc;
  const offsetBits = Math.log2(blockSize) | 0;
  const indexBits = Math.log2(numSets) | 0;
  const tagBits = Math.max(0, 8 - offsetBits - indexBits);

  return (
    <div className="space-y-4">
      {/* Trace preset */}
      <div className="flex flex-wrap gap-2">
        {CACHE_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setTraceKind(p.id)}
            title={p.description}
            className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
              traceKind === p.id
                ? "border-sky-600 bg-sky-900/40 text-sky-200"
                : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-sky-600"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Cache config */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 font-mono text-sm">
        <label className="flex items-center gap-2 text-zinc-400">
          lines
          <select
            value={lines}
            onChange={(e) => setLines(Number(e.target.value))}
            className="rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-zinc-200"
          >
            {[4, 8, 16].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-zinc-400">
          associativity
          <select
            value={assoc}
            onChange={(e) => setAssoc(Number(e.target.value) as Associativity)}
            className="rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-zinc-200"
          >
            <option value={1}>1-way (direct)</option>
            <option value={2}>2-way</option>
            <option value={4}>4-way</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-zinc-400">
          block size
          <select
            value={blockSize}
            onChange={(e) => setBlockSize(Number(e.target.value))}
            className="rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-zinc-200"
          >
            {[1, 2, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <span className="text-zinc-500 text-xs">
          {numSets} sets × {assoc} ways
        </span>
      </div>

      {/* Address breakdown legend */}
      <div className="flex items-center gap-1 font-mono text-xs">
        <span className="text-zinc-500">address bits:</span>
        <span className="rounded bg-amber-900/60 px-2 py-0.5 text-amber-200">
          tag [{tagBits}]
        </span>
        <span className="rounded bg-sky-900/60 px-2 py-0.5 text-sky-200">
          index [{indexBits}]
        </span>
        <span className="rounded bg-emerald-900/60 px-2 py-0.5 text-emerald-200">
          offset [{offsetBits}]
        </span>
      </div>

      {/* Current access display */}
      {currentStep ? (
        <div
          className={`rounded-xl border px-4 py-3 ${
            currentStep.hit
              ? "border-emerald-700/60 bg-emerald-950/40"
              : "border-red-700/60 bg-red-950/40"
          }`}
        >
          <div className="flex flex-wrap items-baseline gap-4">
            <span
              className={`font-mono text-lg font-semibold ${
                currentStep.hit ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {currentStep.hit ? "HIT" : "MISS"}
            </span>
            <span className="font-mono text-sm text-zinc-300">
              addr = {currentStep.address}
            </span>
            <span className="font-mono text-xs text-amber-300">
              tag={currentStep.breakdown.tag}
            </span>
            <span className="font-mono text-xs text-sky-300">
              idx={currentStep.breakdown.index}
            </span>
            <span className="font-mono text-xs text-emerald-300">
              off={currentStep.breakdown.offset}
            </span>
            {currentStep.evictedTag !== undefined && (
              <span className="font-mono text-xs text-zinc-500">
                evicted tag={currentStep.evictedTag}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 px-4 py-3 font-mono text-sm text-zinc-500">
          Press play or step to begin.
        </div>
      )}

      {/* Cache set visualization */}
      {currentStep && (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-3">
          <p className="mb-2 font-mono text-xs text-zinc-500">
            Cache sets (after step {playback.cursor})
          </p>
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${assoc + 1}, auto)` }}
          >
            {/* Header */}
            <div className="font-mono text-xs text-zinc-600">set</div>
            {Array.from({ length: assoc }, (_, w) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: w is a stable way index
                key={`way-hdr-${w}`}
                className="font-mono text-xs text-zinc-600 text-center"
              >
                way {w}
              </div>
            ))}
            {/* Rows */}
            {currentStep.sets.map((set, setIdx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: setIdx is a stable cache set index
              <React.Fragment key={setIdx}>
                <div
                  className={`font-mono text-xs ${
                    setIdx === currentStep.breakdown.index
                      ? "text-sky-400"
                      : "text-zinc-500"
                  }`}
                >
                  [{setIdx}]
                </div>
                {set.map((line, wayIdx) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: wayIdx is a stable way index
                    key={`set-${setIdx}-way-${wayIdx}`}
                    className={`min-w-16 rounded px-2 py-0.5 text-center font-mono text-xs ${
                      !line.valid
                        ? "bg-zinc-900 text-zinc-700"
                        : setIdx === currentStep.breakdown.index &&
                            line.tag === currentStep.breakdown.tag &&
                            currentStep.hit
                          ? "bg-emerald-900/70 text-emerald-300"
                          : setIdx === currentStep.breakdown.index &&
                              !currentStep.hit &&
                              currentStep.evictedTag === line.tag
                            ? "bg-red-900/60 text-red-300"
                            : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {line.valid ? `t=${line.tag}` : "invalid"}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
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
          onClick={playback.stepForward}
          className="rounded-md bg-zinc-800 px-3 py-1 font-mono text-sm text-zinc-200 hover:bg-zinc-700"
        >
          step
        </button>
        <button
          type="button"
          onClick={playback.restart}
          className="rounded-md bg-zinc-800 px-3 py-1 font-mono text-sm text-zinc-200 hover:bg-zinc-700"
        >
          restart
        </button>
        <input
          type="range"
          min={0}
          max={playback.total}
          value={playback.cursor}
          onChange={(e) => playback.seek(Number(e.target.value))}
          className="min-w-32 flex-1 accent-sky-400"
          aria-label="Playback position"
        />
        <span className="font-mono text-xs text-zinc-500">
          {playback.cursor}/{playback.total} accesses
        </span>
      </div>

      {/* Hit rate stats */}
      {result && (
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Current config stats */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <p className="mb-2 font-mono text-xs text-zinc-500">
              Current config
            </p>
            <div className="flex flex-wrap gap-4 font-mono">
              <div>
                <div className="text-2xl text-zinc-100">
                  {(result.hitRate * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-zinc-500">hit rate</div>
              </div>
              <div>
                <div className="text-2xl text-emerald-400">{result.hits}</div>
                <div className="text-xs text-zinc-500">hits</div>
              </div>
              <div>
                <div className="text-2xl text-red-400">{result.misses}</div>
                <div className="text-xs text-zinc-500">misses</div>
              </div>
            </div>
          </div>

          {/* Associativity comparison bar */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <p className="mb-3 font-mono text-xs text-zinc-500">
              Hit rate by associativity (same trace & config)
            </p>
            <div className="space-y-2">
              {hitRates.map(({ assoc: a, hitRate }) => (
                <div key={a} className="flex items-center gap-2">
                  <span
                    className={`w-16 font-mono text-xs ${a === assoc ? "text-sky-300" : "text-zinc-500"}`}
                  >
                    {a}-way
                  </span>
                  <div className="flex-1 rounded-full bg-zinc-800">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        a === assoc ? "bg-sky-500" : "bg-zinc-600"
                      }`}
                      style={{ width: `${Math.max(2, hitRate * 100)}%` }}
                    />
                  </div>
                  <span className="w-12 font-mono text-xs text-right text-zinc-400">
                    {(hitRate * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
