import type { DeepDiveContent } from "../deepdive/DeepDive";

export const netDeepDive: DeepDiveContent = {
  sections: [
    {
      title: {
        en: "Historical context — the birth of TCP/IP",
        ja: "時代背景 — TCP/IP の誕生",
      },
      paragraphs: [
        {
          en: 'In 1974, Vinton Cerf and Robert Kahn published **"A Protocol for Packet Network Intercommunication"**, the paper that defined TCP. The key insight was *heterogeneity*: no single network technology would dominate, so the internet had to route packets across wildly different physical media — ARPANET, satellite links, radio nets — while appearing uniform to applications. The solution was a thin "waist": IP at the network layer handles addressing and routing, TCP at the transport layer handles reliability and ordering, and everything else (Ethernet, Wi-Fi, fiber) lives below.',
          ja: "1974年、ヴィントン・サーフとロバート・カーンは**「パケットネットワーク相互接続プロトコル」**という論文を発表し、TCPを定義しました。核心にあった洞察は*異質性*でした。単一のネットワーク技術が支配的になることはない——だからインターネットは、ARPANET・衛星回線・無線ネットなど全く異なる物理メディアをまたいでパケットをルーティングしながら、アプリケーションには統一された顔を見せなければならない。その解答が薄い「くびれ」です。ネットワーク層のIPがアドレッシングとルーティングを担い、トランスポート層のTCPが信頼性と順序制御を担い、それ以外（Ethernet・Wi-Fi・光ファイバー）はすべて下に置かれます。",
        },
        {
          en: "The **OSI model** (1984, from ISO) came later and tried to standardize networking into seven layers. TCP/IP predates it and maps loosely: IP ≈ Layer 3, TCP ≈ Layer 4, HTTP ≈ Layer 7. Practitioners use both models interchangeably, but real internet traffic follows the four-layer TCP/IP model, not OSI's seven. The OSI model is a teaching framework; TCP/IP is what actually runs.",
          ja: "**OSIモデル**（1984年、ISO策定）は後発で、ネットワーキングを7層に標準化しようとしました。TCP/IPはそれより先に生まれており、ゆるやかに対応します。IP ≈ 第3層、TCP ≈ 第4層、HTTP ≈ 第7層。実務家は両モデルを適宜使い分けますが、実際のインターネットトラフィックは7層のOSIモデルではなく、4層のTCP/IPモデルに従っています。OSIモデルは教育フレームワーク、TCP/IPが実際に動くものです。",
        },
      ],
    },
    {
      title: {
        en: "How TCP works — state machines and reliability",
        ja: "TCP の仕組み — ステートマシンと信頼性",
      },
      paragraphs: [
        {
          en: "TCP is a **state machine** with eleven states (RFC 793). Both endpoints maintain their own state independently; the three-way handshake synchronises sequence numbers so each side knows where the other's stream starts. **SYN** (synchronise), **SYN-ACK**, **ACK** — those three packets establish the sequence number contract, not a \"connection\" in any physical sense. The connection only exists as state in two hosts' kernels.",
          ja: "TCPは**ステートマシン**であり、11の状態を持ちます（RFC 793）。両エンドポイントは独立して自身の状態を管理しており、3-wayハンドシェイクによってシーケンス番号が同期されます。これにより、各サイドは相手のストリームがどこから始まるかを把握できます。**SYN**（同期）、**SYN-ACK**、**ACK**——この3つのパケットはシーケンス番号の契約を確立するものであり、物理的な意味での「接続」ではありません。接続とは、2つのホストのカーネル内に存在する状態にすぎないのです。",
        },
        {
          en: "Reliability comes from **acknowledgement + retransmission**: every byte is numbered, the receiver acknowledges what it got, and the sender retransmits anything not acknowledged within a timeout. The 4-way teardown is symmetric: each side independently closes its half of the connection with a FIN, and TIME_WAIT (2× maximum segment lifetime) prevents old duplicate packets from being mistaken for new connections.",
          ja: "信頼性は**確認応答＋再送信**によって実現されます。すべてのバイトに番号が付けられ、受信側は受け取ったものを確認し、送信側はタイムアウト内に確認されなかったものを再送します。4-way終断処理は対称的です。各サイドが独立してFINで自分側のハーフ接続を閉じ、TIME_WAIT（最大セグメント生存時間の2倍）により、古い重複パケットが新しい接続と誤解されるのを防ぎます。",
        },
      ],
    },
    {
      title: {
        en: "Encapsulation — the protocol stack in action",
        ja: "カプセル化 — プロトコルスタックの動作",
      },
      paragraphs: [
        {
          en: "Each layer **wraps** the layer above with its own header, forming nested envelopes. An HTTP request becomes a TCP segment (adds port numbers and seq/ack), which becomes an IP packet (adds IP addresses and TTL), which becomes an Ethernet frame (adds MAC addresses). The receiving side strips each header in reverse order — **decapsulation**. This layering is what lets you swap Wi-Fi for Ethernet without changing HTTP: each layer only knows about its own header.",
          ja: "各層は上位層を自身のヘッダで**ラップ**し、入れ子状の封筒を形成します。HTTPリクエストはTCPセグメントになり（ポート番号とseq/ackを追加）、それがIPパケットになり（IPアドレスとTTLを追加）、さらにEthernetフレームになります（MACアドレスを追加）。受信側は逆順に各ヘッダを取り除きます——**デカプセル化**です。この層構造があるからこそ、Wi-FiをEthernetに替えてもHTTPを変える必要がない。各層は自分自身のヘッダしか知らないからです。",
        },
        {
          en: '**TTL** (Time To Live) in the IP header is a hop counter. Every router decrements it; if it reaches zero the packet is dropped and an ICMP "time exceeded" message is sent back. This is the mechanism `traceroute` exploits: send packets with TTL=1, 2, 3 … and collect the ICMP replies to map the route. **EtherType 0x0800** tells the network card "the payload is IPv4" — without it, the card would not know what protocol to hand the payload to.',
          ja: "IPヘッダの**TTL**（Time To Live）はホップカウンタです。各ルータがデクリメントし、ゼロになるとパケットは廃棄され、ICMP「time exceeded」メッセージが送り返されます。これが`traceroute`が利用するメカニズムです。TTL=1、2、3…のパケットを送り、ICMPの返答を集めてルートをマッピングします。**EtherType 0x0800**はネットワークカードに「ペイロードはIPv4だ」と伝えます。これがなければ、カードはペイロードをどのプロトコルに渡すか分かりません。",
        },
      ],
    },
    {
      title: {
        en: "DNS — the internet's phonebook",
        ja: "DNS — インターネットの電話帳",
      },
      paragraphs: [
        {
          en: "Paul Mockapetris designed DNS in 1983 (RFC 882/883, revised in 1987 as RFC 1034/1035). Before DNS, a single file — **HOSTS.TXT** — was maintained at the Stanford Research Institute and downloaded by every connected host. By 1983 ARPANET had grown to ~600 hosts; a central file was already unmanageable. DNS replaced it with a **distributed hierarchical database**: the root knows TLD nameservers, TLD nameservers know authoritative servers, authoritative servers know the actual records.",
          ja: "ポール・モカペトリスは1983年にDNSを設計しました（RFC 882/883、1987年にRFC 1034/1035として改訂）。DNS以前は、**HOSTS.TXT**という単一ファイルをスタンフォード研究所が管理し、接続されたすべてのホストがダウンロードしていました。1983年までにARPANETは約600ホストに成長し、中央集権的なファイルはすでに管理不能でした。DNSはそれを**分散階層データベース**に置き換えました。ルートはTLDネームサーバーを知り、TLDネームサーバーは権威サーバーを知り、権威サーバーは実際のレコードを知っています。",
        },
        {
          en: "The **stub resolver** in your OS asks a **recursive resolver** (often your ISP's or 8.8.8.8). The recursive resolver does the legwork: it asks root servers which TLD server handles `.com`, then asks that TLD server which authoritative server handles `example.com`, then asks the authoritative server for the actual IP. Results are **cached** at each level with a TTL set by the record owner — that's why DNS changes can take hours to propagate: old answers are cached until their TTL expires.",
          ja: "あなたのOSの**スタブリゾルバ**が**フルサービスリゾルバ**（よくISPのものや8.8.8.8）に問い合わせます。フルサービスリゾルバが代わりに作業をします。ルートサーバーに`.com`を扱うTLDサーバーを聞き、そのTLDサーバーに`example.com`を扱う権威サーバーを聞き、権威サーバーに実際のIPを聞きます。結果はレコード所有者が設定したTTLとともに各レベルで**キャッシュ**されます——だからDNS変更の反映に数時間かかることがあるのです。古い回答はTTLが切れるまでキャッシュされています。",
        },
      ],
    },
  ],
};
