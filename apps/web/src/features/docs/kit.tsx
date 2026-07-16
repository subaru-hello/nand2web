import { Link } from "@tanstack/react-router";
import { type ReactNode, useId } from "react";
import type { LocalizedText } from "../deepdive/DeepDive";
import { useLang } from "../i18n/lang";
import { TOPICS, type TopicId } from "./topics";

// ---------------------------------------------------------------------------
// Internal route registry — used by rich() to catch typos at dev time
// ---------------------------------------------------------------------------

const INTERNAL_ROUTES = new Set<string>([
  "/",
  "/docs",
  ...TOPICS.map((t) => t.route),
  "/logic",
  "/cpu",
  "/arch",
  "/os",
  "/lang",
  "/net",
  "/algorithms",
  "/pathfinding",
  "/hashtable",
  "/quiz",
]);

// ---------------------------------------------------------------------------
// Colour palette (exported so Diagram authors can reference it)
// ---------------------------------------------------------------------------
export const C = {
  high: "#34d399",
  accent: "#38bdf8",
  muted: "#3f3f46",
  warn: "#fbbf24",
  text: "#e4e4e7",
  faint: "#71717a",
  panel: "#18181b",
  line: "#52525b",
} as const;

// ---------------------------------------------------------------------------
// i18n helpers
// ---------------------------------------------------------------------------

/** Returns a picker bound to the current lang. */
export function useT(): (t: LocalizedText) => string {
  const lang = useLang();
  return (t: LocalizedText) => t[lang];
}

/** Inline localized text rendered through rich(). */
export function L({ t }: { t: LocalizedText }): ReactNode {
  const lang = useLang();
  return <>{rich(t[lang])}</>;
}

/**
 * Inline markup: **bold**, *italic*, `code`, and [label](href).
 * Internal hrefs (starting with /) use TanStack <Link>; external use <a>.
 */
export function rich(text: string): ReactNode {
  // Split on bold, italic, code, and markdown links
  const parts = text.split(
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g,
  );
  return parts.map((part, i) => {
    const key = `${i}:${part.slice(0, 16)}`;
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
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const label = linkMatch[1] ?? "";
      const href = linkMatch[2] ?? "";
      if (href.startsWith("/")) {
        const basePath = href.replace(/#.*$/, "");
        const isKnown = INTERNAL_ROUTES.has(basePath);
        if (!isKnown) {
          console.error(`[docs] unknown internal link: ${href}`);
        }
        return (
          <Link
            key={key}
            to={href}
            className={`text-sky-400 underline-offset-2 hover:text-sky-300 hover:underline${isKnown ? "" : " ring-1 ring-red-500 rounded"}`}
            {...(!isKnown ? { title: "unknown route" } : {})}
          >
            {label}
          </Link>
        );
      }
      return (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-sky-400 underline-offset-2 hover:text-sky-300 hover:underline"
        >
          {label}
        </a>
      );
    }
    return part;
  });
}

// ---------------------------------------------------------------------------
// Article / Section / P / Prose
// ---------------------------------------------------------------------------

interface ArticleProps {
  title: LocalizedText;
  lead: LocalizedText;
  children: ReactNode;
}

export function Article({ title, lead, children }: ArticleProps) {
  const lang = useLang();
  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-zinc-100">{title[lang]}</h1>
        <p className="max-w-2xl text-lg text-zinc-300 leading-relaxed">
          {rich(lead[lang])}
        </p>
      </header>
      {children}
    </article>
  );
}

interface SectionProps {
  title: LocalizedText;
  id?: string;
  children: ReactNode;
}

export function Section({ title, id, children }: SectionProps) {
  const lang = useLang();
  return (
    <section id={id} className="scroll-mt-20 space-y-4">
      <h2 className="text-2xl font-semibold text-zinc-100">{title[lang]}</h2>
      {children}
    </section>
  );
}

export function P({ t }: { t: LocalizedText }) {
  const lang = useLang();
  return (
    <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
      {rich(t[lang])}
    </p>
  );
}

