/**
 * make-og.mjs — one-off script to rasterize the OG card to apps/web/public/og.png.
 *
 * Usage:  node apps/web/scripts/make-og.mjs
 *         (run from repo root, or from apps/web — paths are resolved relative to this file)
 *
 * Do NOT add this to any build or CI step. Run manually when the design changes.
 * Requires: @playwright/test chromium browser installed (pnpm install already handles this).
 */
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../public/og.png");

const LAYERS = [
  { label: "Logic Gates", color: "#0ea5e9" },
  { label: "CPU / ALU", color: "#38bdf8" },
  { label: "Architecture", color: "#7dd3fc" },
  { label: "Operating System", color: "#6ee7b7" },
  { label: "Language", color: "#34d399" },
  { label: "Networking", color: "#a78bfa" },
  { label: "Algorithms", color: "#c084fc" },
];

const layerBars = LAYERS.map(
  (l, i) => `
  <div style="
    display:flex;align-items:center;gap:12px;
    padding:6px 14px;
    background:rgba(255,255,255,0.04);
    border-left:3px solid ${l.color};
    border-radius:4px;
    font-size:15px;color:${l.color};letter-spacing:0.02em;
    animation:none;
  ">
    <span style="font-size:12px;opacity:0.5;font-family:monospace;color:#71717a;">${i + 1}</span>
    ${l.label}
  </div>`,
).join("\n");

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{
    width:1200px;height:630px;overflow:hidden;
    background:#09090b;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
    display:flex;align-items:center;justify-content:center;
  }
  .card{
    width:1200px;height:630px;
    display:flex;align-items:center;
    padding:70px 80px;
    gap:80px;
    background:linear-gradient(135deg,#09090b 60%,#0c1824 100%);
    position:relative;overflow:hidden;
  }
  /* Subtle grid bg */
  .card::before{
    content:'';position:absolute;inset:0;
    background-image:
      linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px);
    background-size:40px 40px;
  }
  .left{flex:1;z-index:1;}
  .right{width:300px;z-index:1;display:flex;flex-direction:column;gap:8px;}
  .badge{
    display:inline-block;
    font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;
    color:#0ea5e9;background:rgba(14,165,233,0.12);
    border:1px solid rgba(14,165,233,0.25);
    border-radius:4px;padding:4px 10px;margin-bottom:20px;
  }
  h1{
    font-size:56px;font-weight:800;
    color:#f4f4f5;
    line-height:1.05;
    letter-spacing:-0.03em;
    margin-bottom:18px;
  }
  h1 span{color:#0ea5e9;}
  .tagline{
    font-size:20px;color:#a1a1aa;
    line-height:1.5;max-width:520px;
  }
  .domain{
    margin-top:36px;
    font-size:15px;color:#52525b;
    font-family:monospace;letter-spacing:0.05em;
  }
  .stack-label{
    font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;
    color:#52525b;margin-bottom:10px;
  }
</style>
</head>
<body>
<div class="card">
  <div class="left">
    <div class="badge">Interactive CS Curriculum</div>
    <h1>nand<span>2</span>web</h1>
    <p class="tagline">Learn how computers work —<br>from NAND gates to the web.</p>
    <p class="domain">cs.n10u.jp</p>
  </div>
  <div class="right">
    <div class="stack-label">7-layer stack</div>
    ${layerBars}
  </div>
</div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.screenshot({ path: OUT, type: "png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();

console.log(`OG image written to ${OUT}`);
