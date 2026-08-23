# Chart vocabulary

Every chart and diagram in the 576-slide template is drawn from primitives —
rectangles, ellipses, vector paths and text. No images, no chart library. That is
what makes them restyleable: change a token and the whole deck follows.

Defaults are in `tokens/tokens.json` under `chartDefaults`. Panel is white,
radius 20, 1px `#D5D5CA` border. Axis `#A0A0B0` at 1.5px, gridlines `#E7E7E1`
at 1px, bar radius 6.

## Layout conventions shared by all of them

- **Chart + rail** — chart panel 1230 at x=88, commentary rail 484 at x=1348.
  The rail gets an `OV('Comments')`, a divider and bullets.
- **Axis label** — `[Data], [Unit]` in mono SemiBold 14, `blue800`, at the
  panel's top-left inset (40, 36).
- **Baseline** — a 1.5px `divider` rect, not a vector, so it snaps crisply.
- **Gridlines** — draw before the bars so bars sit on top.
- **Forecast** — solid `blue600` for actuals, white fill with a dashed `coral`
  stroke for forecast, over a `coral50` shaded region, with a `Forecasted data`
  mono label above it.

---

## Bars and columns

**Column chart** — uniform `blue600`, last column `coral` if it is the point.
Gridlines at four levels, `xx` mono labels below the baseline.

**Column chart with trend line** — same, plus a dashed `coral` polyline across
the column tops. Do not add a legend; the line is self-evident.

**Actuals vs forecast** — first *n* solid, remainder `addORect` with
`dashPattern: [6,5]`, `coral50` region behind. CAGR in a pill anchored at the
right end of the trend line, not floating in the middle.

**Phased growth with brackets** — a `bracket()` above each phase:
`M x1 y+8 L x1 y L x2 y L x2 y+8` plus a pill centred on the span. Colour the
pill by direction: `green` for growth, `coral` for decline, `muted` for flat.

**YoY row** — a row of mono percentages under the baseline, each centred on its
column, with a right-aligned mono row label to the left of the plot. Shift the
plot right (x₀ ≈ 340) so the row label has somewhere to live.

**Two-series stacked columns** — `blue600` bottom, `mint` top, plus two growth
rows below, each with a 14×14 colour swatch before its right-aligned label so the
rows map to the bands without a legend.

**100% stacked share** — bands sum to 360px of height; y-axis ticks
100/75/50/25/0%. Label only the band that matters (`xx%` centred in it, white).

**Horizontal bar / gauge** — track in `blue50` at radius = h/2, fill in the
accent, value in `ExtraBold` to the right. Used for capture rates and shares.

**Price ladder** — ascending columns with the value in `ExtraBold 44` above each
and a dashed `coral` reference line across the top for MSRP.

**Waterfall** — a base bar, floating increment bars positioned by running
cumulative, then a total bar in `coral`. Dashed connectors between increment
tops. Where increments are tiny relative to the total, use an evenly-stepped
staircase instead and say it is illustrative — a 2-user bar next to a 5000-user
bar is invisible.

**Histogram with a shaded region** — bars plus a `coral50` rect behind the
buckets you are calling out, and the callout sentence beside it.

---

## Lines and areas

**Line chart** — 3–3.5px stroke, `strokeCap: 'ROUND'`, white-filled circles with
a coloured 3px stroke at each vertex.

**Sentiment / emotion curve** — one wide cell spanning all columns with faint
column separators inside it, a polyline through per-stage values, and a
white-filled dot at each. Do not split it into per-column cells; the continuity
is the message.

**Product life cycle** — a 6-point S-curve across five labelled stage bands, a
dashed `coral` chasm marker, `Early market` / `Mainstream market` brackets
underneath, and a `coral50` shade over whichever band the argument is about.

---

## Matrices

**2×2 bubble matrix** — dividers at the midpoints, quadrant labels at the four
corners in mono, bubbles as ellipses with a tinted fill and a coloured stroke.
The subject bubble is `coral100`/`coral` at 2.5px. Size legend in mono, bottom
right.

**3×3 prioritisation matrix** — nine cells, each a tinted card; three-step tone
per priority level. Axis titles in mono `blue800`, tick labels in mono `muted`.
Legend as three swatch + label rows.

