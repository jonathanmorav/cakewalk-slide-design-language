# Working in this repo

This is the Cakewalk slide design language. Read [STATE.md](STATE.md) first — it has the
live file key, the section map and the open threads. The full specification is in
[docs/](docs/); do not restate it here, point at it.

The end-to-end loop (brief → storyline → cast → build → critique → export) lives in
[`/cakewalk-slides`](skill/SKILL.md). Phase work is delegated to the subagents in
[`.cursor/agents/`](.cursor/agents/).

## Mode

Declare `template` or `deck` before touching Figma.

| Mode | File | Content |
|---|---|---|
| `template` | Library `UtxFDFaTR9GDTRcqIOKlOy` | Placeholders stay verbatim |
| `deck` | A **new** Figma file; state under `decks/<slug>/` | Sourced claims only |

Do not fill the library from Gmail / Pocket / Zoom. Do not append a meeting pack to
the 593-slide template file.

## Before writing any slide code

1. Cast from the library — `python3 library/lookup.py "<ask>"`, or delegate to
   `cakewalk-cast`. Screenshot the `figma_position`. [library/README.md](library/README.md).
2. Paste **`lib/preamble.js`** at the top of the `use_figma` call. Every helper in it
   appends before positioning, which is what avoids the Slides `(−240, −240)` bug.
3. Pass `skillNames: "figma-use,figma-use-slides"`.
4. Use the `fileKey` from [STATE.md](STATE.md) in `template` mode, or from
   `decks/<slug>/STATE.md` in `deck` mode.

## Non-negotiables

These are the ones that get broken most. Full list: [docs/06-pitfalls.md](docs/06-pitfalls.md).

- **Append before positioning**, every node, every nesting level. Never add 240 back.
- **Position content from the y that `head()` returns**, never from a literal `252`. It
  clone-measures the title and drops the spectrum tick when it wraps.
- **`text.height` on auto-height text always returns 20.** Clone-measure instead (`mw()`).
- **Sans for what a reader absorbs, mono for what they verify.** Prose in IBM Plex Mono is
  the single most common way a slide stops looking like Cakewalk's.
- **Coral marks one thing per slide.** For a peer set use `coral / blue600 / mint`.
- **Filter nodes by name, not position alone.** `x === 88` also matches the footer wordmark.
- **Failed scripts are atomic** — read the error, fix the one line, re-run the batch. Do not
  bisect into smaller calls.
- **Batch 4–6 slides per call.** The rate-limit cap follows the file's team, not the seat.
- Style names have no spaces: `ExtraBold`, `SemiBold`.
- No `toLocaleString` — it returns unformatted digits in the plugin sandbox. Group by hand.

## After writing any slide code

Run `lib/validate.js` — `MODE='batch'` with the positions you touched, then `MODE='deck'`
before calling anything finished. It is ~3s and free. Screenshot only what it flags, plus
the densest slide in the batch. Then `cakewalk-critique` for the judgement log.

If you inserted or reordered slides, run `lib/renumber.js` (dry-run first). The deck's
invariant is **printed page number === deck position**.

## Content rules

- **`template` mode:** placeholder copy is deliberate and verbatim. `[Insert segment]` is
  an instruction to the next author. Never fill it in, paraphrase it, or tidy the brackets.
- **`deck` mode:** every numeral has a brief source. Inferences are labeled. Disputes are
  not averaged. See [skill/references/brief-schema.md](skill/references/brief-schema.md).
- When recreating a reference deck: **same words, Cakewalk layout.** Both constraints hold
  at once — keep the copy exactly, change only the visual language.
- A plain-text export flattens z-order, so on dense slides you will have to infer groupings.
  Make the call explicitly and **say which calls you made** when handing the work over
  ([skill/references/judgement-log.md](skill/references/judgement-log.md)).

## Keeping this repo honest

- `tokens/tokens.json` is the source of truth. Run `node tokens/gen-css.mjs` after editing
  it so the CSS cannot drift.
- Update [STATE.md](STATE.md) whenever the **library** file's shape changes. Meeting packs
  update `decks/<slug>/STATE.md` only.
- `~/cakewalk-slide-template` consumes this language and holds the deck-specific build
  scripts. When the two disagree, this repo wins — sync, do not fork.

## Two editor entry points, one source

| Editor | File in this repo | Also loaded from |
|---|---|---|
| Claude Code | `skill/SKILL.md` | `.claude/skills/cakewalk-slides` → that folder; `~/.claude/skills/cakewalk-slides` |
| Cursor | `cursor/cakewalk-slides/SKILL.md` | `.cursor/skills/cakewalk-slides` → that folder; `~/.cursor/skills/cakewalk-slides` |

Both are `/cakewalk-slides`. Edit them together — if one drifts, the two editors give different
answers about the same deck. The Cursor copy carries one extra warning the Claude Code copy does
not need: Cursor does **not** load Figma's own `figma-use` / `figma-use-slides` skills, so the
Slides API rules have to come from `docs/05-slides-api.md` and `docs/06-pitfalls.md`.

Subagents are one file each: [`.cursor/agents/*.md`](.cursor/agents/).
[`.claude/agents/`](.claude/agents/) is a symlink to those files. Edit the `.cursor` copy.

Never put anything in `~/.cursor/skills-cursor/` — that directory is Cursor's own built-ins.
