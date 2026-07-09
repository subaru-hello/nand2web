/**
 * TCP state machine and session simulation.
 *
 * The state machine is encoded as an explicit transition table so it is
 * trivially testable with model-based property tests: every event × state
 * pair either names a target state or returns null (invalid transition).
 */

import type { Simulation, StepMeta } from "@nand2web/sim-core";
import { createRng } from "@nand2web/sim-core";

// ── State & event types ────────────────────────────────────────────────────

export type TcpState =
  | "CLOSED"
  | "LISTEN"
  | "SYN_SENT"
  | "SYN_RCVD"
  | "ESTABLISHED"
  | "FIN_WAIT_1"
  | "FIN_WAIT_2"
  | "CLOSE_WAIT"
  | "CLOSING"
  | "LAST_ACK"
  | "TIME_WAIT";

export type TcpEvent =
  | "PASSIVE_OPEN"
  | "ACTIVE_OPEN"
  | "SYN"
  | "SYN_ACK"
  | "ACK"
  | "CLOSE"
  | "FIN"
  | "FIN_ACK"
  | "TIMEOUT_2MSL";

/** All eleven RFC 793 states. */
export const ALL_TCP_STATES: readonly TcpState[] = [
  "CLOSED",
  "LISTEN",
  "SYN_SENT",
  "SYN_RCVD",
  "ESTABLISHED",
  "FIN_WAIT_1",
  "FIN_WAIT_2",
  "CLOSE_WAIT",
  "CLOSING",
  "LAST_ACK",
  "TIME_WAIT",
];

// ── Transition table ───────────────────────────────────────────────────────

type TransitionTable = Partial<
  Record<TcpState, Partial<Record<TcpEvent, TcpState>>>
>;

const TABLE: TransitionTable = {
  CLOSED: {
    PASSIVE_OPEN: "LISTEN",
    ACTIVE_OPEN: "SYN_SENT",
  },
  LISTEN: {
    SYN: "SYN_RCVD",
    ACTIVE_OPEN: "SYN_SENT",
  },
  SYN_SENT: {
    SYN_ACK: "ESTABLISHED",
    SYN: "SYN_RCVD", // simultaneous open
    CLOSE: "CLOSED",
  },
  SYN_RCVD: {
    ACK: "ESTABLISHED",
    CLOSE: "FIN_WAIT_1",
  },
  ESTABLISHED: {
    CLOSE: "FIN_WAIT_1",
    FIN: "CLOSE_WAIT",
  },
  FIN_WAIT_1: {
    ACK: "FIN_WAIT_2",
    FIN: "CLOSING",
    FIN_ACK: "TIME_WAIT",
  },
  FIN_WAIT_2: {
    FIN: "TIME_WAIT",
  },
  CLOSE_WAIT: {
    CLOSE: "LAST_ACK",
  },
  CLOSING: {
    ACK: "TIME_WAIT",
  },
  LAST_ACK: {
    ACK: "CLOSED",
  },
  TIME_WAIT: {
    TIMEOUT_2MSL: "CLOSED",
  },
};

/**
 * Look up the next state given a current state and event.
 * Returns null for invalid (undefined) transitions.
 */
export function transition(state: TcpState, event: TcpEvent): TcpState | null {
  return TABLE[state]?.[event] ?? null;
}

// ── Packet types ───────────────────────────────────────────────────────────

export type PacketKind = "SYN" | "SYN-ACK" | "ACK" | "DATA" | "FIN" | "FIN-ACK";

export interface TcpPacket {
  readonly kind: PacketKind;
  readonly seq: number;
  readonly ack: number;
  /** undefined for control packets */
  readonly payload?: string;
}

// ── Step type ──────────────────────────────────────────────────────────────

export type TcpPhase =
  | "handshake"
  | "transfer"
  | "teardown"
  | "drop"
  | "timeout"
  | "retransmit"
  | "failed"
  | "done";

