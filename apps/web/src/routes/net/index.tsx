import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DeepDive } from "../../features/deepdive/DeepDive";
import { DnsTab } from "../../features/net/DnsTab";
import { netDeepDive } from "../../features/net/deepdive";
import { EncapTab } from "../../features/net/EncapTab";
import { TcpTab } from "../../features/net/TcpTab";
import { makeHead } from "../../features/seo/seo";

export const Route = createFileRoute("/net/")({
  head: () =>
    makeHead({
      title: "Networking — nand2web",
      description:
        "Interactive networking simulators: trace DNS resolution, watch TCP handshakes, and dissect packet encapsulation layer by layer — from Ethernet frames to HTTP.",
      path: "/net",
    }),
  component: NetPage,
});

type Tab = "tcp" | "encap" | "dns";

const TABS: { id: Tab; label: string }[] = [
  { id: "tcp", label: "TCP Handshake" },
  { id: "encap", label: "Encapsulation" },
  { id: "dns", label: "DNS Journey" },
];

function NetPage() {
  const [tab, setTab] = useState<Tab>("tcp");

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-sm text-zinc-500">Layer 6 · Networking</p>
        <h1 className="font-semibold text-3xl tracking-tight">
          How bytes cross the planet
        </h1>
        <p className="max-w-3xl text-zinc-400">
          A name becomes an IP address, an IP address becomes a series of
          packets, and packets wrap themselves in successive headers — HTTP
          inside TCP inside IP inside Ethernet — before crossing the wire.
          Explore the three simulations below to see each mechanism in action.
        </p>
      </header>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex-1 rounded-lg px-3 py-2 font-mono text-sm transition-colors ${
              tab === id
                ? "bg-sky-600 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {tab === "tcp" && <TcpTab />}
        {tab === "encap" && <EncapTab />}
        {tab === "dns" && <DnsTab />}
      </div>

      <DeepDive content={netDeepDive} />
    </div>
  );
}
