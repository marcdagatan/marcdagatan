import { test, expect } from "@playwright/test";
import { shareBarAndArticleBounds } from "./helpers";

const LONG_POST = "/blog/010-skills-router";

test("long article: loud title, table of contents, and permanently fixed share bar", async ({
  page,
}) => {
  await page.goto(LONG_POST);

  await expect(
    page.getByRole("heading", { level: 1, name: /The Skills Router/ })
  ).toBeVisible();

  const toc = page.getByRole("navigation", { name: "In this essay" });
  await expect(toc).toBeVisible();
  const tocLinks = toc.getByRole("link");
  expect(await tocLinks.count()).toBeGreaterThanOrEqual(3);

  // TOC anchors resolve to real headings rendered by the article.
  const firstTocHref = await tocLinks.first().getAttribute("href");
  const headingIds = await page
    .locator("h2[id], h3[id]")
    .evaluateAll((elements) => elements.map((el) => `#${el.id}`));
  expect(headingIds).toContain(firstTocHref);

  const copyLink = page.getByRole("button", { name: "Copy article link" });
  await expect(copyLink).toBeVisible();
  const isFixed = await copyLink.evaluate((el) => {
    const bar = el.closest("div.fixed");
    return bar !== null && getComputedStyle(bar).position === "fixed";
  });
  expect(isFixed).toBe(true);
});

test("fixed share bar never covers the ending of the article", async ({
  page,
}) => {
  await page.goto(LONG_POST);

  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight)
  );

  const copyLink = page.getByRole("button", { name: "Copy article link" });
  await expect(copyLink).toBeVisible();

  const { articleBottom, barTop } = await shareBarAndArticleBounds(page);
  expect(barTop).not.toBeNull();
  expect(articleBottom).not.toBeNull();
  expect(articleBottom!).toBeLessThanOrEqual(barTop!);
});

test("wide code stays reachable at the small-laptop breakpoint", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "small-laptop geometry runs once in the desktop project");
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto(LONG_POST);

  const figure = page.locator("figure[data-rehype-pretty-code-figure]").first();
  await expect(figure).toBeVisible();

  const bounds = await figure.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left,
      right: rect.right,
      viewportWidth: document.documentElement.clientWidth,
      pageWidth: document.documentElement.scrollWidth,
    };
  });

  expect(bounds.left).toBeGreaterThanOrEqual(0);
  expect(bounds.right).toBeLessThanOrEqual(bounds.viewportWidth);
  expect(bounds.pageWidth).toBe(bounds.viewportWidth);
});

test("desktop code stays inside the prose column and clear of the TOC", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "desktop grid geometry runs once");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(LONG_POST);

  const bounds = await page.evaluate(() => {
    const prose = document.querySelector<HTMLElement>(".article-prose.prose");
    const figure = prose?.querySelector<HTMLElement>(
      "figure[data-rehype-pretty-code-figure]"
    );
    const rail = document.querySelector<HTMLElement>(".toc-rail");
    return {
      prose: prose?.getBoundingClientRect().toJSON(),
      figure: figure?.getBoundingClientRect().toJSON(),
      rail: rail?.getBoundingClientRect().toJSON(),
    };
  });

  expect(bounds.prose).toBeTruthy();
  expect(bounds.figure).toBeTruthy();
  expect(bounds.rail).toBeTruthy();
  expect(bounds.figure!.left).toBeGreaterThanOrEqual(bounds.prose!.left - 1);
  expect(bounds.figure!.right).toBeLessThanOrEqual(bounds.prose!.right + 1);
  expect(bounds.figure!.left).toBeGreaterThan(bounds.rail!.right);
});

test("pagination labels are explicitly chronological: Newer round / Older round", async ({
  page,
}) => {
  await page.goto("/blog/006-exploring-glm-4-5");

  const newer = page.getByRole("link", { name: /Newer round/ });
  const older = page.getByRole("link", { name: /Older round/ });
  await expect(newer).toBeVisible();
  await expect(older).toBeVisible();

  await newer.click();
  await expect(page).toHaveURL(/\/blog\/007-openrouter-integration-on-cursor$/);

  await page.goBack();
  await expect(page).toHaveURL(/\/blog\/006-exploring-glm-4-5$/);
  await page.getByRole("link", { name: /Older round/ }).click();
  await expect(page).toHaveURL(/\/blog\/005-gpt-5-in-cursor$/);
});

test("oldest post falls back to the archive for older rounds", async ({ page }) => {
  await page.goto("/blog/001-the-first-bell");

  const fallback = page.getByRole("link", { name: /The fight record/ });
  await expect(fallback).toBeVisible();
  await expect(fallback).toContainText("Older round");

  await fallback.click();
  await expect(page).toHaveURL(/\/blog$/);
});

test("first bell header image is a wide editorial plate with a light-theme mat", async ({
  page,
}) => {
  await page.goto("/blog/001-the-first-bell");

  const plate = page.locator(".article-plate");
  await expect(plate).toBeVisible();

  const dark = await plate.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return {
      ratio: rect.width / rect.height,
      borderTopWidth: parseFloat(style.borderTopWidth),
      borderColor: style.borderColor,
    };
  });
  // ~21:9 plate, fine frame.
  expect(dark.ratio).toBeGreaterThanOrEqual(2.2);
  expect(dark.ratio).toBeLessThanOrEqual(2.45);
  expect(dark.borderTopWidth).toBeGreaterThanOrEqual(1);

  // Light theme: warm mat frame; border shifts and an inset hairline appears.
  await page.evaluate(() => localStorage.setItem("theme", "light"));
  await page.reload();
  await expect(plate).toBeVisible();

  const light = await plate.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      htmlClass: document.documentElement.className,
      borderColor: style.borderColor,
      boxShadow: style.boxShadow,
    };
  });
  expect(light.htmlClass).toContain("light");
  expect(light.borderColor).not.toBe(dark.borderColor);
  expect(light.boxShadow).toContain("inset");
});
