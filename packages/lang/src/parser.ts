/**
 * Recursive-descent parser for Tiny.
 * parse(tokens) → Program AST.
 * Node IDs are assigned sequentially starting from 0.
 */

import type {
  AssignStmt,
  BinaryExpr,
  Block,
  Expr,
  IfStmt,
  LetStmt,
  PrintStmt,
  Program,
  Stmt,
  WhileStmt,
} from "./ast.ts";
import type { Token, TokenKind } from "./lexer.ts";

export class ParseError extends Error {
  constructor(
    message: string,
    readonly line: number,
    readonly col: number,
  ) {
    super(`Parse error at ${line}:${col} — ${message}`);
    this.name = "ParseError";
  }
}

export function parse(tokens: readonly Token[]): Program {
  const parser = new Parser(tokens);
  return parser.parseProgram();
}

class Parser {
  private pos = 0;
  private nextId = 0;

  constructor(private readonly tokens: readonly Token[]) {}

  private id(): number {
    return this.nextId++;
  }

  private peek(): Token {
    return this.tokens[this.pos] ?? { kind: "eof", text: "", line: 0, col: 0 };
  }

  private advance(): Token {
    const t = this.peek();
    if (t.kind !== "eof") {
      this.pos++;
    }
    return t;
  }

  private expect(kind: TokenKind): Token {
    const t = this.peek();
    if (t.kind !== kind) {
      throw new ParseError(
        `expected '${kindStr(kind)}' but got '${t.text || kindStr(t.kind)}'`,
        t.line,
        t.col,
      );
    }
    return this.advance();
  }

  parseProgram(): Program {
    const stmts: Stmt[] = [];
    while (this.peek().kind !== "eof") {
      stmts.push(this.parseStmt());
    }
    return { kind: "Program", stmts };
  }

  private parseStmt(): Stmt {
    const t = this.peek();

    if (t.kind === "let") {
      return this.parseLet();
    }
    if (t.kind === "if") {
      return this.parseIf();
    }
    if (t.kind === "while") {
      return this.parseWhile();
    }
    if (t.kind === "print") {
      return this.parsePrint();
    }
    if (t.kind === "lbrace") {
      return this.parseBlock();
    }
    // Assignment: ident = expr ;
    if (t.kind === "ident") {
      return this.parseAssign();
    }

    throw new ParseError(
      `unexpected token '${t.text || kindStr(t.kind)}'`,
      t.line,
      t.col,
    );
  }

  private parseLet(): LetStmt {
    this.advance(); // 'let'
    const name = this.expect("ident").text;
    this.expect("assign");
    const init = this.parseExpr();
    this.expect("semi");
    return { kind: "LetStmt", id: this.id(), name, init };
  }

  private parseAssign(): AssignStmt {
    const name = this.advance().text; // ident
    this.expect("assign");
    const value = this.parseExpr();
    this.expect("semi");
    return { kind: "AssignStmt", id: this.id(), name, value };
  }

  private parseIf(): IfStmt {
    this.advance(); // 'if'
    this.expect("lparen");
    const cond = this.parseExpr();
    this.expect("rparen");
    const then = this.parseBlock();
    if (this.peek().kind === "else") {
      this.advance();
      const else_ = this.parseBlock();
      return { kind: "IfStmt", id: this.id(), cond, then, else_ };
    }
    return { kind: "IfStmt", id: this.id(), cond, then };
  }

  private parseWhile(): WhileStmt {
    this.advance(); // 'while'
    this.expect("lparen");
    const cond = this.parseExpr();
    this.expect("rparen");
    const body = this.parseBlock();
    return { kind: "WhileStmt", id: this.id(), cond, body };
  }

  private parsePrint(): PrintStmt {
    this.advance(); // 'print'
    const value = this.parseExpr();
    this.expect("semi");
    return { kind: "PrintStmt", id: this.id(), value };
  }

  private parseBlock(): Block {
    this.expect("lbrace");
    const stmts: Stmt[] = [];
    while (this.peek().kind !== "rbrace" && this.peek().kind !== "eof") {
      stmts.push(this.parseStmt());
    }
    this.expect("rbrace");
    return { kind: "Block", id: this.id(), stmts };
  }

  // ── Expression grammar (precedence via method chain) ────────────────────

  private parseExpr(): Expr {
    return this.parseComparison();
  }

  private parseComparison(): Expr {
    let left = this.parseAddSub();
    while (true) {
      const k = this.peek().kind;
      if (
        k !== "eq" &&
        k !== "ne" &&
        k !== "lt" &&
        k !== "le" &&
        k !== "gt" &&
        k !== "ge"
      ) {
        break;
      }
      const op = this.advance().text as BinaryExpr["op"];
      const right = this.parseAddSub();
      left = { kind: "BinaryExpr", id: this.id(), op, left, right };
    }
    return left;
  }

  private parseAddSub(): Expr {
    let left = this.parseMulDiv();
    while (true) {
      const k = this.peek().kind;
      if (k !== "plus" && k !== "minus") {
        break;
      }
      const op = this.advance().text as BinaryExpr["op"];
      const right = this.parseMulDiv();
      left = { kind: "BinaryExpr", id: this.id(), op, left, right };
    }
    return left;
  }

  private parseMulDiv(): Expr {
    let left = this.parseUnary();
    while (true) {
      const k = this.peek().kind;
      if (k !== "star" && k !== "slash" && k !== "percent") {
        break;
      }
      const op = this.advance().text as BinaryExpr["op"];
      const right = this.parseUnary();
      left = { kind: "BinaryExpr", id: this.id(), op, left, right };
    }
    return left;
  }

  private parseUnary(): Expr {
    if (this.peek().kind === "minus") {
      this.advance();
      const operand = this.parseUnary();
      return { kind: "UnaryExpr", id: this.id(), op: "-", operand };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): Expr {
    const t = this.peek();
    if (t.kind === "number") {
      this.advance();
      return {
        kind: "NumLit",
        id: this.id(),
        value: Number.parseInt(t.text, 10),
      };
    }
    if (t.kind === "ident") {
      this.advance();
      return { kind: "Var", id: this.id(), name: t.text };
    }
    if (t.kind === "lparen") {
      this.advance();
      const expr = this.parseExpr();
      this.expect("rparen");
      return expr;
    }
    throw new ParseError(
      `expected expression but got '${t.text || kindStr(t.kind)}'`,
      t.line,
      t.col,
    );
  }
}

function kindStr(kind: TokenKind): string {
  const map: Partial<Record<TokenKind, string>> = {
    semi: ";",
    assign: "=",
    lparen: "(",
    rparen: ")",
    lbrace: "{",
    rbrace: "}",
    eof: "<eof>",
  };
  return map[kind] ?? kind;
}
