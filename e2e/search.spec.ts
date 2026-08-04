import { test, expect } from "@playwright/test";

test("search opens, returns publication-index results, and navigates into a post", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search the publication" }).click();

  const dialog = page.getByRole("dialog", { name: "Search the publication" });
  await expect(dialog).toBeVisible();

  await dialog.getByRole("textbox", { name: "Search posts" }).fill("skills");

  const result = dialog.getByRole("link", { name: /The Skills Router/ });
  await expect(result).toBeVisible();
  await result.click();

  await expect(page).toHaveURL(/\/blog\/010-skills-router$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /The Skills Router/ })
  ).toBeVisible();
});

test("search closes with Escape", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Search the publication" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("query `glm` ranks the GLM review first and never the Superman review", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search the publication" }).click();

  const dialog = page.getByRole("dialog", { name: "Search the publication" });
  await dialog.getByRole("textbox", { name: "Search posts" }).fill("glm");

  const resultLinks = dialog.getByRole("list").getByRole("link");
  await expect(resultLinks.first()).toContainText(/GLM-4\.5 vs Claude Opus/);
  await expect(
    dialog.getByRole("link", { name: /When Superman Fails to Soar/ })
  ).toHaveCount(0);
});
