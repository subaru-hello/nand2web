import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  buildAdder4,
  buildAlu4,
  buildAnd,
  buildDff,
  buildDLatch,
  buildFullAdder,
  buildHalfAdder,
  buildMux,
  buildNot,
  buildOr,
  buildSrLatch,
  buildXor,
} from "./circuits.ts";
import { evaluate, readOutputs } from "./simulate.ts";
import type { Bit, Circuit, WireState } from "./types.ts";

const BITS: readonly Bit[] = [0, 1];

function run(
  circuit: Circuit,
  inputs: Record<string, Bit>,
  previous?: WireState,
): { outputs: Record<string, Bit>; state: WireState } {
  const prefixed: Record<string, Bit> = {};
  for (const [label, value] of Object.entries(inputs)) {
    prefixed[`in:${label}`] = value;
  }
  const state = evaluate(circuit, prefixed, previous);
  return { outputs: readOutputs(circuit, state), state };
}

describe("basic gates (exhaustive truth tables)", () => {
  it("NOT", () => {
    const c = buildNot();
    expect(run(c, { a: 0 }).outputs.out).toBe(1);
    expect(run(c, { a: 1 }).outputs.out).toBe(0);
  });

  it("AND, OR, XOR match boolean semantics for all inputs", () => {
    const cases = [
      { circuit: buildAnd(), fn: (a: Bit, b: Bit) => a & b },
      { circuit: buildOr(), fn: (a: Bit, b: Bit) => a | b },
      { circuit: buildXor(), fn: (a: Bit, b: Bit) => a ^ b },
    ];
    for (const { circuit, fn } of cases) {
      for (const a of BITS) {
        for (const b of BITS) {
          expect(run(circuit, { a, b }).outputs.out, circuit.id).toBe(fn(a, b));
        }
      }
    }
  });

  it("MUX selects a when sel=0, b when sel=1", () => {
    const c = buildMux();
    for (const a of BITS) {
      for (const b of BITS) {
        expect(run(c, { a, b, sel: 0 }).outputs.out).toBe(a);
        expect(run(c, { a, b, sel: 1 }).outputs.out).toBe(b);
      }
    }
  });

  it("every circuit is NAND-only", () => {
    // The type system enforces this (gates are NandGate[]), but assert the
    // headline claim explicitly: composite circuits reduce to NANDs.
    expect(buildAlu4().gates.length).toBeGreaterThan(50);
    expect(buildXor().gates).toHaveLength(4);
  });
});

describe("adders", () => {
  it("half adder (exhaustive)", () => {
    const c = buildHalfAdder();
    for (const a of BITS) {
      for (const b of BITS) {
        const { outputs } = run(c, { a, b });
        expect(outputs.sum).toBe(a ^ b);
        expect(outputs.carry).toBe(a & b);
      }
    }
  });

  it("full adder (exhaustive)", () => {
    const c = buildFullAdder();
    for (const a of BITS) {
      for (const b of BITS) {
        for (const cin of BITS) {
          const { outputs } = run(c, { a, b, cin });
          const total = a + b + cin;
          expect(outputs.sum).toBe(total % 2);
          expect(outputs.carry).toBe(total >= 2 ? 1 : 0);
        }
      }
    }
  });

  it("4-bit adder equals integer addition mod 16 (property)", () => {
    const c = buildAdder4();
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 15 }),
        fc.integer({ min: 0, max: 15 }),
        fc.integer({ min: 0, max: 1 }),
        (a, b, cin) => {
          const { outputs } = run(c, {
            a0: bit(a, 0),
            a1: bit(a, 1),
            a2: bit(a, 2),
            a3: bit(a, 3),
            b0: bit(b, 0),
            b1: bit(b, 1),
            b2: bit(b, 2),
            b3: bit(b, 3),
            cin: cin as Bit,
          });
          const sum =
            outputs.sum0! +
            outputs.sum1! * 2 +
            outputs.sum2! * 4 +
            outputs.sum3! * 8;
          const expected = a + b + cin;
          return (
            sum === (expected & 0xf) &&
            outputs.carry === (expected > 15 ? 1 : 0)
          );
        },
      ),
    );
  });
});

