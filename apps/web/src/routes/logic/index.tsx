import { createFileRoute, Link } from "@tanstack/react-router";
import { lessons } from "../../features/logic/lessons";
import { useCompleted } from "../../features/progress/progress";
import { makeHead } from "../../features/seo/seo";

export const Route = createFileRoute("/logic/")({
  head: () =>
    makeHead({
      title: "Digital Logic — nand2web",
      description:
        "Step-by-step interactive simulator building all of digital logic from a single NAND gate — NOT, AND, OR, XOR, adders, latches, flip-flops, and an ALU.",
      path: "/logic",
    }),
  component: LogicIndexPage,
});

function LogicIndexPage() {
  const completed = useCompleted();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-sm text-zinc-500">
          Layer 1 · Digital Logic
        </p>
        <h1 className="font-semibold text-3xl tracking-tight">
          Everything is NAND
        </h1>
        <p className="max-w-2xl text-zinc-400">
          Seven lessons from a single gate to a working ALU. Every circuit is
          interactive — toggle the inputs, scrub the signal propagation, and
          prove each truth table yourself.
        </p>
      </header>
      <ol className="space-y-3">
        {lessons.map((lesson, i) => {
          const done = completed.has(lesson.id);
          return (
            <li key={lesson.id}>
              <Link
                to="/logic/$lessonId"
                params={{ lessonId: lesson.id }}
                className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-sky-700/60"
              >
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-sm ${
                    done
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span>
                  <span className="block font-medium">{lesson.title}</span>
                  <span className="mt-0.5 block text-sm text-zinc-400">
                    {lesson.summary}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
