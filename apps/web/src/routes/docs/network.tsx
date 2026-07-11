import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, DocsShell } from "../../features/docs";

export const Route = createFileRoute("/docs/network")({
  component: Page,
});

function Page() {
  return (
    <DocsShell active="network">
      <ComingSoon id="network" />
    </DocsShell>
  );
}
