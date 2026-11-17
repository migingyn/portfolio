import { PAGES, expect, test } from "./fixtures";

const count = "[data-visitors]";

test.describe("footer", () => {
  for (const { path } of PAGES) {
    test(`is under ${path}, below the first screen`, async ({ page }) => {
      await page.goto(path);
      const footer = page.locator("footer");
      await expect(footer).toContainText(`${new Date().getFullYear()} Mikey Nguyen`);
      // It is reached by scrolling, not squeezed into the first screen.
      const top = await footer.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
      expect(top).toBeGreaterThanOrEqual(await page.evaluate(() => window.innerHeight));
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeInViewport();
    });
  }

  test("counts a new visitor once and shows the total", async ({ page }) => {
    const calls: string[] = [];
    page.on("request", (request) => {
      if (request.url().endsWith("/api/views")) calls.push(request.method());
    });

    await page.goto("/");
    await expect(page.locator(count)).toHaveText("42 visitors");

    // A second page in the same visit does not ask again.
    await page.getByRole("link", { name: "See the projects" }).click();
    await expect(page).toHaveURL(/\/projects\/?$/);
    await expect(page.locator(count)).toHaveText("42 visitors");

    // Coming back later reads the total without adding to it.
    await page.reload();
    await expect(page.locator(count)).toHaveText("41 visitors");
    expect(calls).toEqual(["POST", "GET"]);
  });

  test("says visitor, not visitors, for one", async ({ page }) => {
    await page.route("**/api/views", (route) => route.fulfill({ json: { visitors: 1 } }));
    await page.goto("/");
    await expect(page.locator(count)).toHaveText("1 visitor");
  });

  test("writes large totals with separators", async ({ page }) => {
    await page.route("**/api/views", (route) => route.fulfill({ json: { visitors: 12345 } }));
    await page.goto("/");
    await expect(page.locator(count)).toHaveText("12,345 visitors");
  });

  test("hides the count when the counter is not set up", async ({ page, errors }) => {
    await page.route("**/api/views", (route) => route.fulfill({ status: 503, json: { error: "not set up" } }));
    await page.goto("/");
    await expect(page.locator("footer")).toContainText("Mikey Nguyen");
    await expect(page.locator(count)).toBeHidden();
    // The browser logs the failed request itself; nothing else should have gone wrong.
    expect(errors.filter((message) => !message.includes("503"))).toEqual([]);
    errors.length = 0;
  });
});
