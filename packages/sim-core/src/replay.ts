import type { Simulation } from "./types.ts";

export interface CollectedSimulation<TStep, TResult> {
  readonly steps: readonly TStep[];
  /** Final generator return value; undefined when the step limit was hit. */
  readonly result: TResult | undefined;
  /** True when the simulation was cut off at `limit` steps. */
  readonly truncated: boolean;
}

/**
 * Eagerly run a simulation to completion, capturing every step.
 *
 * Step sequences are small enough to precompute (even O(n²) sorts on a few
 * hundred elements), which is what makes scrubbing/seeking trivial in the UI.
 * `limit` guards against accidentally unbounded simulations (e.g. a CPU
 * program that never halts).
 */
export function collectSteps<TStep, TResult>(
  sim: Simulation<TStep, TResult>,
  limit = 100_000,
): CollectedSimulation<TStep, TResult> {
  const steps: TStep[] = [];
  let next = sim.next();
  while (!next.done) {
    if (steps.length >= limit) {
      return { steps, result: undefined, truncated: true };
    }
    steps.push(next.value);
    next = sim.next();
  }
  return { steps, result: next.value, truncated: false };
}

/**
 * Derive an aggregate (operation counters, tallies…) from a step sequence.
 * Simulators never count internally; metrics are always a fold over steps.
 */
export function foldSteps<TStep, TAcc>(
  steps: readonly TStep[],
  reducer: (acc: TAcc, step: TStep, index: number) => TAcc,
  initial: TAcc,
): TAcc {
  let acc = initial;
  for (let i = 0; i < steps.length; i++) {
    acc = reducer(acc, steps[i] as TStep, i);
  }
  return acc;
}
