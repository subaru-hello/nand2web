import type { DeepDiveContent } from "../deepdive/DeepDive";

export const langDeepDive: DeepDiveContent = {
  sections: [
    {
      title: {
        en: "Historical context — from grammar to compiler",
        ja: "時代背景 — 文法からコンパイラへ",
      },
      paragraphs: [
        {
          en: "The idea that language itself has a formal structure predates computers by a century. **Noam Chomsky**'s 1956 paper \"Three models for the description of language\" introduced the grammar hierarchy — a classification of grammars by expressive power — and his book *Syntactic Structures* followed in 1957. His **context-free grammars** (Type 2) turned out to be the right tool for programming languages: rich enough to express nesting and recursion, simple enough to parse mechanically. Every grammar rule in Tiny's parser is a direct implementation of a context-free production.",
          ja: "言語そのものに形式的な構造があるという考えは、コンピュータより1世紀も前からありました。**ノーム・チョムスキー**は1956年の論文「言語の記述のための三つのモデル」で文法の階層分類を導入し、1957年に書籍『統語構造』を刊行しました。その**文脈自由文法**（タイプ2）は、プログラミング言語にうってつけのツールでした。入れ子と再帰を表現できるほど豊かで、機械的に解析できるほど単純。Tiny のパーサーにある文法ルールはすべて、文脈自由な生成規則の直接実装です。",
        },
        {
          en: "The first practical compilers appeared in the early 1950s. **Grace Hopper** built the A-0 System (1952), widely considered the first compiler: it translated symbolic mathematical code into machine instructions. **John Backus** led the team that designed **FORTRAN** (1957) — the first language compiled to machine code fast enough for production scientific computing. Skeptics assumed compiled code could never match hand-written assembly; the FORTRAN team proved them wrong. Backus later co-invented the notation we use today to write grammars: **BNF** (Backus-Naur Form), introduced for ALGOL 60.",
          ja: "実用的なコンパイラは1950年代初頭に登場しました。**グレース・ホッパー**は A-0 システム（1952年）を構築し、これは広くコンパイラの始祖と見なされています。記号的な数式コードを機械語命令に翻訳するものでした。**ジョン・バッカス**は **FORTRAN**（1957年）の設計チームを率いました — 本番の科学計算に十分な速度でマシンコードにコンパイルされた最初の言語です。懐疑論者はコンパイルされたコードが手書きのアセンブリには敵わないと思っていましたが、FORTRAN チームはそれを覆しました。バッカスはのちに、今日も文法を書くために使われる記法を共同発明します — ALGOL 60 のために導入された **BNF**（バッカス・ナウア形式）です。",
        },
        {
          en: "**Recursive descent** — the parsing strategy Tiny uses — was described and popularized in the 1960s by **Edsger Dijkstra**, **Peter Lucas**, and later by **Niklaus Wirth** (designer of Pascal). In recursive descent, each grammar rule becomes a function that calls itself or other rule-functions. It is so direct that Wirth's book *Compilerbau* (1976) presented a complete compiler in just a few dozen pages. Robert Nystrom's open-access *Crafting Interpreters* (2021) carries this tradition into the modern era, and Tiny's design is influenced by the same approach.",
          ja: "**再帰下降**（Tiny が使うパース戦略）は1960年代に **エドガー・ダイクストラ**、**ピーター・ルーカス**、そしてのちに **ニクラウス・ヴィルト**（Pascal の設計者）によって記述・普及されました。再帰下降では、各文法規則がそれ自身や他のルール関数を呼び出す関数になります。それほど直接的なため、ヴィルトの著書『Compilerbau』（1976年）は数十ページでコンパイラ完全版を提示しました。Robert Nystrom のオープンアクセス書 *Crafting Interpreters*（2021年）はこの伝統を現代に引き継いでおり、Tiny の設計も同じアプローチに影響を受けています。",
        },
      ],
    },
    {
      title: {
        en: "What's actually happening — the four-stage pipeline",
        ja: "何が起きているのか — 4段のパイプライン",
      },
      paragraphs: [
        {
          en: "Every compiler or interpreter runs the same four stages. **Lexing** (tokenization) converts a character stream into a flat list of *tokens* — meaningful units like numbers, identifiers, and operators. The lexer discards whitespace and comments; they have no semantic meaning. **Parsing** takes the token list and builds a tree — the **Abstract Syntax Tree (AST)** — that captures the grammatical structure: which `+` binds tighter than which `*`, which `else` matches which `if`. **Analysis** (in more ambitious systems) checks types, resolves names, and reports semantic errors. **Code generation** or **evaluation** turns the tree into machine bytes or directly executes it. Tiny does the last step as a tree-walking interpreter — no bytecode, no native code.",
          ja: "コンパイラやインタプリタはすべて同じ4段階を経ます。**字句解析**（トークン化）は文字の流れを*トークン* — 数値・識別子・演算子などの意味ある単位 — のリストに変換します。字句解析器は空白やコメントを捨てます。意味上は何も言っていないからです。**構文解析**はトークンのリストを受け取り、木構造を構築します — **抽象構文木（AST）** です。どの `+` がどの `*` より強く結びつくか、どの `else` がどの `if` に対応するか、文法的な構造を捉えます。**意味解析**（より本格的なシステムで）は型のチェック、名前の解決、意味的エラーの報告を行います。**コード生成**または**評価**は木をマシンバイトに変換するか、直接実行します。Tiny は最後のステップを木歩き型インタプリタとして行います — バイトコードなし、ネイティブコードなし。",
        },
        {
          en: 'The AST is the heart of the pipeline. Watch the tree in the visualizer: when the interpreter enters a node, it must first fully evaluate that node\'s children before it can compute the parent. A `+` node evaluates left, then right, then adds. A `while` node evaluates its condition, runs the body if true, loops. This **recursive descent through the tree** is the simplest possible interpreter — Robert Nystrom calls it a "tree-walking interpreter". It is also the starting point of almost every production compiler: at some point during optimization, you are still manipulating a tree.',
          ja: "AST はパイプラインの核心です。ビジュアライザの木を見てください。インタプリタがあるノードに入るとき、まずそのノードの子を完全に評価してから、親を計算できます。`+` ノードは左を評価し、次に右を評価し、そして加算します。`while` ノードは条件を評価し、真なら本体を実行し、繰り返します。この**木を再帰的に下る**手法が最もシンプルなインタプリタです — Robert Nystrom はこれを「木歩き型インタプリタ」と呼びます。ほぼすべての本番コンパイラの出発点でもあります。最適化の途中でも、あなたはやはり木を操作しています。",
        },
        {
          en: "**Tree-walking vs. bytecode**: production runtimes like Python's CPython, the JVM, and JavaScript V8 before its JIT phase don't execute the AST directly. They compile it to **bytecode** — a compact, flat sequence of virtual machine instructions. This avoids the pointer-chasing overhead of the tree (every node is a heap object), makes the interpreter loop tight and cache-friendly, and is the foundation for JIT (Just-In-Time) compilation. The choice between tree-walking and bytecode is a classic engineering tradeoff: tree-walkers are easy to write and understand; bytecode interpreters are faster and extensible to JIT.",
          ja: "**木歩き型 vs バイトコード**: Python の CPython、JVM、JIT フェーズ以前の JavaScript V8 のような本番ランタイムは AST を直接実行しません。**バイトコード** — 仮想マシン命令のコンパクトで平坦な列 — にコンパイルします。これにより、木のポインタを追いかけるオーバーヘッド（すべてのノードがヒープオブジェクト）を回避し、インタプリタループをタイトでキャッシュフレンドリーにし、JIT（ジャスト・イン・タイム）コンパイルの基盤になります。木歩き型とバイトコードの選択は古典的なエンジニアリングのトレードオフです。木歩き型は書きやすく理解しやすい。バイトコードインタプリタは速く、JIT への拡張性がある。",
        },
      ],
    },
    {
      title: {
        en: "Up the stack",
        ja: "次の層へ",
      },
      paragraphs: [
        {
          en: "Tiny's evaluator is a generator — the same contract as the CPU simulator and the logic circuit simulator in Layers 1 and 2. That's not a coincidence: *every* layer of the curriculum is \"a system that produces observable steps\". The playback engine is the same; only the domain changes. If you continue past this layer, the next jump is **types** — the compiler's way of rejecting programs statically that would otherwise fail at runtime. Types are the semantic analysis phase that Tiny deliberately skips.",
          ja: "Tiny の評価器はジェネレーターです — Layer 1 の論理回路シミュレーター、Layer 2 の CPU シミュレーターと同じ契約です。これは偶然ではありません。カリキュラムの*すべての*層が「観察可能なステップを生成するシステム」です。プレイバックエンジンは同じで、変わるのはドメインだけです。このレイヤーを超えて進むなら、次のジャンプは**型**です — ランタイムで失敗するプログラムを静的に弾くコンパイラの手段。型は Tiny が意図的に省いた意味解析フェーズです。",
        },
      ],
    },
  ],
};
