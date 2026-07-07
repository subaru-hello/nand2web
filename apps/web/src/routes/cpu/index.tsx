import { INSTRUCTIONS } from "@nand2web/cpu";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CpuPlayground } from "../../features/cpu/CpuPlayground";

export const Route = createFileRoute("/cpu/")({
  component: CpuPage,
});

function CpuPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-sm text-zinc-500">Layer 2 · The CPU</p>
        <h1 className="font-semibold text-3xl tracking-tight">
          A stored-program computer, 4 bits at a time
        </h1>
        <p className="max-w-3xl text-zinc-400">
          This machine is{" "}
          <Link to="/logic" className="text-sky-400 hover:underline">
            Layer 1
          </Link>{" "}
          assembled: the ALU computes, registers built from flip-flops hold
          state, and a program counter walks through instructions stored in
          memory — the <em>stored-program concept</em>. Write assembly on the
          left, press run, and watch fetch → decode → execute ripple across the
          datapath.
        </p>
      </header>

      <CpuPlayground />

      <section className="space-y-3">
        <h2 className="font-semibold text-xl">Instruction set</h2>
        <p className="max-w-3xl text-sm text-zinc-400">
          Every instruction is one byte: a 4-bit opcode and a 4-bit operand.
          Sixteen words of program memory, sixteen nibbles of RAM, two
          registers, two flags. It's tiny — and it's Turing-complete enough to
          count, branch, and loop, which is all any computer does.
        </p>
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full font-mono text-sm">
            <thead className="bg-zinc-900 text-left text-zinc-400">
              <tr>
                <th className="px-4 py-2">mnemonic</th>
                <th className="px-4 py-2">opcode</th>
                <th className="px-4 py-2 font-sans">meaning</th>
              </tr>
            </thead>
            <tbody>
              {INSTRUCTIONS.map((spec) => (
                <tr
                  key={spec.mnemonic}
                  className="border-zinc-800/70 border-t text-zinc-300"
                >
                  <td className="px-4 py-1.5 text-sky-300">
                    {spec.mnemonic}
                    {spec.operand !== "none" ? " n" : ""}
                  </td>
                  <td className="px-4 py-1.5 text-zinc-500">
                    {spec.opcode.toString(16).toUpperCase()}
                    {spec.fixedOperand !== undefined
                      ? spec.fixedOperand.toString(16).toUpperCase()
                      : "n"}
                  </td>
                  <td className="px-4 py-1.5 font-sans text-zinc-400">
                    {spec.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
