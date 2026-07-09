import {
  type InterpState,
  type InterpStep,
  interpret,
  LexError,
  ParseError,
  type Program,
  parse,
  SAMPLE_PROGRAMS,
  type Token,
  tokenize,
} from "@nand2web/lang";
import { collectSteps } from "@nand2web/sim-core";
import { useMemo, useState } from "react";
import { usePlayback } from "../playback/usePlayback";
import { AstView } from "./AstView";
import { TokenView } from "./TokenView";

const MAX_STEPS = 2000;

interface ParseResult {
  ok: true;
  tokens: Token[];
  program: Program;
  steps: InterpStep[];
}

interface ParseFailure {
  ok: false;
  errorMessage: string;
  tokens?: Token[];
}

function compilePipeline(source: string): ParseResult | ParseFailure {
  let tokens: Token[];
  try {
    tokens = tokenize(source);
  } catch (e) {
    return {
      ok: false,
      errorMessage: e instanceof LexError ? e.message : String(e),
    };
  }

  let program: Program;
  try {
    program = parse(tokens);
  } catch (e) {
    return {
      ok: false,
      errorMessage: e instanceof ParseError ? e.message : String(e),
      tokens,
    };
  }

  const { steps } = collectSteps(interpret(program, { stepLimit: MAX_STEPS }));
  return {
    ok: true,
    tokens,
    program,
    steps: steps as InterpStep[],
  };
}

export function LangPlayground() {
  const [source, setSource] = useState<string>(
    SAMPLE_PROGRAMS[0]?.source ?? "",
  );

  const pipeline = useMemo(() => compilePipeline(source), [source]);

  const resetKey = useMemo(() => source, [source]);
  const totalSteps = pipeline.ok ? pipeline.steps.length : 0;
  const playback = usePlayback(totalSteps, resetKey, false);

  const currentStep: InterpStep | undefined =
    pipeline.ok && playback.cursor > 0
      ? pipeline.steps[playback.cursor - 1]
      : undefined;

  const displayState: InterpState | undefined = currentStep;
  const activeId = displayState?.activeId ?? -1;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(280px,360px)_1fr]">
        {/* Editor pane */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROGRAMS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => setSource(sample.source)}
                title={sample.description}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 font-mono text-xs text-zinc-300 transition-colors hover:border-sky-600"
              >
                {sample.name}
              </button>
            ))}
          </div>
          <textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            rows={14}
            spellCheck={false}
            aria-label="Tiny language source"
            className="w-full resize-y rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-[13px] text-zinc-200 leading-5 focus:border-sky-700 focus:outline-none"
          />
          {!pipeline.ok && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 font-mono text-red-300 text-xs">
              {pipeline.errorMessage}
            </div>
          )}
          {pipeline.ok && displayState && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 space-y-2">
              <p className="font-mono text-xs text-zinc-400">
                step {playback.cursor}/{playback.total} ·{" "}
                <span className="text-sky-300">{displayState.label}</span>
              </p>
              {/* Output console */}
              {displayState.output.length > 0 && (
                <div className="rounded border border-emerald-900/60 bg-emerald-950/30 p-2">
                  <p className="font-mono text-[11px] text-zinc-500 mb-1">
                    output
                  </p>
                  <pre className="font-mono text-xs text-emerald-300">
                    {displayState.output.join("\n")}
                  </pre>
                </div>
              )}
              {/* Variables table */}
              {displayState.env.size > 0 && (
                <div>
                  <p className="font-mono text-[11px] text-zinc-500 mb-1">
                    variables
                  </p>
                  <table className="w-full font-mono text-xs">
                    <tbody>
                      {[...displayState.env.entries()].map(([k, v]) => (
                        <tr key={k} className="border-t border-zinc-800/50">
                          <td className="py-0.5 pr-3 text-sky-300">{k}</td>
                          <td className="py-0.5 text-zinc-200">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {displayState.status === "error" && (
                <p className="font-mono text-xs text-red-400">
                  {displayState.errorMessage}
                </p>
              )}
              {displayState.status === "limit" && (
                <p className="font-mono text-xs text-yellow-400">
                  Step limit reached — infinite loop guard
                </p>
              )}
            </div>
          )}
        </div>

        {/* Pipeline visualization pane */}
        <div className="space-y-4">
          {/* Token stream */}
          {(pipeline.ok || pipeline.tokens) && (
            <div>
              <h3 className="mb-1.5 font-mono text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Tokens
              </h3>
              <TokenView
                tokens={pipeline.ok ? pipeline.tokens : (pipeline.tokens ?? [])}
              />
            </div>
          )}

          {/* AST */}
          {pipeline.ok && (
            <div>
              <h3 className="mb-1.5 font-mono text-xs font-medium text-zinc-500 uppercase tracking-wider">
                AST
              </h3>
              <AstView program={pipeline.program} activeId={activeId} />
            </div>
          )}
        </div>
      </div>

      {/* Transport */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5">
        <button
          type="button"
          onClick={playback.playing ? playback.pause : playback.play}
          disabled={!pipeline.ok || totalSteps === 0}
          className="rounded-md bg-sky-600 px-4 py-1 font-medium text-sm text-white transition-colors hover:bg-sky-500 disabled:opacity-40"
        >
          {playback.playing ? "pause" : "run"}
        </button>
        <button
          type="button"
          onClick={playback.stepForward}
          disabled={!pipeline.ok}
          className="rounded-md bg-zinc-800 px-3 py-1 font-mono text-sm text-zinc-200 hover:bg-zinc-700 disabled:opacity-40"
        >
          step
        </button>
        <input
          type="range"
          min={0}
          max={playback.total}
          value={playback.cursor}
          onChange={(e) => playback.seek(Number(e.target.value))}
          className="min-w-40 flex-1 accent-sky-400"
          aria-label="Execution position"
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
          </select>
        </label>
        <span className="font-mono text-xs text-zinc-500">
          {displayState?.status ?? "ready"} · step {playback.cursor}/
          {playback.total}
        </span>
      </div>
    </div>
  );
}
