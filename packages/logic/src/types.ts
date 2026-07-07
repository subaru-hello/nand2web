/**
 * Everything in this package is built from a single primitive: the NAND gate.
 * A circuit is a flat netlist of NAND gates connecting named wires. Composite
 * gates (NOT, AND, XOR, adders, latches, the ALU) exist only as construction
 * helpers — after building, only NANDs remain. That reduction is the whole
 * point of the Digital Logic layer.
 */

export type Bit = 0 | 1;

/** Wires are identified by name; external inputs use the `in:<label>` prefix. */
export type WireId = string;

export interface NandGate {
  readonly id: string;
  readonly a: WireId;
  readonly b: WireId;
  readonly out: WireId;
}

export interface CircuitPort {
  readonly label: string;
  readonly wire: WireId;
}

export interface Circuit {
  readonly id: string;
  readonly name: string;
  readonly inputs: readonly CircuitPort[];
  readonly outputs: readonly CircuitPort[];
  readonly gates: readonly NandGate[];
}

/** One step of signal propagation, yielded by the simulator. */
export type SignalStep =
  | {
      readonly type: "gate";
      readonly gateId: string;
      readonly wire: WireId;
      readonly value: Bit;
      /** Relaxation pass this change happened in (0-based). */
      readonly pass: number;
    }
  | { readonly type: "settled"; readonly passes: number }
  /** The circuit oscillates for these inputs (e.g. an SR latch with both inputs released after an invalid state). */
  | { readonly type: "unstable" };

export type WireState = ReadonlyMap<WireId, Bit>;

export function nand(a: Bit, b: Bit): Bit {
  return a === 1 && b === 1 ? 0 : 1;
}
