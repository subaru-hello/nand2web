import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, DocsShell } from "../../features/docs";

export const Route = createFileRoute("/docs/memory")({
  component: Page,
});

function Page() {
  return (
    <DocsShell active="memory">
      <ComingSoon id="memory" />
    </DocsShell>
  );
}
