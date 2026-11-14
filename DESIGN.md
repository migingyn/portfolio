---
version: 0.6
name: Portfolio "Mikey Nguyen"
status: In use. Milestone 1 (tokens, layout, menu, home) is built from this file. Tokens are mirrored in src/styles/tokens.css.
description: >
  A fashion-house site for a person. Black page, a small gothic name laid over one
  full-bleed photograph, tiny plain type, a side menu, and nothing else. Chrome Hearts
  is the base reference, with Supreme and Vivienne Westwood behind it. The only
  flourish is the first-visit ASCII loading screen.

colors:
  black: "#0a0a0a"     # page, card, menu panel, button fill on photos
  white: "#ffffff"     # text, the name, button outline and hover fill
  grey: "#9a9a9a"      # secondary text (7.3:1 on black)
  line: "#2e2e2e"      # hairlines: card edge, list rules, panel edge
  red: "#e60012"       # the favicon's box mark only
  focus: "#2997ff"     # keyboard focus ring only
  accent: "#ff7a00"    # the season's one colour; the loading screen only. A season may override it (D-055)

typography:
  families:
    wordmark: "'Grenze Gotisch', 'Old English Text MT', serif"            # the name only
    sans: "'Arimo', 'Helvetica Neue', Helvetica, Arial, sans-serif"       # everything else
    mono: "'Courier Prime', 'Courier New', Courier, monospace"            # tagline, clock, card, "soon", loading screen
  scale:
    wordmark: { family: wordmark, size: "clamp(32px, 4.6vw, 56px)", weight: 900, lineHeight: 1.0 }
    title:    { family: sans, size: "clamp(28px, 3.4vw, 44px)", weight: 700, lineHeight: 1.05, case: upper }
    body:     { family: sans, size: "16px", weight: 400, lineHeight: 1.5 }
    caps:     { family: sans, size: "12px", weight: 700, lineHeight: 1.3, letterSpacing: "0.14em", case: upper }
    mono:     { family: mono, size: "13px", weight: 400, lineHeight: 1.4 }

spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32, 48, 64, 96]

rounded:
  none: 0px      # everything
  full: 9999px   # true circles only. Never a pill

layout:
  container: "min(100% - 2 * margin, 1280px), centered; header, every section, and the closing share it"
  margin: { phone: 16px, tablet: 32px, desktop: 64px }
  breakpoints: { sm: 480px, md: 768px, lg: 1024px, xl: 1280px }
  sections: "the hero is exactly one screen; the closing section is one screen on desktop"

motion:
  fast: 120ms      # hover fill
  press: 160ms     # press feedback
  base: 180ms      # underline draw, exits
  slow: 280ms      # menu entering
  develop: 1600ms  # the photograph developing (taste-skill's picture-develops)
  ease: "cubic-bezier(0.23, 1, 0.32, 1)"
---

# DESIGN.md

