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
  Prose,
  References,
  Section,
  useSvgId,
} from "../../features/docs";

export const Route = createFileRoute("/docs/oss")({
  component: Page,
});

function Page() {
  return (
    <DocsShell active="oss">
      <Article
        title={{
          en: "Open Source Software",
          ja: "オープンソースソフトウェア（OSS）",
        }}
        lead={{
          en: "Open source software is code whose licence grants everyone the right to use, study, modify, and redistribute it. From the Linux kernel to npm packages, OSS underpins virtually all modern computing — and understanding how it works, how it is governed, and where it can fail is essential for any professional software engineer.",
          ja: "オープンソースソフトウェアとは、誰でも使用・研究・改変・再配布できる権利をライセンスで付与されたコードです。Linuxカーネルからnpmパッケージまで、OSSは現代のほぼすべてのコンピューティングを支えています。その仕組み・ガバナンス・リスクを理解することは、すべてのプロフェッショナルなソフトウェアエンジニアに不可欠です。",
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* 1. What open source is                                            */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="what-is-oss"
          title={{ en: "What open source is", ja: "オープンソースとは何か" }}
        >
          <Prose
            paragraphs={[
              {
                en: "Software is **open source** when its source code is published under a licence that, at minimum, grants every recipient the freedom to (1) use the software for any purpose, (2) study how it works, (3) modify it, and (4) redistribute original or modified copies. The licence is the legal mechanism that makes these freedoms durable — without it, copyright law reserves all rights to the author by default.",
                ja: "ソフトウェアが**オープンソース**であるとは、そのソースコードが少なくとも（1）目的を問わず使用する自由、（2）動作を研究する自由、（3）改変する自由、（4）オリジナルまたは改変版を再配布する自由をすべての受領者に付与するライセンスの下で公開されていることを意味します。ライセンスはこれらの自由を永続させる法的メカニズムです——なければ著作権法によりデフォルトですべての権利が作者に留保されます。",
              },
              {
                en: "The term **Open Source** was coined in 1998 by the Open Source Initiative (OSI) as a pragmatic, business-friendly framing. The older term **Free Software** (Richard Stallman / GNU Project, 1983) emphasises the same four freedoms but with a stronger ethical dimension — the word *free* means *libre* (freedom), not *gratis* (price). The combined acronym **FOSS** (Free and Open Source Software) is common in technical writing when both camps are meant.",
                ja: "**オープンソース**という用語は1998年にOpen Source Initiative（OSI）がビジネス寄りのフレーミングとして生み出したものです。それ以前の**フリーソフトウェア**（リチャード・ストールマン／GNUプロジェクト、1983年）は同じ4つの自由を強調しますが、より強い倫理的側面を持ちます——ここでの*free*は*gratis*（無料）ではなく*libre*（自由）を意味します。両陣営を指す場合は**FOSS**（フリーかつオープンソースのソフトウェア）という頭字語が技術文書でよく使われます。",
              },
              {
                en: "The underlying philosophy is that software knowledge should be shared like scientific knowledge: peer-reviewable, improvable by anyone, and never locked away behind a proprietary wall. In practice, this produces software that is scrutinised by far more eyes than any single company could afford to employ, and that survives the death of any single organisation.",
                ja: "根底にある哲学は、ソフトウェアの知識は科学的知識のように共有されるべきというものです：誰でも査読でき、誰でも改善でき、独占的な壁の背後に閉じ込められることはありません。実際には、単一の企業が雇用できる数をはるかに超える多くの目によって精査されるソフトウェアが生まれ、特定の組織の消滅にも耐えます。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 2. Licences                                                       */}
        {/* ---------------------------------------------------------------- */}
        <Section id="licences" title={{ en: "Licences", ja: "ライセンス" }}>
          <Prose
            paragraphs={[
              {
                en: "Every OSS licence falls somewhere on a spectrum between **permissive** and **copyleft**. The distinction determines what obligations downstream users and distributors have when they ship a product based on the code.",
                ja: "OSSライセンスはすべて**パーミッシブ**と**コピーレフト**のスペクトラムのどこかに位置します。この区別は、コードをベースにした製品を出荷する際に下流のユーザーや配布者が負う義務を決定します。",
              },
              {
                en: "**Permissive licences** (MIT, Apache-2.0, BSD 2-clause / 3-clause) impose almost no conditions. You may incorporate the code into a proprietary product, compile it into a binary and ship it without source, or relicence the combined work under any terms you like — as long as you retain the original copyright notice and (in some cases) the licence text. Apache-2.0 adds an explicit **patent grant**: contributors licence their patent claims to all recipients, and the licence terminates automatically for any party that initiates patent litigation against the project.",
                ja: "**パーミッシブライセンス**（MIT・Apache-2.0・BSD 2条項/3条項）はほとんど条件を課しません。コードをプロプライエタリ製品に組み込んだり、バイナリにコンパイルしてソースなしで出荷したり、任意の条件で結合した著作物を再ライセンスしたりできます——元の著作権表示を（場合によってはライセンス文を）保持する限りにおいて。Apache-2.0はさらに明示的な**特許付与**を追加します：貢献者は自分の特許請求をすべての受領者にライセンスし、プロジェクトに対して特許訴訟を起こした当事者のライセンスは自動的に終了します。",
              },
              {
                en: "**Copyleft licences** (GPL v2 / v3, LGPL, AGPL) use copyright law offensively to enforce openness. The central obligation is the **share-alike** clause: if you distribute a work that contains GPL-licensed code, you must also distribute the source code of the combined work under the same (or compatible) licence. This makes copyleft 'viral' — it propagates into derivative works. GPL v3 strengthens anti-tivoisation (you must also provide the means to install modified code on the device) and adds a patent defence clause equivalent to Apache-2.0's. **AGPL** extends the share-alike trigger to *network use*: if you run AGPL code on a server and users interact with it, you must make the source available — closing the 'SaaS loophole' of GPL.",
                ja: "**コピーレフトライセンス**（GPL v2/v3・LGPL・AGPL）は著作権法を積極的に使ってオープン性を強制します。中心的な義務は**シェアアライク**条項です：GPLライセンスのコードを含む著作物を配布する場合、結合著作物のソースコードも同じ（または互換性のある）ライセンスで配布しなければなりません。これがコピーレフトを「ウイルス性」にします——派生著作物に伝播します。GPL v3はアンチTivoization（デバイスに改変コードをインストールする手段も提供しなければならない）を強化し、Apache-2.0相当の特許防衛条項を追加します。**AGPL**はシェアアライクのトリガーを*ネットワーク使用*にまで拡張します：AGPLのコードをサーバーで実行してユーザーが操作する場合、ソースを公開しなければなりません——GPLの「SaaSの抜け穴」を塞ぎます。",
              },
              {
                en: "**LGPL** (Lesser GPL) is a middle ground designed for libraries: a proprietary application may *link* against an LGPL library without inheriting the copyleft obligation, but modifications to the library itself must be shared. This is why glibc and many language runtimes use LGPL.",
                ja: "**LGPL**（劣化GPL）はライブラリ向けに設計された中間点です：プロプライエタリアプリケーションはコピーレフト義務を継承せずにLGPLライブラリに*リンク*できますが、ライブラリ自体への変更は共有しなければなりません。glibcや多くの言語ランタイムがLGPLを使う理由です。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "Permissive vs copyleft licences: key obligations at a glance.",
              ja: "パーミッシブ対コピーレフトライセンス：主要な義務の比較。",
            }}
          >
            <CompareTable
              headers={[
                { en: "Obligation", ja: "義務" },
                {
                  en: "Permissive (MIT / Apache-2.0)",
                  ja: "パーミッシブ（MIT/Apache-2.0）",
                },
                {
                  en: "Copyleft (GPL v3 / AGPL)",
                  ja: "コピーレフト（GPL v3/AGPL）",
                },
              ]}
              rows={[
                [
                  { en: "Keep copyright notice", ja: "著作権表示の保持" },
                  { en: "Yes", ja: "必須" },
                  { en: "Yes", ja: "必須" },
                ],
                [
                  {
                    en: "Distribute source on redistribution",
                    ja: "再配布時のソース公開",
                  },
                  {
                    en: "No — binary-only is fine",
                    ja: "不要——バイナリのみでも可",
                  },
                  {
                    en: "Yes — full source required",
                    ja: "必須——完全なソースが必要",
                  },
                ],
                [
                  {
                    en: "Triggered by network use (SaaS)",
                    ja: "ネットワーク使用（SaaS）でも発動",
                  },
                  { en: "No", ja: "なし" },
                  { en: "GPL: No / AGPL: Yes", ja: "GPL：なし / AGPL：あり" },
                ],
                [
                  {
                    en: "Can include in proprietary product",
                    ja: "プロプライエタリ製品への組み込み",
                  },
                  { en: "Yes", ja: "可能" },
                  {
                    en: "No (opens the product)",
                    ja: "不可（製品全体が公開対象になる）",
                  },
                ],
                [
                  { en: "Explicit patent grant", ja: "明示的な特許付与" },
                  {
                    en: "Apache-2.0: Yes / MIT: No",
                    ja: "Apache-2.0：あり / MIT：なし",
                  },
                  { en: "Yes (v3)", ja: "あり（v3）" },
                ],
              ]}
            />
          </Figure>

          <Callout
            tone="insight"
            title={{ en: "Choosing a licence", ja: "ライセンスの選び方" }}
            t={{
              en: "Use **MIT** for maximum adoption (libraries, tools, examples). Use **Apache-2.0** when you also want an explicit patent grant — standard for larger OSS projects. Use **GPL v3** when you want improvements to stay open; use **AGPL** when you are building server software and want network users to benefit from changes. The site **choosealicense.com** walks you through the decision tree interactively.",
              ja: "最大限の採用を求めるなら**MIT**（ライブラリ・ツール・サンプル向け）。明示的な特許付与も必要なら**Apache-2.0**——大規模OSSプロジェクトの標準。改善をオープンに留めたいなら**GPL v3**、サーバーソフトウェアを構築しネットワークユーザーも変更の恩恵を受けてほしいなら**AGPL**。**choosealicense.com**でインタラクティブに決定できます。",
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 3. How OSS projects work                                          */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="how-projects-work"
          title={{ en: "How OSS projects work", ja: "OSSプロジェクトの仕組み" }}
        >
          <Prose
            paragraphs={[
              {
                en: "An OSS project is a socio-technical system, not just a repository. The social layer — who has commit access, how decisions are made, how disputes are resolved — is as important as the code itself.",
                ja: "OSSプロジェクトは単なるリポジトリではなく社会技術的なシステムです。コミットアクセス権の所在、意思決定の方法、紛争の解決方法という社会的レイヤーはコード自体と同じくらい重要です。",
              },
              {
                en: "**Maintainers** are the people who have write access to the canonical repository. They review contributions, make release decisions, and bear the ultimate responsibility for the project's direction and health. In a small project this is often a single person; in large projects (Linux, Python, Rust) it is a structured team. **Contributors** are anyone who submits a bug report, documentation improvement, or code change — they vastly outnumber maintainers.",
                ja: "**メンテナー**は正規リポジトリへの書き込みアクセス権を持つ人々です。貢献のレビュー、リリース決定、プロジェクトの方向性と健全性に対する最終的な責任を負います。小規模プロジェクトでは1人のこともあり、大規模プロジェクト（Linux・Python・Rust）では組織化されたチームです。**コントリビューター**はバグ報告、ドキュメント改善、コード変更を提出する人々です——メンテナーよりはるかに多い。",
              },
              {
                en: "Work happens through **issues** (bug reports and feature proposals) and **pull requests** (proposed code changes). A pull request is a diff attached to a discussion thread: the author describes *why* the change is needed, reviewers ask questions, request modifications, or approve, and a maintainer merges it — or closes it with an explanation. Good projects enforce this process with automated checks (CI, linters, tests) that run on every pull request.",
                ja: "作業は**issue**（バグ報告・機能提案）と**プルリクエスト**（コード変更の提案）を通じて行われます。プルリクエストはディスカッションスレッドに添付されたdiffです：作者が変更が必要な*理由*を説明し、レビュアーが質問・修正要求・承認を行い、メンテナーがマージするか理由とともにクローズします。良いプロジェクトは、すべてのプルリクエストで実行される自動チェック（CI・リンター・テスト）でこのプロセスを強制します。",
              },
              {
                en: "**Governance** describes how decisions are made. The most common model in small-to-medium projects is **BDFL** (Benevolent Dictator For Life) — a single founder with final say. Python used this model under Guido van Rossum until 2018 when he stepped down and a steering council was elected. Larger ecosystems use **foundation governance**: the Rust Foundation, the Python Software Foundation, the Apache Software Foundation, and the Linux Foundation each provide legal, financial, and procedural scaffolding for their projects without owning the technical direction outright.",
                ja: "**ガバナンス**は意思決定の方法を記述します。小〜中規模プロジェクトで最も一般的なモデルは**BDFL**（慈悲深き終身独裁者）——最終決定権を持つ単一の創設者。Pythonは2018年にGuido van Rossumが退任して運営委員会が選出されるまでこのモデルを使っていました。大規模なエコシステムでは**財団ガバナンス**を使います：Rust財団・Python Software Foundation・Apache Software Foundation・Linux Foundationは、技術的方向性を完全に所有することなく、各プロジェクトに法的・財政的・手続き的な枠組みを提供します。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "The contribution flow from fork to merge.",
              ja: "フォークからマージまでのコントリビューションフロー。",
            }}
          >
            <FlowRow
              steps={[
                {
                  label: { en: "Fork", ja: "フォーク" },
                  sub: {
                    en: "copy repo to your account",
                    ja: "自分のアカウントにコピー",
                  },
                },
                {
                  label: { en: "Branch", ja: "ブランチ" },
                  sub: { en: "isolate your change", ja: "変更を分離" },
                },
                {
                  label: { en: "Commit", ja: "コミット" },
                  sub: { en: "implement & test", ja: "実装とテスト" },
                },
                {
                  label: { en: "Pull Request", ja: "プルリクエスト" },
                  sub: { en: "propose the change", ja: "変更を提案" },
                },
                {
                  label: { en: "Review", ja: "レビュー" },
                  sub: { en: "discussion & fixes", ja: "議論と修正" },
                },
                {
                  label: { en: "Merge", ja: "マージ" },
                  sub: { en: "maintainer approves", ja: "メンテナーが承認" },
                },
              ]}
            />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 4. Why it matters                                                 */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="why-it-matters"
          title={{ en: "Why open source matters", ja: "OSSが重要な理由" }}
        >
          <Prose
            paragraphs={[
              {
                en: "Nearly all modern software — commercial products included — is built on a foundation of OSS. The operating system kernel (Linux), the TLS stack (OpenSSL), the web runtimes (V8, SpiderMonkey), the cloud orchestrator (Kubernetes), the machine-learning framework (PyTorch) — virtually every layer of the modern software stack is open. A product that disavows OSS would have to reimplement decades of accumulated engineering from scratch.",
                ja: "現代のソフトウェアのほぼすべて——商用製品を含めて——はOSSの基盤の上に構築されています。OSカーネル（Linux）、TLSスタック（OpenSSL）、Webランタイム（V8・SpiderMonkey）、クラウドオーケストレーター（Kubernetes）、機械学習フレームワーク（PyTorch）——現代のソフトウェアスタックのほぼすべてのレイヤーがオープンです。OSSを拒否する製品は、何十年もかけて蓄積されたエンジニアリングをゼロから再実装しなければならないでしょう。",
              },
              {
                en: "This collective resource is sometimes called the **digital commons**: shared infrastructure that benefits everyone who builds on it, much as public roads and libraries benefit an economy. When OSS thrives, the compounding effect is enormous — each project builds on prior work, and improvements flow back to all users of the common foundation.",
                ja: "この集合的なリソースは**デジタルコモンズ**とも呼ばれます：それを基盤に構築するすべての人に恩恵をもたらす共有インフラであり、公道や図書館が経済に恩恵をもたらすのと同様です。OSSが繁栄すると、複利効果は絶大です——各プロジェクトが以前の作業の上に構築され、改善が共通基盤のすべてのユーザーに還元されます。",
              },
              {
                en: "The **package ecosystems** are the clearest evidence of this scale. **npm** (JavaScript/TypeScript) hosts over two million packages and serves hundreds of billions of downloads per month. **PyPI** (Python) contains over 500,000 projects. **crates.io** (Rust) has crossed 140,000 crates. These registries are the plumbing of the modern web and data science stack — and they are almost entirely community-maintained OSS.",
                ja: "**パッケージエコシステム**がこのスケールの最も明確な証拠です。**npm**（JavaScript/TypeScript）は200万以上のパッケージをホストし、毎月数千億ものダウンロードを提供します。**PyPI**（Python）は50万以上のプロジェクトを収録しています。**crates.io**（Rust）は14万以上のクレートを超えました。これらのレジストリは現代のWebとデータサイエンススタックの配管であり、ほぼすべてがコミュニティメンテナンスのOSSです。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 5. Sustainability & risk                                          */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="sustainability"
          title={{
            en: "Sustainability & supply-chain risk",
            ja: "持続可能性とサプライチェーンリスク",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "The digital commons has a structural weakness: most of the critical infrastructure is maintained by a very small number of people, often unpaid, in their spare time. A 2020 Harvard Business School study estimated that the top 1% of OSS contributors produce over 90% of the value. When one of those people burns out, changes jobs, or simply disappears, the software they maintained can go dark — or worse, fall into the hands of someone with bad intentions.",
                ja: "デジタルコモンズには構造的な弱点があります：重要なインフラのほとんどは、多くの場合無報酬で空き時間に作業する非常に少数の人々によってメンテナンスされています。2020年のハーバードビジネススクールの研究は、OSSコントリビューターの上位1%が価値の90%以上を生み出していると推定しました。そのような人々のひとりがバーンアウト、転職、または単に姿を消したとき、彼らがメンテナンスしていたソフトウェアは消えることがあります——あるいはさらに悪いことに、悪意を持つ人物の手に渡ることがあります。",
              },
              {
                en: "**Maintainer burnout** is the most common failure mode. Maintaining a popular library means answering issues at all hours, managing regressions from library updates you didn't make, and being blamed when anything breaks — all for free. The psychological toll is significant, and the list of prominent OSS authors who have walked away or dramatically scaled back is long.",
                ja: "**メンテナーのバーンアウト**は最も一般的な失敗モードです。人気のあるライブラリをメンテナンスするということは、あらゆる時間帯でissueに答え、自分では行っていないライブラリ更新による退行を管理し、何かが壊れたときに責められることを意味します——すべて無報酬で。心理的な負担は重く、立ち去ったり大幅に活動を縮小した著名なOSS作者のリストは長い。",
              },
              {
                en: "**Funding models** try to address this. GitHub Sponsors, Open Collective, and Tidelift allow companies and individuals to pay maintainers directly. Foundations (Linux Foundation's Core Infrastructure Initiative, funded after Heartbleed) provide grants and dedicated engineering time to critical projects. But uptake is uneven: a few popular projects are well-funded while the equally critical but less visible glue code goes unsupported.",
                ja: "**資金調達モデル**がこれに対処しようとしています。GitHub Sponsors・Open Collective・Tideliftは企業と個人がメンテナーに直接支払えます。財団（Heartbleedを受けて設立されたLinux FoundationのCore Infrastructure Initiative）は重要なプロジェクトに助成金と専任エンジニアリング時間を提供します。しかし普及は不均一です：いくつかの人気プロジェクトは十分に資金調達されている一方で、同様に重要でも目立たないグルーコードはサポートを受けられないまま。",
              },
              {
                en: "**Supply-chain attacks** exploit this fragility. An attacker who gains control of a widely-used package — by compromising a maintainer's credentials, submitting a malicious pull request, or publishing a typosquat (a package named to look like a popular one) — can inject malicious code into thousands of downstream projects in a single release. Because packages have transitive dependencies, the blast radius is large.",
                ja: "**サプライチェーン攻撃**はこの脆弱性を悪用します。メンテナーの認証情報を侵害したり、悪意のあるプルリクエストを提出したり、タイポスクワット（人気パッケージに似た名前のパッケージ）を公開したりして、広く使われているパッケージの制御を得た攻撃者は、単一のリリースで何千もの下流プロジェクトに悪意のあるコードを注入できます。パッケージには推移的依存関係があるため、爆発範囲は広い。",
              },
            ]}
          />

          <Callout
            tone="warn"
            title={{
              en: "Real-world supply-chain failures",
              ja: "実際のサプライチェーン障害事例",
            }}
            t={{
              en: "**log4shell (CVE-2021-44228):** A remote-code-execution vulnerability in Log4j 2, a Java logging library used in hundreds of thousands of products from enterprise servers to Minecraft. One unfixed library, ubiquitous across the industry, required an emergency global patching effort. **left-pad (2016):** A developer unpublished a 17-line npm package after a naming dispute; it was a transitive dependency of React and Babel, breaking builds worldwide in minutes. **event-stream (2018):** A malicious contributor gained publish access to a popular npm package and inserted code that targeted the wallets of a specific Bitcoin app. **xz-utils (CVE-2024-3094):** A sophisticated social-engineering attack over two years resulted in a backdoor being merged into a system-compression library present on most Linux distributions — caught only days before it would have shipped in major distros.",
              ja: "**log4shell（CVE-2021-44228）：** エンタープライズサーバーからMinecraftまで何十万もの製品で使用されているJavaロギングライブラリLog4j 2のリモートコード実行脆弱性。業界全体に遍在する未修正のライブラリ1つが、緊急のグローバルパッチ作業を要求しました。**left-pad（2016年）：** 開発者が命名紛争の後17行のnpmパッケージを非公開にしたところ、それがReactとBabelの推移的依存関係だったため、数分で世界中のビルドが壊れました。**event-stream（2018年）：** 悪意のあるコントリビューターが人気のnpmパッケージの公開アクセス権を得て、特定のBitcoinアプリのウォレットを標的にしたコードを挿入しました。**xz-utils（CVE-2024-3094）：** 2年間にわたる巧妙なソーシャルエンジニアリング攻撃により、ほとんどのLinuxディストリビューションに存在するシステム圧縮ライブラリにバックドアがマージされました——メジャーディストリビューションに出荷されるわずか数日前に発見されました。",
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 6. Contributing                                                   */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="contributing"
          title={{
            en: "Contributing to open source",
            ja: "オープンソースへの貢献",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "Contributing to OSS is one of the highest-leverage activities available to a software engineer: you build skills in a real codebase, make the tools you use better, and build a public track record. The path in is usually gradual: start by using a project, then report bugs accurately, then fix documentation typos, then tackle a labelled **good first issue** — a small, well-scoped task that maintainers have identified as suitable for new contributors.",
                ja: "OSSに貢献することはソフトウェアエンジニアが実施できる最もレバレッジの高い活動のひとつです：実際のコードベースでスキルを磨き、自分が使うツールを改善し、公開された実績を構築できます。参入の道は通常段階的です：プロジェクトを使い始め、正確にバグを報告し、ドキュメントのタイプミスを修正し、**good first issue**——メンテナーが新しいコントリビューターに適していると識別した小さくスコープが明確なタスク——に取り組みます。",
              },
              {
                en: "**Etiquette** matters enormously. Read the project's CONTRIBUTING.md before opening anything. Search existing issues and pull requests to avoid duplicates. When reporting a bug, provide a minimal reproducible example, the version you're using, the expected behaviour, and the actual behaviour. When submitting a patch, explain *why* the change is needed, not just *what* it does. Respect that maintainers are often volunteers with limited time — a kind, patient tone is not just polite, it is strategically effective.",
                ja: "**エチケット**は非常に重要です。何かを開く前にプロジェクトのCONTRIBUTING.mdを読んでください。重複を避けるために既存のissueとプルリクエストを検索してください。バグを報告する際は、最小限の再現例、使用しているバージョン、期待される動作、実際の動作を提供します。パッチを提出する際は、*何をするか*だけでなく*なぜ*変更が必要かを説明します。メンテナーは多くの場合、時間が限られたボランティアであることを尊重してください——親切で忍耐強いトーンは礼儀正しいだけでなく、戦略的に効果的です。",
              },
              {
                en: "Most projects have a **code of conduct** (the Contributor Covenant is by far the most common) that defines expected behaviour and establishes a reporting path for harassment or bad-faith behaviour. These documents are not performative — they reflect the deliberate choice to build an inclusive community, and violations are typically taken seriously by maintainers.",
                ja: "ほとんどのプロジェクトには**行動規範**（Contributor Covenantが圧倒的に一般的）があり、期待される行動を定義してハラスメントや悪意のある行動の報告経路を確立しています。これらのドキュメントはパフォーマティブなものではありません——包摂的なコミュニティを構築するという意図的な選択を反映しており、違反は通常メンテナーによって真剣に扱われます。",
              },
              {
                en: "The progression from **user → contributor → reviewer → maintainer** is a well-worn path. Each step deepens your understanding of the software and the community. Maintainership brings substantial responsibilities but also influence: you shape the direction of a tool that may run in millions of systems.",
                ja: "**ユーザー→コントリビューター→レビュアー→メンテナー**への進歩は確立された道です。各ステップはソフトウェアとコミュニティの理解を深めます。メンテナーシップは相当な責任をもたらしますが、影響力も伴います：何百万ものシステムで動作するかもしれないツールの方向性を形作れます。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 7. OSS in practice — nand2web's own stack                        */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="oss-in-practice"
          title={{ en: "OSS in practice", ja: "OSSの実践" }}
        >
          <Prose
            paragraphs={[
              {
                en: "This site — nand2web — is itself built entirely on OSS. **React** (MIT) is the UI component model. **TanStack Router** (MIT) handles type-safe client-side routing. **Tailwind CSS** (MIT) provides the utility-first styling system. **Vite** (MIT) is the dev server and bundler. **Biome** (MIT) handles linting, formatting, and import organisation. Every single build tool, runtime, and framework we depend on is open source. Without these projects — each the product of thousands of person-hours of volunteer and sponsored work — this site would not exist in its current form.",
                ja: "このサイト——nand2web——自体もすべてOSSで構築されています。**React**（MIT）はUIコンポーネントモデルです。**TanStack Router**（MIT）は型安全なクライアントサイドルーティングを処理します。**Tailwind CSS**（MIT）はユーティリティファーストのスタイリングシステムを提供します。**Vite**（MIT）はdevサーバーとバンドラーです。**Biome**（MIT）はリンティング・フォーマット・インポート整理を処理します。私たちが依存するすべてのビルドツール・ランタイム・フレームワークはオープンソースです。これらのプロジェクトなしに——それぞれが何千人時ものボランティアとスポンサー付きの作業の産物——このサイトは現在の形では存在しなかったでしょう。",
              },
              {
                en: "When you add a dependency to a project, you are inheriting its entire transitive graph of dependencies, their licences, their maintenance status, and their security posture. A useful checklist when evaluating a new dependency: (1) **Licence** — is it compatible with your project's licence and business model? (2) **Activity** — when was the last commit? Is there an active maintainer? (3) **Adoption** — is it widely used? A popular package is more likely to have had its bugs found. (4) **Security** — does it have open CVEs? Does the project have a security policy? (5) **Size** — does it pull in a large transitive dependency tree that adds risk surface? Tools like `npm audit` and GitHub's Dependabot help automate parts of this, but they are not substitutes for judgment.",
                ja: "プロジェクトに依存関係を追加するとき、その依存関係の推移的依存グラフ全体、ライセンス、メンテナンス状況、セキュリティ状態を引き継ぎます。新しい依存関係を評価する際の有用なチェックリスト：（1）**ライセンス**——プロジェクトのライセンスとビジネスモデルと互換性があるか？（2）**アクティビティ**——最後のコミットはいつか？アクティブなメンテナーがいるか？（3）**採用状況**——広く使われているか？人気のパッケージはバグが見つかっている可能性が高い。（4）**セキュリティ**——オープンなCVEがあるか？プロジェクトにセキュリティポリシーがあるか？（5）**サイズ**——リスク面を増加させる大きな推移的依存ツリーを引き込むか？`npm audit`やGitHubのDependabotなどのツールがこれを自動化する手助けをしますが、判断の代わりにはなりません。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "The nand2web OSS dependency stack — every layer is MIT-licensed.",
              ja: "nand2webのOSS依存スタック——すべてのレイヤーはMITライセンス。",
            }}
          >
            <OssStackDiagram />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Key terms                                                         */}
        {/* ---------------------------------------------------------------- */}
        <Section id="glossary" title={{ en: "Key terms", ja: "重要用語" }}>
          <KeyTerms
            terms={[
              {
                term: "Licence",
                def: {
                  en: "A legal document attached to software that grants (or restricts) the rights of recipients to use, modify, and redistribute it.",
                  ja: "受領者がソフトウェアを使用・改変・再配布する権利を付与（または制限）する、ソフトウェアに付属する法的文書。",
                },
              },
              {
                term: "Copyleft",
                def: {
                  en: "A licensing strategy that uses copyright law to require that derivative works be distributed under the same licence terms, keeping the code open.",
                  ja: "著作権法を利用して派生著作物を同じライセンス条件で配布することを要求し、コードをオープンに保つライセンス戦略。",
                },
              },
              {
                term: "Permissive",
                def: {
                  en: "A licence (MIT, Apache-2.0, BSD) that imposes minimal conditions — mainly attribution — and allows incorporation into proprietary products.",
                  ja: "最小限の条件——主に帰属表示——のみを課し、プロプライエタリ製品への組み込みを許可するライセンス（MIT・Apache-2.0・BSD）。",
                },
              },
              {
                term: "Maintainer",
                def: {
                  en: "A person with write access to the canonical repository who reviews contributions and makes release decisions.",
                  ja: "コントリビューションをレビューしリリース決定を行う、正規リポジトリへの書き込みアクセス権を持つ人物。",
                },
              },
              {
                term: "Fork",
                def: {
                  en: "A copy of a repository under a different owner. Used to propose changes (via pull request) or to take the project in a different direction.",
                  ja: "異なるオーナーの下にあるリポジトリのコピー。変更を提案したり（プルリクエスト経由）、プロジェクトを別の方向に進めるために使用します。",
                },
              },
              {
                term: "Pull request",
                def: {
                  en: "A proposed change (a diff) submitted to a repository for review and potential merging by a maintainer.",
                  ja: "メンテナーによるレビューと潜在的なマージのためにリポジトリに提出された変更の提案（diff）。",
                },
              },
              {
                term: "Supply chain",
                def: {
                  en: "The full graph of dependencies a software project relies on — including transitive dependencies — representing the inherited risk surface.",
                  ja: "ソフトウェアプロジェクトが依存するすべての依存関係のグラフ（推移的依存関係を含む）——継承されたリスク面を表す。",
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
              title: "Open Source Initiative — Approved Licences",
              href: "https://opensource.org/licenses",
              note: {
                en: "The canonical list of OSI-approved open-source licences, with the full text of each.",
                ja: "OSI承認のオープンソースライセンスの正規リスト。各ライセンスの全文を掲載。",
              },
            },
            {
              title: "choosealicense.com",
              href: "https://choosealicense.com/",
              note: {
                en: "GitHub's interactive licence chooser — walks through the key questions and recommends a licence for your project.",
                ja: "GitHubのインタラクティブなライセンス選択ツール——重要な質問を案内し、プロジェクトに適したライセンスを推奨します。",
              },
            },
            {
              title: "GitHub Open Source Guides",
              href: "https://opensource.guide/",
              note: {
                en: "Practical guides covering how to start a project, how to contribute, how to build a community, and how to get funded.",
                ja: "プロジェクトの開始・コントリビューション・コミュニティ構築・資金調達の実践的ガイド。",
              },
            },
            {
              title: "Producing Open Source Software — Karl Fogel",
              href: "https://producingoss.com/",
              note: {
                en: "A free, comprehensive book on running a successful OSS project: governance, community, communication, and infrastructure.",
                ja: "成功するOSSプロジェクトの運営に関する無料の包括的な書籍：ガバナンス・コミュニティ・コミュニケーション・インフラ。",
              },
            },
            {
              title: "Wikipedia — Open-source software",
              href: "https://en.wikipedia.org/wiki/Open-source_software",
              note: {
                en: "Broad overview of OSS history, philosophy, licences, and major projects — good starting point for further reading.",
                ja: "OSSの歴史・哲学・ライセンス・主要プロジェクトの幅広い概説——さらなる読書の出発点として最適。",
              },
            },
            {
              title:
                "Roads and Bridges: The Unseen Labor Behind Our Digital Infrastructure — Nadia Eghbal",
              href: "https://www.fordfoundation.org/work/learning/research-reports/roads-and-bridges-the-unseen-labor-behind-our-digital-infrastructure/",
              note: {
                en: "Ford Foundation report on the sustainability problem: why critical OSS is underfunded and what to do about it.",
                ja: "持続可能性の問題に関するフォード財団レポート：重要なOSSが過少資金調達される理由と対策。",
              },
            },
            {
              title: "CISA — Software Supply Chain Security Guidance",
              href: "https://www.cisa.gov/resources-tools/resources/software-supply-chain-security-guidance",
              note: {
                en: "US CISA guidance on securing the software supply chain, including open-source dependency management.",
                ja: "オープンソース依存関係管理を含むソフトウェアサプライチェーン保護に関する米CISAガイダンス。",
              },
            },
          ]}
        />
      </Article>
    </DocsShell>
  );
}

// ---------------------------------------------------------------------------
// OSS stack diagram
// ---------------------------------------------------------------------------

function OssStackDiagram() {
  const sid = useSvgId();
  return (
    <Diagram
      label={{
        en: "nand2web OSS stack: React, TanStack Router, Tailwind CSS, Vite, Biome — all MIT licensed",
        ja: "nand2webのOSSスタック：React・TanStack Router・Tailwind CSS・Vite・Biome——すべてMITライセンス",
      }}
      viewBox="0 0 560 260"
      maxHeight={260}
    >
      <rect width="560" height="260" fill={C.panel} rx="8" />

      {/* Layer: Browser / User */}
      <rect
        x="20"
        y="16"
        width="520"
        height="38"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="280"
        y="33"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="700"
      >
        Browser / User
      </text>
      <text x="280" y="48" textAnchor="middle" fill={C.faint} fontSize="10">
        nand2web app — deployed to Cloudflare Pages
      </text>

      {/* Arrow down */}
      <line
        x1="280"
        y1="54"
        x2="280"
        y2="68"
        stroke={C.line}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arrd")})`}
      />

      {/* Layer: React + TanStack Router */}
      <rect
        x="20"
        y="70"
        width="250"
        height="44"
        rx="6"
        fill={C.muted}
        stroke={C.high}
        strokeWidth="1.5"
      />
      <text
        x="145"
        y="88"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="700"
      >
        React (MIT)
      </text>
      <text x="145" y="104" textAnchor="middle" fill={C.faint} fontSize="10">
        UI component model
      </text>

      <rect
        x="290"
        y="70"
        width="250"
        height="44"
        rx="6"
        fill={C.muted}
        stroke={C.high}
        strokeWidth="1.5"
      />
      <text
        x="415"
        y="88"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="700"
      >
        TanStack Router (MIT)
      </text>
      <text x="415" y="104" textAnchor="middle" fill={C.faint} fontSize="10">
        type-safe routing
      </text>

      {/* Arrow down */}
      <line
        x1="280"
        y1="114"
        x2="280"
        y2="128"
        stroke={C.line}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arrd")})`}
      />

      {/* Layer: Tailwind + Biome */}
      <rect
        x="20"
        y="130"
        width="250"
        height="44"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="145"
        y="148"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="700"
      >
        Tailwind CSS (MIT)
      </text>
      <text x="145" y="164" textAnchor="middle" fill={C.faint} fontSize="10">
        utility-first styling
      </text>

      <rect
        x="290"
        y="130"
        width="250"
        height="44"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="415"
        y="148"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="700"
      >
        Biome (MIT)
      </text>
      <text x="415" y="164" textAnchor="middle" fill={C.faint} fontSize="10">
        lint · format · imports
      </text>

      {/* Arrow down */}
      <line
        x1="280"
        y1="174"
        x2="280"
        y2="188"
        stroke={C.line}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arrd")})`}
      />

      {/* Layer: Vite */}
      <rect
        x="20"
        y="190"
        width="520"
        height="44"
        rx="6"
        fill={C.muted}
        stroke={C.warn}
        strokeWidth="1.5"
      />
      <text
        x="280"
        y="208"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="700"
      >
        Vite (MIT)
      </text>
      <text x="280" y="224" textAnchor="middle" fill={C.faint} fontSize="10">
        dev server · HMR · production bundler
      </text>

      {/* defs */}
      <defs>
        <marker
          id={sid("arrd")}
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="5"
          orient="auto"
        >
          <path d="M0,0 L3,6 L6,0 z" fill={C.line} />
        </marker>
      </defs>
    </Diagram>
  );
}
