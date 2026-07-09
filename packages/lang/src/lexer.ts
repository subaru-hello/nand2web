/**
 * Tiny language lexer — tokenize(source) → Token[].
 * Unknown characters produce a LexError.
 */

export type TokenKind =
  | "number"
  | "ident"
  | "let"
  | "if"
  | "else"
  | "while"
  | "print"
  | "plus"
  | "minus"
  | "star"
  | "slash"
  | "percent"
  | "eq"
  | "ne"
  | "lt"
  | "le"
  | "gt"
  | "ge"
  | "assign"
  | "lparen"
  | "rparen"
  | "lbrace"
  | "rbrace"
  | "semi"
  | "eof";

export interface Token {
  readonly kind: TokenKind;
  readonly text: string;
  readonly line: number;
  readonly col: number;
}

export class LexError extends Error {
  constructor(
    message: string,
    readonly line: number,
    readonly col: number,
  ) {
    super(`Lex error at ${line}:${col} — ${message}`);
    this.name = "LexError";
  }
}

const KEYWORDS: ReadonlyMap<string, TokenKind> = new Map([
  ["let", "let"],
  ["if", "if"],
  ["else", "else"],
  ["while", "while"],
  ["print", "print"],
]);

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;
  let line = 1;
  let lineStart = 0;

  const col = () => pos - lineStart + 1;

  while (pos < source.length) {
    const ch = source[pos];

    // Whitespace
    if (ch === "\n") {
      line++;
      lineStart = pos + 1;
      pos++;
      continue;
    }
    if (ch === " " || ch === "\t" || ch === "\r") {
      pos++;
      continue;
    }

    // Line comments
    if (ch === "/" && source[pos + 1] === "/") {
      while (pos < source.length && source[pos] !== "\n") {
        pos++;
      }
      continue;
    }

    const startLine = line;
    const startCol = col();

    // Numbers
    if (ch !== undefined && ch >= "0" && ch <= "9") {
      let text = "";
      while (pos < source.length) {
        const c = source[pos];
        if (c !== undefined && c >= "0" && c <= "9") {
          text += c;
          pos++;
        } else {
          break;
        }
      }
      tokens.push({ kind: "number", text, line: startLine, col: startCol });
      continue;
    }

    // Identifiers / keywords
    if (
      ch !== undefined &&
      (ch === "_" || (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z"))
    ) {
      let text = "";
      while (pos < source.length) {
        const c = source[pos];
        if (
          c !== undefined &&
          (c === "_" ||
            (c >= "a" && c <= "z") ||
            (c >= "A" && c <= "Z") ||
            (c >= "0" && c <= "9"))
        ) {
          text += c;
          pos++;
        } else {
          break;
        }
      }
      const kind = KEYWORDS.get(text) ?? "ident";
      tokens.push({ kind, text, line: startLine, col: startCol });
      continue;
    }

    // Two-character operators
    if (ch === "=" && source[pos + 1] === "=") {
      tokens.push({ kind: "eq", text: "==", line: startLine, col: startCol });
      pos += 2;
      continue;
    }
    if (ch === "!" && source[pos + 1] === "=") {
      tokens.push({ kind: "ne", text: "!=", line: startLine, col: startCol });
      pos += 2;
      continue;
    }
    if (ch === "<" && source[pos + 1] === "=") {
      tokens.push({ kind: "le", text: "<=", line: startLine, col: startCol });
      pos += 2;
      continue;
    }
    if (ch === ">" && source[pos + 1] === "=") {
      tokens.push({ kind: "ge", text: ">=", line: startLine, col: startCol });
      pos += 2;
      continue;
    }

    // Single-character tokens
    const single: Record<string, TokenKind> = {
      "+": "plus",
      "-": "minus",
      "*": "star",
      "/": "slash",
      "%": "percent",
      "<": "lt",
      ">": "gt",
      "=": "assign",
      "(": "lparen",
      ")": "rparen",
      "{": "lbrace",
      "}": "rbrace",
      ";": "semi",
    };

    if (ch !== undefined && ch in single) {
      const kind = single[ch];
      if (kind !== undefined) {
        tokens.push({ kind, text: ch, line: startLine, col: startCol });
      }
      pos++;
      continue;
    }

    throw new LexError(
      `unexpected character ${JSON.stringify(ch)}`,
      startLine,
      startCol,
    );
  }

  tokens.push({ kind: "eof", text: "", line, col: col() });
  return tokens;
}
