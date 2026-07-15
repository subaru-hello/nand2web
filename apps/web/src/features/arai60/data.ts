// Inline data for all 60 Arai60 LeetCode problems — author's own study material

export interface Problem {
  readonly num: number;
  readonly category_en: string;
  readonly category_ja: string;
  readonly title_en: string;
  readonly title_ja: string;
  readonly approach_ja: string;
  readonly approach_en: string;
  readonly time: string;
  readonly space: string;
  readonly code_lang: string;
  readonly code: string;
  readonly alt_ja: string;
  readonly alt_en: string;
  readonly points_ja: string;
  readonly points_en: string;
}

export const PROBLEMS: readonly Problem[] = [
  {
    num: 1,
    category_en: `Linked List`,
    category_ja: `連結リスト`,
    title_en: `Linked List Cycle`,
    title_ja: `連結リストの循環検出`,
    approach_ja: `Floyd's cycle detection（亀と兎）アルゴリズムを使う。遅いポインタ（亀）は1歩ずつ、速いポインタ（兎）は2歩ずつ進める。循環があれば、速いポインタが必ず遅いポインタに追いつく。循環がなければ、速いポインタが先に None に到達する。`,
    approach_en: `Use Floyd's cycle detection (tortoise and hare) algorithm. The slow pointer (tortoise) advances one step at a time while the fast pointer (hare) advances two steps at a time. If a cycle exists, the fast pointer will inevitably catch up to the slow pointer. If there is no cycle, the fast pointer reaches None first.`,
    time: `O(n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def hasCycle(head: ListNode) -> bool:
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
    alt_ja: `ハッシュセットを使う方法：訪問済みノードをハッシュセットに記録し、同じノードを再訪したら循環ありと判定する。時間計算量 O(n)、空間計算量 O(n)。ロジックは分かりやすいが、余分なメモリを使う。

def hasCycle_set(head: ListNode) -> bool:
    seen = set()
    curr = head
    while curr:
        if curr in seen:
            return True
        seen.add(curr)
        curr = curr.next
    return False`,
    alt_en: `HashSet approach: record visited nodes in a hash set, and if the same node is visited again, a cycle is detected. Time complexity O(n), space complexity O(n). The logic is easy to understand but uses extra memory.

def hasCycle_set(head: ListNode) -> bool:
    seen = set()
    curr = head
    while curr:
        if curr in seen:
            return True
        seen.add(curr)
        curr = curr.next
    return False`,
    points_ja: `・亀と兎（Floyd 法）は O(1) の追加メモリで判定できるのが強み。
・面接ではまず Floyd 法を説明し、補足としてハッシュセット法にも触れると良い。`,
    points_en: `・The tortoise-and-hare (Floyd's) algorithm is powerful because it requires only O(1) extra memory.
・In interviews, first explain Floyd's algorithm, then mention the hash-set approach as a supplement.`,
  },
  {
    num: 2,
    category_en: `Linked List`,
    category_ja: `連結リスト`,
    title_en: `Linked List Cycle II`,
    title_ja: `循環の開始ノードを探す`,
    approach_ja: `Floyd のアルゴリズムを拡張する。slow/fast が出会った後、片方を head に戻し、両方を1歩ずつ進めると循環の開始ノードで再度出会う。（数学的に、head→開始点の距離 と 出会った点→開始点の距離 が循環の長さを法として等しくなることを利用）`,
    approach_en: `Extend Floyd's algorithm. After slow and fast meet, reset one pointer to head and advance both one step at a time; they will meet again at the start of the cycle. (Mathematically, the distance from head to the cycle start equals the distance from the meeting point to the cycle start, modulo the cycle length.)`,
    time: `O(n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def detectCycle(head: ListNode):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            ptr = head
            while ptr is not slow:
                ptr = ptr.next
                slow = slow.next
            return ptr
    return None`,
    alt_ja: `ハッシュセットを使う方法：訪問済みノードを set に記録し、初めて重複して現れたノードが循環の開始点。時間 O(n)、空間 O(n)。`,
    alt_en: `HashSet approach: record visited nodes in a set; the first node that appears twice is the start of the cycle. Time O(n), space O(n).`,
    points_ja: ``,
    points_en: ``,
  },
  {
    num: 3,
    category_en: `Linked List`,
    category_ja: `連結リスト`,
    title_en: `Remove Duplicates from Sorted List`,
    title_ja: `ソート済みリストの重複削除`,
    approach_ja: `リストはソート済みなので、同じ値のノードは必ず隣り合っている。隣接するノードだけを比較すればよい。curr の値と curr.next の値が同じ場合は、重複している curr.next を読み飛ばし、curr.next を curr.next.next に繋ぎ直す。そうでなければ curr を1つ進める。一度の走査で重複をすべて削除できる。`,
    approach_en: `Because the list is sorted, duplicate-valued nodes are always adjacent. We only need to compare neighboring nodes. When curr.val equals curr.next.val, skip the duplicate by setting curr.next to curr.next.next. Otherwise advance curr by one. A single pass removes all duplicates.`,
    time: `O(n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def deleteDuplicates(head: ListNode) -> ListNode:
    curr = head
    while curr and curr.next:
        if curr.val == curr.next.val:
            curr.next = curr.next.next
        else:
            curr = curr.next
    return head`,
    alt_ja: `再帰版：まず次の部分を重複削除し、その後で今のノードと次のノードが同じ値なら今のノードをスキップする方法。時間計算量 O(n)、空間計算量 O(n)（再帰スタック）。

def deleteDuplicates_recursive(head: ListNode) -> ListNode:
    if not head or not head.next:
        return head
    head.next = deleteDuplicates_recursive(head.next)
    if head.val == head.next.val:
        return head.next
    return head`,
    alt_en: `Recursive version: first recursively remove duplicates from the rest of the list, then if the current node has the same value as the next node, skip the current node. Time O(n), space O(n) (recursion stack).

def deleteDuplicates_recursive(head: ListNode) -> ListNode:
    if not head or not head.next:
        return head
    head.next = deleteDuplicates_recursive(head.next)
    if head.val == head.next.val:
        return head.next
    return head`,
    points_ja: ``,
    points_en: ``,
  },
  {
    num: 4,
    category_en: `Linked List`,
    category_ja: `連結リスト`,
    title_en: `Remove Duplicates from Sorted List II`,
    title_ja: `重複ノードを全て削除`,
    approach_ja: `重複した値のノード群は1つも残さず削除する必要がある。先頭ノード自体が削除される可能性があるので dummy ノードを置く。prev / curr を進めながら、curr と curr.next が同値の間スキップし続け、1つでもスキップしたら prev.next を curr に繋ぐ。`,
    approach_en: `All nodes with duplicate values must be removed entirely. Since the head node itself may be deleted, use a dummy node. Advance prev and curr while curr and curr.next share the same value, skip all of them, and if any were skipped connect prev.next directly to curr.`,
    time: `O(n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def deleteDuplicates(head: ListNode) -> ListNode:
    dummy = ListNode(0, head)
    prev = dummy
    curr = head
    while curr:
        if curr.next and curr.val == curr.next.val:
            val = curr.val
            while curr and curr.val == val:
                curr = curr.next
            prev.next = curr
        else:
            prev = curr
            curr = curr.next
    return dummy.next`,
    alt_ja: `出現回数を数えて、1回だけの値を残す2パス方式：各値の出現回数を先に数え、出現回数が1の値だけを新しいリストに繋ぐ方法。時間計算量 O(n)、空間計算量 O(n)（カウント用ハッシュマップ）。

# 1パス目：出現回数を数える
count = {}
curr = head
while curr:
    count[curr.val] = count.get(curr.val, 0) + 1
    curr = curr.next

# 2パス目：出現回数が1の値だけを繋ぎ直す
dummy = ListNode(0)
tail = dummy
curr = head
while curr:
    if count[curr.val] == 1:
        tail.next = ListNode(curr.val)
        tail = tail.next
    curr = curr.next
return dummy.next`,
    alt_en: `Two-pass approach counting occurrences: first count how many times each value appears, then build a new list containing only values that appear exactly once. Time O(n), space O(n) (hash map for counts).

# Pass 1: count occurrences
count = {}
curr = head
while curr:
    count[curr.val] = count.get(curr.val, 0) + 1
    curr = curr.next

# Pass 2: keep only values with count == 1
dummy = ListNode(0)
tail = dummy
curr = head
while curr:
    if count[curr.val] == 1:
        tail.next = ListNode(curr.val)
        tail = tail.next
    curr = curr.next
return dummy.next`,
    points_ja: `・dummy ノードを使うことで、先頭ノードが削除されるケースも統一的に処理できる。
・重複している値は1つも残さないことに注意。`,
    points_en: `・Using a dummy node lets you handle the case where the head node is deleted uniformly.
・Note that nodes with duplicate values must be removed entirely — not even one copy is kept.`,
  },
  {
    num: 5,
    category_en: `Linked List`,
    category_ja: `連結リスト`,
    title_en: `Add Two Numbers`,
    title_ja: `連結リストでの筆算`,
    approach_ja: `2つの連結リストは各ノードが1桁を表し、下位桁から順に格納されている。両方を同時に辿りながら足し算し、繰り上がり（carry）を次の桁に持ち越す。長さが違う場合は片方を None（0扱い）として処理する。`,
    approach_en: `Each node in the two linked lists represents one digit stored in reverse order (least significant digit first). Traverse both lists simultaneously, add the digits along with any carry, and propagate the carry to the next position. When one list is shorter, treat the missing nodes as 0.`,
    time: `O(max(n, m))`,
    space: `O(max(n, m))`,
    code_lang: `python`,
    code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def addTwoNumbers(l1: ListNode, l2: ListNode) -> ListNode:
    dummy = ListNode()
    curr = dummy
    carry = 0
    while l1 or l2 or carry:
        v1 = l1.val if l1 else 0
        v2 = l2.val if l2 else 0
        carry, digit = divmod(v1 + v2 + carry, 10)
        curr.next = ListNode(digit)
        curr = curr.next
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    return dummy.next`,
    alt_ja: `再帰版：桁ごとの和とキャリーを計算し、次の桁を再帰呼び出しする。時間計算量は同じ O(n) だが、再帰スタックの空間 O(n) を使用。

def addTwoNumbersRecursive(l1: ListNode, l2: ListNode, carry=0):
    if not l1 and not l2 and carry == 0:
        return None
    v1 = l1.val if l1 else 0
    v2 = l2.val if l2 else 0
    carry, digit = divmod(v1 + v2 + carry, 10)
    node = ListNode(digit)
    next_l1 = l1.next if l1 else None
    next_l2 = l2.next if l2 else None
    node.next = addTwoNumbersRecursive(next_l1, next_l2, carry)
    return node`,
    alt_en: `Recursive version: compute the sum and carry for each digit and recurse for the next digit. Time complexity is the same O(n), but uses O(n) space for the recursion stack.

def addTwoNumbersRecursive(l1: ListNode, l2: ListNode, carry=0):
    if not l1 and not l2 and carry == 0:
        return None
    v1 = l1.val if l1 else 0
    v2 = l2.val if l2 else 0
    carry, digit = divmod(v1 + v2 + carry, 10)
    node = ListNode(digit)
    next_l1 = l1.next if l1 else None
    next_l2 = l2.next if l2 else None
    node.next = addTwoNumbersRecursive(next_l1, next_l2, carry)
    return node`,
    points_ja: ``,
    points_en: ``,
  },
  {
    num: 6,
    category_en: `Stack`,
    category_ja: `スタック`,
    title_en: `Valid Parentheses`,
    title_ja: `カッコの対応チェック`,
    approach_ja: `スタックを使う。開き括弧はスタックに push！閉じ括弧はスタックの一番上と対応するか確認して pop！最後にスタックが空なら有効（True）。`,
    approach_en: `Use a stack. Push opening brackets onto the stack. When a closing bracket is encountered, check if it matches the top of the stack and pop. If the stack is empty at the end, the string is valid (True).`,
    time: `O(n)`,
    space: `O(n)`,
    code_lang: `python`,
    code: `def isValid(s: str) -> bool:
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for ch in s:
        if ch in pairs:    # 閉じカッコのとき
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:              # 開きカッコのとき
            stack.append(ch)
    return not stack       # スタックが空なら有効`,
    alt_ja: `replace 方式（非推奨）：対応するペアを文字列から繰り返し削除して、空文字列になれば有効とする方法。素朴に実装すると最悪 O(n²) になることがある。

s = "([{}])" → 削除 "[]" → 削除 "" （空）→ 有効`,
    alt_en: `Replace approach (not recommended): repeatedly remove matching pairs from the string until it becomes empty or no more pairs can be removed. A naive implementation can degrade to O(n²) in the worst case.`,
    points_ja: `直近の開きカッコと対応するかを確認する問題は、スタックが最も自然で効率的！`,
    points_en: `For problems that check whether a closing bracket matches the most recent opening bracket, a stack is the most natural and efficient solution!`,
  },
  {
    num: 7,
    category_en: `Stack`,
    category_ja: `スタック`,
    title_en: `Reverse Linked List`,
    title_ja: `連結リストの反転`,
    approach_ja: `prev、curr の2ポインタを使う。curr.next を一時変数に退避してから矢印を prev に向け直し、prev と curr を1つずつ進める。`,
    approach_en: `Use two pointers, prev and curr. Save curr.next in a temporary variable, then reverse the arrow to point to prev, and advance both prev and curr by one step.`,
    time: `O(n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head: ListNode) -> ListNode:
    prev = None
    curr = head
    while curr:
        nxt = curr.next        # 次のノードを一時保存
        curr.next = prev       # 矢印を反転
        prev = curr            # prev を1つ進める
        curr = nxt             # curr を1つ進める
    return prev                # 最終的な先頭を返す`,
    alt_ja: `再帰版：reverseList(head.next) の戻り値（新しい先頭）を保持しつつ、head.next.next = head で矢印を逆転させる。計算量：時間 O(n) / 空間 O(n)（再帰スタック）。

def reverseListRecursive(head: ListNode) -> ListNode:
    if head is None or head.next is None:
        return head
    new_head = reverseListRecursive(head.next)
    head.next.next = head   # 矢印を反転
    head.next = None        # 元の next を None に
    return new_head`,
    alt_en: `Recursive version: carry the new head returned by reverseList(head.next), then set head.next.next = head to reverse the arrow. Complexity: time O(n) / space O(n) (recursion stack).

def reverseListRecursive(head: ListNode) -> ListNode:
    if head is None or head.next is None:
        return head
    new_head = reverseListRecursive(head.next)
    head.next.next = head   # reverse the arrow
    head.next = None        # set old next to None
    return new_head`,
    points_ja: ``,
    points_en: ``,
  },
  {
    num: 8,
    category_en: `Heap · Priority Queue`,
    category_ja: `ヒープ`,
    title_en: `Kth Largest Element in a Stream`,
    title_ja: `ストリーム中のk番目の大きさ`,
    approach_ja: `サイズkの最小ヒープを保持する。新しい値が来たら追加し、ヒープサイズがkを超えたら最小値を pop する。ヒープの頂点（最小値）が常に「k番目に大きい値」になる。`,
    approach_en: `Maintain a min-heap of size k. When a new value arrives, push it onto the heap; if the heap size exceeds k, pop the minimum. The top of the heap (the minimum value) always equals the k-th largest element.`,
    time: `O(n log k)`,
    space: `O(k)`,
    code_lang: `python`,
    code: `import heapq

class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.heap = nums
        heapq.heapify(self.heap)
        while len(self.heap) > k:
            heapq.heappop(self.heap)

    def add(self, val: int) -> int:
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]`,
    alt_ja: `毎回全体をソートする方法：毎回全体をソートしてk番目を取る方法。実装は単純だが、add ごとに O(n log n) かかり非効率。

class KthLargest_Sort:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.arr = sorted(nums, reverse=True)
    def add(self, val: int) -> int:
        self.arr.append(val)
        self.arr.sort(reverse=True)
        return self.arr[self.k - 1]`,
    alt_en: `Sort-everything approach: sort the entire array on every add call and return the k-th element. Simple to implement but O(n log n) per add call, which is inefficient.

class KthLargest_Sort:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.arr = sorted(nums, reverse=True)
    def add(self, val: int) -> int:
        self.arr.append(val)
        self.arr.sort(reverse=True)
        return self.arr[self.k - 1]`,
    points_ja: `・サイズkの最小ヒープを使うと、add ごとに O(log k) で k番目に大きい値を取得できる（効率的）。
・ヒープの頂点（最小値）が常に「k番目に大きい値」になる。
・全体ソートは実装は簡単だが、計算量が大きく非効率。
・最小ヒープ（サイズk）＝「上位k個の値だけを保持」→ 先頭（最小）がk番目に大きい値！`,
    points_en: `・Using a min-heap of size k allows retrieval of the k-th largest value in O(log k) per add call (efficient).
・The top (minimum) of the heap always equals the k-th largest value.
・Sorting everything is simple to implement but computationally expensive and inefficient.
・Min-heap (size k) = "keep only the top-k values" → the top (minimum) is the k-th largest!`,
  },
  {
    num: 9,
    category_en: `Heap · Priority Queue`,
    category_ja: `ヒープ`,
    title_en: `Top K Frequent Elements`,
    title_ja: `出現頻度トップk`,
    approach_ja: `Counter で出現回数を数え、heapq.nlargest でサイズkの上位k件を取り出す。より高速にはバケットソート（出現回数をインデックスにした配列）で O(n) にできる。`,
    approach_en: `Count frequencies with Counter, then use heapq.nlargest to extract the top-k elements by frequency. For better performance, use bucket sort (an array indexed by frequency) to achieve O(n).`,
    time: `O(n log k)`,
    space: `O(n)`,
    code_lang: `python`,
    code: `import heapq
from collections import Counter

def topKFrequent(nums: list[int], k: int) -> list[int]:
    count = Counter(nums)
    return heapq.nlargest(k, count.keys(), key=count.get)`,
    alt_ja: `バケットソート方式（より高速）：出現回数をインデックスにしたバケット配列を作り、大きい出現回数のバケットから順に要素を取り出し、合計k個になるまで集める。時間計算量 O(n)、空間計算量 O(n)。

from collections import Counter

def topKFrequent_bucket(nums: list[int], k: int) -> list[int]:
    count = Counter(nums)
    n = len(nums)
    buckets = [[] for _ in range(n + 1)]  # インデックス = 出現回数
    for num, freq in count.items():
        buckets[freq].append(num)

    res = []
    for freq in range(n, 0, -1):
        for num in buckets[freq]:
            res.append(num)
            if len(res) == k:
                return res

    return res`,
    alt_en: `Bucket sort approach (faster): create a bucket array indexed by frequency, then collect elements from the highest-frequency buckets until k elements are gathered. Time O(n), space O(n).

from collections import Counter

def topKFrequent_bucket(nums: list[int], k: int) -> list[int]:
    count = Counter(nums)
    n = len(nums)
    buckets = [[] for _ in range(n + 1)]  # index = frequency
    for num, freq in count.items():
        buckets[freq].append(num)

    res = []
    for freq in range(n, 0, -1):
        for num in buckets[freq]:
            res.append(num)
            if len(res) == k:
                return res

    return res`,
    points_ja: `k が非常に小さい場合はヒープ、そうでない場合はバケットソートが有利！`,
    points_en: `When k is very small, the heap approach is advantageous; otherwise bucket sort is preferred!`,
  },
  {
    num: 10,
    category_en: `Heap · Priority Queue`,
    category_ja: `ヒープ`,
    title_en: `Find K Pairs with Smallest Sums`,
    title_ja: `和が小さい順のペア`,
    approach_ja: `両方の配列はソート済み。(0, 0) から始め、ヒープに候補ペアを入れながら取り出すたびに次の候補（(i, j+1) など）を追加していく。全組み合わせ（n*m通り）を作らずに済む。`,
    approach_en: `Both arrays are sorted. Start from (0, 0), pushing candidate pairs onto a min-heap; each time a pair is popped, push the next candidate (e.g. (i, j+1)). This avoids generating all n*m combinations.`,
    time: `O(k log k)`,
    space: `O(k)`,
    code_lang: `python`,
    code: `import heapq

def kSmallestPairs(nums1, nums2, k):
    if not nums1 or not nums2:
        return []
    heap = [(nums1[i] + nums2[0], i, 0)
            for i in range(min(k, len(nums1)))]
    heapq.heapify(heap)
    result = []
    while heap and len(result) < k:
        total, i, j = heapq.heappop(heap)
        result.append([nums1[i], nums2[j]])
        if j + 1 < len(nums2):
            heapq.heappush(heap, (nums1[i] + nums2[j + 1], i, j + 1))
    return result`,
    alt_ja: `全てのペアを作ってソートする方法：全ペア（n*m通り）を作ってソートし、先頭k個を取る方法。実装は単純だが、時間・空間ともに非効率。時間 O(nm log(nm))、空間 O(nm)。

pairs = [[a, b] for a in nums1 for b in nums2]
pairs.sort(key=lambda x: x[0] + x[1])
return pairs[:k]`,
    alt_en: `Brute-force approach: generate all n*m pairs, sort them, and take the first k. Simple to implement but inefficient in both time and space. Time O(nm log(nm)), space O(nm).

pairs = [[a, b] for a in nums1 for b in nums2]
pairs.sort(key=lambda x: x[0] + x[1])
return pairs[:k]`,
    points_ja: ``,
    points_en: ``,
  },
  {
    num: 11,
    category_en: `HashMap`,
    category_ja: `ハッシュマップ`,
    title_en: `Two Sum`,
    title_ja: `2数の和`,
    approach_ja: `配列を1回走査しながら、「target – 現在の値」がこれまでに見た値の中にあるかをハッシュマップで確認する。`,
    approach_en: `Scan the array once. For each element, check whether its complement (target minus current value) already exists in a hash map of previously seen values.`,
    time: `O(n)`,
    space: `O(n)`,
    code_lang: `python`,
    code: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    alt_ja: `1. 総当たり（二重ループ）: すべてのペアを試して和が target になるか確認する。時間計算量 O(n^2)、空間計算量 O(1)。
2. ソート + 2ポインタ: 配列を値でソートし、左端と右端の2ポインタで和を調整する。時間計算量 O(n log n)（ソート）、空間計算量 O(1)（またはO(n)でインデックスも保持）。※ 元のインデックスを返す必要があるため、（値、インデックス）のペアでソートするなどの工夫が必要。`,
    alt_en: `1. Brute force (nested loop): Try every pair to see if their sum equals target. Time O(n^2), space O(1).
2. Sort + two pointers: Sort the array by value and adjust the sum using left/right pointers. Time O(n log n) (sort), space O(1) or O(n) if indices are preserved. Note: since original indices must be returned, extra bookkeeping (e.g., sorting (value, index) pairs) is required.`,
    points_ja: `ハッシュマップに「値 → インデックス」を保存しながら1パスで解く。補数が見つかった瞬間に答えを返すことでO(n)を達成する。`,
    points_en: `Store value-to-index mappings in a hash map while doing a single pass. Return the answer the moment the complement is found, achieving O(n) time.`,
  },
  {
    num: 12,
    category_en: `HashMap`,
    category_ja: `ハッシュマップ`,
    title_en: `Group Anagrams`,
    title_ja: `アナグラムのグループ化`,
    approach_ja: `各単語をソートした文字列を「署名（キー）」として使い、同じ署名を持つ単語をハッシュマップの同じリストにまとめる（ソートベースの署名）。`,
    approach_en: `Use the sorted version of each word as a 'signature' (key). Group words sharing the same signature into the same list in a hash map.`,
    time: `O(n * k log k)`,
    space: `O(n * k)`,
    code_lang: `python`,
    code: `from collections import defaultdict

def groupAnagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))  # ソートした文字列を署名にする
        groups[key].append(s)
    return list(groups.values())`,
    alt_ja: `出現回数ベースの署名: ソートの代わりに、26文字の出現回数を数えたタプルをキーにする方法。文字種が限定される（例: 小文字英字のみ）の場合はこちらの方が高速。時間計算量 O(n * k)（ソート不要）、空間計算量 O(n * k)。

\`\`\`python
from collections import defaultdict

def groupAnagrams_count(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        count = [0] * 26
        for ch in s:
            count[ord(ch) - ord('a')] += 1
        key = tuple(count)  # 出現回数のタプルを署名にする
        groups[key].append(s)
    return list(groups.values())
\`\`\``,
    alt_en: `Frequency-count signature: instead of sorting, use a tuple of 26 character counts as the key. Faster when the character set is limited (e.g., lowercase English only). Time O(n * k) (no sort), space O(n * k).`,
    points_ja: `ソートベース: 実装が簡単で文字種を問わない。出現回数ベース: 文字種が限定される場合に高速。※ n = 単語数、k = 平均文字数、文字種が26種類（小文字英字）の場合の目安。文字種が非常に多い（ユニコード全般など）場合は、ソートベースの方が適していることがある。`,
    points_en: `Sort-based: simple to implement and works for any character set. Frequency-based: faster when the character set is restricted. For very large character sets (e.g., full Unicode), the sort-based approach may be preferable.`,
  },
  {
    num: 13,
    category_en: `HashMap`,
    category_ja: `ハッシュマップ`,
    title_en: `Intersection of Two Arrays`,
    title_ja: `2つの配列の共通部分`,
    approach_ja: `両方の配列をsetに変換し、集合の共通部分（&演算子）を取る。`,
    approach_en: `Convert both arrays to sets and return their intersection using the & operator.`,
    time: `O(n + m)`,
    space: `O(n + m)`,
    code_lang: `python`,
    code: `def intersection(nums1: list[int], nums2: list[int]) -> list[int]:
    return list(set(nums1) & set(nums2))`,
    alt_ja: `ソート + 2ポインタ: 両方をソートしてから2ポインタで共通要素を探す方法。時間 O(n log n + m log m)、空間 O(1)（出力を除く）。メモリを節約したい場合に有効。

\`\`\`python
def intersection_two_pointer(nums1: list[int], nums2: list[int]) -> list[int]:
    nums1.sort()
    nums2.sort()
    i = j = 0
    res = []
    while i < len(nums1) and j < len(nums2):
        if nums1[i] == nums2[j]:
            if not res or res[-1] != nums1[i]:  # 重複を避ける
                res.append(nums1[i])
            i += 1
            j += 1
        elif nums1[i] < nums2[j]:
            i += 1
        else:
            j += 1
    return res
\`\`\``,
    alt_en: `Sort + two pointers: sort both arrays, then find common elements with two pointers. Time O(n log n + m log m), space O(1) excluding output. Useful when memory is a concern.`,
    points_ja: `set変換による集合演算が最もシンプル。重複は自動的に排除される。メモリ効率が求められる場合はソート + 2ポインタを使う。`,
    points_en: `Converting to sets and using set intersection is the simplest approach; duplicates are eliminated automatically. Use sort + two pointers when memory efficiency matters.`,
  },
  {
    num: 14,
    category_en: `HashMap`,
    category_ja: `ハッシュマップ`,
    title_en: `Unique Email Addresses`,
    title_ja: `メールアドレスの正規化`,
    approach_ja: `各メールを「@」で分割し、ローカル部分の「+」以降を切り捨て、ドットを除去して正規化する。正規化後のアドレスをsetに追加し、setのサイズが答え。`,
    approach_en: `For each email, split on '@', strip everything after '+' from the local part, remove dots, then add the normalized address to a set. The set's size is the answer.`,
    time: `O(n * L)`,
    space: `O(n * L)`,
    code_lang: `python`,
    code: `def numUniqueEmails(emails: list[str]) -> int:
    unique = set()
    for email in emails:
        local, domain = email.split('@')  # "@" で分割
        local = local.split('+')[0].replace('.', '')  # +以降を切り捨て、ドット除去
        unique.add(local + '@' + domain)  # 正規化したアドレスをsetに追加
    return len(unique)  # setのサイズが答え`,
    alt_ja: `正規表現を使う方法: re.subを使って、ドット除去と+以降の切り捨てを一度に行う方法。ロジックは同じで、書き方が異なるだけ。

\`\`\`python
import re

def numUniqueEmailsRegex(emails: list[str]) -> int:
    unique = set()
    for email in emails:
        local, domain = email.split('@')
        # ドットを除去し、+以降を切り捨て（例: "a.b+c" -> "ab"）
        local = re.sub(r'\\.', '', local)  # 実際は下の1行で十分
        # より簡潔には次の1行でも可:
        local = re.sub(r'\\..*\\+.*', '', local).split('+')[0]
        unique.add(local + '@' + domain)
    return len(unique)
\`\`\``,
    alt_en: `Using regular expressions: use re.sub to remove dots and strip the '+' suffix in one step. The logic is identical; only the syntax differs.`,
    points_ja: `・email.split('@')でローカル部分とドメイン部分に分割
・local.split('+')[0] で「+」以降を切り捨て
・.replace('.', '') でドットを除去
・setにより重複を自動的に排除し、len(unique)を返す
・異なるドメイン（@以降）が異なれば別のアドレスとして扱う`,
    points_en: `Split on '@' to separate local and domain parts. Use split('+')[0] to strip the '+' suffix, and replace('.', '') to remove dots. The set automatically deduplicates; return its length. Emails with different domains are always treated as distinct.`,
  },
  {
    num: 15,
    category_en: `HashMap`,
    category_ja: `ハッシュマップ`,
    title_en: `First Unique Character in a String`,
    title_ja: `最初の一意な文字`,
    approach_ja: `Counterで各文字の出現回数を数える。文字列を再度先頭から走査し、出現回数が1の最初の文字のインデックスを返す。`,
    approach_en: `Count the frequency of each character using Counter. Scan the string again from the start and return the index of the first character whose count is 1.`,
    time: `O(n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `from collections import Counter

def firstUniqChar(s: str) -> int:
    count = Counter(s)
    for i, ch in enumerate(s):
        if count[ch] == 1:
            return i
    return -1`,
    alt_ja: `最初と最後の出現位置を記録する方法: 各文字の「最初の出現位置」と「最後の出現位置」を記録し、最初と最後が同じ位置（＝1回だけ出現）である文字の中で、最もインデックスが小さいものを返す。時間計算量 O(n)、空間計算量 O(1)（アルファベットの種類数は定数）。`,
    alt_en: `Record first and last occurrence positions: for each character, track its first and last occurrence index. Among characters where first == last (i.e., appears exactly once), return the one with the smallest index. Time O(n), space O(1).`,
    points_ja: `Counterを使った2パス法が最もシンプル。空間計算量はアルファベットの種類数が定数（最大26文字）なのでO(1)。存在しない場合は-1を返す。`,
    points_en: `The two-pass approach with Counter is the simplest. Space is O(1) because the alphabet size is constant (at most 26 characters). Return -1 if no unique character exists.`,
  },
  {
    num: 16,
    category_en: `HashMap`,
    category_ja: `ハッシュマップ`,
    title_en: `Subarray Sum Equals K`,
    title_ja: `累積和がkになる部分配列`,
    approach_ja: `累積和(prefix sum)を使う。区間[i+1, j]の和は prefixSum[j] - prefixSum[i] なので、「現在の累積和 – k」が過去に何回出現したかをハッシュマップで数える。`,
    approach_en: `Use prefix sums. The sum of subarray [i+1, j] equals prefixSum[j] - prefixSum[i], so count how many times (current prefix sum - k) has appeared before, using a hash map.`,
    time: `O(n)`,
    space: `O(n)`,
    code_lang: `python`,
    code: `from collections import defaultdict

def subarraySum(nums: list[int], k: int) -> int:
    count = defaultdict(int)
    count[0] = 1
    prefix_sum = 0
    result = 0
    for num in nums:
        prefix_sum += num
        result += count[prefix_sum - k]
        count[prefix_sum] += 1
    return result`,
    alt_ja: `総当たり（二重ループ）: すべての開始位置 i から終端位置 j までの和を計算して、k と等しいものを数える。時間 O(n^2)、空間 O(1)。n が小さい場合のみ現実的。

\`\`\`python
def subarraySum_bruteforce(nums: list[int], k: int) -> int:
    n = len(nums)
    result = 0
    for i in range(n):
        s = 0
        for j in range(i, n):
            s += nums[j]
            if s == k:
                result += 1
    return result
\`\`\``,
    alt_en: `Brute force (nested loop): compute the sum of every subarray from i to j and count those equal to k. Time O(n^2), space O(1). Only practical for small n.`,
    points_ja: `count[0] = 1 から始める（空の前置和が0で存在することを表す）。現在の cumulative sum から k を引いた値がハッシュマップにあれば、その回数分だけ答えに加算する。負の値も扱える汎用的な手法。`,
    points_en: `Initialize count[0] = 1 to represent the empty prefix. For each position, if (prefix_sum - k) exists in the map, add its count to the result. This approach handles negative numbers as well.`,
  },
  {
    num: 17,
    category_en: `Graph · BFS/DFS`,
    category_ja: `グラフ`,
    title_en: `Number of Islands`,
    title_ja: `島の数を数える`,
    approach_ja: `グリッドを走査し、未訪問の陸地(1)を見つけたらBFSまたはDFSで隣接する陸地を全て訪問済みにする。これを1回行うごとに島の数を1つ増やす。`,
    approach_en: `Scan the grid; whenever an unvisited land cell ('1') is found, use BFS or DFS to mark all connected land cells as visited. Increment the island count once per traversal.`,
    time: `O(rows * cols)`,
    space: `O(rows * cols)`,
    code_lang: `python`,
    code: `def numIslands(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`,
    alt_ja: `BFS（幅優先探索）: キューを使って4方向に広げていく。再帰の深さ制限を回避でき、大きなグリッドでも安全。
Union-Find（素集合）: 陸地の各セルをノードとし、隣接する陸地同士をunionしていく。最後に親の数（代表元の数）が島の数。
その他の工夫: グリッドを破壊せず visited 配列を使ってもよい。巨大グリッドでは再帰よりBFSを推奨（スタックオーバーフロー回避）。`,
    alt_en: `BFS: use a queue to expand in 4 directions, avoiding recursion depth limits — safe for large grids.
Union-Find (Disjoint Set): treat each land cell as a node; union adjacent land cells. The final number of distinct roots equals the island count.
Other tips: use a separate visited array to avoid mutating the grid. Prefer BFS over recursion for very large grids to prevent stack overflow.`,
    points_ja: `DFSで訪問済みセルを '0' に書き換えることで再訪問を防ぐ。境界外や海(0)は探索しない。すべての陸地が訪問済み(0に変更)になるまで探索を続ける。`,
    points_en: `Mark visited cells as '0' during DFS to prevent revisiting. Skip out-of-bounds cells and water ('0'). Continue until all land cells are visited.`,
  },
  {
    num: 18,
    category_en: `Graph · BFS/DFS`,
    category_ja: `グラフ`,
    title_en: `Max Area of Island`,
    title_ja: `島の面積の最大値`,
    approach_ja: `問題17と同じ探索方法で、1つの島を訪問する際にそのマス数を数えて返すようにし、全体の最大値を追跡する。`,
    approach_en: `Use the same DFS/BFS traversal as problem 17, but count and return the number of cells in each island. Track the global maximum.`,
    time: `O(rows*cols)`,
    space: `O(rows*cols)`,
    code_lang: `python`,
    code: `def maxAreaOfIsland(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != 1:
            return 0
        grid[r][c] = 0
        return 1 + dfs(r+1, c) + dfs(r-1, c) + dfs(r, c+1) + dfs(r, c-1)

    return max(dfs(r, c) for r in range(rows) for c in range(cols))`,
    alt_ja: `BFS: DFSの代わりにBFSを使って、キューで島を広げながらマス数をカウントする方法。結果もアプローチもDFSと同等。

疑似コード:
for 各マス (r, c):
    if grid[r][c] == 1:
        queue = [(r, c)]
        grid[r][c] = 0
        area = 0
        while queue:
            r, c = queue.pop(0)
            area += 1
            4方向の隣接マスが1なら追加
        max_area = max(max_area, area)`,
    alt_en: `BFS: use a queue to expand the island while counting cells. The result is equivalent to DFS.`,
    points_ja: `DFSの戻り値に面積を持たせる点が問題17との違い。grid[r][c] = 0 で訪問済みにしながら、再帰的に面積を合計して返す。`,
    points_en: `The key difference from problem 17 is returning the area from DFS. Mark cells as 0 to avoid revisiting while accumulating the area recursively.`,
  },
  {
    num: 19,
    category_en: `Graph · BFS/DFS`,
    category_ja: `グラフ`,
    title_en: `Number of Connected Components in an Undirected Graph`,
    title_ja: `連結成分の数`,
    approach_ja: `Union-Find（素集合）が典型解法。各辺についてunionを行い、実際に結合が起きた回数だけ成分数を減らす。隣接リストを作ってBFS/DFSで訪問済み管理する方法でも同じ結果になる。`,
    approach_en: `Union-Find is the canonical approach. Process each edge with union; each successful merge decrements the component count from n. BFS/DFS with an adjacency list and visited array produces the same result.`,
    time: `O(V + E)`,
    space: `O(V + E)`,
    code_lang: `python`,
    code: `def countComponents(n: int, edges: list[list[int]]) -> int:
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(x, y):
        rx, ry = find(x), find(y)
        if rx != ry:
            parent[rx] = ry
            return True
        return False

    count = n
    for a, b in edges:
        if union(a, b):
            count -= 1
    return count`,
    alt_ja: `解法2: BFS / DFS（グラフ探索）: 隣接リストを作り、未訪問のノードから探索を開始して各連結成分を数える。

\`\`\`python
from collections import deque

def countComponents(n: int, edges: list[list[int]]) -> int:
    graph = [[] for _ in range(n)]
    for a, b in edges:
        graph[a].append(b)
        graph[b].append(a)

    visited = [False] * n
    count = 0

    for i in range(n):
        if not visited[i]:
            count += 1
            q = deque([i])
            visited[i] = True
            while q:
                v = q.popleft()
                for nei in graph[v]:
                    if not visited[nei]:
                        visited[nei] = True
                        q.append(nei)
    return count
\`\`\`
比較: Union-Find は実装がやや複雑だが高速（経路圧縮により非常に効率的）、BFS/DFSは実装が直感的でグラフの構造を直接探索する。`,
    alt_en: `BFS/DFS approach: build an adjacency list, start a BFS/DFS from each unvisited node, and increment the count each time a new traversal is started.
Comparison: Union-Find is slightly more complex to implement but very fast (path compression); BFS/DFS is more intuitive and directly explores graph structure.`,
    points_ja: `Union-Findは経路圧縮（path compression）により非常に効率的。成分数を n から始め、結合が起きるたびに1減らすことでカウントする。辺が多い大規模グラフでもUnion-Findが高速に動作する。`,
    points_en: `Union-Find with path compression is highly efficient. Start with count = n and decrement for each successful union. Union-Find excels on large graphs with many edges.`,
  },
  {
    num: 20,
    category_en: `Graph · BFS/DFS`,
    category_ja: `グラフ`,
    title_en: `Word Ladder`,
    title_ja: `単語のはしご (BFS)`,
    approach_ja: `単語をノード、1文字違いの単語同士をエッジとみなしたグラフのBFS。開始単語から層（レベル）ごとに広げ、終了単語に到達した層の深さが最短変換回数。各単語の26文字それぞれへの置き換え候補を辞書集合と照合して隣接単語を見つける。`,
    approach_en: `Model the problem as a graph where each word is a node and edges connect words differing by one letter. Run BFS from beginWord level by level; the depth at which endWord is first reached is the minimum number of transformations. Find neighbors by trying all 26 letter substitutions at each position and checking against the word set.`,
    time: `O(M^2 * N)`,
    space: `O(M * N)`,
    code_lang: `python`,
    code: `from collections import deque

def ladderLength(beginWord: str, endWord: str, wordList: list[str]) -> int:
    word_set = set(wordList)
    if endWord not in word_set:
        return 0
    queue = deque([(beginWord, 1)])
    while queue:
        word, steps = queue.popleft()
        if word == endWord:
            return steps
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                next_word = word[:i] + c + word[i+1:]
                if next_word in word_set:
                    word_set.remove(next_word)
                    queue.append((next_word, steps + 1))
    return 0`,
    alt_ja: `双方向BFS (bidirectional BFS): 開始単語側と終了単語側から同時にBFSを行い、探索が衝突した時点で終了。探索範囲が大幅に減り、実上かなり高速になる。計算量のオーダーは同じだが定数倍が大きく改善する。双方向BFSのメリット: 探索ノード数が指数的に減少、特に単語数が多いときに効果大。`,
    alt_en: `Bidirectional BFS: run BFS simultaneously from both beginWord and endWord, stopping when the two frontiers meet. The search space shrinks dramatically in practice — same asymptotic complexity but much smaller constant factor. Especially effective when the word list is large.`,
    points_ja: `endWordが辞書にない場合は即座に0を返す。訪問済み単語をword_setから削除することで再訪問を防ぐ。各ポジションに26文字を試して隣接単語を生成する（O(M)のコスト）。到達できない場合は0を返す。`,
    points_en: `Return 0 immediately if endWord is not in the word set. Remove visited words from word_set to prevent revisiting. Generate neighbors by substituting all 26 letters at each position (O(M) per word). Return 0 if endWord is unreachable.`,
  },
  {
    num: 21,
    category_en: `Tree · BT · BST`,
    category_ja: `木`,
    title_en: `Maximum Depth of Binary Tree`,
    title_ja: `二分木の最大深さ`,
    approach_ja: `各ノードについて、左部分木の最大深さと右部分木の最大深さの大きい方に 1 を足して返す。空のノード（None）の深さは 0。`,
    approach_en: `For each node, return 1 plus the greater of the maximum depths of the left and right subtrees. The depth of an empty node (None) is 0.`,
    time: `O(n)`,
    space: `O(h)`,
    code_lang: `python`,
    code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def maxDepth(root: TreeNode) -> int:
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
    alt_ja: `BFS（レベル順探索）: レベルごとにキューでノードを処理し、レベル数を数える反復法。再帰の深さ制限を避けたい場合に有効。ルートをキューに入れ、キューが空になるまでそのレベルのノード数だけ取り出し、子ノードをキューに入れる。1 レベル処理するごとに深さを 1 増やす。時間計算量 O(n)、空間計算量 O(n)（最大幅分のキュー）。`,
    alt_en: `BFS (level-order traversal): An iterative method that processes nodes level by level using a queue and counts the number of levels. Useful when you want to avoid recursion depth limits. Enqueue the root, then repeatedly dequeue all nodes at the current level, enqueue their children, and increment the depth counter. Time O(n), space O(n) (queue holds at most the widest level).`,
    points_ja: `再帰（DFS）では各ノードを 1 回ずつ訪問するため時間計算量は O(n)。空間計算量は再帰スタックの深さに比例し O(h)（最悪ケースの片側に偏った木では O(n)）。BFS では最大幅分のキューを保持するため空間計算量は O(n)。`,
    points_en: `In the recursive (DFS) approach, each node is visited once, giving O(n) time. Space is O(h) for the recursion stack where h is the tree height (O(n) worst case for a skewed tree). BFS holds up to the widest level in the queue, so space is O(n).`,
  },
  {
    num: 22,
    category_en: `Tree · BT · BST`,
    category_ja: `木`,
    title_en: `Minimum Depth of Binary Tree`,
    title_ja: `二分木の最小深さ`,
    approach_ja: `最小深さは「ルートから最も近い葉ノードまでの距離」。片方の子がない場合は、もう片方の深さを使う必要がある。単純に min(left, right) + 1 にすると、存在しない枝を 0 とみなしてしまい、間違えることがある。そのため、左の子だけがある場合は右部分木を無視して 1 + minDepth(root.right)、右の子だけがある場合は 1 + minDepth(root.left) とする。`,
    approach_en: `The minimum depth is the distance from the root to the nearest leaf node. When only one child exists, you must use the depth of that child rather than taking the minimum with 0. Simply computing min(left, right) + 1 would treat the missing branch as depth 0, which is incorrect. Therefore, if only the left child exists, ignore the right subtree and return 1 + minDepth(root.right), and vice versa.`,
    time: `O(n)`,
    space: `O(h)`,
    code_lang: `python`,
    code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def minDepth(root: TreeNode) -> int:
    if not root:
        return 0
    if not root.left:
        return 1 + minDepth(root.right)
    if not root.right:
        return 1 + minDepth(root.left)
    return 1 + min(minDepth(root.left), minDepth(root.right))`,
    alt_ja: `BFS（幅優先探索）: レベルごとにノードを探索し、最初に葉ノード（子が両方ないノード）に到達したときのレベルを返す。最短距離を求める問題では DFS より早期終了できることが多い。時間計算量 O(n)（最悪）、空間計算量 O(n)（最大幅分のキュー）。`,
    alt_en: `BFS (breadth-first search): Traverse nodes level by level and return the level at which the first leaf node (a node with no children) is reached. For shortest-path problems, BFS can terminate earlier than DFS in many cases. Time O(n) worst case, space O(n) for the queue.`,
    points_ja: `片方の子がない場合に min を単純に使うと誤った答えになる。存在しない枝の深さを 0 として扱わないよう、各ケースを明示的に処理することがポイント。`,
    points_en: `Using a simple min when only one child exists yields the wrong answer. The key point is to handle each case explicitly so that a missing branch is never treated as having depth 0.`,
  },
  {
    num: 23,
    category_en: `Tree · BT · BST`,
    category_ja: `木`,
    title_en: `Merge Two Binary Trees`,
    title_ja: `2つの二分木のマージ`,
    approach_ja: `2つの木を同時に再帰的に辿り、両方のノードがあれば値を足し、片方だけあればそのまま使う。`,
    approach_en: `Traverse both trees simultaneously with recursion. If both nodes exist, sum their values. If only one exists, use it as-is.`,
    time: `O(min(n, m))`,
    space: `O(min(n, m))`,
    code_lang: `python`,
    code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def mergeTrees(root1: TreeNode, root2: TreeNode) -> TreeNode:
    if not root1:
        return root2
    if not root2:
        return root1
    merged = TreeNode(root1.val + root2.val)
    merged.left = mergeTrees(root1.left, root2.left)
    merged.right = mergeTrees(root1.right, root2.right)
    return merged`,
    alt_ja: `反復法（スタック）: スタックを使い、2つの木のノードのペアを管理しながら走査する。再帰の代わりに明示的なスタックを使うだけで、ロジックは同じ。空のスタックに (root1, root2) を push し、スタックからペアを pop して処理する。両方 None なら何もしない、片方だけならそのノードをそのまま結果に接続、両方あれば値を足した新ノードを作り左右の子のペアをスタックに push する。スタックが空になるまで繰り返す。`,
    alt_en: `Iterative approach (stack): Manage pairs of nodes from both trees on a stack. The logic is the same as recursion but uses an explicit stack instead. Push (root1, root2) onto the stack; for each popped pair, if both are None do nothing, if only one exists attach it directly to the result, if both exist create a new node with the sum and push the child pairs. Repeat until the stack is empty.`,
    points_ja: `n = root1 のノード数、m = root2 のノード数。同時に存在する部分（重なる部分）のノード数が最大でも min(n, m) 個なので、時間・空間ともに O(min(n, m))。再帰の深さ制限を避けたい場合は反復法が有効。`,
    points_en: `n = number of nodes in root1, m = number of nodes in root2. The overlapping portion has at most min(n, m) nodes, so both time and space are O(min(n, m)). The iterative approach is useful when you want to avoid recursion depth limits.`,
  },
  {
    num: 24,
    category_en: `Tree · BT · BST`,
    category_ja: `木`,
    title_en: `Convert Sorted Array to Binary Search Tree`,
    title_ja: `ソート配列からBSTを構築`,
    approach_ja: `ソート済み配列の中央値を根にすると自然にバランスの取れたBSTになる。左半分・右半分をそれぞれ再帰的に処理する。`,
    approach_en: `Choosing the middle element of the sorted array as the root naturally produces a balanced BST. Recursively apply the same process to the left and right halves.`,
    time: `O(n)`,
    space: `O(log n)`,
    code_lang: `python`,
    code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def sortedArrayToBST(nums: list[int]) -> TreeNode:
    if not nums:
        return None
    mid = len(nums) // 2
    root = TreeNode(nums[mid])
    root.left = sortedArrayToBST(nums[:mid])
    root.right = sortedArrayToBST(nums[mid+1:])
    return root`,
    alt_ja: `インデックスを使う方法: 配列をスライスでコピーせず、インデックス（left, right）だけを渡す方法。時間 O(n) は同じだが、配列コピーのオーバーヘッドがなくなり実用上高速。`,
    alt_en: `Index-based approach: Instead of slicing and copying the array, pass only the left and right index boundaries. Time complexity is still O(n), but eliminating array copies reduces overhead and makes it faster in practice.`,
    points_ja: `ソート配列の中央値を根に選ぶことで、BSTの高さを最小に近づけることができ、検索・挿入・削除の性能が最適な O(log n) になる。スライスを使う参考コードは実装がシンプルでわかりやすく、インデックスで構築する他の解き方は配列コピーが不要で高速・効率的。`,
    points_en: `Selecting the middle element of the sorted array as the root minimises the BST height, enabling O(log n) search, insert, and delete performance. The slice-based reference code is simple and readable; the index-based alternative avoids array copies and is faster and more memory-efficient.`,
  },
  {
    num: 25,
    category_en: `Tree · BT · BST`,
    category_ja: `木`,
    title_en: `Path Sum`,
    title_ja: `root-to-leaf の合計`,
    approach_ja: `根から再帰的に辿りながら「残りの目標値」を減算していく。葉ノードに到達した時点で、残りがちょうど 0 かを確認する。`,
    approach_en: `Recursively traverse from the root, subtracting each node's value from the remaining target. When a leaf node is reached, check whether the remaining target is exactly 0.`,
    time: `O(n)`,
    space: `O(h)`,
    code_lang: `python`,
    code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def hasPathSum(root: TreeNode, targetSum: int) -> bool:
    if not root:
        return False
    # 葉ノードの場合
    if not root.left and not root.right:
        return root.val == targetSum
    # 残りの目標値を計算して左右に再帰
    remaining = targetSum - root.val
    return hasPathSum(root.left, remaining) or \\
        hasPathSum(root.right, remaining)`,
    alt_ja: `スタックを使った反復的 DFS: スタックに「現在のノード」と「そこまでの累積和」を積みながら探索する。葉ノードで累積和が targetSum と一致すれば True を返す。`,
    alt_en: `Iterative DFS with a stack: Push pairs of (current node, cumulative sum so far) onto a stack. When a leaf node is reached, check if the cumulative sum equals targetSum and return True if so.`,
    points_ja: `n = ノード数、h = 木の高さ。再帰的 DFS では各ノードを 1 回訪問するため時間計算量は O(n)、空間計算量は再帰スタックの深さに相当する O(h)。葉ノードの判定（左右両方が None）を忘れないことがポイント。`,
    points_en: `n = number of nodes, h = tree height. Recursive DFS visits each node once for O(n) time; space is O(h) for the recursion stack. The key point is correctly identifying leaf nodes as those with both left and right children equal to None.`,
  },
  {
    num: 26,
    category_en: `Tree · BT · BST`,
    category_ja: `木`,
    title_en: `Binary Tree Level Order Traversal`,
    title_ja: `レベル順走査`,
    approach_ja: `キューを使った BFS（幅優先探索）。各レベルの開始時点でのキューサイズを記録しておき、そのサイズ分だけ処理して 1 つのレベルとしてまとめる。`,
    approach_en: `BFS using a queue. At the start of each level, record the current queue size and process exactly that many nodes, grouping them as one level.`,
    time: `O(n)`,
    space: `O(n)`,
    code_lang: `python`,
    code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

from collections import deque

def levelOrder(root: TreeNode) -> list[list[int]]:
    if not root:
        return []
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result`,
    alt_ja: `DFS（深さ優先探索）で各深さに追加: DFS で各ノードの深さ（レベル）を引数として渡し、結果配列のその深さのリストに値を追加していく。時間計算量 O(n)、空間計算量 O(n)（結果 + 再帰スタック）。ポイント: 再帰の深さは木の高さ h に比例する。最悪場合（片側に偏った木）では O(n) になる。`,
    alt_en: `DFS with depth tracking: Pass the current depth as a parameter during DFS and append each node's value to the result list at that depth index. Time O(n), space O(n) (result list + recursion stack). Note: recursion depth is proportional to the tree height h, which can be O(n) for a skewed tree.`,
    points_ja: `各レベルの開始時点でのキュー長さ分だけ処理するのがポイント。これにより同じレベルのノードをひとまとめにできる。n = ノード数。`,
    points_en: `The key is to process exactly as many nodes as the queue length at the start of each level, which groups all nodes of the same level together. n = number of nodes.`,
  },
  {
    num: 27,
    category_en: `Tree · BT · BST`,
    category_ja: `木`,
    title_en: `Binary Tree Zigzag Level Order Traversal`,
    title_ja: `ジグザグレベル順走査`,
    approach_ja: `問題 26 と同じ BFS だが、レベルの偶奇に応じてそのレベルの値を追加する向きを変える（deque の append / appendleft を使い分ける）。各レベルを左から右、右から左と交互に並べたリストを返す。`,
    approach_en: `Same BFS as problem 26, but the direction in which values are added for each level alternates based on whether the level index is even or odd (using deque's append vs appendleft). Returns a list with each level ordered alternately left-to-right and right-to-left.`,
    time: `O(n)`,
    space: `O(n)`,
    code_lang: `python`,
    code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

from collections import deque

def zigzagLevelOrder(root: TreeNode) -> list[list[int]]:
    if not root:
        return []
    result, queue = [], deque([root])
    left_to_right = True
    while queue:
        level = deque()
        for _ in range(len(queue)):
            node = queue.popleft()
            if left_to_right:
                level.append(node.val)
            else:
                level.appendleft(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(list(level))
        left_to_right = not left_to_right
    return result`,
    alt_ja: `後処理方式: 通常のレベル順走査を行った後、偶数番目のレベルだけ最後に reverse() する後処理方式。実装は単純だが、そのレベルの reverse に O(k)（k = そのレベルのノード数）かかる。時間計算量 O(n)、空間計算量 O(n)（出力リスト + queue）。`,
    alt_en: `Post-processing approach: Perform a standard level-order traversal, then reverse every other level at the end. Simple to implement, but the reverse operation costs O(k) per level where k is the number of nodes at that level. Time O(n), space O(n) (output list + queue).`,
    points_ja: `走査方向をレベルごとに反転させることで、ジグザグ順になる。deque を使って appendleft / append を切り替えるのが実装の核心。時間計算量 O(n)（各ノードをちょうど 1 回ずつ処理する）、空間計算量 O(n)（最悪の場合、queue に同一レベルのノードがすべて入る）。`,
    points_en: `Reversing the traversal direction level by level produces the zigzag order. The core of the implementation is switching between appendleft and append on a deque. Time O(n) since each node is processed exactly once; space O(n) because the queue can hold all nodes of a single level in the worst case.`,
  },
  {
    num: 28,
    category_en: `Tree · BT · BST`,
    category_ja: `木`,
    title_en: `Validate Binary Search Tree`,
    title_ja: `BSTかどうかの検証`,
    approach_ja: `各ノードが取りうる値の範囲 [low, high] を再帰的に絞り込みながら辿る。単純な「親と子の大小比較」だけでは孫ノードとの矛盾を見逃すことに注意。左部分木のすべての値は (low, x) の範囲、右部分木のすべての値は (x, high) の範囲であることを再帰で管理する。`,
    approach_en: `Recursively narrow the valid range [low, high] for each node's value. Simply comparing a parent and its direct child is insufficient because it can miss contradictions with grandchild nodes. Use recursion to enforce that every node in the left subtree falls in (low, x) and every node in the right subtree falls in (x, high).`,
    time: `O(n)`,
    space: `O(h)`,
    code_lang: `python`,
    code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def isValidBST(root: TreeNode) -> bool:
    def validate(node, low, high) -> bool:
        if not node:
            return True
        if not (low < node.val < high):
            return False
        return validate(node.left, low, node.val) and validate(node.right, node.val, high)
    return validate(root, float('-inf'), float('inf'))`,
    alt_ja: `中間順（inorder）走査: BST の中間順走査を行うと、出力される値は必ず昇順（単調増加）になる。その性質を利用して、前の値より大きいかを確認しながら走査する。時間計算量 O(n)、空間計算量 O(n)（再帰スタックが O(h) の実装も可能）。`,
    alt_en: `Inorder traversal: An inorder traversal of a valid BST always yields values in strictly ascending order. Leverage this property by verifying that each visited value is greater than the previous one. Time O(n), space O(n) (an O(h) stack-based implementation is also possible).`,
    points_ja: `「親より小さい/大きい」だけでなく、「祖先すべてとの大小関係を守る必要がある」ため、範囲に基づく検証や中間順走査を使うと確実に判定できる。`,
    points_en: `It is not enough to check only the immediate parent-child relationship — every ancestor's ordering constraint must also be satisfied. Using range-based validation or inorder traversal guarantees a correct result.`,
  },
  {
    num: 29,
    category_en: `Tree · BT · BST`,
    category_ja: `木`,
    title_en: `Construct Binary Tree from Preorder and Inorder Traversal`,
    title_ja: `走査順序から木を復元`,
    approach_ja: `1. 前順（preorder）の先頭の値は、必ず現在の部分木の根になる。2. その値を inorder 配列の中で探す。左側の要素 = 左部分木の inorder、右側の要素 = 右部分木の inorder。3. preorder についても左部分木と右部分木の要素数に基づいて分割し、再帰的に同じ処理を行う。4. 値 → inorder でのインデックスのハッシュマップを使うと、探索を O(1) で行える。`,
    approach_en: `1. The first value in preorder is always the root of the current subtree. 2. Find that value in the inorder array; elements to its left form the left subtree's inorder, elements to its right form the right subtree's inorder. 3. Split preorder into left and right portions based on the sizes of those subtrees and recurse. 4. Using a hashmap from value to inorder index reduces the lookup to O(1).`,
    time: `O(n)`,
    space: `O(n)`,
    code_lang: `python`,
    code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def buildTree(preorder: list[int], inorder: list[int]) -> TreeNode:
    # 値 → inorder でのインデックスのハッシュマップ
    inorder_index = {val: i for i, val in enumerate(inorder)}
    idx = 0  # preorder の現在位置

    def build(left, right):
        nonlocal idx
        if left > right:
            return None
        root_val = preorder[idx]  # 根の値 (preorder の先頭)
        idx += 1
        root = TreeNode(root_val)
        mid = inorder_index[root_val]  # inorder での根の位置
        # 左部分木
        root.left = build(left, mid - 1)
        # 右部分木
        root.right = build(mid + 1, right)
        return root

    return build(0, len(inorder) - 1)`,
    alt_ja: `線形探索: inorder でのインデックスをハッシュマップを使わず、毎回線形探索で見つける方法。実装は簡単だが、各再帰で探索に O(n) かかるため、全体で O(n²) に悪化する。`,
    alt_en: `Linear search: Find the root's position in the inorder array by linear search at each recursion level instead of using a hashmap. The implementation is simpler but costs O(n) per recursion call, degrading overall time to O(n²).`,
    points_ja: `inorder_index で値からインデックスを O(1) で取得できるようにすることで全体が O(n) になる。preorder の先頭インデックス idx が根を順に指す。inorder の位置 mid を境に、左側が左部分木、右側が右部分木。再帰で区間（left, right）のみに注目して木を構築していく。`,
    points_en: `Precomputing a hashmap from inorder values to their indices reduces each lookup to O(1), making the overall complexity O(n). The preorder index idx advances to point to each successive root. The inorder position mid divides the array: left side = left subtree, right side = right subtree. Recursion focuses only on the current interval (left, right) to build the tree.`,
  },
  {
    num: 30,
    category_en: `Dynamic Programming`,
    category_ja: `動的計画法`,
    title_en: `Paint Fence`,
    title_ja: `フェンスの塗り分け`,
    approach_ja: `dp[i] = i 本目までの塗り方の総数。i 本目を塗るとき、直前（i-1 本目）との関係で 2 パターンに分けて考える。same[i]: i 本目を「前と同じ色」で塗る塗り方の総数 = diff[i-1]（前の本が「前と違う色」で塗られていた場合のみ同じ色にできる）。diff[i]: i 本目を「前と違う色」で塗る塗り方の総数 = (same[i-1] + diff[i-1]) * (k - 1)。dp[i] = same[i] + diff[i]。初期値: i=1 のとき same[1]=0, diff[1]=k。i=2 のとき same[2]=k, diff[2]=k*(k-1)。`,
    approach_en: `Let dp[i] = total number of ways to paint i fences. When painting fence i, split into two cases based on its relationship to fence i-1. same[i]: ways to paint fence i the same color as fence i-1 = diff[i-1] (you can only repeat a color if the previous fence used a different color). diff[i]: ways to paint fence i a different color from fence i-1 = (same[i-1] + diff[i-1]) * (k-1). dp[i] = same[i] + diff[i]. Initial values: i=1 → same[1]=0, diff[1]=k; i=2 → same[2]=k, diff[2]=k*(k-1).`,
    time: `O(n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `def numWays(n: int, k: int) -> int:
    if n == 0:
        return 0
    if n == 1:
        return k

    same, diff = k, k * (k - 1)  # i = 2 のときの値

    for _ in range(3, n + 1):  # i = 3 から n まで遷移を回す
        same, diff = diff, (same + diff) * (k - 1)

    return same + diff`,
    alt_ja: `dp 配列をそのまま保持するボトムアップ方式（素直な実装）。dp[i] = i 本目までの塗り方の総数を配列に保存していく。時間計算量 O(n)、空間計算量 O(n)（dp 配列を長さ n+1 で保持する）。`,
    alt_en: `Bottom-up approach retaining the full dp array (straightforward implementation). Store dp[i] = total ways to paint i fences in an array. Time O(n), space O(n) (holds a dp array of length n+1).`,
    points_ja: `same, diff のみを保持するため定数空間。各フェンス数に対して定時間の計算をするため時間計算量 O(n)。隣り合う 2 本だけが同じ色になれないというルールを、same/diff の遷移式で正確に表現することがポイント。`,
    points_en: `Retaining only same and diff keeps space constant at O(1). Each step takes constant time, giving O(n) overall. The key is correctly capturing the rule that no two adjacent fences may share the same color through the same/diff recurrence.`,
  },
  {
    num: 31,
    category_en: `Dynamic Programming`,
    category_ja: `動的計画法`,
    title_en: `Longest Increasing Subsequence`,
    title_ja: `最長増加部分列`,
    approach_ja: `配列の中から順序を保ったまま増加する部分列の中で、最も長いものの長さを求める。

・素直なDP（O(n^2)）: dp[i] = i番目の要素で終わる最長増加部分列の長さ

・二分探索（O(n log n)）: 各長さの部分列の「末尾の最小値」を管理する配列 tails を使い、二分探索で位置を決めて更新していく（patience sorting）。`,
    approach_en: `Find the length of the longest subsequence of the array that is strictly increasing while preserving the original order.

- Naive DP (O(n^2)): dp[i] = length of the longest increasing subsequence ending at index i.

- Binary search (O(n log n)): Maintain an array \`tails\` where tails[i] is the smallest tail element of all increasing subsequences of length i+1. Use binary search to find the insertion position and update (patience sorting).`,
    time: `O(n log n)`,
    space: `O(n)`,
    code_lang: `python`,
    code: `import bisect

def lengthOfLIS(nums: list[int]) -> int:
    tails = []  # tails[i] = 長さ i+1 の増加部分列の末尾の最小値
    for num in nums:
        pos = bisect.bisect_left(tails, num)  # num 以上の最初の位置
        if pos == len(tails):
            tails.append(num)  # より長い部分列を作れる
        else:
            tails[pos] = num  # より良い（小さい末尾）で更新
    return len(tails)`,
    alt_ja: `素直なDP（O(n^2)）: i番目で終わる最長増加部分列の長さ dp[i] = max(dp[j] + 1)（j < i かつ nums[j] < nums[i]）。該当する j がない場合は dp[i] = 1。

特徴: 実装が簡単で分かりやすいが、n が大きいと遅い（例: n=10^4 で約 10^8 の比較）。`,
    alt_en: `Naive DP (O(n^2)): dp[i] = max(dp[j] + 1) for all j < i where nums[j] < nums[i]. If no such j exists, dp[i] = 1.

Characteristics: Simple to implement and easy to understand, but slow for large n (e.g., ~10^8 comparisons for n=10^4).`,
    points_ja: `・tails の長さ = 現在までに見つけた最長増加部分列の長さ
・末尾を小さく保つことで、将来より長い部分列を作る可能性を残す`,
    points_en: `- The length of \`tails\` equals the length of the longest increasing subsequence found so far.
- Keeping tail values as small as possible preserves the chance to extend the subsequence further.`,
  },
  {
    num: 32,
    category_en: `Dynamic Programming`,
    category_ja: `動的計画法`,
    title_en: `Maximum Subarray`,
    title_ja: `最大部分配列の和`,
    approach_ja: `Kadane's algorithm。現在位置までの「連続部分配列の最大和」を current_sum で管理し、負に転じたら現在の要素自体からリスタートする。各位置での最大値を max_sum に更新していく。`,
    approach_en: `Kadane's algorithm. Track the maximum contiguous subarray sum up to the current position as \`current_sum\`. If it turns negative, restart from the current element. Update \`max_sum\` with the maximum at each position.`,
    time: `O(n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `def maxSubArray(nums: list[int]) -> int:
    max_sum = current_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum`,
    alt_ja: `分割統治法（Divide and Conquer）: 配列を半分に分け、「左の最大」「右の最大」「中央をまたぐ最大」の3つの最大値を比較する。再帰的に分割を続ける。
時間計算量: O(n log n)、空間計算量: O(log n)（再帰スタック）。Kadane の O(n) より遅いが、分割統治の良い練習になる。`,
    alt_en: `Divide and Conquer: Split the array in half and compare three candidates: max of left half, max of right half, and max crossing the midpoint. Recurse on each half.
Time: O(n log n), Space: O(log n) (recursive stack). Slower than Kadane's O(n) but good practice in divide-and-conquer thinking.`,
    points_ja: `・部分配列は連続している必要がある。
・current_sum は「ここで終わる部分配列の最大和」を表す。
・負の合計は捨てて、次の要素からやり直すのが最適解につながる。`,
    points_en: `- The subarray must be contiguous.
- \`current_sum\` represents the maximum sum of a subarray ending at the current position.
- Discarding a negative running sum and restarting from the next element leads to the optimal solution.`,
  },
  {
    num: 33,
    category_en: `Dynamic Programming`,
    category_ja: `動的計画法`,
    title_en: `Unique Paths`,
    title_ja: `グリッドの経路数`,
    approach_ja: `左上(0,0)から右下(m-1,n-1)へ、右か下にしか進めないときの経路数を求める。あるマス(r,c)へ来るには「上から来る」か「左から来る」かの2通りなので、dp[r][c] = dp[r-1][c] + dp[r][c-1] とする。1行目と1列目は、行く方法が1通りしかないので 1 で初期化する。`,
    approach_en: `Count paths from the top-left (0,0) to the bottom-right (m-1,n-1) moving only right or down. Each cell (r,c) can be reached either from above or from the left, so dp[r][c] = dp[r-1][c] + dp[r][c-1]. Initialize the first row and column to 1 since there is only one way to reach each of those cells.`,
    time: `O(rows * cols)`,
    space: `O(cols)`,
    code_lang: `python`,
    code: `def uniquePaths(m: int, n: int) -> int:
    dp = [1] * n          # 1行目はすべて1
    for _ in range(1, m):  # 2行目以降
        for c in range(1, n):
            dp[c] += dp[c - 1]  # 上(dp[c]) + 左(dp[c-1])
    return dp[-1]          # 右下の値`,
    alt_ja: `組み合わせ数学（二項係数）: 右に(n-1)回、下に(m-1)回移動する並べ方の総数。よって C(m+n-2, m-1) を計算する。

import math
def uniquePaths(m: int, n: int) -> int:
    return math.comb(m + n - 2, m - 1)  # Python 3.8+

計算量（比較）: 動的計画法（1次元DP）は O(m*n)/O(n)、組み合わせ数学（二項係数）は O(min(m,n))/O(1)。`,
    alt_en: `Combinatorics (binomial coefficient): The total number of ways to arrange (n-1) right moves and (m-1) down moves is C(m+n-2, m-1).

import math
def uniquePaths(m: int, n: int) -> int:
    return math.comb(m + n - 2, m - 1)  # Python 3.8+

Complexity comparison: 1D DP is O(m*n) time / O(n) space; combinatorics is O(min(m,n)) time / O(1) space.`,
    points_ja: `動的計画法は理解しやすく汎用性が高く、組み合わせ解は最速。状況に応じて使い分けよう！`,
    points_en: `Dynamic programming is intuitive and general-purpose; the combinatorics solution is fastest. Choose the right approach for the situation!`,
  },
  {
    num: 34,
    category_en: `Dynamic Programming`,
    category_ja: `動的計画法`,
    title_en: `Unique Paths II`,
    title_ja: `障害物ありの経路数`,
    approach_ja: `右または下にしか進めないグリッドで、障害物(1)を避けて左上から右下へ行く経路の総数を数える。問題33と同じDPだが、障害物マスでは dp 値を 0 にする。`,
    approach_en: `Count paths from top-left to bottom-right in a grid, moving only right or down, while avoiding obstacles (cells with value 1). Uses the same DP as problem 33, but sets dp to 0 for any obstacle cell.`,
    time: `O(rows*cols)`,
    space: `O(cols)`,
    code_lang: `python`,
    code: `def uniquePathsWithObstacles(grid: list[list[int]]) -> int:
    cols = len(grid[0])
    dp = [0] * cols
    dp[0] = 1
    for row in grid:
        for c in range(cols):
            if row[c] == 1:   # 障害物
                dp[c] = 0
            elif c > 0:       # 通路
                dp[c] += dp[c - 1]  # 上からの経路数 + 左からの経路数
    return dp[-1]`,
    alt_ja: `2次元DP配列を使う方法: dp[r][c] = (r,c) に到達する経路数とする素直なDP。障害物マスは 0、それ以外は上 + 左の和。

def uniquePathsWithObstacles_2D(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    dp = [[0] * cols for _ in range(rows)]
    if grid[0][0] == 0:
        dp[0][0] = 1
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                dp[r][c] = 0
            else:
                if r > 0: dp[r][c] += dp[r-1][c]
                if c > 0: dp[r][c] += dp[r][c-1]
    return dp[-1][-1]  # 空間 O(rows*cols)`,
    alt_en: `Using a 2D DP array: dp[r][c] = number of paths to reach (r,c). Set obstacle cells to 0; otherwise sum from above and left.

def uniquePathsWithObstacles_2D(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    dp = [[0] * cols for _ in range(rows)]
    if grid[0][0] == 0:
        dp[0][0] = 1
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                dp[r][c] = 0
            else:
                if r > 0: dp[r][c] += dp[r-1][c]
                if c > 0: dp[r][c] += dp[r][c-1]
    return dp[-1][-1]  # Space O(rows*cols)`,
    points_ja: ``,
    points_en: ``,
  },
  {
    num: 35,
    category_en: `Dynamic Programming`,
    category_ja: `動的計画法`,
    title_en: `House Robber`,
    title_ja: `隣接しない家を選ぶ強盗`,
    approach_ja: `dp[i] = i番目までの家を見たときの最大獲得額 = max(dp[i-1]（i番目を襲わない）, dp[i-2] + nums[i]（i番目を襲う）)

i番目の家を「襲う」か「襲わない」かのどちらか。「襲う」場合は i-1番目は選べないので dp[i-2] に nums[i] を足す。「襲わない」場合は dp[i-1] を引き継ぐ。直前2つの値だけあれば計算できるので、空間を O(1) に落とせる。`,
    approach_en: `dp[i] = maximum amount obtainable considering the first i houses = max(dp[i-1] (skip house i), dp[i-2] + nums[i] (rob house i)).

For each house, choose to rob it or skip it. If robbed, the previous house must be skipped so add nums[i] to dp[i-2]. If skipped, carry forward dp[i-1]. Only the previous two values are needed, so space can be reduced to O(1).`,
    time: `O(n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `def rob(nums: list[int]) -> int:
    prev, curr = 0, 0
    for num in nums:
        prev, curr = curr, max(curr, prev + num)
    return curr`,
    alt_ja: `ボトムアップ方式（配列を保持）: dp 配列を長さ n+1 で保持する空間 O(n) の実装。

def rob_dp(nums: list[int]) -> int:
    n = len(nums)
    if n == 0:
        return 0
    if n == 1:
        return nums[0]
    dp = [0] * (n + 1)
    dp[0] = 0
    dp[1] = nums[0]
    for i in range(2, n + 1):
        dp[i] = max(dp[i-1], dp[i-2] + nums[i-1])
    return dp[n]

dp[i]: i番目までの家を見たときの最大獲得額。遷移は同じ: dp[i] = max(dp[i-1], dp[i-2] + nums[i-1])。`,
    alt_en: `Bottom-up with full array (space O(n)): Maintain a dp array of length n+1.

def rob_dp(nums: list[int]) -> int:
    n = len(nums)
    if n == 0:
        return 0
    if n == 1:
        return nums[0]
    dp = [0] * (n + 1)
    dp[0] = 0
    dp[1] = nums[0]
    for i in range(2, n + 1):
        dp[i] = max(dp[i-1], dp[i-2] + nums[i-1])
    return dp[n]

dp[i]: maximum amount when considering the first i houses. Recurrence is the same: dp[i] = max(dp[i-1], dp[i-2] + nums[i-1]).`,
    points_ja: `・隣接する家は選べない → 「選ぶ/選ばない」の最適部分構造が成り立つ。
・dp[i] = max(dp[i-1], dp[i-2] + nums[i]) が基本。
・直前2つの値だけで計算できるので、空間を O(1) に最適化できる。`,
    points_en: `- Adjacent houses cannot both be robbed → the optimal substructure of 'rob or skip' holds.
- The core recurrence is dp[i] = max(dp[i-1], dp[i-2] + nums[i]).
- Only the previous two values are needed, enabling O(1) space optimization.`,
  },
  {
    num: 36,
    category_en: `Dynamic Programming`,
    category_ja: `動的計画法`,
    title_en: `House Robber II`,
    title_ja: `円環状の家を選ぶ強盗`,
    approach_ja: `家が円環状に並んでおり、隣接する家は同時に襲えない。各家の金額の合計の最大値を求める。

最初の家(nums[0])と最後の家(nums[n-1])は隣接している。したがって、以下の2つの場合に分けて、それぞれで問題35（House Robber）の解法（直線版）を適用し、大きい方を答えとする。
① 最初の家を除いた区間: nums[1...n-1]
② 最後の家を除いた区間: nums[0...n-2]`,
    approach_en: `Houses are arranged in a circle and adjacent houses cannot both be robbed. Find the maximum total amount.

Since the first house (nums[0]) and the last house (nums[n-1]) are adjacent, split into two cases and apply the linear House Robber solution to each, returning the larger result:
① Exclude the first house: nums[1...n-1]
② Exclude the last house: nums[0...n-2]`,
    time: `O(n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `def rob(nums: list[int]) -> int:
    def rob_linear(houses: list[int]) -> int:
        prev, curr = 0, 0          # prev = dp[i-2], curr = dp[i-1]
        for num in houses:
            prev, curr = curr, max(curr, prev + num)  # DP遷移
        return curr                # 最大値

    n = len(nums)
    if n == 1:
        return nums[0]             # 家が1軒だけのとき
    return max(rob_linear(nums[1:]), rob_linear(nums[:-1]))  # 2パターンの最大`,
    alt_ja: `本質的には上記と同じで、直線版のDP配列をそのまま保持する実装（空間O(n)）にしてもよいが、こちらは前の2値だけでよいのでO(1)に最適化できる。`,
    alt_en: `Fundamentally the same approach; an alternative implementation retains the full DP array (O(n) space), but since only the previous two values matter, O(1) space is achievable.`,
    points_ja: ``,
    points_en: ``,
  },
  {
    num: 37,
    category_en: `Dynamic Programming`,
    category_ja: `動的計画法`,
    title_en: `Best Time to Buy and Sell Stock`,
    title_ja: `株の売買タイミング（1回）`,
    approach_ja: `これまでの「最安値（買うタイミング）」を追跡しながら、現在価格で売った場合の利益を都度計算して最大値を更新する。配列を1回左から右に走査するだけで解ける。`,
    approach_en: `Track the minimum price seen so far (best time to buy) and compute the profit if sold at the current price, updating the maximum profit each step. A single left-to-right pass through the array suffices.`,
    time: `O(n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `def maxProfit(prices: list[int]) -> int:
    min_price = float('inf')  # これまでの最安値
    max_profit = 0            # 最大利益
    for price in prices:
        min_price = min(min_price, price)          # 最安値を更新
        max_profit = max(max_profit, price - min_price)  # 利益を更新
    return max_profit`,
    alt_ja: `① 全ペアを総当たり（二重ループ）: すべての（買う日, 売る日）を試す方法。時間計算量: O(n^2)、空間計算量: O(1)。

def maxProfit_bruteforce(prices: list[int]) -> int:
    n = len(prices)
    max_profit = 0
    for i in range(n):      # 買う日
        for j in range(i+1, n):  # 売る日（i より後）
            max_profit = max(max_profit, prices[j] - prices[i])
    return max_profit

② 最大部分配列問題（Kadane's algorithm）: 価格差の配列 d[i] = prices[i] - prices[i-1] を作り、その中での最大部分配列の和を求める。時間計算量: O(n)、空間計算量: O(1)。`,
    alt_en: `① Brute force (nested loops): Try every (buy day, sell day) pair. Time O(n^2), Space O(1).

def maxProfit_bruteforce(prices: list[int]) -> int:
    n = len(prices)
    max_profit = 0
    for i in range(n):          # buy day
        for j in range(i+1, n): # sell day (after i)
            max_profit = max(max_profit, prices[j] - prices[i])
    return max_profit

② Maximum Subarray (Kadane's algorithm): Build the array of daily differences d[i] = prices[i] - prices[i-1] and find the maximum subarray sum. Time O(n), Space O(1).`,
    points_ja: ``,
    points_en: ``,
  },
  {
    num: 38,
    category_en: `Dynamic Programming`,
    category_ja: `動的計画法`,
    title_en: `Best Time to Buy and Sell Stock II`,
    title_ja: `株の売買タイミング（複数回）`,
    approach_ja: `貪欲法: 価格が上昇するすべての区間の差を合計すれば最大利益になる。翌日の価格が今日より高ければ、その差を利益に加算する。`,
    approach_en: `Greedy approach: Sum all positive daily price differences. If tomorrow's price is higher than today's, add the difference to profit.`,
    time: `O(n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `def maxProfit(prices: list[int]) -> int:
    profit = 0
    for i in range(1, len(prices)):
        if prices[i] > prices[i - 1]:
            profit += prices[i] - prices[i - 1]
    return profit`,
    alt_ja: `状態遷移DP:
dp[i][0] = i日目の終わり時点で株を持っていない場合の最大利益
dp[i][1] = i日目の終わり時点で株を持っている場合の最大利益

初期状態: dp[0][0] = 0, dp[0][1] = -prices[0]
状態遷移:
・dp[i][0] = max(dp[i-1][0], dp[i-1][1] + prices[i])（売却 or 保持）
・dp[i][1] = max(dp[i-1][1], dp[i-1][0] - prices[i])（購入 or 保持）

答え: dp[n-1][0]（最終日に株を持っていない最大利益）

def maxProfit_dp(prices: list[int]) -> int:
    if not prices:
        return 0
    hold = -prices[0]   # dp[i][1]: 株を持っている最大利益
    cash = 0            # dp[i][0]: 株を持っていない最大利益
    for price in prices[1:]:
        cash = max(cash, hold + price)   # 売却 or 保持
        hold = max(hold, cash - price)   # 購入 or 保持
    return cash`,
    alt_en: `State transition DP:
dp[i][0] = max profit at end of day i holding no stock
dp[i][1] = max profit at end of day i holding stock

Initial state: dp[0][0] = 0, dp[0][1] = -prices[0]
Transitions:
- dp[i][0] = max(dp[i-1][0], dp[i-1][1] + prices[i])  (sell or hold)
- dp[i][1] = max(dp[i-1][1], dp[i-1][0] - prices[i])  (buy or hold)

Answer: dp[n-1][0] (max profit on the last day with no stock held)

def maxProfit_dp(prices: list[int]) -> int:
    if not prices:
        return 0
    hold = -prices[0]   # dp[i][1]: max profit holding stock
    cash = 0            # dp[i][0]: max profit holding no stock
    for price in prices[1:]:
        cash = max(cash, hold + price)   # sell or hold
        hold = max(hold, cash - price)   # buy or hold
    return cash`,
    points_ja: ``,
    points_en: ``,
  },
  {
    num: 39,
    category_en: `Dynamic Programming`,
    category_ja: `動的計画法`,
    title_en: `Word Break`,
    title_ja: `単語分割できるか`,
    approach_ja: `dp[i] = 文字列 s の先頭 i 文字（s[0:i]）が、辞書の単語だけで分割可能かどうか（True/False）。

dp[0] = True（空文字列は常に分割可能）
i（1 以上）について、0 ≤ j < i を全探索し、dp[j] が True かつ s[j:i] が辞書にあれば dp[i] = True。

単語の検索を高速にするため、辞書は set に入れておくと O(1) 平均で判定できる。`,
    approach_en: `dp[i] = whether the first i characters of s (s[0:i]) can be segmented using only dictionary words (True/False).

dp[0] = True (empty string is always segmentable).
For each i >= 1, check all j in [0, i): if dp[j] is True and s[j:i] is in the dictionary, set dp[i] = True.

Convert the word list to a set for O(1) average lookup.`,
    time: `O(n^2)`,
    space: `O(n)`,
    code_lang: `python`,
    code: `def wordBreak(s: str, wordDict: list[str]) -> bool:
    word_set = set(wordDict)   # 辞書を set に変換（高速な検索のため）
    n = len(s)
    dp = [False] * (n + 1)    # dp[i]: 先頭 i 文字が分割可能か
    dp[0] = True               # 空文字列は分割可能
    for i in range(1, n + 1):  # i を 1 から n まで
        for j in range(i):     # 切れ目の位置 j を 0 から i-1 まで全探索
            if dp[j] and s[j:i] in word_set:  # j までが分割可能、かつ s[j:i] が辞書にあれば
                dp[i] = True   # i まで可能
                break          # これ以上の j を調べる必要はない
    return dp[n]               # 全体が可能か（dp[n]）を返す`,
    alt_ja: `① メモ化再帰（トップダウンDP）: dfs(i) = 先頭 i 文字が分割可能かを再帰で判定し、結果をメモ化する。時間計算量: O(n^2)、空間計算量: O(n)（メモ化＋再帰スタック）。

② BFS 的アプローチ（到達可能な位置の管理）: 0 から始め、到達可能な位置から辞書の単語で到達できる次の位置をキューに入れていく。時間計算量: O(n^2)、空間計算量: O(n)。`,
    alt_en: `① Memoized recursion (top-down DP): dfs(i) recursively checks whether the first i characters are segmentable and memoizes the results. Time O(n^2), Space O(n) (memo + recursive stack).

② BFS approach (tracking reachable positions): Starting from 0, push reachable positions onto a queue based on dictionary words. Time O(n^2), Space O(n).`,
    points_ja: `・dp[i] は「先頭 i 文字が辞書で表現できるか」だけを記録するシンプルな DP。
・各位置 i で、直前のどこで切るか（j）を総当たりして判定する。
・辞書の検索は set を使って O(1) にするのがポイント。`,
    points_en: `- dp[i] is a simple DP that only records whether the first i characters can be expressed with dictionary words.
- At each position i, try all possible split points j to determine segmentability.
- Use a set for the dictionary to make lookups O(1).`,
  },
  {
    num: 40,
    category_en: `Dynamic Programming`,
    category_ja: `動的計画法`,
    title_en: `Coin Change`,
    title_ja: `最小コイン枚数`,
    approach_ja: `dp[a] = 金額 a を作るのに必要な最小コイン枚数。dp[0] = 0 とし、各コイン c について dp[a] = min(dp[a], dp[a - c] + 1) を計算する。作れない金額は ∞（無限大）として扱う。`,
    approach_en: `dp[a] = minimum number of coins needed to make amount a. Set dp[0] = 0, and for each coin c compute dp[a] = min(dp[a], dp[a - c] + 1). Treat unreachable amounts as infinity.`,
    time: `O(amount * len(coins))`,
    space: `O(amount)`,
    code_lang: `python`,
    code: `def coinChange(coins: list[int], amount: int) -> int:
    dp = [0] + [float('inf')] * amount
    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a:
                dp[a] = min(dp[a], dp[a - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
    alt_ja: `BFS（幅優先探索）: 金額 0 から出発し、各コインを足していく。最初に amount に到達したときの「深さ（使ったコイン数）」が答え。最短経路問題として直感的に理解しやすい。`,
    alt_en: `BFS (Breadth-First Search): Start from amount 0 and add coins. The depth (number of coins used) when amount is first reached is the answer. Intuitively maps to the shortest-path problem.`,
    points_ja: `・DP: 金額ごとの最小枚数を表で管理する方法（一般的・効率的）
・BFS: 最短経路として解く方法（直感的・理解しやすい）
どちらも時間計算量は O(amount * len(coins)) 程度。`,
    points_en: `- DP: Manage the minimum count per amount in a table (general and efficient).
- BFS: Solve as a shortest-path problem (intuitive and easy to understand).
Both approaches have roughly O(amount * len(coins)) time complexity.`,
  },
  {
    num: 41,
    category_en: `Binary Search`,
    category_ja: `二分探索`,
    title_en: `Search Insert Position`,
    title_ja: `挿入位置の二分探索`,
    approach_ja: `標準的な二分探索（lower bound）。target 以上になる最初の位置を返す。探索区間は [left, right)（左閉・右開）で管理する。nums[mid] が target より小さいなら left = mid + 1（右側を探索）、そうでなければ right = mid（mid を含む左側を探索）。最終的に left が挿入位置（= 最初の target 以上の位置）。`,
    approach_en: `Standard binary search (lower bound). Returns the first position where the value is >= target. The search interval is managed as [left, right) (closed-open). If nums[mid] < target, set left = mid + 1 (search right half); otherwise set right = mid (search left half including mid). Finally, left is the insertion position (= the first index >= target).`,
    time: `O(log n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `def searchInsert(nums: list[int], target: int) -> int:
    left, right = 0, len(nums)        # 探索区間は [left,right)
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < target:         # nums[mid] が target より小さいなら
            left = mid + 1             # 右側を探索
        else:
            right = mid                # そうでなければ、mid を含む左側を探索
    return left                        # left が挿入位置（＝最初の target 以上の位置）`,
    alt_ja: `Python の bisect.bisect_left(nums, target) を使えば 1 行で書ける。内部実装は同じ二分探索。

import bisect

def searchInsert(nums: list[int], target: int) -> int:
    return bisect.bisect_left(nums, target)`,
    alt_en: `Can be written in one line using Python's bisect.bisect_left(nums, target). The internal implementation is the same binary search.

import bisect

def searchInsert(nums: list[int], target: int) -> int:
    return bisect.bisect_left(nums, target)`,
    points_ja: `lower bound（この問題で返す値）の定義：配列 nums において、nums[i] >= target となる最小の i を返す。そのような i が存在しない場合は、len(nums) を返す。bisect.bisect_left はまさにこの動作と一致する。`,
    points_en: `Definition of lower bound (the value returned by this problem): for array nums, return the smallest i such that nums[i] >= target. If no such i exists, return len(nums). bisect.bisect_left does exactly this.`,
  },
  {
    num: 42,
    category_en: `Binary Search`,
    category_ja: `二分探索`,
    title_en: `Find Minimum in Rotated Sorted Array`,
    title_ja: `回転配列の最小値`,
    approach_ja: `配列は 2 つのソート済み区間が繋がった形になっている。mid の値と right の値を比較し、nums[mid] > nums[right] なら最小値は mid より右側にある（left = mid + 1）、そうでなければ mid 自身を含む左側にある（right = mid）というルールで二分探索する。`,
    approach_en: `The array consists of two sorted segments joined together. Compare nums[mid] with nums[right]: if nums[mid] > nums[right], the minimum is to the right of mid (left = mid + 1); otherwise, the minimum is in the left half including mid (right = mid). Apply binary search with this rule.`,
    time: `O(log n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `def findMin(nums: list[int]) -> int:
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    return nums[left]`,
    alt_ja: `回転していない場合（nums[0] <= nums[-1]）は、先頭がそのまま最小値なので即座に返す、という前処理を加える実装もある。ロジックの本質は同じ。

例）nums = [1, 2, 3, 4, 5]（回転していない）
nums[0] <= nums[-1]（1 <= 5）なので、すぐに 1 を返す。`,
    alt_en: `An implementation that adds a pre-check: if the array is not rotated (nums[0] <= nums[-1]), the first element is already the minimum and can be returned immediately. The core logic is the same.

Example: nums = [1, 2, 3, 4, 5] (not rotated)
nums[0] <= nums[-1] (1 <= 5), so return 1 immediately.`,
    points_ja: `・nums[mid] と nums[right] を比較することで、最小値がどちらの区間にあるかを判定できる。
・nums[mid] > nums[right] のとき最小値は右側、そうでなければ left 側（mid 含む）。
・left == right で終了し、最小値は nums[left]。`,
    points_en: `・Comparing nums[mid] with nums[right] determines which segment contains the minimum.
・If nums[mid] > nums[right], the minimum is to the right; otherwise it is in the left half (including mid).
・Loop ends when left == right; the minimum is nums[left].`,
  },
  {
    num: 43,
    category_en: `Binary Search`,
    category_ja: `二分探索`,
    title_en: `Search in Rotated Sorted Array`,
    title_ja: `回転配列内の探索`,
    approach_ja: `mid を基準に、左側がソート済みか、右側がソート済みかを判定する。左側がソート済み（nums[left] <= nums[mid]）なら、target がその範囲内にあれば左側を探索、そうでなければ右側を探索。右側がソート済み（nums[mid] < nums[right]）なら、target がその範囲内にあれば右側を探索、そうでなければ左側を探索。毎回探索範囲が半分になるので時間計算量は O(log n)。`,
    approach_en: `Using mid as a pivot, determine whether the left or right half is sorted. If the left is sorted (nums[left] <= nums[mid]): search left if target is in that range, otherwise search right. If the right is sorted (nums[mid] < nums[right]): search right if target is in that range, otherwise search left. The search range halves each time, giving O(log n) time.`,
    time: `O(log n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `def search(nums: list[int], target: int) -> int:  # 探索範囲の両端を初期化
    left, right = 0, len(nums) - 1                 # 二分探索の標準ループ
    while left <= right:
        mid = (left + right) // 2                  # 中央インデックス
        if nums[mid] == target:                     # 目標値が見つかった
            return mid
        # 左側がソート済み
        if nums[left] <= nums[mid]:                 # 左側の範囲が判定
            if nums[left] <= target < nums[mid]:    # 左側の範囲に target があれば左側へ
                right = mid - 1
            else:                                   # そうでなければ右側へ
                left = mid + 1
        else:  # 右側がソート済み                  # 右側がソート済み
            if nums[mid] < target <= nums[right]:   # 右側の範囲に target があれば右側へ
                left = mid + 1
            else:                                   # そうでなければ左側へ
                right = mid - 1
    return -1                                       # 見つからなかった`,
    alt_ja: `2段階方式（ピボットを先に見つけてから二分探索）：まず問題42の方法で最小値の位置（ピボット）を求め、配列を2つのソート済み区間に分けてから target がどちらにあるかを決め、通常の二分探索を行う。計算量は同じく O(log n)。`,
    alt_en: `Two-step approach (find pivot first, then binary search): First find the minimum position (pivot) using the method from problem 42, determine which of the two sorted segments contains the target, then perform a standard binary search. Time complexity is also O(log n).`,
    points_ja: `・左右どちらかが必ずソート済みであることを利用する。
・target がソート済みの範囲内にあるかどうかで探索方向を決める。
・毎回探索範囲が半分になるので、時間計算量は O(log n)。
・重複要素がある場合はこの判定が曖昧になるため工夫が必要（本問題は重複なし）。`,
    points_en: `・Exploit the fact that at least one half is always sorted.
・Determine the search direction based on whether target falls within the sorted half.
・The search range halves each time, so time complexity is O(log n).
・With duplicate elements the sorted-half determination becomes ambiguous, requiring extra handling (this problem has no duplicates).`,
  },
  {
    num: 44,
    category_en: `Binary Search`,
    category_ja: `二分探索`,
    title_en: `Capacity To Ship Packages Within D Days`,
    title_ja: `D日以内に出荷できる容量`,
    approach_ja: `「積載量（ship の容量）」を二分探索する。最小値：荷物の最大重量（これ未満だと 1 個の荷物すら載せられない）。最大値：全荷物の合計重量（これなら 1 日で全部載せられる）。ある積載量で、荷物を順番に載せていき、容量を超えたら次の日に回すという貪欲シミュレーション（days_needed）で「何日かかるか」を計算する。必要日数が D 日以内なら「もっと小さくできる可能性がある」、D 日を超えるなら「容量が足りない」ので、探索範囲を絞り込む。このように、答えに単調性がある問題の典型例。`,
    approach_en: `Binary search on the ship's capacity. Lower bound: maximum single package weight (anything less can't even load one package). Upper bound: total weight of all packages (one day suffices). For a given capacity, simulate greedily (days_needed): load packages in order and spill to the next day when capacity is exceeded, counting required days. If days_needed <= D, a smaller capacity might work (right = mid); otherwise capacity is insufficient (left = mid + 1). Classic example of binary search on a monotone answer.`,
    time: `O(n log(sum(weights)))`,
    space: `O(1)`,
    code_lang: `python`,
    code: `def shipWithinDays(weights: list[int], days: int) -> int:
    def days_needed(capacity: int) -> int:
        total, count = 0, 1
        for w in weights:
            if total + w > capacity:
                count += 1
                total = 0
            total += w
        return count

    left, right = max(weights), sum(weights)
    while left < right:
        mid = (left + right) // 2
        if days_needed(mid) <= days:
            right = mid
        else:
            left = mid + 1
    return left`,
    alt_ja: `積載量を 1 から順に増やして、各容量で必要日数を計算し、D 日以内になる最初の容量を返す（線形探索）。時間計算量は O(sum(weights) * n)。答えの範囲が非常に大きい場合は非効率になる。`,
    alt_en: `Linear search: increment capacity from 1 upward, compute required days for each capacity, and return the first capacity that satisfies days_needed <= D. Time complexity is O(sum(weights) * n), which is inefficient when the answer range is very large.`,
    points_ja: `・この問題は「条件を満たす最小の値を二分探索する」典型例。配送、速度、時間など、単調性のある多くの問題に応用できる考え方。
・days_needed の計算が O(n)、二分探索の回数が O(log(sum(weights)))。
・追加のデータ構造は使わないため空間計算量は O(1)。`,
    points_en: `・This problem is a classic example of binary-searching for the smallest value satisfying a condition — a pattern applicable to many monotone problems involving delivery, speed, time, etc.
・days_needed runs in O(n); binary search runs O(log(sum(weights))) times.
・No extra data structures are used, so space complexity is O(1).`,
  },
  {
    num: 45,
    category_en: `Recursion`,
    category_ja: `再帰`,
    title_en: `Pow(x, n)`,
    title_ja: `高速累乗`,
    approach_ja: `高速累乗法（繰り返し二乗法）を使う。x^n を x^(n/2) を利用して計算する。n が偶数のとき x^n = (x^(n/2))^2、n が奇数のとき x^n = x × (x^((n-1)/2))^2。n を 2 で割り続けることで O(log n) に削減！
1. n が負の場合は x = 1/x、n = -n として正のべきに変換する。
2. n を 2 進数で見て、下位ビットが 1 のときだけ現在の x を result に掛ける。
3. 毎回 x を二乗し、n を 2 で割る（n //= 2）。
4. n が 0 になるまで繰り返す。`,
    approach_en: `Fast exponentiation (binary exponentiation). Compute x^n using x^(n/2): if n is even, x^n = (x^(n/2))^2; if n is odd, x^n = x × (x^((n-1)/2))^2. Repeatedly halving n reduces the number of steps to O(log n).
1. If n is negative, convert to positive exponent: x = 1/x, n = -n.
2. View n in binary; multiply the current x into result only when the lowest bit is 1.
3. Square x and halve n (n //= 2) each iteration.
4. Repeat until n reaches 0.`,
    time: `O(log n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `# 参考コード：反復版
def myPow(x: float, n: int) -> float:
    if n < 0:                  # 負の指数は 1/x にして正の指数に変換
        x = 1 / x
        n = -n
    result = 1.0               # 累積結果を保持する変数
    while n:
        if n % 2:              # n の末尾ビットが 1 のとき
            result *= x        # 現在の x を結果に掛ける
        x *= x                 # x を二乗
        n //= 2                # n を 2 で割る
    return result              # n を 2 で割ってビットを進める

# 参考コード：再帰版
def myPow(x: float, n: int) -> float:
    if n == 0:
        return 1.0
    half = myPow(x, n // 2)
    if n % 2 == 0:
        return half * half     # n が偶数
    else:
        return x * half * half # n が奇数`,
    alt_ja: `ライブラリ関数 pow(x, n) を使うと簡単に計算できます（内部的に高速なアルゴリズムが使われています）。

# 組み込み関数
result = pow(x, n)`,
    alt_en: `Python's built-in pow(x, n) can be used for a one-liner (it uses an efficient algorithm internally).

# built-in function
result = pow(x, n)`,
    points_ja: `・n は 32bit 整数の範囲（-2^31 〜 2^31-1）を想定。
・浮動小数点の誤差に注意（判定問題では誤差許容を考慮）。
・再帰版でも計算量は O(log n) だが、再帰スタックを使うため空間計算量は O(log n) になる。`,
    points_en: `・n is assumed to be within the 32-bit integer range (-2^31 to 2^31-1).
・Be careful of floating-point precision (consider epsilon tolerance in comparison problems).
・The recursive version also runs in O(log n) time, but uses O(log n) space due to the recursion stack.`,
  },
  {
    num: 46,
    category_en: `Recursion`,
    category_ja: `再帰`,
    title_en: `K-th Symbol in Grammar`,
    title_ja: `文法のk番目の記号`,
    approach_ja: `再帰的に「親」に落とし込む。第 n 行の k 番目の記号は、前の行（第 n-1 行）の「k/2」番目の記号（親）から決まる。k が奇数（左の子）なら親と同じ、k が偶数（右の子）なら親の反転（0→1）。第 1 行は「0」なのでベースケースは n == 1 のとき 0 を返す。親の位置は (k + 1) // 2。`,
    approach_en: `Reduce recursively to the parent. The k-th symbol in row n is determined by the ⌈k/2⌉-th symbol (parent) in row n-1. If k is odd (left child), the symbol equals the parent; if k is even (right child), the symbol is the parent's complement (0→1). The base case is row 1, which is always '0'. The parent's position is (k + 1) // 2.`,
    time: `O(n)`,
    space: `O(n)`,
    code_lang: `python`,
    code: `def kthGrammar(n: int, k: int) -> int:
    if n == 1:
        return 0
    parent = kthGrammar(n - 1, (k + 1) // 2)
    if k % 2 == 1:   # 奇数：左の子 → 親と同じ
        return parent
    else:             # 偶数：右の子 → 親の反転
        return 1 - parent`,
    alt_ja: `ビットの性質を利用（O(log k) 時間、O(1) 空間）：k の 2 進数表現に含まれる 1 の個数（popcount）の偶奇が答えを決める。popcount が偶数個 → 0、奇数個 → 1。

def kthGrammar_bit(n: int, k: int) -> int:
    ones = 0
    while k > 0:
        ones ^= (k & 1)   # bit を 1 つずつ見て XOR
        k >>= 1
    return ones            # ones の偶奇が答え`,
    alt_en: `Bit-property approach (O(log k) time, O(1) space): the parity of the number of 1-bits (popcount) in k's binary representation determines the answer. Even popcount → 0, odd popcount → 1.

def kthGrammar_bit(n: int, k: int) -> int:
    ones = 0
    while k > 0:
        ones ^= (k & 1)   # XOR each bit one at a time
        k >>= 1
    return ones            # parity of ones is the answer`,
    points_ja: `・親に遡る再帰で簡単に解ける（O(n)）。
・k の 2 進数に含まれる 1 の個数の偶奇で直接計算も可能（O(log k)）。
・再帰は理解しやすく、制約 n ≤ 30 に十分。
・実は「1 の個数の偶奇」ではなく、下記の表の通り popcount % 2 そのものが答えになります。`,
    points_en: `・Easy to solve by recursing back to the parent (O(n)).
・Can also be computed directly from the parity of the bit-count of k (O(log k)).
・Recursion is intuitive and sufficient for the constraint n ≤ 30.
・More precisely, popcount % 2 of k itself is the answer (the parity of the number of 1-bits).`,
  },
  {
    num: 47,
    category_en: `Recursion`,
    category_ja: `再帰`,
    title_en: `Split BST`,
    title_ja: `BSTの分割`,
    approach_ja: `BST を再帰的にたどり、ノードの値が V 以下か V より大きいかで振り分ける。値が V 以下のノードは「左側の木」に残す → そのノードと左部分木はそのまま、右部分木を再帰的に分割してつなぎ直す。値が V より大きいノードは「右側の木」に残す → そのノードと右部分木はそのまま、左部分木を再帰的に分割してつなぎ直す。BST の性質（左 < 根 < 右）を利用することで、各ノードは高々 1 回しか訪問しない → 時間計算量は木の高さ h に比例。`,
    approach_en: `Traverse the BST recursively, routing each node based on whether its value is <= V or > V. If the node value is <= V, keep it in the left tree: retain the node and its left subtree as-is, then recursively split the right subtree and reattach. If the node value is > V, keep it in the right tree: retain the node and its right subtree as-is, then recursively split the left subtree and reattach. By exploiting BST ordering (left < root < right), each node is visited at most once, so time complexity is proportional to tree height h.`,
    time: `O(h)`,
    space: `O(h)`,
    code_lang: `python`,
    code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def splitBST(root: TreeNode, V: int):
    if not root:
        return [None, None]
    if root.val <= V:
        left, right = splitBST(root.right, V)
        root.right = left   # 右部分木のうち V 以下の部分をつなぐ
        return [root, right]  # [V 以下の木, V より大きい木]
    else:
        left, right = splitBST(root.left, V)
        root.left = right   # 左部分木のうち V より大きい部分をつなぐ
        return [left, root]`,
    alt_ja: `中間順（inorder）で分けて再構築：① BST の中間走査で昇順の配列を得る → ② V を基準に分割（V 以下と V より大きいグループに分ける） → ③ それぞれから BST を構築（問題 24 の方法と同様に、ソート済み配列から BST を構築）。時間・空間計算量は O(n)。実装は単純だが、元の木のノード構造を保持せず、新しい木を構築する（構造は維持しない）。`,
    alt_en: `Inorder rebuild: ① Perform an inorder traversal of the BST to get a sorted array → ② Split the array at V (values <= V and values > V) → ③ Build a BST from each part (same as problem 24, building a BST from a sorted array). Time and space complexity are O(n). The implementation is straightforward, but does not preserve the original node structure — it constructs new trees.`,
    points_ja: `・root.val <= V のとき → root と左部分木は必ず V 以下なので左側の木に残す。
・root.val > V のとき → root と右部分木は必ず V より大きいので右側の木に残す。
・BST の分割問題は、BST の性質（左 < 根 < 右）をいかに活用するかがポイント！`,
    points_en: `・When root.val <= V: root and its left subtree are all <= V, so they stay in the left tree.
・When root.val > V: root and its right subtree are all > V, so they stay in the right tree.
・The key to BST split problems is leveraging the BST ordering property (left < root < right)!`,
  },
  {
    num: 48,
    category_en: `Sliding Window`,
    category_ja: `スライディングウィンドウ`,
    title_en: `Longest Substring Without Repeating Characters`,
    title_ja: `重複なし最長部分文字列`,
    approach_ja: `可変長のスライディングウィンドウ。右端を 1 つずつ伸ばし、ウィンドウ内に重複する文字が現れたら、その文字の「直前の出現位置 + 1」まで左端を一気に詰める。各文字の最後に出現したインデックスをハッシュマップで管理する。`,
    approach_en: `Variable-length sliding window. Extend the right boundary one step at a time. When a duplicate character appears inside the window, jump the left boundary directly to (last occurrence of that character + 1). Track the most recent index of each character in a hash map.`,
    time: `O(n)`,
    space: `O(min(n, アルファットサイズ))`,
    code_lang: `python`,
    code: `def lengthOfLongestSubstring(s: str) -> int:
    last_seen = {}
    left = 0
    max_len = 0
    for right, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= left:
            # 重複する文字がウィンドウ内にある場合、左端をその次に移動
            left = last_seen[ch] + 1
        # 現在の文字の最後の出現位置を更新
        last_seen[ch] = right
        # 現在のウィンドウ長を最大値と比較
        max_len = max(max_len, right - left + 1)
    return max_len`,
    alt_ja: `集合（set）を使う方法：ウィンドウ内の文字を set に入れて管理し、重複が出たら左端を 1 文字ずつ削除して set からも取り除く。左端の移動を 1 文字ずつ行うため最悪 O(2n) だが、依然として O(n)。

def lengthOfLongestSubstring_set(s: str) -> int:
    window = set()
    left = 0
    max_len = 0
    for right, ch in enumerate(s):
        while ch in window:
            window.remove(s[left])
            left += 1
        window.add(ch)
        max_len = max(max_len, right - left + 1)
    return max_len`,
    alt_en: `Set-based approach: maintain the window's characters in a set, and when a duplicate appears, remove characters from the left one by one until the duplicate is gone. Left advances one character at a time, giving worst-case O(2n) = O(n).

def lengthOfLongestSubstring_set(s: str) -> int:
    window = set()
    left = 0
    max_len = 0
    for right, ch in enumerate(s):
        while ch in window:
            window.remove(s[left])
            left += 1
        window.add(ch)
        max_len = max(max_len, right - left + 1)
    return max_len`,
    points_ja: `・ウィンドウは常に「重複なし」の状態を保つ。
・left は後戻りしない（単調に右へ進む）ので全体で O(n)。
・last_seen[ch] により、左端を 1 文字ずつ動かさず、一気に最適な位置へジャンプできる。
・set 版は実装が直感的でシンプルだが、重複時に left を 1 文字ずつ進めるため、ハッシュマップ版より遅い場合がある。`,
    points_en: `・The window always maintains a 'no duplicates' invariant.
・left only moves right (monotonically), so the overall complexity is O(n).
・last_seen[ch] lets the left boundary jump directly to the optimal position rather than advancing one step at a time.
・The set version is intuitive and simple, but may be slower than the hash map version since it advances left one character at a time when a duplicate is found.`,
  },
  {
    num: 49,
    category_en: `Sliding Window`,
    category_ja: `スライディングウィンドウ`,
    title_en: `Minimum Size Subarray Sum`,
    title_ja: `目標和を満たす最小区間`,
    approach_ja: `可変長のスライディングウィンドウを使う。右端（right）を 1 つずつ右に伸ばして合計を増やし、合計が target 以上になったら、左端（left）を右に動かして合計を減らしながら、最小の区間長を更新する。すべての数が正のときスライディングウィンドウが有効。合計が target 以上になったタイミングで、できるだけ左端を右に縮めて最小化する。区間が存在しない場合は 0 を返す。`,
    approach_en: `Variable-length sliding window. Extend the right boundary one step at a time to grow the sum. Whenever the sum reaches target, shrink the left boundary rightward to reduce the sum while updating the minimum window length. The sliding window is valid because all numbers are positive. Minimize by contracting the left boundary as much as possible when the sum hits target. Return 0 if no valid subarray exists.`,
    time: `O(n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `def minSubArrayLen(target: int, nums: list[int]) -> int:
    left = 0
    total = 0
    min_len = float('inf')

    for right, num in enumerate(nums):
        total += num
        # 合計が target 以上なら、左端を縮めながら最小長を更新
        while total >= target:
            min_len = min(min_len, right - left + 1)
            total -= nums[left]
            left += 1

    return min_len if min_len != float('inf') else 0`,
    alt_ja: `累積和配列 + 二分探索（時間 O(n log n)）：累積和配列 prefix を作る（prefix[i] = nums[0] + … + nums[i-1]）。各右端 r に対して、prefix[r] - prefix[l] >= target となる最小の l（0 <= l < r）を二分探索で探す。区間長は r - l。

from bisect import bisect_right

def minSubArrayLen_binary(target: int, nums: list[int]) -> int:
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    min_len = float('inf')
    for r in range(1, n + 1):
        # prefix[r] - target を満たす最大の l を探す
        l = bisect_right(prefix, prefix[r] - target) - 1  # [0, r-1] の中で探索
        if l < r:
            min_len = min(min_len, r - l)
    return min_len if min_len != float('inf') else 0`,
    alt_en: `Prefix sum + binary search (O(n log n)): Build a prefix sum array (prefix[i] = nums[0] + … + nums[i-1]). For each right boundary r, binary-search for the largest l (0 <= l < r) such that prefix[r] - prefix[l] >= target. Window length is r - l.

from bisect import bisect_right

def minSubArrayLen_binary(target: int, nums: list[int]) -> int:
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    min_len = float('inf')
    for r in range(1, n + 1):
        # find the largest l satisfying prefix[r] - target
        l = bisect_right(prefix, prefix[r] - target) - 1  # search in [0, r-1]
        if l < r:
            min_len = min(min_len, r - l)
    return min_len if min_len != float('inf') else 0`,
    points_ja: `・本問題は「すべての数が正の整数」のときスライディングウィンドウが有効。
・0 や負の数が含まれる場合は、別の方法（累積和＋ハッシュマップなど）が必要になる。
・二分探索版：「条件を満たす最大の l を見つける」考え方の練習になる。スライディングウィンドウより実装がやや重いが、別のアプローチの練習になる。`,
    points_en: `・The sliding window approach is valid when all numbers are positive integers.
・If zeros or negatives are present, a different method (e.g., prefix sum + hash map) is needed.
・The binary search version is good practice for the pattern of 'finding the largest l satisfying a condition.' It is somewhat heavier to implement than sliding window but provides valuable alternative approach experience.`,
  },
  {
    num: 50,
    category_en: `Greedy · Backtracking`,
    category_ja: `貪欲・バックトラック`,
    title_en: `Permutations`,
    title_ja: `順列の列挙`,
    approach_ja: `バックトラッキング（深さ優先探索）を使う。使用済みの数字を管理しながら、まだ使っていない数字を 1 つずつ選んで再帰的に深掘りする。全ての数字を使い切ったら 1 つの順列として記録し、戻って別の選択肢を試していく。used[i] で「その位置の数字を使ったか」を管理。path が 1 つの順列を表す。「選ぶ → 深掘り → 戻る」を繰り返して全探索。`,
    approach_en: `Use backtracking (depth-first search). Track which numbers have been used, pick one unused number at a time, and recurse deeper. When all numbers are used, record the current path as one permutation, then backtrack to try other choices. used[i] tracks whether the number at index i has been used. path holds the current permutation. Repeat 'choose → recurse → undo' to enumerate all permutations.`,
    time: `O(n * n!)`,
    space: `O(n)`,
    code_lang: `python`,
    code: `def permute(nums: list[int]) -> list[list[int]]:
    result = []
    used = [False] * len(nums)
    path = []

    def backtrack():
        if len(path) == len(nums):
            result.append(path[:])  # パスのコピーを記録
            return

        for i, num in enumerate(nums):
            if used[i]:
                continue
            used[i] = True          # 数字を使用済みにする
            path.append(num)        # パスに追加
            backtrack()             # さらに深掘り
            path.pop()              # 戻る（選択を取り消す）
            used[i] = False         # 使用済みを解除

    backtrack()
    return result`,
    alt_ja: `itertools.permutations を使う（Python）：

from itertools import permutations

def permute_itertools(nums: list[int]) -> list[list[int]]:
    return [list(p) for p in permutations(nums)]

1 行で書けるが、仕組みの理解や応用のために自前実装が推奨される！`,
    alt_en: `Using itertools.permutations (Python):

from itertools import permutations

def permute_itertools(nums: list[int]) -> list[list[int]]:
    return [list(p) for p in permutations(nums)]

This can be written in one line, but implementing from scratch is recommended for understanding and applying the technique!`,
    points_ja: `・重複する数字がある場合は別問題（Unique Permutations）として扱う。
・この問題では nums の要素はすべて異なるとする。
・時間計算量 O(n * n!)：n! 個の順列を生成し、各順列の長さが n。
・空間計算量 O(n)：再帰スタックと補助配列、出力を除く。`,
    points_en: `・When duplicate numbers exist, it is treated as a separate problem (Unique Permutations).
・In this problem all elements of nums are assumed to be distinct.
・Time complexity O(n * n!): generate n! permutations each of length n.
・Space complexity O(n): recursion stack and auxiliary arrays, excluding the output.`,
  },
  {
    num: 51,
    category_en: `Greedy · Backtracking`,
    category_ja: `貪欲・バックトラック`,
    title_en: `Subsets`,
    title_ja: `部分集合の列挙`,
    approach_ja: `バックトラッキングで、各再帰呼び出しの開始時点の現在のpathをそのまま結果に追加していく（全てのノードが有効な部分集合になる）。各要素を「含める/含めない」の2択で分岐する見方もできる。`,
    approach_en: `Use backtracking, adding the current path at the start of each recursive call (every node is a valid subset). Each element can be viewed as a binary choice: include or exclude.`,
    time: `O(n * 2^n)`,
    space: `O(n)`,
    code_lang: `python`,
    code: `def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    path = []

    def backtrack(start: int) -> None:
        # 現在の path を結果に追加
        result.append(path[:])
        # start 以降の要素を1つずつ選ぶ
        for i in range(start, len(nums)):
            path.append(nums[i])    # 含める
            backtrack(i + 1)        # 次のインデックスから探索
            path.pop()              # 含めない（戻る）

    backtrack(0)
    return result`,
    alt_ja: `ビットマスクを使う方法：0 から 2^n - 1 までの各整数を「選択のパターン」として見なす。立っているビットの位置に対応する要素を集める。時間計算量は O(n * 2^n)、空間計算量は出力を含めると O(n * 2^n)（再帰なしで反復的に実装できる）。`,
    alt_en: `Bitmask approach: treat each integer from 0 to 2^n - 1 as a selection pattern. Collect elements at positions where bits are set. Time O(n * 2^n), space O(n * 2^n) including output (can be implemented iteratively without recursion).`,
    points_ja: `n は要素数、2^n は部分集合の総数。バックトラッキングでは各ノードで「現在のpathを結果に追加 → start以降の要素を1つずつ選んで再帰（含める）→ 戻ったら最後の要素をpop（含めない選択へ戻る）」の3ステップを行う。`,
    points_en: `n is the number of elements, 2^n is the total number of subsets. In backtracking, each node performs three steps: add current path to results, recurse over elements from start onward (include), then pop the last element on return (backtrack to exclude).`,
  },
  {
    num: 52,
    category_en: `Greedy · Backtracking`,
    category_ja: `貪欲・バックトラック`,
    title_en: `Combination Sum`,
    title_ja: `組み合わせ和の探索`,
    approach_ja: `バックトラッキングで候補を1つずつ選ぶ（同じ数字を何度でも選べる）。選んだ数字の合計が target を超えたら枝を切る。重複を避けるため、次の再帰では「今選んだ数字以降」からしか選ばないようにする。`,
    approach_en: `Use backtracking to pick one candidate at a time (the same number may be chosen repeatedly). Prune branches when the running sum exceeds target. To avoid duplicates, restrict the next recursive call to start from the index of the currently chosen number.`,
    time: `O(2^target)`,
    space: `O(target)`,
    code_lang: `python`,
    code: `def combinationSum(candidates: list[int], target: int) -> list[list[int]]:
    result = []
    path = []

    def backtrack(start, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:  # 並び替え済みなので以降はすべて大きい
                break                       # 枝刈り
            path.append(candidates[i])
            backtrack(i, remaining - candidates[i])  # i を渡して同じ数字を再利用可
            path.pop()

    candidates.sort()
    backtrack(0, target)
    return result`,
    alt_ja: `DP（組み合わせの列挙）：dp[金額] = その金額を作る組み合わせのリストを保持。時間・空間計算量ともに非常に大きい（組み合わせ数に比例）。実装は可能だがメモリ消費が大きく、一般的でない。`,
    alt_en: `DP (combination enumeration): dp[amount] holds the list of combinations that sum to that amount. Both time and space complexity are very large (proportional to the number of combinations). Implementable but memory-intensive and not common in practice.`,
    points_ja: `remainingが0のときに1つの組み合わせが完成。candidates[i] > remaining なら、それ以降の数も大きいので探索終了（枝刈り）。次の再帰呼び出しでstartにiを渡すことで、同じ数字を再利用しつつ、順序の異なる重複（例：[2,3,2]と[3,2,2]）を防ぐ。同じ数字を何度でも使える「組み合わせ和」の探索は、バックトラッキング＋枝刈り＋startの工夫が鍵。`,
    points_en: `A combination is complete when remaining equals 0. If candidates[i] > remaining, all subsequent values are also too large so we prune. Passing i (not i+1) as start in the recursive call allows reuse of the same number while preventing order-duplicate combinations like [2,3,2] vs [3,2,2]. The key to combination-sum search with repetition: backtracking + pruning + the start-index trick.`,
  },
  {
    num: 53,
    category_en: `Greedy · Backtracking`,
    category_ja: `貪欲・バックトラック`,
    title_en: `Generate Parentheses`,
    title_ja: `正しいカッコ列の生成`,
    approach_ja: `バックトラッキングで「開き括弧の残り数」と「閉じ括弧の残り数」（またはこれまでの個数）を管理する。開き括弧は、まだ使える（残りがある）なら追加できる。閉じ括弧は、これまでの「開き括弧の数 > 閉じ括弧の数」のときのみ追加できる（途中で不正なカッコ列を作らないことがポイント）。`,
    approach_en: `Use backtracking while tracking the count of open and close brackets used so far. An open bracket can be added as long as the count is less than n. A close bracket can only be added when the number of open brackets used exceeds the number of close brackets (preventing invalid intermediate sequences).`,
    time: `O(4^n / sqrt(n))`,
    space: `O(n)`,
    code_lang: `python`,
    code: `def generateParenthesis(n: int) -> list[str]:
    result = []

    def backtrack(current: str, open_count: int, close_count: int):
        if len(current) == 2 * n:
            result.append(current)
            return

        # 開き括弧を追加（まだ残りがあるなら）
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)

        # 閉じ括弧を追加（開き括弧の数 > 閉じ括弧の数 のときのみ）
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)

    backtrack('', 0, 0)
    return result`,
    alt_ja: `動的計画法（DP）：dp[i] = i対の括弧で作れるすべての正しいカッコ列のリスト。任意の i (>0) に対して、最初の「(」と対応する「)」の間に j 対、その後ろに i-1-j 対が続くと考えると構築できる。時間・空間ともに O(4^n / sqrt(n))（すべての結果を保持するため）。`,
    alt_en: `Dynamic programming: dp[i] = list of all valid parenthesis strings for i pairs. For any i > 0, the first '(' is paired with ')' enclosing j pairs inside, followed by i-1-j pairs after. Both time and space are O(4^n / sqrt(n)) to store all results.`,
    points_ja: `常に「left part（最初の '(' 〜 対応する ')'）」と「right part（残りの部分）」に分けて考える。部分問題の再利用という視点が学べる。`,
    points_en: `Always decompose into a 'left part' (from the first '(' to its matching ')') and a 'right part' (the remainder). This illustrates the concept of subproblem reuse.`,
  },
  {
    num: 54,
    category_en: `Other`,
    category_ja: `その他`,
    title_en: `Move Zeroes`,
    title_ja: `0を末尾に集める`,
    approach_ja: `「次に非ゼロ要素を置くべき位置」を指すポインタ（insert_pos）を1つ持つ。配列を左から右へ走査し、非ゼロ要素が見つかるたびに insert_pos の位置へスワップして、insert_pos を1つ進める。`,
    approach_en: `Maintain a single pointer (insert_pos) pointing to the next position where a non-zero element should be placed. Scan the array left to right; whenever a non-zero element is found, swap it to insert_pos and advance insert_pos by one.`,
    time: `O(n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `def moveZeroes(nums: list[int]) -> None:
    insert_pos = 0
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[insert_pos], nums[i] = nums[i], nums[insert_pos]
            insert_pos += 1`,
    alt_ja: `非推奨：追加配列を使用。非ゼロ要素だけを新しい配列に集め、残りを0で埋めてから、元の配列にコピーする方法。ロジックは単純だが、O(n)の追加空間が必要。「その場での変更」が求められる場合は非推奨。`,
    alt_en: `Non-recommended: use an extra array. Collect all non-zero elements into a new array, pad the rest with zeros, then copy back to the original. Logic is simple but requires O(n) extra space. Not recommended when in-place modification is required.`,
    points_ja: `insert_pos は「非ゼロ要素を置く位置」を指す。非ゼロ要素を見つけたら、その位置を insert_pos へ移動（スワップ）する。常に insert_pos の左側は非ゼロ要素だけになる。2ポインタ（その場でのスワップ）を使うことで、O(1)空間で効率的に解ける。`,
    points_en: `insert_pos always points to the position where the next non-zero element should go. When a non-zero element is found, swap it to insert_pos. The left side of insert_pos always contains only non-zero elements. Using two pointers with in-place swaps solves this in O(1) extra space.`,
  },
  {
    num: 55,
    category_en: `Other`,
    category_ja: `その他`,
    title_en: `Meeting Rooms`,
    title_ja: `会議の重複チェック`,
    approach_ja: `会議の時間区間が与えられるので、1つの会議室で全ての会議を行えるかどうかを判定する（重複する会議が1つでもあればFalse）。開始時刻の昇順にソートし、隣り合う会議同士で「前の会議の終了時刻 > 次の会議の開始時刻」なら重複あり。`,
    approach_en: `Given a list of meeting time intervals, determine whether a single meeting room can accommodate all meetings (return False if any two meetings overlap). Sort by start time in ascending order, then check adjacent pairs: if the end time of the previous meeting is greater than the start time of the next, there is an overlap.`,
    time: `O(n log n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `def canAttendMeetings(intervals: list[list[int]]) -> bool:
    # 開始時刻でソート
    intervals.sort(key=lambda x: x[0])  # intervals: [start, end]
    # 第1要素（開始時刻）でソート
    # 隣り合う区間を比較
    for i in range(1, len(intervals)):
        # i 番目の会議とその直前の会議を比較
        # 次の開始時刻が前の終了時刻より小さければ重複
        if intervals[i][0] < intervals[i - 1][1]:  # 最後まで重複がなければ True
            return False
    return True`,
    alt_ja: `タイムラインのスイープ（開始/終了イベント）：開始時刻と終了時刻をそれぞれソートし、時系列にイベントを処理する。進行中の会議数が2以上になった瞬間に重複と判定する。時間計算量 O(n log n)（ソート）、空間計算量 O(1)（追加構造なし）。この考え方は「Meeting Rooms II（最小会議室数）」に拡張しやすい。`,
    alt_en: `Timeline sweep (start/end events): sort start times and end times separately, then process events chronologically. The moment the count of ongoing meetings reaches 2, a conflict is detected. Time O(n log n) (sort), space O(1) (no extra structures). This approach extends naturally to Meeting Rooms II (minimum number of rooms).`,
    points_ja: `ソートに O(n log n)、走査に O(n) で全体 O(n log n)。ソートはin-placeとして O(1) とする（言語や実装によっては O(log n) の場合もある）。区間は左閉右開 [start, end) の前提が一般的だが、この解法は [start, end] の閉区間でも動作する（条件を '>=' に変えればよい）。`,
    points_en: `Overall O(n log n): O(n log n) for the sort and O(n) for the scan. Space is O(1) treating sort as in-place (O(log n) depending on language/implementation). Intervals are generally assumed half-open [start, end), but the approach also works for closed [start, end] intervals by changing the condition to '>='.`,
  },
  {
    num: 56,
    category_en: `Other`,
    category_ja: `その他`,
    title_en: `Meeting Rooms II`,
    title_ja: `必要な会議室の最小数`,
    approach_ja: `開始時刻で会議を並べ、最小ヒープに「現在使われている会議の終了時刻」を入れて管理する。新しい会議の開始時刻が、ヒープの最小終了時刻以降であれば、その部屋を再利用（終了時刻を置き換え）。そうでなければ、新しい部屋（新しい終了時刻）を追加する。ヒープのサイズの最大値 = 同時に必要な会議室の最小数。`,
    approach_en: `Sort meetings by start time and use a min-heap to track the end times of currently occupied rooms. If a new meeting's start time is at or after the earliest end time in the heap, reuse that room (replace its end time). Otherwise, add a new room (push the new end time). The maximum heap size equals the minimum number of rooms needed.`,
    time: `O(n log n)`,
    space: `O(n)`,
    code_lang: `python`,
    code: `import heapq

def minMeetingRooms(intervals: list[list[int]]) -> int:
    if not intervals:
        return 0
    intervals.sort(key=lambda x: x[0])  # 開始時刻でソート
    heap = []  # 最小ヒープ：終了時刻を保持
    for start, end in intervals:
        if heap and heap[0] <= start:
            heapq.heapreplace(heap, end)  # 最小の end を end に置き換え
        else:
            heapq.heappush(heap, end)  # 新しい部屋を追加
    return len(heap)  # ヒープサイズが必要な最小部屋数`,
    alt_ja: `2ポインタでスイープ：開始時刻の配列と終了時刻の配列をそれぞれソートし、2つのポインタで進めながら「同時に進行中の会議数」の最大値を数える。時間計算量 O(n log n)（ソート）、空間計算量 O(1)（追加構造なし）。`,
    alt_en: `Two-pointer sweep: sort start times and end times separately, then advance two pointers to count the maximum number of concurrently running meetings. Time O(n log n) (sort), space O(1) (no extra structures).`,
    points_ja: `時間計算量 O(n log n)（ソート O(n log n)、各会議の処理（入れ替えor追加）O(log n) を n 回）。空間計算量 O(n)（ヒープに最大 n 個の終了時刻を保持）。`,
    points_en: `Time O(n log n): O(n log n) for the sort plus O(log n) per meeting for heap operations over n meetings. Space O(n): the heap holds at most n end times.`,
  },
  {
    num: 57,
    category_en: `Other`,
    category_ja: `その他`,
    title_en: `Is Subsequence`,
    title_ja: `部分列かどうかの判定`,
    approach_ja: `文字列 s が文字列 t の部分列（順序を保ったまま一部の文字を削除して得られる）かどうかを判定する。sのポインタ i と t のポインタ j をそれぞれ先頭（0）に置く。t の文字を左から右へ1文字ずつ調べ、s[i] と t[j] が等しければ i を1進める（s の次の文字を探す）。等しくなければ、j だけ進めて次の文字をみる。t を最後まで見終えて、i が len(s) に到達していれば True。`,
    approach_en: `Determine whether string s is a subsequence of string t (obtainable by deleting some characters of t while preserving order). Place pointer i at the start of s and pointer j at the start of t. Scan t left to right one character at a time: if s[i] == t[j], advance i (found the next character of s); otherwise only advance j. If i reaches len(s) after scanning all of t, return True.`,
    time: `O(n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `def isSubsequence(s: str, t: str) -> bool:
    i = 0
    for ch in t:
        if i < len(s) and s[i] == ch:
            i += 1
    return i == len(s)

# t の各文字を左から順に走査し、
# 一致したときだけ s のポインタを進める。
# 最後に s の全文字を使い切れていれば True。`,
    alt_ja: `同じ t に対して多数の s を判定する場合：t の各文字が出現するインデックスのリストを事前に作成し、二分探索で「現在位置よりも後の次の出現位置」を探す。前処理 O(n)（n = len(t)）、各クエリ O(k log n)（k = len(s)）。大量の s を効率よく判定可能。`,
    alt_en: `When checking many strings s against the same t: precompute a list of indices for each character in t, then use binary search to find the next occurrence after the current position. Preprocessing O(n) (n = len(t)), each query O(k log n) (k = len(s)). Efficient for many queries against the same t.`,
    points_ja: `部分列とは：文字の「順序」を保ったまま、いくつかの文字を削除して得られるもの。連続している必要はない（部分文字列とは異なる）。`,
    points_en: `A subsequence preserves the relative order of characters while allowing some to be deleted. The characters do not need to be contiguous (unlike a substring).`,
  },
  {
    num: 58,
    category_en: `Other`,
    category_ja: `その他`,
    title_en: `Next Permutation`,
    title_ja: `次の順列`,
    approach_ja: `1. 右から左に見て、隣り合う要素で「左の方が小さい」位置を探す（これがpivot）。→ nums[i] < nums[i+1] となる最大の i を見つける。2. pivotが見つかった場合：pivot より右側で、nums[i] より大きい要素のうち最小のものを右から探す（インデックス j）。3. nums[i] と nums[j] を交換する。4. pivot より右側の部分（i+1 以降）を反転させて昇順にする（最小の並びにする）。5. pivot が見つからなかった場合：全体が降順なので、全体を反転させて昇順にする。`,
    approach_en: `1. Scan right to left to find the rightmost position where the left element is smaller than its right neighbor (pivot): the largest i such that nums[i] < nums[i+1]. 2. If a pivot is found: search from the right for the smallest element greater than nums[i] (index j). 3. Swap nums[i] and nums[j]. 4. Reverse the suffix from i+1 onward to make it ascending (the smallest arrangement). 5. If no pivot is found, the entire array is descending; reverse it to get the smallest (ascending) permutation.`,
    time: `O(n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `def nextPermutation(nums: list[int]) -> None:
    n = len(nums)
    # 1. pivot を探す（右から見て最初に昇順が崩れる位置）
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1

    if i >= 0:
        # 2. pivot より右側で nums[i] より大きい最小の要素を探す
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        # 3. 交換
        nums[i], nums[j] = nums[j], nums[i]

    # 4. pivot より右側を反転（昇順にする）
    nums[i + 1:] = reversed(nums[i + 1:])`,
    alt_ja: `全ての順列を生成してソートし、現在の配列の次の順列を返す方法。正しい結果は得られるが、順列の総数は n! 通りあるため、実用的ではない。n が大きくなると現実的でない（例：n = 10 でも 10! = 3,628,800 通り）。`,
    alt_en: `Generate all permutations, sort them, and return the one after the current array. Produces correct results, but the total number of permutations is n!, making it impractical for large n (e.g., n=10 gives 10! = 3,628,800 permutations).`,
    points_ja: `右から見て昇順が崩れる最初の位置（pivot）を見つける。pivot より右側の最小かつ pivot より大きい値を交換後、右側を反転して最小の並び（昇順）にする。pivot が見つからない場合は全体が降順なので、全体を反転して最小の順列に戻す。すべての操作を O(n) 時間、O(1) 空間で実現できる。`,
    points_en: `Find the rightmost position (pivot) where ascending order breaks when scanning from the right. Swap with the smallest value on the right that exceeds the pivot, then reverse the right portion to get the minimum (ascending) arrangement. If no pivot exists the array is fully descending — reverse the whole thing to return to the minimum permutation. All operations run in O(n) time and O(1) space.`,
  },
  {
    num: 59,
    category_en: `Other`,
    category_ja: `その他`,
    title_en: `String to Integer (atoi)`,
    title_ja: `文字列から整数への変換`,
    approach_ja: `状態遷移的に文字列を左から読み進める。① 先頭の空白を読み飛ばす（状態：START → SIGN）。② 符号（+ / -）を確認する（状態：SIGN → NUMBER）。③ 数字が続く限り読み取り、数値を構築する（状態：NUMBER）。④ 数字以外の文字が出た時点で読み取りを終了する。⑤ 32bit 整数の範囲でクランプして返す。`,
    approach_en: `Process the string left to right in a state-machine fashion. ① Skip leading whitespace (state: START → SIGN). ② Check for a sign character '+' or '-' (state: SIGN → NUMBER). ③ Read digits and build the number as long as digits continue (state: NUMBER). ④ Stop reading when a non-digit character is encountered. ⑤ Clamp the result to the 32-bit integer range and return.`,
    time: `O(n)`,
    space: `O(1)`,
    code_lang: `python`,
    code: `def myAtoi(s: str) -> int:
    s = s.lstrip()          # 先頭の空白を除去
    if not s:
        return 0            # 空文字の場合

    i = 0
    sign = 1
    if s[i] in '+-':
        sign = -1 if s[i] == '-' else 1  # 符号の確認
        i += 1

    num_str = ''
    while i < len(s) and s[i].isdigit():  # 数字を読み取る
        num_str += s[i]
        i += 1

    if not num_str:
        return 0            # 数字が1つもなければ 0

    result = sign * int(num_str)  # 整数に変換
    INT_MAX, INT_MIN = 2**31 - 1, -2**31
    return max(INT_MIN, min(INT_MAX, result))  # 範囲でクランプ`,
    alt_ja: `正規表現（re.match）を使う方法：符号と数字のパターンを一度に抽出して変換する。実装が簡潔で数字以外の文字で自動的に停止するが、状態遷移の理解や練習には向かず、面接では手書きの状態遷移版が好まれることが多い。`,
    alt_en: `Regular expression (re.match) approach: extract the sign and digit pattern in one shot and convert. Implementation is concise and automatically stops at non-digit characters, but it is not suitable for learning or practicing state-machine thinking. Interviews tend to prefer the explicit state-transition version.`,
    points_ja: `lstrip() で先頭の空白を一括で除去。isdigit() で数字かどうかを判定。int(num_str) による変換は Python の大きな整数でも安全。最後に 32bit 整数の範囲にクランプすることを忘れない。空白・符号・数字・終了条件・オーバーフローの5つを正しく処理することが重要。`,
    points_en: `lstrip() removes all leading whitespace at once. isdigit() checks for digit characters. int(num_str) is safe in Python because it handles arbitrary-precision integers. Remember to clamp to the 32-bit integer range at the end. The five things to handle correctly: whitespace, sign, digits, termination condition, and overflow.`,
  },
  {
    num: 60,
    category_en: `Other`,
    category_ja: `その他`,
    title_en: `ZigZag Conversion`,
    title_ja: `ジグザグ変換`,
    approach_ja: `numRows 個の行バッファを用意し、現在どの行にいるかを上端（0行）・下端（numRows-1行）で折り返しながら1文字ずつ配置していく（ジグザグのシミュレーション）。最後にすべての行を上から順に連結する。`,
    approach_en: `Allocate numRows row buffers and simulate the zigzag pattern: place each character into the current row, reversing direction when the top row (0) or bottom row (numRows-1) is reached. Finally, concatenate all rows from top to bottom.`,
    time: `O(n)`,
    space: `O(n)`,
    code_lang: `python`,
    code: `def convert(s: str, numRows: int) -> str:
    if numRows == 1 or numRows >= len(s):
        return s
    rows = [''] * numRows
    curr_row = 0
    direction = -1  # 上に進むとき -1、下に進むとき +1
    for ch in s:
        rows[curr_row] += ch
        if curr_row == 0 or curr_row == numRows - 1:
            direction *= -1
        curr_row += direction
    return ''.join(rows)`,
    alt_ja: `インデックスを数式で直接計算する方法（O(1)空間）：サイクル長 cycle = 2 * numRows - 2 を利用する。各行 r (0 <= r < numRows) に属するインデックスは次の通り。r = 0行（最上段）: i = k * cycle。r = numRows-1行（最下段）: i = k * cycle + (numRows - 1)。それ以外の行 (0 < r < numRows - 1): i1 = k * cycle + r と i2 = k * cycle + cycle - r を交互に取る（i2 は i2 < n のときだけ）。メリット：行バッファを使わず出力以外の追加空間は O(1)。デメリット：数式の理解と実装がやや難しい。`,
    alt_en: `Direct index calculation (O(1) extra space): use cycle length cycle = 2 * numRows - 2. Indices belonging to row r (0 <= r < numRows) are: row 0 (top): i = k * cycle; row numRows-1 (bottom): i = k * cycle + (numRows - 1); other rows (0 < r < numRows-1): alternate between i1 = k * cycle + r and i2 = k * cycle + cycle - r (include i2 only when i2 < n). Advantage: no row buffers, O(1) extra space beyond output. Disadvantage: the formula is somewhat tricky to derive and implement.`,
    points_ja: `上端（0行）と下端（numRows-1行）に到達したら、方向を反転する。curr_row は常に 0 〜 numRows-1 の範囲にとどまる。各文字をちょうど1行に1回ずつ追加するので、時間計算量は O(n)。`,
    points_en: `Reverse direction whenever the top row (0) or bottom row (numRows-1) is reached. curr_row always stays in the range [0, numRows-1]. Each character is added to exactly one row exactly once, so time complexity is O(n).`,
  },
] as const;

/** Canonical category order (matches the 12-category arai60 curriculum). */
export const CATEGORY_ORDER: readonly string[] = [
  "Linked List",
  "Stack",
  "Heap · Priority Queue",
  "HashMap",
  "Graph · BFS/DFS",
  "Tree · BT · BST",
  "Dynamic Programming",
  "Binary Search",
  "Recursion",
  "Sliding Window",
  "Greedy · Backtracking",
  "Other",
] as const;

export interface Category {
  readonly en: string;
  readonly ja: string;
  readonly problems: readonly Problem[];
}

/** Returns problems grouped by category in canonical order. */
export function groupByCategory(): readonly Category[] {
  return CATEGORY_ORDER.map((en) => ({
    en,
    ja: PROBLEMS.find((p) => p.category_en === en)?.category_ja ?? en,
    problems: PROBLEMS.filter((p) => p.category_en === en),
  }));
}

/** Slugify a category_en string for use in anchor ids. */
export function categorySlug(en: string): string {
  return en
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
