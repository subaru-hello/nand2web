import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, DocsShell } from "../../features/docs";

export const Route = createFileRoute("/docs/os")({
  component: Page,
});

function Page() {
  return (
    <DocsShell active="os">
      <ComingSoon id="os" />
    </DocsShell>
  );
}
