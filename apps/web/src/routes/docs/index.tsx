import { createFileRoute, Link } from "@tanstack/react-router";
import { DocsShell, TOPICS } from "../../features/docs";
import { useLang } from "../../features/i18n/lang";

export const Route = createFileRoute("/docs/")({
  component: DocsPage,
});

function DocsPage() {
  const lang = useLang();
  return (
    <DocsShell>
      <div className="space-y-12">
        <header className="space-y-4">
          <h1 className="text-3xl font-bold text-zinc-100">
            {lang === "ja" ? "CS リファレンス" : "CS Reference"}
          </h1>
          <p className="max-w-2xl text-zinc-300 leading-relaxed">
            {lang === "ja"
              ? "nand2web のテキストベース CS リファレンスへようこそ。インタラクティブなシミュレーターの文章的な補足として、各トピックを教科書レベルで掘り下げます。英語と日本語の両方で執筆されています。"
              : "Welcome to nand2web's written CS reference — the textbook companion to the interactive simulators. Each topic is covered at textbook depth, in both English and Japanese."}
          </p>
        </header>

        {/* Topic grid */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            {lang === "ja" ? "トピック" : "Topics"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {TOPICS.map((topic) => (
              <Link
                key={topic.id}
                to={topic.route}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition-colors hover:border-zinc-700 hover:bg-zinc-800/60"
              >
                <div className="mb-1 font-semibold text-zinc-100 group-hover:text-sky-300 transition-colors">
                  {topic.label[lang]}
                </div>
                <div className="text-sm text-zinc-400 leading-relaxed">
                  {topic.blurb[lang]}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* About + interactive layers */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            {lang === "ja"
              ? "インタラクティブシミュレーターについて"
              : "About the interactive simulators"}
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            {lang === "ja"
              ? "nand2web はNANDゲートから始まり、動くネットワークスタックまで、コンピュータ全体をボトムアップで再構築するインタラクティブな CS カリキュラムです。すべての概念はブラウザ上で動作するシミュレーターとして実装されています。"
              : "nand2web is an interactive CS curriculum that rebuilds the whole machine from a single NAND gate up to a working network stack. Every concept is a runnable simulator in your browser — no backend, no sign-up, works offline."}
          </p>
          <ul className="space-y-1.5 text-zinc-300">
            {[
              {
                to: "/logic",
                label: lang === "ja" ? "デジタル論理" : "Digital Logic",
              },
              { to: "/cpu", label: "CPU" },
              {
                to: "/arch",
                label:
                  lang === "ja"
                    ? "コンピュータアーキテクチャ"
                    : "Computer Architecture",
              },
              { to: "/os", label: lang === "ja" ? "OS" : "Operating Systems" },
              {
                to: "/lang",
                label:
                  lang === "ja" ? "コンパイラ & 言語" : "Compilers & Languages",
              },
              {
                to: "/net",
                label: lang === "ja" ? "ネットワーク" : "Networking",
              },
              {
                to: "/algorithms",
                label:
                  lang === "ja"
                    ? "アルゴリズム"
                    : "Algorithms & Data Structures",
              },
              {
                to: "/quiz",
                label:
                  lang === "ja"
                    ? "スペーシング反復クイズ"
                    : "Spaced-Repetition Quiz",
              },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-sky-400 hover:text-sky-300">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {lang === "ja"
              ? "ソースは GitHub に公開されています: "
              : "Full source on GitHub: "}
            <a
              href="https://github.com/subaru-hello/nand2web"
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:text-sky-300"
            >
              github.com/subaru-hello/nand2web
            </a>
          </p>
        </section>
      </div>
    </DocsShell>
  );
}
