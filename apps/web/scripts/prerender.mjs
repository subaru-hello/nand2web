/**
 * prerender.mjs — static prerenderer for nand2web
 *
 * Usage: node apps/web/scripts/prerender.mjs
 * (run from repo root after `pnpm build`)
 *
 * Starts a minimal http static server, uses Playwright chromium to snapshot
 * every route, then writes prerendered HTML + sitemap.xml + llms.txt + llms-full.txt.
 */

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../dist");
const ORIGIN = "https://cs.n10u.jp";

// Guard: dist must exist
if (!fs.existsSync(path.join(DIST, "index.html"))) {
  console.error("run `pnpm build` first");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// ROUTES
// ---------------------------------------------------------------------------
const SIM_ROUTES = [
  "/",
  "/logic",
  "/logic/nand",
  "/logic/not-and-or",
  "/logic/xor",
  "/logic/adder",
  "/logic/latch",
  "/logic/dff",
  "/logic/alu",
  "/cpu",
  "/arch",
  "/os",
  "/lang",
  "/net",
  "/algorithms",
  "/pathfinding",
  "/hashtable",
  "/quiz",
];

const DOCS_ROUTES = [
  "/docs",
  "/docs/cpu",
  "/docs/memory",
  "/docs/io",
  "/docs/os",
  "/docs/compiler",
  "/docs/network",
  "/docs/web",
  "/docs/llm",
  "/docs/software-engineering",
  "/docs/oss",
  "/docs/arai60",
];

const ROUTES = [...SIM_ROUTES, ...DOCS_ROUTES];

// ---------------------------------------------------------------------------
// TOPICS blurbs (mirrors apps/web/src/features/docs/topics.ts)
// ---------------------------------------------------------------------------
const TOPIC_BLURBS = {
  cpu: "How a processor fetches, decodes, and executes instructions — from the ALU to pipelining to modern superscalar cores.",
  memory:
    "The memory hierarchy: registers, caches, DRAM, and virtual memory — why speed and capacity trade off.",
  io: "How CPUs talk to the outside world: buses, DMA, interrupts, and the I/O software stack.",
  os: "Processes, scheduling, virtual memory, file systems, and the kernel/user boundary.",
  compiler:
    "Lexing, parsing, type checking, IR generation, and code gen — how source code becomes machine instructions.",
  network:
    "The layered internet: Ethernet, IP, TCP/UDP, DNS, and how data moves across the planet.",
  web: "HTTP, HTML/CSS, JavaScript engines, browsers, CDNs, and modern web architecture.",
  llm: "Transformers, attention, training at scale, and what modern language models actually compute.",
  "software-engineering":
    "Version control, testing, design patterns, architecture, and the craft of building reliable software.",
  oss: "Licenses, governance, contribution models, and the economics of open-source software.",
  arai60:
    "Bilingual write-ups for 60 LeetCode problems across 12 algorithm categories — approach, complexity, code, and alternatives.",
};

// ---------------------------------------------------------------------------
// Static file server
// ---------------------------------------------------------------------------
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = req.url.split("?")[0];
      // Try exact file first
      const filePath = path.join(DIST, urlPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        res.writeHead(200, {
          "Content-Type": MIME[ext] || "application/octet-stream",
        });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
      // Directory or no file — serve index.html (SPA fallback)
      const indexPath = path.join(DIST, "index.html");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      fs.createReadStream(indexPath).pipe(res);
    });

    server.listen(0, "127.0.0.1", () => {
      resolve(server);
    });
  });
}

