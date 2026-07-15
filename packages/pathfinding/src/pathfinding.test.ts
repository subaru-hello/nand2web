import { collectSteps } from "@nand2web/sim-core";
import { describe, expect, it } from "vitest";
import { type Coord, coordEq, createGrid, setWall } from "./grid.ts";
import { MinHeap } from "./heap.ts";
import {
  astar,
  bfs,
  dfs,
  dijkstra,
  type PathResult,
  type PathStep,
} from "./search.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type SearchFn = (
  grid: ReturnType<typeof createGrid>,
  start: Coord,
  goal: Coord,
) => Generator<PathStep, PathResult, void>;

/** 5×5 open grid, start=(0,0), goal=(4,4). Shortest path = 9 cells (8 steps). */
function openGrid5x5() {
  return createGrid(5, 5, { x: 0, y: 0 }, { x: 4, y: 4 });
}

/** Open grid but with a wall that forces a detour. */
function wallGrid5x5() {
  // Block column x=2 for rows 0-3, forcing path to go around via row 4.
  let g = openGrid5x5();
  for (let y = 0; y < 4; y++) {
    g = setWall(g, { x: 2, y }, true);
  }
  return g;
}

/** Grid where goal is completely surrounded by walls. */
function isolatedGoalGrid() {
  let g = createGrid(5, 5, { x: 0, y: 0 }, { x: 4, y: 4 });
  // surround (4,4)
  g = setWall(g, { x: 3, y: 4 }, true);
  g = setWall(g, { x: 4, y: 3 }, true);
  return g;
}

/** Minimum BFS/Dijkstra/A* shortest path on the open 5×5 grid = 9 cells. */
const OPEN_SHORTEST = 9;

function isValidPath(
  path: readonly Coord[],
  start: Coord,
  goal: Coord,
): boolean {
  if (path.length === 0) return false;
  if (!coordEq(path[0] as Coord, start)) return false;
  if (!coordEq(path[path.length - 1] as Coord, goal)) return false;
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1] as Coord;
    const b = path[i] as Coord;
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    if (dx + dy !== 1) return false; // must be 4-directional neighbor
  }
  return true;
}

// ---------------------------------------------------------------------------
// MinHeap tests
// ---------------------------------------------------------------------------

describe("MinHeap", () => {
  it("pop returns items in ascending priority order", () => {
    const heap = new MinHeap<{ priority: number; val: string }>();
    heap.push({ priority: 5, val: "e" });
    heap.push({ priority: 1, val: "a" });
    heap.push({ priority: 3, val: "c" });
    heap.push({ priority: 2, val: "b" });
    heap.push({ priority: 4, val: "d" });

    const order: number[] = [];
    while (heap.size > 0) {
      const item = heap.pop();
      if (item !== undefined) order.push(item.priority);
    }
    expect(order).toEqual([1, 2, 3, 4, 5]);
  });

  it("interleaved push/pop maintains min-heap order", () => {
    const heap = new MinHeap<{ priority: number }>();
    heap.push({ priority: 10 });
    heap.push({ priority: 5 });
    expect(heap.pop()?.priority).toBe(5);
    heap.push({ priority: 3 });
    heap.push({ priority: 7 });
    expect(heap.pop()?.priority).toBe(3);
    expect(heap.pop()?.priority).toBe(7);
    expect(heap.pop()?.priority).toBe(10);
    expect(heap.pop()).toBeUndefined();
  });

  it("peek returns minimum without removal", () => {
    const heap = new MinHeap<{ priority: number }>();
    heap.push({ priority: 4 });
    heap.push({ priority: 1 });
    expect(heap.peek()?.priority).toBe(1);
    expect(heap.size).toBe(2);
  });

  it("handles empty heap safely", () => {
    const heap = new MinHeap<{ priority: number }>();
    expect(heap.pop()).toBeUndefined();
    expect(heap.peek()).toBeUndefined();
    expect(heap.size).toBe(0);
  });

  it("correctly sorts 50 random-priority items", () => {
    const items = Array.from({ length: 50 }, (_, i) => ({
      priority: Math.floor(Math.random() * 1000),
      id: i,
    }));
    const heap = new MinHeap<{ priority: number; id: number }>();
    for (const item of items) heap.push(item);

    const popped: number[] = [];
    while (heap.size > 0) {
      const item = heap.pop();
      if (item !== undefined) popped.push(item.priority);
    }
    const sorted = [...items.map((i) => i.priority)].sort((a, b) => a - b);
    expect(popped).toEqual(sorted);
  });
});

