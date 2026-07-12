import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CachePlayground } from "../../features/arch/CachePlayground";
import { archDeepDive } from "../../features/arch/deepdive";
import { PipelinePlayground } from "../../features/arch/PipelinePlayground";
import { DeepDive } from "../../features/deepdive/DeepDive";
import { makeHead } from "../../features/seo/seo";

export const Route = createFileRoute("/arch/")({
  head: () =>
    makeHead({
      title: "Computer Architecture — nand2web",
      description:
        "Interactive pipeline and cache simulators showing how modern CPUs achieve throughput: pipelining, cache hierarchies, hazards, and forwarding — visualised step by step.",
      path: "/arch",
    }),
  component: ArchPage,
});

type Tab = "pipeline" | "cache";

function ArchPage() {
  const [tab, setTab] = useState<Tab>("pipeline");

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-sm text-zinc-500">
          Layer 3 · Computer Architecture
        </p>
        <h1 className="font-semibold text-3xl tracking-tight">
          Making it fast: pipelines and caches
        </h1>
        <p className="max-w-3xl text-zinc-400">
          A single-cycle CPU is correct but slow — one instruction finishes
          before the next begins. Two hardware ideas changed everything:{" "}
          <strong className="text-zinc-200">pipelining</strong> overlaps
          multiple instructions like an assembly line, and{" "}
          <strong className="text-zinc-200">caching</strong> exploits locality
          to hide memory latency. Step through both and count the cycles.
        </p>
      </header>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1 w-fit">
        {(
          [
            { id: "pipeline", label: "Pipeline" },
            { id: "cache", label: "Cache" },
          ] as { id: Tab; label: string }[]
        ).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={`rounded-lg px-5 py-1.5 font-medium text-sm transition-colors ${
              tab === id
                ? "bg-zinc-700 text-zinc-100"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "pipeline" ? <PipelinePlayground /> : <CachePlayground />}

      <DeepDive content={archDeepDive} />
    </div>
  );
}
