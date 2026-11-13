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
| Name, tagline, menu links, cover lines, "Now" copy, footer links, current season | `src/site.config.ts` |
| Seasons (one markdown file each) | `src/content/seasons/` |
| Design tokens as CSS variables and Tailwind theme | `src/styles/tokens.css` |
| Page shell (head, fonts, menu, footer) | `src/layouts/BaseLayout.astro` |
| Masthead and slide-in menu | `src/components/SiteMenu.tsx` |
| Home page (magazine cover) pieces | `src/components/cover/` |
| First-visit loading screen (add `?intro` to the URL to replay it) | `src/components/LoadingScreen.astro`, `src/scripts/ascii-pose.ts` |

To start a new season, add a file to `src/content/seasons/` and set `currentSeason`
in `src/site.config.ts` to its file name.

No secrets live in this repo. API keys go in Vercel environment variables.
