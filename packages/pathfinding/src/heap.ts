// ---------------------------------------------------------------------------
// Hand-rolled array-based binary MIN-heap, generic over items with a
// numeric priority field.
// ---------------------------------------------------------------------------

export interface HeapItem {
  readonly priority: number;
}

export class MinHeap<T extends HeapItem> {
  private readonly data: T[] = [];

  get size(): number {
    return this.data.length;
  }

  peek(): T | undefined {
    return this.data[0];
  }

  push(item: T): void {
    this.data.push(item);
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
      const cur = this.data[i] as T;
      const par = this.data[parent] as T;
      if (cur.priority < par.priority) {
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
      if (
        left < n &&
        (this.data[left] as T).priority < (this.data[best] as T).priority
      )
        best = left;
      if (
        right < n &&
        (this.data[right] as T).priority < (this.data[best] as T).priority
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
