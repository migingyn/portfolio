# portfolio

Personal site of Mikey Nguyen. Astro, React islands, Tailwind CSS, Motion, MDX, deployed on Vercel.

**[DESIGN.md](./DESIGN.md) is the source of truth for every visual decision.** Change a
token there first, add a row to its Decision Log, then mirror it in
`src/styles/tokens.css`.

## Commands

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

## Where things live

| What | Where |
|---|---|
| Name, tagline, menu links, the home button, "Now" copy, current season | `src/site.config.ts` |
| Seasons (one markdown file each) | `src/content/seasons/` |
| Design tokens as CSS variables and Tailwind theme | `src/styles/tokens.css` |
| Page shell (head, fonts, menu, footer) | `src/layouts/BaseLayout.astro` |
| Header and slide-in menu | `src/components/SiteHeader.astro`, `src/components/MenuPanel.tsx` |
| Home page | `src/pages/index.astro` |
| Closing screen (site index) | `src/components/SiteFooter.astro` |
| taste-skill's photo-develop moment (copied from the kit, do not edit) | `public/assets/moments/` |
| First-visit loading screen (add `?intro` to the URL to replay it) | `src/components/LoadingScreen.astro`, `src/scripts/ascii-pose.ts` |

To start a new season, add a file to `src/content/seasons/` and set `currentSeason`
in `src/site.config.ts` to its file name.

**Home page photo.** Put your photo next to the season file (for example
`src/content/seasons/autumn-2026.jpg`) and set `hero` and `heroAlt` in that file. Until
then the page shows a generated stand-in, `src/assets/hero-standin.jpg`.

No secrets live in this repo. API keys go in Vercel environment variables.
