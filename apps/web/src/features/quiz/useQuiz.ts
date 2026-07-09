import type { Grade, SrsCard } from "@nand2web/srs";
import { newCard, review } from "@nand2web/srs";
import { useCallback, useEffect, useState } from "react";
import { getAllCards, putCard } from "../persistence/db";
import type { QuizCard } from "./deck";
import { DECK } from "./deck";

export interface QuizSession {
  /** Cards that are currently due (due <= now) or new, in review order. */
  queue: QuizCard[];
  /** Index into queue of the current card (-1 = finished). */
  current: number;
  /** Number of cards reviewed this session. */
  reviewed: number;
  /** SRS state keyed by card id. */
  srsMap: Map<string, SrsCard>;
  /** Epoch ms of the soonest next-due card after the queue is empty. */
  nextDue: number | null;
  loading: boolean;
}

function buildQueue(
  stored: Map<string, SrsCard>,
  now: number,
): { queue: QuizCard[]; nextDue: number | null } {
  const due: QuizCard[] = [];
  const notDue: QuizCard[] = [];
  let soonest: number | null = null;

  for (const card of DECK) {
    const srs = stored.get(card.id);
    if (!srs || srs.due <= now) {
      due.push(card);
    } else {
      notDue.push(card);
      if (soonest === null || srs.due < soonest) {
        soonest = srs.due;
      }
    }
  }

  return { queue: due, nextDue: notDue.length > 0 ? soonest : null };
}

export function useQuiz() {
  const [session, setSession] = useState<QuizSession>({
    queue: [],
    current: 0,
    reviewed: 0,
    srsMap: new Map(),
    nextDue: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await getAllCards();
      if (cancelled) return;

      const now = Date.now();
      const srsMap = new Map<string, SrsCard>();
      for (const c of stored) {
        srsMap.set(c.id, c);
      }
      // ensure every deck card has an srs entry
      for (const card of DECK) {
        if (!srsMap.has(card.id)) {
          srsMap.set(card.id, newCard(card.id, now));
        }
      }

      const { queue, nextDue } = buildQueue(srsMap, now);

      setSession({
        queue,
        current: 0,
        reviewed: 0,
        srsMap,
        nextDue,
        loading: false,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const grade = useCallback(async (g: Grade) => {
    const now = Date.now();
    setSession((prev) => {
      const card = prev.queue[prev.current];
      if (!card) return prev;

      const currentSrs = prev.srsMap.get(card.id) ?? newCard(card.id, now);
      const updated = review(currentSrs, g, now);

      // fire-and-forget persist
      putCard(updated).catch(console.error);

      const newSrsMap = new Map(prev.srsMap);
      newSrsMap.set(card.id, updated);

      const nextCurrent = prev.current + 1;
      const done = nextCurrent >= prev.queue.length;

      // recalculate nextDue when we finish the queue
      let nextDue = prev.nextDue;
      if (done) {
        nextDue = null;
        for (const [, srs] of newSrsMap) {
          if (srs.due > now) {
            if (nextDue === null || srs.due < nextDue) {
              nextDue = srs.due;
            }
          }
        }
      }

      return {
        ...prev,
        srsMap: newSrsMap,
        current: nextCurrent,
        reviewed: prev.reviewed + 1,
        nextDue,
      };
    });
  }, []);

  return { session, grade };
}
