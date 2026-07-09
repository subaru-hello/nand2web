import { type DnsNode, type DnsStep, dnsResolve } from "@nand2web/net";
import { collectSteps } from "@nand2web/sim-core";
import { useMemo, useState } from "react";
import { usePlayback } from "../playback/usePlayback";

const NODES: readonly DnsNode[] = [
  "stub",
  "recursive",
  "root",
  "tld",
  "authoritative",
];

const NODE_LABELS: Record<DnsNode, string> = {
  stub: "Stub\nResolver",
  recursive: "Recursive\nResolver",
  root: "Root\nServer",
  tld: "TLD\nServer",
  authoritative: "Auth\nServer",
};

const NODE_COLORS: Record<
  DnsNode,
  { bg: string; border: string; text: string }
> = {
  stub: {
    bg: "bg-zinc-800",
    border: "border-zinc-600",
    text: "text-zinc-200",
  },
  recursive: {
    bg: "bg-sky-900/40",
    border: "border-sky-600/60",
    text: "text-sky-200",
  },
  root: {
    bg: "bg-purple-900/40",
    border: "border-purple-600/60",
    text: "text-purple-200",
  },
  tld: {
    bg: "bg-emerald-900/40",
    border: "border-emerald-600/60",
    text: "text-emerald-200",
  },
  authoritative: {
    bg: "bg-amber-900/40",
    border: "border-amber-600/60",
    text: "text-amber-200",
  },
};

function nodeIndex(node: DnsNode): number {
  return NODES.indexOf(node);
}

interface MessageRowProps {
  step: DnsStep;
  index: number;
}

function MessageRow({ step, index }: MessageRowProps) {
  const { message } = step;
  const isQuery = message.kind === "query";
  const fromIdx = nodeIndex(message.from);
  const toIdx = nodeIndex(message.to);
  const isForward = toIdx > fromIdx;

  const fromCache = message.kind === "response" ? message.fromCache : false;
  const msgColor = isQuery
    ? "text-sky-400"
    : fromCache
      ? "text-emerald-300"
      : "text-zinc-300";

  const arrowDir = isForward ? "→" : "←";
  const label = isQuery
    ? `${message.qname} ${message.qtype}?`
    : `${message.answer}${fromCache ? " ✓ cached" : ""}`;

  return (
    <div
      key={`msg-${index}`}
      className={`flex items-center gap-2 py-1 font-mono text-xs ${msgColor}`}
    >
      <span className="w-24 shrink-0 text-right text-zinc-500">
        {message.from}
      </span>
      <span>{arrowDir}</span>
      <span className="w-24 shrink-0 text-left text-zinc-500">
        {message.to}
      </span>
      <span className="text-zinc-400">|</span>
      <span>{label}</span>
    </div>
  );
}

const SAMPLE_DOMAINS = [
  "example.com",
  "www.google.com",
  "api.github.com",
  "mail.yahoo.co.jp",
];

export function DnsTab() {
  const [qname, setQname] = useState("example.com");
  const [cacheMode, setCacheMode] = useState<"miss" | "partial" | "hit">(
    "miss",
  );

  const steps = useMemo<readonly DnsStep[]>(() => {
    const { steps: s } = collectSteps(
      dnsResolve({
        qname,
        qtype: "A",
        cacheHit: cacheMode === "hit",
        partialCacheHit: cacheMode === "partial",
      }),
    );
    return s;
  }, [qname, cacheMode]);

  const resetKey = `${qname}:${cacheMode}`;
  const playback = usePlayback(steps.length, resetKey, false);

  const visibleSteps = steps.slice(0, playback.cursor);
  const currentStep = steps[playback.cursor - 1];
  const visitedNodes = currentStep?.visited ?? [];

  // Collect the final answer from the last response step
  const finalAnswer = (() => {
    for (let i = visibleSteps.length - 1; i >= 0; i--) {
      const s = visibleSteps[i];
      if (s?.message.kind === "response" && s.message.to === "stub") {
        return s.message.answer;
      }
    }
    return null;
  })();

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_DOMAINS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setQname(d)}
              className={`rounded border px-2 py-0.5 font-mono text-xs transition-colors ${
                qname === d
                  ? "border-sky-600 text-sky-300"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <input
          value={qname}
          onChange={(e) => setQname(e.target.value)}
          placeholder="domain.com"
          className="w-44 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 font-mono text-xs text-zinc-200"
          aria-label="Domain name"
        />
        <div className="flex overflow-hidden rounded-md border border-zinc-700">
          {(["miss", "partial", "hit"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setCacheMode(m)}
              className={`px-2.5 py-1 font-mono text-xs transition-colors ${
                cacheMode === m
                  ? "bg-sky-600 text-white"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {m === "miss"
                ? "cache miss"
                : m === "partial"
                  ? "partial hit"
                  : "cache hit"}
            </button>
          ))}
        </div>
      </div>

      {/* Node row */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {NODES.map((node, i) => {
            const colors = NODE_COLORS[node];
            const isVisited = visitedNodes.includes(node);
            const isActive =
              currentStep?.message.from === node ||
              currentStep?.message.to === node;
            return (
              <div key={node} className="flex items-center gap-1">
                <div
                  className={`flex min-w-[72px] flex-col items-center rounded-lg border p-2 text-center font-mono text-[10px] transition-all ${
                    colors.bg
                  } ${colors.border} ${colors.text} ${
                    isActive ? "ring-2 ring-white/30 scale-105" : ""
                  } ${!isVisited ? "opacity-40" : ""}`}
                >
                  {NODE_LABELS[node].split("\n").map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </div>
                {i < NODES.length - 1 && (
                  <span className="text-zinc-700 text-lg">⋯</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Journey log */}
        <div className="mt-3 max-h-52 space-y-0 overflow-y-auto border-zinc-800/60 border-t pt-2">
          {visibleSteps.length === 0 && (
            <p className="py-4 text-center text-sm text-zinc-600">
              Press play to trace the DNS resolution journey
            </p>
          )}
          {visibleSteps.map((step, i) => (
            <MessageRow
              key={`${step.message.from}:${step.message.to}:${step.message.kind}:${i}`}
              step={step}
              index={i}
            />
          ))}
        </div>

        {finalAnswer && (
          <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 font-mono text-sm text-emerald-300">
            {qname} → {finalAnswer}
          </div>
        )}
      </div>

      {/* Transport */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5">
        <button
          type="button"
          onClick={playback.playing ? playback.pause : playback.play}
          disabled={steps.length === 0}
          className="rounded-md bg-sky-600 px-4 py-1 font-medium text-sm text-white hover:bg-sky-500 disabled:opacity-40"
        >
          {playback.playing ? "pause" : "play"}
        </button>
        <button
          type="button"
          onClick={playback.stepForward}
          className="rounded-md bg-zinc-800 px-3 py-1 font-mono text-sm text-zinc-200 hover:bg-zinc-700"
        >
          step
        </button>
        <button
          type="button"
          onClick={playback.restart}
          className="rounded-md bg-zinc-800 px-3 py-1 font-mono text-sm text-zinc-200 hover:bg-zinc-700"
        >
          restart
        </button>
        <input
          type="range"
          min={0}
          max={playback.total}
          value={playback.cursor}
          onChange={(e) => playback.seek(Number(e.target.value))}
          className="min-w-32 flex-1 accent-sky-400"
          aria-label="Step position"
        />
        <span className="font-mono text-xs text-zinc-500">
          step {playback.cursor}/{playback.total}
        </span>
      </div>

      {currentStep && (
        <p className="font-mono text-xs text-zinc-500">{currentStep.label}</p>
      )}
    </div>
  );
}
