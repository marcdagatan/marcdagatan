import { test, expect } from "@playwright/test";

test("homepage front door shows the publication identity and lanes", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: /Mastermind in Pajamas/ })
  ).toBeVisible();
  await expect(page.getByText("Current Bout", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Every essay belongs to one of them/ })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Begin with one per lane/ })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Recent rounds/i })
  ).toBeVisible();

  // A lane row is a real path into the filtered archive.
  await page
    .getByRole("link", { name: /Models do not govern themselves/ })
    .click();
  await expect(page).toHaveURL(/\/blog\?lane=systems$/);
});

test("homepage presents the first read before taxonomy at every breakpoint", async ({
  page,
}) => {
  await page.goto("/");

  const startHere = page.getByRole("heading", { name: /Begin with one per lane/ });
  const lanes = page.getByRole("heading", { name: /Every essay belongs to one of them/ });
  await expect(startHere).toBeVisible();
  await expect(lanes).toBeVisible();

  const [startHereTop, lanesTop] = await Promise.all([
    startHere.evaluate((el) => el.getBoundingClientRect().top),
    lanes.evaluate((el) => el.getBoundingClientRect().top),
  ]);

  expect(startHereTop).toBeLessThan(lanesTop);
});

test("recent rounds: titles wrap to two lines and metadata is visible on mobile", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "mobile layout contract");
  await page.goto("/");

  const section = page.locator("section").filter({
    has: page.getByRole("heading", { name: /Recent rounds/i }),
  });

  // Every row shows lane · reading time on mobile (no hidden metadata).
  const visibleMetas = section.getByText(/· \d+ min/).filter({ visible: true });
  await expect(visibleMetas).toHaveCount(4);
  await expect(visibleMetas.first()).toBeVisible();

  // Titles are never one-line-truncated, and at least one actually wraps to a
  // second line (clientHeight beyond one line-height; scrollHeight is useless
  // here because block boxes size to their wrapped content).
  const titles = await section.locator("span.font-serif").evaluateAll((els) =>
    els.map((el) => {
      const style = getComputedStyle(el);
      const oneLineHeight = parseFloat(style.lineHeight) * 1.5;
      return {
        textOverflow: style.textOverflow,
        wraps: el.clientHeight > oneLineHeight,
      };
    })
  );
  expect(titles.length).toBe(4);
  for (const title of titles) {
    expect(title.textOverflow).not.toBe("ellipsis");
  }
  expect(titles.some((title) => title.wraps)).toBe(true);
});

test("crimson is reserved for featured and return-path moments on the homepage", async ({
  page,
}) => {
  await page.goto("/");

  const accentColor = await page
    .getByText("Mastermind", { exact: true })
    .evaluate((el) => getComputedStyle(el).color);

  const expectKickerColor = async (
    text: string,
    expected: "accent" | "not-accent"
  ) => {
    const kicker = page.getByText(text, { exact: true }).first();
    await expect(kicker).toBeVisible();
    const color = await kicker.evaluate((el) => getComputedStyle(el).color);
    if (expected === "accent") {
      expect(color).toBe(accentColor);
    } else {
      expect(color).not.toBe(accentColor);
    }
  };

  // Featured/current and return-path moments earn crimson.
  await expectKickerColor("Current Bout", "accent");
  await expectKickerColor("Stay for the next round", "accent");

  // Structural labels stay muted.
  await expectKickerColor("The Fight Journal · Est. 2025", "not-accent");
  await expectKickerColor("Three lanes", "not-accent");
  await expectKickerColor("Start here", "not-accent");

  // Section headings are foreground hierarchy, never accent.
  const headingColors = await page
    .locator("main h2")
    .evaluateAll((els) => els.map((el) => getComputedStyle(el).color));
  for (const color of headingColors) {
    expect(color).not.toBe(accentColor);
  }
});
