# Motifs

Two motifs carry the brand across a deck. Both are inherited from the product
rather than invented for slides, which is why they survive next to dense content.

## The spectrum band

```
bandMint → mint → bandBlue → blue → sunny → coral → bandPurple → purple → bandMint
#4CE0C6   #92E7E5  #5594FF  #3590F3 #FFD166 #E8735A  #9966FF   #8D63E0  #4CE0C6
   0.00     0.10     0.24    0.36    0.50    0.66      0.82      0.92     1.00
```

Lifted from `.cw-v2-bundle-analysis-reveal__stage-card-accent` in the product's
`globals.css`. **The stop order is fixed — never rotate it.** Vertical variants
rotate the `gradientTransform`, not the stops:

```js
band(s, 88, 214, 96, 6);          // horizontal
band(s, 0, 0, 26, 1080, true);    // vertical — the `true` flips the transform
```

It closes on itself (the first and last stops are the same mint), so it reads as
a continuous spectrum at any length without a visible seam.

### Where it appears

| Application | Size | Used on |
|---|---|---|
| Full-bleed bottom edge | 1920×14 at y=1066 | covers, statement slides, closing |
| Vertical left edge | 26×1080 at x=0 | section dividers |
| **Header tick** | **96×6** | above/below every action title — the standard slide |
| Panel seam | 6×h vertical | between split panels, guide slides |
| Card top rule | full width × 4–8 | ink banner cards, hero stat cards |
| Timeline spine | 1744×8 | horizontal timelines |

The 96×6 tick is the one you will place most. It is the deck's heartbeat: it
appears on nearly every content slide and nowhere else does the full spectrum
show up at that scale.

## The cropped mark

The wordmark's leading glyph, set very large (300–1200px) and cropped off a slide
edge, filled in a **near-tone of its own background** — never a contrasting
colour.

| Ground | Mark fill |
|---|---|
| Ink `#1A1A2E` | Ink Elevated `#22223A` |
| Coral `#E8735A` | Coral 600 `#C5624D` |
| Sidewalk / Cream | Ghost `#E7E7E1` |
| Coral 50 | Coral 100 `#F8D5CE` |
| Blue 900 | Blue 800 `#1B487A` |

It reads as a tonal shift in the background, not a logo pasted on top. That is
precisely why it can be enormous without competing with the text.

Set `clipsContent = true` on the slide (or the containing card) so the crop is
real. The validator ignores anything named `Cakewalk Mark` when checking bounds,
because bleeding past the edge is the point.

```js
const s = ...; s.clipsContent = true;
mark(s, 1280, 300, 760, C.inkEl);   // x, y, height, fill
```

## Tonal arc

A deck should move through tone, not sit in one register:

```
ink covers and dividers
  → sidewalk and white through the body (it carries the dense data)
    → coral for the recommendation, the statement, the one number that matters
      → cream for guide slides, notices and disclaimers
        → blue900 for case-internal dividers, so nested sections read as nested
          → ink closing
```

Dark slides bookend and punctuate. The middle stays light because that is where
tables and charts live and they need the contrast.

## Coral is scarce

Coral marks **one** thing per slide: the recommended option, the next action, the
single number the audience should leave with. A slide with three coral elements
has none — the eye has nowhere to land.

When you need several accents (a six-item taxonomy, a colour-coded set of
lanes), use the ramp progression `blue300 → blue600 → blue800 → mint → sunny →
purple` and keep coral out of it entirely, or reserve coral for the one item that
is genuinely the answer.
