/**
 * Generic binary min-heap (or max-heap) backed by an array.
 *
 * The comparator follows the same convention as Array.prototype.sort:
 *   < 0 → a has higher priority (comes out first)
 *   > 0 → b has higher priority
 *   = 0 → equal priority
 */
export class BinaryHeap<T> {
  private readonly data: T[] = [];
  private readonly cmp: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.cmp = comparator;
  }

  get size(): number {
    return this.data.length;
  }

  peek(): T | undefined {
    return this.data[0];
  }

  push(value: T): void {
    this.data.push(value);
    this.bubbleUp(this.data.length - 1);
  }

  pop(): T | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0] as T;
    const last = this.data.pop() as T;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.sinkDown(0);
    }
    return top;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.cmp(this.data[i] as T, this.data[parent] as T) < 0) {
        this.swap(i, parent);
        i = parent;
      } else {
        break;
      }
    }
  }

  private sinkDown(i: number): void {
    const n = this.data.length;
    for (;;) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let best = i;
      if (left < n && this.cmp(this.data[left] as T, this.data[best] as T) < 0)
        best = left;
      if (
        right < n &&
        this.cmp(this.data[right] as T, this.data[best] as T) < 0
      )
        best = right;
      if (best === i) break;
      this.swap(i, best);
      i = best;
    }
  }

  private swap(a: number, b: number): void {
    const tmp = this.data[a] as T;
    this.data[a] = this.data[b] as T;
    this.data[b] = tmp;
  }
}