// ---------------------------------------------------------------------------
// Priority helper
// ---------------------------------------------------------------------------
function priority(route) {
  if (route === "/") return "1.0";
  if (
    DOCS_ROUTES.includes(route) ||
    route === "/cpu" ||
    route === "/arch" ||
    route === "/os" ||
    route === "/lang" ||
    route === "/net" ||
    route === "/algorithms" ||
    route === "/pathfinding" ||
    route === "/hashtable" ||
    route === "/logic"
  )
    return "0.8";
  return "0.6";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const server = await startServer();
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;
  console.log(`Static server on ${base}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const docsCaptures = []; // { route, title, text }
  let failed = 0;

  for (const route of ROUTES) {
    const url = `${base}${route}`;
    try {
      await page.goto(url, { waitUntil: "networkidle" });
      const expectedCanonical = `${ORIGIN}${route}`;
      await page.waitForFunction(
        (want) => {
          const m = document.querySelector("main");
          if (!m || m.innerText.trim().length <= 150) return false;
          return [...document.querySelectorAll('link[rel="canonical"]')].some(
            (l) => l.getAttribute("href") === want,
          );
        },
        expectedCanonical,
        { timeout: 20000 },
      );

      let html = await page.content();

      // --- Post-process the snapshot for production correctness ---
      // 1) Strip the prerender server origin from runtime-injected asset URLs
      //    (TanStack/Vite modulepreload hints resolve against the live origin,
      //    which during prerender is 127.0.0.1:<port>). Make them root-relative.
      html = html.replace(
        new RegExp(`https?://127\\.0\\.0\\.1:${port}`, "g"),
        "",
      );
      // 2) Collapse duplicate <title>: the pre-reconciliation snapshot can carry
      //    both the root default and the route title. Keep the route-specific one.
      const ROOT_TITLE =
        "nand2web — Learn how computers work, from NAND gates to the web";
      const titleTags = [...html.matchAll(/<title>[\s\S]*?<\/title>/g)].map(
        (m) => m[0],
      );
      if (titleTags.length > 1) {
        const keep =
          titleTags.find(
            (t) => t.replace(/<\/?title>/g, "").trim() !== ROOT_TITLE,
          ) || titleTags[0];
        html = html.replace(/<title>[\s\S]*?<\/title>/g, "");
        html = html.replace("</head>", `${keep}</head>`);
      }
      // 3) Ensure exactly one canonical for this exact route.
      html = html.replace(/<link[^>]*rel="canonical"[^>]*>/g, "");
      html = html.replace(
        "</head>",
        `<link rel="canonical" href="${expectedCanonical}"/></head>`,
      );

      // Write to dist
      let outPath;
      if (route === "/") {
        outPath = path.join(DIST, "index.html");
      } else {
        const dir = path.join(DIST, route);
        fs.mkdirSync(dir, { recursive: true });
        outPath = path.join(dir, "index.html");
      }
      fs.writeFileSync(outPath, html, "utf8");
      console.log(
        `  OK  ${route} → ${outPath.replace(DIST, "dist")} (${html.length} bytes)`,
      );

      // Capture docs content for llms files
      if (DOCS_ROUTES.includes(route)) {
        const title = await page.title();
        const text = await page.$eval("main", (el) => el.innerText);
        docsCaptures.push({ route, title, text });
      }
    } catch (err) {
      console.error(`  FAIL ${route}: ${err.message}`);
      failed++;
    }
  }

  await browser.close();
  server.close();

  // ---------------------------------------------------------------------------
  // sitemap.xml
  // ---------------------------------------------------------------------------
  const sitemapUrls = ROUTES.map(
    (r) =>
      `  <url><loc>${ORIGIN}${r}</loc><priority>${priority(r)}</priority></url>`,
  ).join("\n");
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>`;
  const sitemapPath = path.join(DIST, "sitemap.xml");
  fs.writeFileSync(sitemapPath, sitemapXml, "utf8");

  // ---------------------------------------------------------------------------
  // llms.txt
  // ---------------------------------------------------------------------------
  const docsLines = docsCaptures
    .filter((c) => c.route !== "/docs")
    .map((c) => {
      const slug = c.route.replace("/docs/", "");
      const desc = TOPIC_BLURBS[slug] || c.title;
      return `- [${c.title.replace(/ — nand2web$/, "")}](${ORIGIN}${c.route}): ${desc}`;
    })
    .join("\n");

  const simLines = SIM_ROUTES.filter((r) => r !== "/")
    .map((r) => {
      const label = r.replace(/^\/logic\//, "Logic: ").replace(/^\//, "");
      const capitalized = label.charAt(0).toUpperCase() + label.slice(1);
      return `- [${capitalized}](${ORIGIN}${r}): Interactive simulator`;
    })
    .join("\n");

  const llmsTxt = `# nand2web

> Interactive, bilingual (EN/JA) computer-science curriculum built from first principles — from a single NAND gate all the way to the web, LLMs, and modern software engineering.

## Documentation
${docsLines}

## Interactive simulators
${simLines}

## Full text
- [llms-full.txt](${ORIGIN}/llms-full.txt): complete text of all documentation pages.
`;
  const llmsTxtPath = path.join(DIST, "llms.txt");
  fs.writeFileSync(llmsTxtPath, llmsTxt, "utf8");

  // ---------------------------------------------------------------------------
  // llms-full.txt
  // ---------------------------------------------------------------------------
  const fullSections = docsCaptures
    .filter((c) => c.route !== "/docs")
    .map((c) => `# ${c.title}\n\n${c.text}\n\n---`)
    .join("\n\n");
  const llmsFullPath = path.join(DIST, "llms-full.txt");
  fs.writeFileSync(llmsFullPath, fullSections, "utf8");

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  const sitemapSize = fs.statSync(sitemapPath).size;
  const llmsTxtSize = fs.statSync(llmsTxtPath).size;
  const llmsFullSize = fs.statSync(llmsFullPath).size;

  console.log(
    `\nPrerendered ${ROUTES.length - failed}/${ROUTES.length} routes (${failed} failed)`,
  );
  console.log(`sitemap.xml  : ${sitemapSize} bytes`);
  console.log(`llms.txt     : ${llmsTxtSize} bytes`);
  console.log(`llms-full.txt: ${llmsFullSize} bytes`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
