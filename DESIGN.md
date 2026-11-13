---
version: 0.1-draft
name: Portfolio "Digital Form"
status: DRAFT, awaiting owner review. Nothing gets built until this is approved.
description: >
  A portfolio that reads like a 2000s Japanese tech and fashion magazine bound in a
  carbon folder. A near-black editorial canvas (The Verge) carries full-bleed "ad page"
  tiles, framed by brushed-silver hardware chrome (Nintendo 2001, Sony 2001), with
  Apple's restraint deciding how much of the noise each piece of work has to share
  the page with.

colors:
  # Canvas (dark, flat)
  carbon: "#101114"          # page canvas
  carbon-2: "#1a1c22"        # secondary surface, quiet tiles
  carbon-3: "#272a33"        # raised surface, pressed states
  hairline: "#3a3e4a"        # 1px rules and image frames on carbon
  # Chrome (silver hardware, only place gradients and bevels live)
  silver-50: "#f4f5f8"       # primary text on carbon, bevel highlight
  silver-200: "#d9dde5"      # plate face
  silver-400: "#aab0bd"      # secondary text, plate shade
  silver-500: "#8a91a1"      # muted text (metadata, timestamps)
  silver-600: "#6f7686"      # bevel shadow line, borders only (not text)
  periwinkle: "#7a8aba"      # Nintendo chrome tint, cool tile fill
  indigo: "#2f2a95"          # wordmark ink on light tiles, deep tile fill
  # Ad-page fills (tile backgrounds)
  sky: "#a9c6f0"             # airbrushed sky blue
  ice: "#dfeaf9"             # sky fade end, light tile
  pink: "#f6a6c1"            # Walkman pink, soft tile
  paper: "#ffffff"           # spotlight tile, form fields
  # Signals (rationed)
  lime: "#c8f31d"            # LCD Lime: primary accent, CTA, active state
  orange: "#ff7a00"          # Signal Orange: forward cues and hover only
  red: "#e60012"             # Stamp Red: NEW / box stamp only
  focus: "#2997ff"           # keyboard focus ring only
  # Text
  ink: "#101114"             # text on any light or saturated fill
  on-carbon: "#f4f5f8"
  on-carbon-muted: "#8a91a1"

gradients:
  chrome: "linear-gradient(180deg, #f4f5f8 0%, #d9dde5 45%, #aab0bd 100%)"
  sky: "linear-gradient(180deg, #a9c6f0 0%, #dfeaf9 70%, #ffffff 100%)"

typography:
  families:
    shout: "'Dela Gothic One', 'Arial Black', Impact, sans-serif"       # Latin + Japanese display
    techno: "'Michroma', 'Eurostile', 'Arial', sans-serif"              # wide uppercase wordmarks and plates
    body: "'Zen Kaku Gothic New', 'Helvetica Neue', Arial, sans-serif"  # Latin + Japanese text and UI
    mono: "'IBM Plex Mono', 'Courier New', monospace"                   # uppercase labels only
    pixel: "'DotGothic16', 'IBM Plex Mono', monospace"                  # inside LCD components only
  scale:
    shout-xl:   { family: shout,  size: "clamp(56px, 11vw, 144px)", weight: 400, lineHeight: 0.95, letterSpacing: "0" }
    shout-lg:   { family: shout,  size: "clamp(44px, 7vw, 88px)",   weight: 400, lineHeight: 0.98, letterSpacing: "0" }
    shout-md:   { family: shout,  size: "48px",  weight: 400, lineHeight: 1.0,  letterSpacing: "0" }
    techno-lg:  { family: techno, size: "28px",  weight: 400, lineHeight: 1.1,  letterSpacing: "0.04em", case: upper }
    techno-sm:  { family: techno, size: "13px",  weight: 400, lineHeight: 1.2,  letterSpacing: "0.08em", case: upper }
    heading:    { family: body,   size: "24px",  weight: 700, lineHeight: 1.15, letterSpacing: "-0.01em" }
    heading-sm: { family: body,   size: "19px",  weight: 700, lineHeight: 1.2,  letterSpacing: "-0.01em" }
    whisper:    { family: body,   size: "19px",  weight: 300, lineHeight: 1.25, letterSpacing: "0.1em", case: upper }
    body:       { family: body,   size: "17px",  weight: 400, lineHeight: 1.6,  letterSpacing: "0" }
    body-sm:    { family: body,   size: "14px",  weight: 400, lineHeight: 1.5,  letterSpacing: "0" }
    label:      { family: mono,   size: "12px",  weight: 600, lineHeight: 1.2,  letterSpacing: "0.12em", case: upper }
    meta:       { family: mono,   size: "11px",  weight: 500, lineHeight: 1.2,  letterSpacing: "0.1em",  case: upper }
    pixel:      { family: pixel,  size: "16px",  weight: 400, lineHeight: 1.2,  letterSpacing: "0" }

