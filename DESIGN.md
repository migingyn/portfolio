---
version: 0.5
name: Portfolio "Mikey Nguyen"
status: In use. Milestone 1 (tokens, layout, menu, home) is built from this file. Tokens are mirrored in src/styles/tokens.css.
description: >
  A dark, grainy, vintage Y2K portfolio. The home page is one frame from a 2000s
  point-and-shoot: a full-screen photograph, faded and bloomed under film grain, with a
  brushed-silver flip phone floating over it and the site's facts burned in like a date
  stamp. Influenced by 2000s Japanese magazine and phone-ad photography without
  imitating it: no Japanese copy, no pop colours, no pills.

colors:
  # Page stock (dark)
  carbon: "#101114"          # page, scrims, device insets
  carbon-2: "#1a1c22"        # quiet panels
  carbon-3: "#272a33"        # device details, pressed surfaces
  hairline: "#3a3e4a"        # rules and dotted dividers
  # Neutrals
  paper: "#ffffff"           # masthead, button hover
  silver-50: "#f4f5f8"       # primary text on dark
  silver-200: "#d9dde5"      # phone metal
  silver-400: "#aab0bd"      # secondary text
  silver-500: "#8a91a1"      # disabled text
  silver-600: "#6f7686"      # phone metal shade, borders (not text)
  ink: "#101114"             # text on accent fills
  # Signals
  lime: "#c8f31d"            # LCD, buttons, menu tag, current page
  orange: "#ff7a00"          # date stamp, hover, loading-screen glyphs
  red: "#e60012"             # the MN box stamp and the recording light
  fringe: "#47c8e0"          # cyan half of the masthead's colour fringe (red is the other)
  focus: "#2997ff"           # keyboard focus ring only
  # Season roles. Components use these two names; the current season may override them (D-020).
  accent: "{colors.lime}"
  forward: "{colors.orange}"

typography:
  families:
    masthead: "'Grenze Gotisch', 'Arial Black', serif"              # the name only
    shout: "'Dela Gothic One', 'Arial Black', Impact, sans-serif"   # titles
    body: "'Zen Maru Gothic', 'Helvetica Neue', Arial, sans-serif"  # text, labels
    pixel: "'DotGothic16', ui-monospace, monospace"                 # LCD, date stamp, timecode
    ascii: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"    # loading screen only
  scale:
    masthead: { family: masthead, size: "clamp(48px, min(14vw, 15vh), 128px)", weight: 900, lineHeight: 0.9 }
    shout-xl: { family: shout, size: "clamp(56px, 11vw, 144px)", weight: 400, lineHeight: 1.0 }
    shout-lg: { family: shout, size: "clamp(44px, 7vw, 88px)",   weight: 400, lineHeight: 1.05 }
    shout-md: { family: shout, size: "48px", weight: 400, lineHeight: 1.0 }
    shout-sm: { family: shout, size: "24px", weight: 400, lineHeight: 1.1 }
    heading:  { family: body,  size: "24px", weight: 900, lineHeight: 1.2 }
    body:     { family: body,  size: "17px", weight: 500, lineHeight: 1.6 }
    body-sm:  { family: body,  size: "14px", weight: 500, lineHeight: 1.5 }
    label:    { family: body,  size: "12px", weight: 900, lineHeight: 1.2, letterSpacing: "0.06em" }
    pixel:    { family: pixel, size: "14px", weight: 400, lineHeight: 1.25 }

spacing:
  base: 4px
  scale: [2, 4, 8, 12, 16, 24, 32, 48, 64, 96]

rounded:
  none: 0px      # the default: buttons, tags, stamps, photos
  xs: 2px        # inputs
  full: 9999px   # true circles only (dial, recording light). Never a pill

texture:
  grain: "generated noise tile, overlay blend, 30% opacity, whole site"
  dust: "specks and hairline scratches, screen blend, 30% opacity, home photo only"
  bloom: "blurred copy of the photo, screen blend, 32% opacity, home photo only"

