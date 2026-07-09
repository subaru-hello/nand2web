import type { LocalizedText } from "../deepdive/DeepDive";

export interface QuizCard {
  readonly id: string;
  readonly module: string;
  readonly route: string;
  readonly question: LocalizedText;
  readonly answer: LocalizedText;
}

export const DECK: readonly QuizCard[] = [
  // ── Logic (10 cards) ─────────────────────────────────────────────────────
  {
    id: "logic-nand-1",
    module: "logic-gates",
    route: "/logic",
    question: {
      en: "Why is NAND called a universal gate?",
      ja: "NANDが万能ゲートと呼ばれる理由は何ですか？",
    },
    answer: {
      en: "Every Boolean function can be built from NAND gates alone. AND, OR, and NOT can each be expressed using only NAND, so any combinational circuit is realizable with a single gate type.",
      ja: "すべてのブール関数はNANDゲートだけで構成できます。AND・OR・NOTはいずれもNANDのみで表現できるため、任意の組み合わせ回路を1種類のゲートで実現できます。",
    },
  },
  {
    id: "logic-not-1",
    module: "logic-gates",
    route: "/logic",
    question: {
      en: "How do you build a NOT gate from a single NAND gate?",
      ja: "NANDゲート1つからNOTゲートを作るにはどうすればよいですか？",
    },
    answer: {
      en: "Tie both inputs of the NAND gate together. NAND(x, x) = NOT(AND(x, x)) = NOT(x).",
      ja: "NANDゲートの両入力を同じ信号に接続します。NAND(x, x) = NOT(AND(x, x)) = NOT(x)になります。",
    },
  },
  {
    id: "logic-flipflop-1",
    module: "logic-gates",
    route: "/logic",
    question: {
      en: "What makes a D flip-flop different from a D latch?",
      ja: "DフリップフロップとDラッチの違いは何ですか？",
    },
    answer: {
      en: "A D latch is level-triggered: the output follows the input while the enable is high. A D flip-flop is edge-triggered: it samples the input only on the rising (or falling) clock edge, making its state predictable and stable.",
      ja: "DラッチはEnableが高い間、出力が入力に追従するレベルトリガです。Dフリップフロップはクロックのエッジでのみ入力をサンプルするエッジトリガで、状態が予測しやすく安定しています。",
    },
  },
  {
    id: "logic-adder-1",
    module: "logic-gates",
    route: "/logic",
    question: {
      en: "What are the two outputs of a full adder, and what do they represent?",
      ja: "全加算器の2つの出力は何を表していますか？",
    },
    answer: {
      en: "Sum (S) and Carry-out (Cout). S is the XOR of the three inputs (A, B, Cin); Cout is 1 when at least two of the three inputs are 1.",
      ja: "Sum（S）とCarry-out（Cout）です。SはA・B・Cinの3入力のXOR、Coutは3入力のうち2つ以上が1のとき1になります。",
    },
  },
  {
    id: "logic-sr-1",
    module: "logic-gates",
    route: "/logic",
    question: {
      en: "What is the forbidden state of an SR latch, and why is it forbidden?",
      ja: "SRラッチの禁止状態とは何ですか？またなぜ禁止なのですか？",
    },
    answer: {
      en: "S=1 and R=1 simultaneously. This forces both Q and NOT-Q to 0 (or 1, depending on the gate type), violating the complementary relationship between the outputs.",
      ja: "S=1かつR=1の同時入力です。これにより、QとNOT-Qが両方とも0（またはゲートによっては1）になり、出力の相補関係が崩れます。",
    },
  },
  {
    id: "logic-alu-1",
    module: "logic-gates",
    route: "/logic",
    question: {
      en: "What is the role of the control bits in a simple ALU?",
      ja: "シンプルなALUにおける制御ビットの役割は何ですか？",
    },
    answer: {
      en: "Control bits select which arithmetic or logic operation (e.g. ADD, AND, OR, XOR) the ALU performs on its inputs. They act as a selector for the internal multiplexer that routes the result.",
      ja: "制御ビットは、ALUが入力に対して実行する演算（ADD・AND・OR・XORなど）を選択します。内部のマルチプレクサに対するセレクタとして機能し、結果を振り分けます。",
    },
  },
  {
    id: "logic-xor-1",
    module: "logic-gates",
    route: "/logic",
    question: {
      en: "Express XOR in terms of AND, OR, and NOT.",
      ja: "AND・OR・NOTを使ってXORを表現してください。",
    },
    answer: {
      en: "A XOR B = (A AND NOT B) OR (NOT A AND B). Equivalently: (A OR B) AND NOT(A AND B).",
      ja: "A XOR B = (A AND NOT B) OR (NOT A AND B)。等価的に: (A OR B) AND NOT(A AND B)でもあります。",
    },
  },
  {
    id: "logic-carry-1",
    module: "logic-gates",
    route: "/logic",
    question: {
      en: "What is carry-lookahead and why is it faster than ripple-carry?",
      ja: "桁上げ先見加算器とは何ですか？なぜリップルキャリーより速いのですか？",
    },
    answer: {
      en: "Carry-lookahead pre-computes generate and propagate signals so all carry bits are determined in parallel, rather than waiting for each stage to pass its carry to the next. This reduces addition time from O(n) to O(log n) gate delays.",
      ja: "桁上げ先見は生成信号と伝播信号を事前計算し、全桁上げビットを並列で決定します。これにより各段が順次桁上げを渡す必要がなくなり、加算時間がO(n)からO(log n)のゲート遅延に削減されます。",
    },
  },
  {
    id: "logic-mux-1",
    module: "logic-gates",
    route: "/logic",
    question: {
      en: "What does a 2-to-1 multiplexer do?",
      ja: "2入力マルチプレクサ（2-to-1 MUX）は何をしますか？",
    },
    answer: {
      en: "It routes one of two data inputs to a single output based on a 1-bit select signal. Out = (NOT S AND A) OR (S AND B).",
      ja: "1ビットのセレクト信号に基づいて、2つのデータ入力のうち1つを1つの出力に振り向けます。Out = (NOT S AND A) OR (S AND B)。",
    },
  },
  {
    id: "logic-comb-1",
    module: "logic-gates",
    route: "/logic",
    question: {
      en: "What distinguishes combinational logic from sequential logic?",
      ja: "組み合わせ論理と順序論理の違いは何ですか？",
    },
    answer: {
      en: "Combinational logic has outputs that depend only on current inputs (no memory). Sequential logic has internal state (flip-flops/latches), so outputs depend on current inputs and past history.",
      ja: "組み合わせ論理の出力は現在の入力にのみ依存します（メモリなし）。順序論理は内部状態（フリップフロップ/ラッチ）を持ち、出力は現在の入力と過去の履歴に依存します。",
    },
  },

  // ── CPU (10 cards) ───────────────────────────────────────────────────────
  {
    id: "cpu-fetch-1",
    module: "cpu-4bit",
    route: "/cpu",
    question: {
      en: "What are the three phases of the classical instruction cycle?",
      ja: "古典的な命令サイクルの3フェーズとは何ですか？",
    },
    answer: {
      en: "Fetch (load instruction from memory at PC address), Decode (interpret the opcode and operands), and Execute (perform the operation and update registers or memory).",
      ja: "フェッチ（PCアドレスからメモリに命令を読み込む）、デコード（オペコードとオペランドを解釈する）、実行（演算を行いレジスタやメモリを更新する）の3フェーズです。",
    },
  },
  {
    id: "cpu-pc-1",
    module: "cpu-4bit",
    route: "/cpu",
    question: {
      en: "What is the Program Counter (PC) and how does it advance?",
      ja: "プログラムカウンタ（PC）とは何ですか？どのように進みますか？",
    },
    answer: {
      en: "The PC holds the address of the current instruction. After a fetch it increments by one instruction word. A branch or jump instruction loads a new target address into the PC instead.",
      ja: "PCは現在の命令のアドレスを保持します。フェッチ後は1命令ワード分インクリメントされます。分岐やジャンプ命令では、代わりに新しいターゲットアドレスがPCにロードされます。",
    },
  },
  {
    id: "cpu-isa-1",
    module: "cpu-4bit",
    route: "/cpu",
    question: {
      en: "What does ISA stand for, and what does it define?",
      ja: "ISAとは何の略で、何を定義しますか？",
    },
    answer: {
      en: "Instruction Set Architecture. It defines the programmer-visible interface of a CPU: the set of instructions, register names and sizes, addressing modes, and the memory model.",
      ja: "命令セットアーキテクチャ（Instruction Set Architecture）の略です。命令セット・レジスタ名とサイズ・アドレッシングモード・メモリモデルなど、CPUのプログラマから見えるインターフェイスを定義します。",
    },
  },
  {
    id: "cpu-register-1",
    module: "cpu-4bit",
    route: "/cpu",
    question: {
      en: "Why are registers faster than main memory?",
      ja: "レジスタはなぜメインメモリより速いのですか？",
    },
    answer: {
      en: "Registers are flip-flops embedded directly on the CPU die, accessed in a single clock cycle with no bus latency. Main memory requires off-chip DRAM access, which takes tens to hundreds of cycles.",
      ja: "レジスタはCPUチップ上に直接組み込まれたフリップフロップで、バスレイテンシなしに1クロックサイクルでアクセスできます。メインメモリはチップ外のDRAMアクセスが必要で、数十〜数百サイクルかかります。",
    },
  },
  {
    id: "cpu-opcode-1",
    module: "cpu-4bit",
    route: "/cpu",
    question: {
      en: "In a 4-bit CPU with 16 instructions, how many bits are used for the opcode, and why?",
      ja: "16命令を持つ4ビットCPUでは、オペコードに何ビット使用しますか？その理由は？",
    },
    answer: {
      en: "4 bits, because 2^4 = 16 distinct encodings are needed to represent each instruction uniquely.",
      ja: "4ビットです。2^4 = 16の異なるエンコーディングが各命令を一意に表現するために必要だからです。",
    },
  },
  {
    id: "cpu-imm-1",
    module: "cpu-4bit",
    route: "/cpu",
    question: {
      en: "What is an immediate operand?",
      ja: "即値オペランド（即値）とは何ですか？",
    },
    answer: {
      en: "A constant value encoded directly inside the instruction word, so no memory access or register lookup is needed to obtain it at decode time.",
      ja: "命令ワードの中に直接エンコードされた定数値です。デコード時にメモリアクセスやレジスタ参照なしに取得できます。",
    },
  },
  {
    id: "cpu-jump-1",
    module: "cpu-4bit",
    route: "/cpu",
    question: {
      en: "What is the difference between an unconditional jump and a conditional branch?",
      ja: "無条件ジャンプと条件分岐の違いは何ですか？",
    },
    answer: {
      en: "An unconditional jump always transfers control to the target address. A conditional branch transfers control only when a specified condition (e.g., zero flag set) is true; otherwise, execution continues sequentially.",
      ja: "無条件ジャンプは常にターゲットアドレスに制御を移します。条件分岐は指定した条件（例: ゼロフラグが立っている）が真の場合のみ制御を移し、そうでなければ順次実行が続きます。",
    },
  },
  {
    id: "cpu-alu-flags-1",
    module: "cpu-4bit",
    route: "/cpu",
    question: {
      en: "What are the typical status flags set by an ALU operation?",
      ja: "ALU演算が設定する代表的なステータスフラグとは何ですか？",
    },
    answer: {
      en: "Zero (Z): result is zero. Negative/Sign (N): result's MSB is 1. Carry (C): unsigned overflow. Overflow (V): signed overflow. These flags enable conditional branching.",
      ja: "Zero（Z）: 結果がゼロ。Negative/Sign（N）: 結果のMSBが1。Carry（C）: 符号なしオーバーフロー。Overflow（V）: 符号付きオーバーフロー。これらのフラグは条件分岐を可能にします。",
    },
  },
  {
    id: "cpu-load-store-1",
    module: "cpu-4bit",
    route: "/cpu",
    question: {
      en: "What is a load/store architecture?",
      ja: "ロード/ストアアーキテクチャとは何ですか？",
    },
    answer: {
      en: "An ISA design where only dedicated LOAD and STORE instructions access memory; all other operations (arithmetic, logic) work exclusively on registers.",
      ja: "専用のLOADとSTORE命令のみがメモリにアクセスし、他のすべての演算（算術・論理）はレジスタのみを使用するISA設計です。",
    },
  },
  {
    id: "cpu-clock-1",
    module: "cpu-4bit",
    route: "/cpu",
    question: {
      en: "What does clock frequency measure in a CPU?",
      ja: "CPUのクロック周波数は何を測定しますか？",
    },
    answer: {
      en: "The number of clock cycles per second (in Hz). It sets the tempo of state changes in sequential logic. Higher frequency can mean more instructions per second, but power dissipation grows roughly with frequency.",
      ja: "1秒あたりのクロックサイクル数（Hz）を測定します。順序論理の状態変化のテンポを設定します。周波数が高いほど1秒あたりの命令数が増えますが、消費電力はほぼ周波数に比例して増加します。",
    },
  },

  // ── Architecture (10 cards) ──────────────────────────────────────────────
  {
    id: "arch-pipeline-1",
    module: "arch-pipeline",
    route: "/arch",
    question: {
      en: "Why does a taken branch flush the pipeline?",
      ja: "分岐が成立するとパイプラインがフラッシュされるのはなぜですか？",
    },
    answer: {
      en: "After a branch instruction is fetched, the CPU has already started fetching subsequent sequential instructions. If the branch is taken, those wrongly-fetched instructions are invalid and must be discarded (flushed) to avoid executing incorrect work.",
      ja: "分岐命令がフェッチされた後、CPUはすでに後続の順次命令のフェッチを開始しています。分岐が成立すると、誤ってフェッチされた命令は無効であり、誤った処理を実行しないよう破棄（フラッシュ）しなければなりません。",
    },
  },
  {
    id: "arch-hazard-data-1",
    module: "arch-pipeline",
    route: "/arch",
    question: {
      en: "What is a data hazard, and how does forwarding resolve it?",
      ja: "データハザードとは何ですか？フォワーディングはどのように解決しますか？",
    },
    answer: {
      en: "A data hazard occurs when an instruction needs a result that a preceding instruction has not yet written back. Forwarding routes the computed result directly from a later pipeline stage (EX/MEM) to the input of an earlier stage, bypassing the register file.",
      ja: "データハザードは、先行命令がまだライトバックしていない結果を後続命令が必要とする場合に発生します。フォワーディングは、後段のパイプラインステージ（EX/MEM）から前段の入力へ計算結果を直接転送し、レジスタファイルを迂回します。",
    },
  },
  {
    id: "arch-stall-1",
    module: "arch-pipeline",
    route: "/arch",
    question: {
      en: "When does a pipeline need to insert a stall (bubble)?",
      ja: "パイプラインにストール（バブル）を挿入する必要があるのはいつですか？",
    },
    answer: {
      en: "A stall is inserted when forwarding cannot resolve the hazard alone — most commonly a load-use hazard, where the instruction immediately after a LOAD needs the value the LOAD is still fetching from memory.",
      ja: "フォワーディングだけではハザードを解決できない場合にストールが挿入されます。最も一般的なのはロード・ユースハザードで、LOAD命令の直後の命令がLOADがメモリからフェッチ中の値を必要とする場合です。",
    },
  },
  {
    id: "arch-cpi-1",
    module: "arch-pipeline",
    route: "/arch",
    question: {
      en: "What does CPI mean, and what is the ideal CPI of a simple in-order pipeline?",
      ja: "CPIとは何ですか？シンプルなイン・オーダーパイプラインの理想CPIはいくつですか？",
    },
    answer: {
      en: "CPI = Cycles Per Instruction. The ideal CPI of a k-stage in-order pipeline is 1, meaning one instruction completes every clock cycle after the pipeline is full. Hazards raise the effective CPI above 1.",
      ja: "CPI = 命令あたりクロック数（Cycles Per Instruction）。kステージのイン・オーダーパイプラインの理想CPIは1で、パイプラインが満杯になった後は毎クロックサイクルに1命令が完了します。ハザードによって実効CPIは1より大きくなります。",
    },
  },
  {
    id: "arch-cache-hit-1",
    module: "arch-cache",
    route: "/arch",
    question: {
      en: "What is the difference between a cache hit and a cache miss?",
      ja: "キャッシュヒットとキャッシュミスの違いは何ですか？",
    },
    answer: {
      en: "A cache hit occurs when the requested data is already in the cache, so it is returned in a few cycles. A cache miss means the data is not present; the CPU must fetch it from a slower memory level, incurring a miss penalty.",
      ja: "キャッシュヒットは要求されたデータがすでにキャッシュにある場合で、数サイクルで返されます。キャッシュミスはデータが存在しない場合で、CPUはより遅いメモリ階層から取得する必要があり、ミスペナルティが発生します。",
    },
  },
  {
    id: "arch-locality-1",
    module: "arch-cache",
    route: "/arch",
    question: {
      en: "What are the two types of locality that caches exploit?",
      ja: "キャッシュが利用する局所性の2種類とは何ですか？",
    },
    answer: {
      en: "Temporal locality: recently accessed data is likely to be accessed again soon. Spatial locality: data near recently accessed addresses is likely to be accessed soon (motivating cache lines that fetch a block at a time).",
      ja: "時間的局所性: 最近アクセスされたデータは近い将来また使われる可能性が高い。空間的局所性: 最近アクセスされたアドレスの近くにあるデータも近い将来使われる可能性が高い（これがブロック単位でフェッチするキャッシュラインの動機になります）。",
    },
  },
  {
    id: "arch-assoc-1",
    module: "arch-cache",
    route: "/arch",
    question: {
      en: "What is set-associativity in a cache?",
      ja: "キャッシュのセット連想方式とは何ですか？",
    },
    answer: {
      en: "Set-associativity divides the cache into sets, each holding k ways. An address maps to exactly one set but can occupy any of the k way slots. Higher associativity reduces conflict misses at the cost of more complex hardware.",
      ja: "キャッシュをセットに分割し、各セットにk個のウェイを持たせます。アドレスは1つのセットにのみマップされますが、そのセット内のどのウェイにも格納できます。連想度が高いほどコンフリクトミスが減りますが、ハードウェアが複雑になります。",
    },
  },
  {
    id: "arch-lru-1",
    module: "arch-cache",
    route: "/arch",
    question: {
      en: "What does LRU stand for, and what is its eviction policy?",
      ja: "LRUとは何の略ですか？また、その退出ポリシーは何ですか？",
    },
    answer: {
      en: "Least Recently Used. When a cache set is full and a new block must be admitted, LRU evicts the block that was accessed least recently, under the assumption that old data is less likely to be needed again.",
      ja: "Least Recently Used（最近最も使われていないもの）の略です。キャッシュセットが満杯のとき、LRUは最も長い間アクセスされていないブロックを追い出します（古いデータは再度必要とされる可能性が低いという前提に基づきます）。",
    },
  },
  {
    id: "arch-amdahl-1",
    module: "arch-pipeline",
    route: "/arch",
    question: {
      en: "State Amdahl's Law in one sentence.",
      ja: "アムダールの法則を一文で述べてください。",
    },
    answer: {
      en: "The maximum speedup from improving a fraction f of a program is limited to 1/(1-f), because the non-parallelizable serial portion always forms a bottleneck.",
      ja: "プログラムの割合fを改善したときの最大高速化は1/(1-f)に制限されます。並列化できないシリアル部分が常にボトルネックになるからです。",
    },
  },
  {
    id: "arch-branch-pred-1",
    module: "arch-pipeline",
    route: "/arch",
    question: {
      en: "What is branch prediction, and why does it improve pipeline performance?",
      ja: "分岐予測とは何ですか？なぜパイプライン性能が向上しますか？",
    },
    answer: {
      en: "Branch prediction guesses whether a conditional branch will be taken before the condition is known, allowing the pipeline to keep fetching instructions speculatively. A correct prediction avoids the flush penalty; mispredictions still pay the penalty but are less frequent.",
      ja: "分岐予測は、条件が判明する前に条件分岐が成立するかどうかを推測し、パイプラインが投機的に命令のフェッチを続けられるようにします。予測が正しければフラッシュペナルティを回避でき、誤予測はペナルティを支払いますがその頻度は低くなります。",
    },
  },

  // ── OS (10 cards) ────────────────────────────────────────────────────────
  {
    id: "os-clock-1",
    module: "os-memory",
    route: "/os",
    question: {
      en: "What does the Clock algorithm's use-bit represent?",
      ja: "Clockアルゴリズムの使用ビットは何を表していますか？",
    },
    answer: {
      en: "The use-bit (reference bit) is set to 1 by the MMU each time a page is accessed. The Clock hand clears the bit when it passes; a page whose bit is still 0 when the hand returns is evicted as least-recently-used.",
      ja: "使用ビット（参照ビット）はページがアクセスされるたびにMMUが1にセットします。Clockの針が通過するとビットをクリアし、針が戻ってきたときに0のままのページが最も最近使われていないものとして追い出されます。",
    },
  },
  {
    id: "os-page-fault-1",
    module: "os-memory",
    route: "/os",
    question: {
      en: "What is a page fault, and what happens when one occurs?",
      ja: "ページフォルトとは何ですか？発生するとどうなりますか？",
    },
    answer: {
      en: "A page fault is a trap raised by the MMU when the accessed virtual page is not in physical memory. The OS handler loads the missing page from disk (or swap), updates the page table, and restarts the faulting instruction.",
      ja: "ページフォルトは、アクセスした仮想ページが物理メモリにない場合にMMUが発生させるトラップです。OSハンドラはディスク（またはスワップ）から欠けているページを読み込み、ページテーブルを更新して、フォルトした命令を再実行します。",
    },
  },
  {
    id: "os-scheduling-fcfs-1",
    module: "os-scheduling",
    route: "/os",
    question: {
      en: "What is the convoy effect in FCFS scheduling?",
      ja: "FCFSスケジューリングのコンボイ効果とは何ですか？",
    },
    answer: {
      en: "The convoy effect occurs when a long CPU-bound process blocks the CPU, forcing many short I/O-bound processes to wait in the ready queue, leading to poor CPU and device utilization.",
      ja: "CPUバウンドなロングプロセスがCPUを占有し、多くの短いI/Oバウンドプロセスがレディキューで待たされることで、CPUとデバイスの利用率が低下する現象です。",
    },
  },
  {
    id: "os-rr-1",
    module: "os-scheduling",
    route: "/os",
    question: {
      en: "How does the time quantum in Round-Robin scheduling affect performance?",
      ja: "ラウンドロビンスケジューリングのタイムクォンタムは性能にどう影響しますか？",
    },
    answer: {
      en: "A small quantum improves responsiveness but increases context-switch overhead. A large quantum approaches FCFS behavior. The quantum must be large relative to context-switch time but small enough to feel interactive.",
      ja: "クォンタムが小さいと応答性が向上しますがコンテキストスイッチのオーバーヘッドが増えます。大きくするとFCFSに近い動作になります。クォンタムはコンテキストスイッチ時間より十分大きく、かつインタラクティブに感じられるほど小さい必要があります。",
    },
  },
  {
    id: "os-mlfq-1",
    module: "os-scheduling",
    route: "/os",
    question: {
      en: "What is the core idea of MLFQ scheduling?",
      ja: "MLFQスケジューリングの中心的なアイデアは何ですか？",
    },
    answer: {
      en: "Multi-Level Feedback Queue uses multiple queues with decreasing priority. New jobs start at the highest priority; if they use their full quantum without blocking, they are demoted to a lower-priority queue, naturally separating short interactive jobs from long CPU-bound ones.",
      ja: "マルチレベルフィードバックキューは、優先度が降順に並ぶ複数のキューを使用します。新しいジョブは最高優先度で開始し、ブロックせずにクォンタムを使い切るとより低い優先度キューに降格します。これにより短いインタラクティブジョブと長いCPUバウンドジョブが自然に分類されます。",
    },
  },
  {
    id: "os-virtual-addr-1",
    module: "os-memory",
    route: "/os",
    question: {
      en: "How is a virtual address split into a page number and an offset?",
      ja: "仮想アドレスはページ番号とオフセットにどのように分割されますか？",
    },
    answer: {
      en: "The lower k bits form the page offset (where 2^k is the page size in bytes). The remaining upper bits form the virtual page number (VPN), which is looked up in the page table to obtain the physical frame number.",
      ja: "下位kビット（2^kがページサイズ（バイト））がページオフセットを形成します。残りの上位ビットが仮想ページ番号（VPN）を形成し、ページテーブルで物理フレーム番号に変換されます。",
    },
  },
  {
    id: "os-tlb-1",
    module: "os-memory",
    route: "/os",
    question: {
      en: "What is the TLB and why does it exist?",
      ja: "TLBとは何ですか？なぜ存在するのですか？",
    },
    answer: {
      en: "The Translation Lookaside Buffer is a small, fast cache of recent page-table entries. Without it, every memory access would require an extra memory access for the page table walk, doubling latency. The TLB exploits temporal locality in address translations.",
      ja: "TLBは最近のページテーブルエントリを格納する小型で高速なキャッシュです。これがないと、すべてのメモリアクセスでページテーブルウォークのための追加メモリアクセスが必要になり、レイテンシが2倍になります。TLBはアドレス変換の時間的局所性を利用します。",
    },
  },
  {
    id: "os-context-switch-1",
    module: "os-scheduling",
    route: "/os",
    question: {
      en: "What state must the OS save and restore during a context switch?",
      ja: "コンテキストスイッチ時にOSが保存・復元しなければならない状態は何ですか？",
    },
    answer: {
      en: "The contents of all CPU registers (including PC and stack pointer), the process's memory map (page table base register), and any kernel-level state such as open file descriptors stored in the process control block (PCB).",
      ja: "PCとスタックポインタを含むすべてのCPUレジスタの内容、プロセスのメモリマップ（ページテーブルベースレジスタ）、およびプロセス制御ブロック（PCB）に格納されるオープンファイルディスクリプタなどのカーネルレベルの状態です。",
    },
  },
  {
    id: "os-fifo-belady-1",
    module: "os-memory",
    route: "/os",
    question: {
      en: "What is Belady's anomaly and which algorithm suffers from it?",
      ja: "Beladyの異常とは何ですか？どのアルゴリズムが影響を受けますか？",
    },
    answer: {
      en: "Belady's anomaly is the counterintuitive phenomenon where adding more physical page frames can increase the page-fault rate. It affects FIFO page replacement but not LRU or OPT.",
      ja: "Beladyの異常は、物理ページフレームを増やすとページフォルト率が上昇するという直感に反する現象です。FIFOページ置換アルゴリズムに影響しますが、LRUやOPTには影響しません。",
    },
  },
  {
    id: "os-sjf-1",
    module: "os-scheduling",
    route: "/os",
    question: {
      en: "Why does SJF scheduling minimize average waiting time?",
      ja: "SJFスケジューリングがなぜ平均待ち時間を最小化するのですか？",
    },
    answer: {
      en: "SJF is provably optimal for minimizing average waiting time because scheduling the shortest job first reduces the wait accumulated by the many subsequent jobs; a long job penalizes fewer other jobs when placed last.",
      ja: "SJFは最も短いジョブを先にスケジューリングすることで、後続の多くのジョブに蓄積される待ち時間を削減するため、平均待ち時間の最小化において証明可能に最適です。長いジョブを最後に配置することで、影響を受ける他のジョブの数が最小になります。",
    },
  },

  // ── Lang/Compiler (10 cards) ─────────────────────────────────────────────
  {
    id: "lang-lexer-1",
    module: "lang-pipeline",
    route: "/lang",
    question: {
      en: "What does a lexer (tokenizer) do?",
      ja: "レクサー（トークナイザー）は何をしますか？",
    },
    answer: {
      en: "A lexer reads a stream of characters and groups them into tokens — the smallest meaningful units of the language (keywords, identifiers, literals, operators, punctuation), discarding whitespace and comments.",
      ja: "レクサーは文字ストリームを読み込み、言語の最小の意味単位であるトークン（キーワード・識別子・リテラル・演算子・区切り文字）にグループ化し、空白とコメントを破棄します。",
    },
  },
  {
    id: "lang-ast-1",
    module: "lang-pipeline",
    route: "/lang",
    question: {
      en: "What is an Abstract Syntax Tree (AST)?",
      ja: "抽象構文木（AST）とは何ですか？",
    },
    answer: {
      en: "An AST is a tree representation of the syntactic structure of source code, with each node representing a construct (e.g., expression, statement, function call). It discards syntactic noise like parentheses while preserving meaning.",
      ja: "ASTはソースコードの構文構造を木で表現したもので、各ノードが構文要素（式・文・関数呼び出しなど）を表します。括弧などの構文的なノイズを除去しながら意味を保持します。",
    },
  },
  {
    id: "lang-recursive-descent-1",
    module: "lang-pipeline",
    route: "/lang",
    question: {
      en: "What is recursive-descent parsing?",
      ja: "再帰下降構文解析とは何ですか？",
    },
    answer: {
      en: "A top-down parsing technique where each grammar rule is implemented as a mutually-recursive function. The parser calls itself recursively to match sub-expressions, naturally building a call stack that mirrors the parse tree.",
      ja: "各文法規則を相互再帰関数として実装するトップダウン解析技法です。パーサーは部分式にマッチするために自己再帰的に呼び出し、パース木を反映した呼び出しスタックを自然に構築します。",
    },
  },
  {
    id: "lang-type-check-1",
    module: "lang-pipeline",
    route: "/lang",
    question: {
      en: "What is type checking, and at what phase of compilation does it occur?",
      ja: "型チェックとは何ですか？コンパイルのどのフェーズで行われますか？",
    },
    answer: {
      en: "Type checking verifies that operations are applied to compatible types (e.g., you cannot add a string and an integer in a statically typed language). It typically occurs after parsing and AST construction, as a semantic analysis phase.",
      ja: "型チェックは演算が互換性のある型に適用されているかを検証します（例: 静的型付き言語では文字列と整数を足せない）。通常、構文解析とAST構築の後に意味解析フェーズとして実行されます。",
    },
  },
  {
    id: "lang-eval-1",
    module: "lang-pipeline",
    route: "/lang",
    question: {
      en: "What does an interpreter do differently from a compiler?",
      ja: "インタープリタはコンパイラと何が違いますか？",
    },
    answer: {
      en: "A compiler translates source code to a target language (often machine code) before execution. An interpreter reads and directly executes the source (or an intermediate representation like an AST) at runtime, without producing a standalone binary.",
      ja: "コンパイラは実行前にソースコードをターゲット言語（通常はマシンコード）に変換します。インタープリタはランタイムにソース（またはASTなどの中間表現）を直接読んで実行し、スタンドアロンのバイナリを生成しません。",
    },
  },
  {
    id: "lang-grammar-1",
    module: "lang-pipeline",
    route: "/lang",
    question: {
      en: "What is a context-free grammar (CFG)?",
      ja: "文脈自由文法（CFG）とは何ですか？",
    },
    answer: {
      en: "A formal grammar in which every production rule has a single non-terminal on the left-hand side. CFGs describe the syntax of most programming languages and can be parsed efficiently by LL or LR parsers.",
      ja: "左辺に単一の非終端記号を持つ生成規則からなる形式文法です。CFGはほとんどのプログラミング言語の構文を記述でき、LLまたはLRパーサーで効率的に解析できます。",
    },
  },
  {
    id: "lang-scope-1",
    module: "lang-pipeline",
    route: "/lang",
    question: {
      en: "What is the difference between lexical (static) scope and dynamic scope?",
      ja: "レキシカルスコープ（静的スコープ）と動的スコープの違いは何ですか？",
    },
    answer: {
      en: "In lexical scope, a variable's binding is determined by its position in the source text at compile time. In dynamic scope, a variable's binding is determined at runtime by the call stack at the point of use.",
      ja: "レキシカルスコープでは、変数のバインディングはコンパイル時にソーステキスト上の位置によって決まります。動的スコープでは、変数のバインディングは使用時点の実行時コールスタックによって決まります。",
    },
  },
  {
    id: "lang-closure-1",
    module: "lang-pipeline",
    route: "/lang",
    question: {
      en: "What is a closure?",
      ja: "クロージャとは何ですか？",
    },
    answer: {
      en: "A closure is a function combined with its captured lexical environment — the bindings of free variables at the time of the function's creation. It allows a function to access those variables even after the enclosing scope has returned.",
      ja: "クロージャは関数とそのキャプチャされたレキシカル環境（関数作成時の自由変数のバインディング）を組み合わせたものです。囲むスコープが返った後でも、関数がそれらの変数にアクセスできます。",
    },
  },
  {
    id: "lang-token-types-1",
    module: "lang-pipeline",
    route: "/lang",
    question: {
      en: "Name three common token types produced by a lexer.",
      ja: "レクサーが生成する一般的なトークンの種類を3つ挙げてください。",
    },
    answer: {
      en: "Number literals, string literals, and identifiers — each carrying its lexeme value. Other examples include keywords (if, while), operators (+, ==), and delimiters (parentheses, semicolons).",
      ja: "数値リテラル・文字列リテラル・識別子（それぞれ字句値を持つ）。他にもキーワード（if、whileなど）・演算子（+、==など）・区切り文字（括弧、セミコロンなど）があります。",
    },
  },
  {
    id: "lang-precedence-1",
    module: "lang-pipeline",
    route: "/lang",
    question: {
      en: "How does operator precedence affect parsing?",
      ja: "演算子の優先順位は構文解析にどのように影響しますか？",
    },
    answer: {
      en: "Operator precedence determines how tightly operators bind their operands, dictating the shape of the AST. Higher-precedence operators create subtrees closer to the leaves. Parsers encode precedence by having separate grammar rules for each level.",
      ja: "演算子の優先順位は演算子がオペランドをどれだけ強く結びつけるかを決定し、ASTの形状を規定します。優先度の高い演算子はリーフに近いサブツリーを形成します。パーサーは各優先度レベルに別々の文法規則を設けることで優先順位をエンコードします。",
    },
  },

  // ── Networking (10 cards) ─────────────────────────────────────────────────
  {
    id: "net-handshake-1",
    module: "net-tcp",
    route: "/net",
    question: {
      en: "What are the three segments of the TCP handshake?",
      ja: "TCPハンドシェイクの3つのセグメントとは何ですか？",
    },
    answer: {
      en: "SYN (client → server, proposes ISN), SYN-ACK (server → client, acknowledges ISN and proposes server ISN), ACK (client → server, acknowledges server ISN). The connection is established after this exchange.",
      ja: "SYN（クライアント→サーバー、ISNを提案）、SYN-ACK（サーバー→クライアント、ISNを確認してサーバーのISNを提案）、ACK（クライアント→サーバー、サーバーのISNを確認）。この交換後に接続が確立されます。",
    },
  },
  {
    id: "net-encapsulation-1",
    module: "net-tcp",
    route: "/net",
    question: {
      en: "What is protocol encapsulation in networking?",
      ja: "ネットワークにおけるプロトコルカプセル化とは何ですか？",
    },
    answer: {
      en: "Each layer wraps the payload from the layer above with its own header (and sometimes trailer). For example, TCP data becomes an IP packet by adding an IP header, which becomes an Ethernet frame by adding a MAC header.",
      ja: "各層が上位層のペイロードに自身のヘッダー（場合によってはトレーラー）を付加します。例えば、TCPデータはIPヘッダーを追加してIPパケットになり、さらにMACヘッダーを追加してEthernetフレームになります。",
    },
  },
  {
    id: "net-retransmit-1",
    module: "net-tcp",
    route: "/net",
    question: {
      en: "How does TCP detect and recover from packet loss?",
      ja: "TCPはパケットロスをどのように検出して回復しますか？",
    },
    answer: {
      en: "The receiver sends cumulative ACKs for received data. The sender maintains a retransmission timer; if an ACK is not received before the timer expires, the unacknowledged segment is resent. Three duplicate ACKs also trigger fast retransmit.",
      ja: "受信側は受信データに対して累積ACKを送信します。送信側は再送タイマーを維持し、タイマーが切れる前にACKが届かなければ未確認のセグメントを再送します。また、3つの重複ACKも高速再送をトリガーします。",
    },
  },
  {
    id: "net-dns-1",
    module: "net-dns",
    route: "/net",
    question: {
      en: "Describe the recursive DNS resolution process for a name not in the local cache.",
      ja: "ローカルキャッシュにないドメイン名の再帰的DNS解決プロセスを説明してください。",
    },
    answer: {
      en: "The stub resolver queries the recursive resolver. The recursive resolver queries a root name server for the TLD's NS records, then the TLD server for the domain's authoritative NS, then the authoritative server for the A record, caches the result, and returns it to the client.",
      ja: "スタブリゾルバーが再帰リゾルバーに問い合わせます。再帰リゾルバーはルートネームサーバーにTLDのNSレコードを照会し、次にTLDサーバーにドメインの権威NSを照会し、次に権威サーバーにAレコードを照会し、結果をキャッシュしてクライアントに返します。",
    },
  },
  {
    id: "net-ttl-1",
    module: "net-dns",
    route: "/net",
    question: {
      en: "What is the TTL in a DNS record, and what happens when it expires?",
      ja: "DNSレコードのTTLとは何ですか？期限が切れるとどうなりますか？",
    },
    answer: {
      en: "TTL (Time To Live) is the number of seconds a resolver may cache the answer. When it expires, the resolver discards the cached entry and must perform a new lookup, ensuring clients eventually get updated records.",
      ja: "TTL（Time To Live）はリゾルバーが回答をキャッシュしておける秒数です。期限が切れると、リゾルバーはキャッシュエントリーを破棄して新たな名前解決を行い、クライアントが最終的に更新されたレコードを取得できるようにします。",
    },
  },
  {
    id: "net-ip-1",
    module: "net-tcp",
    route: "/net",
    question: {
      en: "What is the key difference between TCP and UDP?",
      ja: "TCPとUDPの主な違いは何ですか？",
    },
    answer: {
      en: "TCP provides reliable, ordered, connection-oriented delivery with flow and congestion control. UDP is connectionless and provides no delivery guarantees, offering lower latency and overhead for applications that can tolerate loss.",
      ja: "TCPはフロー制御と輻輳制御を備えた信頼性のある、順序付きのコネクション指向配信を提供します。UDPはコネクションレスで配信保証がなく、ロスを許容できるアプリケーションに向けた低レイテンシ・低オーバーヘッドを提供します。",
    },
  },
  {
    id: "net-port-1",
    module: "net-tcp",
    route: "/net",
    question: {
      en: "What is the purpose of port numbers in TCP/UDP?",
      ja: "TCP/UDPにおけるポート番号の目的は何ですか？",
    },
    answer: {
      en: "Port numbers (0–65535) identify a specific process or service on a host. Combined with an IP address they form a socket address, allowing the OS to multiplex many simultaneous connections on a single IP address.",
      ja: "ポート番号（0〜65535）はホスト上の特定のプロセスまたはサービスを識別します。IPアドレスと組み合わせてソケットアドレスを形成し、OSが単一のIPアドレス上で多数の同時接続を多重化できます。",
    },
  },
  {
    id: "net-congestion-1",
    module: "net-tcp",
    route: "/net",
    question: {
      en: "What is TCP slow start?",
      ja: "TCPスロースタートとは何ですか？",
    },
    answer: {
      en: "Slow start is the TCP congestion control phase where the sender begins with a small congestion window and doubles it each RTT until a threshold is reached or a loss event occurs, probing available bandwidth without overwhelming the network.",
      ja: "スロースタートはTCPの輻輳制御フェーズで、送信側は小さな輻輳ウィンドウから始め、閾値に達するかロスイベントが発生するまでRTTごとにウィンドウを倍増させ、ネットワークを圧迫せずに利用可能な帯域幅を探索します。",
    },
  },
  {
    id: "net-osi-1",
    module: "net-tcp",
    route: "/net",
    question: {
      en: "Name the seven layers of the OSI model from bottom to top.",
      ja: "OSIモデルの7層を下から上の順に挙げてください。",
    },
    answer: {
      en: "Physical, Data Link, Network, Transport, Session, Presentation, Application. In practice, TCP/IP collapses these into four layers: Link, Internet, Transport, Application.",
      ja: "物理層・データリンク層・ネットワーク層・トランスポート層・セッション層・プレゼンテーション層・アプリケーション層。実際にはTCP/IPはこれを4層（リンク・インターネット・トランスポート・アプリケーション）に統合しています。",
    },
  },
  {
    id: "net-dns-types-1",
    module: "net-dns",
    route: "/net",
    question: {
      en: "What is the difference between an A record and a CNAME record in DNS?",
      ja: "DNSのAレコードとCNAMEレコードの違いは何ですか？",
    },
    answer: {
      en: "An A record maps a hostname directly to an IPv4 address. A CNAME (Canonical Name) record maps a hostname to another hostname (an alias), which must ultimately resolve to an A or AAAA record.",
      ja: "Aレコードはホスト名をIPv4アドレスに直接マップします。CNAME（正規名）レコードはホスト名を別のホスト名（エイリアス）にマップし、そのホスト名が最終的にAまたはAAAAレコードに解決される必要があります。",
    },
  },

  // ── Algorithms (10 cards) ─────────────────────────────────────────────────
  {
    id: "algo-bigo-1",
    module: "algo-sorting",
    route: "/algorithms",
    question: {
      en: "What does O(n log n) mean for a sorting algorithm?",
      ja: "ソートアルゴリズムにおけるO(n log n)とはどういう意味ですか？",
    },
    answer: {
      en: "The runtime grows proportionally to n multiplied by the logarithm of n. This is the lower bound for comparison-based sorting: you need at least Ω(n log n) comparisons to sort n elements in the worst case.",
      ja: "実行時間はnにnの対数を乗じた値に比例して増加します。これは比較ベースのソートの下限であり、最悪ケースでn要素をソートするには少なくともΩ(n log n)回の比較が必要です。",
    },
  },
  {
    id: "algo-quicksort-1",
    module: "algo-sorting",
    route: "/algorithms",
    question: {
      en: "What is the worst-case time complexity of quicksort, and when does it occur?",
      ja: "クイックソートの最悪時間計算量はいくつですか？どのような場合に発生しますか？",
    },
    answer: {
      en: "O(n²). It occurs when the pivot is always the smallest or largest element (e.g., sorted or reverse-sorted input with a naive pivot choice), producing maximally unbalanced partitions of size 0 and n-1.",
      ja: "O(n²)です。ピボットが常に最小または最大の要素（例：ナイーブなピボット選択でソート済みまたは逆順の入力）になるとき、サイズ0とn-1の最大限に不均衡なパーティションが生成されて発生します。",
    },
  },
  {
    id: "algo-mergesort-1",
    module: "algo-sorting",
    route: "/algorithms",
    question: {
      en: "Why is merge sort preferred over quicksort for stable sorting of linked lists?",
      ja: "連結リストの安定ソートにクイックソートよりマージソートが好まれるのはなぜですか？",
    },
    answer: {
      en: "Merge sort is naturally stable and works well on linked lists because merging two sorted lists requires only pointer manipulations (no random access). Quicksort benefits from cache-friendly random access, which linked lists do not provide.",
      ja: "マージソートは自然に安定しており、2つのソート済みリストのマージにポインタ操作だけが必要でランダムアクセス不要なため、連結リストで効率的です。クイックソートはキャッシュに優しいランダムアクセスの恩恵を受けますが、連結リストはそれを提供しません。",
    },
  },
  {
    id: "algo-heap-1",
    module: "algo-sorting",
    route: "/algorithms",
    question: {
      en: "What is the heap property, and how does it enable O(log n) insertion?",
      ja: "ヒープ性質とは何ですか？なぜO(log n)の挿入が可能になりますか？",
    },
    answer: {
      en: "In a max-heap every node is >= its children. Inserting at the last position and bubbling up (sift-up) restores the property in at most O(log n) swaps, bounded by the height of a complete binary tree.",
      ja: "最大ヒープでは各ノードがその子以上です。最後の位置に挿入してバブルアップ（sift-up）すると、完全二分木の高さで上限が決まるため最大O(log n)回の交換でヒープ性質が回復します。",
    },
  },
  {
    id: "algo-insertion-1",
    module: "algo-sorting",
    route: "/algorithms",
    question: {
      en: "When is insertion sort faster than O(n log n) algorithms in practice?",
      ja: "挿入ソートが実際にO(n log n)アルゴリズムより速くなるのはどのような場合ですか？",
    },
    answer: {
      en: "For small inputs (n ≲ 20–30) and nearly-sorted arrays, insertion sort outperforms because its inner loop exits early, its constant factors are tiny, and it is cache-friendly. Many library sorts switch to insertion sort for small subproblems.",
      ja: "小さい入力（n≲20〜30）やほぼソート済みの配列では、挿入ソートが優れています。内部ループが早期終了でき、定数係数が小さく、キャッシュに優しいためです。多くのライブラリのソートは小さいサブ問題には挿入ソートに切り替えます。",
    },
  },
  {
    id: "algo-stability-1",
    module: "algo-sorting",
    route: "/algorithms",
    question: {
      en: "What does it mean for a sort to be stable?",
      ja: "ソートが安定（stable）であるとはどういう意味ですか？",
    },
    answer: {
      en: "A stable sort preserves the original relative order of records that compare as equal. This matters when sorting by a secondary key after a primary sort — stable sorts keep the primary order intact.",
      ja: "安定なソートは、比較結果が等しいレコードの元の相対順序を保持します。これは、主ソートの後に副キーでソートする場合に重要で、安定なソートは主ソートの順序をそのまま保ちます。",
    },
  },
  {
    id: "algo-bubblesort-1",
    module: "algo-sorting",
    route: "/algorithms",
    question: {
      en: "What is the best-case time complexity of bubble sort, and what input achieves it?",
      ja: "バブルソートのベストケース時間計算量はいくつですか？どの入力で達成されますか？",
    },
    answer: {
      en: "O(n) with an already-sorted array. An optimised bubble sort with an early-exit flag can detect no swaps occurred in a pass, terminating after a single O(n) pass.",
      ja: "O(n)で、すでにソートされた配列の場合です。早期終了フラグを持つ最適化されたバブルソートは、1回のパスで交換が発生しなかったことを検出し、O(n)の1パスで終了できます。",
    },
  },
  {
    id: "algo-counting-1",
    module: "algo-sorting",
    route: "/algorithms",
    question: {
      en: "Why can counting sort beat the O(n log n) lower bound?",
      ja: "カウントソートがO(n log n)の下限を下回れるのはなぜですか？",
    },
    answer: {
      en: "Counting sort is not a comparison-based algorithm. It uses the values as indices into a count array, running in O(n + k) where k is the range of values. The Ω(n log n) lower bound applies only to comparison sorts.",
      ja: "カウントソートは比較ベースのアルゴリズムではありません。値をカウント配列のインデックスとして使用し、O(n + k)（kは値の範囲）で動作します。Ω(n log n)の下限は比較ソートにのみ適用されます。",
    },
  },
  {
    id: "algo-select-1",
    module: "algo-sorting",
    route: "/algorithms",
    question: {
      en: "How does selection sort differ from insertion sort?",
      ja: "選択ソートは挿入ソートとどう違いますか？",
    },
    answer: {
      en: "Selection sort always scans the remaining unsorted portion to find the minimum, then swaps it into place — always O(n²) comparisons. Insertion sort takes the next element and inserts it into the correct position, performing fewer operations on nearly-sorted data.",
      ja: "選択ソートは常に未ソート部分をスキャンして最小値を見つけ所定の位置に交換します（常にO(n²)の比較）。挿入ソートは次の要素を取り出して正しい位置に挿入し、ほぼソート済みのデータでは操作が少なくなります。",
    },
  },
  {
    id: "algo-inplace-1",
    module: "algo-sorting",
    route: "/algorithms",
    question: {
      en: "What does it mean for a sorting algorithm to be in-place?",
      ja: "ソートアルゴリズムがin-place（インプレース）であるとはどういう意味ですか？",
    },
    answer: {
      en: "An in-place sort requires only O(1) extra memory beyond the input array (ignoring the call stack). It rearranges elements within the original array rather than copying them to auxiliary storage. Quicksort and heapsort are in-place; merge sort is typically not.",
      ja: "インプレースソートは入力配列以外にO(1)の追加メモリしか必要としません（コールスタックを除く）。要素を補助ストレージにコピーするのではなく、元の配列内で並べ替えます。クイックソートとヒープソートはインプレースですが、マージソートは通常そうではありません。",
    },
  },
];