spacing:
  base: 4px
  "0.5": 2px
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "6": 24px
  "8": 32px
  "12": 48px
  "16": 64px
  "24": 96px

rounded:
  none: 0px      # default: tiles, plates, nav, footer
  xs: 2px        # inputs, small tags
  sm: 6px        # chips, swatches
  screen: 14px   # LCD screens and device-shaped frames only
  pill: 9999px   # buttons, oval badges, arrow discs

layout:
  maxWidth: 1280px
  gutter: 16px
  pagePadding: { mobile: 16px, desktop: 48px }
  breakpoints: { sm: 480px, md: 768px, lg: 1024px, xl: 1280px }

motion:
  fast: 120ms
  base: 180ms
  slow: 280ms
  ease: "cubic-bezier(0.23, 1, 0.32, 1)"
---

# DESIGN.md

Design system for my portfolio site. This file is the single source of truth: tokens
live in the front matter above, the reasoning lives below, and every choice we make
gets a row in the [Decision Log](#10-decision-log).

## 0. Workflow and sources

Build pipeline for this project:

1. **awesome-design-md** supplies the references (below).
2. **taste-skill** builds from this file.
3. **Impeccable** and **Emil's skills** do the polish pass (spacing audit, motion, interaction details).

| Source | Role in this system | Status |
|---|---|---|
| The Verge DESIGN.md | **Base.** Dark canvas, giant display type, mono uppercase labels, color-block tiles, timeline feed, color instead of shadow | Read from awesome-design-md |
| Apple DESIGN.md | **Restraint.** Photography first, 17px body, one accent for action, pedestal whitespace around the work, one image shadow | Read from awesome-design-md |
| Nintendo.com (2001) DESIGN.md | **Hardware chrome.** Beveled plates, chamfered corners, halftone carbon command bar, warm color means "go", outlined box-art type | Read from awesome-design-md |
| Sony (2001) DESIGN.md | **Product gloss.** Silver device bodies, model numbers, spec callouts, colorway chips | **Not found.** No `sony-2001` entry exists in the awesome-design-md repo, and getdesign.md is blocked in this session. The Sony layer here is my own reading of the Walkman ad and era Sony product pages, to be replaced or confirmed when the real file is supplied |
| Owner moodboard (5 ads) | Palette, type treatments, components (see section 1) | Supplied in chat |
| Chrome Hearts, Supreme | Black and silver material, hallmark stamps, box stamp, plain "drop list" index | Interpreted, not extracted |

## 1. Concept

**The site is a magazine of ad pages inside a carbon binder.** The binder (canvas, nav,
footer) is dark, flat, and quiet. Each project is an ad page: a full-bleed image or
color field with silver corner plates, a wide techno wordmark, a model number, and
one loud headline. Silver chrome is the hardware that holds the pages together.

What each moodboard image contributes:

| Image | What we take |
|---|---|
| "Be Different!" flip phone ad | Chamfered silver **corner plates** with wide type, oval badge, issue number ("243"), LCD lime from the phone screen |
| Panasonic earphone ad | Airbrushed **sky gradient** backdrop, thin **leader lines** pointing at features, small red **NEW** tag |
| Nokia 7250 ad | Vertical rotated model number, **indigo wide wordmark**, product cutouts overlapping the photo, tiny caption set over the image |
| Street fashion magazine spread | Giant **orange katakana headline** crossing the photo, dense small text blocks, speech-bubble callout |
| Sony Walkman ad | **Spec callout boxes**, **colorway chips** (Silver / Pink / Black), script signature, pink soft tile |

Three rules resolve every conflict between the references:

1. **Content is flat, chrome is hardware.** Tiles, text, and images follow The Verge: solid color, 1px lines, no shadows. Only frame elements (nav, plates, buttons, badges) get the Nintendo/Sony bevel and the chrome gradient.
2. **The work gets Apple's pedestal.** Chrome is dense, but each project image gets air and nothing overlaps it except its own plates.
3. **Loud is rationed.** One shout headline per viewport. One lime element per viewport. Orange only means "go forward".

## 2. Colors

### Canvas
| Token | Hex | Use |
|---|---|---|
| `carbon` | `#101114` | Page canvas. Always dark; there is no light mode, light appears only as tiles |
| `carbon-2` | `#1a1c22` | Quiet tiles, index rows, footer |
| `carbon-3` | `#272a33` | Raised or pressed surface |
| `hairline` | `#3a3e4a` | 1px rules, image frames, dotted dividers |

### Chrome
| Token | Hex | Use |
|---|---|---|
| `silver-50` | `#f4f5f8` | Primary text on carbon (17.3:1), bevel top highlight |
| `silver-200` | `#d9dde5` | Plate face |
| `silver-400` | `#aab0bd` | Secondary text (8.7:1), plate lower edge |
| `silver-500` | `#8a91a1` | Metadata text (6.0:1) |
| `silver-600` | `#6f7686` | Bevel shadow line and borders. Not for text (4.15:1) |
| `periwinkle` | `#7a8aba` | Cool tile fill, inactive chrome |
| `indigo` | `#2f2a95` | Wordmark ink on silver and sky (8.2:1 on plate), deep tile fill with white text |

### Ad-page fills
`sky #a9c6f0`, `ice #dfeaf9`, `pink #f6a6c1`, `paper #ffffff`, plus `silver-200`,
`periwinkle`, `indigo`, and `lime`. Text on every one of these is `ink #101114`,
except `indigo`, which takes white. These are the only tile colors.

### Signals
| Token | Hex | Job | Never |
|---|---|---|---|
| `lime` | `#c8f31d` | Primary CTA fill, active nav underline, LCD screens, one spotlight tile | Body text under 16px, background wash, more than one per viewport |
| `orange` | `#ff7a00` | Hover color for every link, arrow discs, the one shout headline that crosses a photo | Decoration. Text on orange is `ink`, never white (white fails at 2.9:1) |
| `red` | `#e60012` | NEW tag and box stamp, white bold text only | Buttons, links, errors on its own without a text label |
| `focus` | `#2997ff` | 2px keyboard focus ring with 2px offset | Any non-focus use |

### Gradients
Exactly two, both named tokens. `chrome` goes on plates, chrome buttons, and badges.
`sky` goes on ad-page backdrops behind a cutout subject. No other gradients, no
glows, no gradient text.

## 3. Typography

| Family | Stands in for | Job |
|---|---|---|
| **Dela Gothic One** | Verge's Manuka, Nintendo box-art type, magazine katakana | The shout. Latin and Japanese. 44px minimum, one per viewport |
| **Michroma** | Eurostile-style ad wordmarks ("DIGITAL FORM.", NOKIA) | Wide uppercase wordmarks, corner plates, model numbers |
| **Zen Kaku Gothic New** | Verge's PolySans, Apple's SF Pro Text | Body, headings, UI. Covers Japanese so mixed lines match |
| **IBM Plex Mono** | Verge's PolySans Mono | Uppercase labels, timestamps, tags, button text. Never lowercase |
| **DotGothic16** | Phone LCD bitmap text | Inside LCD components only |

All five are free on Google Fonts. Load Latin subsets first; Japanese ranges load on demand.

### Scale
| Token | Font | Size | Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|---|
| `shout-xl` | Dela Gothic One | clamp(56px, 11vw, 144px) | 400 | 0.95 | 0 | Masthead wordmark, home hero |
| `shout-lg` | Dela Gothic One | clamp(44px, 7vw, 88px) | 400 | 0.98 | 0 | Project titles, section openers |
| `shout-md` | Dela Gothic One | 48px | 400 | 1.0 | 0 | Tile headline on a feature tile |
| `techno-lg` | Michroma | 28px | 400 | 1.1 | 0.04em | Plate wordmarks, rotated model numbers |
| `techno-sm` | Michroma | 13px | 400 | 1.2 | 0.08em | Corner plate labels, badges |
| `heading` | Zen Kaku Gothic New | 24px | 700 | 1.15 | -0.01em | Tile and section headings |
| `heading-sm` | Zen Kaku Gothic New | 19px | 700 | 1.2 | -0.01em | Index row titles |
| `whisper` | Zen Kaku Gothic New | 19px | 300 | 1.25 | 0.1em | Thin uppercase eyebrow above a shout |
| `body` | Zen Kaku Gothic New | 17px | 400 | 1.6 | 0 | Paragraphs, max 65 characters per line |
| `body-sm` | Zen Kaku Gothic New | 14px | 400 | 1.5 | 0 | Captions, spec values |
| `label` | IBM Plex Mono | 12px | 600 | 1.2 | 0.12em | Buttons, nav links, kickers |
| `meta` | IBM Plex Mono | 11px | 500 | 1.2 | 0.1em | Timestamps, credits, fine print |
| `pixel` | DotGothic16 | 16px | 400 | 1.2 | 0 | LCD readouts |

### Rules
- **Whisper then shout.** A 300-weight tracked eyebrow directly above a Dela Gothic headline is the signature pairing (Verge's contrast, magazine-cover feel).
- **Box-art treatment** (2px `ink` text stroke plus a hard 4px offset shadow, no blur) is allowed on a shout headline only when it sits on a photo or sky field. Never on flat carbon.
- **Japanese is real copy.** Any Japanese text must be correct, meaningful, tagged `lang="ja"`, and paired with English nearby. No filler katakana.
- Body is 17px, not 16px (Apple). Labels are always uppercase with tracking (Verge, Nintendo).
- Weights in use: 300, 400, 500, 600, 700. Nothing else.

## 4. Spacing and layout

**Base unit 4px.** Scale: 2, 4, 8, 12, 16, 24, 32, 48, 64, 96.

| Context | Value | Borrowed from |
|---|---|---|
| Inside chrome (plates, nav, chips, spec boxes) | 8 to 12px padding, 4 to 8px gaps | Nintendo density |
| Inside tiles | 24px (mobile 16px), feature tiles 32px | Verge |
| Between tiles in a feed | 16px | Verge |
| Between page sections | 64px (mobile 48px) | Verge pacing |
| Around a hero project image | 96px above and below (mobile 64px) | Apple pedestal |
| Kicker to headline / headline to deck | 8px / 12px | Verge |

**Grid.** 12 columns, 16px gutter, max width 1280px, page padding 48px desktop and 16px
mobile. Tiles span 4, 6, 8, or 12 columns; uneven spans are encouraged so the feed
reads as pasted-up pages rather than a uniform card grid.

**Breakpoints.** 480 / 768 / 1024 / 1280. Columns go 12, 8, 4, single. Shout type
scales with `clamp`; labels never go below 11px. Touch targets are 44px minimum.

**Radius.** Sharp by default (0). 2px inputs, 6px chips, 14px for LCD and
device-shaped frames, full pill for buttons and oval badges. Large chrome plates are
**chamfered** (one corner cut at 45 degrees, 12px, via `clip-path`) rather than rounded.

## 5. Depth

| Level | Treatment | Use |
|---|---|---|
| 0 Flat | Nothing | Canvas, text, tiles |
| 1 Line | 1px `hairline` or 1px `silver-50` | Image frames, quiet tile outlines, rules |
| 2 Fill | Saturated tile fill | Emphasis by color, not shadow (Verge) |
| 3 Bevel | `chrome` gradient, 1px `silver-50` inset top, 1px `silver-600` inset bottom | Plates, chrome buttons, badges, nav edges (Nintendo, Sony) |
| 4 Product shadow | `0 5px 30px rgba(0,0,0,0.3)` | Cutout product or device images only (Apple's single shadow) |

**Texture.** One: a halftone dot pattern (1px dots on a 4px grid, 6% white) on the
command bar and footer. No noise overlays, no scanlines, no lens flares.

## 6. Components

### Masthead
Site wordmark in `shout-xl`, `silver-50`, full width on first view, with a `whisper`
eyebrow above and an issue line in `meta` (for example `VOL.01 / 2026 / SAN DIEGO`).
On scroll it collapses into the command bar.

### Command bar (nav)
48px `carbon` bar with halftone texture and a 1px `silver-600` bottom line. Small
wordmark left in `techno-sm`, links in `label` (`silver-400`), one lime pill CTA right.
Hover turns link text `orange`. Active link has a 1px `lime` inset underline.
Below 768px the links collapse into a full-screen carbon sheet with `shout-md` links.

### Ticker strip
Optional 28px `carbon-2` strip under the nav: `meta` text, status and location,
bilingual. Static by default; marquee only if motion is allowed, and it pauses on hover.

### Corner plate
The signature piece (flip phone ad). A `chrome` gradient plate pinned to a tile
corner, bevel level 3, inner corner chamfered 12px, 8px by 12px padding, text in
`techno-sm` `indigo`. Holds a project name, client, or number. Maximum two per tile,
on opposite corners.

### Oval badge
Pill outline, 1px `ink` or `silver-50`, `techno-sm` text, optional double-line oval.
For categories and "technology" style taglines.

### NEW stamp
`red` rectangle, 0 radius, white `label` text, 4px by 8px padding. One per page at
most. Also used as the box stamp for the site mark in the footer.

### Buttons
| Variant | Spec |
|---|---|
| Primary | `lime` fill, `ink` `label` text, pill, 12px by 24px padding, 44px min height. Hover: fill `silver-50`. Active: `scale(0.97)` |
| Chrome | `chrome` gradient with bevel level 3, `ink` `label` text, pill. Hover: 1px `lime` ring. Active: gradient flips (pressed in) |
| Ghost | Transparent, 1px `silver-50` border, `silver-50` text, pill. Hover: border and text `orange` |
| Arrow disc | 40px `orange` circle, `ink` chevron. The "go forward" control on tiles and pagination |

All buttons: focus shows the 2px `focus` ring. Disabled is 40% opacity, no hover.

### Ad tile (project card)
The core unit. 0 radius, flat. Either a full-bleed image with a 1px `hairline` frame
or one ad-page fill. Contents, in order: `label` kicker, heading (`heading`, or
`shout-md` on feature tiles), optional `body-sm` deck, `meta` line (year, role).
May carry corner plates, a rotated `techno-lg` model number on one edge, and an
arrow disc bottom right. Hover: heading turns `orange`, arrow disc moves 4px right;
the image does not zoom. Ratios: 4:5 (ad page, default), 16:9 (feature), 1:1 (small).

### Index row (drop list)
Plain text list of all work, Supreme-style: `meta` number and date on a left rail,
`heading-sm` title, `meta` category right, 1px dotted `hairline` between rows,
16px vertical padding. Hover: row fills `carbon-2`, title turns `orange`. This is
also the timeline for writing or experience, with the rail date in `meta`.

### Spec sheet
For project detail pages (Walkman ad). A grid of small boxes with 1px `hairline`
border: `label` key in `silver-500` on top, `body-sm` value below. Fields like ROLE,
YEAR, STACK, CLIENT. A box heading may use a `chrome` tab.

### Leader-line callout
Annotation for case-study images (Panasonic ad): 1px `silver-50` line from a point
on the image to a `body-sm` caption with a `label` number. SVG, hidden below 768px
where captions become a numbered list under the image.

### Colorway chips
Filter and tag control (Walkman colorways). 6px radius chip, 12px color dot plus
`label` text, 1px `hairline` border. Selected: 1px `lime` border and `silver-50` text.

### LCD screen
Small status readout: `lime` fill, `ink` `pixel` text, 14px radius, 2px `silver-600`
border with bevel. Use for one live detail per page (availability, local time, now
playing). Never for body content.

### Inputs
`carbon-2` fill, 1px `silver-600` border, 2px radius, `body` text, `label` above.
Focus: border `lime` plus focus ring. Error: `red` border and a `meta` message with
text, never color alone.

### Images
Photography leads. Full-bleed inside its tile, 1px `hairline` frame, no rounded
corners. Cutout subjects on a `sky` field get the product shadow. Small captions may
sit over an image in `meta` white only where contrast holds; otherwise below.
All images have alt text; `loading="lazy"` below the fold.

### Footer
`carbon-2` slab with halftone texture, top edge chamfered. Dense by design: index
links in `label`, fine print in `meta`, the red box stamp, and a silver hallmark
line (year, city) as the Chrome Hearts nod.

## 7. Motion

- Durations: 120ms (hover color), 180ms (press, small moves), 280ms (sheets, page reveals). Ease: `cubic-bezier(0.23, 1, 0.32, 1)`.
- Animate `transform` and `opacity` only. Press feedback is `scale(0.97)`.
- Entrances: tiles rise 8px and fade in once, staggered 40ms, on first view only.
- No parallax, no scroll-jacking, no cursor trails, no auto-playing sound.
- `prefers-reduced-motion`: all movement off, color transitions stay.

## 8. Accessibility

- Text contrast is 4.5:1 or better on every pairing listed in section 2. `silver-600` and `lime` under 16px are not text colors.
- Every interactive element is 44px minimum and shows the `focus` ring on keyboard focus.
- Japanese text carries `lang="ja"`. Decorative plates and rotated model numbers that repeat visible text are `aria-hidden`.
- Meaning is never carried by color alone (stamps and errors always have text).

## 9. Do and don't

**Do**
- Keep the canvas `carbon` everywhere; bring light in as tiles.
- Use uneven tile spans and mixed fills so the feed feels pasted up.
- Put bevels and gradients on chrome only.
- Pair every shout with a whisper.
- Let orange mean "forward" and nothing else.

**Don't**
- Add drop shadows to tiles, text, or buttons.
- Round tiles or images.
- Use Dela Gothic One below 44px or more than once per viewport.
- Use lowercase mono, fake Japanese, or brand logos from the moodboard ads.
- Add a new color, font, or gradient without a Decision Log entry.

## 10. Decision Log

**Rule:** every design choice gets a row here before or in the same commit as the
change. Never edit or delete a past row; to reverse one, add a new row and mark the
old one `Superseded by D-0xx`. Status is `Proposed` (mine, awaiting your call),
`Accepted` (you confirmed), `Superseded`, or `Rejected`.

| ID | Date | Decision | Why | Source | Status |
|---|---|---|---|---|---|
| D-001 | 2026-11-13 | The Verge is the structural base; Apple, Nintendo 2001, and Sony 2001 are layers on top | Owner brief | Owner | Accepted |
| D-002 | 2026-11-13 | Canvas is dark `carbon #101114` with no light mode; light appears only as ad-page tiles | Verge base, Chrome Hearts black and silver; makes the bright ads read as pages in a binder | Verge, Chrome Hearts | Proposed |
| D-003 | 2026-11-13 | "Content is flat, chrome is hardware": bevels and the chrome gradient only on nav, plates, buttons, badges | Resolves Verge (no shadows or gradients) against Nintendo (bevel everything) | Verge, Nintendo | Proposed |
| D-004 | 2026-11-13 | Primary accent is LCD Lime `#c8f31d`, replacing Verge's mint | Sampled from the flip phone screen; same hazard-accent role, owned by this moodboard | Moodboard 1, Verge | Proposed |
| D-005 | 2026-11-13 | Orange `#ff7a00` is reserved for forward cues and link hover | Nintendo's "warm means go" rule; hue from the magazine headline | Nintendo, Moodboard 4 | Proposed |
| D-006 | 2026-11-13 | Red `#e60012` only as NEW tag and box stamp | Panasonic NEW tag and Supreme box logo; too loud for anything else | Moodboard 2, Supreme | Proposed |
| D-007 | 2026-11-13 | Exactly two gradients: `chrome` and `sky` | Y2K needs airbrush and metal; Verge and Apple forbid decorative gradients, so cap and name them | Moodboard 1, 2 | Proposed |
| D-008 | 2026-11-13 | Tiles and images are sharp (0 radius); large plates are chamfered; pills only for controls | Ads are printed pages; Nintendo's sharp chrome over Verge's 20 to 40px rounding | Nintendo, Moodboard | Proposed |
| D-009 | 2026-11-13 | Fonts: Dela Gothic One, Michroma, Zen Kaku Gothic New, IBM Plex Mono, DotGothic16 | Free stand-ins for Manuka, Eurostile, PolySans, PolySans Mono, LCD bitmap; two cover Japanese | Verge, Moodboard | Proposed |
| D-010 | 2026-11-13 | Body text is 17px | Apple's reading pace on a loud page | Apple | Proposed |
| D-011 | 2026-11-13 | Spacing is two-speed: 8 to 12px inside chrome, 96px pedestal around hero work, 4px base | Nintendo density plus Apple whitespace without averaging them into mush | Nintendo, Apple | Proposed |
| D-012 | 2026-11-13 | One shadow in the system, on cutout product imagery only | Apple's single product shadow; keeps Verge flatness | Apple | Proposed |
| D-013 | 2026-11-13 | Project list is a plain numbered "drop list" on a dated rail | Supreme's index plus Verge's StoryStream timeline | Supreme, Verge | Proposed |
| D-014 | 2026-11-13 | Moodboard-derived components: corner plate, leader-line callout, spec sheet, colorway chips, LCD screen | Direct lifts of the ads' recurring devices, rebuilt as original UI | Moodboard 1, 2, 5 | Proposed |
| D-015 | 2026-11-13 | Japanese copy must be real, tagged `lang="ja"`, and paired with English | Respect for the language, screen readers, and credibility | Owner aesthetic | Proposed |
| D-016 | 2026-11-13 | No blackletter and no third-party logos or wordmarks from the ads | Blackletter fights the techno type; brand marks are not ours to use | Chrome Hearts (declined) | Proposed |
| D-017 | 2026-11-13 | Sony 2001 layer is provisional (silver bodies, model numbers, spec callouts, colorways) | Reference file not available in awesome-design-md or reachable this session | See section 0 | Proposed |

### Open questions
1. **Dark or light canvas?** D-002 proposes dark. The alternative is a silver and sky light canvas closer to the ads themselves, with carbon as the accent.
2. **Sony 2001 file.** Paste it or point me to it and I will revise D-017 and the chrome specs.
3. **Site name and stack.** The masthead needs the wordmark text, and the build needs a framework choice; neither is set yet.
4. **Blackletter.** Declined in D-016; say so if you want a Chrome Hearts gothic accent somewhere small (footer hallmark).
