import { expect, type Page } from "@playwright/test";

/**
 * Attaches console/page-error listeners for the lifetime of the page and
 * returns the collected messages so a test can assert none appeared.
 *
 * Note: React hydration warnings are dev-mode only; these smoke tests run
 * against the production build, so this guards real console/page errors while
 * the unit suite locks the server-side date rendering that caused the known
 * hydration mismatch.
 */
export function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  return errors;
}

/**
 * Asserts the document does not scroll sideways (TASKLIST 1.5 regression).
 */
export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth - doc.clientWidth;
  });
  expect(
    overflow,
    `document scrollWidth exceeds clientWidth by ${overflow}px`
  ).toBeLessThanOrEqual(0);
}

/**
 * Returns the bounds of the fixed share bar and the article element so tests
 * can verify the bar never covers the ending (TASKLIST 2.3 regression).
 */
export async function shareBarAndArticleBounds(
  page: Page
): Promise<{ articleBottom: number | null; barTop: number | null }> {
  return page
    .getByRole("button", { name: "Copy article link" })
    .evaluate((copyButton) => {
      const bar = copyButton.closest("div.fixed");
      const article = document.querySelector("article");
      if (!bar || !article) return { articleBottom: null, barTop: null };
      return {
        articleBottom: article.getBoundingClientRect().bottom,
        barTop: bar.getBoundingClientRect().top,
      };
    });
}
