import { test, expect } from "@playwright/test";
import { collectPageErrors, expectNoHorizontalOverflow } from "./helpers";

const KEY_PAGES = ["/", "/blog", "/blog/010-skills-router"] as const;

test("key reader pages emit no console or page errors", async ({ page }) => {
  const errors = collectPageErrors(page);
  for (const path of KEY_PAGES) {
    await page.goto(path);
    // Every page shares the #main-content wrapper (skip-link target); article
    // pages use <article>, so this is the stable "page rendered" marker.
    await expect(page.locator("#main-content")).toBeVisible();
  }
  expect(errors).toEqual([]);
});

for (const path of KEY_PAGES) {
  test(`no horizontal overflow on ${path} at mobile`, async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "overflow check targets the mobile viewport");
    await page.goto(path);
    await expect(page.locator("#main-content")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
}
