import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * The shared playback engine: every simulator on the site — logic gates,
 * CPU cycles, sorting passes — is replayed as "a cursor over a step array".
 * `resetKey` identifies the current run; when it changes the cursor restarts
 * (from 0 with autoplay, or parked at the end).
 */
export interface Playback {
  /** Number of steps currently applied, in [0, total]. */
  readonly cursor: number;
  readonly total: number;
  readonly playing: boolean;
  readonly speed: number;
  play(): void;
  pause(): void;
  seek(cursor: number): void;
  stepForward(): void;
  stepBack(): void;
  restart(): void;
  setSpeed(speed: number): void;
}

const BASE_STEPS_PER_SECOND = 14;

export function usePlayback(
  total: number,
  resetKey: unknown,
  autoPlay: boolean,
): Playback {
  const reducedMotion = usePrefersReducedMotion();
  const [cursor, setCursor] = useState(total);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const lastKey = useRef(resetKey);

  // When reduced motion is preferred, suppress auto-start so the user
  // can step manually. Manual play() still works normally.
  const shouldAutoPlay = autoPlay && !reducedMotion;

  if (lastKey.current !== resetKey) {
    // Reset synchronously during render so the old cursor never paints
    // against the new step array.
    lastKey.current = resetKey;
    setCursor(shouldAutoPlay ? 0 : total);
    setPlaying(shouldAutoPlay && total > 0);
  }

  useEffect(() => {
    if (!playing) {
      return;
    }
    let raf = 0;
    let last = performance.now();
    let fractional = 0;
    const tick = (now: number) => {
      fractional += ((now - last) / 1000) * BASE_STEPS_PER_SECOND * speed;
      last = now;
      const advance = Math.floor(fractional);
      if (advance > 0) {
        fractional -= advance;
        setCursor((c) => Math.min(total, c + advance));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, total]);

  useEffect(() => {
    if (playing && cursor >= total) {
      setPlaying(false);
    }
  }, [playing, cursor, total]);

  return {
    cursor: Math.min(cursor, total),
    total,
    playing,
    speed,
    play: () => {
      if (cursor >= total) {
        setCursor(0);
      }
      setPlaying(true);
    },
    pause: () => setPlaying(false),
    seek: (c) => {
      setPlaying(false);
      setCursor(Math.max(0, Math.min(total, c)));
    },
    stepForward: () => {
      setPlaying(false);
      setCursor((c) => Math.min(total, c + 1));
    },
    stepBack: () => {
      setPlaying(false);
      setCursor((c) => Math.max(0, c - 1));
    },
    restart: () => {
      setCursor(0);
      setPlaying(true);
    },
    setSpeed,
  };
}
