import type { DeepDiveContent } from "../deepdive/DeepDive";

/**
 * History & mechanics essays for the Digital Logic lessons, in English and
 * Japanese. Facts worth double-checking are dated in the text itself.
 */
export const logicDeepDives: Record<string, DeepDiveContent> = {
  nand: {
    sections: [
      {
        title: {
          en: "Historical context — logic becomes a physical thing",
          ja: "時代背景 — 論理が「物」になるまで",
        },
        paragraphs: [
          {
            en: "In 1854 the English mathematician **George Boole** published *The Laws of Thought*, showing that logical reasoning — AND, OR, NOT — could be manipulated as algebra, with true and false as 1 and 0. For eighty years this stayed pure mathematics. The turning point was **Claude Shannon's 1937 master's thesis**, often called the most influential master's thesis ever written: Shannon proved that Boole's algebra and electrical switching circuits are the same thing. A relay in series is AND; a relay in parallel is OR. Suddenly, designing a circuit meant simplifying an equation.",
            ja: "1854年、イギリスの数学者**ジョージ・ブール**が『思考の法則』を発表し、AND・OR・NOT といった論理的推論が「真=1、偽=0 の代数」として計算できることを示しました。以後80年間、これは純粋な数学にとどまります。転機は**クロード・シャノンの1937年の修士論文**。「史上最も影響力のある修士論文」と呼ばれるこの論文で、シャノンはブール代数と電気のスイッチ回路が同じものであることを証明しました。リレーを直列につなげば AND、並列につなげば OR。回路設計が「数式の変形」になった瞬間です。",
          },
          {
            en: "The NAND gate's special status was proved even earlier: in 1913 the logician **Henry Sheffer** showed that a single operation (now called the Sheffer stroke) can express *all* of Boolean logic — a result Charles Peirce had privately reached decades before. When integrated circuits arrived, this theoretical curiosity became an industrial strategy. Texas Instruments' **7400** — a chip with four NAND gates, introduced in the mid-1960s — became one of the most manufactured chips in history. And the **Apollo Guidance Computer** that landed people on the Moon in 1969 was built almost entirely from thousands of copies of one single gate type (NOR, NAND's mirror twin).",
            ja: "NAND ゲートの特別さはさらに前に証明されていました。1913年、論理学者**ヘンリー・シェファー**は、たった1種類の演算（シェファーの棒記号）でブール論理の**すべて**を表現できることを示します（チャールズ・パースは数十年前に私的に同じ結論に達していました）。集積回路の時代になると、この理論的な珍事は産業戦略になります。1960年代半ばに登場したテキサス・インスツルメンツの **7400**（NAND ゲート4個入りのチップ）は、史上最も大量生産されたチップの一つになりました。そして1969年に人類を月に運んだ**アポロ誘導コンピュータ**は、ほぼ全体がたった1種類のゲート（NAND の双子である NOR）数千個の複製だけで作られています。",
          },
        ],
      },
      {
        title: {
          en: "What's actually happening",
          ja: "何が起きているのか",
        },
        paragraphs: [
          {
            en: "Physically, a CMOS NAND gate is just **four transistors**: two in series pulling the output down to 0, two in parallel pulling it up to 1. Only when *both* inputs are 1 does the series pair conduct and drag the output to 0 — that's the entire truth table, written in silicon. This is why NAND (not AND) is the primitive: AND requires a NAND *plus* an inverter, six transistors. The cheapest, fastest gate you can build happens to be the universal one.",
            ja: "物理的には、CMOS の NAND ゲートは**トランジスタわずか4個**です。直列の2個が出力を 0 に引き下げ、並列の2個が 1 に引き上げる。**両方**の入力が 1 のときだけ直列ペアが導通して出力が 0 に落ちる — 真理値表そのものがシリコンに書かれています。基本ゲートが AND ではなく NAND なのはこのためです。AND を作るには NAND + インバータで6トランジスタ必要になる。つまり「一番安くて速いゲート」がたまたま「万能なゲート」だったのです。",
          },
          {
            en: "In the simulator above, toggling an input fires a **propagation step**: the gate re-evaluates and its output wire changes color. Real gates do the same thing in tens of *picoseconds* — but the delay is never zero, and that finite propagation delay will come back to haunt us in the adder lesson.",
            ja: "上のシミュレータで入力をトグルすると、**伝播ステップ**が発生します。ゲートが再評価され、出力の配線の色が変わる。実物のゲートも同じことを数十**ピコ秒**で行いますが、遅延は決してゼロではありません。この「有限の伝播遅延」は、加算器のレッスンで重要な意味を持って再登場します。",
          },
        ],
      },
      {
        title: { en: "Up the stack", ja: "次の層へ" },
        paragraphs: [
          {
            en: "**Functional completeness** means everything on this site — the adder, the memory, the CPU, and by extension the browser you're reading this in — reduces to this one gate repeated a few billion times. The rest of the curriculum is just organizing that repetition.",
            ja: "**関数的完全性**が意味するのは、このサイトのすべて — 加算器も、メモリも、CPU も、そして延長線上では今このページを表示しているブラウザさえも — がこの1種類のゲートを数十億回繰り返したものに還元できる、ということです。以降のカリキュラムは、その「繰り返しの整理術」にすぎません。",
          },
        ],
      },
    ],
  },

  "not-and-or": {
    sections: [
      {
        title: {
          en: "Historical context — the algebra of thought",
          ja: "時代背景 — 思考の代数",
        },
        paragraphs: [
          {
            en: "The rewrite rules used in this lesson are older than electricity in computing. **Augustus De Morgan** stated his laws — NOT(a AND b) = NOT a OR NOT b — in 1847, as pure logic about propositions. A century later those same identities became engineering tools: if OR gates are expensive in your technology but NAND gates are cheap, De Morgan tells you how to rebuild every OR out of NANDs without changing the circuit's behavior. Chip designers still run these transformations daily — today it's software (logic synthesis) applying De Morgan millions of times per second.",
            ja: "このレッスンで使う書き換え規則は、コンピュータより古い時代のものです。**オーガスタス・ド・モルガン**が「NOT(a AND b) = NOT a OR NOT b」という法則を発表したのは1847年、命題についての純粋な論理学としてでした。それから1世紀後、同じ恒等式が工学の道具になります。もし手元の技術で OR ゲートが高価で NAND が安いなら、ド・モルガンの法則は「回路の振る舞いを一切変えずに、すべての OR を NAND で組み直す方法」を教えてくれる。チップ設計者は今もこの変形を毎日実行しています — 現代では論理合成ソフトウェアが、毎秒数百万回ド・モルガンを適用しているのです。",
          },
        ],
      },
      {
        title: { en: "What's actually happening", ja: "何が起きているのか" },
        paragraphs: [
          {
            en: '**NOT** is the degenerate case: feed the same signal to both NAND inputs and "both inputs are 1" collapses to "the input is 1", so the output is simply the inversion. **AND** is NAND followed by that inverter — un-inverting the inversion, 2 gates. **OR** is the De Morgan trick made physical: invert each input first, then NAND them, 3 gates. Watch the gate counter in each playground — in hardware, that number is cost, power, and delay.',
            ja: "**NOT** は縮退ケースです。同じ信号を NAND の両入力に入れると「両方が 1」が「入力が 1」に潰れるので、出力は単なる反転になります。**AND** は NAND の後ろにその NOT を付けたもの — 反転をもう一度反転して戻す、計2ゲート。**OR** はド・モルガンの法則をそのまま物理化したもので、各入力を先に反転してから NAND する、計3ゲート。各プレイグラウンドのゲートカウンタに注目してください — ハードウェアでは、この数字がそのままコストであり、消費電力であり、遅延なのです。",
          },
          {
            en: "Notice something subtle: the simulation propagates in *waves*. When you flip an input to the OR circuit, first the inverters react, then the final NAND. Two gate-delays deep means the answer arrives two ticks later. Circuit depth — the longest path from input to output — is the hardware version of an algorithm's time complexity.",
            ja: "細かいところに注目すると、シミュレーションは**波**のように伝播しています。OR 回路の入力を反転させると、まずインバータが反応し、その後に最後の NAND が反応する。ゲート2段分の深さがあるということは、答えが2ティック遅れて届くということです。回路の深さ — 入力から出力までの最長経路 — は、アルゴリズムの時間計算量のハードウェア版だと言えます。",
          },
        ],
      },
      {
        title: { en: "Up the stack", ja: "次の層へ" },
        paragraphs: [
          {
            en: "With NOT, AND, and OR in hand, any truth table you can write down can be built — that's the practical meaning of completeness. The next lesson builds the one gate combination interesting enough to deserve its own name: XOR.",
            ja: "NOT・AND・OR が手に入れば、書き下せる真理値表はすべて回路にできます — これが「完全性」の実用的な意味です。次のレッスンでは、固有の名前を与えられるほど面白いゲートの組み合わせ、XOR を作ります。",
          },
        ],
      },
    ],
  },

  xor: {
    sections: [
      {
        title: {
          en: "Historical context — the cryptographer's gate",
          ja: "時代背景 — 暗号屋のゲート",
        },
        paragraphs: [
          {
            en: 'XOR has a double life. In arithmetic it is the **sum bit** of binary addition, which is why it sits at the heart of every adder. In secrecy it is the perfect scrambler: in 1917 **Gilbert Vernam** patented a cipher that XORs each message bit with a key bit — and because XOR undoes itself (`a ⊕ k ⊕ k = a`), applying the same key again decrypts perfectly. With a truly random, never-reused key, this "one-time pad" is the only encryption mathematically proven unbreakable. The same self-inverse property powers RAID disk recovery and error-detecting **parity bits**, which **Richard Hamming** turned into self-*correcting* codes at Bell Labs in 1950 after losing weekend computer runs to undetected errors.',
            ja: "XOR には二つの顔があります。算術の顔では、XOR は2進加算の**和ビット**そのものであり、だからこそすべての加算器の心臓部に鎮座しています。秘密の顔では、XOR は完璧な撹拌器です。1917年、**ギルバート・バーナム**はメッセージの各ビットを鍵のビットと XOR する暗号を特許化しました。XOR は自分自身で元に戻る（`a ⊕ k ⊕ k = a`）ので、同じ鍵をもう一度適用すれば完全に復号できる。真にランダムで使い回さない鍵を使えば、この「ワンタイムパッド」は数学的に解読不能と証明された唯一の暗号です。同じ自己逆性は RAID のディスク復旧や、誤り検出の**パリティビット**にも使われています。パリティを誤り「訂正」にまで進化させたのが**リチャード・ハミング**（ベル研、1950年）— 週末の計算がエラー検出のせいで無駄になったことへの怒りが発明の動機でした。",
          },
        ],
      },
      {
        title: { en: "What's actually happening", ja: "何が起きているのか" },
        paragraphs: [
          {
            en: "The 4-NAND construction is a small masterpiece of gate reuse. The first NAND computes `NAND(a, b)` and feeds *both* branches; each branch then NANDs it against one original input, and the final gate merges them. Trace it with the playback: when the inputs are equal the middle wires disagree with the inputs, and the output settles at 0; when they differ, at 1. A naive XOR from AND/OR/NOT costs 9 NANDs — sharing that first gate cuts it to 4.",
            ja: "この4-NAND 構成はゲート再利用の小さな傑作です。最初の NAND が `NAND(a, b)` を計算して**両方**の枝に供給し、各枝はそれを元の入力と NAND し、最後のゲートが合流させる。再生機能でなぞってみてください。入力が等しいときは中間の配線が入力と食い違って出力は 0 に、異なるときは 1 に落ち着きます。AND/OR/NOT から素朴に XOR を作ると 9 NAND かかりますが、最初のゲートを共有することで 4 まで削れるのです。",
          },
        ],
      },
      {
        title: { en: "Up the stack", ja: "次の層へ" },
        paragraphs: [
          {
            en: "Check the XOR truth table against one-bit addition: 0+1=1, 1+0=1, 1+1=0-carry-1. The sum column *is* XOR; the carry column *is* AND. That observation is the entire next lesson.",
            ja: "XOR の真理値表を1ビットの足し算と見比べてください。0+1=1、1+0=1、1+1=0 で桁上がり1。和の列は XOR **そのもの**、桁上がりの列は AND **そのもの**です。この観察が、次のレッスンの内容のすべてです。",
          },
        ],
      },
    ],
  },

  adder: {
    sections: [
      {
        title: {
          en: "Historical context — three centuries of carrying the one",
          ja: "時代背景 — 「繰り上がり」の300年",
        },
        paragraphs: [
          {
            en: "Mechanical calculators are older than calculus: **Blaise Pascal's** 1642 Pascaline already had the hard part — a mechanism to *carry* overflow from one digit wheel to the next. Carry has been the central engineering problem of addition ever since. Early electronic computers like ENIAC (1945) still counted in decimal; it was **John von Neumann's 1945 EDVAC report** that fixed the modern recipe: binary numbers, and arithmetic built from logic gates.",
            ja: "機械式計算機は微積分より古い。**ブレーズ・パスカル**が1642年に作ったパスカリーヌには、すでに一番難しい部分 — ある桁の歯車から次の桁へ繰り上がりを伝える機構 — が備わっていました。以来、加算の工学的な中心問題はずっと「繰り上がり」です。ENIAC（1945年）などの初期の電子計算機はまだ10進法で数えていましたが、**フォン・ノイマンの1945年の EDVAC 報告書**が現代のレシピを確定させます。数は2進法で、算術は論理ゲートで組む、と。",
          },
          {
            en: "The ripple-carry adder you built here is the textbook design — and its weakness was understood immediately: the carry must *ripple* through every stage, so a 64-bit add takes 64 gate-delays. Faster schemes that compute carries in parallel (carry-lookahead, published by Weinberger and Smith in 1958, and tree adders like **Kogge–Stone**, 1973) trade many more gates for logarithmic depth. Every CPU you own spends that silicon gladly.",
            ja: "ここで組んだリプルキャリー加算器は教科書どおりの設計ですが、その弱点も最初から知られていました。繰り上がりが全段を**波のように**通過しなければならないので、64ビットの加算には64ゲート分の遅延がかかるのです。繰り上がりを並列に計算する高速な方式 — キャリー先読み（1958年、ワインバーガーとスミス）や **Kogge–Stone**（1973年）のような木構造加算器 — は、大量のゲートと引き換えに深さを対数に抑えます。あなたの手元の CPU はどれも、そのシリコンを喜んで支払っています。",
          },
        ],
      },
      {
        title: { en: "What's actually happening", ja: "何が起きているのか" },
        paragraphs: [
          {
            en: 'A **full adder** is honest bookkeeping: three input bits (a, b, carry-in), count the 1s. XOR-of-XOR gives the sum; "at least two of the three" gives the carry-out — the NAND pair implements exactly that majority test. Chain four of them and set A=15, B=1: watch the carry light up stage after stage in the playback. That left-to-right wave is the propagation delay budget every clock cycle must accommodate.',
            ja: "**全加算器**は誠実な帳簿係です。3つの入力ビット（a・b・繰り上がり入力）のうち 1 がいくつあるかを数える。XOR の XOR が和を、「3つのうち2つ以上が1」の判定が繰り上がり出力を与えます — NAND のペアがまさにその多数決を実装しています。4個を鎖につないで A=15、B=1 にしてみてください。再生すると、繰り上がりが1段ずつ順番に点灯していくのが見えます。この左から右への波こそ、すべてのクロックサイクルが飲み込まなければならない伝播遅延の予算です。",
          },
          {
            en: 'Notice what didn\'t need inventing: nothing here "knows" arithmetic. The circuit implements a truth table, and *we* choose to read its wires as binary numbers. Meaning lives in the interpretation — a theme that returns when CPU instructions turn out to be just bits too.',
            ja: "発明されなかったものにも注目してください。この回路のどこにも算術を「知っている」部分はありません。回路は真理値表を実装しているだけで、その配線を2進数として読むと決めたのは**私たち**です。意味は解釈の側に宿る — このテーマは、CPU の命令もまた「ただのビット列」だと分かるときに再登場します。",
          },
        ],
      },
      {
        title: { en: "Up the stack", ja: "次の層へ" },
        paragraphs: [
          {
            en: "We can now compute — but not remember. Every circuit so far forgets its inputs the instant they change. The next lesson closes the loop, literally, and gets us one bit of memory.",
            ja: "これで計算はできるようになりました — しかし記憶ができません。ここまでのすべての回路は、入力が変わった瞬間に前の状態を忘れます。次のレッスンでは文字どおり「ループを閉じて」、1ビットの記憶を手に入れます。",
          },
        ],
      },
    ],
  },

  latch: {
    sections: [
      {
        title: {
          en: "Historical context — memory from vacuum tubes",
          ja: "時代背景 — 真空管から生まれた記憶",
        },
        paragraphs: [
          {
            en: "The bistable circuit was discovered before anyone needed computer memory: in 1918 the physicists **William Eccles and Frank Jordan** wired two vacuum-tube amplifiers so each one's output fed the other's input, and found the pair would snap into one of two stable states and *stay there*. Their \"trigger relay\" — the Eccles–Jordan circuit — is the direct ancestor of the cross-coupled NAND pair on this page. When electronic computers arrived in the 1940s, flip-flops were the fast-but-expensive memory (two tubes per bit!), reserved for registers while bulk storage used exotic hardware like mercury delay lines and CRT tubes.",
            ja: "双安定回路は、誰もコンピュータの記憶装置を必要とするより前に発見されていました。1918年、物理学者**ウィリアム・エクルズとフランク・ジョーダン**は、2つの真空管増幅器を互いの出力が相手の入力になるように配線し、このペアが2つの安定状態のどちらかにパチンと収まって**そのまま留まる**ことを発見します。彼らの「トリガーリレー」— エクルズ＝ジョーダン回路 — が、このページのクロスカップルド NAND ペアの直系の祖先です。1940年代に電子計算機が登場すると、フリップフロップは高速だが高価な記憶（1ビットに真空管2本！）としてレジスタ用に温存され、大容量の記憶には水銀遅延線やブラウン管といった奇妙なハードウェアが使われました。",
          },
          {
            en: "The design never went away. The **SRAM cells** in your CPU's caches today are still two cross-coupled inverters holding each other in place — six transistors per bit, a century of continuity from Eccles and Jordan.",
            ja: "この設計は今も現役です。現代の CPU キャッシュに入っている **SRAM セル**は、依然として互いを支え合う2つのクロスカップルド・インバータ — 1ビットあたりトランジスタ6個。エクルズとジョーダンから100年続く連続性です。",
          },
        ],
      },
      {
        title: { en: "What's actually happening", ja: "何が起きているのか" },
        paragraphs: [
          {
            en: "The trick is **positive feedback**. Each NAND's output feeds the other's input, so once q=1/q̄=0 (or the reverse), each gate's output reinforces the other's input — the loop holds itself up with no further help. Pulsing `set_n` low forces q to 1; releasing it changes nothing, because the loop is now self-sustaining. That *is* the memory. Note the diagram's feedback wires running right-to-left: the layout algorithm places gates by signal depth, and a loop has no consistent depth — cyclic circuits genuinely are different creatures.",
            ja: "種明かしは**正帰還**です。各 NAND の出力が相手の入力に入るので、いったん q=1／q̄=0（またはその逆）になると、それぞれのゲートの出力が相手の入力を補強し続け、ループは外部の助けなしに自分自身を支え続けます。`set_n` を一瞬 0 にすると q は 1 に強制され、離しても何も変わらない — ループがもう自立しているからです。これこそが記憶です。回路図で右から左へ走る帰還配線にも注目してください。レイアウトはゲートを信号の深さで配置しますが、ループには一貫した深さがない — 巡回する回路は本当に別種の生き物なのです。",
          },
          {
            en: 'The dark corner: pull both inputs low at once and both outputs go to 1 (the "forbidden state"); release them simultaneously and the loop must fall to one side, but *which* side depends on infinitesimal physical differences. Real hardware can even hang between states for a while — **metastability**, a genuine physical phenomenon that clocked design (next lesson) exists to contain.',
            ja: "影の側面もあります。両方の入力を同時に 0 にすると両方の出力が 1 になり（「禁止状態」）、同時に離すとループはどちらかに倒れなければなりませんが、**どちら**に倒れるかは無限小の物理的な個体差で決まります。実物のハードウェアはしばらく状態の間で宙吊りになることさえある — **メタステーブル**と呼ばれる正真正銘の物理現象で、次のレッスンのクロック同期設計は、まさにこれを封じ込めるために存在します。",
          },
        ],
      },
      {
        title: { en: "Up the stack", ja: "次の層へ" },
        paragraphs: [
          {
            en: "A transparent latch remembers, but it listens *whenever* enable is high — dangerous in a machine where signals race through loops of logic. The next lesson adds the discipline of the clock edge.",
            ja: "透過的なラッチは記憶できますが、enable が 1 の間は**ずっと**入力に耳を傾けてしまいます。信号が論理のループを駆け巡るマシンではこれは危険です。次のレッスンで「クロックエッジ」という規律を導入します。",
          },
        ],
      },
    ],
  },

  dff: {
    sections: [
      {
        title: {
          en: "Historical context — why every computer has a heartbeat",
          ja: "時代背景 — なぜコンピュータには鼓動があるのか",
        },
        paragraphs: [
          {
            en: "Early designers faced a brutal problem: in a web of feedback loops, outputs feed back into inputs, and a transparent latch lets changes race around the loop many times before settling — or never settling. The industry's answer was **synchronous design**: let signals fight and ripple all they want *between* ticks, but only commit state at one crisp instant — the rising clock edge. The master–slave flip-flop (packaged as TTL chips like the **7474** in the 1960s) is the mechanism that enforces it: one latch listens while the clock is low, the second publishes when it goes high, and there is no moment when a signal can pass straight through both.",
            ja: "初期の設計者たちは過酷な問題に直面していました。帰還ループが絡み合う回路では出力が入力に戻ってくるため、透過的なラッチでは変化が落ち着くまでに（あるいは永遠に落ち着かずに）ループを何周も駆け回ってしまう。業界の答えが**同期式設計**です。信号はティックとティックの**間**では好きなだけ暴れて波打ってよい。ただし状態の確定は、クロックの立ち上がりというただ一つの鋭い瞬間にだけ行う。マスター・スレーブ型フリップフロップ（1960年代に **7474** などの TTL チップとして製品化）はそれを強制する機構です。クロックが低い間は1つ目のラッチが聞き役になり、高くなった瞬間に2つ目が公表役になる。信号が両方を素通りできる瞬間は存在しません。",
          },
          {
            en: "The clock became the defining number of a computer. Intel's first CPU ran at 740 kHz; today's chips tick around 5 GHz — nearly seven thousand times faster — and distributing that heartbeat across a chip without skew is one of the hardest problems in modern silicon design.",
            ja: "以来、クロックはコンピュータを代表する数字になりました。インテル最初の CPU は 740kHz で動作し、現代のチップは約 5GHz — 約7000倍です。そしてこの鼓動をチップ全体へズレ（スキュー）なく配ることは、現代の半導体設計で最も難しい問題の一つになっています。",
          },
        ],
      },
      {
        title: { en: "What's actually happening", ja: "何が起きているのか" },
        paragraphs: [
          {
            en: "Walk the experiment in the playground: set d=1 while the clock is low — the *master* latch (enabled by the inverted clock) tracks it, but the *slave* stays frozen, so q doesn't move. Raise the clock: the master freezes its captured value and the slave opens, publishing it. Change d while the clock is high — nothing, the master is deaf now. State changes exactly once per rising edge. Real flip-flops add fine print: d must be stable a little *before* the edge (setup time) and *after* it (hold time), or you risk the metastability from last lesson.",
            ja: "プレイグラウンドで実験をなぞってみてください。クロックが低い間に d=1 にすると、（反転クロックで有効化された）**マスター**ラッチはそれを追跡しますが、**スレーブ**は凍結したままなので q は動きません。クロックを上げると、マスターは捕まえた値を凍結し、スレーブが開いてそれを公表する。クロックが高い間に d を変えても何も起きません — マスターはもう聞いていないからです。状態は立ち上がりエッジごとに正確に1回だけ変わる。実物のフリップフロップには細則が付きます。d はエッジの少し**前**（セットアップ時間）から少し**後**（ホールド時間）まで安定していなければならず、破ると前のレッスンのメタステーブルが顔を出します。",
          },
        ],
      },
      {
        title: { en: "Up the stack", ja: "次の層へ" },
        paragraphs: [
          {
            en: "Line up four flip-flops on a shared clock and you have a **register** — the component that holds A and B in the ALU lesson, and the PC, A, and B of the Layer 2 CPU. Computation (combinational logic) between registers, state committed on the edge: that pattern *is* digital design.",
            ja: "フリップフロップを4個、共通のクロックに並べると**レジスタ**になります。ALU レッスンで A と B を保持していた部品であり、Layer 2 の CPU の PC・A・B もこれです。レジスタの間に計算（組み合わせ論理）を置き、エッジで状態を確定する — このパターンこそがデジタル設計そのものです。",
          },
        ],
      },
    ],
  },

  alu: {
    sections: [
      {
        title: {
          en: "Historical context — the chip that computed everything",
          ja: "時代背景 — 「計算する部品」が1チップになるまで",
        },
        paragraphs: [
          {
            en: "Through the 1950s and 60s, a computer's arithmetic unit was a cabinet of discrete boards. In 1970 Texas Instruments squeezed one onto a single chip: the **74181**, a 4-bit ALU offering 16 arithmetic and 16 logic operations. It became the arithmetic heart of a generation of famous machines — Data General's Nova, several PDP-11 models, and the **Xerox Alto**, the computer that pioneered the GUI. Hobbyists still build \"discrete\" CPUs around 74181s today. Our ALU here is the same idea at 1/8 scale: 4 operations instead of 32, and every gate visible.",
            ja: "1950〜60年代を通じて、コンピュータの演算装置は基板が詰まったキャビネットでした。1970年、テキサス・インスツルメンツがそれを1チップに押し込みます。**74181** — 16種の算術演算と16種の論理演算を備えた4ビット ALU です。これは一世代の名機たち — Data General の Nova、複数の PDP-11、そして GUI を切り拓いたコンピュータ **Xerox Alto** — の演算の心臓になりました。今でも趣味で 74181 を並べて「ディスクリート CPU」を組む人がいます。ここで作った ALU は同じアイデアの 1/8 スケール版です。32演算の代わりに4演算、そしてすべてのゲートが見える形で。",
          },
          {
            en: "The subtraction trick has its own history: **two's complement** representation was recommended in von Neumann's 1945 EDVAC report precisely because it makes subtraction almost free — no separate subtractor circuit, just inverted inputs and a carry-in. Nearly every computer since has agreed.",
            ja: "引き算のトリックにも歴史があります。**2の補数**表現は、フォン・ノイマンの1945年の EDVAC 報告書がまさに「引き算がほぼ無料になるから」という理由で推奨したものです。専用の減算回路は不要で、入力を反転して繰り上がりを1つ注入するだけ。以来ほぼすべてのコンピュータがこれに従っています。",
          },
        ],
      },
      {
        title: { en: "What's actually happening", ja: "何が起きているのか" },
        paragraphs: [
          {
            en: "The ALU's structure is wasteful on purpose: the adder, the AND bank, and the OR bank all compute their answers **simultaneously**, every single time — and the multiplexers simply throw away the results you didn't ask for. Hardware isn't like software: gates you've already paid for run for free, so computing everything and selecting is *faster* than deciding first. SUB rides the adder: `op0` XORs every B bit (flipping them) and doubles as the carry-in, computing A + NOT(B) + 1 = A − B in two's complement.",
            ja: "ALU の構造はわざと無駄に作られています。加算器も、AND 群も、OR 群も、毎回**全員が同時に**答えを計算し、マルチプレクサは頼まれなかった結果をただ捨てる。ハードウェアはソフトウェアとは違います。すでに買ったゲートはタダで動き続けるので、「全部計算してから選ぶ」ほうが「先にどれを計算するか決める」より速いのです。SUB は加算器に相乗りします。`op0` がすべての B ビットを XOR で反転し、同時に繰り上がり入力にもなる。これで A + NOT(B) + 1 = A − B が2の補数で計算されます。",
          },
          {
            en: 'The `carry` output is your first **flag** — one bit of metadata about the computation. For ADD it means overflow past 15; for SUB it means "no borrow" (A ≥ B). A humble wire here, but in the CPU it becomes the basis of every `if`, every loop condition, every comparison your programs make.',
            ja: "`carry` 出力は、あなたが出会う最初の**フラグ** — 計算についての1ビットのメタデータです。ADD では 15 を超えたオーバーフローを、SUB では「借りなし」（A ≥ B）を意味します。ここではつつましい1本の配線ですが、CPU ではこれが、プログラムのあらゆる `if`、あらゆるループ条件、あらゆる比較の土台になります。",
          },
        ],
      },
      {
        title: { en: "Up the stack", ja: "次の層へ" },
        paragraphs: [
          {
            en: "You now have every ingredient of a processor: an ALU to compute, registers to remember, a clock to keep order. What's missing is *autonomy* — a circuit that fetches its own orders from memory and acts on them. That's Layer 2.",
            ja: "これでプロセッサの材料はすべて揃いました。計算する ALU、記憶するレジスタ、秩序を保つクロック。足りないのは**自律性** — 自分の命令をメモリから自分で取ってきて実行する回路です。それが Layer 2 です。",
          },
        ],
      },
    ],
  },
};
