import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, DocsShell } from "../../features/docs";

export const Route = createFileRoute("/docs/software-engineering")({
  component: Page,
});

function Page() {
  return (
    <DocsShell active="software-engineering">
      <ComingSoon id="software-engineering" />
    </DocsShell>
  );
}
