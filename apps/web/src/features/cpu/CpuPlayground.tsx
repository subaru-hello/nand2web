import type { CpuStep, DatapathNode } from "@nand2web/cpu";
import { assemble, initialState, run, SAMPLE_PROGRAMS } from "@nand2web/cpu";
import { collectSteps } from "@nand2web/sim-core";
import { useMemo, useState } from "react";
import { usePlayback } from "../playback/usePlayback";
import { Datapath } from "./Datapath";

const MAX_CYCLES = 96; // 3 steps per cycle → playback stays scrubbable

export function CpuPlayground() {
  const [source, setSource] = useState<string>(
    SAMPLE_PROGRAMS[0]?.source ?? "",
  );
  const [input, setInput] = useState(0);

  const assembled = useMemo(() => assemble(source), [source]);

  const simulation = useMemo(() => {
    if (!assembled.ok) {
      return undefined;
    }
    const { steps, truncated } = collectSteps(
      run(assembled.program, { input, maxCycles: MAX_CYCLES }),
    );
    return { steps: steps as readonly CpuStep[], truncated };
  }, [assembled, input]);

  const resetKey = useMemo(
    () => (assembled.ok ? `${assembled.program.join(",")}|${input}` : "err"),
    [assembled, input],
  );
  const playback = usePlayback(simulation?.steps.length ?? 0, resetKey, false);

  const step =
    playback.cursor > 0 ? simulation?.steps[playback.cursor - 1] : undefined;
  const state = step?.state ?? initialState(input);
  const active = new Set<DatapathNode>(step?.active ?? []);
  const phase = step?.type ?? "idle";
  const currentByte =
    step?.type === "fetch"
      ? step.byte
      : step && "instr" in step
        ? step.instr.byte
        : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(280px,360px)_1fr]">
        {/* Editor pane */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROGRAMS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => setSource(sample.source)}
                title={sample.description}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 font-mono text-xs text-zinc-300 transition-colors hover:border-sky-600"
              >
                {sample.name}
              </button>
            ))}
          </div>
          <textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            rows={18}
            spellCheck={false}
            aria-label="Assembly source"
            className="w-full resize-y rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-[13px] text-zinc-200 leading-5 focus:border-sky-700 focus:outline-none"
          />
          {!assembled.ok && (
            <ul className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 font-mono text-red-300 text-xs">
              {assembled.errors.map((e) => (
                <li key={`${e.line}:${e.message}`}>
                  line {e.line}: {e.message}
                </li>
              ))}
            </ul>
          )}
          <label className="flex items-center gap-3 text-sm text-zinc-400">
            IN port
            <input
              type="range"
              min={0}
              max={15}
              value={input}
              onChange={(e) => setInput(Number(e.target.value))}
              className="flex-1 accent-emerald-400"
            />
            <span className="w-6 font-mono text-zinc-200">{input}</span>
          </label>
        </div>

        {/* Machine pane */}
        <div>
          <Datapath
            state={state}
            program={assembled.ok ? assembled.program : []}
            active={active}
            phase={phase}
            currentByte={currentByte}
          />
        </div>
      </div>

      {/* Transport */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5">
        <button
          type="button"
          onClick={playback.playing ? playback.pause : playback.play}
          disabled={!simulation || simulation.steps.length === 0}
          className="rounded-md bg-sky-600 px-4 py-1 font-medium text-sm text-white transition-colors hover:bg-sky-500 disabled:opacity-40"
        >
          {playback.playing ? "pause" : "run"}
        </button>
        <button
          type="button"
          onClick={playback.stepForward}
          disabled={!simulation}
          className="rounded-md bg-zinc-800 px-3 py-1 font-mono text-sm text-zinc-200 hover:bg-zinc-700 disabled:opacity-40"
        >
          step
        </button>
        <input
          type="range"
          min={0}
          max={playback.total}
          value={playback.cursor}
          onChange={(e) => playback.seek(Number(e.target.value))}
          className="min-w-40 flex-1 accent-sky-400"
          aria-label="Execution position"
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
          </select>
        </label>
        <span className="font-mono text-xs text-zinc-500">
          {phase === "idle" ? "ready" : phase} · step {playback.cursor}/
          {playback.total}
          {simulation?.truncated ? " (window)" : ""}
        </span>
      </div>
    </div>
  );
}
