import { test, expect } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers";

const SKILLS_ROUTER = "/blog/010-skills-router";
const GLM_REVIEW = "/blog/006-exploring-glm-4-5";
const OPENROUTER_GUIDE = "/blog/007-openrouter-integration-on-cursor";

test("article typography: headings out-scale body and links underline", async ({
  page,
}) => {
  await page.goto(SKILLS_ROUTER);

  const body = page.locator("article .prose p").first();
  const h2 = page.locator("article .prose h2").first();

  const bodySize = parseFloat(await body.evaluate((el) => getComputedStyle(el).fontSize));
  const h2Size = parseFloat(await h2.evaluate((el) => getComputedStyle(el).fontSize));

  expect(bodySize).toBeGreaterThanOrEqual(17);
  expect(bodySize).toBeLessThanOrEqual(20);
  expect(h2Size).toBeGreaterThan(bodySize);

  // Prose links are visibly underlined; heading anchors are not.
  const link = page.locator('article .prose a[href^="http"]').first();
  const linkDecoration = await link.evaluate((el) => getComputedStyle(el).textDecorationLine);
  expect(linkDecoration).toContain("underline");

  const headingLink = page.locator("article .prose h2 a").first();
  const headingDecoration = await headingLink.evaluate((el) => getComputedStyle(el).textDecorationLine);
  expect(headingDecoration).not.toContain("underline");
});

test("guide ordered list renders real decimal markers", async ({ page }) => {
  await page.goto(OPENROUTER_GUIDE);

  const ol = page.locator("article .prose ol").first();
  await expect(ol).toBeVisible();

  const listStyle = await ol.evaluate((el) => getComputedStyle(el).listStyleType);
  expect(listStyle).toBe("decimal");
});

test("table cells are padded, aligned, and sized for reading", async ({ page }) => {
  await page.goto(GLM_REVIEW);

  const table = page.locator("article .prose table").first();
  await expect(table).toBeVisible();

  const labelCell = table.locator("td").first();
  const labelStyle = await labelCell.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      paddingTop: parseFloat(s.paddingTop),
      paddingLeft: parseFloat(s.paddingLeft),
      textAlign: s.textAlign,
    };
  });
  expect(labelStyle.paddingTop).toBeGreaterThanOrEqual(8);
  expect(labelStyle.paddingLeft).toBeGreaterThanOrEqual(12);
  expect(["left", "start"]).toContain(labelStyle.textAlign);

  const numericCell = table.locator("td").nth(1);
  const numericStyle = await numericCell.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      textAlign: s.textAlign,
      fontVariantNumeric: s.fontVariantNumeric,
      fontSize: parseFloat(s.fontSize),
    };
  });
  expect(["right", "end"]).toContain(numericStyle.textAlign);
  expect(numericStyle.fontVariantNumeric).toContain("tabular-nums");
  expect(numericStyle.fontSize).toBeGreaterThanOrEqual(14);
  expect(numericStyle.fontSize).toBeLessThanOrEqual(16);
});

test("code blocks never wrap and scroll internally at every breakpoint", async ({
  page,
}) => {
  await page.goto(SKILLS_ROUTER);

  const pre = page.locator("article .prose pre").first();
  const code = pre.locator("code");
  await expect(pre).toBeVisible();

  const whitespace = await code.evaluate((el) => getComputedStyle(el).whiteSpace);
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
  const widestOverflow = await page.locator("article .prose pre").evaluateAll((pres) => {
    let max = 0;
    for (const pre of pres) {
      max = Math.max(max, pre.scrollWidth - pre.clientWidth);
    }
    return max;
  });
  expect(widestOverflow).toBeGreaterThan(0);

  await expectNoHorizontalOverflow(page);
});

