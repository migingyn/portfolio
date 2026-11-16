/** The browser-tab icon: the logo in the current season's outfit and colour. */
import type { APIRoute } from "astro";
import { faviconSvg } from "../lib/logo";
import { getCurrentSeason } from "../lib/seasons";

export const GET: APIRoute = async () => {
  const { outfit, accent } = (await getCurrentSeason()).data;
  return new Response(faviconSvg(outfit, accent), { headers: { "Content-Type": "image/svg+xml" } });
};
