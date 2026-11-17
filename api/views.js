/**
 * The visitor count shown in the site's footer.
 *
 *   GET  /api/views   the count so far
 *   POST /api/views   count one more visitor, and return the new count
 *
 * This is a Vercel Function (any file in /api becomes one). The number lives in an
 * Upstash Redis database connected to the Vercel project, which supplies the two
 * environment variables below. Nothing about a visitor is stored: only the number.
 * See README, "Visitor count".
 */
const KEY = "portfolio:visitors";

function store() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ""), token } : null;
}

/** Run one Redis command over Upstash's REST API. */
async function redis(command) {
  const { url, token } = store();
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  if (!response.ok) throw new Error(`store answered ${response.status}`);
  return (await response.json()).result;
}

/** A count may only be added from the site's own pages, not from another site or a script. */
function fromThisSite(request) {
  try {
    const host = request.headers["x-forwarded-host"] || request.headers.host;
    return new URL(request.headers.origin).host === host;
  } catch {
    return false;
  }
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (!store()) return response.status(503).json({ error: "The visitor count is not set up." });

  try {
    if (request.method === "GET") {
      return response.status(200).json({ visitors: Number(await redis(["GET", KEY])) || 0 });
    }
    if (request.method === "POST") {
      if (!fromThisSite(request)) return response.status(403).json({ error: "Counts come from the site itself." });
      return response.status(200).json({ visitors: Number(await redis(["INCR", KEY])) });
    }
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Use GET or POST." });
  } catch {
    return response.status(502).json({ error: "The visitor count could not be reached." });
  }
}
