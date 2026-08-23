# What was written into the Figma Slides file

File: `UtxFDFaTR9GDTRcqIOKlOy` (Cakewalk slide template).
This is the exact state pushed through the Figma MCP, recorded so the theme can be
rebuilt from scratch or applied to a second Slides file.

## Theme colour variables

A new Figma Slides file ships a default "Light slides" theme with 23 colour variables
(White, Teal, Persimmon, Violet…). Those 23 were **renamed and revalued in place**
rather than replaced, so Figma's native theme picker keeps working and shows Cakewalk
swatches. Collection: `Light slides`, single mode.

Renaming needs **two passes** — park every variable on a temp name first, then assign
final names. A single pass throws `in set_name: duplicate variable name` as soon as a
new name collides with one still held by another variable (e.g. Violet→Purple while
Purple still exists).

| Original slot | Cakewalk name | Value |
|---|---|---|
| White | White | `#FFFFFF` |
| Black | Ink | `#1A1A2E` |
| Grey | Sidewalk | `#F3F3F0` |
| Persimmon | Coral | `#E8735A` |
| Pale Persimmon | Coral 300 | `#EF9D8C` |
| Pale Red | Coral 100 | `#F8D5CE` |
| Orange | Coral 600 | `#C5624D` |
| Red | Danger | `#DC2626` |
| Yellow | Sunny | `#FFD166` |
| Pale Yellow | Sunny 100 | `#FFF1D1` |
| Green | Spring | `#4CAF82` |
| Pale Green | Spring 100 | `#C9E7DA` |
| Teal | Band Mint | `#4CE0C6` |
| Pale Teal | Mint | `#92E7E5` |
| Blue | Uniform Blue | `#3590F3` |
| Pale Blue | Blue 100 | `#C2DEFB` |
| Violet | Purple | `#8D63E0` |
| Pale Violet | Purple 50 | `#F0E9FB` |
| Purple | Band Purple | `#9966FF` |
| Pale Purple | Blue 900 | `#102B49` |
| Pink | Warm Blush | `#F5DDD6` |
| Pale Pink | Cream | `#FBF8F2` |
| Color 3 | Border | `#D5D5CA` |

Scopes were narrowed from the default `ALL_SCOPES` to
`["FRAME_FILL","SHAPE_FILL","TEXT_FILL","STROKE_COLOR"]` so the picker stays useful.

Every slide background is **bound** to one of these variables rather than given a raw
hex, so changing Ink once recolours every dark slide in the deck.

## Text styles

The 8 default styles were restyled in place; 6 were added. Sizes are presentation
scale — the product ramp tops out at 32px, which is invisible on a 1920×1080 canvas.

| Style | Family | Weight | Size | Line height | Tracking |
|---|---|---|---|---:|---:|---:|
| Title | Plus Jakarta Sans | ExtraBold | 116 | 104% | −2% |
| Section Title *(new)* | Plus Jakarta Sans | ExtraBold | 88 | 106% | −2% |
| Header 1 | Plus Jakarta Sans | Bold | 48 | 122% | −1.5% |
| Header 2 | Plus Jakarta Sans | SemiBold | 34 | 132% | −1% |
| Header 3 | Plus Jakarta Sans | SemiBold | 24 | 136% | 0 |
| Body 1 | Plus Jakarta Sans | Regular | 24 | 148% | 0 |
| Body 2 | Plus Jakarta Sans | Regular | 21 | 150% | 0 |
| Body 3 | Plus Jakarta Sans | Regular | 17 | 152% | 0 |
| Metric *(new)* | Plus Jakarta Sans | ExtraBold | 96 | 100% | −3% |
| Metric Small *(new)* | Plus Jakarta Sans | ExtraBold | 52 | 105% | −2% |
| Label *(new)* | Plus Jakarta Sans | SemiBold | 17 | 140% | 0 |
| Overline *(new)* | IBM Plex Mono | SemiBold | 15 | 140% | +12%, UPPER |
| Data *(new)* | IBM Plex Mono | Regular | 19 | 145% | 0 |
| Note | IBM Plex Mono | Regular | 15 | 148% | 0 |

Font style strings are literal and unforgiving. Plus Jakarta Sans uses `ExtraBold` and
`SemiBold` (no space); Inter, by contrast, uses `Extra Bold` and `Semi Bold`. IBM Plex
Mono uses `SemiBold`. Guessing here is the most common cause of
`Cannot write to node with unloaded font`.

## Page-level logo masters

Two locked nodes sit on the Slides page, outside the slide grid, and every logo in the
deck is a clone of one of them:

- `4:8` — **Cakewalk Wordmark (master)**, frame 180.048 × 30.504, 14 vector children,
  each with `constraints: {horizontal: SCALE, vertical: SCALE}` so resizing the frame
  scales the artwork.
- `4:27` — **Cakewalk Mark (master)**, frame 28 × 30.504, `clipsContent: true`,
  containing a scaled clone of the wordmark. The clip reproduces the icon-only mark.

Recolouring a clone means setting fills on its vector descendants, not on the frame:
`clone.findAllWithCriteria({types:['VECTOR']}).forEach(v => v.fills = [...])`.
