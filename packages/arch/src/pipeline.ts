/**
 * MIPS-style 5-stage pipeline simulator (IF / ID / EX / MEM / WB).
 *
 * Mini ISA (independent of @nand2web/cpu):
 *   add rd,rs,rt | sub rd,rs,rt | and rd,rs,rt | or rd,rs,rt
 *   addi rt,rs,imm | lw rt,imm(rs) | sw rt,imm(rs) | beq rs,rt,offset | nop
 *
 * Registers r0–r7 (r0 always reads 0; writes to r0 are silently dropped).
 * Data memory: 32 words (addressed by word index 0–31).
 *
 * Hazard modes:
 *   "stall"      — ID detects RAW, inserts bubble until the producing stage
 *                  is ≥ MEM (value available on register-file read).
 *   "forwarding" — EX/MEM→EX and MEM/WB→EX forwarding;
 *                  load-use still costs exactly 1 stall.
 *
 * Branch: predict-not-taken; resolved in EX; taken → flush the two instructions
 * that had already entered IF and ID (they become bubbles).
 *
 * Generator convention: 1 yield per cycle.  We model the pipeline as four
 * latches (IF/ID, ID/EX, EX/MEM, MEM/WB).  Each cycle:
 *   1. WB  — commit result from MEM/WB latch
 *   2. MEM — access memory using EX/MEM latch
 *   3. EX  — execute, with optional forwarding from EX/MEM and MEM/WB latches
 *   4. ID  — detect hazards; if stall → hold IF/ID and ID/EX, insert bubble in ID/EX next
 *   5. IF  — fetch next instruction (or stall)
 *   then yield step, advance latches.
 */

import type { Simulation, StepMeta } from "@nand2web/sim-core";

// ---------------------------------------------------------------------------
// Public ISA types
// ---------------------------------------------------------------------------

export type OpCode =
  | "add"
  | "sub"
  | "and"
  | "or"
  | "addi"
  | "lw"
  | "sw"
  | "beq"
  | "nop";

export interface Instruction {
  readonly op: OpCode;
  /** Register written (add/sub/and/or/addi/lw); 0 = nothing written. */
  readonly rd: number;
  /** Source register 1. */
  readonly rs: number;
  /** Source register 2 (R-type, beq, sw). */
  readonly rt: number;
  /** Immediate / byte-offset (addi/lw/sw/beq). */
  readonly imm: number;
  /** Human-readable display string. */
  readonly text: string;
}

export type StageName = "IF" | "ID" | "EX" | "MEM" | "WB";

export interface ForwardInfo {
  readonly from: "EX/MEM" | "MEM/WB";
  readonly toReg: number;
}

export interface PipelineStep {
  readonly cycle: number;
  /** Text label for each stage.  undefined = stage not yet active. */
  readonly stages: Readonly<Record<StageName, string | "bubble" | undefined>>;
  readonly stallInserted: boolean;
  readonly forwards: readonly ForwardInfo[];
  /** True when a taken branch flushed 2 slots this cycle. */
  readonly flushed: boolean;
  readonly registers: readonly number[];
  readonly memory: readonly number[];
  readonly meta: StepMeta;
}

export interface PipelineResult {
  readonly totalCycles: number;
  readonly instructionCount: number;
  readonly cpi: number;
  readonly stallCount: number;
  readonly forwardCount: number;
  readonly flushCount: number;
  readonly finalRegisters: readonly number[];
  readonly finalMemory: readonly number[];
}

export type HazardMode = "stall" | "forwarding";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function runPipeline(
  instructions: readonly Instruction[],
  mode: HazardMode,
): Simulation<PipelineStep, PipelineResult> {
  return pipelineGen(instructions, mode);
}

// ---------------------------------------------------------------------------
// Naive sequential interpreter (reference for property tests)
// ---------------------------------------------------------------------------

