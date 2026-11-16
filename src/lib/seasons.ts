import { getCollection, type CollectionEntry } from "astro:content";
import { site } from "../site.config";

export type Season = CollectionEntry<"seasons"> & {
  /** 1-based position in chronological order, e.g. "01". */
  number: string;
};

/** Mirror `canvas` in src/styles/tokens.css, dark and light. Used only for contrast. */
const CARBON = "#0c0c0c";
const BONE = "#f2f0ea";
const MIN_CONTRAST = 4.5;
/** The accent only ever colours small marks, so on the light canvas 3:1 is the bar. */
const MIN_MARK_CONTRAST = 3;

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** DESIGN.md: a season accent must reach 4.5:1 on `canvas` or the build fails. */
function assertReadable(id: string, role: string, color: string) {
  const ratio = contrast(color, CARBON);
  if (ratio < MIN_CONTRAST) {
    throw new Error(
      `Season "${id}": ${role} ${color} has ${ratio.toFixed(2)}:1 contrast against the ` +
        `canvas; DESIGN.md needs at least ${MIN_CONTRAST}:1.`,
    );
  }
}

/** All seasons, oldest first, numbered. */
export async function getSeasons(): Promise<Season[]> {
  const entries = await getCollection("seasons");
  return entries
    .sort((a, b) => a.data.start.getTime() - b.data.start.getTime())
    .map((entry, i) => {
      assertReadable(entry.id, "accent", entry.data.accent);
      return { ...entry, number: String(i + 1).padStart(2, "0") };
    });
}

export async function getCurrentSeason(): Promise<Season> {
  const seasons = await getSeasons();
  const current = seasons.find((s) => s.id === site.currentSeason);
  if (!current) {
    throw new Error(
      `site.currentSeason is "${site.currentSeason}" but src/content/seasons has: ` +
        seasons.map((s) => s.id).join(", "),
    );
  }
  return current;
}

/**
 * The accent as used on the light canvas: the season's own colour when it shows up
 * there, otherwise the same colour darkened step by step until it does.
 */
export function accentOnLight(accent: string): string {
  const mixed = (t: number) =>
    "#" +
    [1, 3, 5]
      .map((i) => {
        const from = parseInt(accent.slice(i, i + 2), 16);
        const to = parseInt(CARBON.slice(i, i + 2), 16);
        return Math.round(from + (to - from) * t)
          .toString(16)
          .padStart(2, "0");
      })
      .join("");
  for (let t = 0; t < 1; t += 0.05) {
    if (contrast(mixed(t), BONE) >= MIN_MARK_CONTRAST) return mixed(t);
  }
  return CARBON;
}

/** Inline style for <html>: sets the season accent (for both themes) and nothing else. */
export function seasonStyle(season: Season): string {
  const { accent } = season.data;
  return `--season-accent:${accent};--season-accent-light:${accentOnLight(accent)}`;
}
