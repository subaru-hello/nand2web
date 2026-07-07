import type { CpuState, DatapathNode } from "@nand2web/cpu";
import { decode, formatInstruction } from "@nand2web/cpu";
import type { ReactNode } from "react";

/**
 * Fixed-layout datapath diagram. Boxes light up according to the current
 * fetch/decode/execute step's `active` set; values come straight from the
 * machine-state snapshot, so scrubbing the playback scrubs the whole CPU.
 */

interface DatapathProps {
  state: CpuState;
  program: readonly number[];
  active: ReadonlySet<DatapathNode>;
  phase: "fetch" | "decode" | "execute" | "idle";
  currentByte: number;
}

export function Datapath({
  state,
  program,
  active,
  phase,
  currentByte,
}: DatapathProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-[180px_1fr_170px]">
      {/* Program memory */}
      <Box title="Program ROM" lit={active.has("rom")}>
        <ol className="font-mono text-[11px] leading-4">
          {program.map((byte, addr) => {
            const key = `rom-${addr}`;
            const isPc = addr === state.pc;
            return (
              <li
                key={key}
                className={`flex justify-between rounded px-1.5 ${
                  isPc ? "bg-sky-500/20 text-sky-200" : "text-zinc-500"
                }`}
              >
                <span>
                  {addr.toString(16).toUpperCase()}: {hex2(byte)}
                </span>
                <span className={isPc ? "text-sky-300" : "text-zinc-600"}>
                  {formatInstruction(decode(byte))}
                </span>
              </li>
            );
          })}
        </ol>
      </Box>

      {/* Core */}
      <div className="grid content-start gap-3">
        <div className="grid grid-cols-3 gap-3">
          <Box title="PC" lit={active.has("pc")}>
            <Value bits={4} value={state.pc} />
          </Box>
          <Box title="IR (instruction)" lit={active.has("ir")}>
            <div className="text-center">
              <span className="font-mono text-lg text-zinc-100">
                {hex2(currentByte)}
              </span>
              <span className="ml-2 font-mono text-sm text-sky-300">
                {formatInstruction(decode(currentByte))}
              </span>
            </div>
          </Box>
          <Box title="Decoder" lit={active.has("decoder")}>
            <p className="text-center font-mono text-sm text-zinc-300">
              {phase === "idle" ? "—" : phase.toUpperCase()}
            </p>
          </Box>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Box title="Register A" lit={active.has("regA")}>
            <Value bits={4} value={state.a} />
          </Box>
          <Box title="Register B" lit={active.has("regB")}>
            <Value bits={4} value={state.b} />
          </Box>
          <Box title="Flags" lit={active.has("flags")}>
            <div className="flex justify-center gap-3 font-mono text-sm">
              <Flag label="C" on={state.carry} />
              <Flag label="Z" on={state.zero} />
            </div>
          </Box>
        </div>

        <div className="grid grid-cols-[1fr_2fr] gap-3">
          <Box title="ALU" lit={active.has("alu")}>
            <p className="text-center font-mono text-zinc-300">A ⊕ B → A</p>
            <p className="mt-1 text-center font-mono text-xs text-zinc-500">
              same circuit as Layer 1
            </p>
          </Box>
          <Box title={`OUT = ${state.out}`} lit={active.has("out")}>
            <div className="flex items-center justify-center gap-2 py-1">
              {[3, 2, 1, 0].map((i) => (
                <span
                  key={`led-${i}`}
                  className={`h-5 w-5 rounded-full border ${
                    ((state.out >> i) & 1) === 1
                      ? "border-emerald-400 bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.7)]"
                      : "border-zinc-700 bg-zinc-900"
                  }`}
                />
              ))}
            </div>
          </Box>
        </div>
      </div>

      {/* Memory + IO */}
      <div className="grid content-start gap-3">
        <Box title="RAM (16 × 4-bit)" lit={active.has("ram")}>
          <div className="grid grid-cols-4 gap-1 font-mono text-[11px]">
            {state.ram.map((value, addr) => {
              const key = `ram-${addr}`;
              return (
                <div
                  key={key}
                  className="rounded bg-zinc-900 px-1 py-0.5 text-center"
                >
                  <span className="text-zinc-600">
                    {addr.toString(16).toUpperCase()}
                  </span>
                  <span className="ml-1 text-zinc-200">{value}</span>
                </div>
              );
            })}
          </div>
        </Box>
        <Box title={`IN port = ${state.input}`} lit={active.has("in")}>
          <Value bits={4} value={state.input} />
        </Box>
        <div
          className={`rounded-lg border px-3 py-2 text-center font-mono text-sm ${
            state.halted
              ? "border-red-500/50 bg-red-500/10 text-red-300"
              : "border-zinc-800 text-zinc-500"
          }`}
        >
          {state.halted ? "HALTED" : `cycle ${state.cycle}`}
        </div>
      </div>
    </div>
  );
}

function Box({
  title,
  lit,
  children,
}: {
  title: string;
  lit: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-lg border p-2.5 transition-colors duration-150 ${
        lit
          ? "border-amber-400/70 bg-amber-400/10"
          : "border-zinc-800 bg-zinc-900/60"
      }`}
    >
      <p
        className={`mb-1.5 font-mono text-[11px] uppercase tracking-wider ${
          lit ? "text-amber-300" : "text-zinc-500"
        }`}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function Value({ bits, value }: { bits: number; value: number }) {
  return (
    <p className="text-center font-mono">
      <span className="text-lg text-zinc-100">
        {value.toString(2).padStart(bits, "0")}
      </span>
      <span className="ml-2 text-sm text-zinc-500">={value}</span>
    </p>
  );
}

function Flag({ label, on }: { label: string; on: boolean }) {
  return (
    <span className={on ? "text-emerald-300" : "text-zinc-600"}>
      {label}={on ? 1 : 0}
    </span>
  );
}

function hex2(byte: number): string {
  return byte.toString(16).toUpperCase().padStart(2, "0");
}