export interface TcpStep extends StepMeta {
  readonly phase: TcpPhase;
  readonly clientState: TcpState;
  readonly serverState: TcpState;
  /** The packet in flight this step (absent for timeout/failed steps). */
  readonly packet?: TcpPacket;
  /** Direction of the packet. Present only when packet is defined. */
  readonly direction?: "c2s" | "s2c";
  /** True when the packet was dropped by the network. */
  readonly dropped: boolean;
  /** True when this is a retransmission. */
  readonly retransmit: boolean;
}

// ── Session config ─────────────────────────────────────────────────────────

export interface TcpSessionConfig {
  readonly seed: number;
  /** Probability [0, 1] that any given packet is lost. */
  readonly lossRate: number;
  readonly maxRetries: number;
  /** Optional data segments to send after handshake (default: 2). */
  readonly dataSegments?: number;
}

// ── Generator ─────────────────────────────────────────────────────────────

/**
 * Simulates a full TCP session: 3-way handshake → data transfer → 4-way teardown.
 * Packet loss is injected via seeded PRNG, with timeout + retransmit steps.
 */
export function* tcpSession(config: TcpSessionConfig): Simulation<TcpStep> {
  const rng = createRng(config.seed);
  const { lossRate, maxRetries } = config;
  const dataSegments = config.dataSegments ?? 2;

  let clientState: TcpState = "CLOSED";
  let serverState: TcpState = "CLOSED";
  let clientSeq = 100;
  let serverSeq = 200;

  const shouldDrop = (): boolean => rng() < lossRate;

  function makeStep(
    phase: TcpPhase,
    packet: TcpPacket | undefined,
    dropped: boolean,
    retransmit: boolean,
    label: string,
    direction?: "c2s" | "s2c",
  ): TcpStep {
    const base = {
      phase,
      clientState,
      serverState,
      dropped,
      retransmit,
      label,
    } as const;
    if (packet !== undefined) {
      return {
        ...base,
        packet,
        highlights: [packet.kind],
        ...(direction !== undefined ? { direction } : {}),
      };
    }
    return base;
  }

  function applyTransition(state: TcpState, event: TcpEvent): TcpState {
    const next = transition(state, event);
    if (next === null) {
      throw new Error(`Invalid TCP transition: ${state} + ${event}`);
    }
    return next;
  }

  // Helper: send a packet with retry logic.
  // Returns false if all retries are exhausted.
  function* sendWithRetry(
    phase: TcpPhase,
    packet: TcpPacket,
    direction: "c2s" | "s2c",
    onDelivered: () => void,
  ): Generator<TcpStep, boolean, void> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const isRetransmit = attempt > 0;
      const dropped = shouldDrop();
      if (dropped) {
        yield makeStep(
          phase,
          packet,
          true,
          isRetransmit,
          `${isRetransmit ? "Retransmit " : ""}${packet.kind} dropped`,
          direction,
        );
        yield makeStep(
          "timeout",
          undefined,
          false,
          false,
          `Timeout waiting for ACK — retry ${attempt + 1}/${maxRetries}`,
        );
      } else {
        yield makeStep(
          phase,
          packet,
          false,
          isRetransmit,
          `${isRetransmit ? "Retransmit " : ""}${packet.kind} seq=${packet.seq}`,
          direction,
        );
        onDelivered();
        return true;
      }
    }
    return false;
  }

  // ── 3-way handshake ──────────────────────────────────────────────────────

  // Client: CLOSED → SYN_SENT
  clientState = applyTransition(clientState, "ACTIVE_OPEN");
  serverState = applyTransition(serverState, "PASSIVE_OPEN");

  const synPacket: TcpPacket = { kind: "SYN", seq: clientSeq, ack: 0 };
  let ok = yield* sendWithRetry("handshake", synPacket, "c2s", () => {
    serverState = applyTransition(serverState, "SYN");
  });
  if (!ok) {
    yield makeStep(
      "failed",
      undefined,
      false,
      false,
      "Handshake failed — SYN exhausted retries",
    );
    return;
  }

  // Server → SYN-ACK
  const synAckPacket: TcpPacket = {
    kind: "SYN-ACK",
    seq: serverSeq,
    ack: clientSeq + 1,
  };
  ok = yield* sendWithRetry("handshake", synAckPacket, "s2c", () => {
    clientState = applyTransition(clientState, "SYN_ACK");
    serverSeq++;
    clientSeq++;
  });
  if (!ok) {
    yield makeStep(
      "failed",
      undefined,
      false,
      false,
      "Handshake failed — SYN-ACK exhausted retries",
    );
    return;
  }

  // Client → ACK
  const ackPacket: TcpPacket = {
    kind: "ACK",
    seq: clientSeq,
    ack: serverSeq,
  };
  ok = yield* sendWithRetry("handshake", ackPacket, "c2s", () => {
    serverState = applyTransition(serverState, "ACK");
  });
  if (!ok) {
    yield makeStep(
      "failed",
      undefined,
      false,
      false,
      "Handshake failed — final ACK exhausted retries",
    );
    return;
  }

  // ── Data transfer ────────────────────────────────────────────────────────

  for (let i = 0; i < dataSegments; i++) {
    const dataPacket: TcpPacket = {
      kind: "DATA",
      seq: clientSeq,
      ack: serverSeq,
      payload: `segment ${i + 1}`,
    };
    ok = yield* sendWithRetry("transfer", dataPacket, "c2s", () => {
      clientSeq += 10;
    });
    if (!ok) {
      yield makeStep(
        "failed",
        undefined,
        false,
        false,
        `Transfer failed — DATA segment ${i + 1} exhausted retries`,
      );
      return;
    }

    // Server ACKs the data
    const dataAck: TcpPacket = {
      kind: "ACK",
      seq: serverSeq,
      ack: clientSeq,
    };
    yield makeStep(
      "transfer",
      dataAck,
      false,
      false,
      `Server ACK seq=${dataAck.seq} ack=${dataAck.ack}`,
      "s2c",
    );
  }

  // ── 4-way teardown ───────────────────────────────────────────────────────

  // Client → FIN
  clientState = applyTransition(clientState, "CLOSE");
  const finPacket: TcpPacket = { kind: "FIN", seq: clientSeq, ack: serverSeq };
  ok = yield* sendWithRetry("teardown", finPacket, "c2s", () => {
    serverState = applyTransition(serverState, "FIN");
  });
  if (!ok) {
    yield makeStep(
      "failed",
      undefined,
      false,
      false,
      "Teardown failed — FIN exhausted retries",
    );
    return;
  }

  // Server → ACK(FIN)
  const finAckFromServer: TcpPacket = {
    kind: "ACK",
    seq: serverSeq,
    ack: clientSeq + 1,
  };
  clientState = applyTransition(clientState, "ACK");
  yield makeStep(
    "teardown",
    finAckFromServer,
    false,
    false,
    `Server ACK of FIN seq=${finAckFromServer.seq}`,
    "s2c",
  );
  clientSeq++;

  // Server → FIN
  serverState = applyTransition(serverState, "CLOSE");
  const serverFinPacket: TcpPacket = {
    kind: "FIN",
    seq: serverSeq,
    ack: clientSeq,
  };
  ok = yield* sendWithRetry("teardown", serverFinPacket, "s2c", () => {
    clientState = applyTransition(clientState, "FIN");
  });
  if (!ok) {
    yield makeStep(
      "failed",
      undefined,
      false,
      false,
      "Teardown failed — server FIN exhausted retries",
    );
    return;
  }

  // Client → final ACK
  const finalAck: TcpPacket = {
    kind: "ACK",
    seq: clientSeq,
    ack: serverSeq + 1,
  };
  yield makeStep(
    "teardown",
    finalAck,
    false,
    false,
    `Client final ACK seq=${finalAck.seq}`,
    "c2s",
  );
  serverState = applyTransition(serverState, "ACK");

  // TIME_WAIT → CLOSED
  yield makeStep(
    "done",
    undefined,
    false,
    false,
    "TIME_WAIT: 2MSL timer — connection fully closed",
  );
  clientState = applyTransition(clientState, "TIMEOUT_2MSL");

  yield makeStep("done", undefined, false, false, "Connection closed");
}
