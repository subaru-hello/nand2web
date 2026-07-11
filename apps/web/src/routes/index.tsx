import { createFileRoute, Link } from "@tanstack/react-router";
import type { CurriculumLayer, ModuleStatus } from "../curriculum";
import { layersTopDown } from "../curriculum";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const statusStyles: Record<ModuleStatus, { label: string; className: string }> =
  {
    done: {
      label: "done",
      className: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
    },
    wip: {
      label: "in progress",
      className: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
    },
    planned: {
      label: "planned",
      className: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/30",
    },
  };

function HomePage() {
  return (
    <div className="space-y-14">
      <section className="space-y-5 pt-6 text-center">
        <h1 className="mx-auto max-w-3xl text-balance font-semibold text-4xl tracking-tight sm:text-5xl">
          Learn how computers work,{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
            from NAND gates to the web
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-pretty text-lg text-zinc-400">
          An interactive computer-science curriculum. Every concept is a
          simulator you can step through — no video lectures, no walls of text.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/logic"
            className="rounded-md bg-sky-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-sky-500"
          >
            Start from NAND →
          </Link>
          <Link
            to="/docs"
            className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 font-medium text-sm text-zinc-200 transition-colors hover:border-sky-600"
          >
            Read the docs
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold">How to walk the stack</h2>
          <p className="text-zinc-400 text-pretty">
            The intended path — bottom-up, one layer building on the last.
          </p>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2">
          <li
            key="step-01"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2"
          >
            <span className="font-mono text-sm text-sky-400">01</span>
            <p className="font-semibold">Start at the bottom.</p>
            <p className="text-sm text-zinc-400">
              Begin with{" "}
              <Link to="/logic" className="text-sky-400 hover:text-sky-300">
                Layer 1 — Digital Logic
              </Link>
              . Build a NAND gate and watch every other gate, an adder, and a
              register emerge from it.
            </p>
          </li>
          <li
            key="step-02"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2"
          >
            <span className="font-mono text-sm text-sky-400">02</span>
            <p className="font-semibold">Climb one layer at a time.</p>
            <p className="text-sm text-zinc-400">
              Each layer assumes the one below it: gates become a CPU, the CPU
              gains a pipeline and a cache, then an OS, a compiler, and a
              network stack.
            </p>
          </li>
          <li
            key="step-03"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2"
          >
            <span className="font-mono text-sm text-sky-400">03</span>
            <p className="font-semibold">Break every simulator.</p>
            <p className="text-sm text-zinc-400">
              Toggle inputs, single-step the clock, inject a page fault or drop
              a packet. Nothing here is a video — every diagram is a live
              machine you drive.
            </p>
          </li>
          <li
            key="step-04"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2"
          >
            <span className="font-mono text-sm text-sky-400">04</span>
            <p className="font-semibold">Lock it in.</p>
            <p className="text-sm text-zinc-400">
              When a concept clicks, the{" "}
              <Link to="/quiz" className="text-sky-400 hover:text-sky-300">
                spaced-repetition quiz
              </Link>{" "}
              brings it back just before you'd forget it.
            </p>
          </li>
        </ol>
      </section>

      <section aria-label="Curriculum" className="space-y-3">
        <p className="text-center font-mono text-xs text-zinc-500 uppercase tracking-widest">
          the stack — top to bottom
        </p>
        <ol className="space-y-3">
          {layersTopDown.map((layer) => (
            <LayerCard key={layer.id} layer={layer} />
          ))}
        </ol>
        <p className="text-center font-mono text-xs text-zinc-600">
          ⏚ physics goes here
        </p>
      </section>
    </div>
  );
}

function LayerCard({ layer }: { layer: CurriculumLayer }) {
  return (
    <li className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition-colors hover:border-zinc-700">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-sm text-zinc-500">L{layer.order}</span>
        <h2 className="font-semibold text-xl">{layer.title}</h2>
        <p className="text-sm text-zinc-400">{layer.subtitle}</p>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {layer.modules.map((mod) => {
          const status = statusStyles[mod.status];
          const body = (
            <>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium">{mod.title}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[11px] ring-1 ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-zinc-400">{mod.description}</p>
              <p className="mt-2 font-mono text-xs text-zinc-500">
                {mod.topics.join(" · ")}
              </p>
            </>
          );
          return (
            <li key={mod.id}>
              {mod.route ? (
                <Link
                  to={mod.route}
                  className="block h-full rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 transition-colors hover:border-sky-700/60"
                >
                  {body}
                </Link>
              ) : (
                <div className="h-full rounded-lg border border-zinc-800/60 bg-zinc-950/40 p-4 opacity-80">
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </li>
  );
}
