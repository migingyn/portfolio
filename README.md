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
| The logo (the penguin) | `src/assets/logo/penguin.svg` |
| The penguin's outfits, one per file; a season picks one with `outfit:` | `src/assets/logo/outfits/` |
| Home's animated scene (the leaf pile); a season picks it with `scene:` | `src/components/scenes/LeafPile.astro`, `src/scripts/leaf-pile.ts` |
| Design tokens as CSS variables and Tailwind theme | `src/styles/tokens.css` |
| Light theme colours and the timing of the dark/light fade | `src/styles/tokens.css` (`[data-theme="light"]`, `--duration-theme`, `--delay-theme`) |
| Page shell: header, section, video layer | `src/layouts/BaseLayout.astro` |
| Footer and the visitor count | `src/components/Footer.astro`, `api/views.js` |
| Dial navigation | `src/components/Dial.tsx` |
| Loading screen and its ASCII character | `src/components/Character.astro`, `src/scripts/ascii-character.ts` |
| Now playing | `src/components/NowPlaying.tsx` |
| Pages | `src/pages/` |
| Section modules (one per section, each fed by a data file) | `src/components/sections/` |

## Replacing the placeholders

Every section is filled from a data file. Stand-in entries carry `placeholder: true`
and show a small "Placeholder" mark; replace the entry and drop that line.

| Section | Edit |
|---|---|
| Projects | `src/content/projects/*.md` (one file per project; the file name is its URL) |
| Experience | `src/data/experience.ts` |
| Resume | add `public/resume.pdf` |
| Blog | `src/content/blog/*.mdx` (one file per post) |
| Seasons | `src/content/seasons/*.md` |
| Links | `links` in `src/site.config.ts` |

The loading screen plays on a first visit only. Add `?intro` to the URL to replay it.

To start a new season, add a file to `src/content/seasons/` and set `currentSeason`
in `src/site.config.ts` to its file name.

To give the penguin a new outfit, draw it on top of `src/assets/logo/penguin.svg`
(same 100 by 100 grid), save only the outfit as `src/assets/logo/outfits/<name>.svg`,
and put `outfit: <name>` in the season file. Fill it with `var(--color-accent)` to
take the season colour. The browser-tab icon follows.

## Design workflow

The design skills are vendored in `.claude/skills` (see `.claude/SKILLS.md`).
taste-skill's gate checks the built home page:

```bash
node .claude/skills/design-taste-frontend/scripts/gate.mjs dist/index.html --root dist
```

## Tests and CI/CD

The Playwright tests in `tests/e2e` run against the built site in a desktop and a
phone-sized browser. They cover every page (loads, heading, no sideways scroll, an
accessibility scan in both themes), the home links, the loading screen, the dial,
and the theme switch.

```bash
npm test
```

That builds first. To run the tests against a build you already have:

```bash
npm run test:e2e
```

`.github/workflows/ci.yml` runs the same build and tests on every push. If a test
fails, the run keeps a report you can download from its page on GitHub.

**Deploying.** There are two ways; pick one.

- *Vercel's own GitHub connection* (the default if you imported the repo in Vercel):
  Vercel deploys every push to `main` by itself. It does not wait for the tests.
- *Deploy from CI, only after the tests pass:* the workflow's `deploy` job does this.
  It is off until you switch it on:
  1. In Vercel, create a token (Account Settings, Tokens).
  2. In the GitHub repository, under Settings, Secrets and variables, Actions, add
     the secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` (the two IDs
     are in `.vercel/project.json` after running `npx vercel link` once).
  3. On the Variables tab of the same page, add `VERCEL_DEPLOY` with the value `true`.
  4. In the Vercel project, under Settings, Git, turn off automatic deployments, so
     the site is not deployed twice.

## Visitor count

The footer shows how many people have visited. The number is kept in an Upstash
Redis database by one Vercel Function, `api/views.js`. Until a database is connected
the footer shows only the name, and nothing else is affected.

To switch it on:

1. In the Vercel project, open **Storage**, choose **Upstash** (Redis), and create a
   database on the free plan.
2. Connect it to this project. Vercel adds the two settings the function reads,
   `KV_REST_API_URL` and `KV_REST_API_TOKEN` (`.env.example` lists them).
3. Redeploy. The count starts at zero.

Each browser is counted once. Only the number is stored. To start again from zero,
delete the key `portfolio:visitors` in the database's data browser.

## Shipping

Commits and pushes follow `.claude/skills/ship-it`: build and checks first, plain
commit messages with no AI attribution, no force push or history rewrite without
asking, no pull request unless asked.

No secrets live in this repo. API keys go in Vercel environment variables.
