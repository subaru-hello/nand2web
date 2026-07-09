import {
  ALGORITHM_META,
  type GanttEntry,
  PROCESS_PRESETS,
  type ProcessSpec,
  type SchedulingAlgorithm,
  type SchedulingResult,
  simulate,
} from "@nand2web/os";
import { collectSteps } from "@nand2web/sim-core";
import { useMemo, useState } from "react";
import { usePlayback } from "../playback/usePlayback";

// ---------------------------------------------------------------------------
// Colour palette for processes
// ---------------------------------------------------------------------------

const PROC_COLOURS: readonly string[] = [
  "bg-sky-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
];

const PROC_TEXT_COLOURS: readonly string[] = [
  "text-sky-400",
  "text-emerald-400",
  "text-violet-400",
  "text-amber-400",
  "text-rose-400",
];

function procColour(idx: number): string {
  return PROC_COLOURS[idx % PROC_COLOURS.length] ?? "bg-zinc-500";
}

function procTextColour(idx: number): string {
  return PROC_TEXT_COLOURS[idx % PROC_TEXT_COLOURS.length] ?? "text-zinc-400";
}

// ---------------------------------------------------------------------------
// Gantt chart
// ---------------------------------------------------------------------------

function GanttChart({
  gantt,
  cursor,
  processes,
}: {
  gantt: readonly GanttEntry[];
  cursor: number;
  processes: readonly ProcessSpec[];
}) {
  const visible = gantt.slice(0, cursor);
  if (visible.length === 0) {
    return (
      <div className="flex h-10 items-center rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 text-xs text-zinc-500">
        press play to start
      </div>
    );
  }

  const procIndex = new Map(processes.map((p, i) => [p.id, i]));

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-0 items-stretch rounded-lg overflow-hidden border border-zinc-800">
        {visible.map((entry, i) => {
          const idx = entry.id !== null ? (procIndex.get(entry.id) ?? -1) : -1;
          const colour = entry.id === null ? "bg-zinc-700" : procColour(idx);
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: gantt slots are positional time units; index is semantically correct
              key={i}
              title={entry.id ?? "idle"}
              className={`relative flex h-10 min-w-[20px] flex-1 items-center justify-center border-r border-zinc-900/50 font-mono text-[10px] text-white ${colour}`}
            >
              {entry.id ?? "·"}
            </div>
          );
        })}
      </div>
      {/* Time axis */}
      <div className="flex text-[10px] text-zinc-600 mt-0.5">
        {visible.map((entry, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: time axis labels are positional
          <div key={i} className="flex-1 min-w-[20px] text-center">
            {i % 5 === 0 ? entry.time : ""}
          </div>
        ))}
        <div className="min-w-[20px] text-center">
          {visible[visible.length - 1] !== undefined
            ? visible[visible.length - 1]!.time + 1
            : ""}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Results table
// ---------------------------------------------------------------------------

