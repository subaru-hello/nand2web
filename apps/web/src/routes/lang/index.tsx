import { createFileRoute, Link } from "@tanstack/react-router";
import { DeepDive } from "../../features/deepdive/DeepDive";
import { langDeepDive } from "../../features/lang/deepdive";
import { LangPlayground } from "../../features/lang/LangPlayground";

export const Route = createFileRoute("/lang/")({
  component: LangPage,
});

function LangPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-sm text-zinc-500">
          Layer 5 · Compilers &amp; Languages
        </p>
        <h1 className="font-semibold text-3xl tracking-tight">
          A tiny language, rendered live
        </h1>
        <p className="max-w-3xl text-zinc-400">
          Type a Tiny program and watch it flow through the compiler pipeline:{" "}
          <strong className="text-zinc-300">source</strong> →{" "}
          <strong className="text-zinc-300">tokens</strong> →{" "}
          <strong className="text-zinc-300">AST</strong> →{" "}
          <strong className="text-zinc-300">evaluation</strong>. This is the
          same step-by-step contract as{" "}
          <Link to="/cpu" className="text-sky-400 hover:underline">
            Layer 2
          </Link>{" "}
          — only the domain changes.
        </p>
      </header>

      <LangPlayground />

      <section className="space-y-3">
        <h2 className="font-semibold text-xl">The Tiny language</h2>
        <p className="max-w-3xl text-sm text-zinc-400">
          Tiny has integers, variables, arithmetic, comparisons, and four
          statement forms. Division and modulo are integer operations; division
          by zero surfaces as a runtime error in the evaluator, not a crash.
        </p>
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full font-mono text-sm">
            <thead className="bg-zinc-900 text-left text-zinc-400">
              <tr>
                <th className="px-4 py-2">construct</th>
                <th className="px-4 py-2 font-sans">example</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["let declaration", "let x = 42;"],
                ["assignment", "x = x + 1;"],
                ["if / else", "if (x > 0) { print x; } else { print 0; }"],
                ["while loop", "while (n != 0) { n = n - 1; }"],
                ["print", "print x * 2;"],
                ["arithmetic", "x + y  x - y  x * y  x / y  x % y"],
                ["comparisons", "x == y  x != y  x < y  x <= y  x > y  x >= y"],
                ["unary minus", "-x  -(x + 1)"],
              ].map(([construct, example]) => (
                <tr
                  key={construct}
                  className="border-zinc-800/70 border-t text-zinc-300"
                >
                  <td className="px-4 py-1.5 text-sky-300">{construct}</td>
                  <td className="px-4 py-1.5 text-zinc-400">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <DeepDive content={langDeepDive} />
    </div>
  );
}
