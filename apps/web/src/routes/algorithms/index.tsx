import { createFileRoute } from "@tanstack/react-router";
import { algorithmDeepDive } from "../../features/algorithms/deepdive";
import {
  ComplexityTable,
  SortingPlayground,
} from "../../features/algorithms/SortingPlayground";
import { DeepDive } from "../../features/deepdive/DeepDive";

export const Route = createFileRoute("/algorithms/")({
  component: AlgorithmsPage,
});

function AlgorithmsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-sm text-zinc-500">
          Layer 7 · Algorithms &amp; Data Structures
        </p>
        <h1 className="font-semibold text-3xl tracking-tight">
          Sorting Suite — six algorithms, step by step
        </h1>
        <p className="max-w-3xl text-zinc-400">
          Pick an algorithm, set the array size, hit play, and watch every
          comparison and write unfold. The counters update live — so you can
          feel the difference between O(n log n) and O(n²) not just read about
          it.
        </p>
      </header>

      <SortingPlayground />

      <section className="space-y-3">
        <h2 className="font-semibold text-xl">Complexity at a glance</h2>
        <p className="max-w-3xl text-sm text-zinc-400">
          Big-O is a worst-case ceiling, not a crystal ball. The constants and
          cache behaviour hidden inside the O(…) notation matter enormously in
          practice — which is why quicksort dominates real-world libraries
          despite its O(n²) worst case.
        </p>
        <ComplexityTable />
      </section>

      <DeepDive content={algorithmDeepDive} />
    </div>
  );
}
