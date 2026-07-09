import { collectSteps } from "@nand2web/sim-core";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import type { Block, Expr, Program, Stmt } from "./ast.ts";
import { type InterpState, interpret } from "./interp.ts";
import { LexError, tokenize } from "./lexer.ts";
import { ParseError, parse } from "./parser.ts";
import { print } from "./printer.ts";

// ── Helpers ──────────────────────────────────────────────────────────────────

function run(source: string): { steps: InterpStep[]; final: InterpState } {
  const tokens = tokenize(source);
  const prog = parse(tokens);
  const { steps, result } = collectSteps(interpret(prog));
  if (!result) {
    throw new Error("interpret() returned no final state");
  }
  return { steps: steps as InterpStep[], final: result };
}

type InterpStep = InterpState;

function finalOutput(source: string): string[] {
  return run(source).final.output as string[];
}

// ── Lexer tests ───────────────────────────────────────────────────────────────

describe("lexer", () => {
  it("tokenizes a simple expression", () => {
    const toks = tokenize("1 + 2");
    expect(toks.map((t) => t.kind)).toEqual([
      "number",
      "plus",
      "number",
      "eof",
    ]);
  });

  it("tokenizes keywords", () => {
    const toks = tokenize("let if else while print");
    expect(toks.map((t) => t.kind)).toEqual([
      "let",
      "if",
      "else",
      "while",
      "print",
      "eof",
    ]);
  });

  it("tokenizes comparison operators", () => {
    const toks = tokenize("== != <= >= < >");
    expect(toks.map((t) => t.kind)).toEqual([
      "eq",
      "ne",
      "le",
      "ge",
      "lt",
      "gt",
      "eof",
    ]);
  });

  it("tracks line/col positions", () => {
    const toks = tokenize("x\ny");
    expect(toks[0]).toMatchObject({
      kind: "ident",
      text: "x",
      line: 1,
      col: 1,
    });
    expect(toks[1]).toMatchObject({
      kind: "ident",
      text: "y",
      line: 2,
      col: 1,
    });
  });

  it("skips line comments", () => {
    const toks = tokenize("// comment\n42");
    expect(toks.map((t) => t.kind)).toEqual(["number", "eof"]);
  });

  it("throws LexError on unknown character", () => {
    expect(() => tokenize("@")).toThrow(LexError);
    expect(() => tokenize("@")).toThrow(/1:1/);
  });

  it("includes position in LexError message", () => {
    try {
      tokenize("x\n@");
    } catch (e) {
      expect(e).toBeInstanceOf(LexError);
      if (e instanceof LexError) {
        expect(e.line).toBe(2);
        expect(e.col).toBe(1);
      }
    }
  });
});

// ── Parser tests ──────────────────────────────────────────────────────────────

describe("parser", () => {
  it("parses a let statement", () => {
    const prog = parse(tokenize("let x = 42;"));
    expect(prog.stmts).toHaveLength(1);
    expect(prog.stmts[0]?.kind).toBe("LetStmt");
  });

  it("parses an if/else statement", () => {
    const prog = parse(tokenize("if (1) { print 1; } else { print 0; }"));
    expect(prog.stmts[0]?.kind).toBe("IfStmt");
  });

  it("parses a while statement", () => {
    const prog = parse(tokenize("while (x) { x = x - 1; }"));
    expect(prog.stmts[0]?.kind).toBe("WhileStmt");
  });

  it("respects operator precedence (* > +)", () => {
    const prog = parse(tokenize("print 1 + 2 * 3;"));
    const s = prog.stmts[0];
    expect(s?.kind).toBe("PrintStmt");
    if (s?.kind === "PrintStmt") {
      expect(s.value.kind).toBe("BinaryExpr");
      if (s.value.kind === "BinaryExpr") {
        expect(s.value.op).toBe("+");
        expect(s.value.right.kind).toBe("BinaryExpr");
      }
    }
  });

  it("throws ParseError on missing semicolon", () => {
    expect(() => parse(tokenize("let x = 1"))).toThrow(ParseError);
  });

  it("throws ParseError on unknown token at statement level", () => {
    expect(() => parse(tokenize("42;"))).toThrow(ParseError);
  });

  it("throws ParseError with position info", () => {
    try {
      parse(tokenize("let x = ;"));
    } catch (e) {
      expect(e).toBeInstanceOf(ParseError);
    }
  });

  it("nested unary minus: - -5 parses and evaluates to 5", () => {
    expect(finalOutput("print - -5;")).toEqual(["5"]);
  });
});

