/**
 * Lesson completion, stored client-side. Starts as localStorage; the
 * repository shape leaves room to swap in IndexedDB (and later a Durable
 * Object sync backend) without touching call sites.
 */

const KEY = "nand2web:completed";

function read(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function isCompleted(lessonId: string): boolean {
  return read().has(lessonId);
}

export function markCompleted(lessonId: string): void {
  const all = read();
  all.add(lessonId);
  try {
    localStorage.setItem(KEY, JSON.stringify([...all]));
  } catch {
    // storage unavailable (private mode) — completion just won't persist
  }
}

export function completedCount(lessonIds: readonly string[]): number {
  const all = read();
  return lessonIds.filter((id) => all.has(id)).length;
}
