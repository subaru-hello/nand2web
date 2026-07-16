import { createFileRoute } from "@tanstack/react-router";
import {
  CS_HISTORY_FURTHER_READING,
  CS_HISTORY_STAGES,
} from "../../features/cs-history/data";
import {
  Article,
  C,
  Callout,
  CompareTable,
  Diagram,
  DocsShell,
  Figure,
  FlowRow,
  LayerStack,
  Prose,
  References,
  rich,
  Section,
  useSvgId,
  useT,
} from "../../features/docs";
import { makeDocJsonLd, makeHead } from "../../features/seo/seo";

const CS_HISTORY_TITLE = "Computer Science: The Whole Picture — nand2web";
const CS_HISTORY_DESC =
  "The whole picture of computer science, told through its history — from al-Khwārizmī's algorithms and Turing's 1936 theory to logic gates, CPUs, compilers, networks, and learning machines. The entry map that places every nand2web module in the landscape of CS.";

export const Route = createFileRoute("/docs/cs-history")({
  head: () =>
    makeHead({
      title: CS_HISTORY_TITLE,
      description: CS_HISTORY_DESC,
      path: "/docs/cs-history",
      jsonLd: makeDocJsonLd({
        title: CS_HISTORY_TITLE,
        description: CS_HISTORY_DESC,
        path: "/docs/cs-history",
        breadcrumbLabel: "Computer Science: The Whole Picture",
      }),
    }),
  component: Page,
});

