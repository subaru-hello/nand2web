import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, DocsShell } from "../../features/docs";

export const Route = createFileRoute("/docs/io")({
  component: Page,
});

function Page() {
  return (
    <DocsShell active="io">
      <ComingSoon id="io" />
    </DocsShell>
  );
}
