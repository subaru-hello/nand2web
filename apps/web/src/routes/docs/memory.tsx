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
  Prose,
  References,
  Section,
  useSvgId,
} from "../../features/docs";

export const Route = createFileRoute("/docs/memory")({
  component: Page,
});

function Page() {
  return (
    <DocsShell active="memory">
      <Article
        title={{ en: "Memory", ja: "メモリ" }}
        lead={{
          en: "Every program you run is, at its core, a battle against one stubborn physical law: fast memory is small and expensive, while large memory is slow. Understanding how computers manage this tradeoff — from sub-nanosecond registers to petabyte object stores — is essential for writing performant software and reasoning about system behaviour.",
          ja: "実行するすべてのプログラムは、本質的に一つの物理的法則との戦いです：高速なメモリは小さく高価であり、大容量メモリは低速です。サブナノ秒のレジスタからペタバイト規模のオブジェクトストアまで、コンピュータがこのトレードオフをどのように管理するかを理解することは、高性能なソフトウェアを書き、システムの動作を推論するうえで不可欠です。",
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* 1. What "memory" means                                            */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="what-is-memory"
          title={{ en: 'What "memory" means', ja: "メモリとは何か" }}
        >
          <Prose
            paragraphs={[
              {
                en: 'When a programmer writes `array[i]`, they interact with an abstraction: a flat, uniform address space where every location feels equally accessible. This is an illusion. Under the hood, "memory" is a hierarchy of physically distinct storage technologies, each with radically different speeds, capacities, and costs. The job of the hardware and OS together is to maintain this illusion cheaply.',
                ja: "プログラマーが`array[i]`と書くとき、彼らは一つの抽象と対話しています：すべての場所に均等にアクセスできるように見える、フラットで均一なアドレス空間。これは幻想です。内部では、「メモリ」は物理的に異なるストレージ技術の階層であり、それぞれ速度・容量・コストが根本的に異なります。ハードウェアとOSが協力してこの幻想を安価に維持するのが目標です。",
              },
              {
                en: "The fundamental tradeoff is rooted in physics and economics. Transistors used as SRAM cells (cache) can switch in under a nanosecond, but each bit requires 6 transistors and sits on an expensive process node close to the CPU. DRAM packs a bit into a single capacitor and transistor, achieving much higher density at far lower cost per bit — but that capacitor leaks charge and must be refreshed thousands of times per second, introducing latency. Magnetic disks and flash trade latency for yet more capacity at cents per gigabyte. No single technology wins on all axes.",
                ja: "根本的なトレードオフは物理学と経済学に根ざしています。SRAMセル（キャッシュ）として使用されるトランジスタはサブナノ秒で切り替わることができますが、1ビットに6つのトランジスタが必要で、CPUに近い高価なプロセスノード上に配置されます。DRAMは1ビットを単一のコンデンサとトランジスタに収め、はるかに高い密度をビットあたりのコストを大幅に下げて実現しますが、そのコンデンサは電荷が漏れ、毎秒数千回リフレッシュする必要があり、レイテンシが発生します。磁気ディスクとフラッシュは、1ギガバイトあたり数セントでさらに大容量を実現するためにレイテンシをトレードします。すべての軸で勝る単一の技術は存在しません。",
              },
              {
                en: "The insight that makes computers practical is that most programs exhibit **locality** — they repeatedly access the same small set of memory locations. By placing a tiny, fast cache between the CPU and slow RAM, and keeping recently-used data there, the hardware can serve the *vast majority* of accesses at cache speed. The slow path — actually going to DRAM — happens far less often than you might fear. Understanding when locality breaks down (and it does) is the key to writing cache-friendly code.",
                ja: "コンピュータを実用的にする洞察は、ほとんどのプログラムが**局所性**を示すことです——同じ小さなメモリ領域のセットに繰り返しアクセスします。CPUと低速RAMの間に小さく高速なキャッシュを配置し、最近使用されたデータをそこに保持することで、ハードウェアはアクセスの*大部分*をキャッシュ速度で処理できます。遅いパス——実際にDRAMにアクセスする——は思ったよりはるかにまれにしか起きません。局所性がいつ崩れるかを理解すること（それは確かに起きます）が、キャッシュフレンドリーなコードを書くための鍵です。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 2. The memory hierarchy                                           */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="hierarchy"
          title={{
            en: "The memory hierarchy",
            ja: "メモリ階層",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "The memory hierarchy is a pyramid: at the top, a handful of registers inside the CPU core, each accessible in under a clock cycle. Below that, L1 cache (a few dozen kilobytes, ~1 ns), then L2 (~256 KB–1 MB, ~4 ns), then a shared L3 (several megabytes, ~15 ns). Below the caches sits DRAM — gigabytes of main memory at ~100 ns. Then NVMe SSD (~100 µs), spinning hard disk (~10 ms), and finally network storage (milliseconds to seconds). Each level down is roughly one to three orders of magnitude slower, but one to three orders of magnitude cheaper per bit.",
                ja: "メモリ階層はピラミッド型です：最上部にはCPUコア内のわずかなレジスタがあり、1クロックサイクル以内にアクセスできます。その下にL1キャッシュ（数十キロバイト、約1 ns）、L2（約256 KB〜1 MB、約4 ns）、共有L3（数メガバイト、約15 ns）があります。キャッシュの下にはDRAMがあります——数ギガバイトのメインメモリで約100 nsです。その下にNVMe SSD（約100 µs）、回転式ハードディスク（約10 ms）、そして最後にネットワークストレージ（ミリ秒から秒）があります。各レベルが下がるごとに約1〜3桁遅くなりますが、1ビットあたりのコストも1〜3桁安くなります。",
              },
              {
                en: "The practical implication: a cache miss that forces a DRAM access costs ~100× a cache hit. A page fault that hits SSD costs another ~1000× beyond that. A network round-trip adds yet another ~10–100×. These are not small constants — they dominate the runtime of any system that doesn't fit in cache. The numbers below are approximate but stable across a wide range of hardware generations.",
                ja: "実際的な意味：DRAMアクセスを強制するキャッシュミスは、キャッシュヒットの約100倍のコストがかかります。SSDにヒットするページフォルトはさらにその約1000倍のコストがかかります。ネットワークのラウンドトリップはさらに約10〜100倍を加えます。これらは小さな定数ではありません——キャッシュに収まらないシステムの実行時間を支配します。以下の数値は近似値ですが、広い範囲のハードウェア世代にわたって安定しています。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "The memory hierarchy — from fastest/smallest to slowest/largest.",
              ja: "メモリ階層——最速・最小から最低速・最大へ。",
            }}
          >
            <LayerStack
              layers={[
                {
                  label: { en: "Registers", ja: "レジスタ" },
                  sub: {
                    en: "< 1 ns · bytes · on-die",
                    ja: "< 1 ns · バイト単位 · ダイ上",
                  },
                  tone: "emerald",
                },
                {
                  label: { en: "L1 Cache", ja: "L1キャッシュ" },
                  sub: {
                    en: "~1 ns · 32–64 KB · per core",
                    ja: "~1 ns · 32〜64 KB · コアごと",
                  },
                  tone: "emerald",
                },
                {
                  label: { en: "L2 Cache", ja: "L2キャッシュ" },
                  sub: {
                    en: "~4 ns · 256 KB–1 MB · per core",
                    ja: "~4 ns · 256 KB〜1 MB · コアごと",
                  },
                  tone: "accent",
                },
                {
                  label: { en: "L3 Cache", ja: "L3キャッシュ" },
                  sub: {
                    en: "~15 ns · 4–64 MB · shared",
                    ja: "~15 ns · 4〜64 MB · 共有",
                  },
                  tone: "accent",
                },
                {
                  label: {
                    en: "DRAM (Main Memory)",
                    ja: "DRAM（メインメモリ）",
                  },
                  sub: {
                    en: "~100 ns · GBs · DIMMs",
                    ja: "~100 ns · GB単位 · DIMM",
                  },
                  tone: "zinc",
                },
                {
                  label: { en: "NVMe SSD", ja: "NVMe SSD" },
                  sub: { en: "~100 µs · TBs", ja: "~100 µs · TB単位" },
                  tone: "zinc",
                },
                {
                  label: { en: "HDD / Network", ja: "HDD / ネットワーク" },
                  sub: {
                    en: "~10 ms / ~ms–s · unlimited",
                    ja: "~10 ms / ~ms〜s · 無制限",
                  },
                  tone: "zinc",
                },
              ]}
            />
          </Figure>

          <Figure
            caption={{
              en: "Approximate latency and capacity at each hierarchy level.",
              ja: "各階層レベルの概算レイテンシと容量。",
            }}
          >
            <CompareTable
              headers={[
                { en: "Level", ja: "レベル" },
                { en: "Latency", ja: "レイテンシ" },
                { en: "Typical capacity", ja: "典型的な容量" },
                { en: "Technology", ja: "技術" },
              ]}
              rows={[
                [
                  { en: "Registers", ja: "レジスタ" },
                  { en: "< 1 ns", ja: "< 1 ns" },
                  { en: "Bytes (32–64 regs)", ja: "バイト（32〜64個）" },
                  { en: "SRAM flip-flop", ja: "SRAMフリップフロップ" },
                ],
                [
                  { en: "L1 Cache", ja: "L1キャッシュ" },
                  { en: "~1 ns (4 cycles)", ja: "~1 ns（4サイクル）" },
                  { en: "32–64 KB", ja: "32〜64 KB" },
                  { en: "SRAM", ja: "SRAM" },
                ],
                [
                  { en: "L2 Cache", ja: "L2キャッシュ" },
                  { en: "~4 ns (12 cycles)", ja: "~4 ns（12サイクル）" },
                  { en: "256 KB – 1 MB", ja: "256 KB〜1 MB" },
                  { en: "SRAM", ja: "SRAM" },
                ],
                [
                  { en: "L3 Cache", ja: "L3キャッシュ" },
                  { en: "~15 ns (40 cycles)", ja: "~15 ns（40サイクル）" },
                  { en: "4 – 64 MB", ja: "4〜64 MB" },
                  { en: "SRAM (larger cells)", ja: "SRAM（大型セル）" },
                ],
                [
                  { en: "DRAM", ja: "DRAM" },
                  { en: "~100 ns", ja: "~100 ns" },
                  { en: "4 GB – 1 TB", ja: "4 GB〜1 TB" },
                  {
                    en: "Capacitor + transistor",
                    ja: "コンデンサ＋トランジスタ",
                  },
                ],
                [
                  { en: "NVMe SSD", ja: "NVMe SSD" },
                  { en: "~100 µs", ja: "~100 µs" },
                  { en: "500 GB – 8 TB", ja: "500 GB〜8 TB" },
                  { en: "NAND flash", ja: "NANDフラッシュ" },
                ],
                [
                  { en: "HDD", ja: "HDD" },
                  { en: "~10 ms", ja: "~10 ms" },
                  { en: "1 – 20 TB", ja: "1〜20 TB" },
                  { en: "Magnetic spinning disk", ja: "磁気回転ディスク" },
                ],
                [
                  { en: "Network (LAN)", ja: "ネットワーク（LAN）" },
                  { en: "~0.1 – 1 ms", ja: "~0.1〜1 ms" },
                  { en: "Effectively unlimited", ja: "事実上無制限" },
                  { en: "Packet-switched", ja: "パケット交換" },
                ],
              ]}
            />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 3. Locality                                                        */}
        {/* ---------------------------------------------------------------- */}
        <Section id="locality" title={{ en: "Locality", ja: "局所性" }}>
          <Prose
            paragraphs={[
              {
                en: "The memory hierarchy only works because real programs don't access memory randomly — they exhibit **locality**. There are two flavours. **Temporal locality** means that if a location is accessed now, it is likely to be accessed again soon. Loop counters, hot code paths, and frequently-read variables are classic examples. **Spatial locality** means that if location X is accessed, nearby locations X+1, X+2 … are likely to be accessed soon as well. Iterating over an array, scanning a packet header, or executing sequential instructions all exploit spatial locality.",
                ja: "メモリ階層が機能するのは、実際のプログラムがメモリにランダムにアクセスしないからです——**局所性**を示します。2種類あります。**時間的局所性**とは、ある場所が今アクセスされた場合、近い将来また同じ場所にアクセスされる可能性が高いことを意味します。ループカウンタ、ホットなコードパス、頻繁に読まれる変数が典型的な例です。**空間的局所性**とは、場所Xにアクセスした場合、近隣の場所X+1、X+2…にもすぐアクセスされる可能性が高いことを意味します。配列の反復、パケットヘッダのスキャン、または順次命令の実行はすべて空間的局所性を活用します。",
              },
              {
                en: "Caches exploit both forms. When data is fetched from DRAM, the hardware doesn't bring back a single byte — it brings an entire **cache line** (typically 64 bytes on x86). This amortises the DRAM row-activation cost and exploits spatial locality. Because the line stays resident, subsequent accesses to nearby addresses hit the cache (temporal locality). Programs that destroy locality — chasing pointer chains across a linked list, randomly accessing a hash table larger than L3, striding through a matrix column-major when it's stored row-major — pay the DRAM penalty on nearly every access.",
                ja: "キャッシュは両方の形態を活用します。DRAMからデータがフェッチされるとき、ハードウェアは単一バイトを取り戻すのではありません——**キャッシュライン**全体（x86では通常64バイト）を取り込みます。これはDRAMの行活性化コストを償却し、空間的局所性を活用します。ラインが常駐しているため、近隣アドレスへの後続アクセスはキャッシュにヒットします（時間的局所性）。局所性を破壊するプログラム——リンクリストのポインタチェーンを追う、L3より大きいハッシュテーブルにランダムアクセスする、行優先で格納されている行列を列優先でストライドする——はほぼすべてのアクセスでDRAMペナルティを支払います。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 4. Caches                                                          */}
        {/* ---------------------------------------------------------------- */}
        <Section id="caches" title={{ en: "Caches", ja: "キャッシュ" }}>
          <Prose
            paragraphs={[
              {
                en: "A **cache** is a small, fast memory managed by hardware (not software) that sits between the CPU and DRAM. Every cache is divided into fixed-size **cache lines** — the atomic unit of transfer between cache and DRAM. On virtually all current x86 and ARM processors, a cache line is **64 bytes**. When the CPU reads address A and misses the cache, the hardware fetches the 64-byte line containing A from DRAM and installs it in the cache. If the CPU next reads A+8, the line is already present — a hit.",
                ja: "**キャッシュ**は、ソフトウェアではなくハードウェアが管理する、CPUとDRAMの間に位置する小さく高速なメモリです。すべてのキャッシュは固定サイズの**キャッシュライン**に分割されています——キャッシュとDRAM間の転送の原子単位です。事実上すべての現行x86およびARMプロセッサでは、キャッシュラインは**64バイト**です。CPUがアドレスAを読み込んでキャッシュをミスすると、ハードウェアはAを含む64バイトのラインをDRAMからフェッチしてキャッシュにインストールします。CPUが次にA+8を読み込むと、ラインはすでに存在しています——ヒットです。",
              },
              {
                en: "To find where a cache line lives (or should go), the hardware splits each address into three fields: the **tag** (upper bits, identifies which main-memory line), the **index** (middle bits, selects a cache set), and the **block offset** (lower bits, selects a byte within the line). In a **direct-mapped** cache, each main-memory line can live in exactly one cache set — simple hardware, but prone to conflict misses when two hot lines map to the same set. A **set-associative** cache (2-way, 4-way, 8-way) gives each index a small number of **ways** (slots) where a line can live; hardware checks all ways simultaneously. **Fully-associative** caches (like the TLB) have one big set — any line can go anywhere — but are expensive to build at scale.",
                ja: "キャッシュラインの位置（またはどこに置くべきか）を見つけるために、ハードウェアは各アドレスを3つのフィールドに分割します：**タグ**（上位ビット、どのメインメモリラインかを識別）、**インデックス**（中位ビット、キャッシュセットを選択）、**ブロックオフセット**（下位ビット、ライン内のバイトを選択）。**ダイレクトマップ**キャッシュでは、各メインメモリラインはちょうど1つのキャッシュセットに格納できます——シンプルなハードウェアですが、2つのホットラインが同じセットにマップされるときにコンフリクトミスが発生しやすいです。**セット連想**キャッシュ（2ウェイ、4ウェイ、8ウェイ）は各インデックスに少数の**ウェイ**（スロット）を与え、ラインがそこに格納できます；ハードウェアはすべてのウェイを同時にチェックします。**フル連想**キャッシュ（TLBのような）は1つの大きなセットを持ち——どのラインもどこにでも置ける——しかし大規模に構築するには高価です。",
              },
              {
                en: "When a set is full and a new line must be installed, the hardware must **evict** an existing line. The standard policy is **LRU** (Least Recently Used): evict whichever way hasn't been touched the longest. Approximations of LRU (pseudo-LRU, PLRU) are used in practice because true LRU requires per-way timestamps. On a **write hit**, the cache can either update the cache and also write through to DRAM immediately (**write-through**) or just mark the line **dirty** and defer the DRAM write until eviction (**write-back**). Write-back is more common in L1/L2 because it avoids redundant DRAM traffic; write-through is simpler and used where coherency is critical. You can observe cache behaviour live in the nand2web [cache simulator](/arch).",
                ja: "セットがいっぱいになり新しいラインをインストールしなければならないとき、ハードウェアは既存のラインを**退避**（エビクト）する必要があります。標準ポリシーは**LRU**（最も最近使用されていない）です：最も長くアクセスされていないウェイを退避します。真のLRUはウェイごとのタイムスタンプが必要なため、LRUの近似（擬似LRU、PLRU）が実際には使用されます。**ライトヒット**時、キャッシュはキャッシュを更新して即座にDRAMにも書き込む（**ライトスルー**）か、ラインを**ダーティ**とマークして退避まで書き込みを延期する（**ライトバック**）かのどちらかを選択できます。ライトバックはDRAMトラフィックを削減するためL1/L2でより一般的です；ライトスルーはシンプルでコヒーレンシが重要な場所に使用されます。nand2webの[キャッシュシミュレーター](/arch)でキャッシュの動作をリアルタイムで観察できます。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "Address split: tag | index | offset — how hardware locates a cache line.",
              ja: "アドレス分割：タグ | インデックス | オフセット——ハードウェアがキャッシュラインを特定する方法。",
            }}
          >
            <AddressSplitDiagram />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 5. Virtual memory                                                  */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="virtual-memory"
          title={{ en: "Virtual memory", ja: "仮想メモリ" }}
        >
          <Prose
            paragraphs={[
              {
                en: "Every user process believes it owns a private, contiguous address space starting at address 0. This is another hardware-enforced illusion called **virtual memory**. The CPU issues **virtual addresses** (VAs); the Memory Management Unit (MMU) — a dedicated circuit on the CPU die — translates them to **physical addresses** (PAs) before the memory request leaves the chip. This translation is driven by a per-process **page table** maintained by the OS kernel.",
                ja: "すべてのユーザープロセスは、アドレス0から始まるプライベートで連続したアドレス空間を所有していると信じています。これは**仮想メモリ**と呼ばれる、ハードウェアが強制するもう一つの幻想です。CPUは**仮想アドレス**（VA）を発行し、MMU（メモリ管理ユニット）——CPUダイ上の専用回路——がメモリリクエストがチップを離れる前にそれを**物理アドレス**（PA）に変換します。この変換はOSカーネルが維持するプロセスごとの**ページテーブル**によって駆動されます。",
              },
              {
                en: "Memory is divided into fixed-size **pages** (typically 4 KB on x86-64, with optional 2 MB / 1 GB huge pages). The page table maps each virtual page number (VPN) to a physical frame number (PFN), along with permission bits (read/write/execute, user/kernel). When the OS needs to reclaim physical memory, it can **swap** a page to disk and mark the entry invalid. The next access to that page causes a **page fault** — a hardware interrupt that transfers control to the kernel, which loads the page back from disk (or terminates the process if the access was illegal). See [the OS paging model](/docs/os) for how the kernel manages pages.",
                ja: "メモリは固定サイズの**ページ**（x86-64では通常4 KB、オプションで2 MB / 1 GBのヒュージページ）に分割されます。ページテーブルは各仮想ページ番号（VPN）を物理フレーム番号（PFN）にマップし、権限ビット（読み取り/書き込み/実行、ユーザー/カーネル）とともに記録します。OSが物理メモリを回収する必要があるとき、ページをディスクに**スワップ**してエントリを無効とマークできます。そのページへの次のアクセスは**ページフォルト**を引き起こします——カーネルに制御を移すハードウェア割り込みで、カーネルはディスクからページを読み込みます（またはアクセスが不正な場合はプロセスを終了します）。カーネルがページを管理する方法については[OSのページングモデル](/docs/os)を参照してください。",
              },
              {
                en: "Walking the page table on every memory access would add multiple DRAM accesses per instruction — unacceptable. The hardware caches recent VA→PA translations in the **TLB** (Translation Lookaside Buffer), a tiny fully-associative cache of ~64–2048 entries. A **TLB hit** requires no page table walk; the PA pops out in ~1 cycle. A **TLB miss** triggers a hardware page-table walker (on x86) or a software handler (on RISC-V with RISC-V Sv39). Context switches flush the TLB (or tag entries with an address-space ID — ASID — to avoid flushing). Virtual memory also enables memory-mapped files, shared libraries, copy-on-write fork, and guard pages — all critical OS primitives. Try the [paging simulator](/os) to walk through translations interactively.",
                ja: "すべてのメモリアクセスでページテーブルを辿ると、命令ごとに複数のDRAMアクセスが追加されます——これは許容できません。ハードウェアは最近のVA→PA変換を**TLB**（Translation Lookaside Buffer）にキャッシュします——約64〜2048エントリの小さなフル連想キャッシュです。**TLBヒット**はページテーブルウォークを必要とせず、PAは約1サイクルで出力されます。**TLBミス**はハードウェアのページテーブルウォーカー（x86では）またはソフトウェアハンドラー（RISC-V Sv39では）を起動します。コンテキストスイッチはTLBをフラッシュします（またはアドレス空間ID——ASID——でエントリにタグを付けてフラッシュを回避します）。仮想メモリはメモリマップドファイル、共有ライブラリ、コピーオンライトのfork、ガードページも可能にします——すべて重要なOSのプリミティブです。[ページングシミュレーター](/os)でインタラクティブに変換を辿ってみてください。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "Virtual-to-physical address translation via TLB and page table.",
              ja: "TLBとページテーブルを経由した仮想アドレスから物理アドレスへの変換。",
            }}
          >
            <VaToPhysDiagram />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 6. DRAM & the memory wall                                         */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="dram"
          title={{ en: "DRAM & the memory wall", ja: "DRAMとメモリの壁" }}
        >
          <Prose
            paragraphs={[
              {
                en: "**DRAM** (Dynamic RAM) stores each bit as charge on a tiny capacitor paired with a single access transistor. This is extraordinarily dense — a modern DDR5 DIMM packs 64 billion bits into a stick smaller than a pen. The downside is that capacitors leak; a DRAM row must be **refreshed** (read, then rewritten) every ~64 ms. During a refresh, that row is unavailable, introducing periodic latency. DRAM is also organised into **banks** of rows and columns. Reading data requires **activating** (charging) a row into a row buffer, then **precharging** back before the next activation. Row activation alone takes ~30–50 ns, which is the dominant component of DRAM latency. Modern DDR standards (DDR4, DDR5, LPDDR5) use wide buses (64-bit data channel) and burst transfers to hide some of this latency, but the physics haven't changed.",
                ja: "**DRAM**（ダイナミックRAM）は各ビットを単一のアクセストランジスタとペアになった小さなコンデンサへの電荷として格納します。これは非常に高密度です——最新のDDR5 DIMは、ペンより小さなスティックに640億ビットを収めます。欠点はコンデンサが電荷を漏らすことで、DRAMの行は約64ミリ秒ごとに**リフレッシュ**（読み取り後、書き戻し）する必要があります。リフレッシュ中、その行は利用できず、定期的なレイテンシが発生します。DRAMはまた行と列の**バンク**に編成されています。データを読み取るには、行をロウバッファに**アクティブ化**（充電）し、次のアクティブ化の前に**プリチャージ**する必要があります。行アクティブ化だけで約30〜50 nsかかり、これがDRAMレイテンシの主要な成分です。最新のDDR規格（DDR4、DDR5、LPDDR5）は幅広いバス（64ビットデータチャネル）とバースト転送を使用してこのレイテンシの一部を隠しますが、物理は変わっていません。",
              },
              {
                en: "The **memory wall** refers to the widening gap between CPU clock speed and DRAM latency. From ~1980 to ~2005, CPU clock speeds doubled every two years (Moore's Law applied to frequency). DRAM latency improved much more slowly — only ~7% per year. By 2005, a 3 GHz CPU could execute ~3 billion instructions per second, but a DRAM access still took ~100 ns (~300 cycles). Most of the benefit of faster CPUs was consumed waiting for memory. The industry's response was the cache hierarchy (to avoid DRAM as much as possible), **hardware prefetchers** (to issue DRAM requests before the CPU needs the data), and multi-level memory controllers. Yet the wall persists: for data-intensive workloads that don't fit in cache — database scans, ML training, sparse graph algorithms — DRAM bandwidth and latency are the binding constraints.",
                ja: "**メモリの壁**とは、CPUクロック速度とDRAMレイテンシの間の広がり続けるギャップを指します。約1980年から約2005年まで、CPUクロック速度は2年ごとに倍増しました（周波数に適用されたムーアの法則）。DRAMレイテンシの改善はずっと遅く——年約7%のみ。2005年までに、3 GHzのCPUは毎秒約30億命令を実行できましたが、DRAMアクセスはまだ約100 ns（約300サイクル）かかりました。より高速なCPUの恩恵のほとんどはメモリを待つことに費やされました。業界の対応はキャッシュ階層（DRAMをできるだけ避けるため）、**ハードウェアプリフェッチャー**（CPUがデータを必要とする前にDRAMリクエストを発行するため）、そして多層メモリコントローラーでした。しかし壁は続いています：キャッシュに収まらないデータ集約型ワークロード——データベーススキャン、ML訓練、疎なグラフアルゴリズム——では、DRAMの帯域幅とレイテンシが制約となります。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 7. The programmer's view                                          */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="programmer-view"
          title={{ en: "The programmer's view", ja: "プログラマーの視点" }}
        >
          <Prose
            paragraphs={[
              {
                en: "From a programmer's perspective, memory is divided into the **stack** and the **heap** (plus read-only text/data segments). The stack holds automatic variables and function call frames; it grows and shrinks with a stack pointer and is extremely cache-friendly because recent frames are always hot. The heap is a large pool of memory managed manually (C's `malloc`/`free`) or by a garbage collector. Heap allocations can be scattered across a wide virtual address range, breaking spatial locality.",
                ja: "プログラマーの観点から、メモリは**スタック**と**ヒープ**（さらに読み取り専用のテキスト/データセグメント）に分かれています。スタックは自動変数と関数呼び出しフレームを保持し、スタックポインタで成長・縮小し、最近のフレームは常にホットなため非常にキャッシュフレンドリーです。ヒープはC言語の`malloc`/`free`またはガベージコレクタによって手動で管理される大きなメモリプールです。ヒープ割り当ては広い仮想アドレス範囲に散在する可能性があり、空間的局所性を壊します。",
              },
              {
                en: "Cache-friendly layout is one of the highest-leverage performance techniques available to the programmer. **Arrays** of structs with contiguous memory layout (or better, struct-of-arrays layouts) iterate with excellent spatial locality — each cache line loaded contains several useful elements. **Linked lists**, by contrast, chain heap nodes that may be megabytes apart; traversal is a sequence of cache misses. Classic benchmark: sequential scan of a 1 M-element array vs. traversal of a 1 M-element singly-linked list — the array is typically 5–50× faster, with the gap widening as the list grows beyond L3. This is not a C/C++ artefact; it affects every language that uses heap-allocated nodes (Java, Python, Rust with `Box<Node>`).",
                ja: "キャッシュフレンドリーなレイアウトは、プログラマーが利用できる最も効果の高いパフォーマンス技術の一つです。連続したメモリレイアウトを持つ構造体の**配列**（またはより良い構造体の配列レイアウト）は優れた空間的局所性で反復します——ロードされた各キャッシュラインには複数の有用な要素が含まれます。対照的に、**リンクリスト**はメガバイト単位で離れている可能性のあるヒープノードをチェーンします；トラバーサルはキャッシュミスのシーケンスです。古典的なベンチマーク：100万要素の配列の順次スキャン vs. 100万要素の単方向リンクリストのトラバーサル——配列は通常5〜50倍高速で、リストがL3を超えて成長するにつれてギャップが広がります。これはC/C++固有の問題ではありません；ヒープ割り当てノードを使用するすべての言語（Java、Python、`Box<Node>`を使用したRust）に影響します。",
              },
              {
                en: "**False sharing** is a subtle multi-core pitfall. Even if two threads access different variables, if those variables share a cache line, each write by one core invalidates the line in the other core's cache (via the MESI protocol), causing the other core to re-fetch the line from L3 or DRAM. The fix is to pad data structures so that independently-written fields land on separate cache lines — a common technique in concurrent queue and ring-buffer implementations.",
                ja: "**偽共有**は微妙なマルチコアの落とし穴です。2つのスレッドが異なる変数にアクセスしていても、それらの変数がキャッシュラインを共有している場合、一方のコアによる各書き込みは他のコアのキャッシュ内のライン（MESIプロトコルを通じて）を無効化し、他のコアがL3またはDRAMからラインを再フェッチするようになります。修正はデータ構造をパディングして、独立して書き込まれるフィールドが別々のキャッシュラインに配置されるようにすることです——同時キューとリングバッファ実装の一般的なテクニックです。",
              },
            ]}
          />

          <Callout
            tone="insight"
            title={{
              en: "The 1000× rule of thumb",
              ja: "1000倍の経験則",
            }}
            t={{
              en: "A cache hit costs ~1–4 cycles. A DRAM miss costs ~200–300 cycles. A disk page fault costs ~100,000–10,000,000 cycles. Keep your working set in cache; avoid streaming data that doesn't fit. When in doubt, measure — profilers like `perf` can show L1/L2/L3 miss rates directly.",
              ja: "キャッシュヒットは約1〜4サイクルのコストがかかります。DRAMミスは約200〜300サイクルのコストがかかります。ディスクページフォルトは約100,000〜10,000,000サイクルのコストがかかります。ワーキングセットをキャッシュに収め、収まらないデータのストリーミングを避けましょう。疑わしいときは計測しましょう——`perf`のようなプロファイラーはL1/L2/L3のミス率を直接表示できます。",
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 8. Modern reality                                                  */}
        {/* ---------------------------------------------------------------- */}
        <Section id="modern" title={{ en: "Modern reality", ja: "現代の実態" }}>
          <Prose
            paragraphs={[
              {
                en: "**NUMA** (Non-Uniform Memory Access) is the norm on any system with multiple CPU sockets. Each socket has local DRAM (fast) and remote DRAM on other sockets (accessed via the inter-socket interconnect — AMD Infinity Fabric, Intel UPI — adding ~50–200 ns). The OS NUMA-aware allocator tries to place a thread's memory on the socket running that thread, but large, shared data structures still cause remote traffic. `numactl` and CPU affinity settings matter for latency-sensitive workloads.",
                ja: "**NUMA**（不均一メモリアクセス）は、複数のCPUソケットを持つシステムでは標準です。各ソケットはローカルDRAM（高速）と他のソケット上のリモートDRAM（ソケット間インターコネクト——AMD Infinity Fabric、Intel UPIを経由してアクセス——約50〜200 nsを追加）を持ちます。OSのNUMA対応アロケータはスレッドのメモリをそのスレッドを実行するソケットに配置しようとしますが、大きな共有データ構造は依然としてリモートトラフィックを引き起こします。`numactl`とCPUアフィニティ設定はレイテンシ敏感なワークロードに重要です。",
              },
              {
                en: "**HBM** (High Bandwidth Memory) stacks DRAM dies directly on top of (or beside) the CPU/GPU die using Through-Silicon Vias (TSVs), connected by an extremely wide bus (1024+ bits). This yields 10–20× more memory bandwidth than DDR at the cost of limited capacity (~16–128 GB) and high manufacturing complexity. HBM is standard on GPUs (NVIDIA H100 uses HBM3 at ~3.35 TB/s), AI accelerators, and some HPC processors (AMD EPYC with 3D V-Cache uses a variant). The memory wall is fundamentally a bandwidth problem for AI workloads — HBM is the current answer.",
                ja: "**HBM**（High Bandwidth Memory）はThrough-Silicon Via（TSV）を使用してDRAMダイをCPU/GPUダイの上（または隣）に直接積み重ね、非常に幅広いバス（1024ビット以上）で接続します。これはDDRの10〜20倍のメモリ帯域幅をもたらしますが、容量が限られ（約16〜128 GB）、製造が複雑になります。HBMはGPU（NVIDIA H100はHBM3で約3.35 TB/sを使用）、AIアクセラレーター、一部のHPCプロセッサ（AMD EPYC 3D V-Cache）の標準です。AIワークロードにとってメモリの壁は根本的に帯域幅の問題です——HBMが現在の答えです。",
              },
              {
                en: "**Hardware prefetchers** watch access patterns and issue DRAM reads speculatively before a miss occurs. A stride prefetcher detects regular strides (e.g. a struct field accessed every 64 bytes) and fetches ahead. An indirect prefetcher (present on newer CPUs) can detect pointer-chasing patterns in some cases. **Software prefetch** instructions (`_mm_prefetch` in C, `__builtin_prefetch` in GCC) give the programmer direct control. **Persistent memory** (Intel Optane DCPMM, now discontinued, and emerging CXL-attached memory pools) sits between DRAM and SSD in latency (~300 ns), persists across power cycles, and changes how storage systems are architected — byte-addressable durability without the write amplification of SSD. CXL (Compute Express Link) is the emerging standard for attaching heterogeneous memory (DRAM pools, HBM, persistent) to CPUs over PCIe lanes.",
                ja: "**ハードウェアプリフェッチャー**はアクセスパターンを監視し、ミスが発生する前に投機的にDRAMの読み取りを発行します。ストライドプリフェッチャーは規則的なストライド（例：64バイトごとにアクセスされる構造体フィールド）を検出して先読みします。間接プリフェッチャー（新しいCPUに存在）は一部のケースでポインタチェーシングパターンを検出できます。**ソフトウェアプリフェッチ**命令（Cの`_mm_prefetch`、GCCの`__builtin_prefetch`）はプログラマーに直接制御を与えます。**パーシステントメモリ**（インテルOptane DCPMM、現在は廃止、そして新興のCXL接続メモリプール）はレイテンシ（約300 ns）においてDRAMとSSDの間に位置し、電源サイクルをまたいで持続し、ストレージシステムのアーキテクチャを変える——SSDの書き込み増幅なしのバイトアドレス可能な耐久性。CXL（Compute Express Link）はPCIeレーン上でCPUに異種メモリ（DRAMプール、HBM、パーシステント）を接続するための新興標準です。",
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
                term: "Cache line",
                def: {
                  en: "The atomic unit of transfer between cache and DRAM — typically 64 bytes. All cache operations are line-granular.",
                  ja: "キャッシュとDRAM間の転送の原子単位——通常64バイト。すべてのキャッシュ操作はライン粒度。",
                },
              },
              {
                term: "TLB",
                def: {
                  en: "Translation Lookaside Buffer — a fully-associative cache of recent VA→PA translations, eliminating page-table walks on hot pages.",
                  ja: "Translation Lookaside Buffer——最近のVA→PA変換の全連想キャッシュ。ホットなページのページテーブルウォークを排除。",
                },
              },
              {
                term: "Page fault",
                def: {
                  en: "A hardware interrupt fired when the CPU accesses a virtual page that has no valid page-table entry — either because it is swapped to disk, not yet mapped, or an illegal access.",
                  ja: "有効なページテーブルエントリを持たない仮想ページにCPUがアクセスしたときに発生するハードウェア割り込み——ディスクにスワップされているか、まだマップされていないか、または不正アクセスの場合。",
                },
              },
              {
                term: "Locality",
                def: {
                  en: "The empirical tendency of programs to access memory in clusters (temporal: same address again soon; spatial: nearby addresses soon). The entire cache hierarchy exploits locality.",
                  ja: "プログラムがクラスター状にメモリにアクセスする経験的傾向（時間的：同じアドレスにすぐ再アクセス；空間的：近隣アドレスにすぐアクセス）。キャッシュ階層全体が局所性を活用。",
                },
              },
              {
                term: "Latency",
                def: {
                  en: "The time from issuing a memory request to receiving the data — measured in nanoseconds for cache/DRAM, microseconds for SSD, milliseconds for disk/network.",
                  ja: "メモリリクエストの発行からデータ受信までの時間——キャッシュ/DRAMはナノ秒、SSDはマイクロ秒、ディスク/ネットワークはミリ秒単位で計測。",
                },
              },
              {
                term: "Bandwidth",
                def: {
                  en: "The sustainable rate of data transfer, in bytes per second. DRAM has ~50–100 GB/s per channel; L1 cache can feed ~500 GB/s. Distinct from latency — you can have high bandwidth and high latency (e.g. HDD with large sequential reads).",
                  ja: "持続可能なデータ転送レート（バイト毎秒）。DRAMはチャネルあたり約50〜100 GB/s；L1キャッシュは約500 GB/sを供給できる。レイテンシとは別——高帯域幅かつ高レイテンシにもなりえる（例：大きなシーケンシャル読み取りのHDD）。",
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
                'Ulrich Drepper — "What Every Programmer Should Know About Memory"',
              href: "https://www.akkadia.org/drepper/cpumemory.pdf",
              note: {
                en: "The definitive deep-dive into DRAM, caches, TLBs, and cache-friendly programming — still accurate a decade later.",
                ja: "DRAM・キャッシュ・TLB・キャッシュフレンドリーなプログラミングへの決定版の深掘り——10年後も正確。",
              },
            },
            {
              title:
                "Colin Scott — Latency Numbers Every Programmer Should Know (interactive)",
              href: "https://colin-scott.github.io/personal_website/research/interactive_latency.html",
              note: {
                en: "Interactive chart showing how hardware latency numbers have evolved over time — bookmarkable reference.",
                ja: "ハードウェアのレイテンシ数値の経年変化を示すインタラクティブチャート——ブックマーク必須のリファレンス。",
              },
            },
            {
              title: "Patterson & Hennessy — Computer Organization and Design",
              href: "https://en.wikipedia.org/wiki/Computer_Organization_and_Design",
              note: {
                en: "Chapters 5–6 cover caches, virtual memory, and the memory hierarchy with detailed worked examples.",
                ja: "第5〜6章でキャッシュ・仮想メモリ・メモリ階層を詳細な例題とともに解説。",
              },
            },
            {
              title: "Wikipedia — CPU cache",
              href: "https://en.wikipedia.org/wiki/CPU_cache",
              note: {
                en: "Solid overview of cache organisation, associativity, replacement policies, and coherence protocols.",
                ja: "キャッシュ構成・連想度・置換ポリシー・コヒーレンスプロトコルの堅実な概説。",
              },
            },
            {
              title: "Wikipedia — Virtual memory",
              href: "https://en.wikipedia.org/wiki/Virtual_memory",
              note: {
                en: "Covers paging, segmentation, the TLB, demand paging, and the history of virtual memory systems.",
                ja: "ページング・セグメンテーション・TLB・デマンドページング・仮想メモリシステムの歴史を網羅。",
              },
            },
            {
              title: "Wikipedia — Non-uniform memory access (NUMA)",
              href: "https://en.wikipedia.org/wiki/Non-uniform_memory_access",
              note: {
                en: "Explains NUMA topology, remote vs local memory latency, and OS NUMA-aware scheduling.",
                ja: "NUMAトポロジー・リモートvsローカルメモリレイテンシ・OSのNUMA対応スケジューリングを説明。",
              },
            },
            {
              title: "Wikipedia — High Bandwidth Memory (HBM)",
              href: "https://en.wikipedia.org/wiki/High_Bandwidth_Memory",
              note: {
                en: "Technical overview of HBM stacked DRAM architecture, generations (HBM2/3), and use in GPUs and AI accelerators.",
                ja: "HBM積層DRAMアーキテクチャ・世代（HBM2/3）・GPU/AIアクセラレーターでの使用の技術概説。",
              },
            },
          ]}
        />
      </Article>
    </DocsShell>
  );
}

// ---------------------------------------------------------------------------
// Address-split diagram: shows tag | index | offset fields
// ---------------------------------------------------------------------------

function AddressSplitDiagram() {
  const sid = useSvgId();
  return (
    <Diagram
      label={{
        en: "A 64-bit virtual address split into tag, index, and block offset fields for a set-associative cache",
        ja: "セット連想キャッシュ用にタグ・インデックス・ブロックオフセットフィールドに分割された64ビット仮想アドレス",
      }}
      viewBox="0 0 560 220"
      maxHeight={200}
    >
      <rect width="560" height="220" fill={C.panel} rx="8" />

      {/* Address bit bar */}
      {/* Tag field: bits 63–12, shown as left block */}
      <rect
        x="20"
        y="30"
        width="220"
        height="44"
        rx="4"
        fill={C.muted}
        stroke={C.warn}
        strokeWidth="1.5"
      />
      <text
        x="130"
        y="52"
        textAnchor="middle"
        fill={C.warn}
        fontSize="13"
        fontWeight="700"
      >
        tag
      </text>
      <text x="130" y="68" textAnchor="middle" fill={C.faint} fontSize="10">
        bits 63 – 12
      </text>

      {/* Index field: bits 11–6 */}
      <rect
        x="244"
        y="30"
        width="148"
        height="44"
        rx="4"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="318"
        y="52"
        textAnchor="middle"
        fill={C.accent}
        fontSize="13"
        fontWeight="700"
      >
        index
      </text>
      <text x="318" y="68" textAnchor="middle" fill={C.faint} fontSize="10">
        bits 11 – 6
      </text>

      {/* Offset field: bits 5–0 */}
      <rect
        x="396"
        y="30"
        width="144"
        height="44"
        rx="4"
        fill={C.muted}
        stroke={C.high}
        strokeWidth="1.5"
      />
      <text
        x="468"
        y="52"
        textAnchor="middle"
        fill={C.high}
        fontSize="13"
        fontWeight="700"
      >
        offset
      </text>
      <text x="468" y="68" textAnchor="middle" fill={C.faint} fontSize="10">
        bits 5 – 0 (64 B line)
      </text>

      {/* Down-arrows */}
      <line
        x1="130"
        y1="74"
        x2="130"
        y2="108"
        stroke={C.warn}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("aw")})`}
      />
      <line
        x1="318"
        y1="74"
        x2="318"
        y2="108"
        stroke={C.accent}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("ab")})`}
      />
      <line
        x1="468"
        y1="74"
        x2="468"
        y2="108"
        stroke={C.high}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("ag")})`}
      />

      {/* Action boxes */}
      <rect
        x="50"
        y="110"
        width="160"
        height="38"
        rx="4"
        fill={C.muted}
        stroke={C.warn}
        strokeWidth="1"
      />
      <text x="130" y="130" textAnchor="middle" fill={C.text} fontSize="11">
        Compare tag in all ways
      </text>
      <text x="130" y="144" textAnchor="middle" fill={C.faint} fontSize="10">
        → hit or miss
      </text>

      <rect
        x="234"
        y="110"
        width="168"
        height="38"
        rx="4"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1"
      />
      <text x="318" y="130" textAnchor="middle" fill={C.text} fontSize="11">
        Select cache set
      </text>
      <text x="318" y="144" textAnchor="middle" fill={C.faint} fontSize="10">
        sets = 2^index_bits
      </text>

      <rect
        x="406"
        y="110"
        width="134"
        height="38"
        rx="4"
        fill={C.muted}
        stroke={C.high}
        strokeWidth="1"
      />
      <text x="468" y="130" textAnchor="middle" fill={C.text} fontSize="11">
        Byte within line
      </text>
      <text x="468" y="144" textAnchor="middle" fill={C.faint} fontSize="10">
        0 – 63
      </text>

      {/* Legend label */}
      <text x="280" y="190" textAnchor="middle" fill={C.faint} fontSize="11">
        64-byte cache line → 6 offset bits; 64 sets → 6 index bits
      </text>

      <defs>
        <marker
          id={sid("aw")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.warn} />
        </marker>
        <marker
          id={sid("ab")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.accent} />
        </marker>
        <marker
          id={sid("ag")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.high} />
        </marker>
      </defs>
    </Diagram>
  );
}

// ---------------------------------------------------------------------------
// Virtual-to-physical address translation diagram
// ---------------------------------------------------------------------------

function VaToPhysDiagram() {
  const sid = useSvgId();
  return (
    <Diagram
      label={{
        en: "Virtual address translation: the MMU checks the TLB first; on a miss it walks the page table to find the physical address",
        ja: "仮想アドレス変換：MMUはまずTLBを確認し、ミスの場合はページテーブルをウォークして物理アドレスを探す",
      }}
      viewBox="0 0 560 260"
      maxHeight={240}
    >
      <rect width="560" height="260" fill={C.panel} rx="8" />

      {/* CPU box */}
      <rect
        x="20"
        y="100"
        width="90"
        height="50"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="65"
        y="122"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="600"
      >
        CPU
      </text>
      <text x="65" y="138" textAnchor="middle" fill={C.faint} fontSize="10">
        VA issued
      </text>

      {/* Arrow CPU → MMU */}
      <line
        x1="110"
        y1="125"
        x2="148"
        y2="125"
        stroke={C.accent}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("ma")})`}
      />
      <text x="129" y="118" textAnchor="middle" fill={C.faint} fontSize="9">
        VA
      </text>

      {/* MMU box */}
      <rect
        x="150"
        y="100"
        width="80"
        height="50"
        rx="6"
        fill={C.muted}
        stroke={C.warn}
        strokeWidth="1.5"
      />
      <text
        x="190"
        y="122"
        textAnchor="middle"
        fill={C.warn}
        fontSize="12"
        fontWeight="600"
      >
        MMU
      </text>
      <text x="190" y="138" textAnchor="middle" fill={C.faint} fontSize="10">
        translate
      </text>

      {/* Arrow MMU → TLB */}
      <line
        x1="230"
        y1="115"
        x2="278"
        y2="95"
        stroke={C.accent}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("ma")})`}
      />
      <text x="252" y="100" textAnchor="middle" fill={C.faint} fontSize="9">
        lookup
      </text>

      {/* TLB box */}
      <rect
        x="280"
        y="60"
        width="100"
        height="50"
        rx="6"
        fill={C.muted}
        stroke={C.high}
        strokeWidth="1.5"
      />
      <text
        x="330"
        y="82"
        textAnchor="middle"
        fill={C.high}
        fontSize="12"
        fontWeight="600"
      >
        TLB
      </text>
      <text x="330" y="98" textAnchor="middle" fill={C.faint} fontSize="10">
        VA→PA cache
      </text>

      {/* TLB hit arrow → physical memory */}
      <line
        x1="380"
        y1="85"
        x2="458"
        y2="85"
        stroke={C.high}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("mg")})`}
      />
      <text x="419" y="78" textAnchor="middle" fill={C.high} fontSize="9">
        hit → PA
      </text>

      {/* Page table box */}
      <rect
        x="280"
        y="160"
        width="100"
        height="50"
        rx="6"
        fill={C.muted}
        stroke={C.faint}
        strokeWidth="1.5"
      />
      <text
        x="330"
        y="180"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        Page Table
      </text>
      <text x="330" y="196" textAnchor="middle" fill={C.faint} fontSize="10">
        VPN → PFN
      </text>

      {/* TLB miss arrow down to page table */}
      <line
        x1="330"
        y1="110"
        x2="330"
        y2="158"
        stroke={C.faint}
        strokeWidth="1.5"
        strokeDasharray="4 2"
        markerEnd={`url(#${sid("mf")})`}
      />
      <text x="344" y="138" fill={C.faint} fontSize="9">
        miss
      </text>

      {/* Page table → physical memory */}
      <line
        x1="380"
        y1="185"
        x2="458"
        y2="185"
        stroke={C.accent}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("ma")})`}
      />
      <text x="419" y="178" textAnchor="middle" fill={C.faint} fontSize="9">
        PA
      </text>

      {/* Physical memory box */}
      <rect
        x="460"
        y="60"
        width="80"
        height="180"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="500"
        y="138"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        Physical
      </text>
      <text
        x="500"
        y="154"
        textAnchor="middle"
        fill={C.text}
        fontSize="11"
        fontWeight="600"
      >
        Memory
      </text>
      <text x="500" y="172" textAnchor="middle" fill={C.faint} fontSize="10">
        (DRAM)
      </text>

      {/* Page fault note */}
      <text x="280" y="230" textAnchor="middle" fill={C.faint} fontSize="10">
        page not present → page fault → OS loads from disk
      </text>

      <defs>
        <marker
          id={sid("ma")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.accent} />
        </marker>
        <marker
          id={sid("mg")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.high} />
        </marker>
        <marker
          id={sid("mf")}
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