Design system for my portfolio site. This file is the single source of truth: tokens
live in the front matter above, the reasoning lives below, and every choice we make
gets a row in the [Decision Log](#10-decision-log).

## 0. Workflow and sources

**References, in order.** chromehearts.com is the base. us.supreme.com/pages/shop and
viviennewestwood.com are the other two. The earlier references (the 2000s Japanese ads,
The Verge, Apple, Nintendo 2001) now only inform the photograph's film treatment.

**Skills.** All three are vendored in `.claude/skills` (see `.claude/SKILLS.md`).

1. **taste-skill** is essential and sets the page's structure and checks. Its gate
   runs against the built page: `node .claude/skills/design-taste-frontend/scripts/gate.mjs dist/index.html --root dist`.
   In this container Chrome needs its sandbox off, so `CHROME_PATH` points at a small
   wrapper in `.taste-skill/`. Last result: **GATE: PASS** (2026-11-13), with two
   non-blocking warnings: the hero and the closing screen carry the same button, and
   the closing screen has a lot of empty space.
2. **Impeccable** sets direction and runs its detector over the source
   (`.claude/skills/impeccable/scripts/impeccable detect --json src`). Its files:
   `PRODUCT.md` and `.impeccable/surfaces/`.
3. **Emil Kowalski's skills** set the interaction details (section 7).

When they disagree, the order is: owner's brief, then this file, then the skills.

## 1. Concept

**A fashion house's site, for a person.** What makes those sites cool is how little is
on them: a black page, a logo, one large photograph, a few words in small type, and a
menu that stays out of the way. This site does the same. The photograph changes with
the season; everything else is black and white.

1. **The photograph is the page.** One image, full-bleed, a whole screen tall.
2. **Small, plain type.** Twelve-pixel caps, thirteen-pixel Courier. The only large
   type is the name, once, on the closing screen.
3. **Black and white.** Colour comes from the photograph.
4. **No objects, overlays, or effects.** No drawn devices, stickers, bursts, readouts,
   glows, or chunky display fonts. If it would look at home in a game menu, it is out.
5. **Rectangles, not pills.** Hairline rectangles; states in plain words.
6. **One flourish:** the first-visit ASCII loading screen.

## 2. Colors

| Token | Hex | Use |
|---|---|---|
| `black` | `#0a0a0a` | Page, card, menu panel, the fill behind a button on a photo |
| `white` | `#ffffff` | Text, the name, button outline and hover fill, selection |
| `grey` | `#9a9a9a` | Secondary text: the tagline's neighbours, card labels, "soon" (7.3:1 on black) |
| `line` | `#2e2e2e` | Hairlines: card edge, list rules, panel edge |
| `red` | `#e60012` | The favicon's box mark. Nowhere on the page |
| `focus` | `#2997ff` | 2px keyboard focus ring, 2px offset |
| `accent` | `#ff7a00` | The season's colour, on the loading screen only |

The header sits on the photograph over a scrim: `black` at 78% fading to clear across
the top 30% of the hero. Text selection is white on black; scrollbars are `grey` on `black`.

### Seasons
Each season file in `src/content/seasons` supplies the home photograph (`hero`,
`heroAlt`), a mood line, and may override `accent`. A season colour must reach 4.5:1
against `black`, and the build fails if it does not.

## 3. Typography

| Family | Job |
|---|---|
| **Grenze Gotisch 900** | The name, and nothing else. Upright, flat white, no outline, shadow, or skew |
| **Arimo** (400, 700) | Everything else in the interface |
| **Courier Prime** | The tagline, the clock, the card's text, "soon", and the loading screen |

All are free and self-hosted, Latin subsets only.

| Token | Font | Size | Use |
|---|---|---|---|
| `wordmark` | Grenze Gotisch 900 | clamp(32px, 4.6vw, 56px); up to 152px on the closing screen | The name |
| `title` | Arimo 700, uppercase | clamp(28px, 3.4vw, 44px) | Section and page titles |
| `body` | Arimo 400 | 16px / 1.5 | Paragraphs, max 65 characters per line |
| `caps` | Arimo 700, uppercase, +0.14em | 12px | Menu, links, buttons, card title, copyright |
| `mono` | Courier Prime 400 | 13px / 1.4 | Tagline, clock, card text, "soon" |

Rules: no kicker above a title; no numbering unless order matters; buttons say a verb
and what you get ("See the code on GitHub", "Close menu", "Skip intro"); the home
page's `h1` is the tagline, which names the trade and the place.

## 4. Spacing and layout

**Base unit 4px.** Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.

**One container** (`.wrap`) for the header, every section, and the closing: centered,
1280px at most, with equal margins of 64px on desktops, 32px on tablets, 16px on
phones. Text and controls start on its left line. Only a section's photograph runs
full-bleed, as a background layer.

**Page shell.** `header.nav` (laid over the top of the first section), `main` of
sections, `footer.closing`. The hero is exactly one screen. The closing section is one
screen on desktops and grows with its content on phones.

**Breakpoints.** 480 / 768 / 1024 / 1280. Touch targets are 44px minimum.

**Radius.** 0 everywhere. No pill shapes.

## 5. Depth and texture

The interface is flat: no shadows, glows, gradients, or blurs on anything.

The photograph gets a film treatment, applied as layers over it so any photo picks it
up: `saturate(0.8) contrast(0.94) sepia(0.12)` (faded colour, a warm cast), the top
scrim, and still film grain (a generated noise tile, overlay blend, 38%). Nothing
else on the site is textured.

## 6. Components

### Header
Laid over the top of the page. Three columns on the container: "Menu" in `caps` on the
left, the name centered with the tagline under it in `mono`, and the date and time in
San Diego in `mono` on the right (hidden on phones). The name and "Menu" both open the
menu. The name dims to 60% on hover and dips on press.

### Menu panel
Slides in from the left over a 70% black backdrop (280ms in, 180ms out); from the
keyboard it opens and closes at once. `black`, 1px `line` right edge, 360px wide on
desktop and full screen below 768px. "Menu" in `grey` `caps`, "Close menu" as a link.
Links are `caps`, 44px rows, with a `line` rule under each, arriving 35ms apart. The
current page has a small white square. Sections not built yet are `grey` with "soon"
in `mono` and cannot be focused. Modal dialog: focus is trapped, Escape or a backdrop
click closes it, and focus returns to the button that opened it.

### Hero (home)
One screen. The season's photograph, full-bleed, under the film treatment; it develops
once on load. On the container's left line at the bottom: a flat card (black, 1px
`line`, 16px padding, 320px wide) with the volume and season in `caps`, the mood line
and what I am building and filming in `mono`; and under it the page's one button.

