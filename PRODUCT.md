# Product
<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
One site for everyone who looks Mikey up: recruiters and hiring managers scanning for
projects, experience, and a resume; founders and investors looking for what he has
shipped; and other builders and friends. (Confirmed by the owner, 2026-11-13.)

## Product Purpose
The personal portfolio of Mikey Nguyen, a backend engineer and creative builder in San
Diego. It shows his projects, experience, resume, writing, and what he is doing now,
and it changes with the seasons: each season has its own image, accent colors, mood
line, and playlist.

## Positioning
A portfolio that is itself a piece of creative work: an engineer's site with a
filmmaker's eye, re-issued every season.

## Operating Context
"Creative builder" means video and film, and side projects and apps (confirmed).
Sections: Home, Projects, Experience, Resume, Blog, Seasons, Links. Clicking the name
opens the menu. A persistent Spotify player carries the season's playlist.

## Capabilities and Constraints
- Astro with React islands, Tailwind CSS, Motion, MDX, View Transitions, deployed on Vercel.
- Content lives in the repo: seasons and projects as markdown, blog as MDX, experience as a data file.
- No secrets in the repo. No autoplaying music.
- Must be fast, responsive on phones, and accessible.
- Built so far: design tokens, layout, menu, home page, first-visit loading screen.

## Brand Commitments
- Dark canvas.
- "Y2K fashion cool": chromehearts.com is the main reference, with us.supreme.com/pages/shop and viviennewestwood.com. Not a game look.
- No Japanese copy. No pill-shaped buttons or tags.
- The ASCII art loading screen stays, and is the only place ASCII appears.
- taste-skill is essential to the workflow; Impeccable and Emil Kowalski's skills polish.
- DESIGN.md at the project root is the source of truth for visual decisions.

## Evidence on Hand
- The owner's five reference ads (in chat, not in the repo).
- The owner will supply a home page photo or film still. Until then the home page uses a generated stand-in, `src/assets/hero-standin.jpg`, which must not be presented as his work.
- Not yet supplied: project write-ups, resume PDF, playlist and track notes, social links, the "filming" line. Do not invent these.

## Accessibility & Inclusion
Keyboard access throughout, visible focus, 4.5:1 text contrast, 44px touch targets,
`prefers-reduced-motion` respected, and a control to pause looping motion.
