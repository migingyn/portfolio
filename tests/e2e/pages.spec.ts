import AxeBuilder from "@axe-core/playwright";
import { PAGES, expect, test } from "./fixtures";

for (const { path, heading } of PAGES) {
  test.describe(`page ${path}`, () => {
    test("loads with its heading, title and description", async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
      await expect(page).toHaveTitle(/Mikey Nguyen/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    });

    test("fits the screen without sideways scrolling", async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });

    for (const mode of ["dark", "light"] as const) {
      test(`has no accessibility violations (${mode})`, async ({ page }) => {
        await page.addInitScript((value) => localStorage.setItem("mn:theme", value), mode);
        await page.goto(path);
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
        expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
      });
    }
  });
}

test("a project write-up and a blog post open from their lists", async ({ page }) => {
  await page.goto("/projects");
  await page.locator(".rows a").first().click();
  await expect(page).toHaveURL(/\/projects\/.+/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.goto("/blog");
  await page.locator(".rows a").first().click();
  await expect(page).toHaveURL(/\/blog\/.+/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("an unknown address is a 404", async ({ page, errors }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  // The browser logs the failed load itself; that is the point of this test.
  errors.length = 0;
});

test("the tab icon is the season's logo", async ({ request }) => {
  const response = await request.get("/favicon.svg");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/svg+xml");
  const svg = await response.text();
  expect(svg).toContain("<svg");
  // The season colour is written in, not left as a CSS variable.
  expect(svg).not.toContain("var(--");
});