export function Prose({
  paragraphs,
}: {
  paragraphs: readonly LocalizedText[];
}) {
  const lang = useLang();
  return (
    <div className="space-y-3">
      {paragraphs.map((p) => (
        <p
          key={p.en}
          className="text-zinc-300 leading-relaxed whitespace-pre-line"
        >
          {rich(p[lang])}
        </p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Callout
// ---------------------------------------------------------------------------

type CalloutTone = "note" | "insight" | "warn";

const CALLOUT_STYLES: Record<
  CalloutTone,
  { border: string; bg: string; titleColor: string; icon: string }
> = {
  note: {
    border: "border-sky-500",
    bg: "bg-sky-950/40",
    titleColor: "text-sky-300",
    icon: "ℹ",
  },
  insight: {
    border: "border-emerald-500",
    bg: "bg-emerald-950/40",
    titleColor: "text-emerald-300",
    icon: "✦",
  },
  warn: {
    border: "border-amber-500",
    bg: "bg-amber-950/40",
    titleColor: "text-amber-300",
    icon: "⚠",
  },
};

interface CalloutProps {
  tone: CalloutTone;
  title?: LocalizedText;
  t?: LocalizedText;
  children?: ReactNode;
}

export function Callout({ tone, title, t, children }: CalloutProps) {
  const lang = useLang();
  const s = CALLOUT_STYLES[tone];
  return (
    <div
      className={`rounded-xl border-l-4 ${s.border} ${s.bg} px-5 py-4 space-y-1`}
    >
      {title && (
        <p className={`font-semibold text-sm ${s.titleColor}`}>
          {s.icon} {title[lang]}
        </p>
      )}
      {t && (
        <p className="text-zinc-300 leading-relaxed text-sm">{rich(t[lang])}</p>
      )}
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Figure + Diagram
// ---------------------------------------------------------------------------

interface FigureProps {
  caption: LocalizedText;
  children: ReactNode;
}

export function Figure({ caption, children }: FigureProps) {
  const lang = useLang();
  return (
    <figure className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
      {children}
      <figcaption className="text-center text-sm text-zinc-500">
        {caption[lang]}
      </figcaption>
    </figure>
  );
}

interface DiagramProps {
  label: LocalizedText;
  viewBox: string;
  maxHeight?: number;
  children: ReactNode;
}

export function Diagram({ label, viewBox, maxHeight, children }: DiagramProps) {
  const lang = useLang();
  return (
    <svg
      viewBox={viewBox}
      className="h-auto w-full"
      style={maxHeight !== undefined ? { maxHeight } : undefined}
      role="img"
      aria-label={label[lang]}
    >
      {children}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// LayerStack
// ---------------------------------------------------------------------------

type LayerTone = "accent" | "emerald" | "zinc";

const LAYER_TONE_STYLES: Record<
  LayerTone,
  { border: string; text: string; bg: string }
> = {
  accent: {
    border: "border-sky-600",
    text: "text-sky-300",
    bg: "bg-sky-950/30",
  },
  emerald: {
    border: "border-emerald-600",
    text: "text-emerald-300",
    bg: "bg-emerald-950/30",
  },
  zinc: {
    border: "border-zinc-700",
    text: "text-zinc-300",
    bg: "bg-zinc-800/30",
  },
};

interface LayerDef {
  label: LocalizedText;
  sub?: LocalizedText;
  tone?: LayerTone;
}

export function LayerStack({ layers }: { layers: readonly LayerDef[] }) {
  const lang = useLang();
  return (
    <div className="space-y-1">
      {layers.map((layer) => {
        const tone = layer.tone ?? "zinc";
        const s = LAYER_TONE_STYLES[tone];
        return (
          <div
            key={layer.label.en}
            className={`rounded-lg border ${s.border} ${s.bg} px-4 py-2`}
          >
            <span className={`font-medium text-sm ${s.text}`}>
              {layer.label[lang]}
            </span>
            {layer.sub && (
              <span className="ml-2 text-xs text-zinc-500">
                {layer.sub[lang]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FlowRow
// ---------------------------------------------------------------------------

interface FlowStep {
  label: LocalizedText;
  sub?: LocalizedText;
}

export function FlowRow({ steps }: { steps: readonly FlowStep[] }) {
  const lang = useLang();
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: steps are positional pipeline stages
        <div key={i} className="flex items-center gap-2">
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-center">
            <div className="text-sm font-medium text-zinc-200">
              {step.label[lang]}
            </div>
            {step.sub && (
              <div className="text-xs text-zinc-500">{step.sub[lang]}</div>
            )}
          </div>
          {i < steps.length - 1 && (
            <span className="text-zinc-500 select-none" aria-hidden="true">
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CompareTable
// ---------------------------------------------------------------------------

interface CompareTableProps {
  headers: readonly LocalizedText[];
  rows: readonly (readonly LocalizedText[])[];
}

export function CompareTable({ headers, rows }: CompareTableProps) {
  const lang = useLang();
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-sky-950/50">
            {headers.map((h) => (
              <th
                key={h.en}
                className="px-4 py-2 text-left font-semibold text-sky-300"
              >
                {h[lang]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: row order is semantically fixed
            <tr key={ri} className="border-zinc-800 border-t">
              {row.map((cell, ci) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: cell position is fixed
                <td key={ci} className="px-4 py-2 text-zinc-300">
                  {rich(cell[lang])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// KeyTerms
// ---------------------------------------------------------------------------

interface KeyTerm {
  term: string;
  def: LocalizedText;
}

export function KeyTerms({ terms }: { terms: readonly KeyTerm[] }) {
  const lang = useLang();
  return (
    <dl className="space-y-3">
      {terms.map((kt) => (
        <div key={kt.term} className="grid grid-cols-[auto_1fr] gap-x-4">
          <dt className="font-mono font-semibold text-sky-300 text-sm pt-0.5">
            {kt.term}
          </dt>
          <dd className="text-zinc-300 text-sm leading-relaxed">
            {rich(kt.def[lang])}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// ---------------------------------------------------------------------------
// DocsShell — sidebar + content layout
// ---------------------------------------------------------------------------

interface DocsShellProps {
  active?: TopicId;
  children: ReactNode;
}

export function DocsShell({ active, children }: DocsShellProps) {
  return (
    <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-10 mx-auto max-w-5xl">
      {/* Mobile: collapsible menu */}
      <details className="lg:hidden mb-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
        <summary className="cursor-pointer px-4 py-2 text-sm font-medium text-zinc-300 list-none flex items-center justify-between">
          <span>CS Reference</span>
          <span className="text-zinc-500 text-xs">▾ Topics</span>
        </summary>
        <nav className="px-3 pb-3 pt-1 space-y-0.5">
          <Link
            to="/docs"
            className="block px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300"
          >
            ← Docs home
          </Link>
          {TOPICS.map((topic) => (
            <SidebarItem
              key={topic.id}
              topic={topic}
              isActive={topic.id === active}
            />
          ))}
        </nav>
      </details>

      {/* Desktop: sticky sidebar */}
      <aside className="hidden lg:block">
        <nav className="sticky top-20 self-start space-y-0.5">
          <Link
            to="/docs"
            className="mb-2 block px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300"
          >
            ← Docs home
          </Link>
          {TOPICS.map((topic) => (
            <SidebarItem
              key={topic.id}
              topic={topic}
              isActive={topic.id === active}
            />
          ))}
        </nav>
      </aside>

      {/* Content — plain div; the page-level <main> lives in __root */}
      <div className="max-w-3xl min-w-0">{children}</div>
    </div>
  );
}

function SidebarItem({
  topic,
  isActive,
}: {
  topic: (typeof TOPICS)[number];
  isActive: boolean;
}) {
  const lang = useLang();
  return (
    <Link
      to={topic.route}
      className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
        isActive
          ? "bg-sky-950/50 font-medium text-sky-400"
          : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
      }`}
    >
      {topic.label[lang]}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// References
// ---------------------------------------------------------------------------

interface ReferenceItem {
  title: string;
  href: string;
  note?: LocalizedText;
}

export function References({ items }: { items: readonly ReferenceItem[] }) {
  const lang = useLang();
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold text-zinc-100">
        {lang === "ja"
          ? "参考文献・関連リンク"
          : "References & further reading"}
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href} className="flex flex-col gap-0.5">
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline"
            >
              {item.title}
              <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                className="h-3 w-3 shrink-0 opacity-60"
                fill="currentColor"
              >
                <path d="M3.5 1A.5.5 0 0 0 3 1.5v7A.5.5 0 0 0 3.5 9h7a.5.5 0 0 0 .5-.5V6h-1v2H4V2h2V1H3.5zM8 1v1h1.293L5.146 6.146l.708.708L10 2.707V4h1V1H8z" />
              </svg>
            </a>
            {item.note && (
              <span className="text-sm text-zinc-500">{item.note[lang]}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Formula — centered display block for equations / short code
// ---------------------------------------------------------------------------

export function Formula({ t }: { t: LocalizedText }) {
  const lang = useLang();
  return (
    <div className="my-4 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-center font-mono text-sm text-zinc-200">
      {t[lang]}
    </div>
  );
}

// ---------------------------------------------------------------------------
// useSvgId — per-instance SVG id prefixer to avoid cross-diagram collisions
// ---------------------------------------------------------------------------

/** Returns a stable per-instance function that namespaces SVG ids.
 *  Usage: const sid = useSvgId(); <marker id={sid("arr")} /> url(#{sid("arr")})
 */
export function useSvgId(): (name: string) => string {
  const uid = useId();
  // React's useId() may produce colons (e.g. ":r0:") which are invalid in
  // SVG id references inside url(). Replace them with underscores.
  const safe = uid.replace(/:/g, "_");
  return (name: string) => `${safe}-${name}`;
}

// ---------------------------------------------------------------------------
// ComingSoon
// ---------------------------------------------------------------------------

export function ComingSoon({ id }: { id: TopicId }) {
  const lang = useLang();
  const topic = TOPICS.find((t) => t.id === id);
  if (!topic) return null;
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-zinc-100">{topic.label[lang]}</h1>
      <p className="text-zinc-400 leading-relaxed">
        {lang === "ja"
          ? "このセクションは現在執筆中です。"
          : "This section is being written."}
      </p>
    </div>
  );
}