**Attractiveness heat matrix** — row per option, column per criterion, each cell
filled from a single five-step ramp. Overall column as a 5-dot rating rather than
another tone, so it reads as a summary and not a sixth criterion. Gradient legend
bar with Low/High.

**Merged-region matrix** — where the source has fewer labels than cells, draw
merged rectangles that span the region rather than repeating the label. Four
regions covering a 3×3 grid reads correctly; nine cells with three repeated
labels does not.

**Nested TAM/SAM/SOM circles** — three concentric-ish ellipses offset downward so
the labels stack, largest first, `blue50`/`blue100`/`coral100`. Description cards
to the right with a colour rail matching each ring — no leader lines, which
inevitably cross the rings.

**Funnel bars** — descending widths with the label right-aligned in a fixed
column and the value immediately after the bar end. Scale widths to the real
values so the taper is honest.

---

## Time and process

**Gantt** — label column 340 at x=88, week columns 72 wide at 76 pitch from
x=436. Header row of week numbers, a date row beneath, then one row per
workstream with a rounded bar and a rotated-square `diamond()` at the deliverable.

**Stage-gate timeline** — same grid plus diamonds on a marker row above the bars,
each with a small mono label underneath.

**Phase-grouped plan** — an ink phase-header row spanning the full width, then its
workstream rows, repeated per phase.

**Swimlane** — lane label column, then bars spanning stage columns:
`x = x₀ + start·pitch`, `w = (end−start)·pitch + colWidth`. Colour per lane.

**Horizontal timeline with alternating cards** — spectrum band spine, pills
straddling it, cards alternating above and below with a short connector. Handles
seven events without crowding.

**Staircase** — ascending bars sharing a baseline, count above, description below.
For "land and expand" narratives.

**Chevron process** — stage cards with `chev()` between them. Two rows beneath
(activities, enablers) turn it into a full process map.

---

## Structures

**Hub and spoke** — central ink bar full width, three cards above and three
below with 2px connector stubs. Grid-aligned and far more legible than a radial
arrangement.

**Flywheel** — an outlined circle, an ink disc at its centre, three stage cards
at 12/4/8 o'clock, and three dashed bézier arcs between them.

**Org chart** — a horizontal rule with vertical stubs down to role cards. Ops
roles in `blue50` with a `blue300` border, core roles in white, and a two-swatch
legend.

**Decision flow** — boxes plus pills for decision nodes, `Yes`/`No` in small mono
beside the connectors. Keep it to four tiers; deeper than that and a table is
clearer.

**Value proposition canvas** — two panels, square-badged Product and
circle-badged Customer, with the three pairs colour-matched across the gap
(gains green, pains coral, jobs/products blue). The geometric version — a real
square divided in three and a circle with two chords — also works, with
descriptions inside the regions at 13–14px.

**Sentence builder** — connector words right-aligned in a 280px column, fill-in
cards to the right with a 6px role-coloured left rail. For Mad-Libs style value
propositions.

**Pyramid / tier bands** — label cells of increasing width, right edges aligned,
content cards to the right at constant width.

---

## Tables

**Two-level header** — group cells spanning their sub-columns at 48px, sub-header
cells at 60px, merged single-column headers spanning the full 112px. Compute
group width as `nCols·colW + (nCols−1)·gap`.

**Dense benchmark table** — 8+ columns at 176 wide, 4px gutters, 38–42px rows.
Filled dot / hollow dot for present-absent. Highlight the "us" column with a
`coral50` fill and a `coral300` border down its whole length.

**Status table** — pills from the deck-wide vocabulary: `green` done, `blue600`
on-track, `sunny` challenged/paused, `dim` not started, `coral` delayed. Same
five colours everywhere so status reads without a legend.

**Checklist** — a 16×16 white frame with a `blue300` 1.5px border as the checkbox,
label at 12px, 44px row pitch.

**Region grid as a map substitute** — when you cannot draw a map, an 8×6 grid of
state abbreviations tinted by a five-step ramp, with a swatch legend, carries the
same information and stays on-brand. Same for a city list: chips with a coral dot
and the city name.