### Closing (site index)
The last screen. Left: "Site index" in `title`, the sections as a plain `caps` list
with `line` rules (links once built, `grey` with "soon" until then), and the same
button. Right: the name set large in `wordmark`. Bottom: the copyright line in `caps`
`grey`.

### Button
One style. A 1px white rectangle, 0 radius, `caps` text, 44px tall, 18px side padding.
On a photograph its fill is `black`. Hover (mouse only): fills white with black text.
Press: scales to 0.97 in 160ms. Focus: the 2px `focus` ring.

### Link
White `caps`. On hover a 1px underline draws in from the left. 44px minimum target.

### Loading screen
The one flourish, and the only place ASCII art appears. On a first visit a full-screen
black overlay plays an original lab-coated character snapping into a dramatic pose in
Courier characters, with impact lines and the season's glyphs blowing past in
`accent`. A "NOW LOADING" bar fills, and a "Skip intro" button sits bottom right.
About 3 seconds, then it lifts. Never plays under reduced motion. Add `?intro` to the
URL to replay it.

### Still to be built
Projects (a plain grid of square thumbnails with no captions, after Supreme), project
pages, experience (a plain list), resume, blog, seasons archive, links, the player.

## 7. Motion

| What | Timing |
|---|---|
| The photograph develops once on load: pale and grey, then its darks, then its colour, settling from a slight zoom | 1600ms |
| The hero's card and button fade up 12px | 520ms each, 60ms apart |
| Link underline draws; button fills; name dims | 120 to 180ms |
| Button and name press | 160ms |
| Menu in, out | 280ms, 180ms |
| Loading screen lifts | 480ms |

- Nothing loops, nothing follows the pointer, and nothing moves because the page scrolled.
- Hover effects apply only on devices with a mouse. Exits are faster than entrances.
- Nothing animates in response to a keyboard action.
- `prefers-reduced-motion`: the develop, the fade-up, and the loading screen are off.

## 8. Accessibility

- Text contrast is 4.5:1 or better (white 19.8:1 and grey 7.3:1 on black); the header keeps it on any photo by way of the scrim.
- Every interactive element is 44px minimum and shows the `focus` ring on keyboard focus.
- The skip link is the first stop for the Tab key.
- The photograph has alt text. The large name on the closing screen is decorative and hidden from assistive tech.

## 9. Do and don't

**Do**
- Start from Chrome Hearts: black, a logo, one image, a few small words.
- Let the photograph be the only colour and the only texture.
- Keep type small and plain; set the name large once.
- Keep everything on the container's left line.

**Don't**
- Draw objects, devices, readouts, overlays, stickers, bursts, or bubbles.
- Use chunky display fonts, pixel fonts, bright accent colours, glows, or outlines.
- Use pills, badges, kickers, or thick coloured borders.
- Use Japanese copy, or images, logos, and characters that belong to someone else.
- Add anything that loops.
- Add a color, font, or texture without a Decision Log entry.

## 10. Decision Log

**Rule:** every design choice gets a row here before or in the same commit as the
change. Past rows are never deleted or reworded; only the Status cell changes. To
reverse a decision, add a new row and mark the old one superseded. Status is
`Proposed` (mine, awaiting your call), `Accepted` (you confirmed), `Superseded`, or
`Rejected`.

