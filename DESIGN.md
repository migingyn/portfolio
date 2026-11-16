---
version: 1.0
name: Portfolio "Mikey Nguyen"
status: Active. Replaces every earlier direction. The old decision log lives in DECISIONS.md and is history only.
description: >
  A quiet, dark, media-led portfolio. Generous empty space, small type, and my own
  footage doing the talking. Three signature moments make it memorable. A small ASCII
  character on a black loading screen, a rotating circular dial for navigation, and a
  muted video loop behind every section.

references:
  kapital.jp: "Full-bleed lookbook image with a small wordmark. Nothing else on the first screen."
  lafour.com: "Each section has its own full-frame muted video loop with tiny type over it."
  anygivenmoment.co: "Generous empty space and a rotating circular dial as the navigation."
  anaiis.world: "Black loading screen with one small symbol changing in the center. An unusual logo."
  note: "Copy only the decisions listed here. Ignore everything else about these sites."

colors:
  canvas: "#0c0c0c"    # page background, menu, loading screen
  text: "#f2f0ea"      # primary text, logo, ASCII character
  muted: "#8a8a85"     # secondary text, labels, inactive dial items
  line: "#2a2a2a"      # hairlines only
  accent: "#c6ff1a"    # season colour. Overridden per season
  focus: "#2997ff"     # keyboard focus ring only

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

radius: 0px  # everywhere. Circles only where the shape is truly round (the dial)

motion:
  fast: 150ms
  base: 240ms
  dial: 400ms
  loader: 2000ms
  ease: "cubic-bezier(0.23, 1, 0.32, 1)"
---

# DESIGN.md

The single source of truth for how the site looks and moves. Tokens are in the front
matter. Rules are below. Only rules currently in effect live in this file. History
goes in DECISIONS.md.

## 1. Concept

The site is quiet, and my footage and three signature moments carry it.

1. **Empty space is the design.** Few elements, small type, lots of room.
2. **Media does the talking.** Each section has a full-frame muted video loop from my own footage.
3. **Three signature moments.** The ASCII loading screen, the dial, and the corner character. Nothing else draws attention to itself.
4. **One font family, almost no colour.** The season accent appears only in tiny places.

## 2. Colour

| Token | Hex | Use |
|---|---|---|
| `canvas` | `#0c0c0c` | Page, menu, loading screen |
| `text` | `#f2f0ea` | Text, logo, ASCII character |
| `muted` | `#8a8a85` | Secondary text, labels, inactive dial items |
| `line` | `#2a2a2a` | Hairlines only |
| `accent` | `#c6ff1a` | The dial's current position, link hover underline, Em's right eye, the now-playing dot |
| `focus` | `#2997ff` | 2px keyboard focus ring, 2px offset |

Text over video sits on a soft dark scrim at the edges so it keeps 4.5:1 contrast.

### Seasons
Each season file in `src/content/seasons` sets `accent`, the home video, a mood line,
and the playlist. A season accent must reach 4.5:1 on `canvas` or the build fails.
Nothing else changes between seasons.

## 3. Typography

One family. Hagrid for my name and section titles, Hagrid Text for everything else.
Inter is the fallback until the licensed files are added to `public/fonts`. The font
stack must stay easy to swap.

The only large type is my name, once, on the home section. Everything else is small.
No kickers above titles. No numbering unless order matters.

## 4. Layout

- Each section is one full screen, with its video full-bleed behind it.
- Text sits small in a corner or along one edge of the screen. Never centred in a box.
- Margins are 64px desktop, 32px tablet, 16px phone.
- Breakpoints are 480, 768, 1024, 1280. Touch targets are 44px minimum.
- No cards, boxes, panels, pills, gradients, glows, or drop shadows.

## 5. Components

### Logo
Em is a temporary logo. It is one SVG file at `src/assets/em.svg` and can be replaced
without touching anything else. Em's right eye uses `accent`. Clicking Em opens the dial.

### Dial navigation
A circular dial, after anygivenmoment.co. Sections sit around the ring in `small` type.
The current section sits at the top in `text` with an `accent` mark. Others are `muted`.

- Opens from the logo. Closes with Escape, a click outside, or choosing a section.
- Rotates with mouse drag, scroll wheel, arrow keys, and touch swipe. 400ms ease between positions.
- Sections are Home, Projects, Experience, Resume, Blog, Seasons, Links.
- Every item is also a normal link, so the dial works with a keyboard and screen readers.

### Section video
Each section plays a full-frame muted loop from my footage, after lafour.com.

- One file per section at `public/video/<section>.mp4`, plus a poster image. Placeholders until I add clips.
- Muted, looped, `playsinline`. Never plays sound.
- Under `prefers-reduced-motion` the poster image shows instead.

### Loading screen
After anaiis.world. A black screen with nothing on it but my existing ASCII character.

- Small and centred, about 120px tall, in `text`.
- The character changes in place, cycling through its pose frames like a symbol morphing, and ends on its final pose.
- No loading bar, impact lines, text, or background effects.
- About 2 seconds, then the black fades straight into the home section.
- First visit only. Skippable with a click or any key. Add `?intro` to the URL to replay it.
- Under `prefers-reduced-motion` the intro is skipped.

### Corner character
After the intro, the ASCII character moves into the bottom-left corner at small size and
stays on every page.

- It turns toward the dial when the dial moves.
- It snaps a short pose when the section changes.
- Under `prefers-reduced-motion` it stays still.

### Now playing
A single small line in the bottom-right corner with an `accent` dot, the song, and the
artist. Clicking it opens the season playlist with my one-line note under each song.
Uses the season's Spotify embed. Persists across pages. Never autoplays.

### Links and buttons
Links are `text` in `small` type. On hover a 1px `accent` underline draws in from the
left. There is one button style, a 1px `text` outline, square, `small` type, 44px tall.
Hover fills it `text` with `canvas` letters.

## 6. Motion

| What | Timing |
|---|---|
| Loading screen | About 2s, first visit only |
| Dial rotation | 400ms |
| Section change | Video crossfades over 240ms |
| Link underline, button fill | 150ms |
| Corner character reactions | Short, under 400ms |

- Exits are faster than entrances. Hover effects apply only on devices with a mouse.
- Nothing follows the pointer except the dial when it is being dragged.
- `prefers-reduced-motion` turns off the intro, video loops, and character motion.

## 7. Accessibility

- Text contrast is 4.5:1 or better, over video included.
- Every interactive element is 44px minimum with a visible focus ring.
- The dial is fully usable by keyboard and screen reader.
- Videos are decorative and hidden from assistive tech. The ASCII character is decorative.
- A skip link is the first Tab stop.

## 8. Do and don't

**Do**
- Leave space empty.
- Let my footage carry each section.
- Keep the three signature moments and nothing else loud.

**Don't**
- Add cards, boxes, pills, rounded corners, gradients, glows, or shadows.
- Add a second font family or extra colours.
- Use stock or generated photos or video. Use placeholders until I supply my own.
- Use any other brand's logos, marks, or characters.
- Add a new visual element without a line in DECISIONS.md.

## 9. Open items

1. **Footage.** I will supply 5 to 10 clips, 5 to 10 seconds each.
2. **Font.** I will add licensed Hagrid files. Inter until then.
3. **Logo.** Em is temporary.
4. **Seasons.** First season's accent, video, mood line, and playlist to come.
