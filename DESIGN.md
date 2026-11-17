---
version: 1.4
name: Portfolio "Mikey Nguyen"
status: Active. v1.4 adds the footer with the public visitor count. How each rule got here is in DECISIONS.md.
description: >
  A quiet, dark, media-led portfolio. Generous empty space, small type, and my own
  footage doing the talking. Three signature moments make it memorable. A small ASCII
  character on a black loading screen, a rotating circular dial for navigation, and a
  muted video loop behind every section. A penguin in the corner wears the season.

references:
  kapital.jp: "Full-bleed lookbook image with a small wordmark. Nothing else on the first screen."
  lafour.com: "Each section has its own full-frame muted video loop with tiny type over it."
  anygivenmoment.co: "Generous empty space and a rotating circular dial as the navigation."
  anaiis.world: "Black loading screen with one small symbol changing in the center. An unusual logo."
  note: "Copy only the decisions listed here. Ignore everything else about these sites."

colors:
  dark:                  # the default theme
    canvas: "#0c0c0c"    # page background, menu, loading screen
    text: "#f2f0ea"      # primary text, the ASCII character on the loading screen
    muted: "#8a8a85"     # secondary text, labels, inactive dial items, the theme switch
    line: "#2a2a2a"      # hairlines only
    focus: "#2997ff"     # keyboard focus ring only
  light:                 # by the visitor's choice only
    canvas: "#f2f0ea"
    text: "#0c0c0c"
    muted: "#5c5c58"
    line: "#d4d1c9"
    focus: "#0071e3"
  accent: "#c46a28"      # season colour, set per season. Autumn 2026 is a burnt orange-brown
  accentDefault: "#c6ff1a"  # used only if a season sets none
  logo:                  # the penguin. The same in both themes
    hood: "#2a2a2a"
    face: "#f2f0ea"
    eyes: "#0c0c0c"

typography:
  families:
    display: "'Hagrid', 'Inter', system-ui, sans-serif"       # my name and section titles
    text: "'Hagrid Text', 'Inter', system-ui, sans-serif"     # everything else
    ascii: "ui-monospace, 'SF Mono', Menlo, monospace"         # the ASCII character only
  scale:
    name:  { family: display, size: "clamp(40px, 6vw, 88px)", weight: 700, lineHeight: 0.95 }
    title: { family: display, size: "clamp(20px, 2vw, 28px)", weight: 600, lineHeight: 1.1 }
    body:  { family: text, size: "15px", weight: 400, lineHeight: 1.55 }
    small: { family: text, size: "12px", weight: 500, lineHeight: 1.4, letterSpacing: "0.08em", case: upper }

spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32, 48, 64, 96, 128]

radius: 0px  # everywhere. Circles only where the shape is truly round (the dial, the now-playing dot)

motion:
  fast: 150ms
  base: 240ms
  dial: 400ms
  loader: 2000ms
  theme: 1200ms       # the dark/light fade
  themeDelay: 300ms   # the hold before it
  ease: "cubic-bezier(0.23, 1, 0.32, 1)"
---

# DESIGN.md

The single source of truth for how the site looks and moves. Tokens are in the front
matter and mirrored in `src/styles/tokens.css`. Rules are below. Only rules currently
in effect live in this file. History goes in DECISIONS.md.

## 1. Concept

The site is quiet, and my footage and its signature moments carry it. It is a
software engineer's portfolio first: a recruiter, founder, or builder should know who
I am and where to click within a few seconds.

1. **Empty space is the design.** Few elements, small type, lots of room.
2. **Media does the talking.** Each section has a full-frame muted video loop from my own footage.
3. **Three signature moments.** The ASCII loading screen, the dial, and the video loops. Nothing else draws attention to itself.
4. **One font family, almost no colour.** The season accent appears only in tiny places.

## 2. Colour

| Token | Dark | Light | Use |
|---|---|---|---|
| `canvas` | `#0c0c0c` | `#f2f0ea` | Page, menu, loading screen |
| `text` | `#f2f0ea` | `#0c0c0c` | Text, the ASCII character on the loading screen |
| `muted` | `#8a8a85` | `#5c5c58` | Secondary text, labels, inactive dial items, the theme switch |
| `line` | `#2a2a2a` | `#d4d1c9` | Hairlines only |
| `accent` | season | season | The dial's current position, link hover underline, the penguin's outfit, the now-playing dot |
| `focus` | `#2997ff` | `#0071e3` | 2px keyboard focus ring, 2px offset |

