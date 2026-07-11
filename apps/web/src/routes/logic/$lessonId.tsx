import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { DeepDive } from "../../features/deepdive/DeepDive";
import { logicDeepDives } from "../../features/logic/deepdives";
import { getLesson, lessons } from "../../features/logic/lessons";
import { makeHead } from "../../features/seo/seo";

export const Route = createFileRoute("/logic/$lessonId")({
  loader: ({ params }) => {
    const lesson = getLesson(params.lessonId);
    if (!lesson) {
      throw notFound();
    }
    return { title: lesson.title, summary: lesson.summary };
  },
  head: ({ loaderData, params }) => {
    const title = loaderData
      ? `${loaderData.title} — Digital Logic — nand2web`
      : "Digital Logic — nand2web";
    const description = loaderData
      ? loaderData.summary
      : "An interactive digital logic lesson on nand2web.";
    return makeHead({
      title,
      description,
      path: `/logic/${params.lessonId}`,
    });
  },
  component: LessonPage,
  notFoundComponent: () => (
    <p className="text-zinc-400">
      Lesson not found.{" "}
      <Link to="/logic" className="text-sky-400 underline">
        Back to Digital Logic
      </Link>
    </p>
  ),
});

function LessonPage() {
  const { lessonId } = Route.useParams();
  const index = lessons.findIndex((l) => l.id === lessonId);
  const lesson = lessons[index];
  if (!lesson) {
    return null;
  }
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const deepDive = logicDeepDives[lesson.id];

  return (
    <article>
      <header className="mb-6 space-y-1">
        <p className="font-mono text-sm text-zinc-500">
          <Link to="/logic" className="hover:text-zinc-300">
            Digital Logic
          </Link>{" "}
          · lesson {index + 1} of {lessons.length}
        </p>
        <h1 className="font-semibold text-3xl tracking-tight">
          {lesson.title}
        </h1>
      </header>

      <lesson.Content />

      {deepDive && <DeepDive content={deepDive} />}

      <nav className="mt-10 flex justify-between border-zinc-800 border-t pt-6 text-sm">
        {prev ? (
          <Link
            to="/logic/$lessonId"
            params={{ lessonId: prev.id }}
            className="text-sky-400 hover:underline"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/logic/$lessonId"
            params={{ lessonId: next.id }}
            className="text-sky-400 hover:underline"
          >
            {next.title} →
          </Link>
        ) : (
          <Link to="/" className="text-sky-400 hover:underline">
            Back to the curriculum →
          </Link>
        )}
      </nav>
    </article>
  );
}
