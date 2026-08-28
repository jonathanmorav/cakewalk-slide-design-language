# Conventions

The rules that hold across every slide. Most are one line; all of them are things
a reviewer will notice if you break them.

## Titles

- **One action title per slide, stating the takeaway.** If the title only names a
  topic ("Market sizing"), the slide is not finished. "Our SOM of $56M represents
  significant room to grow" is a title.
- A reader should be able to read only the titles, top to bottom, and get the
  whole argument. If they cannot, the storyline is wrong — not the formatting.
  That test, the pyramid, and the What / Why / How section gate are
  [10-slide-method](10-slide-method.md).
- **One message per slide.** If you cannot state the slide in a two-line title,
  split it.
- Titles are Bold 48 in a 1744-wide box. Two lines is normal and fine; the tick
  moves down to accommodate it. Three lines means the title is doing the body's
  job.

## Colour discipline

- **Coral is scarce.** One coral moment per slide — the recommendation, the next
  action, the one number. Three coral elements means none.
- Tinted cards use the paired fill/border/text triples in
  [01-foundations](01-foundations.md). Never a tint with an unrelated text colour.
- Heat scales use one ramp, five steps. Mixing hues destroys the ordering.
- On ink grounds, body text is `white`, secondary is `light` `#9292A3`, and the
  accent is `mint` or `coral` — not `blue`, which vibrates against ink.

## Cards, not boxes

- Radius 20–22 for content cards, 26 for callouts, 18 for tiles, 8–14 for table
  cells, 6–10 for chips, `h/2` for pills.
- One border: 1px `#D5D5CA`. The surface change does the work; a heavy outline
  makes a deck look like a wireframe.
- Colour-coded cards get an 8px top accent bar (or a 5–6px left rail in a row
  layout), with `clipsContent = true` so the bar's corners are clipped by the
  card radius.

## Type in practice

- Every fact in mono. Every argument in sans. See
  [01-foundations](01-foundations.md) — this is the single most recognisable thing
  about the system.
- Source lines: mono Regular 14, +6 tracking, `light`, at y=944. A second source
  or footnote goes at x=420 on the same line, or y=918 if both are long.
- Placeholder text stays verbatim, brackets included — `[Insert segment]`, not
  "Insert segment". A template's placeholders are instructions to the next
  author; paraphrasing them destroys that.

## Bullets

One text node with `setRangeListOptions`, never an ellipse plus a text node per
row. The latter loses the hanging indent the moment a line wraps:

```js
bullets(card, { tx: 'First\nSecond\nThird', s: 18, lh: 150, ps: 12, c: C.inkEl, w: 480, x: 40, y: 96 });
```

`ps` (paragraphSpacing) is what separates items — do not fake it with blank lines.

## Status pills

One vocabulary deck-wide, so status reads without a legend:

| State | Fill | Text |
|---|---|---|
| Done / positive | `green` `#4CAF82` | white |
| On track | `blue600` `#2D7ACF` | white |
| Challenged / paused | `sunny` `#FFD166` | `ink` |
| Not started | `dim` `#B4B4C2` | white |
| Delayed | `coral` `#E8735A` | white |

Tinted variants for table cells: `green100`/`green`, `coral100`/`coral600`,
`sunny100`/`caption`, `sidewalk`/`muted`.

## Footer

- Wordmark 24px tall at (88, 986) — `ink` on light grounds, `white` on dark.
- Page number in mono Medium 15, +8 tracking, right-aligned in a 120px box at
  x=1712 so its right edge lands on 1832. `caption` on light, `light` on dark.
- Covers, dividers and closing slides carry the wordmark; whether they carry a
  number is a per-deck decision, but be consistent and let `renumber.js` report
  the ones that do not.

## Placeholders

Dashed 1.5px `dim` border, radius 14, white fill, `dashPattern [10, 8]`, with a
mono SemiBold 13 `light` label centred. Use for "drop a screenshot here", logo
slots and deliberately empty template regions. An empty dashed box is a clearer
instruction than a grey rectangle.

## What not to do

- Do not centre body text. Left-align everything except numbers in table cells,
  pill labels and axis ticks.
- Do not use drop shadows. The system has none.
- Do not rotate text. For a vertical axis, use a horizontal label with an arrow,
  or a gradient bar with the label above it.
- Do not add a legend when the chart is self-labelling. Label the one band that
  matters instead.
- Do not let a table row exceed 8 columns of prose. Past that, switch to dots,
  tones or pills.
