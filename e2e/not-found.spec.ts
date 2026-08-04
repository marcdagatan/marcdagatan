import { test, expect } from "@playwright/test";

test("unknown post slugs return a 404 page instead of crashing", async ({
  page,
}) => {
  const response = await page.goto("/blog/definitely-not-a-post");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: /round doesn.t exist/ })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /The fight record/i })
  ).toBeVisible();
});

test("unknown top-level routes render the global 404", async ({ page }) => {
  const response = await page.goto("/definitely-not-a-page");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: /round doesn.t exist/ })
  ).toBeVisible();
});
