import type { Simulation, StepMeta } from "@nand2web/sim-core";
import type { Grid } from "./grid.ts";
import { type Coord, coordEq, coordKey, neighbors } from "./grid.ts";
import { MinHeap } from "./heap.ts";

// ---------------------------------------------------------------------------
// Step / Result types
// ---------------------------------------------------------------------------

export interface PathStep {
  /** The cell currently being expanded (popped from frontier). */
  readonly current: Coord;
  /**
   * Coords currently in the frontier (queue / stack / heap).
   * Snapshot at the moment this step is emitted.
   */
  readonly frontier: readonly Coord[];
  /** Coords already settled (expanded). */
  readonly visited: readonly Coord[];
  readonly meta: StepMeta;
}

export interface PathResult {
  /** Reconstructed path from start → goal, inclusive. Empty when not found. */
  readonly path: readonly Coord[];
  readonly stats: PathStats;
}

export interface PathStats {
  readonly found: boolean;
  /** Number of cells fully settled (expanded). */
  readonly visitedCount: number;
  /** Length of the path (number of cells, including start and goal). 0 if not found. */
  readonly pathLength: number;
  /** Peak size of the frontier during the search. */
  readonly frontierPeak: number;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function reconstructPath(
  cameFrom: Map<string, Coord>,
  start: Coord,
  goal: Coord,
): Coord[] {
  const path: Coord[] = [];
  let cur = goal;
  while (!coordEq(cur, start)) {
    path.push(cur);
    const key = coordKey(cur);
    const prev = cameFrom.get(key);
    if (prev === undefined) return []; // disconnected — shouldn't happen
    cur = prev;
  }
  path.push(start);
  path.reverse();
  return path;
}

function frontierPeakTrack(current: number, peak: { n: number }): void {
  if (current > peak.n) peak.n = current;
}

// ---------------------------------------------------------------------------
// BFS
// ---------------------------------------------------------------------------

export function* bfs(
  grid: Grid,
  start: Coord,
  goal: Coord,
): Simulation<PathStep, PathResult> {
  const queue: Coord[] = [start];
  const visitedSet = new Set<string>([coordKey(start)]);
  const cameFrom = new Map<string, Coord>();
  const settled: Coord[] = [];
  const peak = { n: 0 };

  while (queue.length > 0) {
    frontierPeakTrack(queue.length, peak);

    const current = queue.shift() as Coord;
    const currentKey = coordKey(current);

    yield {
      current,
      frontier: [...queue],
      visited: [...settled],
      meta: {
        label: `BFS: expand (${current.x},${current.y})`,
        highlights: [currentKey],
      },
    };

    if (coordEq(current, goal)) {
      settled.push(current);
      const path = reconstructPath(cameFrom, start, goal);
      return {
        path,
        stats: {
          found: true,
          visitedCount: settled.length,
          pathLength: path.length,
          frontierPeak: peak.n,
        },
      };
    }

    settled.push(current);

    for (const nb of neighbors(grid, current)) {
      const nbKey = coordKey(nb);
      if (!visitedSet.has(nbKey)) {
        visitedSet.add(nbKey);
        cameFrom.set(nbKey, current);
        queue.push(nb);
      }
    }
  }

  return {
    path: [],
    stats: {
      found: false,
      visitedCount: settled.length,
      pathLength: 0,
      frontierPeak: peak.n,
    },
  };
}

// ---------------------------------------------------------------------------
// DFS
// ---------------------------------------------------------------------------

export function* dfs(
  grid: Grid,
  start: Coord,
  goal: Coord,
): Simulation<PathStep, PathResult> {
  const stack: Coord[] = [start];
  const visitedSet = new Set<string>([coordKey(start)]);
  const cameFrom = new Map<string, Coord>();
  const settled: Coord[] = [];
  const peak = { n: 0 };

  while (stack.length > 0) {
    frontierPeakTrack(stack.length, peak);

    const current = stack.pop() as Coord;
    const currentKey = coordKey(current);

    yield {
      current,
      frontier: [...stack],
      visited: [...settled],
      meta: {
        label: `DFS: expand (${current.x},${current.y})`,
        highlights: [currentKey],
      },
    };

    if (coordEq(current, goal)) {
      settled.push(current);
      const path = reconstructPath(cameFrom, start, goal);
      return {
        path,
        stats: {
          found: true,
          visitedCount: settled.length,
          pathLength: path.length,
          frontierPeak: peak.n,
        },
      };
    }

    settled.push(current);

    for (const nb of neighbors(grid, current)) {
      const nbKey = coordKey(nb);
      if (!visitedSet.has(nbKey)) {
        visitedSet.add(nbKey);
        cameFrom.set(nbKey, current);
        stack.push(nb);
      }
    }
  }

  return {
    path: [],
    stats: {
      found: false,
      visitedCount: settled.length,
      pathLength: 0,
      frontierPeak: peak.n,
    },
  };
}

// ---------------------------------------------------------------------------
// Dijkstra
// ---------------------------------------------------------------------------

interface DijkstraNode {
  readonly priority: number; // g cost (distance from start)
  readonly coord: Coord;
}

export function* dijkstra(
  grid: Grid,
  start: Coord,
  goal: Coord,
): Simulation<PathStep, PathResult> {
  const heap = new MinHeap<DijkstraNode>();
  heap.push({ priority: 0, coord: start });

  const dist = new Map<string, number>();
  dist.set(coordKey(start), 0);

  const cameFrom = new Map<string, Coord>();
  const settled: Coord[] = [];
  const settledSet = new Set<string>();
  const peak = { n: 0 };

  while (heap.size > 0) {
    frontierPeakTrack(heap.size, peak);

    const node = heap.pop() as DijkstraNode;
    const { coord: current, priority: g } = node;
    const currentKey = coordKey(current);

    // Skip stale entries (a coord can appear multiple times in the heap).
    if (settledSet.has(currentKey)) continue;
    settledSet.add(currentKey);

    // Build frontier snapshot from heap contents (only unsettled unique coords).
    const frontierSnapshot = collectHeapFrontier(heap, settledSet);

    yield {
      current,
      frontier: frontierSnapshot,
      visited: [...settled],
      meta: {
        label: `Dijkstra: expand (${current.x},${current.y}) g=${g}`,
        highlights: [currentKey],
      },
    };

    if (coordEq(current, goal)) {
      settled.push(current);
      const path = reconstructPath(cameFrom, start, goal);
      return {
        path,
        stats: {
          found: true,
          visitedCount: settled.length,
          pathLength: path.length,
          frontierPeak: peak.n,
        },
      };
    }

    settled.push(current);

    for (const nb of neighbors(grid, current)) {
      const nbKey = coordKey(nb);
      if (settledSet.has(nbKey)) continue;
      const newG = g + 1; // uniform weight
      const oldG = dist.get(nbKey) ?? Infinity;
      if (newG < oldG) {
        dist.set(nbKey, newG);
        cameFrom.set(nbKey, current);
        heap.push({ priority: newG, coord: nb });
      }
    }
  }

  return {
    path: [],
    stats: {
      found: false,
      visitedCount: settled.length,
      pathLength: 0,
      frontierPeak: peak.n,
    },
  };
}

// ---------------------------------------------------------------------------
// A*
// ---------------------------------------------------------------------------

interface AStarNode {
  readonly priority: number; // f = g + h
  readonly g: number;
  readonly coord: Coord;
}

function manhattan(a: Coord, b: Coord): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function* astar(
  grid: Grid,
  start: Coord,
  goal: Coord,
): Simulation<PathStep, PathResult> {
  const heap = new MinHeap<AStarNode>();
  heap.push({ priority: manhattan(start, goal), g: 0, coord: start });

  const gCost = new Map<string, number>();
  gCost.set(coordKey(start), 0);

  const cameFrom = new Map<string, Coord>();
  const settled: Coord[] = [];
  const settledSet = new Set<string>();
  const peak = { n: 0 };

  while (heap.size > 0) {
    frontierPeakTrack(heap.size, peak);

    const node = heap.pop() as AStarNode;
    const { coord: current, priority: f, g } = node;
    const currentKey = coordKey(current);

    if (settledSet.has(currentKey)) continue;
    settledSet.add(currentKey);

    const frontierSnapshot = collectHeapFrontier(heap, settledSet);

    yield {
      current,
      frontier: frontierSnapshot,
      visited: [...settled],
      meta: {
        label: `A*: expand (${current.x},${current.y}) f=${f} g=${g} h=${f - g}`,
        highlights: [currentKey],
      },
    };

    if (coordEq(current, goal)) {
      settled.push(current);
      const path = reconstructPath(cameFrom, start, goal);
      return {
        path,
        stats: {
          found: true,
          visitedCount: settled.length,
          pathLength: path.length,
          frontierPeak: peak.n,
        },
      };
    }

    settled.push(current);

    for (const nb of neighbors(grid, current)) {
      const nbKey = coordKey(nb);
      if (settledSet.has(nbKey)) continue;
      const newG = g + 1; // uniform weight
      const oldG = gCost.get(nbKey) ?? Infinity;
      if (newG < oldG) {
        gCost.set(nbKey, newG);
        cameFrom.set(nbKey, current);
        const h = manhattan(nb, goal);
        heap.push({ priority: newG + h, g: newG, coord: nb });
      }
    }
  }

  return {
    path: [],
    stats: {
      found: false,
      visitedCount: settled.length,
      pathLength: 0,
      frontierPeak: peak.n,
    },
  };
}

// ---------------------------------------------------------------------------
// Helper: snapshot unique unsettled coords from heap internals.
// The heap does not expose its internal array, so we drain+rebuild it here.
// To avoid destroying the heap we reconstruct it after collecting.
// ---------------------------------------------------------------------------

function collectHeapFrontier<T extends { priority: number; coord: Coord }>(
  heap: MinHeap<T>,
  settledSet: ReadonlySet<string>,
): Coord[] {
  // We need to peek at heap contents without destructuring it.
  // The cleanest zero-mutation approach: drain to temp array, rebuild.
  const tmp: T[] = [];
  while (heap.size > 0) {
    tmp.push(heap.pop() as T);
  }
  const seen = new Set<string>();
  const result: Coord[] = [];
  for (const item of tmp) {
    const k = coordKey(item.coord);
    if (!settledSet.has(k) && !seen.has(k)) {
      seen.add(k);
      result.push(item.coord);
    }
    heap.push(item);
  }
  return result;
}
