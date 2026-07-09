/**
 * Single source of truth for the curriculum: what layers and modules exist,
 * where they live, and how far along they are. The landing page, routing,
 * and progress tracking all derive from this.
 */

export type ModuleStatus = "done" | "wip" | "planned";

export interface CurriculumModule {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: ModuleStatus;
  /** Route path once the module ships. */
  readonly route?: string;
  readonly topics: readonly string[];
}

export interface CurriculumLayer {
  /** 1 = closest to the hardware. Rendered as a stack with layer 1 at the bottom. */
  readonly order: number;
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly modules: readonly CurriculumModule[];
}

export const curriculum: readonly CurriculumLayer[] = [
  {
    order: 1,
    id: "logic",
    title: "Digital Logic",
    subtitle: "Everything is NAND",
    modules: [
      {
        id: "logic-gates",
        title: "From NAND to ALU",
        description:
          "Build every gate from NAND, then compose adders, latches, registers, and a working 4-bit ALU. Toggle inputs and watch signals propagate.",
        status: "done",
        route: "/logic",
        topics: [
          "NAND completeness",
          "combinational vs. sequential",
          "full adder",
          "D flip-flop",
          "4-bit ALU",
        ],
      },
    ],
  },
  {
    order: 2,
    id: "cpu",
    title: "The CPU",
    subtitle: "A stored-program computer, 4 bits at a time",
    modules: [
      {
        id: "cpu-4bit",
        title: "4-bit CPU",
        description:
          "Write assembly for a tiny 16-instruction ISA and watch fetch → decode → execute animate across the datapath, cycle by cycle.",
        status: "done",
        route: "/cpu",
        topics: [
          "ISA design",
          "datapath & control",
          "fetch/decode/execute",
          "assembler",
        ],
      },
    ],
  },
  {
    order: 3,
    id: "arch",
    title: "Computer Architecture",
    subtitle: "Making it fast: pipelines and caches",
    modules: [
      {
        id: "arch-pipeline",
        title: "Pipelining & Hazards",
        description:
          "A 5-stage pipeline with data and control hazards. Compare stalling against forwarding and count the cycles.",
        status: "done",
        route: "/arch",
        topics: ["IF/ID/EX/MEM/WB", "hazards", "forwarding"],
      },
      {
        id: "arch-cache",
        title: "Cache Hierarchy",
        description:
          "Direct-mapped vs. set-associative caches. Replay access patterns and watch hit rates change.",
        status: "done",
        route: "/arch",
        topics: ["locality", "associativity", "LRU"],
      },
    ],
  },
  {
    order: 4,
    id: "os",
    title: "Operating Systems",
    subtitle: "Sharing one machine among many programs",
    modules: [
      {
        id: "os-scheduling",
        title: "Process Scheduling",
        description:
          "FCFS, SJF, Round-Robin, and MLFQ on the same workload — Gantt charts and waiting-time comparisons included.",
        status: "done",
        route: "/os",
        topics: ["FCFS / SJF / RR / MLFQ", "turnaround & waiting time"],
      },
      {
        id: "os-memory",
        title: "Virtual Memory",
        description:
          "Follow a virtual address through the page table walk, trigger page faults, and race FIFO vs. LRU vs. Clock replacement.",
        status: "done",
        route: "/os",
        topics: ["paging", "page faults", "replacement policies"],
      },
    ],
  },
  {
    order: 5,
    id: "lang",
    title: "Compilers & Languages",
    subtitle: "From characters to computation",
    modules: [
      {
        id: "lang-pipeline",
        title: "Compiler Pipeline",
        description:
          "Type a tiny program and watch it flow live through lexer → tokens → parser → AST → evaluation, one step at a time.",
        status: "done",
        route: "/lang",
        topics: ["lexing", "recursive-descent parsing", "AST", "evaluation"],
      },
    ],
  },
  {
    order: 6,
    id: "net",
    title: "Networking",
    subtitle: "How bytes cross the planet",
    modules: [
      {
        id: "net-tcp",
        title: "TCP & Encapsulation",
        description:
          "Packets descend the protocol stack, shake hands in three ways, and survive the packet loss you inject.",
        status: "done",
        route: "/net",
        topics: ["encapsulation", "3-way handshake", "retransmission"],
      },
      {
        id: "net-dns",
        title: "DNS Resolution",
        description:
          "A name's journey from stub resolver through root, TLD, and authoritative servers.",
        status: "done",
        route: "/net",
        topics: ["recursive resolution", "caching"],
      },
    ],
  },
  {
    order: 7,
    id: "algorithms",
    title: "Algorithms & Data Structures",
    subtitle: "The software layer",
    modules: [
      {
        id: "algo-sorting",
        title: "Sorting Suite",
        description:
          "Six sorting algorithms, live operation counters, adversarial input distributions, and head-to-head race mode.",
        status: "done",
        route: "/algorithms",
        topics: ["comparison sorts", "complexity in practice"],
      },
      {
        id: "algo-pathfinding",
        title: "Pathfinding",
        description:
          "BFS, DFS, Dijkstra, and A* explore a grid you draw — powered by a hand-rolled binary heap.",
        status: "planned",
        topics: ["graph traversal", "priority queues", "heuristics"],
      },
      {
        id: "algo-hash",
        title: "Hash Table Internals",
        description:
          "Chaining vs. open addressing, collisions, tombstones, and resize animations.",
        status: "planned",
        topics: ["hashing", "load factor", "amortized analysis"],
      },
    ],
  },
];

/** Review layer — spaced-repetition quiz across all domains. */
export const reviewLayer: CurriculumLayer = {
  order: 0,
  id: "review",
  title: "Spaced Repetition Review",
  subtitle: "Reinforce everything you've learned",
  modules: [
    {
      id: "quiz",
      title: "Quiz",
      description:
        "Flash cards spanning all seven simulator domains — logic, CPU, arch, OS, compilers, networking, and algorithms — scheduled by the SM-2 spaced-repetition algorithm.",
      status: "done",
      route: "/quiz",
      topics: ["spaced repetition", "SM-2", "all domains"],
    },
  ],
};

/** Layers ordered for display: highest abstraction on top, NAND at the bottom. */
export const layersTopDown: readonly CurriculumLayer[] = [
  ...curriculum,
  reviewLayer,
].sort((a, b) => b.order - a.order);
