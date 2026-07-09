import { expect, test } from "@playwright/test";

// Smoke tests: navigate to each route, confirm no crash and a meaningful
// heading/landmark is visible. No deep interaction required.

test("home page loads with curriculum heading", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /learn how computers work/i }),
  ).toBeVisible();
});

test("/logic lists lessons", async ({ page }) => {
  await page.goto("/logic");
  await expect(
    page.getByRole("heading", { name: /everything is nand/i }),
  ).toBeVisible();
});

test("/cpu shows the stored-program heading", async ({ page }) => {
  await page.goto("/cpu");
  await expect(
    page.getByRole("heading", { name: /stored-program computer/i }),
  ).toBeVisible();
});

test("/arch shows the pipeline heading", async ({ page }) => {
  await page.goto("/arch");
  await expect(
    page.getByRole("heading", { name: /making it fast/i }),
  ).toBeVisible();
});

test("/os shows the sharing heading", async ({ page }) => {
  await page.goto("/os");
  await expect(
    page.getByRole("heading", { name: /sharing one machine/i }),
  ).toBeVisible();
});

test("/lang shows the tiny language heading", async ({ page }) => {
  await page.goto("/lang");
  await expect(
    page.getByRole("heading", { name: /tiny language, rendered live/i }),
  ).toBeVisible();
});

test("/net shows the bytes-cross-the-planet heading", async ({ page }) => {
  await page.goto("/net");
  await expect(
    page.getByRole("heading", { name: /bytes cross the planet/i }),
  ).toBeVisible();
});

test("/algorithms shows the sorting heading", async ({ page }) => {
  await page.goto("/algorithms");
  await expect(
    page.getByRole("heading", { name: /sorting suite/i }),
  ).toBeVisible();
});

test("/quiz shows the quiz heading", async ({ page }) => {
  await page.goto("/quiz");
  await expect(page.getByRole("heading", { name: /quiz/i })).toBeVisible();
});