export function interpretSequential(instructions: readonly Instruction[]): {
  registers: readonly number[];
  memory: readonly number[];
} {
  const regs = new Int32Array(8);
  const mem = new Int32Array(32);

  const read = (r: number): number => (r === 0 ? 0 : (regs[r] ?? 0));
  const write = (r: number, v: number): void => {
    if (r !== 0) regs[r] = v | 0;
  };

  let pc = 0;
  const limit = instructions.length * 10 + 20;
  for (let iter = 0; iter < limit && pc < instructions.length; iter++) {
    const instr = instructions[pc];
    if (instr === undefined) break;
    pc++;
    switch (instr.op) {
      case "nop":
        break;
      case "add":
        write(instr.rd, (read(instr.rs) + read(instr.rt)) | 0);
        break;
      case "sub":
        write(instr.rd, (read(instr.rs) - read(instr.rt)) | 0);
        break;
      case "and":
        write(instr.rd, (read(instr.rs) & read(instr.rt)) | 0);
        break;
      case "or":
        write(instr.rd, read(instr.rs) | read(instr.rt) | 0);
        break;
      case "addi":
        write(instr.rd, (read(instr.rs) + instr.imm) | 0);
        break;
      case "lw": {
        const addr = ((read(instr.rs) + instr.imm) >>> 0) % 32;
        write(instr.rd, mem[addr] ?? 0);
        break;
      }
      case "sw": {
        const addr = ((read(instr.rs) + instr.imm) >>> 0) % 32;
        mem[addr] = read(instr.rt);
        break;
      }
      case "beq": {
        if (read(instr.rs) === read(instr.rt)) pc = pc + instr.imm;
        break;
      }
    }
  }

  return { registers: Array.from(regs), memory: Array.from(mem) };
}

// ---------------------------------------------------------------------------
// Internal types for pipeline latches
// ---------------------------------------------------------------------------

/** A slot in a pipeline latch: undefined = empty, null = bubble. */
type Slot = Instruction | null | undefined;

function slotLabel(s: Slot): string | "bubble" | undefined {
  if (s === undefined) return undefined;
  if (s === null) return "bubble";
  return s.text;
}

function isReal(s: Slot): s is Instruction {
  return s !== undefined && s !== null;
}

// Destination register (0 = no writeback)
function destReg(s: Slot): number {
  if (!isReal(s)) return 0;
  switch (s.op) {
    case "add":
    case "sub":
    case "and":
    case "or":
    case "addi":
    case "lw":
      return s.rd;
    default:
      return 0;
  }
}

function usesRs(s: Slot): boolean {
  if (!isReal(s)) return false;
  return (
    s.op === "add" ||
    s.op === "sub" ||
    s.op === "and" ||
    s.op === "or" ||
    s.op === "addi" ||
    s.op === "lw" ||
    s.op === "sw" ||
    s.op === "beq"
  );
}

function usesRt(s: Slot): boolean {
  if (!isReal(s)) return false;
  return (
    s.op === "add" ||
    s.op === "sub" ||
    s.op === "and" ||
    s.op === "or" ||
    s.op === "sw" ||
    s.op === "beq"
  );
}

// ---------------------------------------------------------------------------
// Pipeline generator
// ---------------------------------------------------------------------------

/**
 * Latch state carried between pipeline stages.
 * We model the four inter-stage latches:
 *   L_IF_ID  (IF/ID)
 *   L_ID_EX  (ID/EX)  + carried operand values + store value for sw
 *   L_EX_MEM (EX/MEM) + computed result + dest reg + store value for sw
 *   L_MEM_WB (MEM/WB) + loaded/computed value + dest reg
 */
interface IdExLatch {
  slot: Slot;
  valRs: number; // resolved rs (from register file or forwarded)
  valRt: number; // resolved rt (from register file or forwarded)
}

interface ExMemLatch {
  slot: Slot;
  result: number; // ALU result or effective address
  storeVal: number; // value for sw (rt)
  wrReg: number; // dest register (0 if none)
}

interface MemWbLatch {
  slot: Slot;
  result: number; // value to write back
  wrReg: number;
}

