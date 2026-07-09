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
