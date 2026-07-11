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

export const Route = createFileRoute("/docs/software-engineering")({
  component: Page,
});

function Page() {
  return (
    <DocsShell active="software-engineering">
      <Article
        title={{ en: "Software Engineering", ja: "ソフトウェア工学" }}
        lead={{
          en: "Writing code is the easy part. Software engineering is the discipline of building and evolving software with other people, over time, under constant change — with quality, reliability, and the ability to keep moving as goals.",
          ja: "コードを書くこと自体は簡単です。ソフトウェア工学とは、品質・信頼性・継続的な開発速度を目標として、他者と協力しながら長期にわたってソフトウェアを構築・進化させるための体系的な学問です。",
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* 1. What software engineering is                                   */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="what-is-se"
          title={{
            en: "What software engineering is",
            ja: "ソフトウェア工学とは何か",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "**Programming** is solving a well-defined problem with code. **Software engineering** is everything that surrounds that activity when the code matters beyond today: design, coordination, testing, deployment, monitoring, and the social infrastructure that lets dozens of people work on the same system without destroying each other's work.",
                ja: "**プログラミング**とは、コードで明確に定義された問題を解くことです。**ソフトウェア工学**とは、そのコードが今日以降も重要である場合に伴うすべての営みを指します：設計、調整、テスト、デプロイ、監視、そして数十人の開発者が互いの作業を壊さずに同じシステムに取り組めるようにする社会的インフラです。",
              },
              {
                en: "The classic distinction from Dijkstra and Parnas: a programmer solves *a* problem; a software engineer solves *the problem over its lifetime*. Software is never finished — requirements change, dependencies evolve, and the team that wrote it turns over. The measure of good software engineering is whether the system can **absorb change** without accumulating chaos.",
                ja: "DijkstraやParnasによる古典的な区別：プログラマは*ある*問題を解く；ソフトウェアエンジニアはその問題を*ライフタイム全体にわたって*解く。ソフトウェアは決して完成しません——要件は変わり、依存関係は進化し、書いたチームはいれ替わります。優れたソフトウェア工学の尺度は、システムが混乱を蓄積せずに**変化を吸収**できるかどうかです。",
              },
              {
                en: "Google's book *Software Engineering at Google* (2020) frames it as a function of *scale* and *time*: the same code that is easy to manage for one engineer for a week becomes a coordination nightmare for 200 engineers over five years. The principles of software engineering are mostly answers to that scaling problem.",
                ja: "Googleの書籍『Software Engineering at Google』（2020年）は、これを*規模*と*時間*の関数として捉えています：1人のエンジニアが1週間で管理するのは容易なコードも、200人のエンジニアが5年間にわたって扱うと調整の悪夢になります。ソフトウェア工学の原則の多くは、そのスケーリング問題への答えです。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 2. The software lifecycle                                         */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="lifecycle"
          title={{
            en: "The software lifecycle",
            ja: "ソフトウェアライフサイクル",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "Every piece of software follows a lifecycle: someone identifies a need, that need is specified, a design is created, the design is coded, the code is tested, and the result is deployed — then maintained, evolved, and eventually retired. How that loop is structured varies enormously between teams.",
                ja: "すべてのソフトウェアはライフサイクルをたどります：誰かがニーズを特定し、そのニーズが仕様化され、設計が作られ、設計がコーディングされ、コードがテストされ、結果がデプロイされます——そして保守・進化され、最終的に廃止されます。このループの構造はチームによって大きく異なります。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "The software development lifecycle — from requirements to maintenance and back.",
              ja: "ソフトウェア開発ライフサイクル——要件定義から保守、そして再び。",
            }}
          >
            <FlowRow
              steps={[
                {
                  label: { en: "Requirements", ja: "要件定義" },
                  sub: { en: "what to build", ja: "何を作るか" },
                },
                {
                  label: { en: "Design", ja: "設計" },
                  sub: { en: "architecture & API", ja: "アーキテクチャとAPI" },
                },
                {
                  label: { en: "Implementation", ja: "実装" },
                  sub: { en: "coding & review", ja: "コーディングとレビュー" },
                },
                {
                  label: { en: "Testing", ja: "テスト" },
                  sub: {
                    en: "unit / integration / e2e",
                    ja: "単体・統合・E2E",
                  },
                },
                {
                  label: { en: "Deployment", ja: "デプロイ" },
                  sub: { en: "CI/CD pipeline", ja: "CI/CDパイプライン" },
                },
                {
                  label: { en: "Maintenance", ja: "保守" },
                  sub: { en: "observe & iterate", ja: "観察と反復" },
                },
              ]}
            />
          </Figure>

          <Prose
            paragraphs={[
              {
                en: "**Waterfall** (1970s) treats these phases as sequential: finish requirements before starting design, finish design before writing code. This works well when requirements are truly stable — embedded firmware for hardware that cannot be updated, or safety-critical avionics. Its weakness: requirements are almost never fully known upfront, so the finished product often does not match the actual need.",
                ja: "**ウォーターフォール**（1970年代）はこれらのフェーズを順次処理として扱います：設計を始める前に要件を完成させ、コードを書く前に設計を完成させます。要件が本当に安定している場合——更新できないハードウェアの組み込みファームウェアや安全性が重要な航空電子機器——にはうまく機能します。弱点は、要件が事前に完全に把握されることはほぼないため、完成した製品が実際のニーズに合わないことが多いことです。",
              },
              {
                en: '**Agile / iterative** methods (Agile Manifesto, 2001) acknowledge that requirements change and respond with short cycles called *sprints* or *iterations* (1–4 weeks). Each iteration delivers something runnable: get real feedback, update priorities, repeat. Scrum, Kanban, and Extreme Programming (XP) are the most common agile frameworks. Almost all modern product development teams use some form of agile — though "agile" is often a label applied to processes that are waterfall with faster reporting.',
                ja: "**アジャイル/反復**手法（アジャイルマニフェスト、2001年）は要件が変わることを認め、*スプリント*または*イテレーション*（1〜4週間）と呼ばれる短いサイクルで対応します。各イテレーションは動くものを提供します：実際のフィードバックを得て、優先度を更新し、繰り返します。スクラム、カンバン、エクストリームプログラミング（XP）が最も一般的なアジャイルフレームワークです。現代のほぼすべての製品開発チームは何らかのアジャイル形式を使用しています——もっとも「アジャイル」はより速い報告を伴うウォーターフォールのプロセスに適用されるラベルであることも多いですが。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 3. Version control                                                */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="version-control"
          title={{ en: "Version control", ja: "バージョン管理" }}
        >
          <Prose
            paragraphs={[
              {
                en: "**Version control** records every change to a codebase as a *commit* — a named snapshot with an author, timestamp, and message. The canonical tool since 2005 is **Git**, a distributed version control system designed by Linus Torvalds. Every developer has a full copy of the repository history locally; the remote (GitHub, GitLab, etc.) is just a shared synchronization point.",
                ja: "**バージョン管理**はコードベースへのすべての変更を*コミット*——著者・タイムスタンプ・メッセージを持つ名前付きスナップショット——として記録します。2005年以降の標準ツールは**Git**で、Linus Torvaldsが設計した分散バージョン管理システムです。各開発者はリポジトリ履歴の完全なコピーをローカルに持ちます。リモート（GitHub、GitLabなど）は単なる共有同期ポイントです。",
              },
              {
                en: "**Branches** allow parallel lines of development. A common pattern: each feature or bug-fix lives on its own branch (e.g. `feat/quota-durable-objects`), isolated from the main line until it is ready. This is exactly what nand2web uses — every significant change is developed on a feature branch, reviewed, then merged to `main`. The branch namespace keeps half-finished work out of production.",
                ja: "**ブランチ**は並行した開発ラインを可能にします。一般的なパターン：各機能またはバグ修正は独自のブランチ（例：`feat/quota-durable-objects`）に存在し、準備ができるまでメインラインから隔離されます。nand2webがまさにこの方法を使っています——すべての重要な変更はフィーチャーブランチで開発され、レビューされ、`main`にマージされます。ブランチの名前空間により、未完成の作業が本番環境に入り込みません。",
              },
              {
                en: "A **pull request** (PR) — or *merge request* in GitLab terminology — is the formal proposal to merge a branch. PRs are the primary mechanism for **code review**: teammates read the diff, leave comments, ask for changes, and eventually approve. Good code review is not gatekeeping; it is shared ownership, knowledge transfer, and a cheap way to catch bugs before they ship. After approval, **CI** (Continuous Integration) runs automated checks — builds, linters, type-checkers, and tests — to confirm the change does not break anything.",
                ja: "**プルリクエスト**（PR）——GitLab用語ではマージリクエスト——はブランチをマージする正式な提案です。PRは**コードレビュー**の主要メカニズムです：チームメンバーが差分を読み、コメントを残し、変更を求め、最終的に承認します。良いコードレビューはゲートキーピングではなく、共有オーナーシップ、知識移転、そしてバグが出荷前に発見される安価な方法です。承認後、**CI**（継続的インテグレーション）が自動チェック——ビルド・リンター・型チェッカー・テスト——を実行して変更が何も壊していないことを確認します。",
              },
              {
                en: "**Git hygiene** matters for long-lived projects: small, focused commits with descriptive messages make `git log` a readable journal of why things changed. Conventional Commits (`feat:`, `fix:`, `chore:`) add machine-readable structure that can auto-generate changelogs. `git bisect` uses binary search to find which commit introduced a bug — which only works if commits are small and each one leaves the code in a working state.",
                ja: "**Gitの習慣**は長期プロジェクトで重要です：説明的なメッセージを持つ小さく焦点を絞ったコミットは、`git log`を変更理由の読みやすい記録にします。Conventional Commits（`feat:`、`fix:`、`chore:`）は、変更履歴を自動生成できる機械可読な構造を追加します。`git bisect`は二分探索を使用してバグを導入したコミットを見つけます——コミットが小さく、各コミットがコードを動作する状態に保っている場合のみ機能します。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 4. Design & architecture                                          */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="architecture"
          title={{ en: "Design & architecture", ja: "設計とアーキテクチャ" }}
        >
          <Prose
            paragraphs={[
              {
                en: "Software architecture is the set of significant structural decisions about a system — what components exist, how they communicate, and where the boundaries are. Good architecture makes routine changes easy and surprises rare; bad architecture makes every change a global refactoring exercise.",
                ja: "ソフトウェアアーキテクチャは、システムに関する重要な構造的決定のセットです——どのコンポーネントが存在し、どのように通信し、境界がどこにあるか。良いアーキテクチャは日常的な変更を容易にし、驚きを稀にします；悪いアーキテクチャはすべての変更をグローバルなリファクタリング作業にします。",
              },
              {
                en: "Two core structural concepts: **coupling** and **cohesion**. *Low coupling* means a module depends on as few other modules as possible — changing module A doesn't require changing module B. *High cohesion* means everything inside a module belongs together — it does one thing and its pieces all serve that thing. These two goals usually point in the same direction: split along natural seams, and hide implementation details behind interfaces.",
                ja: "2つの核心的な構造概念：**結合度**と**凝集度**。*低結合*とはモジュールができるだけ少ない他のモジュールに依存することを意味します——モジュールAを変更してもモジュールBを変更する必要がありません。*高凝集*とはモジュール内のすべてが一緒に属していることを意味します——一つのことをこなし、その部品すべてがそれに貢献します。この2つの目標は通常同じ方向を向いています：自然な接合部で分割し、実装の詳細をインターフェースの背後に隠します。",
              },
              {
                en: "**SOLID** is a mnemonic for five object-oriented design principles (Robert C. Martin): **S**ingle Responsibility — each class does one thing; **O**pen/Closed — open for extension, closed for modification; **L**iskov Substitution — subtypes must be substitutable for their base types; **I**nterface Segregation — many narrow interfaces beat one fat interface; **D**ependency Inversion — depend on abstractions, not concretions. These are heuristics, not laws — apply with judgement.",
                ja: "**SOLID**はオブジェクト指向設計の5原則のニーモニックです（Robert C. Martin）：**S**ingle Responsibility——各クラスは一つのことをする；**O**pen/Closed——拡張に対して開き、修正に対して閉じる；**L**iskov Substitution——サブタイプは基底型の代替として使用可能でなければならない；**I**nterface Segregation——多くの狭いインターフェースが一つの太いインターフェースに勝る；**D**ependency Inversion——具体ではなく抽象に依存する。これらはヒューリスティックであり、法則ではありません——判断を持って適用してください。",
              },
              {
                en: "**Design patterns** (from the Gang of Four book, 1994) are named solutions to recurring design problems: *Factory* for decoupling object creation from use, *Observer* for event-driven communication, *Strategy* for swappable algorithms, *Adapter* for bridging incompatible interfaces. Patterns are a vocabulary, not a recipe book — the value is in having a shared name for a concept, not in mechanically applying the UML diagram.",
                ja: "**デザインパターン**（Gang of Fourの書籍、1994年）は繰り返し発生する設計問題への名前付きの解決策です：*Factory*はオブジェクト生成と使用の分離のため、*Observer*はイベント駆動通信のため、*Strategy*は交換可能なアルゴリズムのため、*Adapter*は非互換インターフェースの橋渡しのため。パターンは語彙であり、レシピブックではありません——価値はUML図を機械的に適用することではなく、概念の共有名を持つことにあります。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "Monolith vs microservices — deployment model comparison.",
              ja: "モノリスとマイクロサービス——デプロイモデルの比較。",
            }}
          >
            <CompareTable
              headers={[
                { en: "Dimension", ja: "観点" },
                { en: "Monolith", ja: "モノリス" },
                { en: "Microservices", ja: "マイクロサービス" },
              ]}
              rows={[
                [
                  { en: "Deployment unit", ja: "デプロイ単位" },
                  { en: "One process / binary", ja: "単一プロセス／バイナリ" },
                  {
                    en: "Many independent services",
                    ja: "多数の独立したサービス",
                  },
                ],
                [
                  { en: "Inter-component calls", ja: "コンポーネント間通信" },
                  { en: "In-process (fast)", ja: "プロセス内（高速）" },
                  {
                    en: "Network (latency + failure)",
                    ja: "ネットワーク（レイテンシと障害）",
                  },
                ],
                [
                  { en: "Scaling", ja: "スケーリング" },
                  { en: "Scale the whole app", ja: "アプリ全体をスケール" },
                  {
                    en: "Scale hot services individually",
                    ja: "ホットなサービスだけ個別にスケール",
                  },
                ],
                [
                  { en: "Complexity", ja: "複雑性" },
                  { en: "Simple to run locally", ja: "ローカル実行が簡単" },
                  {
                    en: "Distributed systems complexity",
                    ja: "分散システムの複雑性",
                  },
                ],
                [
                  { en: "Team fit", ja: "チームとの相性" },
                  {
                    en: "Small teams, early products",
                    ja: "小チーム・初期プロダクト",
                  },
                  {
                    en: "Large orgs, Conway's Law",
                    ja: "大組織・コンウェイの法則",
                  },
                ],
                [
                  { en: "Real-world advice", ja: "実践的アドバイス" },
                  {
                    en: "Start here — monolith first",
                    ja: "ここから始める——モノリスファースト",
                  },
                  {
                    en: "Migrate when you feel the seams",
                    ja: "継ぎ目を感じたら移行する",
                  },
                ],
              ]}
            />
          </Figure>

          <P
            t={{
              en: "Martin Fowler's advice remains sound: start with a well-structured monolith. Extract services only when you have **clear boundaries driven by team topology or independent scaling needs**, not because microservices sound modern. Premature decomposition creates distributed-systems complexity without any benefit.",
              ja: "Martin Fowlerのアドバイスは依然として的確です：構造の良いモノリスから始めてください。マイクロサービスが最新に聞こえるからではなく、**チームトポロジーや独立したスケーリングニーズによって駆動される明確な境界**がある場合にのみサービスを抽出してください。時期尚早な分解は、メリットなしに分散システムの複雑性を生み出します。",
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 5. Testing                                                        */}
        {/* ---------------------------------------------------------------- */}
        <Section id="testing" title={{ en: "Testing", ja: "テスト" }}>
          <Prose
            paragraphs={[
              {
                en: "Testing is the practice of running code to verify it behaves correctly — and of automating those runs so they catch regressions before humans do. Untested code is not faster to write; it is faster to write *initially* and slower forever after, because every change carries the risk of silent breakage.",
                ja: "テストとは、コードを実行して正しく動作することを確認し、それらの実行を自動化して人間より先に回帰を検出する実践です。テストされていないコードは書くのが速いのではありません；*最初は*速く書けますが、その後ずっと遅くなります——なぜならすべての変更が無言の破損のリスクを伴うからです。",
              },
              {
                en: "**Unit tests** test a single function or class in isolation, with all dependencies replaced by fakes or mocks. They run in milliseconds and give precise failure messages. **Integration tests** test the collaboration between two or more real components — e.g., a service layer calling a real database. They are slower and harder to isolate but catch interface mismatches. **End-to-end (e2e) tests** simulate a real user through the whole stack — browser automation, real network, real database. They are the most realistic and the slowest.",
                ja: "**単体テスト**は単一の関数やクラスを分離してテストし、すべての依存関係をフェイクやモックに置き換えます。ミリ秒で実行され、正確な失敗メッセージを提供します。**統合テスト**は2つ以上の実際のコンポーネント間の協調をテストします——例：実際のデータベースを呼び出すサービス層。より遅く隔離しにくいですが、インターフェースの不一致を検出します。**エンドツーエンド（E2E）テスト**は実際のユーザーをスタック全体でシミュレートします——ブラウザ自動化、実際のネットワーク、実際のデータベース。最もリアルで、最も遅いです。",
              },
              {
                en: "**Test-Driven Development (TDD)** inverts the order: write a failing test first, then write the minimum code to make it pass, then refactor. The discipline forces you to design the interface before the implementation, which tends to produce simpler, more composable code. It also gives you a regression suite as a by-product.",
                ja: "**テスト駆動開発（TDD）**は順序を逆転させます：最初に失敗するテストを書き、次にそれをパスさせる最小限のコードを書き、そしてリファクタリングします。この規律により、実装前にインターフェースを設計することを強制され、よりシンプルで合成可能なコードが生成される傾向があります。また、副産物として回帰スイートが得られます。",
              },
              {
                en: "**Property-based testing** (e.g. fast-check, QuickCheck) generates hundreds of random inputs and checks that an invariant holds — rather than checking specific examples the author thought of. nand2web's test suite uses fast-check for this purpose: it discovered edge cases in the simulator logic that hand-written examples missed. The weaknesses: properties are harder to write than examples, and failure messages report a generated input rather than a human-readable scenario.",
                ja: "**プロパティベーステスト**（例：fast-check、QuickCheck）は何百もの乱数入力を生成し、不変条件が成立するかチェックします——著者が思いついた特定の例をチェックするのではなく。nand2webのテストスイートはこの目的でfast-checkを使用しています：手書きの例では見落とされたシミュレータロジックのエッジケースを発見しました。弱点：プロパティは例より書きにくく、失敗メッセージは人間が読めるシナリオではなく生成された入力を報告します。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "The test pyramid: many cheap unit tests at the base, fewer expensive e2e tests at the top.",
              ja: "テストピラミッド：底部に多くの安価な単体テスト、頂上に少ない高コストのE2Eテスト。",
            }}
          >
            <LayerStack
              layers={[
                {
                  label: {
                    en: "E2E / Browser tests",
                    ja: "E2E / ブラウザテスト",
                  },
                  sub: {
                    en: "Few — slow, realistic, catch integration failures",
                    ja: "少数——遅い・リアル・統合障害を検出",
                  },
                  tone: "accent",
                },
                {
                  label: {
                    en: "Integration tests",
                    ja: "統合テスト",
                  },
                  sub: {
                    en: "Moderate — test component boundaries & contracts",
                    ja: "中程度——コンポーネント境界と契約をテスト",
                  },
                  tone: "emerald",
                },
                {
                  label: {
                    en: "Unit tests",
                    ja: "単体テスト",
                  },
                  sub: {
                    en: "Many — fast, isolated, precise failure messages",
                    ja: "多数——高速・分離・正確な失敗メッセージ",
                  },
                  tone: "zinc",
                },
              ]}
            />
          </Figure>

          <P
            t={{
              en: "**Coverage** measures what fraction of lines, branches, or statements are executed by the test suite. 100% coverage does not mean the code is correct — it means every line ran, not that every behaviour was verified. Coverage is a floor, not a ceiling: chasing it by writing tests without assertions (or by deleting branches) is counterproductive.",
              ja: "**カバレッジ**は、テストスイートによって実行される行・分岐・文の割合を測定します。100%のカバレッジはコードが正しいことを意味しません——すべての行が実行されたことを意味し、すべての動作が検証されたわけではありません。カバレッジは上限ではなくフロアです：アサーションなしでテストを書いたり（または分岐を削除したりして）それを追い求めることは逆効果です。",
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 6. Code quality & maintainability                                 */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="quality"
          title={{
            en: "Code quality & maintainability",
            ja: "コード品質と保守性",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "Code is read far more often than it is written. The primary audience for code is **the next developer** — often yourself six months from now. Readable code uses names that reveal intent (`calculateMonthlyInterest` beats `calc`), short functions with one job, and comments that explain *why* rather than *what* (the what is in the code; the why is not).",
                ja: "コードは書かれる頻度よりはるかに多く読まれます。コードの主要な読者は**次の開発者**です——多くの場合、6ヶ月後の自分自身です。読みやすいコードは意図を明かす名前（`calc`より`calculateMonthlyInterest`）、一つの仕事をする短い関数、そして*何を*ではなく*なぜ*を説明するコメントを使います（何をはコードにある；なぜはない）。",
              },
              {
                en: "**Refactoring** (Martin Fowler's term) is restructuring existing code without changing its observable behaviour. The goal is to improve internal quality — reduce duplication, clarify intent, lower coupling — so that future changes are cheaper. The safety net is a test suite: refactor under green tests, never mix refactoring with feature changes in the same commit.",
                ja: "**リファクタリング**（Martin Fowlerの用語）は、観察可能な動作を変えずに既存のコードを再構成することです。目標は内部品質を向上させることです——重複を削減し、意図を明確にし、結合を下げ——将来の変更をより安価にします。安全網はテストスイートです：グリーンのテスト下でリファクタリングし、リファクタリングと機能変更を同じコミットに混在させないでください。",
              },
              {
                en: "**Technical debt** is the accumulated cost of shortcuts. A rushed implementation that works today creates friction tomorrow: it is harder to understand, harder to test, and harder to change. Like financial debt, it can be worth taking on deliberately (to ship fast) as long as you plan to repay it. The problem is *unintentional* or *forgotten* debt that silently compounds until the codebase becomes unmaintainable.",
                ja: "**技術的負債**は近道の蓄積コストです。今日動く急いだ実装は明日摩擦を生み出します：理解が難しく、テストが難しく、変更が難しくなります。金融の負債と同様に、返済する計画がある限り、意図的に負うこと（素早く出荷するため）は価値があります。問題は*意図しない*または*忘れられた*負債が静かに複利で増え続け、コードベースが保守不能になるまでです。",
              },
              {
                en: "**Linters and formatters** catch style violations and common bugs automatically. This project uses **Biome** — a fast Rust-based linter and formatter that replaces ESLint + Prettier in a single tool. Consistent formatting eliminates style debates in code review (every diff is about logic, not whitespace). Static type systems (TypeScript, Rust's type system) catch a whole class of bugs at compile time that would otherwise require runtime tests.",
                ja: "**リンターとフォーマッター**はスタイル違反と一般的なバグを自動的に検出します。このプロジェクトは**Biome**を使用します——ESLint + Prettierを単一ツールで置き換える高速なRustベースのリンターとフォーマッターです。一貫したフォーマットはコードレビューでのスタイル議論をなくします（すべての差分はロジックについてであり、空白ではありません）。静的型システム（TypeScript、Rustの型システム）は、そうでなければランタイムテストを必要とするバグのクラス全体をコンパイル時に検出します。",
              },
            ]}
          />

          <Callout
            tone="insight"
            title={{
              en: "The best refactoring is no refactoring",
              ja: "最高のリファクタリングはリファクタリングしないこと",
            }}
            t={{
              en: "Experienced engineers invest in getting the structure right the first time — not perfect, but good enough to evolve. This is cheaper than accumulating debt and repaying it later. The prerequisite is experience: you need to have felt the pain of bad structure to know what good structure looks like.",
              ja: "経験豊富なエンジニアは、最初から構造を正しく設計することに投資します——完璧ではなく、進化できるほど良い状態に。これは負債を蓄積して後で返済するより安価です。前提条件は経験です：良い構造がどんなものか知るためには、悪い構造の痛みを感じている必要があります。",
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 7. Process & collaboration                                        */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="process"
          title={{
            en: "Process & collaboration",
            ja: "プロセスとコラボレーション",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "Software is built by people. Almost everything about process and collaboration is about making communication explicit, asynchronous, and persistent — so that knowledge does not live only in one person's head and decisions are traceable.",
                ja: "ソフトウェアは人が作ります。プロセスとコラボレーションに関するほぼすべては、コミュニケーションを明示的・非同期・永続的にすることについてです——知識が一人の頭の中だけに存在せず、決定がトレース可能になるように。",
              },
              {
                en: "**Issues** (GitHub Issues, Jira tickets, Linear tasks) are the unit of work. A good issue describes the problem (not the solution), gives enough context to be actionable, and is small enough to be completed in a few days. Issue trackers are a shared backlog — a prioritized list of work that prevents the team from stepping on each other and gives stakeholders visibility.",
                ja: "**イシュー**（GitHub Issues、Jiraチケット、Linearタスク）は作業の単位です。良いイシューは問題を説明し（解決策ではなく）、実行可能な十分なコンテキストを提供し、数日で完了できるほど小さいです。イシュートラッカーは共有バックログです——チームがお互いの作業を踏まないようにし、ステークホルダーに可視性を提供する優先順位付けされた作業リストです。",
              },
              {
                en: "**Estimation** is hard and routinely wrong. Software tasks have fat-tailed distributions — most tasks finish quickly, a few take 10× longer than expected due to hidden complexity. Common mitigations: break large tasks into sub-tasks (smaller tasks have narrower distributions), use relative estimates like story points instead of calendar time, and track velocity over sprints rather than individual task estimates.",
                ja: "**見積もり**は難しく、日常的に間違います。ソフトウェアタスクは裾の厚い分布を持ちます——ほとんどのタスクは素早く完了しますが、隠れた複雑さにより想定の10倍かかるものが少数あります。一般的な緩和策：大きなタスクをサブタスクに分解し（小さなタスクは分布が狭い）、カレンダー時間ではなくストーリーポイントのような相対的な見積もりを使い、個々のタスクの見積もりではなくスプリント全体のベロシティを追跡します。",
              },
              {
                en: "**Documentation** is the other form of code review: future readers — including automated agents — need to understand why a system is structured the way it is. Architecture Decision Records (ADRs) capture the context and reasoning behind significant decisions in a short, date-stamped document. READMEs, API docs, and inline comments serve different audiences and should be updated together with the code that makes them wrong.",
                ja: "**ドキュメント**はコードレビューのもう一つの形式です：自動エージェントを含む将来の読者は、なぜシステムがそのように構成されているのかを理解する必要があります。アーキテクチャ決定記録（ADR）は、短い日付入りのドキュメントで重要な決定の背景と理由を記録します。README、APIドキュメント、インラインコメントはそれぞれ異なる読者向けで、それらを誤らせるコードと同時に更新する必要があります。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 8. Delivery & operations                                          */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="delivery"
          title={{ en: "Delivery & operations", ja: "デリバリーと運用" }}
        >
          <Prose
            paragraphs={[
              {
                en: "**CI/CD** — Continuous Integration and Continuous Delivery/Deployment — is the engineering practice of automating the path from a commit to production. CI runs on every push: build, lint, test. CD automates deployment to staging after a green CI run; in full CD, a green CI on main automatically deploys to production without human intervention.",
                ja: "**CI/CD**——継続的インテグレーションと継続的デリバリー/デプロイメント——はコミットから本番環境への経路を自動化するエンジニアリング実践です。CIはプッシュのたびに実行されます：ビルド、リント、テスト。CDはグリーンのCIの後にステージングへのデプロイを自動化します；完全なCDでは、mainのグリーンのCIが人間の介入なしに自動的に本番環境にデプロイします。",
              },
              {
                en: "**Environments** — typically development, staging, and production — allow changes to be validated at each stage before reaching users. Configuration (secrets, feature flags, connection strings) must differ across environments; embedding them in code is a security vulnerability and makes environment promotion impossible. The twelve-factor app methodology (12factor.net) codifies this and other deployment best practices.",
                ja: "**環境**——通常は開発、ステージング、本番——により、変更がユーザーに届く前に各段階で検証されます。設定（シークレット、フィーチャーフラグ、接続文字列）は環境間で異なる必要があります；コードに埋め込むことはセキュリティの脆弱性であり、環境のプロモーションを不可能にします。The Twelve-Factor Appの方法論（12factor.net）はこれと他のデプロイメントのベストプラクティスを体系化しています。",
              },
              {
                en: "**Deployment strategies** manage risk when updating a running system. *Blue-green deployment* runs two identical environments (blue and green); traffic is switched from the live environment to the new one atomically — rollback is a traffic switch back. *Canary deployment* routes a small percentage of real traffic (e.g. 5%) to the new version, widens on success, and rolls back on error signals before full rollout. Both strategies make deployment a non-event rather than a nerve-wracking ceremony.",
                ja: "**デプロイメント戦略**は実行中のシステムを更新する際のリスクを管理します。*ブルーグリーンデプロイメント*は2つの同一環境（ブルーとグリーン）を実行します；トラフィックはライブ環境から新しい環境に原子的に切り替えられ——ロールバックはトラフィックを戻す切り替えです。*カナリアデプロイメント*は実際のトラフィックの少数割合（例：5%）を新バージョンにルーティングし、成功時に拡大し、完全ロールアウト前のエラーシグナルでロールバックします。どちらの戦略もデプロイメントを神経をすり減らす式典ではなく、当たり前のことにします。",
              },
              {
                en: '**Observability** is the ability to understand the internal state of a running system from its outputs. The three pillars: **logs** (structured, timestamped records of events — what happened), **metrics** (numeric time-series — counts, latencies, error rates, saturation), and **traces** (correlated spans showing the path of a single request through multiple services). Without observability, debugging production is guesswork. With it, an on-call engineer can answer "what is broken, where, and since when" in minutes.',
                ja: "**オブザーバビリティ**は実行中のシステムの内部状態をその出力から理解する能力です。3つの柱：**ログ**（構造化されたタイムスタンプ付きイベント記録——何が起きたか）、**メトリクス**（数値の時系列——カウント、レイテンシ、エラーレート、飽和度）、**トレース**（単一リクエストが複数のサービスを通るパスを示す相関スパン）。オブザーバビリティがなければ、本番環境のデバッグは当てずっぽうです。あれば、オンコールエンジニアは「何が、どこで、いつから壊れているか」を数分で答えられます。",
              },
              {
                en: "**Incident response** is the practice of handling production failures systematically. A well-run incident has clear phases: detect (alert fires), triage (understand scope), mitigate (restore service, even partially), then investigate root cause. Afterwards, a blameless post-mortem documents the timeline, the contributing factors, and the action items — not to assign blame, but to make the system more robust. The DORA research program (dora.dev) has shown that high-performing teams have *faster* incident recovery than low performers — not fewer incidents, but quicker detection and restoration.",
                ja: "**インシデントレスポンス**は本番環境の障害を体系的に処理する実践です。適切に運用されたインシデントには明確なフェーズがあります：検出（アラートが発火）、トリアージ（スコープを理解）、緩和（たとえ部分的でもサービスを回復）、そして根本原因の調査。その後、ポストモーテム（blame-free）がタイムライン、寄与要因、アクションアイテムをドキュメント化します——非難するためではなく、システムをより堅牢にするために。DORAリサーチプログラム（dora.dev）は、高パフォーマンスチームがインシデントからの回復が低パフォーマーより*速い*ことを示しています——インシデントが少ないのではなく、検出と回復が迅速です。",
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
                term: "Version control",
                def: {
                  en: "A system (e.g. Git) that records every change to a codebase as a named commit, enabling history, branching, and collaboration.",
                  ja: "コードベースへのすべての変更を名前付きコミットとして記録し、履歴・ブランチ・コラボレーションを可能にするシステム（例：Git）。",
                },
              },
              {
                term: "CI/CD",
                def: {
                  en: "Continuous Integration (automated build + test on every push) and Continuous Delivery/Deployment (automated promotion to staging or production after green CI).",
                  ja: "継続的インテグレーション（毎プッシュの自動ビルド+テスト）と継続的デリバリー/デプロイメント（グリーンCIの後の自動ステージング/本番プロモーション）。",
                },
              },
              {
                term: "Refactoring",
                def: {
                  en: "Restructuring code to improve internal quality — reduce duplication, clarify intent, lower coupling — without changing observable behaviour.",
                  ja: "観察可能な動作を変えずに内部品質を向上させるためにコードを再構成すること——重複削減、意図の明確化、結合の低減。",
                },
              },
              {
                term: "Technical debt",
                def: {
                  en: "The accumulated friction created by past shortcuts — code that works but is hard to understand, test, or change. Compounds unless actively repaid.",
                  ja: "過去の近道が生み出した蓄積された摩擦——動作するが理解・テスト・変更が難しいコード。積極的に返済しない限り複利で増える。",
                },
              },
              {
                term: "Coupling & cohesion",
                def: {
                  en: "Coupling: the degree to which modules depend on each other (lower is better). Cohesion: how much the parts of a module belong together (higher is better).",
                  ja: "結合度：モジュール同士が互いに依存する程度（低いほど良い）。凝集度：モジュールの部品がどれほど一緒に属しているか（高いほど良い）。",
                },
              },
              {
                term: "TDD",
                def: {
                  en: "Test-Driven Development — write a failing test first, then the minimum code to pass it, then refactor. Produces small, testable, interface-first designs.",
                  ja: "テスト駆動開発——最初に失敗するテストを書き、次にそれをパスする最小限のコードを書き、そしてリファクタリングする。小さく・テスト可能・インターフェースファーストな設計を生む。",
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
              title: "The Pragmatic Programmer, 20th Anniversary Edition",
              href: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
              note: {
                en: "Timeless advice on craftsmanship, tools, and the career of a software engineer. A must-read.",
                ja: "ソフトウェアエンジニアのクラフトマンシップ・ツール・キャリアに関する不朽のアドバイス。必読書。",
              },
            },
            {
              title: "Software Engineering at Google",
              href: "https://abseil.io/resources/swe-book",
              note: {
                en: "Free online book covering Google's practices: testing, code review, large-scale refactoring, and culture.",
                ja: "Googleの実践を網羅する無料オンライン書籍：テスト・コードレビュー・大規模リファクタリング・文化。",
              },
            },
            {
              title: "Martin Fowler's site (martinfowler.com)",
              href: "https://martinfowler.com/",
              note: {
                en: "Canonical reference for refactoring, architecture patterns, microservices, and agile practices.",
                ja: "リファクタリング・アーキテクチャパターン・マイクロサービス・アジャイル実践の標準的なリファレンス。",
              },
            },
            {
              title: "Accelerate / DORA research",
              href: "https://dora.dev/",
              note: {
                en: "Data-driven research on software delivery performance: deployment frequency, lead time, MTTR, and change failure rate.",
                ja: "ソフトウェアデリバリーパフォーマンスに関するデータ駆動の研究：デプロイ頻度・リードタイム・MTTR・変更障害率。",
              },
            },
            {
              title: "Pro Git (free online book)",
              href: "https://git-scm.com/book",
              note: {
                en: "The definitive free reference for Git — internals, branching, rebasing, and collaboration workflows.",
                ja: "Gitの決定版無料リファレンス——内部構造・ブランチ・リベース・コラボレーションワークフロー。",
              },
            },
            {
              title:
                "Design Patterns: Elements of Reusable Object-Oriented Software",
              href: "https://en.wikipedia.org/wiki/Design_Patterns",
              note: {
                en: "The Gang of Four book that named the canonical design patterns (Factory, Observer, Strategy, etc.).",
                ja: "正規のデザインパターン（Factory・Observer・Strategyなど）に名前を付けたGang of Fourの書籍。",
              },
            },
            {
              title: "The Twelve-Factor App",
              href: "https://12factor.net/",
              note: {
                en: "Methodology for building cloud-native, deployable services: env-based config, stateless processes, and more.",
                ja: "クラウドネイティブでデプロイ可能なサービスを構築するための方法論：環境ベースの設定・ステートレスプロセス等。",
              },
            },
            {
              title: "fast-check — property-based testing for JavaScript",
              href: "https://fast-check.dev/",
              note: {
                en: "Property-based testing library used in nand2web's test suite. Finds edge cases that hand-written examples miss.",
                ja: "nand2webのテストスイートで使用されるプロパティベーステストライブラリ。手書きの例では見逃すエッジケースを発見する。",
              },
            },
          ]}
        />
      </Article>
    </DocsShell>
  );
}
