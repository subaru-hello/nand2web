import type { DeepDiveContent } from "../deepdive/DeepDive";

export const hashTableDeepDive: DeepDiveContent = {
  sections: [
    {
      title: {
        en: "Hashing & the hash function",
        ja: "ハッシュ関数の仕組み",
      },
      paragraphs: [
        {
          en: "A **hash table** is a data structure that achieves average-case **O(1)** lookup, insert, and delete by mapping keys to array indices via a **hash function**. The core idea: instead of scanning an array linearly (O(n)) or performing a binary search on a sorted array (O(log n)), we compute an index directly from the key in O(1) time and jump straight to that slot.",
          ja: "**ハッシュテーブル**は、**ハッシュ関数**によってキーを配列インデックスに対応させることで、平均ケースで**O(1)**の検索・挿入・削除を実現するデータ構造です。線形スキャン（O(n)）やソート済み配列の二分探索（O(log n)）の代わりに、キーから直接インデックスをO(1)で計算してそのスロットに直接ジャンプします。",
        },
        {
          en: "This simulator uses a **polynomial rolling hash**: for a string key, each character's code point is multiplied by a power of 31 and accumulated. The result is taken modulo the bucket count. Polynomial hashes distribute well across the table and are easy to reason about — which is why they appear in Java's `String.hashCode()` and Python's built-in hash for strings.",
          ja: "このシミュレーターでは**多項式ローリングハッシュ**を使用しています。文字列キーの各文字のコードポイントを31のべき乗で乗算して累積し、バケット数でモジュロを取ります。多項式ハッシュはテーブル全体に均等に分散され、理解しやすいため、Javaの`String.hashCode()`やPythonの文字列の組み込みハッシュでも採用されています。",
        },
        {
          en: "A good hash function must be **deterministic** (same key → same index), **fast** (O(key length)), and **uniform** (spread keys evenly to minimize collisions). No hash function eliminates collisions entirely when the key space is larger than the table — that's where the *collision resolution strategy* comes in.",
          ja: "良いハッシュ関数は**決定論的**（同じキー → 同じインデックス）、**高速**（O(キー長)）、**均一**（衝突を最小化するためにキーを均等に分散）でなければなりません。キー空間がテーブルより大きい場合、どんなハッシュ関数も衝突を完全に排除することはできません — そこで*衝突解決戦略*が登場します。",
        },
      ],
    },
    {
      title: {
        en: "Chaining vs. open addressing",
        ja: "チェイニングとオープンアドレッシング",
      },
      paragraphs: [
        {
          en: "**Separate chaining** stores a linked list (or dynamic array) at each bucket. When two keys hash to the same bucket, they are appended to that bucket's chain. Lookup scans the chain linearly. With a uniform hash and load factor α = n/m (entries/buckets), average chain length is α and average lookup cost is **O(1 + α)**. Chaining handles high load factors gracefully and deletion is trivial — just remove from the chain.",
          ja: "**分離チェイニング**は各バケットに連結リスト（または動的配列）を格納します。2つのキーが同じバケットにハッシュされると、そのバケットのチェーンに追加されます。検索はチェーンを線形にスキャンします。均一なハッシュと負荷率α = n/m（エントリ数/バケット数）の場合、平均チェーン長はαで、平均ルックアップコストは**O(1 + α)**です。チェイニングは高い負荷率を優雅に処理でき、削除は簡単にチェーンから取り除くだけです。",
        },
        {
          en: "**Open addressing** stores all entries directly in the bucket array. When a slot is occupied, the algorithm *probes* — steps to the next candidate slot until it finds an empty one. **Linear probing** (used here) checks slots sequentially: `(hash + i) % m` for i = 0, 1, 2, … It has excellent cache performance because slots are adjacent in memory, but suffers from **primary clustering**: long runs of occupied slots form and worsen over time, raising average probe counts.",
          ja: "**オープンアドレッシング**はすべてのエントリをバケット配列に直接格納します。スロットが占有されている場合、アルゴリズムは*プローブ*します — 空のスロットが見つかるまで次の候補スロットへ進みます。**線形プロービング**（ここで使用）はスロットを順次チェックします：i = 0, 1, 2, … に対して `(hash + i) % m`。スロットがメモリ上で隣接しているため優れたキャッシュ性能を持ちますが、**一次クラスタリング**の問題があります：占有スロットの長い連続が形成され、時間とともに悪化し、平均プローブ数が増加します。",
        },
        {
          en: "The key trade-off: chaining tolerates load factors above 1.0 (more entries than buckets) at the cost of pointer-following cache misses. Open addressing needs the load factor kept below ~0.75 to avoid severe clustering, but stores everything contiguously — no extra allocations, friendlier to hardware prefetchers. Modern high-performance tables (Robin Hood hashing, Swiss tables in Rust's `HashMap`) use open addressing with smarter probe strategies.",
          ja: "主なトレードオフ：チェイニングはポインタ追跡のキャッシュミスを代償に負荷率1.0以上（バケット数よりエントリ数が多い状態）を許容します。オープンアドレッシングはひどいクラスタリングを避けるために負荷率を約0.75以下に保つ必要がありますが、すべてを連続して格納します — 追加のアロケーションなし、ハードウェアプリフェッチャーに優しい。現代の高性能テーブル（Rustの`HashMap`のRobin Hoodハッシュ、Swiss tables）はより賢いプローブ戦略でオープンアドレッシングを使用しています。",
        },
      ],
    },
    {
      title: {
        en: "Tombstones & deletion",
        ja: "トゥームストーンと削除",
      },
      paragraphs: [
        {
          en: "Deletion in open addressing is subtle. Simply marking a slot *empty* breaks the probe sequence: if key B was inserted after colliding with key A, removing A and marking its slot empty would make the search for B terminate prematurely — it would hit the empty slot and incorrectly report B as absent.",
          ja: "オープンアドレッシングでの削除は繊細です。単純にスロットを*空*としてマークするとプローブシーケンスが壊れます：キーBがキーAと衝突した後に挿入された場合、Aを削除してそのスロットを空としてマークすると、Bの検索が早期終了してしまいます — 空のスロットに当たり、Bが存在しないと誤って報告してしまいます。",
        },
        {
          en: 'The fix is a **tombstone**: a special marker that means "deleted, but keep probing". A probe sequence *skips* tombstones during lookup (treating them as occupied) and terminates only at a genuinely empty slot. On insert, the first tombstone encountered can be reused — saving space. The downside: tombstones accumulate over many deletes and degrade performance; a periodic **resize + rehash** clears them all.',
          ja: "解決策は**トゥームストーン**です：「削除済み、ただしプロービングを続行」を意味する特別なマーカーです。プローブシーケンスはルックアップ中にトゥームストーンを*スキップ*し（占有として扱い）、真に空のスロットでのみ終了します。挿入時に最初に遭遇したトゥームストーンを再利用できます — スペースを節約。欠点：トゥームストーンは多くの削除の後に蓄積し、パフォーマンスを低下させます。定期的な**リサイズ + リハッシュ**でトゥームストーンをすべてクリアします。",
        },
        {
          en: "Chaining avoids tombstones entirely — deletion is a standard linked-list node removal. This is one reason chaining is simpler to implement and reason about, even if open addressing can be faster in practice due to cache behavior.",
          ja: "チェイニングはトゥームストーンを完全に回避します — 削除は標準的な連結リストのノード削除です。これがチェイニングの実装と理解がより簡単な理由の一つです。キャッシュ動作により実際にはオープンアドレッシングの方が速い場合でも同様です。",
        },
      ],
    },
    {
      title: {
        en: "Load factor & amortized resize",
        ja: "負荷率と分散リサイズ",
      },
      paragraphs: [
        {
          en: "The **load factor** α = n/m (number of stored entries / number of buckets) is the central health metric of a hash table. As α grows, collision probability rises. For open addressing with linear probing, average probe count is approximately **1/(1-α)** for successful lookup — at α=0.5 it's ~2 probes, at α=0.9 it's ~10. The simulator triggers a resize when α exceeds **0.75** for open addressing and **1.0** for chaining.",
          ja: "**負荷率**α = n/m（格納されたエントリ数/バケット数）はハッシュテーブルの中心的な健全性指標です。αが増加するにつれて、衝突確率が上昇します。線形プロービングによるオープンアドレッシングでは、成功したルックアップの平均プローブ数は約**1/(1-α)**です — α=0.5で約2プローブ、α=0.9で約10プローブ。シミュレーターはオープンアドレッシングではαが**0.75**を超えると、チェイニングでは**1.0**を超えるとリサイズをトリガーします。",
        },
        {
          en: "Resizing allocates a larger table (typically **2× the old size**) and **rehashes** every live entry into the new table. This is an O(n) operation — but it happens infrequently enough that the *amortized* cost per insert remains **O(1)**. The argument: starting from an empty table of size m, the table resizes at sizes m, 2m, 4m, … — the total work is m + 2m + 4m + … + n = O(n) across n inserts, so O(1) per insert on average.",
          ja: "リサイズはより大きなテーブル（通常は**旧サイズの2倍**）を割り当て、すべてのライブエントリを新しいテーブルに**リハッシュ**します。これはO(n)の操作ですが、十分にまれにしか発生しないため、挿入ごとの*分散*コストは**O(1)**のままです。論拠：サイズmの空のテーブルから始めると、テーブルはサイズm、2m、4m、…でリサイズされます — 総作業量はn回の挿入に対してm + 2m + 4m + … + n = O(n)なので、平均して挿入ごとにO(1)です。",
        },
        {
          en: "The resize animation in this simulator shows the **before** and **after** snapshots side by side so you can see how entries scatter into new bucket positions. Open-addressing resize also **clears all tombstones** — they don't need to be carried over since all live entries are reinserted fresh. After a resize, performance resets to near-ideal for the same reason a house clean-up removes accumulated clutter.",
          ja: "このシミュレーターのリサイズアニメーションは**前**と**後**のスナップショットを並べて表示するので、エントリが新しいバケット位置にどのように散らばるかを確認できます。オープンアドレッシングのリサイズでは**すべてのトゥームストーンもクリア**されます — すべてのライブエントリが新しくリインサートされるため、持ち越す必要がありません。リサイズ後、蓄積した散らかりを家の大掃除で除去するのと同じ理由で、パフォーマンスはほぼ理想的な状態にリセットされます。",
        },
      ],
    },
  ],
};
