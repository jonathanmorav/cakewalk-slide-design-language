---
name: cakewalk-slides
description: >-
  End-to-end Cakewalk slides: read the design language, pick a template from
  the library, fill a meeting deck from Gmail / Pocket / Zoom / Drive context,
  build in Figma Slides, export as an editable PowerPoint to
  ~/Cakewalk/slides/. Use whenever the task involves Cakewalk slides, a
  Figma Slides file, a board or weekly deck, recreating a reference, or
  redesigning slides to the guidelines.
---

# Cakewalk slides

The design language and the live library live in this repo
(`jonathanmorav/cakewalk-slide-design-language`). This skill is the
orchestrator. Phase work is delegated to project subagents.

## Declare a mode before anything else

| Mode | Job | Content | File |
|---|---|---|---|
| `template` | Grow or restyle the library | Placeholders stay verbatim (`[Insert segment]`) | `UtxFDFaTR9GDTRcqIOKlOy` |
| `deck` | Ship a meeting | Real claims, sourced numerals | A **new** Figma file, state under `decks/<slug>/` |

These rules are opposites. If the user did not say which, infer from the ask
(template / restyle / "add to the library" → `template`; board, weekly,
"from our notes", "build me the pack" → `deck`) and **say the mode out loud**.

Never fill the library file from Gmail, Pocket, or Zoom. Never append a board
pack to the 593-slide template file.

## Lifecycle

```
sources → brief → storyline → cast → build → critique → export
              │         │         │
              │         │         └ What / Why / How, then lookup
              │         └ pyramid + action titles + title-only test
              └ one question, spine, six audience answers
                                              ↘ promote (optional)
```

The method behind those gates is [`docs/10-slide-method.md`](../docs/10-slide-method.md).
Read it at the start of every `deck` run. Framing questions:
[`skill/references/framing-questions.md`](references/framing-questions.md).

`template` mode skips brief/storyline content and export unless asked; it still
**casts** then **builds**. `deck` mode runs the whole line. A storyline that
fails the title-only test does not proceed to cast.

## Delegation — use these subagents

They are registered from `.cursor/agents/` (and `.claude/agents/`, same files).
Pass a self-contained prompt; they do not see this conversation.

| Phase | Subagent | Isolated? |
|---|---|---|
| Context → brief | `cakewalk-brief` | yes, readonly |
| Brief → claims | `cakewalk-storyline` | yes, readonly |
| Claims → library rows | `cakewalk-cast` | yes, readonly |
| Draw in Figma | `cakewalk-build` | yes |
| Validate + judgement | `cakewalk-critique` | yes, readonly |
| Figma → PowerPoint | `cakewalk-export` | yes |
| Meeting slide → library | `cakewalk-promote` | yes |

If the Task/Agent tool does not list a name, **run that agent file in-process**.
Do not invent a `subagent_type`. Do not launch a subagent from a subagent
(one level of nesting only).

Schemas the parent writes to disk:

| Artifact | Schema | Path |
|---|---|---|
| Brief | `skill/references/brief-schema.md` | `decks/<slug>/BRIEF.md` |
| Storyline | `skill/references/storyline-schema.md` | `decks/<slug>/STORYLINE.md` |
| Cast | `skill/references/cast-schema.md` | `decks/<slug>/CAST.md` |
| Deck state | `skill/references/deck-state.md` | `decks/<slug>/STATE.md` |
| Judgement | `skill/references/judgement-log.md` | `decks/<slug>/JUDGEMENT.md` |
| Method | `docs/10-slide-method.md` | (read, do not copy) |
| Framing | `skill/references/framing-questions.md` | (read per section) |

## Orient (every run)

1. **`STATE.md`** — library `fileKey`, section map, what is template vs
   operating content, open threads.
2. **`CLAUDE.md`** — non-negotiables.
3. In `deck` mode, **`decks/<slug>/STATE.md`** once it exists.

Then only the doc you need:

| Need | Doc |
|---|---|
| Colour, type, radii | `docs/01-foundations.md` |
| Grid, moving tick | `docs/02-grid.md` |
| Spectrum, mark, tonal arc | `docs/03-motifs.md` |
| Titles, coral, cards, pills | `docs/04-conventions.md` |
| Slides API | `docs/05-slides-api.md` |
| Something broke | `docs/06-pitfalls.md` |
| Chart recipes | `docs/07-chart-vocabulary.md` |
| Recreate a reference | `docs/08-recreating-a-deck.md` |
| Theme a new file | `docs/09-figma-theme.md` |
| How a deck thinks | `docs/10-slide-method.md` |
| Editable PowerPoint | `docs/11-export.md` |
| Scan the library | `library/README.md` |

## Review gates

| Bucket | Examples | Who |
|---|---|---|
| **Auto** | Chrome, grid, restyle, placeholder templates, validate-clean | agent |
| **Propose** | Storyline, action titles, inferred groupings, which template was cast | show Jonathan, then build |
| **Stop** | A new number, org/ownership, anything that will be in the room on a date | wait |

`cakewalk-critique` writes the judgement log. Silent normalisation is a bug.

## Common asks

- **"Build me the board / weekly pack from our notes"** → mode `deck`.
  `cakewalk-brief` → `storyline` → `cast` → `build` (new file) → `critique` →
  `export` if `export_to` is set.
- **"Add a slide"** → cast, then build. `template`: append a row on the library
  file, placeholders verbatim. `deck`: meeting file, sourced content.
- **"Which template should this be?"** → `cakewalk-cast` only.
- **"Redesign these to the guidelines"** → screenshot, diagnose against
  `docs/04` / `docs/01`, keep every word, `cakewalk-build`.
- **"Recreate this deck"** → `docs/08-recreating-a-deck.md`, then `cakewalk-build`.
- **"Export" / "save as PowerPoint" / "put this on my computer"** →
  `cakewalk-critique` then `cakewalk-export`. Editable `.pptx` only, to
  `~/Cakewalk/slides/`. No PNG, no SVG, no picture-pptx.
  [docs/11-export.md](../docs/11-export.md).
- **"Put this in Google"** → same export first (editable pptx on disk).
  Google is a later optional open of that file, not PNG-and-place.
- **"Keep this as a template"** → `cakewalk-promote`.
- **"Change a brand value"** → `tokens/tokens.json`, then `node tokens/gen-css.mjs`.

## Build loop (if you are in-process)

```
paste lib/preamble.js  +  slide code      → use_figma, 4–6 slides,
                                            skillNames "figma-use,figma-use-slides"
paste lib/validate.js  MODE='batch'
screenshot the densest slide + flags
paste lib/validate.js  MODE='deck'
lib/renumber.js (dry-run)                 → only after insert/reorder
update the right STATE.md
```

Four rules that get broken: append before positioning; content y from `head()`;
sans for prose / mono for facts; coral marks one thing.

## Library mapping in one line

`printed` on a Business Case or GTM catalog row **is** the Figma position.
Strategy 2026 extras reuse printed 4–47 — those are not Figma 4–47.
`python3 library/lookup.py "<ask>"`.

## Deck-specific scripts

`~/cakewalk-slide-template` holds per-slide scripts and `dryrun.mjs`. It
carries two grids: `_preamble.js` is legacy 128px; `_preamble-88.js` is current.
Never edit the legacy preamble to the current grid.
