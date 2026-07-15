import { createFileRoute } from "@tanstack/react-router";
import {
  categorySlug,
  groupByCategory,
  type Problem,
} from "../../features/arai60/data";
import { Article, DocsShell, Section } from "../../features/docs";
import { useLang } from "../../features/i18n/lang";
import { makeDocJsonLd, makeHead } from "../../features/seo/seo";

const TITLE = "Arai60 LeetCode Reference — nand2web";
const DESC =
  "Bilingual (EN/JA) write-ups for 60 LeetCode problems from the Arai60 curriculum — approach, complexity, reference code, and alternatives across 12 algorithm categories.";

export const Route = createFileRoute("/docs/arai60")({
  head: () =>
    makeHead({
      title: TITLE,
      description: DESC,
      path: "/docs/arai60",
      jsonLd: makeDocJsonLd({
        title: TITLE,
        description: DESC,
        path: "/docs/arai60",
        breadcrumbLabel: "Arai60",
      }),
    }),
  component: Arai60Page,
});

function Arai60Page() {
  const lang = useLang();
  const groups = groupByCategory();

  return (
    <DocsShell active="arai60">
      <Article
        title={{
          en: "Arai60 LeetCode Reference",
          ja: "Arai60 LeetCode リファレンス",
        }}
        lead={{
          en: "Bilingual write-ups for 60 LeetCode problems across 12 algorithm categories. Each entry covers the core approach, time/space complexity, reference code in Python, and alternative strategies.",
          ja: "12カテゴリ・60問の LeetCode 問題を日英バイリンガルで解説。各問題は考え方・計算量・Python コード・代替解法を網羅しています。",
        }}
      >
        {/* Category index */}
        <Section id="index" title={{ en: "Categories", ja: "カテゴリ一覧" }}>
          <div className="grid gap-2 sm:grid-cols-2">
            {groups.map((cat) => (
              <a
                key={cat.en}
                href={`#${categorySlug(cat.en)}`}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 transition-colors hover:border-zinc-700 hover:bg-zinc-800/60"
              >
                <div className="font-semibold text-zinc-100 group-hover:text-sky-300 transition-colors text-sm">
                  {lang === "ja" ? cat.ja : cat.en}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  {cat.problems.length}{" "}
                  {lang === "ja"
                    ? "問"
                    : cat.problems.length === 1
                      ? "problem"
                      : "problems"}
                </div>
              </a>
            ))}
          </div>
        </Section>

        {/* Category + problem sections */}
        {groups.map((cat) => (
          <Section
            key={cat.en}
            id={categorySlug(cat.en)}
            title={{ en: cat.en, ja: cat.ja }}
          >
            <div className="space-y-8">
              {cat.problems.map((p) => (
                <ProblemCard key={p.num} problem={p} lang={lang} />
              ))}
            </div>
          </Section>
        ))}
      </Article>
    </DocsShell>
  );
}

function ProblemCard({
  problem: p,
  lang,
}: {
  problem: Problem;
  lang: "en" | "ja";
}) {
  return (
    <div
      id={`p${p.num}`}
      className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 scroll-mt-20"
    >
      {/* Title */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="text-xs font-mono text-zinc-500 mr-2">#{p.num}</span>
          <span className="font-semibold text-zinc-100">
            {lang === "ja" ? p.title_ja : p.title_en}
          </span>
          <span className="ml-2 text-xs text-zinc-500">
            {lang === "ja" ? p.title_en : p.title_ja}
          </span>
        </div>
        {/* Complexity badges */}
        <div className="flex gap-2 shrink-0">
          <ComplexityBadge label="Time" value={p.time} />
          <ComplexityBadge label="Space" value={p.space} />
        </div>
      </div>

      {/* Approach */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-sky-400">
          {lang === "ja" ? "考え方" : "Approach"}
        </h4>
        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
          {lang === "ja" ? p.approach_ja : p.approach_en}
        </p>
      </div>

      {/* Code */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
          {lang === "ja" ? "コード" : "Code"}
          <span className="ml-2 font-normal normal-case text-zinc-500">
            {p.code_lang}
          </span>
        </h4>
        <div className="overflow-x-auto rounded-lg border border-zinc-700 bg-zinc-950">
          <pre className="p-4 text-xs leading-relaxed text-zinc-200 font-mono">
            <code>{p.code}</code>
          </pre>
        </div>
      </div>

      {/* Alternatives — always present (non-empty) */}
      {p.alt_en && (
        <div className="space-y-1">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-400">
            {lang === "ja" ? "代替解法" : "Alternatives"}
          </h4>
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
            {lang === "ja" ? p.alt_ja : p.alt_en}
          </p>
        </div>
      )}

      {/* Points — optional */}
      {p.points_en && (
        <div className="space-y-1">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-violet-400">
            {lang === "ja" ? "ポイント" : "Key Points"}
          </h4>
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
            {lang === "ja" ? p.points_ja : p.points_en}
          </p>
        </div>
      )}
    </div>
  );
}

function ComplexityBadge({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-mono text-zinc-300">
      <span className="text-zinc-500">{label}: </span>
      {value}
    </span>
  );
}
