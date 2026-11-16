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

/** One markdown file per project. The file name is its URL: /projects/<name>. */
const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    /** One line: what it is and who it is for. */
    summary: z.string(),
    year: z.number(),
    stack: z.array(z.string()).default([]),
    repo: z.url().optional(),
    url: z.url().optional(),
    /** Lower numbers come first. */
    order: z.number().default(0),
    /** True while this entry is stand-in content. */
    placeholder: z.boolean().default(false),
  }),
});

/** One MDX (or markdown) file per post. The file name is its URL: /blog/<name>. */
const blog = defineCollection({
  loader: glob({ pattern: "*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    placeholder: z.boolean().default(false),
  }),
});

export const collections = { seasons, projects, blog };
