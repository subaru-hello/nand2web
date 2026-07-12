import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import "./styles.css";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Prerendered pages ship a baked-in <head> (title, canonical, description, OG,
// Twitter, JSON-LD) so JS-less crawlers can read them. Once the app boots,
// TanStack Router's <HeadContent> re-injects those tags — so strip the baked
// ones first to avoid duplicate <title>/<link rel=canonical>/meta at runtime.
for (const el of document.head.querySelectorAll(
  'title, link[rel="canonical"], meta[name="description"], meta[property^="og:"], meta[name^="twitter:"], script[type="application/ld+json"]',
)) {
  el.remove();
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
