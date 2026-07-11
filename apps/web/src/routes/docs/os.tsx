import { createFileRoute } from "@tanstack/react-router";
import {
  Article,
  C,
  Callout,
  CompareTable,
  Diagram,
  DocsShell,
  Figure,
  KeyTerms,
  LayerStack,
  P,
  Prose,
  References,
  Section,
  useSvgId,
} from "../../features/docs";
import { makeDocJsonLd, makeHead } from "../../features/seo/seo";

const OS_TITLE = "Operating Systems — nand2web";
const OS_DESC =
  "An operating system turns raw hardware into a usable computer. It multiplexes the CPU, abstracts physical memory into isolated address spaces, and exposes a uniform file API regardless of the underlying storage device.";

export const Route = createFileRoute("/docs/os")({
  head: () =>
    makeHead({
      title: OS_TITLE,
      description: OS_DESC,
      path: "/docs/os",
      jsonLd: makeDocJsonLd({
        title: OS_TITLE,
        description: OS_DESC,
        path: "/docs/os",
        breadcrumbLabel: "Operating Systems",
      }),
    }),
  component: Page,
});

function Page() {
  return (
    <DocsShell active="os">
      <Article
        title={{ en: "Operating Systems", ja: "オペレーティングシステム" }}
        lead={{
          en: "An operating system is the software layer that turns raw hardware into a usable computer. It multiplexes the CPU among many programs, abstracts physical memory into isolated address spaces, and exposes a uniform file API regardless of the underlying storage device. Every program you run — browser, shell, database — depends on the OS to referee access to shared resources safely.",
          ja: "オペレーティングシステム（OS）は、生のハードウェアを使いやすいコンピュータへ変換するソフトウェア層です。CPUを多数のプログラムで多重化し、物理メモリを独立したアドレス空間として抽象化し、下位のストレージデバイスに関係なく統一されたファイルAPIを提供します。ブラウザ、シェル、データベースなど、あなたが実行するすべてのプログラムは、共有リソースへの安全なアクセスをOSに委ねています。",
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* 1. What an OS does                                                */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="what-os-does"
          title={{ en: "What an OS does", ja: "OSの役割" }}
        >
          <Prose
            paragraphs={[
              {
                en: "At its core an OS is a **resource manager**: it decides which program uses the CPU right now, how much RAM each program can see, and which program may write to a given file at a given time. Without this coordination, two programs could overwrite each other's memory, one greedy loop could monopolize the CPU forever, and concurrent writes to a file would corrupt it.",
                ja: "OSの本質は**リソースマネージャー**です。現時点でCPUを使うプログラム、各プログラムが参照できるRAMの量、特定の時刻に特定のファイルに書き込めるプログラムを決定します。この調整がなければ、2つのプログラムが互いのメモリを上書きし、1つの欲張りなループがCPUを永遠に独占し、ファイルへの同時書き込みがデータを破壊します。",
              },
              {
                en: "The OS is also an **abstraction layer**. It replaces the raw hardware interface with a cleaner, more portable model: *processes* instead of raw CPU time slices, *virtual address spaces* instead of physical RAM addresses, *files* instead of disk sectors. This means a program written on one machine can run on another with different hardware, as long as both run the same OS (or a compatible one).",
                ja: "OSは**抽象化層**でもあります。生のハードウェアインターフェースを、より明確でポータブルなモデルに置き換えます：生のCPUタイムスライスではなく*プロセス*、物理RAMアドレスではなく*仮想アドレス空間*、ディスクセクターではなく*ファイル*。これにより、あるマシン上で書かれたプログラムは、同じOS（または互換OS）が動いていれば、異なるハードウェアの別のマシン上でも実行できます。",
              },
              {
                en: "The third role is **protection**. Programs must be isolated from each other and from the OS itself. A buggy app should crash, not corrupt the kernel or spy on another process's memory. This isolation is enforced by a hardware mechanism: the CPU runs in two privilege levels. **User mode** is restricted — a program can only access its own memory and call the OS via a controlled gateway (the system call). **Kernel mode** is privileged — all instructions are permitted, all memory is reachable. The OS kernel runs in kernel mode; everything else runs in user mode.",
                ja: "3つ目の役割は**保護**です。プログラムは互いからも、OS自体からも隔離されなければなりません。バグのあるアプリはクラッシュすべきであり、カーネルを破壊したり別プロセスのメモリを盗み見たりしてはなりません。この隔離はハードウェア機構によって強制されます：CPUは2つの特権レベルで動作します。**ユーザーモード**は制限付き——プログラムは自身のメモリにしかアクセスできず、制御されたゲートウェイ（システムコール）を通じてのみOSを呼び出せます。**カーネルモード**は特権付き——すべての命令が許可され、すべてのメモリにアクセスできます。OSカーネルはカーネルモードで動作し、それ以外すべてはユーザーモードで動作します。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 2. Processes & threads                                            */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="processes"
          title={{ en: "Processes & threads", ja: "プロセスとスレッド" }}
        >
          <Prose
            paragraphs={[
              {
                en: "A **process** is a running program plus the OS-maintained context that makes it appear to own the machine: its own virtual address space (code, data, heap, stack), open file descriptors, signal handlers, and credentials. Two instances of the same binary are two separate processes with independent address spaces — they cannot accidentally corrupt each other.",
                ja: "**プロセス**は、実行中のプログラムにOSが管理するコンテキストを加えたものです。そのコンテキストにより、プロセスはマシンを所有しているかのように見えます：独自の仮想アドレス空間（コード・データ・ヒープ・スタック）、オープンファイルディスクリプタ、シグナルハンドラ、クレデンシャルが含まれます。同じバイナリの2つのインスタンスは2つの別プロセスで、独立したアドレス空間を持ちます——互いに誤ってデータを破壊することはありません。",
              },
              {
                en: "The OS records each process's state in a **Process Control Block** (PCB): the saved register values (including the program counter), memory mapping, scheduling priority, open files, and process ID (PID). When the OS switches from process A to process B it saves A's registers into A's PCB, loads B's registers from B's PCB, and switches the virtual memory mapping. This is the **context switch**. It is cheap in programmer time (a few microseconds), but not free — the CPU caches warm for A are now cold for B.",
                ja: "OSは各プロセスの状態を**プロセス制御ブロック**（PCB）に記録します：保存されたレジスタ値（プログラムカウンタを含む）、メモリマッピング、スケジューリング優先度、オープンファイル、プロセスID（PID）。OSがプロセスAからプロセスBに切り替えるとき、AのレジスタをAのPCBに保存し、BのレジスタをBのPCBからロードし、仮想メモリマッピングを切り替えます。これが**コンテキストスイッチ**です。プログラマの時間では安価（数マイクロ秒）ですが、タダではありません——Aのために温まっていたCPUキャッシュはBには冷たいものになります。",
              },
              {
                en: "A **thread** is a lighter-weight unit of concurrency within a process. Threads in the same process share the same virtual address space and file descriptors, but each thread has its own stack and register state (its own PC and stack pointer). Because they share memory, threads can communicate by reading and writing shared variables — but that also means they can race on those variables, requiring synchronization (§5). Creating a thread is much cheaper than forking a process, which is why web servers and databases use thread pools.",
                ja: "**スレッド**はプロセス内の軽量な並行処理単位です。同じプロセスのスレッドは同じ仮想アドレス空間とファイルディスクリプタを共有しますが、各スレッドは独自のスタックとレジスタ状態（独自のPCとスタックポインタ）を持ちます。メモリを共有するため、スレッドは共有変数の読み書きで通信できます——しかしそれはそれらの変数でレースが発生する可能性も意味し、同期（§5）が必要です。スレッドの生成はプロセスのフォークよりはるかに安価です。Webサーバーやデータベースがスレッドプールを使う理由はここにあります。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "Process state machine: the five states a process moves through during its lifetime.",
              ja: "プロセス状態機械：プロセスがライフサイクルを通じて移行する5つの状態。",
            }}
          >
            <ProcessStateDiagram />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 3. CPU scheduling                                                 */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="scheduling"
          title={{ en: "CPU scheduling", ja: "CPUスケジューリング" }}
        >
          <Prose
            paragraphs={[
              {
                en: "The **CPU scheduler** decides, at every scheduling event, which ready process gets the CPU next. A scheduling event occurs when a process blocks (waiting for I/O), terminates, voluntarily yields, or (with preemptive schedulers) when a timer interrupt fires at the end of a time quantum.",
                ja: "**CPUスケジューラ**は、スケジューリングイベントのたびに、次にCPUを得る準備完了プロセスを決定します。スケジューリングイベントは、プロセスがブロック（I/O待ち）、終了、自発的な譲渡、または（プリエンプティブスケジューラでは）タイムクァンタム終了時のタイマー割り込み発火時に発生します。",
              },
              {
                en: "Scheduling quality is measured by three metrics. **Turnaround time** is the wall-clock time from a job's submission to its completion. **Waiting time** is the fraction of that time the job spent ready but not running. **Response time** is the time from submission to the *first* time the job is scheduled — crucial for interactive workloads where a user is waiting for the first response.",
                ja: "スケジューリングの品質は3つのメトリクスで測定されます。**ターンアラウンドタイム**は、ジョブの投入から完了までの実時間です。**待機時間**は、ジョブが準備完了だが実行されていない時間の割合です。**応答時間**は、投入から*初めて*スケジュールされるまでの時間です——ユーザーが最初のレスポンスを待つインタラクティブなワークロードで重要です。",
              },
              {
                en: "**FCFS** (First Come First Served) is the simplest policy: processes run in arrival order until they block or finish. It can produce the **convoy effect** — a long CPU-bound job holds up a queue of short I/O-bound jobs behind it. **SJF** (Shortest Job First) is optimal for turnaround time when job lengths are known in advance, but predicting future CPU bursts requires estimation. **Round Robin** preempts each process after a fixed quantum (typically 1–10 ms) and moves it to the back of the queue — good response time for interactive processes but higher context-switch overhead.",
                ja: "**FCFS**（到着順）は最もシンプルなポリシーです：プロセスは到着順にブロックまたは終了するまで実行されます。**コンボイ効果**が生じる可能性があります——長いCPUバウンドジョブが後ろにある短いI/Oバウンドジョブのキューを詰まらせます。**SJF**（最短ジョブ優先）は、ジョブ長が事前にわかっている場合のターンアラウンドタイムに対して最適ですが、将来のCPUバーストの予測には推定が必要です。**ラウンドロビン**は固定クァンタム（通常1〜10ms）後に各プロセスをプリエンプトしてキューの後ろに移動します——インタラクティブプロセスに良好な応答時間を提供しますが、コンテキストスイッチオーバーヘッドが高くなります。",
              },
              {
                en: "**MLFQ** (Multi-Level Feedback Queue) is what real OSes use. It starts every new job at the highest-priority queue (shortest quantum). If a job uses its whole quantum without blocking, it gets demoted to a lower-priority queue with a longer quantum. I/O-bound processes stay at the top; CPU-bound batch jobs sink to the bottom. This gives interactive jobs low latency without prior knowledge of their length. The nand2web [scheduler simulator](/os) lets you experiment with all four policies.",
                ja: "**MLFQ**（多段フィードバックキュー）は実際のOSが使用するものです。すべての新しいジョブを最高優先度キュー（最短クァンタム）から開始します。ジョブがブロックせずにクァンタム全体を使い切ると、より長いクァンタムの低優先度キューに降格されます。I/Oバウンドプロセスは上位にとどまり、CPUバウンドのバッチジョブは下位に沈みます。これにより、ジョブ長の事前知識なしにインタラクティブジョブへの低レイテンシが実現します。nand2webの[スケジューラシミュレーター](/os)で4つのポリシーすべてを実験できます。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "CPU scheduling algorithm comparison.",
              ja: "CPUスケジューリングアルゴリズムの比較。",
            }}
          >
            <CompareTable
              headers={[
                { en: "Algorithm", ja: "アルゴリズム" },
                { en: "Preemptive?", ja: "プリエンプティブ？" },
                { en: "Turnaround", ja: "ターンアラウンド" },
                { en: "Response", ja: "応答時間" },
                { en: "Drawback", ja: "欠点" },
              ]}
              rows={[
                [
                  { en: "FCFS", ja: "FCFS" },
                  { en: "No", ja: "なし" },
                  { en: "Poor (convoy effect)", ja: "悪い（コンボイ効果）" },
                  { en: "Poor", ja: "悪い" },
                  {
                    en: "Long jobs block short ones",
                    ja: "長いジョブが短いジョブをブロック",
                  },
                ],
                [
                  { en: "SJF", ja: "SJF" },
                  { en: "Optional", ja: "任意" },
                  { en: "Optimal", ja: "最適" },
                  { en: "Good", ja: "良い" },
                  {
                    en: "Requires future knowledge",
                    ja: "将来の情報が必要",
                  },
                ],
                [
                  { en: "Round Robin", ja: "ラウンドロビン" },
                  { en: "Yes (quantum)", ja: "あり（クァンタム）" },
                  { en: "Fair, higher average", ja: "公平、平均は高め" },
                  { en: "Excellent", ja: "優秀" },
                  {
                    en: "Context-switch overhead",
                    ja: "コンテキストスイッチオーバーヘッド",
                  },
                ],
                [
                  { en: "Priority", ja: "優先度" },
                  { en: "Yes", ja: "あり" },
                  { en: "Good for high priority", ja: "高優先度に良い" },
                  { en: "Good", ja: "良い" },
                  {
                    en: "Starvation of low-priority jobs",
                    ja: "低優先度ジョブの飢餓",
                  },
                ],
                [
                  { en: "MLFQ", ja: "MLFQ" },
                  { en: "Yes", ja: "あり" },
                  { en: "Good overall", ja: "全体的に良い" },
                  { en: "Excellent", ja: "優秀" },
                  {
                    en: "Complex tuning needed",
                    ja: "複雑なチューニングが必要",
                  },
                ],
              ]}
            />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 4. Virtual memory & paging                                        */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="virtual-memory"
          title={{
            en: "Virtual memory & paging",
            ja: "仮想メモリとページング",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "**Virtual memory** gives each process the illusion of a large, private, contiguous address space — typically 48 or 57 bits on modern x86-64, far larger than physical RAM. The hardware **Memory Management Unit** (MMU) translates every virtual address the CPU generates into a physical address using a **page table** maintained by the OS. Translation happens at a fixed granularity: a **page** (typically 4 KiB). If the physical address exists in RAM, the access proceeds. If not, a **page fault** is raised, and the OS must bring the missing page from disk into a free physical frame — this is **demand paging**.",
                ja: "**仮想メモリ**は各プロセスに、大きくプライベートで連続したアドレス空間の幻想を与えます——現代のx86-64では通常48または57ビットで、物理RAMよりはるかに大きい。ハードウェアの**メモリ管理ユニット**（MMU）は、CPUが生成するすべての仮想アドレスを、OSが管理する**ページテーブル**を使って物理アドレスに変換します。変換は固定の粒度で行われます：**ページ**（通常4 KiB）。物理アドレスがRAMに存在すれば、アクセスは続行します。存在しなければ**ページフォルト**が発生し、OSは欠落ページをディスクから空きの物理フレームにロードしなければなりません——これが**デマンドページング**です。",
              },
              {
                en: "A virtual address on x86-64 with 4-level paging is split into four 9-bit page-table indices and a 12-bit page offset. The CPU walks the four-level page table (PGD → P4D → PMD → PTE) to find the physical frame number, then appends the offset. To avoid repeating this 4-step walk on every memory access, the CPU caches recent translations in the **TLB** (Translation Lookaside Buffer) — a small associative cache. A TLB miss forces a full page-table walk and costs ~10–100 cycles. On a context switch the TLB is typically flushed (or tagged with Address Space IDs on newer hardware).",
                ja: "4段ページングのx86-64の仮想アドレスは、4つの9ビットページテーブルインデックスと12ビットのページオフセットに分割されます。CPUは4段ページテーブル（PGD→P4D→PMD→PTE）をウォークして物理フレーム番号を見つけ、オフセットを付加します。すべてのメモリアクセスでこの4ステップのウォークを繰り返すことを避けるため、CPUは最近の変換を**TLB**（Translation Lookaside Buffer）——小さな連想キャッシュ——にキャッシュします。TLBミスは完全なページテーブルウォークを強制し、約10〜100サイクルかかります。コンテキストスイッチ時にTLBは通常フラッシュされます（新しいハードウェアではアドレス空間IDでタグ付けされます）。",
              },
              {
                en: "When RAM is full and a new page must be loaded, the OS must evict an existing page. The **page replacement** algorithm chooses the victim. **FIFO** evicts the oldest-loaded page — simple but suffers Bélády's anomaly (more frames can cause more faults). **LRU** (Least Recently Used) evicts the page not accessed for the longest time — optimal in practice but expensive to implement exactly (requires tracking access time per page). The **Clock algorithm** (second-chance) approximates LRU cheaply: pages have a reference bit; on eviction the hand sweeps the clock, giving pages with the bit set a second chance by clearing the bit.",
                ja: "RAMがいっぱいで新しいページをロードしなければならないとき、OSは既存のページを追い出す必要があります。**ページ置換**アルゴリズムが被害者を選択します。**FIFO**は最も古くロードされたページを追い出します——シンプルですがBéládyの異常（フレームが増えると障害が増える）に悩まされます。**LRU**（最近最も使われていないもの）は最も長い間アクセスされていないページを追い出します——実際には最適ですが正確な実装は高コストです（ページごとのアクセス時間の追跡が必要）。**クロックアルゴリズム**（セカンドチャンス）はLRUを安価に近似します：ページには参照ビットがあり、追い出し時に手が時計を掃引し、ビットがセットされたページにはビットをクリアしてセカンドチャンスを与えます。",
              },
              {
                en: "**Thrashing** occurs when a workload's working set is larger than available physical memory. The OS spends more time paging than executing: every evicted page is needed again almost immediately, causing an avalanche of page faults. The fix is to reduce the number of runnable processes (so each gets more RAM) or to add memory. Cross-link: [the memory hierarchy](/docs/memory) covers the full cache-RAM-disk latency chain; the nand2web [paging simulator](/os) visualises page table walks and replacement.",
                ja: "**スラッシング**は、ワークロードのワーキングセットが利用可能な物理メモリより大きい場合に発生します。OSは実行よりページングに多くの時間を費やします：追い出されたページはほぼすぐにまた必要になり、ページフォルトの雪崩を引き起こします。解決策は実行可能プロセス数を減らす（各プロセスに割り当てるRAMを増やす）か、メモリを追加することです。関連リンク：[メモリ階層](/docs/memory)はキャッシュ-RAM-ディスクの完全なレイテンシチェーンをカバーしています；nand2webの[ページングシミュレーター](/os)はページテーブルウォークと置換を視覚化します。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 5. Concurrency & synchronization                                  */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="concurrency"
          title={{
            en: "Concurrency & synchronization",
            ja: "並行処理と同期",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "When two threads share a writable data structure, the outcome depends on the order of interleaved instructions — a **race condition**. Consider a bank account: Thread A reads balance (100), Thread B reads balance (100), A adds 50 and writes 150, B adds 30 and writes 130. The correct balance is 180 but B's write overwrites A's update. The bank just lost 50.",
                ja: "2つのスレッドが書き込み可能なデータ構造を共有するとき、結果は割り込まれた命令の順序に依存します——**レース条件**です。銀行口座を考えてみましょう：スレッドAが残高を読みます（100）、スレッドBが残高を読みます（100）、Aは50を足して150と書きます、Bは30を足して130と書きます。正しい残高は180ですが、Bの書き込みがAの更新を上書きします。銀行は50を失います。",
              },
              {
                en: "A **critical section** is the code region that accesses shared state. The solution is **mutual exclusion**: only one thread may be inside a critical section for a given resource at a time. A **mutex** (mutual exclusion lock) enforces this: `lock()` before entering, `unlock()` on exit. If the mutex is already held, `lock()` blocks until it is released. A **semaphore** generalises this to allow N threads simultaneously — a counting semaphore with N=1 is a mutex. Semaphores can also be used as signalling primitives (a producer increments, a consumer decrements and blocks at 0).",
                ja: "**クリティカルセクション**は共有状態にアクセスするコード領域です。解決策は**相互排他**です：特定のリソースに対して、一度に1つのスレッドだけがクリティカルセクション内にいられます。**ミューテックス**（相互排他ロック）がこれを強制します：入る前に`lock()`、終了時に`unlock()`。ミューテックスがすでに保持されていれば、`lock()`はリリースされるまでブロックします。**セマフォ**はこれを一般化してN個のスレッドを同時に許可します——N=1のカウンティングセマフォはミューテックスです。セマフォはシグナリングプリミティブとしても使用できます（プロデューサーがインクリメント、コンシューマーがデクリメントし、0でブロック）。",
              },
              {
                en: "The classic **producer-consumer** problem illustrates semaphore usage: a shared bounded buffer, one semaphore counting empty slots (starts at buffer size), one counting full slots (starts at 0), and one mutex protecting the buffer itself. The producer acquires an empty slot, acquires the mutex, inserts an item, releases the mutex, then signals a full slot. The consumer does the mirror image. This pattern appears in every concurrent queue, message broker, and pipeline stage.",
                ja: "古典的な**プロデューサー-コンシューマー**問題はセマフォの使用を示しています：共有の有界バッファ、空きスロット数をカウントするセマフォ（バッファサイズで開始）、満杯スロット数をカウントするセマフォ（0で開始）、バッファ自体を保護するミューテックス。プロデューサーは空きスロットを取得し、ミューテックスを取得し、アイテムを挿入し、ミューテックスを解放し、満杯スロットをシグナルします。コンシューマーはその逆を行います。このパターンはすべての並行キュー、メッセージブローカー、パイプラインステージに現れます。",
              },
            ]}
          />

          <Callout
            tone="warn"
            title={{
              en: "The four deadlock conditions",
              ja: "デッドロックの4条件",
            }}
            t={{
              en: "Deadlock occurs when a set of threads are each waiting for a resource held by another thread in the set — a cycle with no exit. It requires all four conditions simultaneously: **(1) Mutual exclusion** — resources are non-shareable; **(2) Hold and wait** — a thread holds a resource while requesting more; **(3) No preemption** — resources cannot be forcibly taken; **(4) Circular wait** — T1 waits for a resource held by T2, T2 waits for T1. Breaking any one condition prevents deadlock: lock ordering (destroys circular wait) is the most common strategy in practice.",
              ja: "デッドロックは、スレッドの集合が互いに別のスレッドが保持するリソースを待ち合う場合に発生します——出口のないサイクルです。4つの条件がすべて同時に必要です：**(1) 相互排他**——リソースは共有不可；**(2) 保持して待つ**——スレッドはリソースを保持しながらさらに要求する；**(3) プリエンプション不可**——リソースを強制的に奪えない；**(4) 循環待ち**——T1はT2が保持するリソースを待ち、T2はT1を待つ。いずれか1つの条件を破ることでデッドロックを防止できます：ロック順序付け（循環待ちを破壊）が実際には最も一般的な戦略です。",
            }}
          />

          <Figure
            caption={{
              en: "Circular wait: two threads each holding one lock and waiting for the other — classic deadlock.",
              ja: "循環待ち：2つのスレッドがそれぞれ1つのロックを保持し、もう一方を待つ——古典的なデッドロック。",
            }}
          >
            <DeadlockDiagram />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 6. Inter-process communication                                    */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="ipc"
          title={{
            en: "Inter-process communication",
            ja: "プロセス間通信",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "Processes are isolated by design, yet they often need to exchange data. The OS provides several **IPC** mechanisms. **Pipes** are the oldest and simplest: a unidirectional byte stream, created by the `pipe()` syscall. The shell's `ls | grep .tsx` creates a pipe between two processes — `ls` writes to the write end, `grep` reads from the read end. The OS buffers data in the kernel until the reader consumes it. Pipes are synchronous: the writer blocks when the buffer is full; the reader blocks when it is empty.",
                ja: "プロセスは設計上隔離されていますが、しばしばデータを交換する必要があります。OSはいくつかの**IPC**メカニズムを提供します。**パイプ**は最も古くシンプルです：`pipe()`システムコールで作成される単方向バイトストリームです。シェルの`ls | grep .tsx`は2つのプロセス間にパイプを作成します——`ls`が書き込み端に書き、`grep`が読み込み端から読みます。OSはリーダーが消費するまでデータをカーネルにバッファします。パイプは同期的です：バッファが満杯のとき書き込み側はブロックし、空のとき読み込み側はブロックします。",
              },
              {
                en: "**Shared memory** is the fastest IPC: the OS maps the same physical pages into two (or more) processes' address spaces. One process writes; the other reads — no kernel involvement on the data path. The tradeoff is that processes must synchronize themselves (with a shared mutex or semaphore). Used heavily in databases (shared buffer pool between server processes) and multimedia pipelines.",
                ja: "**共有メモリ**は最速のIPCです：OSが同じ物理ページを2つ（以上の）プロセスのアドレス空間にマッピングします。一方のプロセスが書き込み、もう一方が読み込みます——データパスにカーネルの介入はありません。トレードオフは、プロセスが自ら同期しなければならないこと（共有ミューテックスまたはセマフォで）です。データベース（サーバープロセス間の共有バッファプール）やマルチメディアパイプラインで多用されます。",
              },
              {
                en: "**Message passing** — POSIX message queues, UNIX domain sockets, or network sockets — copies data through the kernel. It is slower than shared memory but safer: the kernel owns the buffer, so processes cannot corrupt each other. Network sockets extend this across machines, making the same API work for IPC on one host and RPC across the internet. **Signals** are a lightweight notification mechanism: the kernel delivers a signal (e.g. `SIGTERM`, `SIGCHLD`) to a process, which can handle it with a registered handler or let the default action (usually termination) apply. Signals are asynchronous and non-data-carrying, making them suitable for events like job control or timeout notification.",
                ja: "**メッセージパッシング**——POSIXメッセージキュー、UNIXドメインソケット、またはネットワークソケット——はデータをカーネルを通じてコピーします。共有メモリより遅いですが安全です：カーネルがバッファを所有するため、プロセスは互いに破壊できません。ネットワークソケットはこれをマシンをまたいで拡張し、同じAPIが1ホスト上のIPCとインターネット越しのRPCの両方で機能します。**シグナル**は軽量な通知メカニズムです：カーネルがシグナル（例：`SIGTERM`、`SIGCHLD`）をプロセスに配信し、プロセスは登録されたハンドラで処理するか、デフォルトのアクション（通常は終了）を適用させます。シグナルは非同期でデータを持たないため、ジョブ制御やタイムアウト通知などのイベントに適しています。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 7. File systems                                                   */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="file-systems"
          title={{ en: "File systems", ja: "ファイルシステム" }}
        >
          <Prose
            paragraphs={[
              {
                en: 'A **file system** organises persistent storage — disk or SSD — into a hierarchy of named **files** and **directories**. At the lowest level, a storage device is just an array of fixed-size **blocks** (typically 512 B or 4 KiB). The file system\'s job is to map the abstract notion of "a file named `/etc/passwd`" to a specific set of those blocks, and to do so reliably even after a crash.',
                ja: "**ファイルシステム**は、ディスクまたはSSDの永続ストレージを、名前付き**ファイル**と**ディレクトリ**の階層に整理します。最低レベルでは、ストレージデバイスは固定サイズの**ブロック**（通常512バイトまたは4 KiB）の配列にすぎません。ファイルシステムの仕事は、「`/etc/passwd`という名前のファイル」という抽象概念をそれらのブロックの特定のセットにマッピングし、クラッシュ後でも確実に行うことです。",
              },
              {
                en: "In Unix-like systems, the key metadata structure is the **inode** (index node). Each file has an inode storing: permissions (mode bits), owner UID/GID, size, timestamps (created/modified/accessed), and — crucially — pointers to the data blocks. For small files the inode contains direct block pointers; for large files it chains through indirect, double-indirect, and triple-indirect pointer blocks. A **directory** is itself a file containing a table of (filename → inode number) mappings. The name `/etc/passwd` resolves by looking up `etc` in root's directory inode, then `passwd` in the directory at that inode.",
                ja: "Unixライクなシステムでは、主要なメタデータ構造は**inode**（インデックスノード）です。各ファイルには、権限（モードビット）、所有者UID/GID、サイズ、タイムスタンプ（作成/変更/アクセス）、そして最も重要なデータブロックへのポインタを格納するinodeがあります。小さなファイルにはinodeに直接ブロックポインタが含まれ、大きなファイルには間接・二重間接・三重間接ポインタブロックを連鎖させます。**ディレクトリ**自体も（ファイル名→inode番号）マッピングのテーブルを含むファイルです。`/etc/passwd`というパス名は、ルートのディレクトリinodeで`etc`を検索し、そのinodeのディレクトリで`passwd`を検索することで解決されます。",
              },
              {
                en: "**Journaling** solves the crash-consistency problem. Without it, a crash midway through updating an inode and its data blocks can leave the disk in an inconsistent state — a partially written file, a directory pointing to a freed inode. A journaling file system writes a **journal entry** (the list of intended changes) before making changes to the actual disk structures. On recovery, the journal is replayed. If the journal entry was not fully written, the operation is simply rolled back. Ext4, NTFS, and XFS all journal metadata; ext4 can also journal data.",
                ja: "**ジャーナリング**はクラッシュ整合性の問題を解決します。ジャーナリングなしでは、inodeとデータブロックの更新途中のクラッシュでディスクが不整合な状態になる可能性があります——部分的に書かれたファイル、解放されたinodeを指すディレクトリ。ジャーナリングファイルシステムは、実際のディスク構造を変更する前に**ジャーナルエントリ**（意図した変更のリスト）を書き込みます。復旧時にジャーナルが再生されます。ジャーナルエントリが完全に書かれていなければ、操作は単にロールバックされます。Ext4、NTFS、XFSはすべてメタデータをジャーナリングし、ext4はデータのジャーナリングも可能です。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "The VFS layer decouples application code from the concrete file system implementation.",
              ja: "VFS層がアプリケーションコードを具体的なファイルシステム実装から切り離す。",
            }}
          >
            <LayerStack
              layers={[
                {
                  label: {
                    en: "Application (POSIX: open / read / write / close)",
                    ja: "アプリケーション（POSIX: open / read / write / close）",
                  },
                  tone: "accent",
                },
                {
                  label: {
                    en: "VFS — Virtual File System (unified kernel API)",
                    ja: "VFS——仮想ファイルシステム（統一カーネルAPI）",
                  },
                  tone: "emerald",
                },
                {
                  label: {
                    en: "Concrete file system (ext4 / XFS / NTFS / FAT32 …)",
                    ja: "具体的なファイルシステム（ext4 / XFS / NTFS / FAT32 …）",
                  },
                  tone: "zinc",
                },
                {
                  label: {
                    en: "Block layer — I/O scheduler, device driver",
                    ja: "ブロック層——I/Oスケジューラ、デバイスドライバ",
                  },
                  tone: "zinc",
                },
                {
                  label: {
                    en: "Storage hardware (HDD / SSD / NVMe)",
                    ja: "ストレージハードウェア（HDD / SSD / NVMe）",
                  },
                  tone: "zinc",
                },
              ]}
            />
          </Figure>

          <P
            t={{
              en: 'The **VFS** (Virtual File System) is an indirection layer inside the kernel: every file-system type registers a set of operations (open, read, write, readdir …) with the VFS. When user code calls `open("/etc/passwd", O_RDONLY)`, the VFS looks up which file system owns that path and dispatches to that file system\'s `open` handler. This is why you can `cat` a file on ext4 and then `cat` a file on a CIFS network share with exactly the same system call — the VFS hides the difference.',
              ja: '**VFS**（仮想ファイルシステム）はカーネル内の間接層です：すべてのファイルシステムタイプが一連の操作（open、read、write、readdir…）をVFSに登録します。ユーザーコードが`open("/etc/passwd", O_RDONLY)`を呼び出すと、VFSはそのパスを所有するファイルシステムを調べ、そのファイルシステムの`open`ハンドラにディスパッチします。これにより、ext4上のファイルを`cat`し、次にCIFSネットワーク共有上のファイルを`cat`するとき、まったく同じシステムコールで実行できます——VFSが違いを隠します。',
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 8. System calls & the kernel boundary                             */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="syscalls"
          title={{
            en: "System calls & the kernel boundary",
            ja: "システムコールとカーネル境界",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "A **system call** (syscall) is the only legitimate way for user-mode code to request a kernel service. The syscall mechanism is a controlled gate: it switches the CPU from user mode to kernel mode, jumps to a fixed OS entry point, and passes a syscall number plus arguments. The kernel validates everything before acting — because the caller is untrusted user code, every pointer, length, and file descriptor must be bounds-checked.",
                ja: "**システムコール**（syscall）は、ユーザーモードのコードがカーネルサービスを要求するための唯一の正当な方法です。syscallメカニズムは制御されたゲートです：CPUをユーザーモードからカーネルモードに切り替え、固定されたOSエントリーポイントにジャンプし、syscall番号と引数を渡します。カーネルは行動する前にすべてを検証します——呼び出し元は信頼されていないユーザーコードであるため、すべてのポインタ、長さ、ファイルディスクリプタは境界チェックを受けなければなりません。",
              },
              {
                en: "On x86-64 Linux the mechanism is the `syscall` instruction: it atomically saves the user-space `rip` and `rsp` into model-specific registers (MSRs), loads the kernel stack pointer, sets CPL=0 (kernel mode), and jumps to `entry_SYSCALL_64`. The kernel reads the syscall number from `rax`, dispatches through a table of function pointers, and eventually executes `sysret` to restore user context. A raw syscall costs ~100 ns in the best case; vDSO optimisations let common read-only calls (`gettimeofday`, `clock_gettime`) avoid the ring transition entirely by mapping kernel data into user address space.",
                ja: "x86-64 Linuxでは、メカニズムは`syscall`命令です：ユーザー空間の`rip`と`rsp`をモデル固有レジスタ（MSR）に原子的に保存し、カーネルスタックポインタをロードし、CPL=0（カーネルモード）に設定し、`entry_SYSCALL_64`にジャンプします。カーネルは`rax`からsyscall番号を読み込み、関数ポインタのテーブルを通じてディスパッチし、最終的に`sysret`を実行してユーザーコンテキストを復元します。生のsyscallはベストケースで約100 nsかかります；vDSOの最適化により、一般的な読み取り専用の呼び出し（`gettimeofday`、`clock_gettime`）はカーネルデータをユーザーアドレス空間にマッピングすることでリング遷移を完全に回避できます。",
              },
              {
                en: "The kernel architecture shapes how costly syscalls are and how isolated kernel bugs are. A **monolithic kernel** (Linux, the BSDs) runs all OS services — scheduler, file systems, drivers, network stack — at CPL=0 in the same address space. A bug in a driver can corrupt the scheduler's data structures. The advantage is speed: a file system can call a device driver with a simple function call. A **microkernel** (Mach, L4, seL4) moves most services into separate user-space server processes. The kernel does almost nothing except IPC, memory mapping, and scheduling. Crashes in a driver server don't kill the kernel — but every service boundary is a message-passing round-trip, adding latency. Modern systems often choose a pragmatic hybrid: Linux keeps drivers in kernel space but uses structured error paths and memory tagging to catch kernel bugs early. Cross-link: [CPU privilege modes](/docs/cpu) for the hardware rings; [I/O](/docs/io) for how drivers sit at the bottom of the stack.",
                ja: "カーネルアーキテクチャは、syscallのコストとカーネルバグの隔離度を形作ります。**モノリシックカーネル**（Linux、BSD系）は、スケジューラ、ファイルシステム、ドライバ、ネットワークスタックなど、すべてのOSサービスを同じアドレス空間でCPL=0で実行します。ドライバのバグがスケジューラのデータ構造を破壊する可能性があります。利点は速度です：ファイルシステムはシンプルな関数呼び出しでデバイスドライバを呼び出せます。**マイクロカーネル**（Mach、L4、seL4）はほとんどのサービスを別のユーザー空間サーバープロセスに移動します。カーネルはIPC、メモリマッピング、スケジューリング以外ほとんど何もしません。ドライバサーバーのクラッシュはカーネルを殺しません——しかしすべてのサービス境界はメッセージパッシングの往復であり、レイテンシが加わります。現代のシステムはしばしば現実的なハイブリッドを選択します：Linuxはドライバをカーネル空間に保持しますが、構造化されたエラーパスとメモリタギングを使ってカーネルバグを早期に発見します。関連リンク：ハードウェアリングについては[CPU特権モード](/docs/cpu)；スタックの底部にドライバがどう位置するかについては[I/O](/docs/io)。",
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
                term: "process",
                def: {
                  en: "A running program with its own virtual address space, open file descriptors, and OS-maintained state (PCB). The unit of isolation in an OS.",
                  ja: "独自の仮想アドレス空間、オープンファイルディスクリプタ、OSが管理する状態（PCB）を持つ実行中のプログラム。OS内の隔離の単位。",
                },
              },
              {
                term: "context switch",
                def: {
                  en: "The act of saving one process's CPU registers into its PCB and loading another process's registers from its PCB, switching the active execution context.",
                  ja: "プロセスのCPUレジスタをPCBに保存し、別のプロセスのレジスタをPCBからロードして、アクティブな実行コンテキストを切り替える操作。",
                },
              },
              {
                term: "mutex",
                def: {
                  en: "A synchronization primitive that enforces mutual exclusion: only one thread may hold the lock at a time; others block until it is released.",
                  ja: "相互排他を強制する同期プリミティブ：一度に1つのスレッドのみがロックを保持でき、他のスレッドはリリースされるまでブロックします。",
                },
              },
              {
                term: "deadlock",
                def: {
                  en: "A state where a set of threads are permanently blocked, each waiting for a resource held by another thread in the set — a circular dependency with no exit.",
                  ja: "スレッドの集合が永続的にブロックされた状態。各スレッドが集合内の別のスレッドが保持するリソースを待つ——出口のない循環依存。",
                },
              },
              {
                term: "page fault",
                def: {
                  en: "A hardware exception raised when the MMU cannot find a valid mapping for a virtual address — either because the page was never loaded, was swapped out, or the access is illegal.",
                  ja: "MMUが仮想アドレスの有効なマッピングを見つけられないときに発生するハードウェア例外——ページが一度もロードされていない、スワップアウトされている、またはアクセスが不正な場合。",
                },
              },
              {
                term: "syscall",
                def: {
                  en: "A controlled entry point into the kernel: user-mode code issues a syscall instruction, the CPU switches to kernel mode, and the OS executes the requested service on behalf of the process.",
                  ja: "カーネルへの制御されたエントリーポイント：ユーザーモードコードがsyscall命令を発行し、CPUがカーネルモードに切り替わり、OSがプロセスに代わって要求されたサービスを実行します。",
                },
              },
              {
                term: "kernel",
                def: {
                  en: "The privileged core of the OS that runs in CPU ring 0 (kernel mode). It controls all hardware, manages all abstractions, and enforces isolation between user processes.",
                  ja: "CPUリング0（カーネルモード）で動作するOSの特権コア。すべてのハードウェアを制御し、すべての抽象化を管理し、ユーザープロセス間の隔離を強制します。",
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
              title:
                "OSTEP — Operating Systems: Three Easy Pieces (Arpaci-Dusseau)",
              href: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
              note: {
                en: "The best freely available OS textbook. Covers virtualization, concurrency, and persistence with exceptional clarity.",
                ja: "最も優れた無料公開OSテキストブック。仮想化・並行処理・永続化を卓越した明快さで解説。",
              },
            },
            {
              title: "Tanenbaum — Modern Operating Systems",
              href: "https://en.wikipedia.org/wiki/Modern_Operating_Systems",
              note: {
                en: "Comprehensive graduate-level text covering processes, memory, file systems, and distributed systems in depth.",
                ja: "プロセス・メモリ・ファイルシステム・分散システムを深く扱う包括的な大学院レベルの教科書。",
              },
            },
            {
              title: "Silberschatz, Galvin & Gagne — Operating System Concepts",
              href: "https://www.os-book.com/",
              note: {
                en: "The classic 'dinosaur book'. Detailed treatment of scheduling, synchronization, and virtual memory algorithms.",
                ja: "古典的な「恐竜本」。スケジューリング・同期・仮想メモリアルゴリズムの詳細な解説。",
              },
            },
            {
              title: "Linux man pages (man7.org)",
              href: "https://man7.org/linux/man-pages/",
              note: {
                en: "Authoritative reference for POSIX syscalls, IPC primitives, and Linux-specific extensions.",
                ja: "POSIXシステムコール・IPCプリミティブ・Linux固有の拡張の権威あるリファレンス。",
              },
            },
            {
              title: "Wikipedia — Operating system",
              href: "https://en.wikipedia.org/wiki/Operating_system",
              note: {
                en: "Broad survey of OS history, concepts, and major families (Unix, Windows, RTOS) with good further-reading links.",
                ja: "OS史・概念・主要ファミリー（Unix・Windows・RTOS）の幅広い概観と参考文献リンク。",
              },
            },
            {
              title: "The Linux Kernel documentation",
              href: "https://www.kernel.org/doc/html/latest/",
              note: {
                en: "Official kernel documentation: scheduler internals, memory management, file system layer, and subsystem APIs.",
                ja: "公式カーネルドキュメント：スケジューラ内部・メモリ管理・ファイルシステム層・サブシステムAPIを網羅。",
              },
            },
          ]}
        />
      </Article>
    </DocsShell>
  );
}

// ---------------------------------------------------------------------------
// Process state machine diagram
// ---------------------------------------------------------------------------

function ProcessStateDiagram() {
  const sid = useSvgId();
  return (
    <Diagram
      label={{
        en: "Process state machine: new, ready, running, waiting, terminated",
        ja: "プロセス状態機械：新規・準備完了・実行中・待機・終了",
      }}
      viewBox="0 0 620 260"
      maxHeight={260}
    >
      <rect width="620" height="260" fill={C.panel} rx="8" />

      {/* State circles */}
      {/* New */}
      <circle
        cx="60"
        cy="130"
        r="40"
        fill={C.muted}
        stroke={C.faint}
        strokeWidth="1.5"
      />
      <text
        x="60"
        y="126"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        New
      </text>
      <text x="60" y="141" textAnchor="middle" fill={C.faint} fontSize="9">
        新規
      </text>

      {/* Ready */}
      <circle
        cx="210"
        cy="60"
        r="44"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="210"
        y="56"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        Ready
      </text>
      <text x="210" y="71" textAnchor="middle" fill={C.faint} fontSize="9">
        準備完了
      </text>

      {/* Running */}
      <circle
        cx="370"
        cy="130"
        r="44"
        fill={C.muted}
        stroke={C.high}
        strokeWidth="2"
      />
      <text
        x="370"
        y="126"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        Running
      </text>
      <text x="370" y="141" textAnchor="middle" fill={C.faint} fontSize="9">
        実行中
      </text>

      {/* Waiting */}
      <circle
        cx="210"
        cy="200"
        r="44"
        fill={C.muted}
        stroke={C.warn}
        strokeWidth="1.5"
      />
      <text
        x="210"
        y="196"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        Waiting
      </text>
      <text x="210" y="211" textAnchor="middle" fill={C.faint} fontSize="9">
        待機
      </text>

      {/* Terminated */}
      <circle
        cx="555"
        cy="130"
        r="44"
        fill={C.muted}
        stroke={C.faint}
        strokeWidth="1.5"
      />
      <text
        x="555"
        y="126"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        Terminated
      </text>
      <text x="555" y="141" textAnchor="middle" fill={C.faint} fontSize="9">
        終了
      </text>

      {/* Arrows */}
      {/* New → Ready (admitted) */}
      <path
        d="M97 108 Q140 60 164 60"
        fill="none"
        stroke={C.faint}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("a")})`}
      />
      <text x="120" y="70" textAnchor="middle" fill={C.faint} fontSize="9">
        admitted
      </text>

      {/* Ready → Running (dispatch) */}
      <path
        d="M254 75 Q310 80 325 110"
        fill="none"
        stroke={C.accent}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("b")})`}
      />
      <text x="305" y="78" textAnchor="middle" fill={C.accent} fontSize="9">
        dispatch
      </text>

      {/* Running → Ready (preempt / timer) */}
      <path
        d="M330 108 Q270 70 256 70"
        fill="none"
        stroke={C.high}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("c")})`}
      />
      <text x="285" y="98" textAnchor="middle" fill={C.high} fontSize="9">
        timer / preempt
      </text>

      {/* Running → Waiting (I/O wait) */}
      <path
        d="M345 165 Q280 210 256 210"
        fill="none"
        stroke={C.warn}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("d")})`}
      />
      <text x="295" y="205" textAnchor="middle" fill={C.warn} fontSize="9">
        I/O wait
      </text>

      {/* Waiting → Ready (I/O done) */}
      <path
        d="M210 155 L210 106"
        fill="none"
        stroke={C.accent}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("b")})`}
      />
      <text x="225" y="133" textAnchor="start" fill={C.accent} fontSize="9">
        I/O done
      </text>

      {/* Running → Terminated (exit) */}
      <path
        d="M414 130 L509 130"
        fill="none"
        stroke={C.faint}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("a")})`}
      />
      <text x="462" y="122" textAnchor="middle" fill={C.faint} fontSize="9">
        exit()
      </text>

      <defs>
        <marker
          id={sid("a")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.faint} />
        </marker>
        <marker
          id={sid("b")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.accent} />
        </marker>
        <marker
          id={sid("c")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.high} />
        </marker>
        <marker
          id={sid("d")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.warn} />
        </marker>
      </defs>
    </Diagram>
  );
}

// ---------------------------------------------------------------------------
// Deadlock circular-wait diagram
// ---------------------------------------------------------------------------

function DeadlockDiagram() {
  const sid = useSvgId();
  return (
    <Diagram
      label={{
        en: "Deadlock: Thread A holds Lock 1 and waits for Lock 2; Thread B holds Lock 2 and waits for Lock 1",
        ja: "デッドロック：スレッドAがロック1を保持しロック2を待ち、スレッドBがロック2を保持しロック1を待つ",
      }}
      viewBox="0 0 480 220"
      maxHeight={220}
    >
      <rect width="480" height="220" fill={C.panel} rx="8" />

      {/* Thread A */}
      <rect
        x="30"
        y="80"
        width="100"
        height="50"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="80"
        y="102"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="600"
      >
        Thread A
      </text>
      <text x="80" y="120" textAnchor="middle" fill={C.faint} fontSize="10">
        スレッドA
      </text>

      {/* Thread B */}
      <rect
        x="350"
        y="80"
        width="100"
        height="50"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="400"
        y="102"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="600"
      >
        Thread B
      </text>
      <text x="400" y="120" textAnchor="middle" fill={C.faint} fontSize="10">
        スレッドB
      </text>

      {/* Lock 1 */}
      <rect
        x="160"
        y="20"
        width="80"
        height="45"
        rx="6"
        fill={C.muted}
        stroke={C.high}
        strokeWidth="1.5"
      />
      <text
        x="200"
        y="40"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        Lock 1
      </text>
      <text x="200" y="56" textAnchor="middle" fill={C.faint} fontSize="9">
        ロック1
      </text>

      {/* Lock 2 */}
      <rect
        x="160"
        y="155"
        width="80"
        height="45"
        rx="6"
        fill={C.muted}
        stroke={C.warn}
        strokeWidth="1.5"
      />
      <text
        x="200"
        y="175"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        Lock 2
      </text>
      <text x="200" y="191" textAnchor="middle" fill={C.faint} fontSize="9">
        ロック2
      </text>

      {/* A holds Lock 1 (solid) */}
      <path
        d="M80 80 Q100 42 158 42"
        fill="none"
        stroke={C.high}
        strokeWidth="2"
        markerEnd={`url(#${sid("hold")})`}
      />
      <text x="108" y="50" textAnchor="middle" fill={C.high} fontSize="9">
        holds
      </text>

      {/* B holds Lock 2 (solid) */}
      <path
        d="M400 130 Q380 177 242 177"
        fill="none"
        stroke={C.warn}
        strokeWidth="2"
        markerEnd={`url(#${sid("hold2")})`}
      />
      <text x="340" y="175" textAnchor="middle" fill={C.warn} fontSize="9">
        holds
      </text>

      {/* A waits for Lock 2 (dashed) */}
      <path
        d="M80 130 Q80 177 158 177"
        fill="none"
        stroke={C.faint}
        strokeWidth="1.5"
        strokeDasharray="4 2"
        markerEnd={`url(#${sid("wait")})`}
      />
      <text x="100" y="170" textAnchor="middle" fill={C.faint} fontSize="9">
        waits
      </text>

      {/* B waits for Lock 1 (dashed) */}
      <path
        d="M400 80 Q400 42 242 42"
        fill="none"
        stroke={C.faint}
        strokeWidth="1.5"
        strokeDasharray="4 2"
        markerEnd={`url(#${sid("wait")})`}
      />
      <text x="360" y="50" textAnchor="middle" fill={C.faint} fontSize="9">
        waits
      </text>

      <defs>
        <marker
          id={sid("hold")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.high} />
        </marker>
        <marker
          id={sid("hold2")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.warn} />
        </marker>
        <marker
          id={sid("wait")}
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
