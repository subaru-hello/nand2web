import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, DocsShell } from "../../features/docs";

export const Route = createFileRoute("/docs/oss")({
  component: Page,
});

function Page() {
  return (
    <DocsShell active="oss">
      <ComingSoon id="oss" />
    </DocsShell>
  );
}
