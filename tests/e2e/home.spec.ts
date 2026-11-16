import { expect, test } from "./fixtures";

test.describe("home", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("says who this is and what to do next", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mikey Nguyen");
    await expect(page.getByText("Backend engineer and creative builder")).toBeVisible();
    await expect(page.getByRole("link", { name: "See the projects" })).toBeVisible();
  });

  test("the button opens Projects", async ({ page }) => {
    await page.getByRole("link", { name: "See the projects" }).click();
    await expect(page).toHaveURL(/\/projects\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Projects");
  });

  test("the resume link opens Resume", async ({ page }) => {
    await page.getByRole("link", { name: "Read the resume" }).click();
    await expect(page).toHaveURL(/\/resume\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Resume");
  });

  test("the GitHub link points at GitHub", async ({ page }) => {
    await expect(page.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", /^https:\/\/github\.com\//);
  });

  test("the skip link is the first Tab stop", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard only");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  });

  test("every control is big enough to tap", async ({ page }) => {
    // The skip link is a 1px sliver until it is focused, by design.
    const sizes = await page.locator("a:visible:not(.skip), button:visible").evaluateAll((els) =>
      els.map((el) => {
        const box = el.getBoundingClientRect();
        return { name: el.textContent?.trim() || el.getAttribute("aria-label"), w: box.width, h: box.height };
      }),
    );
    for (const { name, w, h } of sizes) {
      expect(Math.round(w), `${name} is ${w}px wide`).toBeGreaterThanOrEqual(44);
      expect(Math.round(h), `${name} is ${h}px tall`).toBeGreaterThanOrEqual(44);
    }
  });
});
