import type { DeepDiveContent } from "../deepdive/DeepDive";

export const pathfindingDeepDive: DeepDiveContent = {
  sections: [
    {
      title: {
        en: "BFS vs DFS — breadth-first versus depth-first",
        ja: "BFS vs DFS — 幅優先探索と深さ優先探索",
      },
      paragraphs: [
        {
          en: "**Breadth-first search (BFS)** explores the grid in rings — first every cell one step from start, then every cell two steps away, and so on. It uses a **queue** (FIFO): enqueue the start, then repeatedly dequeue the front cell and enqueue its unvisited neighbours. Because every cell at distance *d* is settled before any cell at distance *d+1*, BFS is **guaranteed to find the shortest path** on an unweighted grid (where every step costs 1). The cost is memory: the frontier can balloon to O(W·H) in the worst case.",
          ja: "**幅優先探索（BFS）**はグリッドを同心円状に探索します — まずスタートから1ステップの全セル、次に2ステップのセル、というように。**キュー**（FIFO）を使います。スタートをエンキューし、前のセルを繰り返しデキューして未訪問の隣接セルをエンキューします。距離*d*の全セルは距離*d+1*のセルより前に解決されるため、BFSは**重みなしグリッドで最短経路を保証**します（各ステップのコストが1の場合）。コストはメモリで、最悪ケースでフロンティアはO(W·H)まで膨らみます。",
        },
        {
          en: "**Depth-first search (DFS)** dives as deep as possible along one branch before backtracking. It uses a **stack** (LIFO): push the start, then repeatedly pop the top cell and push its unvisited neighbours. DFS typically settles far fewer cells than BFS on open grids (the stack stays lean), but the path it finds is **not necessarily shortest** — it may wind through the entire grid. DFS is useful for maze generation and cycle detection, but BFS is preferred when optimality matters.",
          ja: "**深さ優先探索（DFS）**はバックトラッキングする前に一つの枝を可能な限り深く探索します。**スタック**（LIFO）を使います。スタートをプッシュし、トップのセルを繰り返しポップして未訪問の隣接セルをプッシュします。DFSは開放的なグリッドでBFSより通常はるかに少ないセルを解決します（スタックはスリム）が、見つけたパスは**必ずしも最短ではありません** — グリッド全体を迂回するかもしれません。DFSは迷路生成やサイクル検出に有用ですが、最適性が重要な場合はBFSが好まれます。",
        },
      ],
    },
    {
      title: {
        en: "Dijkstra & the priority queue",
        ja: "ダイクストラ法と優先度付きキュー",
      },
      paragraphs: [
        {
          en: "**Edsger Dijkstra** published his shortest-path algorithm in **1959** while working at the Mathematical Centre in Amsterdam — famously designed in about 20 minutes without pen and paper, published three years later. On an unweighted grid Dijkstra is equivalent to BFS, but its power shines when edges have different costs (e.g., a swamp cell costs 5 to enter while a road costs 1). Dijkstra replaces the plain queue with a **min-priority queue (binary heap)**: always expand the cell with the smallest *g* cost (distance from start) seen so far. This guarantees that when a cell is popped, its *g* cost is optimal — you never need to revisit it.",
          ja: "**エドスガー・ダイクストラ**はアムステルダムの数学センターで働きながら**1959年**に最短経路アルゴリズムを発表しました — 有名なことに、ペンと紙なしで約20分で設計され、3年後に発表されました。重みなしグリッドではダイクストラはBFSと同等ですが、エッジに異なるコストがある場合にその力が輝きます（例：沼地セルの通過コストは5、道路は1）。ダイクストラは通常のキューを**最小優先度キュー（二分ヒープ）**に置き換えます。常に最小の*g*コスト（スタートからの距離）を持つセルを展開します。これにより、セルがポップされた時、その*g*コストが最適であることが保証され、再訪問は不要です。",
        },
        {
          en: "The binary heap keeps the *smallest* element at the root and maintains the heap property (every parent ≤ both children) via *sift-up* on insert and *sift-down* on pop. Both operations cost **O(log V)** where V is the number of vertices. Overall, Dijkstra runs in **O((V + E) log V)** time with a binary heap. The visualiser uses a hand-rolled `MinHeap<T>` class from `@nand2web/pathfinding` — the same heap that powers A* — so you can watch the priority queue work step by step.",
          ja: "二分ヒープは*最小*要素をルートに保持し、挿入時の*シフトアップ*とポップ時の*シフトダウン*でヒープ性質（全ての親≤両方の子）を維持します。両方の操作は**O(log V)**のコストで、Vは頂点の数です。全体的に、ダイクストラは二分ヒープで**O((V + E) log V)**時間で動作します。ビジュアライザは`@nand2web/pathfinding`の手製の`MinHeap<T>`クラスを使用しています — A*を動かすのと同じヒープ — なのでステップバイステップで優先度キューの動作を見ることができます。",
        },
      ],
    },
    {
      title: {
        en: "A* & heuristics",
        ja: "A*とヒューリスティクス",
      },
      paragraphs: [
        {
          en: "**A\\*** (pronounced 'A-star') was published in **1968** by Peter Hart, Nils Nilsson, and Bertram Raphael at the Stanford Research Institute. It extends Dijkstra by adding a **heuristic function h(n)** that estimates the remaining cost from cell *n* to the goal. The priority queue is now ordered by **f = g + h**, where *g* is the known cost from start. Cells that appear *closer to the goal* are expanded first, dramatically pruning the search on open grids.",
          ja: "**A\\***（「Aスター」と発音）は**1968年**にスタンフォード研究所のPeter Hart、Nils Nilsson、Bertram Raphaelによって発表されました。ダイクストラをセル*n*からゴールまでの残りコストを推定する**ヒューリスティック関数h(n)**を追加することで拡張します。優先度キューは**f = g + h**で順序付けられます。ここで*g*はスタートからの既知のコストです。*ゴールに近い*と見られるセルが先に展開され、開放的なグリッドで探索を劇的に削減します。",
        },
        {
          en: "For the heuristic to guarantee that A* finds an optimal path, it must be **admissible**: it must never *overestimate* the true remaining cost. This visualiser uses the **Manhattan distance** |Δx| + |Δy| — exact for 4-directional grids with uniform costs, and therefore admissible. A* degenerates to Dijkstra when h(n) = 0 for all cells, and to greedy best-first search when g is ignored entirely. The balance between exploration (g) and guidance (h) is what makes A* the workhorse of game AI, robotics, and routing systems worldwide.",
          ja: "A*が最適経路を見つけることを保証するために、ヒューリスティックは**許容的**でなければなりません。真の残りコストを*過大評価*してはなりません。このビジュアライザは**マンハッタン距離** |Δx| + |Δy|を使用します — 均一コストの4方向グリッドに対して正確で、従って許容的です。全セルでh(n) = 0の場合A*はダイクストラに退化し、gが完全に無視される場合は貪欲最良優先探索になります。探索（g）と誘導（h）のバランスがA*を世界中のゲームAI、ロボティクス、ルーティングシステムの主力にしています。",
        },
      ],
    },
    {
      title: {
        en: "Complexity trade-offs",
        ja: "計算量のトレードオフ",
      },
      paragraphs: [
        {
          en: "On an unweighted grid of W×H cells, all four algorithms run in **O(W·H)** time and space in the worst case — they may visit every cell once. What differs is the *constant factor* and the *quality of path*. BFS and Dijkstra (uniform cost) always return a **shortest path**. DFS may return a very long path. A* returns a shortest path but expands far fewer nodes in practice thanks to the heuristic. The frontier peak stat in the visualiser measures memory pressure — watch how A* keeps it lower than BFS on the same grid.",
          ja: "W×HセルのグリッドW×Hでは、最悪ケースで4つのアルゴリズム全てが**O(W·H)**の時間と空間で動作します — 全セルを一度訪問する可能性があります。異なるのは*定数係数*と*パスの品質*です。BFSとダイクストラ（均一コスト）は常に**最短経路**を返します。DFSは非常に長いパスを返す可能性があります。A*は最短経路を返しますが、ヒューリスティックのおかげで実際にははるかに少ないノードを展開します。ビジュアライザのフロンティアピーク統計はメモリ圧力を測定します — 同じグリッドでA*がBFSより低く保つ様子を見てください。",
        },
        {
          en: "Choosing the right algorithm depends on the problem. Use **BFS** for unweighted graphs when you need the shortest path (router tables, puzzle solvers, network broadcasting). Use **Dijkstra** when edge weights differ (GPS routing, flight networks). Use **A\\*** when you have a good admissible heuristic and the graph is large — game AI, robot motion planning. **DFS** shines for topological sort, cycle detection, and generating random mazes (its backtracking behaviour naturally produces winding corridors without long straight runs).",
          ja: "適切なアルゴリズムの選択は問題に依存します。最短経路が必要な重みなしグラフには**BFS**を使用します（ルーターテーブル、パズルソルバー、ネットワークブロードキャスト）。エッジの重みが異なる場合は**ダイクストラ**を使用します（GPSルーティング、飛行ネットワーク）。良い許容ヒューリスティックがあり、グラフが大きい場合は**A\\***を使用します — ゲームAI、ロボットモーションプランニング。**DFS**はトポロジカルソート、サイクル検出、ランダム迷路生成で輝きます（バックトラッキングの動作が長い直線なしに自然に曲がりくねった通路を生成します）。",
        },
      ],
    },
  ],
};
