import type { Coord, Grid, PathResult, PathStep } from "@nand2web/pathfinding";
import {
  astar,
  bfs,
  cloneGrid,
  coordEq,
  coordKey,
  createGrid,
  dfs,
  dijkstra,
  isWall,
  setWall,
} from "@nand2web/pathfinding";
import { collectSteps } from "@nand2web/sim-core";
import { useCallback, useMemo, useRef, useState } from "react";
import { usePlayback } from "../playback/usePlayback";

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

type AlgoId = "bfs" | "dfs" | "dijkstra" | "astar";

const ALGO_META: { id: AlgoId; name: string }[] = [
  { id: "bfs", name: "BFS" },
  { id: "dfs", name: "DFS" },
  { id: "dijkstra", name: "Dijkstra" },
  { id: "astar", name: "A*" },
];

type AlgoFn = (
  grid: Grid,
  start: Coord,
  goal: Coord,
) => Generator<PathStep, PathResult, void>;

const ALGO_FNS: Record<AlgoId, AlgoFn> = {
  bfs,
  dfs,
  dijkstra,
  astar,
};

const GRID_W = 25;
const GRID_H = 15;
const DEFAULT_START: Coord = { x: 2, y: 7 };
const DEFAULT_GOAL: Coord = { x: 22, y: 7 };

type PaintMode = "wall" | "erase" | "move-start" | "move-goal" | null;

// ---------------------------------------------------------------------------
// Maze generation (recursive division, simple version)
// ---------------------------------------------------------------------------

function generateMaze(base: Grid): Grid {
  // Simple random wall carve: fill ~35% of non-start/goal cells with walls.
  // We use a seeded-ish approach for determinism within a session.
  let g = cloneGrid(base);
  const { width, height, start, goal } = g;

  // Clear all walls first
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      g = setWall(g, { x, y }, false);
    }
  }

  // Recursive division maze
  function divide(
    x: number,
    y: number,
    w: number,
    h: number,
    rng: () => number,
  ): void {
    if (w < 3 || h < 3) return;
    const horiz = h >= w;

    if (horiz) {
      // Draw a horizontal wall somewhere in the middle
      const wallY = y + 1 + Math.floor(rng() * (h - 2));
      const gapX = x + Math.floor(rng() * w);
      for (let cx = x; cx < x + w; cx++) {
        if (cx === gapX) continue;
        const c = { x: cx, y: wallY };
        if (!coordEq(c, start) && !coordEq(c, goal)) {
          g = setWall(g, c, true);
        }
      }
      divide(x, y, w, wallY - y, rng);
      divide(x, wallY + 1, w, h - (wallY - y + 1), rng);
    } else {
      const wallX = x + 1 + Math.floor(rng() * (w - 2));
      const gapY = y + Math.floor(rng() * h);
      for (let cy = y; cy < y + h; cy++) {
        if (cy === gapY) continue;
        const c = { x: wallX, y: cy };
        if (!coordEq(c, start) && !coordEq(c, goal)) {
          g = setWall(g, c, true);
        }
      }
      divide(x, y, wallX - x, h, rng);
      divide(wallX + 1, y, w - (wallX - x + 1), h, rng);
    }
  }

  // Simple LCG for deterministic but varied mazes
  let seed = Date.now() & 0xffffff;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };

  divide(0, 0, width, height, rng);
  return g;
}

// ---------------------------------------------------------------------------
// Cell coloring
// ---------------------------------------------------------------------------