test("long TOC is h2-only, height-bounded, and wraps labels naturally", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "rail geometry runs once in the desktop project");
  await page.setViewportSize({ width: 1440, height: 500 });
  await page.goto(SKILLS_ROUTER);

  const h2Count = await page.locator("article .prose h2").count();
  const h3Count = await page.locator("article .prose h3").count();
  expect(h2Count).toBeGreaterThan(8);
  expect(h3Count).toBeGreaterThan(0);

  const rail = page.locator(".toc-rail");
  await expect(rail).toBeVisible();

  const linkCount = await rail.getByRole("link").count();
  expect(linkCount).toBe(h2Count);

  const railStyle = await rail.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      maxHeight: parseFloat(s.maxHeight),
      overflowY: s.overflowY,
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      viewportHeight: window.innerHeight,
    };
  });
  expect(railStyle.overflowY).toBe("auto");
  expect(railStyle.maxHeight).toBeLessThan(railStyle.viewportHeight);
  expect(railStyle.scrollHeight).toBeGreaterThan(railStyle.clientHeight);

  const firstLink = rail.getByRole("link").first();
  const linkStyle = await firstLink.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      whiteSpace: style.whiteSpace,
      textOverflow: style.textOverflow,
      height: el.clientHeight,
      lineHeight: parseFloat(style.lineHeight),
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    };
  });
  expect(linkStyle.whiteSpace).toBe("normal");
  expect(linkStyle.textOverflow).not.toBe("ellipsis");
  expect(linkStyle.height).toBeGreaterThan(linkStyle.lineHeight);
  expect(linkStyle.scrollWidth).toBeLessThanOrEqual(linkStyle.clientWidth);
  expect(await firstLink.getAttribute("title")).toBeTruthy();
});

test("mobile TOC counts sections and bounds the expanded list to half the viewport", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "disclosure geometry runs once in the mobile project");
  await page.goto(SKILLS_ROUTER);

  const toc = page.getByRole("navigation", { name: "In this essay" });
  await expect(toc).toBeVisible();

  const h2Count = await page.locator("article .prose h2").count();
  const button = toc.getByRole("button");
  await expect(button).toContainText(`${h2Count} sections`);

  await button.click();

  const scrollArea = toc.locator(".toc-mobile-scroll");
  const bounds = await scrollArea.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      maxHeight: parseFloat(s.maxHeight),
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      viewportHeight: window.innerHeight,
    };
  });
  expect(bounds.maxHeight).toBeGreaterThan(0);
  expect(bounds.maxHeight).toBeLessThanOrEqual(bounds.viewportHeight / 2 + 1);
  expect(bounds.scrollHeight).toBeGreaterThan(bounds.clientHeight);
});

test("prose centers with a 17px+ body at tablet width", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "tablet geometry runs once in the desktop project");
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(SKILLS_ROUTER);

  const prose = page.locator("article .prose.article-prose").first();
  await expect(prose).toBeVisible();

  const box = await prose.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return {
      left: r.left,
      width: r.width,
      viewport: document.documentElement.clientWidth,
      fontSize: parseFloat(getComputedStyle(el).fontSize),
    };
  });
  const expectedLeft = (box.viewport - box.width) / 2;
  expect(Math.abs(box.left - expectedLeft)).toBeLessThanOrEqual(8);
  expect(box.fontSize).toBeGreaterThanOrEqual(17);
});

test("footer last line clears the fixed share bar on article routes", async ({
  page,
}) => {
  await page.goto(SKILLS_ROUTER);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));

  const bounds = await page.evaluate(() => {
    const bar = document.querySelector(".share-bar");
    const footer = document.querySelector("footer");
    if (!bar || !footer) return null;
    const barRect = bar.getBoundingClientRect();
    const lastLine = footer.lastElementChild;
    if (!lastLine) return null;
    return {
      barTop: barRect.top,
      lastLineBottom: lastLine.getBoundingClientRect().bottom,
    };
  });

  expect(bounds).not.toBeNull();
  expect(bounds!.lastLineBottom).toBeLessThanOrEqual(bounds!.barTop);
});

test("related essays to footer transition stays around 6rem", async ({ page }) => {
  await page.goto(SKILLS_ROUTER);

  const relatedKicker = page.getByText("Related essays", { exact: true });
  await expect(relatedKicker).toBeVisible();

  const gap = await relatedKicker.evaluate((el) => {
    const section = el.closest("section");
    const footer = document.querySelector("footer");
    if (!section || !footer) return null;
    return footer.getBoundingClientRect().top - section.getBoundingClientRect().bottom;
  });

  expect(gap).not.toBeNull();
  // 6rem = 96px; allow a small frame around it, but never a large void.
  expect(gap!).toBeGreaterThanOrEqual(80);
  expect(gap!).toBeLessThanOrEqual(112);
});
