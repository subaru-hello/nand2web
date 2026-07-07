import { collectSteps } from "@nand2web/sim-core";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { assemble, disassemble } from "./assembler.ts";
import { decode, encode, INSTRUCTIONS } from "./isa.ts";
import type { CpuState } from "./machine.ts";
import { run } from "./machine.ts";
import { SAMPLE_PROGRAMS } from "./programs.ts";

function runSource(
  source: string,
  options?: { input?: number; maxCycles?: number },
): { outputs: number[]; final: CpuState } {
  const result = assemble(source);
  if (!result.ok) {
    throw new Error(result.errors.map((e) => `L${e.line}: ${e.message}`).join("; "));
  }
  const { steps, result: final } = collectSteps(
    run(result.program, { input: options?.input ?? 0, maxCycles: options?.maxCycles ?? 400 }),
  );
  if (!final) {
    throw new Error("cycle limit hit during collectSteps");
  }
  const outputs: number[] = [];
  for (const step of steps) {
    if (step.type === "execute" && step.instr.spec.mnemonic === "OUT") {
      outputs.push(step.state.out);
    }
  }
  return { outputs, final };
}

describe("assembler", () => {
  it("assembles every sample program", () => {
    for (const sample of SAMPLE_PROGRAMS) {
      const result = assemble(sample.source);
      expect(result.ok, sample.id).toBe(true);
    }
  });

  it("reports errors with line numbers", () => {
    const result = assemble("  LDI 3\n  FROB 1\n  LDI 99\n  ADD 2\n  JMP nowhere");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const byLine = new Map(result.errors.map((e) => [e.line, e.message]));
      expect(byLine.get(2)).toMatch(/unknown instruction/);
      expect(byLine.get(3)).toMatch(/out of range/);
      expect(byLine.get(4)).toMatch(/takes no operand/);
      expect(byLine.get(5)).toMatch(/unknown label/);
    }
  });

  it("rejects programs longer than memory", () => {
    const result = assemble(Array.from({ length: 17 }, () => "NOP").join("\n"));
    expect(result.ok).toBe(false);
  });

  it("resolves labels to instruction addresses", () => {
    const result = assemble("start:\n  NOP\n  JMP start");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.program[1]).toBe(0x60); // JMP 0
    }
  });

  it("round-trips: disassemble(assemble(p)) reassembles to the same bytes (property)", () => {
    // Canonical encodings only — i.e. bytes the assembler itself can produce.
    const instrArb = fc
      .constantFrom(...INSTRUCTIONS)
      .chain((spec) =>
        spec.operand === "none"
          ? fc.constant(encode(spec, 0))
          : fc.integer({ min: 0, max: 15 }).map((operand) => encode(spec, operand)),
      );
    fc.assert(
      fc.property(fc.array(instrArb, { minLength: 1, maxLength: 16 }), (bytes) => {
        const padded = [...bytes, ...Array(16 - bytes.length).fill(0)];
        const text = disassemble(padded);
        const reassembled = assemble(text);
        return reassembled.ok && reassembled.program.every((b, i) => b === padded[i]);
      }),
    );
  });

  it("decode is total: every byte decodes to a known instruction", () => {
    for (let byte = 0; byte <= 0xff; byte++) {
      expect(decode(byte).spec.mnemonic).toBeTruthy();
    }
  });
});

describe("machine", () => {
  it("3 + 4 outputs 7 and halts", () => {
    const sample = SAMPLE_PROGRAMS.find((p) => p.id === "add");
    const { outputs, final } = runSource(sample?.source ?? "");
    expect(outputs).toEqual([7]);
    expect(final.halted).toBe(true);
  });

  it("counter wraps modulo 16", () => {
    const sample = SAMPLE_PROGRAMS.find((p) => p.id === "counter");
    const { outputs } = runSource(sample?.source ?? "", { maxCycles: 300 });
    expect(outputs.slice(0, 18)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0, 1,
    ]);
  });

  it("countdown descends from the input port to zero", () => {
    const sample = SAMPLE_PROGRAMS.find((p) => p.id === "countdown");
    const { outputs, final } = runSource(sample?.source ?? "", { input: 5 });
    expect(outputs).toEqual([5, 4, 3, 2, 1, 0]);
    expect(final.halted).toBe(true);
  });

  it("fibonacci outputs the 4-bit sequence and halts on overflow", () => {
    const sample = SAMPLE_PROGRAMS.find((p) => p.id === "fibonacci");
    const { outputs, final } = runSource(sample?.source ?? "");
    expect(outputs).toEqual([1, 1, 2, 3, 5, 8, 13]);
    expect(final.halted).toBe(true);
  });

  it("LDI n; OUT shows n for every n (property)", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 15 }), (n) => {
        const { outputs } = runSource(`LDI ${n}\nOUT\nHLT`);
        return outputs.length === 1 && outputs[0] === n;
      }),
    );
  });

  it("ADD matches integer addition mod 16 with carry (property)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 15 }),
        fc.integer({ min: 0, max: 15 }),
        (a, b) => {
          const { outputs, final } = runSource(
            `LDI ${a}\nTAB\nLDI ${b}\nADD\nOUT\nHLT`,
          );
          return (
            outputs[0] === ((a + b) & 0xf) && final.carry === (a + b > 15)
          );
        },
      ),
    );
  });

  it("SUB sets zero exactly when operands are equal (property)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 15 }),
        fc.integer({ min: 0, max: 15 }),
        (a, b) => {
          // A = a - b  (B is loaded first)
          const { outputs, final } = runSource(
            `LDI ${b}\nTAB\nLDI ${a}\nSUB\nOUT\nHLT`,
          );
          return (
            outputs[0] === ((a - b) & 0xf) &&
            final.zero === (a === b) &&
            final.carry === (a >= b)
          );
        },
      ),
    );
  });

  it("ST then LD round-trips through RAM (property)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 15 }),
        fc.integer({ min: 0, max: 15 }),
        (value, addr) => {
          const { outputs } = runSource(
            `LDI ${value}\nST ${addr}\nLDI 0\nLD ${addr}\nOUT\nHLT`,
          );
          return outputs[0] === value;
        },
      ),
    );
  });

  it("stops at the cycle limit instead of looping forever", () => {
    const { final } = runSource("loop:\n  JMP loop", { maxCycles: 50 });
    expect(final.halted).toBe(false);
    expect(final.cycle).toBe(50);
  });
});
