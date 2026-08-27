# Cakewalk slide design language

The presentation-layer design language for Cakewalk decks, defined end to end:
tokens, grid, type, motifs, conventions, the Figma Slides helper library, the
chart vocabulary, and the failure modes that cost time if you meet them cold.

Colour, radius and spacing descend from the product design system
([`cakewalk-design`](https://github.com/Cakewalk-Benefits/cakewalk-design) —
`DESIGN.md` and `packages/ui/src/v2/styles/globals.css`). The type ramp, the grid
and the motif applications are the slide-specific layer built on top: the product
ramp is UI-scale (32px display) and does not survive a 1920×1080 canvas.

This repo is **self-contained** — you do not need the product repo checked out to
use it.

## Where it has been used

| Deck | Slides | Notes |
|---|---:|---|
| Business Case template | 270 | Slideworks consulting template, recreated in this language |
| GTM strategy template | 306 | Slideworks consulting template, recreated in this language |

Both live in one Figma Slides file: `UtxFDFaTR9GDTRcqIOKlOy`, 40 named sections,
576 slides. Validated: no empty slides, every page number matches deck position,
footer on every slide, nothing out of bounds, no title/tick collisions.

## Read in this order

| | Document | What it settles |
|---|---|---|
| 1 | [Foundations](docs/01-foundations.md) | Colour, ramps, the sans/mono split, the slide type ramp, radii |
| 2 | [Grid](docs/02-grid.md) | The 88px grid, the moving tick, column divisions |
| 3 | [Motifs](docs/03-motifs.md) | The spectrum band, the cropped mark, the tonal arc |
| 4 | [Conventions](docs/04-conventions.md) | Action titles, coral scarcity, cards, pills, bullets, footers |
| 5 | [Slides API](docs/05-slides-api.md) | Figma Slides hierarchy, sections, addressing, limits |
| 6 | [Pitfalls](docs/06-pitfalls.md) | The fourteen failure modes, with fixes |
| 7 | [Chart vocabulary](docs/07-chart-vocabulary.md) | ~40 chart and diagram recipes, all from primitives |
| 8 | [Recreating a deck](docs/08-recreating-a-deck.md) | Text dump → extract → layout → batch → validate |
| 9 | [Figma theme](docs/09-figma-theme.md) | What was actually written into the live file |
| — | [Template library](library/README.md) | Scan ~600 indexed slides, pick a type, screenshot that Figma position |
| — | [End-to-end skill](skill/SKILL.md) | Mode, lifecycle, and which subagent runs each phase |

If you only read two: **Grid** and **Pitfalls**.

## Layout

```
tokens/
  tokens.json     Source of truth. Colour, ramps, spectrum band, slide + product
                  type ramps, the 88px grid (and the legacy 128px one), radii,
                  spacing, logo ratios, status pills, chart defaults, and the
                  live Figma file's ids.
  tokens.css      Same values as CSS custom properties, named --cw-v2-color-* to
                  match the product system. GENERATED.
  gen-css.mjs     Regenerates tokens.css so the two cannot drift.
                  Run: node tokens/gen-css.mjs

lib/
  preamble.js     The helper library. Paste at the top of every use_figma script.
                  Palette, band, grid constants, primitives, text, clone-measure,
                  logo/mark, footer, head() with the auto-moving tick, pills,
                  divider(), guide(), row/section helpers, position addressing.
  validate.js     Deck validator. 'deck' mode audits the whole file; 'batch'
                  mode audits the slides you just built. Catches empty slides,
                  page-number drift, missing footers, out-of-bounds nodes,
                  overlaps, clipped text and title/tick collisions. Grid-aware
                  (g88 | g128). Effectively read-only — it clone-measures titles,
                  so it loads fonts first (see pitfall 14).
  renumber.js     Re-derives every printed page number from deck position.
                  Dry-run by default. Run after any insert, delete or reorder.
  extract.py      Slide-text extractor for a Google Slides plain-text export.

assets/
  cakewalk-wordmark-{ink,white,coral,currentcolor}.svg
  cakewalk-mark-{ink,white,coral}.svg
  contact-sheet.html   Renders every asset, the band and the type ramp.
  SOURCE.md            Provenance, the crop maths behind the mark, and why the
                       SVG's clip path must be stripped before Figma import.

library/
  catalog.json      Scannable index of the Template Book (type, section, Figma
                    position, keywords). Not a verbatim dump.
  archetypes.md     Same index grouped by slide type — read this first.
  lookup.py         python3 library/lookup.py "scorecard KPI cockpit"
  ingest.py         Rebuild the catalog from a Drive export.
  SOURCE.md         Drive id, Figma mapping, do-not-commit the raw dump.

skill/SKILL.md      Orchestrator (`/cakewalk-slides`). Claude Code entry.
cursor/cakewalk-slides/SKILL.md
                    Same skill, Cursor entry (Figma-skills warning).
.cursor/agents/     Subagents: brief, storyline, cast, build, critique,
                    export, promote. `.claude/agents/` symlinks here.
skill/references/   Brief / storyline / cast / deck-state / judgement schemas.
decks/              One folder per real meeting pack. Not the library file.

docs/               The nine documents above, plus an index.
```

## Quickstart

1. Import `assets/cakewalk-wordmark-ink.svg` and `assets/cakewalk-mark-ink.svg`
   into the Figma Slides file, name them `Cakewalk Wordmark (master)` and
   `Cakewalk Mark (master)`, move them to page level and lock them. Read
   `assets/SOURCE.md` first — the clip path has to go.
2. Paste `lib/preamble.js` at the top of a `use_figma` call, with
   `skillNames: "figma-use,figma-use-slides"`.
3. Write a slide:

```js
const [s] = newRow('Markets', 1);
s.fills = [{ type: 'SOLID', color: C.sidewalk }];

const cy = head(s, 'Markets', 'Our multi-channel approach for expanding market reach');

const card = addFrame(s, 88, cy, 1744, 480, C.white, 22, C.border, 1);
OV(card, 40, 40, 'Channel mix', C.coral, 600);
bullets(card, { tx: 'Strategic partners\nDirect\nSelf-serve platform',
                s: 21, lh: 150, ps: 14, c: C.inkEl, w: 900, x: 40, y: 96 });

src(s, 'Source: internal analysis');
footer(s, 1);
return { built: [s.id] };
```

4. Paste `lib/validate.js` (MODE `'batch'`, `POSITIONS = [1]`) and check it comes
   back `clean: true`. Run it in `'deck'` mode, with `EXPECT_TOTAL` set, before
   calling a deck finished.

## Conventions in one screen

- 1920×1080, 88px margins, content width 1744.
- Eyebrow y=88 · title y=124 · tick y=214 (+52 per extra title line) · content
  y=252 · source y=944 · footer y=986.
- **Never position content from a literal 252** — use the y that `head()` returns.
- Plus Jakarta Sans for what a reader absorbs; IBM Plex Mono for every fact they
  verify. This is the system's signature.
- The spectrum band's stop order never rotates. The 96×6 tick is its most common
  form.
- Coral marks one thing per slide.
- Append before positioning, on every node, at every nesting level.
- `text.height` on auto-height text always returns 20. Clone-measure instead.

## Maintaining this

`tokens/tokens.json` is the source of truth; run `node tokens/gen-css.mjs` after
editing it so the CSS cannot drift. If a value changes in the product system,
change it here and note it in `tokens.json`'s `source` block.

`~/cakewalk-slide-template` holds the deck-specific build scripts for the
576-slide template and consumes this language; it is not a second copy of it.
