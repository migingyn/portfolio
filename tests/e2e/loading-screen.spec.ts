import { expect, test } from "./fixtures";

const intro = "html[data-intro]";

test.describe("loading screen", () => {
  test.use({ skipIntro: false });

  test("plays on a first visit, then fades into the page", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(intro)).toHaveAttribute("data-intro", "playing");
    await expect(page.locator(".intro")).toBeVisible();
    await expect(page.locator("main")).toHaveAttribute("inert", "");

    await expect(page.locator(intro)).toHaveCount(0, { timeout: 6000 });
    await expect(page.locator(".intro")).toBeHidden();
    await expect(page.locator("main")).not.toHaveAttribute("inert", "");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // Nothing of the character stays on the page.
    await expect(page.locator("canvas:visible")).toHaveCount(0);
  });

  test("does not play on a second visit", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(intro)).toHaveCount(0, { timeout: 6000 });
    await page.reload();
    await expect(page.locator(intro)).toHaveCount(0);
  });

  test("a key skips it", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard only");
    await page.goto("/");
    await expect(page.locator(intro)).toHaveAttribute("data-intro", "playing");
    await page.keyboard.press("Space");
    await expect(page.locator(intro)).toHaveCount(0, { timeout: 1500 });
  });

  test("a click or tap skips it", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(intro)).toHaveAttribute("data-intro", "playing");
    // Anywhere on the screen counts; the page under the loading screen is inert.
    await page.mouse.click(160, 300);
    await expect(page.locator(intro)).toHaveCount(0, { timeout: 1500 });
  });

  test("?intro replays it", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(intro)).toHaveCount(0, { timeout: 6000 });
    await page.goto("/?intro");
    await expect(page.locator(intro)).toHaveAttribute("data-intro", "playing");
  });

  test("is skipped under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator(intro)).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
