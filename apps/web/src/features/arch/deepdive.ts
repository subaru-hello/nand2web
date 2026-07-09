import type { DeepDiveContent } from "../deepdive/DeepDive";

export const archDeepDive: DeepDiveContent = {
  sections: [
    {
      title: {
        en: "Historical context — the pipeline idea",
        ja: "時代背景 — パイプラインという発想",
      },
      paragraphs: [
        {
          en: "By the late 1950s transistors had made computers fast enough that a new bottleneck appeared: the processor spent most of its time *idle*, waiting for one instruction to finish before fetching the next. The insight that broke this bottleneck came from manufacturing — specifically from the automobile assembly line. IBM's **Stretch** (7030, 1961) was the first commercial machine to implement instruction pipelining: while one instruction was being executed, the next was already being decoded, and the one after that was being fetched. IBM's John Cocke and colleagues formalized the technique that would define every high-performance processor since.",
          ja: "1950年代後半になると、トランジスタのおかげでコンピュータは十分に速くなった代わりに、新たなボトルネックが現れました。プロセッサは1つの命令が終わるまで次の命令を取り込まず、ほとんどの時間を**アイドル**状態で過ごしていたのです。この壁を破るヒントは製造業から来ました。正確には自動車の組み立てラインから。IBMの **Stretch**（7030、1961年）は命令パイプラインを実装した最初の商用マシンです。1つの命令を実行している間に、次の命令をデコードし、その次の命令をフェッチする。IBMのジョン・コッケらがこの技術を理論化し、以後のすべての高性能プロセッサを定義することになりました。",
        },
        {
          en: "The **MIPS R2000** (1985), the processor behind Patterson & Hennessy's textbook, canonized the five-stage pipeline you see here: **IF** (instruction fetch), **ID** (instruction decode and register read), **EX** (ALU execute), **MEM** (data memory access), **WB** (write back to register file). John Hennessy's MIPS Architecture and David Patterson's Berkeley RISC project both showed that a *simple, regular* ISA let the pipeline flow smoothly — the philosophy that shapes every ARM, RISC-V, and MIPS chip to this day.",
          ja: "パターソンとヘネシーの教科書の主人公である **MIPS R2000**（1985年）は、ここで見る5段パイプラインを標準化しました。**IF**（命令フェッチ）、**ID**（命令デコード＋レジスタ読み出し）、**EX**（ALU実行）、**MEM**（データメモリアクセス）、**WB**（レジスタファイルへの書き戻し）。ジョン・ヘネシーのMIPSアーキテクチャとデビッド・パターソンのバークレーRISCプロジェクトはともに、*シンプルで規則的な* ISAがパイプラインを滑らかに流すことを示しました。今日のARM・RISC-V・MIPSチップすべてを形作る哲学です。",
        },
      ],
    },
    {
      title: {
        en: "How hazards work — and how to fix them",
        ja: "ハザードとは何か — そしてどう解消するか",
      },
      paragraphs: [
        {
          en: "A **data hazard** (RAW — Read After Write) occurs when instruction B needs a value that instruction A is still computing. In the naive pipeline, B would read the register file *before* A has written its result back — getting a stale value. The simplest fix is **stalling**: freeze IF and ID for 2 cycles, letting A advance to WB before B reads. The cost is wasted cycles; the gain is correctness.",
          ja: "**データハザード**（RAW — 書いた後に読む）は、命令Bが命令Aがまだ計算中の値を必要とするときに起きます。素朴なパイプラインでは、Bはレジスタファイルをよだれを垂らす前に読み出してしまい、古い値を受け取ります。最もシンプルな修正は**ストール**です。IFとIDを2サイクル凍結し、AがWBに進んでからBが読めるようにします。コストは無駄なサイクル、ゲインは正確さです。",
        },
        {
          en: "**Forwarding** (also called bypassing) is the hardware insight that avoids most stalls: why wait for a result to travel all the way to the register file and back, when you can wire it *directly* from the EX/MEM latch (or MEM/WB latch) into the EX stage's ALU inputs? Two multiplexers and a few comparison wires are all it takes. The only hazard that forwarding cannot fully resolve is **load-use**: after a `lw` instruction, the data comes from memory at the *end* of the MEM stage — too late to forward into the very next instruction's EX. One stall cycle is unavoidable.",
          ja: "**フォワーディング**（バイパシングとも呼ぶ）は、ほとんどのストールを回避するハードウェアの洞察です。結果がレジスタファイルまで戻ってくるのを待つ必要はありません。EX/MEMラッチ（またはMEM/WBラッチ）から直接EXステージのALU入力へ*配線*できるからです。マルチプレクサ2個と比較回路少々で完成。フォワーディングが完全には解決できない唯一のハザードが**ロードユースハザード**です。`lw`命令の後、データはMEMステージの*終わり*にメモリから届きます。直後の命令のEXには間に合わない。1サイクルのストールは避けられません。",
        },
        {
          en: "**Control hazards** arise with branches. Our pipeline uses **predict-not-taken**: keep fetching the next sequential instruction while the branch is evaluated. If the branch is actually taken (EX stage resolves it), the two instructions already in IF and ID are wrong — they get **flushed** (turned into bubbles) and the correct target is fetched. The 2-cycle penalty is the cost of misprediction. Modern processors use sophisticated **branch predictors** that are right 95–99% of the time, making the penalty rare.",
          ja: "**制御ハザード**は分岐命令で発生します。このパイプラインでは**分岐なしを予測**（predict-not-taken）戦略を使います。分岐がEXステージで解決されるまで、次の順番通りの命令をフェッチし続けます。分岐が実際にタグン（taken）だったとき、IF・IDにいる2つの命令は間違い — **フラッシュ**（バブルに変換）されて正しいターゲットがフェッチされます。2サイクルのペナルティが誤予測のコスト。現代のプロセッサは95〜99%の確率で正解する高度な**分岐予測器**を持ち、このペナルティを稀にします。",
        },
      ],
    },
    {
      title: {
        en: "Cache memory — exploiting locality",
        ja: "キャッシュメモリ — 局所性を活かす",
      },
      paragraphs: [
        {
          en: "In 1965 Maurice Wilkes — inventor of microprogramming — proposed that a small fast memory sitting between the CPU and main memory could act as an automatic buffer. His **cache** paper (1965) introduced the idea that the processor would *transparently* look for data first in the fast buffer, and go to slow DRAM only on a miss. The insight was rooted in the **principle of locality**: programs tend to access the same data repeatedly (temporal locality) and data near recently accessed addresses (spatial locality). A cache exploits both.",
          ja: "1965年、マイクロプログラミングの発明者であるモーリス・ウィルクスは、CPUとメインメモリの間に置く小さな高速メモリが自動バッファとして機能することを提案しました。彼の**キャッシュ**論文（1965年）は、プロセッサがまず高速バッファでデータを*透過的に*探し、ミスした時だけ低速DRAMへ行くアイデアを導入しました。洞察の根拠は**局所性の原理**です。プログラムは同じデータに繰り返しアクセスし（時間的局所性）、最近アクセスしたアドレスの近くのデータにもアクセスする傾向があります（空間的局所性）。キャッシュは両方を活用します。",
        },
        {
          en: "A **direct-mapped** cache maps each memory block to exactly one cache line — simple hardware, but prone to **conflict misses**: two frequently-used blocks that map to the same line evict each other repeatedly. **Set-associative** caches group lines into *sets* of 2 or 4 **ways**, giving each block multiple places to live. The **LRU** (Least Recently Used) policy evicts the way that was accessed longest ago. As associativity rises, conflict misses fall — at the cost of more hardware comparators. A **fully-associative** cache (every block can go anywhere) eliminates conflict misses entirely but is too expensive for large caches.",
          ja: "**ダイレクトマップ**キャッシュは各メモリブロックをちょうど1つのキャッシュラインに対応付けます。ハードウェアはシンプルですが**競合ミス**が起きやすい。よく使う2つのブロックが同じラインに対応する場合、互いに追い出し合います。**セット連想**キャッシュはラインを2ウェイや4ウェイの*セット*にグループ化し、各ブロックに複数の置き場所を与えます。**LRU**（最近最も使われていない）ポリシーは最も長くアクセスされていないウェイを追い出します。連想度が上がると競合ミスは減り、コストとしてハードウェアコンパレータが増えます。**フル連想**キャッシュ（どのブロックもどこにでも入れる）は競合ミスを完全に排除しますが、大容量では高価すぎます。",
        },
        {
          en: "The simulator lets you vary associativity (1/2/4-way) and immediately see the hit rate change on the same trace. Notice how a **loop** trace — a small working set accessed repeatedly — achieves near-100% hit rate once the cache is warm, regardless of associativity. A **strided** trace can be pathological: if the stride equals the cache size, every access maps to the same set, and a direct-mapped cache degenerates to effectively 1 line. Set-associative caches handle it much better. This is why modern L1 caches are typically 4-way or 8-way set-associative.",
          ja: "このシミュレータでは連想度（1/2/4ウェイ）を変えて、同じトレースでヒット率がどう変わるかをすぐ確認できます。**ループ**トレース — 小さなワーキングセットを繰り返しアクセスする — は、キャッシュがウォームアップされると連想度に関係なくほぼ100%のヒット率を達成します。**ストライド**トレースは病的になりえます。ストライドがキャッシュサイズと等しい場合、すべてのアクセスが同じセットにマップされ、ダイレクトマップキャッシュは実質1ラインに退化します。セット連想キャッシュはこれをずっとうまく扱えます。現代のL1キャッシュが一般に4ウェイや8ウェイのセット連想である理由はここにあります。",
        },
      ],
    },
    {
      title: { en: "Up the stack", ja: "次の層へ" },
      paragraphs: [
        {
          en: "Pipelining and caching together can make a processor run 10–100× faster than a simple single-cycle design at the same clock frequency. But they are only the beginning of the microarchitecture story: **out-of-order execution** (Tomasulo's algorithm, 1967) lets the hardware dynamically reorder instructions to avoid stalls; **superscalar** designs issue multiple instructions per cycle; **speculative execution** runs code past branches before knowing whether they will be taken. From here the curriculum turns to *sharing* the processor among many programs — the province of operating systems.",
          ja: "パイプラインとキャッシュを組み合わせることで、プロセッサは同じクロック周波数の単純なシングルサイクル設計より10〜100倍速く動けます。でもこれはマイクロアーキテクチャの話の始まりに過ぎません。**アウトオブオーダー実行**（トマスロのアルゴリズム、1967年）はハードウェアが動的に命令を並べ替えてストールを避けます。**スーパースカラー**設計は1サイクルに複数の命令を発行します。**投機的実行**は分岐の結果がわかる前にその先のコードを実行します。ここからカリキュラムはプロセッサを多くのプログラムで*共有*することへ — オペレーティングシステムの領域へ — 進みます。",
        },
      ],
    },
  ],
};
