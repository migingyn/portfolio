# Product
<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Mainly read as a software engineer's portfolio. First, recruiters and hiring managers
scanning for projects, experience, and a resume. Then founders and other builders
looking at what he has shipped and how he thinks. (Owner, 2026-11-16.)

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
- DESIGN.md (written by the owner) is the source of truth: quiet, dark, media-led, with three signature moments (ASCII loading screen, dial navigation, video loops).
- The owner's own footage only. No stock or generated photos or video; placeholders until clips arrive.
- One font family (Hagrid, Inter until the licensed files are added). Almost no colour.
- No cards, boxes, pills, rounded corners, gradients, glows, or shadows. No other brand's logos, marks, or characters.
- The ASCII character stays, on the loading screen only.
- taste-skill is essential to the workflow; Impeccable and Emil Kowalski's skills polish.

## Evidence on Hand
- Not yet supplied, and not to be invented: section footage (5 to 10 clips), the licensed Hagrid files, a final logo, project write-ups, experience, resume PDF, the season's mood line, playlist and track notes, social links.

## Accessibility & Inclusion
Keyboard access throughout, visible focus, 4.5:1 text contrast, 44px touch targets,
`prefers-reduced-motion` respected, and a control to pause looping motion.
