import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run against the built site (`npm run build`), served by
 * `astro preview`. Locally: `npm run test:e2e`. In CI: .github/workflows/ci.yml.
 */
const PORT = 4321;
const CI = !!process.env.CI;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    // A trace is only worth its cost when a test has already failed once.
    trace: CI ? "on-first-retry" : "off",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    // --ignore-lock keeps the server in the foreground for this run (Astro otherwise
    // hands it to a background process in some terminals, which looks like an early exit).
    command: `npx astro preview --port ${PORT} --ignore-lock`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !CI,
    timeout: 60_000,
  },
});
