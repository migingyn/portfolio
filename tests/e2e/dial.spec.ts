import { PAGES, expect, settled, test } from "./fixtures";

const logo = "[data-dial-open]";

test.describe("dial navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await settled(page);
  });

  test("opens from the logo with the current section selected", async ({ page }) => {
    await expect(page.locator(logo)).toHaveAttribute("aria-expanded", "false");
    await page.locator(logo).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.locator(logo)).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(".dial__link.is-selected")).toHaveText("Home");
    await expect(page.locator(".dial__link")).toHaveCount(PAGES.length);
  });

  test("Escape closes it and gives focus back to the logo", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard only");
    await page.locator(logo).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.locator(logo)).toBeFocused();
  });

  test("the Close link closes it", async ({ page }) => {
    await page.locator(logo).click();
    await page.getByRole("dialog").getByText("Close").click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("arrow keys turn it and Enter opens the section", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard only");
    await page.locator(logo).click();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(".dial__link.is-selected")).toHaveText("Projects");
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(".dial__link.is-selected")).toHaveText("Experience");
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator(".dial__link.is-selected")).toHaveText("Projects");
    await expect(page.locator(".dial__link.is-selected")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/projects\/?$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("the scroll wheel turns it", async ({ page, isMobile }) => {
    test.skip(isMobile, "mouse only");
    await page.locator(logo).click();
    await page.mouse.move(640, 400);
    await page.mouse.wheel(0, 120);
    await expect(page.locator(".dial__link.is-selected")).not.toHaveText("Home");
  });

  test("reaches every section and back", async ({ page }) => {
    for (const { path, heading } of [...PAGES.slice(1), PAGES[0]]) {
      await page.locator(logo).click();
      await page.getByRole("dialog").getByRole("link", { name: heading === "Mikey Nguyen" ? "Home" : heading, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path === "/" ? "" : path}/?$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await settled(page);
    }
  });
});