| ID | Date | Decision | Why | Source | Status |
|---|---|---|---|---|---|
| D-001 | 2026-11-13 | The Verge is the structural base; Apple, Nintendo 2001, and Sony 2001 are layers on top | Owner brief | Owner | Accepted |
| D-002 | 2026-11-13 | Canvas is dark `carbon #101114` with no light mode; light appears only as ad-page tiles | Verge base, Chrome Hearts black and silver; makes the bright ads read as pages in a binder | Verge, Chrome Hearts | Accepted (owner confirmed dark canvas) |
| D-003 | 2026-11-13 | "Content is flat, chrome is hardware": bevels and the chrome gradient only on nav, plates, buttons, badges | Resolves Verge (no shadows or gradients) against Nintendo (bevel everything) | Verge, Nintendo | Proposed; "hardware" narrowed to devices and gel buttons by D-036 |
| D-004 | 2026-11-13 | Primary accent is LCD Lime `#c8f31d`, replacing Verge's mint | Sampled from the flip phone screen; same hazard-accent role, owned by this moodboard | Moodboard 1, Verge | Proposed |
| D-005 | 2026-11-13 | Orange `#ff7a00` is reserved for forward cues and link hover | Nintendo's "warm means go" rule; hue from the magazine headline | Nintendo, Moodboard 4 | Superseded by D-035 |
| D-006 | 2026-11-13 | Red `#e60012` only as NEW tag and box stamp | Panasonic NEW tag and Supreme box logo; too loud for anything else | Moodboard 2, Supreme | Proposed |
| D-007 | 2026-11-13 | Exactly two gradients: `chrome` and `sky` | Y2K needs airbrush and metal; Verge and Apple forbid decorative gradients, so cap and name them | Moodboard 1, 2 | Superseded by D-050 (no named gradients; the phone builds its metal from the silver tokens) |
| D-008 | 2026-11-13 | Tiles and images are sharp (0 radius); large plates are chamfered; pills only for controls | Ads are printed pages; Nintendo's sharp chrome over Verge's 20 to 40px rounding | Nintendo, Moodboard | Chamfers superseded by D-036; sharp photos and pill controls stand |
| D-009 | 2026-11-13 | Fonts: Dela Gothic One, Michroma, Zen Kaku Gothic New, IBM Plex Mono, DotGothic16 | Free stand-ins for Manuka, Eurostile, PolySans, PolySans Mono, LCD bitmap; two cover Japanese | Verge, Moodboard | Superseded by D-032 |
| D-010 | 2026-11-13 | Body text is 17px | Apple's reading pace on a loud page | Apple | Proposed |
| D-011 | 2026-11-13 | Spacing is two-speed: 8 to 12px inside chrome, 96px pedestal around hero work, 4px base | Nintendo density plus Apple whitespace without averaging them into mush | Nintendo, Apple | Proposed |
| D-012 | 2026-11-13 | One shadow in the system, on cutout product imagery only | Apple's single product shadow; keeps Verge flatness | Apple | Superseded by D-049 (the phone casts the one soft shadow) |
| D-013 | 2026-11-13 | Project list is a plain numbered "drop list" on a dated rail | Supreme's index plus Verge's StoryStream timeline | Supreme, Verge | Proposed |
| D-014 | 2026-11-13 | Moodboard-derived components: corner plate, leader-line callout, spec sheet, colorway chips, LCD screen | Direct lifts of the ads' recurring devices, rebuilt as original UI | Moodboard 1, 2, 5 | Corner plate retired by D-036; spec sheet, callouts, chips, LCD stand |
| D-015 | 2026-11-13 | Japanese copy must be real, tagged `lang="ja"`, and paired with English | Respect for the language, screen readers, and credibility | Owner aesthetic | Superseded by D-040 |
| D-016 | 2026-11-13 | No blackletter and no third-party logos or wordmarks from the ads | Blackletter fights the techno type; brand marks are not ours to use | Chrome Hearts (declined) | Blackletter clause superseded by D-018; logo clause stands |
| D-017 | 2026-11-13 | Sony 2001 layer is provisional (silver bodies, model numbers, spec callouts, colorways) | Reference file not available in awesome-design-md or reachable this session | See section 0 | Proposed |
| D-018 | 2026-11-13 | The site name is set as a blackletter wordmark, and blackletter is used for nothing else. Face: Manufacturing Consent | Owner asked for a Chrome Hearts style wordmark. Most legible of three Old English faces tried | Owner, Chrome Hearts | Accepted; face superseded by D-031 |
| D-019 | 2026-11-13 | Navigation is the wordmark opening a left slide-in panel with stacked section links. The command bar and ticker strip specs are parked | Owner brief: Chrome Hearts site structure | Owner | Accepted |
| D-020 | 2026-11-13 | Seasons override two role tokens only, `accent` (lime role) and `forward` (orange role). `red`, `focus`, and the dark base never change. Season colors must reach 4.5:1 on `carbon` or the build fails | Owner brief: seasons change accents only. Mapping "accents" to these two roles is my reading | Owner, section 8 | Accepted; reduced to one role, `accent`, by D-055 |
| D-021 | 2026-11-13 | Home hero is a monochrome silver ASCII field: season kanji as a character mask plus drifting glyphs per season style, 12fps, still under reduced motion. Uses the mono face for mixed symbols and the body face to shape the kanji | No photography yet; keeps the one-accent-per-viewport rule; ties to the ASCII intro. An exception to "mono is uppercase labels only" | Owner brief (ASCII styles), section 1 rule 3 | Superseded by D-033 |
| D-022 | 2026-11-13 | Menu links are title-case `shout-md` with number and Japanese sublabel above. On phones narrower than 370px the size eases below the 44px floor (13vw) | Uppercase "EXPERIENCE" does not fit a phone at 44px; title case does down to 370px | Section 6 (old command bar sheet) | Superseded by D-040 and D-042 (no sublabels, no numbers); the small-phone size rule stands |
| D-023 | 2026-11-13 | Sections that are not built yet stay in the menu at 40% opacity with a SOON tag | Shows the full structure without dead links | Section 6 (disabled = 40%) | Proposed |
| D-024 | 2026-11-13 | A `meta` "MENU +" hint sits above the wordmark; hint and wordmark turn `forward` on hover | A logo that opens a menu is not discoverable on its own | Section 2 (orange = hover) | Superseded by D-038 |
| D-025 | 2026-11-13 | Now card is a spec sheet with a chrome tab; local time is the home page's one LCD screen | Reuses two existing components instead of inventing a card | Section 6 | Superseded by D-034 |
| D-026 | 2026-11-13 | Home page furniture: top-left plate with season name, mood line under it, rotated season number on the right edge, bottom-right plate with the date range | The hero is treated as an ad tile (two plates on opposite corners, rotated model number) | Section 6 (Ad tile, Corner plate) | Superseded by D-030 and D-036 |
| D-027 | 2026-11-13 | First-visit intro is an ASCII banner in the mono face with three boot lines and a ghost skip button | Owner asked for an ASCII intro; kept to silver on carbon | Owner | Superseded by D-033 |
| D-028 | 2026-11-13 | Home footer is two corner groups: red MN box stamp and hallmark left, `label` links right | Owner brief (small corner links) plus the footer's stamp and hallmark | Owner, section 6 Footer | Proposed |
| D-029 | 2026-11-13 | Direction changes from "carbon binder with silver hardware" to "an issue of a 2000s Japanese magazine": pop inks, stickers, Japanese copy up front. The dark page stock stays | Owner: less space techno, more Japanese Y2K magazine and ad; it should pop | Owner | Accepted |
| D-030 | 2026-11-13 | The home page is a magazine cover: masthead, issue line, cover star, headline, cover lines, stickers, price barcode, ticker | Gives the home page a concept and gives every section a place on it | Owner direction, my design | Superseded by D-048 |
| D-031 | 2026-11-13 | Wordmark is Grenze Gotisch 900, skewed 7 degrees, paper with a hard orange offset, with the katakana reading above it. Replaces Manufacturing Consent | Owner: the old one looked like a diploma. Heavy, slanted, and offset reads as a streetwear logo | Owner | Accepted; the skew, offset, and large size are superseded by D-056 |
| D-032 | 2026-11-13 | Fonts: drop Michroma, IBM Plex Mono, Zen Kaku Gothic New, Manufacturing Consent. Add Zen Maru Gothic (body and labels) and Yusei Magic (handwriting). Monospace only on the loading screen, using the system face | Wide techno caps and tracked mono labels were the "space techno" look; rounded gothic is the face of era Japanese ads | Owner, moodboard 5 | Superseded by D-056 |
| D-033 | 2026-11-13 | ASCII art appears only on the loading screen: an original lab-coated character snapping into a dramatic pose, with impact lines and season glyphs blowing past | Owner. The character is original and is not traced from any show | Owner | Accepted (the drawing itself is Proposed) |
| D-034 | 2026-11-13 | The cover star is a flip phone drawn in CSS; its LCD is the Now readout (building, filming, local time) | Moodboard 1 and 3 are phone ads; makes the Now info the centerpiece | Moodboard | Proposed; restyled by D-049 |
| D-035 | 2026-11-13 | New ink `magenta #ff3d9a`. Signals are no longer limited to one per viewport. Orange is the headline and hover color, not only "forward" | Rationing color made the page quiet; a magazine cover is not quiet | Owner | Superseded by D-050 |
| D-036 | 2026-11-13 | Depth is print, not hardware: stickers get a paper die-cut edge and a hard offset shadow, headlines get an outline and offset. Chamfered plates, corner plates, and rotated model numbers are retired. Chrome stays on devices and gel buttons | Bevelled plates were the techno look | Owner | Superseded by D-048 and D-050 |
| D-037 | 2026-11-13 | Motion: ambient loops (bob, swing, spin, twinkle, marquee, sticker nudge), a staggered pop-in when the cover loads, and a pointer tilt on the phone. All off under reduced motion | Owner: make sure there is motion | Owner | Proposed; trimmed by D-043 to D-045 |
| D-038 | 2026-11-13 | Menu restyle: Japanese heading, gel close button, number pills, an いまここ ("you are here") tag, staggered link entrance. The menu hint is a lime sticker on the masthead | Brings the menu into the magazine look | Section 6 | Superseded by D-040 to D-042 |
| D-039 | 2026-11-13 | Cover lines for sections that are not built yet carry a 近日公開 / Soon tag and are not links | Same rule as the menu (D-023) | D-023 | Proposed; the tag is plain text since D-041 |
| D-040 | 2026-11-13 | No Japanese copy anywhere on the site. The influence is carried by composition, color, type treatment, and objects | Owner: "influenced by it rather than larp it" | Owner | Accepted |
| D-041 | 2026-11-13 | No pill shapes. Buttons, tags, and stamps are sharp rectangles; states are plain text. The `pill` radius is removed and `full` is for true circles only | Owner: pill buttons and tabs read as generated UI | Owner | Accepted |
| D-042 | 2026-11-13 | No kicker labels above titles, no numbering that is not a sequence, no hard block shadows on boxes (outline and offset stay on the masthead and cover headline type only), drawn icons instead of typed symbols, and selection, caret, and scrollbar follow the palette | Impeccable's craft floor | Impeccable | Proposed |
| D-043 | 2026-11-13 | Hover effects on mouse devices only; press feedback at 0.97 in 160ms; exits faster than entrances; the menu opens and closes at once from the keyboard; entrances start from 0.94 scale with a strong ease-out and no bounce | Emil Kowalski's design engineering skill | Emil's skill | Proposed |
| D-044 | 2026-11-13 | One button style and one radius scale; nothing tilts toward the pointer; buttons are named verb plus object; a "Pause motion" control stops looping animation | taste-skill's house rules and checklist | taste-skill | Proposed; the "Pause motion" control is removed by D-057 because nothing loops |
| D-045 | 2026-11-13 | Ambient motion is trimmed to the phone bob, charm swing, starburst spin, ticker, and two small blinks. Sparkles, stamp wobble, menu-tag nudge, and pointer tilt are removed | "One authored moment, not scattered effects" | Impeccable | Superseded by D-051 |
| D-046 | 2026-11-13 | Where the skills conflict with the brief (taste-skill wants nothing rotated or overlapping and no drawn objects; Impeccable caps display type at 96px), the brief wins: the cover keeps its rotations, the drawn phone, and the large masthead | The magazine-cover concept depends on them | Owner brief | Superseded by D-058 |
| D-047 | 2026-11-13 | taste-skill, Impeccable, and 16 of Emil Kowalski's skills are vendored into `.claude/skills` | Owner approved, so the workflow loads in every session | Owner | Accepted |
| D-048 | 2026-11-13 | The home page is one frame from a Y2K point-and-shoot: a full-screen photograph, faded and bloomed, under moving film grain and dust, with the site's facts burned in like a date stamp. The magazine-cover layout (starburst, speech bubble, barcode, ticker, cover headline) is retired | Owner: grainy vintage Y2K, cool, not a pop game. References: film snapshots, scanned magazine pages, distressed poster art | Owner | Superseded by D-054 |
| D-049 | 2026-11-13 | The flip phone stays but as a product shot: brushed silver built from the silver tokens, soft edges, a cast shadow, a backlit LCD; no outlines, no coloured keys, no charm | Owner: the phone is fine, the pop styling is not | Owner | Superseded by D-054 |
| D-050 | 2026-11-13 | Palette cut to dark stock, silver neutrals, paper, and three signals (`accent`, `forward`, `red`), plus `fringe` for the masthead's colour fringe. Sky, ice, pink, magenta, indigo, and both named gradients are removed. Texture is now allowed: film grain site-wide, dust and bloom on the home photo | Follows D-048: flat pop inks were the "pop game" look | Owner direction | Superseded by D-055 |
| D-051 | 2026-11-13 | Motion: the photo "develops" once as the loading screen lifts (the authored moment); grain flickers; the phone drifts; a recording light blinks; timecode and date stamp tick. The masthead's colour fringe widens on hover | Fits a camera frame; keeps one moment plus quiet loops | Impeccable, Emil's skill | Superseded by D-057 |
| D-052 | 2026-11-13 | The home photo is a slot per season (`hero` in the season file). Until the owner supplies one, a generated stand-in is used and must not be presented as his work | Owner will add a photo or film still | Owner | Accepted |
| D-053 | 2026-11-13 | The menu panel loses its thick accent edge for a 1px hairline | Impeccable's detector flags a thick one-sided coloured border as a generated-UI tell | Impeccable detector | Proposed |
| D-054 | 2026-11-13 | The site is styled as a fashion house's site. Chrome Hearts is the base: black, a small gothic name over one full-bleed photograph, tiny type, a side menu. Supreme (Courier date line, plain lists) and Vivienne Westwood (editorial full-bleed image) sit behind it. The flip phone, camcorder overlay, date stamp, and big display type are removed | Owner: stop defaulting to a game look; "Y2K fashion cool"; use those three sites as the main references | Owner | Accepted (direction); my reading of the sites is Proposed |
| D-055 | 2026-11-13 | Palette is black, white, one grey, one hairline, red (favicon only), the focus blue, and one season colour `accent` (default orange) that appears only on the loading screen | The references are black and white; colour comes from the photograph | D-054 | Proposed |
| D-056 | 2026-11-13 | Type: Grenze Gotisch 900, upright and flat, for the name; Arimo for everything else; Courier Prime for the tagline, the clock, and the card. Dela Gothic One, Zen Maru Gothic, and DotGothic16 are removed | The references set everything in a plain Helvetica-like sans and Courier, small | D-054 | Proposed |
| D-057 | 2026-11-13 | Motion: the photograph develops once on load (taste-skill's `picture-develops`), the hero's card and button fade up, links draw an underline, the button fills, the menu slides. Nothing loops, so the "Pause motion" control is removed. The ASCII loading screen stays | Owner kept the loading screen; taste-skill allows no loops on this kind of page | Owner, taste-skill | Proposed |
| D-058 | 2026-11-13 | Page structure follows taste-skill: the header lies over a hero exactly one screen tall; one container with equal margins (64px desktop, 16px phone); hero content on the left line as a flat "live fact" card and one button; the page ends on a full-screen closing section (site index and the name set large). The split hero taste-skill dealt was declined because the brief asks for one full-screen visual | Owner: taste-skill is essential | taste-skill | Proposed |
| D-059 | 2026-11-13 | The three reference sites could not be opened from this session (outside its allowed network domains), so D-054 is built from prior knowledge of them, not from a fresh look | Honesty about the source | Session limit | Proposed |
| D-060 | 2026-11-13 | The closing screen sits on a 12-column grid: the site index takes five columns and the large name starts on the sixth, both top-aligned | The last finding in taste-skill's gate; with it the gate passes | taste-skill gate | Proposed |

### Open questions
1. **Your photo.** Add it next to the season file and set `hero` and `heroAlt` there. The current image is a generated stand-in.
2. **The home button.** It points at GitHub until the projects page exists.
3. **Loading character.** It is an original figure in the spirit of a mad-scientist pose, not a copy of a specific show's scene.
4. **Reference check.** If the session's network settings allow chromehearts.com, us.supreme.com, and viviennewestwood.com, I can compare against the live sites (D-059).

Resolved: dark canvas (D-002), site name and stack, Japanese copy (D-040), pills (D-041), skills installed (D-047), "not a game" (D-054).