function* pipelineGen(
  instructions: readonly Instruction[],
  mode: HazardMode,
): Simulation<PipelineStep, PipelineResult> {
  // Architectural state
  const regs = new Int32Array(8);
  const mem = new Int32Array(32);

  const readReg = (r: number): number => (r === 0 ? 0 : (regs[r] ?? 0));
  const writeReg = (r: number, v: number): void => {
    if (r !== 0) regs[r] = v | 0;
  };

  // Pipeline latches
  let L_IF_ID: Slot;
  let L_ID_EX: IdExLatch = { slot: undefined, valRs: 0, valRt: 0 };
  let L_EX_MEM: ExMemLatch = {
    slot: undefined,
    result: 0,
    storeVal: 0,
    wrReg: 0,
  };
  let L_MEM_WB: MemWbLatch = { slot: undefined, result: 0, wrReg: 0 };

  let fetchPc = 0;
  let cycle = 0;
  let stallCount = 0;
  let forwardCount = 0;
  let flushCount = 0;
  let instructionsDone = 0;

  const totalInstructions = instructions.length;

  while (true) {
    cycle++;

    // ── WB: commit result from MEM/WB latch ─────────────────────────────
    const wb_slot = L_MEM_WB.slot;
    const wb_result = L_MEM_WB.result;
    const wb_wrReg = L_MEM_WB.wrReg;

    if (isReal(wb_slot)) {
      if (wb_wrReg !== 0) writeReg(wb_wrReg, wb_result);
      instructionsDone++;
    }

    // ── MEM: access data memory using EX/MEM latch ───────────────────────
    const mem_slot = L_EX_MEM.slot;
    const mem_alu = L_EX_MEM.result;
    const mem_storeVal = L_EX_MEM.storeVal;
    const mem_wrReg = L_EX_MEM.wrReg;

    let mem_result = mem_alu;
    if (isReal(mem_slot)) {
      if (mem_slot.op === "lw") {
        const addr = (mem_alu >>> 0) % 32;
        mem_result = mem[addr] ?? 0;
      } else if (mem_slot.op === "sw") {
        const addr = (mem_alu >>> 0) % 32;
        mem[addr] = mem_storeVal;
        mem_result = 0; // sw has no writeback
      }
    }

    // ── EX: execute with optional forwarding ─────────────────────────────
    const ex_slot = L_ID_EX.slot;
    let ex_valRs = L_ID_EX.valRs;
    let ex_valRt = L_ID_EX.valRt;

    const forwards: ForwardInfo[] = [];

    if (isReal(ex_slot) && mode === "forwarding") {
      // EX/MEM → EX forwarding (result of the instruction now in MEM stage)
      if (mem_wrReg !== 0) {
        if (usesRs(ex_slot) && ex_slot.rs !== 0 && mem_wrReg === ex_slot.rs) {
          ex_valRs = mem_alu; // ALU result (not lw result — that's not ready yet; load-use stall handles it)
          forwards.push({ from: "EX/MEM", toReg: ex_slot.rs });
          forwardCount++;
        }
        if (usesRt(ex_slot) && ex_slot.rt !== 0 && mem_wrReg === ex_slot.rt) {
          ex_valRt = mem_alu;
          forwards.push({ from: "EX/MEM", toReg: ex_slot.rt });
          forwardCount++;
        }
      }
      // MEM/WB → EX forwarding (result from WB stage, already committed to regs
      //   but we need the forwarded value because WB hasn't updated regs yet
      //   at the point ID read the register file last cycle)
      // Priority: EX/MEM beats MEM/WB for the same register
      if (wb_wrReg !== 0) {
        if (
          usesRs(ex_slot) &&
          ex_slot.rs !== 0 &&
          wb_wrReg === ex_slot.rs &&
          mem_wrReg !== ex_slot.rs // EX/MEM already covered it
        ) {
          ex_valRs = wb_result;
          forwards.push({ from: "MEM/WB", toReg: ex_slot.rs });
          forwardCount++;
        }
        if (
          usesRt(ex_slot) &&
          ex_slot.rt !== 0 &&
          wb_wrReg === ex_slot.rt &&
          mem_wrReg !== ex_slot.rt
        ) {
          ex_valRt = wb_result;
          forwards.push({ from: "MEM/WB", toReg: ex_slot.rt });
          forwardCount++;
        }
      }
    }

    // Compute EX result
    let ex_result = 0;
    let ex_wrReg = 0;
    let ex_storeVal = 0;
    let branchTaken = false;

    if (isReal(ex_slot)) {
      ex_wrReg = destReg(ex_slot);
      ex_storeVal = ex_valRt; // for sw: the value to store

      switch (ex_slot.op) {
        case "add":
          ex_result = (ex_valRs + ex_valRt) | 0;
          break;
        case "sub":
          ex_result = (ex_valRs - ex_valRt) | 0;
          break;
        case "and":
          ex_result = (ex_valRs & ex_valRt) | 0;
          break;
        case "or":
          ex_result = ex_valRs | ex_valRt | 0;
          break;
        case "addi":
          ex_result = (ex_valRs + ex_slot.imm) | 0;
          break;
        case "lw":
          ex_result = (ex_valRs + ex_slot.imm) | 0;
          break; // effective address
        case "sw":
          ex_result = (ex_valRs + ex_slot.imm) | 0;
          break; // effective address
        case "beq":
          branchTaken = ex_valRs === ex_valRt;
          ex_result = 0;
          break;
        default:
          ex_result = 0;
      }
    }

    // ── ID: hazard detection ─────────────────────────────────────────────
    // We look at what's currently in ID (= L_IF_ID) and check against EX and MEM stages.
    const id_slot = L_IF_ID;
    let stall = false;

    if (isReal(id_slot)) {
      const needRs = usesRs(id_slot) && id_slot.rs !== 0;
      const needRt = usesRt(id_slot) && id_slot.rt !== 0;

      if (mode === "stall") {
        // Stall if EX or MEM will write a reg we need
        const ex_wr_now = destReg(L_ID_EX.slot); // in EX right now
        const mem_wr_now = mem_wrReg; // in MEM right now
        const hazard =
          (ex_wr_now !== 0 &&
            ((needRs && ex_wr_now === id_slot.rs) ||
              (needRt && ex_wr_now === id_slot.rt))) ||
          (mem_wr_now !== 0 &&
            ((needRs && mem_wr_now === id_slot.rs) ||
              (needRt && mem_wr_now === id_slot.rt)));
        if (hazard) stall = true;
      } else {
        // Forwarding mode: only load-use stall
        const ex_wr_now = destReg(L_ID_EX.slot);
        const ex_is_load = isReal(L_ID_EX.slot) && L_ID_EX.slot.op === "lw";
        const load_use =
          ex_is_load &&
          ex_wr_now !== 0 &&
          ((needRs && ex_wr_now === id_slot.rs) ||
            (needRt && ex_wr_now === id_slot.rt));
        if (load_use) stall = true;
      }
    }

    // ── Build stage snapshot for step output ─────────────────────────────
    // Show what's in each stage THIS cycle (at start of cycle, before WB committed):
    //   WB  ← L_MEM_WB.slot
    //   MEM ← L_EX_MEM.slot
    //   EX  ← L_ID_EX.slot
    //   ID  ← L_IF_ID
    //   IF  ← instructions[fetchPc] (what we're about to fetch / already fetching)
    const ifLabel: string | "bubble" | undefined =
      fetchPc < instructions.length ? instructions[fetchPc]?.text : undefined;

    const stageMap: Record<StageName, string | "bubble" | undefined> = {
      IF: stall ? slotLabel(L_IF_ID) : ifLabel, // stall: no new fetch; show current IF content
      ID: slotLabel(L_IF_ID),
      EX: slotLabel(L_ID_EX.slot),
      MEM: slotLabel(L_EX_MEM.slot),
      WB: slotLabel(L_MEM_WB.slot),
    };

    const labelParts: string[] = [`cycle ${cycle}`];
    if (stall) labelParts.push("STALL");
    if (branchTaken) labelParts.push("branch taken → flush");
    if (forwards.length > 0)
      labelParts.push(`fwd r${forwards.map((f) => f.toReg).join(",")}`);

    yield {
      cycle,
      stages: stageMap,
      stallInserted: stall,
      forwards,
      flushed: branchTaken,
      registers: Array.from(regs),
      memory: Array.from(mem),
      meta: {
        label: labelParts.join(" | "),
        highlights: forwards.map((f) => f.toReg.toString()),
      },
    };

    // ── Advance latches ───────────────────────────────────────────────────
    // MEM/WB ← EX/MEM (always advances, regardless of stall)
    L_MEM_WB = { slot: mem_slot, result: mem_result, wrReg: mem_wrReg };

    // EX/MEM ← ID/EX result (always: EX always does work even when ID stalls)
    L_EX_MEM = {
      slot: ex_slot,
      result: ex_result,
      storeVal: ex_storeVal,
      wrReg: ex_wrReg,
    };

    if (stall) {
      stallCount++;
      // Stall: freeze IF/ID and ID/EX. Insert bubble into ID/EX next cycle
      // so that EX gets a bubble while the stalled instruction waits.
      // We do this by squashing only the L_ID_EX (the stalled instruction
      // stays in L_IF_ID and will re-enter ID next cycle).
      L_ID_EX = { slot: null, valRs: 0, valRt: 0 }; // bubble into EX next cycle
      // L_IF_ID stays (stalled instruction re-presented to ID next cycle)
    } else {
      // ID/EX ← IF/ID (with register file read), or bubble if branch flushed
      if (branchTaken) {
        flushCount++;
        // Flush: the instructions in IF and ID are squashed (become bubbles)
        L_ID_EX = { slot: null, valRs: 0, valRt: 0 }; // ID flush
        L_IF_ID = null; // IF flush
      } else {
        if (isReal(L_IF_ID)) {
          // Register file read at ID stage
          L_ID_EX = {
            slot: L_IF_ID,
            valRs: readReg(L_IF_ID.rs),
            valRt: readReg(L_IF_ID.rt),
          };
        } else {
          L_ID_EX = { slot: L_IF_ID, valRs: 0, valRt: 0 };
        }
        // IF/ID ← next fetch
        if (fetchPc < instructions.length) {
          L_IF_ID = instructions[fetchPc] ?? undefined;
          fetchPc++;
        } else {
          L_IF_ID = undefined;
        }
      }
    }

    // Done when all real instructions have committed in WB
    if (instructionsDone >= totalInstructions) break;

    // Safety
    if (cycle > totalInstructions * 15 + 20) break;
  }

  return {
    totalCycles: cycle,
    instructionCount: totalInstructions,
    cpi: totalInstructions > 0 ? cycle / totalInstructions : 0,
    stallCount,
    forwardCount,
    flushCount,
    finalRegisters: Array.from(regs),
    finalMemory: Array.from(mem),
  };
}

