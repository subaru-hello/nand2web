export interface SrsCard {
  readonly id: string;
  readonly ease: number; // ease factor, >= 1.3
  readonly intervalDays: number; // current interval in days
  readonly reps: number; // consecutive successful reviews
  readonly lapses: number; // count of failures
  readonly due: number; // epoch ms when next due
}

export type Grade = 0 | 1 | 2 | 3 | 4 | 5; // 0..2 = fail, 3..5 = pass

const DAY_MS = 86_400_000;
const MIN_EASE = 1.3;

/** Create a new card that is due immediately. */
export function newCard(id: string, now: number): SrsCard {
  return {
    id,
    ease: 2.5,
    intervalDays: 0,
    reps: 0,
    lapses: 0,
    due: now,
  };
}

/**
 * Apply an SM-2 review to a card.
 *
 * Ease update (both pass and fail paths, SM-2 canonical):
 *   ease' = ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
 *   then clamped to a minimum of 1.3.
 *
 * Fail (grade < 3): reps → 0, intervalDays → 1, lapses+1, due → now + 1 day.
 * Pass (grade >= 3): reps+1; intervalDays:
 *   reps was 0 → 1, reps was 1 → 6, else round(prev * ease).
 *   due → now + intervalDays days.
 */
export function review(card: SrsCard, grade: Grade, now: number): SrsCard {
  const newEase = Math.max(
    MIN_EASE,
    card.ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)),
  );

  if (grade < 3) {
    return {
      ...card,
      ease: newEase,
      intervalDays: 1,
      reps: 0,
      lapses: card.lapses + 1,
      due: now + DAY_MS,
    };
  }

  // pass
  let newInterval: number;
  if (card.reps === 0) {
    newInterval = 1;
  } else if (card.reps === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(card.intervalDays * card.ease);
  }

  return {
    ...card,
    ease: newEase,
    intervalDays: newInterval,
    reps: card.reps + 1,
    due: now + newInterval * DAY_MS,
  };
}
