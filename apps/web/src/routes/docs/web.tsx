import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, DocsShell } from "../../features/docs";

export const Route = createFileRoute("/docs/web")({
  component: Page,
});

function Page() {
  return (
    <DocsShell active="web">
      <ComingSoon id="web" />
    </DocsShell>
  );
}
