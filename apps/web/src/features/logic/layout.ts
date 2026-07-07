import type { Circuit, WireId } from "@nand2web/logic";

/**
 * Static layout for a NAND netlist: gates are placed in columns by logic
 * depth (longest distance from an input), which makes signal propagation
 * read left-to-right. Feedback wires (latches) simply draw right-to-left.
 */

export const GATE_W = 44;
export const GATE_H = 32;
const COL_GAP = 96;
const ROW_GAP = 52;
const MARGIN_X = 72;
const MARGIN_Y = 28;

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface GatePlacement {
  readonly gateId: string;
  readonly pos: Point; // top-left of the gate symbol
}

export interface PortPlacement {
  readonly label: string;
  readonly wire: WireId;
  readonly pos: Point;
}

export interface WirePath {
  readonly wire: WireId;
  readonly from: Point;
  readonly to: Point;
}

export interface CircuitLayout {
  readonly width: number;
  readonly height: number;
  readonly inputs: readonly PortPlacement[];
  readonly outputs: readonly PortPlacement[];
  readonly gates: readonly GatePlacement[];
  readonly wires: readonly WirePath[];
}

export function layoutCircuit(circuit: Circuit): CircuitLayout {
  // Depth pass: inputs are depth 0; a gate is one deeper than its deepest
  // known source. Feedback wires are unknown on first sight and default to 0.
  const wireDepth = new Map<WireId, number>();
  for (const port of circuit.inputs) {
    wireDepth.set(port.wire, 0);
  }
  const gateDepth = new Map<string, number>();
  for (const gate of circuit.gates) {
    const d =
      1 + Math.max(wireDepth.get(gate.a) ?? 0, wireDepth.get(gate.b) ?? 0);
    gateDepth.set(gate.id, d);
    wireDepth.set(gate.out, d);
  }

  const maxDepth = Math.max(1, ...gateDepth.values());
  const columns = new Map<number, string[]>();
  for (const gate of circuit.gates) {
    const d = gateDepth.get(gate.id) as number;
    const col = columns.get(d) ?? [];
    col.push(gate.id);
    columns.set(d, col);
  }

  const tallest = Math.max(
    circuit.inputs.length,
    circuit.outputs.length,
    ...[...columns.values()].map((c) => c.length),
  );
  const height = MARGIN_Y * 2 + tallest * ROW_GAP;
  const width = MARGIN_X * 2 + (maxDepth + 1) * COL_GAP + GATE_W;

  const centerYs = (count: number, row: number) =>
    height / 2 + (row - (count - 1) / 2) * ROW_GAP;

  const gates: GatePlacement[] = [];
  const gatePos = new Map<string, Point>();
  for (const [depth, ids] of columns) {
    ids.forEach((gateId, row) => {
      const pos = {
        x: MARGIN_X + depth * COL_GAP,
        y: centerYs(ids.length, row) - GATE_H / 2,
      };
      gates.push({ gateId, pos });
      gatePos.set(gateId, pos);
    });
  }

  const inputs: PortPlacement[] = circuit.inputs.map((port, row) => ({
    label: port.label,
    wire: port.wire,
    pos: { x: MARGIN_X - COL_GAP / 2, y: centerYs(circuit.inputs.length, row) },
  }));

  const outputs: PortPlacement[] = circuit.outputs.map((port, row) => ({
    label: port.label,
    wire: port.wire,
    pos: {
      x: MARGIN_X + (maxDepth + 1) * COL_GAP + GATE_W / 2,
      y: centerYs(circuit.outputs.length, row),
    },
  }));

  // Where a wire's signal is produced.
  const sourcePos = new Map<WireId, Point>();
  for (const input of inputs) {
    sourcePos.set(input.wire, input.pos);
  }
  for (const gate of circuit.gates) {
    const pos = gatePos.get(gate.id) as Point;
    sourcePos.set(gate.out, {
      x: pos.x + GATE_W + 6,
      y: pos.y + GATE_H / 2,
    });
  }

  const wires: WirePath[] = [];
  for (const gate of circuit.gates) {
    const pos = gatePos.get(gate.id) as Point;
    const pins: Array<[WireId, number]> =
      gate.a === gate.b
        ? [[gate.a, GATE_H / 2]]
        : [
            [gate.a, GATE_H * 0.28],
            [gate.b, GATE_H * 0.72],
          ];
    for (const [wire, dy] of pins) {
      const from = sourcePos.get(wire);
      if (from) {
        wires.push({ wire, from, to: { x: pos.x, y: pos.y + dy } });
      }
    }
  }
  for (const output of outputs) {
    const from = sourcePos.get(output.wire);
    if (from) {
      wires.push({
        wire: output.wire,
        from,
        to: { x: output.pos.x - 14, y: output.pos.y },
      });
    }
  }

  return { width, height, inputs, outputs, gates, wires };
}
