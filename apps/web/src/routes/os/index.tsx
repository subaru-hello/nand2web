import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DeepDive } from "../../features/deepdive/DeepDive";
import { osDeepDive } from "../../features/os/deepdive";
import { PagingPlayground } from "../../features/os/PagingPlayground";
import { SchedulerPlayground } from "../../features/os/SchedulerPlayground";

export const Route = createFileRoute("/os/")({
  component: OsPage,
});

type Tab = "scheduler" | "paging";

function OsPage() {
  const [tab, setTab] = useState<Tab>("scheduler");

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-sm text-zinc-500">
          Layer 4 · Operating Systems
        </p>
        <h1 className="font-semibold text-3xl tracking-tight">
          Sharing one machine among many programs
        </h1>
        <p className="max-w-3xl text-zinc-400">
          An OS does two things that feel like magic: it lets many processes
          share one CPU without them interfering, and it gives each process the
          illusion of owning all of memory. Explore both here — step through the
          scheduler's decisions and watch page frames fill and evict.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-zinc-800 bg-zinc-900/40 p-1 w-fit">
        {(
          [
            { id: "scheduler" as Tab, label: "CPU Scheduling" },
            { id: "paging" as Tab, label: "Virtual Memory / Paging" },
          ] as const
        ).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === id
                ? "bg-zinc-800 text-zinc-100 shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "scheduler" ? <SchedulerPlayground /> : <PagingPlayground />}

      <DeepDive content={osDeepDive} />
    </div>
  );
}
