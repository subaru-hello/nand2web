/**
 * Typed IndexedDB wrapper.
 *
 * Database: "nand2web", version 1.
 *
 * Object stores:
 *   progress — keyed by string key; stores a single record:
 *              { id: "completed", ids: string[] }
 *   srs      — keyed by card.id (string); value is SrsCard
 */

import type { SrsCard } from "@nand2web/srs";
import { type DBSchema, type IDBPDatabase, openDB } from "idb";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

interface Nand2WebDB extends DBSchema {
  progress: {
    key: string;
    value: { id: string; ids: string[] };
  };
  srs: {
    key: string;
    value: SrsCard;
  };
}

// ---------------------------------------------------------------------------
// DB singleton (lazy, module-level promise)
// ---------------------------------------------------------------------------

let _db: Promise<IDBPDatabase<Nand2WebDB>> | undefined;

function getDb(): Promise<IDBPDatabase<Nand2WebDB>> {
  if (!_db) {
    _db = openDB<Nand2WebDB>("nand2web", 1, {
      upgrade(db) {
        db.createObjectStore("progress", { keyPath: "id" });
        db.createObjectStore("srs", { keyPath: "id" });
      },
    });
  }
  return _db;
}

// ---------------------------------------------------------------------------
// Progress repository
// ---------------------------------------------------------------------------

const COMPLETED_KEY = "completed";

/** Return the list of completed lesson IDs. */
export async function getCompleted(): Promise<string[]> {
  const db = await getDb();
  const record = await db.get("progress", COMPLETED_KEY);
  return record?.ids ?? [];
}

/** Overwrite the completed lesson ID list. */
export async function setCompleted(ids: string[]): Promise<void> {
  const db = await getDb();
  await db.put("progress", { id: COMPLETED_KEY, ids });
}

// ---------------------------------------------------------------------------
// SRS card repository
// ---------------------------------------------------------------------------

/** Return all stored SRS cards. */
export async function getAllCards(): Promise<SrsCard[]> {
  const db = await getDb();
  return db.getAll("srs");
}

/** Insert or update a single SRS card. */
export async function putCard(card: SrsCard): Promise<void> {
  const db = await getDb();
  await db.put("srs", card);
}

/** Retrieve a single SRS card by id, or undefined if not found. */
export async function getCard(id: string): Promise<SrsCard | undefined> {
  const db = await getDb();
  return db.get("srs", id);
}
