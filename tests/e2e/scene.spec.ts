import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/**
 * Home's autumn scene. Its loop takes most of a minute, so these tests take over
 * the page's clock and wind it forward instead of waiting.
 */
const stage = "[data-leaf-pile]";
const state = (page: Page) =>
  page.locator(stage).evaluate((el: SVGElement) => ({ phase: el.dataset.phase, mood: el.dataset.mood, pile: Number(el.dataset.pile) }));

/** Wind the clock forward a second at a time until the scene gets somewhere. */
async function windUntil(page: Page, done: (s: Awaited<ReturnType<typeof state>>) => boolean, seconds = 120) {
  for (let i = 0; i < seconds; i++) {
    if (done(await state(page))) return;
    await page.clock.runFor(1000);
  }
  throw new Error(`the scene did not get there in ${seconds}s: ${JSON.stringify(await state(page))}`);
}

const centre = (page: Page, selector: string) =>
  page.locator(selector).evaluate((el) => {
    const box = el.getBoundingClientRect();
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  });

/** The middle of the pile: the foot of the stage, at its centre. */
const pileSpot = (page: Page) =>
  page.locator(stage).evaluate((el: SVGSVGElement) => {
    const box = el.getBoundingClientRect();
    return { x: box.x + box.width / 2, y: box.bottom - (12 * box.height) / el.viewBox.baseVal.height };
  });

test.describe("home scene", () => {
  // Winding a minute of animation forward takes a while on a slow machine.
  test.describe.configure({ timeout: 90_000 });

  test.beforeEach(async ({ page }) => {
    await page.clock.install();
    await page.goto("/");
    await expect(page.locator(stage)).toHaveAttribute("data-phase", /.+/);
  });

  test("is on Home only, and hidden from assistive tech", async ({ page }) => {
    await expect(page.locator(".scene")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator(`${stage} [data-leaves] path`)).toHaveCount(36);
    await page.goto("/projects");
    await expect(page.locator(stage)).toHaveCount(0);
  });

  test("the penguin piles the leaves, jumps in, and starts over", async ({ page }) => {
    await windUntil(page, (s) => s.phase === "gather");
    await windUntil(page, (s) => s.pile === 36);
    await windUntil(page, (s) => s.phase === "nap");
    expect((await state(page)).pile).toBe(0);
    await windUntil(page, (s) => s.mood === "asleep");
    await windUntil(page, (s) => s.phase === "wake");
    await windUntil(page, (s) => s.phase === "gather");
  });

  test("a pointer on the penguin makes him laugh and stay put", async ({ page, isMobile }) => {
    test.skip(isMobile, "hover needs a mouse");
    await windUntil(page, (s) => s.phase === "gather" && s.pile > 0);
    const at = await centre(page, "[data-penguin]");
    await page.mouse.move(at.x, at.y);
    await page.clock.runFor(200);
    expect((await state(page)).mood).toBe("laughing");

    await page.clock.runFor(3000);
    const after = await centre(page, "[data-penguin]");
    expect(Math.abs(after.x - at.x)).toBeLessThan(4);
    expect((await state(page)).mood).toBe("laughing");

    await page.mouse.move(10, 10);
    await page.clock.runFor(1000);
    expect((await state(page)).mood).toBe("calm");
  });

  test("a tap on the penguin makes him laugh for a moment", async ({ page, isMobile }) => {
    test.skip(!isMobile, "touch only");
    await windUntil(page, (s) => s.phase === "gather");
    const at = await centre(page, "[data-penguin]");
    await page.touchscreen.tap(at.x, at.y);
    await page.clock.runFor(200);
    expect((await state(page)).mood).toBe("laughing");
    await page.clock.runFor(3000);
    expect((await state(page)).mood).toBe("calm");
  });

  test("a click on the pile blows it away and makes him sad", async ({ page }) => {
    await windUntil(page, (s) => s.pile >= 12);
    const at = await pileSpot(page);
    await page.mouse.click(at.x, at.y);
    // Move away, so a mouse left on the spot cannot tickle him as he walks past.
    await page.mouse.move(10, 10);
    await page.clock.runFor(700);
    expect(await state(page)).toMatchObject({ phase: "sad", mood: "sad", pile: 0 });
    // He gets over it and builds the pile again.
    await windUntil(page, (s) => s.phase === "gather" && s.mood === "calm");
    await windUntil(page, (s) => s.pile >= 12);
  });

  test("a click elsewhere does nothing", async ({ page }) => {
    await windUntil(page, (s) => s.pile >= 12);
    const before = (await state(page)).pile;
    const at = await pileSpot(page);
    await page.mouse.click(at.x, at.y - 150);
    await page.clock.runFor(300);
    expect((await state(page)).pile).toBeGreaterThanOrEqual(before);
    expect((await state(page)).mood).toBe("calm");
  });
});

test("the scene stays still under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/");
  const before = await page.locator("[data-penguin]").getAttribute("transform");
  await page.clock.runFor(20_000);
  expect(await page.locator("[data-penguin]").getAttribute("transform")).toBe(before);
  await expect(page.locator(stage)).toHaveAttribute("data-phase", "shed");
});
