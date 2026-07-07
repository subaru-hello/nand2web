import type { Bit, Circuit } from "@nand2web/logic";
import { evaluate, readOutputs } from "@nand2web/logic";
import { useEffect, useMemo, useState } from "react";
import { markCompleted } from "../progress/progress";

type CellValue = Bit | null;

interface TruthTableChallengeProps {
  circuit: Circuit;
  /** Lesson to mark complete when the table is solved. */
  lessonId: string;
  prompt?: string;
}

/**
 * The reader fills in the expected outputs for every input combination;
 * answers are checked against the actual NAND netlist simulation.
 * Only used for circuits with few inputs (2^n rows).
 */
export function TruthTableChallenge({
  circuit,
  lessonId,
  prompt = "Fill in the outputs, then check your answers. Click a cell to cycle blank → 0 → 1.",
}: TruthTableChallengeProps) {
  const rows = useMemo(() => buildRows(circuit), [circuit]);
  const [answers, setAnswers] = useState<CellValue[][]>(() =>
    rows.map((row) => row.expected.map(() => null)),
  );
  const [checked, setChecked] = useState(false);
  const solved =
    checked &&
    rows.every((row, r) =>
      row.expected.every((value, c) => answers[r]?.[c] === value),
    );

  useEffect(() => {
    if (solved) {
      markCompleted(lessonId);
    }
  }, [solved, lessonId]);

  const cycle = (r: number, c: number) => {
    setChecked(false);
    setAnswers((prev) =>
      prev.map((row, ri) =>
        ri === r
          ? row.map((cell, ci) =>
              ci === c ? (cell === null ? 0 : cell === 0 ? 1 : null) : cell,
            )
          : row,
      ),
    );
  };

  return (
    <div className="my-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <p className="mb-3 text-sm text-zinc-400">{prompt}</p>
      <table className="font-mono text-sm">
        <thead>
          <tr>
            {circuit.inputs.map((p) => (
              <th key={p.wire} className="px-3 py-1 text-zinc-500">
                {p.label}
              </th>
            ))}
            {circuit.outputs.map((p) => (
              <th
                key={`${p.wire}:${p.label}`}
                className="border-zinc-700 border-l px-3 py-1 text-sky-400"
              >
                {p.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={row.key} className="border-zinc-800/60 border-t">
              {row.inputs.map((bit, i) => (
                <td
                  key={`${row.key}-in-${circuit.inputs[i]?.label}`}
                  className="px-3 py-1 text-center text-zinc-300"
                >
                  {bit}
                </td>
              ))}
              {row.expected.map((expected, c) => {
                const value = answers[r]?.[c] ?? null;
                const state = !checked
                  ? "idle"
                  : value === expected
                    ? "correct"
                    : "wrong";
                return (
                  <td
                    key={`${row.key}-out-${circuit.outputs[c]?.label}`}
                    className="border-zinc-700 border-l px-1.5 py-1 text-center"
                  >
                    <button
                      type="button"
                      onClick={() => cycle(r, c)}
                      className={`h-7 w-9 rounded border transition-colors ${
                        state === "correct"
                          ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300"
                          : state === "wrong"
                            ? "border-red-500/60 bg-red-500/15 text-red-300"
                            : value === null
                              ? "border-zinc-700 bg-zinc-900 text-zinc-600 hover:border-zinc-500"
                              : "border-zinc-600 bg-zinc-800 text-zinc-200"
                      }`}
                    >
                      {value ?? "·"}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setChecked(true)}
          className="rounded-md bg-sky-600 px-3 py-1.5 font-medium text-sm text-white transition-colors hover:bg-sky-500"
        >
          Check answers
        </button>
        {solved && (
          <span className="text-emerald-400 text-sm">
            ✓ Correct — lesson complete
          </span>
        )}
        {checked && !solved && (
          <span className="text-red-400 text-sm">
            Not quite — red cells are wrong or empty.
          </span>
        )}
      </div>
    </div>
  );
}

function buildRows(circuit: Circuit) {
  const n = circuit.inputs.length;
  return Array.from({ length: 2 ** n }, (_, value) => {
    const inputs = circuit.inputs.map((_, i) =>
      ((value >> i) & 1) === 1 ? (1 as Bit) : (0 as Bit),
    );
    const state = evaluate(
      circuit,
      Object.fromEntries(
        circuit.inputs.map((p, i) => [p.wire, inputs[i] as Bit]),
      ),
    );
    const outputs = readOutputs(circuit, state);
    return {
      key: `row${value}`,
      inputs,
      expected: circuit.outputs.map((p) => outputs[p.label] as Bit),
    };
  });
}
