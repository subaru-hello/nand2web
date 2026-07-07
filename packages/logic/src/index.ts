export { CircuitBuilder } from "./builder.ts";
export {
  buildAdder4,
  buildAlu4,
  buildAnd,
  buildDff,
  buildDLatch,
  buildFullAdder,
  buildHalfAdder,
  buildMux,
  buildNand,
  buildNot,
  buildOr,
  buildRegister4,
  buildSrLatch,
  buildXor,
} from "./circuits.ts";
export {
  bitsToNumber,
  evaluate,
  numberToBits,
  readOutputs,
  simulate,
} from "./simulate.ts";
export {
  type Bit,
  type Circuit,
  type CircuitPort,
  type NandGate,
  nand,
  type SignalStep,
  type WireId,
  type WireState,
} from "./types.ts";
