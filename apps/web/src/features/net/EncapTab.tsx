import { type EncapStep, unwrapFrame, wrapRequest } from "@nand2web/net";
import { collectSteps } from "@nand2web/sim-core";
import { useMemo, useState } from "react";
import { usePlayback } from "../playback/usePlayback";

const LAYER_COLORS: Record<
  string,
  { border: string; bg: string; label: string }
> = {
  Ethernet: {
    border: "border-purple-500/60",
    bg: "bg-purple-500/10",
    label: "text-purple-300",
  },
  IP: {
    border: "border-sky-500/60",
    bg: "bg-sky-500/10",
    label: "text-sky-300",
  },
  TCP: {
    border: "border-emerald-500/60",
    bg: "bg-emerald-500/10",
    label: "text-emerald-300",
  },
  HTTP: {
    border: "border-amber-500/60",
    bg: "bg-amber-500/10",
    label: "text-amber-300",
  },
};

const LAYER_ORDER = ["Ethernet", "IP", "TCP", "HTTP"] as const;

function LayerBox({
  layer,
  active,
  present,
  children,
}: {
  layer: string;
  active: boolean;
  present: boolean;
  children?: React.ReactNode;
}) {
  const colors = LAYER_COLORS[layer];
  if (!colors) return null;
  if (!present) return <>{children}</>;
  return (
    <div
      className={`rounded-lg border p-3 transition-all duration-300 ${colors.border} ${colors.bg} ${
        active ? "ring-2 ring-white/20" : ""
      }`}
    >
      <div className={`mb-2 font-mono text-xs font-semibold ${colors.label}`}>
        {layer}
        {active && (
          <span className="ml-2 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-white">
            active
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function HeaderDetails({ step }: { step: EncapStep }) {
  const { header } = step;
  if (header.layer === "HTTP") {
    return (
      <div className="font-mono text-xs text-zinc-400">
        <div>
          {header.method} {header.path} HTTP/1.1
        </div>
        <div>Host: {header.host}</div>
      </div>
    );
  }
  if (header.layer === "TCP") {
    return (
      <div className="font-mono text-xs text-zinc-400">
        <div>
          src:{header.srcPort} → dst:{header.dstPort}
        </div>
        <div>
          seq:{header.seq} flags:[{header.flags.join(",")}]
        </div>
      </div>
    );
  }
  if (header.layer === "IP") {
    return (
      <div className="font-mono text-xs text-zinc-400">
        <div>
          {header.srcAddr} → {header.dstAddr}
        </div>
        <div>
          TTL:{header.ttl} proto:{header.protocol}
        </div>
      </div>
    );
  }
  if (header.layer === "Ethernet") {
    return (
      <div className="font-mono text-xs text-zinc-400">
        <div>src:{header.srcMac}</div>
        <div>dst:{header.dstMac}</div>
        <div>EtherType:0x{header.etherType.toString(16).padStart(4, "0")}</div>
      </div>
    );
  }
  return null;
}

const DEFAULT_METHOD = "GET";
const DEFAULT_HOST = "example.com";
const DEFAULT_PATH = "/index.html";

export function EncapTab() {
  const [method, setMethod] = useState(DEFAULT_METHOD);
  const [host, setHost] = useState(DEFAULT_HOST);
  const [path, setPath] = useState(DEFAULT_PATH);
  const [mode, setMode] = useState<"wrap" | "unwrap">("wrap");

  const allSteps = useMemo<readonly EncapStep[]>(() => {
    const req = { method, host, path };
    if (mode === "wrap") {
      const { steps } = collectSteps(wrapRequest(req));
      return steps;
    }
    // For unwrap, first wrap to get a frame, then unwrap
    const { result: frame } = collectSteps(wrapRequest(req));
    if (!frame) return [];
    const { steps } = collectSteps(unwrapFrame(frame));
    return steps;
  }, [method, host, path, mode]);

  const resetKey = `${method}:${host}:${path}:${mode}`;
  const playback = usePlayback(allSteps.length, resetKey, false);

  const currentStep = allSteps[playback.cursor - 1];
  const presentLayers = currentStep?.headersPresent ?? [];
  const activeLayer = currentStep?.activeLayer;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="rounded border border-zinc-700 bg-zinc-950 px-2 py-1 font-mono text-xs text-zinc-200"
          aria-label="HTTP method"
        >
          {["GET", "POST", "PUT", "DELETE"].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="host"
          className="w-40 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 font-mono text-xs text-zinc-200"
          aria-label="Host"
        />
        <input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="/path"
          className="w-36 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 font-mono text-xs text-zinc-200"
          aria-label="Path"
        />
        <div className="flex overflow-hidden rounded-md border border-zinc-700">
          <button
            type="button"
            onClick={() => setMode("wrap")}
            className={`px-3 py-1 font-mono text-xs transition-colors ${
              mode === "wrap"
                ? "bg-sky-600 text-white"
                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            wrap ↓
          </button>
          <button
            type="button"
            onClick={() => setMode("unwrap")}
            className={`px-3 py-1 font-mono text-xs transition-colors ${
              mode === "unwrap"
                ? "bg-sky-600 text-white"
                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            unwrap ↑
          </button>
        </div>
      </div>

      {/* Nested header boxes */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 min-h-48">
        {allSteps.length === 0 ? (
          <p className="text-center text-sm text-zinc-600">No steps</p>
        ) : playback.cursor === 0 ? (
          <p className="text-center text-sm text-zinc-600 py-8">
            Press play or step to animate
          </p>
        ) : (
          <div className="space-y-0">
            {LAYER_ORDER.map((layer) => {
              const isPresent = presentLayers.includes(layer);
              const isActive = layer === activeLayer;
              const stepForLayer = allSteps.find(
                (s) => s.activeLayer === layer && presentLayers.includes(layer),
              );
              return (
                <LayerBox
                  key={layer}
                  layer={layer}
                  active={isActive}
                  present={isPresent}
                >
                  {isPresent && stepForLayer && isActive ? (
                    <HeaderDetails step={stepForLayer} />
                  ) : isPresent && !isActive ? (
                    <div className="font-mono text-[11px] text-zinc-600">
                      header present
                    </div>
                  ) : null}
                </LayerBox>
              );
            })}
          </div>
        )}
      </div>

      {/* Transport */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5">
        <button
          type="button"
          onClick={playback.playing ? playback.pause : playback.play}
          disabled={allSteps.length === 0}
          className="rounded-md bg-sky-600 px-4 py-1 font-medium text-sm text-white hover:bg-sky-500 disabled:opacity-40"
        >
          {playback.playing ? "pause" : "play"}
        </button>
        <button
          type="button"
          onClick={playback.stepBack}
          className="rounded-md bg-zinc-800 px-3 py-1 font-mono text-sm text-zinc-200 hover:bg-zinc-700"
        >
          ←
        </button>
        <button
          type="button"
          onClick={playback.stepForward}
          className="rounded-md bg-zinc-800 px-3 py-1 font-mono text-sm text-zinc-200 hover:bg-zinc-700"
        >
          →
        </button>
        <input
          type="range"
          min={0}
          max={playback.total}
          value={playback.cursor}
          onChange={(e) => playback.seek(Number(e.target.value))}
          className="min-w-32 flex-1 accent-sky-400"
          aria-label="Layer position"
        />
        <span className="font-mono text-xs text-zinc-500">
          {playback.cursor}/{playback.total}
        </span>
      </div>

      {currentStep && (
        <p className="font-mono text-xs text-zinc-500">{currentStep.label}</p>
      )}
    </div>
  );
}
