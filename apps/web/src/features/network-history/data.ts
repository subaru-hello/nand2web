// ---------------------------------------------------------------------------
// Network History & Mental Models — bilingual data module
// 11 stages from telegraph to TLS; each carries historical fact + mental model.
// Used by the /docs/network History section.
// ---------------------------------------------------------------------------

export interface LocalizedText {
  readonly en: string;
  readonly ja: string;
}

export interface NetworkHistoryStage {
  readonly id: string;
  readonly title: LocalizedText;
  /** One-sentence historical milestone (who, when, what). */
  readonly milestone: LocalizedText;
  /** The durable mental model this stage teaches. */
  readonly mentalModel: LocalizedText;
  /** Richer explanatory paragraph. */
  readonly detail: LocalizedText;
  /** Optional short code / notation example. */
  readonly example?: string;
}

export const NETWORK_HISTORY_STAGES: readonly NetworkHistoryStage[] = [
  // 1 -----------------------------------------------------------------------
  {
    id: "telegraph",
    title: {
      en: "1. Telegraph & Morse — signals are discrete",
      ja: "1. 電信とモールス——信号は離散的である",
    },
    milestone: {
      en: "In 1844 Samuel Morse sent the first long-distance telegraph message (Washington D.C. to Baltimore), using a code of dots and dashes to map characters onto timed electrical pulses.",
      ja: "1844年、サミュエル・モールスはワシントンD.C.からボルチモアへ最初の長距離電信メッセージを送信し、点と線のコードで文字を電気パルスの時間パターンにマッピングした。",
    },
    mentalModel: {
      en: "Signaling is the root of all digital communication. Any information — letters, numbers, images, instructions — can be encoded as a sequence of distinguishable discrete states (dot/dash, 0/1, on/off). The receiver needs only to tell those states apart reliably; everything higher-level builds on that foundation.",
      ja: "シグナリングはすべてのデジタル通信の根本である。文字・数値・画像・命令など、あらゆる情報は識別可能な離散状態の列（点/線、0/1、オン/オフ）として符号化できる。受信側は状態を確実に区別するだけでよく、より高水準なすべてはその基盤の上に構築される。",
    },
    detail: {
      en: "The telegraph introduced two ideas that still shape networking: **encoding** (mapping meaning onto a physical signal) and **regeneration** (relay operators re-keyed the signal at each station, resetting accumulated noise). Digital regenerators do the same job today — a fibre amplifier or Ethernet PHY chip reconstructs a clean square wave from a degraded analog signal, and noise cannot accumulate across unlimited distance. Morse's key insight was that you don't need an analog signal proportional to the original; you need only a signal clean enough to decode at the receiver.",
      ja: "電信は今日もネットワーキングを形成する2つのアイデアを導入した：**エンコーディング**（意味を物理信号にマッピングする）と**再生**（中継オペレーターが各駅で信号を再送信し、累積ノイズをリセットする）。デジタル再生器は今日も同じ仕事をする——ファイバーアンプやEthernetのPHYチップは劣化したアナログ信号からクリーンな矩形波を再構成し、距離が延びてもノイズは蓄積しない。モールスの重要な洞察は、元の信号に比例したアナログ信号は不要であり、受信側でデコードできるだけのクリーンな信号があれば十分だということだ。",
    },
    example: "... --- ... = SOS  (dit-dit-dit  dah-dah-dah  dit-dit-dit)",
  },

  // 2 -----------------------------------------------------------------------
  {
    id: "circuit-vs-packet",
    title: {
      en: "2. Circuit switching vs packet switching — share the wire",
      ja: "2. 回線交換対パケット交換——ワイヤーを共有する",
    },
    milestone: {
      en: "The telephone network (Bell, 1876) used circuit switching — a dedicated physical path held open for the duration of a call. In the late 1960s Paul Baran (RAND) and Donald Davies (NPL) independently proposed packet switching, where messages are divided into chunks and forwarded hop-by-hop, sharing links with other traffic.",
      ja: "電話網（ベル、1876年）は回線交換を使用した——通話中は専用の物理経路が占有される。1960年代後半、ポール・バラン（RAND）とドナルド・デービス（NPL）が独立してパケット交換を提案した。メッセージを小さな塊に分割し、他のトラフィックとリンクを共有しながらホップバイホップで転送する方式だ。",
    },
    mentalModel: {
      en: "**Statistical multiplexing** is why the Internet is cheap and resilient. Circuit switching wastes capacity whenever a path is idle (silence in a phone call still holds the circuit). Packet switching fills the link with whoever has data right now — many senders share one wire without pre-negotiating. The cost of this efficiency is that packets can be delayed or dropped when the link is busy; reliability must be added at a higher layer.",
      ja: "**統計的多重化**がインターネットを安価で耐障害性の高いものにしている。回線交換は経路がアイドル状態（電話の沈黙）でも容量を無駄にする。パケット交換は今データを持っている誰かでリンクを埋める——多数の送信者が事前交渉なしに1本のワイヤーを共有する。この効率性の代償は、リンクが混雑するとパケットが遅延・廃棄される可能性であり、信頼性はより高いレイヤーで追加しなければならない。",
    },
    detail: {
      en: "A circuit-switched call across the Atlantic in 1960 reserved 64 kbps of copper for its entire duration — even during silences, which are roughly 50 % of a voice call. Packet switching was radical because it treated the network as a *shared resource* rather than a collection of private pipes. Baran's motivation was military survivability: a packet-switched network has no single point that an adversary can cut to silence all communication. Davies came to the same architecture from a desire to let many interactive computer terminals share expensive mainframe connections efficiently. Both were right, and the Internet is their combined legacy.",
      ja: "1960年代の大西洋横断回線交換通話は、通話全体を通じて64 kbpsの銅線を確保した——通話の約50%を占める無音時間中でさえも。パケット交換は、ネットワークをプライベートなパイプの集合ではなく*共有リソース*として扱うという点で革命的だった。バランの動機は軍の生存性だった：パケット交換ネットワークには、敵が切断してすべての通信を遮断できる単一障害点がない。デービスは多数のインタラクティブな端末が高価なメインフレーム接続を効率的に共有できるようにしたいという要望から同じアーキテクチャに到達した。両者とも正しく、インターネットは彼らの共同遺産だ。",
    },
  },

  // 3 -----------------------------------------------------------------------
  {
    id: "arpanet",
    title: {
      en: "3. ARPANET & store-and-forward — the end-to-end principle",
      ja: "3. ARPANETとストア・アンド・フォワード——エンドツーエンド原則",
    },
    milestone: {
      en: "In October 1969 the first ARPANET message was sent from UCLA to Stanford Research Institute — only the letters 'lo' arrived before the SRI system crashed attempting to receive 'login'. By 1972 the network had grown to around 30 nodes; by 1973 it spanned the Atlantic.",
      ja: "1969年10月、ARPANETの最初のメッセージがUCLAからスタンフォード研究所に送信された——「login」を受信しようとしたSRIのシステムがクラッシュし、届いたのは「lo」の2文字だけだった。1972年までにネットワークは約30ノードに成長し、1973年には大西洋を横断した。",
    },
    mentalModel: {
      en: "The **end-to-end principle** (Saltzer, Reed & Clark, 1984): intelligence belongs at the endpoints, not in the network core. The network's job is to move bits; correctness, ordering, and reliability are the responsibility of the communicating applications. A network that tries to guarantee reliability in the middle becomes complex and brittle; a dumb, best-effort network that endpoints can reason about is far more flexible and composable.",
      ja: "**エンドツーエンド原則**（Saltzer・Reed・Clark、1984年）：インテリジェンスはネットワークコアではなくエンドポイントに属する。ネットワークの仕事はビットを移動させること；正確性・順序・信頼性は通信するアプリケーションの責任だ。ネットワーク内部で信頼性を保証しようとするネットワークは複雑で脆弱になる；エンドポイントが推論できるシンプルなベストエフォートネットワークははるかに柔軟で組み合わせやすい。",
    },
    detail: {
      en: "ARPANET's IMPs (Interface Message Processors) were minicomputer-based packet switches that used **store-and-forward**: each IMP received a complete packet, verified its checksum, stored it briefly, then forwarded it to the next hop. This differs from circuit switching (where bits flow continuously) and from a hub (which forwards bits the instant they arrive). Store-and-forward lets each hop error-check its local link independently, and lets the network absorb bursts without dropping packets when a downstream link is temporarily busy — a forerunner of modern router buffers. The end-to-end principle, formalised later, explains why ARPANET could add new applications (email, FTP, telnet) without modifying the packet switches at all.",
      ja: "ARPANETのIMP（Interface Message Processor）はミニコンピュータベースのパケットスイッチで、**ストア・アンド・フォワード**を使用した：各IMPは完全なパケットを受信し、チェックサムを検証し、一時的に格納してから次のホップに転送した。これは回線交換（ビットが連続的に流れる）やハブ（到着した瞬間にビットを転送する）とは異なる。ストア・アンド・フォワードにより各ホップがローカルリンクを独立してエラーチェックでき、ダウンストリームリンクが一時的にビジーな場合でもパケットを廃棄せずにバーストを吸収できる——現代のルーターバッファの先駆けだ。後に定式化されたエンドツーエンド原則は、ARPANETがパケットスイッチをまったく変更せずに新しいアプリケーション（メール・FTP・telnet）を追加できた理由を説明している。",
    },
  },

  // 4 -----------------------------------------------------------------------
  {
    id: "ethernet",
    title: {
      en: "4. Ethernet, MAC addresses & switches — the local link",
      ja: "4. EthernetとMACアドレスとスイッチ——ローカルリンク",
    },
    milestone: {
      en: "Bob Metcalfe and David Boggs at Xerox PARC invented Ethernet in 1973, initially running at 2.94 Mbps over coaxial cable; the IEEE 802.3 standard followed in 1983, and Ethernet has since scaled from 10 Mbps to 400 Gbps while the frame format has barely changed.",
      ja: "ボブ・メトカルフとデビッド・ボッグスはゼロックスPARCで1973年にEthernetを発明した。当初は同軸ケーブル上で2.94 Mbpsで動作し、1983年にIEEE 802.3標準が続いた。フレームフォーマットはほとんど変わらないまま、Ethernetは10 Mbpsから400 Gbpsへとスケールしてきた。",
    },
    mentalModel: {
      en: "Every layer needs its own addressing. IP addresses are logical and can be reassigned; MAC addresses are physical identifiers burned into the network card at manufacture (48 bits, supposed to be globally unique). A switch operates purely on MAC addresses — it never looks at IP — and learns the topology of the local network by watching which MAC appears on which port. This separation between link-layer addressing and network-layer addressing is layering in action: the switch does not need to know anything about IP, TCP, or HTTP to forward frames correctly.",
      ja: "すべてのレイヤーには固有のアドレッシングが必要だ。IPアドレスは論理的で再割り当て可能；MACアドレスは製造時にネットワークカードに書き込まれた物理識別子だ（48ビット、グローバルに一意であるべき）。スイッチは純粋にMACアドレスで動作し——IPを参照しない——どのポートにどのMACが現れるかを観察することでローカルネットワークのトポロジーを学習する。リンク層アドレッシングとネットワーク層アドレッシングの分離はレイヤリングの実践だ：スイッチはIP・TCP・HTTPについて何も知らなくても正しくフレームを転送できる。",
    },
    detail: {
      en: "Early Ethernet used a shared coaxial bus: all machines listened to all packets, and only the destination NIC would keep a frame (based on the destination MAC). If two machines transmitted simultaneously, their signals collided and both were destroyed. CSMA/CD (Carrier Sense Multiple Access / Collision Detection) was the arbitration rule: listen before transmitting; if a collision is detected, back off a random exponential time and retry. Switches eliminated this problem entirely: a switch creates a *private* full-duplex link between each port, so there is only ever one sender per segment. Gigabit Ethernet ports on modern switches never experience collisions — CSMA/CD is now relevant only as history and in Wi-Fi's cousin protocol CSMA/CA.",
      ja: "初期のEthernetは共有の同軸バスを使用していた：すべてのマシンがすべてのパケットを受信し、宛先NICだけがフレームを保持する（宛先MACに基づいて）。2台のマシンが同時に送信すると信号が衝突し、両方が破壊された。CSMA/CD（キャリア検知多重アクセス/衝突検出）がその調停規則だった：送信前にリッスンし、衝突が検出されたらランダムな指数バックオフ時間を置いて再試行する。スイッチはこの問題を完全に解消した：スイッチは各ポート間に*プライベート*な全二重リンクを作成するため、セグメントごとに送信者は常に1台だけだ。現代のスイッチのギガビットEthernetポートは衝突を経験しない——CSMA/CDは今では歴史的事実とWi-FiのいとこプロトコルCSMA/CAにのみ関連する。",
    },
    example:
      "Frame: [Dst MAC 6B][Src MAC 6B][EtherType 2B][Payload ≤1500B][FCS 4B]",
  },

  // 5 -----------------------------------------------------------------------
  {
    id: "ip-cidr",
    title: {
      en: "5. IP, addressing & CIDR — internetworking",
      ja: "5. IPとアドレッシングとCIDR——インターネットワーキング",
    },
    milestone: {
      en: "Vint Cerf and Bob Kahn published the TCP/IP specification in 1974; the ARPANET completed its flag-day migration to TCP/IP on 1 January 1983, and the modern Internet was born. CIDR (Classless Inter-Domain Routing) replaced the original class-based system in 1993, halving routing table growth and extending the IPv4 era.",
      ja: "ヴィント・サーフとボブ・カーンが1974年にTCP/IP仕様を発表した；ARPANETは1983年1月1日にTCP/IPへの移行を完了し、現代のインターネットが誕生した。CIDR（クラスレスドメイン間ルーティング）は1993年にクラスベースシステムを置き換え、ルーティングテーブルの成長を半減させIPv4時代を延長した。",
    },
    mentalModel: {
      en: "IP is **stateless, best-effort delivery**. Each packet is independent; routers do not remember previous packets, maintain sessions, or guarantee anything. Every router makes a purely local decision — look up the destination in the routing table, pick the best matching prefix, forward to the next hop — and the global outcome of millions of these local decisions is correct delivery across the planet. This is the power of distributed, local knowledge: no single entity needs to understand the whole network.",
      ja: "IPは**ステートレスなベストエフォート配送**だ。各パケットは独立しており、ルーターは過去のパケットを記憶せず、セッションを維持せず、何も保証しない。すべてのルーターは純粋にローカルな決定を行う——ルーティングテーブルで宛先を検索し、最もマッチするプレフィックスを選び、次のホップに転送する——そしてこれら何百万ものローカルな決定のグローバルな結果が、地球規模での正しい配送だ。これが分散したローカル知識の力だ：ネットワーク全体を理解する必要のある単一のエンティティは存在しない。",
    },
    detail: {
      en: "An IPv4 address is 32 bits, conventionally written as four decimal octets (`192.0.2.1`). CIDR notation (`192.0.2.0/24`) expresses both an address and its prefix length: the first 24 bits identify the network; the remaining 8 bits identify a specific host within it. A router reading `192.0.2.0/24` knows it can reach up to 254 hosts (256 minus the network and broadcast addresses) via one routing table entry. **Longest-prefix match** is the key algorithm: when multiple prefixes match a destination, the router picks the most specific one (`/28` beats `/24`). The explosion of routing table entries in the early 1990s nearly broke the Internet; CIDR's route aggregation (announcing one `/16` instead of 256 separate `/24`s) saved it by reducing the global table from hundreds of thousands to tens of thousands of entries at the time.",
      ja: "IPv4アドレスは32ビットで、慣例的に4つの10進オクテット（`192.0.2.1`）で記述される。CIDR表記（`192.0.2.0/24`）はアドレスとプレフィックス長の両方を表現する：最初の24ビットがネットワークを識別し、残りの8ビットがその中の特定のホストを識別する。ルーターは`192.0.2.0/24`を読んで、1つのルーティングテーブルエントリで最大254台のホスト（256からネットワークアドレスとブロードキャストアドレスを引く）に到達できることを知る。**最長プレフィックスマッチ**が鍵となるアルゴリズムだ：複数のプレフィックスが宛先にマッチする場合、ルーターは最も具体的なもの（`/28`は`/24`より優先）を選ぶ。1990年代初頭のルーティングテーブルエントリの爆発的増加はインターネットをほぼ壊滅させそうになったが、CIDRのルート集約（256個の`/24`の代わりに1つの`/16`を通知する）は当時グローバルテーブルを数十万エントリから数万エントリに削減することで救った。",
    },
    example: "192.0.2.0/24  →  network 192.0.2.x,  hosts .1–.254",
  },

  // 6 -----------------------------------------------------------------------
  {
    id: "tcp",
    title: {
      en: "6. TCP — reliability on top of an unreliable network",
      ja: "6. TCP——信頼性のないネットワークの上の信頼性",
    },
    milestone: {
      en: "TCP and IP began as a single monolithic protocol; the two were split into separate layers in 1978, and the Transmission Control Protocol was later specified in RFC 793 (1981) by Vint Cerf, Bob Kahn, and collaborators — giving the internet its two-layer reliability architecture.",
      ja: "TCPとIPは当初1つのモノリシックプロトコルだった；1978年に両者は別々の層へと分離され、伝送制御プロトコルは後の1981年にRFC 793としてヴィント・サーフ、ボブ・カーン、共同研究者たちによって仕様化された——インターネットに2層の信頼性アーキテクチャを与えた。",
    },
    mentalModel: {
      en: "**Reliability at the edges, not in the core.** TCP does not ask the network to guarantee delivery; instead, the sender keeps every segment until the receiver acknowledges it, and retransmits if an acknowledgement doesn't arrive in time. This means the network stays simple (IP just routes) and reliability is an add-on at the endpoints. A second key insight: **flow control and congestion control are separate concerns**. Flow control prevents the sender from overwhelming the receiver's buffer (the receiver advertises a window). Congestion control prevents the sender from overwhelming the network (the sender probes for available capacity with slow-start and backs off on loss).",
      ja: "**エッジでの信頼性、コアではなく。** TCPはネットワークに配送を保証するよう求めない；代わりに、送信者は受信者が確認応答するまですべてのセグメントを保持し、タイムリーに確認応答が届かなければ再送信する。これはネットワークをシンプルに保ち（IPはただルーティングするだけ）、信頼性はエンドポイントにアドオンされる。もう1つの重要な洞察：**フロー制御と輻輳制御は別々の関心事だ**。フロー制御は送信者が受信者のバッファを圧倒するのを防ぐ（受信者がウィンドウをアドバタイズする）。輻輳制御は送信者がネットワークを圧倒するのを防ぐ（送信者はスロースタートで利用可能な容量を探索し、損失時にバックオフする）。",
    },
    detail: {
      en: "The three-way handshake (SYN → SYN-ACK → ACK) synchronises two random Initial Sequence Numbers (ISNs) before any data flows. Random ISNs prevent an off-path attacker from injecting forged segments into an existing connection — a quiet but important security property. Once established, TCP uses a sliding window: the sender can have multiple segments outstanding simultaneously (up to the window size) without waiting for each individual ACK. Congestion control algorithms like TCP CUBIC (Linux default) and BBR (Google) independently discovered that the key challenge is probing for available bandwidth without causing excessive queuing delay — a problem that turns out to share deep mathematical structure with control theory and information theory.",
      ja: "3ウェイハンドシェイク（SYN → SYN-ACK → ACK）は、データが流れる前に2つのランダムな初期シーケンス番号（ISN）を同期させる。ランダムなISNは、オフパスの攻撃者が既存の接続に偽造セグメントを注入するのを防ぐ——静かだが重要なセキュリティ特性だ。確立後、TCPはスライディングウィンドウを使用する：送信者は各ACKを待たずに複数のセグメントを同時に送信できる（ウィンドウサイズまで）。TCP CUBIC（Linuxデフォルト）やBBR（Google）などの輻輳制御アルゴリズムは、過度のキューイング遅延を引き起こさずに利用可能な帯域を探索することが重要な課題だと独立して発見した——これは制御理論と情報理論と深い数学的構造を共有する問題であることが判明している。",
    },
    example:
      "Sender ISN=1000 → SYN seq=1000\nReceiver ISN=5000 → SYN-ACK seq=5000 ack=1001\nSender → ACK seq=1001 ack=5001  [ESTABLISHED]",
  },

  // 7 -----------------------------------------------------------------------
  {
    id: "bgp",
    title: {
      en: "7. BGP, autonomous systems & submarine cables — global routing",
      ja: "7. BGPと自律システムと海底ケーブル——グローバルルーティング",
    },
    milestone: {
      en: "BGP (Border Gateway Protocol) was standardised in RFC 1105 (1989) and refined to BGP-4 (RFC 1771, 1995), which introduced CIDR-aware prefix aggregation; today over 100,000 autonomous systems (ISPs, cloud providers, enterprises) use BGP-4 to exchange routing information across the public Internet.",
      ja: "BGP（ボーダーゲートウェイプロトコル）はRFC 1105（1989年）で標準化され、BGP-4（RFC 1771、1995年）に改善された；BGP-4はCIDR対応のプレフィックス集約を導入し、今日では10万以上の自律システム（ISP・クラウドプロバイダー・企業）がパブリックインターネット上でルーティング情報を交換するためにBGP-4を使用している。",
    },
    mentalModel: {
      en: "The Internet's global routing is an **emergent property of distributed policy**. No central authority computes optimal routes. Instead, each Autonomous System (AS) — an ISP, a cloud provider, a university — announces which IP prefixes it owns and which it can reach, and what business relationships it has with neighbours (customer, peer, provider). BGP assembles the global routing table from these local announcements. The result is robust: when a submarine cable breaks or a major AS fails, BGP reconverges in seconds to minutes, routing around the damage — exactly as Baran envisioned in 1964.",
      ja: "インターネットのグローバルルーティングは**分散ポリシーの創発的特性**だ。最適な経路を計算する中央機関は存在しない。代わりに、各自律システム（AS）——ISP・クラウドプロバイダー・大学——は自身が所有するIPプレフィックスと到達できるプレフィックス、隣接AS（顧客・ピア・プロバイダー）とのビジネス関係を通知する。BGPはこれらのローカル通知からグローバルルーティングテーブルを組み立てる。結果は堅牢だ：海底ケーブルが切断されたり主要なASが障害を起こしたりすると、BGPは秒から分のオーダーで再収束し、障害を迂回してルーティングする——まさにバランが1964年に構想した通りだ。",
    },
    detail: {
      en: "BGP is a path-vector protocol: each AS advertisement carries the full AS-path (a list of AS numbers the route has traversed), preventing routing loops. Anycast is a powerful trick enabled by BGP: the same IP address is announced from multiple geographic locations, and the network naturally routes each user to the topologically nearest instance. DNS root servers and CDN edge nodes use anycast — it is why a DNS query to `8.8.8.8` reaches a Google datacenter a few hops away rather than one on the other side of the planet. The physical backbone of the Internet is roughly 400 submarine cable systems; a single modern cable (such as 2Africa, 2023) can carry 180 Tbps — more bandwidth than all transatlantic cables of 2000 combined.",
      ja: "BGPはパスベクトルプロトコルだ：各AS広告は完全なASパス（経路が通過したAS番号のリスト）を持ち、ルーティングループを防ぐ。エニーキャストはBGPによって可能になる強力なトリックだ：同じIPアドレスが複数の地理的場所から通知され、ネットワークは自然に各ユーザーをトポロジー的に最寄りのインスタンスにルーティングする。DNSルートサーバーとCDNエッジノードはエニーキャストを使用する——DNSクエリが`8.8.8.8`に到達すると、地球の反対側ではなく数ホップ先のGoogleデータセンターに届く理由だ。インターネットの物理的なバックボーンは約400本の海底ケーブルシステムだ；単一の現代的なケーブル（2Africa、2023年など）は180 Tbpsを運べる——2000年のすべての大西洋横断ケーブルの合計帯域より多い。",
    },
  },

  // 8 -----------------------------------------------------------------------
  {
    id: "nat-dhcp",
    title: {
      en: "8. NAT, private addresses & DHCP — the home network",
      ja: "8. NATとプライベートアドレスとDHCP——ホームネットワーク",
    },
    milestone: {
      en: "RFC 1918 (1996) reserved three address blocks for private use; NAT (Network Address Translation) became the standard home-router technique by the late 1990s, effectively hiding thousands of devices behind a single public IP address and extending the IPv4 address space by at least a decade.",
      ja: "RFC 1918（1996年）は3つのアドレスブロックをプライベート使用のために予約した；NAT（ネットワークアドレス変換）は1990年代後半に標準的なホームルーター技術となり、事実上何千台もの機器を単一のパブリックIPアドレスの背後に隠し、IPv4アドレス空間を少なくとも10年延長した。",
    },
    mentalModel: {
      en: "NAT is a **workaround with a cost**. It multiplexes many private (IP, port) pairs through one public IP by rewriting packet headers at the router. The cost is that it breaks the Internet's end-to-end principle: a host behind NAT cannot be directly addressed from the outside. Peer-to-peer protocols (VoIP, WebRTC, BitTorrent) must use NAT traversal techniques (STUN, TURN, ICE) to punch through. DHCP is the complementary mechanism: instead of manually configuring each device, a DHCP server hands out addresses, subnet masks, gateway addresses, and DNS server addresses automatically, making large networks manageable.",
      ja: "NATは**コストを伴うワークアラウンド**だ。ルーターでパケットヘッダーを書き換えることで、多数のプライベート（IP・ポート）ペアを1つのパブリックIPで多重化する。コストは、インターネットのエンドツーエンド原則を破ること：NAT背後のホストは外部から直接アドレス指定できない。P2Pプロトコル（VoIP・WebRTC・BitTorrent）はNATトラバーサル技術（STUN・TURN・ICE）を使用して貫通しなければならない。DHCPは補完的なメカニズムだ：各デバイスを手動で設定する代わりに、DHCPサーバーがアドレス・サブネットマスク・ゲートウェイアドレス・DNSサーバーアドレスを自動的に配布し、大規模ネットワークを管理可能にする。",
    },
    detail: {
      en: "When your laptop sends a TCP SYN to an external server, the home router records the mapping `(192.168.1.42:54321, 93.184.216.34:80)` in its NAT table, rewrites the source address to its own public IP with a fresh port, and forwards the packet. When the reply arrives, the router reverses the rewrite. The laptop and the server are unaware of each other's real addresses. This transparency is NAT's appeal — but it breaks any protocol where the external peer must initiate the connection. IPv6 was designed to make NAT unnecessary (every device gets a globally routable address), and DHCP-equivalent functionality is built into IPv6 via SLAAC (Stateless Address Autoconfiguration).",
      ja: "ラップトップが外部サーバーにTCP SYNを送信すると、ホームルーターはNATテーブルにマッピング`(192.168.1.42:54321, 93.184.216.34:80)`を記録し、送信元アドレスを新しいポートで自身のパブリックIPに書き換え、パケットを転送する。返信が届くと、ルーターは書き換えを逆にする。ラップトップとサーバーはお互いの実際のアドレスを知らない。この透過性がNATの魅力だ——しかし外部ピアが接続を開始しなければならないプロトコルはすべて壊れる。IPv6はNATを不要にするように設計されており（すべてのデバイスがグローバルにルーティング可能なアドレスを取得）、DHCP相当の機能はSLAAC（ステートレスアドレス自動構成）によってIPv6に組み込まれている。",
    },
    example:
      "RFC 1918 private ranges:\n  10.0.0.0/8      (16 M hosts)\n  172.16.0.0/12   (1 M hosts)\n  192.168.0.0/16  (65 K hosts)",
  },

  // 9 -----------------------------------------------------------------------
  {
    id: "dns",
    title: {
      en: "9. DNS — hierarchical delegation at global scale",
      ja: "9. DNS——グローバルスケールでの階層的委任",
    },
    milestone: {
      en: "Before DNS, every host on the ARPANET was listed in a single flat file (`HOSTS.TXT`) maintained by the Stanford Research Institute; by 1983 this was unmanageable, and Paul Mockapetris designed DNS (RFC 882/883, 1983; revised as RFC 1034/1035, 1987), a distributed hierarchical database that has since scaled to billions of queries per second.",
      ja: "DNS以前、ARPANET上のすべてのホストはスタンフォード研究所が管理する単一のフラットファイル（`HOSTS.TXT`）にリストされていた；1983年までにこれは管理不能となり、ポール・モッカペトリスがDNS（RFC 882/883、1983年；RFC 1034/1035、1987年として改訂）を設計した。DNSはその後毎秒数十億クエリまでスケールした分散階層型データベースだ。",
    },
    mentalModel: {
      en: "**Hierarchical delegation + caching = global scale without a central database.** No single server knows all DNS records. Instead, authority is delegated: ICANN manages root, registries manage TLDs (`.com`, `.jp`), registrars delegate to domain owners, domain owners delegate zones to their own nameservers. Each level answers only for its zone and points lower for everything else. Caching amplifies this: once a resolver has an answer, it serves it from cache for the TTL without touching the hierarchy. The result is a system handling the entire Internet's name lookups with just 13 root server IP addresses (served by hundreds of anycast instances).",
      ja: "**階層的委任＋キャッシュ＝中央データベースなしのグローバルスケール。** 単一のサーバーがすべてのDNSレコードを知っているわけではない。代わりに権限が委任される：ICANNがルートを管理し、レジストリがTLD（`.com`・`.jp`）を管理し、レジストラがドメインオーナーに委任し、ドメインオーナーが自身のネームサーバーにゾーンを委任する。各レベルは自身のゾーンにのみ回答し、他のすべてについてはより下位を指す。キャッシュがこれを増幅する：リゾルバーが回答を得ると、TTLの間は階層に触れることなくキャッシュから提供する。結果は、わずか13のルートサーバーIPアドレス（何百ものエニーキャストインスタンスで提供）でインターネット全体の名前解決を処理するシステムだ。",
    },
    detail: {
      en: "A cold DNS lookup for `mail.example.com` makes four round trips in the worst case: stub → recursive resolver (cache miss) → root (returns `.com` NS) → TLD server (returns `example.com` NS) → authoritative server (returns A record). In practice, `.com` and `.org` TLD answers are almost always cached at recursive resolvers, so typical resolution is two round trips. The TTL mechanism creates a tension: a domain that wants instant failover must set a low TTL (60 s), but low TTL means high resolver load; a large provider might set TTL to 300 s as a compromise. DNSSEC (RFC 4033-4035, 2005) adds cryptographic signatures to each level of the hierarchy so resolvers can verify the chain of trust from the root down, preventing cache poisoning attacks where an adversary injects false records.",
      ja: "コールドDNSルックアップ`mail.example.com`は最悪の場合4回のラウンドトリップを要する：スタブ → 再帰リゾルバー（キャッシュミス）→ ルート（`.com` NSを返す）→ TLDサーバー（`example.com` NSを返す）→ 権威サーバー（Aレコードを返す）。実際には`.com`と`.org` TLDの回答はほぼ常に再帰リゾルバーにキャッシュされているため、典型的な解決は2ラウンドトリップだ。TTLメカニズムはトレードオフを生む：即時フェイルオーバーを望むドメインは低いTTL（60秒）を設定しなければならないが、低いTTLはリゾルバーの高負荷を意味する；大規模プロバイダーは妥協としてTTLを300秒に設定するかもしれない。DNSSEC（RFC 4033-4035、2005年）は階層の各レベルに暗号署名を追加し、リゾルバーがルートから下へ信頼チェーンを検証できるようにして、攻撃者が偽のレコードを注入するキャッシュポイズニング攻撃を防ぐ。",
    },
  },

  // 10 ----------------------------------------------------------------------
  {
    id: "http-web",
    title: {
      en: "10. HTTP, URLs & the Web — the application layer that changed everything",
      ja: "10. HTTPとURLとWeb——すべてを変えたアプリケーション層",
    },
    milestone: {
      en: "Tim Berners-Lee at CERN proposed the World Wide Web in 1989, implementing the first HTTP server and browser by Christmas 1990; HTTP/1.0 was formalised in RFC 1945 (1996), and the Web grew from a few hundred servers in 1991 to over a billion today.",
      ja: "CERNのティム・バーナーズ＝リーは1989年にWorld Wide Webを提案し、1990年のクリスマスまでに最初のHTTPサーバーとブラウザを実装した；HTTP/1.0はRFC 1945（1996年）として公式化され、Webは1991年の数百台のサーバーから今日では10億台以上に成長した。",
    },
    mentalModel: {
      en: "**Uniform resource identifiers + a request/response protocol = infinite composability.** A URL (`scheme://host/path?query`) is a universal name for any resource on any server anywhere in the world. HTTP's method semantics (GET = safe read, POST = create, PUT = replace, DELETE = remove) define a narrow but universally understood contract. Any client speaking HTTP can consume any server's resources without prior coordination. This is what enabled the Web's explosive growth: adding a new server required no permission, no protocol negotiation, no central registration — just publish a URL.",
      ja: "**統一リソース識別子＋リクエスト/レスポンスプロトコル＝無限の組み合わせ可能性。** URL（`scheme://host/path?query`）は世界中のどのサーバー上のどのリソースに対しても普遍的な名前だ。HTTPのメソッドセマンティクス（GET＝安全な読み取り、POST＝作成、PUT＝置換、DELETE＝削除）は狭いが普遍的に理解されるコントラクトを定義する。HTTPを話すどのクライアントも、事前の調整なしにどのサーバーのリソースも利用できる。これがWebの爆発的な成長を可能にしたものだ：新しいサーバーを追加するのに許可も、プロトコルのネゴシエーションも、中央登録も不要だった——URLを公開するだけだ。",
    },
    detail: {
      en: "HTTP's evolution tracks the evolution of web performance engineering. HTTP/1.0 opened a new TCP connection per request — expensive when each TCP handshake costs 1 RTT and TLS adds another. HTTP/1.1 introduced persistent connections (keep-alive) and pipelining, but pipelining was fragile and browsers never trusted it; the workaround was opening 6 parallel connections per origin, multiplying resource consumption. HTTP/2 (RFC 7540, 2015) finally solved this with binary framing and stream multiplexing over a single connection, cutting TCP connection count from tens to one. HTTP/3 (RFC 9114, 2022) replaced TCP itself with QUIC — a UDP-based transport that multiplexes streams at the transport layer, so a packet loss on one stream does not stall others. The bandwidth of each generation was similar; the latency story is why these protocol generations matter.",
      ja: "HTTPの進化はWebパフォーマンスエンジニアリングの進化を追跡する。HTTP/1.0はリクエストごとに新しいTCP接続を開いた——各TCPハンドシェイクが1 RTTかかり、TLSがさらに追加されると高コストだ。HTTP/1.1はパーシステント接続（keep-alive）とパイプラインを導入したが、パイプラインは不安定でブラウザは信頼しなかった；ワークアラウンドはオリジンごとに6つの並列接続を開くことで、リソース消費を倍増させた。HTTP/2（RFC 7540、2015年）は最終的に単一接続上のバイナリフレーミングとストリーム多重化でこれを解決し、TCP接続数を数十から1に削減した。HTTP/3（RFC 9114、2022年）はTCP自体をQUICに置き換えた——UDPベースのトランスポートがトランスポート層でストリームを多重化するため、1つのストリームのパケット損失が他を止めない。各世代の帯域幅は似ており、これらのプロトコル世代が重要な理由はレイテンシの話だ。",
    },
    example:
      "GET /docs/network HTTP/1.1\nHost: nand2web.example\nAccept: text/html\n\nHTTP/1.1 200 OK\nContent-Type: text/html; charset=utf-8",
  },

  // 11 ----------------------------------------------------------------------
  {
    id: "tls",
    title: {
      en: "11. TLS & public-key cryptography — trust over an open network",
      ja: "11. TLSと公開鍵暗号——開かれたネットワーク上の信頼",
    },
    milestone: {
      en: "Netscape introduced SSL (Secure Sockets Layer) in 1994 to secure early e-commerce; SSL 3.0 became TLS 1.0 (RFC 2246, 1999), and TLS 1.3 (RFC 8446, 2018) cut the handshake to one round trip and eliminated all historically weak cipher suites. Let's Encrypt (2015) made free, automated certificates available to any website, completing the shift to HTTPS-everywhere.",
      ja: "ネットスケープは初期の電子商取引を保護するために1994年にSSL（Secure Sockets Layer）を導入した；SSL 3.0はTLS 1.0（RFC 2246、1999年）となり、TLS 1.3（RFC 8446、2018年）はハンドシェイクを1ラウンドトリップに短縮し、歴史的に弱い暗号スイートをすべて排除した。Let's Encrypt（2015年）は無料の自動化された証明書をあらゆるWebサイトで利用可能にし、HTTPS-everywhere への移行を完了させた。",
    },
    mentalModel: {
      en: "**Public-key cryptography solves the key-distribution problem.** In symmetric cryptography, two parties must share a secret before they can communicate securely — but how do you share that secret on an open network? Diffie and Hellman (1976) showed that two parties can derive a shared secret over a public channel using the mathematics of discrete logarithms, without ever transmitting the secret itself. TLS uses this (via ECDHE) for **forward secrecy**: even if a private key is later compromised, past sessions cannot be decrypted. Certificates solve a different problem: proving that a public key actually belongs to `www.example.com` and not to an attacker. Certificate Authorities (CAs) sign these bindings; browsers trust a list of root CAs pre-installed by the OS.",
      ja: "**公開鍵暗号は鍵配送問題を解決する。** 対称暗号では、2者が安全に通信するには事前に秘密を共有しなければならない——しかしオープンなネットワーク上でその秘密をどうやって共有するのか？ディフィーとヘルマン（1976年）は、秘密自体を送信することなく、離散対数の数学を使ってパブリックチャネル上で2者が共有秘密を導出できることを示した。TLSはこれ（ECDHE経由）を**前方秘匿性**のために使用する：秘密鍵が後に危殆化されても、過去のセッションは復号できない。証明書は別の問題を解決する：公開鍵が実際に`www.example.com`に属し攻撃者ではないことを証明する。証明機関（CA）がこれらのバインディングに署名し、ブラウザはOSにプリインストールされたルートCAのリストを信頼する。",
    },
    detail: {
      en: "A TLS 1.3 handshake works in one round trip: the client sends its key share (an ephemeral ECDH public key) and a list of supported cipher suites in the ClientHello. The server responds with its key share, chosen cipher, and its certificate chain in the ServerHello + EncryptedExtensions + Certificate + CertificateVerify messages — all in one flight. Both sides can now derive the same symmetric session key from the two ephemeral ECDH values, without the key ever appearing on the wire. The server's certificate is signed by a CA; the browser walks the chain to a trusted root. Thereafter, all data is encrypted with AES-GCM or ChaCha20-Poly1305 — authenticated encryption that provides both confidentiality and tamper detection in a single pass. The practical consequence: every byte your browser sends to an HTTPS site is unreadable to any router, ISP, or eavesdropper on the path.",
      ja: "TLS 1.3ハンドシェイクは1ラウンドトリップで機能する：クライアントはClientHelloで鍵共有（エフェメラルECDH公開鍵）とサポートされる暗号スイートのリストを送信する。サーバーはServerHello + EncryptedExtensions + Certificate + CertificateVerifyメッセージで鍵共有・選択された暗号・証明書チェーンを返す——すべて1つのフライトで。両者は鍵がワイヤー上に現れることなく、2つのエフェメラルECDH値から同じ対称セッション鍵を導出できる。サーバーの証明書はCAによって署名されており、ブラウザはチェーンを信頼されたルートまで辿る。以降、すべてのデータはAES-GCMまたはChaCha20-Poly1305で暗号化される——機密性と改ざん検出の両方を単一パスで提供する認証付き暗号だ。実用的な結果：ブラウザがHTTPSサイトに送信するすべてのバイトは、経路上のルーター・ISP・盗聴者には読めない。",
    },
    example:
      "Client → Server: ClientHello (key_share, cipher_suites)\nServer → Client: ServerHello + Certificate + CertificateVerify\n[Both derive shared key via ECDHE]\nAll subsequent traffic: AES-GCM encrypted",
  },
];

/** The "Further reading" attribution linking to the article that inspired this section. */
export const NETWORK_HISTORY_FURTHER_READING = {
  href: "https://fazamhd.com/mental-models/networking/",
  label: {
    en: "Networking mental models — Faza",
    ja: "ネットワーキングのメンタルモデル——Faza",
  },
  note: {
    en: "This history & mental models section was inspired by Faza's article on networking mental models. The prose above is original; Faza's article is the recommended next read.",
    ja: "このセクションはFazaのネットワーキングメンタルモデルに関する記事にインスパイアされています。上記の文章はオリジナルです。次の読み物としてFazaの記事をおすすめします。",
  },
} as const;
