import type { Simulation } from "@nand2web/sim-core";
import type { DatapathNode, DecodedInstruction } from "./isa.ts";
import { decode, MEMORY_SIZE, WORD_MASK } from "./isa.ts";

export interface CpuState {
  readonly pc: number;
  readonly a: number;
  readonly b: number;
  readonly carry: boolean;
  readonly zero: boolean;
  readonly out: number;
  readonly input: number;
  readonly ram: readonly number[];
  readonly halted: boolean;
  readonly cycle: number;
}

/**
 * One instruction takes three steps — fetch, decode, execute — and every
 * step carries the full machine state so the UI can scrub freely.
 */
export type CpuStep =
  | { readonly type: "fetch"; readonly state: CpuState; readonly byte: number; readonly active: readonly DatapathNode[] }
  | { readonly type: "decode"; readonly state: CpuState; readonly instr: DecodedInstruction; readonly active: readonly DatapathNode[] }
  | { readonly type: "execute"; readonly state: CpuState; readonly instr: DecodedInstruction; readonly active: readonly DatapathNode[] };

export function initialState(input = 0): CpuState {
  return {
    pc: 0,
    a: 0,
    b: 0,
    carry: false,
    zero: false,
    out: 0,
    input: input & WORD_MASK,
    ram: Array.from({ length: MEMORY_SIZE }, () => 0),
    halted: false,
    cycle: 0,
  };
}

const DEFAULT_MAX_CYCLES = 256;

/**
 * Run a program, yielding fetch/decode/execute steps until HLT or the cycle
 * limit (programs with loops run forever by design — the limit is the
 * playback window, not an error).
 */
export function* run(
  program: readonly number[],
  options?: { readonly input?: number; readonly maxCycles?: number },
): Simulation<CpuStep, CpuState> {
  let state = initialState(options?.input ?? 0);
  const maxCycles = options?.maxCycles ?? DEFAULT_MAX_CYCLES;

  while (!state.halted && state.cycle < maxCycles) {
    const byte = program[state.pc] ?? 0;
    yield { type: "fetch", state, byte, active: ["pc", "rom", "ir"] };

    const instr = decode(byte);
    yield { type: "decode", state, instr, active: ["ir", "decoder"] };

    state = execute(state, instr);
    yield { type: "execute", state, instr, active: touched(instr) };
  }
  return state;
}

function execute(s: CpuState, instr: DecodedInstruction): CpuState {
  const next = {
    ...s,
    ram: s.ram,
    pc: (s.pc + 1) & WORD_MASK,
    cycle: s.cycle + 1,
  };
  const { spec, operand } = instr;
  switch (spec.mnemonic) {
    case "NOP":
      return next;
    case "LDI":
      return { ...next, a: operand };
    case "TAB":
      return { ...next, b: s.a };
    case "TBA":
      return { ...next, a: s.b };
    case "ADD": {
      const sum = s.a + s.b;
      return withFlags(next, sum & WORD_MASK, sum > WORD_MASK);
    }
    case "SUB": {
      const diff = s.a - s.b;
      return withFlags(next, diff & WORD_MASK, s.a >= s.b);
    }
    case "AND":
      return withFlags(next, s.a & s.b, s.carry);
    case "OR":
      return withFlags(next, s.a | s.b, s.carry);
    case "LD":
      return { ...next, a: s.ram[operand] ?? 0 };
    case "ST": {
      const ram = [...s.ram];
      ram[operand] = s.a;
      return { ...next, ram };
    }
    case "JMP":
      return { ...next, pc: operand };
    case "JZ":
      return s.zero ? { ...next, pc: operand } : next;
    case "JC":
      return s.carry ? { ...next, pc: operand } : next;
    case "OUT":
      return { ...next, out: s.a };
    case "IN":
      return { ...next, a: s.input };
    case "HLT":
      return { ...next, pc: s.pc, halted: true };
    default:
      return next;
  }
}

function withFlags(s: CpuState, a: number, carry: boolean): CpuState {
  return { ...s, a, carry, zero: a === 0 };
}

/** Datapath components lit up by the execute phase, for the diagram. */
function touched(instr: DecodedInstruction): readonly DatapathNode[] {
  switch (instr.spec.mnemonic) {
    case "LDI":
      return ["regA"];
    case "TAB":
      return ["regA", "regB"];
    case "TBA":
      return ["regB", "regA"];
    case "ADD":
    case "SUB":
    case "AND":
    case "OR":
      return ["regA", "regB", "alu", "flags"];
    case "LD":
      return ["ram", "regA"];
    case "ST":
      return ["regA", "ram"];
    case "JMP":
    case "JZ":
    case "JC":
      return ["decoder", "flags", "pc"];
    case "OUT":
      return ["regA", "out"];
    case "IN":
      return ["in", "regA"];
    case "HLT":
      return ["decoder"];
    default:
      return [];
  }
}
