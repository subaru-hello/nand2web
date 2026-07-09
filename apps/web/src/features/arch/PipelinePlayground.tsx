import {
  type HazardMode,
  PIPELINE_PRESETS,
  type PipelineResult,
  type PipelineStep,
  runPipeline,
} from "@nand2web/arch";
import { collectSteps } from "@nand2web/sim-core";
import { useMemo, useState } from "react";
import { usePlayback } from "../playback/usePlayback";

const STAGE_NAMES = ["IF", "ID", "EX", "MEM", "WB"] as const;

const STAGE_COLORS: Record<string, string> = {
  IF: "bg-violet-900/60 text-violet-200",
  ID: "bg-blue-900/60 text-blue-200",
  EX: "bg-sky-900/60 text-sky-200",
  MEM: "bg-teal-900/60 text-teal-200",
  WB: "bg-emerald-900/60 text-emerald-200",
};

const BUBBLE_CLASS = "bg-zinc-800/50 text-zinc-600 italic";
const EMPTY_CLASS = "bg-transparent text-zinc-700";

export function PipelinePlayground() {
  const [presetId, setPresetId] = useState(PIPELINE_PRESETS[0]?.id ?? "");
  const [mode, setMode] = useState<HazardMode>("forwarding");

  const preset =
    PIPELINE_PRESETS.find((p) => p.id === presetId) ?? PIPELINE_PRESETS[0];
  const instructions = preset?.instructions ?? [];

  // Run both modes for comparison
  const { steps, result } = useMemo(() => {
    const { steps: s, result: r } = collectSteps(
      runPipeline(instructions, mode),
    );
    return {
      steps: s as PipelineStep[],
      result: r as PipelineResult | undefined,
    };
  }, [instructions, mode]);

  const altResult = useMemo(() => {
    const altMode: HazardMode = mode === "stall" ? "forwarding" : "stall";
    const { result: r } = collectSteps(runPipeline(instructions, altMode));
    return r as PipelineResult | undefined;
  }, [instructions, mode]);

  const resetKey = useMemo(() => `${presetId}|${mode}`, [presetId, mode]);
  const playback = usePlayback(steps.length, resetKey, false);

  // Accumulate all cycles up to cursor into a diagram grid
  // For the pipeline diagram: rows = instructions (by text), cols = cycles
  const allInstrTexts = useMemo(
    () => [...new Set(instructions.map((i) => i.text))],
    [instructions],
  );

  // Build grid: instrText -> {cycle -> stageLabel}
  const grid = useMemo(() => {
    const map = new Map<string, Map<number, string>>();
    for (const txt of allInstrTexts) map.set(txt, new Map());
    for (let i = 0; i < Math.min(playback.cursor, steps.length); i++) {
      const step = steps[i];
      if (!step) continue;
      for (const stage of STAGE_NAMES) {
        const label = step.stages[stage];
        if (label && label !== "bubble" && label !== undefined) {
          const row = map.get(label);
          if (row) row.set(step.cycle, stage);
        }
      }
    }
    return map;
  }, [steps, playback.cursor, allInstrTexts]);

  const currentStep =
    playback.cursor > 0 ? steps[playback.cursor - 1] : undefined;

  const maxCycle = useMemo(() => {
    return steps.reduce((m, s) => Math.max(m, s.cycle), 0);
  }, [steps]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {PIPELINE_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPresetId(p.id)}
              title={p.description}
              className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
                presetId === p.id
                  ? "border-sky-600 bg-sky-900/40 text-sky-200"
                  : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-sky-600"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900 p-0.5">
          {(["stall", "forwarding"] as HazardMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded px-2.5 py-1 font-mono text-xs transition-colors ${
                mode === m
                  ? "bg-zinc-700 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline diagram */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <p className="mb-2 font-mono text-xs text-zinc-500">
          Pipeline diagram — cycle × instruction
        </p>
        {maxCycle > 0 ? (
          <table className="border-separate border-spacing-0.5 font-mono text-xs">
            <thead>
              <tr>
                <th className="min-w-36 pr-2 text-right font-normal text-zinc-500">
                  instr
                </th>
                {Array.from({ length: maxCycle }, (_, i) => (
                  <th
                    // biome-ignore lint/suspicious/noArrayIndexKey: i is a stable cycle number
                    key={`cycle-${i + 1}`}
                    className={`w-12 text-center font-normal ${
                      currentStep?.cycle === i + 1
                        ? "text-sky-400"
                        : "text-zinc-600"
                    }`}
                  >
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allInstrTexts.map((txt) => {
                const row = grid.get(txt);
                return (
                  <tr key={txt}>
                    <td className="pr-2 text-right text-zinc-400">{txt}</td>
                    {Array.from({ length: maxCycle }, (_, i) => {
                      const stage = row?.get(i + 1);
                      return (
                        <td
                          // biome-ignore lint/suspicious/noArrayIndexKey: i is a stable cycle number
                          key={`cycle-${i + 1}`}
                          className={`rounded px-1 py-0.5 text-center ${
                            stage
                              ? (STAGE_COLORS[stage] ?? EMPTY_CLASS)
                              : EMPTY_CLASS
                          }`}
                        >
                          {stage ?? ""}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {/* Bubbles row */}
              {steps.some((s) =>
                Object.values(s.stages).includes("bubble"),
              ) && (
                <tr>
                  <td className="pr-2 text-right text-zinc-600 italic">
                    bubble
                  </td>
                  {Array.from({ length: maxCycle }, (_, i) => {
                    const step = steps.find((s) => s.cycle === i + 1);
                    const hasBubble = step
                      ? Object.values(step.stages).includes("bubble")
                      : false;
                    return (
                      <td
                        // biome-ignore lint/suspicious/noArrayIndexKey: i is a stable cycle number
                        key={`bubble-${i + 1}`}
                        className={`rounded px-1 py-0.5 text-center ${
                          hasBubble ? BUBBLE_CLASS : EMPTY_CLASS
                        }`}
                      >
                        {hasBubble ? "▪" : ""}
                      </td>
                    );
                  })}
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-zinc-500">Press play or step to begin.</p>
        )}
      </div>

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
          step {playback.cursor}/{playback.total}
        </span>
      </div>

      {/* Live counters */}
      {currentStep && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "cycle", value: currentStep.cycle },
            {
              label: "stall",
              value: steps
                .slice(0, playback.cursor)
                .filter((s) => s.stallInserted).length,
            },
            {
              label: "flush",
              value: steps.slice(0, playback.cursor).filter((s) => s.flushed)
                .length,
            },
            {
              label: "fwd",
              value: steps
                .slice(0, playback.cursor)
                .reduce((acc, s) => acc + s.forwards.length, 0),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-center"
            >
              <div className="font-mono text-2xl text-zinc-100">{value}</div>
              <div className="mt-0.5 font-mono text-xs text-zinc-500">
                {label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Final summary + mode comparison */}
      {result && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="mb-2 font-mono text-xs text-zinc-500">
            Summary — same program, both modes
          </p>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="text-left text-zinc-500">
                  <th className="pb-1 pr-4">mode</th>
                  <th className="pb-1 pr-4">cycles</th>
                  <th className="pb-1 pr-4">CPI</th>
                  <th className="pb-1 pr-4">stalls</th>
                  <th className="pb-1 pr-4">flushes</th>
                  <th className="pb-1">forwards</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    { label: mode, r: result, active: true },
                    {
                      label: mode === "stall" ? "forwarding" : "stall",
                      r: altResult,
                      active: false,
                    },
                  ] as const
                ).map(({ label, r: row, active }) => (
                  <tr
                    key={label}
                    className={active ? "text-zinc-100" : "text-zinc-500"}
                  >
                    <td className="py-0.5 pr-4">{label}</td>
                    <td className="py-0.5 pr-4">{row?.totalCycles ?? "—"}</td>
                    <td className="py-0.5 pr-4">
                      {row ? row.cpi.toFixed(2) : "—"}
                    </td>
                    <td className="py-0.5 pr-4">{row?.stallCount ?? "—"}</td>
                    <td className="py-0.5 pr-4">{row?.flushCount ?? "—"}</td>
                    <td className="py-0.5">{row?.forwardCount ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Current stage highlight */}
      {currentStep && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
          <p className="mb-2 font-mono text-xs text-zinc-500">
            Cycle {currentStep.cycle} — stage contents
          </p>
          <div className="flex flex-wrap gap-2">
            {STAGE_NAMES.map((stage) => {
              const label = currentStep.stages[stage];
              return (
                <div
                  key={stage}
                  className={`flex min-w-28 flex-col items-center rounded-lg border border-zinc-700 px-3 py-2 ${
                    label && label !== "bubble"
                      ? (STAGE_COLORS[stage] ?? "")
                      : label === "bubble"
                        ? "border-zinc-700/50 bg-zinc-800/30"
                        : "border-zinc-800/50 bg-transparent"
                  }`}
                >
                  <span className="font-mono text-xs text-zinc-500">
                    {stage}
                  </span>
                  <span className="mt-1 font-mono text-xs">
                    {label === "bubble"
                      ? "bubble"
                      : label === undefined
                        ? "—"
                        : label}
                  </span>
                </div>
              );
            })}
          </div>
          {currentStep.stallInserted && (
            <p className="mt-2 font-mono text-xs text-amber-400">
              ⚠ stall inserted this cycle
            </p>
          )}
          {currentStep.flushed && (
            <p className="mt-2 font-mono text-xs text-red-400">
              ✕ branch taken — IF+ID flushed
            </p>
          )}
          {currentStep.forwards.length > 0 && (
            <p className="mt-2 font-mono text-xs text-emerald-400">
              ↴ forward:{" "}
              {currentStep.forwards
                .map((f) => `${f.from}→r${f.toReg}`)
                .join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
