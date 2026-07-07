import type { ReactNode } from "react";
import type { Lang } from "../i18n/lang";
import { setLang, useLang } from "../i18n/lang";

/**
 * "Deep dive" sections: the historical background and mechanics behind each
 * interactive module, in English or Japanese. Content is plain strings with
 * a **bold** / `code` mini-markup so both languages stay easy to edit.
 */

export interface LocalizedText {
  readonly en: string;
  readonly ja: string;
}

export interface DeepDiveSection {
  readonly title: LocalizedText;
  readonly paragraphs: readonly LocalizedText[];
}

export interface DeepDiveContent {
  readonly sections: readonly DeepDiveSection[];
}

export function DeepDive({ content }: { content: DeepDiveContent }) {
  const lang = useLang();
  return (
    <section className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/40">
      <header className="flex flex-wrap items-center justify-between gap-2 border-zinc-800 border-b px-5 py-3">
        <h2 className="font-semibold text-lg">
          {lang === "ja"
            ? "解説 — 歴史と仕組み"
            : "Deep dive — history & mechanics"}
        </h2>
        <LangToggle />
      </header>
      <div className="space-y-7 px-5 py-6">
        {content.sections.map((section) => (
          <section key={section.title.en}>
            <h3 className="mb-2 font-medium text-sky-300">
              {section.title[lang]}
            </h3>
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph.en.slice(0, 40)}
                className="my-3 max-w-3xl text-[15px] text-zinc-300 leading-relaxed"
              >
                {rich(paragraph[lang])}
              </p>
            ))}
          </section>
        ))}
      </div>
    </section>
  );
}

export function LangToggle() {
  const lang = useLang();
  const option = (value: Lang, label: string) => (
    <button
      type="button"
      onClick={() => setLang(value)}
      aria-pressed={lang === value}
      className={`rounded px-2 py-0.5 font-mono text-xs transition-colors ${
        lang === value
          ? "bg-zinc-700 text-zinc-100"
          : "text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="flex items-center gap-0.5 rounded-md border border-zinc-700/80 bg-zinc-900 p-0.5">
      {option("en", "EN")}
      {option("ja", "日本語")}
    </div>
  );
}

/** Minimal inline markup: **bold** and `code`. */
function rich(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((part, i) => {
    const key = `${i}:${part.slice(0, 12)}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} className="font-medium text-zinc-100">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={key} className="text-zinc-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={key}
          className="rounded bg-zinc-800 px-1 py-0.5 font-mono text-[13px] text-sky-300"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