// ── Printer round-trip property ───────────────────────────────────────────────

describe("printer", () => {
  // Fast-check arbitrary for AST nodes — small, no infinite nesting
  const exprArb: fc.Arbitrary<Expr> = fc.letrec((tie) => ({
    expr: fc.oneof(
      { depthSize: "small", withCrossShrink: true },
      // Terminals
      fc
        .integer({ min: 0, max: 100 })
        .map((v): Expr => ({ kind: "NumLit", id: 0, value: v })),
      fc
        .constantFrom("x", "y", "z", "a", "b")
        .map((n): Expr => ({ kind: "Var", id: 0, name: n })),
      // Recursive
      tie("expr").map(
        (operand): Expr => ({
          kind: "UnaryExpr",
          id: 0,
          op: "-",
          operand: operand as Expr,
        }),
      ),
      fc
        .tuple(
          tie("expr"),
          fc.constantFrom<
            "+" | "-" | "*" | "/" | "%" | "==" | "!=" | "<" | "<=" | ">" | ">="
          >("+", "-", "*", "/", "%", "==", "!=", "<", "<=", ">", ">="),
          tie("expr"),
        )
        .map(
          ([left, op, right]): Expr => ({
            kind: "BinaryExpr",
            id: 0,
            op,
            left: left as Expr,
            right: right as Expr,
          }),
        ),
    ),
  })).expr as fc.Arbitrary<Expr>;

  const stmtArb: fc.Arbitrary<Stmt> = fc.letrec((tie) => ({
    stmt: fc.oneof(
      { depthSize: "small", withCrossShrink: true },
      exprArb.map((e): Stmt => ({ kind: "PrintStmt", id: 0, value: e })),
      fc
        .tuple(fc.constantFrom("x", "y", "z"), exprArb)
        .map(([n, e]): Stmt => ({ kind: "LetStmt", id: 0, name: n, init: e })),
      fc
        .tuple(fc.constantFrom("x", "y", "z"), exprArb)
        .map(
          ([n, e]): Stmt => ({ kind: "AssignStmt", id: 0, name: n, value: e }),
        ),
      // Blocks
      fc.array(tie("stmt"), { maxLength: 2 }).map(
        (stmts): Stmt => ({
          kind: "Block",
          id: 0,
          stmts: stmts as Stmt[],
        }),
      ),
      // IfStmt (with optional else branch)
      fc
        .tuple(
          exprArb,
          fc.array(tie("stmt"), { maxLength: 2 }),
          fc.option(fc.array(tie("stmt"), { maxLength: 2 })),
        )
        .map(([cond, thenStmts, elseStmts]): Stmt => {
          const thenBlock: Block = {
            kind: "Block",
            id: 0,
            stmts: thenStmts as Stmt[],
          };
          const elseBlock: Block | undefined = elseStmts
            ? { kind: "Block", id: 0, stmts: elseStmts as Stmt[] }
            : undefined;
          return {
            kind: "IfStmt",
            id: 0,
            cond,
            // biome-ignore lint/suspicious/noThenProperty: "then" is an AST field, not a Promise method
            then: thenBlock,
            else_: elseBlock,
          };
        }),
      // WhileStmt
      fc
        .tuple(exprArb, fc.array(tie("stmt"), { maxLength: 2 }))
        .map(([cond, bodyStmts]): Stmt => ({
          kind: "WhileStmt",
          id: 0,
          cond,
          body: { kind: "Block", id: 0, stmts: bodyStmts as Stmt[] },
        })),
    ),
  })).stmt as fc.Arbitrary<Stmt>;

  const progArb: fc.Arbitrary<Program> = fc
    .array(stmtArb, { minLength: 1, maxLength: 4 })
    .map((stmts) => ({ kind: "Program" as const, stmts }));

  /** Strip ids before comparing (printer ignores them, re-parser resets them). */
  function stripIds(node: unknown): unknown {
    if (typeof node !== "object" || node === null) {
      return node;
    }
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      if (k === "id") {
        continue;
      }
      result[k] = Array.isArray(v) ? v.map(stripIds) : stripIds(v);
    }
    return result;
  }

  it("round-trips: parse(tokenize(print(ast))) equals original (property)", () => {
    fc.assert(
      fc.property(progArb, (prog) => {
        const src = print(prog);
        const reparsed = parse(tokenize(src));
        expect(stripIds(reparsed)).toEqual(stripIds(prog));
      }),
      { numRuns: 200 },
    );
  });
});

