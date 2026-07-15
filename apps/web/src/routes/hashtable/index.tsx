import { createFileRoute } from "@tanstack/react-router";
import { DeepDive } from "../../features/deepdive/DeepDive";
import { hashTableDeepDive } from "../../features/hashtable/deepdive";
import { HashTablePlayground } from "../../features/hashtable/HashTablePlayground";
import { makeHead } from "../../features/seo/seo";

export const Route = createFileRoute("/hashtable/")({
  head: () =>
    makeHead({
      title: "Hash Table Internals — nand2web",
      description:
        "Visualise separate chaining and open addressing with linear probing — watch collisions, tombstones, and resize animations unfold step by step.",
      path: "/hashtable",
    }),
  component: HashTablePage,
});

function HashTablePage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-sm text-zinc-500">
          Layer 7 · Algorithms &amp; Data Structures
        </p>
        <h1 className="font-semibold text-3xl tracking-tight">
          Hash Table Internals — chaining, open addressing &amp; resize
        </h1>
        <p className="max-w-3xl text-zinc-400">
          Choose a collision strategy, insert keys, delete them, and watch the
          probe sequence or chain traversal animate bucket by bucket. Push the
          load factor past the threshold and see a live resize + rehash scatter
          entries into fresh slots.
        </p>
      </header>

      <HashTablePlayground />

      <DeepDive content={hashTableDeepDive} />
    </div>
  );
}
