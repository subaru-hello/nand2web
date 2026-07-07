import type { Simulation } from "@nand2web/sim-core";
import { collectSteps } from "@nand2web/sim-core";
import type { Bit, Circuit, SignalStep, WireId, WireState } from "./types.ts";
import { nand } from "./types.ts";

const MAX_PASSES = 100;

/**
 * Relaxation simulation: repeatedly evaluate every gate until no wire
 * changes. Handles cyclic netlists (latches, flip-flops) because a stable
 * feedback loop simply stops producing changes. Sequential state is carried
 * by passing the previous run's final wire state as `previous`.
 *
 * Each changed wire is yielded as a step, which is exactly what the UI
 * animates as signal propagation.
 */
export function* simulate(
  circuit: Circuit,
  inputs: Readonly<Record<WireId, Bit>>,
  previous?: WireState,
): Simulation<SignalStep, WireState> {
  const state = new Map<WireId, Bit>();
  for (const gate of circuit.gates) {
    state.set(gate.out, previous?.get(gate.out) ?? 0);
  }
  for (const port of circuit.inputs) {
    state.set(port.wire, inputs[port.wire] ?? 0);
  }

  for (let pass = 0; pass < MAX_PASSES; pass++) {
    let changed = false;
    for (const gate of circuit.gates) {
      const value = nand(state.get(gate.a) ?? 0, state.get(gate.b) ?? 0);
      if (value !== state.get(gate.out)) {
        state.set(gate.out, value);
        changed = true;
        yield { type: "gate", gateId: gate.id, wire: gate.out, value, pass };
      }
    }
    if (!changed) {
      yield { type: "settled", passes: pass + 1 };
      return state;
    }
  }
  yield { type: "unstable" };
  return state;
}

/** Run to a stable state and return the final wire values (no step replay). */
export function evaluate(
  circuit: Circuit,
  inputs: Readonly<Record<WireId, Bit>>,
  previous?: WireState,
): WireState {
  const { result } = collectSteps(simulate(circuit, inputs, previous));
  if (result === undefined) {
    throw new Error(`simulation of ${circuit.id} exceeded step limit`);
  }
  return result;
}

/** Read a circuit's output values from a settled wire state. */
export function readOutputs(
  circuit: Circuit,
  state: WireState,
): Record<string, Bit> {
  const out: Record<string, Bit> = {};
  for (const port of circuit.outputs) {
    out[port.label] = state.get(port.wire) ?? 0;
  }
  return out;
}

/** Pack LSB-first output labels (e.g. sum0..sum3) into a number. */
export function bitsToNumber(bits: readonly Bit[]): number {
  return bits.reduce<number>((acc, bit, i) => acc + bit * 2 ** i, 0);
}

export function numberToBits(value: number, width: number): Bit[] {
  return Array.from({ length: width }, (_, i) =>
    ((value >> i) & 1) === 1 ? 1 : 0,
  );
}
