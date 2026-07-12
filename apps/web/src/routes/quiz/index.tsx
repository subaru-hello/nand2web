import { createFileRoute } from "@tanstack/react-router";
import { QuizView } from "../../features/quiz/QuizView";
import { makeHead } from "../../features/seo/seo";

export const Route = createFileRoute("/quiz/")({
  head: () =>
    makeHead({
      title: "Spaced-Repetition Quiz — nand2web",
      description:
        "Test and reinforce your CS knowledge with a spaced-repetition quiz covering digital logic, CPU architecture, operating systems, networking, and more.",
      path: "/quiz",
    }),
  component: QuizPage,
});

function QuizPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-sm text-zinc-500">
          Spaced Repetition Review
        </p>
        <h1 className="font-semibold text-3xl tracking-tight">Quiz</h1>
        <p className="max-w-2xl text-zinc-400">
          Review flash cards across all simulator domains using spaced
          repetition. Cards you find easy come back less often; ones you
          struggle with come back sooner.
        </p>
      </header>
      <QuizView />
    </div>
  );
}
