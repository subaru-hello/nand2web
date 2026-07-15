import { createFileRoute } from "@tanstack/react-router";
import { DeepDive } from "../../features/deepdive/DeepDive";
import { pathfindingDeepDive } from "../../features/pathfinding/deepdive";
import { PathfindingPlayground } from "../../features/pathfinding/PathfindingPlayground";
import { makeHead } from "../../features/seo/seo";

export const Route = createFileRoute("/pathfinding/")({
  head: () =>
    makeHead({
      title: "Pathfinding — nand2web",
      description:
        "Watch BFS, DFS, Dijkstra, and A* explore a grid you draw — step by step with live frontier and visited counts. Understand why A* outperforms BFS with a Manhattan distance heuristic.",
      path: "/pathfinding",
    }),
  component: PathfindingPage,
});

function PathfindingPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-sm text-zinc-500">
          Layer 7 · Algorithms &amp; Data Structures
        </p>
        <h1 className="font-semibold text-3xl tracking-tight">
          Pathfinding — four algorithms, one grid
        </h1>
        <p className="max-w-3xl text-zinc-400">
          Draw walls, place a start and goal, pick an algorithm, and watch it
          explore. BFS guarantees the shortest path on an unweighted grid; A*
          finds it faster by using a heuristic to steer toward the goal. Step
          through the simulation to see exactly which cells each algorithm
          expands — and why the order matters.
        </p>
      </header>

      <PathfindingPlayground />

      <DeepDive content={pathfindingDeepDive} />
    </div>
  );
}
