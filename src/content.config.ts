import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex color like #c8f31d");

/** One markdown file per season. The file name is the season's id. */
const seasons = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/seasons" }),
  schema: ({ image }) =>
    z.object({
    name: z.string(),
    /** The season's full-screen home page photo, e.g. ./autumn-2026.jpg (next to this file). */
    hero: image().optional(),
    /** Describe the photo in a sentence, for people who cannot see it. */
    heroAlt: z.string().optional(),
    start: z.coerce.date(),
    end: z.coerce.date(),
    /** Overrides DESIGN.md's two accent roles only. The dark base never changes. */
    palette: z.object({
      accent: hex,
      forward: hex.optional(),
    }),
    /** What blows past the character on the ASCII loading screen. */
    ascii: z.enum(["leaves", "snow", "rain", "petals"]),
    mood: z.string(),
    /** Empty until a playlist is added. */
    spotifyPlaylistId: z.string().nullish(),
    tracks: z
      .array(z.object({ title: z.string(), artist: z.string(), note: z.string() }))
      .default([]),
    }),
});

export const collections = { seasons };
