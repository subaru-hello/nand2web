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
  Formula,
  KeyTerms,
  P,
  Prose,
  References,
  Section,
  useSvgId,
} from "../../features/docs";
import { makeDocJsonLd, makeHead } from "../../features/seo/seo";

const CPU_TITLE = "CPU — nand2web";
const CPU_DESC =
  "A CPU is the engine of a computer: a circuit that repeatedly reads an instruction from memory, figures out what it means, and carries it out. Everything reduces to billions of read-decode-execute cycles per second.";

export const Route = createFileRoute("/docs/cpu")({
  head: () =>
    makeHead({
      title: CPU_TITLE,
      description: CPU_DESC,
      path: "/docs/cpu",
      jsonLd: makeDocJsonLd({
        title: CPU_TITLE,
        description: CPU_DESC,
        path: "/docs/cpu",
        breadcrumbLabel: "CPU",
      }),
    }),
  component: Page,
});

function Page() {
  return (
    <DocsShell active="cpu">
      <Article
        title={{ en: "CPU", ja: "CPU（中央処理装置）" }}
        lead={{
          en: "A CPU is the engine of a computer: a circuit that repeatedly reads an instruction from memory, figures out what it means, and carries it out. Everything your machine does — running a web server, rendering a game, training a neural network — reduces to billions of these read-decode-execute cycles per second.",
          ja: "CPUはコンピュータのエンジンです。メモリから命令を読み込み、その意味を解釈し、実行するという動作を繰り返す回路です。Webサーバーの起動、ゲームのレンダリング、ニューラルネットワークの学習まで、コンピュータが行うすべての処理は、毎秒何十億回ものこの「読み込み・解読・実行」サイクルに帰着します。",
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* 1. What a CPU is                                                  */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="stored-program"
          title={{ en: "What a CPU is", ja: "CPUとは何か" }}
        >
          <Prose
            paragraphs={[
              {
                en: "The key insight behind every modern computer is the **stored-program principle** articulated by von Neumann in 1945: instructions and data both live in the same memory, encoded as binary numbers. Before this, machines were physically rewired to change their behaviour. With a stored program, you change behaviour by loading different numbers into RAM.",
                ja: "現代のコンピュータすべての根底にある重要な洞察は、1945年にフォン・ノイマンが提唱した**プログラム内蔵方式**です。命令もデータも同じメモリにバイナリ数値として格納されます。それ以前は、動作を変えるためにマシンを物理的に配線し直す必要がありました。プログラム内蔵方式では、RAMに異なる数値をロードするだけで動作を変えられます。",
              },
              {
                en: "The **CPU** (Central Processing Unit) is the chip responsible for working through those stored instructions one at a time (or, in modern cores, many at a time through pipelining and superscalar execution). It is distinct from memory (where instructions and data live) and I/O devices (keyboards, disks, networks). The CPU reads from memory, transforms values in its registers, and writes results back — an endless loop until you power off.",
                ja: "**CPU**（Central Processing Unit）は、格納された命令を順番に処理する（あるいは現代のコアではパイプラインやスーパースカラ実行によって同時に多数処理する）チップです。メモリ（命令とデータの格納場所）やI/Oデバイス（キーボード・ディスク・ネットワーク）とは別物です。CPUはメモリから読み込み、レジスタ内で値を変換し、結果を書き戻す——電源が切れるまでこのループを繰り返します。",
              },
              {
                en: "This architecture — CPU + shared memory for both code and data + I/O buses — is called the **von Neumann architecture**. Almost every general-purpose processor built since 1950 follows this model. The nand2web [CPU simulator](/cpu) is a minimal but faithful instance of it.",
                ja: "このアーキテクチャ——CPUとコード・データ共用のメモリ、I/Oバス——を**フォン・ノイマンアーキテクチャ**と呼びます。1950年以降に製造されたほぼすべての汎用プロセッサがこのモデルに従っています。nand2webの[CPUシミュレーター](/cpu)は、このアーキテクチャの最小限かつ忠実な実装例です。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 2. Fetch–decode–execute                                           */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="fde"
          title={{
            en: "The fetch–decode–execute cycle",
            ja: "フェッチ・デコード・実行サイクル",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "The CPU's entire job is one loop — the **fetch–decode–execute** (FDE) cycle. It runs billions of times per second on your laptop. Understanding it in detail is the foundation for understanding everything else about processors.",
                ja: "CPUの仕事はすべてひとつのループ——**フェッチ・デコード・実行**（FDE）サイクルに集約されます。あなたのラップトップでは毎秒何十億回も実行されています。これを詳細に理解することが、プロセッサに関する他のすべてを理解する基盤となります。",
              },
              {
                en: "**Fetch:** The Program Counter (`PC`) holds the address of the next instruction. The CPU sends that address on the address bus, memory returns the instruction word, and the CPU latches it into the **Instruction Register** (`IR`). The PC is then incremented (or set to a branch target).",
                ja: "**フェッチ：** プログラムカウンタ（`PC`）が次の命令のアドレスを保持しています。CPUはそのアドレスをアドレスバスに送出し、メモリが命令ワードを返し、CPUは**命令レジスタ**（`IR`）にラッチします。その後PCはインクリメントされます（または分岐先にセットされます）。",
              },
              {
                en: "**Decode:** The control unit interprets the bits in `IR`. The upper bits (the *opcode*) identify the operation (ADD, LOAD, JUMP…). The remaining bits specify operands — register numbers, immediate values, memory addresses, or addressing-mode flags.",
                ja: "**デコード：** 制御ユニットが`IR`内のビットを解釈します。上位ビット（*オペコード*）は演算の種類（ADD・LOAD・JUMPなど）を識別します。残りのビットはオペランド——レジスタ番号、即値、メモリアドレス、アドレッシングモードフラグを指定します。",
              },
              {
                en: "**Execute:** The control unit asserts the right control signals. The ALU adds, subtracts, ANDs, or shifts. A LOAD instruction triggers a second memory read; a STORE triggers a write. A branch instruction computes a new PC. Flags (zero, negative, carry, overflow) are updated to reflect the result.",
                ja: "**実行：** 制御ユニットが適切な制御信号を出力します。ALUは加算・減算・AND・シフトを行います。LOAD命令は2回目のメモリ読み込みを起動し、STORE命令は書き込みを起動します。分岐命令は新しいPCを計算します。フラグ（ゼロ・負数・キャリー・オーバーフロー）が結果を反映して更新されます。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "The fetch–decode–execute loop. The PC drives every iteration.",
              ja: "フェッチ・デコード・実行ループ。PCがすべての反復を駆動する。",
            }}
          >
            <FlowRow
              steps={[
                {
                  label: { en: "PC → address bus", ja: "PC → アドレスバス" },
                  sub: { en: "fetch", ja: "フェッチ" },
                },
                {
                  label: { en: "Mem → IR", ja: "メモリ → IR" },
                  sub: { en: "load instruction", ja: "命令ロード" },
                },
                {
                  label: { en: "Decode opcode", ja: "オペコードデコード" },
                  sub: { en: "control unit", ja: "制御ユニット" },
                },
                {
                  label: { en: "Execute", ja: "実行" },
                  sub: { en: "ALU / mem / branch", ja: "ALU / メモリ / 分岐" },
                },
                {
                  label: { en: "Update PC", ja: "PCを更新" },
                  sub: { en: "PC++ or branch target", ja: "PC++ または分岐先" },
                },
              ]}
            />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 3. Anatomy                                                        */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="anatomy"
          title={{ en: "Anatomy of a CPU", ja: "CPUの内部構造" }}
        >
          <Prose
            paragraphs={[
              {
                en: "A CPU is made of a handful of cooperating sub-circuits, each with a well-defined role.",
                ja: "CPUはいくつかの協調するサブ回路で構成されており、それぞれが明確な役割を持っています。",
              },
              {
                en: "The **register file** is a tiny, extremely fast on-chip memory — typically 8 to 32 general-purpose registers. Registers are the operands that the ALU works on directly. Everything else (RAM, cache) must be loaded into a register before the CPU can compute with it.",
                ja: "**レジスタファイル**は非常に高速なオンチップメモリで、通常8〜32個の汎用レジスタを持ちます。レジスタはALUが直接操作するオペランドです。それ以外（RAM・キャッシュ）は、CPUが演算する前にレジスタにロードする必要があります。",
              },
              {
                en: "The **ALU** (Arithmetic Logic Unit) performs all arithmetic (add, subtract, compare) and logical (AND, OR, XOR, NOT, shift) operations. It is a purely combinational circuit: give it two operands and an operation code, and it instantly produces a result plus status flags.",
                ja: "**ALU**（算術論理演算ユニット）は、すべての算術演算（加算・減算・比較）と論理演算（AND・OR・XOR・NOT・シフト）を実行します。純粋な組み合わせ回路であり、2つのオペランドと演算コードを与えると、即座に結果とステータスフラグを出力します。",
              },
              {
                en: "The **control unit** reads the opcode from `IR` and drives a set of control signals that route data through the datapath: which register ports are enabled, whether the ALU is adding or shifting, whether memory is being read or written, and whether to load a new PC.",
                ja: "**制御ユニット**は`IR`からオペコードを読み取り、データパスを通じたデータのルーティングを制御する信号群を出力します。どのレジスタポートを有効にするか、ALUが加算かシフトか、メモリの読み書き、PCに新値をロードするかなどを制御します。",
              },
              {
                en: "The **datapath** is the collection of wires, multiplexers, and buses that connect the register file, ALU, and memory interface. The **memory interface** (MAR + MDR — Memory Address Register and Memory Data Register) decouples the CPU's internal speed from RAM's latency.",
                ja: "**データパス**は、レジスタファイル・ALU・メモリインターフェースを接続するワイヤ・マルチプレクサ・バスの集合体です。**メモリインターフェース**（MAR + MDR——メモリアドレスレジスタとメモリデータレジスタ）は、CPUの内部速度をRAMのレイテンシから切り離します。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "Simplified CPU datapath. Arrows show data flow; the control unit drives every mux and gate.",
              ja: "簡略化されたCPUデータパス。矢印はデータフローを示し、制御ユニットがすべてのマルチプレクサとゲートを制御する。",
            }}
          >
            <DatapathDiagram />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 4. ISA                                                            */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="isa"
          title={{
            en: "Instruction Set Architecture (ISA)",
            ja: "命令セットアーキテクチャ（ISA）",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "The **ISA** is the contract between hardware and software. It defines exactly which instructions exist, what binary encoding they use, how many registers are visible to the programmer, what addressing modes are available, and how the processor behaves on exceptions. Hardware is free to implement this contract any way it likes — with simple logic, a pipeline, or an out-of-order engine — as long as the visible behaviour matches the spec.",
                ja: "**ISA**はハードウェアとソフトウェアの間の契約です。どの命令が存在するか、どのバイナリエンコーディングを使うか、プログラマに見えるレジスタ数、利用可能なアドレッシングモード、例外時のプロセッサの動作を正確に定義します。ハードウェアは、仕様通りの動作が保証される限り、単純な論理回路、パイプライン、アウトオブオーダーエンジンなど、どんな方法でも自由に実装できます。",
              },
              {
                en: "An instruction is a binary word, split into fields. The **opcode** selects the operation. **Operand fields** identify source and destination registers, encode an immediate (constant) value, or specify a memory address. **Addressing modes** determine *how* an operand is interpreted — immediate, register-direct, memory-indirect, PC-relative, and so on. The nand2web [CPU simulator](/cpu) implements a small 4-bit ISA: 4 opcode bits, operand nibbles, 16 possible instructions.",
                ja: "命令はフィールドに分割されたバイナリワードです。**オペコード**は演算を選択します。**オペランドフィールド**はソース・宛先レジスタを識別し、即値（定数）を符号化し、またはメモリアドレスを指定します。**アドレッシングモード**はオペランドの解釈方法（即値・レジスタ直接・メモリ間接・PC相対など）を決定します。nand2webの[CPUシミュレーター](/cpu)は小さな4ビットISAを実装しています：4ビットのオペコード、オペランドニブル、16種類の命令。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "RISC vs CISC — the two dominant ISA philosophies.",
              ja: "RISCとCISC——2つの支配的なISA設計思想の比較。",
            }}
          >
            <CompareTable
              headers={[
                { en: "Dimension", ja: "観点" },
                { en: "RISC", ja: "RISC" },
                { en: "CISC", ja: "CISC" },
              ]}
              rows={[
                [
                  { en: "Instruction count", ja: "命令数" },
                  { en: "Small (dozens)", ja: "少ない（数十種）" },
                  { en: "Large (hundreds)", ja: "多い（数百種）" },
                ],
                [
                  { en: "Instruction width", ja: "命令長" },
                  { en: "Fixed (e.g. 32 bits)", ja: "固定（例：32ビット）" },
                  { en: "Variable (1–15 bytes)", ja: "可変（1〜15バイト）" },
                ],
                [
                  { en: "Memory ops", ja: "メモリ操作" },
                  { en: "Load/store only", ja: "ロード/ストアのみ" },
                  { en: "Ops directly on memory", ja: "メモリ上で直接演算" },
                ],
                [
                  { en: "Pipeline-friendly?", ja: "パイプライン親和性" },
                  { en: "Yes — uniform decode", ja: "高い——一様なデコード" },
                  {
                    en: "Harder — micro-ops help",
                    ja: "低い——マイクロ操作で対処",
                  },
                ],
                [
                  { en: "Examples", ja: "代表例" },
                  { en: "ARM, RISC-V, MIPS", ja: "ARM・RISC-V・MIPS" },
                  { en: "x86, x86-64", ja: "x86・x86-64" },
                ],
              ]}
            />
          </Figure>

          <P
            t={{
              en: "Modern x86-64 processors blur the line by internally translating CISC instructions into RISC-like *micro-operations* (µops) before scheduling them. The ISA remains CISC for compatibility; the engine underneath is RISC-style.",
              ja: "現代のx86-64プロセッサは、CISCの命令をスケジューリング前にRISC風の*マイクロ操作*（µop）に内部変換することで、この区別を曖昧にしています。ISAは互換性のためにCISCのままですが、内部エンジンはRISC風です。",
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 5. Binary & ALU                                                   */}
        {/* ---------------------------------------------------------------- */}
        <Section id="alu" title={{ en: "Binary & the ALU", ja: "2進数とALU" }}>
          <Prose
            paragraphs={[
              {
                en: "All CPU arithmetic works in binary — base-2 numbers where each bit is 0 or 1. For signed integers, CPUs universally use **two's complement** encoding. In two's complement, the most significant bit has a *negative* place value: an 8-bit value `1000 0000` = −128. The advantage: addition circuits work identically for signed and unsigned numbers — no separate signed adder is needed.",
                ja: "CPUの演算はすべて2進数——各ビットが0か1の基数2の数——で行われます。符号付き整数には、CPUは普遍的に**2の補数**表現を使います。2の補数では、最上位ビットが*負の*桁値を持ちます：8ビットの`1000 0000` = −128。利点は、加算回路が符号付きと符号なしの数で同一に動作すること——別途符号付き加算器は不要です。",
              },
              {
                en: "The ALU wraps the result of addition and sets **flags** to describe it. The **zero flag** (Z) is set when the result is exactly 0 — used by `BEQ` (branch if equal) instructions. The **negative flag** (N) mirrors the sign bit. The **carry flag** (C) signals unsigned overflow (the result didn't fit in the output width). The **overflow flag** (V) signals *signed* overflow (two positive numbers summed to a negative, or vice versa).",
                ja: "ALUは加算の結果をラップし、それを記述する**フラグ**を設定します。**ゼロフラグ**（Z）は結果がちょうど0のときにセットされ、`BEQ`（等しければ分岐）命令で使用されます。**ネガティブフラグ**（N）は符号ビットを反映します。**キャリーフラグ**（C）は符号なしオーバーフロー（結果が出力幅に収まらない）を通知します。**オーバーフローフラグ**（V）は*符号付き*オーバーフロー（正の数同士の和が負になる等）を通知します。",
              },
              {
                en: "Subtraction is just addition with the second operand negated: `A − B = A + (~B + 1)`. The hardware inverts B's bits and adds 1 (via the carry-in), giving the two's complement negative. No dedicated subtractor circuit is needed — the same adder handles it.",
                ja: "減算は第2オペランドを否定した加算にすぎません：`A − B = A + (~B + 1)`。ハードウェアはBのビットを反転し、（キャリーインを通じて）1を加算することで2の補数の負数を得ます。専用の減算回路は不要——同じ加算器で処理できます。",
              },
            ]}
          />

          <Callout
            tone="insight"
            title={{ en: "Why two's complement?", ja: "なぜ2の補数か？" }}
            t={{
              en: "Two's complement is the only signed integer representation where the same adder circuit works for both signed and unsigned numbers, AND where there is a unique encoding for zero. This is why every CPU since the 1960s uses it.",
              ja: "2の補数は、同じ加算回路が符号付きと符号なし両方の数に機能し、かつゼロが一意にエンコードされる唯一の符号付き整数表現です。1960年代以降のすべてのCPUがこれを採用している理由です。",
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 6. Clock & performance                                            */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="clock"
          title={{
            en: "Clock, cycles & performance",
            ja: "クロック・サイクル・性能",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "Every digital circuit is driven by a **clock** — a square wave that ticks at a fixed frequency (e.g. 3.6 GHz = 3.6 billion ticks per second). Flip-flops (register storage cells) capture new values on each rising edge. The clock period must be long enough for the slowest combinational path in the circuit to settle — this is the **critical path**.",
                ja: "すべてのデジタル回路は**クロック**——固定周波数（例：3.6 GHz = 毎秒36億回）の矩形波——によって駆動されます。フリップフロップ（レジスタ記憶セル）は各立ち上がりエッジで新しい値を取り込みます。クロック周期は、回路内の最も遅い組み合わせ論理パスが安定するのに十分な長さでなければなりません——これが**クリティカルパス**です。",
              },
              {
                en: "CPU performance is often modelled with a three-factor equation: **Time** equals the number of instructions executed, multiplied by **CPI** (Cycles Per Instruction — the average cycles each instruction takes), divided by the **clock frequency**.",
                ja: "CPUの性能はしばしば3要素の式でモデル化されます：**実行時間**は、実行された命令数に**CPI**（命令あたりのサイクル数——各命令が要する平均クロックサイクル数）を掛け、**クロック周波数**で割った値です。",
              },
            ]}
          />
          <Formula
            t={{
              en: "Time = Instructions × CPI ÷ Clock",
              ja: "実行時間 = 命令数 × CPI ÷ クロック周波数",
            }}
          />
          <Prose
            paragraphs={[
              {
                en: "To run faster you can: execute fewer instructions (better algorithm or compiler), lower CPI (pipeline, out-of-order), or raise the clock (better process node, lower voltage). These three levers have very different engineering costs.",
                ja: "高速化するには：命令数を減らす（より良いアルゴリズムまたはコンパイラ）、CPIを下げる（パイプライン・アウトオブオーダー）、またはクロックを上げる（より微細なプロセスノード・低電圧）ことができます。この3つのレバーには非常に異なるエンジニアリングコストがあります。",
              },
              {
                en: "Raw GHz stopped scaling around 2005 because of the **power wall**: power dissipation scales with `f × C × V²`. Doubling frequency roughly doubles power. At 4+ GHz, keeping chips cool enough becomes impractical without exotic cooling. The industry response was to put multiple cores on one die rather than clock a single core faster — which is why modern CPUs have 8–96 cores instead of a 10 GHz single core.",
                ja: "生のGHzは2005年頃にスケールアップが止まりました。**電力の壁**のためです：消費電力は`f × C × V²`に比例します。周波数を2倍にすると電力もほぼ2倍になります。4+ GHzでは、特殊な冷却なしにチップを十分に冷やすことが非現実的になります。業界の対応は、単一コアを高クロック化するよりも1つのダイに複数コアを搭載することでした——これが現代のCPUが10 GHzの単一コアではなく8〜96コアを持つ理由です。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 7. Pipelining                                                     */}
        {/* ---------------------------------------------------------------- */}
        <Section id="pipeline" title={{ en: "Pipelining", ja: "パイプライン" }}>
          <Prose
            paragraphs={[
              {
                en: "A naive CPU does one instruction at a time: fetch, then decode, then execute — three phases, each consuming one cycle. The fetch unit sits idle during decode and execute. **Pipelining** overlaps these phases across multiple instructions simultaneously, like an assembly line. The classic five-stage pipeline used in MIPS and many textbooks divides every instruction into IF → ID → EX → MEM → WB.",
                ja: "単純なCPUは命令を1つずつ処理します：フェッチ→デコード→実行——3フェーズ、各1サイクル。フェッチユニットはデコードと実行の間アイドル状態です。**パイプライン**は複数の命令にわたってこれらのフェーズを同時にオーバーラップさせます。MIPSや多くの教科書で使われるクラシックな5ステージパイプラインは、各命令をIF→ID→EX→MEM→WBに分割します。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "Classic 5-stage pipeline: each stage works on a different instruction every cycle.",
              ja: "クラシックな5ステージパイプライン：各ステージは毎サイクル異なる命令を処理する。",
            }}
          >
            <FlowRow
              steps={[
                {
                  label: { en: "IF", ja: "IF" },
                  sub: { en: "Instruction Fetch", ja: "命令フェッチ" },
                },
                {
                  label: { en: "ID", ja: "ID" },
                  sub: { en: "Instruction Decode", ja: "命令デコード" },
                },
                {
                  label: { en: "EX", ja: "EX" },
                  sub: { en: "Execute", ja: "実行" },
                },
                {
                  label: { en: "MEM", ja: "MEM" },
                  sub: { en: "Memory access", ja: "メモリアクセス" },
                },
                {
                  label: { en: "WB", ja: "WB" },
                  sub: { en: "Write-back", ja: "ライトバック" },
                },
              ]}
            />
          </Figure>

          <Prose
            paragraphs={[
              {
                en: "In steady state, the pipeline completes one instruction per cycle — a 5× throughput improvement over a serial design. But the pipeline can stall on **hazards**. A **structural hazard** occurs when two stages need the same hardware resource simultaneously. A **data hazard** occurs when instruction B needs a result that instruction A hasn't finished computing yet (a RAW — read after write — dependency). A **control hazard** occurs on a branch: the next instruction to fetch is unknown until the branch is resolved.",
                ja: "定常状態では、パイプラインは毎サイクル1命令を完了します——直列設計に比べて5倍のスループット向上です。しかしパイプラインは**ハザード**でストール（停止）することがあります。**構造ハザード**は、2つのステージが同じハードウェアリソースを同時に必要とするときに発生します。**データハザード**は、命令Bが命令Aがまだ計算を終えていない結果を必要とするとき（RAW——書き込み後読み込み——依存関係）に発生します。**制御ハザード**は分岐で発生します：分岐が解決するまで次にフェッチすべき命令が不明です。",
              },
              {
                en: "Hardware mitigations: **forwarding** (bypassing) routes the ALU output back to the previous stage's input without waiting for the register write, eliminating most RAW stalls. **Branch predictors** guess the taken/not-taken outcome and speculatively fetch; if wrong, the pipeline is flushed. You can watch these mechanisms in the nand2web [architecture simulator](/arch).",
                ja: "ハードウェアによる緩和策：**フォワーディング**（バイパシング）は、レジスタ書き込みを待たずにALU出力を前ステージの入力に直接戻すことで、ほとんどのRAWストールを解消します。**分岐予測器**は分岐の成否を推測して投機的にフェッチし、誤りの場合はパイプラインをフラッシュします。これらのメカニズムはnand2webの[アーキテクチャシミュレーター](/arch)で観察できます。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 8. Modern microarchitecture                                       */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="modern"
          title={{
            en: "Modern microarchitecture",
            ja: "現代のマイクロアーキテクチャ",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "Modern processors push far beyond the simple 5-stage pipeline in two main ways. **Superscalar** designs replicate execution units and issue multiple µops per cycle from a single instruction stream — a 4-wide superscalar can issue up to 4 µops per clock if dependencies permit. **Out-of-order execution** decouples the *fetched* order from the *executed* order: a long-latency cache miss on one instruction doesn't stall independent instructions behind it in the window.",
                ja: "現代のプロセッサは、2つの主な方法で単純な5ステージパイプラインをはるかに超えています。**スーパースカラ**設計は実行ユニットを複製し、単一の命令ストリームから毎サイクル複数のµopを発行します——依存関係が許せば、4ウェイスーパースカラは毎クロック最大4つのµopを発行できます。**アウトオブオーダー実行**は、*フェッチ*順と*実行*順を切り離します：ある命令での長レイテンシのキャッシュミスが、ウィンドウ内の独立した後続命令をストールさせません。",
              },
              {
                en: "**Branch prediction** has reached ~99% accuracy on contemporary CPUs (using TAGE and neural-based predictors), but mispredictions still flush 10–20 pipeline stages. **Speculation** — executing instructions before knowing they are architecturally committed — is what makes branch prediction profitable, but it also created the **Spectre and Meltdown** class of vulnerabilities (2018): by timing cache side-effects of speculatively executed loads, attackers can read kernel memory from user space.",
                ja: "**分岐予測**は現代のCPU（TAGEやニューラルベースの予測器を使用）で約99%の精度に達していますが、誤予測はまだ10〜20パイプラインステージをフラッシュします。**投機的実行**——アーキテクチャ的にコミットされる前に命令を実行すること——は分岐予測を有益にしますが、**SpectreとMeltdown**クラスの脆弱性（2018年）も生み出しました：投機的に実行されたロードのキャッシュサイドエフェクトをタイミング計測することで、攻撃者はユーザー空間からカーネルメモリを読み取れます。",
              },
              {
                en: "**Multicore** is the dominant scaling strategy since ~2005. Each core is an independent CPU with its own register file and L1/L2 caches; a shared L3 cache sits between all cores and main memory. Multicore creates a new problem: **cache coherence** — keeping each core's view of memory consistent when another core writes. Protocols like MESI manage this, but they add latency on contested writes. The gap between cache speed and DRAM speed — the **memory wall** — is the central bottleneck in modern systems; see [Memory](/docs/memory) for the full hierarchy.",
                ja: "**マルチコア**は2005年頃から主要なスケーリング戦略です。各コアは独自のレジスタファイルとL1/L2キャッシュを持つ独立したCPUで、共有L3キャッシュがすべてのコアとメインメモリの間に配置されます。マルチコアは新たな問題を生み出します：**キャッシュコヒーレンシ**——別のコアが書き込むときに各コアのメモリビューを一貫に保つこと。MESIのようなプロトコルがこれを管理しますが、競合する書き込みにレイテンシが追加されます。キャッシュ速度とDRAM速度のギャップ——**メモリの壁**——は現代システムの中心的なボトルネックです；完全な階層については[メモリ](/docs/memory)を参照してください。",
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
                term: "PC",
                def: {
                  en: "Program Counter — register holding the address of the next instruction to fetch.",
                  ja: "プログラムカウンタ——次にフェッチする命令のアドレスを保持するレジスタ。",
                },
              },
              {
                term: "ISA",
                def: {
                  en: "Instruction Set Architecture — the hardware/software contract defining available instructions, registers, and memory model.",
                  ja: "命令セットアーキテクチャ——利用可能な命令・レジスタ・メモリモデルを定義するハードウェアとソフトウェアの契約。",
                },
              },
              {
                term: "ALU",
                def: {
                  en: "Arithmetic Logic Unit — the combinational circuit that performs integer arithmetic and bitwise logic.",
                  ja: "算術論理演算ユニット——整数演算とビット論理演算を実行する組み合わせ回路。",
                },
              },
              {
                term: "CPI",
                def: {
                  en: "Cycles Per Instruction — average clock cycles consumed per instruction; lower is faster.",
                  ja: "命令あたりのサイクル数——命令1つあたりの平均クロックサイクル数。低いほど高速。",
                },
              },
              {
                term: "Pipeline",
                def: {
                  en: "Dividing instruction execution into sequential stages (IF/ID/EX/MEM/WB) so multiple instructions overlap in flight, increasing throughput.",
                  ja: "命令実行を順次ステージ（IF/ID/EX/MEM/WB）に分割し、複数命令を同時進行させてスループットを向上させる技術。",
                },
              },
              {
                term: "Cache",
                def: {
                  en: "A small, fast memory between the CPU and DRAM that exploits locality to reduce average memory access latency.",
                  ja: "CPUとDRAMの間にある小さく高速なメモリ。局所性を利用して平均メモリアクセスレイテンシを削減する。",
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
              title: "Patterson & Hennessy — Computer Organization and Design",
              href: "https://en.wikipedia.org/wiki/Computer_Organization_and_Design",
              note: {
                en: "The standard undergraduate textbook for processor design, assembly, and the memory hierarchy.",
                ja: "プロセッサ設計・アセンブリ・メモリ階層の定番学部教科書。",
              },
            },
            {
              title:
                "Hennessy & Patterson — Computer Architecture: A Quantitative Approach",
              href: "https://en.wikipedia.org/wiki/Computer_Architecture:_A_Quantitative_Approach",
              note: {
                en: "Graduate-level treatment of microarchitecture, ILP, memory systems, and multiprocessors.",
                ja: "マイクロアーキテクチャ・ILP・メモリシステム・マルチプロセッサを扱う大学院レベルの教科書。",
              },
            },
            {
              title: "nand2tetris — From NAND to Tetris",
              href: "https://www.nand2tetris.org/",
              note: {
                en: "Build a complete computer from NAND gates up — the direct inspiration for this site.",
                ja: "NANDゲートから完全なコンピュータを構築するプロジェクト——このサイトの直接の着想源。",
              },
            },
            {
              title: "Agner Fog — Microarchitecture guide",
              href: "https://www.agner.org/optimize/",
              note: {
                en: "Definitive low-level reference for x86 pipeline behaviour, latency, throughput, and µop tables.",
                ja: "x86パイプラインの動作・レイテンシ・スループット・µopテーブルの決定版低レベルリファレンス。",
              },
            },
            {
              title: "Wikipedia — Instruction pipelining",
              href: "https://en.wikipedia.org/wiki/Instruction_pipelining",
              note: {
                en: "Solid overview of pipeline stages, hazards, and forwarding with diagrams.",
                ja: "パイプラインステージ・ハザード・フォワーディングの図付き概説。",
              },
            },
            {
              title: "Wikipedia — Two's complement",
              href: "https://en.wikipedia.org/wiki/Two%27s_complement",
              note: {
                en: "Explains the encoding, why it works, and overflow detection.",
                ja: "2の補数のエンコーディング、動作原理、オーバーフロー検出の説明。",
              },
            },
            {
              title: "Spectre and Meltdown — spectreattack.com",
              href: "https://spectreattack.com/",
              note: {
                en: "The original disclosure site for the speculative-execution side-channel vulnerabilities.",
                ja: "投機的実行サイドチャネル脆弱性の元々の開示サイト。",
              },
            },
          ]}
        />
      </Article>
    </DocsShell>
  );
}

// ---------------------------------------------------------------------------
// Inline datapath SVG diagram
// ---------------------------------------------------------------------------

function DatapathDiagram() {
  const sid = useSvgId();
  return (
    <Diagram
      label={{
        en: "CPU datapath block diagram: register file, ALU, control unit, and memory interface",
        ja: "CPUデータパスブロック図：レジスタファイル、ALU、制御ユニット、メモリインターフェース",
      }}
      viewBox="0 0 560 320"
      maxHeight={300}
    >
      {/* Background */}
      <rect width="560" height="320" fill={C.panel} rx="8" />

      {/* Register File box */}
      <rect
        x="30"
        y="100"
        width="110"
        height="80"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="85"
        y="136"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="600"
      >
        Register
      </text>
      <text
        x="85"
        y="152"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="600"
      >
        File
      </text>
      <text x="85" y="170" textAnchor="middle" fill={C.faint} fontSize="10">
        R0 – R15
      </text>

      {/* ALU box */}
      <rect
        x="210"
        y="100"
        width="110"
        height="80"
        rx="6"
        fill={C.muted}
        stroke={C.high}
        strokeWidth="1.5"
      />
      <text
        x="265"
        y="144"
        textAnchor="middle"
        fill={C.text}
        fontSize="13"
        fontWeight="600"
      >
        ALU
      </text>
      <text x="265" y="162" textAnchor="middle" fill={C.faint} fontSize="10">
        + − &amp; | &gt;&gt;
      </text>

      {/* Control Unit box */}
      <rect
        x="210"
        y="20"
        width="110"
        height="55"
        rx="6"
        fill={C.muted}
        stroke={C.warn}
        strokeWidth="1.5"
      />
      <text
        x="265"
        y="44"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="600"
      >
        Control
      </text>
      <text
        x="265"
        y="62"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="600"
      >
        Unit
      </text>

      {/* Memory Interface box */}
      <rect
        x="390"
        y="100"
        width="130"
        height="80"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="455"
        y="132"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="600"
      >
        Memory
      </text>
      <text
        x="455"
        y="148"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="600"
      >
        Interface
      </text>
      <text x="455" y="166" textAnchor="middle" fill={C.faint} fontSize="10">
        MAR / MDR
      </text>

      {/* Flags box */}
      <rect
        x="210"
        y="210"
        width="110"
        height="50"
        rx="6"
        fill={C.muted}
        stroke={C.faint}
        strokeWidth="1"
      />
      <text
        x="265"
        y="231"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        Flags
      </text>
      <text x="265" y="248" textAnchor="middle" fill={C.faint} fontSize="10">
        Z N C V
      </text>

      {/* Arrows: Reg → ALU (operands) */}
      <line
        x1="140"
        y1="130"
        x2="208"
        y2="130"
        stroke={C.accent}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arr")})`}
      />
      <line
        x1="140"
        y1="160"
        x2="208"
        y2="160"
        stroke={C.accent}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arr")})`}
      />

      {/* Arrow: ALU → Reg (result writeback) */}
      <path
        d="M265 180 Q265 200 160 200 Q140 200 140 175"
        fill="none"
        stroke={C.high}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arrg")})`}
      />

      {/* Arrow: ALU → Flags */}
      <line
        x1="265"
        y1="180"
        x2="265"
        y2="208"
        stroke={C.faint}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arrf")})`}
      />

      {/* Arrow: ALU → Memory interface */}
      <line
        x1="320"
        y1="140"
        x2="388"
        y2="140"
        stroke={C.accent}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arr")})`}
      />
      {/* Arrow: Memory → ALU (load result) */}
      <line
        x1="388"
        y1="165"
        x2="320"
        y2="165"
        stroke={C.accent}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arr")})`}
      />

      {/* Arrow: Control → ALU */}
      <line
        x1="265"
        y1="75"
        x2="265"
        y2="98"
        stroke={C.warn}
        strokeWidth="1.5"
        strokeDasharray="4 2"
        markerEnd={`url(#${sid("arrw")})`}
      />
      {/* Arrow: Control → Reg */}
      <path
        d="M210 47 Q150 47 140 98"
        fill="none"
        stroke={C.warn}
        strokeWidth="1.5"
        strokeDasharray="4 2"
        markerEnd={`url(#${sid("arrw")})`}
      />

      {/* PC label */}
      <rect
        x="30"
        y="230"
        width="80"
        height="36"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1"
      />
      <text
        x="70"
        y="244"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        PC
      </text>
      <text x="70" y="259" textAnchor="middle" fill={C.faint} fontSize="10">
        0x0000
      </text>

      {/* IR label */}
      <rect
        x="120"
        y="230"
        width="80"
        height="36"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1"
      />
      <text
        x="160"
        y="244"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        IR
      </text>
      <text x="160" y="259" textAnchor="middle" fill={C.faint} fontSize="10">
        opcode
      </text>

      {/* Arrow: PC → Control (via fetch) */}
      <path
        d="M70 230 Q70 210 160 210 Q210 210 210 75"
        fill="none"
        stroke={C.line}
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
      {/* Arrow: IR → Control */}
      <path
        d="M160 230 L160 216 L212 60"
        fill="none"
        stroke={C.warn}
        strokeWidth="1"
        strokeDasharray="3 2"
        markerEnd={`url(#${sid("arrw")})`}
      />

      {/* Memory bus label */}
      <line
        x1="455"
        y1="180"
        x2="455"
        y2="285"
        stroke={C.line}
        strokeWidth="1.5"
      />
      <line
        x1="390"
        y1="285"
        x2="530"
        y2="285"
        stroke={C.line}
        strokeWidth="1.5"
      />
      <text x="460" y="302" textAnchor="middle" fill={C.faint} fontSize="10">
        Main Memory (RAM)
      </text>

      {/* Arrow markers — ids are instance-scoped via useSvgId to avoid collisions across diagrams */}
      <defs>
        <marker
          id={sid("arr")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.accent} />
        </marker>
        <marker
          id={sid("arrg")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.high} />
        </marker>
        <marker
          id={sid("arrw")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.warn} />
        </marker>
        <marker
          id={sid("arrf")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.faint} />
        </marker>
      </defs>
    </Diagram>
  );
}