layout:
  maxWidth: 1280px
  gutter: 16px
  pagePadding: { mobile: 16px, desktop: 48px }
  breakpoints: { sm: 480px, md: 768px, lg: 1024px, xl: 1280px }

motion:
  fast: 120ms        # hover color
  press: 160ms       # press feedback
  base: 180ms        # small moves, exits
  slow: 280ms        # panels entering
  enter: 360ms       # burned-in text arriving, per piece
  develop: 1400ms    # the photo developing
  ease: "cubic-bezier(0.23, 1, 0.32, 1)"          # strong ease-out, the default
  ease-in-out: "cubic-bezier(0.77, 0, 0.175, 1)"  # things moving on screen
---

# DESIGN.md

Design system for my portfolio site. This file is the single source of truth: tokens
live in the front matter above, the reasoning lives below, and every choice we make
gets a row in the [Decision Log](#10-decision-log).

## 0. Workflow and sources

1. **awesome-design-md** supplied the first references (The Verge, Apple, Nintendo 2001).
2. **taste-skill** sets the build rules.
3. **Impeccable** and **Emil Kowalski's skills** do the direction and polish.

The three skills are vendored in `.claude/skills` (sources, commits, and licences are
in `.claude/SKILLS.md`). Impeccable's process files live beside this one: `PRODUCT.md`
(who the site is for and what must stay true) and `.impeccable/surfaces/` (the brief
and direction for each page). When a skill disagrees with the brief or this file, the
order is: owner's brief, then this file, then the skills.

| Source | What it gives this system | Status |
|---|---|---|
| Owner references: 2000s Japanese phone and audio ads, street-fashion magazine scans, a film snapshot, distressed anime poster art | **The lead.** Photography first; film grain, dust, bloom, faded colour; a product floating over a photo; small burned-in copy | Supplied in chat |
| The Verge DESIGN.md | Dark page, heavy display type, color instead of soft shadow in the interface | Read from awesome-design-md |
| Apple DESIGN.md | Photography leads and the interface recedes; 17px body; one soft shadow reserved for the product | Read from awesome-design-md |
| Nintendo.com (2001) DESIGN.md | Brushed metal with a lit top edge, now only on the phone | Read from awesome-design-md |
| Sony (2001) DESIGN.md | Silver device gloss | **Not found** in awesome-design-md; my own reading (D-017) |
| Chrome Hearts, Supreme | Site structure (name opens a side menu), gothic wordmark, red box stamp, plain lists | Interpreted, not extracted |

## 1. Concept

**The home page is one frame from a 2000s point-and-shoot.** A single photograph fills
the screen, faded and slightly bloomed, under film grain that never sits still. A
brushed-silver flip phone floats over it with what I am doing now on its screen. The
rest of the site's facts are burned into the frame the way a camera burns in a date:
small, plain, in the corners.

**Influence, not imitation.** The look comes from how those ads and magazine pages
were photographed and printed, not from their language. There is no Japanese copy.

1. **The photograph leads.** The interface is a few lines of type and one object.
2. **Texture is the era.** Grain everywhere, dust and bloom on the photo, a colour
   fringe on the name. Nothing is crisp vector on flat black.
3. **Cool, not cute.** No bright flat inks, outlines, bursts, bubbles, or stickers.
   Colour is rationed: one accent on screens and controls, orange for the date stamp
   and hover, red for a stamp and a recording light.
4. **Rectangles, not pills.** Controls are flat rectangles; states are plain text.
5. **Each season is a volume** with its own photo, accent colours, and mood line.

## 2. Colors

### Page stock
| Token | Hex | Use |
|---|---|---|
| `carbon` | `#101114` | Page, the scrims over the photo, device insets |
| `carbon-2` | `#1a1c22` | Quiet panels |
| `carbon-3` | `#272a33` | Device details, pressed surfaces |
| `hairline` | `#3a3e4a` | Rules, dotted dividers, panel edges |

### Text
`silver-50` primary (17.3:1 on carbon), `silver-400` secondary (8.7:1), `silver-500`
disabled (6.0:1). `silver-600` is for borders and metal, not text. Text that sits on
the photo always sits on a `carbon` scrim dark enough to keep those ratios.

### Signals
| Token | Hex | Job | Text on it |
|---|---|---|---|
| `lime` (`accent`) | `#c8f31d` | The LCD, buttons, the menu tag, the current page | `ink` (14.7:1) |
| `orange` (`forward`) | `#ff7a00` | The date stamp, every hover, loading-screen glyphs | `ink` (7.2:1). Never white |
| `red` | `#e60012` | The MN box stamp and the recording light. Nothing else | `paper` bold (4.8:1) |
| `fringe` | `#47c8e0` | The cyan half of the masthead's colour fringe | n/a |
| `focus` | `#2997ff` | 2px keyboard focus ring, 2px offset | n/a |

Browser surfaces follow the palette: text selection and the caret are `accent`,
scrollbars are `silver-600` on `carbon`.

### Seasons
Components never reference `lime` or `orange` directly. They use two role tokens,
`accent` and `forward`. Each season file in `src/content/seasons` may override those
two, and supplies the home photo (`hero`). A season color must reach 4.5:1 against
`carbon`, and the build fails if it does not.

### Gradients
No named gradients. The phone builds its metal from the silver tokens; the photo's
scrims are `carbon` fading to clear.

## 3. Typography

| Family | Job |
|---|---|
| **Grenze Gotisch 900** | The masthead "Mikey Nguyen" and nothing else. Skewed 7 degrees, `paper`, with a faint red and cyan fringe and a soft bloom |
| **Dela Gothic One** | Titles: section lines, menu links, page titles |
| **Zen Maru Gothic** (500, 700, 900) | Body and labels |
| **DotGothic16** | The phone LCD, the date stamp, the timecode |
| System monospace | The loading screen's ASCII art only |

All are free and self-hosted, Latin subsets only.

### Scale
| Token | Font | Size | Weight | Use |
|---|---|---|---|---|
| `masthead` | Grenze Gotisch | clamp(48px, min(14vw, 15vh), 128px) | 900 | The name |
| `shout-xl` | Dela Gothic One | clamp(56px, 11vw, 144px) | 400 | Section openers |
| `shout-lg` | Dela Gothic One | clamp(44px, 7vw, 88px) | 400 | Page and project titles |
| `shout-md` | Dela Gothic One | 48px | 400 | Menu links |
| `shout-sm` | Dela Gothic One | 24px | 400 | Home section lines, panel titles |
| `heading` | Zen Maru Gothic | 24px | 900 | The mood line, headings inside pages |
| `body` | Zen Maru Gothic | 17px / 1.6 | 500 | Paragraphs, max 65 characters per line |
| `body-sm` | Zen Maru Gothic | 14px / 1.5 | 500 | Captions |
| `label` | Zen Maru Gothic | 12px, +0.06em | 900 | Buttons, issue line, footer, states. Sentence case |
| `pixel` | DotGothic16 | 14px (date stamp 22px) | 400 | LCD, date stamp, timecode |

### Rules
- **No kicker above a title,** and no numbering unless the order means something.
- **Buttons say a verb and an object:** "Close menu", "Skip intro", "Pause motion".
- Only the masthead and the date stamp carry a text shadow (fringe and bloom; a faint burn).
- Body is 17px. Weights in use: 400, 500, 700, 900.

## 4. Spacing and layout

**Base unit 4px.** Scale: 2, 4, 8, 12, 16, 24, 32, 48, 64, 96.

**Grid.** 12 columns, 16px gutter, max width 1280px, page padding 48px desktop and 16px
mobile, equal on both sides.

**Home.** The photo covers the viewport and stays fixed. Name and tagline at top
center. The phone floats right of centre on desktop (58% across, 46% down) and sits
centred under the name on phones. Burned-in text keeps to the corners: recording mark
top left, issue and mood bottom left, section lines and date stamp bottom right.

**Breakpoints.** 480 / 768 / 1024 / 1280. Touch targets are 44px minimum.

**Radius.** 0 by default. 2px for inputs. `full` only for true circles. **No pill
shapes, anywhere.** The phone uses its own proportional radii.

## 5. Depth and texture

| Layer | Treatment | Where |
|---|---|---|
| Photo | `saturate(0.82) contrast(0.92) sepia(0.14) brightness(0.94)`: lifted blacks, less colour, a warm cast | Home photo |
| Bloom | A tiny copy of the photo, blurred 28px, screen blend, 32% | Home photo |
| Scrims | `carbon` 72% at the top and 86% at the bottom fading to clear, plus a corner vignette | Home photo |
| Dust | Specks and hairline scratches, screen blend, 30% | Home photo |
| Grain | A generated noise tile, overlay blend, 30%, re-seated about nine times a second | Whole site |
| Cast shadow | Soft and offset, under the phone only | Phone |

The interface itself stays flat: no shadows on buttons, panels, or text other than
the two noted in section 3. No block shadows, no glows around boxes.

## 6. Components

### Masthead
The name in `masthead`, centered at the top of every page, with the tagline under it
in `body` bold. It is the menu button: a small flat `accent` rectangle reading "Menu"
sits on its top right corner, rotated 6 degrees. The name carries a 1px red and cyan
fringe and a soft white bloom. Hover (mouse only) pulls the fringe apart and swings
the tag; press closes the fringe and dips the name. On the home page it is the `h1`.

### Menu panel
Slides in from the left over an 80% `carbon` backdrop (280ms in, 180ms out); from the
keyboard it opens and closes at once. `carbon`, 1px `hairline` right edge, 480px wide
on desktop and full screen below 768px. Top: "Menu" in `shout-sm` and the "Close
menu" button. Links stack in `shout-md` with a dotted `hairline` between them and
slide in 40ms apart. Hover slides a link 10px right and turns it `forward`. The
current page is `accent`. Sections not built yet are `silver-500` with a plain "Soon"
and cannot be focused. Modal dialog: focus is trapped, Escape or a backdrop click
closes it, and focus returns to the masthead.

### Home photo
One photograph per season (`hero` in the season file, with `heroAlt`), full-screen and
fixed, under the treatment in section 5. Until a season has its own photo, a generated
stand-in is used (`src/assets/hero-standin.jpg`); it is not the owner's work.

### Flip phone (Now)
Drawn in CSS to read as a product shot: brushed metal built from `silver-50` to
`silver-600`, a lit top edge and shaded lower edge, a hinge, a keypad, an antenna, and
a soft cast shadow. No outlines, no coloured keys. The LCD is `accent` with a
brighter centre, darker edges, and a faint pixel grid; in `ink` `pixel` text it shows
NOW, what I am building and filming, and the volume. Tilted 7 degrees; it drifts
8px, slowly.

### Burned-in text
Small type set straight onto the photo, in the corners:
- **Recording mark.** A red light and "REC" with a timecode counting from page load, in `pixel`.
- **Issue and mood.** "Vol.01 / Autumn 2026" and dates in `label`; the mood line in `heading`.
- **Section lines.** Projects, Resume, Blog in `shout-sm`, right-aligned, each with one
  `label` line under it. A line is a link once its page exists; until then it says "Coming soon".
- **Date stamp.** Live local time as `'YY MM DD HH:MM:SS` in `pixel` at 22px, `forward`, with a faint burn.

### Loading screen
The only place ASCII art appears. On a first visit, a full-screen `carbon` overlay
plays an original lab-coated character snapping into a dramatic pose while impact
lines burst out and the season's glyphs blow past in `forward`. A `pixel` "NOW
LOADING" bar fills in `accent`, and the "Skip intro" button sits bottom right. About
3 seconds, then the overlay lifts and the photo develops. Never plays under reduced
motion. Add `?intro` to the URL to replay it.

### Button
One style. A flat `accent` rectangle, 0 radius, `ink` `label` text, 44px minimum
height, no border and no shadow. Hover (mouse only): fill turns `paper`. Press: scales
to 0.97 in 160ms. Focus: the 2px `focus` ring.

### Text link
`silver-50`. On hover a 2px underline draws in from the left and the text turns
`forward`. External links carry a small drawn arrow.

### States
"Soon" and "Coming soon" are plain `label` text. No badges, no outlined tags.

### Icons
Drawn, never typed: inline SVG or CSS shapes. No unicode symbols or emoji as icons.

### Footer
Left: the red MN box stamp and "(c) year, name, city" in `label`. Right: the "Pause
motion" control and small `label` links.

### Still to be built
Project tile, index row (drop list), spec sheet, inputs, the persistent player.
Photography everywhere gets the section 5 treatment and stays sharp-cornered.

## 7. Motion

**One authored moment, a few quiet loops, quick answers to input.**

| Kind | What | Timing |
|---|---|---|
| The moment | Loading screen lifts; the photo develops from blown-out, soft, and grey to exposed; the burned-in text arrives piece by piece | 1400ms develop; 360ms per piece, 60ms apart; `ease` |
| Ambient loops | Grain flicker, phone drift, recording light, timecode and date stamp ticking, LCD signal bar | 0.9s to 6s |
| Response | Hover color and underline, masthead fringe, button press (0.97), menu-link slide | 120 to 180ms, `ease` |
| Panels | Menu in 280ms, out 180ms; loading curtain 480ms | `ease` |

- Hover effects apply only on devices with a mouse.
- Exits are faster than entrances.
- Nothing animates in response to a keyboard action.
- Nothing follows the pointer, and nothing moves because the page scrolled.
- The footer's "Pause motion" control stops every loop and remembers the choice.
- Never `transition: all`.
- `prefers-reduced-motion`: loops, the develop, entrances, and the loading screen are all off; color changes stay.

## 8. Accessibility

- Text contrast is 4.5:1 or better; text on the photo sits on a scrim that guarantees it.
- Every interactive element is 44px minimum and shows the `focus` ring on keyboard focus.
- Looping motion can be paused.
- The photo has alt text. Decorative parts (grain, dust, phone keys, recording mark) are hidden from assistive tech; the Now readout and the time are real text.
- Meaning is never carried by color alone.

## 9. Do and don't

**Do**
- Let the photograph carry the page and keep the interface to the corners.
- Put every photo through the same faded, grainy treatment.
- Keep controls rectangular and flat, and say states in words.
- Answer every press and hover within 180ms.

**Don't**
- Use bright flat inks, cartoon outlines, starbursts, speech bubbles, stickers, or tickers.
- Use pill buttons, pill tags, badges, kicker labels, or thick one-sided coloured borders.
- Use Japanese copy, or images, logos, and characters that belong to someone else.
- Use wide techno caps, tracked monospace labels, or model numbers.
- Put ASCII art anywhere but the loading screen.
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
| D-020 | 2026-11-13 | Seasons override two role tokens only, `accent` (lime role) and `forward` (orange role). `red`, `focus`, and the dark base never change. Season colors must reach 4.5:1 on `carbon` or the build fails | Owner brief: seasons change accents only. Mapping "accents" to these two roles is my reading | Owner, section 8 | Accepted (role mapping is Proposed) |
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
| D-031 | 2026-11-13 | Wordmark is Grenze Gotisch 900, skewed 7 degrees, paper with a hard orange offset, with the katakana reading above it. Replaces Manufacturing Consent | Owner: the old one looked like a diploma. Heavy, slanted, and offset reads as a streetwear logo | Owner | Accepted; katakana reading removed by D-040; the face is Proposed |
| D-032 | 2026-11-13 | Fonts: drop Michroma, IBM Plex Mono, Zen Kaku Gothic New, Manufacturing Consent. Add Zen Maru Gothic (body and labels) and Yusei Magic (handwriting). Monospace only on the loading screen, using the system face | Wide techno caps and tracked mono labels were the "space techno" look; rounded gothic is the face of era Japanese ads | Owner, moodboard 5 | Proposed |
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
| D-044 | 2026-11-13 | One button style and one radius scale; nothing tilts toward the pointer; buttons are named verb plus object; a "Pause motion" control stops looping animation | taste-skill's house rules and checklist | taste-skill | Proposed |
| D-045 | 2026-11-13 | Ambient motion is trimmed to the phone bob, charm swing, starburst spin, ticker, and two small blinks. Sparkles, stamp wobble, menu-tag nudge, and pointer tilt are removed | "One authored moment, not scattered effects" | Impeccable | Superseded by D-051 |
| D-046 | 2026-11-13 | Where the skills conflict with the brief (taste-skill wants nothing rotated or overlapping and no drawn objects; Impeccable caps display type at 96px), the brief wins: the cover keeps its rotations, the drawn phone, and the large masthead | The magazine-cover concept depends on them | Owner brief | Proposed |
| D-047 | 2026-11-13 | taste-skill, Impeccable, and 16 of Emil Kowalski's skills are vendored into `.claude/skills` | Owner approved, so the workflow loads in every session | Owner | Accepted |
| D-048 | 2026-11-13 | The home page is one frame from a Y2K point-and-shoot: a full-screen photograph, faded and bloomed, under moving film grain and dust, with the site's facts burned in like a date stamp. The magazine-cover layout (starburst, speech bubble, barcode, ticker, cover headline) is retired | Owner: grainy vintage Y2K, cool, not a pop game. References: film snapshots, scanned magazine pages, distressed poster art | Owner | Accepted (direction); the composition is Proposed |
| D-049 | 2026-11-13 | The flip phone stays but as a product shot: brushed silver built from the silver tokens, soft edges, a cast shadow, a backlit LCD; no outlines, no coloured keys, no charm | Owner: the phone is fine, the pop styling is not | Owner | Accepted (direction); the drawing is Proposed |
| D-050 | 2026-11-13 | Palette cut to dark stock, silver neutrals, paper, and three signals (`accent`, `forward`, `red`), plus `fringe` for the masthead's colour fringe. Sky, ice, pink, magenta, indigo, and both named gradients are removed. Texture is now allowed: film grain site-wide, dust and bloom on the home photo | Follows D-048: flat pop inks were the "pop game" look | Owner direction | Proposed |
| D-051 | 2026-11-13 | Motion: the photo "develops" once as the loading screen lifts (the authored moment); grain flickers; the phone drifts; a recording light blinks; timecode and date stamp tick. The masthead's colour fringe widens on hover | Fits a camera frame; keeps one moment plus quiet loops | Impeccable, Emil's skill | Proposed |
| D-052 | 2026-11-13 | The home photo is a slot per season (`hero` in the season file). Until the owner supplies one, a generated stand-in is used and must not be presented as his work | Owner will add a photo or film still | Owner | Accepted |
| D-053 | 2026-11-13 | The menu panel loses its thick accent edge for a 1px hairline | Impeccable's detector flags a thick one-sided coloured border as a generated-UI tell | Impeccable detector | Proposed |

### Open questions
1. **Your photo.** Add it next to the season file and set `hero` and `heroAlt` there. Portrait-safe framing helps: the middle of the frame stays visible on phones.
2. **Loading character.** It is an original figure in the spirit of a mad-scientist pose, not a copy of a specific show's scene.
3. **Sony 2001 file.** Still missing (D-017).
4. **Copy.** The mood line, section lines, and the "filming" line are placeholders.

Resolved: dark canvas (D-002), site name and stack, wordmark (D-031), "less space techno" (D-029), Japanese copy (D-040), pills (D-041), skills installed (D-047), "not a pop game" (D-048, D-049).
