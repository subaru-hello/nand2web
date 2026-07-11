import { createFileRoute } from "@tanstack/react-router";
import {
  Article,
  Callout,
  CompareTable,
  DocsShell,
  Figure,
  FlowRow,
  KeyTerms,
  LayerStack,
  P,
  Prose,
  References,
  Section,
} from "../../features/docs";

export const Route = createFileRoute("/docs/web")({
  component: Page,
});

function Page() {
  return (
    <DocsShell active="web">
      <Article
        title={{ en: "Web Development", ja: "Web開発" }}
        lead={{
          en: "Web development is the craft of building applications that are delivered over HTTP and run in a browser — or, increasingly, on servers and edges that speak the same protocols. From a static HTML file to a globally distributed real-time app, every web system is an interplay between the network, the browser's rendering engine, and one or more servers. This page builds a mental model from URLs and DNS all the way to component frameworks, edge compute, and security.",
          ja: "Web開発とは、HTTPを通じて配信され、ブラウザ上で動作するアプリケーションを構築する技術です——あるいは、同じプロトコルを話すサーバーやエッジ上で動作することも増えています。静的なHTMLファイルからグローバルに分散したリアルタイムアプリまで、あらゆるWebシステムはネットワーク・ブラウザのレンダリングエンジン・1台以上のサーバーの相互作用です。このページでは、URLとDNSからコンポーネントフレームワーク・エッジコンピューティング・セキュリティまでの完全なメンタルモデルを構築します。",
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* 1. What web development is                                        */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="what"
          title={{ en: "What web development is", ja: "Web開発とは何か" }}
        >
          <Prose
            paragraphs={[
              {
                en: "At its core, web development is about two actors talking over a network. The **client** — usually a browser — sends requests; the **server** responds with resources. The client renders those resources into something a human can see and interact with. Everything else in the field — frameworks, databases, CDNs, build tools — exists to make that exchange faster, safer, more expressive, or more maintainable.",
                ja: "Web開発の核心は、ネットワーク越しに会話する2つのアクターにあります。**クライアント**——通常はブラウザ——がリクエストを送り、**サーバー**がリソースで応答します。クライアントはそのリソースを人間が見て操作できるものにレンダリングします。フレームワーク・データベース・CDN・ビルドツールなど、この分野のその他すべては、そのやり取りをより速く・安全に・表現豊かに・メンテナブルにするために存在します。",
              },
              {
                en: "The **client side** (or *front-end*) runs in the browser: HTML, CSS, and JavaScript delivered by the server and executed locally. The **server side** (or *back-end*) runs on a machine you control: handling business logic, reading databases, enforcing auth, and producing responses. A **full-stack** developer works across both. The boundary between them is the HTTP API.",
                ja: "**クライアントサイド**（フロントエンド）はブラウザ上で動作します：サーバーから配信され、ローカルで実行されるHTML・CSS・JavaScriptです。**サーバーサイド**（バックエンド）はあなたが管理するマシン上で動作します：ビジネスロジックの処理・データベースの読み込み・認証の施行・レスポンスの生成を担います。**フルスタック**開発者は両方にまたがって作業します。その境界がHTTP APIです。",
              },
              {
                en: "The web is built on open, layered standards — HTTP runs over TCP/IP, which runs over Ethernet or Wi-Fi. Understanding those layers helps diagnose anything from a 502 error to a slow Time-to-First-Byte. For a deep dive into the underlying transport, see [Networking](/docs/network).",
                ja: "Webはオープンで階層化された標準規格の上に構築されています——HTTPはTCP/IPの上で動作し、TCP/IPはEthernetやWi-Fiの上で動作します。これらの層を理解することで、502エラーからTime-to-First-Byteの遅延まであらゆる問題の診断に役立ちます。基盤となるトランスポート層の詳細は[ネットワーク](/docs/network)を参照してください。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 2. How a page loads                                               */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="critical-path"
          title={{ en: "How a page loads", ja: "ページの読み込みの仕組み" }}
        >
          <Prose
            paragraphs={[
              {
                en: 'Typing a URL and pressing Enter triggers a cascade of network and rendering steps. Each step has latency, and together they determine your **Time-to-Interactive** — the metric users feel as "how fast did that load?"',
                ja: "URLを入力してEnterを押すと、ネットワークとレンダリングのステップが連鎖的に起動されます。各ステップにはレイテンシがあり、合計が**Time-to-Interactive**——ユーザーが「どれくらい速く読み込まれたか」と感じるメトリクス——を決定します。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "The critical path from URL to interactive page.",
              ja: "URLからインタラクティブページまでのクリティカルパス。",
            }}
          >
            <FlowRow
              steps={[
                {
                  label: { en: "URL entered", ja: "URL入力" },
                  sub: { en: "browser", ja: "ブラウザ" },
                },
                {
                  label: { en: "DNS lookup", ja: "DNS解決" },
                  sub: { en: "IP address", ja: "IPアドレス取得" },
                },
                {
                  label: { en: "TCP + TLS", ja: "TCP + TLS" },
                  sub: { en: "handshake", ja: "ハンドシェイク" },
                },
                {
                  label: { en: "HTTP request", ja: "HTTPリクエスト" },
                  sub: { en: "GET /index.html", ja: "GET /index.html" },
                },
                {
                  label: { en: "HTML response", ja: "HTMLレスポンス" },
                  sub: { en: "bytes arrive", ja: "バイト到着" },
                },
                {
                  label: { en: "Parse → DOM + CSSOM", ja: "DOM + CSSOM構築" },
                  sub: { en: "parser", ja: "パーサー" },
                },
                {
                  label: {
                    en: "Render tree → paint",
                    ja: "レンダーツリー→描画",
                  },
                  sub: { en: "pixels on screen", ja: "画面に描画" },
                },
                {
                  label: { en: "JS executes", ja: "JS実行" },
                  sub: { en: "interactive", ja: "インタラクティブ" },
                },
              ]}
            />
          </Figure>

          <Prose
            paragraphs={[
              {
                en: "**DNS** resolves the hostname (`example.com`) to an IP address by querying a recursive resolver, which walks the DNS hierarchy (root → TLD → authoritative nameserver). Results are cached per TTL. A cold lookup adds 20–100 ms; a hit costs nothing.",
                ja: "**DNS**は、再帰リゾルバにクエリを送ることでホスト名（`example.com`）をIPアドレスに解決します。リゾルバはDNS階層（ルート→TLD→権威ネームサーバー）を辿ります。結果はTTLに従ってキャッシュされます。コールドルックアップは20〜100 msを追加しますが、キャッシュヒットはコストゼロです。",
              },
              {
                en: "**TCP** establishes a reliable connection with a 3-way handshake (SYN → SYN-ACK → ACK). **TLS 1.3** then authenticates the server and negotiates encryption in one round-trip (down from two in TLS 1.2). Together they add at least one full round-trip before any application data flows.",
                ja: "**TCP**は3ウェイハンドシェイク（SYN→SYN-ACK→ACK）で信頼性の高い接続を確立します。**TLS 1.3**はその後、サーバーを認証し、1ラウンドトリップで暗号化をネゴシエートします（TLS 1.2の2ラウンドトリップから削減）。両方合わせて、アプリケーションデータが流れる前に少なくとも1ラウンドトリップ追加されます。",
              },
              {
                en: "The browser **parses HTML** incrementally, building the **DOM** (Document Object Model) — a tree of nodes. When it encounters a `<link rel=stylesheet>`, it fetches and parses CSS into the **CSSOM** (CSS Object Model). Both trees are combined into the **render tree** — only visible nodes — which is then **laid out** (computing geometry) and **painted** (rasterizing pixels). JavaScript loaded with `<script>` blocks parsing unless marked `defer` or `async`.",
                ja: "ブラウザはHTMLを増分的に**パース**し、**DOM**（Document Object Model）——ノードのツリー——を構築します。`<link rel=stylesheet>`を見つけるとCSSを取得してパースし、**CSSOM**（CSS Object Model）を構築します。両ツリーは**レンダーツリー**——表示ノードのみ——に結合され、**レイアウト**（ジオメトリの計算）と**ペイント**（ピクセルのラスタライズ）が行われます。`<script>`でロードされるJavaScriptは、`defer`または`async`属性がなければパースをブロックします。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 3. The three languages                                            */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="three-languages"
          title={{
            en: "The three languages of the web",
            ja: "Webの3言語",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "Every web page is ultimately expressed in three languages, each with a distinct responsibility. They cooperate but must not be conflated — mixing concerns makes code brittle and hard to maintain.",
                ja: "すべてのWebページは最終的に3つの言語で表現され、それぞれに明確な責務があります。協力し合いますが、混同してはなりません——関心事を混在させるとコードが脆くなり、メンテナンスが困難になります。",
              },
              {
                en: "**HTML** (HyperText Markup Language) defines **structure and semantics**. An `<article>` is not just a box — it tells screen readers, search engines, and browsers what kind of content it contains. Good HTML is accessible by default: headings (`h1`–`h6`) create an outline, `<button>` is keyboard-focusable and fires click events on Enter, `<img>` carries an `alt` attribute for non-visual agents. HTML is a declarative tree; the browser interprets it into the DOM.",
                ja: "**HTML**（HyperText Markup Language）は**構造とセマンティクス**を定義します。`<article>`は単なるボックスではなく、スクリーンリーダー・検索エンジン・ブラウザにコンテンツの種類を伝えます。良いHTMLはデフォルトでアクセシブルです：見出し（`h1`〜`h6`）はアウトラインを作り、`<button>`はキーボードフォーカス可能でEnterでクリックイベントが発火し、`<img>`は非視覚エージェント向けの`alt`属性を持ちます。HTMLは宣言的なツリーであり、ブラウザはそれをDOMに解釈します。",
              },
              {
                en: '**CSS** (Cascading Style Sheets) handles **presentation**: colors, fonts, layout, animation. Its "cascading" nature means multiple rules can match the same element; the browser resolves conflicts by *specificity* and *source order*. Modern CSS layout is dominated by **Flexbox** (one-dimensional) and **Grid** (two-dimensional). CSS Custom Properties (variables) and `@layer` have brought systematic design tokens and specificity control to vanilla CSS, reducing the need for preprocessors.',
                ja: "**CSS**（Cascading Style Sheets）は**表現**を担当します：色・フォント・レイアウト・アニメーション。「カスケード」の性質により、複数のルールが同じ要素にマッチすることがあり、ブラウザは*詳細度*と*ソース順*で競合を解決します。現代のCSSレイアウトは**Flexbox**（一次元）と**Grid**（二次元）が主流です。CSSカスタムプロパティ（変数）と`@layer`により、バニラCSSに体系的なデザイントークンと詳細度制御が導入され、プリプロセッサの必要性が減りました。",
              },
              {
                en: "**JavaScript** provides **behaviour**: responding to user events, mutating the DOM, fetching data asynchronously, and running arbitrary computation. JS is single-threaded (one call stack) but non-blocking via the **event loop** — long operations are handed to Web APIs (timers, fetch, IO) and their callbacks are queued to run when the stack is clear. TypeScript, which compiles to JS, adds a static type layer that catches errors at build time.",
                ja: "**JavaScript**は**ふるまい**を提供します：ユーザーイベントへの応答・DOMの操作・非同期データ取得・任意の計算実行。JSはシングルスレッド（1つのコールスタック）ですが、**イベントループ**により非ブロッキングです——長い処理はWeb API（タイマー・fetch・IO）に委ねられ、スタックがクリアになったときにコールバックがキューに入れられて実行されます。JSにコンパイルされるTypeScriptは、ビルド時にエラーを検出する静的型付け層を追加します。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 4. The browser                                                    */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="browser"
          title={{
            en: "The browser: DOM, rendering, and the event loop",
            ja: "ブラウザ：DOM・レンダリング・イベントループ",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "A modern browser is an operating system within an operating system. Its main components: a **networking layer** (handles HTTP, caching, cookies), an **HTML/CSS parser**, a **rendering engine** (Blink in Chrome/Edge, Gecko in Firefox, WebKit in Safari), a **JavaScript engine** (V8, SpiderMonkey, JavaScriptCore), and a **compositor** that assembles layers and talks to the GPU.",
                ja: "現代のブラウザはオペレーティングシステムの中のオペレーティングシステムです。主要コンポーネント：**ネットワーク層**（HTTP・キャッシュ・クッキーを処理）、**HTML/CSSパーサー**、**レンダリングエンジン**（Chrome/EdgeのBlink、FirefoxのGecko、SafariのWebKit）、**JavaScriptエンジン**（V8・SpiderMonkey・JavaScriptCore）、レイヤーを組み立てGPUと通信する**コンポジター**。",
              },
              {
                en: "The **DOM** (Document Object Model) is the browser's in-memory representation of the HTML document — a tree where each node is an object with properties and methods. JavaScript manipulates the DOM by calling APIs like `document.querySelector`, `element.appendChild`, or `element.style`. Every DOM mutation is a potential trigger for **reflow** (recalculating layout geometry) or **repaint** (re-rasterizing pixels). Reflow is expensive — it can cascade through the entire subtree. Batching DOM writes, using CSS transforms instead of changing `top`/`left`, and moving animation to the compositor layer (via `will-change` or `transform`) are the main strategies for keeping 60 fps.",
                ja: "**DOM**（Document Object Model）はHTMLドキュメントのブラウザのインメモリ表現です——各ノードがプロパティとメソッドを持つオブジェクトであるツリーです。JavaScriptは`document.querySelector`・`element.appendChild`・`element.style`などのAPIを呼び出してDOMを操作します。すべてのDOM変更は**リフロー**（レイアウトジオメトリの再計算）または**リペイント**（ピクセルの再ラスタライズ）の潜在的なトリガーです。リフローはコストが高く——サブツリー全体に波及することがあります。DOM書き込みのバッチ化・`top`/`left`変更の代わりにCSSトランスフォームを使う・`will-change`や`transform`でアニメーションをコンポジターレイヤーに移動することが、60 fpsを維持するための主な戦略です。",
              },
              {
                en: "The **event loop** is JavaScript's concurrency model. The call stack processes one frame at a time. When the stack is empty, the event loop picks the next task from the **task queue** (macrotasks: setTimeout callbacks, IO events) or the **microtask queue** (Promises, queueMicrotask — always drained before the next macrotask). Understanding this order explains why `Promise.resolve().then(f)` runs before `setTimeout(f, 0)`, and why a synchronous loop that runs for 2 seconds freezes the UI — it starves the event loop.",
                ja: "**イベントループ**はJavaScriptの並行処理モデルです。コールスタックは一度に1フレームを処理します。スタックが空になると、イベントループは**タスクキュー**（マクロタスク：setTimeoutコールバック・IOイベント）または**マイクロタスクキュー**（Promise・queueMicrotask——常に次のマクロタスクの前に完全に処理される）から次のタスクを取り出します。この順序を理解すると、`Promise.resolve().then(f)`が`setTimeout(f, 0)`より先に実行される理由、および2秒間実行される同期ループがUIをフリーズさせる理由——イベントループを飢餓状態にするから——が分かります。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 5. HTTP & APIs                                                    */}
        {/* ---------------------------------------------------------------- */}
        <Section id="http" title={{ en: "HTTP & APIs", ja: "HTTP とAPI" }}>
          <Prose
            paragraphs={[
              {
                en: "**HTTP** (HyperText Transfer Protocol) is a request-response protocol. A client sends a **request** with a method, URL, headers, and optional body; the server responds with a **status code**, headers, and optional body. HTTP/1.1 is text-based, HTTP/2 adds binary framing and multiplexing (multiple requests over one TCP connection), and HTTP/3 moves to QUIC (UDP-based) to eliminate head-of-line blocking at the transport layer.",
                ja: "**HTTP**（HyperText Transfer Protocol）はリクエスト-レスポンスプロトコルです。クライアントはメソッド・URL・ヘッダー・オプションのボディとともに**リクエスト**を送り、サーバーは**ステータスコード**・ヘッダー・オプションのボディで応答します。HTTP/1.1はテキストベース、HTTP/2はバイナリフレーミングと多重化（1つのTCP接続で複数リクエスト）を追加し、HTTP/3はトランスポート層のヘッドオブライン・ブロッキングを解消するためにQUIC（UDPベース）に移行します。",
              },
              {
                en: "**REST** (Representational State Transfer) is the dominant convention for HTTP APIs. Resources are identified by URLs (`/users/42`), state is transferred in **JSON**, and the HTTP method encodes the operation's semantics. REST is *stateless*: each request carries all context; the server holds no session between calls. **GraphQL** is an alternative where the client specifies exactly which fields it needs in a query, reducing over-fetching. **WebSockets** upgrade an HTTP connection to a persistent bidirectional channel for real-time push.",
                ja: "**REST**（Representational State Transfer）はHTTP APIの主流の規約です。リソースはURL（`/users/42`）で識別され、状態は**JSON**で転送され、HTTPメソッドが操作のセマンティクスをエンコードします。RESTは*ステートレス*：各リクエストがすべてのコンテキストを持ち、サーバーはコール間でセッションを保持しません。**GraphQL**はクライアントがクエリで必要なフィールドを正確に指定できる代替手段であり、オーバーフェッチを削減します。**WebSocket**はHTTP接続をリアルタイムプッシュのための永続的な双方向チャネルにアップグレードします。",
              },
              {
                en: "**Cookies** are small key-value stores set by the server via `Set-Cookie` headers, sent back automatically on every subsequent request to the same origin. **Sessions** store a random token in a cookie; the server maps that token to server-side state. **JWTs** (JSON Web Tokens) take the opposite approach: the token itself is signed and carries claims (user id, roles, expiry) — no server-side lookup needed, but tokens can't be revoked before expiry without a blocklist. **CORS** (Cross-Origin Resource Sharing) is the browser security policy that blocks cross-origin `fetch` calls unless the server explicitly opts in via `Access-Control-Allow-Origin` headers.",
                ja: "**クッキー**はサーバーが`Set-Cookie`ヘッダーで設定する小さなキーバリューストアで、同じオリジンへの後続リクエストで自動的に送信されます。**セッション**はランダムトークンをクッキーに格納し、サーバーがそのトークンをサーバーサイドの状態にマッピングします。**JWT**（JSON Web Token）は逆のアプローチを取ります：トークン自体が署名されてクレーム（ユーザーID・ロール・有効期限）を持ちます——サーバーサイドのルックアップは不要ですが、ブロックリストなしでは有効期限前にトークンを無効化できません。**CORS**（Cross-Origin Resource Sharing）は、サーバーが`Access-Control-Allow-Origin`ヘッダーで明示的に許可しない限り、クロスオリジンの`fetch`呼び出しをブロックするブラウザのセキュリティポリシーです。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "HTTP methods and their semantics (REST conventions).",
              ja: "HTTPメソッドとそのセマンティクス（REST規約）。",
            }}
          >
            <CompareTable
              headers={[
                { en: "Method", ja: "メソッド" },
                { en: "Semantics", ja: "セマンティクス" },
                { en: "Safe?", ja: "安全?" },
                { en: "Idempotent?", ja: "冪等?" },
              ]}
              rows={[
                [
                  { en: "GET", ja: "GET" },
                  { en: "Read a resource", ja: "リソースを読み取る" },
                  { en: "Yes", ja: "はい" },
                  { en: "Yes", ja: "はい" },
                ],
                [
                  { en: "POST", ja: "POST" },
                  { en: "Create / submit", ja: "作成 / 送信" },
                  { en: "No", ja: "いいえ" },
                  { en: "No", ja: "いいえ" },
                ],
                [
                  { en: "PUT", ja: "PUT" },
                  { en: "Replace a resource", ja: "リソースを置き換える" },
                  { en: "No", ja: "いいえ" },
                  { en: "Yes", ja: "はい" },
                ],
                [
                  { en: "PATCH", ja: "PATCH" },
                  {
                    en: "Partial update",
                    ja: "部分的な更新",
                  },
                  { en: "No", ja: "いいえ" },
                  { en: "Depends", ja: "実装による" },
                ],
                [
                  { en: "DELETE", ja: "DELETE" },
                  { en: "Remove a resource", ja: "リソースを削除する" },
                  { en: "No", ja: "いいえ" },
                  { en: "Yes", ja: "はい" },
                ],
                [
                  { en: "HEAD", ja: "HEAD" },
                  {
                    en: "Like GET but headers only",
                    ja: "GETと同様だがヘッダーのみ",
                  },
                  { en: "Yes", ja: "はい" },
                  { en: "Yes", ja: "はい" },
                ],
                [
                  { en: "OPTIONS", ja: "OPTIONS" },
                  {
                    en: "CORS preflight / capabilities",
                    ja: "CORSプリフライト / 機能確認",
                  },
                  { en: "Yes", ja: "はい" },
                  { en: "Yes", ja: "はい" },
                ],
              ]}
            />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 6. Client-side architecture                                       */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="client-arch"
          title={{
            en: "Client-side architecture",
            ja: "クライアントサイドアーキテクチャ",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "A **Multi-Page Application** (MPA) is the traditional model: every navigation triggers a full HTTP request, the server renders a new HTML page, and the browser discards the current document and paints the new one. Simple to reason about, great for SEO, zero JS required for basic functionality. The downside is a full-page flash on every transition.",
                ja: "**マルチページアプリケーション**（MPA）は伝統的なモデルです：ナビゲーションごとにHTTPリクエストが発生し、サーバーが新しいHTMLページをレンダリングし、ブラウザが現在のドキュメントを破棄して新しいものを描画します。推論が単純でSEOに優れ、基本機能にJSは不要です。欠点はナビゲーションごとのフルページフラッシュです。",
              },
              {
                en: "A **Single-Page Application** (SPA) loads one HTML shell and handles all navigation in JavaScript. A client-side **router** (like TanStack Router) intercepts link clicks, updates the URL with the History API, and re-renders the relevant component subtree — no full page reload. This gives fluid, app-like transitions but shifts rendering responsibility to the browser: the initial HTML contains almost no content, so search engines and slow devices see a blank page until JS parses and executes. nand2web is itself a React SPA on TanStack Router, deployed on Cloudflare Pages.",
                ja: "**シングルページアプリケーション**（SPA）は1つのHTMLシェルをロードし、すべてのナビゲーションをJavaScriptで処理します。クライアントサイドの**ルーター**（TanStack Routerなど）がリンククリックを傍受し、History APIでURLを更新し、関連するコンポーネントのサブツリーを再レンダリングします——フルページリロードなし。流動的でアプリライクな遷移が得られますが、レンダリングの責任がブラウザに移ります：最初のHTMLにはほとんどコンテンツがないため、JSがパース・実行されるまで検索エンジンや低速デバイスは空白ページを見ます。nand2web自体がTanStack Router上のReact SPAであり、Cloudflare Pagesにデプロイされています。",
              },
              {
                en: "**Component frameworks** like React, Vue, and Svelte decompose the UI into reusable, self-contained units. In React, a component is a function that takes **props** (inputs) and returns a description of what to render (JSX). The framework manages a **virtual DOM** — a lightweight in-memory tree — and reconciles it with the real DOM on state changes, applying only the minimal set of actual DOM mutations. **State management** (useState, useReducer, Zustand, Redux) answers the question: where does shared data live, and how do changes propagate?",
                ja: "**コンポーネントフレームワーク**（React・Vue・Svelte）はUIを再利用可能な自己完結型ユニットに分解します。Reactでは、コンポーネントは**props**（入力）を受け取り、レンダリングすべき内容の記述（JSX）を返す関数です。フレームワークは**仮想DOM**——軽量なインメモリツリー——を管理し、状態変化時に実際のDOMと照合して、最小限の実際のDOM変更のみを適用します。**状態管理**（useState・useReducer・Zustand・Redux）は「共有データはどこに存在し、変更はどのように伝播するか？」という問いに答えます。",
              },
              {
                en: "**Bundlers** (Vite, Webpack, esbuild) compile, transform, and bundle source files into optimized assets. They handle JSX→JS transpilation, TypeScript stripping, tree-shaking (removing unused exports), code-splitting (lazy chunks per route), and asset hashing (content-addressed filenames for long-lived cache headers). The output is a small set of JS, CSS, and image files ready for a CDN.",
                ja: "**バンドラー**（Vite・Webpack・esbuild）はソースファイルをコンパイル・変換して最適化されたアセットにバンドルします。JSX→JSトランスパイル・TypeScript除去・ツリーシェイキング（未使用エクスポートの削除）・コード分割（ルートごとの遅延チャンク）・アセットハッシュ化（長いキャッシュヘッダー用のコンテンツアドレスファイル名）を処理します。出力はCDNに適した少数のJS・CSS・画像ファイルです。",
              },
              {
                en: '**Rendering strategies** sit on a spectrum. **CSR** (Client-Side Rendering) is the pure SPA model. **SSR** (Server-Side Rendering) runs the component tree on the server per request, returning full HTML — good for SEO and TTFB but adds server cost. **SSG** (Static Site Generation) pre-renders at build time — zero server cost, instant TTFB from CDN, but stale until rebuilt. **Hydration** is the technique of shipping SSR/SSG HTML and then "waking it up" with JS: React attaches event listeners to the server-rendered DOM without re-creating it. Partial hydration and **Resumability** (Qwik) push further, deferring or avoiding JS execution for non-interactive subtrees.',
                ja: "**レンダリング戦略**はスペクトルにあります。**CSR**（クライアントサイドレンダリング）は純粋なSPAモデルです。**SSR**（サーバーサイドレンダリング）はリクエストごとにサーバーでコンポーネントツリーを実行し、完全なHTMLを返します——SEOとTTFBに優れますがサーバーコストが増加します。**SSG**（静的サイト生成）はビルド時に事前レンダリングします——サーバーコストゼロ・CDNから即時TTFB、ただし再ビルドまで古いまま。**ハイドレーション**はSSR/SSGのHTMLを配信し、JSで「目覚めさせる」技術です：ReactはサーバーレンダリングされたDOMを再作成せずにイベントリスナーをアタッチします。部分ハイドレーションと**再開可能性**（Qwik）はさらに推し進め、非インタラクティブサブツリーのJS実行を遅延または回避します。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 7. The backend & the edge                                         */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="backend"
          title={{
            en: "The backend & the edge",
            ja: "バックエンドとエッジ",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "The **backend** encompasses every process that runs outside the browser: application servers, databases, message queues, caches, and the infrastructure that connects them. An application server (Node.js, Go, Python/Django, Ruby/Rails, Rust/Axum) receives HTTP requests, applies business logic, reads from a **database** (PostgreSQL for relational data, Redis for caching/queues, S3-compatible object storage for files), and sends a response.",
                ja: "**バックエンド**はブラウザ外で動作するすべてのプロセスを包含します：アプリケーションサーバー・データベース・メッセージキュー・キャッシュ・それらを接続するインフラストラクチャ。アプリケーションサーバー（Node.js・Go・Python/Django・Ruby/Rails・Rust/Axum）はHTTPリクエストを受け取り、ビジネスロジックを適用し、**データベース**（リレーショナルデータにPostgreSQL・キャッシュ/キューにRedis・ファイルにS3互換オブジェクトストレージ）から読み取り、レスポンスを送信します。",
              },
              {
                en: "**Serverless** functions (AWS Lambda, Cloudflare Workers, Vercel Edge Functions) invert the model: instead of keeping a long-running server process, you deploy a function that is instantiated on demand per request. Cold starts add latency (milliseconds for edge, seconds for traditional Lambda). **Edge compute** deploys functions to dozens or hundreds of Points of Presence (PoPs) worldwide — Cloudflare has 300+. This site's API runs on Cloudflare Workers, meaning your request is served from the PoP physically closest to you, reducing latency to sub-50 ms in most regions.",
                ja: "**サーバーレス**関数（AWS Lambda・Cloudflare Workers・Vercel Edge Functions）はモデルを逆転させます：長時間実行サーバープロセスを維持する代わりに、リクエストごとにオンデマンドでインスタンス化される関数をデプロイします。コールドスタートはレイテンシを追加します（エッジでミリ秒、従来のLambdaで秒単位）。**エッジコンピューティング**は世界中の数十〜数百のPoP（Points of Presence）に関数をデプロイします——Cloudflareは300以上を持ちます。このサイトのAPIはCloudflare Workers上で動作しており、リクエストはあなたに物理的に最も近いPoPから提供されます。ほとんどの地域で50 ms以下のレイテンシです。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "Request lifecycle from browser to database and back.",
              ja: "ブラウザからデータベースへの往復リクエストライフサイクル。",
            }}
          >
            <LayerStack
              layers={[
                {
                  label: {
                    en: "Browser / Client",
                    ja: "ブラウザ / クライアント",
                  },
                  sub: {
                    en: "fetch(), XHR, WebSocket",
                    ja: "fetch()・XHR・WebSocket",
                  },
                  tone: "accent",
                },
                {
                  label: { en: "CDN / Edge PoP", ja: "CDN / エッジPoP" },
                  sub: {
                    en: "cache hit → return; miss → origin",
                    ja: "キャッシュヒット→返却；ミス→オリジンへ",
                  },
                  tone: "emerald",
                },
                {
                  label: {
                    en: "Origin Server / Workers",
                    ja: "オリジンサーバー / Workers",
                  },
                  sub: {
                    en: "auth, business logic, routing",
                    ja: "認証・ビジネスロジック・ルーティング",
                  },
                  tone: "accent",
                },
                {
                  label: {
                    en: "Database / Cache",
                    ja: "データベース / キャッシュ",
                  },
                  sub: {
                    en: "PostgreSQL, Redis, object store",
                    ja: "PostgreSQL・Redis・オブジェクトストア",
                  },
                  tone: "zinc",
                },
              ]}
            />
          </Figure>

          <Prose
            paragraphs={[
              {
                en: "**Caching** at multiple layers is the single biggest performance lever in backend systems. An HTTP response with `Cache-Control: public, max-age=86400` is stored by the CDN for 24 hours — the origin sees zero load. **In-memory caches** (Redis) serve hot data in under a millisecond. **Database query caches** and connection pooling (PgBouncer) reduce per-request overhead. The challenge is *cache invalidation*: knowing when to evict stale data. Phil Karlton's observation that this is one of the two hardest problems in CS remains true.",
                ja: "複数の層での**キャッシング**はバックエンドシステムで最大の性能レバーです。`Cache-Control: public, max-age=86400`を持つHTTPレスポンスはCDNに24時間保存されます——オリジンはゼロ負荷です。**インメモリキャッシュ**（Redis）はホットデータを1ミリ秒未満で提供します。**データベースクエリキャッシュ**とコネクションプーリング（PgBouncer）はリクエストごとのオーバーヘッドを削減します。課題は*キャッシュ無効化*：古いデータをいつ退去させるかを知ること。これがCSで最も難しい2つの問題の1つであるというPhil Karltonの観察は今でも真実です。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 8. Security & performance                                         */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="security-perf"
          title={{
            en: "Security & performance",
            ja: "セキュリティとパフォーマンス",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "**HTTPS** is mandatory for any serious web application. TLS encrypts the HTTP exchange so network observers can't read credentials or session tokens, and authenticates the server's identity via its certificate chain. Browsers increasingly block **mixed content** (HTTP resources on an HTTPS page) and enforce **HSTS** (HTTP Strict Transport Security) to prevent downgrade attacks.",
                ja: "**HTTPS**はあらゆる本格的なWebアプリケーションに必須です。TLSはHTTPのやり取りを暗号化してネットワーク傍受者が認証情報やセッショントークンを読めないようにし、証明書チェーンでサーバーのアイデンティティを認証します。ブラウザは**混合コンテンツ**（HTTPSページ上のHTTPリソース）をますます遮断し、**HSTS**（HTTP Strict Transport Security）を強制してダウングレード攻撃を防ぎます。",
              },
              {
                en: "**Core Web Vitals** are Google's user-centric performance metrics. **LCP** (Largest Contentful Paint) measures when the largest visible element is rendered — target under 2.5 s. **INP** (Interaction to Next Paint, replaced FID in 2024) measures responsiveness to user input — target under 200 ms. **CLS** (Cumulative Layout Shift) measures visual stability — score under 0.1. These metrics directly affect search ranking and conversion rates.",
                ja: "**Core Web Vitals**はGoogleのユーザー中心の性能指標です。**LCP**（Largest Contentful Paint）は最大の可視要素がレンダリングされるタイミングを計測します——目標は2.5秒未満。**INP**（Interaction to Next Paint、2024年にFIDを置き換え）はユーザー入力への応答性を計測します——目標は200 ms未満。**CLS**（Cumulative Layout Shift）は視覚的安定性を計測します——スコア0.1未満。これらの指標は検索ランキングとコンバージョン率に直接影響します。",
              },
            ]}
          />

          <Callout
            tone="warn"
            title={{
              en: "Web security basics you must know",
              ja: "必ず知っておくべきWebセキュリティの基本",
            }}
          >
            <P
              t={{
                en: "**XSS (Cross-Site Scripting):** an attacker injects a malicious script into a page seen by other users, stealing cookies or performing actions as the victim. Defense: escape all user-supplied HTML, use a strict Content-Security-Policy, and prefer `textContent` over `innerHTML`. Never call `eval()` on user input.",
                ja: "**XSS（クロスサイトスクリプティング）：** 攻撃者が他のユーザーが見るページに悪意のあるスクリプトを注入し、クッキーを盗んだり被害者として操作を実行します。対策：すべてのユーザー提供HTMLをエスケープし、厳格なContent-Security-Policyを使用し、`innerHTML`より`textContent`を優先します。ユーザー入力に`eval()`を決して呼ばないこと。",
              }}
            />
            <P
              t={{
                en: "**CSRF (Cross-Site Request Forgery):** a malicious page tricks the browser into sending a credentialed request to your API (cookies are sent automatically). Defense: use SameSite cookie attributes (`Lax` or `Strict`), CSRF tokens, or require a custom header (which CORS blocks cross-origin). State-changing requests should never be GET.",
                ja: "**CSRF（クロスサイトリクエストフォージェリ）：** 悪意のあるページがブラウザをだましてAPIへの認証済みリクエストを送らせます（クッキーは自動的に送信される）。対策：SameSiteクッキー属性（`Lax`または`Strict`）・CSRFトークン・カスタムヘッダーの要求（CORSがクロスオリジンをブロック）を使用します。状態変更リクエストはGETであってはなりません。",
              }}
            />
            <P
              t={{
                en: "**SQL Injection:** user input concatenated into a SQL query lets attackers read or destroy your database. Defense: always use parameterized queries or an ORM that does so. Never format SQL strings from user input.",
                ja: "**SQLインジェクション：** SQLクエリに連結されたユーザー入力により、攻撃者がデータベースを読み取ったり破壊できます。対策：常にパラメータ化クエリ、またはそれを行うORMを使用します。ユーザー入力からSQLを文字列フォーマットで作成しないこと。",
              }}
            />
          </Callout>

          <Prose
            paragraphs={[
              {
                en: "Performance optimizations fall into a few buckets. **Reduce bytes:** minify JS/CSS, use modern image formats (WebP/AVIF), serve only the code needed for the current route (code-splitting). **Reduce round-trips:** HTTP/2 push (deprecated) gave way to `<link rel=preload>` hints; DNS prefetch and preconnect warm up early. **Move computation earlier:** SSG pre-renders at build time; service workers cache assets locally for offline-first experiences. **Move code closer to the user:** CDNs serve static assets; edge compute runs logic near the user.",
                ja: "性能最適化はいくつかのバケツに分類されます。**バイトの削減：** JS/CSSの最小化・最新画像フォーマット（WebP/AVIF）の使用・現在のルートに必要なコードのみの提供（コード分割）。**ラウンドトリップの削減：** HTTP/2 push（廃止）は`<link rel=preload>`ヒントに置き換わりました；DNSプリフェッチとプリコネクトで早期ウォームアップ。**計算を前倒し：** SSGはビルド時に事前レンダリング；サービスワーカーはアセットをローカルにキャッシュしてオフラインファーストを実現。**コードをユーザーに近づける：** CDNが静的アセットを提供し；エッジコンピューティングがユーザーの近くでロジックを実行。",
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
                term: "DOM",
                def: {
                  en: "Document Object Model — the browser's live, in-memory tree representation of an HTML document; mutated by JavaScript.",
                  ja: "Document Object Model——ブラウザのHTMLドキュメントのライブなインメモリツリー表現。JavaScriptで変更される。",
                },
              },
              {
                term: "HTTP",
                def: {
                  en: "HyperText Transfer Protocol — the stateless request-response protocol that web clients and servers use to exchange resources.",
                  ja: "HyperText Transfer Protocol——Webクライアントとサーバーがリソースをやりとりするためのステートレスなリクエスト-レスポンスプロトコル。",
                },
              },
              {
                term: "REST",
                def: {
                  en: "Representational State Transfer — an architectural style for HTTP APIs where resources are identified by URLs and HTTP methods encode operations.",
                  ja: "Representational State Transfer——リソースがURLで識別されHTTPメソッドが操作をエンコードするHTTP APIのアーキテクチャスタイル。",
                },
              },
              {
                term: "SPA",
                def: {
                  en: "Single-Page Application — a web app that loads one HTML shell and handles all navigation with JavaScript, avoiding full page reloads.",
                  ja: "Single-Page Application——1つのHTMLシェルをロードし、フルページリロードを避けてすべてのナビゲーションをJavaScriptで処理するWebアプリ。",
                },
              },
              {
                term: "SSR",
                def: {
                  en: "Server-Side Rendering — generating full HTML on the server per request, improving TTFB and SEO compared to client-side-only rendering.",
                  ja: "Server-Side Rendering——リクエストごとにサーバーで完全なHTMLを生成し、クライアントサイドのみのレンダリングと比較してTTFBとSEOを改善する。",
                },
              },
              {
                term: "CDN",
                def: {
                  en: "Content Delivery Network — a globally distributed network of servers that cache and serve static assets close to end users, reducing latency.",
                  ja: "Content Delivery Network——静的アセットをエンドユーザーの近くでキャッシュして提供するグローバルに分散されたサーバーネットワーク。レイテンシを削減する。",
                },
              },
              {
                term: "Event loop",
                def: {
                  en: "JavaScript's concurrency model — a single-threaded loop that drains the microtask queue after each task, enabling non-blocking async code despite having one call stack.",
                  ja: "JavaScriptの並行処理モデル——各タスク後にマイクロタスクキューを処理するシングルスレッドのループ。1つのコールスタックしかないにもかかわらず、ノンブロッキングな非同期コードを可能にする。",
                },
              },
              {
                term: "CORS",
                def: {
                  en: "Cross-Origin Resource Sharing — a browser security policy that restricts cross-origin HTTP requests unless the server explicitly allows them via response headers.",
                  ja: "Cross-Origin Resource Sharing——サーバーがレスポンスヘッダーで明示的に許可しない限り、クロスオリジンのHTTPリクエストを制限するブラウザのセキュリティポリシー。",
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
              title: "MDN Web Docs",
              href: "https://developer.mozilla.org/",
              note: {
                en: "The authoritative reference for HTML, CSS, JavaScript, and Web APIs — first stop for any browser API question.",
                ja: "HTML・CSS・JavaScript・Web APIの権威あるリファレンス。ブラウザAPIの疑問があれば最初に訪れるべき場所。",
              },
            },
            {
              title: "web.dev",
              href: "https://web.dev/",
              note: {
                en: "Google's guides on Core Web Vitals, performance patterns, PWAs, and modern web best practices.",
                ja: "Core Web Vitals・パフォーマンスパターン・PWA・最新Webベストプラクティスに関するGoogleのガイド。",
              },
            },
            {
              title: "RFC 9110 — HTTP Semantics",
              href: "https://www.rfc-editor.org/rfc/rfc9110",
              note: {
                en: "The canonical specification for HTTP method semantics, status codes, headers, and content negotiation.",
                ja: "HTTPメソッドのセマンティクス・ステータスコード・ヘッダー・コンテントネゴシエーションの正規仕様。",
              },
            },
            {
              title: "WHATWG HTML Living Standard",
              href: "https://html.spec.whatwg.org/",
              note: {
                en: "The living specification for HTML — includes the event loop algorithm, parsing rules, and all HTML elements.",
                ja: "HTMLの現行仕様——イベントループアルゴリズム・パース規則・すべてのHTML要素を含む。",
              },
            },
            {
              title: "High Performance Browser Networking — Ilya Grigorik",
              href: "https://hpbn.co/",
              note: {
                en: "Free online book covering TCP, TLS, HTTP/1-2-3, WebSocket, and WebRTC with performance implications throughout.",
                ja: "TCP・TLS・HTTP/1-2-3・WebSocket・WebRTCをパフォーマンスの観点から解説する無料オンラインブック。",
              },
            },
            {
              title: "WHATWG Fetch Standard",
              href: "https://fetch.spec.whatwg.org/",
              note: {
                en: "Defines the fetch() API, CORS algorithm, and the request/response model used by the browser.",
                ja: "fetch() API・CORSアルゴリズム・ブラウザが使用するリクエスト/レスポンスモデルを定義する。",
              },
            },
            {
              title: "The Web Security Cheat Sheet — OWASP",
              href: "https://cheatsheetseries.owasp.org/",
              note: {
                en: "Comprehensive, practical guidance on preventing XSS, CSRF, SQL injection, and dozens of other web vulnerabilities.",
                ja: "XSS・CSRF・SQLインジェクションなど多数のWeb脆弱性を防ぐための包括的・実践的なガイダンス。",
              },
            },
          ]}
        />
      </Article>
    </DocsShell>
  );
}
