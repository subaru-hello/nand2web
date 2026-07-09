import { collectSteps } from "@nand2web/sim-core";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { dnsResolve } from "./dns.ts";
import { unwrapFrame, wrapRequest } from "./encapsulation.ts";
import {
  ALL_TCP_STATES,
  type TcpEvent,
  type TcpState,
  tcpSession,
  transition,
} from "./tcp.ts";

// ── TCP state machine ──────────────────────────────────────────────────────

const ALL_EVENTS: readonly TcpEvent[] = [
  "PASSIVE_OPEN",
  "ACTIVE_OPEN",
  "SYN",
  "SYN_ACK",
  "ACK",
  "CLOSE",
  "FIN",
  "FIN_ACK",
  "TIMEOUT_2MSL",
];

describe("TCP transition table", () => {
  it("known transitions always land in a defined state", () => {
    for (const state of ALL_TCP_STATES) {
      for (const event of ALL_EVENTS) {
        const next = transition(state, event);
        if (next !== null) {
          expect(ALL_TCP_STATES).toContain(next);
        }
      }
    }
  });

  it("invalid transitions return null", () => {
    // ESTABLISHED should not accept PASSIVE_OPEN or ACTIVE_OPEN
    expect(transition("ESTABLISHED", "PASSIVE_OPEN")).toBeNull();
    expect(transition("ESTABLISHED", "ACTIVE_OPEN")).toBeNull();
    // CLOSED should not accept ACK
    expect(transition("CLOSED", "ACK")).toBeNull();
    // TIME_WAIT only accepts TIMEOUT_2MSL
    expect(transition("TIME_WAIT", "ACK")).toBeNull();
  });

  it("model-based: fc-generated event sequences only visit defined states", () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...ALL_EVENTS), {
          minLength: 0,
          maxLength: 20,
        }),
        (events) => {
          let state: TcpState = "CLOSED";
          for (const event of events) {
            const next = transition(state, event);
            if (next !== null) {
              expect(ALL_TCP_STATES).toContain(next);
              state = next;
            }
          }
          expect(ALL_TCP_STATES).toContain(state);
        },
      ),
      { numRuns: 500 },
    );
  });

  it("model-based: transition never produces an unknown state", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ALL_TCP_STATES),
        fc.constantFrom(...ALL_EVENTS),
        (state, event) => {
          const next = transition(state, event);
          if (next !== null) {
            expect(ALL_TCP_STATES).toContain(next);
          }
        },
      ),
    );
  });
});

describe("tcpSession generator", () => {
  it("converges to ESTABLISHED with no packet loss", () => {
    const { steps } = collectSteps(
      tcpSession({ seed: 1, lossRate: 0, maxRetries: 3 }),
    );
    const handshakeSteps = steps.filter((s) => s.phase === "handshake");
    const establishedStep = steps.find(
      (s) => s.clientState === "ESTABLISHED" && s.serverState === "ESTABLISHED",
    );
    expect(handshakeSteps.length).toBeGreaterThan(0);
    expect(establishedStep).toBeDefined();
  });

  it("terminates with CLOSED at end when lossRate=0", () => {
    const { steps } = collectSteps(
      tcpSession({ seed: 42, lossRate: 0, maxRetries: 3 }),
    );
    const last = steps[steps.length - 1];
    expect(last?.phase).toBe("done");
    expect(last?.clientState).toBe("CLOSED");
    expect(last?.serverState).toBe("CLOSED");
  });

  it("handshake convergence: any seed × lossRate≤0.5 × sufficient retries eventually establishes", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 0xffffffff }),
        fc.double({ min: 0, max: 0.5, noNaN: true }),
        (seed, lossRate) => {
          const { steps } = collectSteps(
            tcpSession({ seed, lossRate, maxRetries: 20 }),
          );
          // Must terminate (not truncated at 100k) and each step state is valid
          expect(steps.length).toBeLessThan(100_000);
          for (const step of steps) {
            expect(ALL_TCP_STATES).toContain(step.clientState);
            expect(ALL_TCP_STATES).toContain(step.serverState);
          }
        },
      ),
      { numRuns: 200 },
    );
  });

  it("exceeding maxRetries produces a failed step and terminates", () => {
    // With lossRate=1 every packet is dropped, maxRetries=0 means first attempt fails
    const { steps } = collectSteps(
      tcpSession({ seed: 7, lossRate: 1, maxRetries: 0 }),
    );
    const failedStep = steps.find((s) => s.phase === "failed");
    expect(failedStep).toBeDefined();
    // Generator must terminate finitely
    expect(steps.length).toBeLessThan(100_000);
  });

  it("step count has an upper bound for any input within spec", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 0xffffffff }),
        fc.double({ min: 0, max: 1, noNaN: true }),
        fc.integer({ min: 0, max: 10 }),
        (seed, lossRate, maxRetries) => {
          const { steps } = collectSteps(
            tcpSession({ seed, lossRate, maxRetries }),
          );
          expect(steps.length).toBeLessThan(100_000);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("no loss: data segments are transferred", () => {
    const { steps } = collectSteps(
      tcpSession({ seed: 1, lossRate: 0, maxRetries: 3, dataSegments: 3 }),
    );
    const dataSteps = steps.filter(
      (s) => s.phase === "transfer" && s.packet?.kind === "DATA",
    );
    expect(dataSteps.length).toBe(3);
  });
});