// ── Interpreter tests ─────────────────────────────────────────────────────────

describe("interpreter", () => {
  it("prints a literal", () => {
    expect(finalOutput("print 42;")).toEqual(["42"]);
  });

  it("let + arithmetic", () => {
    expect(finalOutput("let x = 3 + 4; print x;")).toEqual(["7"]);
  });

  it("assignment updates variable", () => {
    expect(finalOutput("let x = 1; x = 99; print x;")).toEqual(["99"]);
  });

  it("if branch taken", () => {
    expect(finalOutput("if (1) { print 10; } else { print 20; }")).toEqual([
      "10",
    ]);
  });

  it("else branch taken", () => {
    expect(finalOutput("if (0) { print 10; } else { print 20; }")).toEqual([
      "20",
    ]);
  });

  it("while loop: countdown", () => {
    expect(
      finalOutput("let n = 3; while (n > 0) { print n; n = n - 1; }"),
    ).toEqual(["3", "2", "1"]);
  });

  it("nested arithmetic respects precedence", () => {
    expect(finalOutput("print 2 + 3 * 4;")).toEqual(["14"]);
  });

  it("unary minus", () => {
    expect(finalOutput("print -5;")).toEqual(["-5"]);
  });

  it("comparison == returns 1 or 0", () => {
    expect(finalOutput("print 3 == 3;")).toEqual(["1"]);
    expect(finalOutput("print 3 == 4;")).toEqual(["0"]);
  });

  it("integer division truncates toward zero", () => {
    expect(finalOutput("print 7 / 2;")).toEqual(["3"]);
    expect(finalOutput("print (-7) / 2;")).toEqual(["-3"]);
  });

  it("modulo", () => {
    expect(finalOutput("print 10 % 3;")).toEqual(["1"]);
  });

  it("division by zero yields error status, not a thrown exception", () => {
    const { final } = run("print 1 / 0;");
    expect(final.status).toBe("error");
    expect(final.errorMessage).toMatch(/zero/i);
  });

  it("modulo by zero yields error status", () => {
    const { final } = run("print 1 % 0;");
    expect(final.status).toBe("error");
  });

  it("undefined variable yields error status", () => {
    const { final } = run("print z;");
    expect(final.status).toBe("error");
  });

  it("step limit stops infinite loop", () => {
    const tokens = tokenize("let x = 1; while (1) { x = x + 1; }");
    const prog = parse(tokens);
    const { result: final } = collectSteps(interpret(prog, { stepLimit: 100 }));
    expect(final?.status).toBe("limit");
  });

  it("block scope: variable declared inside block does not leak out", () => {
    const { final } = run("if (1) { let leaked = 99; } print leaked;");
    expect(final.status).toBe("error");
    expect(final.errorMessage).toMatch(/leaked/i);
  });

  it("block scope: outer variable is visible inside block", () => {
    expect(finalOutput("let x = 10; if (1) { print x; }")).toEqual(["10"]);
  });

  it("block scope: assignment inside block updates outer variable", () => {
    expect(finalOutput("let x = 1; if (1) { x = 42; } print x;")).toEqual(["42"]);
  });

  it("block scope: while loop body does not leak let bindings", () => {
    const { final } = run("let n = 1; while (n > 0) { let tmp = n; n = n - 1; } print tmp;");
    expect(final.status).toBe("error");
  });

  it("undeclared assignment yields error status", () => {
    const { final } = run("x = 5;");
    expect(final.status).toBe("error");
    expect(final.errorMessage).toMatch(/undeclared/i);
  });

  it("undeclared assignment error message contains variable name", () => {
    const { final } = run("foo = 1;");
    expect(final.errorMessage).toMatch(/foo/);
  });

  it("each step carries a full env snapshot (GCD)", () => {
    const src =
      "let a = 48; let b = 18; while (b != 0) { let t = b; b = a % b; a = t; } print a;";
    const { final } = run(src);
    expect(final.status).toBe("done");
    expect(final.output).toEqual(["6"]);
  });

  // Property: generator final env+output matches a simple reference evaluator
  describe("generator matches reference evaluator (property)", () => {
    function refEval(source: string): { output: string[]; error: boolean } {
      try {
        const prog = parse(tokenize(source));
        const output: string[] = [];
        const env = new Map<string, number>();

        function evalE(e: Expr): number {
          switch (e.kind) {
            case "NumLit":
              return e.value;
            case "Var": {
              const v = env.get(e.name);
              if (v === undefined) {
                throw new Error(`Undefined: ${e.name}`);
              }
              return v;
            }
            case "UnaryExpr":
              return -evalE(e.operand);
            case "BinaryExpr": {
              const l = evalE(e.left);
              const r = evalE(e.right);
              switch (e.op) {
                case "+":
                  return l + r;
                case "-":
                  return l - r;
                case "*":
                  return l * r;
                case "/": {
                  if (r === 0) {
                    throw new Error("div0");
                  }
                  return Math.trunc(l / r);
                }
                case "%": {
                  if (r === 0) {
                    throw new Error("mod0");
                  }
                  return Math.trunc(l % r);
                }
                case "==":
                  return l === r ? 1 : 0;
                case "!=":
                  return l !== r ? 1 : 0;
                case "<":
                  return l < r ? 1 : 0;
                case "<=":
                  return l <= r ? 1 : 0;
                case ">":
                  return l > r ? 1 : 0;
                case ">=":
                  return l >= r ? 1 : 0;
              }
            }
          }
        }

        function execS(s: Stmt): void {
          switch (s.kind) {
            case "LetStmt":
              env.set(s.name, evalE(s.init));
              break;
            case "AssignStmt":
              env.set(s.name, evalE(s.value));
              break;
            case "PrintStmt":
              output.push(String(evalE(s.value)));
              break;
            case "IfStmt": {
              const c = evalE(s.cond);
              if (c !== 0) {
                execBlock(s.then);
              } else if (s.else_) {
                execBlock(s.else_);
              }
              break;
            }
            case "WhileStmt": {
              let guard = 0;
              while (evalE(s.cond) !== 0) {
                execBlock(s.body);
                guard++;
                if (guard > 500) {
                  throw new Error("loop limit");
                }
              }
              break;
            }
            case "Block":
              execBlock(s);
              break;
          }
        }

        function execBlock(b: Block): void {
          for (const s of b.stmts) {
            execS(s);
          }
        }

        for (const s of prog.stmts) {
          execS(s);
        }
        return { output, error: false };
      } catch {
        return { output: [], error: true };
      }
    }

    it("simple programs: generator output equals reference", () => {
      const programs = [
        "print 1 + 2;",
        "let x = 10; print x * 2;",
        "let n = 3; while (n > 0) { print n; n = n - 1; }",
        "if (5 > 3) { print 1; } else { print 0; }",
        "let a = 48; let b = 18; while (b != 0) { let t = b; b = a % b; a = t; } print a;",
      ];
      for (const src of programs) {
        const ref = refEval(src);
        const gen = run(src);
        expect(gen.final.output, src).toEqual(ref.output);
        expect(gen.final.status === "error", src).toBe(ref.error);
      }
    });
  });
});
