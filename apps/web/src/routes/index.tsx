import { createFileRoute, Link } from "@tanstack/react-router";
import type { CurriculumLayer, ModuleStatus } from "../curriculum";
import { layersTopDown } from "../curriculum";
import type { LocalizedText } from "../features/deepdive/DeepDive";
import { L, useT } from "../features/docs/kit";
import { makeHead } from "../features/seo/seo";

export const Route = createFileRoute("/")({
  head: () =>
    makeHead({
      title: "nand2web — Learn how computers work, from NAND gates to the web",
      description:
        "An interactive computer-science curriculum. Step through NAND gates, a 4-bit CPU, compilers, operating systems, and network protocols with hands-on visual simulators.",
      path: "/",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "nand2web",
          url: "https://cs.n10u.jp",
          description:
            "An interactive computer-science curriculum. Step through NAND gates, a 4-bit CPU, compilers, operating systems, and network protocols with hands-on visual simulators.",
          inLanguage: ["en", "ja"],
        },
        {
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "nand2web",
          url: "https://cs.n10u.jp",
          description:
            "An interactive computer-science curriculum teaching how computers work from NAND gates to the web.",
        },
      ],
    }),
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

// ---------------------------------------------------------------------------
// Localized strings for the home page
// ---------------------------------------------------------------------------

const HOME = {
  heroH1Part1: {
    en: "Learn how computers work,",
    ja: "コンピュータの仕組みを学ぼう、",
  } satisfies LocalizedText,
  heroH1Gradient: {
    en: "from NAND gates to the web",
    ja: "NANDゲートからWebまで",
  } satisfies LocalizedText,
  heroParagraph: {
    en: "An interactive computer-science curriculum. Every concept is a simulator you can step through — no video lectures, no walls of text.",
    ja: "インタラクティブなコンピュータサイエンスカリキュラムです。すべての概念はステップ実行できるシミュレーターになっています——動画講義も長文テキストも不要です。",
  } satisfies LocalizedText,
  ctaStart: {
    en: "Start from NAND →",
    ja: "NAND から始める →",
  } satisfies LocalizedText,
  ctaDocs: {
    en: "Read the docs",
    ja: "ドキュメントを読む",
  } satisfies LocalizedText,
  howToH2: {
    en: "How to walk the stack",
    ja: "スタックの歩き方",
  } satisfies LocalizedText,
  howToIntro: {
    en: "The intended path — bottom-up, one layer building on the last.",
    ja: "推奨の進め方——ボトムアップで、前の層の上に次の層を積み上げていきます。",
  } satisfies LocalizedText,
  step01Title: {
    en: "Start at the bottom.",
    ja: "一番下から始める。",
  } satisfies LocalizedText,
  step01Body: {
    en: "Begin with [Layer 1 — Digital Logic](/logic). Build a NAND gate and watch every other gate, an adder, and a register emerge from it.",
    ja: "[レイヤー 1 ── デジタル論理](/logic) から始めましょう。NAND ゲートを組み立て、あらゆるゲート・加算器・レジスタが生まれる様子を観察します。",
  } satisfies LocalizedText,
  step02Title: {
    en: "Climb one layer at a time.",
    ja: "一層ずつ登る。",
  } satisfies LocalizedText,
  step02Body: {
    en: "Each layer assumes the one below it: gates become a CPU, the CPU gains a pipeline and a cache, then an OS, a compiler, and a network stack.",
    ja: "各層は下の層を前提にしています。ゲートが CPU となり、CPU にパイプラインとキャッシュが加わり、さらに OS・コンパイラ・ネットワークスタックへと続きます。",
  } satisfies LocalizedText,
  step03Title: {
    en: "Break every simulator.",
    ja: "シミュレーターを壊してみる。",
  } satisfies LocalizedText,
  step03Body: {
    en: "Toggle inputs, single-step the clock, inject a page fault or drop a packet. Nothing here is a video — every diagram is a live machine you drive.",
    ja: "入力を切り替え、クロックを 1 ステップずつ進め、ページフォルトを起こしたりパケットを落としたりしてみましょう。ここにある図はすべて動く機械です——動画ではありません。",
  } satisfies LocalizedText,
  step04Title: {
    en: "Lock it in.",
    ja: "知識を定着させる。",
  } satisfies LocalizedText,
  step04Body: {
    en: "When a concept clicks, the [spaced-repetition quiz](/quiz) brings it back just before you'd forget it.",
    ja: "理解できたら、[間隔反復クイズ](/quiz) が忘れかけたタイミングで復習させてくれます。",
  } satisfies LocalizedText,
} as const;

function HomePage() {
  const t = useT();
  return (
    <div className="space-y-14">
      <section className="space-y-5 pt-6 text-center">
        <h1 className="mx-auto max-w-3xl text-balance font-semibold text-4xl tracking-tight sm:text-5xl">
          {t(HOME.heroH1Part1)}{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
            {t(HOME.heroH1Gradient)}
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-pretty text-lg text-zinc-400">
          {t(HOME.heroParagraph)}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/logic"
            className="rounded-md bg-sky-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-sky-500"
          >
            {t(HOME.ctaStart)}
          </Link>
          <Link
            to="/docs"
            className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 font-medium text-sm text-zinc-200 transition-colors hover:border-sky-600"
          >
            {t(HOME.ctaDocs)}
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold">{t(HOME.howToH2)}</h2>
          <p className="text-zinc-400 text-pretty">{t(HOME.howToIntro)}</p>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2">
          <li
            key="step-01"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2"
          >
            <span className="font-mono text-sm text-sky-400">01</span>
            <p className="font-semibold">{t(HOME.step01Title)}</p>
            <p className="text-sm text-zinc-400">
              <L t={HOME.step01Body} />
            </p>
          </li>
          <li
            key="step-02"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2"
          >
            <span className="font-mono text-sm text-sky-400">02</span>
            <p className="font-semibold">{t(HOME.step02Title)}</p>
            <p className="text-sm text-zinc-400">{t(HOME.step02Body)}</p>
          </li>
          <li
            key="step-03"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2"
          >
            <span className="font-mono text-sm text-sky-400">03</span>
            <p className="font-semibold">{t(HOME.step03Title)}</p>
            <p className="text-sm text-zinc-400">{t(HOME.step03Body)}</p>
          </li>
          <li
            key="step-04"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2"
          >
            <span className="font-mono text-sm text-sky-400">04</span>
            <p className="font-semibold">{t(HOME.step04Title)}</p>
            <p className="text-sm text-zinc-400">
              <L t={HOME.step04Body} />
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
  const t = useT();
  return (
    <li className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition-colors hover:border-zinc-700">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-sm text-zinc-500">L{layer.order}</span>
        <h2 className="font-semibold text-xl">{t(layer.title)}</h2>
        <p className="text-sm text-zinc-400">{t(layer.subtitle)}</p>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {layer.modules.map((mod) => {
          const status = statusStyles[mod.status];
          const body = (
            <>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium">{t(mod.title)}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[11px] ring-1 ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-zinc-400">
                {t(mod.description)}
              </p>
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