Text over video sits on a soft scrim of the `canvas` colour at the edges so it keeps
4.5:1 contrast.

### Themes
The site opens dark. Light is the visitor's choice, made with the theme switch and
remembered on their device. The light theme is the same two neutrals trading places;
nothing else about the design changes.

### Seasons
Each season file in `src/content/seasons` sets `accent`, the penguin's `outfit`, the
home `scene`, the home video, a mood line, and the playlist. Nothing else changes
between seasons.

- A season accent must reach 4.5:1 on the dark `canvas` or the build fails.
- On the light `canvas` it must reach 3:1. If it does not, the build darkens it until it does.
- Autumn 2026 is a burnt orange-brown, `#c46a28`. The penguin wears a plaid scarf, and Home's scene is the leaf pile.

## 3. Typography

One family. Hagrid for my name and section titles, Hagrid Text for everything else.
Inter is the fallback until the licensed files are added to `public/fonts`. The font
stack must stay easy to swap.

The only large type is my name, once, on the home section. Everything else is small.
No kickers above titles. No numbering unless order matters.

## 4. Layout

- Each section is its own page and at least one full screen, with its video full-bleed behind it. It grows when a list needs the room.
- Text sits small along the left edge of the screen. Never centred in a box.
- Three corners are fixed on every page: logo top left, season and theme switch top right, now playing bottom right. The bottom left stays empty.
- Under each section is a footer, reached by scrolling. Once the page has scrolled, the top of the screen fades to `canvas` so text never runs through the logo or the season label.
- Margins are 64px desktop, 32px tablet, 16px phone.
- Breakpoints are 480, 768, 1024, 1280. Touch targets are 44px minimum.
- No cards, boxes, panels, pills, gradients, glows, or drop shadows.

## 5. Components

### Logo
A penguin peeking in from the lower left, 48px, top left. It is one SVG file at
`src/assets/logo/penguin.svg`. It keeps its own three colours in both themes. Clicking
it opens the dial.

Each season can dress it. An outfit is one SVG file in `src/assets/logo/outfits`,
drawn on the penguin's 100 by 100 grid and layered on top; the season file names it
with `outfit:`. An outfit's ground is `accent`, and any pattern on it uses only the
two neutrals. Outfits are my own designs, never another brand's pattern. The
browser-tab icon is built from the same penguin and outfit.

### Theme switch
One 20px line icon in `muted`, top right beside the season name: a sun in the dark, a
moon in the light. No box around it. 44px target.

### Season label
The season's name, and its mood line once written, in `small` `muted` type, top right.

### Dial navigation
A circular dial, after anygivenmoment.co. Sections sit around the ring in `small` type.
The current section sits at the top in `text` with an `accent` mark. Others are `muted`.

- Opens from the logo, centred over the page. Closes with Escape, a click outside, the small "Close" link at the bottom, or choosing a section.
- Rotates with mouse drag, scroll wheel, arrow keys, and touch swipe. 400ms ease between positions.
- Sections are Home, Projects, Experience, Resume, Blog, Seasons, Links.
- Every item is also a normal link, so the dial works with a keyboard and screen readers.

### Section video
Each section plays a full-frame muted loop from my footage, after lafour.com.

- One file per section at `public/video/<section>.mp4`, plus a poster image. Until I add a clip, the section is the bare `canvas`, with nothing drawn in the video's place.
- Muted, looped, `playsinline`. Never plays sound.
- A section with a clip gets a small `muted` "Pause video" link under its text.
- Under `prefers-reduced-motion` the poster image shows instead.

### Home scene
While Home has no video, a small scene plays at the foot of the screen: in the right
five of twelve columns on wide screens, under the text on narrow ones. It stands on a
`line` hairline that runs the width of the content. The season picks the scene; there
is one so far.

**Leaf pile (autumn).** Two bare-branched trees in `line`, 36 leaves in `accent`, and
the penguin at full height in the logo's own colours and scarf.

- The loop, about 45 seconds: the leaves fall, he carries them to a pile a few at a time, steps back, runs and jumps in. The pile bursts, a gust carries every leaf back to its tree while he naps where he landed, then he wakes and it starts again.
- A pointer on the penguin makes him stop where he is and laugh for as long as it stays there. On a touch screen, a tap makes him laugh for a moment.
- A click or tap on the pile blows it apart. He slumps, sad, for a couple of seconds, then gathers the leaves again.
- It uses only what the page already has: `line`, `accent`, `muted` for the gust and the sleeping z's, and the penguin's three colours. No new colours, no outlines, no shadows.
- It is small and off to the side. The name and links stay the first thing read.
- It pauses when the tab is hidden, the dial is open, or the loading screen is up. A real home video replaces it.
- Under `prefers-reduced-motion` it is a still picture: leaves on the trees, the penguin standing.

