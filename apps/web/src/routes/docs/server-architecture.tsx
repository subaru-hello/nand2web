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
  Prose,
  References,
  rich,
  Section,
  useSvgId,
  useT,
} from "../../features/docs";
import { makeDocJsonLd, makeHead } from "../../features/seo/seo";
import {
  SERVER_ARCH_FURTHER_READING,
  SERVER_ARCH_STAGES,
} from "../../features/server-architecture/data";

const SERVER_ARCH_TITLE = "Server Architecture — nand2web";
const SERVER_ARCH_DESC =
  "How one server juggles thousands of connections — sockets, blocking I/O, processes, threads, the C10K problem, and event loops — and how servers talk to each other once one is not enough: reverse proxies, RPC, message queues, and microservices.";

export const Route = createFileRoute("/docs/server-architecture")({
  head: () =>
    makeHead({
      title: SERVER_ARCH_TITLE,
      description: SERVER_ARCH_DESC,
      path: "/docs/server-architecture",
      jsonLd: makeDocJsonLd({
        title: SERVER_ARCH_TITLE,
        description: SERVER_ARCH_DESC,
        path: "/docs/server-architecture",
        breadcrumbLabel: "Server Architecture",
      }),
    }),
  component: Page,
});

// Split the 10 stages into the two parts of the page.
const PART1_STAGES = SERVER_ARCH_STAGES.slice(0, 6);
const PART2_STAGES = SERVER_ARCH_STAGES.slice(6);

