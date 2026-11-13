import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

/**
 * Fontsource ships a legacy .woff fallback next to every .woff2. Every browser
 * this site supports reads woff2, so drop the fallbacks from the built CSS and
 * delete the files. This roughly halves the font CSS (the Japanese index most of all).
 */
function woff2Only() {
  return {
    name: "woff2-only",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const assets = fileURLToPath(new URL("_astro/", dir));
        const files = await readdir(assets);
        for (const file of files.filter((f) => f.endsWith(".css"))) {
          const css = await readFile(assets + file, "utf8");
          await writeFile(assets + file, css.replace(/,\s*url\([^)]+\.woff\)\s*format\(["']woff["']\)/g, ""));
        }
        await Promise.all(files.filter((f) => f.endsWith(".woff")).map((f) => rm(assets + f)));
      },
    },
  };
}

// Static output. Vercel serves the built `dist/` with zero config.
export default defineConfig({
  integrations: [react(), mdx(), woff2Only()],
  vite: {
    plugins: [tailwindcss()],
    // Never inline font files as base64: it bloats the CSS and defeats on-demand loading.
    build: { assetsInlineLimit: 0 },
  },
});
