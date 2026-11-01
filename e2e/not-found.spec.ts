import { test, expect } from "@playwright/test";

for (const path of ["/blog/definitely-not-a-post", "/definitely-not-a-page", "/lab", "/rooms/attic"]) {
  test(`${path} renders the house 404`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /There is no room here/ })).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Ways back" }).getByRole("link", { name: "Ring" })
    ).toHaveAttribute("href", "/rooms/ring");
  });
}