function Page() {
  const t = useT();
  return (
    <DocsShell active="server-architecture">
      <Article
        title={{
          en: "Server Architecture",
          ja: "サーバーアーキテクチャとサーバー間通信",
        }}
        lead={{
          en: "This page answers two questions that every backend engineer eventually meets. First: how does a *single* server juggle thousands of simultaneous connections without falling over? Second: how do servers talk to *each other* once one machine is no longer enough? The surprising punchline is that the second question is the first question again, scaled up — every concurrency pattern inside one server reappears between machines.",
          ja: "このページは、すべてのバックエンドエンジニアがいつか出会う2つの問いに答えます。1つ目：*1台*のサーバーは、倒れずにどうやって数千の同時接続をさばくのか？ 2つ目：1台では足りなくなったとき、サーバーは*互いに*どうやって話すのか？ 驚きの落ちは、2つ目の問いが1つ目の問いを拡大したものにすぎないということです——1台のサーバー内のあらゆる並行性パターンが、マシン間に再登場します。",
        }}
      >
        {/* ================================================================ */}
        {/* PART 1 — one server, many connections                            */}
        {/* ================================================================ */}
        <Section
          id="one-server"
          title={{
            en: "Part 1 — one server, many connections",
            ja: "Part 1——1台のサーバー、多数の接続",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "Start with the smallest possible server and grow it under pressure. Everything below is a different answer to one question: while the server waits on a slow client, how does it make progress on the others? Each stage inherits the previous stage's hard lesson, exactly as the [networking protocols](/docs/network) did.",
                ja: "考えうる最小のサーバーから始め、圧力の下で育てていきます。以下のすべては、たった1つの問いへの別々の答えです——サーバーが遅いクライアントを待っている間、どうやって他のクライアントを前に進めるのか？ 各ステージは、[ネットワークプロトコル](/docs/network)がそうであったように、前のステージの苦い教訓を受け継ぎます。",
              },
            ]}
          />

          <div className="space-y-8 mt-2">
            {PART1_STAGES.map((stage) => (
              <StageBlock key={stage.id} t={t} stage={stage} />
            ))}
          </div>

          {/* Socket lifecycle diagram */}
          <Figure
            caption={{
              en: "The socket lifecycle: one listening socket accepts each client, spawning a dedicated connected socket that carries read/write until close.",
              ja: "ソケットのライフサイクル：1つのリッスンソケットが各クライアントを accept し、close まで読み書きを運ぶ専用の接続済みソケットを生む。",
            }}
          >
            <SocketLifecycleDiagram />
          </Figure>

          {/* Concurrency-model comparison */}
          <CompareTable
            headers={[
              { en: "Model", ja: "モデル" },
              { en: "Memory / connection", ja: "接続ごとのメモリ" },
              { en: "Context-switch cost", ja: "コンテキストスイッチのコスト" },
              { en: "Programming model", ja: "プログラミングモデル" },
              { en: "Representative software", ja: "代表的なソフトウェア" },
            ]}
            rows={[
              [
                { en: "**Process** per connection", ja: "接続ごとの**プロセス**" },
                { en: "High (megabytes)", ja: "高い（メガバイト）" },
                { en: "High (address-space switch)", ja: "高い（アドレス空間の切替）" },
                {
                  en: "Simple; full isolation, crash-safe",
                  ja: "シンプル；完全分離、クラッシュ耐性",
                },
                { en: "Apache `prefork`, CGI", ja: "Apache `prefork`、CGI" },
              ],
              [
                { en: "**Thread** per connection", ja: "接続ごとの**スレッド**" },
                { en: "Medium (~1 MB stack)", ja: "中（約1MBのスタック）" },
                { en: "Medium (shared address space)", ja: "中（アドレス空間を共有）" },
                {
                  en: "Shared memory → locks & races",
                  ja: "共有メモリ→ロックと競合",
                },
                {
                  en: "Java servlets, threaded Ruby/Python",
                  ja: "Java サーブレット、スレッド型 Ruby/Python",
                },
              ],
              [
                { en: "**Event loop**", ja: "**イベントループ**" },
                { en: "Low (a few KB of state)", ja: "低い（数KBの状態）" },
                { en: "None (no per-conn thread)", ja: "なし（接続ごとのスレッドなし）" },
                {
                  en: "Callbacks / async; never block",
                  ja: "コールバック/async；決してブロックしない",
                },
                { en: "nginx, Node.js", ja: "nginx、Node.js" },
              ],
              [
                {
                  en: "**Lightweight thread**",
                  ja: "**軽量スレッド**",
                },
                { en: "Low (KB, grows on demand)", ja: "低い（KB、必要に応じ拡大）" },
                {
                  en: "Very low (runtime-scheduled)",
                  ja: "非常に低い（ランタイムがスケジュール）",
                },
                {
                  en: "Blocking-style code, async underneath",
                  ja: "ブロッキング風のコード、内部は非同期",
                },
                {
                  en: "Go goroutines, Erlang, JVM virtual threads",
                  ja: "Go ゴルーチン、Erlang、JVM 仮想スレッド",
                },
              ],
            ]}
          />
        </Section>

        {/* ================================================================ */}
        {/* PART 2 — many servers talking                                    */}
        {/* ================================================================ */}
        <Section
          id="many-servers"
          title={{
            en: "Part 2 — many servers talking",
            ja: "Part 2——多数のサーバーが話す",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "One machine has a ceiling. When you cross it, the problem changes shape: it is no longer 'how do I watch many descriptors?' but 'how do these machines coordinate?' Watch for the echo — the accept loop, the block-or-overlap choice, the buffering of slow clients all return, now spread across the network.",
                ja: "1台のマシンには天井があります。それを超えると、問題は形を変えます——もはや「多数のディスクリプタをどう見張るか？」ではなく、「これらのマシンはどう協調するか？」です。こだまに気づいてください——accept ループ、ブロックか重ね合わせかの選択、遅いクライアントのバッファリングが、今度はネットワーク越しに広がって、すべて戻ってきます。",
              },
            ]}
          />

          {/* Front-door request flow */}
          <Figure
            caption={{
              en: "The front-door flow: clients hit one public entry point, which distributes to a fleet of app servers backed by a database.",
              ja: "玄関口のフロー：クライアントは単一の公開入口に当たり、そこがデータベースを背後に持つアプリサーバー群へ分配する。",
            }}
          >
            <FlowRow
              steps={[
                { label: { en: "Client", ja: "クライアント" } },
                {
                  label: { en: "LB / reverse proxy", ja: "LB／リバースプロキシ" },
                  sub: { en: "terminate · distribute", ja: "終端・分配" },
                },
                {
                  label: { en: "App servers", ja: "アプリサーバー" },
                  sub: { en: "identical fleet", ja: "同一のフリート" },
                },
                { label: { en: "Database", ja: "データベース" } },
              ]}
            />
          </Figure>

          <div className="space-y-8 mt-2">
            {PART2_STAGES.map((stage) => (
              <StageBlock key={stage.id} t={t} stage={stage} />
            ))}
          </div>

          <Callout
            tone="insight"
            title={{ en: "The whole page in one line", ja: "このページを1行で" }}
            t={{
              en: "A server is a loop around `accept()`; scaling is deciding **who runs that loop, and where** — inside one process across cores, or across machines over the network.",
              ja: "サーバーとは `accept()` の周りのループであり、スケーリングとは**そのループを誰が、どこで回すか**を決めることだ——1プロセス内でコアをまたいで回すのか、マシンをまたいでネットワーク越しに回すのか。",
            }}
          />
        </Section>

        {/* Further reading attribution (Part 1 progression) */}
        <FurtherReading />

        <References
          items={[
            {
              title:
                "作って学ぶサーバーアーキテクチャ (ojisan, server-architecture-2023)",
              href: "https://blog.ojisan.io/server-architecture-2023/",
              note: {
                en: "Inspiration for Part 1's socket → process → thread → event-loop progression. Cited only; not read while writing this page.",
                ja: "Part 1 のソケット→プロセス→スレッド→イベントループの進行のインスピレーション。引用のみで、本ページ執筆時には読んでいません。",
              },
            },
            {
              title: "The C10K problem — Dan Kegel",
              href: "http://www.kegel.com/c10k.html",
              note: {
                en: "The essay that named the ten-thousand-connection ceiling and pushed the industry toward event-driven servers.",
                ja: "1万接続の天井を名付け、業界をイベント駆動サーバーへ押しやった文章。",
              },
            },
          ]}
        />
      </Article>
    </DocsShell>
  );
}

