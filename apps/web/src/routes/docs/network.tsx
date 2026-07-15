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
  rich,
  Section,
  useSvgId,
  useT,
} from "../../features/docs";
import {
  NETWORK_HISTORY_FURTHER_READING,
  NETWORK_HISTORY_STAGES,
} from "../../features/network-history/data";
import { makeDocJsonLd, makeHead } from "../../features/seo/seo";

const NETWORK_TITLE = "Networking — nand2web";
const NETWORK_DESC =
  "Networking moves bits reliably between machines centimetres or thousands of kilometres apart — from physical signals on a wire to routing, TCP handshakes, and the application protocols browsers speak every day.";

export const Route = createFileRoute("/docs/network")({
  head: () =>
    makeHead({
      title: NETWORK_TITLE,
      description: NETWORK_DESC,
      path: "/docs/network",
      jsonLd: makeDocJsonLd({
        title: NETWORK_TITLE,
        description: NETWORK_DESC,
        path: "/docs/network",
        breadcrumbLabel: "Networking",
      }),
    }),
  component: Page,
});

function Page() {
  return (
    <DocsShell active="network">
      <Article
        title={{ en: "Networking", ja: "ネットワーク" }}
        lead={{
          en: "Networking is the discipline of moving bits reliably and efficiently between machines that may be centimetres or thousands of kilometres apart. It encompasses the physical signals on a wire, the addressing and routing of packets across the globe, the handshakes that guarantee delivery, and the application protocols that browsers, email clients, and APIs speak every day.",
          ja: "ネットワークとは、数センチから数千キロメートル離れたマシン間でビットを確実かつ効率的に転送するための学問分野です。ケーブル上の物理信号、世界規模でのパケットのアドレッシングとルーティング、確実な配送を保証するハンドシェイク、そしてブラウザ・メールクライアント・APIが日常的に使用するアプリケーションプロトコルまでを包括します。",
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* 0. History & Mental Models                                        */}
        {/* ---------------------------------------------------------------- */}
        <NetworkHistorySection />

        {/* ---------------------------------------------------------------- */}
        {/* 1. What networking is                                             */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="what"
          title={{ en: "What networking is", ja: "ネットワークとは何か" }}
        >
          <Prose
            paragraphs={[
              {
                en: "At its core, a network is nothing more than a system for moving bits from one address to another. What makes that hard is scale and uncertainty: the world has billions of machines, countless intermediate nodes, and links that can fail, congest, or reorder packets in transit.",
                ja: "ネットワークの本質は、あるアドレスから別のアドレスへビットを転送するシステムにすぎません。それを難しくするのはスケールと不確実性です——世界には数十億台のマシン、無数の中間ノード、そして障害・輻輳・パケット並べ替えが起きうるリンクが存在します。",
              },
              {
                en: "The foundational design choice made in the 1970s (ARPANET) is **packet switching**: data is chopped into variable-size chunks called *packets* (each up to the link's MTU, e.g. ~1500 bytes on Ethernet), each labelled with source and destination addresses. Packets travel independently through the network, potentially taking different paths, and are reassembled at the destination. The alternative — **circuit switching** (telephone networks) — reserves a dedicated end-to-end path for the duration of a call. Packet switching wins for data because it multiplexes many conversations onto the same link without pre-allocating resources.",
                ja: "1970年代（ARPANET）に採用された根本的な設計選択が**パケット交換**です：データは*パケット*と呼ばれる可変サイズの塊（それぞれリンクのMTUまで、例：Ethernetでは約1500バイト）に分割され、それぞれに送信元・宛先アドレスが付与されます。パケットはネットワーク内を独立して移動し、異なる経路をたどる可能性があり、宛先で再組み立てされます。代替手段である**回線交換**（電話網）は、通話期間中に専用のエンドツーエンド経路を確保します。パケット交換がデータ通信で優れているのは、リソースを事前に割り当てずに多数の通信を同じリンクに多重化できるからです。",
              },
              {
                en: "**Layering** is the second foundational idea. No single protocol can reasonably handle bit encoding, frame addressing, global routing, reliable delivery, AND application semantics simultaneously. Instead, each layer solves one problem and exposes a clean interface to the layer above. A change in the physical medium (copper → fibre → wireless) should not require rewriting the routing code. The [networking simulators](/net) let you observe each layer in action.",
                ja: "**レイヤリング**が第2の根本的な考え方です。単一のプロトコルがビットエンコーディング・フレームアドレッシング・グローバルルーティング・確実な配送・アプリケーションセマンティクスをすべて同時に合理的に処理することはできません。代わりに、各レイヤーが1つの問題を解決し、上位レイヤーへのクリーンなインターフェースを公開します。物理媒体の変更（銅線→光ファイバー→無線）によってルーティングコードを書き直す必要はありません。[ネットワークシミュレーター](/net)で各レイヤーの動作を観察できます。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 2. The layered model                                              */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="layers"
          title={{
            en: "The layered model",
            ja: "レイヤーモデル",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "Two competing models describe the layers of a network stack. The **OSI model** (Open Systems Interconnection, 1984) defines seven layers: Physical, Data Link, Network, Transport, Session, Presentation, Application. It is a useful conceptual framework, and textbooks love it, but real protocols do not map cleanly onto all seven layers.",
                ja: "ネットワークスタックのレイヤーを記述する2つの競合モデルがあります。**OSIモデル**（Open Systems Interconnection、1984年）は7つのレイヤーを定義します：物理層、データリンク層、ネットワーク層、トランスポート層、セッション層、プレゼンテーション層、アプリケーション層。有用な概念的フレームワークであり、教科書に多用されますが、実際のプロトコルはすべての7層にクリーンにマッピングされるわけではありません。",
              },
              {
                en: 'The **TCP/IP model** (also called the Internet model) collapses these into four practical layers that match how real Internet protocols are built: Link, Internet (Network), Transport, Application. In practice, engineers use the OSI numbering ("Layer 3" = Network, "Layer 4" = Transport) but the TCP/IP four-layer grouping for implementation.',
                ja: "**TCP/IPモデル**（インターネットモデルとも呼ばれる）は、実際のインターネットプロトコルの構成に合わせて4つの実用的なレイヤーにまとめます：リンク層、インターネット層（ネットワーク層）、トランスポート層、アプリケーション層。実際にはエンジニアはOSIの番号付け（「レイヤー3」=ネットワーク、「レイヤー4」=トランスポート）を使いつつ、実装にはTCP/IPの4層グループを使います。",
              },
              {
                en: "**Encapsulation** is how layering works in practice. When you send an HTTP request, the application layer hands a message to the transport layer, which prepends a TCP header (ports, sequence numbers) to produce a *segment*. The network layer prepends an IP header (addresses) to produce a *packet*. The link layer prepends an Ethernet header (MAC addresses) and appends a trailer (CRC) to produce a *frame*. At the destination, each layer strips its header and passes the payload up. You can watch this process in the [encapsulation simulator](/net).",
                ja: "**カプセル化**はレイヤリングが実際にどう機能するかを示します。HTTPリクエストを送信するとき、アプリケーション層がメッセージをトランスポート層に渡し、トランスポート層はTCPヘッダー（ポート・シーケンス番号）を先頭に付加して*セグメント*を生成します。ネットワーク層はIPヘッダー（アドレス）を付加して*パケット*を生成します。リンク層はEthernetヘッダー（MACアドレス）を先頭に付加し、トレーラー（CRC）を末尾に付加して*フレーム*を生成します。宛先ではレイヤーごとにヘッダーが剥がされてペイロードが上位層に渡されます。このプロセスを[カプセル化シミュレーター](/net)で観察できます。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "The TCP/IP four-layer model. Each layer has a distinct responsibility.",
              ja: "TCP/IP の4層モデル。各レイヤーは独自の責任を持つ。",
            }}
          >
            <LayerStack
              layers={[
                {
                  label: {
                    en: "Application",
                    ja: "アプリケーション層",
                  },
                  sub: {
                    en: "HTTP, DNS, TLS, SMTP",
                    ja: "HTTP・DNS・TLS・SMTP",
                  },
                  tone: "accent",
                },
                {
                  label: {
                    en: "Transport",
                    ja: "トランスポート層",
                  },
                  sub: {
                    en: "TCP (reliable), UDP (fast)",
                    ja: "TCP（信頼性）・UDP（高速）",
                  },
                  tone: "emerald",
                },
                {
                  label: {
                    en: "Network (Internet)",
                    ja: "ネットワーク層（インターネット層）",
                  },
                  sub: {
                    en: "IP addressing, routing",
                    ja: "IPアドレッシング・ルーティング",
                  },
                  tone: "zinc",
                },
                {
                  label: {
                    en: "Link (Data Link + Physical)",
                    ja: "リンク層（データリンク＋物理層）",
                  },
                  sub: {
                    en: "Ethernet, Wi-Fi, frames",
                    ja: "Ethernet・Wi-Fi・フレーム",
                  },
                  tone: "zinc",
                },
              ]}
            />
          </Figure>

          <Figure
            caption={{
              en: "Encapsulation: each layer wraps the payload of the layer above.",
              ja: "カプセル化：各レイヤーが上位レイヤーのペイロードをラップする。",
            }}
          >
            <FlowRow
              steps={[
                {
                  label: { en: "HTTP message", ja: "HTTPメッセージ" },
                  sub: { en: "Application", ja: "アプリケーション層" },
                },
                {
                  label: { en: "TCP segment", ja: "TCPセグメント" },
                  sub: {
                    en: "Transport header + data",
                    ja: "TCPヘッダー＋データ",
                  },
                },
                {
                  label: { en: "IP packet", ja: "IPパケット" },
                  sub: {
                    en: "IP header + segment",
                    ja: "IPヘッダー＋セグメント",
                  },
                },
                {
                  label: { en: "Ethernet frame", ja: "Ethernetフレーム" },
                  sub: {
                    en: "MAC header + packet + CRC",
                    ja: "MACヘッダー＋パケット＋CRC",
                  },
                },
              ]}
            />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 3. Link & physical layer                                          */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="link"
          title={{
            en: "Link & physical layer",
            ja: "リンク層と物理層",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "The **physical layer** encodes bits onto a medium: voltage levels on copper, light pulses in fibre, radio waves in Wi-Fi. The **data link layer** groups those bits into *frames* and provides error detection (CRC checksums) and, on shared media, arbitrates access (CSMA/CD for classic Ethernet, CSMA/CA for Wi-Fi).",
                ja: "**物理層**はビットを媒体上にエンコードします：銅線上の電圧レベル、光ファイバー内の光パルス、Wi-Fiの電波。**データリンク層**はそれらのビットを*フレーム*にグループ化し、エラー検出（CRCチェックサム）を提供し、共有媒体上ではアクセスを調停します（クラシックEthernetのCSMA/CD、Wi-FiのCSMA/CA）。",
              },
              {
                en: "**Ethernet** (IEEE 802.3) is the dominant wired LAN technology, running at 1 Gbps, 10 Gbps, or faster. An Ethernet frame starts with a destination **MAC address** (48 bits, burned into the NIC at manufacture — globally unique), a source MAC address, an EtherType field (indicating whether the payload is IPv4, IPv6, ARP, etc.), the payload (up to 1500 bytes by default — the **MTU**), and a 32-bit CRC trailer.",
                ja: "**Ethernet**（IEEE 802.3）は主流の有線LAN技術で、1 Gbps・10 Gbps以上で動作します。Ethernetフレームは、宛先**MACアドレス**（製造時にNICに書き込まれる48ビットのグローバルに一意なアドレス）、送信元MACアドレス、EtherTypeフィールド（ペイロードがIPv4・IPv6・ARPなどであることを示す）、ペイロード（デフォルト最大1500バイト——**MTU**）、32ビットCRCトレーラーから構成されます。",
              },
              {
                en: "**Switches** operate at Layer 2. A switch learns which MAC addresses appear on each port (by observing source MACs of incoming frames) and builds a forwarding table. When a frame arrives, the switch looks up the destination MAC and forwards it out only the correct port — unlike a hub, which floods every port. This is why a switch does not cause unnecessary collisions even in large networks.",
                ja: "**スイッチ**はレイヤー2で動作します。スイッチは各ポートにどのMACアドレスが接続されているかを（受信フレームの送信元MACを観察して）学習し、転送テーブルを構築します。フレームが到着すると、スイッチは宛先MACを検索して正しいポートにのみ転送します——すべてのポートにフラッディングするハブとは異なります。そのためスイッチは大規模ネットワークでも不必要な衝突を起こしません。",
              },
              {
                en: '**ARP** (Address Resolution Protocol) bridges Layer 2 and Layer 3: given an IP address, ARP broadcasts "who has this IP?" on the local segment and caches the reply (IP → MAC mapping). This happens transparently every time you open a TCP connection to a host on the same subnet.',
                ja: "**ARP**（アドレス解決プロトコル）はレイヤー2とレイヤー3を橋渡しします：IPアドレスが与えられると、ARPはローカルセグメントに「このIPを持つのは誰か？」とブロードキャストし、返答（IP→MACマッピング）をキャッシュします。同一サブネット上のホストへのTCP接続を開くたびに、これが透過的に実行されます。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 4. The network layer (IP)                                         */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="ip"
          title={{
            en: "The network layer — IP",
            ja: "ネットワーク層——IP",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "The **Internet Protocol** (IP) is the network layer that makes the Internet work. Every host on the Internet has at least one IP address — a globally routable identifier. IP is a *best-effort*, *connectionless* protocol: it delivers packets individually with no guarantee of order, delivery, or duplication avoidance. Higher layers (TCP) add those guarantees on top.",
                ja: "**インターネットプロトコル**（IP）はインターネットを機能させるネットワーク層です。インターネット上のすべてのホストは少なくとも1つのIPアドレスを持ちます——グローバルにルーティング可能な識別子です。IPは*ベストエフォート*の*コネクションレス*プロトコルです：パケットを個別に配送しますが、順序・配送・重複回避の保証はありません。それらの保証は上位層（TCP）が追加します。",
              },
              {
                en: "**IPv4** addresses are 32-bit numbers conventionally written as four decimal octets: `192.168.1.1`. The total address space is 2³² ≈ 4.3 billion addresses — exhausted in practice. **CIDR** (Classless Inter-Domain Routing) notation describes a block of addresses as `address/prefix-length`, e.g. `10.0.0.0/8` means the first 8 bits are fixed, giving 2²⁴ ≈ 16 million host addresses. A **subnet mask** (`255.0.0.0` for /8) is the bitwise AND filter that separates the network part from the host part.",
                ja: "**IPv4**アドレスは32ビットの数値で、慣例的に4つの10進オクテットで記述されます：`192.168.1.1`。総アドレス空間は2³² ≈ 43億アドレスで、実際には枯渇しています。**CIDR**（クラスレスドメイン間ルーティング）表記は、アドレスのブロックを`アドレス/プレフィックス長`で表します（例：`10.0.0.0/8`は最初の8ビットが固定で、2²⁴ ≈ 1600万ホストアドレス）。**サブネットマスク**（/8の場合`255.0.0.0`）はネットワーク部とホスト部を分離するビット単位ANDフィルターです。",
              },
              {
                en: "**Routing** is the process of forwarding a packet toward its destination across many hops. Each router maintains a routing table: a list of CIDR prefixes paired with next-hop addresses and exit interfaces. The router performs a **longest-prefix match** — if multiple prefixes match the destination, the most specific one wins. The global Internet routing table has over 900,000 prefixes today, maintained by BGP (Border Gateway Protocol) running between Autonomous Systems.",
                ja: "**ルーティング**は多数のホップを経てパケットを宛先へ転送するプロセスです。各ルーターはルーティングテーブルを維持します：CIDRプレフィックスとネクストホップアドレス・出力インターフェースのペアのリストです。ルーターは**最長プレフィックスマッチ**を実行します——複数のプレフィックスが宛先に一致する場合、最も具体的なものが優先されます。今日のグローバルインターネットルーティングテーブルには90万以上のプレフィックスがあり、自律システム間で動作するBGP（Border Gateway Protocol）によって管理されています。",
              },
              {
                en: "**IPv6** was designed to fix the address exhaustion problem. Addresses are 128 bits, written as eight colon-separated groups of four hex digits: `2001:0db8:85a3::8a2e:0370:7334`. The address space is so large (2¹²⁸ ≈ 3.4 × 10³⁸) that every device on Earth could have billions of addresses. IPv6 also simplifies the header (no checksum, no fragmentation fields) and mandates IPsec support. Adoption has grown to ~45% of Internet traffic as of 2025.",
                ja: "**IPv6**はアドレス枯渇問題を解決するために設計されました。アドレスは128ビットで、コロン区切りの8グループの16進4桁で記述されます：`2001:0db8:85a3::8a2e:0370:7334`。アドレス空間は非常に大きく（2¹²⁸ ≈ 3.4 × 10³⁸）、地球上のすべてのデバイスが数十億のアドレスを持てます。IPv6はヘッダーも簡略化し（チェックサムなし・フラグメントフィールドなし）、IPsecのサポートを義務付けています。2025年時点でインターネットトラフィックの約45%に採用が拡大しています。",
              },
              {
                en: "**NAT** (Network Address Translation) was the IPv4 stopgap: a home router has one public IP address from the ISP, but every device on the LAN uses a private address (`192.168.x.x`, `10.x.x.x`, `172.16.x.x`). The router rewrites packet headers, mapping private (IP, port) pairs to public (IP, port) pairs. NAT breaks the end-to-end principle and complicates peer-to-peer protocols (VoIP, WebRTC), which is another strong argument for IPv6.",
                ja: "**NAT**（ネットワークアドレス変換）はIPv4の暫定的な解決策でした：家庭用ルーターはISPから1つのパブリックIPアドレスを持ちますが、LAN上のすべてのデバイスはプライベートアドレス（`192.168.x.x`・`10.x.x.x`・`172.16.x.x`）を使います。ルーターはパケットヘッダーを書き換え、プライベートな（IP・ポート）ペアをパブリックな（IP・ポート）ペアにマッピングします。NATはエンドツーエンド原則を破り、P2Pプロトコル（VoIP・WebRTC）を複雑にします——これがIPv6への移行を支持するもう1つの強い論拠です。",
              },
            ]}
          />

          <Callout
            tone="note"
            title={{
              en: "Private address ranges (RFC 1918)",
              ja: "プライベートアドレス範囲（RFC 1918）",
            }}
            t={{
              en: "Three blocks are reserved for private use and must never be routed on the public Internet: 10.0.0.0/8 (16 M addresses), 172.16.0.0/12 (1 M), and 192.168.0.0/16 (65,536). Your home LAN almost certainly uses 192.168.x.x.",
              ja: "3つのブロックがプライベート使用のために予約されており、パブリックインターネット上ではルーティングされません：10.0.0.0/8（1600万アドレス）、172.16.0.0/12（100万）、192.168.0.0/16（65,536）。家庭用LANはほぼ確実に192.168.x.xを使用しています。",
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 5. The transport layer                                            */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="transport"
          title={{
            en: "The transport layer",
            ja: "トランスポート層",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "The transport layer sits between IP (which routes individual packets between hosts) and the application (which wants a reliable byte stream or a low-latency datagram service). Two protocols dominate: **TCP** and **UDP**.",
                ja: "トランスポート層は、IP（ホスト間で個別パケットをルーティング）とアプリケーション（信頼性の高いバイトストリームまたは低レイテンシのデータグラムサービスを必要とする）の間に位置します。2つのプロトコルが主流です：**TCP**と**UDP**。",
              },
              {
                en: "**Ports** are 16-bit numbers (0–65535) that demultiplex traffic among processes on the same host. Well-known ports include HTTP (80), HTTPS (443), DNS (53), SMTP (25). A *socket* is identified by the 4-tuple (source IP, source port, destination IP, destination port), which makes simultaneous connections to the same server distinguishable.",
                ja: "**ポート**は同一ホスト上のプロセス間でトラフィックを逆多重化する16ビット番号（0〜65535）です。ウェルノウンポートにはHTTP（80）、HTTPS（443）、DNS（53）、SMTP（25）があります。*ソケット*は4タプル（送信元IP・送信元ポート・宛先IP・宛先ポート）で識別され、同じサーバーへの同時接続を区別可能にします。",
              },
              {
                en: "**UDP** (User Datagram Protocol) is minimal: it adds only source/destination ports, length, and checksum to an IP packet. It is connectionless, unreliable, and unordered — and those are features, not bugs, for applications where speed matters more than completeness: DNS queries, streaming video, online games, WebRTC, and QUIC (which reimplements reliability at the application layer and runs over UDP).",
                ja: "**UDP**（ユーザーデータグラムプロトコル）は最小限です：IPパケットに送信元/宛先ポート・長さ・チェックサムを付加するだけです。コネクションレスで、非信頼性で、順序不保証——これらは欠点ではなく、完全性より速度が重要なアプリケーション（DNSクエリ・動画ストリーミング・オンラインゲーム・WebRTC・QUIC）にとっては特徴です。",
              },
              {
                en: "**TCP** (Transmission Control Protocol) provides a reliable, ordered, full-duplex byte stream. It achieves this through: **sequence numbers** (each byte of the stream is numbered, so the receiver can detect gaps and reorder), **acknowledgement numbers** (receiver tells sender the next byte it expects), **retransmission** (sender keeps a copy until ACKed; if an ACK doesn't arrive within the retransmission timeout (RTO), the segment is resent), **flow control** (the receiver advertises a window size — how many bytes it can buffer — preventing the sender from overwhelming it), and **congestion control** (algorithms like CUBIC and BBR probe available bandwidth and back off when loss is detected, sharing the network fairly).",
                ja: "**TCP**（伝送制御プロトコル）は信頼性の高い、順序付けられた全二重バイトストリームを提供します。これを実現するのは：**シーケンス番号**（ストリームの各バイトに番号が付与され、受信者がギャップを検出して並べ替えられる）、**確認応答番号**（受信者が次に期待するバイトを送信者に伝える）、**再送信**（送信者はACKされるまでコピーを保持し、再送信タイムアウト（RTO）内にACKが届かない場合はセグメントを再送信）、**フロー制御**（受信者がウィンドウサイズ——バッファリング可能なバイト数——をアドバタイズして送信者が圧倒しないようにする）、**輻輳制御**（CUBICやBBRなどのアルゴリズムが利用可能な帯域を探索し、損失検出時にバックオフしてネットワークを公平に共有する）です。",
              },
              {
                en: "Before any data flows, TCP performs a **three-way handshake** to synchronise sequence numbers and agree on options. The initiator sends a **SYN** (synchronise) with its initial sequence number (ISN); the server replies with **SYN-ACK** (synchronise-acknowledge) containing its own ISN plus acknowledgement of the client's ISN+1; the client sends **ACK** confirming the server's ISN+1. Only then can the application send data. This costs one full round-trip time (RTT) before the first byte of application data. You can watch the handshake live in the [handshake simulator](/net).",
                ja: "データが流れる前に、TCPはシーケンス番号を同期してオプションに合意するための**3ウェイハンドシェイク**を実行します。イニシエーターは初期シーケンス番号（ISN）を含む**SYN**（同期）を送信します。サーバーは自分のISNとクライアントのISN+1の確認応答を含む**SYN-ACK**（同期確認）を返します。クライアントはサーバーのISN+1を確認する**ACK**を送信します。その後初めてアプリケーションがデータを送信できます。最初のアプリケーションデータの前に1往復の完全なラウンドトリップタイム（RTT）がかかります。[ハンドシェイクシミュレーター](/net)でリアルタイムに観察できます。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "TCP three-way handshake. One RTT elapses before any application data can be sent.",
              ja: "TCP 3ウェイハンドシェイク。アプリケーションデータが送信される前に1 RTTが経過する。",
            }}
          >
            <HandshakeDiagram />
          </Figure>

          <Figure
            caption={{
              en: "TCP vs UDP — key trade-offs at a glance.",
              ja: "TCP対UDP——主なトレードオフの比較。",
            }}
          >
            <CompareTable
              headers={[
                { en: "Property", ja: "特性" },
                { en: "TCP", ja: "TCP" },
                { en: "UDP", ja: "UDP" },
              ]}
              rows={[
                [
                  { en: "Connection setup", ja: "接続確立" },
                  {
                    en: "3-way handshake (1 RTT)",
                    ja: "3ウェイハンドシェイク（1 RTT）",
                  },
                  { en: "None", ja: "なし" },
                ],
                [
                  { en: "Delivery guarantee", ja: "配送保証" },
                  {
                    en: "Yes — retransmit on loss",
                    ja: "あり——損失時に再送信",
                  },
                  { en: "No", ja: "なし" },
                ],
                [
                  { en: "Ordering", ja: "順序保証" },
                  { en: "Yes", ja: "あり" },
                  { en: "No", ja: "なし" },
                ],
                [
                  { en: "Flow & congestion control", ja: "フロー・輻輳制御" },
                  { en: "Yes", ja: "あり" },
                  {
                    en: "No (app must implement)",
                    ja: "なし（アプリ実装が必要）",
                  },
                ],
                [
                  { en: "Header size", ja: "ヘッダーサイズ" },
                  { en: "20–60 bytes", ja: "20〜60バイト" },
                  { en: "8 bytes", ja: "8バイト" },
                ],
                [
                  { en: "Use cases", ja: "用途" },
                  {
                    en: "HTTP, email, file transfer",
                    ja: "HTTP・メール・ファイル転送",
                  },
                  {
                    en: "DNS, video, games, QUIC",
                    ja: "DNS・動画・ゲーム・QUIC",
                  },
                ],
              ]}
            />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 6. Names — DNS                                                    */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="dns"
          title={{
            en: "Names — DNS",
            ja: "名前解決——DNS",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "Humans remember names like `www.example.com`; routers need IP addresses. The **Domain Name System** (DNS, RFC 1035) is a globally distributed, hierarchical database that maps names to addresses (and much more: MX records for mail servers, TXT records for verification, CNAME aliases, etc.).",
                ja: "人間は`www.example.com`のような名前を覚えますが、ルーターはIPアドレスを必要とします。**ドメインネームシステム**（DNS、RFC 1035）は名前をアドレスにマッピングする（それ以上も：メールサーバー用のMXレコード、検証用のTXTレコード、CNAMEエイリアスなど）グローバルに分散した階層的データベースです。",
              },
              {
                en: "Resolution happens in steps. Your OS has a **stub resolver** that forwards queries to a **recursive resolver** (often provided by your ISP or a public resolver like `8.8.8.8`). If the recursive resolver has no cached answer, it starts at one of 13 **root name servers** (`a.root-servers.net` through `m.root-servers.net`), which respond with the addresses of the **TLD (top-level domain) servers** for `.com`, `.org`, etc. The TLD server refers the resolver to the **authoritative name server** for `example.com`, which finally returns the A (IPv4) or AAAA (IPv6) record.",
                ja: "名前解決はステップで行われます。OSの**スタブリゾルバー**がクエリを**再帰リゾルバー**（多くの場合ISPや`8.8.8.8`のようなパブリックリゾルバーが提供）に転送します。再帰リゾルバーにキャッシュされた回答がない場合、13台の**ルートネームサーバー**（`a.root-servers.net`〜`m.root-servers.net`）の1つから始め、`.com`・`.org`などの**TLD（トップレベルドメイン）サーバー**のアドレスが返されます。TLDサーバーは`example.com`の**権威ネームサーバー**にリゾルバーを誘導し、最終的にA（IPv4）またはAAAA（IPv6）レコードが返されます。",
              },
              {
                en: "**Caching** is what makes DNS fast in practice. Every DNS record has a **TTL** (Time to Live, in seconds). Once the recursive resolver has an answer, it caches it for TTL seconds and serves subsequent queries from cache, bypassing the entire hierarchy. A low TTL (e.g. 60 s) allows rapid failover; a high TTL (e.g. 86400 = 1 day) reduces resolver load. **DNSSEC** adds cryptographic signatures to responses to prevent cache poisoning attacks.",
                ja: "**キャッシュ**は実際にDNSを高速にするものです。すべてのDNSレコードには**TTL**（Time to Live、秒単位）があります。再帰リゾルバーが回答を得ると、TTL秒間キャッシュして後続のクエリをキャッシュから提供し、階層全体をバイパスします。低いTTL（例：60秒）は迅速なフェイルオーバーを可能にし、高いTTL（例：86400 = 1日）はリゾルバーの負荷を軽減します。**DNSSEC**は応答に暗号署名を追加してキャッシュポイズニング攻撃を防ぎます。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "DNS resolution path for www.example.com — four queries in the worst case (all cold).",
              ja: "www.example.com の DNS 解決経路——最悪の場合（すべてコールド）で4クエリ。",
            }}
          >
            <FlowRow
              steps={[
                {
                  label: {
                    en: "App / stub resolver",
                    ja: "アプリ／スタブリゾルバー",
                  },
                  sub: { en: "asks OS", ja: "OSに問い合わせ" },
                },
                {
                  label: { en: "Recursive resolver", ja: "再帰リゾルバー" },
                  sub: { en: "8.8.8.8 or ISP", ja: "8.8.8.8 または ISP" },
                },
                {
                  label: { en: "Root server", ja: "ルートサーバー" },
                  sub: { en: "→ .com TLD address", ja: "→ .com TLD アドレス" },
                },
                {
                  label: { en: "TLD server (.com)", ja: "TLDサーバー（.com）" },
                  sub: {
                    en: "→ example.com NS",
                    ja: "→ example.com の NS",
                  },
                },
                {
                  label: {
                    en: "Authoritative server",
                    ja: "権威ネームサーバー",
                  },
                  sub: { en: "→ A record (IP)", ja: "→ Aレコード（IP）" },
                },
              ]}
            />
          </Figure>

          <P
            t={{
              en: "Explore the full resolution process interactively in the [DNS simulator](/net).",
              ja: "完全な解決プロセスを[DNSシミュレーター](/net)でインタラクティブに探索できます。",
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 7. The application layer                                          */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="application"
          title={{
            en: "The application layer — HTTP & TLS",
            ja: "アプリケーション層——HTTP と TLS",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "**HTTP** (HyperText Transfer Protocol) is the text-based request/response protocol of the Web. A client sends a request with a method (`GET`, `POST`, `PUT`, `DELETE`…), a path, headers (Host, Content-Type, Authorization…), and an optional body. The server replies with a status code (200 OK, 404 Not Found, 301 Moved Permanently, 500 Internal Server Error), headers, and a body.",
                ja: "**HTTP**（ハイパーテキスト転送プロトコル）はWebのテキストベースのリクエスト/レスポンスプロトコルです。クライアントはメソッド（`GET`・`POST`・`PUT`・`DELETE`など）・パス・ヘッダー（Host・Content-Type・Authorizationなど）・オプションのボディを含むリクエストを送信します。サーバーはステータスコード（200 OK・404 Not Found・301 Moved Permanently・500 Internal Server Error）・ヘッダー・ボディで返信します。",
              },
              {
                en: "**HTTP/1.1** (1997) added persistent connections (keep-alive) over HTTP/1.0, but suffers from **head-of-line blocking**: requests on a single connection must be served in order. Browsers work around this by opening 6–8 parallel TCP connections per origin. **HTTP/2** (2015) multiplexes many request/response streams over a *single* TCP connection using binary framing, eliminating the need for multiple connections and dramatically improving latency on resource-heavy pages. **HTTP/3** (2022) replaces TCP with **QUIC** (which runs over UDP), eliminating TCP's head-of-line blocking at the transport layer and improving performance on lossy networks (mobile, satellite).",
                ja: "**HTTP/1.1**（1997年）はHTTP/1.0にパーシステント接続（keep-alive）を追加しましたが、**ヘッドオブラインブロッキング**に悩まされます：単一接続上のリクエストは順番に提供される必要があります。ブラウザはオリジンごとに6〜8個の並列TCP接続を開くことでこれを回避します。**HTTP/2**（2015年）はバイナリフレーミングを使用して、*単一*のTCP接続上で多数のリクエスト/レスポンスストリームを多重化し、複数接続の必要性を排除してリソースの多いページのレイテンシを大幅に改善します。**HTTP/3**（2022年）はTCPを**QUIC**（UDPで動作）に置き換え、トランスポート層でのTCPのヘッドオブラインブロッキングを排除し、損失の多いネットワーク（モバイル・衛星）でのパフォーマンスを改善します。",
              },
              {
                en: "**TLS** (Transport Layer Security, successor to SSL) encrypts the connection between client and server. It provides **confidentiality** (data is encrypted with symmetric keys negotiated during a handshake), **integrity** (HMAC or AEAD ensures tampering is detected), and **authentication** (the server presents a certificate signed by a trusted CA, proving it owns the domain). TLS 1.3 (2018) reduces the handshake to 1 RTT (or 0-RTT for resumed sessions) and removes insecure cipher suites. On the modern Web, every production connection runs HTTPS = HTTP over TLS.",
                ja: "**TLS**（Transport Layer Security、SSLの後継）はクライアントとサーバー間の接続を暗号化します。**機密性**（ハンドシェイク中にネゴシエートされた対称鍵でデータを暗号化）、**完全性**（HMACまたはAEADで改ざんを検出）、**認証**（サーバーが信頼されたCAによって署名された証明書を提示し、ドメインの所有を証明）を提供します。TLS 1.3（2018年）はハンドシェイクを1 RTT（再開セッションでは0-RTT）に削減し、安全でない暗号スイートを削除します。現代のWebでは、すべての本番環境の接続はHTTPS = TLS上のHTTPで動作します。",
              },
              {
                en: "**REST** (Representational State Transfer) is the dominant architectural style for web APIs. It maps CRUD operations to HTTP methods (GET = read, POST = create, PUT/PATCH = update, DELETE = remove), uses URL paths to identify resources, and returns JSON (or XML) in the body. Because REST is stateless (each request carries all needed context), it scales horizontally — any server can handle any request. See [Web Development](/docs/web) for deeper coverage of APIs, the browser, and the full web stack.",
                ja: "**REST**（Representational State Transfer）はWeb APIの主流のアーキテクチャスタイルです。CRUD操作をHTTPメソッドにマッピングし（GET=読み取り・POST=作成・PUT/PATCH=更新・DELETE=削除）、URLパスでリソースを識別し、ボディにJSON（またはXML）を返します。RESTはステートレス（各リクエストに必要なすべてのコンテキストが含まれる）なため、水平スケーリングが可能です——どのサーバーもどのリクエストも処理できます。API・ブラウザ・完全なWebスタックについては[Web開発](/docs/web)を参照してください。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 8. Performance & physical reality                                 */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="performance"
          title={{
            en: "Performance & physical reality",
            ja: "パフォーマンスと物理的現実",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "Two often-confused concepts: **latency** is the time for one bit (or one packet) to travel from source to destination, measured in milliseconds. **Bandwidth** is the maximum rate of data transfer, measured in Mbps or Gbps. A fat pipe with high bandwidth but high latency is poor for interactive applications (mouse moves, voice calls); a thin pipe with low latency is fine for gaming. The relevant unit for interactive work is **RTT** (round-trip time): the time for a packet to reach the server *and* for the acknowledgement to return.",
                ja: "しばしば混同される2つの概念：**レイテンシ**は1ビット（または1パケット）が送信元から宛先まで移動する時間で、ミリ秒で測定されます。**帯域幅**はデータ転送の最大速度で、MbpsまたはGbpsで測定されます。高帯域でも高レイテンシのパイプはインタラクティブアプリケーション（マウス操作・音声通話）には不向きです。低帯域でも低レイテンシのパイプはゲームには適しています。インタラクティブな作業に関連する単位は**RTT**（ラウンドトリップタイム）：パケットがサーバーに到達し、*かつ*確認応答が返ってくるまでの時間です。",
              },
              {
                en: "The fundamental constraint is the **speed of light**: light travels at ~200,000 km/s in fibre (about 2/3 of `c` in vacuum). The minimum RTT from London to Tokyo (~9,500 km) is therefore 2 × 9,500 / 200,000 = **~95 ms** — a physical lower bound no engineering can overcome. Protocol overhead (TCP handshake, TLS handshake, DNS) stacks additional RTTs on top of this floor.",
                ja: "根本的な制約は**光速**です：光はファイバー内を約200,000 km/s（真空中の`c`の約2/3）で移動します。ロンドン〜東京（約9,500 km）の最小RTTは2 × 9,500 / 200,000 = **約95ミリ秒**——どんなエンジニアリングでも克服できない物理的下限です。プロトコルオーバーヘッド（TCPハンドシェイク・TLSハンドシェイク・DNS）はこの下限の上にさらにRTTを積み上げます。",
              },
              {
                en: "**CDNs** (Content Delivery Networks) are the engineering response to the speed-of-light problem. A CDN places **edge servers** in dozens or hundreds of datacentres around the world. Static assets (images, JS, CSS) are cached at the edge closest to the user, so the request travels a few milliseconds to a nearby PoP (Point of Presence) rather than hundreds of milliseconds to the origin. Modern CDNs (Cloudflare, Akamai, Fastly) serve dynamic content and run code at the edge too, pushing the compute to the user rather than the data to the server.",
                ja: "**CDN**（コンテンツデリバリーネットワーク）は光速問題に対するエンジニアリングの回答です。CDNは世界中の数十〜数百のデータセンターに**エッジサーバー**を配置します。静的アセット（画像・JS・CSS）はユーザーに最も近いエッジにキャッシュされるため、リクエストはオリジンへの数百ミリ秒ではなく、近くのPoP（Point of Presence）へ数ミリ秒で到達します。現代のCDN（Cloudflare・Akamai・Fastly）はダイナミックコンテンツを提供し、エッジでコードも実行します——データをサーバーに送るのではなく、コンピュートをユーザーに近づけます。",
              },
              {
                en: "**Throughput** in practice is often limited not by raw bandwidth but by the TCP congestion window. TCP's slow-start algorithm begins every new connection with a small window (e.g. 10 segments ≈ 15 KB) and doubles it each RTT until loss is detected. For short-lived connections (a small HTML file), the connection closes before the window grows large enough to fill the pipe — a phenomenon called **bandwidth-delay product** mismatch. This is one reason HTTP/2's connection reuse (a persistent single connection across many requests) and HTTP/3's 0-RTT resumption are significant performance wins.",
                ja: "実際の**スループット**は生の帯域幅ではなく、TCPの輻輳ウィンドウによって制限されることが多いです。TCPのスロースタートアルゴリズムは、すべての新規接続を小さなウィンドウ（例：10セグメント ≈ 15 KB）で開始し、損失が検出されるまで各RTTで倍増させます。短命の接続（小さなHTMLファイル）では、ウィンドウがパイプを満たすほど大きくなる前に接続が閉じられます——**帯域幅遅延積**の不一致と呼ばれる現象です。これがHTTP/2の接続再利用（多数のリクエストを1つのパーシステント接続で共有）とHTTP/3の0-RTT再開が重要なパフォーマンス上の利点である理由の1つです。",
              },
            ]}
          />

          <Callout
            tone="insight"
            title={{
              en: "The bandwidth-delay product",
              ja: "帯域幅遅延積",
            }}
            t={{
              en: 'BDP = bandwidth × RTT. For a 1 Gbps link with 100 ms RTT, BDP = 12.5 MB. This is how much data must be "in flight" to keep the pipe full. TCP\'s window must grow to at least BDP to saturate a high-latency link — which is why slow-start is painful for short transfers.',
              ja: "BDP = 帯域幅 × RTT。100ミリ秒RTTの1 Gbpsリンクの場合、BDP = 12.5 MB。パイプを満たし続けるために「転送中」でなければならないデータ量です。高レイテンシリンクを飽和させるにはTCPのウィンドウが少なくともBDPまで拡大する必要があります——スロースタートが短い転送に不向きな理由です。",
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Key terms                                                         */}
        {/* ---------------------------------------------------------------- */}
        <Section id="glossary" title={{ en: "Key terms", ja: "重要用語" }}>
          <KeyTerms
            terms={[
              {
                term: "Packet",
                def: {
                  en: "A variable-size chunk of data (up to the link MTU) with a header containing source/destination addresses, routed independently through the network.",
                  ja: "送信元/宛先アドレスを含むヘッダーを持つ可変サイズ（リンクのMTUまで）のデータの塊。ネットワーク内で独立してルーティングされる。",
                },
              },
              {
                term: "TCP",
                def: {
                  en: "Transmission Control Protocol — a reliable, ordered, full-duplex byte-stream transport built on top of IP.",
                  ja: "伝送制御プロトコル——IP上に構築された信頼性の高い、順序付けられた全二重バイトストリームトランスポート。",
                },
              },
              {
                term: "IP",
                def: {
                  en: "Internet Protocol — the Layer 3 protocol that routes packets between hosts using globally unique 32-bit (IPv4) or 128-bit (IPv6) addresses.",
                  ja: "インターネットプロトコル——グローバルに一意な32ビット（IPv4）または128ビット（IPv6）アドレスを使用してホスト間でパケットをルーティングするレイヤー3プロトコル。",
                },
              },
              {
                term: "DNS",
                def: {
                  en: "Domain Name System — a distributed hierarchical database that resolves human-readable names (www.example.com) to IP addresses.",
                  ja: "ドメインネームシステム——人間が読める名前（www.example.com）をIPアドレスに解決する分散階層型データベース。",
                },
              },
              {
                term: "Port",
                def: {
                  en: "A 16-bit number that demultiplexes network traffic to specific processes on a host. Combined with an IP address, it forms a socket endpoint.",
                  ja: "ホスト上の特定のプロセスへネットワークトラフィックを逆多重化する16ビット番号。IPアドレスと組み合わせてソケットエンドポイントを形成する。",
                },
              },
              {
                term: "RTT",
                def: {
                  en: "Round-Trip Time — the elapsed time from sending a packet to receiving its acknowledgement. The fundamental latency unit for interactive protocols.",
                  ja: "ラウンドトリップタイム——パケット送信から確認応答受信までの経過時間。インタラクティブプロトコルの基本的なレイテンシ単位。",
                },
              },
              {
                term: "Handshake",
                def: {
                  en: "An initial exchange of messages between two parties to negotiate parameters before data transfer begins. TCP uses a 3-way (SYN/SYN-ACK/ACK) handshake; TLS uses its own handshake on top.",
                  ja: "データ転送開始前にパラメーターをネゴシエートするための2者間の初期メッセージ交換。TCPは3ウェイ（SYN/SYN-ACK/ACK）ハンドシェイクを使用し、TLSはその上に独自のハンドシェイクを使用する。",
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
              title: "Kurose & Ross — Computer Networking: A Top-Down Approach",
              href: "https://gaia.cs.umass.edu/kurose_ross/index.php",
              note: {
                en: "The standard undergraduate networking textbook; covers all layers from applications to physical with excellent depth.",
                ja: "標準的な学部ネットワーク教科書。アプリケーションから物理層まで全レイヤーを優れた深さでカバー。",
              },
            },
            {
              title: "RFC 9293 — Transmission Control Protocol (TCP)",
              href: "https://www.rfc-editor.org/rfc/rfc9293",
              note: {
                en: "The 2022 consolidation of all TCP RFCs into a single authoritative specification.",
                ja: "2022年にすべてのTCP RFCを1つの権威ある仕様に統合したもの。",
              },
            },
            {
              title: "RFC 1035 — Domain Names: Implementation & Specification",
              href: "https://www.rfc-editor.org/rfc/rfc1035",
              note: {
                en: "The original 1987 DNS specification; still the definitive reference for wire format and resolver behaviour.",
                ja: "1987年のオリジナルDNS仕様書。ワイヤーフォーマットとリゾルバーの動作に関する決定版リファレンス。",
              },
            },
            {
              title: "High Performance Browser Networking — Ilya Grigorik",
              href: "https://hpbn.co/",
              note: {
                en: "Free online book covering TCP, TLS, HTTP/1–2, WebSockets, WebRTC from a web-performance angle.",
                ja: "TCP・TLS・HTTP/1〜2・WebSocket・WebRTCをWebパフォーマンスの観点からカバーする無料オンラインブック。",
              },
            },
            {
              title: "Cloudflare Learning Center",
              href: "https://www.cloudflare.com/learning/",
              note: {
                en: "Accessible, accurate articles on DNS, DDoS, TLS, CDNs, and the modern Internet architecture.",
                ja: "DNS・DDoS・TLS・CDN・現代インターネットアーキテクチャに関するわかりやすく正確な記事集。",
              },
            },
            {
              title: "Wikipedia — OSI model",
              href: "https://en.wikipedia.org/wiki/OSI_model",
              note: {
                en: "Solid reference for layer names, responsibilities, and protocol examples across all seven OSI layers.",
                ja: "全7つのOSIレイヤーの名前・責任・プロトコル例の確実なリファレンス。",
              },
            },
            {
              title: "Wikipedia — IPv6",
              href: "https://en.wikipedia.org/wiki/IPv6",
              note: {
                en: "Comprehensive overview of IPv6 addressing, header format, transition mechanisms, and adoption status.",
                ja: "IPv6アドレッシング・ヘッダーフォーマット・移行メカニズム・普及状況の包括的な概説。",
              },
            },
          ]}
        />
      </Article>
    </DocsShell>
  );
}

// ---------------------------------------------------------------------------
// History & Mental Models section
// ---------------------------------------------------------------------------

function NetworkHistorySection() {
  const t = useT();
  const fr = NETWORK_HISTORY_FURTHER_READING;
  return (
    <Section
      id="history"
      title={{
        en: "History & Mental Models — networking from first principles",
        ja: "歴史と考え方——ファーストプリンシプルから見るネットワーキング",
      }}
    >
      <Prose
        paragraphs={[
          {
            en: "The protocols you use every day were not designed in a single stroke of genius. They evolved over 150 years, each generation inheriting the hard lessons of the one before. Walking this arc in chronological order is the fastest way to internalise the *why* behind TCP, DNS, and TLS — and to build the mental models that let you reason about networking problems you have never seen before.",
            ja: "あなたが毎日使うプロトコルは、単一の天才的なひらめきで設計されたものではない。150年をかけて進化し、各世代が前の世代の苦い教訓を受け継いできた。この流れを時系列で追うことが、TCP・DNS・TLSの背後にある*なぜ*を内面化する最短ルートであり、今まで見たことのないネットワーキングの問題を推論するためのメンタルモデルを構築する手段だ。",
          },
          {
            en: "Four cross-cutting themes appear again and again: **bandwidth vs latency** (two independent numbers that govern very different problems); **layering** (each layer solves one problem and trusts those below, without caring about those above); **best-effort in the core, reliability at the edges** (keep the network simple; let endpoints handle correctness); and **distributed, emergent control** (no central authority knows the whole picture — local decisions compose into global behaviour).",
            ja: "4つの横断的なテーマが繰り返し登場する：**帯域幅とレイテンシ**（全く異なる問題を支配する2つの独立した数値）；**レイヤリング**（各レイヤーは1つの問題を解決し、下層を信頼し、上層を気にしない）；**コアでのベストエフォート、エッジでの信頼性**（ネットワークをシンプルに保ち、正確性はエンドポイントに任せる）；そして**分散した創発的制御**（全体像を知る中央機関は存在しない——ローカルな決定がグローバルな振る舞いを形成する）。",
          },
        ]}
      />

      <div className="space-y-8 mt-2">
        {NETWORK_HISTORY_STAGES.map((stage) => (
          <StageBlock key={stage.id} t={t} stage={stage} />
        ))}
      </div>

      {/* Further reading attribution */}
      <div className="mt-8 rounded-xl border border-zinc-700 bg-zinc-900/60 px-5 py-4 space-y-1">
        <p className="text-sm font-semibold text-zinc-400">
          {t({ en: "Further reading", ja: "さらに読む" })}
        </p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          {rich(t(fr.note))}{" "}
          <a
            href={fr.href}
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 underline-offset-2 hover:text-sky-300 hover:underline"
          >
            {t(fr.label)} →
          </a>
        </p>
      </div>
    </Section>
  );
}

interface StageBlockProps {
  t: (lt: { en: string; ja: string }) => string;
  stage: (typeof NETWORK_HISTORY_STAGES)[number];
}

function StageBlock({ t, stage }: StageBlockProps) {
  return (
    <div className="space-y-3 border-l-2 border-zinc-700 pl-4">
      <h3 className="text-lg font-semibold text-zinc-100">{t(stage.title)}</h3>

      {/* Historical milestone */}
      <p className="text-xs font-medium uppercase tracking-wide text-sky-400">
        {t({ en: "Milestone", ja: "マイルストーン" })}
      </p>
      <p className="text-zinc-300 leading-relaxed text-sm">
        {rich(t(stage.milestone))}
      </p>

      {/* Mental model */}
      <p className="text-xs font-medium uppercase tracking-wide text-emerald-400">
        {t({ en: "Mental model", ja: "メンタルモデル" })}
      </p>
      <p className="text-zinc-300 leading-relaxed text-sm">
        {rich(t(stage.mentalModel))}
      </p>

      {/* Detail */}
      <p className="text-zinc-400 leading-relaxed text-sm">
        {rich(t(stage.detail))}
      </p>

      {/* Optional code example */}
      {stage.example && (
        <pre className="rounded bg-zinc-800 px-4 py-3 font-mono text-[12px] text-sky-300 overflow-x-auto whitespace-pre-wrap">
          {stage.example}
        </pre>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TCP three-way handshake SVG diagram
// ---------------------------------------------------------------------------

function HandshakeDiagram() {
  const sid = useSvgId();
  return (
    <Diagram
      label={{
        en: "TCP three-way handshake: SYN, SYN-ACK, ACK sequence between client and server",
        ja: "TCP 3ウェイハンドシェイク：クライアントとサーバー間の SYN・SYN-ACK・ACK シーケンス",
      }}
      viewBox="0 0 560 300"
      maxHeight={280}
    >
      {/* Background */}
      <rect width="560" height="300" fill={C.panel} rx="8" />

      {/* Column labels */}
      <rect
        x="40"
        y="16"
        width="120"
        height="36"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="100"
        y="39"
        textAnchor="middle"
        fill={C.text}
        fontSize="13"
        fontWeight="600"
      >
        Client
      </text>

      <rect
        x="400"
        y="16"
        width="120"
        height="36"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="460"
        y="39"
        textAnchor="middle"
        fill={C.text}
        fontSize="13"
        fontWeight="600"
      >
        Server
      </text>

      {/* Vertical lifelines */}
      <line
        x1="100"
        y1="52"
        x2="100"
        y2="285"
        stroke={C.line}
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <line
        x1="460"
        y1="52"
        x2="460"
        y2="285"
        stroke={C.line}
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />

      {/* --- SYN --- */}
      {/* horizontal arrow Client → Server */}
      <line
        x1="100"
        y1="100"
        x2="458"
        y2="140"
        stroke={C.accent}
        strokeWidth="2"
        markerEnd={`url(#${sid("arr")})`}
      />
      <text
        x="280"
        y="108"
        textAnchor="middle"
        fill={C.accent}
        fontSize="12"
        fontWeight="700"
      >
        SYN
      </text>
      <text x="280" y="122" textAnchor="middle" fill={C.faint} fontSize="10">
        seq=x
      </text>
      {/* dots on lifeline */}
      <circle cx="100" cy="100" r="4" fill={C.accent} />
      <circle cx="460" cy="140" r="4" fill={C.accent} />

      {/* --- SYN-ACK --- */}
      <line
        x1="460"
        y1="160"
        x2="102"
        y2="200"
        stroke={C.high}
        strokeWidth="2"
        markerEnd={`url(#${sid("arrg")})`}
      />
      <text
        x="280"
        y="168"
        textAnchor="middle"
        fill={C.high}
        fontSize="12"
        fontWeight="700"
      >
        SYN-ACK
      </text>
      <text x="280" y="182" textAnchor="middle" fill={C.faint} fontSize="10">
        seq=y, ack=x+1
      </text>
      <circle cx="460" cy="160" r="4" fill={C.high} />
      <circle cx="100" cy="200" r="4" fill={C.high} />

      {/* --- ACK --- */}
      <line
        x1="100"
        y1="220"
        x2="458"
        y2="255"
        stroke={C.warn}
        strokeWidth="2"
        markerEnd={`url(#${sid("arrw")})`}
      />
      <text
        x="280"
        y="228"
        textAnchor="middle"
        fill={C.warn}
        fontSize="12"
        fontWeight="700"
      >
        ACK
      </text>
      <text x="280" y="242" textAnchor="middle" fill={C.faint} fontSize="10">
        ack=y+1
      </text>
      <circle cx="100" cy="220" r="4" fill={C.warn} />
      <circle cx="460" cy="255" r="4" fill={C.warn} />

      {/* ESTABLISHED label */}
      <text
        x="280"
        y="278"
        textAnchor="middle"
        fill={C.high}
        fontSize="11"
        fontStyle="italic"
      >
        Connection ESTABLISHED — data can flow
      </text>

      {/* RTT brace */}
      <line
        x1="24"
        y1="100"
        x2="24"
        y2="220"
        stroke={C.faint}
        strokeWidth="1"
      />
      <line
        x1="20"
        y1="100"
        x2="28"
        y2="100"
        stroke={C.faint}
        strokeWidth="1"
      />
      <line
        x1="20"
        y1="220"
        x2="28"
        y2="220"
        stroke={C.faint}
        strokeWidth="1"
      />
      <text
        x="16"
        y="163"
        textAnchor="middle"
        fill={C.faint}
        fontSize="10"
        transform="rotate(-90,16,163)"
      >
        1 RTT
      </text>

      {/* Arrow markers */}
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
      </defs>
    </Diagram>
  );
}