// ---------------------------------------------------------------------------
// Instruction builder helpers
// ---------------------------------------------------------------------------

export function makeAdd(rd: number, rs: number, rt: number): Instruction {
  return { op: "add", rd, rs, rt, imm: 0, text: `add r${rd},r${rs},r${rt}` };
}
export function makeSub(rd: number, rs: number, rt: number): Instruction {
  return { op: "sub", rd, rs, rt, imm: 0, text: `sub r${rd},r${rs},r${rt}` };
}
export function makeAnd(rd: number, rs: number, rt: number): Instruction {
  return { op: "and", rd, rs, rt, imm: 0, text: `and r${rd},r${rs},r${rt}` };
}
export function makeOr(rd: number, rs: number, rt: number): Instruction {
  return { op: "or", rd, rs, rt, imm: 0, text: `or r${rd},r${rs},r${rt}` };
}
export function makeAddi(rt: number, rs: number, imm: number): Instruction {
  return { op: "addi", rd: rt, rs, rt, imm, text: `addi r${rt},r${rs},${imm}` };
}
export function makeLw(rt: number, imm: number, rs: number): Instruction {
  return { op: "lw", rd: rt, rs, rt, imm, text: `lw r${rt},${imm}(r${rs})` };
}
export function makeSw(rt: number, imm: number, rs: number): Instruction {
  return { op: "sw", rd: 0, rs, rt, imm, text: `sw r${rt},${imm}(r${rs})` };
}
export function makeBeq(rs: number, rt: number, offset: number): Instruction {
  return {
    op: "beq",
    rd: 0,
    rs,
    rt,
    imm: offset,
    text: `beq r${rs},r${rt},${offset}`,
  };
}
export function makeNop(): Instruction {
  return { op: "nop", rd: 0, rs: 0, rt: 0, imm: 0, text: "nop" };
}

