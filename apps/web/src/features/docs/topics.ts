import type { LocalizedText } from "../deepdive/DeepDive";

export type TopicId =
  | "cs-history"
  | "cpu"
  | "memory"
  | "io"
  | "os"
  | "compiler"
  | "network"
  | "web"
  | "server-architecture"
  | "llm"
  | "software-engineering"
  | "oss"
  | "arai60";

/** Literal route paths for all topic pages — matches TanStack Router's registered routes. */
export type TopicRoute =
  | "/docs/cs-history"
  | "/docs/cpu"
  | "/docs/memory"
  | "/docs/io"
  | "/docs/os"
  | "/docs/compiler"
  | "/docs/network"
  | "/docs/web"
  | "/docs/server-architecture"
  | "/docs/llm"
  | "/docs/software-engineering"
  | "/docs/oss"
  | "/docs/arai60";

export interface Topic {
  readonly id: TopicId;
  readonly slug: string;
  /** Typed literal route path for use with TanStack Router <Link to>. */
  readonly route: TopicRoute;
  readonly label: LocalizedText;
  readonly blurb: LocalizedText;
}

export const TOPICS: readonly Topic[] = [
  {
    id: "cs-history",
    slug: "cs-history",
    route: "/docs/cs-history",
    label: { en: "The Whole Picture", ja: "全体像と歴史" },
    blurb: {
      en: "The entry map: where every module sits in the landscape of computer science, told through its history — from al-Khwārizmī's algorithms and Turing's theory to gates, CPUs, networks, and learning machines.",
      ja: "入口となる地図：各モジュールがコンピュータサイエンスの風景のどこに位置するかを、歴史を通じて示す——アルゴリズムとチューリングの理論から、ゲート・CPU・ネットワーク・学習する機械まで。",
    },
  },
  {
    id: "cpu",
    slug: "cpu",
    route: "/docs/cpu",
    label: { en: "CPU", ja: "CPU" },
    blurb: {
      en: "How a processor fetches, decodes, and executes instructions — from the ALU to pipelining to modern superscalar cores.",
      ja: "プロセッサが命令をフェッチ・デコード・実行する仕組み——ALUからパイプライン、現代のスーパースカラコアまで。",
    },
  },
  {
    id: "memory",
    slug: "memory",
    route: "/docs/memory",
    label: { en: "Memory", ja: "メモリ" },
    blurb: {
      en: "The memory hierarchy: registers, caches, DRAM, and virtual memory — why speed and capacity trade off.",
      ja: "メモリ階層：レジスタ・キャッシュ・DRAM・仮想メモリ——速度と容量がトレードオフになる理由。",
    },
  },
  {
    id: "io",
    slug: "io",
    route: "/docs/io",
    label: { en: "Input / Output", ja: "I/O" },
    blurb: {
      en: "How CPUs talk to the outside world: buses, DMA, interrupts, and the I/O software stack.",
      ja: "CPUが外界とやり取りする方法：バス・DMA・割り込み、I/Oソフトウェアスタック。",
    },
  },
  {
    id: "os",
    slug: "os",
    route: "/docs/os",
    label: { en: "Operating Systems", ja: "OS" },
    blurb: {
      en: "Processes, scheduling, virtual memory, file systems, and the kernel/user boundary.",
      ja: "プロセス・スケジューリング・仮想メモリ・ファイルシステム、そしてカーネルとユーザー空間の境界。",
    },
  },
  {
    id: "compiler",
    slug: "compiler",
    route: "/docs/compiler",
    label: { en: "Compilers", ja: "コンパイラ" },
    blurb: {
      en: "Lexing, parsing, type checking, IR generation, and code gen — how source code becomes machine instructions.",
      ja: "字句解析・構文解析・型検査・IR生成・コード生成——ソースコードが機械語になるまで。",
    },
  },
  {
    id: "network",
    slug: "network",
    route: "/docs/network",
    label: { en: "Networking", ja: "ネットワーク" },
    blurb: {
      en: "The layered internet: Ethernet, IP, TCP/UDP, DNS, and how data moves across the planet.",
      ja: "階層化されたインターネット：Ethernet・IP・TCP/UDP・DNS、データが地球を渡る仕組み。",
    },
  },
  {
    id: "web",
    slug: "web",
    route: "/docs/web",
    label: { en: "Web Development", ja: "Web開発" },
    blurb: {
      en: "HTTP, HTML/CSS, JavaScript engines, browsers, CDNs, and modern web architecture.",
      ja: "HTTP・HTML/CSS・JavaScriptエンジン・ブラウザ・CDN、現代のWebアーキテクチャ。",
    },
  },
  {
    id: "server-architecture",
    slug: "server-architecture",
    route: "/docs/server-architecture",
    label: { en: "Server Architecture", ja: "サーバーアーキテクチャ" },
    blurb: {
      en: "How one server handles thousands of connections — sockets, processes, threads, the C10K problem, event loops — and how servers talk: reverse proxies, RPC, message queues.",
      ja: "1台のサーバーが数千の接続を扱う仕組み——ソケット・プロセス・スレッド・C10K問題・イベントループ——とサーバー間通信：リバースプロキシ・RPC・メッセージキュー。",
    },
  },
  {
    id: "llm",
    slug: "llm",
    route: "/docs/llm",
    label: { en: "Large Language Models", ja: "LLM" },
    blurb: {
      en: "Transformers, attention, training at scale, and what modern language models actually compute.",
      ja: "トランスフォーマー・アテンション・スケール学習、現代の言語モデルが実際に計算すること。",
    },
  },
  {
    id: "software-engineering",
    slug: "software-engineering",
    route: "/docs/software-engineering",
    label: { en: "Software Engineering", ja: "ソフトウェア工学" },
    blurb: {
      en: "Version control, testing, design patterns, architecture, and the craft of building reliable software.",
      ja: "バージョン管理・テスト・デザインパターン・アーキテクチャ、信頼性の高いソフトウェアを作る技術。",
    },
  },
  {
    id: "oss",
    slug: "oss",
    route: "/docs/oss",
    label: { en: "Open Source", ja: "OSS" },
    blurb: {
      en: "Licenses, governance, contribution models, and the economics of open-source software.",
      ja: "ライセンス・ガバナンス・コントリビューションモデル、オープンソースソフトウェアの経済学。",
    },
  },
  {
    id: "arai60",
    slug: "arai60",
    route: "/docs/arai60",
    label: { en: "Arai60", ja: "Arai60" },
    blurb: {
      en: "Bilingual write-ups for 60 LeetCode problems across 12 algorithm categories — approach, complexity, code, and alternatives.",
      ja: "12カテゴリ・60問の LeetCode 問題を日英バイリンガルで解説——考え方・計算量・コード・代替解法を収録。",
    },
  },
] as const;
