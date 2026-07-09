import fc from "fast-check";
import { describe, expect, it } from "vitest";
import type { Grade, SrsCard } from "./srs.ts";
import { newCard, review } from "./srs.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const NOW = 1_700_000_000_000; // arbitrary fixed epoch ms
const DAY_MS = 86_400_000;

const gradeArb = fc.integer({ min: 0, max: 5 }) as fc.Arbitrary<Grade>;

/** Apply a sequence of reviews to a freshly-created card and return the final card. */
function applyGrades(grades: readonly Grade[]): SrsCard {
  let card = newCard("test", NOW);
  let t = NOW;
  for (const g of grades) {
    t += DAY_MS; // advance time so due check is always in the future
    card = review(card, g, t);
  }
  return card;
}

// ---------------------------------------------------------------------------
// Deterministic unit tests
// ---------------------------------------------------------------------------

describe("newCard", () => {
  it("starts with ease 2.5, interval 0, reps 0, lapses 0, due = now", () => {
    const card = newCard("x", NOW);
    expect(card.ease).toBe(2.5);
    expect(card.intervalDays).toBe(0);
    expect(card.reps).toBe(0);
    expect(card.lapses).toBe(0);
    expect(card.due).toBe(NOW);
  });
});

describe("review — deterministic", () => {
  it("first pass sets interval to 1", () => {
    const card = newCard("a", NOW);
    const result = review(card, 3, NOW + DAY_MS);
    expect(result.intervalDays).toBe(1);
    expect(result.reps).toBe(1);
  });

  it("second pass sets interval to 6", () => {
    let card = newCard("b", NOW);
    card = review(card, 3, NOW + DAY_MS);
    card = review(card, 3, NOW + 2 * DAY_MS);
    expect(card.intervalDays).toBe(6);
    expect(card.reps).toBe(2);
  });

  it("third pass uses round(prev * ease)", () => {
    let card = newCard("c", NOW);
    card = review(card, 5, NOW + DAY_MS); // reps=1, interval=1
    card = review(card, 5, NOW + 2 * DAY_MS); // reps=2, interval=6
    const easeBeforeThird = card.ease;
    card = review(card, 5, NOW + 8 * DAY_MS); // reps=3, interval=round(6*ease)
    expect(card.intervalDays).toBe(Math.round(6 * easeBeforeThird));
  });

  it("fail resets reps to 0, increments lapses, sets interval to 1", () => {
    let card = newCard("d", NOW);
    card = review(card, 3, NOW + DAY_MS);
    card = review(card, 3, NOW + 2 * DAY_MS);
    expect(card.reps).toBe(2);
    card = review(card, 0, NOW + 3 * DAY_MS);
    expect(card.reps).toBe(0);
    expect(card.lapses).toBe(1);
    expect(card.intervalDays).toBe(1);
  });

  it("due advances by exactly 1 day on fail", () => {
    const card = newCard("e", NOW);
    const t = NOW + DAY_MS;
    const result = review(card, 1, t);
    expect(result.due).toBe(t + DAY_MS);
  });
});

// ---------------------------------------------------------------------------
// Property tests
// ---------------------------------------------------------------------------

describe("SM-2 properties", () => {
  it("ease floor: ease is always >= 1.3 after any sequence of grades", () => {
    fc.assert(
      fc.property(
        fc.array(gradeArb, { minLength: 1, maxLength: 30 }),
        (grades) => {
          const card = applyGrades(grades);
          return card.ease >= 1.3;
        },
      ),
      { numRuns: 200 },
    );
  });

  it("interval monotonicity: repeated passing grades produce non-decreasing intervalDays", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 3, max: 5 }) as fc.Arbitrary<Grade>, {
          minLength: 2,
          maxLength: 20,
        }),
        (grades) => {
          let card = newCard("mono", NOW);
          let t = NOW;
          let prevInterval = -1;
          for (const g of grades) {
            t += card.intervalDays * DAY_MS + DAY_MS;
            card = review(card, g, t);
            if (card.intervalDays < prevInterval) return false;
            prevInterval = card.intervalDays;
          }
          return true;
        },
      ),
      { numRuns: 200 },
    );
  });

  it("fail resets reps to 0 and increments lapses by exactly 1", () => {
    fc.assert(
      fc.property(
        fc.array(gradeArb, { minLength: 0, maxLength: 10 }),
        fc.integer({ min: 0, max: 2 }) as fc.Arbitrary<Grade>,
        (setup, failGrade) => {
          const cardBefore = applyGrades(setup);
          const lapsesBefore = cardBefore.lapses;
          const t = NOW + (setup.length + 2) * DAY_MS;
          const after = review(cardBefore, failGrade, t);
          return after.reps === 0 && after.lapses === lapsesBefore + 1;
        },
      ),
      { numRuns: 200 },
    );
  });

  it("due advances strictly: after every review, due > now", () => {
    fc.assert(
      fc.property(
        fc.array(gradeArb, { minLength: 1, maxLength: 20 }),
        (grades) => {
          let card = newCard("due-adv", NOW);
          let t = NOW;
          for (const g of grades) {
            t += DAY_MS;
            card = review(card, g, t);
            if (card.due <= t) return false;
          }
          return true;
        },
      ),
      { numRuns: 200 },
    );
  });
});
