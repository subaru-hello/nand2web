import type { InstructionSpec } from "./isa.ts";
import {
  decode,
  encode,
  formatInstruction,
  INSTRUCTIONS,
  MEMORY_SIZE,
  WORD_MASK,
} from "./isa.ts";

/**
 * Two-pass assembler. Syntax:
 *
 *   ; comments run to end of line
 *   loop:            ; labels end with a colon
 *     LDI 5          ; operands are decimal, 0x hex, or a label
 *     JMP loop
 */

export interface AssembleError {
  readonly line: number; // 1-based source line
  readonly message: string;
}

export interface ListingEntry {
  readonly address: number;
  readonly byte: number;
  readonly line: number;
  readonly source: string;
}

export type AssembleResult =
  | {
      readonly ok: true;
      readonly program: readonly number[];
      readonly listing: readonly ListingEntry[];
    }
  | { readonly ok: false; readonly errors: readonly AssembleError[] };

interface ParsedLine {
  readonly line: number;
  readonly source: string;
  readonly spec: InstructionSpec;
  readonly operandText: string | undefined;
}

export function assemble(source: string): AssembleResult {
  const errors: AssembleError[] = [];
  const labels = new Map<string, number>();
  const parsed: ParsedLine[] = [];

  // Pass 1: strip comments, record labels, parse mnemonics.
  source.split("\n").forEach((raw, i) => {
    const line = i + 1;
    let text = (raw.split(";")[0] ?? "").trim();
    if (text === "") {
      return;
    }
    const labelMatch = text.match(/^([A-Za-z_][\w]*):\s*/);
    if (labelMatch?.[1] !== undefined) {
      const label = labelMatch[1].toLowerCase();
      if (labels.has(label)) {
        errors.push({ line, message: `duplicate label "${labelMatch[1]}"` });
      }
      labels.set(label, parsed.length);
      text = text.slice(labelMatch[0].length).trim();
      if (text === "") {
        return;
      }
    }

    const [mnemonic, operandText, extra] = text.split(/\s+/);
    const spec = INSTRUCTIONS.find(
      (s) => s.mnemonic === (mnemonic ?? "").toUpperCase(),
    );
    if (!spec) {
      errors.push({ line, message: `unknown instruction "${mnemonic}"` });
      return;
    }
    if (extra !== undefined) {
      errors.push({ line, message: `unexpected text "${extra}"` });
      return;
    }
    if (spec.operand === "none" && operandText !== undefined) {
      errors.push({ line, message: `${spec.mnemonic} takes no operand` });
      return;
    }
    if (spec.operand !== "none" && operandText === undefined) {
      errors.push({ line, message: `${spec.mnemonic} needs an operand` });
      return;
    }
    parsed.push({ line, source: text, spec, operandText });
  });

  if (parsed.length > MEMORY_SIZE) {
    errors.push({
      line: parsed[MEMORY_SIZE]?.line ?? 1,
      message: `program is ${parsed.length} instructions; memory holds ${MEMORY_SIZE}`,
    });
  }

  // Pass 2: resolve operands now that every label address is known.
  const listing: ListingEntry[] = [];
  parsed.slice(0, MEMORY_SIZE).forEach((entry, address) => {
    let operand = 0;
    if (entry.spec.operand !== "none" && entry.operandText !== undefined) {
      const resolved = resolveOperand(entry.operandText, entry.spec, labels);
      if (typeof resolved === "string") {
        errors.push({ line: entry.line, message: resolved });
        return;
      }
      operand = resolved;
    }
    listing.push({
      address,
      byte: encode(entry.spec, operand),
      line: entry.line,
      source: entry.source,
    });
  });

  if (errors.length > 0) {
    return { ok: false, errors };
  }
  const program = Array.from({ length: MEMORY_SIZE }, () => 0);
  for (const entry of listing) {
    program[entry.address] = entry.byte;
  }
  return { ok: true, program, listing };
}

function resolveOperand(
  text: string,
  spec: InstructionSpec,
  labels: ReadonlyMap<string, number>,
): number | string {
  const label = labels.get(text.toLowerCase());
  if (label !== undefined) {
    return label;
  }
  const value = text.startsWith("0x")
    ? Number.parseInt(text.slice(2), 16)
    : /^\d+$/.test(text)
      ? Number.parseInt(text, 10)
      : Number.NaN;
  if (Number.isNaN(value)) {
    return spec.operand === "label"
      ? `unknown label "${text}"`
      : `invalid operand "${text}"`;
  }
  if (value < 0 || value > WORD_MASK) {
    return `operand ${value} out of range 0-15`;
  }
  return value;
}

/** Render a program back to canonical assembly text (labels lost). */
export function disassemble(program: readonly number[]): string {
  return program.map((byte) => formatInstruction(decode(byte))).join("\n");
}
