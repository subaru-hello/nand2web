import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, DocsShell } from "../../features/docs";

export const Route = createFileRoute("/docs/llm")({
  component: Page,
});

function Page() {
  return (
    <DocsShell active="llm">
      <ComingSoon id="llm" />
    </DocsShell>
  );
}
