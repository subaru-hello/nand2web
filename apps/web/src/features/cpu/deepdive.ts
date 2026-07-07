import type { DeepDiveContent } from "../deepdive/DeepDive";

export const cpuDeepDive: DeepDiveContent = {
  sections: [
    {
      title: {
        en: "Historical context — the stored-program idea",
        ja: "時代背景 — ストアドプログラムという発明",
      },
      paragraphs: [
        {
          en: "ENIAC (1945) was programmed with cables and switches: changing the program meant days of physical rewiring. The idea that fixed everything sounds obvious only in hindsight — **store the instructions in the same memory as the data**. Sketched in John von Neumann's 1945 *First Draft of a Report on the EDVAC* (building on work with Eckert and Mauchly, and on Turing's theoretical machine of 1936), the stored-program concept turned programs from wiring into *data*: loadable, copyable, even writable by other programs. Manchester's \"Baby\" ran the first stored program in June 1948; Cambridge's EDSAC followed in 1949 as the first practical service. Every computer since — including the 16-word machine on this page — is their descendant.",
          ja: "ENIAC（1945年）のプログラミングはケーブルとスイッチで行われ、プログラムを変えるには数日がかりの物理的な配線替えが必要でした。すべてを解決したアイデアは、今から見れば当たり前に聞こえます — **命令をデータと同じメモリに格納する**。フォン・ノイマンが1945年の『EDVAC に関する報告書の第一草稿』で描いた（エッカートやモークリーとの協働、そして1936年のチューリングの理論上の機械を土台にした）このストアドプログラム方式は、プログラムを「配線」から「データ」に変えました。読み込める、複製できる、さらには他のプログラムが書き換えることさえできる。1948年6月、マンチェスターの「Baby」が世界で初めて記憶されたプログラムを実行し、1949年にはケンブリッジの EDSAC が初の実用機として続きます。以後のすべてのコンピュータ — このページの16ワードのマシンを含めて — は彼らの子孫です。",
        },
        {
          en: "4-bit CPUs are not a toy simplification — they are where microprocessors *started*. The **Intel 4004** (1971), the first commercial single-chip CPU, was a 4-bit machine: about 2,300 transistors at 740 kHz, designed for a calculator by Japan's Busicom, with **Masatoshi Shima** writing the logic design alongside Intel's Federico Faggin and Ted Hoff. And this page's machine belongs to a beloved Japanese lineage of its own: it is a close cousin of the **TD4**, the CPU readers build from 74-series chips in Iku Watanami's classic book *CPU no Tsukurikata* (2003).",
          ja: "4ビット CPU はおもちゃ向けの簡略化ではありません — マイクロプロセッサは4ビットから**始まった**のです。世界初の商用ワンチップ CPU である **Intel 4004**（1971年）は4ビットマシンでした。約2,300トランジスタ、クロック 740kHz。日本の電卓メーカー、ビジコン社の電卓のために設計され、インテルのフェデリコ・ファジン、テッド・ホフとともに**嶋正利**が論理設計を担いました。そしてこのページのマシン自体も、日本で愛される系譜に連なります — 渡波郁『CPUの創りかた』（2003年）で読者が 74シリーズのチップから組み上げる **TD4** の、ごく近い親戚です。",
        },
      ],
    },
    {
      title: {
        en: "What's actually happening — the three-beat loop",
        ja: "何が起きているのか — 三拍子のループ",
      },
      paragraphs: [
        {
          en: "A CPU is a very fast bureaucrat running one loop forever: **fetch** — the program counter (PC) names an address, the ROM hands back the byte living there, and it lands in the instruction register (IR); **decode** — the top 4 bits select which circuit paths open this cycle; **execute** — registers, ALU, RAM, or PC change, and (usually) PC advances by one. In this simulator each beat is a step you can scrub. In real silicon all three are just combinational logic settling between two clock edges — the flip-flop lesson, at scale.",
          ja: "CPU とは、1つのループを永遠に回し続ける超高速の事務員です。**フェッチ** — プログラムカウンタ（PC）が番地を指名し、ROM がそこに住むバイトを差し出し、命令レジスタ（IR）に収まる。**デコード** — 上位4ビットが「このサイクルでどの回路の経路を開くか」を選ぶ。**実行** — レジスタ・ALU・RAM・PC のどれかが変化し、（普通は）PC が1つ進む。このシミュレータでは各拍がスクラブ可能なステップになっていますが、実物のシリコンでは、三拍すべてが2つのクロックエッジの間に落ち着く組み合わせ論理にすぎません — フリップフロップのレッスンの、スケールアップ版です。",
        },
        {
          en: "The instruction encoding is a **contract**, not physics. We *decided* that byte `0x34` shall mean \"add B into A\" — the decoder is just gates enforcing that decision. This boundary between hardware and software has a name: the **instruction set architecture (ISA)**. It's why a program compiled decades ago still runs on today's x86 chips, whose internals share nothing with their ancestors: the contract held, the implementation underneath was free to change completely.",
          ja: "命令のエンコーディングは物理法則ではなく**契約**です。バイト `0x34` が「B を A に加算せよ」を意味するのは、私たちが**そう決めた**からで、デコーダはその決定を執行するゲートの塊にすぎません。このハードウェアとソフトウェアの境界線には名前があります — **命令セットアーキテクチャ（ISA）**。数十年前にコンパイルされたプログラムが、内部構造は祖先と何一つ共通しない現代の x86 チップで今も動くのは、契約が守られ続けたからです。その下の実装は、完全に作り替える自由があったのです。",
        },
        {
          en: "Watch what `JZ` and `JC` do: they consult the flags and *conditionally* replace PC. That single capability — letting the result of a computation decide what executes next — is what separates a calculator from a computer. Loops, `if` statements, `while` conditions: at the bottom, they are all a flag wire deciding whether PC gets overwritten.",
          ja: "`JZ` と `JC` の挙動に注目してください。フラグを参照して、**条件付きで** PC を書き換えています。計算の結果によって「次に何を実行するか」を決められる — このたった一つの能力が、電卓とコンピュータを分かつものです。ループも、`if` 文も、`while` の条件も、いちばん底では「フラグの配線1本が PC を上書きするか否かを決めている」だけなのです。",
        },
        {
          en: "Try the Fibonacci sample and watch RAM: with only two registers, the program juggles values through memory addresses 0–2. That dance — too few registers, spill to memory — is the same one your compiler performs on real hardware every time it compiles a function.",
          ja: "Fibonacci のサンプルを動かして RAM を見てください。レジスタが2本しかないので、プログラムは値を番地 0〜2 に逃しながらやりくりしています。この「レジスタが足りないからメモリに退避する」ダンスは、実物のハードウェアの上であなたのコンパイラが関数をコンパイルするたびに踊っているものと、まったく同じです。",
        },
      ],
    },
    {
      title: { en: "Up the stack", ja: "次の層へ" },
      paragraphs: [
        {
          en: "From here the curriculum climbs the same way real history did: make the CPU *fast* (pipelining, caches — Layer 3), share it among many programs (operating systems — Layer 4), and stop writing its instructions by hand (compilers — Layer 5). Each layer exists because someone hit a limit of this one.",
          ja: "ここから先のカリキュラムは、実際の歴史と同じ道を登ります。CPU を**速く**する（パイプラインとキャッシュ — Layer 3）、多数のプログラムで**共有**する（オペレーティングシステム — Layer 4）、そして命令を手書きするのを**やめる**（コンパイラ — Layer 5）。どの層も、誰かがこの層の限界にぶつかったからこそ生まれたのです。",
        },
      ],
    },
  ],
};