function ResultsTable({
  processes: specs,
  result,
}: {
  processes: readonly ProcessSpec[];
  result: SchedulingResult;
}) {
  const specMap = new Map(specs.map((p) => [p.id, p]));
  const procIndex = new Map(specs.map((p, i) => [p.id, i]));
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full font-mono text-sm">
        <thead className="bg-zinc-900 text-left text-zinc-400 text-xs">
          <tr>
            <th className="px-3 py-2">Process</th>
            <th className="px-3 py-2">Arrival</th>
            <th className="px-3 py-2">Burst</th>
            <th className="px-3 py-2">Waiting</th>
            <th className="px-3 py-2">Turnaround</th>
            <th className="px-3 py-2">Response</th>
          </tr>
        </thead>
        <tbody>
          {result.processes.map((pr) => {
            const spec = specMap.get(pr.id);
            const idx = procIndex.get(pr.id) ?? 0;
            return (
              <tr
                key={pr.id}
                className="border-zinc-800 border-t text-zinc-300"
              >
                <td
                  className={`px-3 py-1.5 font-semibold ${procTextColour(idx)}`}
                >
                  {pr.id}
                </td>
                <td className="px-3 py-1.5">{spec?.arrival ?? "-"}</td>
                <td className="px-3 py-1.5">{spec?.burst ?? "-"}</td>
                <td className="px-3 py-1.5">{pr.waiting}</td>
                <td className="px-3 py-1.5">{pr.turnaround}</td>
                <td className="px-3 py-1.5">{pr.response}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-zinc-800 border-t text-zinc-400 text-xs">
            <td colSpan={3} className="px-3 py-1.5 text-right">
              avg:
            </td>
            <td className="px-3 py-1.5">{result.avgWaiting.toFixed(1)}</td>
            <td className="px-3 py-1.5">{result.avgTurnaround.toFixed(1)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Comparison bar chart (all 4 algorithms, same input)
// ---------------------------------------------------------------------------

function AlgoComparison({
  processes,
  quantum,
}: {
  processes: readonly ProcessSpec[];
  quantum: number;
}) {
  const results = useMemo(() => {
    const algs: SchedulingAlgorithm[] = ["FCFS", "SJF", "RR", "MLFQ"];
    return algs.map((alg) => {
      const { result } = collectSteps(
        simulate({ processes, algorithm: alg, quantum }),
      );
      return { alg, avg: result?.avgWaiting ?? 0 };
    });
  }, [processes, quantum]);

  const max = Math.max(...results.map((r) => r.avg), 1);

  const barColours: Record<SchedulingAlgorithm, string> = {
    FCFS: "bg-sky-600",
    SJF: "bg-emerald-600",
    RR: "bg-violet-600",
    MLFQ: "bg-amber-600",
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <h3 className="mb-3 font-medium text-sm text-zinc-400">
        Average waiting time comparison (same workload)
      </h3>
      <div className="space-y-2">
        {results.map(({ alg, avg }) => (
          <div key={alg} className="flex items-center gap-3">
            <span className="w-12 font-mono text-xs text-zinc-400">{alg}</span>
            <div className="relative flex-1 h-5 bg-zinc-800 rounded overflow-hidden">
              <div
                className={`h-full ${barColours[alg]} rounded transition-all duration-300`}
                style={{ width: `${(avg / max) * 100}%` }}
              />
            </div>
            <span className="w-12 font-mono text-xs text-zinc-300 text-right">
              {avg.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Algorithm metadata table
// ---------------------------------------------------------------------------

function AlgoMetaTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full font-mono text-sm">
        <thead className="bg-zinc-900 text-left text-zinc-400 text-xs">
          <tr>
            <th className="px-3 py-2">Algorithm</th>
            <th className="px-3 py-2">Preemptive</th>
            <th className="px-3 py-2">Starvation</th>
            <th className="px-3 py-2 font-sans">Notes</th>
          </tr>
        </thead>
        <tbody>
          {ALGORITHM_META.map((m) => (
            <tr key={m.id} className="border-zinc-800 border-t text-zinc-300">
              <td className="px-3 py-1.5 text-sky-400">{m.id}</td>
              <td className="px-3 py-1.5">{m.preemptive ? "yes" : "no"}</td>
              <td className="px-3 py-1.5">{m.starvation ? "yes" : "no"}</td>
              <td className="px-3 py-1.5 font-sans text-zinc-400 text-xs">
                {m.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Process editor
// ---------------------------------------------------------------------------

function ProcessEditor({
  processes,
  onChange,
}: {
  processes: ProcessSpec[];
  onChange: (procs: ProcessSpec[]) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full font-mono text-sm">
        <thead className="bg-zinc-900 text-xs text-zinc-400">
          <tr>
            <th className="px-3 py-2 text-left">ID</th>
            <th className="px-3 py-2 text-left">Arrival</th>
            <th className="px-3 py-2 text-left">Burst</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p, i) => (
            <tr key={p.id} className="border-zinc-800 border-t">
              <td className="px-3 py-1">{p.id}</td>
              <td className="px-3 py-1">
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={p.arrival}
                  onChange={(e) => {
                    const next = [...processes];
                    next[i] = {
                      ...p,
                      arrival: Math.max(0, Number(e.target.value)),
                    };
                    onChange(next);
                  }}
                  className="w-16 rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-zinc-200 focus:border-sky-600 focus:outline-none"
                />
              </td>
              <td className="px-3 py-1">
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={p.burst}
                  onChange={(e) => {
                    const next = [...processes];
                    next[i] = {
                      ...p,
                      burst: Math.max(1, Number(e.target.value)),
                    };
                    onChange(next);
                  }}
                  className="w-16 rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-zinc-200 focus:border-sky-600 focus:outline-none"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main playground
// ---------------------------------------------------------------------------

export function SchedulerPlayground() {
  const [preset, setPreset] = useState<string>(PROCESS_PRESETS[0]?.id ?? "");
  const [processes, setProcesses] = useState<ProcessSpec[]>([
    ...(PROCESS_PRESETS[0]?.processes ?? []),
  ]);
  const [algorithm, setAlgorithm] = useState<SchedulingAlgorithm>("FCFS");
  const [quantum, setQuantum] = useState(2);

  const simulation = useMemo(() => {
    const { steps, result } = collectSteps(
      simulate({ processes, algorithm, quantum }),
    );
    return { steps, result: result! };
  }, [processes, algorithm, quantum]);

  const resetKey = useMemo(
    () =>
      `${processes.map((p) => `${p.id}:${p.arrival}:${p.burst}`).join("|")}|${algorithm}|${quantum}`,
    [processes, algorithm, quantum],
  );

  const playback = usePlayback(simulation.steps.length, resetKey, false);
  const step =
    playback.cursor > 0 ? simulation.steps[playback.cursor - 1] : undefined;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1">
          <span className="text-xs text-zinc-500">Preset</span>
          <div className="flex gap-2 flex-wrap">
            {PROCESS_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPreset(p.id);
                  setProcesses([...p.processes]);
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
          <div className="flex gap-2 flex-wrap">
            {(["FCFS", "SJF", "RR", "MLFQ"] as SchedulingAlgorithm[]).map(
              (alg) => (
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
              ),
            )}
          </div>
        </div>

        {algorithm === "RR" && (
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            Quantum
            <input
              type="range"
              min={1}
              max={6}
              value={quantum}
              onChange={(e) => setQuantum(Number(e.target.value))}
              className="accent-violet-400"
            />
            <span className="w-4 font-mono text-zinc-200">{quantum}</span>
          </label>
        )}
      </div>

      {/* Process editor */}
      <ProcessEditor
        processes={processes}
        onChange={(procs) => {
          setPreset("");
          setProcesses(procs);
        }}
      />

      {/* Gantt chart */}
      <GanttChart
        gantt={simulation.result.gantt}
        cursor={playback.cursor}
        processes={processes}
      />

      {/* Ready queue indicator */}
      {step && (
        <div className="flex gap-3 items-center text-sm">
          <span className="text-zinc-500 text-xs">ready queue:</span>
          <div className="flex gap-1.5 flex-wrap">
            {step.readyQueue.length === 0 ? (
              <span className="text-xs text-zinc-600">empty</span>
            ) : (
              step.readyQueue.map((id) => {
                const idx = processes.findIndex((p) => p.id === id);
                return (
                  <span
                    key={id}
                    className={`rounded px-2 py-0.5 font-mono text-xs text-white ${procColour(idx)}`}
                  >
                    {id}
                  </span>
                );
              })
            )}
          </div>
          {step.running && (
            <span className="text-xs text-zinc-500">
              running:{" "}
              <span className="text-zinc-200 font-mono">{step.running}</span>
            </span>
          )}
        </div>
      )}

      {/* MLFQ queue display */}
      {step?.mlfqQueues && (
        <div className="flex gap-4 text-xs">
          {step.mlfqQueues.map((q, lvl) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: lvl is the queue level (0,1,2) — stable positional index
            <div key={lvl} className="space-y-0.5">
              <div className="text-zinc-500">
                Q{lvl} (q={[1, 2, 4][lvl]})
              </div>
              <div className="flex gap-1">
                {q.length === 0 ? (
                  <span className="text-zinc-700">—</span>
                ) : (
                  q.map((id) => {
                    const idx = processes.findIndex((p) => p.id === id);
                    return (
                      <span
                        key={id}
                        className={`rounded px-1.5 py-0.5 font-mono text-white ${procColour(idx)}`}
                      >
                        {id}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
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
          t={step?.time ?? 0} · step {playback.cursor}/{playback.total}
        </span>
      </div>

      {/* Results table — shown after full run or any step */}
      {playback.cursor > 0 && (
        <ResultsTable processes={processes} result={simulation.result} />
      )}

      {/* Comparison bars */}
      <AlgoComparison processes={processes} quantum={quantum} />

      {/* Algorithm comparison table */}
      <AlgoMetaTable />
    </div>
  );
}
