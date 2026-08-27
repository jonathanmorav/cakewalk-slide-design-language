# Recreating a reference deck

The workflow used to rebuild two Slideworks consulting templates — a 270-slide
Business Case and a 306-slide GTM strategy — in the Cakewalk language.

The brief that made it work: **keep the content verbatim, change only the visual
language.** Placeholders, instructions and real-world citations stay exactly as
written. That constraint is what makes the output usable as a template rather
than an inspired-by deck.

For a **new** Cakewalk-authored pack (board, weekly, anything from notes), do
not start here. Use the `/cakewalk-slides` lifecycle: brief → storyline → cast
→ build in a **new** Figma file. This document is the *recreate someone else's
deck* path.

## 1. Get the text out

Open the source in Google Slides → **File ▸ Download ▸ Plain text**. Then:

```bash
python3 lib/extract.py dump.txt --count     # confirm the slide count
python3 lib/extract.py dump.txt 45 56       # read a range
```

Read 8–11 slides at a time. Any more and you lose the thread; any fewer and you
spend the session re-reading.

## 2. Establish the position mapping first

Decide once where source slide 1 lands in the deck, and make it arithmetic:

```js
const P = n => 270 + n;   // source slide n → deck position, and printed number
```

If you are inserting into an existing deck, insert the front matter first and run
`lib/renumber.js`, so `position === source number` holds from then on. Doing this
up front removed drift risk from every subsequent batch on a 576-slide file.

## 3. Detect repeats before building

Consulting templates repeat slides with only a title change. A quick comparator
over the extracted spans found four pairs in one deck and several in the other.
Clone them:

```js
for (const ch of src.children) { const c = ch.clone(); tgt.appendChild(c); c.x = ch.x; c.y = ch.y; }
```

Then retitle and repage. Cheaper than rebuilding, and guarantees consistency.

Whole sections repeat too — one deck's appendix was an exact structural match for
the other's, so eight slides were cloned wholesale and the cover adapted.

## 4. Design the layout per slide, then batch

For each slide, pick the archetype before writing code. Scan the library first
so you reuse a type that already exists:

```bash
python3 library/lookup.py "options analysis 2x2"
```

Screenshot the top match's `figma_position`. [07-chart-vocabulary](07-chart-vocabulary.md)
is the construction menu; [library/README.md](../library/README.md) is the
picker. Then build **4–6 slides per `use_figma` call** with the preamble pasted
at the top.

Group structurally similar slides into one batch. A batch that builds five
variants of the same table is fast to write and fast to fix.

## 5. Validate every batch, screenshot the ambiguous ones

Run `lib/validate.js` in batch mode after each call. It catches out-of-bounds
nodes, overlaps, clipped text and title/tick collisions in ~3s. Screenshot one or
two slides per batch — the densest one and anything the validator flagged.

Then run it in `deck` mode before calling the deck finished.

## 6. Where the text dump loses information

A plain-text export flattens z-order into reading order, so on complex slides
labels and values arrive interleaved. You will have to infer groupings. Three
real cases:

- A seven-metric cockpit table with values for only two rows.
- Fifteen pain points across three customer groups — row-major or column-major is
  unrecoverable.
- Six process stages where only four carried a trailing `…`.

Keep the wording verbatim, make the grouping call explicitly, and **say which
calls you made** when you hand the deck over. Silent normalisation is the one
failure mode the reader cannot check.

## 7. What "1:1" means here

Not a pixel copy. The archetype, the content and the instructional intent carry
over; the grid, type, colour, motifs and chart construction are Cakewalk's. A
Slideworks 2×2 becomes a Cakewalk 2×2 — same axes, same quadrant labels, same
placeholder text, entirely different object.
