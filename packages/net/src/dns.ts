/**
 * DNS resolution journey simulation.
 *
 * Models the iterative resolution path from stub resolver through
 * recursive resolver → root → TLD → authoritative, with optional
 * cache-hit shortcut.
 */

import type { Simulation, StepMeta } from "@nand2web/sim-core";

// ── Node types ─────────────────────────────────────────────────────────────

export type DnsNode = "stub" | "recursive" | "root" | "tld" | "authoritative";

// ── Message types ──────────────────────────────────────────────────────────

export type DnsQtype = "A" | "AAAA" | "MX" | "CNAME";

export interface DnsQuery {
  readonly kind: "query";
  readonly qname: string;
  readonly qtype: DnsQtype;
  readonly from: DnsNode;
  readonly to: DnsNode;
}

export interface DnsResponse {
  readonly kind: "response";
  readonly qname: string;
  readonly qtype: DnsQtype;
  readonly answer: string;
  readonly ttl: number;
  readonly from: DnsNode;
  readonly to: DnsNode;
  /** True when this response was served from cache. */
  readonly fromCache: boolean;
}

export type DnsMessage = DnsQuery | DnsResponse;

// ── Step type ──────────────────────────────────────────────────────────────

export interface DnsStep extends StepMeta {
  readonly message: DnsMessage;
  /** All nodes that have seen the query so far. */
  readonly visited: readonly DnsNode[];
}

// ── Config ─────────────────────────────────────────────────────────────────

export interface DnsConfig {
  readonly qname: string;
  readonly qtype?: DnsQtype;
  /** When true, the recursive resolver has the answer cached. */
  readonly cacheHit?: boolean;
  /** When true, only the TLD→authoritative lookup is cached (partial). */
  readonly partialCacheHit?: boolean;
}

// ── Synthetic DNS data ─────────────────────────────────────────────────────

function fakeAnswer(qname: string, qtype: DnsQtype): string {
  if (qtype === "A") {
    // Stable fake IP derived from name length for reproducibility
    const n = qname.length % 200;
    return `93.184.${n}.34`;
  }
  if (qtype === "MX") return `mail.${qname}`;
  if (qtype === "CNAME") return `www.${qname}`;
  return `::1`;
}

function rootReferral(qname: string): string {
  const parts = qname.split(".");
  const tld = parts[parts.length - 1] ?? "com";
  return `${tld}.root-servers.net`;
}

function tldReferral(qname: string): string {
  const parts = qname.split(".");
  // e.g. "example.com" → "ns1.example.com"
  const sld = parts.slice(-2).join(".");
  return `ns1.${sld}`;
}

// ── Generator ─────────────────────────────────────────────────────────────

/**
 * Simulates a full DNS resolution journey, yielding one step per
 * query/response message exchanged between resolvers.
 */
export function* dnsResolve(config: DnsConfig): Simulation<DnsStep, string> {
  const { qname } = config;
  const qtype: DnsQtype = config.qtype ?? "A";
  const visited: DnsNode[] = ["stub"];

  function step(message: DnsMessage, extraVisited?: DnsNode): DnsStep {
    if (extraVisited && !visited.includes(extraVisited)) {
      visited.push(extraVisited);
    }
    return {
      message,
      visited: [...visited],
      label:
        message.kind === "query"
          ? `Query: ${message.from} → ${message.to} ${message.qname} ${message.qtype}`
          : `Response: ${message.from} → ${message.to} ${message.answer}${message.fromCache ? " (cached)" : ""}`,
      highlights: [message.from, message.to],
    };
  }

  // Stub → Recursive
  yield step(
    {
      kind: "query",
      qname,
      qtype,
      from: "stub",
      to: "recursive",
    },
    "recursive",
  );

  // Fast path: recursive resolver has the full answer cached
  if (config.cacheHit) {
    const answer = fakeAnswer(qname, qtype);
    yield step({
      kind: "response",
      qname,
      qtype,
      answer,
      ttl: 300,
      from: "recursive",
      to: "stub",
      fromCache: true,
    });
    return answer;
  }

  // Recursive → Root (unless partial cache hit skips this)
  if (!config.partialCacheHit) {
    yield step(
      {
        kind: "query",
        qname,
        qtype,
        from: "recursive",
        to: "root",
      },
      "root",
    );

    // Root → Recursive (referral to TLD)
    yield step({
      kind: "response",
      qname,
      qtype,
      answer: rootReferral(qname),
      ttl: 172800,
      from: "root",
      to: "recursive",
      fromCache: false,
    });
  }

  // Recursive → TLD
  yield step(
    {
      kind: "query",
      qname,
      qtype,
      from: "recursive",
      to: "tld",
    },
    "tld",
  );

  // TLD → Recursive (referral to authoritative)
  yield step({
    kind: "response",
    qname,
    qtype,
    answer: tldReferral(qname),
    ttl: 172800,
    from: "tld",
    to: "recursive",
    fromCache: false,
  });

  // Recursive → Authoritative
  yield step(
    {
      kind: "query",
      qname,
      qtype,
      from: "recursive",
      to: "authoritative",
    },
    "authoritative",
  );

  // Authoritative → Recursive (final answer)
  const answer = fakeAnswer(qname, qtype);
  yield step({
    kind: "response",
    qname,
    qtype,
    answer,
    ttl: 3600,
    from: "authoritative",
    to: "recursive",
    fromCache: false,
  });

  // Recursive → Stub (final answer)
  yield step({
    kind: "response",
    qname,
    qtype,
    answer,
    ttl: 3600,
    from: "recursive",
    to: "stub",
    fromCache: false,
  });

  return answer;
}
