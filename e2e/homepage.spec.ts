import { test, expect } from "@playwright/test";

test("front door states the thesis and walks into a room from the floor plan", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: /Founder, fighter, actor, dad\./i })
  ).toBeVisible();

  // The hero is static text; rooms are reached through the plan and the nav.
  await expect(page.locator(".ml-hero-head a")).toHaveCount(0);

  await page.locator(".ml-plan .ml-tile[data-room='ring'] a").first().click();
  await expect(page).toHaveURL(/\/rooms\/ring$/);
  await expect(page.locator(".ml-root")).toHaveAttribute("data-theme", "ring");
});

test("every room page wears its own theme and lists its pieces", async ({ page }) => {
  for (const room of ["engineering", "ring", "screen", "life"]) {
    await page.goto(`/rooms/${room}`);
    await expect(page.locator(".ml-root")).toHaveAttribute("data-theme", room);
    await expect(page.locator(`main a[href^="/blog/"]`).first()).toBeVisible();
  }
});

test("the nav reaches the house, the archive, and every room", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("banner");

  await nav.getByRole("link", { name: "The House" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator(".ml-root")).toHaveAttribute("data-theme", "house");

  await nav.getByRole("link", { name: "Archive" }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(nav.getByRole("link", { name: "Archive" })).toHaveAttribute(
    "aria-current",
    "page"
  );
});