function cellColor(
  coord: Coord,
  grid: Grid,
  step: PathStep | undefined,
  result: PathResult | undefined,
  visitedSet: Set<string>,
  frontierSet: Set<string>,
  pathSet: Set<string>,
): string {
  const key = coordKey(coord);

  if (coordEq(coord, grid.start))
    return "bg-emerald-500 ring-1 ring-emerald-300";
  if (coordEq(coord, grid.goal)) return "bg-red-500 ring-1 ring-red-300";
  if (isWall(grid, coord)) return "bg-zinc-700";

  // Final path (shown when complete)
  if (result && pathSet.has(key)) return "bg-yellow-400";

  // Current cell being expanded
  if (step && coordEq(coord, step.current)) return "bg-sky-400";

  // Frontier (open set)
  if (frontierSet.has(key)) return "bg-indigo-400/70";

  // Visited (settled)
  if (visitedSet.has(key)) return "bg-sky-900/80";

  return "bg-zinc-900";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PathfindingPlayground() {
  const [algoId, setAlgoId] = useState<AlgoId>("bfs");
  const [grid, setGrid] = useState<Grid>(() =>
    createGrid(GRID_W, GRID_H, DEFAULT_START, DEFAULT_GOAL),
  );

  // Paint interaction state
  const paintModeRef = useRef<PaintMode>(null);
  const paintValueRef = useRef<boolean>(true); // true=paint wall, false=erase

  const { steps, result } = useMemo(() => {
    const fn = ALGO_FNS[algoId];
    return collectSteps(fn(grid, grid.start, grid.goal));
  }, [algoId, grid]);

  const resetKey = useMemo(
    () =>
      `${algoId}|${grid.walls.join("")}|${coordKey(grid.start)}|${coordKey(grid.goal)}`,
    [algoId, grid],
  );

  const playback = usePlayback(steps.length, resetKey, false);

  const currentStep =
    playback.cursor > 0 ? steps[playback.cursor - 1] : undefined;

  const showResult = playback.cursor === steps.length && result != null;

  // Build lookup sets for O(1) coloring
  const visitedSet = useMemo<Set<string>>(() => {
    if (!currentStep) return new Set();
    return new Set(currentStep.visited.map(coordKey));
  }, [currentStep]);

  const frontierSet = useMemo<Set<string>>(() => {
    if (!currentStep) return new Set();
    return new Set(currentStep.frontier.map(coordKey));
  }, [currentStep]);

  const pathSet = useMemo<Set<string>>(() => {
    if (!showResult || !result) return new Set();
    return new Set(result.path.map(coordKey));
  }, [showResult, result]);

  // ---------------------------------------------------------------------------
  // Mouse handlers for grid painting
  // ---------------------------------------------------------------------------

  const handleCellPointerDown = useCallback(
    (coord: Coord, e: React.PointerEvent) => {
      e.preventDefault();
      playback.pause();

      if (e.button === 2) return; // right-click reserved

      if (coordEq(coord, grid.start)) {
        paintModeRef.current = "move-start";
        return;
      }
      if (coordEq(coord, grid.goal)) {
        paintModeRef.current = "move-goal";
        return;
      }

      paintModeRef.current = "wall";
      const currentlyWall = isWall(grid, coord);
      paintValueRef.current = !currentlyWall;
      setGrid((g) => setWall(g, coord, paintValueRef.current));
    },
    [grid, playback],
  );

  const handleCellPointerEnter = useCallback(
    (coord: Coord) => {
      const mode = paintModeRef.current;
      if (!mode) return;
      if (mode === "move-start") {
        if (!isWall(grid, coord) && !coordEq(coord, grid.goal)) {
          setGrid((g) => ({ ...g, start: coord }));
        }
        return;
      }
      if (mode === "move-goal") {
        if (!isWall(grid, coord) && !coordEq(coord, grid.start)) {
          setGrid((g) => ({ ...g, goal: coord }));
        }
        return;
      }
      if (mode === "wall") {
        if (!coordEq(coord, grid.start) && !coordEq(coord, grid.goal)) {
          setGrid((g) => setWall(g, coord, paintValueRef.current));
        }
      }
    },
    [grid],
  );

  const handlePointerUp = useCallback(() => {
    paintModeRef.current = null;
  }, []);

  // ---------------------------------------------------------------------------
  // Action handlers
  // ---------------------------------------------------------------------------

  const handleClearWalls = useCallback(() => {
    playback.pause();
    setGrid((g) => {
      const walls = new Array<boolean>(g.width * g.height).fill(false);
      return { ...g, walls };
    });
  }, [playback]);

  const handleRandomMaze = useCallback(() => {
    playback.pause();
    setGrid((g) => generateMaze(g));
  }, [playback]);

  const handleReset = useCallback(() => {
    playback.seek(0);
  }, [playback]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div
      className="space-y-4 select-none"
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
        {/* Algorithm selector */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-500" htmlFor="path-algo-select">
            Algorithm
          </label>
          <select
            id="path-algo-select"
            value={algoId}
            onChange={(e) => {
              setAlgoId(e.target.value as AlgoId);
            }}
            className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200"
          >
            {ALGO_META.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action buttons */}
        <button
          type="button"
          onClick={handleRandomMaze}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-700"
        >
          Random maze
        </button>
        <button
          type="button"
          onClick={handleClearWalls}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-700"
        >
          Clear walls
        </button>

        {/* Stats */}
        {showResult && result && (
          <div className="ml-auto flex flex-wrap gap-4 font-mono text-xs text-zinc-400">
            <span>
              visited{" "}
              <span className="text-sky-400">{result.stats.visitedCount}</span>
            </span>
            <span>
              path{" "}
              <span className="text-yellow-400">
                {result.stats.pathLength || "—"}
              </span>
            </span>
            <span>
              frontier peak{" "}
              <span className="text-indigo-400">
                {result.stats.frontierPeak}
              </span>
            </span>
            <span>
              {result.stats.found ? (
                <span className="text-emerald-400">found</span>
              ) : (
                <span className="text-red-400">not found</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Grid */}
      {/* biome-ignore lint/a11y/useSemanticElements: overflow scroll wrapper */}
      <div
        role="region"
        className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-2"
        aria-label="Pathfinding grid"
      >
        <div
          className="inline-grid gap-px"
          style={{
            gridTemplateColumns: `repeat(${GRID_W}, minmax(0, 1fr))`,
            width: `${GRID_W * 28}px`,
          }}
        >
          {Array.from({ length: GRID_H }, (_, y) =>
            Array.from({ length: GRID_W }, (_, x) => {
              const coord: Coord = { x, y };
              const color = cellColor(
                coord,
                grid,
                currentStep,
                showResult ? result : undefined,
                visitedSet,
                frontierSet,
                pathSet,
              );
              const isStart = coordEq(coord, grid.start);
              const isGoal = coordEq(coord, grid.goal);
              return (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: grid cells are addressed by stable (x,y) coordinates — they never reorder
                  key={`${x},${y}`}
                  className={`h-6 w-6 rounded-sm transition-colors duration-75 cursor-crosshair ${color}`}
                  style={isStart || isGoal ? { cursor: "grab" } : undefined}
                  title={
                    isStart
                      ? "Start"
                      : isGoal
                        ? "Goal"
                        : isWall(grid, coord)
                          ? "Wall"
                          : `(${x},${y})`
                  }
                  onPointerDown={(e) => handleCellPointerDown(coord, e)}
                  onPointerEnter={() => handleCellPointerEnter(coord)}
                />
              );
            }),
          )}
        </div>
      </div>

      {/* Step label */}
      {currentStep?.meta.label && (
        <p className="font-mono text-xs text-zinc-500">
          {currentStep.meta.label}
        </p>
      )}

      {/* Transport */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5">
        <button
          type="button"
          onClick={playback.playing ? playback.pause : playback.play}
          className="rounded-md bg-sky-600 px-4 py-1 font-medium text-sm text-white transition-colors hover:bg-sky-500"
        >
          {playback.playing ? "pause" : "play"}
        </button>
        <button
          type="button"
          onClick={playback.stepBack}
          disabled={playback.cursor === 0}
          className="rounded-md bg-zinc-800 px-3 py-1 font-mono text-sm text-zinc-200 hover:bg-zinc-700 disabled:opacity-40"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={playback.stepForward}
          disabled={playback.cursor >= playback.total}
          className="rounded-md bg-zinc-800 px-3 py-1 font-mono text-sm text-zinc-200 hover:bg-zinc-700 disabled:opacity-40"
        >
          ›
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1 text-sm text-zinc-200 hover:bg-zinc-700"
        >
          reset
        </button>
        <input
          type="range"
          min={0}
          max={playback.total}
          value={playback.cursor}
          onChange={(e) => playback.seek(Number(e.target.value))}
          className="min-w-40 flex-1 accent-sky-400"
          aria-label="Playback position"
        />
        <label className="flex items-center gap-1.5 font-mono text-xs text-zinc-500">
          speed
          <select
            value={playback.speed}
            onChange={(e) => playback.setSpeed(Number(e.target.value))}
            className="rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-zinc-300"
          >
            <option value={0.35}>slow</option>
            <option value={1}>1×</option>
            <option value={3}>3×</option>
            <option value={8}>8×</option>
          </select>
        </label>
        <span className="font-mono text-xs text-zinc-500">
          step {playback.cursor}/{playback.total}
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 font-mono text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-emerald-500" />
          start
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-red-500" />
          goal
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-sky-400" />
          current
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-indigo-400/70" />
          frontier
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-sky-900/80" />
          visited
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-yellow-400" />
          path
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-zinc-700" />
          wall
        </span>
        <span className="ml-auto text-zinc-600">
          click/drag to draw walls · drag start/goal to move
        </span>
      </div>
    </div>
  );
}
