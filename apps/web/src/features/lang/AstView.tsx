import type { Block, Expr, Program, Stmt } from "@nand2web/lang";

interface Props {
  program: Program;
  activeId: number;
}

export function AstView({ program, activeId }: Props) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 overflow-auto max-h-80">
      <div className="space-y-1">
        {program.stmts.map((s) => (
          <StmtNode key={s.id} node={s} activeId={activeId} />
        ))}
      </div>
    </div>
  );
}

function highlight(id: number, activeId: number): string {
  return id === activeId
    ? "border-sky-500 bg-sky-950/60 text-sky-200"
    : "border-zinc-800 bg-zinc-900/40 text-zinc-400";
}

function StmtNode({ node, activeId }: { node: Stmt; activeId: number }) {
  const hl = highlight(node.id, activeId);
  switch (node.kind) {
    case "LetStmt":
      return (
        <div className={`rounded border px-2 py-1 text-[11px] font-mono ${hl}`}>
          <span className="text-violet-400">let</span>{" "}
          <span className="text-zinc-200">{node.name}</span> ={" "}
          <ExprNode node={node.init} activeId={activeId} />
        </div>
      );
    case "AssignStmt":
      return (
        <div className={`rounded border px-2 py-1 text-[11px] font-mono ${hl}`}>
          <span className="text-zinc-200">{node.name}</span> ={" "}
          <ExprNode node={node.value} activeId={activeId} />
        </div>
      );
    case "PrintStmt":
      return (
        <div className={`rounded border px-2 py-1 text-[11px] font-mono ${hl}`}>
          <span className="text-violet-400">print</span>{" "}
          <ExprNode node={node.value} activeId={activeId} />
        </div>
      );
    case "IfStmt":
      return (
        <div
          className={`rounded border px-2 py-1 text-[11px] font-mono space-y-1 ${hl}`}
        >
          <div>
            <span className="text-violet-400">if</span>{" "}
            <ExprNode node={node.cond} activeId={activeId} />
          </div>
          <div className="ml-3 space-y-1">
            <BlockNode node={node.then} activeId={activeId} />
            {node.else_ && (
              <>
                <span className="text-violet-400 text-[11px]">else</span>
                <BlockNode node={node.else_} activeId={activeId} />
              </>
            )}
          </div>
        </div>
      );
    case "WhileStmt":
      return (
        <div
          className={`rounded border px-2 py-1 text-[11px] font-mono space-y-1 ${hl}`}
        >
          <div>
            <span className="text-violet-400">while</span>{" "}
            <ExprNode node={node.cond} activeId={activeId} />
          </div>
          <div className="ml-3">
            <BlockNode node={node.body} activeId={activeId} />
          </div>
        </div>
      );
    case "Block":
      return <BlockNode node={node} activeId={activeId} />;
  }
}

function BlockNode({ node, activeId }: { node: Block; activeId: number }) {
  const hl = highlight(node.id, activeId);
  return (
    <div className={`rounded border px-2 py-1 space-y-1 ${hl}`}>
      {node.stmts.map((s) => (
        <StmtNode key={s.id} node={s} activeId={activeId} />
      ))}
    </div>
  );
}

function ExprNode({ node, activeId }: { node: Expr; activeId: number }) {
  const hl = highlight(node.id, activeId);
  switch (node.kind) {
    case "NumLit":
      return (
        <span
          className={`rounded border px-1 py-0.5 text-[11px] font-mono ${hl}`}
        >
          <span className="text-emerald-400">{node.value}</span>
        </span>
      );
    case "Var":
      return (
        <span
          className={`rounded border px-1 py-0.5 text-[11px] font-mono ${hl}`}
        >
          <span className="text-zinc-200">{node.name}</span>
        </span>
      );
    case "UnaryExpr":
      return (
        <span
          className={`rounded border px-1 py-0.5 text-[11px] font-mono inline-flex items-center gap-1 ${hl}`}
        >
          <span className="text-sky-300">-</span>
          <ExprNode node={node.operand} activeId={activeId} />
        </span>
      );
    case "BinaryExpr":
      return (
        <span
          className={`rounded border px-1 py-0.5 text-[11px] font-mono inline-flex items-center gap-1 ${hl}`}
        >
          <ExprNode node={node.left} activeId={activeId} />
          <span className="text-sky-300">{node.op}</span>
          <ExprNode node={node.right} activeId={activeId} />
        </span>
      );
  }
}
