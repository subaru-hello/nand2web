import type { Bit, Circuit, WireId } from "@nand2web/logic";
import type { CircuitLayout } from "./layout";
import { GATE_H, GATE_W } from "./layout";

const HIGH = "#34d399"; // emerald-400
const LOW = "#3f3f46"; // zinc-700
const ACTIVE = "#fbbf24"; // amber-400

interface CircuitDiagramProps {
  circuit: Circuit;
  layout: CircuitLayout;
  wireValues: ReadonlyMap<WireId, Bit>;
  /** Gate that changed in the current playback step. */
  activeGateId?: string | undefined;
}

export function CircuitDiagram({
  circuit,
  layout,
  wireValues,
  activeGateId,
}: CircuitDiagramProps) {
  const color = (wire: WireId) => (wireValues.get(wire) === 1 ? HIGH : LOW);

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      className="h-auto w-full"
      style={{ maxHeight: Math.min(layout.height, 520) }}
      role="img"
      aria-label={`${circuit.name} circuit diagram`}
    >
      {layout.wires.map((w, i) => {
        const midX = (w.from.x + w.to.x) / 2;
        return (
          <path
            // biome-ignore lint/suspicious/noArrayIndexKey: wire list is static per circuit
            key={i}
            d={`M ${w.from.x} ${w.from.y} C ${midX} ${w.from.y}, ${midX} ${w.to.y}, ${w.to.x} ${w.to.y}`}
            fill="none"
            stroke={color(w.wire)}
            strokeWidth={wireValues.get(w.wire) === 1 ? 2 : 1.25}
          />
        );
      })}

      {layout.inputs.map((port) => (
        <g key={port.wire}>
          <circle
            cx={port.pos.x}
            cy={port.pos.y}
            r={5}
            fill={color(port.wire)}
          />
          <text
            x={port.pos.x - 10}
            y={port.pos.y + 4}
            textAnchor="end"
            className="fill-zinc-400 font-mono text-[11px]"
          >
            {port.label}
          </text>
        </g>
      ))}

      {layout.gates.map(({ gateId, pos }) => {
        const gate = circuit.gates.find((g) => g.id === gateId);
        const out = gate ? (wireValues.get(gate.out) ?? 0) : 0;
        const isActive = gateId === activeGateId;
        return (
          <g key={gateId} transform={`translate(${pos.x}, ${pos.y})`}>
            {/* NAND body: AND shape + inversion bubble */}
            <path
              d={`M 0 0 h ${GATE_W * 0.5} a ${GATE_H / 2} ${GATE_H / 2} 0 0 1 0 ${GATE_H} h ${-GATE_W * 0.5} z`}
              fill={isActive ? "rgba(251,191,36,0.25)" : "#18181b"}
              stroke={isActive ? ACTIVE : out === 1 ? HIGH : "#52525b"}
              strokeWidth={isActive ? 2 : 1.25}
            />
            <circle
              cx={GATE_W * 0.5 + GATE_H / 2 + 5}
              cy={GATE_H / 2}
              r={4}
              fill="#18181b"
              stroke={isActive ? ACTIVE : out === 1 ? HIGH : "#52525b"}
              strokeWidth={1.25}
            />
          </g>
        );
      })}

      {layout.outputs.map((port) => (
        <g key={`${port.wire}:${port.label}`}>
          <circle
            cx={port.pos.x - 8}
            cy={port.pos.y}
            r={5}
            fill={color(port.wire)}
          />
          <text
            x={port.pos.x + 2}
            y={port.pos.y + 4}
            className="fill-zinc-400 font-mono text-[11px]"
          >
            {port.label}={wireValues.get(port.wire) ?? 0}
          </text>
        </g>
      ))}
    </svg>
  );
}
