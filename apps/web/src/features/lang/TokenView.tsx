import type { Token, TokenKind } from "@nand2web/lang";

const KIND_COLOR: Partial<Record<TokenKind, string>> = {
  number: "text-emerald-400",
  ident: "text-zinc-200",
  let: "text-violet-400",
  if: "text-violet-400",
  else: "text-violet-400",
  while: "text-violet-400",
  print: "text-violet-400",
  plus: "text-sky-300",
  minus: "text-sky-300",
  star: "text-sky-300",
  slash: "text-sky-300",
  percent: "text-sky-300",
  eq: "text-yellow-300",
  ne: "text-yellow-300",
  lt: "text-yellow-300",
  le: "text-yellow-300",
  gt: "text-yellow-300",
  ge: "text-yellow-300",
  assign: "text-orange-300",
  semi: "text-zinc-500",
  lparen: "text-zinc-400",
  rparen: "text-zinc-400",
  lbrace: "text-zinc-400",
  rbrace: "text-zinc-400",
  eof: "text-zinc-700",
};

export function TokenView({ tokens }: { tokens: readonly Token[] }) {
  const visible = tokens.filter((t) => t.kind !== "eof");
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-3 min-h-[48px]">
      {visible.map((tok) => {
        const color = KIND_COLOR[tok.kind] ?? "text-zinc-300";
        return (
          <span
            key={`${tok.line}:${tok.col}`}
            title={`${tok.kind} (${tok.line}:${tok.col})`}
            className={`rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[11px] border border-zinc-800 ${color}`}
          >
            {tok.text || tok.kind}
          </span>
        );
      })}
    </div>
  );
}
