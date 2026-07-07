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
