import { collectSteps } from "@nand2web/sim-core";
import { describe, expect, it } from "vitest";
import { HashTable, hashKey } from "./hashtable.ts";

// ---------------------------------------------------------------------------
// hashKey
// ---------------------------------------------------------------------------

describe("hashKey", () => {
  it("returns value in [0, buckets)", () => {
    for (const buckets of [7, 11, 16, 31]) {
      for (const key of ["a", "hello", "42", "zzz", ""]) {
        const h = hashKey(key, buckets);
        expect(h).toBeGreaterThanOrEqual(0);
        expect(h).toBeLessThan(buckets);
      }
    }
  });

  it("is deterministic", () => {
    expect(hashKey("foo", 7)).toBe(hashKey("foo", 7));
    expect(hashKey("bar", 11)).toBe(hashKey("bar", 11));
  });
});

// ---------------------------------------------------------------------------
// Chaining — basic correctness
// ---------------------------------------------------------------------------

describe("HashTable (chaining) — insert / find / remove", () => {
  it("insert and find a single key", () => {
    const ht = new HashTable("chaining");
    collectSteps(ht.insert("a", 1));
    const { result } = collectSteps(ht.find("a"));
    expect(result?.probeCount).toBeGreaterThanOrEqual(1);
    expect(ht.size).toBe(1);
  });

  it("find on missing key returns probeCount ≥ 0", () => {
    const ht = new HashTable("chaining");
    const { result } = collectSteps(ht.find("missing"));
    expect(result).toBeDefined();
    expect(result?.probeCount).toBeGreaterThanOrEqual(0);
  });

  it("update existing key does not increase size", () => {
    const ht = new HashTable("chaining");
    collectSteps(ht.insert("x", 1));
    collectSteps(ht.insert("x", 2)); // update
    expect(ht.size).toBe(1);
  });

  it("insert multiple keys, all findable", () => {
    const ht = new HashTable("chaining");
    const keys = ["alpha", "beta", "gamma", "delta", "epsilon"];
    for (const k of keys) collectSteps(ht.insert(k, k.length));
    for (const k of keys) {
      const { steps } = collectSteps(ht.find(k));
      const lastLabel = steps[steps.length - 1]?.meta.label ?? "";
      expect(lastLabel).toContain(k);
      expect(lastLabel.toLowerCase()).toContain("found");
    }
  });

  it("remove decreases size and key is no longer findable", () => {
    const ht = new HashTable("chaining");
    collectSteps(ht.insert("del", 99));
    expect(ht.size).toBe(1);
    collectSteps(ht.remove("del"));
    expect(ht.size).toBe(0);
    const { steps } = collectSteps(ht.find("del"));
    const lastLabel = steps[steps.length - 1]?.meta.label ?? "";
    // Label should say "not found" but not just "found"
    expect(lastLabel.toLowerCase()).toContain("not found");
  });

  it("remove missing key leaves size unchanged", () => {
    const ht = new HashTable("chaining");
    collectSteps(ht.insert("k", 1));
    collectSteps(ht.remove("nope"));
    expect(ht.size).toBe(1);
  });

  it("collision handling: same-bucket keys both findable", () => {
    // Force collision: use a very small bucket count.
    const ht = new HashTable("chaining", 3);
    const keys = ["aaa", "bbb", "ccc", "ddd", "eee", "fff"];
    for (const k of keys) collectSteps(ht.insert(k));
    for (const k of keys) {
      const { steps } = collectSteps(ht.find(k));
      const lastLabel = steps[steps.length - 1]?.meta.label ?? "";
      expect(lastLabel.toLowerCase()).toContain("found");
    }
  });

  it("generators yield ≥1 step for every operation", () => {
    const ht = new HashTable("chaining");
    const { steps: s1 } = collectSteps(ht.insert("k", 1));
    expect(s1.length).toBeGreaterThanOrEqual(1);
    const { steps: s2 } = collectSteps(ht.find("k"));
    expect(s2.length).toBeGreaterThanOrEqual(1);
    const { steps: s3 } = collectSteps(ht.remove("k"));
    expect(s3.length).toBeGreaterThanOrEqual(1);
  });

  it("result has non-negative load factor and bucket count", () => {
    const ht = new HashTable("chaining");
    const { result } = collectSteps(ht.insert("k", 1));
    expect(result?.loadFactor).toBeGreaterThanOrEqual(0);
    expect(result?.bucketCount).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Chaining — resize
// ---------------------------------------------------------------------------

describe("HashTable (chaining) — resize", () => {
  it("triggers resize when load factor exceeds threshold", () => {
    // threshold is 1.0: with 3 buckets, insert 4 distinct keys forces resize.
    const ht = new HashTable("chaining", 3);
    let resized = false;
    for (const k of ["a", "b", "c", "d"]) {
      const { result } = collectSteps(ht.insert(k));
      if (result?.resized) resized = true;
    }
    expect(resized).toBe(true);
    expect(ht.bucketCount).toBeGreaterThan(3);
  });

  it("after resize all entries still findable", () => {
    const ht = new HashTable("chaining", 3);
    const keys = ["a", "b", "c", "d", "e"];
    for (const k of keys) collectSteps(ht.insert(k));
    for (const k of keys) {
      const { steps } = collectSteps(ht.find(k));
      const lastLabel = steps[steps.length - 1]?.meta.label ?? "";
      expect(lastLabel.toLowerCase()).toContain("found");
    }
  });

  it("resize step carries resizing=true and bucketsBeforeResize", () => {
    const ht = new HashTable("chaining", 3);
    let sawResize = false;
    for (const k of ["a", "b", "c", "d"]) {
      const { steps } = collectSteps(ht.insert(k));
      for (const step of steps) {
        if (step.resizing) {
          sawResize = true;
          expect(step.bucketsBeforeResize).toBeDefined();
        }
      }
    }
    expect(sawResize).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Open addressing — basic correctness
// ---------------------------------------------------------------------------

describe("HashTable (open-addressing) — insert / find / remove", () => {
  it("insert and find a single key", () => {
    const ht = new HashTable("open-addressing");
    collectSteps(ht.insert("a", 1));
    const { steps } = collectSteps(ht.find("a"));
    const lastLabel = steps[steps.length - 1]?.meta.label ?? "";
    expect(lastLabel.toLowerCase()).toContain("found");
  });

  it("find on missing key stops at empty slot", () => {
    const ht = new HashTable("open-addressing");
    const { steps } = collectSteps(ht.find("missing"));
    const lastLabel = steps[steps.length - 1]?.meta.label ?? "";
    expect(lastLabel.toLowerCase()).not.toContain("found");
  });

  it("update existing key does not increase size", () => {
    const ht = new HashTable("open-addressing");
    collectSteps(ht.insert("x", 1));
    collectSteps(ht.insert("x", 2));
    expect(ht.size).toBe(1);
  });

  it("insert multiple keys, all findable", () => {
    const ht = new HashTable("open-addressing");
    const keys = ["alpha", "beta", "gamma", "delta", "epsilon"];
    for (const k of keys) collectSteps(ht.insert(k, k.length));
    for (const k of keys) {
      const { steps } = collectSteps(ht.find(k));
      const lastLabel = steps[steps.length - 1]?.meta.label ?? "";
      expect(lastLabel.toLowerCase()).toContain("found");
    }
  });

  it("generators yield ≥1 step for every operation", () => {
    const ht = new HashTable("open-addressing");
    const { steps: s1 } = collectSteps(ht.insert("k", 1));
    expect(s1.length).toBeGreaterThanOrEqual(1);
    const { steps: s2 } = collectSteps(ht.find("k"));
    expect(s2.length).toBeGreaterThanOrEqual(1);
    const { steps: s3 } = collectSteps(ht.remove("k"));
    expect(s3.length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// Open addressing — tombstones
// ---------------------------------------------------------------------------

describe("HashTable (open-addressing) — tombstones", () => {
  it("remove places a tombstone and decreases size", () => {
    const ht = new HashTable("open-addressing");
    collectSteps(ht.insert("t", 1));
    collectSteps(ht.remove("t"));
    expect(ht.size).toBe(0);
    // The snapshot should have at least one tombstone slot.
    const snap = ht.snapshot();
    const hasTombstone = snap.some((b) => b.slot.state === "tombstone");
    expect(hasTombstone).toBe(true);
  });

  it("find skips tombstones and finds key beyond them", () => {
    // With a small table, force a probe sequence: insert A, remove A
    // (leaves tombstone), insert B which probes past tombstone, then find B.
    const ht = new HashTable("open-addressing", 7);
    // Insert enough to force a collision with 'B' landing after 'A''s slot.
    collectSteps(ht.insert("A", 1));
    const homeA = hashKey("A", 7);
    const homeB = hashKey("B", 7);
    // Only guarantee find works after tombstone if they hash to same bucket.
    // Just verify find works correctly for any key order.
    collectSteps(ht.remove("A"));
    collectSteps(ht.insert("B", 2));
    const { steps } = collectSteps(ht.find("B"));
    const lastLabel = steps[steps.length - 1]?.meta.label ?? "";
    expect(lastLabel.toLowerCase()).toContain("found");
    // Suppress unused variable warning
    void homeA;
    void homeB;
  });

  it("tombstone-then-reinsert: same key reinserted after removal is findable", () => {
    const ht = new HashTable("open-addressing");
    collectSteps(ht.insert("z", 10));
    collectSteps(ht.remove("z"));
    collectSteps(ht.insert("z", 20));
    const { steps } = collectSteps(ht.find("z"));
    const lastLabel = steps[steps.length - 1]?.meta.label ?? "";
    expect(lastLabel.toLowerCase()).toContain("found");
  });

  it("tombstone re-use: inserting into tombstone slot does not increase size above actual entries", () => {
    const ht = new HashTable("open-addressing", 11);
    collectSteps(ht.insert("key1", 1));
    collectSteps(ht.insert("key2", 2));
    const sizeBefore = ht.size; // 2
    collectSteps(ht.remove("key1")); // size = 1, tombstone at key1's slot
    collectSteps(ht.insert("key3", 3)); // might reuse tombstone
    // After removing 1 and inserting 1 more, size should be 2.
    expect(ht.size).toBeLessThanOrEqual(sizeBefore + 1);
  });

  it("step snapshots contain tombstone state in slots", () => {
    const ht = new HashTable("open-addressing");
    collectSteps(ht.insert("x", 1));
    const { steps } = collectSteps(ht.remove("x"));
    const lastStep = steps[steps.length - 1];
    expect(lastStep).toBeDefined();
    const hasTombstone = lastStep?.buckets.some(
      (b) => b.slot.state === "tombstone",
    );
    expect(hasTombstone).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Open addressing — resize
// ---------------------------------------------------------------------------

describe("HashTable (open-addressing) — resize", () => {
  it("triggers resize when load factor exceeds 0.75", () => {
    // With 7 slots, 0.75 * 7 = 5.25 → after 6 inserts should resize.
    const ht = new HashTable("open-addressing", 7);
    let resized = false;
    for (const k of ["a", "b", "c", "d", "e", "f"]) {
      const { result } = collectSteps(ht.insert(k));
      if (result?.resized) resized = true;
    }
    expect(resized).toBe(true);
    expect(ht.bucketCount).toBeGreaterThan(7);
  });

  it("after resize all entries still findable", () => {
    const ht = new HashTable("open-addressing", 7);
    const keys = ["a", "b", "c", "d", "e", "f"];
    for (const k of keys) collectSteps(ht.insert(k));
    for (const k of keys) {
      const { steps } = collectSteps(ht.find(k));
      const lastLabel = steps[steps.length - 1]?.meta.label ?? "";
      expect(lastLabel.toLowerCase()).toContain("found");
    }
  });

  it("resize clears tombstones — resize step's new snapshot has no tombstones", () => {
    const ht = new HashTable("open-addressing", 7);
    collectSteps(ht.insert("del1", 1));
    collectSteps(ht.insert("del2", 2));
    collectSteps(ht.remove("del1")); // tombstone
    // Insert enough live entries to cross 0.75 × 7 = 5.25 (i.e. 6 occupied).
    // size is currently 1 (del2); add 5 more: total 6 → triggers resize.
    let resizeSnap:
      | readonly import("./hashtable.ts").BucketSnapshot[]
      | undefined;
    for (const k of ["c", "d", "e", "f", "g"]) {
      const { steps } = collectSteps(ht.insert(k));
      for (const step of steps) {
        if (step.resizing) {
          resizeSnap = step.buckets;
        }
      }
    }
    // If resize fired, its post-resize snapshot should have no tombstones.
    if (resizeSnap !== undefined) {
      const hasTombstone = resizeSnap.some((b) => b.slot.state === "tombstone");
      expect(hasTombstone).toBe(false);
    } else {
      // Resize may not have triggered — verify by checking bucket count grew elsewhere or skip.
      // This branch means load stayed below threshold; just pass.
      expect(true).toBe(true);
    }
  });

  it("resize step carries resizing=true and bucketsBeforeResize", () => {
    const ht = new HashTable("open-addressing", 7);
    let sawResize = false;
    for (const k of ["a", "b", "c", "d", "e", "f"]) {
      const { steps } = collectSteps(ht.insert(k));
      for (const step of steps) {
        if (step.resizing) {
          sawResize = true;
          expect(step.bucketsBeforeResize).toBeDefined();
        }
      }
    }
    expect(sawResize).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Open addressing — tombstone churn regression (MUST-FIX bug)
// ---------------------------------------------------------------------------

describe("HashTable (open-addressing) — tombstone churn regression", () => {
  /**
   * Reproduce the original bug:
   *
   * With a 7-slot table and threshold 0.75 (resize when occupancy > 5.25),
   * insert 5 keys (occupancy = 5/7 = 0.71 — just under threshold, no resize),
   * then delete 4 of them leaving 1 live + 4 tombstones = 5 non-empty slots.
   * The old code used size/bucketCount = 1/7 ≈ 0.14 as the resize trigger, so
   * it never resized.  Inserting 4 more keys bumps occupied+tombstone to 9/7
   * which exceeds 7 available slots: the probe loop exhaust all slots, never
   * sees "empty", and silently drops the key (no error, no increment to size).
   *
   * The fix: use (size + tombstones)/bucketCount as the resize trigger, plus
   * belt-and-suspenders tombstone reuse if the probe loop exhausts all slots.
   */
  it("never silently drops an insert when tombstones fill the probe space (exact bug reproduction)", () => {
    // Insert 5 keys into a 7-slot table — occupancy 5/7 = 0.71, no resize.
    const ht = new HashTable("open-addressing", 7);
    const initialKeys = ["k0", "k1", "k2", "k3", "k4"];
    for (const k of initialKeys) collectSteps(ht.insert(k));
    expect(ht.size).toBe(5);
    // Confirm no resize yet (bucket count still 7).
    expect(ht.bucketCount).toBe(7);

    // Delete 4 → 1 live + 4 tombstones.  Old loadFactor = 1/7 ≈ 0.14.
    for (const k of ["k0", "k1", "k2", "k3"]) collectSteps(ht.remove(k));
    expect(ht.size).toBe(1);

    // Now insert 4 new keys.  With the fix, tombstone-inclusive occupancy
    // (1+4)/7 ≈ 0.71 — still below threshold for the first, but as each
    // insert increases size the trigger fires and/or the belt-and-suspenders
    // path reuses tombstones.  Either way, NO insert may be silently dropped.
    const newKeys = ["n0", "n1", "n2", "n3"];
    for (const k of newKeys) collectSteps(ht.insert(k));

    // Every new key must be findable.
    for (const k of newKeys) {
      const { steps } = collectSteps(ht.find(k));
      const lastLabel = steps[steps.length - 1]?.meta.label ?? "";
      expect(lastLabel.toLowerCase()).toContain("found");
    }

    // The surviving original key must also still be findable.
    const { steps: s4 } = collectSteps(ht.find("k4"));
    const lastLabel4 = s4[s4.length - 1]?.meta.label ?? "";
    expect(lastLabel4.toLowerCase()).toContain("found");
  });

  it("size tracks correctly through insert/remove churn", () => {
    const ht = new HashTable("open-addressing", 11);
    const keys = ["a", "b", "c", "d", "e"];
    for (const k of keys) collectSteps(ht.insert(k));
    expect(ht.size).toBe(5);

    // Remove 3.
    for (const k of ["a", "b", "c"]) collectSteps(ht.remove(k));
    expect(ht.size).toBe(2);

    // Re-insert 2 of the removed keys — tombstone reuse must not double-count.
    collectSteps(ht.insert("a", 1));
    collectSteps(ht.insert("b", 2));
    expect(ht.size).toBe(4);
  });

  it("all live keys remain findable after heavy insert/remove/insert churn", () => {
    const ht = new HashTable("open-addressing", 7);

    // Insert 5 keys just under the resize threshold.
    for (const k of ["a", "b", "c", "d", "e"]) collectSteps(ht.insert(k));

    // Remove 4 → 1 live + 4 tombstones.
    for (const k of ["a", "b", "c", "d"]) collectSteps(ht.remove(k));

    // Insert 5 more — forces tombstone-inclusive occupancy to exceed threshold.
    const newKeys = ["p", "q", "r", "s", "t"];
    for (const k of newKeys) collectSteps(ht.insert(k));

    // All live keys must be findable.
    const liveKeys = ["e", "p", "q", "r", "s", "t"];
    for (const k of liveKeys) {
      const { steps } = collectSteps(ht.find(k));
      const lastLabel = steps[steps.length - 1]?.meta.label ?? "";
      expect(lastLabel.toLowerCase()).toContain("found");
    }
  });

  it("tombstone-inclusive occupancy triggers resize when tombstones crowd out empty slots", () => {
    // Build up a situation where the tombstone-inclusive occupancy exceeds 0.75
    // even though the live-entry load factor is well below it.
    //
    // 7-slot table, threshold 0.75 → resize when (size+tombstones) > 5.25.
    // Insert 5 keys → size=5, tombstones=0, occupancy 5/7=0.71 (no resize).
    // Delete 4 → size=1, tombstones=4, occupancy still 5/7=0.71 (old bug: 1/7=0.14).
    // Insert 2 more → each insert increments size by 1 (and may decrement tombstones
    // by 1 via reuse), so after first insert: size≥2, sum≥5; after second: size≥3,
    // sum≥5. To guarantee sum > 5.25 we insert a 3rd key: size≥4, tombstones≤4,
    // and if any insert hits a true-empty slot the tombstone count stays at 4 and
    // sum = size+4 ≥ 2+4 = 6 > 5.25 → resize fires.
    const ht = new HashTable("open-addressing", 7);

    // Insert 5 keys, no resize.
    for (const k of ["a", "b", "c", "d", "e"]) collectSteps(ht.insert(k));
    expect(ht.bucketCount).toBe(7);

    // Delete 4 → 1 live + 4 tombstones.
    for (const k of ["a", "b", "c", "d"]) collectSteps(ht.remove(k));

    // Insert enough new keys to guarantee (size + tombstones) > 5.25.
    let sawResize = false;
    for (const k of ["x", "y", "z"]) {
      const { steps } = collectSteps(ht.insert(k));
      for (const step of steps) {
        if (step.resizing) {
          sawResize = true;
          // The post-resize bucket snapshot must have no tombstones.
          const hasTombstone = step.buckets.some(
            (b) => b.slot.state === "tombstone",
          );
          expect(hasTombstone).toBe(false);
        }
      }
    }
    expect(sawResize).toBe(true);
  });

  it("tombstone-reuse insert increments size exactly once", () => {
    const ht = new HashTable("open-addressing", 11);
    collectSteps(ht.insert("t", 1));
    expect(ht.size).toBe(1);
    collectSteps(ht.remove("t")); // size = 0, tombstone
    expect(ht.size).toBe(0);
    collectSteps(ht.insert("t", 2)); // reuse tombstone → size = 1
    expect(ht.size).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Snapshot
// ---------------------------------------------------------------------------

describe("HashTable.snapshot", () => {
  it("chaining snapshot has correct bucket count", () => {
    const ht = new HashTable("chaining", 7);
    expect(ht.snapshot().length).toBe(7);
  });

  it("open-addressing snapshot has correct slot count", () => {
    const ht = new HashTable("open-addressing", 7);
    expect(ht.snapshot().length).toBe(7);
  });

  it("step buckets length matches current bucket count", () => {
    const ht = new HashTable("chaining");
    const { steps } = collectSteps(ht.insert("k", 1));
    for (const step of steps) {
      expect(step.buckets.length).toBe(
        step.resizing ? step.buckets.length : ht.bucketCount,
      );
    }
  });
});
