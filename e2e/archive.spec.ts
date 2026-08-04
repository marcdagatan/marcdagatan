import { test, expect } from "@playwright/test";

test("lane filter updates the URL, count, and entry list", async ({ page }) => {
  await page.goto("/blog");
  await expect(
    page.getByRole("heading", { name: /The Fight Record/ })
  ).toBeVisible();
  const summary = page.getByText(/^Showing \d+ of \d+ rounds/);
  const initialSummary = await summary.textContent();
  const initialMatch = initialSummary?.match(/Showing (\d+) of (\d+) rounds/);
  expect(initialMatch).not.toBeNull();
  expect(initialMatch?.[1]).toBe(initialMatch?.[2]);
  const total = Number(initialMatch?.[2]);

  await page.getByRole("button", { name: "systems" }).click();

  await expect(page).toHaveURL(/\/blog\?lane=systems$/);
  await expect(page.getByRole("button", { name: "systems" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  const filteredSummary = await summary.textContent();
  const filteredMatch = filteredSummary?.match(/Showing (\d+) of (\d+) rounds/);
  expect(filteredMatch).not.toBeNull();
  expect(Number(filteredMatch?.[1])).toBeGreaterThan(0);
  expect(Number(filteredMatch?.[1])).toBeLessThan(total);
  expect(Number(filteredMatch?.[2])).toBe(total);
  await expect(
    page.getByRole("link", { name: /The Skills Router/ })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /How Not to Hire/ })
  ).toBeHidden();

  // Clear filter restores the full record.
  await page.getByRole("button", { name: /Clear filters/ }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(summary).toContainText(`Showing ${total} of ${total} rounds`);
});

test("topics dialog renders once, Escape closes, selection filters the URL", async ({
  page,
}) => {
  await page.goto("/blog");
  await page.getByRole("button", { name: "Topics", exact: true }).click();

  const dialog = page.getByRole("dialog", { name: "Browse topics" });
  await expect(dialog).toBeVisible();
  // Known regression: exactly one dialog instance, no double overlay.
  await expect(page.getByRole("dialog")).toHaveCount(1);

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.getByRole("button", { name: "Topics", exact: true })).toBeFocused();

  await page.getByRole("button", { name: "Topics", exact: true }).click();
  await dialog.getByRole("button", { name: /^#ai/ }).click();

  await expect(page).toHaveURL(/\/blog\?topic=ai$/);
  // The trigger relabels to the active topic (state, not aria-pressed).
  await expect(page.getByRole("button", { name: /^#ai/ })).toBeVisible();
  await expect(page.getByText(/Topic: #ai/)).toBeVisible();
  await expect(page.getByText(/^Showing \d+ of \d+ rounds/)).toBeVisible();
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
    els.map((el) => {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        whiteSpace: style.whiteSpace,
        overflowsViewport: rect.right > document.documentElement.clientWidth,
      };
    })
  );
  for (const entry of styles) {
    expect(entry.whiteSpace).toBe("nowrap");
    expect(entry.overflowsViewport).toBe(false);
  }
});
