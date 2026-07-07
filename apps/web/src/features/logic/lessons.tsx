import {
  buildAdder4,
  buildAlu4,
  buildAnd,
  buildDff,
  buildDLatch,
  buildFullAdder,
  buildHalfAdder,
  buildNand,
  buildNot,
  buildOr,
  buildRegister4,
  buildSrLatch,
  buildXor,
} from "@nand2web/logic";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { CircuitPlayground } from "./CircuitPlayground";
import { TruthTableChallenge } from "./TruthTableChallenge";

export interface Lesson {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly Content: () => ReactNode;
}

function P({ children }: { children: ReactNode }) {
  return (
    <p className="my-4 max-w-3xl leading-relaxed text-zinc-300">{children}</p>
  );
}

function Term({ children }: { children: ReactNode }) {
  return <span className="font-medium text-zinc-100">{children}</span>;
}

export const lessons: readonly Lesson[] = [
  {
    id: "nand",
    title: "The universal gate",
    summary:
      "One gate is enough. NAND outputs 0 only when both inputs are 1 — and every other circuit on this site is built from it.",
    Content: () => {
      const nandC = useMemo(buildNand, []);
      return (
        <>
          <P>
            A <Term>NAND</Term> gate ("not and") outputs 0 only when both of its
            inputs are 1. That one behavior is enough to build{" "}
            <em>everything</em>: NOT, AND, OR, adders, memory, a CPU. This
            property is called <Term>functional completeness</Term>, and it's
            why real chips were historically built from NAND — one gate to
            manufacture, infinitely composable.
          </P>
          <P>
            Toggle the inputs and watch the output. Then fill in the truth table
            from memory.
          </P>
          <CircuitPlayground circuit={nandC} caption="A single NAND gate." />
          <TruthTableChallenge circuit={nandC} lessonId="nand" />
        </>
      );
    },
  },
  {
    id: "not-and-or",
    title: "NOT, AND, OR from NAND",
    summary:
      "Wire a NAND's inputs together and you get NOT. Invert a NAND and you get AND. Feed it inverted inputs and you get OR.",
    Content: () => {
      const notC = useMemo(buildNot, []);
      const andC = useMemo(buildAnd, []);
      const orC = useMemo(buildOr, []);
      return (
        <>
          <P>
            Tie both NAND inputs to the same signal and it becomes a{" "}
            <Term>NOT</Term> gate: NAND(a, a) = NOT a.
          </P>
          <CircuitPlayground circuit={notC} caption="NOT = one NAND." />
          <P>
            <Term>AND</Term> is just NAND followed by NOT — un-invert the
            inversion:
          </P>
          <CircuitPlayground
            circuit={andC}
            caption="AND = NAND → NOT (2 NANDs)."
          />
          <P>
            <Term>OR</Term> follows from De Morgan's law: a OR b = NOT(NOT a AND
            NOT b). Invert each input, then NAND them:
          </P>
          <CircuitPlayground
            circuit={orC}
            caption="OR via De Morgan (3 NANDs)."
          />
          <TruthTableChallenge circuit={orC} lessonId="not-and-or" />
        </>
      );
    },
  },
  {
    id: "xor",
    title: "XOR — the difference detector",
    summary:
      "Exclusive-or outputs 1 when its inputs differ. Four NANDs, and it's the heart of binary addition.",
    Content: () => {
      const xorC = useMemo(buildXor, []);
      return (
        <>
          <P>
            <Term>XOR</Term> outputs 1 exactly when its inputs differ. Notice
            what that means for one-bit addition: 0+1 and 1+0 give 1, while 1+1
            gives 0 (carry the one) — XOR <em>is</em> the sum bit. The elegant
            4-NAND construction below shares its first gate between both
            branches.
          </P>
          <CircuitPlayground circuit={xorC} caption="XOR from 4 NANDs." />
          <TruthTableChallenge circuit={xorC} lessonId="xor" />
        </>
      );
    },
  },
  {
    id: "adder",
    title: "From gates to arithmetic",
    summary:
      "A half adder is XOR + AND. Chain full adders and the carry ripples: suddenly your gates can count.",
    Content: () => {
      const half = useMemo(buildHalfAdder, []);
      const full = useMemo(buildFullAdder, []);
      const adder = useMemo(buildAdder4, []);
      return (
        <>
          <P>
            Adding two bits produces a <Term>sum</Term> (XOR) and a{" "}
            <Term>carry</Term> (AND). That pair of gates is a{" "}
            <Term>half adder</Term>:
          </P>
          <CircuitPlayground
            circuit={half}
            caption="Half adder: sum = a XOR b, carry = a AND b."
          />
          <P>
            To chain additions you must also accept an incoming carry — three
            one-bit inputs. That's a <Term>full adder</Term>. Fill in its truth
            table (hint: count the 1s among a, b, cin):
          </P>
          <CircuitPlayground circuit={full} caption="Full adder." />
          <TruthTableChallenge circuit={full} lessonId="adder" />
          <P>
            Now chain four full adders, each one's carry feeding the next: a{" "}
            <Term>4-bit ripple-carry adder</Term>. Set A and B below and watch
            the carry ripple left through the chain — that propagation delay is
            exactly why real CPUs use cleverer adders.
          </P>
          <CircuitPlayground
            circuit={adder}
            buses={[
              { name: "A", labels: ["a0", "a1", "a2", "a3"] },
              { name: "B", labels: ["b0", "b1", "b2", "b3"] },
            ]}
            caption="4-bit ripple-carry adder. sum reads LSB-first (sum0 = 1s place)."
          />
        </>
      );
    },
  },
  {
    id: "latch",
    title: "Memory from feedback",
    summary:
      "Cross-couple two NANDs and the circuit remembers. The SR latch is one bit of storage — no clock required.",
    Content: () => {
      const sr = useMemo(buildSrLatch, []);
      const dLatch = useMemo(buildDLatch, []);
      return (
        <>
          <P>
            Every circuit so far forgets its inputs the moment they change. Feed
            a gate's output <em>back into itself</em>, though, and the loop can
            hold a value. The <Term>SR latch</Term> is two cross-coupled NANDs:
            pulse <code className="text-sky-300">set_n</code> low and q latches
            1; pulse <code className="text-sky-300">reset_n</code> low and q
            latches 0; with both high, it <em>holds</em>. Try it — set, release,
            reset, release.
          </P>
          <CircuitPlayground
            circuit={sr}
            caption="SR latch (inputs are active-low: 0 = pressed). Note the feedback wires running right-to-left."
          />
          <P>
            Latches with separate set/reset inputs are awkward. A{" "}
            <Term>D latch</Term> stores the value of a single data input while{" "}
            <code className="text-sky-300">enable</code> is 1, and ignores it
            while enable is 0:
          </P>
          <CircuitPlayground
            circuit={dLatch}
            caption="Gated D latch: transparent while enable=1, frozen while enable=0."
          />
        </>
      );
    },
  },
  {
    id: "dff",
    title: "The clock edge",
    summary:
      "Two latches on opposite clock phases make a flip-flop: state changes only at the instant the clock rises.",
    Content: () => {
      const dff = useMemo(buildDff, []);
      const reg = useMemo(buildRegister4, []);
      return (
        <>
          <P>
            A transparent latch is dangerous in a CPU — while enable is high,
            changes race straight through. The fix is the{" "}
            <Term>master–slave D flip-flop</Term>: one latch captures D while
            the clock is <em>low</em>, a second publishes it when the clock goes{" "}
            <em>high</em>. The result: state changes only at the{" "}
            <Term>rising edge</Term>. This is why every synchronous circuit has
            a clock.
          </P>
          <P>
            Try it: set d=1, then toggle clock 0→1 and watch q capture the
            value. Change d while the clock is high — q doesn't budge until the
            next rising edge.
          </P>
          <CircuitPlayground
            circuit={dff}
            caption="D flip-flop from two D latches on opposite clock phases."
          />
          <P>
            Four flip-flops sharing one clock make a <Term>4-bit register</Term>{" "}
            — the same component your CPU will use to hold values between
            instructions:
          </P>
          <CircuitPlayground
            circuit={reg}
            buses={[{ name: "D", labels: ["d0", "d1", "d2", "d3"] }]}
            caption="4-bit register: set D, pulse the clock, and the value is stored."
          />
        </>
      );
    },
  },
  {
    id: "alu",
    title: "The ALU — computation, assembled",
    summary:
      "Adder + logic gates + multiplexers = an arithmetic logic unit. Pick an operation with 2 bits; this is the core of a CPU.",
    Content: () => {
      const alu = useMemo(buildAlu4, []);
      return (
        <>
          <P>
            An <Term>ALU</Term> (arithmetic logic unit) computes several
            operations <em>simultaneously</em> and uses multiplexers to select
            which result reaches the output. Ours supports four, selected by
            (op1, op0): <code className="text-sky-300">00 ADD</code>,{" "}
            <code className="text-sky-300">01 SUB</code>,{" "}
            <code className="text-sky-300">10 AND</code>,{" "}
            <code className="text-sky-300">11 OR</code>.
          </P>
          <P>
            Subtraction costs almost nothing: A − B = A + NOT(B) + 1 in two's
            complement, so SUB just XORs B with 1 and injects a carry-in. Watch
            the gate count — this whole unit is <em>only NAND gates</em>, about
            a hundred of them.
          </P>
          <CircuitPlayground
            circuit={alu}
            buses={[
              { name: "A", labels: ["a0", "a1", "a2", "a3"] },
              { name: "B", labels: ["b0", "b1", "b2", "b3"] },
            ]}
            caption="4-bit ALU. Try 0110 − 0011 (6 − 3): set A=6, B=3, op=01."
          />
          <P>
            That's the hardware layer: from a single NAND gate to a unit that
            computes. Next layer up, we wire an ALU and registers into a machine
            that follows instructions — a CPU.
          </P>
        </>
      );
    },
  },
];

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}
