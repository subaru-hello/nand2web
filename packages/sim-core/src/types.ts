/**
 * Shared simulation protocol.
 *
 * Every simulator in nand2web — a logic circuit, a CPU cycle, a TCP handshake,
 * a sorting pass — is a pure generator that yields steps. The UI never runs
 * domain logic; it replays step sequences through one playback engine.
 */

/** Fields every step may carry so generic UI (captions, highlights) can render it. */
export interface StepMeta {
  /** Short human-readable description of what happened in this step. */
  readonly label?: string;
  /** IDs of visual elements the UI should highlight while this step is current. */
  readonly highlights?: readonly string[];
}

/** A running simulation: yields steps, returns a final result. */
export type Simulation<TStep, TResult = void> = Generator<TStep, TResult, void>;

/** A pure function that starts a simulation from some input. */
export type SimulationFactory<TInput, TStep, TResult = void> = (
  input: TInput,
) => Simulation<TStep, TResult>;
