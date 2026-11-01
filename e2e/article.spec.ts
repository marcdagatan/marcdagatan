import { test, expect } from "@playwright/test";

const LONG_POST = "/blog/010-skills-router";

test("each essay is styled by its room", async ({ page }) => {
  const essays = {
    "/blog/003-how-not-to-hire": "engineering",
    "/blog/001-the-first-bell": "ring",
    "/blog/009-superman-2025": "screen",
    "/blog/002-finding-yourself": "life",
  } as const;
  for (const [path, room] of Object.entries(essays)) {
    await page.goto(path);
    await expect(page.locator(".ml-root")).toHaveAttribute("data-theme", room);
    await expect(page.locator("article.ml-prose")).toBeVisible();
  }
});

test("long essay: title, a table of contents whose anchors resolve, and structured data", async ({
  page,
}) => {
  await page.goto(LONG_POST);

  await expect(
    page.getByRole("heading", { level: 1, name: /The Skills Router/ })
  ).toBeVisible();

  // The engineering room labels its TOC as an editor outline.
  const toc = page.getByRole("navigation", { name: "Outline" });
  await expect(toc).toBeVisible();
  const tocLinks = toc.getByRole("link");
  expect(await tocLinks.count()).toBeGreaterThanOrEqual(3);

  const firstTocHref = await tocLinks.first().getAttribute("href");
  const headingIds = await page
    .locator("article h2[id]")
    .evaluateAll((elements) => elements.map((el) => `#${el.id}`));
  expect(headingIds).toContain(firstTocHref);

  const types = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((els) => els.map((el) => JSON.parse(el.textContent ?? "{}")["@type"]));
  expect(types).toContain("BlogPosting");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/blog\/010-skills-router\/opengraph-image$/
  );
});

test("chronological pager links the neighbouring essays", async ({ page }) => {
  await page.goto(LONG_POST);
  const pager = page.getByRole("navigation", { name: "Chronological" });
  await expect(pager.getByRole("link")).toHaveCount(1);
  await expect(pager.getByRole("link")).toHaveAttribute("href", "/blog/009-superman-2025");

  await page.goto("/blog/001-the-first-bell");
  await expect(
    page.getByRole("navigation", { name: "Chronological" }).getByRole("link")
  ).toHaveAttribute("href", "/blog/002-finding-yourself");
});