describe("sequential circuits", () => {
  it("SR latch sets, holds, and resets", () => {
    const c = buildSrLatch();
    // set (active-low): set_n=0
    let { outputs, state } = run(c, { set_n: 0, reset_n: 1 });
    expect(outputs.q).toBe(1);
    expect(outputs.qn).toBe(0);
    // hold: both released — state persists
    ({ outputs, state } = run(c, { set_n: 1, reset_n: 1 }, state));
    expect(outputs.q).toBe(1);
    // reset
    ({ outputs, state } = run(c, { set_n: 1, reset_n: 0 }, state));
    expect(outputs.q).toBe(0);
    expect(outputs.qn).toBe(1);
    // hold again
    ({ outputs } = run(c, { set_n: 1, reset_n: 1 }, state));
    expect(outputs.q).toBe(0);
  });

  it("D latch is transparent when enabled, holds when disabled", () => {
    const c = buildDLatch();
    let { outputs, state } = run(c, { d: 1, enable: 1 });
    expect(outputs.q).toBe(1);
    ({ outputs, state } = run(c, { d: 0, enable: 0 }, state)); // disabled: hold
    expect(outputs.q).toBe(1);
    ({ outputs } = run(c, { d: 0, enable: 1 }, state)); // enabled: follow d
    expect(outputs.q).toBe(0);
  });

  it("D flip-flop captures D only on the rising clock edge", () => {
    const c = buildDff();
    // Power-on state is undefined (as in real hardware) — clock in a known 0
    let state = run(c, { d: 0, clock: 0 }).state;
    state = run(c, { d: 0, clock: 1 }, state).state;
    state = run(c, { d: 0, clock: 0 }, state).state;
    expect(run(c, { d: 0, clock: 0 }, state).outputs.q).toBe(0);

    // d goes high while clock low: q unchanged
    let r = run(c, { d: 1, clock: 0 }, state);
    expect(r.outputs.q).toBe(0);
    // rising edge: q captures 1
    r = run(c, { d: 1, clock: 1 }, r.state);
    expect(r.outputs.q).toBe(1);
    // d drops while clock high: q holds
    r = run(c, { d: 0, clock: 1 }, r.state);
    expect(r.outputs.q).toBe(1);
    // falling edge: q still holds
    r = run(c, { d: 0, clock: 0 }, r.state);
    expect(r.outputs.q).toBe(1);
    // next rising edge captures 0
    r = run(c, { d: 0, clock: 1 }, r.state);
    expect(r.outputs.q).toBe(0);
  });

  it("DFF follows any bit sequence, one capture per rising edge (property)", () => {
    const c = buildDff();
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 1 }), { maxLength: 20 }),
        (ds) => {
          let state = run(c, { d: 0, clock: 0 }).state;
          for (const d of ds as Bit[]) {
            state = run(c, { d, clock: 0 }, state).state; // present d, clock low
            const r = run(c, { d, clock: 1 }, state); // rising edge
            if (r.outputs.q !== d) return false;
            state = run(c, { d, clock: 0 }, r.state).state; // clock back low
          }
          return true;
        },
      ),
    );
  });
});

describe("4-bit ALU", () => {
  const c = buildAlu4();

  function alu(a: number, b: number, op1: Bit, op0: Bit) {
    const { outputs } = run(c, {
      a0: bit(a, 0),
      a1: bit(a, 1),
      a2: bit(a, 2),
      a3: bit(a, 3),
      b0: bit(b, 0),
      b1: bit(b, 1),
      b2: bit(b, 2),
      b3: bit(b, 3),
      op0,
      op1,
    });
    const value =
      outputs.out0! + outputs.out1! * 2 + outputs.out2! * 4 + outputs.out3! * 8;
    return { value, carry: outputs.carry };
  }

  it("ADD, SUB, AND, OR match the reference for all operand pairs (property)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 15 }),
        fc.integer({ min: 0, max: 15 }),
        (a, b) => {
          const add = alu(a, b, 0, 0);
          const sub = alu(a, b, 0, 1);
          const and = alu(a, b, 1, 0);
          const or = alu(a, b, 1, 1);
          return (
            add.value === ((a + b) & 0xf) &&
            add.carry === (a + b > 15 ? 1 : 0) &&
            sub.value === ((a - b) & 0xf) &&
            sub.carry === (a >= b ? 1 : 0) && // no-borrow flag
            and.value === (a & b) &&
            or.value === (a | b)
          );
        },
      ),
    );
  });
});

function bit(value: number, index: number): Bit {
  return ((value >> index) & 1) === 1 ? 1 : 0;
}
