/**
 * Tree-walking evaluator for Tiny.
 * Implements the Simulation<InterpStep, InterpState> contract from sim-core.
 * Each yield carries a full snapshot of the interpreter state.
 */

import type { Simulation } from "@nand2web/sim-core";
import type { Block, Expr, Program, Stmt } from "./ast.ts";

// ── Public types ─────────────────────────────────────────────────────────────

export type Env = ReadonlyMap<string, number>;

export interface InterpState {
  /** Currently executing node id (or -1 before first step). */
  readonly activeId: number;
  /** Human-readable description of the current step. */
  readonly label: string;
  /** All variables in scope (flattened — child scopes shadow parents). */
  readonly env: Env;
  /** Lines printed so far. */
  readonly output: readonly string[];
  /** Status. */
  readonly status: "running" | "done" | "error" | "limit";
  /** Error message if status === "error". */
  readonly errorMessage?: string | undefined;
}

export type InterpStep = InterpState;

// ── Step limit ───────────────────────────────────────────────────────────────

const DEFAULT_STEP_LIMIT = 10_000;

// ── Generator ────────────────────────────────────────────────────────────────

/**
 * Run a Tiny program as a pure generator. Yields one InterpStep per
 * expression evaluation or statement entry, returns the final InterpState.
 */
export function* interpret(
  program: Program,
  options?: { readonly stepLimit?: number },
): Simulation<InterpStep, InterpState> {
  const limit = options?.stepLimit ?? DEFAULT_STEP_LIMIT;
  let steps = 0;
  const output: string[] = [];

  // ── Scope chain ─────────────────────────────────────────────────────────────
  // Each scope frame holds its own bindings plus a reference to its parent.
  interface ScopeFrame {
    bindings: Map<string, number>;
    parent: ScopeFrame | null;
  }

  let currentScope: ScopeFrame = { bindings: new Map(), parent: null };

  /** Look up a variable name through the scope chain. */
  function scopeLookup(name: string): number | undefined {
    let frame: ScopeFrame | null = currentScope;
    while (frame !== null) {
      const v = frame.bindings.get(name);
      if (v !== undefined) {
        return v;
      }
      frame = frame.parent;
    }
    return undefined;
  }

  /**
   * Assign to an existing variable anywhere in the scope chain.
   * Returns false if not found.
   */
  function scopeAssign(name: string, value: number): boolean {
    let frame: ScopeFrame | null = currentScope;
    while (frame !== null) {
      if (frame.bindings.has(name)) {
        frame.bindings.set(name, value);
        return true;
      }
      frame = frame.parent;
    }
    return false;
  }

  /** Declare a new variable in the current (innermost) scope. */
  function scopeDeclare(name: string, value: number): void {
    currentScope.bindings.set(name, value);
  }

  /** Flatten the scope chain into a Map for UI display (child shadows parent). */
  function flattenScope(): Map<string, number> {
    const frames: ScopeFrame[] = [];
    let frame: ScopeFrame | null = currentScope;
    while (frame !== null) {
      frames.push(frame);
      frame = frame.parent;
    }
    // Build from outermost to innermost so inner bindings shadow outer.
    const flat = new Map<string, number>();
    for (let i = frames.length - 1; i >= 0; i--) {
      const f = frames[i];
      if (f !== undefined) {
        for (const [k, v] of f.bindings) {
          flat.set(k, v);
        }
      }
    }
    return flat;
  }

  const snapshot = (
    activeId: number,
    label: string,
    status: InterpState["status"] = "running",
    errorMessage?: string,
  ): InterpState => ({
    activeId,
    label,
    env: flattenScope(),
    output: [...output],
    status,
    errorMessage,
  });

  const tick = function* (
    activeId: number,
    label: string,
  ): Generator<InterpStep, void, void> {
    steps++;
    if (steps > limit) {
      return;
    }
    yield snapshot(activeId, label);
  };

  // Returns undefined when step limit exceeded (caller checks steps > limit)
  const evalExpr = function* (
    e: Expr,
  ): Generator<InterpStep, number | undefined, void> {
    yield* tick(e.id, describeExpr(e));
    if (steps > limit) {
      return undefined;
    }

    switch (e.kind) {
      case "NumLit":
        return e.value;

      case "Var": {
        const val = scopeLookup(e.name);
        if (val === undefined) {
          yield snapshot(
            e.id,
            `undefined variable '${e.name}'`,
            "error",
            `Undefined variable '${e.name}'`,
          );
          return undefined;
        }
        return val;
      }

      case "UnaryExpr": {
        const v = yield* evalExpr(e.operand);
        if (v === undefined) {
          return undefined;
        }
        return -v;
      }

      case "BinaryExpr": {
        const lv = yield* evalExpr(e.left);
        if (lv === undefined) {
          return undefined;
        }
        const rv = yield* evalExpr(e.right);
        if (rv === undefined) {
          return undefined;
        }
        switch (e.op) {
          case "+":
            return lv + rv;
          case "-":
            return lv - rv;
          case "*":
            return lv * rv;
          case "/": {
            if (rv === 0) {
              yield snapshot(
                e.id,
                "division by zero",
                "error",
                "Division by zero",
              );
              return undefined;
            }
            return Math.trunc(lv / rv);
          }
          case "%": {
            if (rv === 0) {
              yield snapshot(e.id, "modulo by zero", "error", "Modulo by zero");
              return undefined;
            }
            return Math.trunc(lv % rv);
          }
          case "==":
            return lv === rv ? 1 : 0;
          case "!=":
            return lv !== rv ? 1 : 0;
          case "<":
            return lv < rv ? 1 : 0;
          case "<=":
            return lv <= rv ? 1 : 0;
          case ">":
            return lv > rv ? 1 : 0;
          case ">=":
            return lv >= rv ? 1 : 0;
        }
      }
    }
  };

  // Run statements; returns true on success, false on error/limit
  const execStmt = function* (s: Stmt): Generator<InterpStep, boolean, void> {
    yield* tick(s.id, describeStmt(s));
    if (steps > limit) {
      return false;
    }

    switch (s.kind) {
      case "LetStmt": {
        const v = yield* evalExpr(s.init);
        if (v === undefined) {
          return false;
        }
        scopeDeclare(s.name, v);
        return true;
      }

      case "AssignStmt": {
        const v = yield* evalExpr(s.value);
        if (v === undefined) {
          return false;
        }
        if (!scopeAssign(s.name, v)) {
          yield snapshot(
            s.id,
            `assignment to undeclared variable '${s.name}'`,
            "error",
            `Assignment to undeclared variable '${s.name}'`,
          );
          return false;
        }
        return true;
      }

      case "PrintStmt": {
        const v = yield* evalExpr(s.value);
        if (v === undefined) {
          return false;
        }
        output.push(String(v));
        return true;
      }

      case "IfStmt": {
        const cond = yield* evalExpr(s.cond);
        if (cond === undefined) {
          return false;
        }
        const branch = cond !== 0 ? s.then : s.else_;
        if (branch) {
          return yield* execBlock(branch);
        }
        return true;
      }

      case "WhileStmt": {
        while (true) {
          const cond = yield* evalExpr(s.cond);
          if (cond === undefined) {
            return false;
          }
          if (cond === 0) {
            break;
          }
          const ok = yield* execBlock(s.body);
          if (!ok) {
            return false;
          }
        }
        return true;
      }

      case "Block":
        return yield* execBlock(s);
    }
  };

  const execBlock = function* (b: Block): Generator<InterpStep, boolean, void> {
    // Push a new scope frame on block entry.
    const saved = currentScope;
    currentScope = { bindings: new Map(), parent: saved };
    try {
      for (const stmt of b.stmts) {
        const ok = yield* execStmt(stmt);
        if (!ok) {
          return false;
        }
      }
      return true;
    } finally {
      // Pop back to the parent scope on block exit (error or normal).
      currentScope = saved;
    }
  };

  // Main loop
  let allOk = true;
  let errorSnapshot: InterpState | undefined;

  for (const stmt of program.stmts) {
    let lastYielded: InterpState | undefined;
    const gen = execStmt(stmt);
    while (true) {
      const next = gen.next();
      if (next.done) {
        allOk = next.value;
        break;
      }
      lastYielded = next.value;
      yield next.value;
    }
    if (!allOk) {
      errorSnapshot = lastYielded;
      break;
    }
  }

  if (steps > limit) {
    const final = snapshot(-1, "step limit reached", "limit");
    yield final;
    return final;
  }

  if (!allOk) {
    // The error step was already yielded inside the generator
    const msg = errorSnapshot?.errorMessage ?? "runtime error";
    const final = snapshot(-1, msg, "error", msg);
    return final;
  }

  const final = snapshot(-1, "done", "done");
  yield final;
  return final;
}

// ── Description helpers ───────────────────────────────────────────────────────

function describeExpr(e: Expr): string {
  switch (e.kind) {
    case "NumLit":
      return `evaluate ${e.value}`;
    case "Var":
      return `read ${e.name}`;
    case "UnaryExpr":
      return `negate`;
    case "BinaryExpr":
      return `evaluate ${e.op}`;
  }
}

function describeStmt(s: Stmt): string {
  switch (s.kind) {
    case "LetStmt":
      return `let ${s.name}`;
    case "AssignStmt":
      return `assign ${s.name}`;
    case "PrintStmt":
      return "print";
    case "IfStmt":
      return "if";
    case "WhileStmt":
      return "while";
    case "Block":
      return "block";
  }
}
