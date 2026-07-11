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
  LayerStack,
  P,
  Prose,
  References,
  Section,
  useSvgId,
} from "../../features/docs";

export const Route = createFileRoute("/docs/io")({
  component: Page,
});

function Page() {
  return (
    <DocsShell active="io">
      <Article
        title={{ en: "Input / Output (I/O)", ja: "入出力（I/O）" }}
        lead={{
          en: "Every useful computation involves the outside world — reading keystrokes, writing to disk, sending packets, rendering pixels. I/O is the study of how a CPU and memory communicate with devices that are orders of magnitude slower, asynchronous, and wildly heterogeneous. Getting this right is what separates a toy processor from a real operating system.",
          ja: "あらゆる実用的な計算は外部世界と関わります——キー入力の読み取り、ディスクへの書き込み、パケットの送信、ピクセルの描画。I/Oは、CPUとメモリが桁違いに遅く、非同期で、極めて多様なデバイスとどのように通信するかを研究する分野です。これを正しく理解することが、おもちゃのプロセッサと本物のOSを隔てるものです。",
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* 1. What I/O is                                                    */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="what-is-io"
          title={{ en: "What I/O is", ja: "I/Oとは何か" }}
        >
          <Prose
            paragraphs={[
              {
                en: "**I/O** (Input / Output) is the transfer of data between the CPU/memory subsystem and any device that is not the CPU or main memory. That broad definition covers keyboards, mice, displays, spinning hard drives, SSDs, network interface cards, USB controllers, GPU command queues, sensors, and more. From the CPU's perspective these are all the same: a region of registers or memory addresses it can read from and write to in order to command the device and receive data or status.",
                ja: "**I/O**（入出力）は、CPU/メモリサブシステムと、CPUやメインメモリ以外のデバイスとの間のデータ転送です。この広い定義には、キーボード、マウス、ディスプレイ、ハードディスク、SSD、ネットワークインターフェースカード、USBコントローラ、GPUコマンドキュー、センサーなどが含まれます。CPUの観点からは、これらはすべて同じです：デバイスを制御しデータやステータスを受け取るために読み書きできるレジスタまたはメモリアドレスの領域です。",
              },
              {
                en: "The core tension in I/O design is the **speed mismatch** between the CPU and devices. A modern CPU executes an instruction in a fraction of a nanosecond. An SSD read takes tens of microseconds — roughly 100,000× slower. A network round-trip to a distant server takes tens of milliseconds — 100,000,000× slower. A spinning hard disk access can take 10 ms. A naive design that makes the CPU wait (poll) for every device response would waste almost all of the CPU's time.",
                ja: "I/O設計の核心的な課題は、CPUとデバイスの**速度不一致**です。現代のCPUはナノ秒の何分の1かで命令を実行します。SSDの読み込みは数十マイクロ秒かかります——約10万倍遅い。遠くのサーバーへのネットワーク往復は数十ミリ秒かかります——1億倍遅い。ハードディスクのアクセスは10ミリ秒かかることもあります。すべてのデバイス応答をCPUがポーリングで待つ単純な設計では、CPUの時間のほぼすべてが無駄になります。",
              },
              {
                en: "The second fundamental challenge is **asynchrony**: devices produce or consume data at unpredictable times driven by the physical world — a key is pressed whenever the user presses it, a packet arrives when the network delivers it. The I/O subsystem must be able to accept these events without the CPU running a tight loop to check for them. The two classical solutions — polling and interrupts — and the modern DMA + async I/O stack built on top of them, are the subject of this page.",
                ja: "第二の根本的な課題は**非同期性**です：デバイスは物理世界によって駆動される予測不可能なタイミングでデータを生成または消費します——キーはユーザーが押したときに押され、パケットはネットワークが配信したときに届きます。I/Oサブシステムは、CPUがそれらを確認するためにタイトなループを実行することなく、これらのイベントを受け入れられなければなりません。ポーリングと割り込みという2つの古典的な解決策と、その上に構築された現代のDMA + 非同期I/Oスタックが、このページのテーマです。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 2. Buses & device controllers                                     */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="buses"
          title={{
            en: "Buses & device controllers",
            ja: "バスとデバイスコントローラ",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "Physical devices are connected to the CPU and memory through one or more **buses** — shared electrical (or optical, or PCIe serial) pathways that carry address, data, and control signals. The classic von Neumann model has a single system bus; modern systems have a hierarchy: a fast **memory bus** between the CPU and DRAM, a **PCIe** fabric for GPUs and NVMe SSDs, a **USB** tree for peripherals, and a **SATA** bus for storage. A chipset (south bridge / PCH) arbitrates among them.",
                ja: "物理デバイスは、アドレス・データ・制御信号を伝送する共有の電気的（または光学・PCIeシリアル）経路である1つ以上の**バス**を通じてCPUとメモリに接続されます。古典的なフォン・ノイマンモデルには単一のシステムバスがありますが、現代のシステムには階層があります：CPUとDRAM間の高速**メモリバス**、GPUとNVMe SSDのための**PCIe**ファブリック、周辺機器のための**USB**ツリー、ストレージのための**SATA**バス。チップセット（サウスブリッジ / PCH）がそれらを調停します。",
              },
              {
                en: "Every device is managed through a **device controller** — a dedicated circuit (often a small microcontroller itself) that sits between the bus and the physical hardware. The controller exposes a small set of **device registers**: a *status* register the CPU can read to learn the device's current state (ready, busy, error), a *command* register the CPU writes to issue operations, and one or more *data* registers to transfer bytes. The actual mechanical or electrical work (moving a disk head, transmitting a radio frame) happens inside the controller; the CPU only talks to those registers.",
                ja: "すべてのデバイスは**デバイスコントローラ**を通じて管理されます——バスと物理ハードウェアの間に位置する専用の回路（それ自体がしばしば小型マイクロコントローラ）です。コントローラはデバイスの現在の状態（準備完了・ビジー・エラー）をCPUが読み取るための*ステータス*レジスタ、操作を発行するためにCPUが書き込む*コマンド*レジスタ、バイトを転送するための1つ以上の*データ*レジスタからなる小さな**デバイスレジスタ**セットを公開します。実際の機械的・電気的処理（ディスクヘッドの移動、無線フレームの送信）はコントローラ内で行われます；CPUはそれらのレジスタとしか通信しません。",
              },
              {
                en: "There are two ways for the CPU to address device registers. **Memory-mapped I/O (MMIO)** places device registers into the same address space as RAM. A normal `LOAD` or `STORE` instruction targeting those addresses is intercepted by the memory controller and routed to the device instead. This is the dominant approach on ARM, RISC-V, and modern x86 (where it coexists with the legacy approach). **Port-mapped I/O (PMIO)**, used by the original x86 architecture, gives devices a separate 64K *port address space* accessed with special `IN`/`OUT` instructions rather than regular memory references. PMIO is legacy but still used for a handful of ISA-era devices like the PS/2 keyboard controller.",
                ja: "CPUがデバイスレジスタをアドレス指定する方法は2つあります。**メモリマップドI/O（MMIO）**はデバイスレジスタをRAMと同じアドレス空間に配置します。それらのアドレスを対象とする通常の`LOAD`や`STORE`命令はメモリコントローラによって傍受され、代わりにデバイスにルーティングされます。これはARM、RISC-V、現代のx86（レガシーアプローチと共存）で主流のアプローチです。元のx86アーキテクチャで使用された**ポートマップドI/O（PMIO）**は、通常のメモリ参照ではなく特別な`IN`/`OUT`命令でアクセスする別の64K*ポートアドレス空間*をデバイスに与えます。PMIOはレガシーですが、PS/2キーボードコントローラなどの一部のISA時代のデバイスには今も使われています。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 3. Polling vs interrupts                                          */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="polling-interrupts"
          title={{
            en: "Polling vs interrupts",
            ja: "ポーリングと割り込み",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "**Polling** (busy-wait) is the simplest possible I/O strategy: the CPU continuously reads the device's status register in a tight loop until the device signals it is ready, then transfers the data. This is simple to implement and has very low latency when the device responds quickly — network packet processing on dedicated cores sometimes uses polling for exactly this reason (see the DPDK framework). The fatal flaw is CPU waste: polling a slow device (disk, network at moderate load) burns 100% of a CPU core doing nothing productive.",
                ja: "**ポーリング**（ビジーウェイト）は最も単純なI/O戦略です：デバイスが準備完了を通知するまでCPUはタイトなループでデバイスのステータスレジスタを継続的に読み取り、その後データを転送します。実装が単純で、デバイスが素早く応答する場合はレイテンシが非常に低くなります——専用コアでのネットワークパケット処理が正にこの理由でポーリングを使うことがあります（DPDKフレームワーク参照）。致命的な欠点はCPUの無駄遣いです：低速デバイス（ディスク、中程度の負荷のネットワーク）をポーリングすると、生産的なことを何もせずにCPUコアの100%を消費します。",
              },
              {
                en: "**Interrupt-driven I/O** solves this by inverting control. The CPU issues a command to the device and then continues executing other work. When the device finishes, it asserts an **IRQ** (Interrupt ReQuest) line on the bus. The CPU's interrupt controller (x86 uses the APIC; ARM uses the GIC) prioritises and delivers pending IRQs. At the end of the current instruction, if interrupts are enabled and an IRQ is pending, the CPU automatically: saves its full state (program counter, flags, registers) onto the kernel stack, looks up the **Interrupt Vector Table** (IVT) or IDT for the handler address, and jumps to the **Interrupt Service Routine (ISR)**. The ISR reads the data from the device, acknowledges the interrupt, and returns with a special instruction (`IRET` on x86) that restores the saved state, resuming the interrupted code exactly where it left off.",
                ja: "**割り込み駆動I/O**は制御を反転することでこれを解決します。CPUはデバイスにコマンドを発行し、その後他の処理の実行を続けます。デバイスが処理を完了すると、バス上の**IRQ**（割り込み要求）ラインをアサートします。CPUの割り込みコントローラ（x86はAPICを使用；ARMはGICを使用）は保留中のIRQに優先順位を付けて配信します。現在の命令の終わりに、割り込みが有効で保留中のIRQがある場合、CPUは自動的に：完全な状態（プログラムカウンタ、フラグ、レジスタ）をカーネルスタックに保存し、ハンドラアドレスのために**割り込みベクタテーブル**（IVT）またはIDTを参照し、**割り込みサービスルーチン（ISR）**にジャンプします。ISRはデバイスからデータを読み取り、割り込みを確認し、保存された状態を復元する特別な命令（x86では`IRET`）でリターンし、中断されたコードをちょうど中断した場所から再開します。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "Interrupt lifecycle: device raises IRQ, CPU saves state and jumps to ISR, then restores and resumes.",
              ja: "割り込みのライフサイクル：デバイスがIRQを発行し、CPUが状態を保存してISRにジャンプし、その後復元して再開する。",
            }}
          >
            <InterruptDiagram />
          </Figure>

          <P
            t={{
              en: "The interrupt approach is nearly universal in real operating systems: it lets one CPU core multiplex among dozens of slow devices without wasting cycles. The cost is the interrupt overhead itself — saving and restoring state, the ISR code, and any cache pollution — typically 1–5 µs per interrupt. At very high I/O rates (millions of packets per second) this overhead accumulates and polling can win, which is why high-performance network drivers (DPDK, kernel bypass) switch to polling under load.",
              ja: "割り込みアプローチは実際のOSでほぼ普遍的です：1つのCPUコアがサイクルを無駄にすることなく数十の低速デバイスを多重化できます。コストは割り込みオーバーヘッド自体です——状態の保存と復元、ISRコード、キャッシュの汚染——通常は割り込み1回あたり1〜5マイクロ秒。非常に高いI/Oレート（毎秒数百万パケット）では、このオーバーヘッドが蓄積してポーリングが勝ることがあります。これが高性能ネットワークドライバ（DPDK、カーネルバイパス）が負荷下でポーリングに切り替える理由です。",
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 4. DMA                                                            */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="dma"
          title={{
            en: "DMA — Direct Memory Access",
            ja: "DMA（ダイレクトメモリアクセス）",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "Even with interrupts, bulk data transfers remain inefficient if the CPU must copy each byte between the device's data register and main memory. Reading a 4 KB disk sector byte-by-byte would require 4,096 load + 4,096 store instructions — plus the ISR overhead for each. **Direct Memory Access (DMA)** offloads this copying to a dedicated **DMA controller** chip. The CPU programs the DMA controller with a source/destination address in main memory, a byte count, and a direction (read or write). The DMA controller then conducts the transfer autonomously, stealing bus cycles from the CPU as needed (cycle stealing) or using a dedicated bus. When the entire transfer is complete, the DMA controller fires a single interrupt to notify the CPU. The CPU was free to execute other code throughout.",
                ja: "割り込みがあっても、CPUがデバイスのデータレジスタとメインメモリの間の各バイトをコピーしなければならない場合、大量データ転送は依然として非効率です。4KBのディスクセクタをバイト単位で読み取ると、4096回のロード + 4096回のストア命令——加えて各回のISRオーバーヘッドが必要です。**ダイレクトメモリアクセス（DMA）**は、このコピーを専用の**DMAコントローラ**チップにオフロードします。CPUはDMAコントローラにメインメモリ内の送受信アドレス、バイト数、方向（読み取りまたは書き込み）をプログラムします。DMAコントローラは、必要に応じてCPUからバスサイクルを奪い取り（サイクルスティーリング）または専用バスを使って、自律的に転送を実行します。転送全体が完了すると、DMAコントローラはCPUに通知するために単一の割り込みを発行します。CPUはその間ずっと他のコードを実行できます。",
              },
              {
                en: "Modern systems have taken DMA further. Each PCIe device has its own built-in DMA engine; it can directly read and write memory without involving any centralised DMA controller. The CPU only needs to set up a **descriptor ring** — a circular queue of transfer descriptors in memory — and the device's DMA engine works through it autonomously. This scatter-gather DMA allows transferring to or from many non-contiguous memory regions with a single descriptor, avoiding the need to first copy data into a contiguous buffer.",
                ja: "現代のシステムはDMAをさらに進歩させました。各PCIeデバイスには独自の組み込みDMAエンジンがあります；中央集権的なDMAコントローラを介さずにメモリを直接読み書きできます。CPUは**ディスクリプタリング**——メモリ内の転送ディスクリプタの環状キュー——を設定するだけで、デバイスのDMAエンジンが自律的に処理します。このスキャッタギャザーDMAにより、最初に連続バッファにデータをコピーすることなく、単一のディスクリプタで多くの非連続メモリ領域への転送が可能になります。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "DMA transfer: the DMA controller moves data between device and memory while the CPU runs other code; one interrupt fires on completion.",
              ja: "DMA転送：DMAコントローラがCPUが他のコードを実行する間にデバイスとメモリ間でデータを転送し、完了時に1回の割り込みが発行される。",
            }}
          >
            <DmaDiagram />
          </Figure>

          <Callout
            tone="insight"
            title={{
              en: "DMA and cache coherence",
              ja: "DMAとキャッシュコヒーレンシ",
            }}
            t={{
              en: "DMA bypasses the CPU cache: the device writes directly to DRAM while the CPU may have a stale cached copy of the same address. The OS must either flush/invalidate the relevant cache lines before a DMA read (so the device's freshly written data is visible), or use a cache-coherent DMA bus (IOMMU with snooping) that automatically maintains consistency. Getting this wrong causes subtle data corruption bugs.",
              ja: "DMAはCPUキャッシュを迂回します：デバイスが直接DRAMに書き込む一方で、CPUは同じアドレスの古いキャッシュコピーを持っている場合があります。OSはDMA読み取り前に関連キャッシュラインをフラッシュ/無効化する（デバイスが新たに書き込んだデータが見えるように）か、自動的に整合性を維持するキャッシュコヒーレントDMAバス（スヌーピング付きIOMMU）を使用する必要があります。これを間違えると、微妙なデータ破損バグが発生します。",
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 5. I/O software stack                                             */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="software-stack"
          title={{
            en: "The I/O software stack",
            ja: "I/Oソフトウェアスタック",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "The hardware mechanisms above — registers, buses, interrupts, DMA — are wrapped in a layered software architecture that hides device specifics from applications. Each layer has a single, well-defined responsibility and presents a uniform interface to the layer above.",
                ja: "上記のハードウェアメカニズム——レジスタ、バス、割り込み、DMA——は、アプリケーションからデバイスの詳細を隠す階層化されたソフトウェアアーキテクチャにラップされています。各層は単一の明確に定義された責任を持ち、上の層に統一されたインターフェースを提供します。",
              },
              {
                en: "At the bottom is the physical **hardware** and its controller. The **device driver** is kernel code written by the device manufacturer (or the OS team for common devices). It knows the exact register layout, timing requirements, and quirks of one specific hardware family. It programs the controller, sets up DMA descriptors, and registers ISRs. Above that sits the **device-independent OS layer**, which provides generic abstractions: a block device interface (read/write sector N), a character device interface (stream of bytes), or a network interface (send/receive frames). The OS layer handles buffering, caching, error recovery, and multiplexing many processes to one device. A **system call** interface (e.g. POSIX `read(2)`, `write(2)`, `ioctl(2)`) then exposes these abstractions to user space. The **user-space application** calls these syscalls and is shielded from all hardware details.",
                ja: "最下層は物理的な**ハードウェア**とそのコントローラです。**デバイスドライバ**は、デバイスメーカー（または一般的なデバイスの場合はOSチーム）が書いたカーネルコードです。特定のハードウェアファミリーの正確なレジスタレイアウト、タイミング要件、クセを知っています。コントローラをプログラムし、DMAディスクリプタを設定し、ISRを登録します。その上に**デバイス独立OSレイヤー**があり、汎用的な抽象化を提供します：ブロックデバイスインターフェース（セクタNの読み書き）、キャラクタデバイスインターフェース（バイトのストリーム）、またはネットワークインターフェース（フレームの送受信）。OSレイヤーはバッファリング、キャッシング、エラー回復、多くのプロセスから1つのデバイスへの多重化を処理します。**システムコール**インターフェース（例：POSIX `read(2)`、`write(2)`、`ioctl(2)`）がこれらの抽象化をユーザー空間に公開します。**ユーザー空間アプリケーション**はこれらのシステムコールを呼び出し、すべてのハードウェアの詳細から守られます。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "The I/O software stack from user app to hardware.",
              ja: "ユーザーアプリからハードウェアまでのI/Oソフトウェアスタック。",
            }}
          >
            <LayerStack
              layers={[
                {
                  label: { en: "User Application", ja: "ユーザーアプリ" },
                  sub: {
                    en: "calls read() / write() / send()",
                    ja: "read() / write() / send() を呼び出す",
                  },
                  tone: "accent",
                },
                {
                  label: { en: "System Call Interface", ja: "システムコール" },
                  sub: {
                    en: "POSIX read / write / ioctl — kernel boundary",
                    ja: "POSIX read / write / ioctl — カーネル境界",
                  },
                  tone: "accent",
                },
                {
                  label: {
                    en: "Device-independent OS layer",
                    ja: "デバイス独立OSレイヤー",
                  },
                  sub: {
                    en: "buffering, caching, error recovery, scheduling",
                    ja: "バッファリング、キャッシング、エラー回復、スケジューリング",
                  },
                  tone: "emerald",
                },
                {
                  label: { en: "Device Driver", ja: "デバイスドライバ" },
                  sub: {
                    en: "hardware-specific code — programs registers, sets up DMA, handles IRQs",
                    ja: "ハードウェア固有コード — レジスタのプログラム、DMA設定、IRQ処理",
                  },
                  tone: "emerald",
                },
                {
                  label: {
                    en: "Device Controller (hardware)",
                    ja: "デバイスコントローラ（ハードウェア）",
                  },
                  sub: {
                    en: "status / command / data registers",
                    ja: "ステータス / コマンド / データレジスタ",
                  },
                  tone: "zinc",
                },
                {
                  label: {
                    en: "Physical Device",
                    ja: "物理デバイス",
                  },
                  sub: {
                    en: "disk platters, NIC PHY, keyboard matrix…",
                    ja: "ディスクプラッタ、NIC PHY、キーボードマトリクス…",
                  },
                  tone: "zinc",
                },
              ]}
            />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 6. Blocking, non-blocking & async I/O                            */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="async"
          title={{
            en: "Blocking, non-blocking & async I/O",
            ja: "ブロッキング・ノンブロッキング・非同期I/O",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "From an application's point of view, the OS I/O interface comes in three flavours. **Blocking I/O** is the default: when an application calls `read()`, the kernel suspends the calling thread until data is available — the thread sleeps and yields the CPU to another thread. This is simple to reason about but limits concurrency: 10,000 simultaneous connections means 10,000 blocked threads, each consuming stack memory and kernel scheduling resources.",
                ja: "アプリケーションの観点から、OS I/Oインターフェースには3つの種類があります。**ブロッキングI/O**がデフォルトです：アプリケーションが`read()`を呼び出すと、カーネルはデータが利用可能になるまで呼び出しスレッドをサスペンドします——スレッドはスリープし、CPUを別のスレッドに譲ります。これは推論が単純ですが、並行性を制限します：1万の同時接続は1万のブロックされたスレッドを意味し、それぞれがスタックメモリとカーネルスケジューリングリソースを消費します。",
              },
              {
                en: "**Non-blocking I/O** (set with `O_NONBLOCK` or `SOCK_NONBLOCK`) makes `read()` return immediately with `EAGAIN` if no data is ready. The application then needs a way to know *when* the descriptor becomes readable. **I/O multiplexing** syscalls — `select(2)`, `poll(2)`, and the Linux-specific `epoll(7)` — let a single thread wait for readiness events on many file descriptors simultaneously. `epoll` in edge-triggered mode is the backbone of nearly every high-concurrency server (nginx, Node.js, Redis). It is a **readiness model**: the OS notifies the application that data *is ready to be read*, and the application does the actual `read()` itself.",
                ja: "**ノンブロッキングI/O**（`O_NONBLOCK`または`SOCK_NONBLOCK`で設定）は、データの準備ができていない場合に`read()`が即座に`EAGAIN`で返るようにします。アプリケーションは、ディスクリプタがいつ読み取り可能になるかを知る方法が必要です。**I/O多重化**システムコール——`select(2)`、`poll(2)`、Linux固有の`epoll(7)`——は、単一のスレッドが多くのファイルディスクリプタの準備完了イベントを同時に待てるようにします。エッジトリガーモードの`epoll`は、ほぼすべての高並行サーバー（nginx、Node.js、Redis）のバックボーンです。これは**準備完了モデル**です：OSはデータが*読み取り可能な状態になった*ことをアプリケーションに通知し、アプリケーション自身が実際の`read()`を行います。",
              },
              {
                en: "**True async I/O** goes one step further: the application submits the I/O request and specifies a buffer, and the OS (or hardware) fills the buffer and notifies the application when complete — the application never calls `read()` itself. This is a **completion model**. Linux's `io_uring` (since 5.1, 2019) is the modern Linux completion-based async I/O interface. The application submits requests into a shared submission ring and harvests completions from a completion ring — all without blocking syscalls in the hot path. Windows IOCP (I/O Completion Ports) is the equivalent on Windows and is why Windows server I/O has historically been efficient. Cross-link: these models are critical for understanding [operating system](/docs/os) scheduling and [networking](/docs/network) server design.",
                ja: "**真の非同期I/O**はさらに一歩進みます：アプリケーションはI/Oリクエストとバッファを指定して送信し、OSまたはハードウェアはバッファを満たして完了時にアプリケーションに通知します——アプリケーション自身は`read()`を呼び出しません。これは**完了モデル**です。Linuxの`io_uring`（2019年、Linux 5.1以降）は現代のLinuxの完了ベース非同期I/Oインターフェースです。アプリケーションは共有サブミッションリングにリクエストを送信し、コンプリーションリングから完了をハーベストします——ホットパスでブロッキングシステムコールなし。WindowsのIOCP（I/Oコンプリーションポート）はWindowsの同等機能であり、WindowsサーバーI/Oが歴史的に効率的だった理由です。クロスリンク：これらのモデルは[オペレーティングシステム](/docs/os)のスケジューリングと[ネットワーキング](/docs/network)のサーバー設計を理解するために重要です。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "Blocking vs readiness (epoll) vs completion (io_uring) — three models of async I/O.",
              ja: "ブロッキング vs 準備完了（epoll）vs 完了（io_uring）——非同期I/Oの3つのモデル。",
            }}
          >
            <FlowRow
              steps={[
                {
                  label: { en: "Blocking", ja: "ブロッキング" },
                  sub: {
                    en: "thread sleeps until done",
                    ja: "スレッドが完了まで睡眠",
                  },
                },
                {
                  label: {
                    en: "Non-blocking + epoll",
                    ja: "ノンブロッキング + epoll",
                  },
                  sub: {
                    en: "OS signals readiness; app reads",
                    ja: "OSが準備完了を通知；アプリが読み取る",
                  },
                },
                {
                  label: { en: "io_uring / IOCP", ja: "io_uring / IOCP" },
                  sub: {
                    en: "OS fills buffer; app harvests completions",
                    ja: "OSがバッファを満たす；アプリが完了を回収",
                  },
                },
              ]}
            />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 7. Storage I/O                                                    */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="storage"
          title={{ en: "Storage I/O", ja: "ストレージI/O" }}
        >
          <Prose
            paragraphs={[
              {
                en: "Storage devices are **block devices**: they transfer data in fixed-size **sectors** (historically 512 bytes; modern drives use 4096-byte Advanced Format sectors). The OS block layer translates higher-level file operations into read/write requests for specific logical block addresses (LBAs). Multiple requests may be merged and reordered by the **I/O scheduler** (or elevator) to maximise throughput and minimise seek time on HDDs.",
                ja: "ストレージデバイスは**ブロックデバイス**です：固定サイズの**セクタ**（歴史的に512バイト；現代のドライブは4096バイトのAdvanced Formatセクタを使用）でデータを転送します。OSブロックレイヤーは上位レベルのファイル操作を特定の論理ブロックアドレス（LBA）の読み書きリクエストに変換します。複数のリクエストは**I/Oスケジューラ**（またはエレベーター）によってマージされ、HDDのスループットを最大化しシーク時間を最小化するために並べ替えられます。",
              },
              {
                en: "A **hard disk drive (HDD)** stores data on spinning magnetic platters. To read a sector, the actuator arm must move the read/write head to the correct track (**seek**, 2–10 ms average), wait for the disk to rotate the target sector under the head (**rotational latency**, 0–8 ms, average ~4 ms at 7200 RPM), and then transfer the data (**transfer time**, < 1 ms per sector). The seek and rotational latency dominate and are fundamentally limited by mechanics. A **solid-state drive (SSD)** has no moving parts: data is stored in NAND flash cells and accessed through an internal controller via PCIe/NVMe. Read latencies of 50–100 µs are typical, and with NVMe the queue depth can reach 65535 commands — far beyond the 32–256 of SATA SSDs or the 1 of HDDs (without NCQ).",
                ja: "**ハードディスクドライブ（HDD）**はデータをスピニング磁気プラッタに保存します。セクタを読み取るには、アクチュエータアームが読み書きヘッドを正しいトラックに移動し（**シーク**、平均2〜10ミリ秒）、ディスクが目標セクタをヘッドの下に回転させるのを待ち（**回転レイテンシ**、7200RPMで0〜8ミリ秒、平均約4ミリ秒）、データを転送する（**転送時間**、セクタあたり1ミリ秒未満）必要があります。シークと回転レイテンシが支配的で、根本的にメカニズムによって制限されます。**ソリッドステートドライブ（SSD）**には動く部品がありません：データはNANDフラッシュセルに保存され、PCIe/NVMe経由の内部コントローラからアクセスされます。50〜100マイクロ秒の読み取りレイテンシが一般的で、NVMeではキュー深度が65535コマンドに達します——SATA SSDの32〜256や（NCQなしの）HDDの1をはるかに超えます。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "HDD vs SSD — key I/O characteristics.",
              ja: "HDD vs SSD——主要なI/O特性の比較。",
            }}
          >
            <CompareTable
              headers={[
                { en: "Metric", ja: "指標" },
                { en: "HDD (7200 RPM)", ja: "HDD（7200 RPM）" },
                { en: "NVMe SSD", ja: "NVMe SSD" },
              ]}
              rows={[
                [
                  {
                    en: "Random read latency",
                    ja: "ランダム読み取りレイテンシ",
                  },
                  { en: "4–10 ms", ja: "4〜10ミリ秒" },
                  { en: "50–100 µs", ja: "50〜100マイクロ秒" },
                ],
                [
                  {
                    en: "Sequential throughput",
                    ja: "シーケンシャルスループット",
                  },
                  { en: "100–200 MB/s", ja: "100〜200 MB/s" },
                  { en: "3–7 GB/s", ja: "3〜7 GB/s" },
                ],
                [
                  { en: "Random IOPS (4K)", ja: "ランダムIOPS（4K）" },
                  { en: "75–150", ja: "75〜150" },
                  { en: "500,000–1,000,000", ja: "50万〜100万" },
                ],
                [
                  { en: "Queue depth", ja: "キュー深度" },
                  { en: "1 (32 with NCQ)", ja: "1（NCQで32）" },
                  { en: "65,535", ja: "65,535" },
                ],
                [
                  { en: "Power (active)", ja: "消費電力（動作時）" },
                  { en: "6–10 W", ja: "6〜10 W" },
                  { en: "3–8 W", ja: "3〜8 W" },
                ],
                [
                  { en: "Moving parts", ja: "可動部品" },
                  { en: "Yes — platters, heads", ja: "あり——プラッタ、ヘッド" },
                  { en: "None", ja: "なし" },
                ],
              ]}
            />
          </Figure>

          <P
            t={{
              en: "The three key storage metrics are **IOPS** (I/O Operations Per Second — how many random 4K reads/writes per second the device sustains), **throughput** (sequential MB/s — how fast streaming reads/writes run), and **latency** (time for a single operation). For most databases and transactional workloads, IOPS and latency dominate. For analytics and media, throughput dominates. These metrics often trade off: a high IOPS NVMe drive may not saturate PCIe bandwidth on a sequential read, and a RAID array of HDDs can have high throughput but terrible IOPS.",
              ja: "ストレージの3つの主要指標は**IOPS**（毎秒I/O操作数——デバイスが維持するランダム4K読み書きの毎秒数）、**スループット**（シーケンシャルMB/s——ストリーミング読み書きの速度）、**レイテンシ**（単一操作の時間）です。ほとんどのデータベースとトランザクションワークロードでは、IOPSとレイテンシが支配的です。分析とメディアでは、スループットが支配的です。これらの指標はしばしばトレードオフになります：高IOPS NVMeドライブはシーケンシャル読み取りでPCIe帯域幅を飽和させない場合があり、HDDのRAIDアレイは高スループットを持てますがIOPSが悲惨なことがあります。",
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 8. Performance                                                    */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="performance"
          title={{
            en: "I/O performance techniques",
            ja: "I/O性能向上テクニック",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "**Interrupt coalescing** addresses the per-interrupt overhead problem. Instead of raising an IRQ for every single received packet or completed disk sector, the device hardware (or NIC firmware) batches events and fires one interrupt for a group of completions. Linux NAPI (New API) for network drivers works this way: on the first packet the ISR fires and disables the IRQ, then a poll loop drains all buffered packets, and only re-enables the IRQ when the queue is empty. This dramatically reduces interrupt overhead at high packet rates while still ensuring low latency at low loads.",
                ja: "**割り込みコアレッシング**は割り込みごとのオーバーヘッドの問題に対処します。受信パケットや完了したディスクセクタ1つずつにIRQを発行する代わりに、デバイスハードウェア（またはNICファームウェア）はイベントをバッチ処理し、一群の完了に対して1つの割り込みを発行します。ネットワークドライバのLinux NAPI（New API）はこのように動作します：最初のパケットでISRが発行されIRQを無効化し、ポーリングループがバッファされたすべてのパケットを処理し、キューが空になったときにのみIRQを再有効化します。これにより、低負荷時の低レイテンシを維持しながら、高パケットレートでの割り込みオーバーヘッドが劇的に削減されます。",
              },
              {
                en: "**Zero-copy I/O** avoids redundant memory copies along the data path. In a traditional `read()` + `write()` loop, data flows: disk DMA → kernel page cache → user buffer (copy 1) → socket buffer (copy 2) → NIC DMA. The two intermediate copies through user space are pure overhead. `sendfile(2)` (Linux) allows the kernel to transfer data directly from the page cache to the NIC buffer without ever touching user space, reducing it to: disk DMA → kernel page cache → NIC DMA. For TLS, `ktls` (kernel TLS) can encrypt in-place in the kernel, keeping zero-copy possible. This is why file serving in nginx (and most web servers) is significantly faster than a naive user-space copy.",
                ja: "**ゼロコピーI/O**はデータパスに沿った冗長なメモリコピーを回避します。従来の`read()` + `write()`ループでは、データが流れます：ディスクDMA → カーネルページキャッシュ → ユーザーバッファ（コピー1）→ ソケットバッファ（コピー2）→ NIC DMA。ユーザー空間を経由する2つの中間コピーは純粋なオーバーヘッドです。`sendfile(2)`（Linux）を使うと、カーネルはユーザー空間に触れることなくページキャッシュからNICバッファに直接データを転送でき、ディスクDMA → カーネルページキャッシュ → NIC DMAに削減されます。TLSでは、`ktls`（カーネルTLS）がカーネル内でインプレース暗号化を行い、ゼロコピーを可能に保ちます。これがnginx（とほとんどのWebサーバー）のファイル配信が単純なユーザー空間コピーより大幅に高速な理由です。",
              },
              {
                en: "**Context switches and syscalls** have non-trivial costs. A syscall requires a mode switch from user space to kernel space (saving registers, changing the privilege level, TLB considerations), executing kernel code, and switching back. On modern x86-64 hardware a `syscall`/`sysret` round trip is roughly 100–200 ns without any actual work — but cache pollution from the kernel execution can make the total cost much higher. This is why `io_uring`'s shared-memory ring design is so effective: many I/O operations can be batched into a single `io_uring_enter()` syscall, or even submitted without any syscall when the kernel is in polling mode (`IORING_SETUP_SQPOLL`). Cross-link: syscall overhead also matters for [networking](/docs/network) — a busy server can spend 30–60% of CPU time in kernel code.",
                ja: "**コンテキストスイッチとシステムコール**は無視できないコストを持ちます。システムコールにはユーザー空間からカーネル空間へのモード切り替え（レジスタの保存、権限レベルの変更、TLBの考慮）、カーネルコードの実行、そして切り替えの戻りが必要です。現代のx86-64ハードウェアでは`syscall`/`sysret`の往復は実際の処理なしで約100〜200ナノ秒ですが——カーネル実行によるキャッシュ汚染で総コストははるかに高くなる可能性があります。これが`io_uring`の共有メモリリング設計が非常に効果的な理由です：多くのI/O操作を単一の`io_uring_enter()`システムコールにバッチ処理でき、さらにカーネルがポーリングモード（`IORING_SETUP_SQPOLL`）のときはシステムコールなしで送信さえできます。クロスリンク：システムコールのオーバーヘッドは[ネットワーキング](/docs/network)にも重要です——ビジーサーバーはCPU時間の30〜60%をカーネルコードで費やすことがあります。",
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
                term: "Interrupt",
                def: {
                  en: "A hardware signal that causes the CPU to suspend the current instruction stream, save its state, and jump to an Interrupt Service Routine (ISR) to handle a device event.",
                  ja: "CPUに現在の命令ストリームをサスペンドさせ、状態を保存し、デバイスイベントを処理するために割り込みサービスルーチン（ISR）にジャンプさせるハードウェア信号。",
                },
              },
              {
                term: "DMA",
                def: {
                  en: "Direct Memory Access — a mechanism allowing a device or DMA controller to transfer data directly between device memory and main memory without CPU involvement for each byte.",
                  ja: "ダイレクトメモリアクセス——デバイスまたはDMAコントローラがCPUが各バイトに関与することなくデバイスメモリとメインメモリの間で直接データを転送できるメカニズム。",
                },
              },
              {
                term: "Driver",
                def: {
                  en: "A kernel software module that knows the hardware-specific details of one device family and translates generic OS I/O requests into device register writes, DMA setup, and IRQ handling.",
                  ja: "1つのデバイスファミリーのハードウェア固有の詳細を知り、汎用OSのI/Oリクエストをデバイスレジスタ書き込み、DMA設定、IRQ処理に変換するカーネルソフトウェアモジュール。",
                },
              },
              {
                term: "syscall",
                def: {
                  en: "System call — a controlled entry point into the OS kernel, used by user-space programs to request privileged operations such as I/O, memory mapping, or process creation.",
                  ja: "システムコール——ユーザー空間プログラムがI/O、メモリマッピング、プロセス生成などの特権操作を要求するために使用するOSカーネルへの制御されたエントリポイント。",
                },
              },
              {
                term: "MMIO",
                def: {
                  en: "Memory-Mapped I/O — placing device registers into the CPU's regular address space so normal load/store instructions access hardware registers.",
                  ja: "メモリマップドI/O——通常のロード/ストア命令がハードウェアレジスタにアクセスできるよう、デバイスレジスタをCPUの通常アドレス空間に配置すること。",
                },
              },
              {
                term: "IOPS",
                def: {
                  en: "I/O Operations Per Second — a storage performance metric counting how many discrete read or write operations a device can sustain per second, usually measured with small (4KB) random requests.",
                  ja: "毎秒I/O操作数——デバイスが毎秒維持できる個別の読み書き操作の数を測るストレージ性能指標で、通常は小さな（4KB）ランダムリクエストで測定される。",
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
                "Arpaci-Dusseau — Operating Systems: Three Easy Pieces (OSTEP)",
              href: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
              note: {
                en: "Free textbook with dedicated chapters on I/O devices, hard disk drives, RAID, and file systems. Chapter 36–38 cover I/O hardware and interrupts in depth.",
                ja: "I/Oデバイス、ハードディスク、RAID、ファイルシステムの専用章を持つ無料教科書。第36〜38章がI/Oハードウェアと割り込みを深く扱う。",
              },
            },
            {
              title: "Axboe — Efficient IO with io_uring (whitepaper)",
              href: "https://kernel.dk/io_uring.pdf",
              note: {
                en: "The original design paper for io_uring by its author Jens Axboe — explains the submission/completion ring design, polling mode, and performance rationale.",
                ja: "io_uringの作者Jens Axboeによる元の設計論文——サブミッション/コンプリーションリング設計、ポーリングモード、性能の根拠を説明する。",
              },
            },
            {
              title: "Wikipedia — Direct memory access",
              href: "https://en.wikipedia.org/wiki/Direct_memory_access",
              note: {
                en: "Solid overview of DMA hardware variants, scatter-gather, IOMMU, and cache coherence considerations.",
                ja: "DMAハードウェアの変種、スキャッタギャザー、IOMMU、キャッシュコヒーレンシの考慮事項の概説。",
              },
            },
            {
              title: "Wikipedia — Interrupt",
              href: "https://en.wikipedia.org/wiki/Interrupt",
              note: {
                en: "Covers hardware vs software interrupts, IRQ lines, the APIC, interrupt latency, and handling on multiple CPU architectures.",
                ja: "ハードウェア割り込みとソフトウェア割り込み、IRQライン、APIC、割り込みレイテンシ、複数CPUアーキテクチャでの処理を扱う。",
              },
            },
            {
              title: "Linux kernel documentation",
              href: "https://docs.kernel.org/",
              note: {
                en: "Primary reference for the Linux block layer, NVMe driver, NAPI, io_uring, and DMA API. See the 'driver-api' and 'block' subsections.",
                ja: "Linuxブロックレイヤー、NVMeドライバ、NAPI、io_uring、DMA APIの第一次リファレンス。'driver-api'と'block'サブセクションを参照。",
              },
            },
            {
              title: "POSIX — read(2) / write(2) man pages",
              href: "https://pubs.opengroup.org/onlinepubs/9699919799/functions/read.html",
              note: {
                en: "The authoritative specification for blocking POSIX I/O semantics, including error codes and signal interactions.",
                ja: "エラーコードとシグナルの相互作用を含むブロッキングPOSIX I/Oセマンティクスの権威ある仕様。",
              },
            },
            {
              title: "Wikipedia — Memory-mapped I/O",
              href: "https://en.wikipedia.org/wiki/Memory-mapped_I/O_and_port-mapped_I/O",
              note: {
                en: "Comparison of MMIO and PMIO with historical context and architecture-specific examples.",
                ja: "歴史的背景とアーキテクチャ固有の例を含むMMIOとPMIOの比較。",
              },
            },
          ]}
        />
      </Article>
    </DocsShell>
  );
}

// ---------------------------------------------------------------------------
// Interrupt lifecycle SVG diagram
// ---------------------------------------------------------------------------

function InterruptDiagram() {
  const sid = useSvgId();
  return (
    <Diagram
      label={{
        en: "Interrupt lifecycle: device raises IRQ, CPU saves state, runs ISR, then restores and resumes",
        ja: "割り込みライフサイクル：デバイスがIRQを発行し、CPUが状態を保存し、ISRを実行し、復元して再開する",
      }}
      viewBox="0 0 600 240"
      maxHeight={240}
    >
      <defs>
        <marker
          id={sid("arr")}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0,0 L7,3.5 L0,7 z" fill={C.accent} />
        </marker>
        <marker
          id={sid("arrw")}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0,0 L7,3.5 L0,7 z" fill={C.warn} />
        </marker>
        <marker
          id={sid("arrg")}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0,0 L7,3.5 L0,7 z" fill={C.high} />
        </marker>
      </defs>

      <rect width="600" height="240" fill={C.panel} rx="8" />

      {/* Device box */}
      <rect
        x="10"
        y="90"
        width="90"
        height="50"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="55"
        y="111"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        Device
      </text>
      <text x="55" y="127" textAnchor="middle" fill={C.faint} fontSize="9">
        NIC / disk
      </text>

      {/* Step 1: IRQ line */}
      <line
        x1="100"
        y1="115"
        x2="148"
        y2="115"
        stroke={C.warn}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arrw")})`}
      />
      <text x="124" y="108" textAnchor="middle" fill={C.warn} fontSize="9">
        IRQ
      </text>

      {/* APIC box */}
      <rect
        x="150"
        y="90"
        width="80"
        height="50"
        rx="6"
        fill={C.muted}
        stroke={C.warn}
        strokeWidth="1.5"
      />
      <text
        x="190"
        y="111"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        APIC
      </text>
      <text x="190" y="127" textAnchor="middle" fill={C.faint} fontSize="9">
        priority
      </text>

      {/* Step 2: deliver to CPU */}
      <line
        x1="230"
        y1="115"
        x2="278"
        y2="115"
        stroke={C.warn}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arrw")})`}
      />
      <text x="254" y="108" textAnchor="middle" fill={C.warn} fontSize="9">
        INT
      </text>

      {/* CPU box */}
      <rect
        x="280"
        y="60"
        width="90"
        height="110"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="325"
        y="85"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        CPU
      </text>
      <text x="325" y="101" textAnchor="middle" fill={C.faint} fontSize="9">
        finish instr
      </text>
      <text x="325" y="116" textAnchor="middle" fill={C.faint} fontSize="9">
        save state
      </text>
      <text x="325" y="131" textAnchor="middle" fill={C.faint} fontSize="9">
        look up IDT
      </text>
      <text x="325" y="146" textAnchor="middle" fill={C.faint} fontSize="9">
        jump to ISR
      </text>
      <text x="325" y="161" textAnchor="middle" fill={C.faint} fontSize="9">
        IRET restore
      </text>

      {/* Step 3: jump to ISR */}
      <line
        x1="370"
        y1="100"
        x2="418"
        y2="80"
        stroke={C.high}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arrg")})`}
      />

      {/* ISR box */}
      <rect
        x="420"
        y="40"
        width="100"
        height="60"
        rx="6"
        fill={C.muted}
        stroke={C.high}
        strokeWidth="1.5"
      />
      <text
        x="470"
        y="63"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        ISR
      </text>
      <text x="470" y="79" textAnchor="middle" fill={C.faint} fontSize="9">
        read data
      </text>
      <text x="470" y="92" textAnchor="middle" fill={C.faint} fontSize="9">
        ACK device
      </text>

      {/* IRET back */}
      <path
        d="M420 90 Q390 130 370 150"
        fill="none"
        stroke={C.accent}
        strokeWidth="1.5"
        strokeDasharray="4 2"
        markerEnd={`url(#${sid("arr")})`}
      />

      {/* Resumed task box */}
      <rect
        x="420"
        y="140"
        width="120"
        height="50"
        rx="6"
        fill={C.muted}
        stroke={C.faint}
        strokeWidth="1"
      />
      <text
        x="480"
        y="162"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        Interrupted task
      </text>
      <text x="480" y="178" textAnchor="middle" fill={C.faint} fontSize="9">
        resumed at PC+0
      </text>

      {/* IRET arrow to resumed */}
      <line
        x1="420"
        y1="155"
        x2="372"
        y2="155"
        stroke={C.accent}
        strokeWidth="1"
        strokeDasharray="3 2"
      />

      {/* Labels bottom */}
      <text x="55" y="210" textAnchor="middle" fill={C.faint} fontSize="9">
        ① device done
      </text>
      <text x="190" y="210" textAnchor="middle" fill={C.faint} fontSize="9">
        ② IRQ prioritised
      </text>
      <text x="325" y="210" textAnchor="middle" fill={C.faint} fontSize="9">
        ③ state saved
      </text>
      <text x="470" y="210" textAnchor="middle" fill={C.faint} fontSize="9">
        ④ ISR → IRET resume
      </text>
    </Diagram>
  );
}

// ---------------------------------------------------------------------------
// DMA path SVG diagram
// ---------------------------------------------------------------------------

function DmaDiagram() {
  const sid = useSvgId();
  return (
    <Diagram
      label={{
        en: "DMA transfer path: device transfers data directly to memory via DMA controller; CPU is freed and receives one interrupt on completion",
        ja: "DMA転送パス：デバイスがDMAコントローラ経由でメモリに直接データを転送；CPUは解放され完了時に1回の割り込みを受け取る",
      }}
      viewBox="0 0 580 200"
      maxHeight={200}
    >
      <defs>
        <marker
          id={sid("arr")}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0,0 L7,3.5 L0,7 z" fill={C.accent} />
        </marker>
        <marker
          id={sid("arrg")}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0,0 L7,3.5 L0,7 z" fill={C.high} />
        </marker>
        <marker
          id={sid("arrw")}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0,0 L7,3.5 L0,7 z" fill={C.warn} />
        </marker>
      </defs>

      <rect width="580" height="200" fill={C.panel} rx="8" />

      {/* Device */}
      <rect
        x="10"
        y="70"
        width="90"
        height="50"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="55"
        y="91"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        Device
      </text>
      <text x="55" y="107" textAnchor="middle" fill={C.faint} fontSize="9">
        disk / NIC
      </text>

      {/* Arrow: device → DMA ctrl */}
      <line
        x1="100"
        y1="95"
        x2="158"
        y2="95"
        stroke={C.accent}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arr")})`}
      />
      <text x="129" y="88" textAnchor="middle" fill={C.faint} fontSize="9">
        data bus
      </text>

      {/* DMA Controller */}
      <rect
        x="160"
        y="55"
        width="110"
        height="80"
        rx="6"
        fill={C.muted}
        stroke={C.high}
        strokeWidth="1.5"
      />
      <text
        x="215"
        y="82"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        DMA Ctrl
      </text>
      <text x="215" y="98" textAnchor="middle" fill={C.faint} fontSize="9">
        addr + count
      </text>
      <text x="215" y="112" textAnchor="middle" fill={C.faint} fontSize="9">
        programmed by CPU
      </text>
      <text x="215" y="126" textAnchor="middle" fill={C.faint} fontSize="9">
        steals bus cycles
      </text>

      {/* Arrow: DMA → Memory */}
      <line
        x1="270"
        y1="95"
        x2="348"
        y2="95"
        stroke={C.high}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arrg")})`}
      />
      <text x="309" y="88" textAnchor="middle" fill={C.high} fontSize="9">
        DMA write
      </text>

      {/* Memory */}
      <rect
        x="350"
        y="55"
        width="100"
        height="80"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="400"
        y="82"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        Main Memory
      </text>
      <text x="400" y="98" textAnchor="middle" fill={C.faint} fontSize="9">
        DRAM
      </text>
      <text x="400" y="113" textAnchor="middle" fill={C.faint} fontSize="9">
        target buffer
      </text>

      {/* CPU — to the right, free */}
      <rect
        x="470"
        y="55"
        width="90"
        height="80"
        rx="6"
        fill={C.muted}
        stroke={C.faint}
        strokeWidth="1"
      />
      <text
        x="515"
        y="88"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        CPU
      </text>
      <text x="515" y="104" textAnchor="middle" fill={C.high} fontSize="9">
        other work
      </text>
      <text x="515" y="119" textAnchor="middle" fill={C.faint} fontSize="9">
        (freed)
      </text>

      {/* Completion interrupt: DMA → CPU */}
      <path
        d="M270 65 Q370 20 468 75"
        fill="none"
        stroke={C.warn}
        strokeWidth="1.5"
        strokeDasharray="5 2"
        markerEnd={`url(#${sid("arrw")})`}
      />
      <text x="365" y="25" textAnchor="middle" fill={C.warn} fontSize="9">
        1× IRQ on completion
      </text>

      {/* CPU setup arrow (thin, dashed) */}
      <path
        d="M468 110 Q380 155 272 130"
        fill="none"
        stroke={C.faint}
        strokeWidth="1"
        strokeDasharray="3 2"
        markerEnd={`url(#${sid("arr")})`}
      />
      <text x="370" y="165" textAnchor="middle" fill={C.faint} fontSize="9">
        ① CPU programs DMA: addr, count
      </text>
    </Diagram>
  );
}
