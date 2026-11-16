# portfolio

Personal site of Mikey Nguyen, backend engineer and creative builder. Astro, React
islands, Tailwind CSS, Motion, MDX, deployed on Vercel.

**[DESIGN.md](./DESIGN.md) is the source of truth for how the site looks and moves.**
It holds only the rules in effect. [DECISIONS.md](./DECISIONS.md) holds the history,
and every new visual element gets a line there. Tokens are mirrored in
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
| Name, tagline, the dial's sections, the home links, current season | `src/site.config.ts` |
| Seasons: accent colour, home video, mood line, playlist and track notes | `src/content/seasons/` |
| Section videos and posters (your footage) | `public/video/` (see its README) |
| Hagrid font files (licensed, not in the repo) | `public/fonts/`, switched on in `src/styles/fonts.css` |
| The logo, Em | `src/assets/em.svg` |
| Design tokens as CSS variables and Tailwind theme | `src/styles/tokens.css` |
| Page shell: header, section, video layer | `src/layouts/BaseLayout.astro` |
| Dial navigation | `src/components/Dial.tsx` |
| ASCII character: loading screen and corner character | `src/components/Character.astro`, `src/scripts/ascii-character.ts` |
| Now playing | `src/components/NowPlaying.tsx` |
| Home, and the other sections (one-screen stubs for now) | `src/pages/index.astro`, `src/pages/[section].astro` |

The loading screen plays on a first visit only. Add `?intro` to the URL to replay it.

To start a new season, add a file to `src/content/seasons/` and set `currentSeason`
in `src/site.config.ts` to its file name.

## Design workflow

The design skills are vendored in `.claude/skills` (see `.claude/SKILLS.md`).
taste-skill's gate checks the built home page:

```bash
node .claude/skills/design-taste-frontend/scripts/gate.mjs dist/index.html --root dist
```

No secrets live in this repo. API keys go in Vercel environment variables.
