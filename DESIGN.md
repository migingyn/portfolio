---
version: 0.3
name: Portfolio "Mikey Nguyen, the magazine"
status: In use. Milestone 1 (tokens, layout, menu, home) is built from this file. Tokens are mirrored in src/styles/tokens.css.
description: >
  A portfolio that reads like an issue of a 2000s Japanese magazine printed on black
  stock. The home page is the cover: the name is the masthead, a flip phone is the cover
  star, and every section gets a cover line. Loud inks, stickers, Japanese copy, and
  things that move.

colors:
  # Page stock (dark, flat)
  carbon: "#101114"          # page
  carbon-2: "#1a1c22"        # quiet panels
  carbon-3: "#272a33"        # raised or pressed surface, device insets
  hairline: "#3a3e4a"        # rules and dotted dividers
  # Chrome (devices and gel buttons only)
  silver-50: "#f4f5f8"       # primary text on carbon
  silver-200: "#d9dde5"
  silver-400: "#aab0bd"      # secondary text
  silver-500: "#8a91a1"      # disabled text
  silver-600: "#6f7686"      # bevel shadow, borders only (not text)
  # Inks
  paper: "#ffffff"           # sticker edges, speech bubbles, masthead
  ink: "#101114"             # text on any ink or light fill
  sky: "#a9c6f0"             # airbrushed blue
  ice: "#dfeaf9"
  pink: "#f6a6c1"            # soft pink
  magenta: "#ff3d9a"         # hot pink: starbursts, offsets, stars
  indigo: "#2f2a95"          # text on sky, deep fill with white text
  lime: "#c8f31d"            # LCD, ticker, menu sticker
  orange: "#ff7a00"          # headline and hover
  red: "#e60012"             # box stamp only
  focus: "#2997ff"           # keyboard focus ring only
  # Season roles. Components use these two names; the current season may override them (D-020).
  accent: "{colors.lime}"
  forward: "{colors.orange}"

gradients:
  chrome: "linear-gradient(180deg, #f4f5f8 0%, #d9dde5 45%, #aab0bd 100%)"
  sky: "linear-gradient(180deg, #a9c6f0 0%, #dfeaf9 70%, #ffffff 100%)"

typography:
  families:
    masthead: "'Grenze Gotisch', 'Arial Black', serif"                       # the name only
    shout: "'Dela Gothic One', 'Arial Black', Impact, sans-serif"           # Latin + Japanese display
    body: "'Zen Maru Gothic', 'Hiragino Maru Gothic ProN', Arial, sans-serif" # Latin + Japanese text, labels
    hand: "'Yusei Magic', 'Zen Maru Gothic', cursive"                       # speech bubbles, personal notes
    pixel: "'DotGothic16', ui-monospace, monospace"                         # LCD screens only
    ascii: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"            # loading screen only
  scale:
    masthead: { family: masthead, size: "clamp(48px, min(14vw, 16vh), 144px)", weight: 900, lineHeight: 0.9 }
    shout-xl: { family: shout, size: "clamp(56px, 11vw, 144px)", weight: 400, lineHeight: 1.0 }
    shout-lg: { family: shout, size: "clamp(44px, 7vw, 88px)",   weight: 400, lineHeight: 1.05 }
    shout-md: { family: shout, size: "48px", weight: 400, lineHeight: 1.0 }
    shout-sm: { family: shout, size: "24px", weight: 400, lineHeight: 1.1 }
    heading:  { family: body,  size: "24px", weight: 900, lineHeight: 1.2 }
    body:     { family: body,  size: "17px", weight: 500, lineHeight: 1.6 }
    body-sm:  { family: body,  size: "14px", weight: 500, lineHeight: 1.5 }
    label:    { family: body,  size: "12px", weight: 900, lineHeight: 1.2, letterSpacing: "0.06em" }
    hand:     { family: hand,  size: "18px", weight: 400, lineHeight: 1.35 }
    pixel:    { family: pixel, size: "14px", weight: 400, lineHeight: 1.25 }

spacing:
  base: 4px
  scale: [2, 4, 8, 12, 16, 24, 32, 48, 64, 96]

rounded:
  none: 0px      # photos, kicker boxes, stamps, barcodes
  xs: 2px        # inputs
  sm: 6px        # chips
  md: 16px       # speech bubbles, gel panels
  pill: 9999px   # buttons, stickers, tags

