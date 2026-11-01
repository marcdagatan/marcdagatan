import { test, expect } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers";

const SKILLS_ROUTER = "/blog/010-skills-router";
const OPENROUTER_GUIDE = "/blog/007-openrouter-integration-on-cursor";

test("essay typography: headings out-scale body and links underline", async ({ page }) => {
  await page.goto(SKILLS_ROUTER);

  const body = page.locator("article.ml-prose p").first();
  const h2 = page.locator("article.ml-prose h2").first();

  const bodySize = parseFloat(await body.evaluate((el) => getComputedStyle(el).fontSize));
  const h2Size = parseFloat(await h2.evaluate((el) => getComputedStyle(el).fontSize));

  expect(bodySize).toBeGreaterThanOrEqual(17);
  expect(bodySize).toBeLessThanOrEqual(20);
  expect(h2Size).toBeGreaterThan(bodySize);

  const link = page.locator('article.ml-prose a[href^="http"]').first();
  const linkDecoration = await link.evaluate((el) => getComputedStyle(el).textDecorationLine);
  expect(linkDecoration).toContain("underline");
});

test("guide ordered list renders real decimal markers", async ({ page }) => {
  await page.goto(OPENROUTER_GUIDE);

  const ol = page.locator("article.ml-prose ol").first();
  await expect(ol).toBeVisible();
  const listStyle = await ol.evaluate((el) => getComputedStyle(el).listStyleType);
  expect(listStyle).toBe("decimal");
});

test("code blocks never wrap and scroll internally", async ({ page }) => {
  await page.goto(SKILLS_ROUTER);

  const pre = page.locator("article.ml-prose pre").first();
  await expect(pre).toBeVisible();

  const whitespace = await pre.locator("code").evaluate((el) => getComputedStyle(el).whiteSpace);
  expect(whitespace).toBe("pre");

  const overflowX = await pre.evaluate((el) => getComputedStyle(el).overflowX);
  expect(overflowX === "auto" || overflowX === "scroll").toBe(true);
});

test("wide code overflows internally, never the page, on mobile", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "wide-code geometry runs once in the mobile project");
  await page.goto(SKILLS_ROUTER);

  // The architecture diagram fence is wider than any mobile column.
  const widestOverflow = await page.locator("article.ml-prose pre").evaluateAll((pres) =>
    Math.max(0, ...pres.map((pre) => pre.scrollWidth - pre.clientWidth))
  );
  expect(widestOverflow).toBeGreaterThan(0);

  await expectNoHorizontalOverflow(page);
});
