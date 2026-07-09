/**
 * AST node types for the Tiny language.
 * All nodes carry a unique numeric id (assigned by the parser) so the
 * evaluator and UI can cross-reference them.
 */

// ── Expressions ─────────────────────────────────────────────────────────────

export interface NumLit {
  readonly kind: "NumLit";
  readonly id: number;
  readonly value: number;
}

export interface Var {
  readonly kind: "Var";
  readonly id: number;
  readonly name: string;
}

export interface UnaryExpr {
  readonly kind: "UnaryExpr";
  readonly id: number;
  readonly op: "-";
  readonly operand: Expr;
}

export interface BinaryExpr {
  readonly kind: "BinaryExpr";
  readonly id: number;
  readonly op:
    | "+"
    | "-"
    | "*"
    | "/"
    | "%"
    | "=="
    | "!="
    | "<"
    | "<="
    | ">"
    | ">=";
  readonly left: Expr;
  readonly right: Expr;
}

export type Expr = NumLit | Var | UnaryExpr | BinaryExpr;

// ── Statements ───────────────────────────────────────────────────────────────

export interface LetStmt {
  readonly kind: "LetStmt";
  readonly id: number;
  readonly name: string;
  readonly init: Expr;
}

export interface AssignStmt {
  readonly kind: "AssignStmt";
  readonly id: number;
  readonly name: string;
  readonly value: Expr;
}

export interface IfStmt {
  readonly kind: "IfStmt";
  readonly id: number;
  readonly cond: Expr;
  readonly then: Block;
  readonly else_?: Block | undefined;
}

export interface WhileStmt {
  readonly kind: "WhileStmt";
  readonly id: number;
  readonly cond: Expr;
  readonly body: Block;
}

export interface PrintStmt {
  readonly kind: "PrintStmt";
  readonly id: number;
  readonly value: Expr;
}

export interface Block {
  readonly kind: "Block";
  readonly id: number;
  readonly stmts: readonly Stmt[];
}

export type Stmt =
  | LetStmt
  | AssignStmt
  | IfStmt
  | WhileStmt
  | PrintStmt
  | Block;

// ── Program ──────────────────────────────────────────────────────────────────

export interface Program {
  readonly kind: "Program";
  readonly stmts: readonly Stmt[];
}

/** Collect all node ids in tree order (for highlighting). */
export function allNodeIds(prog: Program): number[] {
  const ids: number[] = [];
  for (const s of prog.stmts) {
    collectStmt(s, ids);
  }
  return ids;
}

function collectExpr(e: Expr, ids: number[]): void {
  ids.push(e.id);
  if (e.kind === "UnaryExpr") {
    collectExpr(e.operand, ids);
  } else if (e.kind === "BinaryExpr") {
    collectExpr(e.left, ids);
    collectExpr(e.right, ids);
  }
}

function collectStmt(s: Stmt, ids: number[]): void {
  ids.push(s.id);
  switch (s.kind) {
    case "LetStmt":
    case "AssignStmt":
      collectExpr(s.kind === "LetStmt" ? s.init : s.value, ids);
      break;
    case "PrintStmt":
      collectExpr(s.value, ids);
      break;
    case "IfStmt":
      collectExpr(s.cond, ids);
      collectBlock(s.then, ids);
      if (s.else_) {
        collectBlock(s.else_, ids);
      }
      break;
    case "WhileStmt":
      collectExpr(s.cond, ids);
      collectBlock(s.body, ids);
      break;
    case "Block":
      collectBlock(s, ids);
      break;
  }
}

function collectBlock(b: Block, ids: number[]): void {
  ids.push(b.id);
  for (const s of b.stmts) {
    collectStmt(s, ids);
  }
}
