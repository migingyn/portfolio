import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex color like #c6ff1a");

/** One markdown file per season. The file name is the season's id. */
const seasons = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/seasons" }),
  schema: z.object({
    name: z.string(),
    start: z.coerce.date(),
    end: z.coerce.date(),
    /** The season colour (DESIGN.md `accent`). Nothing else changes between seasons. */
    accent: hex,
    /** Home's video for this season: a file name in public/video without the extension. Defaults to "home". */
    video: z.string().nullish(),
    mood: z.string().nullish(),
    /** The part after open.spotify.com/playlist/ */
    spotifyPlaylistId: z.string().nullish(),
    tracks: z.array(z.object({ title: z.string(), artist: z.string(), note: z.string() })).default([]),
  }),
});

export const collections = { seasons };
