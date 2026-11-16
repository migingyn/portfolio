import { expect, settled, test, theme } from "./fixtures";

const toggle = "[data-theme-toggle]";
const canvas = (page: import("@playwright/test").Page) =>
  page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);

test.describe("theme switch", () => {
  test.beforeEach(async ({ page }) => {
    // The slow fade is not what these tests are about.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await settled(page);
  });

  test("the site opens dark", async ({ page }) => {
    expect(await theme(page)).toBe("dark");
    expect(await canvas(page)).toBe("rgb(12, 12, 12)");
    await expect(page.locator(toggle)).toHaveAccessibleName("Switch to light mode");
  });

  test("switches to light and back", async ({ page }) => {
    await page.locator(toggle).click();
    expect(await theme(page)).toBe("light");
    await expect.poll(() => canvas(page)).toBe("rgb(242, 240, 234)");
    await expect(page.locator(toggle)).toHaveAccessibleName("Switch to dark mode");
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#f2f0ea");

    await page.locator(toggle).click();
    expect(await theme(page)).toBe("dark");
    await expect.poll(() => canvas(page)).toBe("rgb(12, 12, 12)");
  });

  test("the choice survives a page change and a reload", async ({ page }) => {
    await page.locator(toggle).click();
    await page.getByRole("link", { name: "See the projects" }).click();
    await expect(page).toHaveURL(/\/projects\/?$/);
    expect(await theme(page)).toBe("light");
    await page.reload();
    expect(await theme(page)).toBe("light");
    await expect(page.locator(toggle)).toHaveAccessibleName("Switch to dark mode");
  });
});

test("the fade holds, then changes slowly", async ({ page, isMobile }) => {
  test.skip(isMobile, "timing is the same on every device");
  await page.goto("/");
  await settled(page);
  await page.locator(toggle).click();
  // During the hold nothing has moved yet; well after it the page is light.
  await page.waitForTimeout(150);
  expect(await canvas(page)).toBe("rgb(12, 12, 12)");
  await expect.poll(() => canvas(page), { timeout: 4000 }).toBe("rgb(242, 240, 234)");
});