shadows:
  pop: "4px 4px 0 ink"                      # hard offset, no blur: stickers, bubbles
  product: "0 5px 30px rgba(0,0,0,0.3)"     # cutout products and devices only

layout:
  maxWidth: 1280px
  gutter: 16px
  pagePadding: { mobile: 16px, desktop: 48px }
  breakpoints: { sm: 480px, md: 768px, lg: 1024px, xl: 1280px }

motion:
  fast: 120ms
  base: 180ms
  slow: 280ms
  pop: 480ms
  ease: "cubic-bezier(0.23, 1, 0.32, 1)"
  ease-pop: "cubic-bezier(0.34, 1.56, 0.64, 1)"   # overshoot, for things that pop in
---

# DESIGN.md

Design system for my portfolio site. This file is the single source of truth: tokens
live in the front matter above, the reasoning lives below, and every choice we make
gets a row in the [Decision Log](#10-decision-log).

## 0. Workflow and sources

1. **awesome-design-md** supplies the references (below).
2. **taste-skill** builds from this file.
3. **Impeccable** and **Emil's skills** do the polish pass.

| Source | What it gives this system now | Status |
|---|---|---|
| Owner moodboard (5 Japanese ads and spreads, about 2000 to 2010) | **The lead.** Cover and ad layout, katakana headlines, phone as product, stickers, callout boxes, handwriting | Supplied in chat |
| The Verge DESIGN.md | Dark page, one very loud headline, saturated color blocks, color instead of soft shadow | Read from awesome-design-md |
| Apple DESIGN.md | 17px body, one soft shadow reserved for products, space around the work | Read from awesome-design-md |
| Nintendo.com (2001) DESIGN.md | Chrome gradient with a hard bevel (now only on devices and gel buttons), outlined box-art type, halftone | Read from awesome-design-md |
| Sony (2001) DESIGN.md | Device gloss, colorway chips, spec callouts | **Not found** in awesome-design-md; still my own reading of the Walkman ad (D-017) |
| Chrome Hearts, Supreme | Site structure (name opens a side menu), gothic wordmark, red box stamp, plain drop list | Interpreted, not extracted |

## 1. Concept

**Every season is an issue, and the home page is its cover.** The name is the masthead.
A flip phone is the cover star, and its screen shows what I am doing now. Each section
of the site is a cover line. Around them: an issue stamp, a headline in Japanese, a
starburst, a speech bubble, a price barcode, and a ticker that never stops.

It should read as Japanese print from the 2000s, not as a sci-fi interface. That means:

1. **Ink on black stock.** The page is dark and flat. Color arrives as solid inks,
   stickers, and one airbrushed sky disc. No glows, no soft gradients on the page.
2. **Japanese copy is part of the layout.** Kickers, headlines, and labels are in
   Japanese first, with English beside them.
3. **Print depth, not hardware depth.** Things look stuck on or misprinted: paper
   die-cut edges, hard offset shadows, outlines, small rotations. Chrome is for
   objects (the phone, gel buttons), never for panels.
4. **Something is always moving, never everything.** See section 7.

What "space techno" meant, and is now out: wide Eurostile-style caps, tracked
monospace labels, silver plates with cut corners, model numbers, drifting particles,
a single rationed accent on a field of gray.

## 2. Colors

### Page stock
| Token | Hex | Use |
|---|---|---|
| `carbon` | `#101114` | Page. Always dark; there is no light mode |
| `carbon-2` | `#1a1c22` | Quiet panels |
| `carbon-3` | `#272a33` | Device insets, pressed surfaces |
| `hairline` | `#3a3e4a` | Rules, dotted dividers |

### Text on carbon
`silver-50` primary (17.3:1), `silver-400` secondary (8.7:1), `silver-500` disabled
(6.0:1). `silver-600` is for borders and bevels, not text.

### Inks
| Token | Hex | Job | Text on it |
|---|---|---|---|
| `paper` | `#ffffff` | Masthead, sticker edges, speech bubbles, barcode | `ink` |
| `orange` (`forward`) | `#ff7a00` | The Japanese headline, masthead offset, every hover | `ink` (7.2:1). Never white |
| `lime` (`accent`) | `#c8f31d` | LCD screens, ticker, menu sticker, "you are here" | `ink` (14.7:1) |
| `magenta` | `#ff3d9a` | Starbursts, headline offset, ticker stars | `ink` (5.7:1). White only at 24px and up |
| `sky` | `#a9c6f0` | The disc behind the cover star, kicker boxes | `ink` or `indigo` |
| `pink` | `#f6a6c1` | Kicker boxes, phone keys | `ink` |
| `red` | `#e60012` | The box stamp (issue stamp, MN mark). Nothing else | `paper` bold (4.8:1) |
| `focus` | `#2997ff` | 2px keyboard focus ring, 2px offset | n/a |

Rules: kicker boxes rotate through `accent`, `pink`, `sky`. A screen may carry several
inks, but each ink keeps its job, and nothing is tinted or faded.

### Seasons
Components never reference `lime` or `orange` directly. They use two role tokens,
`accent` (default `lime`) and `forward` (default `orange`). Each season file in
`src/content/seasons` may override those two and nothing else. A season color must
reach 4.5:1 against `carbon` (which also covers `ink` text on it), and the build fails
if it does not.

### Gradients
Exactly two. `chrome` goes on devices and gel buttons. `sky` goes on the disc behind a
cover star or a cutout subject. No other gradients, no gradient text.

## 3. Typography

| Family | Job |
|---|---|
| **Grenze Gotisch 900** | The masthead "Mikey Nguyen" and nothing else. Skewed 7 degrees, `paper`, with a hard `forward` offset |
| **Dela Gothic One** | The shout: Japanese headlines, cover-line titles, menu links. Latin and Japanese |
| **Zen Maru Gothic** (500, 700, 900) | Body, labels, kickers. Rounded gothic, the voice of era ad copy |
| **Yusei Magic** | Handwriting: speech bubbles and personal notes (the mood line, track notes) |
| **DotGothic16** | Phone LCD text only |
| System monospace | The loading screen's ASCII art only |

All are free and self-hosted. Latin loads first; Japanese ranges load on demand.

### Scale
| Token | Font | Size | Weight | Use |
|---|---|---|---|---|
| `masthead` | Grenze Gotisch | clamp(48px, min(14vw, 16vh), 144px) | 900 | The name |
| `shout-xl` | Dela Gothic One | clamp(56px, 11vw, 144px) | 400 | Section openers |
| `shout-lg` | Dela Gothic One | clamp(44px, 7vw, 88px) | 400 | Page and project titles, cover headline |
| `shout-md` | Dela Gothic One | 48px | 400 | Cover-line titles, menu links |
| `shout-sm` | Dela Gothic One | 24px | 400 | Sticker words, small Japanese headings |
| `heading` | Zen Maru Gothic | 24px | 900 | Headings inside pages |
| `body` | Zen Maru Gothic | 17px / 1.6 | 500 | Paragraphs, max 65 characters per line |
| `body-sm` | Zen Maru Gothic | 14px / 1.5 | 500 | Captions, Japanese cover copy |
| `label` | Zen Maru Gothic | 12px, +0.06em | 900 | Kickers, tags, buttons, footer. Sentence case, not forced caps |
| `hand` | Yusei Magic | 18px / 1.35 | 400 | Handwritten notes |
| `pixel` | DotGothic16 | 14px | 400 | LCD |

### Rules
- **Box-art type.** A shout headline may take an outline (0.08em) and a hard offset
  (0.07em, no blur) in a second ink. This is how the cover headline is set: `forward`
  fill, `paper` outline, `magenta` offset, rotated 5 degrees.
- **Japanese is real copy.** Correct, meaningful, tagged `lang="ja"`, with the English
  meaning beside it or in the same block. No filler katakana.
- **Kickers** are Japanese magazine words in a small rotated ink box: 創刊号 (first
  issue), 大特集 (big feature), 新連載 (new series), 特別付録 (special supplement).
- Body is 17px. Weights in use: 400, 500, 700, 900.

## 4. Spacing and layout

**Base unit 4px.** Scale: 2, 4, 8, 12, 16, 24, 32, 48, 64, 96.

| Context | Value |
|---|---|
| Inside stickers, kickers, tags | 4 to 10px |
| Inside bubbles and panels | 12 to 16px |
| Between stacked cover lines | 24 to 28px |
| Between page sections | 64px (mobile 48px) |
| Around a hero project image | 96px above and below (mobile 64px) |

**Grid.** 12 columns, 16px gutter, max width 1280px, page padding 48px desktop and 16px
mobile. The cover is three columns from 1024px (lines, star, lines) and one column
below. Small rotations (3 to 7 degrees) are part of the layout; nothing rotates more
than 10 degrees and body text never rotates.

**Breakpoints.** 480 / 768 / 1024 / 1280. Touch targets are 44px minimum.

**Radius.** Photos, kicker boxes, stamps: 0. Bubbles and panels: 16px. Buttons,
stickers, tags: full pill. Devices use their own proportional radii.

## 5. Depth

| Level | Treatment | Use |
|---|---|---|
| 0 Flat | Solid fill | Page, text, kicker boxes, ticker |
| 1 Line | 2px `ink` outline, or 1 to 2px dotted `hairline` | Device parts, bubbles, dividers |
| 2 Sticker | 3px `paper` die-cut edge plus `pop` shadow (4px 4px 0, no blur) | Starbursts, menu sticker, bubbles |
| 3 Chrome | `chrome` gradient, 2px `paper` inset highlight | Phone body, keys, gel buttons |
| 4 Product shadow | `0 5px 30px rgba(0,0,0,0.3)` | Cutout products and devices only |

**Texture.** Screentone only: dots. A fine 4px grid at 6% white on the menu panel, and
a coarse `sky` dot ring around the cover disc. No noise, scanlines, or glows.

## 6. Components

### Masthead
The name in `masthead`, centered at the top of every page, with the katakana reading
above it in `label` (`silver-400`, widely spaced) and the tagline under it in `body`
bold. It is the menu button: a small `accent` sticker reading "Menu メニュー" sits on
its top right corner and nudges every few seconds. Hover lifts the name and turns its
offset `magenta`; press pushes it flat. On the home page it is the `h1`.

### Menu panel
Slides in from the left over an 80% `carbon` backdrop (280ms). `carbon` with fine
screentone, an 8px `accent` right edge, 480px wide on desktop and full screen below
768px. Top: メニュー in `shout-sm` and a gel とじる / Close button. Links stack with a
dotted `hairline` between them: a number pill and the Japanese name on one line, the
English name under it in `shout-md`. Links pop in one after another. Hover slides the
name right, skews it, and turns it `forward`. The current page is `accent` with an
いまここ tag. Sections not built yet are `silver-500` with a 近日公開 / Soon tag and
cannot be focused. Modal dialog: focus is trapped, Escape or a backdrop click closes
it, and focus returns to the masthead.

### Cover (home)
One screen on desktop, scrolling on phones. Parts:

- **Issue line.** Red 創刊号 box stamp, then volume, season name, and dates in `label`.
- **Cover star.** The flip phone on a `sky` gradient disc with a coarse screentone ring.
- **Headline.** The season's Japanese headline in box-art type, breaking after the comma.
- **Cover lines.** One per section: kicker box, `shout-md` title, a line of Japanese
  copy in `body-sm`, its English in `label`. Left column aligned left, right column
  aligned right.
- **Starburst.** `magenta`, paper edge, slowly spinning, with level text.
- **Speech bubble.** The season's mood line in `hand`, `paper` fill, `ink` outline.
- **Price.** A paper barcode sticker reading 定価 ¥0.
- **Ticker.** Full-width `accent` band, `label` text, `magenta` stars, scrolling left.

### Flip phone (Now)
Drawn in CSS: `chrome` lid and base with `ink` outlines, a hinge, a keypad with kana on
the keys, `pink` soft keys, a `forward` center key, an antenna with a blinking
`magenta` light, and a strap with the season's charm. The LCD is `accent` with `ink`
`pixel` text and a faint pixel grid; it shows いま / NOW, what I am building and
filming, and live local time. The phone bobs, the charm swings, and on desktop it
leans a few degrees toward the pointer.

### Loading screen
The only place ASCII art appears. On a first visit, a full-screen `carbon` overlay
plays an original lab-coated character snapping into a dramatic pose (one hand over
the face, the other arm thrown wide, coat flaring) while impact lines burst out and
the season's glyphs blow past in `forward`. A `pixel` "ロード中 NOW LOADING" bar fills
in `accent`, and a gel Skip button sits bottom right. About 3 seconds, then the
overlay lifts like a curtain and the cover pops in. Never plays under reduced motion.

### Buttons
| Variant | Spec |
|---|---|
| Gel | `chrome` pill, 2px `ink` outline, `paper` top highlight, 3px `forward` hard offset, `ink` `label` text, 44px min height. Hover: lifts 1px and the offset grows. Press: drops onto its offset |
| Sticker | Flat ink fill (`accent` by default), 2px `ink` outline, `pop` shadow, pill, slight rotation |
| Text link | `silver-50`, turns `forward` on hover |

Focus always shows the 2px `focus` ring. Disabled is `silver-500` text, no hover.

### Tags
"Soon" and other states: `label` in a pill with a 1px dashed `silver-500` border.

### Footer
Home: two corner groups. Left: the red MN box stamp and "(c) year, name, city" in
`label`. Right: small `label` links. Longer pages add an index of sections above it.

### Still to be built (specs carry over, restyled when used)
Project tile, index row (drop list), spec sheet, leader-line callout, colorway chips,
inputs, image treatment. Photography stays sharp-cornered with a 1px `hairline` frame.

## 7. Motion

**Something is always moving, never everything.** At rest, a screen has a few slow
loops; one event at a time gets the fast, bouncy move.

| Kind | What | Timing |
|---|---|---|
| Ambient loops | Phone bob, charm swing, starburst spin, sparkle twinkle, ticker scroll, stamp wobble, menu sticker nudge, LCD signal and antenna blink | 1.6s to 36s, ease-in-out or linear |
| Entrance | Cover parts pop in one after another (scale 0.7 to 1, 16px rise, overshoot) once the loading screen lifts | 480ms each, 70ms apart, `ease-pop` |
| Response | Hover color, masthead lift and press, gel button press, cover-line and menu-link slide | 120 to 180ms, `ease` |
| Panels | Menu slide, loading curtain | 280 to 480ms, `ease` |
| Pointer | The phone tilts up to 8 degrees toward the pointer | 400ms follow |

- Animate `transform`-type properties and `opacity` only.
- No scroll-jacking, no cursor trails, no auto-playing sound.
- `prefers-reduced-motion`: loops, entrances, tilt, and the loading screen are all off;
  color changes stay.

## 8. Accessibility

- Text contrast is 4.5:1 or better for every pairing in section 2.
- Every interactive element is 44px minimum and shows the `focus` ring on keyboard focus.
- Japanese text carries `lang="ja"`. Decorative repeats (ticker, katakana reading,
  phone keys, sparkles) are hidden from assistive tech; the Now readout is real text.
- Meaning is never carried by color alone.

## 9. Do and don't

**Do**
- Lead with Japanese kickers and headlines, with English beside them.
- Give stickers a paper edge, a hard offset, and a few degrees of rotation.
- Keep each ink to its job.
- Keep a few slow loops running on every screen.

**Don't**
- Use wide techno caps, tracked monospace labels, cut-corner plates, or model numbers.
- Use glows, blurred shadows on type or stickers, or gradients beyond the two named ones.
- Put ASCII art anywhere but the loading screen.
- Use fake Japanese, or logos and characters that belong to someone else.
- Add a color, font, or gradient without a Decision Log entry.

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
| D-007 | 2026-11-13 | Exactly two gradients: `chrome` and `sky` | Y2K needs airbrush and metal; Verge and Apple forbid decorative gradients, so cap and name them | Moodboard 1, 2 | Proposed |
| D-008 | 2026-11-13 | Tiles and images are sharp (0 radius); large plates are chamfered; pills only for controls | Ads are printed pages; Nintendo's sharp chrome over Verge's 20 to 40px rounding | Nintendo, Moodboard | Chamfers superseded by D-036; sharp photos and pill controls stand |
| D-009 | 2026-11-13 | Fonts: Dela Gothic One, Michroma, Zen Kaku Gothic New, IBM Plex Mono, DotGothic16 | Free stand-ins for Manuka, Eurostile, PolySans, PolySans Mono, LCD bitmap; two cover Japanese | Verge, Moodboard | Superseded by D-032 |
| D-010 | 2026-11-13 | Body text is 17px | Apple's reading pace on a loud page | Apple | Proposed |
| D-011 | 2026-11-13 | Spacing is two-speed: 8 to 12px inside chrome, 96px pedestal around hero work, 4px base | Nintendo density plus Apple whitespace without averaging them into mush | Nintendo, Apple | Proposed |
| D-012 | 2026-11-13 | One shadow in the system, on cutout product imagery only | Apple's single product shadow; keeps Verge flatness | Apple | Proposed |
| D-013 | 2026-11-13 | Project list is a plain numbered "drop list" on a dated rail | Supreme's index plus Verge's StoryStream timeline | Supreme, Verge | Proposed |
| D-014 | 2026-11-13 | Moodboard-derived components: corner plate, leader-line callout, spec sheet, colorway chips, LCD screen | Direct lifts of the ads' recurring devices, rebuilt as original UI | Moodboard 1, 2, 5 | Corner plate retired by D-036; spec sheet, callouts, chips, LCD stand |
| D-015 | 2026-11-13 | Japanese copy must be real, tagged `lang="ja"`, and paired with English | Respect for the language, screen readers, and credibility | Owner aesthetic | Proposed |
| D-016 | 2026-11-13 | No blackletter and no third-party logos or wordmarks from the ads | Blackletter fights the techno type; brand marks are not ours to use | Chrome Hearts (declined) | Blackletter clause superseded by D-018; logo clause stands |
| D-017 | 2026-11-13 | Sony 2001 layer is provisional (silver bodies, model numbers, spec callouts, colorways) | Reference file not available in awesome-design-md or reachable this session | See section 0 | Proposed |
| D-018 | 2026-11-13 | The site name is set as a blackletter wordmark, and blackletter is used for nothing else. Face: Manufacturing Consent | Owner asked for a Chrome Hearts style wordmark. Most legible of three Old English faces tried | Owner, Chrome Hearts | Accepted; face superseded by D-031 |
| D-019 | 2026-11-13 | Navigation is the wordmark opening a left slide-in panel with stacked section links. The command bar and ticker strip specs are parked | Owner brief: Chrome Hearts site structure | Owner | Accepted |
| D-020 | 2026-11-13 | Seasons override two role tokens only, `accent` (lime role) and `forward` (orange role). `red`, `focus`, and the dark base never change. Season colors must reach 4.5:1 on `carbon` or the build fails | Owner brief: seasons change accents only. Mapping "accents" to these two roles is my reading | Owner, section 8 | Accepted (role mapping is Proposed) |
| D-021 | 2026-11-13 | Home hero is a monochrome silver ASCII field: season kanji as a character mask plus drifting glyphs per season style, 12fps, still under reduced motion. Uses the mono face for mixed symbols and the body face to shape the kanji | No photography yet; keeps the one-accent-per-viewport rule; ties to the ASCII intro. An exception to "mono is uppercase labels only" | Owner brief (ASCII styles), section 1 rule 3 | Superseded by D-033 |
| D-022 | 2026-11-13 | Menu links are title-case `shout-md` with number and Japanese sublabel above. On phones narrower than 370px the size eases below the 44px floor (13vw) | Uppercase "EXPERIENCE" does not fit a phone at 44px; title case does down to 370px | Section 6 (old command bar sheet) | Proposed |
| D-023 | 2026-11-13 | Sections that are not built yet stay in the menu at 40% opacity with a SOON tag | Shows the full structure without dead links | Section 6 (disabled = 40%) | Proposed |
| D-024 | 2026-11-13 | A `meta` "MENU +" hint sits above the wordmark; hint and wordmark turn `forward` on hover | A logo that opens a menu is not discoverable on its own | Section 2 (orange = hover) | Superseded by D-038 |
| D-025 | 2026-11-13 | Now card is a spec sheet with a chrome tab; local time is the home page's one LCD screen | Reuses two existing components instead of inventing a card | Section 6 | Superseded by D-034 |
| D-026 | 2026-11-13 | Home page furniture: top-left plate with season name, mood line under it, rotated season number on the right edge, bottom-right plate with the date range | The hero is treated as an ad tile (two plates on opposite corners, rotated model number) | Section 6 (Ad tile, Corner plate) | Superseded by D-030 and D-036 |
| D-027 | 2026-11-13 | First-visit intro is an ASCII banner in the mono face with three boot lines and a ghost skip button | Owner asked for an ASCII intro; kept to silver on carbon | Owner | Superseded by D-033 |
| D-028 | 2026-11-13 | Home footer is two corner groups: red MN box stamp and hallmark left, `label` links right | Owner brief (small corner links) plus the footer's stamp and hallmark | Owner, section 6 Footer | Proposed |
| D-029 | 2026-11-13 | Direction changes from "carbon binder with silver hardware" to "an issue of a 2000s Japanese magazine": pop inks, stickers, Japanese copy up front. The dark page stock stays | Owner: less space techno, more Japanese Y2K magazine and ad; it should pop | Owner | Accepted |
| D-030 | 2026-11-13 | The home page is a magazine cover: masthead, issue line, cover star, headline, cover lines, stickers, price barcode, ticker | Gives the home page a concept and gives every section a place on it | Owner direction, my design | Proposed |
| D-031 | 2026-11-13 | Wordmark is Grenze Gotisch 900, skewed 7 degrees, paper with a hard orange offset, with the katakana reading above it. Replaces Manufacturing Consent | Owner: the old one looked like a diploma. Heavy, slanted, and offset reads as a streetwear logo | Owner | Accepted (the face and the katakana spelling are Proposed) |
| D-032 | 2026-11-13 | Fonts: drop Michroma, IBM Plex Mono, Zen Kaku Gothic New, Manufacturing Consent. Add Zen Maru Gothic (body and labels) and Yusei Magic (handwriting). Monospace only on the loading screen, using the system face | Wide techno caps and tracked mono labels were the "space techno" look; rounded gothic is the face of era Japanese ads | Owner, moodboard 5 | Proposed |
| D-033 | 2026-11-13 | ASCII art appears only on the loading screen: an original lab-coated character snapping into a dramatic pose, with impact lines and season glyphs blowing past | Owner. The character is original and is not traced from any show | Owner | Accepted (the drawing itself is Proposed) |
| D-034 | 2026-11-13 | The cover star is a flip phone drawn in CSS; its LCD is the Now readout (building, filming, local time) | Moodboard 1 and 3 are phone ads; makes the Now info the centerpiece | Moodboard | Proposed |
| D-035 | 2026-11-13 | New ink `magenta #ff3d9a`. Signals are no longer limited to one per viewport. Orange is the headline and hover color, not only "forward" | Rationing color made the page quiet; a magazine cover is not quiet | Owner | Proposed |
| D-036 | 2026-11-13 | Depth is print, not hardware: stickers get a paper die-cut edge and a hard offset shadow, headlines get an outline and offset. Chamfered plates, corner plates, and rotated model numbers are retired. Chrome stays on devices and gel buttons | Bevelled plates were the techno look | Owner | Proposed |
| D-037 | 2026-11-13 | Motion: ambient loops (bob, swing, spin, twinkle, marquee, sticker nudge), a staggered pop-in when the cover loads, and a pointer tilt on the phone. All off under reduced motion | Owner: make sure there is motion | Owner | Proposed |
| D-038 | 2026-11-13 | Menu restyle: Japanese heading, gel close button, number pills, an いまここ ("you are here") tag, staggered link entrance. The menu hint is a lime sticker on the masthead | Brings the menu into the magazine look | Section 6 | Proposed |
| D-039 | 2026-11-13 | Cover lines for sections that are not built yet carry a 近日公開 / Soon tag and are not links | Same rule as the menu (D-023) | D-023 | Proposed |

### Open questions
1. **Katakana name.** The masthead reads マイキー・グエン. Confirm that spelling or give me yours.
2. **Loading character.** It is an original figure in the spirit of a mad-scientist pose, not a copy of a specific show's scene. If you want an exact scene, I need frames you have the rights to use.
3. **Sony 2001 file.** Still missing (D-017).
4. **Cover copy.** The Japanese cover lines and the mood line are mine; replace anything that does not sound like you.

Resolved: dark canvas (D-002), site name and stack, blackletter (D-018), "less space techno" (D-029).
