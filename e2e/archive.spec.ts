import { test, expect } from "@playwright/test";

test("room filter narrows the archive and All rooms restores it", async ({ page }) => {
  await page.goto("/blog");
  await expect(
    page.getByRole("heading", { level: 1, name: /Every piece, every room/ })
  ).toBeVisible();

  const rows = page.locator("main .ml-archive-row");
  const total = await rows.count();
  expect(total).toBeGreaterThan(1);

  const filters = page.getByRole("group", { name: "Filter by room" });
  await filters.getByRole("button", { name: /^Ring/ }).click();
  await expect(filters.getByRole("button", { name: /^Ring/ })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect(page.getByRole("link", { name: /The First Bell/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /How Not to Hire/ })).toBeHidden();
  expect(await rows.count()).toBeLessThan(total);

  await filters.getByRole("button", { name: /^All rooms/ }).click();
  await expect(rows).toHaveCount(total);
});

test("topic pages list their pieces inside the frame", async ({ page }) => {
  await page.goto("/blog/tag/boxing");
  await expect(page.getByRole("heading", { level: 1, name: "#boxing" })).toBeVisible();
  await page.getByRole("link", { name: /The First Bell/ }).click();
  await expect(page).toHaveURL(/\/blog\/001-the-first-bell$/);
  await expect(page.locator(".ml-root")).toHaveAttribute("data-theme", "ring");
});

test("metadata dates never split mid-date in archive rows", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "nowrap contract matters at narrow widths");
  await page.goto("/blog");

  const times = page.locator("main time");
  expect(await times.count()).toBeGreaterThan(0);

  const styles = await times.evaluateAll((els) =>
    els.map((el) => ({
      whiteSpace: getComputedStyle(el.parentElement ?? el).whiteSpace,
      overflowsViewport: el.getBoundingClientRect().right > document.documentElement.clientWidth,
    }))
  );
  for (const entry of styles) {
    expect(entry.whiteSpace).toBe("nowrap");
    expect(entry.overflowsViewport).toBe(false);
  }
});
