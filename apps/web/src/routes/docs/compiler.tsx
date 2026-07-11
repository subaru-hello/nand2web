import { createFileRoute } from "@tanstack/react-router";
import {
  Article,
  C,
  Callout,
  CompareTable,
  Diagram,
  DocsShell,
  Figure,
  FlowRow,
  KeyTerms,
  P,
  Prose,
  References,
  Section,
  useSvgId,
} from "../../features/docs";

export const Route = createFileRoute("/docs/compiler")({
  component: Page,
});

function Page() {
  return (
    <DocsShell active="compiler">
      <Article
        title={{ en: "Compilers", ja: "コンパイラ" }}
        lead={{
          en: "A compiler is a program that translates source code written in one language into an equivalent program in another language — most often machine code the CPU can execute directly. Understanding how compilers work is understanding how the gap between human thought and silicon is bridged.",
          ja: "コンパイラは、あるプログラミング言語で書かれたソースコードを別の言語——多くの場合、CPUが直接実行できる機械語——に変換するプログラムです。コンパイラの仕組みを理解することは、人間の思考とシリコンの間の橋渡しを理解することに他なりません。",
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* 1. What a compiler is                                             */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="what"
          title={{ en: "What a compiler is", ja: "コンパイラとは何か" }}
        >
          <Prose
            paragraphs={[
              {
                en: "A **compiler** reads a source program and produces a semantically equivalent target program. The classic case is a C compiler emitting x86-64 machine code, but the definition is broader: TypeScript → JavaScript, Java → JVM bytecode, and even SQL query → query-execution plan are all compilations. The defining property is **offline translation**: the entire source is processed before any output runs.",
                ja: "**コンパイラ**はソースプログラムを読み込み、意味的に等価なターゲットプログラムを生成します。典型例はC言語のコンパイラがx86-64の機械語を出力するケースですが、定義はより広く、TypeScript→JavaScript、Java→JVMバイトコード、SQL→クエリ実行計画もすべてコンパイルです。本質的な特性は**オフライン変換**です：ソース全体が実行前に処理されます。",
              },
              {
                en: "An **interpreter** is the alternative: it reads the source (or a compact bytecode) and *executes* it immediately, statement by statement, without first producing a standalone target file. Python's default runtime is an interpreter of this kind. The trade-off: interpreters have simpler toolchains and faster iteration; compilers produce faster binaries and can catch errors before runtime.",
                ja: "**インタープリタ**はもうひとつの選択肢です。ソース（またはコンパクトなバイトコード）を読み込み、スタンドアロンのターゲットファイルを生成することなく、直ちに文単位で*実行*します。Pythonのデフォルトランタイムはこのタイプのインタープリタです。トレードオフとして、インタープリタはツールチェーンが単純でイテレーションが速く、コンパイラはより高速なバイナリを生成し実行前にエラーを検出できます。",
              },
              {
                en: "**JIT (Just-In-Time) compilation** is a hybrid: the program starts executing immediately (like an interpreter), but the runtime compiles hot code paths to native machine code on the fly, achieving near-compiled performance. V8 (JavaScript), the JVM's HotSpot, and PyPy all use JIT. The nand2web [live compiler pipeline](/lang) demonstrates the compilation stages interactively.",
                ja: "**JIT（ジャストインタイム）コンパイル**はハイブリッドな手法です。プログラムはすぐに実行を開始し（インタープリタと同様）、ランタイムはホットなコードパスをリアルタイムでネイティブ機械語にコンパイルすることで、コンパイル済みに近い性能を達成します。V8（JavaScript）・JVMのHotSpot・PyPyはすべてJITを使用しています。nand2webの[ライブコンパイラパイプライン](/lang)でコンパイルの各段階をインタラクティブに確認できます。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "Compiler vs interpreter vs JIT: where translation happens relative to execution.",
              ja: "コンパイラ・インタープリタ・JITの比較：翻訳が実行に対してどこで行われるか。",
            }}
          >
            <CompareTable
              headers={[
                { en: "Approach", ja: "方式" },
                { en: "When translated", ja: "翻訳タイミング" },
                { en: "Output", ja: "出力" },
                { en: "Examples", ja: "代表例" },
              ]}
              rows={[
                [
                  { en: "Compiler (AOT)", ja: "コンパイラ（AOT）" },
                  { en: "Before execution", ja: "実行前" },
                  {
                    en: "Native binary / bytecode",
                    ja: "ネイティブバイナリ / バイトコード",
                  },
                  { en: "GCC, Clang, rustc", ja: "GCC・Clang・rustc" },
                ],
                [
                  { en: "Interpreter", ja: "インタープリタ" },
                  { en: "At runtime, line by line", ja: "実行時、行ごと" },
                  { en: "No persistent artifact", ja: "永続的な成果物なし" },
                  { en: "CPython, Ruby MRI", ja: "CPython・Ruby MRI" },
                ],
                [
                  { en: "JIT compiler", ja: "JITコンパイラ" },
                  { en: "At runtime, hot paths", ja: "実行時、ホットパスのみ" },
                  {
                    en: "Native code in memory",
                    ja: "メモリ上のネイティブコード",
                  },
                  { en: "V8, JVM HotSpot, PyPy", ja: "V8・JVM HotSpot・PyPy" },
                ],
              ]}
            />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 2. The pipeline                                                   */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="pipeline"
          title={{
            en: "The compiler pipeline",
            ja: "コンパイラのパイプライン",
          }}
        >
          <P
            t={{
              en: "A compiler is not a monolith; it is a *pipeline* of transformations, each operating on a progressively lower-level representation of the program. The classical decomposition is shown below. Each stage has well-defined inputs and outputs, which is why compiler phases can be swapped, reused, and tested independently.",
              ja: "コンパイラはモノリシックではなく、プログラムをより低レベルな表現へと段階的に変換する*パイプライン*です。以下に古典的な分解を示します。各段階には明確に定義された入出力があり、だからこそコンパイラのフェーズは独立して交換・再利用・テストができます。",
            }}
          />

          <Figure
            caption={{
              en: "The seven-stage compiler pipeline from source text to target code.",
              ja: "ソーステキストからターゲットコードまでの7段階コンパイラパイプライン。",
            }}
          >
            <FlowRow
              steps={[
                {
                  label: { en: "Source", ja: "ソース" },
                  sub: { en: "text file", ja: "テキストファイル" },
                },
                {
                  label: { en: "Lexer", ja: "字句解析器" },
                  sub: { en: "→ tokens", ja: "→ トークン列" },
                },
                {
                  label: { en: "Parser", ja: "構文解析器" },
                  sub: { en: "→ AST", ja: "→ AST" },
                },
                {
                  label: { en: "Semantic", ja: "意味解析" },
                  sub: { en: "analysis", ja: "型検査など" },
                },
                {
                  label: { en: "IR", ja: "中間表現" },
                  sub: { en: "lowering", ja: "生成" },
                },
                {
                  label: { en: "Optimizer", ja: "最適化器" },
                  sub: { en: "IR → IR", ja: "IR → IR" },
                },
                {
                  label: { en: "Codegen", ja: "コード生成" },
                  sub: { en: "→ target", ja: "→ ターゲット" },
                },
              ]}
            />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 3. Lexical analysis                                               */}
        {/* ---------------------------------------------------------------- */}
        <Section id="lexer" title={{ en: "Lexical analysis", ja: "字句解析" }}>
          <Prose
            paragraphs={[
              {
                en: "The first stage, **lexical analysis** (or *scanning*), transforms the raw character stream of source text into a flat sequence of **tokens** — the smallest meaningful units of the language. Identifiers, keywords, integer literals, string literals, operators, and punctuation are all distinct token kinds. Whitespace and comments are typically discarded at this stage.",
                ja: "最初の段階である**字句解析**（*スキャニング*とも呼ばれる）は、ソーステキストの生の文字ストリームをトークンの平坦なシーケンスに変換します。**トークン**とは言語の最小の意味単位で、識別子・キーワード・整数リテラル・文字列リテラル・演算子・句読点などがそれぞれ異なるトークン種別を持ちます。空白とコメントは通常この段階で破棄されます。",
              },
              {
                en: "Lexers are specified by **regular languages** — patterns described by regular expressions — and implemented as **finite automata** (DFA/NFA). Each token kind corresponds to one pattern. The lexer runs a DFA over the character stream, greedily matching the longest prefix that satisfies any pattern (the *maximal munch* rule). For example, the expression `result = 2 + 3 * 4;` tokenises as: `IDENT(result)` `EQ` `INT(2)` `PLUS` `INT(3)` `STAR` `INT(4)` `SEMI`. Eight tokens from 22 characters.",
                ja: "字句解析器は**正規言語**——正規表現で記述されるパターン——によって仕様が定められ、**有限オートマトン**（DFA/NFA）として実装されます。各トークン種別はひとつのパターンに対応します。字句解析器は文字ストリーム上でDFAを動かし、いずれかのパターンを満たす最長のプレフィックスを貪欲にマッチします（*最大マッチ規則*）。たとえば式 `result = 2 + 3 * 4;` は次のようにトークナイズされます：`IDENT(result)` `EQ` `INT(2)` `PLUS` `INT(3)` `STAR` `INT(4)` `SEMI`。22文字から8トークンが得られます。",
              },
              {
                en: "The lexer's job is deliberately kept simple: no understanding of structure or meaning, only pattern matching. This clean separation means the parser never sees raw characters — only typed tokens — which makes the grammar rules much simpler to write and maintain.",
                ja: "字句解析器の仕事は意図的に単純に保たれています：構造や意味の理解は行わず、パターンマッチングのみです。この明確な分離により、構文解析器は生の文字を見ることなく型付きトークンのみを受け取り、文法規則をはるかに単純に記述・保守できます。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 4. Parsing                                                        */}
        {/* ---------------------------------------------------------------- */}
        <Section id="parsing" title={{ en: "Parsing", ja: "構文解析" }}>
          <Prose
            paragraphs={[
              {
                en: "The **parser** reads the token stream and builds an **Abstract Syntax Tree (AST)** — a tree that captures the grammatical structure of the program. Where the lexer uses regular languages, the parser uses **context-free grammars (CFGs)**: a set of production rules like `expr → expr '+' term | term` that define what sequences of tokens are legal.",
                ja: "**構文解析器**はトークンストリームを読み込み、**抽象構文木（AST）**を構築します。ASTはプログラムの文法構造をツリーとして表現します。字句解析器が正規言語を使うのに対し、構文解析器は**文脈自由文法（CFG）**を使います：`expr → expr '+' term | term` のような、どのトークン列が合法かを定義する生成規則の集合です。",
              },
              {
                en: "**Recursive-descent parsing** is the most common technique for hand-written parsers: one function per grammar non-terminal, each calling others recursively. It is elegant, easy to debug, and can produce excellent error messages. The key challenge is **operator precedence**: multiplication must bind tighter than addition. The grammar encodes this by layering non-terminals — `expr` calls `term` which calls `factor` — so `*` is lower in the call stack and its sub-tree sits deeper in the AST.",
                ja: "**再帰下降構文解析**は手書きのパーサーで最も一般的な手法です：文法の非終端記号ごとにひとつの関数を作り、それぞれが再帰的に他を呼び出します。エレガントでデバッグしやすく、優れたエラーメッセージを生成できます。重要な課題は**演算子の優先順位**です：乗算は加算より強く結合しなければなりません。文法は非終端記号を層にすることでこれをエンコードします——`expr` は `term` を呼び、`term` は `factor` を呼ぶ——ので `*` はコールスタックの下位に位置し、そのサブツリーはASTの深いところに現れます。",
              },
              {
                en: "The [live compiler](/lang) on this site lets you type source code and watch the AST form in real time. The diagram below shows the AST for `2 + 3 * 4`: the `+` node is the root, with `2` as its left child and `*` as its right child (which in turn holds `3` and `4`). This tree correctly captures that multiplication is evaluated first, regardless of the left-to-right reading order of the source.",
                ja: "このサイトの[ライブコンパイラ](/lang)ではソースコードを入力してASTがリアルタイムで形成される様子を観察できます。以下の図は `2 + 3 * 4` のASTを示しています：`+` ノードがルートで、左の子が `2`、右の子が `*`（さらに `3` と `4` を保持）です。このツリーは、ソースの左から右への読み順に関係なく、乗算が先に評価されることを正しく捉えています。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "AST for `2 + 3 * 4`. The `*` node sits deeper, so it is evaluated first.",
              ja: "`2 + 3 * 4` のAST。`*` ノードが深い位置にあるため先に評価される。",
            }}
          >
            <AstDiagram />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 5. Semantic analysis                                              */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="semantic"
          title={{ en: "Semantic analysis", ja: "意味解析" }}
        >
          <Prose
            paragraphs={[
              {
                en: "Parsing checks *syntax* — whether the token sequence matches the grammar. **Semantic analysis** checks *meaning*: are the constructs that are syntactically valid also *meaningful* in the language? Two fundamental tasks are name resolution and type checking.",
                ja: "構文解析は*構文*を検証します——トークン列が文法にマッチするかどうか。**意味解析**は*意味*を検証します：構文的に正しい構造が、言語においても*意味を持つ*かどうか。基本的な作業はふたつあります：名前解決と型検査です。",
              },
              {
                en: "**Symbol tables** are the compiler's bookkeeping structure: a dictionary that maps every name (variable, function, type) to its declaration, type, and scope. During semantic analysis, the compiler walks the AST, populates the symbol table on declarations, and looks up names on uses. A use of an undeclared name, a name declared twice in the same scope, or a function called with the wrong number of arguments are all **semantic errors** detected here.",
                ja: "**シンボルテーブル**はコンパイラの帳簿構造です：すべての名前（変数・関数・型）をその宣言・型・スコープにマッピングする辞書です。意味解析の際、コンパイラはASTを走査し、宣言時にシンボルテーブルに登録し、使用時に名前を参照します。未宣言の名前の使用、同じスコープでの二重宣言、引数の数が違う関数呼び出しはすべてここで検出される**意味エラー**です。",
              },
              {
                en: "**Scoping** determines which declarations a name can refer to at each point in the program. Most languages use *lexical* (static) scoping: the binding is determined by the textual structure, not by the call stack at runtime. The compiler builds a **scope tree** mirroring the block structure of the AST, and name resolution walks from the innermost to the outermost scope.",
                ja: "**スコープ**は、プログラムの各地点でどの宣言に名前が参照できるかを決定します。ほとんどの言語は*字句的*（静的）スコープを使います：束縛はテキスト上の構造によって決まり、実行時のコールスタックによるのではありません。コンパイラはASTのブロック構造を反映した**スコープツリー**を構築し、名前解決は最も内側から外側のスコープに向かって行われます。",
              },
              {
                en: "**Type checking** verifies that operations are applied to operands of compatible types: you can add two integers, but not an integer and a struct. In **statically typed** languages (C, Rust, Java), this check happens entirely at compile time, providing safety guarantees before the program runs. In **dynamically typed** languages (Python, JavaScript), these checks happen at runtime, which gives flexibility but defers errors. Type inference (as in Rust or Haskell) lets the compiler deduce types that the programmer didn't spell out explicitly, giving static safety without verbose annotations.",
                ja: "**型検査**は、演算が適合する型のオペランドに適用されているかを確認します：整数同士は加算できますが、整数と構造体はできません。**静的型付け**言語（C・Rust・Java）ではこの検査がコンパイル時に完全に行われ、プログラムの実行前に安全性が保証されます。**動的型付け**言語（Python・JavaScript）ではこれらの検査が実行時に行われ、柔軟性はありますがエラーが後回しになります。型推論（RustやHaskellなど）により、コンパイラはプログラマが明示しなかった型を推論し、冗長なアノテーションなしに静的な安全性を提供します。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 6. IR & optimization                                              */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="ir"
          title={{ en: "IR & optimization", ja: "中間表現と最適化" }}
        >
          <Prose
            paragraphs={[
              {
                en: "After semantic analysis, the compiler lowers the AST into an **intermediate representation (IR)** — a language-neutral, machine-neutral form that is easier to analyze and transform than either source or binary. LLVM IR, for instance, is a typed, infinite-register assembly language. The famous textbook IR is **three-address code**: every statement has at most one operator and three names, e.g. `t1 = 3 * 4`, `t2 = 2 + t1`.",
                ja: "意味解析の後、コンパイラはASTを**中間表現（IR）**に降格します——言語にも機械にも依存しない形式で、ソースやバイナリよりも解析・変換が容易です。LLVMのIRは、たとえば型付きの無限レジスタアセンブリ言語です。有名な教科書的IRは**三アドレスコード**です：各命令は最大で演算子ひとつと名前みっつを持ちます（例：`t1 = 3 * 4`、`t2 = 2 + t1`）。",
              },
              {
                en: "**Static Single-Assignment form (SSA)** is the IR form used by virtually all modern compilers (LLVM, GCC, Cranelift). In SSA, every variable is assigned exactly once. When control flow merges (e.g. after an if-else), a special **φ (phi) function** selects which incoming value to use. SSA makes dataflow analysis — which definitions reach which uses — trivially readable from the IR, dramatically simplifying many optimizations.",
                ja: "**静的単一代入形式（SSA）**は実質的に現代のすべてのコンパイラ（LLVM・GCC・Cranelift）が使用するIR形式です。SSAでは、各変数は正確に一度だけ代入されます。制御フローが合流する場合（if-elseの後など）、特別な**φ（ファイ）関数**がどの入力値を使うかを選択します。SSAによりデータフロー解析——どの定義がどの使用に到達するか——がIRから直接読み取れるようになり、多くの最適化が劇的に単純化されます。",
              },
              {
                en: "Classic IR-level **optimizations** include: **constant folding** (`3 * 4` → `12` at compile time), **dead-code elimination** (removing assignments whose value is never read), **common-subexpression elimination** (computing `a * b` once instead of twice), **function inlining** (replacing a call with the callee's body to avoid call overhead and expose further optimizations), and **loop-invariant code motion** (hoisting computations out of loops when the value doesn't change each iteration).",
                ja: "古典的なIRレベルの**最適化**には以下が含まれます：**定数畳み込み**（コンパイル時に `3 * 4` → `12`）、**デッドコード除去**（一度も読まれない代入の除去）、**共通部分式の除去**（`a * b` を二度計算せず一度だけ）、**関数のインライン化**（呼び出し元に呼び出し先の本体を展開してオーバーヘッドを排除し、さらなる最適化を露出）、**ループ不変コードの移動**（各反復で値が変わらない計算をループ外に移動）。",
              },
            ]}
          />

          <Callout
            tone="insight"
            title={{
              en: "Why SSA makes optimizations easier",
              ja: "SSAが最適化を簡単にする理由",
            }}
            t={{
              en: "In SSA, every use of a variable has exactly one definition. This makes dead-code elimination trivial: if a variable has no uses, its single definition can be deleted. It makes constant propagation simple: if a variable is defined as a constant, substitute it everywhere. Modern compilers run dozens of passes over SSA IR, each performing one focused transformation — and the passes compose cleanly because SSA's invariants are preserved through each one.",
              ja: "SSAでは、変数の各使用に対応する定義がちょうどひとつです。これによりデッドコード除去は自明になります：変数の使用がなければ、唯一の定義を削除できます。定数伝播も単純で、変数が定数として定義されていれば、どこにでも代入できます。現代のコンパイラはSSA IRに対して数十のパスを実行しますが、それぞれが一つの変換に集中し、SSAの不変条件が各パスを通じて保たれるため、パスはクリーンに組み合わせられます。",
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 7. Code generation                                                */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="codegen"
          title={{ en: "Code generation", ja: "コード生成" }}
        >
          <Prose
            paragraphs={[
              {
                en: "**Code generation** translates the (optimized) IR into instructions for a specific target ISA — x86-64, ARM64, RISC-V, or the ISA described on this site's [CPU page](/docs/cpu). It proceeds in three sub-steps: instruction selection, register allocation, and instruction scheduling.",
                ja: "**コード生成**は（最適化済みの）IRを特定のターゲットISA——x86-64・ARM64・RISC-V、またはこのサイトの[CPUページ](/docs/cpu)で説明されているISA——の命令に変換します。命令選択・レジスタ割り付け・命令スケジューリングの3つのサブステップで進みます。",
              },
              {
                en: "**Instruction selection** maps IR operations to machine instructions. This is non-trivial because real ISAs offer complex addressing modes and combined operations (e.g. x86's `LEA` can compute `base + index*scale + offset` in one instruction). Compilers use *tree-pattern matching* or *dynamic programming* (as in BURS — Bottom-Up Rewriting Systems) to find the cheapest tile of instructions covering each IR sub-tree.",
                ja: "**命令選択**はIR操作を機械命令にマッピングします。実際のISAは複雑なアドレッシングモードや複合演算（例：x86の `LEA` は `base + index*scale + offset` をひとつの命令で計算できる）を提供するため、これは非自明です。コンパイラは*ツリーパターンマッチング*や*動的プログラミング*（BURS——底部から書き換えるシステム）を使って各IRサブツリーをカバーする最安コストの命令タイルを見つけます。",
              },
              {
                en: "**Register allocation** decides which IR variable lives in which physical register at each point in the program. Real ISAs have a small fixed number of registers (e.g. 16 general-purpose in x86-64), but IR can have thousands of variables. When there aren't enough registers, variables are **spilled** to the stack and reloaded later. The classic algorithm is **graph coloring**: build an *interference graph* (nodes = variables, edges = variables live simultaneously), then color it with K colors (K = register count). K-coloring is NP-complete in general, so compilers use greedy heuristics with good practical results.",
                ja: "**レジスタ割り付け**は、プログラムの各地点でどのIR変数がどの物理レジスタに格納されるかを決定します。実際のISAは少数の固定レジスタ（例：x86-64では16個の汎用レジスタ）を持ちますが、IRには何千もの変数があります。レジスタが足りない場合、変数はスタックに**スピル**されて後でリロードされます。古典的なアルゴリズムは**グラフ彩色**です：*干渉グラフ*（ノード＝変数、エッジ＝同時に生存する変数）を構築し、K色（K＝レジスタ数）で彩色します。一般にK彩色はNP完全ですが、コンパイラは実用的に良好な結果を出す貪欲なヒューリスティックを使います。",
              },
              {
                en: "**Instruction scheduling** reorders instructions (within the constraints of data dependencies) to hide pipeline latencies. A LOAD instruction on modern CPUs takes several cycles; if the scheduler can slot independent instructions between the LOAD and the first USE of its result, those cycles aren't wasted. This is closely tied to the target's pipeline model — see [the CPU page](/docs/cpu) for pipeline details.",
                ja: "**命令スケジューリング**はデータ依存関係の制約内で命令を並べ替え、パイプラインのレイテンシを隠蔽します。現代のCPUではLOAD命令に数サイクルかかりますが、スケジューラがLOADとその結果の最初のUSEの間に独立した命令を差し込めれば、それらのサイクルは無駄になりません。これはターゲットのパイプラインモデルと密接に関連しています——パイプラインの詳細については[CPUページ](/docs/cpu)を参照してください。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 8. Runtimes: interpreters, bytecode VMs & JIT                    */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="runtimes"
          title={{
            en: "Runtimes: interpreters, bytecode VMs & JIT",
            ja: "ランタイム：インタープリタ・バイトコードVM・JIT",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "Not all language runtimes compile to native code upfront. **Tree-walking interpreters** — the simplest kind — walk the AST directly and perform the operations described by each node. This is dead-simple to implement and great for prototyping, but slow: every execution of a loop body re-traverses the same AST nodes, paying pointer-chasing overhead each time.",
                ja: "すべての言語ランタイムがネイティブコードを事前にコンパイルするわけではありません。**ツリー巡回インタープリタ**——最もシンプルな種類——はASTを直接走査し、各ノードで記述された操作を実行します。実装は非常に簡単でプロトタイピングに最適ですが、遅いです：ループ本体の各実行で同じASTノードを再走査し、毎回ポインタ追跡のオーバーヘッドを払います。",
              },
              {
                en: "A **bytecode compiler + VM** is the next step up. The source is compiled to a compact, linear **bytecode** — a sequence of small opcodes for a hypothetical virtual machine (the JVM's bytecode, CPython's `.pyc` files, Lua's VM). A tight interpreter loop dispatches each opcode. This is 10–100× faster than tree-walking because the loop body is tiny and cache-friendly, and bytecode is denser than an AST. The JVM and CPython both work this way out of the box.",
                ja: "**バイトコードコンパイラ＋VM**は次のステップです。ソースはコンパクトな線形の**バイトコード**——仮想マシン用の小さなオペコードのシーケンス（JVMのバイトコード・CPythonの `.pyc` ファイル・LuaのVM）——にコンパイルされます。タイトなインタープリタループが各オペコードをディスパッチします。ループ本体が小さくキャッシュフレンドリーで、バイトコードがASTより密なため、ツリー巡回より10〜100倍高速です。JVMとCPythonはどちらもデフォルトでこの方式で動作します。",
              },
              {
                en: '**JIT compilation** takes the bytecode and compiles it to native machine code at runtime, targeting only the functions and loops that are executed frequently ("hot" paths). V8 identifies hot functions via profiling, then compiles them with an optimizing compiler that can speculate on types observed at runtime. The JVM\'s HotSpot does the same. PyPy uses a technique called **tracing JIT**, which compiles individual execution traces rather than whole functions. The speedup over pure interpretation is typically 10–100×.',
                ja: "**JITコンパイル**はバイトコードを取り、頻繁に実行される関数とループ（「ホット」パス）のみを対象に実行時にネイティブ機械語にコンパイルします。V8はプロファイリングによりホットな関数を識別し、実行時に観察された型を投機する最適化コンパイラでコンパイルします。JVMのHotSpotも同様です。PyPyは関数全体でなく個々の実行トレースをコンパイルする**トレーシングJIT**という手法を使います。純粋なインタープリタと比べたスピードアップは通常10〜100倍です。",
              },
              {
                en: "**Ahead-of-time (AOT) compilation** — what GCC, Clang, and rustc do — compiles everything before execution, producing a native binary. The trade-off versus JIT: AOT can't speculate on runtime information, but it doesn't pay any startup cost and the binary runs immediately at full speed. Rust's AOT model also enables memory safety guarantees checked entirely at compile time.",
                ja: "**AOT（事前）コンパイル**——GCC・Clang・rustcが行うもの——はすべてを実行前にコンパイルし、ネイティブバイナリを生成します。JITとのトレードオフ：AOTは実行時情報を投機できませんが、起動コストがなくバイナリは即座にフルスピードで実行されます。RustのAOTモデルはまた、コンパイル時に完全にチェックされるメモリ安全性の保証を可能にします。",
              },
              {
                en: "Language runtimes that manage memory automatically use a **garbage collector (GC)**. The GC periodically identifies objects that are no longer reachable from any live variable and reclaims their memory. Tracing GCs (used by the JVM, V8, Python, Go) walk the object graph from roots; reference-counting GCs (used by Swift, CPython for cycle-free objects) track each object's reference count. Compiled languages like C and Rust instead place memory ownership decisions at compile time, eliminating GC pauses entirely.",
                ja: "メモリを自動管理する言語ランタイムは**ガベージコレクタ（GC）**を使用します。GCは定期的に生きている変数から到達不可能なオブジェクトを特定し、そのメモリを回収します。トレーシングGC（JVM・V8・Python・Goが使用）はルートからオブジェクトグラフを走査し、参照カウントGC（Swift・CPython（循環なしのオブジェクト）が使用）は各オブジェクトの参照カウントを追跡します。CやRustのようなコンパイル言語はメモリの所有権の決定をコンパイル時に行い、GCポーズを完全に排除します。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Key terms                                                         */}
        {/* ---------------------------------------------------------------- */}
        <Section id="glossary" title={{ en: "Key terms", ja: "重要用語" }}>
          <KeyTerms
            terms={[
              {
                term: "Token",
                def: {
                  en: "The smallest meaningful unit produced by a lexer — a keyword, identifier, literal, operator, or punctuation mark.",
                  ja: "字句解析器が生成する最小の意味単位——キーワード・識別子・リテラル・演算子・句読点。",
                },
              },
              {
                term: "AST",
                def: {
                  en: "Abstract Syntax Tree — a tree representation of the grammatical structure of a program, stripping away surface syntax like parentheses and semicolons.",
                  ja: "抽象構文木——括弧やセミコロンなどの表面的な構文を取り除いたプログラムの文法構造のツリー表現。",
                },
              },
              {
                term: "Grammar",
                def: {
                  en: "A set of production rules (typically context-free) that define which sequences of tokens form valid programs.",
                  ja: "どのトークン列が合法なプログラムを構成するかを定義する生成規則の集合（通常は文脈自由文法）。",
                },
              },
              {
                term: "IR",
                def: {
                  en: "Intermediate Representation — a language-neutral, machine-neutral code form used inside the compiler for analysis and optimization (e.g. LLVM IR, three-address code).",
                  ja: "中間表現——コンパイラ内部で解析と最適化に使用される、言語・機械に依存しないコード形式（例：LLVM IR・三アドレスコード）。",
                },
              },
              {
                term: "SSA",
                def: {
                  en: "Static Single-Assignment form — an IR form where every variable is assigned exactly once; φ functions handle control-flow merges. Simplifies dataflow analyses.",
                  ja: "静的単一代入形式——各変数が正確に一度だけ代入されるIR形式。制御フローの合流にはφ関数を使用。データフロー解析を単純化する。",
                },
              },
              {
                term: "JIT",
                def: {
                  en: "Just-In-Time compilation — compiling bytecode to native machine code at runtime, targeting only hot paths, combining interpreter startup speed with near-native execution speed.",
                  ja: "ジャストインタイムコンパイル——実行時にバイトコードをネイティブ機械語にコンパイルし、ホットパスのみを対象とすることで、インタープリタの起動速度とネイティブに近い実行速度を両立させる手法。",
                },
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* References                                                        */}
        {/* ---------------------------------------------------------------- */}
        <References
          items={[
            {
              title: "Crafting Interpreters — Robert Nystrom",
              href: "https://craftinginterpreters.com/",
              note: {
                en: "A free, beautifully written online book that walks through building two complete interpreters (tree-walking and bytecode VM) from scratch in Java and C.",
                ja: "JavaとCでツリー巡回インタープリタとバイトコードVMの2つを一から構築する無料のオンライン書籍。丁寧な解説で高く評価されている。",
              },
            },
            {
              title:
                "Compilers: Principles, Techniques, and Tools (Dragon Book) — Aho et al.",
              href: "https://en.wikipedia.org/wiki/Compilers:_Principles,_Techniques,_and_Tools",
              note: {
                en: "The classic graduate-level compiler textbook. Authoritative on lexing, parsing, semantic analysis, optimization, and code generation.",
                ja: "古典的なコンパイラの大学院レベル教科書。字句解析・構文解析・意味解析・最適化・コード生成について権威ある解説。",
              },
            },
            {
              title: "nand2tetris — From NAND to Tetris",
              href: "https://www.nand2tetris.org/",
              note: {
                en: "Includes a complete compiler project for the Jack language, targeting a virtual machine — the direct inspiration for this site.",
                ja: "Jack言語のコンパイラをVMターゲットで実装するプロジェクトを含む——このサイトの直接の着想源。",
              },
            },
            {
              title: "Wikipedia — Recursive descent parser",
              href: "https://en.wikipedia.org/wiki/Recursive_descent_parser",
              note: {
                en: "Clear explanation of recursive descent with grammar examples and pseudocode; includes comparison with table-driven LL parsers.",
                ja: "文法例と擬似コードを交えた再帰下降の明快な解説。表駆動LL構文解析器との比較も含む。",
              },
            },
            {
              title: "Wikipedia — Static single-assignment form",
              href: "https://en.wikipedia.org/wiki/Static_single-assignment_form",
              note: {
                en: "Explains the motivation for SSA, construction algorithms, and how φ functions work, with examples.",
                ja: "SSAの動機・構築アルゴリズム・φ関数の仕組みを例付きで解説。",
              },
            },
            {
              title: "LLVM Language Reference Manual",
              href: "https://llvm.org/docs/LangRef.html",
              note: {
                en: "The definitive reference for LLVM IR — the SSA-based IR used by Clang, rustc, and many other compilers.",
                ja: "LLVM IRの公式リファレンス。Clang・rustcなど多くのコンパイラが採用するSSAベースのIR仕様。",
              },
            },
          ]}
        />
      </Article>
    </DocsShell>
  );
}

// ---------------------------------------------------------------------------
// AST diagram for 2 + 3 * 4
// ---------------------------------------------------------------------------

function AstDiagram() {
  const sid = useSvgId();
  return (
    <Diagram
      label={{
        en: "Abstract Syntax Tree for the expression 2 + 3 * 4",
        ja: "式 2 + 3 * 4 の抽象構文木",
      }}
      viewBox="0 0 400 240"
      maxHeight={220}
    >
      {/* Background */}
      <rect width="400" height="240" fill={C.panel} rx="8" />

      {/* Root: + node */}
      <circle
        cx="200"
        cy="40"
        r="26"
        fill={C.muted}
        stroke={C.high}
        strokeWidth="2"
      />
      <text
        x="200"
        y="45"
        textAnchor="middle"
        fill={C.high}
        fontSize="18"
        fontWeight="700"
      >
        +
      </text>

      {/* Left child: 2 */}
      <circle
        cx="90"
        cy="130"
        r="26"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="90"
        y="135"
        textAnchor="middle"
        fill={C.text}
        fontSize="15"
        fontWeight="600"
      >
        2
      </text>

      {/* Right child: * node */}
      <circle
        cx="310"
        cy="130"
        r="26"
        fill={C.muted}
        stroke={C.high}
        strokeWidth="2"
      />
      <text
        x="310"
        y="135"
        textAnchor="middle"
        fill={C.high}
        fontSize="18"
        fontWeight="700"
      >
        *
      </text>

      {/* Left child of *: 3 */}
      <circle
        cx="230"
        cy="210"
        r="22"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="230"
        y="215"
        textAnchor="middle"
        fill={C.text}
        fontSize="15"
        fontWeight="600"
      >
        3
      </text>

      {/* Right child of *: 4 */}
      <circle
        cx="330"
        cy="210"
        r="22"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="330"
        y="215"
        textAnchor="middle"
        fill={C.text}
        fontSize="15"
        fontWeight="600"
      >
        4
      </text>

      {/* Edges */}
      {/* + → 2 */}
      <line
        x1="178"
        y1="57"
        x2="110"
        y2="110"
        stroke={C.line}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arr")})`}
      />
      {/* + → * */}
      <line
        x1="222"
        y1="57"
        x2="290"
        y2="110"
        stroke={C.line}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arr")})`}
      />
      {/* * → 3 */}
      <line
        x1="294"
        y1="148"
        x2="245"
        y2="190"
        stroke={C.line}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arr")})`}
      />
      {/* * → 4 */}
      <line
        x1="320"
        y1="154"
        x2="325"
        y2="188"
        stroke={C.line}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arr")})`}
      />

      {/* Labels */}
      <text x="140" y="82" textAnchor="middle" fill={C.faint} fontSize="9">
        left
      </text>
      <text x="262" y="82" textAnchor="middle" fill={C.faint} fontSize="9">
        right
      </text>
      <text x="257" y="175" textAnchor="middle" fill={C.faint} fontSize="9">
        left
      </text>
      <text x="334" y="175" textAnchor="middle" fill={C.faint} fontSize="9">
        right
      </text>

      <defs>
        <marker
          id={sid("arr")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.line} />
        </marker>
      </defs>
    </Diagram>
  );
}
