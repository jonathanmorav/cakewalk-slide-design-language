---
name: cakewalk-slides
description: Build, edit or redesign slides in the Cakewalk Figma Slides deck using the Cakewalk slide design language — 88px grid, spectrum band, sans/mono split, the helper preamble, and the deck validator. Use whenever the task involves Cakewalk slides, a Figma Slides file, recreating a reference deck, or redesigning existing slides to the Cakewalk guidelines.
---

# Cakewalk slides

The design language, the live deck's state, and the build workflow live in
`~/cakewalk-slide-design-language` (private repo, `jonathanmorav/cakewalk-slide-design-language`).

## Orient first — two files, in this order

1. **`STATE.md`** — the live `fileKey`, slide count, the full section map, which positions
   are template vs real content, and the open threads. Read this before touching anything;
   it is what makes resuming cheap.
2. **`CLAUDE.md`** — the non-negotiables in one screen.

Then read only the doc you need:

| Need | Doc |
|---|---|
| Colour, ramps, the type ramp, radii | `docs/01-foundations.md` |
| Where things sit on the slide | `docs/02-grid.md` |
| Spectrum band, cropped mark, tonal arc | `docs/03-motifs.md` |
| Action titles, coral, cards, pills, bullets | `docs/04-conventions.md` |
| Slides hierarchy, sections, addressing, limits | `docs/05-slides-api.md` |
| Something broke | `docs/06-pitfalls.md` |
| Which chart to reach for | `docs/07-chart-vocabulary.md` |
| Rebuilding someone else's deck | `docs/08-recreating-a-deck.md` |
| Pick a template from the library | `library/README.md` |

## Pick a template before drawing

The Figma file already holds ~576 template slides. Scan the index, then
screenshot the match — do not invent a layout when one exists.

```
python3 library/lookup.py "<the ask>"
python3 library/lookup.py --archetype scorecard
```

Read `library/archetypes.md` if you already know the type. Use the top match's
`figma_position` as the visual reference. Build in Cakewalk language; keep the
instructional intent; do not copy Slideworks chrome. Full rules:
`library/README.md`.

## Build loop

```
paste lib/preamble.js  +  slide code      → use_figma, 4-6 slides per call,
                                            skillNames "figma-use,figma-use-slides"
paste lib/validate.js  MODE='batch'       → catches bounds, overlap, clipping, title/tick
screenshot the densest slide + anything flagged
… repeat …
paste lib/validate.js  MODE='deck'        → before calling it finished
lib/renumber.js (dry-run first)           → only if you inserted or reordered
update STATE.md                           → if the deck's shape changed
```

`lib/preamble.js` gives you `head()` (returns the content y after measuring the title),
`newRow()`, `divider()`, `guide()`, `footer()`, `mw()` clone-measure, the `C` palette, the
`BAND` stops and the `G` grid constants. Do not hand-roll these — the helpers encode the
append-before-position rule.

## The four rules most often broken

- **Append before positioning.** Every node, every level. Never compensate with +240.
- **Content y comes from `head()`**, never a literal `252` — the tick moves when a title wraps.
- **Sans for prose, mono for facts.** Prose in mono is the fastest way to stop looking like Cakewalk.
- **Coral marks one thing per slide.** Peer sets use `coral / blue600 / mint`.

## Common asks, and where to start

- **"Add a slide"** → `python3 library/lookup.py "<ask>"`, screenshot the
  `figma_position`, then append a new row (`newRow`) so the
  page-number-equals-position invariant survives. `docs/07-chart-vocabulary.md`
  is the construction menu for whatever type you picked.
- **"Redesign these slides to the guidelines"** → screenshot them first, then diagnose
  against `docs/04-conventions.md` and `docs/01-foundations.md`. The usual findings are
  prose set in mono, cards not sized to their content, peer elements at unequal scale, and
  off-token type sizes. Keep every word; change structure and type only.
- **"Recreate this deck"** → `docs/08-recreating-a-deck.md`. Export to plain text, read it
  with `lib/extract.py`, fix the position mapping before building anything.
- **"Change a brand value"** → edit `tokens/tokens.json`, then `node tokens/gen-css.mjs`.

## Deck-specific build scripts

`~/cakewalk-slide-template` holds the reproducible per-slide scripts for the template, plus
an offline harness (`node dryrun.mjs batches/batch-*.js`) that validates colours,
coordinates, fonts and node ids without spending a Figma call. It carries **two grids** —
`_preamble.js` is the legacy 128px one bound to `build.sh`; `_preamble-88.js` is the current
one. Never edit the legacy preamble to the current grid.
