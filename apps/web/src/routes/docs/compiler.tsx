import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, DocsShell } from "../../features/docs";

export const Route = createFileRoute("/docs/compiler")({
  component: Page,
});

function Page() {
  return (
    <DocsShell active="compiler">
      <ComingSoon id="compiler" />
    </DocsShell>
  );
}
