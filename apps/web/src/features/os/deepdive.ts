import type { DeepDiveContent } from "../deepdive/DeepDive";

export const osDeepDive: DeepDiveContent = {
  sections: [
    {
      title: {
        en: "Historical context — sharing the machine",
        ja: "時代背景 — マシンを共有するという発明",
      },
      paragraphs: [
        {
          en: "Early computers ran one program at a time, and that program owned the entire machine. The turning point was **batch processing** in the 1950s — IBM 7094 operators fed decks of punched cards, the machine ran one job, printed output, loaded the next. Still no sharing, but at least humans were no longer the bottleneck. The next leap was **time-sharing**: MIT's **CTSS** (Compatible Time-Sharing System, 1961) let multiple users type at terminals simultaneously, each believing the machine was theirs. Corbató's team achieved this by rapidly swapping each user's state in and out — the embryo of every context switch running on your phone today.",
          ja: "初期のコンピュータは一度に1つのプログラムしか実行できず、そのプログラムがマシン全体を独占していました。転換点は1950年代の**バッチ処理**でした — IBM 7094 のオペレーターがパンチカードの束を次々と投入し、マシンは1つのジョブを実行して出力を印刷し、次のジョブを読み込みます。まだ共有ではありませんが、少なくとも人間がボトルネックではなくなりました。次の飛躍が**タイムシェアリング**です。MITの **CTSS**（Compatible Time-Sharing System、1961年）は複数のユーザーが同時にターミナルを操作できるようにし、各ユーザーはマシンを独り占めしているかのように感じることができました。Corbatóのチームは各ユーザーの状態を高速に入れ替えることでこれを実現しました — 今日あなたのスマートフォンで動いているすべてのコンテキストスイッチの原型です。",
        },
        {
          en: "Corbató received the **Turing Award in 1990** partly for CTSS and its successor **Multics** (1969) — the system that introduced hierarchical directories, access-control lists, and the idea of the OS as a secure, shared utility. Multics was too ambitious for its era, but its ideas were distilled into **Unix** (Ken Thompson and Dennis Ritchie, Bell Labs 1969–71). The lineage: Multics → Unix → Linux → Android/macOS → the CPU behind this web page.",
          ja: "Corbatóは1990年に**チューリング賞**を受賞しましたが、その理由の一つがCTSSとその後継である**Multics**（1969年）です。Multicsは階層ディレクトリ、アクセス制御リスト、OSを安全な共有ユーティリティとして捉えるアイデアを導入しました。Multicsはその時代には野心的すぎましたが、そのアイデアは**Unix**（ケン・トンプソンとデニス・リッチー、ベル研究所 1969〜71年）に凝縮されました。系譜はこうなります: Multics → Unix → Linux → Android/macOS → このWebページが動いているCPU。",
        },
      ],
    },
    {
      title: {
        en: "CPU scheduling — who runs next?",
        ja: "CPUスケジューリング — 次に誰を動かすか",
      },
      paragraphs: [
        {
          en: "A scheduler answers one question: of all the processes **ready** to run right now, which one gets the CPU? The four algorithms on this page represent the spectrum of tradeoffs:\n\n**FCFS** (First-Come, First-Served) is the simplest: a plain FIFO queue. Zero starvation, zero preemption. Downside: one long job can make every short job wait — the *convoy effect*.\n\n**SJF** (Shortest-Job-First, non-preemptive) minimises average waiting time — it is provably optimal among non-preemptive schedules. But it requires knowing burst times in advance, and long jobs can starve indefinitely.\n\n**RR** (Round-Robin) gives each process a time *quantum* then rotates. Response time is bounded, and no job starves, but short quanta create high context-switch overhead.\n\n**MLFQ** (Multi-Level Feedback Queue, Corbató 1962) is the algorithm modern OSes actually use. Processes start at the top priority queue and are **demoted** if they exhaust their quantum (they must be CPU-bound). Short interactive jobs stay near the top; long batch jobs sink to the bottom. A periodic **priority boost** prevents starvation. The Linux `CFS` and Windows scheduler are descendants.",
          ja: "スケジューラは一つの問いに答えます: 今**実行可能**なプロセスのうち、どれにCPUを与えるか？このページの4つのアルゴリズムはトレードオフの全体像を表しています。\n\n**FCFS**（先着順）は最もシンプルで、単純なFIFOキューです。飢餓もなく、プリエンプションもありません。欠点は、1つの長いジョブがすべての短いジョブを待たせること — *コンボイ効果*と呼ばれます。\n\n**SJF**（最短ジョブ優先、非プリエンプティブ）は平均待ち時間を最小化します — 非プリエンプティブなスケジュールの中で最適であることが証明されています。しかしバースト時間を事前に知る必要があり、長いジョブは無限に待たされる可能性があります。\n\n**RR**（ラウンドロビン）は各プロセスに時間*クォンタム*を与えてからローテーションします。応答時間が保証され、飢餓もありませんが、クォンタムが短いとコンテキストスイッチのオーバーヘッドが大きくなります。\n\n**MLFQ**（多段フィードバックキュー、Corbató 1962年）は現代のOSが実際に使用するアルゴリズムです。プロセスは最高優先度のキューから始まり、クォンタムを使い切ると**降格**されます（CPUバウンドであるとみなされる）。短いインタラクティブなジョブは上位に留まり、長いバッチジョブは下位に沈みます。定期的な**優先度ブースト**が飢餓を防ぎます。LinuxのCFSやWindowsのスケジューラはこの子孫です。",
        },
        {
          en: "The gap between theory and practice is instructive: SJF is optimal but requires oracular knowledge of the future. MLFQ approximates SJF's benefits **without** knowing burst times — it *infers* whether a job is short (stays interactive, stays high-priority) or long (exhausts quanta, gets demoted). This inference-based approach — observe behaviour, adjust policy — reappears throughout systems design.",
          ja: "理論と実践のギャップは示唆に富んでいます: SJFは最適ですが、未来を予知するような知識が必要です。MLFQはバースト時間を知らずにSJFの利点を**近似**します — ジョブが短い（インタラクティブのまま高優先度に留まる）か長い（クォンタムを使い切って降格される）かを*推論*するのです。この推論ベースのアプローチ — 動作を観察してポリシーを調整する — はシステム設計全体に繰り返し現れます。",
        },
      ],
    },
    {
      title: {
        en: "Virtual memory — the illusion of infinite RAM",
        ja: "仮想メモリ — 無限のRAMという幻想",
      },
      paragraphs: [
        {
          en: "Every process thinks it owns the entire address space — 0 through (2³²−1) or (2⁶⁴−1). The OS and hardware conspire to maintain this illusion via **paging**: the address space is carved into fixed-size **pages** (usually 4 KB), and physical memory is divided into same-size **frames**. A **page table** — one per process — maps virtual page numbers to physical frame numbers. The MMU hardware performs this translation on every memory access; the **TLB** (Translation Lookaside Buffer) caches recent translations so the walk costs near-zero on repeated accesses.",
          ja: "すべてのプロセスはアドレス空間全体（0から2³²−1、または2⁶⁴−1まで）を所有していると考えています。OSとハードウェアが協力してこの幻想を維持します — **ページング**によって。アドレス空間は固定サイズの**ページ**（通常4 KB）に分割され、物理メモリも同じサイズの**フレーム**に分割されます。**ページテーブル**（プロセスごとに1つ）が仮想ページ番号を物理フレーム番号にマッピングします。MMUハードウェアはすべてのメモリアクセスでこの変換を行います。**TLB**（Translation Lookaside Buffer）は最近の変換をキャッシュするため、繰り返しアクセスのコストはほぼゼロになります。",
        },
        {
          en: "When a page is accessed but not yet in RAM, the CPU raises a **page fault** — the OS catches it, reads the page from disk (or declares it uninitialized), installs it in a free frame, updates the page table, and resumes the process. If RAM is full, the OS must first **evict** a page. Which one? That is the page-replacement problem.\n\n**FIFO** is simple but can suffer **Bélády's anomaly** (1969): more frames can increase fault count for some reference strings. This is counterintuitive and specific to FIFO — LRU is a *stack algorithm* and is immune.\n\n**LRU** evicts the least-recently-used page, approximating the optimal *OPT* algorithm (evict the page used furthest in the future — impossible in practice). LRU is optimal for stack-distance-based models but expensive to implement exactly.\n\n**Clock** (second-chance) approximates LRU cheaply: a circular buffer with a *use bit* per frame. On access the bit is set; the hand sweeps past frames clearing bits until it finds one that is 0 — that page is evicted. This is what most real OSes implement.",
          ja: "ページがアクセスされたがまだRAMにない場合、CPUは**ページフォルト**を発生させます — OSがこれを捕捉し、ディスクからページを読み込み（または未初期化と宣言し）、空きフレームにインストールし、ページテーブルを更新して、プロセスを再開します。RAMが満杯の場合、OSはまずページを**退避**しなければなりません。どのページを？ それがページ置換問題です。\n\n**FIFO**はシンプルですが**ベラディの異常**（1969年）に悩まされます: フレーム数が増えると、一部の参照文字列でフォルト数が増加することがあります。これは直感に反しており、FIFO特有の現象です — LRUは*スタックアルゴリズム*であり免疫があります。\n\n**LRU**は最も最近使われていないページを退避します。最適な*OPT*アルゴリズム（最も遠い将来に使われるページを退避 — 実際には不可能）を近似します。LRUはスタック距離ベースのモデルでは最適ですが、正確な実装はコストが高くなります。\n\n**Clock**（第二機会）はLRUを安価に近似します: フレームごとに*使用ビット*を持つ循環バッファです。アクセス時にビットがセットされ、ハンドがフレームを掃いてビットをクリアし、0のものを見つけるとそのページが退避されます。これがほとんどの実際のOSが実装していることです。",
        },
        {
          en: "Peter Denning's **working-set model** (1968) reframed the problem: instead of asking which single page to evict, ask which *set* of pages a process needs right now. If the working set fits in RAM, performance is fine; if not, the process *thrashes* — spending more time on page faults than useful work. This insight drove demand paging, swapping policies, and the design of virtual memory systems for decades. Denning received the **Turing Award in 2011** for this and related contributions to operating systems.",
          ja: "ピーター・デニングの**ワーキングセットモデル**（1968年）は問題を再定式化しました: どのページを退避するかではなく、プロセスが今必要としているページの*集合*を問うのです。ワーキングセットがRAMに収まれば性能は問題ありません。収まらなければ、プロセスは*スラッシング*します — 有用な作業よりページフォルトに多くの時間を費やします。この洞察はデマンドページング、スワッピングポリシー、そして仮想メモリシステムの設計を数十年にわたって推進しました。デニングは2011年に**チューリング賞**を受賞しました。",
        },
      ],
    },
    {
      title: { en: "Up the stack", ja: "次の層へ" },
      paragraphs: [
        {
          en: "The OS sits between the hardware and the programs we write. It makes the hardware *safe* (isolation via virtual memory), *fair* (sharing via scheduling), and *convenient* (system calls, file systems, networking). Layer 5 — compilers and languages — completes the picture: without a compiler, writing programs that call the OS would require hand-crafted machine code. The layers are not independent; they are mutually enabling.",
          ja: "OSはハードウェアと私たちが書くプログラムの間に位置します。OSはハードウェアを*安全*にし（仮想メモリによる隔離）、*公平*にし（スケジューリングによる共有）、*便利*にします（システムコール、ファイルシステム、ネットワーキング）。Layer 5 — コンパイラと言語 — が全体像を完成させます: コンパイラなしにOSを呼び出すプログラムを書くには、手作業でマシンコードを書く必要があります。各層は独立しているのではなく、相互に支え合っています。",
        },
      ],
    },
  ],
};
