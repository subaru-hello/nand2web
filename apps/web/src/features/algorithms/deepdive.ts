import type { DeepDiveContent } from "../deepdive/DeepDive";

export const algorithmDeepDive: DeepDiveContent = {
  sections: [
    {
      title: {
        en: "Historical context — the age of sorting",
        ja: "時代背景 — ソートアルゴリズムの黎明期",
      },
      paragraphs: [
        {
          en: "Sorting is as old as computation itself. **John von Neumann** sketched the first formal merge sort in **1945** while working on the EDVAC — the same year he described the stored-program architecture. He realised that merging two sorted halves is easy and that the divide-and-conquer structure fits naturally onto tape drives, which could only be read sequentially. The algorithm he described guarantees **O(n log n)** comparisons in the worst case, a bound that decades of research have proven optimal for comparison-based sorting.",
          ja: "ソートは計算そのものと同じくらい古い歴史を持ちます。**ジョン・フォン・ノイマン**は、ストアドプログラムアーキテクチャを記述した同年の**1945年**に、EDVAC の研究の一環として最初の形式的なマージソートを考案しました。彼は「ソート済みの2つの半分をマージするのは簡単で、分割統治の構造はシーケンシャルにしか読めないテープドライブに自然にフィットする」と気づいていました。彼が記述したアルゴリズムは最悪ケースで**O(n log n)**の比較回数を保証し、この境界が比較ベースのソートの最適解であることは数十年にわたる研究によって証明されています。",
        },
        {
          en: "**Tony Hoare** invented quicksort in **1959** as a 23-year-old working on a machine-translation project at Moscow State University, trying to sort words to look them up in a Russian dictionary. He realised that partitioning an array around a pivot and recursing is fast in practice — average **O(n log n)** with tiny constants — and published the algorithm in 1961 in the *Computer Journal*. Quicksort remains the default choice in most standard libraries to this day, often combined with insertion sort for small sub-arrays.",
          ja: "**トニー・ホア**は**1959年**、モスクワ国立大学での機械翻訳プロジェクトに取り組む23歳のとき、ロシア語辞書で単語を引くために配列をソートしようとしてクイックソートを発明しました。彼はピボットの周りで配列を分割して再帰することが実際に速い（平均**O(n log n)**、定数が小さい）と気づき、1961年に *Computer Journal* にアルゴリズムを発表しました。クイックソートは今日でも多くの標準ライブラリのデフォルト選択肢であり、多くの場合小さなサブ配列にはインサーションソートと組み合わせて使われます。",
        },
        {
          en: "**J. W. J. Williams** invented heapsort in **1964** and described it in the *Communications of the ACM*. Unlike quicksort, heapsort guarantees **O(n log n)** in the *worst* case and sorts in place, using only O(1) extra space. Williams introduced the binary heap data structure in the same paper — one of the most influential data-structure papers of all time. The heap structure found a second life in Dijkstra's shortest-path algorithm (1959) and A* search, making it one of the most widely deployed data structures in computing history.",
          ja: "**J・W・J・ウィリアムズ**は**1964年**にヒープソートを発明し、*Communications of the ACM* に発表しました。クイックソートと異なり、ヒープソートは**最悪ケースでも O(n log n)**を保証し、O(1)の余分なスペースのみを使用してインプレースでソートします。ウィリアムズは同じ論文で二分ヒープデータ構造も紹介しました — 史上最も影響力のあるデータ構造論文の一つです。ヒープ構造はダイクストラの最短経路アルゴリズム（1959年）やA*探索で第二の人生を得て、計算機の歴史の中で最も広く使われるデータ構造の一つとなっています。",
        },
      ],
    },
    {
      title: {
        en: "How the algorithms work",
        ja: "各アルゴリズムの仕組み",
      },
      paragraphs: [
        {
          en: "**Bubble sort** repeatedly scans the array, comparing adjacent pairs and swapping them when out of order. Each pass 'bubbles' the largest unsorted element to its final position. An early-exit optimisation detects when no swaps occurred in a pass — making it O(n) on already-sorted input — but it remains **O(n²)** in the average case. It is rarely used in practice but remains the canonical teaching example because its steps are easiest to visualise.",
          ja: "**バブルソート**は配列を繰り返しスキャンし、隣接するペアを比較して順序が逆なら交換します。各パスで最大の未ソート要素がその最終位置に「バブルアップ」されます。スワップが一度も発生しなかったパスを検出する早期終了最適化により、ソート済み入力に対してO(n)となりますが、平均ケースでは**O(n²)**のままです。実際にはほとんど使われませんが、ステップが最も視覚化しやすいため、典型的な教育例として残っています。",
        },
        {
          en: "**Insertion sort** builds a sorted prefix one element at a time: it takes the next element, finds its correct position in the already-sorted prefix by shifting larger elements right, and inserts it. It is **O(n²)** in the average case but **O(n)** on nearly-sorted data, and its small constant factor makes it faster than merge or quick sort for arrays of fewer than ~10–20 elements — which is why most hybrid algorithms (Timsort, Introsort) fall back to insertion sort for small partitions.",
          ja: "**インサーションソート**は一度に一要素ずつソート済みプレフィックスを構築します。次の要素を取り、より大きな要素を右にシフトしながら既にソートされたプレフィックス内の正しい位置を見つけ、挿入します。平均ケースでは**O(n²)**ですが、ほぼソートされたデータに対しては**O(n)**となり、定数係数が小さいため10〜20要素未満の配列では、マージソートやクイックソートより速くなります。これが多くのハイブリッドアルゴリズム（Timsort、Introsort）が小さいパーティションにインサーションソートにフォールバックする理由です。",
        },
        {
          en: "**Selection sort** scans the unsorted portion to find the minimum, then places it at the front. It always performs exactly **O(n²)** comparisons regardless of input order — unlike bubble or insertion sort, there is no early exit. Its one advantage: it performs at most **O(n)** *writes*, making it valuable when writes are costly (e.g., flash memory with limited write cycles).",
          ja: "**セレクションソート**は未ソート部分をスキャンして最小値を見つけ、先頭に配置します。入力の順序に関わらず常に正確に**O(n²)**の比較を行います — バブルソートやインサーションソートとは違い、早期終了がありません。唯一の利点は、最大でも**O(n)**の*書き込み*しか行わないことで、書き込みコストが高い場合（例：書き込み回数が制限されたフラッシュメモリ）に価値があります。",
        },
        {
          en: "**Merge sort** applies *divide and conquer*: split the array in half, recursively sort each half, then merge the two sorted halves into one. The merge step scans both halves from left to right, always picking the smaller front element — a single linear pass. The recurrence T(n) = 2T(n/2) + O(n) solves to **O(n log n)**, and the algorithm is **stable**. The cost is O(n) extra memory for the temporary merge buffer. Merge sort is the default in many functional languages and is the basis for *Timsort* (Python, Java, Android), which detects and exploits existing sorted runs.",
          ja: "**マージソート**は*分割統治*を適用します。配列を半分に分割し、各半分を再帰的にソートし、ソートされた2つの半分を1つにマージします。マージステップは両方の半分を左から右にスキャンし、常に小さい方の先頭要素を選択します — 単一の線形パスです。再帰式T(n) = 2T(n/2) + O(n)は**O(n log n)**に解け、アルゴリズムは**安定**です。コストは一時マージバッファのためのO(n)の追加メモリです。マージソートは多くの関数型言語のデフォルトであり、既存のソート済みランを検出して活用する*Timsort*（Python、Java、Android）の基盤となっています。",
        },
        {
          en: "**Quick sort** selects a *pivot*, partitions the array so that everything smaller than the pivot is on the left and everything larger is on the right, then recurses on each side. This page uses *median-of-three pivot selection* — comparing the first, middle, and last elements and using the median — which avoids the O(n²) worst case on already-sorted input. Average complexity is **O(n log n)** with very small constants (excellent cache locality), making it faster than merge sort in practice for random data. It is **not stable** and its worst-case remains O(n²) for adversarial inputs.",
          ja: "**クイックソート**は*ピボット*を選択し、ピボットより小さいものはすべて左に、大きいものはすべて右になるように配列を分割し、各側で再帰します。このページでは*3点中央値ピボット選択*を使用します — 最初、中央、最後の要素を比較して中央値を使用 — これによりソート済み入力でのO(n²)の最悪ケースを回避します。平均計算量は非常に小さな定数で**O(n log n)**（キャッシュ局所性が優れている）で、ランダムデータに対して実際にはマージソートより速くなります。**安定ではなく**、敵対的な入力に対する最悪ケースはO(n²)のままです。",
        },
        {
          en: "**Heap sort** turns the array into a *max-heap* (a binary tree stored in the array where every parent is ≥ both children) using Floyd's linear-time heapify, then repeatedly extracts the maximum and places it at the end of the sorted region. Each extraction requires a *sift-down* operation costing O(log n), for a total of **O(n log n)**. Heap sort is the only O(n log n) algorithm here that is also **in-place** (O(1) extra space) — though its cache access pattern is less friendly than quicksort's, making it slower in practice.",
          ja: "**ヒープソート**はフロイドの線形時間ヒープ構築を使って配列を*最大ヒープ*（すべての親が両方の子以上の二分木を配列に格納したもの）に変換し、最大値を繰り返し抽出してソート済み領域の末尾に配置します。各抽出にはO(log n)コストの*シフトダウン*操作が必要で、合計**O(n log n)**となります。ヒープソートは**インプレース**（O(1)の追加スペース）でもあるO(n log n)の唯一のアルゴリズムです — ただしキャッシュアクセスパターンがクイックソートより悪く、実際には遅くなります。",
        },
      ],
    },
    {
      title: {
        en: "Reading the visualisation",
        ja: "可視化の読み方",
      },
      paragraphs: [
        {
          en: "Each bar represents one element; height encodes its value. **Yellow** bars are the two elements currently being compared. **Red** bars are being written (a swap or copy just happened). **Green** bars have reached their final sorted position and will not move again. Use the speed slider and step buttons to scrub through the algorithm frame by frame. The *comparisons* and *writes* counters update live — try comparing bubble sort (many writes) against selection sort (few writes but always O(n²) comparisons).",
          ja: "各バーは一つの要素を表し、高さはその値をエンコードしています。**黄色**のバーは現在比較されている2つの要素です。**赤**のバーは書き込み中（スワップまたはコピーが発生した直後）です。**緑**のバーは最終的なソート済み位置に達しており、再び移動することはありません。速度スライダーとステップボタンを使って、アルゴリズムをフレームバイフレームでスクラブしてください。*比較回数*と*書き込み回数*カウンタはリアルタイムで更新されます — バブルソート（多くの書き込み）とセレクションソート（少ない書き込みだが常にO(n²)の比較）を比較してみてください。",
        },
      ],
    },
  ],
};
