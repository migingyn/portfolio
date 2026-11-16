/**
 * The logo: the penguin (src/assets/logo/penguin.svg) wearing the season's outfit.
 * An outfit is one SVG file in src/assets/logo/outfits, drawn on the penguin's
 * 100x100 grid. A season picks one by file name (`outfit: scarf`), or none.
 */
import penguin from "../assets/logo/penguin.svg?raw";

const files = import.meta.glob<string>("../assets/logo/outfits/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});

const outfits = new Map(
  Object.entries(files).map(([path, svg]) => [
    path.split("/").pop()!.replace(/\.svg$/, ""),
    // Keep the drawing, drop the file's own <svg> wrapper and comments.
    svg.replace(/<svg[^>]*>|<\/svg>|<!--[\s\S]*?-->/g, "").trim(),
  ]),
);

function dressed(outfit?: string | null): string {
  const base = penguin.replace(/<!--[\s\S]*?-->/g, "");
  if (!outfit) return base;
  const layer = outfits.get(outfit);
  if (!layer) {
    throw new Error(
      `Outfit "${outfit}" has no file in src/assets/logo/outfits. There ` +
        (outfits.size ? `is: ${[...outfits.keys()].join(", ")}.` : "are none yet."),
    );
  }
  return base.replace("</svg>", `${layer}</svg>`);
}

/** Inline markup for the page. The outfit takes the season colour from CSS. */
export function logoMarkup(outfit?: string | null): string {
  return dressed(outfit).replace("<svg ", '<svg aria-hidden="true" ');
}

/** A standalone file for the browser tab: its own dark square, the colour written in. */
export function faviconSvg(outfit: string | null | undefined, accent: string): string {
  return dressed(outfit)
    .replace(/(<svg[^>]*>)/, '$1<rect width="100" height="100" fill="#0c0c0c"/>')
    .replaceAll("var(--color-accent)", accent);
}