// ---------------------------------------------------------------------------
// Optimal path length: BFS, Dijkstra, A*
// ---------------------------------------------------------------------------

const optimalAlgos: Array<{ name: string; fn: SearchFn }> = [
  { name: "bfs", fn: bfs as SearchFn },
  { name: "dijkstra", fn: dijkstra as SearchFn },
  { name: "astar", fn: astar as SearchFn },
];

describe.each(optimalAlgos)("$name — optimal path", ({ fn }) => {
  it("finds shortest path on open 5×5 grid", () => {
    const grid = openGrid5x5();
    const { result } = collectSteps(fn(grid, grid.start, grid.goal));
    expect(result).toBeDefined();
    expect(result!.stats.found).toBe(true);
    expect(result!.stats.pathLength).toBe(OPEN_SHORTEST);
    expect(isValidPath(result!.path, grid.start, grid.goal)).toBe(true);
  });

  it("finds shortest path on grid with wall obstacle", () => {
    const grid = wallGrid5x5();
    const { result } = collectSteps(fn(grid, grid.start, grid.goal));
    expect(result).toBeDefined();
    expect(result!.stats.found).toBe(true);
    expect(result!.stats.pathLength).toBeGreaterThanOrEqual(OPEN_SHORTEST);
    expect(isValidPath(result!.path, grid.start, grid.goal)).toBe(true);
  });

  it("returns found:false and empty path when goal is unreachable", () => {
    const grid = isolatedGoalGrid();
    const { result } = collectSteps(fn(grid, grid.start, grid.goal));
    expect(result).toBeDefined();
    expect(result!.stats.found).toBe(false);
    expect(result!.path.length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// DFS — valid path (not necessarily optimal)
// ---------------------------------------------------------------------------

describe("dfs", () => {
  it("finds a valid path (start→goal, each step a neighbor, no walls) on open grid", () => {
    const grid = openGrid5x5();
    const { result } = collectSteps(dfs(grid, grid.start, grid.goal));
    expect(result).toBeDefined();
    expect(result!.stats.found).toBe(true);
    expect(isValidPath(result!.path, grid.start, grid.goal)).toBe(true);
  });

  it("finds a valid path on grid with wall obstacle", () => {
    const grid = wallGrid5x5();
    const { result } = collectSteps(dfs(grid, grid.start, grid.goal));
    expect(result).toBeDefined();
    expect(result!.stats.found).toBe(true);
    expect(isValidPath(result!.path, grid.start, grid.goal)).toBe(true);
  });

  it("returns found:false when goal is unreachable", () => {
    const grid = isolatedGoalGrid();
    const { result } = collectSteps(dfs(grid, grid.start, grid.goal));
    expect(result).toBeDefined();
    expect(result!.stats.found).toBe(false);
    expect(result!.path.length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// All four algorithms: generators yield ≥1 step before completing
// ---------------------------------------------------------------------------

const allAlgos: Array<{ name: string; fn: SearchFn }> = [
  { name: "bfs", fn: bfs as SearchFn },
  { name: "dfs", fn: dfs as SearchFn },
  { name: "dijkstra", fn: dijkstra as SearchFn },
  { name: "astar", fn: astar as SearchFn },
];

describe.each(allAlgos)("$name — generator steps", ({ fn }) => {
  it("yields ≥1 step before completing on open grid", () => {
    const grid = openGrid5x5();
    const { steps } = collectSteps(fn(grid, grid.start, grid.goal));
    expect(steps.length).toBeGreaterThanOrEqual(1);
  });

  it("step shape has current, frontier, visited, and meta.label", () => {
    const grid = openGrid5x5();
    const gen = fn(grid, grid.start, grid.goal);
    const first = gen.next();
    expect(first.done).toBe(false);
    const step = first.value as PathStep;
    expect(step.current).toBeDefined();
    expect(typeof step.current.x).toBe("number");
    expect(typeof step.current.y).toBe("number");
    expect(Array.isArray(step.frontier)).toBe(true);
    expect(Array.isArray(step.visited)).toBe(true);
    expect(typeof step.meta.label).toBe("string");
  });
});
