---
name: cakewalk-slides
description: >-
  Build, edit or redesign slides in the Cakewalk Figma Slides decks using the
  Cakewalk slide design language — 88px grid, spectrum band, sans/mono split,
  the helper preamble and the deck validator. Use whenever the task involves
  Cakewalk slides, a Figma Slides file, recreating a reference deck, or
  redesigning existing slides to the Cakewalk guidelines.
disable-model-invocation: true
---

# Cakewalk slides

The design language, the live decks' state and the build workflow live in
`~/cakewalk-slide-design-language` (private repo, `jonathanmorav/cakewalk-slide-design-language`).
Paths below are absolute because this skill is global — Cursor may be open in any project.

## Read this before Cursor-specific setup bites you

**Cursor does not load Figma's own `figma-use` / `figma-use-slides` skills.** Those ship with
the Claude Code Figma plugin and carry the Slides API rules that make the difference between a
working deck and 40 nodes at (−240, −240). In Cursor you get the MCP tools and nothing else, so
**read these two files before writing a single `use_figma` call**:

- `~/cakewalk-slide-design-language/docs/05-slides-api.md` — hierarchy, sections, addressing, limits
- `~/cakewalk-slide-design-language/docs/06-pitfalls.md` — the fifteen failure modes

Still pass `skillNames: "figma-use,figma-use-slides"` on every `use_figma` call. It is a logging
parameter, it costs nothing, and it keeps telemetry consistent with the Claude Code side.

## Orient first — two files, in this order

1. **`~/cakewalk-slide-design-language/STATE.md`** — the live `fileKey`s, slide counts, the full
   section map, which positions are template vs real content, and the open threads. Read this
   before touching anything; it is what makes resuming cheap.
2. **`~/cakewalk-slide-design-language/CLAUDE.md`** — the non-negotiables in one screen.

Then read only the doc you need, all under `~/cakewalk-slide-design-language/docs/`:

| Need | Doc |
|---|---|
| Colour, ramps, the type ramp, radii | `01-foundations.md` |
| Where things sit on the slide | `02-grid.md` |
| Spectrum band, cropped mark, tonal arc | `03-motifs.md` |
| Action titles, coral, cards, pills, bullets | `04-conventions.md` |
| Slides hierarchy, sections, addressing, limits | `05-slides-api.md` |
| Something broke | `06-pitfalls.md` |
| Which chart to reach for | `07-chart-vocabulary.md` |
| Rebuilding someone else's deck | `08-recreating-a-deck.md` |

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

- **"Add a slide"** → append a new row (`newRow`) so the page-number-equals-position
  invariant survives. Pick an archetype from `docs/07-chart-vocabulary.md`.
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

## Requires the Figma MCP server

This skill is inert without it. Cursor needs `figma` in `~/.cursor/mcp.json`:

```json
"figma": { "type": "http", "url": "https://mcp.figma.com/mcp" }
```

Restart Cursor after adding it, and confirm the `use_figma` tool is available before promising
any Figma work. If it is missing, say so rather than writing build scripts that cannot run.
