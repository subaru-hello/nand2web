// ---------------------------------------------------------------------------
// Computer Science: The Whole Picture — bilingual history data module
// 10 stages tracing the arc of CS from pre-mechanical algorithms to LLMs.
// Each stage carries a historical milestone + the durable mental model, and
// links the corresponding nand2web module. Used by the /docs/cs-history page.
// ---------------------------------------------------------------------------

export interface LocalizedText {
  readonly en: string;
  readonly ja: string;
}

export interface CsHistoryStage {
  readonly id: string;
  readonly title: LocalizedText;
  /** One-sentence historical milestone (who, when, what). */
  readonly milestone: LocalizedText;
  /** The durable mental model this stage teaches. */
  readonly mentalModel: LocalizedText;
  /** Richer explanatory paragraph (2–4 sentences). */
  readonly detail: LocalizedText;
  /** Optional short notation / illustrative example. */
  readonly example?: string;
}

export const CS_HISTORY_STAGES: readonly CsHistoryStage[] = [
  // 1 -----------------------------------------------------------------------
  {
    id: "before-machines",
    title: {
      en: "1. Before machines — computation as a procedure",
      ja: "1. 機械以前——手続きとしての計算",
    },
    milestone: {
      en: "The word *algorithm* descends from al-Khwārizmī, a 9th-century Persian mathematician whose treatises on Hindu-Arabic numerals reached Europe in Latin translation; for centuries afterwards a *computer* was not a device but a job title — a person, often a woman, employed to carry out calculations by hand.",
      ja: "*アルゴリズム*という語は、9世紀ペルシアの数学者アル＝フワーリズミーに由来する。彼のインド・アラビア数字に関する著作はラテン語訳を通じてヨーロッパに伝わった。その後何世紀ものあいだ*コンピュータ（computer）*とは装置ではなく職業名——手計算を担う人、しばしば女性——を指す言葉だった。",
    },
    mentalModel: {
      en: "Computation is older than any machine. Long before electronics, people understood that a hard problem could be reduced to a **procedure**: a finite, unambiguous sequence of steps that anyone (or anything) following the rules mechanically would carry out identically. This idea — that thinking can be decomposed into repeatable mechanical steps — is the seed of the entire field.",
      ja: "計算はいかなる機械よりも古い。電子回路のはるか以前から、人々は難しい問題を**手続き**——有限で曖昧さのない一連の手順で、規則に従って機械的にたどれば誰（何）がやっても同じ結果になるもの——に還元できると理解していた。思考が反復可能な機械的ステップに分解できるというこの発想こそ、この分野全体の種である。",
    },
    detail: {
      en: "For most of history, calculation meant a trained human applying a fixed recipe: long division, astronomical tables, the trajectories for artillery. What matters is that the *procedure* was separable from the *person* running it — the same steps produced the same answer regardless of who executed them. Charles Babbage's unbuilt Analytical Engine (designed around 1837) and Ada Lovelace's notes on it (1843) took the next conceptual leap: a machine could follow such procedures, and those procedures could themselves be written down as something we would now call a program. Computer science begins here, as the study of procedures — not of any particular hardware.",
      ja: "歴史の大半において、計算とは訓練された人間が固定のレシピを適用することだった——筆算の割り算、天文表、大砲の弾道計算。重要なのは、*手続き*がそれを実行する*人*から切り離せたという点だ——誰が実行しても同じ手順は同じ答えを生んだ。チャールズ・バベッジが構想した（未完成の）解析機関（1837年頃の設計）と、それに付したエイダ・ラブレスの注釈（1843年）は、次の概念的飛躍をもたらした：機械がこうした手続きを実行でき、その手続き自体を、今日でいうプログラムとして書き下せる、という発想だ。コンピュータサイエンスはここから——特定のハードウェアではなく、手続きそのものの学問として——始まる。",
    },
  },

  // 2 -----------------------------------------------------------------------
  {
    id: "theory-first",
    title: {
      en: "2. The theory came first — what is computable",
      ja: "2. 理論が先に来た——何が計算可能か",
    },
    milestone: {
      en: "In 1928 David Hilbert posed the *Entscheidungsproblem*: is there a mechanical procedure that decides the truth of any mathematical statement? In 1936 Alan Turing (with his abstract machine) and Alonzo Church (with the lambda calculus) independently answered *no* — and in doing so gave the first rigorous definitions of what *computation* even means.",
      ja: "1928年、ダフィット・ヒルベルトは*決定問題（Entscheidungsproblem）*を提起した：任意の数学的命題の真偽を判定する機械的手続きは存在するか？ 1936年、アラン・チューリング（抽象機械により）とアロンゾ・チャーチ（ラムダ計算により）は独立に*否*と答え、その過程で*計算*そのものが何を意味するかについて初めて厳密な定義を与えた。",
    },
    mentalModel: {
      en: "The limits of computing were mapped out **before the first electronic computer was built**. A Turing machine is not hardware — it is a mathematical model of *any* step-by-step procedure. The **Church–Turing thesis** holds that everything intuitively computable can be computed by such a machine, which means every real computer, from a 1940s relay bank to a modern GPU, is fundamentally equivalent in *what* it can compute; they differ only in speed and convenience.",
      ja: "計算の限界は、**最初の電子計算機が作られる前に**描き出されていた。チューリング機械はハードウェアではなく——*あらゆる*逐次手続きの数学的モデルだ。**チャーチ・チューリングのテーゼ**は、直観的に計算可能なものはすべてこの機械で計算できると主張する。つまり1940年代のリレー群から現代のGPUまで、あらゆる実在の計算機は*何を*計算できるかにおいて本質的に等価であり、違うのは速度と利便性だけなのだ。",
    },
    detail: {
      en: "Turing's genius was to strip computation down to its barest essentials: an infinite tape of symbols, a head that reads and writes one cell at a time, and a finite table of rules. With this austere model he proved that some problems — most famously the *halting problem* (deciding whether an arbitrary program eventually stops) — can never be solved by any procedure at all. This is a permanent boundary, not a temporary engineering limitation. Every layer built afterward — logic gates, CPUs, compilers, neural networks — lives inside the space these 1936 results defined.",
      ja: "チューリングの天才は、計算をその最も骨組みだけに削ぎ落とした点にある：記号の無限テープ、一度に1マスを読み書きするヘッド、そして有限の規則表。この簡素なモデルで彼は、ある種の問題——最も有名なのは*停止性問題*（任意のプログラムが最終的に停止するかを判定する問題）——がいかなる手続きによっても決して解けないことを証明した。これは一時的な工学的限界ではなく、恒久的な境界だ。以後に積み上げられるあらゆる層——論理ゲート、CPU、コンパイラ、ニューラルネットワーク——は、この1936年の結果が定めた空間の内側に存在する。",
    },
  },

  // 3 -----------------------------------------------------------------------
  {
    id: "logic-from-switches",
    title: {
      en: "3. Logic from switches — Boolean algebra meets circuits",
      ja: "3. スイッチから論理へ——ブール代数と回路の出会い",
    },
    milestone: {
      en: "George Boole published *The Mathematical Analysis of Logic* in 1847, reducing reasoning to an algebra of true/false values. Nearly a century later, in his 1937 MIT master's thesis, Claude Shannon showed that this same Boolean algebra exactly describes networks of electrical relays — that a switching circuit *is* a piece of logic.",
      ja: "ジョージ・ブールは1847年に『論理の数学的分析』を発表し、推論を真/偽の値の代数へと還元した。それから約1世紀後の1937年、クロード・シャノンはMITの修士論文で、まさにこのブール代数が電気リレーのネットワークを正確に記述すること——スイッチ回路が論理そのものであること——を示した。",
    },
    mentalModel: {
      en: "**Hardware is frozen logic.** Shannon's insight is the hinge between mathematics and machines: a circuit that turns switches on and off is not merely *like* a logical formula, it *is* one. Once you can build AND, OR, and NOT from switches, you can build any Boolean function — and it turns out a single gate type, **NAND**, suffices to build them all. Everything a computer does at the bottom is a vast composition of these tiny true/false decisions.",
      ja: "**ハードウェアとは凍結された論理である。** シャノンの洞察は数学と機械をつなぐ蝶番だ：スイッチをオン・オフする回路は、単に論理式に*似ている*のではなく、それ*そのもの*なのだ。スイッチからAND・OR・NOTを作れれば、任意のブール関数を作れる——しかも**NAND**という単一のゲート種だけで、そのすべてを構成できることがわかっている。コンピュータが最下層で行うことはすべて、この微小な真/偽の判断の膨大な合成である。",
    },
    detail: {
      en: "A relay, a vacuum tube, and a transistor are physically very different, but Shannon's framework treats them identically: each is a switch that is either open or closed, and any arrangement of them computes some Boolean function of its inputs. This is why the same logical design survives every change in the underlying technology. The [logic-gate simulator](/logic) on this site lets you build every gate from NAND and watch signals propagate through adders and registers — the concrete realisation of Shannon's 1937 argument.",
      ja: "リレー、真空管、トランジスタは物理的には大きく異なるが、シャノンの枠組みはそれらを同一に扱う：どれも開か閉のいずれかであるスイッチであり、それらのどんな配置も入力の何らかのブール関数を計算する。だからこそ、下層の技術がどれだけ変わっても同じ論理設計が生き残る。本サイトの[論理ゲートシミュレータ](/logic)では、NANDからあらゆるゲートを組み立て、加算器やレジスタを信号が伝わる様子を観察できる——1937年のシャノンの議論の具体的な実現だ。",
    },
    example: "NAND(a, b) = NOT(a AND b)   →   NOT, AND, OR, XOR all follow",
  },

  // 4 -----------------------------------------------------------------------
  {
    id: "stored-program",
    title: {
      en: "4. The stored-program computer — program as data",
      ja: "4. プログラム内蔵方式コンピュータ——データとしてのプログラム",
    },
    milestone: {
      en: "ENIAC (1945) was electronic but was 'programmed' by physically rewiring plugboards, a process that could take days. The 1945 *First Draft of a Report on the EDVAC*, associated with John von Neumann, described an architecture in which instructions live in the same memory as data — the design almost every computer still follows today.",
      ja: "ENIAC（1945年）は電子式だったが、プラグボードを物理的に配線し直すことで「プログラム」され、その作業には数日を要することもあった。1945年の『EDVACに関する報告書の第一草稿』——ジョン・フォン・ノイマンと結び付けられる文書——は、命令をデータと同じメモリに置くアーキテクチャを記述した。今日ほぼすべてのコンピュータが依然として従う設計だ。",
    },
    mentalModel: {
      en: "**Programs are just data.** The decisive step was to store instructions in the same read/write memory as the numbers they operate on. This makes a computer *general-purpose*: to change what the machine does, you change memory, not wiring. It also means a program can read, modify, and generate other programs — the foundation on which compilers, operating systems, and every software tool later stand.",
      ja: "**プログラムはただのデータである。** 決定的な一歩は、命令を、それが操作する数値と同じ読み書き可能なメモリに格納したことだ。これによりコンピュータは*汎用*になる：機械の振る舞いを変えるには配線ではなくメモリを変えればよい。さらに、プログラムが他のプログラムを読み、書き換え、生成できることを意味する——後にコンパイラ、オペレーティングシステム、あらゆるソフトウェアツールが立脚する基盤だ。",
    },
    detail: {
      en: "A stored-program machine runs a simple, relentless loop: **fetch** the next instruction from memory, **decode** what it means, **execute** it, then advance to the next. Because instructions and data share one address space, the same hardware that adds numbers can also treat a program as a number to be transformed. You can watch this fetch–decode–execute cycle animate instruction by instruction in the [CPU simulator](/cpu), where a tiny stored program drives a 4-bit datapath.",
      ja: "プログラム内蔵方式の機械は、単純で執拗なループを回す：メモリから次の命令を**フェッチ**し、その意味を**デコード**し、それを**実行**し、次へ進む。命令とデータが1つのアドレス空間を共有するため、数を加算するのと同じハードウェアが、プログラムを変換対象の数として扱うこともできる。このフェッチ・デコード・実行サイクルは、[CPUシミュレータ](/cpu)で命令ごとにアニメーションとして観察できる。そこでは小さな内蔵プログラムが4ビットのデータパスを駆動する。",
    },
    example: "loop:  fetch → decode → execute → advance PC → loop",
  },

  // 5 -----------------------------------------------------------------------
  {
    id: "languages-compilers",
    title: {
      en: "5. High-level languages & compilers — the abstraction ladder",
      ja: "5. 高水準言語とコンパイラ——抽象化のはしご",
    },
    milestone: {
      en: "FORTRAN (1957, led by John Backus at IBM) proved that a compiler could translate human-readable formulas into machine code fast enough to compete with hand-written assembly; Lisp (1958, John McCarthy) introduced a language built on the lambda calculus, with recursion and programs represented as data.",
      ja: "FORTRAN（1957年、IBMのジョン・バッカス主導）は、コンパイラが人間に読める数式を機械語へ翻訳でき、しかも手書きのアセンブリと張り合えるほど高速であることを証明した。Lisp（1958年、ジョン・マッカーシー）はラムダ計算の上に構築された言語を導入し、再帰と、データとして表現されるプログラムをもたらした。",
    },
    mentalModel: {
      en: "**Every language is a layer of abstraction over the one below.** Programmers stopped writing raw machine code, then stopped writing assembly mnemonics, then wrote expressions and functions — each step trading a little control for a great deal of expressive power. A compiler is the machine that makes this trade safe: it mechanically translates the higher, human-friendly notation down into the lower, machine-friendly one, so the abstraction costs (almost) nothing at run time.",
      ja: "**あらゆる言語は、その下の層に対する抽象化の一枚である。** プログラマは生の機械語を書くのをやめ、次にアセンブリの記号を書くのをやめ、式や関数を書くようになった——各段階で、わずかな制御と引き換えに莫大な表現力を得た。コンパイラはこの取引を安全にする機械だ：より高水準で人間に優しい記法を、より低水準で機械に優しい記法へと機械的に翻訳し、抽象化の代償が実行時にはほとんどゼロになるようにする。",
    },
    detail: {
      en: "A compiler is itself a program that runs in stages — lexing characters into tokens, parsing tokens into a tree, checking types, and generating code — each stage a small, well-understood transformation. This is abstraction applied to abstraction: the tool that builds the ladder is built out of the same disciplined steps. The [compilers reference](/docs/compiler) walks the full pipeline, and the [compiler simulator](/lang) lets you type a small program and watch it flow through lexer, parser, and evaluator.",
      ja: "コンパイラ自身も段階的に動くプログラムだ——文字をトークンへ字句解析し、トークンを木構造へ構文解析し、型を検査し、コードを生成する——各段階は小さく、よく理解された変換である。これは抽象化に対する抽象化の適用だ：はしごを組み立てる道具そのものが、同じ規律あるステップから作られている。[コンパイラのリファレンス](/docs/compiler)は全パイプラインをたどり、[コンパイラシミュレータ](/lang)では小さなプログラムを入力して、字句解析・構文解析・評価を流れていく様子を観察できる。",
    },
  },

  // 6 -----------------------------------------------------------------------
  {
    id: "operating-systems",
    title: {
      en: "6. Operating systems & time-sharing — the computer as shared resource",
      ja: "6. OSとタイムシェアリング——共有資源としてのコンピュータ",
    },
    milestone: {
      en: "Early machines ran one job at a time in batches. MIT's CTSS (around 1961) and the ambitious Multics project pioneered *time-sharing* — many users at terminals appearing to use one machine at once — and UNIX (Ken Thompson & Dennis Ritchie, 1969) distilled those ideas into a small, portable system whose descendants run most of the world's servers and phones.",
      ja: "初期の機械は一度に1つのジョブをバッチ処理で実行した。MITのCTSS（1961年頃）と野心的なMulticsプロジェクトは*タイムシェアリング*——端末に向かう多数のユーザーが1台の機械を同時に使っているように見せる方式——を切り開いた。そしてUNIX（ケン・トンプソンとデニス・リッチー、1969年）はそれらの発想を小さく移植性の高いシステムへと凝縮し、その子孫が世界のサーバーとスマートフォンの大半を動かしている。",
    },
    mentalModel: {
      en: "**An operating system is a resource manager and an illusionist.** It multiplexes one physical machine among many programs, giving each the illusion of a private CPU (via scheduling) and a private, large memory (via virtual memory), while protecting them from one another. The recurring idea is *virtualisation*: presenting a clean, simple abstraction (a process, a file) on top of messy, shared, finite hardware.",
      ja: "**オペレーティングシステムは資源管理者であり、幻術師でもある。** 1台の物理マシンを多数のプログラムで多重化し、それぞれに専用CPUの幻想（スケジューリングによる）と専用の大きなメモリの幻想（仮想メモリによる）を与えつつ、互いから保護する。繰り返し現れる発想は*仮想化*だ：雑然として共有され有限なハードウェアの上に、清潔で単純な抽象（プロセス、ファイル）を提示する。",
    },
    detail: {
      en: "Scheduling decides which process runs next on a scarce CPU; virtual memory gives each process its own address space and pages it to and from disk; the file system turns spinning platters or flash cells into named, hierarchical storage. The kernel/user boundary enforces protection so a bug in one program cannot corrupt another or the system itself. The [operating systems reference](/docs/os) covers these mechanisms, and the [OS simulator](/os) lets you race scheduling policies and walk a page table.",
      ja: "スケジューリングは、乏しいCPU上で次にどのプロセスを走らせるかを決める。仮想メモリは各プロセスに固有のアドレス空間を与え、ディスクとの間でページングする。ファイルシステムは回転するプラッタやフラッシュセルを、名前付きの階層的ストレージへと変える。カーネルとユーザーの境界は保護を強制し、あるプログラムのバグが他のプログラムやシステム自体を破壊できないようにする。[OSのリファレンス](/docs/os)はこれらの仕組みを扱い、[OSシミュレータ](/os)ではスケジューリング方式を競わせ、ページテーブルをたどれる。",
    },
  },

  // 7 -----------------------------------------------------------------------
  {
    id: "algorithms-complexity",
    title: {
      en: "7. Algorithms & complexity — efficiency becomes a science",
      ja: "7. アルゴリズムと計算量——効率が科学になる",
    },
    milestone: {
      en: "Donald Knuth published the first volume of *The Art of Computer Programming* in 1968, treating algorithms as objects of rigorous mathematical study. Big-O notation gave a language for asymptotic cost, and in 1971 Stephen Cook (with Leonid Levin independently) framed **P vs NP** — whether every problem whose answer is easy to *check* is also easy to *solve* — which remains the field's most famous open question.",
      ja: "ドナルド・クヌースは1968年に『The Art of Computer Programming』第1巻を刊行し、アルゴリズムを厳密な数学的研究の対象として扱った。O記法は漸近的コストを語る言語を与え、1971年にはスティーブン・クック（レオニード・レビンが独立に）が**P対NP**——答えを*検証*しやすい問題はすべて*解く*のも容易か——を定式化した。これは今なおこの分野で最も有名な未解決問題である。",
    },
    mentalModel: {
      en: "**Efficiency is about how cost grows, not how fast the machine is.** Big-O captures the *shape* of an algorithm's cost as the input grows: an O(n log n) sort will eventually beat an O(n²) sort on large inputs no matter how fast the slower one's hardware. Complexity theory then classifies problems by inherent difficulty — some are tractable, some (the NP-hard ones) appear to require exponential effort — a hierarchy that is a property of the problem itself, independent of any computer.",
      ja: "**効率とは、機械の速さではなく、コストがどう増えるかの話である。** O記法はアルゴリズムのコストが入力の増加につれてどんな*形*で増えるかを捉える：O(n log n)のソートは、遅い側のハードウェアがどれほど速くても、大きな入力では最終的にO(n²)のソートに勝つ。計算量理論はさらに問題を本質的な難しさで分類する——扱いやすいものもあれば、NP困難なもののように指数的な労力を要すると見られるものもある——これはいかなるコンピュータとも独立した、問題そのものの性質としての階層だ。",
    },
    detail: {
      en: "The same algorithmic ideas recur everywhere: sorting and searching underpin databases, graph search underpins routing and dependency resolution, and hashing underpins fast lookup. This site makes two of them concrete — the [pathfinding visualiser](/pathfinding) races BFS, Dijkstra, and A* across a grid you draw, and the [hash-table visualiser](/hashtable) shows collisions, load factor, and resizing as they happen. Seeing an algorithm's cost play out beats memorising its Big-O.",
      ja: "同じアルゴリズム的発想はいたるところで再登場する：ソートと探索はデータベースを支え、グラフ探索はルーティングや依存関係の解決を支え、ハッシュ化は高速な検索を支える。本サイトはそのうち2つを具体化する——[経路探索ビジュアライザ](/pathfinding)は、あなたが描いたグリッド上でBFS・ダイクストラ・A*を競わせ、[ハッシュテーブルビジュアライザ](/hashtable)は衝突・負荷率・リサイズが起きる様子を見せる。アルゴリズムのコストが展開されるのを見るほうが、そのO記法を暗記するより優れている。",
    },
    example: "O(n²)  vs  O(n log n):  at n = 1,000,000 the gap is ~50,000×",
  },

  // 8 -----------------------------------------------------------------------
  {
    id: "personal-computing",
    title: {
      en: "8. Personal computing & the GUI — a computer for one person",
      ja: "8. パーソナルコンピューティングとGUI——一人のためのコンピュータ",
    },
    milestone: {
      en: "The Xerox Alto (1973) was the first computer designed around a graphical user interface — a bitmapped screen, windows, icons, and a mouse. Those ideas, refined at Xerox PARC, reached the mass market through the Apple Macintosh (1984) and later Windows, turning the computer from an institutional instrument into a personal one.",
      ja: "ゼロックス・アルト（1973年）は、グラフィカルユーザーインターフェース——ビットマップ画面、ウィンドウ、アイコン、マウス——を中心に設計された最初のコンピュータだった。ゼロックスPARCで磨かれたこれらの発想は、Apple Macintosh（1984年）、そして後のWindowsを通じて大衆市場に届き、コンピュータを組織の道具から個人の道具へと変えた。",
    },
    mentalModel: {
      en: "**The interface is where computing meets human intent.** The graphical desktop is one long metaphor — the screen borrows the language of a physical desk with documents and folders — but a metaphor is only the entry point; underneath, every click still resolves to procedures, memory, and the same logic as before. The lasting lesson is that the *usability* of a system is a first-class engineering concern, not an afterthought bolted onto the 'real' computing.",
      ja: "**インターフェースとは、計算が人間の意図と出会う場所である。** グラフィカルなデスクトップは一つの長い比喩だ——画面は書類やフォルダのある物理的な机の語彙を借りている——だが比喩は入り口にすぎない。その下では、あらゆるクリックは依然として手続き、メモリ、そして以前と同じ論理へと解決される。残る教訓は、システムの*使いやすさ*が第一級の工学的関心事であり、「本物の」計算に後から取り付ける付け足しではない、ということだ。",
    },
    detail: {
      en: "Making a machine personal required advances all the way down the stack: cheaper microprocessors, interactive operating systems, and event-driven programming where the software waits for and responds to the user rather than running a fixed batch. The desktop metaphor succeeded because it let people transfer intuitions from the physical world, lowering the cost of learning. That principle — meet users where they are, then hand them the real model — echoes through interface design ever since.",
      ja: "機械を個人向けにするには、スタックの下まで一貫した進歩が必要だった：より安価なマイクロプロセッサ、対話的なオペレーティングシステム、そして固定のバッチを走らせるのではなくユーザーを待って応答するイベント駆動プログラミングだ。デスクトップの比喩が成功したのは、人々が物理世界の直観を移し替えられるようにし、学習コストを下げたからだ。その原則——ユーザーの現在地に合わせ、それから本当のモデルを手渡す——は、以後のインターフェース設計にこだましている。",
    },
  },

  // 9 -----------------------------------------------------------------------
  {
    id: "network-and-web",
    title: {
      en: "9. The network & the Web — computers that talk",
      ja: "9. ネットワークとWeb——語り合うコンピュータ",
    },
    milestone: {
      en: "ARPANET sent its first message in 1969; TCP/IP (Cerf & Kahn, 1974) became its common language and the ARPANET switched to it on 1 January 1983; and in 1989–1991 Tim Berners-Lee at CERN built the World Wide Web — URLs, HTTP, and HTML — on top of that internet.",
      ja: "ARPANETは1969年に最初のメッセージを送った。TCP/IP（サーフとカーン、1974年）はその共通言語となり、ARPANETは1983年1月1日にそれへ切り替えた。そして1989〜1991年、CERNのティム・バーナーズ＝リーは、そのインターネットの上にWorld Wide Web——URL・HTTP・HTML——を築いた。",
    },
    mentalModel: {
      en: "**A network turns many computers into one system.** The internet's core discipline is *layering*: a simple, best-effort core that just moves packets, with reliability, naming, and applications added at the edges. Because no central authority is in charge, the whole thing scales through local decisions that compose into global behaviour — the same emergent-from-local pattern seen in routing, DNS, and the Web's open publishing model.",
      ja: "**ネットワークは多数のコンピュータを一つのシステムに変える。** インターネットの中核をなす規律は*レイヤリング*だ：パケットを運ぶだけの単純でベストエフォートなコアがあり、信頼性・名前付け・アプリケーションはエッジで付け加えられる。中央の管理者が存在しないため、全体はローカルな決定がグローバルな振る舞いへと合成されることでスケールする——ルーティング、DNS、そしてWebのオープンな公開モデルに見られる、ローカルから創発する同じパターンだ。",
    },
    detail: {
      en: "This arc is deep enough to deserve its own walkthrough. The [networking reference](/docs/network) traces the full history from the telegraph through packet switching, IP, TCP, DNS, and TLS, each with its own mental model, and the [web reference](/docs/web) covers HTTP, browsers, and modern web architecture built on top. Here it is enough to note where the network sits in the stack: above the operating system, below the applications, and connecting every machine into one global computer.",
      ja: "この流れは、それ自体で一つのウォークスルーに値するほど深い。[ネットワークのリファレンス](/docs/network)は、電信からパケット交換、IP、TCP、DNS、TLSまでの全史を、それぞれのメンタルモデルとともにたどり、[Webのリファレンス](/docs/web)はその上に築かれたHTTP、ブラウザ、現代のWebアーキテクチャを扱う。ここでは、ネットワークがスタックのどこに位置するかを押さえれば十分だ：オペレーティングシステムの上、アプリケーションの下、そしてあらゆる機械を一つのグローバルなコンピュータへとつなぐ場所である。",
    },
  },

  // 10 ----------------------------------------------------------------------
  {
    id: "learning-machines",
    title: {
      en: "10. Learning machines — from hand-written rules to LLMs",
      ja: "10. 学習する機械——手書きの規則からLLMへ",
    },
    milestone: {
      en: "Early AI (from the 1956 Dartmouth workshop onward) tried to encode intelligence as explicit, hand-written rules. That approach hit its limits; the field shifted to *statistical learning* — inferring rules from data — and after the 2017 Transformer architecture, large language models trained on vast text corpora became the dominant paradigm.",
      ja: "初期のAI（1956年のダートマス会議以降）は、知能を明示的で手書きの規則として符号化しようとした。その手法は限界に突き当たり、分野は*統計的学習*——データから規則を推論する——へと移った。そして2017年のTransformerアーキテクチャ以降、膨大なテキストコーパスで訓練された大規模言語モデルが支配的なパラダイムとなった。",
    },
    mentalModel: {
      en: "**The program is now learned, not written.** Instead of a human specifying every rule, a model adjusts millions or billions of numeric parameters to fit data, discovering the procedure implicitly. What changed was not the theory — these models still run on ordinary stored-program hardware within the same computability limits — but the *drivers*: abundant **compute** and abundant **data** made learning at scale practical. It is the newest layer, sitting on top of everything below.",
      ja: "**いまやプログラムは書かれるのではなく、学習される。** 人間がすべての規則を指定する代わりに、モデルは数百万から数十億の数値パラメータをデータに合うよう調整し、手続きを暗黙のうちに発見する。変わったのは理論ではない——これらのモデルは依然として通常のプログラム内蔵方式のハードウェア上で、同じ計算可能性の限界の内側で動く——変わったのは*駆動要因*だ：潤沢な**計算資源**と潤沢な**データ**が、大規模な学習を実用的にした。それは最も新しい層であり、下のすべての上に載っている。",
    },
    detail: {
      en: "A language model is, at bottom, a system that predicts the next token given the preceding ones; trained on enough text, that single objective yields surprisingly broad capabilities. But nothing here escapes the earlier layers: the model is data in memory, executed by a stored-program processor, expressed in a high-level language, running on an operating system, often served over the network. The [LLM reference](/docs/llm) explains transformers, attention, and training at scale — the concrete mechanics behind this final stage of the arc.",
      ja: "言語モデルは突き詰めれば、先行するトークンから次のトークンを予測するシステムであり、十分なテキストで訓練すると、この単一の目的が驚くほど広範な能力を生む。だがここでも、これまでの層から逃れるものは何もない：モデルはメモリ上のデータであり、プログラム内蔵方式のプロセッサによって実行され、高水準言語で表現され、オペレーティングシステム上で動き、しばしばネットワーク越しに提供される。[LLMのリファレンス](/docs/llm)は、Transformer・アテンション・大規模訓練——この流れの最終段階の背後にある具体的な仕組み——を説明する。",
    },
  },
];

/** The "Further reading" attribution linking to the article that inspired this page. */
export const CS_HISTORY_FURTHER_READING = {
  href: "https://fazamhd.com/mental-models/software/",
  label: {
    en: "Mental models: how software works — Faza",
    ja: "メンタルモデル：ソフトウェアはどう動くか——Faza",
  },
  note: {
    en: "This whole-picture walkthrough was inspired by the style of Faza's mental-models article on software. The prose above is original and written independently; Faza's article is a recommended companion read.",
    ja: "この全体像ウォークスルーは、ソフトウェアに関する Faza のメンタルモデル記事のスタイルに着想を得ています。上記の文章はすべてオリジナルで、独立して執筆したものです。次の読み物として Faza の記事をおすすめします。",
  },
} as const;