// ---------------------------------------------------------------------------
// Sample programs
// ---------------------------------------------------------------------------

export interface PipelinePreset {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly instructions: readonly Instruction[];
}

export const PIPELINE_PRESETS: readonly PipelinePreset[] = [
  {
    id: "raw-hazard",
    name: "RAW Hazards",
    description: "Three consecutive dependent adds — classic data hazard chain",
    instructions: [
      makeAddi(1, 0, 5),
      makeAddi(2, 1, 3),
      makeAddi(3, 2, 1),
      makeAdd(4, 1, 3),
    ],
  },
  {
    id: "load-use",
    name: "Load-Use",
    description:
      "lw immediately followed by an instruction that uses the loaded value",
    instructions: [
      makeAddi(1, 0, 0),
      makeLw(2, 0, 1),
      makeAdd(3, 2, 1),
      makeAddi(4, 3, 10),
    ],
  },
  {
    id: "branch-loop",
    name: "Branch Loop",
    description: "beq — predict-not-taken, taken branch flushes 2 instructions",
    instructions: [
      makeAddi(1, 0, 3),
      makeAddi(2, 0, 3),
      makeBeq(1, 2, 1),
      makeAddi(3, 0, 99),
      makeAddi(4, 0, 7),
    ],
  },
  {
    id: "no-hazard",
    name: "No Hazards",
    description: "Independent instructions — ideal CPI ≈ 1",
    instructions: [
      makeAddi(1, 0, 10),
      makeAddi(2, 0, 20),
      makeAddi(3, 0, 30),
      makeAddi(4, 0, 40),
    ],
  },
];
