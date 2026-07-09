/**
 * Protocol encapsulation: wrap an HTTP request one layer at a time
 * (HTTP → TCP → IP → Ethernet) and unwrap in reverse.
 *
 * Each step reveals one header being added or removed, so the UI can
 * animate the nested "header box" diagram.
 */

import type { Simulation, StepMeta } from "@nand2web/sim-core";

// ── Header types ───────────────────────────────────────────────────────────

export interface HttpHeader {
  readonly layer: "HTTP";
  readonly method: string;
  readonly host: string;
  readonly path: string;
}

export interface TcpHeader {
  readonly layer: "TCP";
  readonly srcPort: number;
  readonly dstPort: number;
  readonly seq: number;
  readonly ack: number;
  readonly flags: readonly string[];
}

export interface IpHeader {
  readonly layer: "IP";
  readonly srcAddr: string;
  readonly dstAddr: string;
  readonly ttl: number;
  readonly protocol: number; // 6 = TCP
}

export interface EthernetHeader {
  readonly layer: "Ethernet";
  readonly srcMac: string;
  readonly dstMac: string;
  readonly etherType: number; // 0x0800 = IPv4
}

export type LayerHeader = HttpHeader | TcpHeader | IpHeader | EthernetHeader;

// ── Request / Frame types ──────────────────────────────────────────────────

export interface HttpRequest {
  readonly method: string;
  readonly host: string;
  readonly path: string;
}

export interface EncapsulatedFrame {
  readonly ethernet: EthernetHeader;
  readonly ip: IpHeader;
  readonly tcp: TcpHeader;
  readonly http: HttpHeader;
}

// ── Step type ──────────────────────────────────────────────────────────────

export type EncapDirection = "wrap" | "unwrap";

export interface EncapStep extends StepMeta {
  readonly direction: EncapDirection;
  /** The header being added (wrap) or revealed (unwrap) in this step. */
  readonly activeLayer: LayerHeader["layer"];
  /** All headers assembled so far (outermost first). */
  readonly headersPresent: readonly LayerHeader["layer"][];
  readonly header: LayerHeader;
}

// ── Default addressing ─────────────────────────────────────────────────────

const DEFAULT_SRC_MAC = "aa:bb:cc:dd:ee:01";
const DEFAULT_DST_MAC = "aa:bb:cc:dd:ee:02";
const DEFAULT_SRC_IP = "192.168.1.10";
const DEFAULT_DST_IP = "93.184.216.34"; // example.com

// ── Wrap generator ─────────────────────────────────────────────────────────

/**
 * Wraps an HTTP request, yielding one step per layer added (HTTP → TCP → IP → Ethernet).
 * Returns the completed frame.
 */
export function* wrapRequest(
  req: HttpRequest,
  seq = 1000,
): Simulation<EncapStep, EncapsulatedFrame> {
  const http: HttpHeader = {
    layer: "HTTP",
    method: req.method,
    host: req.host,
    path: req.path,
  };
  yield {
    direction: "wrap",
    activeLayer: "HTTP",
    headersPresent: ["HTTP"],
    header: http,
    label: `HTTP ${req.method} ${req.path} Host: ${req.host}`,
    highlights: ["HTTP"],
  };

  const tcp: TcpHeader = {
    layer: "TCP",
    srcPort: 54321,
    dstPort: 80,
    seq,
    ack: 0,
    flags: ["PSH", "ACK"],
  };
  yield {
    direction: "wrap",
    activeLayer: "TCP",
    headersPresent: ["TCP", "HTTP"],
    header: tcp,
    label: `TCP segment: src=${tcp.srcPort} dst=${tcp.dstPort} seq=${seq}`,
    highlights: ["TCP"],
  };

  const ip: IpHeader = {
    layer: "IP",
    srcAddr: DEFAULT_SRC_IP,
    dstAddr: DEFAULT_DST_IP,
    ttl: 64,
    protocol: 6,
  };
  yield {
    direction: "wrap",
    activeLayer: "IP",
    headersPresent: ["IP", "TCP", "HTTP"],
    header: ip,
    label: `IP packet: ${ip.srcAddr} → ${ip.dstAddr} TTL=${ip.ttl}`,
    highlights: ["IP"],
  };

  const ethernet: EthernetHeader = {
    layer: "Ethernet",
    srcMac: DEFAULT_SRC_MAC,
    dstMac: DEFAULT_DST_MAC,
    etherType: 0x0800,
  };
  yield {
    direction: "wrap",
    activeLayer: "Ethernet",
    headersPresent: ["Ethernet", "IP", "TCP", "HTTP"],
    header: ethernet,
    label: `Ethernet frame: ${ethernet.srcMac} → ${ethernet.dstMac}`,
    highlights: ["Ethernet"],
  };

  return { ethernet, ip, tcp, http };
}

// ── Unwrap generator ───────────────────────────────────────────────────────

/**
 * Unwraps an Ethernet frame back to the HTTP payload, one layer at a time.
 * Returns the recovered HTTP request.
 */
export function* unwrapFrame(
  frame: EncapsulatedFrame,
): Simulation<EncapStep, HttpRequest> {
  yield {
    direction: "unwrap",
    activeLayer: "Ethernet",
    headersPresent: ["Ethernet", "IP", "TCP", "HTTP"],
    header: frame.ethernet,
    label: `Strip Ethernet: src=${frame.ethernet.srcMac} dst=${frame.ethernet.dstMac}`,
    highlights: ["Ethernet"],
  };

  yield {
    direction: "unwrap",
    activeLayer: "IP",
    headersPresent: ["IP", "TCP", "HTTP"],
    header: frame.ip,
    label: `Strip IP: ${frame.ip.srcAddr} → ${frame.ip.dstAddr}`,
    highlights: ["IP"],
  };

  yield {
    direction: "unwrap",
    activeLayer: "TCP",
    headersPresent: ["TCP", "HTTP"],
    header: frame.tcp,
    label: `Strip TCP: port ${frame.tcp.srcPort} → ${frame.tcp.dstPort}`,
    highlights: ["TCP"],
  };

  yield {
    direction: "unwrap",
    activeLayer: "HTTP",
    headersPresent: ["HTTP"],
    header: frame.http,
    label: `HTTP ${frame.http.method} ${frame.http.path}`,
    highlights: ["HTTP"],
  };

  return {
    method: frame.http.method,
    host: frame.http.host,
    path: frame.http.path,
  };
}
