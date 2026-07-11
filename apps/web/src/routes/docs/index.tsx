import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/")({
  component: DocsPage,
});

function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-zinc-300 leading-relaxed">
          nand2web is an interactive computer-science curriculum that rebuilds
          the whole machine from the bottom up — starting at a single NAND gate
          and climbing to a working network stack. Every concept on the site is
          a runnable simulator, not a slideshow: you drive real, deterministic
          implementations written in TypeScript, right in the browser. No
          backend, no sign-up, works offline.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How the site is organized</h2>
        <p className="text-zinc-300 leading-relaxed">
          The material is split into seven layers, ordered from the hardware up.
          Layer 1 is closest to the metal; each higher layer assumes the one
          below it. A review module ties them together with spaced repetition.
        </p>
        <ol className="space-y-1 list-decimal list-inside text-zinc-300 leading-relaxed">
          <li>
            <Link to="/logic" className="text-sky-400 hover:text-sky-300">
              Digital Logic
            </Link>
          </li>
          <li>
            <Link to="/cpu" className="text-sky-400 hover:text-sky-300">
              The CPU
            </Link>
          </li>
          <li>
            <Link to="/arch" className="text-sky-400 hover:text-sky-300">
              Computer Architecture
            </Link>
          </li>
          <li>
            <Link to="/os" className="text-sky-400 hover:text-sky-300">
              Operating Systems
            </Link>
          </li>
          <li>
            <Link to="/lang" className="text-sky-400 hover:text-sky-300">
              Compilers &amp; Languages
            </Link>
          </li>
          <li>
            <Link to="/net" className="text-sky-400 hover:text-sky-300">
              Networking
            </Link>
          </li>
          <li>
            <Link to="/algorithms" className="text-sky-400 hover:text-sky-300">
              Algorithms &amp; Data Structures
            </Link>
          </li>
          <li>
            <Link to="/quiz" className="text-sky-400 hover:text-sky-300">
              Spaced-Repetition Quiz
            </Link>{" "}
            (review)
          </li>
        </ol>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold">
          The layers — what you can do in each
        </h2>

        <div className="space-y-2">
          <p className="font-mono text-sm text-sky-400">Layer 1</p>
          <p className="text-zinc-300 leading-relaxed">
            <Link
              to="/logic"
              className="text-sky-400 hover:text-sky-300 font-semibold"
            >
              Digital Logic
            </Link>{" "}
            — Seven hands-on lessons from the NAND gate up to a 4-operation ALU.
            Toggle inputs, watch signals propagate, and solve truth-table
            challenges to unlock each lesson.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-mono text-sm text-sky-400">Layer 2</p>
          <p className="text-zinc-300 leading-relaxed">
            <Link
              to="/cpu"
              className="text-sky-400 hover:text-sky-300 font-semibold"
            >
              The CPU
            </Link>{" "}
            — Write assembly for a 4-bit, 16-instruction CPU, then run it or
            single-step fetch → decode → execute while the datapath animates. 16
            words of program RAM, 16 nibbles of data, two registers, two flags.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-mono text-sm text-sky-400">Layer 3</p>
          <p className="text-zinc-300 leading-relaxed">
            <Link
              to="/arch"
              className="text-sky-400 hover:text-sky-300 font-semibold"
            >
              Computer Architecture
            </Link>{" "}
            — Two simulators: a 5-stage pipeline (IF/ID/EX/MEM/WB) where you see
            hazards stall or forward, and a cache where you compare
            direct-mapped vs. set-associative hit rates under real access
            patterns.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-mono text-sm text-sky-400">Layer 4</p>
          <p className="text-zinc-300 leading-relaxed">
            <Link
              to="/os"
              className="text-sky-400 hover:text-sky-300 font-semibold"
            >
              Operating Systems
            </Link>{" "}
            — Race four CPU schedulers (FCFS, SJF, Round-Robin, MLFQ) on one
            workload with Gantt charts, and walk a page table through faults
            under FIFO / LRU / Clock replacement.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-mono text-sm text-sky-400">Layer 5</p>
          <p className="text-zinc-300 leading-relaxed">
            <Link
              to="/lang"
              className="text-sky-400 hover:text-sky-300 font-semibold"
            >
              Compilers &amp; Languages
            </Link>{" "}
            — Write a program in "Tiny" and watch a real compiler pipeline turn
            your source into tokens, an AST, and a result as you type —
            variables, arithmetic, if/else, while, print.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-mono text-sm text-sky-400">Layer 6</p>
          <p className="text-zinc-300 leading-relaxed">
            <Link
              to="/net"
              className="text-sky-400 hover:text-sky-300 font-semibold"
            >
              Networking
            </Link>{" "}
            — Step through a TCP three-way handshake, watch a packet get
            encapsulated down the stack (HTTP → TCP → IP → Ethernet) with
            optional packet loss, and trace a DNS lookup from stub resolver to
            authoritative server.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-mono text-sm text-sky-400">Layer 7</p>
          <p className="text-zinc-300 leading-relaxed">
            <Link
              to="/algorithms"
              className="text-sky-400 hover:text-sky-300 font-semibold"
            >
              Algorithms &amp; Data Structures
            </Link>{" "}
            — Visualize six sorting algorithms comparison-by-comparison, race
            them on sorted/random/reverse inputs, and feel the asymptotic
            difference against a complexity table.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-mono text-sm text-sky-400">Review</p>
          <p className="text-zinc-300 leading-relaxed">
            <Link
              to="/quiz"
              className="text-sky-400 hover:text-sky-300 font-semibold"
            >
              Spaced-Repetition Quiz
            </Link>{" "}
            — Flash cards spanning all seven domains, scheduled with the SM-2
            algorithm so hard cards return sooner and easy ones fade back.
            Progress is saved locally.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Under the hood</h2>
        <p className="text-zinc-300 leading-relaxed">
          Every simulator is a pure, deterministic TypeScript module in a pnpm
          monorepo (one package per domain — logic, cpu, arch, os, lang, net,
          algorithms, plus a shared sim-core and an srs scheduler). There is no
          server: the CPU is really assembled and executed, the compiler is a
          real recursive-descent parser and evaluator, and the review scheduler
          is a real SM-2 implementation. The core logic is property-tested with
          fast-check. Your lesson progress and flash-card schedule persist in
          IndexedDB, so the whole site keeps working offline.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Language</h2>
        <p className="text-zinc-300 leading-relaxed">
          The interface is in English. The deep-dive explanations on each layer
          are available in both English and 日本語 — use the EN / 日本語 toggle
          in the header to switch.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Source &amp; stack</h2>
        <p className="text-zinc-300 leading-relaxed">
          Built with React, TanStack Router, Tailwind CSS, and Vite, deployed on
          Cloudflare Workers. The full source is on GitHub —{" "}
          <a
            href="https://github.com/subaru-hello/nand2web"
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 hover:text-sky-300"
          >
            github.com/subaru-hello/nand2web
          </a>
          .
        </p>
      </section>
    </div>
  );
}