### Loading screen
After anaiis.world. A black screen with nothing on it but my ASCII character.

- Small and centred, about 120px tall, in `text`.
- The character changes in place, cycling through its pose frames like a symbol morphing, and ends on its final pose.
- No loading bar, impact lines, text, or background effects.
- About 2 seconds, then the black and the character fade out together, straight into the page. The character does not stay on the page afterwards.
- First visit only, which is always dark. Skippable with a click or any key. Add `?intro` to the URL to replay it.
- Under `prefers-reduced-motion` the intro is skipped.

### Now playing
A single small line in the bottom-right corner with an `accent` dot, the song, and the
artist. Clicking it opens the season playlist with my one-line note under each song.
Uses the season's Spotify embed. Persists across pages. Never autoplays. It appears
once a season has a playlist and tracks.

### Section lists
Projects, experience, posts, seasons, and links are plain rows divided by `line`
hairlines: a `small` title or link, a `body` line, and `muted` `small` details.
Stand-in entries carry a small "Placeholder" mark in `text` until real content
replaces them.

### Footer
One quiet row under every page, below the first screen: a `line` hairline, then
`small` `muted` type. On the left, the year and my name. On the right, how many
people have visited: "1,284 visitors".

- The count is public. Anyone who scrolls down sees the same number I do.
- Each browser is counted once, the first time it opens the site. Nothing about the visitor is stored, only the number.
- The number is kept by a small function on Vercel (`api/views.js`) in an Upstash Redis database. If that is not set up or cannot be reached, the count is simply not shown.

### Links and buttons
Links are `text` in `small` type. On hover a 1px `accent` underline draws in from the
left. There is one button style, a 1px `text` outline, square, `small` type, 44px tall.
Hover fills it `text` with `canvas` letters. The home section has one button, "See the
projects"; the resume and GitHub are links beside it.

## 6. Motion

| What | Timing |
|---|---|
| Loading screen | About 2s, first visit only, then a 240ms fade into the page |
| Dial rotation | 400ms |
| Section change | The page crossfades over 240ms |
| Link underline, button fill, theme icon swap | 150ms |
| Theme change | The icon swaps at once, the page holds 300ms, then every colour fades over 1200ms |

- Exits are faster than entrances. Hover effects apply only on devices with a mouse.
- Nothing follows the pointer except the dial when it is being dragged. The home scene reacts to the pointer (a laugh, a blown pile) but does not follow it.
- The theme change is the one slow transition on the site, on purpose. No other transition runs longer than the dial. The home scene is a loop, not a transition, and keeps its own unhurried pace.
- `prefers-reduced-motion` turns off the intro and video loops and stills the home scene. The theme change drops its hold and fades in 240ms.

## 7. Accessibility

- Text contrast is 4.5:1 or better in both themes, over video included.
- Every interactive element is 44px minimum with a visible focus ring.
- The dial is fully usable by keyboard and screen reader.
- The visitor count is plain text in the footer, read out like any other line.
- Videos and the home scene are decorative and hidden from assistive tech. Nothing a visitor needs is in the scene. The ASCII character and the logo drawing are decorative; the logo button is labelled "Open navigation".
- The theme switch says which theme it switches to.
- A skip link is the first Tab stop.

## 8. Do and don't

**Do**
- Leave space empty.
- Let my footage carry each section.
- Keep the signature moments and nothing else loud.
- Give each season one colour and, if I like, one outfit and one home scene.

**Don't**
- Add cards, boxes, pills, rounded corners, gradients, glows, or shadows.
- Add a second font family or extra colours.
- Use stock or generated photos or video. Leave the canvas bare until I supply my own.
- Use any other brand's logos, marks, patterns, or characters.
- Add a new visual element without a line in DECISIONS.md.

## 9. Open items

1. **Footage.** I will supply 5 to 10 clips, 5 to 10 seconds each.
2. **Font.** I will add licensed Hagrid files. Inter until then.
3. **Seasons.** Autumn's mood line and playlist to come.
4. **Content.** Projects, experience, resume, and links are stand-ins until I fill them.
