import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { expect, test } from "@playwright/test";
// The function itself, as Vercel runs it.
import handler from "../../api/views.js";

/**
 * The visitor count's function (api/views.js), run here against a stand-in for the
 * Upstash Redis REST API: one counter that answers GET and INCR.
 */
let redis: Server;
let stored = 0;
let lastAuth = "";

test.describe.configure({ mode: "serial" });
test.skip(({ isMobile }) => isMobile, "no browser involved; once is enough");

test.beforeAll(async () => {
  redis = createServer((request, response) => {
    let body = "";
    request.on("data", (chunk) => (body += chunk));
    request.on("end", () => {
      lastAuth = request.headers.authorization ?? "";
      const [command] = JSON.parse(body) as [string, string];
      const result = command === "INCR" ? ++stored : stored ? String(stored) : null;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ result }));
    });
  });
  await new Promise<void>((resolve) => redis.listen(0, "127.0.0.1", resolve));
  process.env.KV_REST_API_URL = `http://127.0.0.1:${(redis.address() as AddressInfo).port}/`;
  process.env.KV_REST_API_TOKEN = "test-token";
});

test.afterAll(async () => {
  delete process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_TOKEN;
  await new Promise((resolve) => redis.close(resolve));
});

/** Call the function the way Vercel does, and collect what it answers. */
async function call(method: string, headers: Record<string, string> = {}) {
  const answer = { status: 0, body: {} as Record<string, unknown>, headers: {} as Record<string, string> };
  const response = {
    setHeader: (name: string, value: string) => void (answer.headers[name.toLowerCase()] = value),
    status(code: number) {
      answer.status = code;
      return this;
    },
    json(body: Record<string, unknown>) {
      answer.body = body;
      return this;
    },
  };
  await handler({ method, headers: { host: "mikey.example", ...headers } }, response);
  return answer;
}

const fromSite = { origin: "https://mikey.example" };

test("starts at zero", async () => {
  expect(await call("GET")).toMatchObject({ status: 200, body: { visitors: 0 } });
});

test("a visit from the site adds one, and the total is kept", async () => {
  expect(await call("POST", fromSite)).toMatchObject({ status: 200, body: { visitors: 1 } });
  expect(await call("POST", fromSite)).toMatchObject({ status: 200, body: { visitors: 2 } });
  expect(await call("GET")).toMatchObject({ status: 200, body: { visitors: 2 } });
  expect(lastAuth).toBe("Bearer test-token");
});

test("reading the total does not add to it", async () => {
  await call("GET");
  await call("GET");
  expect((await call("GET")).body).toEqual({ visitors: 2 });
});

test("a count from another site, or with no origin, is refused", async () => {
  expect((await call("POST", { origin: "https://elsewhere.example" })).status).toBe(403);
  expect((await call("POST")).status).toBe(403);
  expect((await call("GET")).body).toEqual({ visitors: 2 });
});

test("answers are never cached, and other methods are refused", async () => {
  const answer = await call("DELETE", fromSite);
  expect(answer.status).toBe(405);
  expect(answer.headers["cache-control"]).toBe("no-store");
});

test("says so when the store cannot be reached", async () => {
  const url = process.env.KV_REST_API_URL;
  process.env.KV_REST_API_URL = "http://127.0.0.1:9/";
  expect((await call("GET")).status).toBe(502);
  process.env.KV_REST_API_URL = url;
});

test("says so when the store is not set up", async () => {
  const { KV_REST_API_URL: url, KV_REST_API_TOKEN: token } = process.env;
  delete process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_TOKEN;
  expect((await call("GET")).status).toBe(503);
  Object.assign(process.env, { KV_REST_API_URL: url, KV_REST_API_TOKEN: token });
});
