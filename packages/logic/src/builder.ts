import type { Circuit, CircuitPort, NandGate, WireId } from "./types.ts";

/**
 * Builds circuits by composing NAND gates. Helper methods (not/and/or/xor,
 * adders, latches, mux) are pure construction shorthand — the resulting
 * netlist contains nothing but NANDs.
 */
export class CircuitBuilder {
  private readonly gates: NandGate[] = [];
  private readonly inputPorts: CircuitPort[] = [];
  private wireCount = 0;

  input(label: string): WireId {
    const wire: WireId = `in:${label}`;
    this.inputPorts.push({ label, wire });
    return wire;
  }

  nand(a: WireId, b: WireId): WireId {
    const out: WireId = `w${this.wireCount++}`;
    this.gates.push({ id: `g${this.gates.length}`, a, b, out });
    return out;
  }

  not(a: WireId): WireId {
    return this.nand(a, a);
  }

  and(a: WireId, b: WireId): WireId {
    return this.not(this.nand(a, b));
  }

  or(a: WireId, b: WireId): WireId {
    return this.nand(this.not(a), this.not(b));
  }

  xor(a: WireId, b: WireId): WireId {
    const n = this.nand(a, b);
    return this.nand(this.nand(a, n), this.nand(b, n));
  }

  /** 2-to-1 multiplexer: returns `a` when sel=0, `b` when sel=1. */
  mux(a: WireId, b: WireId, sel: WireId): WireId {
    return this.nand(this.nand(a, this.not(sel)), this.nand(b, sel));
  }

  halfAdder(a: WireId, b: WireId): { sum: WireId; carry: WireId } {
    return { sum: this.xor(a, b), carry: this.and(a, b) };
  }

  fullAdder(a: WireId, b: WireId, cin: WireId): { sum: WireId; carry: WireId } {
    const axb = this.xor(a, b);
    const sum = this.xor(axb, cin);
    // carry = (a AND b) OR (cin AND (a XOR b)), as a single NAND pair
    const carry = this.nand(this.nand(a, b), this.nand(cin, axb));
    return { sum, carry };
  }

  /** Ripple-carry adder. Bit arrays are LSB-first. */
  rippleAdder(
    a: readonly WireId[],
    b: readonly WireId[],
    cin: WireId,
  ): { sum: WireId[]; carry: WireId } {
    let carry = cin;
    const sum: WireId[] = [];
    for (let i = 0; i < a.length; i++) {
      const fa = this.fullAdder(a[i] as WireId, b[i] as WireId, carry);
      sum.push(fa.sum);
      carry = fa.carry;
    }
    return { sum, carry };
  }

  /**
   * SR latch from two cross-coupled NANDs (active-low set̄/reset̄ inputs).
   * The feedback loop is why the simulator supports cyclic netlists.
   */
  srLatchN(setN: WireId, resetN: WireId): { q: WireId; qn: WireId } {
    // Cross-coupled pair: declare output wires first, then wire the loop.
    const q: WireId = `w${this.wireCount++}`;
    const qn: WireId = `w${this.wireCount++}`;
    this.gates.push({ id: `g${this.gates.length}`, a: setN, b: qn, out: q });
    this.gates.push({ id: `g${this.gates.length}`, a: resetN, b: q, out: qn });
    return { q, qn };
  }

  /** Gated (level-sensitive) D latch: transparent while enable=1. */
  dLatch(d: WireId, enable: WireId): { q: WireId; qn: WireId } {
    const setN = this.nand(d, enable);
    const resetN = this.nand(this.not(d), enable);
    return this.srLatchN(setN, resetN);
  }

  /**
   * Master–slave D flip-flop: captures D while clock is low (master),
   * publishes it on the rising edge (slave). Edge-triggering emerges from
   * two level-sensitive latches on opposite clock phases.
   */
  dff(d: WireId, clock: WireId): { q: WireId; qn: WireId } {
    const master = this.dLatch(d, this.not(clock));
    return this.dLatch(master.q, clock);
  }

  build(
    id: string,
    name: string,
    outputs: Readonly<Record<string, WireId>>,
  ): Circuit {
    return {
      id,
      name,
      inputs: [...this.inputPorts],
      outputs: Object.entries(outputs).map(([label, wire]) => ({
        label,
        wire,
      })),
      gates: [...this.gates],
    };
  }
}
