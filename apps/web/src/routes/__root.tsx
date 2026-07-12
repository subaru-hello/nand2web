import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { LangToggle } from "../features/deepdive/DeepDive";
import { makeHead } from "../features/seo/seo";

export const Route = createRootRoute({
  head: () =>
    makeHead({
      title: "nand2web — Learn how computers work, from NAND gates to the web",
      description:
        "An interactive computer-science curriculum. Step through NAND gates, a 4-bit CPU, compilers, operating systems, and network protocols with hands-on visual simulators.",
      path: "",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "nand2web",
        url: "https://cs.n10u.jp",
        description:
          "An interactive computer-science curriculum. Step through NAND gates, a 4-bit CPU, compilers, operating systems, and network protocols with hands-on visual simulators.",
        inLanguage: ["en", "ja"],
      },
      canonical: false,
    }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <HeadContent />
      <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 antialiased">
        <header className="border-b border-zinc-800/80">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
            <Link
              to="/"
              className="font-mono text-lg font-semibold tracking-tight"
            >
              <span className="text-emerald-400">nand</span>
              <span className="text-zinc-400">2</span>
              <span className="text-sky-400">web</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-zinc-400">
              <LangToggle />
              <Link
                to="/docs"
                className="transition-colors hover:text-zinc-100"
              >
                Docs
              </Link>
              <a
                href="https://github.com/subaru-hello/nand2web"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-zinc-100"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
          <Outlet />
        </main>
        <footer className="border-t border-zinc-800/80 py-8 text-center text-sm text-zinc-500">
          Built in the open · MIT License
        </footer>
      </div>
    </>
  );
}