function Page() {
  return (
    <DocsShell active="cs-history">
      <Article
        title={{
          en: "Computer Science: The Whole Picture",
          ja: "コンピュータサイエンスの全体像と歴史",
        }}
        lead={{
          en: "This page is the entry map of the site. Computer science can look like a scattered pile of topics — gates, CPUs, operating systems, algorithms, networks, AI — but they form one connected landscape, and the fastest way to see how they fit is to walk the history that produced them. Along the way, every nand2web module is placed where it belongs in the stack.",
          ja: "このページは本サイトの入口となる地図です。コンピュータサイエンスは、ゲート・CPU・OS・アルゴリズム・ネットワーク・AIといった話題が散らばった山のように見えるかもしれません。しかしそれらは一つのつながった風景を成しており、その結びつきを最短で見て取る方法は、それらを生み出した歴史をたどることです。その道すがら、nand2web の各モジュールがスタックの中の本来あるべき場所に置かれていきます。",
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Part 1 — the historical arc                                       */}
        {/* ---------------------------------------------------------------- */}
        <CsHistorySection />

        {/* ---------------------------------------------------------------- */}
        {/* Part 2 — the map of CS                                            */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="the-stack"
          title={{
            en: "The map — one stack of abstractions",
            ja: "地図——一つの抽象化のスタック",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "The history above resolves into a single idea: computer science is a **stack of abstractions**, each layer built on the one below and hiding its complexity from the one above. Physics gives us switches; switches give us logic gates; gates give us a CPU; the CPU plus an operating system gives us a programmable machine; languages and compilers give us expressive programs; those programs become applications, network with one another, and — most recently — learn from data. Each layer trusts the layer beneath and serves the layer above.",
                ja: "上の歴史は、一つの発想へと収束します：コンピュータサイエンスとは**抽象化のスタック**であり、各層はその下の層の上に築かれ、その複雑さを上の層から隠します。物理がスイッチを与え、スイッチが論理ゲートを与え、ゲートがCPUを与え、CPUとオペレーティングシステムがプログラム可能な機械を与え、言語とコンパイラが表現力あるプログラムを与える。それらのプログラムはアプリケーションとなり、互いにネットワークし、そして——ごく最近では——データから学習する。各層は下の層を信頼し、上の層に奉仕します。",
              },
              {
                en: "Read the figure from the bottom up — that is the order in which the ideas were discovered, and the order in which this site builds them. Each layer is labelled with the module that covers it, so this stack doubles as a table of contents for everything nand2web teaches.",
                ja: "図は下から上へ読んでください——それが、これらの発想が発見された順序であり、本サイトがそれらを組み立てる順序でもあります。各層には、それを扱うモジュールが添えられているので、このスタックは nand2web が教えるすべての目次も兼ねています。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "The abstraction stack of computing. Read bottom-up: each layer hides the one below and is covered by a nand2web module.",
              ja: "計算の抽象化スタック。下から上へ読む：各層は下の層を隠し、nand2web のモジュールが対応する。",
            }}
          >
            <LayerStack
              layers={[
                {
                  label: {
                    en: "Learning machines (AI / LLMs)",
                    ja: "学習する機械（AI・LLM）",
                  },
                  sub: { en: "/docs/llm", ja: "/docs/llm" },
                  tone: "accent",
                },
                {
                  label: { en: "Network & the Web", ja: "ネットワークとWeb" },
                  sub: {
                    en: "/docs/network · /docs/web",
                    ja: "/docs/network・/docs/web",
                  },
                  tone: "accent",
                },
                {
                  label: {
                    en: "Applications & algorithms",
                    ja: "アプリケーションとアルゴリズム",
                  },
                  sub: {
                    en: "/pathfinding · /hashtable",
                    ja: "/pathfinding・/hashtable",
                  },
                  tone: "emerald",
                },
                {
                  label: {
                    en: "Languages & compilers",
                    ja: "言語とコンパイラ",
                  },
                  sub: {
                    en: "/docs/compiler · /lang",
                    ja: "/docs/compiler・/lang",
                  },
                  tone: "emerald",
                },
                {
                  label: {
                    en: "Operating system",
                    ja: "オペレーティングシステム",
                  },
                  sub: { en: "/docs/os · /os", ja: "/docs/os・/os" },
                  tone: "emerald",
                },
                {
                  label: {
                    en: "CPU (stored-program machine)",
                    ja: "CPU（プログラム内蔵方式の機械）",
                  },
                  sub: { en: "/cpu", ja: "/cpu" },
                  tone: "zinc",
                },
                {
                  label: { en: "Logic gates", ja: "論理ゲート" },
                  sub: { en: "/logic", ja: "/logic" },
                  tone: "zinc",
                },
                {
                  label: { en: "Physics — switches", ja: "物理——スイッチ" },
                  sub: {
                    en: "relays, tubes, transistors",
                    ja: "リレー・真空管・トランジスタ",
                  },
                  tone: "zinc",
                },
              ]}
            />
          </Figure>
        </Section>

        <Section
          id="four-areas"
          title={{
            en: "The four broad areas of CS",
            ja: "CSの4つの大領域",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "The stack tells you how the layers fit together; the field is also commonly divided by the *kind of question* being asked. Four broad areas cover most of computer science. They overlap — an operating system uses algorithms, an AI system is a piece of software engineering — but each has a distinct central question.",
                ja: "スタックは各層がどう組み合わさるかを教えてくれます。この分野はまた、*問いの種類*によっても一般に区分されます。4つの大領域がコンピュータサイエンスの大半を覆います。それらは重なり合いますが——OSはアルゴリズムを使い、AIシステムはソフトウェア工学の産物です——それぞれに固有の中心的な問いがあります。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "Four broad areas of computer science, by the question each one asks.",
              ja: "コンピュータサイエンスの4つの大領域——それぞれが問う問いによる分類。",
            }}
          >
            <CompareTable
              headers={[
                { en: "Area", ja: "領域" },
                { en: "The question it asks", ja: "問う問い" },
                { en: "Representative topics", ja: "代表的な話題" },
                { en: "On this site", ja: "本サイトでは" },
              ]}
              rows={[
                [
                  { en: "**Theory**", ja: "**理論**" },
                  {
                    en: "What can be computed, and how efficiently?",
                    ja: "何が計算でき、どれほど効率的にできるか？",
                  },
                  {
                    en: "Computability, automata, Big-O, P vs NP",
                    ja: "計算可能性・オートマトン・O記法・P対NP",
                  },
                  {
                    en: "[Algorithms](/pathfinding), [hashing](/hashtable)",
                    ja: "[アルゴリズム](/pathfinding)・[ハッシュ](/hashtable)",
                  },
                ],
                [
                  { en: "**Systems**", ja: "**システム**" },
                  {
                    en: "How do we build fast, correct machines from parts?",
                    ja: "部品から高速で正しい機械をどう作るか？",
                  },
                  {
                    en: "Logic, CPUs, memory, OS, networks",
                    ja: "論理・CPU・メモリ・OS・ネットワーク",
                  },
                  {
                    en: "[Logic](/logic), [CPU](/cpu), [OS](/docs/os), [network](/docs/network)",
                    ja: "[論理](/logic)・[CPU](/cpu)・[OS](/docs/os)・[ネットワーク](/docs/network)",
                  },
                ],
                [
                  {
                    en: "**Software engineering**",
                    ja: "**ソフトウェア工学**",
                  },
                  {
                    en: "How do we build software that stays reliable at scale?",
                    ja: "規模が大きくなっても信頼できるソフトをどう作るか？",
                  },
                  {
                    en: "Languages, compilers, testing, architecture",
                    ja: "言語・コンパイラ・テスト・アーキテクチャ",
                  },
                  {
                    en: "[Compilers](/docs/compiler), [software engineering](/docs/software-engineering)",
                    ja: "[コンパイラ](/docs/compiler)・[ソフトウェア工学](/docs/software-engineering)",
                  },
                ],
                [
                  { en: "**AI**", ja: "**AI**" },
                  {
                    en: "How can machines learn a procedure from data?",
                    ja: "機械はデータから手続きをどう学べるか？",
                  },
                  {
                    en: "Statistical learning, neural nets, transformers, LLMs",
                    ja: "統計的学習・ニューラルネット・Transformer・LLM",
                  },
                  {
                    en: "[Large language models](/docs/llm)",
                    ja: "[大規模言語モデル](/docs/llm)",
                  },
                ],
              ]}
            />
          </Figure>

          <Callout
            tone="insight"
            title={{
              en: "The one mental model to keep",
              ja: "覚えておくべき一つのメンタルモデル",
            }}
            t={{
              en: "Computer science is the study of **what can be automated** — of turning a problem into a procedure a machine can carry out. Every layer of the stack is an **abstraction that hides the one below**: a gate hides the transistor, a CPU hides the gates, an operating system hides the hardware, a language hides the machine code, a model hides the hand-written rules. Understanding computing means being able to move up and down that ladder, trusting each layer while knowing what it stands on.",
              ja: "コンピュータサイエンスとは、**何が自動化できるか**——問題を、機械が実行できる手続きへと変えること——の学問です。スタックの各層は、**その下の層を隠す抽象化**です：ゲートはトランジスタを隠し、CPUはゲートを隠し、OSはハードウェアを隠し、言語は機械語を隠し、モデルは手書きの規則を隠します。計算を理解するとは、そのはしごを上下に行き来できること——各層を信頼しつつ、それが何の上に立っているかを知っていること——です。",
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* References                                                        */}
        {/* ---------------------------------------------------------------- */}
        <References
          items={[
            {
              title: "Faza — Mental models: how software works",
              href: "https://fazamhd.com/mental-models/software/",
              note: {
                en: "The mental-models walkthrough that inspired this page's format. The prose here is original and independent — Faza's article is a recommended companion read.",
                ja: "このページのウォークスルー形式に着想を与えたメンタルモデル記事。本文はオリジナルかつ独立に書かれたもので、Faza の記事は併読としておすすめ。",
              },
            },
            {
              title: "ACM/IEEE-CS Computer Science Curricula (CS2023)",
              href: "https://csed.acm.org/",
              note: {
                en: "The authoritative curriculum defining the knowledge areas of computer science, jointly published by ACM and IEEE Computer Society.",
                ja: "コンピュータサイエンスの知識領域を定義する権威あるカリキュラム。ACM と IEEE Computer Society が共同で発行。",
              },
            },
            {
              title:
                "Turing — On Computable Numbers, with an Application to the Entscheidungsproblem (1936)",
              href: "https://en.wikipedia.org/wiki/Turing_machine",
              note: {
                en: "The paper that introduced the Turing machine and fixed the meaning of computation before electronic computers existed.",
                ja: "チューリング機械を導入し、電子計算機の登場前に計算の意味を確定させた論文。",
              },
            },
            {
              title:
                "Shannon — A Symbolic Analysis of Relay and Switching Circuits (1937)",
              href: "https://en.wikipedia.org/wiki/A_Symbolic_Analysis_of_Relay_and_Switching_Circuits",
              note: {
                en: "Shannon's master's thesis linking Boolean algebra to physical switching circuits — the bridge from logic to hardware.",
                ja: "ブール代数と物理的なスイッチ回路を結び付けたシャノンの修士論文——論理からハードウェアへの架け橋。",
              },
            },
            {
              title: "Nand2Tetris — The Elements of Computing Systems",
              href: "https://www.nand2tetris.org/",
              note: {
                en: "The build-a-computer-from-first-principles course that inspired this site's bottom-up philosophy.",
                ja: "本サイトのボトムアップな理念に影響を与えた、第一原理からコンピュータを組み立てる講座。",
              },
            },
            {
              title: "nand2web — Networking (the network & Web arc in depth)",
              href: "https://cs.n10u.jp/docs/network",
              note: {
                en: "Stage 9 of the arc above is covered in full — telegraph through packet switching, IP, TCP, DNS, and TLS.",
                ja: "上の流れの第9段階を全面的に扱う——電信からパケット交換、IP、TCP、DNS、TLS まで。",
              },
            },
          ]}
        />
      </Article>
    </DocsShell>
  );
}

// ---------------------------------------------------------------------------
// Part 1 — the historical arc
// ---------------------------------------------------------------------------

function CsHistorySection() {
  const t = useT();
  const fr = CS_HISTORY_FURTHER_READING;
  return (
    <Section
      id="history"
      title={{
        en: "The arc — how computer science was built, stage by stage",
        ja: "流れ——コンピュータサイエンスがどう築かれたか、段階を追って",
      }}
    >
      <Prose
        paragraphs={[
          {
            en: "Computer science did not arrive all at once. It grew over centuries, each stage answering a question the previous one raised, and each leaving behind a durable **mental model** that still governs how we think. Walking the arc in order — from the idea of an algorithm, to the theory of what is computable, to gates, machines, languages, systems, networks, and finally learning — is the fastest way to see why the field is one connected whole rather than a list of unrelated topics.",
            ja: "コンピュータサイエンスは一度に到来したのではありません。何世紀もかけて育ち、各段階が前の段階の提起した問いに答え、そして今なお私たちの考え方を支配する不朽の**メンタルモデル**を残してきました。この流れを順にたどること——アルゴリズムという発想から、何が計算可能かの理論、ゲート、機械、言語、システム、ネットワーク、そして最後に学習へ——が、この分野が無関係な話題の羅列ではなく、一つのつながった全体である理由を最短で見て取る方法です。",
          },
          {
            en: "A few themes recur across the whole arc: **procedures** (a problem solved becomes a set of repeatable steps); **abstraction** (each layer hides the complexity of the one below); **theory before hardware** (what is possible was settled by mathematics, not engineering); and **emergent behaviour from local rules** (large systems that no central authority controls). Watch for them as you read.",
            ja: "いくつかのテーマが流れ全体を貫いて繰り返し現れます：**手続き**（解かれた問題は反復可能な手順の集合になる）；**抽象化**（各層は下の層の複雑さを隠す）；**ハードウェアより先に理論**（何が可能かは工学ではなく数学が決めた）；そして**局所的な規則から創発する振る舞い**（中央の管理者がいない大規模システム）。読みながらこれらに注目してください。",
          },
        ]}
      />

      <Figure
        caption={{
          en: "The whole arc at a glance — ten stages from al-Khwārizmī's algorithms to today's learning machines. Each stage below expands one step of this line.",
          ja: "流れの全体を一目で——アル＝フワーリズミーのアルゴリズムから今日の学習する機械まで、10段階。下の各段落は、この線の1ステップを詳しく開いたものです。",
        }}
      >
        <FlowRow
          steps={[
            {
              label: { en: "Algorithms", ja: "アルゴリズム" },
              sub: { en: "9th c.", ja: "9世紀" },
            },
            {
              label: { en: "Computability", ja: "計算可能性" },
              sub: { en: "1936", ja: "1936" },
            },
            {
              label: { en: "Logic gates", ja: "論理ゲート" },
              sub: { en: "1937", ja: "1937" },
            },
            {
              label: { en: "Stored program", ja: "プログラム内蔵" },
              sub: { en: "1945", ja: "1945" },
            },
            {
              label: { en: "Compilers", ja: "コンパイラ" },
              sub: { en: "1957", ja: "1957" },
            },
            {
              label: { en: "Operating systems", ja: "OS" },
              sub: { en: "1969", ja: "1969" },
            },
            {
              label: { en: "Complexity", ja: "計算量" },
              sub: { en: "1971", ja: "1971" },
            },
            {
              label: { en: "Personal / GUI", ja: "PC・GUI" },
              sub: { en: "1973", ja: "1973" },
            },
            {
              label: { en: "Network & Web", ja: "ネットとWeb" },
              sub: { en: "1991", ja: "1991" },
            },
            {
              label: { en: "Learning machines", ja: "学習する機械" },
              sub: { en: "2017–", ja: "2017–" },
            },
          ]}
        />
      </Figure>

      <div className="space-y-8 mt-2">
        {CS_HISTORY_STAGES.map((stage) => (
          <div key={stage.id} className="space-y-6">
            <StageBlock t={t} stage={stage} />
            {stage.id === "stored-program" && (
              <Figure
                caption={{
                  en: "The von Neumann architecture. Instructions and data share one memory — a program can be loaded, and even manipulated, like any other data. That is what makes the machine general-purpose.",
                  ja: "フォン・ノイマン型アーキテクチャ。命令とデータは同じメモリに同居する——プログラムはデータと同じように読み込め、書き換えることさえできる。これが機械を汎用にする。",
                }}
              >
                <VonNeumannDiagram />
              </Figure>
            )}
          </div>
        ))}
      </div>

      {/* Further reading attribution */}
      <div className="mt-8 rounded-xl border border-zinc-700 bg-zinc-900/60 px-5 py-4 space-y-1">
        <p className="text-sm font-semibold text-zinc-400">
          {t({ en: "Further reading", ja: "さらに読む" })}
        </p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          {rich(t(fr.note))}{" "}
          <a
            href={fr.href}
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 underline-offset-2 hover:text-sky-300 hover:underline"
          >
            {t(fr.label)} →
          </a>
        </p>
      </div>
    </Section>
  );
}

interface StageBlockProps {
  t: (lt: { en: string; ja: string }) => string;
  stage: (typeof CS_HISTORY_STAGES)[number];
}

function StageBlock({ t, stage }: StageBlockProps) {
  return (
    <div className="space-y-3 border-l-2 border-zinc-700 pl-4">
      <h3 className="text-lg font-semibold text-zinc-100">{t(stage.title)}</h3>

      {/* Historical milestone */}
      <p className="text-xs font-medium uppercase tracking-wide text-sky-400">
        {t({ en: "Milestone", ja: "マイルストーン" })}
      </p>
      <p className="text-zinc-300 leading-relaxed text-sm">
        {rich(t(stage.milestone))}
      </p>

      {/* Mental model */}
      <p className="text-xs font-medium uppercase tracking-wide text-emerald-400">
        {t({ en: "Mental model", ja: "メンタルモデル" })}
      </p>
      <p className="text-zinc-300 leading-relaxed text-sm">
        {rich(t(stage.mentalModel))}
      </p>

      {/* Detail */}
      <p className="text-zinc-400 leading-relaxed text-sm">
        {rich(t(stage.detail))}
      </p>

      {/* Optional example */}
      {stage.example && (
        <pre className="rounded bg-zinc-800 px-4 py-3 font-mono text-[12px] text-sky-300 overflow-x-auto whitespace-pre-wrap">
          {stage.example}
        </pre>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Von Neumann (stored-program) architecture SVG diagram
// ---------------------------------------------------------------------------

function VonNeumannDiagram() {
  const sid = useSvgId();
  return (
    <Diagram
      label={{
        en: "Von Neumann architecture: a single memory holding both program instructions and data, connected to a CPU (control unit and ALU) by an address bus and a data bus.",
        ja: "フォン・ノイマン型アーキテクチャ：プログラムの命令とデータの両方を保持する単一のメモリが、アドレスバスとデータバスによって CPU（制御ユニットと ALU）に接続されている。",
      }}
      viewBox="0 0 560 300"
      maxHeight={300}
    >
      {/* Background */}
      <rect width="560" height="300" fill={C.panel} rx="8" />

      {/* --- Memory box --- */}
      <rect
        x="24"
        y="40"
        width="220"
        height="220"
        rx="8"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="134"
        y="62"
        textAnchor="middle"
        fill={C.accent}
        fontSize="13"
        fontWeight="700"
      >
        Memory
      </text>
      <text x="134" y="78" textAnchor="middle" fill={C.faint} fontSize="10">
        one address space
      </text>

      {/* program (instructions) cells */}
      <rect
        x="44"
        y="94"
        width="180"
        height="70"
        rx="5"
        fill={C.panel}
        stroke={C.high}
        strokeWidth="1.5"
      />
      <text
        x="134"
        y="112"
        textAnchor="middle"
        fill={C.high}
        fontSize="11"
        fontWeight="600"
      >
        program (instructions)
      </text>
      <text
        x="134"
        y="134"
        textAnchor="middle"
        fill={C.text}
        fontSize="10"
        fontFamily="monospace"
      >
        LOAD · ADD · STORE
      </text>
      <text
        x="134"
        y="150"
        textAnchor="middle"
        fill={C.faint}
        fontSize="10"
        fontFamily="monospace"
      >
        JMP · HALT …
      </text>

      {/* data cells */}
      <rect
        x="44"
        y="176"
        width="180"
        height="64"
        rx="5"
        fill={C.panel}
        stroke={C.warn}
        strokeWidth="1.5"
      />
      <text
        x="134"
        y="194"
        textAnchor="middle"
        fill={C.warn}
        fontSize="11"
        fontWeight="600"
      >
        data
      </text>
      <text
        x="134"
        y="216"
        textAnchor="middle"
        fill={C.text}
        fontSize="10"
        fontFamily="monospace"
      >
        42 · 7 · "hi" · …
      </text>

      {/* --- CPU box --- */}
      <rect
        x="356"
        y="40"
        width="180"
        height="220"
        rx="8"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="446"
        y="62"
        textAnchor="middle"
        fill={C.accent}
        fontSize="13"
        fontWeight="700"
      >
        CPU
      </text>

      {/* control unit */}
      <rect
        x="376"
        y="82"
        width="140"
        height="70"
        rx="5"
        fill={C.panel}
        stroke={C.line}
        strokeWidth="1.5"
      />
      <text
        x="446"
        y="112"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        control unit
      </text>
      <text x="446" y="130" textAnchor="middle" fill={C.faint} fontSize="10">
        fetch · decode
      </text>

      {/* ALU */}
      <rect
        x="376"
        y="164"
        width="140"
        height="76"
        rx="5"
        fill={C.panel}
        stroke={C.line}
        strokeWidth="1.5"
      />
      <text
        x="446"
        y="196"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        ALU
      </text>
      <text x="446" y="214" textAnchor="middle" fill={C.faint} fontSize="10">
        execute (+ − ∧ ∨)
      </text>

      {/* --- Buses between Memory and CPU --- */}
      {/* address bus: CPU → Memory (which cell to read/write) */}
      <line
        x1="354"
        y1="120"
        x2="246"
        y2="120"
        stroke={C.accent}
        strokeWidth="2"
        markerEnd={`url(#${sid("arrA")})`}
      />
      <text
        x="300"
        y="112"
        textAnchor="middle"
        fill={C.accent}
        fontSize="11"
        fontWeight="600"
      >
        address
      </text>

      {/* data bus: Memory → CPU (instruction or data, same wire) */}
      <line
        x1="246"
        y1="180"
        x2="354"
        y2="180"
        stroke={C.high}
        strokeWidth="2"
        markerEnd={`url(#${sid("arrD")})`}
      />
      <text
        x="300"
        y="172"
        textAnchor="middle"
        fill={C.high}
        fontSize="11"
        fontWeight="600"
      >
        instruction / data
      </text>
      <text x="300" y="196" textAnchor="middle" fill={C.faint} fontSize="10">
        (same bus)
      </text>

      {/* Punchline banner */}
      <text
        x="280"
        y="282"
        textAnchor="middle"
        fill={C.high}
        fontSize="11"
        fontStyle="italic"
      >
        Instructions live in the SAME memory as data — program as data
      </text>

      {/* Arrow markers */}
      <defs>
        <marker
          id={sid("arrA")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.accent} />
        </marker>
        <marker
          id={sid("arrD")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.high} />
        </marker>
      </defs>
    </Diagram>
  );
}
