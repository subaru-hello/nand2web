/**
 * A 4-bit instruction set, small enough to learn in minutes and complete
 * enough to compute with. Instructions are 8 bits: a 4-bit opcode and a
 * 4-bit operand. Program memory is 16 words; data RAM is 16 nibbles.
 *
 * The ALU operations reuse the exact op encoding of the Layer 1 ALU
 * (00 ADD, 01 SUB, 10 AND, 11 OR) — this CPU is that circuit, grown up.
 */

export const WORD_MASK = 0xf;
export const MEMORY_SIZE = 16;

export type DatapathNode =
  | "pc"
  | "rom"
  | "ir"
  | "decoder"
  | "alu"
  | "regA"
  | "regB"
  | "ram"
  | "out"
  | "in"
  | "flags";

export type OperandKind = "none" | "immediate" | "address" | "label";

export interface InstructionSpec {
  readonly mnemonic: string;
  readonly opcode: number;
  /** Fixed operand nibble for variant instructions (e.g. MOV directions). */
  readonly fixedOperand?: number;
  readonly operand: OperandKind;
  readonly description: string;
}

export const INSTRUCTIONS: readonly InstructionSpec[] = [
  { mnemonic: "NOP", opcode: 0x0, operand: "none", description: "Do nothing." },
  {
    mnemonic: "LDI",
    opcode: 0x1,
    operand: "immediate",
    description: "A ← n (load immediate).",
  },
  {
    mnemonic: "TAB",
    opcode: 0x2,
    fixedOperand: 0x0,
    operand: "none",
    description: "B ← A (transfer A to B).",
  },
  {
    mnemonic: "TBA",
    opcode: 0x2,
    fixedOperand: 0x1,
    operand: "none",
    description: "A ← B (transfer B to A).",
  },
  {
    mnemonic: "ADD",
    opcode: 0x3,
    fixedOperand: 0x0,
    operand: "none",
    description: "A ← A + B; sets carry and zero.",
  },
  {
    mnemonic: "SUB",
    opcode: 0x3,
    fixedOperand: 0x1,
    operand: "none",
    description: "A ← A − B; carry = no-borrow; sets zero.",
  },
  {
    mnemonic: "AND",
    opcode: 0x3,
    fixedOperand: 0x2,
    operand: "none",
    description: "A ← A AND B; sets zero.",
  },
  {
    mnemonic: "OR",
    opcode: 0x3,
    fixedOperand: 0x3,
    operand: "none",
    description: "A ← A OR B; sets zero.",
  },
  {
    mnemonic: "LD",
    opcode: 0x4,
    operand: "address",
    description: "A ← RAM[n].",
  },
  {
    mnemonic: "ST",
    opcode: 0x5,
    operand: "address",
    description: "RAM[n] ← A.",
  },
  {
    mnemonic: "JMP",
    opcode: 0x6,
    operand: "label",
    description: "PC ← n (unconditional jump).",
  },
  {
    mnemonic: "JZ",
    opcode: 0x7,
    operand: "label",
    description: "PC ← n if the zero flag is set.",
  },
  {
    mnemonic: "JC",
    opcode: 0x8,
    operand: "label",
    description: "PC ← n if the carry flag is set.",
  },
  {
    mnemonic: "OUT",
    opcode: 0x9,
    fixedOperand: 0x0,
    operand: "none",
    description: "OUT ← A (display A).",
  },
  {
    mnemonic: "IN",
    opcode: 0x9,
    fixedOperand: 0x1,
    operand: "none",
    description: "A ← IN (read the input port).",
  },
  {
    mnemonic: "HLT",
    opcode: 0xf,
    operand: "none",
    description: "Halt the machine.",
  },
];

export interface DecodedInstruction {
  readonly spec: InstructionSpec;
  readonly operand: number;
  readonly byte: number;
}

/** Decode an 8-bit word; unknown encodings decode to NOP-like behavior. */
export function decode(byte: number): DecodedInstruction {
  const opcode = (byte >> 4) & WORD_MASK;
  const operand = byte & WORD_MASK;
  const spec =
    INSTRUCTIONS.find(
      (s) =>
        s.opcode === opcode &&
        (s.fixedOperand === undefined || s.fixedOperand === operand),
    ) ?? (INSTRUCTIONS[0] as InstructionSpec);
  return { spec, operand, byte };
}

export function encode(spec: InstructionSpec, operand: number): number {
  return (
    ((spec.opcode & WORD_MASK) << 4) |
    ((spec.fixedOperand ?? operand) & WORD_MASK)
  );
}

export function formatInstruction(instr: DecodedInstruction): string {
  if (instr.spec.operand === "none") {
    return instr.spec.mnemonic;
  }
  return `${instr.spec.mnemonic} ${instr.operand}`;
}
