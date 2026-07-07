import type {
  Bit,
  Circuit,
  SignalStep,
  WireId,
  WireState,
} from "@nand2web/logic";
import { simulate } from "@nand2web/logic";
import { collectSteps } from "@nand2web/sim-core";
import { useMemo, useRef, useState } from "react";
import { usePlayback } from "../playback/usePlayback";
import { CircuitDiagram } from "./CircuitDiagram";
import { layoutCircuit } from "./layout";

interface Run {
  readonly id: number;
  readonly base: WireState;
  readonly steps: readonly SignalStep[];
  readonly final: WireState;
}

interface CircuitPlaygroundProps {
  circuit: Circuit;
  /** Input labels grouped into a decimal-annotated bus, e.g. ["a0","a1","a2","a3"]. */
  buses?: ReadonlyArray<{ name: string; labels: readonly string[] }>;
  caption?: string;
}

function propagate(
  circuit: Circuit,
  inputs: Record<WireId, Bit>,
  previous: WireState | undefined,
  id: number,
): Run {
  const base = new Map<WireId, Bit>(previous ?? []);
  for (const [wire, value] of Object.entries(inputs)) {
    base.set(wire, value);
  }
  for (const gate of circuit.gates) {
    if (!base.has(gate.out)) {
      base.set(gate.out, 0);
    }
  }
  const { steps, result } = collectSteps(simulate(circuit, inputs, previous));
  return { id, base, steps, final: result ?? base };
}

export function CircuitPlayground({
  circuit,
  buses,
  caption,
}: CircuitPlaygroundProps) {
  const layout = useMemo(() => layoutCircuit(circuit), [circuit]);
  const runCounter = useRef(0);
  const [inputs, setInputs] = useState<Record<WireId, Bit>>(() =>
    Object.fromEntries(circuit.inputs.map((p) => [p.wire, 0 as Bit])),
  );
  const [run, setRun] = useState<Run>(() =>
    propagate(circuit, inputs, undefined, 0),
  );

  const playback = usePlayback(run.steps.length, run.id, run.id > 0);

  const toggle = (wire: WireId) => {
    const next: Record<WireId, Bit> = {
      ...inputs,
      [wire]: inputs[wire] === 1 ? 0 : 1,
    };
    setInputs(next);
    runCounter.current += 1;
    setRun(propagate(circuit, next, run.final, runCounter.current));
  };

  // Wire state at the playback cursor = base state + applied steps.
  const wireValues = useMemo(() => {
    const state = new Map(run.base);
    for (let i = 0; i < playback.cursor && i < run.steps.length; i++) {
      const step = run.steps[i];
      if (step?.type === "gate") {
        state.set(step.wire, step.value);
      }
    }
    return state;
  }, [run, playback.cursor]);

  const activeStep =
    playback.cursor > 0 ? run.steps[playback.cursor - 1] : undefined;

  const groupedLabels = new Set(buses?.flatMap((b) => b.labels) ?? []);
  const looseInputs = circuit.inputs.filter((p) => !groupedLabels.has(p.label));

  const busValue = (labels: readonly string[]) =>
    labels.reduce((acc, label, i) => {
      const port = circuit.inputs.find((p) => p.label === label);
      return acc + (port && wireValues.get(port.wire) === 1 ? 2 ** i : 0);
    }, 0);

  return (
    <figure className="my-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-zinc-800 px-4 py-3">
        {buses?.map((bus) => (
          <div key={bus.name} className="flex items-center gap-2">
            <span className="font-mono text-sm text-zinc-400">{bus.name}</span>
            <div className="flex flex-row-reverse gap-1">
              {bus.labels.map((label) => {
                const port = circuit.inputs.find((p) => p.label === label);
                if (!port) return null;
                return (
                  <InputBit
                    key={port.wire}
                    label={label}
                    value={inputs[port.wire] ?? 0}
                    onToggle={() => toggle(port.wire)}
                  />
                );
              })}
            </div>
            <span className="font-mono text-xs text-zinc-500">
              ={busValue(bus.labels)}
            </span>
          </div>
        ))}
        {looseInputs.map((port) => (
          <InputBit
            key={port.wire}
            label={port.label}
            value={inputs[port.wire] ?? 0}
            onToggle={() => toggle(port.wire)}
            showLabel
          />
        ))}
        <span className="ml-auto font-mono text-xs text-zinc-500">
          {circuit.gates.length} NAND{circuit.gates.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="overflow-x-auto px-2 py-3">
        <CircuitDiagram
          circuit={circuit}
          layout={layout}
          wireValues={wireValues}
          activeGateId={
            activeStep?.type === "gate" ? activeStep.gateId : undefined
          }
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-zinc-800 px-4 py-2.5">
        <button
          type="button"
          onClick={playback.playing ? playback.pause : playback.play}
          disabled={playback.total === 0}
          className="rounded-md bg-zinc-800 px-3 py-1 font-mono text-sm text-zinc-200 transition-colors hover:bg-zinc-700 disabled:opacity-40"
        >
          {playback.playing ? "pause" : "play"}
        </button>
        <input
          type="range"
          min={0}
          max={playback.total}
          value={playback.cursor}
          onChange={(e) => playback.seek(Number(e.target.value))}
          className="min-w-32 flex-1 accent-emerald-400"
          aria-label="Playback position"
        />
        <span className="font-mono text-xs text-zinc-500">
          step {playback.cursor}/{playback.total}
        </span>
      </div>
      {caption && (
        <figcaption className="border-t border-zinc-800 px-4 py-2 text-sm text-zinc-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function InputBit({
  label,
  value,
  onToggle,
  showLabel = false,
}: {
  label: string;
  value: Bit;
  onToggle: () => void;
  showLabel?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={label}
      className={`flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-sm transition-colors ${
        value === 1
          ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
          : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
      }`}
    >
      {showLabel && <span className="text-zinc-500">{label}</span>}
      {value}
    </button>
  );
}
