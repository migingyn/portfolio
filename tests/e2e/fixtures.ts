import { test as base, expect, type Page } from "@playwright/test";

/** Every route the site builds, with the heading a visitor should find there. */
export const PAGES = [
  { path: "/", heading: "Mikey Nguyen" },
  { path: "/projects", heading: "Projects" },
  { path: "/experience", heading: "Experience" },
  { path: "/resume", heading: "Resume" },
  { path: "/blog", heading: "Blog" },
  { path: "/seasons", heading: "Seasons" },
  { path: "/links", heading: "Links" },
] as const;

type Fixtures = {
  /** False for the tests that are about the loading screen itself. */
  skipIntro: boolean;
  /** Errors the page threw or logged while the test ran. */
  errors: string[];
};

/**
 * The site's tests start as a returning visitor (no loading screen) and fail if
 * the page logs an error.
 */
export const test = base.extend<Fixtures>({
  skipIntro: [true, { option: true }],
  errors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await use(errors);
      expect(errors, "the page logged errors").toEqual([]);
    },
    { auto: true },
  ],
  page: async ({ page, skipIntro }, use) => {
    // The visitor count is a Vercel Function, which the local preview does not run.
    // Stand in for it: 41 visitors so far, 42 once this browser is counted.
    await page.route("**/api/views", (route) =>
      route.fulfill({ json: { visitors: route.request().method() === "POST" ? 42 : 41 } }),
    );
    if (skipIntro) {
      await page.addInitScript(() => {
        try {
          localStorage.setItem("mn:intro-seen", "1");
        } catch {}
      });
    }
    await use(page);
  },
});

export { expect };

/** Astro swaps pages without a full load; wait until the new page's scripts have run. */
export async function settled(page: Page) {
  await page.waitForLoadState("networkidle");
}

export const theme = (page: Page) => page.evaluate(() => document.documentElement.dataset.theme);
