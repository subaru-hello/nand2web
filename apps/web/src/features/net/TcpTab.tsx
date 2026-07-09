import { type TcpStep, tcpSession } from "@nand2web/net";
import { collectSteps } from "@nand2web/sim-core";
import { useMemo, useState } from "react";
import { usePlayback } from "../playback/usePlayback";

const PHASE_COLORS: Record<string, string> = {
  handshake: "text-sky-400",
  transfer: "text-emerald-400",
  teardown: "text-amber-400",
  drop: "text-red-400",
  timeout: "text-orange-400",
  retransmit: "text-yellow-400",
  failed: "text-red-500",
  done: "text-zinc-400",
};

const STATE_COLORS: Record<string, string> = {
  CLOSED: "text-zinc-500",
  LISTEN: "text-sky-300",
  SYN_SENT: "text-sky-400",
  SYN_RCVD: "text-sky-400",
  ESTABLISHED: "text-emerald-400",
  FIN_WAIT_1: "text-amber-400",
  FIN_WAIT_2: "text-amber-400",
  CLOSE_WAIT: "text-amber-300",
  CLOSING: "text-orange-400",
  LAST_ACK: "text-orange-400",
  TIME_WAIT: "text-red-400",
};

function stateColor(s: string): string {
  return STATE_COLORS[s] ?? "text-zinc-300";
}

interface PacketArrowProps {
  step: TcpStep;
  index: number;
}

function PacketArrow({ step, index: _index }: PacketArrowProps) {
  const { packet, dropped, retransmit, phase, direction } = step;
  if (!packet) return null;

  const isFromServer = direction === "s2c";

  const arrowClass = dropped
    ? "border-red-500/60 text-red-400"
    : retransmit
      ? "border-yellow-500/60 text-yellow-300"
      : "border-zinc-600 text-zinc-300";

  return (
    <div
      className={`flex items-center gap-2 py-1 font-mono text-xs ${PHASE_COLORS[phase] ?? "text-zinc-400"}`}
    >
      <span className="w-20 text-right">{!isFromServer && packet.kind}</span>
      <span className="relative flex flex-1 items-center">
        {isFromServer ? (
          <>
            <span
              className={`mr-1 border-t ${arrowClass} flex-1 border-dashed`}
            />
            <span>←</span>
          </>
        ) : (
          <>
            <span>→</span>
            <span
              className={`ml-1 border-t ${arrowClass} flex-1 border-dashed`}
            />
          </>
        )}
      </span>
      <span className="w-20 text-left">{isFromServer && packet.kind}</span>
      <span className="ml-2 w-32 text-zinc-500">
        {dropped ? (
          <span className="text-red-400">✗ dropped</span>
        ) : retransmit ? (
          <span className="text-yellow-400">↩ retransmit</span>
        ) : (
          <span>
            seq={packet.seq} ack={packet.ack}
          </span>
        )}
      </span>
    </div>
  );
}

export function TcpTab() {
  const [lossRate, setLossRate] = useState(0);
  const [seed, setSeed] = useState(42);
  const [runKey, setRunKey] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: runKey is an intentional re-trigger counter
  const steps = useMemo<readonly TcpStep[]>(() => {
    const { steps: s } = collectSteps(
      tcpSession({ seed, lossRate: lossRate / 100, maxRetries: 5 }),
    );
    return s;
  }, [seed, lossRate, runKey]);

  const resetKey = useMemo(
    () => `${seed}:${lossRate}:${runKey}`,
    [seed, lossRate, runKey],
  );
  const playback = usePlayback(steps.length, resetKey, false);

  const visibleSteps = steps.slice(0, playback.cursor);
  const currentStep = steps[playback.cursor - 1];

  const clientState = currentStep?.clientState ?? "CLOSED";
  const serverState = currentStep?.serverState ?? "CLOSED";

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
        <label className="flex items-center gap-2 text-sm text-zinc-400">
          Loss rate
          <input
            type="range"
            min={0}
            max={50}
            value={lossRate}
            onChange={(e) => setLossRate(Number(e.target.value))}
            className="w-28 accent-red-400"
          />
          <span className="w-8 font-mono text-zinc-200">{lossRate}%</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-400">
          Seed
          <input
            type="number"
            value={seed}
            min={0}
            max={99999}
            onChange={(e) => setSeed(Number(e.target.value))}
            className="w-20 rounded border border-zinc-700 bg-zinc-950 px-2 py-0.5 font-mono text-xs text-zinc-200"
          />
        </label>
        <button
          type="button"
          onClick={() => setRunKey((k) => k + 1)}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1 font-mono text-xs text-zinc-300 hover:border-sky-600 hover:text-sky-300"
        >
          Rerun
        </button>
      </div>

      {/* Timelines */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        {/* State labels */}
        <div className="mb-3 grid grid-cols-[1fr_auto_1fr] text-center font-mono text-sm">
          <div>
            <div className="text-zinc-500 text-xs">CLIENT</div>
            <div className={`font-semibold ${stateColor(clientState)}`}>
              {clientState}
            </div>
          </div>
          <div className="w-8" />
          <div>
            <div className="text-zinc-500 text-xs">SERVER</div>
            <div className={`font-semibold ${stateColor(serverState)}`}>
              {serverState}
            </div>
          </div>
        </div>

        {/* Packet arrows */}
        <div className="max-h-80 space-y-0.5 overflow-y-auto">
          {visibleSteps.length === 0 && (
            <p className="py-6 text-center text-sm text-zinc-600">
              Press play or step to animate the connection
            </p>
          )}
          {visibleSteps.map((step, i) => {
            const stepKey = `${step.phase}:${step.clientState}:${step.serverState}:${i}`;
            if (step.packet) {
              return <PacketArrow key={stepKey} step={step} index={i} />;
            }
            return (
              <div
                key={stepKey}
                className={`py-0.5 text-center font-mono text-xs ${PHASE_COLORS[step.phase] ?? "text-zinc-500"}`}
              >
                {step.label}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-4 border-zinc-800/60 border-t pt-2 font-mono text-xs text-zinc-500">
          <span className="text-sky-400">— handshake</span>
          <span className="text-emerald-400">— transfer</span>
          <span className="text-amber-400">— teardown</span>
          <span className="text-red-400">✗ drop</span>
          <span className="text-yellow-400">↩ retransmit</span>
        </div>
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
          className="min-w-40 flex-1 accent-sky-400"
          aria-label="Step position"
        />
        <span className="font-mono text-xs text-zinc-500">
          step {playback.cursor}/{playback.total}
        </span>
      </div>

      {/* Current step label */}
      {currentStep && (
        <p className="font-mono text-xs text-zinc-500">
          <span className={PHASE_COLORS[currentStep.phase] ?? ""}>
            [{currentStep.phase}]
          </span>{" "}
          {currentStep.label}
        </p>
      )}
    </div>
  );
}
