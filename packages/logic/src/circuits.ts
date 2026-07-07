import { CircuitBuilder } from "./builder.ts";
import type { Circuit } from "./types.ts";

/**
 * The prebuilt circuit library backing the /logic lessons. Every circuit is
 * constructed from NAND gates only; the builder helpers are just shorthand.
 */

export function buildNand(): Circuit {
  const b = new CircuitBuilder();
  const out = b.nand(b.input("a"), b.input("b"));
  return b.build("nand", "NAND", { out });
}

export function buildNot(): Circuit {
  const b = new CircuitBuilder();
  const out = b.not(b.input("a"));
  return b.build("not", "NOT", { out });
}

export function buildAnd(): Circuit {
  const b = new CircuitBuilder();
  const out = b.and(b.input("a"), b.input("b"));
  return b.build("and", "AND", { out });
}

export function buildOr(): Circuit {
  const b = new CircuitBuilder();
  const out = b.or(b.input("a"), b.input("b"));
  return b.build("or", "OR", { out });
}

export function buildXor(): Circuit {
  const b = new CircuitBuilder();
  const out = b.xor(b.input("a"), b.input("b"));
  return b.build("xor", "XOR", { out });
}

export function buildMux(): Circuit {
  const b = new CircuitBuilder();
  const out = b.mux(b.input("a"), b.input("b"), b.input("sel"));
  return b.build("mux", "2-to-1 MUX", { out });
}

export function buildHalfAdder(): Circuit {
  const b = new CircuitBuilder();
  const { sum, carry } = b.halfAdder(b.input("a"), b.input("b"));
  return b.build("half-adder", "Half adder", { sum, carry });
}

export function buildFullAdder(): Circuit {
  const b = new CircuitBuilder();
  const { sum, carry } = b.fullAdder(
    b.input("a"),
    b.input("b"),
    b.input("cin"),
  );
  return b.build("full-adder", "Full adder", { sum, carry });
}

export function buildAdder4(): Circuit {
  const b = new CircuitBuilder();
  const a = [0, 1, 2, 3].map((i) => b.input(`a${i}`));
  const bIn = [0, 1, 2, 3].map((i) => b.input(`b${i}`));
  const cin = b.input("cin");
  const { sum, carry } = b.rippleAdder(a, bIn, cin);
  return b.build("adder4", "4-bit ripple-carry adder", {
    sum0: sum[0] as string,
    sum1: sum[1] as string,
    sum2: sum[2] as string,
    sum3: sum[3] as string,
    carry,
  });
}

export function buildSrLatch(): Circuit {
  const b = new CircuitBuilder();
  const { q, qn } = b.srLatchN(b.input("set_n"), b.input("reset_n"));
  return b.build("sr-latch", "SR latch (NAND, active-low)", { q, qn });
}

export function buildDLatch(): Circuit {
  const b = new CircuitBuilder();
  const { q, qn } = b.dLatch(b.input("d"), b.input("enable"));
  return b.build("d-latch", "Gated D latch", { q, qn });
}

export function buildDff(): Circuit {
  const b = new CircuitBuilder();
  const { q, qn } = b.dff(b.input("d"), b.input("clock"));
  return b.build("dff", "D flip-flop (master–slave)", { q, qn });
}

export function buildRegister4(): Circuit {
  const b = new CircuitBuilder();
  const clock = b.input("clock");
  const outputs: Record<string, string> = {};
  for (let i = 0; i < 4; i++) {
    const { q } = b.dff(b.input(`d${i}`), clock);
    outputs[`q${i}`] = q;
  }
  return b.build("register4", "4-bit register", outputs);
}

/**
 * 4-bit ALU. Operations, selected by (op1, op0):
 *   00 ADD   01 SUB (two's complement)   10 AND   11 OR
 * `carry` is meaningful for ADD (overflow) and SUB (no-borrow).
 */
export function buildAlu4(): Circuit {
  const b = new CircuitBuilder();
  const a = [0, 1, 2, 3].map((i) => b.input(`a${i}`));
  const bIn = [0, 1, 2, 3].map((i) => b.input(`b${i}`));
  const op0 = b.input("op0");
  const op1 = b.input("op1");

  // SUB = a + NOT(b) + 1: invert b and inject carry-in when (op1,op0)=(0,1)
  const sub = b.and(op0, b.not(op1));
  const bAdd = bIn.map((w) => b.xor(w, sub));
  const { sum, carry } = b.rippleAdder(a, bAdd, sub);

  const outputs: Record<string, string> = { carry };
  for (let i = 0; i < 4; i++) {
    const andBit = b.and(a[i] as string, bIn[i] as string);
    const orBit = b.or(a[i] as string, bIn[i] as string);
    const logicBit = b.mux(andBit, orBit, op0);
    outputs[`out${i}`] = b.mux(sum[i] as string, logicBit, op1);
  }
  return b.build("alu4", "4-bit ALU", outputs);
}