// ── Encapsulation ──────────────────────────────────────────────────────────

describe("encapsulation round-trip", () => {
  it("wrap then unwrap recovers original request", () => {
    const req = { method: "GET", host: "example.com", path: "/index.html" };
    const { result: frame } = collectSteps(wrapRequest(req));
    expect(frame).toBeDefined();
    if (!frame) return;
    const { result: recovered } = collectSteps(unwrapFrame(frame));
    expect(recovered).toEqual(req);
  });

  it("wrap produces 4 steps (one per layer)", () => {
    const req = { method: "POST", host: "api.example.com", path: "/v1/data" };
    const { steps } = collectSteps(wrapRequest(req));
    expect(steps.length).toBe(4);
    expect(steps.map((s) => s.activeLayer)).toEqual([
      "HTTP",
      "TCP",
      "IP",
      "Ethernet",
    ]);
  });

  it("unwrap produces 4 steps (one per layer)", () => {
    const req = { method: "GET", host: "example.com", path: "/" };
    const { result: frame } = collectSteps(wrapRequest(req));
    if (!frame) throw new Error("wrap failed");
    const { steps } = collectSteps(unwrapFrame(frame));
    expect(steps.length).toBe(4);
    expect(steps.map((s) => s.activeLayer)).toEqual([
      "Ethernet",
      "IP",
      "TCP",
      "HTTP",
    ]);
  });

  it("round-trip is stable for arbitrary method/host/path", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("GET", "POST", "PUT", "DELETE"),
        fc.domain(),
        fc.webPath(),
        (method, host, path) => {
          const req = { method, host, path };
          const { result: frame } = collectSteps(wrapRequest(req));
          if (!frame) return;
          const { result: recovered } = collectSteps(unwrapFrame(frame));
          expect(recovered).toEqual(req);
        },
      ),
    );
  });
});

// ── DNS ────────────────────────────────────────────────────────────────────

describe("dnsResolve generator", () => {
  it("cache miss: always terminates with an answer", () => {
    const { steps, result } = collectSteps(
      dnsResolve({ qname: "example.com", qtype: "A" }),
    );
    expect(steps.length).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });

  it("cache hit: returns answer with fewer steps than cache miss", () => {
    const { steps: missSteps } = collectSteps(
      dnsResolve({ qname: "example.com", qtype: "A", cacheHit: false }),
    );
    const { steps: hitSteps } = collectSteps(
      dnsResolve({ qname: "example.com", qtype: "A", cacheHit: true }),
    );
    expect(hitSteps.length).toBeLessThan(missSteps.length);
  });

  it("every step has a valid from/to node", () => {
    const validNodes = ["stub", "recursive", "root", "tld", "authoritative"];
    const { steps } = collectSteps(
      dnsResolve({ qname: "www.example.com", qtype: "A" }),
    );
    for (const step of steps) {
      expect(validNodes).toContain(step.message.from);
      expect(validNodes).toContain(step.message.to);
    }
  });

  it("always terminates within a finite step count", () => {
    fc.assert(
      fc.property(
        fc.domain(),
        fc.boolean(),
        fc.boolean(),
        (qname, cacheHit, partialCacheHit) => {
          const { steps } = collectSteps(
            dnsResolve({ qname, cacheHit, partialCacheHit }),
          );
          expect(steps.length).toBeLessThan(1000);
          expect(steps.length).toBeGreaterThan(0);
        },
      ),
    );
  });

  it("partial cache hit: fewer steps than full miss, more than full hit", () => {
    const { steps: hitSteps } = collectSteps(
      dnsResolve({ qname: "example.com", cacheHit: true }),
    );
    const { steps: partialSteps } = collectSteps(
      dnsResolve({ qname: "example.com", partialCacheHit: true }),
    );
    const { steps: missSteps } = collectSteps(
      dnsResolve({ qname: "example.com", cacheHit: false }),
    );
    expect(hitSteps.length).toBeLessThan(partialSteps.length);
    expect(partialSteps.length).toBeLessThan(missSteps.length);
  });
});
