# nand2web

> Learn how computers work, from NAND gates to the web — interactively.

**Live demo: [cs.n10u.jp](https://cs.n10u.jp)**

nand2web is an interactive computer-science curriculum. Every concept — from a single NAND gate up to a running CPU, compilers, operating systems, and network protocols — is taught with a step-by-step visual simulator you can drive yourself.

## Curriculum

| Layer | Module | Status |
|---|---|---|
| 1 | [Digital Logic](https://cs.n10u.jp/logic) — NAND → gates → adder → flip-flop → ALU | ✅ done |
| 2 | [4-bit CPU](https://cs.n10u.jp/cpu) — fetch/decode/execute, tiny ISA + assembler | ✅ done |
| 3 | Computer Architecture — pipelining, cache hierarchy | 📋 planned |
| 4 | Operating Systems — scheduling, virtual memory | 📋 planned |
| 5 | Compilers & Languages — lexer → parser → AST → eval | 📋 planned |
| 6 | Networking — encapsulation, TCP, DNS | 📋 planned |
| 7 | Algorithms & Data Structures — sorting, pathfinding, hashing | 📋 planned |

## Architecture

One playback engine, seven domains: every simulator is a pure, dependency-free TypeScript generator that yields steps (`packages/*`), and the React app (`apps/web`) replays those steps through a single shared playback engine. No simulator knows anything about the DOM.

```
packages/sim-core   ← shared simulation protocol (steps, replay, seeded RNG)
packages/logic ...  ← pure domain simulators (generators, zero deps)
apps/web            ← React 19 + TanStack Router + Tailwind, replays steps
```

## Development

```sh
pnpm install
pnpm dev        # start the web app
pnpm test       # unit + property-based tests (Vitest + fast-check)
pnpm lint       # Biome
pnpm build
```

## License

MIT
