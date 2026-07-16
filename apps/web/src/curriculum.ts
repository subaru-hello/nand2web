/**
 * Single source of truth for the curriculum: what layers and modules exist,
 * where they live, and how far along they are. The landing page, routing,
 * and progress tracking all derive from this.
 */

import type { LocalizedText } from "./features/deepdive/DeepDive";

export type ModuleStatus = "done" | "wip" | "planned";

export interface CurriculumModule {
  readonly id: string;
  readonly title: LocalizedText;
  readonly description: LocalizedText;
  readonly status: ModuleStatus;
  /** Route path once the module ships. */
  readonly route?: string;
  readonly topics: readonly string[];
}

export interface CurriculumLayer {
  /** 1 = closest to the hardware. Rendered as a stack with layer 1 at the bottom. */
  readonly order: number;
  readonly id: string;
  readonly title: LocalizedText;
  readonly subtitle: LocalizedText;
  readonly modules: readonly CurriculumModule[];
}

export const curriculum: readonly CurriculumLayer[] = [
  {
    order: 1,
    id: "logic",
    title: { en: "Digital Logic", ja: "デジタル論理" },
    subtitle: { en: "Everything is NAND", ja: "すべては NAND から始まる" },
    modules: [
      {
        id: "logic-gates",
        title: { en: "From NAND to ALU", ja: "NAND から ALU へ" },
        description: {
          en: "Build every gate from NAND, then compose adders, latches, registers, and a working 4-bit ALU. Toggle inputs and watch signals propagate.",
          ja: "NAND からあらゆるゲートを組み立て、加算器・ラッチ・レジスタ、そして動作する 4 ビット ALU を構成します。入力を切り替えて信号の伝播を観察しましょう。",
        },
        status: "done",
        route: "/logic",
        topics: [
          "NAND completeness",
          "combinational vs. sequential",
          "full adder",
          "D flip-flop",
          "4-bit ALU",
        ],
      },
    ],
  },
  {
    order: 2,
    id: "cpu",
    title: { en: "The CPU", ja: "CPU" },
    subtitle: {
      en: "A stored-program computer, 4 bits at a time",
      ja: "4 ビットで学ぶストアードプログラム方式",
    },
    modules: [
      {
        id: "cpu-4bit",
        title: { en: "4-bit CPU", ja: "4 ビット CPU" },
        description: {
          en: "Write assembly for a tiny 16-instruction ISA and watch fetch → decode → execute animate across the datapath, cycle by cycle.",
          ja: "16 命令の小さな ISA 向けにアセンブリを書き、フェッチ → デコード → 実行がデータパス上でサイクルごとにアニメーションする様子を観察します。",
        },
        status: "done",
        route: "/cpu",
        topics: [
          "ISA design",
          "datapath & control",
          "fetch/decode/execute",
          "assembler",
        ],
      },
    ],
  },
  {
    order: 3,
    id: "arch",
    title: { en: "Computer Architecture", ja: "コンピュータアーキテクチャ" },
    subtitle: {
      en: "Making it fast: pipelines and caches",
      ja: "高速化の核心：パイプラインとキャッシュ",
    },
    modules: [
      {
        id: "arch-pipeline",
        title: { en: "Pipelining & Hazards", ja: "パイプラインとハザード" },
        description: {
          en: "A 5-stage pipeline with data and control hazards. Compare stalling against forwarding and count the cycles.",
          ja: "データハザードと制御ハザードを含む 5 段パイプラインを実装します。ストールとフォワーディングを比較しながらサイクル数を計測しましょう。",
        },
        status: "done",
        route: "/arch",
        topics: ["IF/ID/EX/MEM/WB", "hazards", "forwarding"],
      },
      {
        id: "arch-cache",
        title: { en: "Cache Hierarchy", ja: "キャッシュ階層" },
        description: {
          en: "Direct-mapped vs. set-associative caches. Replay access patterns and watch hit rates change.",
          ja: "ダイレクトマップとセット連想方式を比較します。アクセスパターンを再生してヒット率の変化を観察しましょう。",
        },
        status: "done",
        route: "/arch",
        topics: ["locality", "associativity", "LRU"],
      },
    ],
  },
  {
    order: 4,
    id: "os",
    title: { en: "Operating Systems", ja: "OS" },
    subtitle: {
      en: "Sharing one machine among many programs",
      ja: "一台のマシンを複数のプログラムで共有する仕組み",
    },
    modules: [
      {
        id: "os-scheduling",
        title: { en: "Process Scheduling", ja: "プロセススケジューリング" },
        description: {
          en: "FCFS, SJF, Round-Robin, and MLFQ on the same workload — Gantt charts and waiting-time comparisons included.",
          ja: "同じワークロードで FCFS・SJF・ラウンドロビン・MLFQ を比較します。ガントチャートと待ち時間の比較も確認できます。",
        },
        status: "done",
        route: "/os",
        topics: ["FCFS / SJF / RR / MLFQ", "turnaround & waiting time"],
      },
      {
        id: "os-memory",
        title: { en: "Virtual Memory", ja: "仮想メモリ" },
        description: {
          en: "Follow a virtual address through the page table walk, trigger page faults, and race FIFO vs. LRU vs. Clock replacement.",
          ja: "仮想アドレスがページテーブルをたどる過程を追い、ページフォルトを起こして、FIFO・LRU・Clock の置換アルゴリズムを競わせます。",
        },
        status: "done",
        route: "/os",
        topics: ["paging", "page faults", "replacement policies"],
      },
    ],
  },
  {
    order: 5,
    id: "lang",
    title: { en: "Compilers & Languages", ja: "コンパイラと言語処理系" },
    subtitle: {
      en: "From characters to computation",
      ja: "文字列から計算へ",
    },
    modules: [
      {
        id: "lang-pipeline",
        title: { en: "Compiler Pipeline", ja: "コンパイラパイプライン" },
        description: {
          en: "Type a tiny program and watch it flow live through lexer → tokens → parser → AST → evaluation, one step at a time.",
          ja: "小さなプログラムを入力し、字句解析器 → トークン → 構文解析器 → AST → 評価という流れをステップごとにライブで観察します。",
        },
        status: "done",
        route: "/lang",
        topics: ["lexing", "recursive-descent parsing", "AST", "evaluation"],
      },
    ],
  },
  {
    order: 6,
    id: "net",
    title: { en: "Networking", ja: "ネットワーク" },
    subtitle: {
      en: "How bytes cross the planet",
      ja: "バイトが地球を渡る仕組み",
    },
    modules: [
      {
        id: "net-tcp",
        title: { en: "TCP & Encapsulation", ja: "TCP とカプセル化" },
        description: {
          en: "Packets descend the protocol stack, shake hands in three ways, and survive the packet loss you inject.",
          ja: "パケットがプロトコルスタックを降り、3 ウェイハンドシェイクを行い、あなたが注入したパケットロスから復帰する様子を観察します。",
        },
        status: "done",
        route: "/net",
        topics: ["encapsulation", "3-way handshake", "retransmission"],
      },
      {
        id: "net-dns",
        title: { en: "DNS Resolution", ja: "DNS 名前解決" },
        description: {
          en: "A name's journey from stub resolver through root, TLD, and authoritative servers.",
          ja: "スタブリゾルバからルート・TLD・権威サーバーへと名前が旅する過程を追います。",
        },
        status: "done",
        route: "/net",
        topics: ["recursive resolution", "caching"],
      },
    ],
  },
  {
    order: 7,
    id: "algorithms",
    title: {
      en: "Algorithms & Data Structures",
      ja: "アルゴリズムとデータ構造",
    },
    subtitle: { en: "The software layer", ja: "ソフトウェア層" },
    modules: [
      {
        id: "algo-sorting",
        title: { en: "Sorting Suite", ja: "ソートアルゴリズム集" },
        description: {
          en: "Six sorting algorithms, live operation counters, adversarial input distributions, and head-to-head race mode.",
          ja: "6 種類のソートアルゴリズムをライブの操作カウンター・最悪入力分布・対戦レースモードで比較します。",
        },
        status: "done",
        route: "/algorithms",
        topics: ["comparison sorts", "complexity in practice"],
      },
      {
        id: "algo-pathfinding",
        title: { en: "Pathfinding", ja: "経路探索" },
        description: {
          en: "BFS, DFS, Dijkstra, and A* explore a grid you draw — powered by a hand-rolled binary heap.",
          ja: "自分で描いたグリッドを BFS・DFS・Dijkstra・A* が探索します。手実装の二分ヒープで動いています。",
        },
        status: "done",
        route: "/pathfinding",
        topics: ["graph traversal", "priority queues", "heuristics"],
      },
      {
        id: "algo-hash",
        title: { en: "Hash Table Internals", ja: "ハッシュテーブルの内部構造" },
        description: {
          en: "Chaining vs. open addressing, collisions, tombstones, and resize animations.",
          ja: "チェイニングとオープンアドレス法、衝突・トゥームストーン・リサイズのアニメーションで理解します。",
        },
        status: "done",
        route: "/hashtable",
        topics: ["hashing", "load factor", "amortized analysis"],
      },
    ],
  },
];

/** Review layer — spaced-repetition quiz across all domains. */
export const reviewLayer: CurriculumLayer = {
  order: 0,
  id: "review",
  title: { en: "Spaced Repetition Review", ja: "間隔反復レビュー" },
  subtitle: {
    en: "Reinforce everything you've learned",
    ja: "学んだことをすべて定着させる",
  },
  modules: [
    {
      id: "quiz",
      title: { en: "Quiz", ja: "クイズ" },
      description: {
        en: "Flash cards spanning all seven simulator domains — logic, CPU, arch, OS, compilers, networking, and algorithms — scheduled by the SM-2 spaced-repetition algorithm.",
        ja: "論理回路・CPU・アーキテクチャ・OS・コンパイラ・ネットワーク・アルゴリズムの 7 分野にわたるフラッシュカードを、SM-2 間隔反復アルゴリズムで出題します。",
      },
      status: "done",
      route: "/quiz",
      topics: ["spaced repetition", "SM-2", "all domains"],
    },
  ],
};

/** Layers ordered for display: highest abstraction on top, NAND at the bottom. */
export const layersTopDown: readonly CurriculumLayer[] = [
  ...curriculum,
  reviewLayer,
].sort((a, b) => b.order - a.order);