// ---------------------------------------------------------------------------
// Stage block — milestone / mental model / detail / optional code
// ---------------------------------------------------------------------------

interface StageBlockProps {
  t: (lt: { en: string; ja: string }) => string;
  stage: (typeof SERVER_ARCH_STAGES)[number];
}

function StageBlock({ t, stage }: StageBlockProps) {
  return (
    <div className="space-y-3 border-l-2 border-zinc-700 pl-4">
      <h3 className="text-lg font-semibold text-zinc-100">{t(stage.title)}</h3>

      <p className="text-xs font-medium uppercase tracking-wide text-sky-400">
        {t({ en: "The problem", ja: "問題" })}
      </p>
      <p className="text-zinc-300 leading-relaxed text-sm">
        {rich(t(stage.milestone))}
      </p>

      <p className="text-xs font-medium uppercase tracking-wide text-emerald-400">
        {t({ en: "Mental model", ja: "メンタルモデル" })}
      </p>
      <p className="text-zinc-300 leading-relaxed text-sm">
        {rich(t(stage.mentalModel))}
      </p>

      <p className="text-zinc-400 leading-relaxed text-sm">
        {rich(t(stage.detail))}
      </p>

      {stage.example && (
        <pre className="rounded bg-zinc-800 px-4 py-3 font-mono text-[12px] text-sky-300 overflow-x-auto whitespace-pre-wrap">
          {stage.example}
        </pre>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Further reading attribution
// ---------------------------------------------------------------------------

function FurtherReading() {
  const t = useT();
  const fr = SERVER_ARCH_FURTHER_READING;
  return (
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
  );
}

// ---------------------------------------------------------------------------
// Socket lifecycle SVG diagram
// listen → accept → connected socket per client → read/write → close
// Modelled on network.tsx's TCP handshake diagram style.
// ---------------------------------------------------------------------------

function SocketLifecycleDiagram() {
  const sid = useSvgId();
  return (
    <Diagram
      label={{
        en: "Socket lifecycle: a listening socket accepts clients, each producing a connected socket that reads, writes, and closes.",
        ja: "ソケットのライフサイクル：リッスンソケットがクライアントを accept し、それぞれが読み・書き・close する接続済みソケットを生む。",
      }}
      viewBox="0 0 560 320"
      maxHeight={320}
    >
      {/* Background */}
      <rect width="560" height="320" fill={C.panel} rx="8" />

      {/* Listening socket (left) */}
      <rect
        x="24"
        y="120"
        width="150"
        height="72"
        rx="8"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="99"
        y="150"
        textAnchor="middle"
        fill={C.text}
        fontSize="13"
        fontWeight="700"
      >
        Listening socket
      </text>
      <text x="99" y="170" textAnchor="middle" fill={C.faint} fontSize="10">
        bind :8080 · listen
      </text>
      <text x="99" y="184" textAnchor="middle" fill={C.faint} fontSize="10">
        accept() loop
      </text>

      {/* accept() arrows fanning out to three connected sockets */}
      {[0, 1, 2].map((i) => {
        const y = 68 + i * 88; // 68, 156, 244
        return (
          <g key={`accept-${i}`}>
            <line
              x1="174"
              y1="156"
              x2="298"
              y2={y + 24}
              stroke={C.accent}
              strokeWidth="2"
              markerEnd={`url(#${sid("arr")})`}
            />
            {/* Connected socket box */}
            <rect
              x="300"
              y={y}
              width="150"
              height="48"
              rx="6"
              fill={C.muted}
              stroke={C.high}
              strokeWidth="1.5"
            />
            <text
              x="375"
              y={y + 20}
              textAnchor="middle"
              fill={C.text}
              fontSize="11"
              fontWeight="600"
            >
              {`Connected fd ${i + 1}`}
            </text>
            <text
              x="375"
              y={y + 36}
              textAnchor="middle"
              fill={C.faint}
              fontSize="9"
            >
              {`client ${i + 1}`}
            </text>
            {/* read/write self-loop label */}
            <line
              x1="450"
              y1={y + 24}
              x2="500"
              y2={y + 24}
              stroke={C.warn}
              strokeWidth="1.5"
              markerEnd={`url(#${sid("arrw")})`}
            />
            <text
              x="525"
              y={y + 20}
              textAnchor="middle"
              fill={C.warn}
              fontSize="9"
              fontWeight="600"
            >
              read
            </text>
            <text
              x="525"
              y={y + 32}
              textAnchor="middle"
              fill={C.warn}
              fontSize="9"
              fontWeight="600"
            >
              write
            </text>
          </g>
        );
      })}

      {/* accept() label on the middle arrow */}
      <text
        x="236"
        y="150"
        textAnchor="middle"
        fill={C.accent}
        fontSize="11"
        fontWeight="700"
      >
        accept()
      </text>

      {/* close note */}
      <text
        x="375"
        y="300"
        textAnchor="middle"
        fill={C.faint}
        fontSize="10"
        fontStyle="italic"
      >
        each connected socket: read / write … then close()
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
