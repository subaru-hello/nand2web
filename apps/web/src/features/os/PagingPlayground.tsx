import {
  PAGING_PRESETS,
  type PageAlgorithm,
  type PagingResult,
  type PagingStep,
  simulatePaging,
  translateAddress,
} from "@nand2web/os";
import { collectSteps } from "@nand2web/sim-core";
import { useMemo, useState } from "react";
import { usePlayback } from "../playback/usePlayback";

// ---------------------------------------------------------------------------
// Frame display
// ---------------------------------------------------------------------------

function FrameBox({
  page,
  hit,
  evicted,
  usesBit,
  isHand,
}: {
  page: number | null;
  hit: boolean;
  evicted: boolean;
  usesBit?: boolean;
  isHand: boolean;
}) {
  const base =
    "relative flex flex-col items-center justify-center rounded-lg border-2 h-14 w-14 font-mono text-lg font-bold transition-all duration-200";
  const colour =
    page === null
      ? "border-zinc-700 bg-zinc-900 text-zinc-700"
      : hit
        ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
        : evicted
          ? "border-red-500 bg-red-500/20 text-red-300"
          : "border-zinc-600 bg-zinc-900 text-zinc-200";

  return (
    <div className={`${base} ${colour}`}>
      {page !== null ? page : "·"}
      {usesBit !== undefined && (
        <span
          className={`absolute right-1 top-0.5 text-[10px] ${usesBit ? "text-emerald-400" : "text-zinc-600"}`}
        >
          {usesBit ? "1" : "0"}
        </span>
      )}
      {isHand && (
        <span className="absolute -bottom-4 text-xs text-amber-400">▲</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fault/hit history strip
// ---------------------------------------------------------------------------

function AccessHistory({
  steps,
  cursor,
}: {
  steps: readonly PagingStep[];
  cursor: number;
}) {
  const visible = steps.slice(0, cursor);
  if (visible.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((step, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: access history is append-only; index is stable
          key={i}
          className={`rounded px-1.5 py-0.5 font-mono text-xs ${
            step.hit
              ? "bg-emerald-900/50 text-emerald-300"
              : "bg-red-900/50 text-red-300"
          }`}
        >
          {step.access}
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fault comparison (3 algorithms)
// ---------------------------------------------------------------------------

function AlgoFaultComparison({
  referenceString,
  frameCount,
}: {
  referenceString: readonly number[];
  frameCount: number;
}) {
  const results = useMemo((): { alg: PageAlgorithm; res: PagingResult }[] => {
    return (["FIFO", "LRU", "Clock"] as PageAlgorithm[]).map((alg) => {
      const { result } = collectSteps(
        simulatePaging({ referenceString, frameCount, algorithm: alg }),
      );
      return { alg, res: result! };
    });
  }, [referenceString, frameCount]);

  const maxFaults = Math.max(...results.map((r) => r.res.faults), 1);
  const colours: Record<PageAlgorithm, string> = {
    FIFO: "bg-sky-600",
    LRU: "bg-emerald-600",
    Clock: "bg-amber-600",
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <h3 className="mb-3 font-medium text-sm text-zinc-400">
        Page fault comparison (same reference string)
      </h3>
      <div className="space-y-2">
        {results.map(({ alg, res }) => (
          <div key={alg} className="flex items-center gap-3">
            <span className="w-14 font-mono text-xs text-zinc-400">{alg}</span>
            <div className="relative flex-1 h-5 bg-zinc-800 rounded overflow-hidden">
              <div
                className={`h-full ${colours[alg]} rounded transition-all`}
                style={{ width: `${(res.faults / maxFaults) * 100}%` }}
              />
            </div>
            <span className="w-24 font-mono text-xs text-zinc-300 text-right">
              {res.faults} faults / {res.hits} hits
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Virtual address translator (static)
// ---------------------------------------------------------------------------

function AddressTranslator({ frameCount }: { frameCount: number }) {
  const [virtualAddr, setVirtualAddr] = useState(13);
  const [pageSize, setPageSize] = useState(4);
  // Simple dummy page table: frame[i] = i (identity-mapped for demo)
  const pageTable = useMemo(
    () => Array.from({ length: 16 }, (_, i) => (i < frameCount ? i : null)),
    [frameCount],
  );

  const result = useMemo(
    () => translateAddress(virtualAddr, pageSize, pageTable),
    [virtualAddr, pageSize, pageTable],
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-4">
      <h3 className="font-medium text-sm text-zinc-400">
        Page table walk — address decomposition
      </h3>
      <div className="flex flex-wrap gap-4 items-end">
        <label className="flex flex-col gap-1 text-xs text-zinc-500">
          Virtual address
          <input
            type="number"
            min={0}
            max={63}
            value={virtualAddr}
            onChange={(e) =>
              setVirtualAddr(Math.max(0, Number(e.target.value)))
            }
            className="w-24 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 font-mono text-zinc-200 focus:border-sky-600 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-zinc-500">
          Page size
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="rounded border border-zinc-700 bg-zinc-950 px-2 py-1 font-mono text-zinc-200 focus:outline-none"
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={8}>8</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 font-mono text-sm">
        <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-3 space-y-1">
          <div className="text-xs text-zinc-500 mb-2">
            Virtual address breakdown
          </div>
          <div>
            <span className="text-zinc-500">virtual addr: </span>
            <span className="text-zinc-100">{result.virtualAddress}</span>
          </div>
          <div>
            <span className="text-zinc-500">page number: </span>
            <span className="text-sky-300">{result.pageNumber}</span>
          </div>
          <div>
            <span className="text-zinc-500">offset: </span>
            <span className="text-emerald-300">{result.offset}</span>
          </div>
          <div className="text-zinc-700 text-xs mt-1">
            {result.virtualAddress} = {result.pageNumber} × {result.pageSize} +{" "}
            {result.offset}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-3 space-y-1">
          <div className="text-xs text-zinc-500 mb-2">Page table lookup</div>
          <div>
            <span className="text-zinc-500">page[{result.pageNumber}] → </span>
            {result.frameNumber !== null ? (
              <span className="text-amber-300">frame {result.frameNumber}</span>
            ) : (
              <span className="text-red-400">not mapped</span>
            )}
          </div>
          {!result.pageFault && result.physicalAddress !== null && (
            <>
              <div>
                <span className="text-zinc-500">physical addr: </span>
                <span className="text-zinc-100">{result.physicalAddress}</span>
              </div>
              <div className="text-zinc-700 text-xs mt-1">
                {result.frameNumber} × {result.pageSize} + {result.offset} ={" "}
                {result.physicalAddress}
              </div>
            </>
          )}
          {result.pageFault && (
            <div className="text-red-400 text-xs mt-1">PAGE FAULT</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main playground
// ---------------------------------------------------------------------------

export function PagingPlayground() {
  const [preset, setPreset] = useState<string>(PAGING_PRESETS[0]?.id ?? "");
  const [referenceString, setReferenceString] = useState<number[]>([
    ...(PAGING_PRESETS[0]?.referenceString ?? []),
  ]);
  const [rawInput, setRawInput] = useState(
    PAGING_PRESETS[0]?.referenceString.join(" ") ?? "",
  );
  const [frameCount, setFrameCount] = useState(
    PAGING_PRESETS[0]?.defaultFrameCount ?? 3,
  );
  const [algorithm, setAlgorithm] = useState<PageAlgorithm>("FIFO");

  const simulation = useMemo(() => {
    const { steps, result } = collectSteps(
      simulatePaging({ referenceString, frameCount, algorithm }),
    );
    return { steps, result: result! };
  }, [referenceString, frameCount, algorithm]);

  const resetKey = useMemo(
    () => `${referenceString.join(",")}|${frameCount}|${algorithm}`,
    [referenceString, frameCount, algorithm],
  );

  const playback = usePlayback(simulation.steps.length, resetKey, false);
  const stepIdx = playback.cursor > 0 ? playback.cursor - 1 : -1;
  const step: PagingStep | undefined =
    stepIdx >= 0 ? simulation.steps[stepIdx] : undefined;

  const parseRefString = (raw: string) => {
    const nums = raw
      .split(/[\s,]+/)
      .map((s) => Number.parseInt(s, 10))
      .filter((n) => !Number.isNaN(n) && n >= 0);
    return nums;
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1">
          <span className="text-xs text-zinc-500">Preset</span>
          <div className="flex gap-2 flex-wrap">
            {PAGING_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPreset(p.id);
                  setReferenceString([...p.referenceString]);
                  setRawInput(p.referenceString.join(" "));
                  setFrameCount(p.defaultFrameCount);
                }}
                className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
                  preset === p.id
                    ? "border-sky-600 bg-sky-900/30 text-sky-300"
                    : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-sky-700"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-zinc-500">Algorithm</span>
          <div className="flex gap-2">
            {(["FIFO", "LRU", "Clock"] as PageAlgorithm[]).map((alg) => (
              <button
                key={alg}
                type="button"
                onClick={() => setAlgorithm(alg)}
                className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
                  algorithm === alg
                    ? "border-violet-600 bg-violet-900/30 text-violet-300"
                    : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-violet-700"
                }`}
              >
                {alg}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-400">
          Frames
          <input
            type="range"
            min={2}
            max={5}
            value={frameCount}
            onChange={(e) => setFrameCount(Number(e.target.value))}
            className="accent-sky-400"
          />
          <span className="w-4 font-mono text-zinc-200">{frameCount}</span>
        </label>
      </div>

      {/* Reference string input */}
      <label className="block space-y-1">
        <span className="text-xs text-zinc-500">
          Reference string (space or comma separated)
        </span>
        <input
          type="text"
          value={rawInput}
          onChange={(e) => {
            setRawInput(e.target.value);
            const parsed = parseRefString(e.target.value);
            if (parsed.length > 0) {
              setReferenceString(parsed);
              setPreset("");
            }
          }}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 font-mono text-sm text-zinc-200 focus:border-sky-600 focus:outline-none"
          placeholder="1 2 3 4 1 2 5 ..."
        />
      </label>

      {/* Frame visualisation */}
      <div className="space-y-2">
        <div className="text-xs text-zinc-500">
          Frames{" "}
          {step && (
            <span className={step.hit ? "text-emerald-400" : "text-red-400"}>
              — {step.hit ? "HIT" : "FAULT"}
              {step.evicted !== undefined ? ` (evicted ${step.evicted})` : ""}
            </span>
          )}
        </div>
        <div className="flex gap-3 items-end">
          {Array.from({ length: frameCount }, (_, i) => {
            const page = step?.frames[i] ?? null;
            const prevStep =
              stepIdx > 0 ? simulation.steps[stepIdx - 1] : undefined;
            const prevPage = prevStep?.frames[i] ?? null;
            const evicted =
              step !== undefined &&
              !step.hit &&
              step.evicted !== undefined &&
              prevPage === step.evicted &&
              page !== prevPage;

            const usesBit = step?.useBits?.[i];
            return (
              <FrameBox
                // biome-ignore lint/suspicious/noArrayIndexKey: frame slots are positional, index is semantically stable
                key={i}
                page={page}
                hit={step?.hit === true && page === step.access}
                evicted={evicted}
                {...(usesBit !== undefined ? { usesBit } : {})}
                isHand={step?.clockHand === i && algorithm === "Clock"}
              />
            );
          })}
        </div>
      </div>

      {/* Access history */}
      <div className="space-y-1">
        <div className="text-xs text-zinc-500">Access history</div>
        <AccessHistory steps={simulation.steps} cursor={playback.cursor} />
      </div>

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
          onClick={playback.stepForward}
          disabled={playback.cursor >= playback.total}
          className="rounded-md bg-zinc-800 px-3 py-1 font-mono text-sm text-zinc-200 hover:bg-zinc-700 disabled:opacity-40"
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
          className="min-w-40 flex-1 accent-sky-400"
          aria-label="Simulation position"
        />
        <span className="font-mono text-xs text-zinc-500">
          step {playback.cursor}/{playback.total}
          {playback.cursor > 0 && (
            <>
              {" "}
              ·{" "}
              {
                simulation.steps.filter((s, i) => i < playback.cursor && !s.hit)
                  .length
              }{" "}
              faults so far
            </>
          )}
        </span>
      </div>

      {/* Full run summary */}
      {playback.cursor >= playback.total && playback.total > 0 && (
        <div className="flex gap-4 text-sm font-mono">
          <span className="text-emerald-400">
            hits: {simulation.result.hits}
          </span>
          <span className="text-red-400">
            faults: {simulation.result.faults}
          </span>
          <span className="text-zinc-500">
            hit rate:{" "}
            {(
              (simulation.result.hits /
                (simulation.result.hits + simulation.result.faults)) *
              100
            ).toFixed(1)}
            %
          </span>
        </div>
      )}

      {/* Algorithm comparison */}
      <AlgoFaultComparison
        referenceString={referenceString}
        frameCount={frameCount}
      />

      {/* Address translator */}
      <AddressTranslator frameCount={frameCount} />
    </div>
  );
}
