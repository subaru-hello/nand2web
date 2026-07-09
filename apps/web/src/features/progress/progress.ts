/**
 * Lesson completion, backed by IndexedDB.
 *
 * On first load, performs a one-time migration: if localStorage has
 * "nand2web:completed" and idb is empty, the data is copied into idb.
 * localStorage is left as-is (harmless; language pref stays there too).
 */

import { useEffect, useState } from "react";
import { getCompleted, setCompleted } from "../persistence/db";

const LS_KEY = "nand2web:completed";

// ---------------------------------------------------------------------------
// One-time localStorage → idb migration (runs once per db open)
// ---------------------------------------------------------------------------

let _migrated = false;

async function migrateIfNeeded(): Promise<void> {
  if (_migrated) return;
  _migrated = true;
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return;
  const existing = await getCompleted();
  if (existing.length > 0) return;
  try {
    const ids = JSON.parse(raw) as string[];
    if (Array.isArray(ids) && ids.length > 0) {
      await setCompleted(ids);
    }
  } catch {
    // malformed localStorage — skip migration
  }
}

// ---------------------------------------------------------------------------
// Public async API
// ---------------------------------------------------------------------------

/** Mark a lesson as completed in idb. */
export async function markCompleted(lessonId: string): Promise<void> {
  await migrateIfNeeded();
  const ids = await getCompleted();
  if (!ids.includes(lessonId)) {
    await setCompleted([...ids, lessonId]);
  }
}

// ---------------------------------------------------------------------------
// React hook
// ---------------------------------------------------------------------------

/**
 * Returns the set of completed lesson IDs loaded from idb.
 * Initialises to an empty set on first render; populates asynchronously.
 */
export function useCompleted(): Set<string> {
  const [completed, setCompletedState] = useState<Set<string>>(
    () => new Set<string>(),
  );

  useEffect(() => {
    let cancelled = false;
    void migrateIfNeeded().then(async () => {
      const ids = await getCompleted();
      if (!cancelled) {
        setCompletedState(new Set(ids));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return completed;
}
