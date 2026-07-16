// ---------------------------------------------------------------------------
// Server Architecture & server-to-server communication — bilingual data module
// 10 stages: Part 1 (one server, many connections) 1-6, Part 2 (many servers
// talking) 7-10. Each carries a milestone framing, a durable mental model, and
// a richer detail paragraph. Used by the /docs/server-architecture page.
// ---------------------------------------------------------------------------

export interface LocalizedText {
  readonly en: string;
  readonly ja: string;
}

export interface ServerArchStage {
  readonly id: string;
  readonly title: LocalizedText;
  /** One-sentence framing of the problem this stage solves. */
  readonly milestone: LocalizedText;
  /** The durable mental model this stage teaches. */
  readonly mentalModel: LocalizedText;
  /** Richer explanatory paragraph. */
  readonly detail: LocalizedText;
  /** Optional short code / pseudo-code example. */
  readonly example?: string;
}

export const SERVER_ARCH_STAGES: readonly ServerArchStage[] = [
  // ===========================================================================
  // PART 1 — one server, many connections
  // ===========================================================================

  // 1 -----------------------------------------------------------------------
  {
    id: "socket",
    title: {
      en: "1. The socket — what a connection actually is",
      ja: "1. ソケット——「接続」の正体",
    },
    milestone: {
      en: "Before a server can serve anyone, it must open a socket, bind it to a port, and start listening. A network connection is not a magical pipe: on Unix it is a file descriptor, a small integer the kernel hands back that the process reads from and writes to like any other file.",
      ja: "サーバーが誰かに応答する前に、まずソケットを開き、ポートにバインドし、リッスンを始めなければならない。ネットワーク接続は魔法のパイプではない。Unix ではそれはファイルディスクリプタ、つまりカーネルが返す小さな整数であり、プロセスは他のファイルと同じようにそこから読み書きする。",
    },
    mentalModel: {
      en: "There are **two kinds of socket**, and confusing them is the root of most beginner errors. The *listening socket* is a single endpoint bound to a port; it does not carry data. Each time a client arrives, `accept()` returns a *brand-new connected socket* dedicated to that one client. So one server has one listening socket and N connected sockets — one per active client. Everything else in this page is a strategy for reading and writing those N descriptors without making the others wait.",
      ja: "**ソケットには2種類ある**。これを混同するのが初心者のつまずきの根本だ。*リッスンソケット*はポートにバインドされた単一の受付口で、それ自体はデータを運ばない。クライアントが到着するたびに `accept()` がそのクライアント専用の*新しい接続済みソケット*を返す。つまりサーバーはリッスンソケット1つと、アクティブなクライアントごとに1つずつの接続済みソケットN個を持つ。このページの残りはすべて、その他を待たせずにこのN個のディスクリプタを読み書きするための戦略にすぎない。",
    },
    detail: {
      en: "The canonical sequence is `socket()` → `bind()` → `listen()` → `accept()`. `socket()` allocates the descriptor; `bind()` attaches it to an address and port; `listen()` marks it passive and creates a backlog queue where completed TCP handshakes wait; `accept()` pops one finished connection off that queue and returns a fresh descriptor for it. Note that the kernel completes the [three-way handshake](/docs/network) on your behalf and parks the connection in the backlog — `accept()` merely hands you a connection that is already established. The listening socket keeps accepting; the connected socket carries the request and response bytes. Once you internalise 'a connection is a file descriptor', the whole subject becomes concrete: serving thousands of clients is the problem of watching thousands of descriptors at once.",
      ja: "定石の手順は `socket()` → `bind()` → `listen()` → `accept()` だ。`socket()` はディスクリプタを確保し、`bind()` はそれをアドレスとポートに結び付け、`listen()` はそれを受動状態にして、完了した TCP ハンドシェイクが待機するバックログキューを作る。`accept()` はそのキューから完了済みの接続を1つ取り出し、その接続専用の新しいディスクリプタを返す。カーネルが代わりに[3ウェイハンドシェイク](/docs/network)を完了させ、接続をバックログに置いておくため、`accept()` は確立済みの接続を渡すだけである点に注意したい。リッスンソケットは受付を続け、接続済みソケットがリクエストとレスポンスのバイト列を運ぶ。「接続とはファイルディスクリプタである」を体得すると、この分野は一気に具体的になる——数千のクライアントに応答するとは、数千のディスクリプタを一度に見張る問題なのだ。",
    },
    example:
      "fd = socket(AF_INET, SOCK_STREAM, 0)\nbind(fd, addr :8080)\nlisten(fd, backlog=128)\nwhile true:\n    conn = accept(fd)     # new fd, one per client\n    handle(conn)",
  },

  // 2 -----------------------------------------------------------------------
  {
    id: "sequential-wall",
    title: {
      en: "2. The sequential server hits a wall — blocking I/O",
      ja: "2. 逐次サーバーは壁にぶつかる——ブロッキングI/O",
    },
    milestone: {
      en: "The accept loop above is correct and also catastrophically slow the moment two clients connect at once. `handle(conn)` runs to completion before the loop calls `accept()` again, so while one request is being served, every other client sits in the backlog waiting its turn.",
      ja: "上の accept ループは正しいが、2つのクライアントが同時に接続した瞬間に致命的に遅くなる。`handle(conn)` はループが次に `accept()` を呼ぶ前に最後まで実行されるため、1つのリクエストを処理している間、他のすべてのクライアントはバックログで順番を待つことになる。",
    },
    mentalModel: {
      en: "The villain is **blocking I/O**. A call like `read(conn)` does not return until data is available; if the client is slow — a mobile network, a large upload, a pause while it thinks — the whole thread is frozen on that one call, doing nothing, holding the loop hostage. The CPU is not busy; it is *waiting*. The entire history of server architecture is a sequence of answers to one question: while thread A is blocked waiting on a slow client, how do we make progress on clients B, C, and D?",
      ja: "悪役は**ブロッキングI/O**だ。`read(conn)` のような呼び出しはデータが来るまで返らない。クライアントが遅ければ——モバイル回線、大きなアップロード、考え込んでの一時停止——スレッド全体がその1つの呼び出しで凍りつき、何もせずループを人質に取る。CPU は忙しいのではなく、*待っている*。サーバーアーキテクチャの歴史全体は、たった1つの問いへの答えの連続だ——スレッドAが遅いクライアントを待ってブロックしている間、どうやってクライアントB・C・Dを前に進めるのか？",
    },
    detail: {
      en: "It is worth being precise about where the time goes. A typical request spends very little time computing and a great deal of time waiting — for the client's bytes to arrive over the network, for a database query to come back, for a file to be read from disk. During all that waiting, a sequential server's single thread is blocked and idle. A modern CPU could have served hundreds of other requests in that gap. Every technique that follows — processes, threads, event loops — is a different way to reclaim that wasted waiting time by overlapping the waits of many connections. Note the trade-off that never goes away: you can spend memory (a process or thread per connection) or you can spend programming complexity (restructuring code around an event loop) to buy concurrency. There is no free lunch, only different bills.",
      ja: "時間がどこに消えるかを正確に押さえておく価値がある。典型的なリクエストは、計算にはほとんど時間を使わず、待つことに大量の時間を使う——クライアントのバイトがネットワーク越しに届くのを、データベースのクエリが返るのを、ファイルがディスクから読まれるのを。その待ち時間の間ずっと、逐次サーバーの唯一のスレッドはブロックされ遊んでいる。現代の CPU ならその隙間に他の何百ものリクエストを処理できたはずだ。この後に続くすべての手法——プロセス、スレッド、イベントループ——は、多数の接続の待ち時間を重ね合わせることで、その無駄になった待ち時間を取り戻す別々のやり方だ。決して消えないトレードオフに注意したい：並行性を買うために、メモリ（接続ごとのプロセスやスレッド）を払うか、プログラミングの複雑さ（イベントループを中心にコードを組み替える）を払うかのどちらかだ。無料の昼食はなく、あるのは請求書の種類の違いだけである。",
    },
  },

  // 3 -----------------------------------------------------------------------
  {
    id: "multi-process",
    title: {
      en: "3. Multi-process — fork per connection & preforking",
      ja: "3. マルチプロセス——接続ごとのforkとプリフォーク",
    },
    milestone: {
      en: "The oldest answer is the simplest: when a client connects, `fork()` a child process to handle it and let the parent go straight back to `accept()`. Each connection gets its own process, its own memory, its own copy of everything. The classic CGI web servers and the Apache `prefork` MPM descend from this lineage.",
      ja: "最も古い答えは最もシンプルだ：クライアントが接続したら、それを処理する子プロセスを `fork()` し、親はすぐに `accept()` に戻る。各接続は自身のプロセス、自身のメモリ、あらゆるものの自身のコピーを得る。古典的な CGI ウェブサーバーや Apache の `prefork` MPM はこの系譜に連なる。",
    },
    mentalModel: {
      en: "**Isolation is the feature; memory is the price.** Because each connection lives in a separate process with a separate address space, a crash or a memory bug in one request cannot corrupt another — the kernel enforces the boundary. This makes the model extraordinarily easy to reason about, which is why it survived for decades. But a process is heavy: its own memory pages, its own page tables, and a context switch between processes is expensive. **Preforking** softens the cost by starting a fixed pool of worker processes at boot (avoiding the per-request `fork()` latency) and having them each call `accept()` on the shared listening socket, but the fundamental ceiling remains: memory per connection is measured in megabytes, so a few thousand connections exhaust a server.",
      ja: "**分離が長所であり、メモリが代償だ。** 各接続が別々のアドレス空間を持つ別プロセスで動くため、あるリクエストのクラッシュやメモリバグが別のリクエストを壊すことはない——カーネルが境界を強制する。これによりこのモデルは極めて理解しやすく、だからこそ何十年も生き延びた。しかしプロセスは重い：自身のメモリページ、自身のページテーブルを持ち、プロセス間のコンテキストスイッチは高価だ。**プリフォーク**は、起動時に固定数のワーカープロセスのプールを立ち上げ（リクエストごとの `fork()` レイテンシを避ける）、それぞれが共有リッスンソケットで `accept()` を呼ぶことでコストを和らげる。だが根本的な上限は残る：接続ごとのメモリはメガバイト単位で測られるため、数千の接続でサーバーは枯渇する。",
    },
    detail: {
      en: "`fork()` is deceptively cheap at first glance thanks to copy-on-write: the child initially shares the parent's physical pages, and the kernel only duplicates a page when one side writes to it. But a busy web worker soon touches enough pages that the copies add up, and the per-connection footprint climbs into the megabytes. There is also a subtle historical bug worth knowing: the *thundering herd*, where many preforked workers all block in `accept()` on the same socket, and a single incoming connection wakes every one of them even though only one can win. Modern kernels solve this (for example with `EPOLLEXCLUSIVE` or a mutex around `accept()`), but it is a recurring theme — waking more workers than necessary wastes exactly the CPU you were trying to save. The prefork model is still a perfectly reasonable choice when request handlers are CPU-heavy and connection counts are modest.",
      ja: "`fork()` はコピーオンライトのおかげで一見すると安く見える：子は最初は親の物理ページを共有し、どちらかが書き込んだときにだけカーネルがそのページを複製する。しかし忙しいウェブワーカーはすぐに十分な数のページに触れ、コピーが積み重なり、接続ごとのフットプリントはメガバイト単位に上る。知っておく価値のある歴史的なバグもある：*サンダリングハード*だ。多数のプリフォークされたワーカーが同じソケットで `accept()` にブロックしているとき、1つの到着接続が——勝てるのは1つだけなのに——全員を起こしてしまう。現代のカーネルはこれを解決しているが（例えば `EPOLLEXCLUSIVE` や `accept()` 周りのミューテックスで）、これは繰り返し現れるテーマだ——必要以上のワーカーを起こすことは、まさに節約しようとしていた CPU を無駄にする。プリフォークモデルは、リクエストハンドラが CPU 重めで接続数が控えめなときには今でも十分に合理的な選択だ。",
    },
    example:
      "while true:\n    conn = accept(listen_fd)\n    if fork() == 0:      # child\n        handle(conn)\n        exit()\n    close(conn)          # parent keeps accepting",
  },

  // 4 -----------------------------------------------------------------------
  {
    id: "multi-thread",
    title: {
      en: "4. Multi-thread — the C10K ceiling",
      ja: "4. マルチスレッド——C10K問題という天井",
    },
    milestone: {
      en: "Threads are the lighter-weight cousin of processes: a thread-per-connection server spawns a new thread instead of a new process for each client. Threads within one process share the same address space, so they are far cheaper to create and switch between than processes — a common answer through the 1990s and still the model behind Java servlet containers and Ruby/Python threaded servers.",
      ja: "スレッドはプロセスの軽量ないとこだ：スレッドごとの接続サーバーは、クライアントごとに新プロセスではなく新スレッドを生成する。1つのプロセス内のスレッドは同じアドレス空間を共有するため、プロセスよりはるかに安く生成・切り替えできる——1990年代を通じてよくある答えであり、今も Java サーブレットコンテナや Ruby/Python のスレッド型サーバーの背後にあるモデルだ。",
    },
    mentalModel: {
      en: "**Shared memory cuts the cost but hands you locks and races.** Because threads share one address space, a bug in one can corrupt another, and any data touched by more than one thread needs a mutex — buying you deadlocks, race conditions, and the hardest debugging in the field. Threads are also not free: each needs its own stack (often ~1 MB by default), and context-switching thousands of them saturates the scheduler. This ceiling has a famous name — the **C10K problem**, coined by Dan Kegel around 1999: how does one server handle ten thousand *concurrent* connections? With a thread or process per connection, ten thousand threads means gigabytes of stacks and a scheduler drowning in context switches. The answer could not be 'more threads'; it had to be a different shape entirely.",
      ja: "**共有メモリはコストを下げるが、ロックとレースを押し付けてくる。** スレッドは1つのアドレス空間を共有するため、あるスレッドのバグが別のスレッドを壊しうる。複数のスレッドが触れるデータにはミューテックスが必要で、その代償としてデッドロック、競合状態、そしてこの分野で最も難しいデバッグを買うことになる。スレッドもタダではない：それぞれ自身のスタック（既定でしばしば約1MB）を必要とし、数千のスレッドをコンテキストスイッチするとスケジューラが飽和する。この天井には有名な名前がある——**C10K問題**、Dan Kegel が1999年頃に名付けた：1台のサーバーで1万の*同時*接続をどう扱うか？ 接続ごとのスレッドやプロセスでは、1万スレッドはギガバイト級のスタックと、コンテキストスイッチに溺れるスケジューラを意味する。答えは「もっとスレッドを」ではありえなかった——まったく別の形でなければならなかった。",
    },
    detail: {
      en: "The threaded model's real problem is not raw cost but *scaling*: doubling connections doubles threads, and past a few thousand the machine spends more time switching between threads than doing work for them. Most of those threads are not even running — they are blocked on I/O, waiting. That observation is the key: if ten thousand threads are all sitting in `read()` waiting for bytes, we are paying for ten thousand stacks and ten thousand scheduler entries to represent ten thousand *waits*. A wait does not need a whole thread. What if a single thread could ask the kernel 'which of these ten thousand connections has data ready right now?' and only do work for those? That question is exactly what the event-driven model answers, and Kegel's C10K page (2003) was the essay that pushed the industry to take it seriously.",
      ja: "スレッドモデルの本当の問題は素のコストではなく*スケーリング*だ：接続を倍にするとスレッドも倍になり、数千を超えるとマシンは仕事をするよりスレッド間の切り替えに多くの時間を費やす。しかもそれらのスレッドの大半は走ってすらいない——I/O でブロックし、待っている。この観察が鍵だ：1万のスレッドがすべて `read()` でバイトを待って座っているなら、1万の*待ち*を表現するために1万のスタックと1万のスケジューラエントリを払っていることになる。待ちに丸々1スレッドは要らない。もし単一のスレッドがカーネルに「この1万の接続のうち、今データが準備できているのはどれか？」と尋ね、それらの分だけ仕事をできたら？ その問いこそがイベント駆動モデルの答えであり、Kegel の C10K ページ（2003年）は業界にそれを真剣に受け止めさせた文章だった。",
    },
  },

  // 5 -----------------------------------------------------------------------
  {
    id: "event-driven",
    title: {
      en: "5. Event-driven — one loop & readiness notification",
      ja: "5. イベント駆動——1つのループと準備完了通知",
    },
    milestone: {
      en: "The event-driven model inverts the picture: instead of one thread per connection, one thread manages all connections. It never blocks on any single socket. Instead it asks the kernel — via a readiness API — 'which of my sockets are ready to read or write right now?', handles exactly those, and loops. nginx and Node.js are the archetypes.",
      ja: "イベント駆動モデルは構図を反転させる：接続ごとに1スレッドではなく、1スレッドがすべての接続を管理する。個々のソケットでブロックすることは決してない。代わりにカーネルに——準備完了 API を通じて——「私のソケットのうち、今すぐ読み書きできる準備ができているのはどれか？」と尋ね、まさにそれらだけを処理し、ループする。nginx と Node.js が原型だ。",
    },
    mentalModel: {
      en: "**Readiness notification, not one-descriptor-at-a-time blocking.** The whole trick is a system call that watches many descriptors and returns the subset that are ready. The first-generation call, `select()`, works but is O(n): it scans a fixed-size bitmap of every descriptor on every call, so cost grows with total connections even when only a few are active. `epoll` (Linux, 2002) and `kqueue` (BSD/macOS) fixed this: you register interest in a descriptor once, and the kernel returns only the ready ones — cost scales with *active* connections, not total. That single change is what made C10K, and later C10M, tractable. The iron rule of this model: **never block the loop.** One slow synchronous call — a blocking disk read, a tight CPU loop — freezes every connection at once, because they all share the one thread.",
      ja: "**準備完了通知であって、1ディスクリプタずつのブロッキングではない。** 肝はすべて、多数のディスクリプタを見張り、準備ができた部分集合を返すシステムコールにある。第1世代の `select()` は動くが O(n) だ：呼び出しのたびに全ディスクリプタの固定サイズのビットマップを走査するため、アクティブなのが少数でも総接続数とともにコストが増える。`epoll`（Linux、2002年）と `kqueue`（BSD/macOS）はこれを解決した：ディスクリプタへの関心を一度登録すれば、カーネルは準備ができたものだけを返す——コストは総接続数ではなく*アクティブな*接続数に応じてスケールする。この1つの変化が C10K を、後には C10M をも扱えるものにした。このモデルの鉄則：**ループをブロックするな。** 1つの遅い同期呼び出し——ブロッキングなディスク読み込み、CPU を占有するループ——は、全接続を一度に凍りつかせる。すべてが1つのスレッドを共有しているからだ。",
    },
    detail: {
      en: "In an event loop, all I/O is non-blocking: a `read()` that would block instead returns immediately with 'not ready yet', and the loop moves on. The code is structured as callbacks (or `async`/`await`, which is callbacks in disguise): 'when this socket has data, run this function.' This is why Node.js is single-threaded for JavaScript yet handles tens of thousands of connections — it is almost never computing, almost always waiting on I/O, and the loop overlaps all those waits. The cost is a programming model that turns straight-line code inside out; a bug where you accidentally call a blocking function (a synchronous file read, a CPU-bound JSON parse of a huge payload) stalls the entire server, and these bugs are notoriously hard to spot because nothing crashes — everything just gets slow. The mental model to carry forward: an event loop trades memory for CPU efficiency and pays with code complexity, the exact opposite trade from the process model.",
      ja: "イベントループでは、すべての I/O がノンブロッキングだ：ブロックするはずの `read()` は代わりに「まだ準備ができていない」と即座に返り、ループは先に進む。コードはコールバック（あるいは `async`/`await`、これは変装したコールバックだ）として構成される：「このソケットにデータが来たら、この関数を実行せよ」。だからこそ Node.js は JavaScript にとってはシングルスレッドなのに数万の接続を扱える——ほとんど計算しておらず、ほとんど常に I/O を待っており、ループがそれらの待ちをすべて重ね合わせる。代償は、直線的なコードを裏返しにするプログラミングモデルだ。うっかりブロッキング関数（同期的なファイル読み込み、巨大なペイロードの CPU 依存な JSON パース）を呼んでしまうバグはサーバー全体を止めるが、何もクラッシュしない——すべてがただ遅くなるだけ——ため、これらのバグは悪名高く見つけにくい。持ち帰るべきメンタルモデル：イベントループはメモリを CPU 効率と引き換えにし、コードの複雑さで支払う。プロセスモデルとはちょうど正反対のトレードだ。",
    },
    example:
      "loop = epoll_create()\nepoll_add(loop, listen_fd)\nwhile true:\n    ready = epoll_wait(loop)   # only the sockets with data\n    for fd in ready:\n        if fd == listen_fd: accept + register new conn\n        else:               read/write without blocking",
  },

  // 6 -----------------------------------------------------------------------
  {
    id: "hybrids",
    title: {
      en: "6. Hybrids & lightweight threads",
      ja: "6. ハイブリッドと軽量スレッド",
    },
    milestone: {
      en: "Neither pure model is the last word. A single event loop uses only one CPU core, and modern servers have dozens. The dominant production pattern is a hybrid: run several worker processes, each running its own event loop, one per core. nginx is exactly this — a small pool of worker processes, each an epoll loop.",
      ja: "どちらの純粋なモデルも最終結論ではない。単一のイベントループは CPU コアを1つしか使わないが、現代のサーバーには何十ものコアがある。主流の本番パターンはハイブリッドだ：複数のワーカープロセスを走らせ、それぞれがコアごとに1つ、自身のイベントループを走らせる。nginx はまさにこれだ——小さなワーカープロセスのプールで、それぞれが epoll ループになっている。",
    },
    mentalModel: {
      en: "**Lightweight threads are 'threads priced like events'.** Goroutines (Go) and green threads (early Java, Erlang processes) let you write ordinary blocking-style code — `read()`, then process, then `write()`, top to bottom — while a runtime scheduler quietly multiplexes thousands of them onto a handful of OS threads over an event loop underneath. When a goroutine 'blocks' on I/O, the runtime parks it and runs another on the same OS thread; no kernel thread is actually blocked. You get the readable straight-line code of the thread model with the memory profile and scaling of the event model — a goroutine's stack starts at a couple of kilobytes and grows on demand, so a million of them is realistic. This is the synthesis the field converged on: keep the simple mental model of a thread per connection, but make threads cheap enough that the C10K ceiling stops mattering.",
      ja: "**軽量スレッドとは「イベント並みの値段のスレッド」だ。** ゴルーチン（Go）やグリーンスレッド（初期の Java、Erlang のプロセス）を使うと、普通のブロッキング風のコード——`read()`、そして処理、そして `write()` を上から下へ——を書ける一方で、ランタイムのスケジューラが裏で静かに、下層のイベントループの上で数千のそれらをひと握りの OS スレッドに多重化する。ゴルーチンが I/O で「ブロック」すると、ランタイムはそれを退避させ、同じ OS スレッドで別のものを走らせる——実際にはどのカーネルスレッドもブロックしていない。スレッドモデルの読みやすい直線的なコードを、イベントモデルのメモリプロファイルとスケーリングとともに得られる——ゴルーチンのスタックは数キロバイトから始まり必要に応じて伸びるため、100万個も現実的だ。これがこの分野が収束した統合だ：接続ごとのスレッドというシンプルなメンタルモデルを保ちつつ、スレッドを十分に安くして C10K の天井を問題でなくする。",
    },
    detail: {
      en: "It is worth being clear that a lightweight thread is not magic — it is an event loop with a nicer surface. Underneath, the Go runtime still calls `epoll`/`kqueue`, still tracks readiness, still never blocks an OS thread on a single slow socket. The runtime just hides the callbacks so you write sequential code and it transforms the waits into scheduler yields for you. The same non-blocking machinery from stage 5 is doing the work; the innovation is ergonomic. Choosing between these hybrids is largely a question of ecosystem: an nginx-style worker-per-core event loop for a proxy or static server, a goroutine-style runtime for application code where straight-line readability matters. Either way, every design in Part 1 is ultimately a strategy for one thing — keeping the CPU busy while thousands of connections spend most of their lives waiting on I/O.",
      ja: "軽量スレッドが魔法ではないことははっきりさせておく価値がある——それはより快適な表面を持つイベントループだ。内部では Go ランタイムは依然として `epoll`/`kqueue` を呼び、依然として準備完了を追跡し、依然として1つの遅いソケットで OS スレッドをブロックすることはない。ランタイムはただコールバックを隠すことで、あなたが逐次的なコードを書くと、待ちをスケジューラの譲渡へと変換してくれる。ステージ5と同じノンブロッキングの仕組みが仕事をしているのであり、革新は人間工学的なものだ。これらのハイブリッドの選択は主にエコシステムの問題だ：プロキシや静的サーバーには nginx 風のコアごとワーカーのイベントループを、直線的な読みやすさが重要なアプリケーションコードにはゴルーチン風のランタイムを。いずれにせよ、Part 1 のすべての設計は突き詰めれば1つのことのための戦略だ——数千の接続が人生の大半を I/O 待ちに費やす間、CPU を忙しく保つこと。",
    },
  },

  // ===========================================================================
  // PART 2 — many servers talking
  // ===========================================================================

  // 7 -----------------------------------------------------------------------
  {
    id: "reverse-proxy",
    title: {
      en: "7. The front door — reverse proxy & load balancer",
      ja: "7. 玄関口——リバースプロキシとロードバランサ",
    },
    milestone: {
      en: "One server is no longer enough. The moment you run more than one application server, something has to stand at the front door and decide which one gets each request. That something is a reverse proxy and load balancer — the single public entry point that terminates connections, buffers, and distributes work across a fleet of identical app servers behind it.",
      ja: "1台のサーバーではもう足りない。アプリケーションサーバーを2台以上動かした瞬間、玄関口に立って各リクエストをどれに渡すかを決める何かが必要になる。それがリバースプロキシとロードバランサだ——接続を終端し、バッファし、背後にある同一のアプリサーバー群に仕事を分配する、単一の公開入口である。",
    },
    mentalModel: {
      en: "**Terminate, buffer, distribute — and choose your layer.** The reverse proxy terminates the client's TCP and TLS so app servers never see the raw internet; it buffers slow clients so a mobile user on a trickling connection ties up the cheap proxy instead of an expensive app worker (a direct fix for the blocking-client problem of Part 1); and it distributes requests by some policy (round-robin, least-connections, consistent hashing). The one distinction to hold: an **L4** load balancer works at the transport layer — it forwards TCP connections by IP and port, fast and protocol-agnostic, but blind to HTTP. An **L7** load balancer parses HTTP and can route by path or header (`/api/*` to one pool, `/img/*` to another), richer but costlier. L4 moves connections; L7 understands requests.",
      ja: "**終端し、バッファし、分配する——そして層を選ぶ。** リバースプロキシはクライアントの TCP と TLS を終端し、アプリサーバーが生のインターネットを見ずに済むようにする。遅いクライアントをバッファし、細い回線のモバイルユーザーが高価なアプリワーカーではなく安価なプロキシを占有するようにする（Part 1 のブロッキングクライアント問題への直接的な対処だ）。そして何らかのポリシー（ラウンドロビン、最小接続数、コンシステントハッシュ）でリクエストを分配する。押さえるべき1つの区別：**L4** ロードバランサはトランスポート層で動く——IP とポートで TCP 接続を転送し、高速でプロトコル非依存だが HTTP は見えない。**L7** ロードバランサは HTTP を解析し、パスやヘッダーでルーティングできる（`/api/*` を1つのプールへ、`/img/*` を別のプールへ）——豊かだが高コストだ。L4 は接続を動かし、L7 はリクエストを理解する。",
    },
    detail: {
      en: "Placing a reverse proxy in front also unlocks capabilities that individual app servers should not each reinvent: TLS termination in one place (so certificates live at the edge), response caching, gzip/brotli compression, health checking (stop sending traffic to a dead backend), and graceful rolling deploys (drain one server, update it, return it to the pool). The same TLS handshake and HTTP semantics you can explore in [the web deep-dive](/docs/web) happen here at the edge, once, on behalf of the whole fleet. Conceptually the load balancer is just another accept loop from stage 1 — it accepts client connections and opens its own connections to backends — which is why the concurrency models of Part 1 apply to it directly; nginx and HAProxy are event-driven precisely because a proxy is nothing but I/O.",
      ja: "リバースプロキシを前に置くことは、個々のアプリサーバーがそれぞれ再発明すべきでない機能も解放する：1箇所での TLS 終端（証明書がエッジに置ける）、レスポンスキャッシュ、gzip/brotli 圧縮、ヘルスチェック（死んだバックエンドへの送信を止める）、そして無停止のローリングデプロイ（1台を drain し、更新し、プールに戻す）だ。[Web のディープダイブ](/docs/web)で探れるのと同じ TLS ハンドシェイクと HTTP セマンティクスが、ここエッジで、一度だけ、フリート全体を代表して行われる。概念的にはロードバランサはステージ1の accept ループのもう1つの姿にすぎない——クライアント接続を accept し、バックエンドへ自身の接続を開く——だからこそ Part 1 の並行性モデルがそのまま当てはまる。nginx と HAProxy がイベント駆動なのは、まさにプロキシが I/O 以外の何物でもないからだ。",
    },
  },

  // 8 -----------------------------------------------------------------------
  {
    id: "rpc",
    title: {
      en: "8. How servers converse — REST, gRPC & serialization",
      ja: "8. サーバー同士の会話——REST・gRPC・シリアライゼーション",
    },
    milestone: {
      en: "Once work is split across many servers, they have to talk to each other. The two dominant styles are HTTP/REST — services exchange JSON over ordinary HTTP requests — and RPC, where calling a remote service looks like calling a local function. gRPC is the modern RPC standard, running over HTTP/2 and serializing with Protocol Buffers.",
      ja: "仕事が多数のサーバーに分割されると、それらは互いに話さねばならない。主流の2つのスタイルは HTTP/REST——サービスが通常の HTTP リクエストで JSON をやり取りする——と RPC で、後者ではリモートサービスの呼び出しがローカル関数の呼び出しのように見える。gRPC は現代の RPC 標準で、HTTP/2 の上で動き、Protocol Buffers でシリアライズする。",
    },
    mentalModel: {
      en: "**Serialization is where the choice really lives.** Any cross-service call must turn an in-memory object into bytes on the wire and back — that is serialization. JSON is text: human-readable, schema-optional, universally supported, but verbose and comparatively slow to parse. Protocol Buffers (protobuf) is a compact binary format with a strict schema defined ahead of time; it is smaller on the wire and faster to encode/decode, at the cost of not being human-readable and requiring a shared `.proto` contract. REST-over-JSON optimises for openness and debuggability; gRPC-over-protobuf optimises for throughput and strong typing between services you control. The deeper warning applies to both: **a synchronous call chain propagates latency and failure.** If service A calls B calls C, A's response time is the sum, and if C is down, A is down. Coupling availability this way is the central hazard of a request/response mesh.",
      ja: "**選択が本当に宿るのはシリアライゼーションだ。** どんなサービス間呼び出しも、メモリ上のオブジェクトをワイヤー上のバイト列に変換し、また戻さねばならない——それがシリアライゼーションだ。JSON はテキストだ：人間が読め、スキーマは任意、普遍的にサポートされるが、冗長でパースは比較的遅い。Protocol Buffers（protobuf）は事前に定義された厳密なスキーマを持つコンパクトなバイナリ形式で、ワイヤー上でより小さく、エンコード/デコードが速い——人間が読めず、共有の `.proto` 契約を要する代償を払う。REST-over-JSON は開放性とデバッグしやすさに最適化し、gRPC-over-protobuf は自分が管理するサービス間のスループットと強い型付けに最適化する。両者に当てはまるより深い警告：**同期呼び出しの連鎖はレイテンシと障害を伝播させる。** サービス A が B を呼び B が C を呼ぶなら、A の応答時間は総和であり、C が落ちれば A も落ちる。こうして可用性を結合することが、リクエスト/レスポンス網の中心的な危険だ。",
    },
    detail: {
      en: "gRPC's choice of HTTP/2 is not incidental. HTTP/2 multiplexes many concurrent streams over a single TCP connection, so services can hold long-lived connections and fire many in-flight calls without the connection-per-request overhead of HTTP/1.1 — and it enables true bidirectional streaming, which plain request/response REST cannot express naturally. The protocol details of HTTP/2 are covered in [the web deep-dive](/docs/web) and its TCP foundation in [the networking page](/docs/network). The practical guidance: reach for REST/JSON at public API boundaries and where human debuggability wins; reach for gRPC/protobuf for high-volume internal service-to-service traffic where you own both ends and can share schemas. And whichever you pick, treat every synchronous call as a place where latency accumulates and a remote failure can become your failure — which is exactly the pressure that pushes systems toward the asynchronous messaging of the next stage.",
      ja: "gRPC が HTTP/2 を選んだのは偶然ではない。HTTP/2 は単一の TCP 接続上で多数の並行ストリームを多重化するため、サービスは長命な接続を保ち、HTTP/1.1 のリクエストごと接続のオーバーヘッドなしに多数の呼び出しを同時に飛ばせる——そして真の双方向ストリーミングを可能にする。これは素のリクエスト/レスポンスの REST では自然に表現できない。HTTP/2 のプロトコル詳細は [Web のディープダイブ](/docs/web)で、その TCP 基盤は[ネットワークのページ](/docs/network)で扱っている。実践的な指針：公開 API の境界や人間のデバッグしやすさが勝つ場面では REST/JSON を、両端を自分が所有しスキーマを共有できる大量の内部サービス間トラフィックには gRPC/protobuf を選ぶ。そしてどちらを選ぶにせよ、すべての同期呼び出しを、レイテンシが蓄積しリモートの障害が自分の障害になりうる場所として扱うこと——それこそが、システムを次のステージの非同期メッセージングへと押しやる圧力だ。",
    },
    example:
      '// gRPC: a remote call looks local\nresponse = stub.GetUser(UserRequest{id: 42})\n\n// REST equivalent\nGET /users/42  →  200 {"id":42,"name":"..."}',
  },

  // 9 -----------------------------------------------------------------------
  {
    id: "message-queue",
    title: {
      en: "9. Cutting the cord — message queues & pub/sub",
      ja: "9. コードを切る——メッセージキューとpub/sub",
    },
    milestone: {
      en: "The fix for coupled availability is to stop making services call each other directly. Instead of A synchronously calling B and waiting, A drops a message onto a queue and moves on; B picks it up whenever it is ready. Message queues and publish/subscribe systems (RabbitMQ, Apache Kafka, cloud queues) turn a synchronous call into an asynchronous handoff.",
      ja: "結合された可用性への対処は、サービスが互いを直接呼ぶのをやめることだ。A が同期的に B を呼んで待つ代わりに、A はメッセージをキューに落として先へ進み、B は準備ができたときにそれを拾う。メッセージキューと publish/subscribe システム（RabbitMQ、Apache Kafka、クラウドキュー）は、同期呼び出しを非同期の受け渡しに変える。",
    },
    mentalModel: {
      en: "**Asynchronous messaging decouples availability — and the price is delivery semantics.** With a queue between them, the producer and consumer no longer have to be up at the same time: if the consumer is down or slow, messages simply wait in the queue, and the producer never blocks. A traffic spike becomes a longer queue rather than a cascade of failures — the queue absorbs the burst exactly as router buffers absorb packet bursts. But you buy this with a hard truth: reliable queues generally guarantee **at-least-once delivery**, not exactly-once. A message can be delivered twice — the consumer processed it but crashed before acknowledging, so the queue redelivers. The price of at-least-once is therefore **idempotency**: consumers must be written so that processing the same message twice has the same effect as processing it once (charge order #42 once even if you see it twice). Exactly-once is largely a fiction across a network; at-least-once plus idempotency is the honest, achievable design.",
      ja: "**非同期メッセージングは可用性を分離する——そしてその代償は配信セマンティクスだ。** 間にキューがあれば、プロデューサとコンシューマは同時に起きている必要がなくなる：コンシューマが落ちていたり遅かったりしても、メッセージは単にキューで待ち、プロデューサは決してブロックしない。トラフィックの急増は障害のカスケードではなく、より長いキューになる——ルーターのバッファがパケットのバーストを吸収するのとまさに同じように、キューがバーストを吸収する。だがこれを買うには厳しい真実がある：信頼できるキューは一般に、ちょうど1回ではなく**少なくとも1回の配信**を保証する。メッセージは2回配信されうる——コンシューマが処理したが確認応答の前にクラッシュしたため、キューが再配信するのだ。したがって少なくとも1回の代償は**冪等性**だ：コンシューマは、同じメッセージを2回処理しても1回処理したのと同じ効果になるよう書かねばならない（注文 #42 を2回見ても課金は1回だけ）。ちょうど1回はネットワーク越しにはおおむね幻想だ——少なくとも1回＋冪等性が、正直で達成可能な設計である。",
    },
    detail: {
      en: "Two shapes are worth distinguishing. A **work queue** hands each message to exactly one of several competing consumers — the classic way to spread a backlog of jobs (resize these images, send these emails) across a worker pool, and a natural fit for offloading slow work out of the request path so the user gets a fast response. **Publish/subscribe** instead fans one message out to every interested subscriber — one 'order placed' event feeds the billing service, the shipping service, and the analytics pipeline independently, none of them knowing the others exist. Pub/sub is what lets you add a new consumer (a fraud detector, say) without touching the producer at all — the decoupling is organisational as well as technical. The recurring cost across all of this is that asynchronous systems are harder to reason about and debug: there is no single stack trace across a queue boundary, ordering is not always guaranteed, and 'where did my message go?' becomes a real operational question. You trade the tight coupling and fragility of synchronous calls for eventual consistency and the discipline of idempotency.",
      ja: "区別する価値のある2つの形がある。**ワークキュー**は各メッセージを、競合する複数のコンシューマのうちちょうど1つに渡す——ジョブの滞留（これらの画像をリサイズせよ、これらのメールを送れ）をワーカープールに分散させる古典的なやり方であり、遅い仕事をリクエストの経路から追い出してユーザーに速い応答を返すのに自然に合う。**publish/subscribe** は代わりに、1つのメッセージを興味を持つすべての購読者に扇状に配る——1つの「注文確定」イベントが、課金サービス、配送サービス、分析パイプラインを、互いの存在を知らぬまま独立して駆動する。pub/sub は、プロデューサに一切触れずに新しいコンシューマ（例えば不正検知）を追加できるようにするものだ——分離は技術的であると同時に組織的でもある。これらすべてに共通する繰り返しのコストは、非同期システムは推論とデバッグが難しいことだ：キュー境界をまたぐ単一のスタックトレースはなく、順序が常に保証されるとは限らず、「私のメッセージはどこへ行った？」が現実の運用上の問いになる。同期呼び出しの密結合と脆さを、結果整合性と冪等性の規律と引き換えにするのだ。",
    },
  },

  // 10 ----------------------------------------------------------------------
  {
    id: "modern-shape",
    title: {
      en: "10. The modern shape — three-tier to microservices",
      ja: "10. 現代の形——3層からマイクロサービスへ",
    },
    milestone: {
      en: "Put the pieces together and you get the shape of a modern system. The classic starting point is the three-tier architecture — a stateless web/app tier behind a load balancer, talking to a database tier — which scales by cloning the middle tier horizontally. Split that middle tier along business boundaries and it becomes microservices, many small services each owning its own data and talking over the network.",
      ja: "部品を組み合わせると、現代システムの形が見えてくる。古典的な出発点は3層アーキテクチャ——ロードバランサの背後にあるステートレスなウェブ/アプリ層が、データベース層と話す——で、これは中間層を水平に複製することでスケールする。その中間層を業務の境界に沿って分割すると、マイクロサービスになる：多数の小さなサービスがそれぞれ自身のデータを所有し、ネットワーク越しに話す。",
    },
    mentalModel: {
      en: "**Every pattern in Part 1 reappears between machines in Part 2.** The accept loop that multiplexes connections inside one server becomes the load balancer multiplexing requests across servers. The choice between blocking a thread and using an event loop inside a process becomes the choice between a synchronous call chain and a message queue between services. Even the basic hygiene is the same shape scaled up: a **connection pool** reuses a fixed set of open connections to the database instead of opening one per request (the moral heir of preforking); a **timeout** on every remote call ensures one slow dependency cannot block you forever (the distributed answer to 'never block the loop'); and a **retry** with backoff recovers from transient failure — but only safely if the operation is idempotent, closing the loop back to stage 9. Connection pools, timeouts, and retries are not advanced techniques; they are the table stakes of any service that calls another over a network.",
      ja: "**Part 1 のすべてのパターンが、Part 2 ではマシン間に再登場する。** 1台のサーバー内で接続を多重化する accept ループは、サーバー間でリクエストを多重化するロードバランサになる。プロセス内でスレッドをブロックするかイベントループを使うかの選択は、サービス間で同期呼び出しの連鎖にするかメッセージキューにするかの選択になる。基本的な衛生管理でさえ、同じ形を拡大しただけだ：**コネクションプール**はリクエストごとに1つ開く代わりに、データベースへの開いた接続の固定セットを再利用する（プリフォークの精神的後継だ）。すべてのリモート呼び出しの**タイムアウト**は、1つの遅い依存が永遠にあなたをブロックできないようにする（「ループをブロックするな」の分散版の答えだ）。そしてバックオフ付きの**リトライ**は一時的な障害から回復する——だが操作が冪等な場合にのみ安全であり、ステージ9へと環を閉じる。コネクションプール、タイムアウト、リトライは高度な技術ではない——ネットワーク越しに他を呼ぶあらゆるサービスの、最低限の参加費だ。",
    },
    detail: {
      en: "Microservices are not automatically better than a well-built monolith; they trade one kind of complexity for another. A monolith keeps its calls in-process — fast, transactional, easy to debug with one stack trace — at the cost of everything scaling and deploying together. Microservices let teams scale and deploy independently and pick the right tool per service, at the cost of turning every in-process function call into a network call with all of Part 2's hazards: latency, partial failure, serialization, and the operational weight of many moving parts. The honest summary is that distribution is a tool you reach for when a single machine or a single team genuinely cannot cope, not a default. Whatever the topology, the load balancer, the service-to-service protocol, the message queue, and the connection pool are the recurring vocabulary — and underneath every box in the diagram, there is still a server running a loop around `accept()`.",
      ja: "マイクロサービスは、よく作られたモノリスより自動的に優れているわけではない——ある種の複雑さを別の複雑さと引き換えにするだけだ。モノリスは呼び出しをプロセス内に保つ——速く、トランザクショナルで、1つのスタックトレースでデバッグしやすい——が、すべてが一緒にスケールしデプロイされる代償を払う。マイクロサービスはチームが独立してスケール・デプロイし、サービスごとに適切な道具を選べるようにする——が、すべてのプロセス内関数呼び出しを、Part 2 のあらゆる危険（レイテンシ、部分障害、シリアライゼーション、多数の可動部品の運用上の重さ）を伴うネットワーク呼び出しに変える代償を払う。正直な要約は、分散は単一マシンや単一チームが本当に立ち行かなくなったときに手を伸ばす道具であって、既定ではないということだ。トポロジーが何であれ、ロードバランサ、サービス間プロトコル、メッセージキュー、コネクションプールが繰り返し現れる語彙であり——図のすべての箱の下には、依然として `accept()` の周りをループするサーバーがいる。",
    },
  },
];

/** The "Further reading" attribution linking to the article that inspired this page. */
export const SERVER_ARCH_FURTHER_READING = {
  href: "https://blog.ojisan.io/server-architecture-2023/",
  label: {
    en: "作って学ぶサーバーアーキテクチャ — ojisan",
    ja: "作って学ぶサーバーアーキテクチャ — ojisan",
  },
  note: {
    en: "The progression of Part 1 — socket, sequential server, process, thread, event loop — was inspired by ojisan's build-it-yourself server architecture article. The prose above is original and was written without consulting it; the article is the recommended hands-on next read.",
    ja: "Part 1 の進行——ソケット、逐次サーバー、プロセス、スレッド、イベントループ——は、ojisan の「作って学ぶサーバーアーキテクチャ」にインスパイアされています。上記の文章はオリジナルで、参照せずに書かれています。手を動かす次の読み物としておすすめです。",
  },
} as const;
