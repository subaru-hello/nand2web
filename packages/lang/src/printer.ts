/**
 * Canonical pretty-printer for the Tiny AST.
 * print(ast) → string that round-trips through parse(tokenize(...)).
 */

import type { Block, Expr, Program, Stmt } from "./ast.ts";

export function print(prog: Program): string {
  return prog.stmts.map((s) => printStmt(s, 0)).join("\n");
}

function indent(depth: number): string {
  return "  ".repeat(depth);
}

function printStmt(s: Stmt, depth: number): string {
  const ind = indent(depth);
  switch (s.kind) {
    case "LetStmt":
      return `${ind}let ${s.name} = ${printExpr(s.init)};`;
    case "AssignStmt":
      return `${ind}${s.name} = ${printExpr(s.value)};`;
    case "PrintStmt":
      return `${ind}print ${printExpr(s.value)};`;
    case "IfStmt": {
      const thenStr = printBlock(s.then, depth);
      const elseStr = s.else_ ? ` else ${printBlock(s.else_, depth)}` : "";
      return `${ind}if (${printExpr(s.cond)}) ${thenStr}${elseStr}`;
    }
    case "WhileStmt":
      return `${ind}while (${printExpr(s.cond)}) ${printBlock(s.body, depth)}`;
    case "Block":
      return printBlock(s, depth);
  }
}

function printBlock(b: Block, depth: number): string {
  if (b.stmts.length === 0) {
    return "{}";
  }
  const body = b.stmts.map((s) => printStmt(s, depth + 1)).join("\n");
  return `{\n${body}\n${indent(depth)}}`;
}

function printExpr(e: Expr): string {
  switch (e.kind) {
    case "NumLit":
      return String(e.value);
    case "Var":
      return e.name;
    case "UnaryExpr":
      return `(-${printExpr(e.operand)})`;
    case "BinaryExpr":
      return `(${printExpr(e.left)} ${e.op} ${printExpr(e.right)})`;
  }
}
