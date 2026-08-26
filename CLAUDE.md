# Working in this repo

This is the Cakewalk slide design language. Read [STATE.md](STATE.md) first — it has the
live file key, the section map and the open threads. The full specification is in
[docs/](docs/); do not restate it here, point at it.

## Before writing any slide code

1. Paste **`lib/preamble.js`** at the top of the `use_figma` call. Every helper in it
   appends before positioning, which is what avoids the Slides `(−240, −240)` bug.
2. Pass `skillNames: "figma-use,figma-use-slides"`.
3. Use the `fileKey` from [STATE.md](STATE.md).

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
the densest slide in the batch.

If you inserted or reordered slides, run `lib/renumber.js` (dry-run first). The deck's
invariant is **printed page number === deck position**.

## Content rules

- **Placeholder copy in positions 1–576 is deliberate and verbatim.** `[Insert segment]` is
  an instruction to the next author. Never fill it in, paraphrase it, or tidy the brackets.
- When recreating a reference deck: **same words, Cakewalk layout.** Both constraints hold
  at once — keep the copy exactly, change only the visual language.
- A plain-text export flattens z-order, so on dense slides you will have to infer groupings.
  Make the call explicitly and **say which calls you made** when handing the work over.

## Keeping this repo honest

- `tokens/tokens.json` is the source of truth. Run `node tokens/gen-css.mjs` after editing
  it so the CSS cannot drift.
- Update [STATE.md](STATE.md) whenever the deck's shape changes. A stale section map is
  worse than none.
- `~/cakewalk-slide-template` consumes this language and holds the deck-specific build
  scripts. When the two disagree, this repo wins — sync, do not fork.
