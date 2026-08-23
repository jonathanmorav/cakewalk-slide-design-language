# Grid

## The production grid — 88px margins

```
1920 × 1080
├── 88px left margin ──────────────────────────────── 88px right margin
├── content width 1744, right edge 1832
├── y=88    eyebrow / section label  (mono, uppercase, coral)
├── y=124   action title             (Bold 48, box width 1744)
├── y=214   spectrum tick 96×6       ← one-line title
│   y=266   spectrum tick 96×6       ← two-line title  (+52 per extra line)
├── y=252   content begins           ← one-line title
│   y=304   content begins           ← two-line title  (tick + 38)
├── y=944   source / footnote line   (mono Regular 14, +6 tracking, Text Light)
├── y=986   footer wordmark, 24px tall, x=88
└── y=990   page number, mono Medium 15, +8 tracking, right-aligned in a
            120px box at x=1712 (so its right edge lands on 1832)
```

88px rather than the 128px this system started with. At presentation scale the
optical margin still reads generous, and the 40px recovered on each side is what
makes a nine-column table or an eighteen-week Gantt fit without shrinking type
below the legibility floor. Every layout in the 576-slide template uses it.

### The tick moves; content follows

The 96×6 spectrum tick sits between the title and the content. A title that
wraps to a second line will land on top of it unless the tick moves down.

Do not eyeball this. `head()` in `lib/preamble.js` measures the title by cloning
it, derives the line count, drops the tick by 52px per extra line, and returns
the y at which content should start:

```js
const cy = head(s, 'Markets', 'Our multi-channel approach for expanding market reach');
// cy === 252 for a one-line title, 304 for two
addFrame(s, 88, cy, 1744, 560, C.white, 22, C.border, 1);
```

Always position content from the returned value, never from a literal 252.
This single change removed the most frequently recurring defect in the build.

## Column divisions

Widths and origins that actually recur. Pitch = width + gutter.

| Division | Width | x-origins | Pitch |
|---|---:|---|---:|
| Halves | 860 | 88, 972 | — (24 gutter) |
| Thirds | 562 | 88, 679, 1270 | 591 |
| Quarters | 418 | 88 + i·442 | 442 |
| Fifths | 332 | 88 + i·353 | 353 |
| Sixths | 280 | 88 + i·292 | 292 |
| Sevenths | 238 | 88 + i·250 | 250 |

Two asymmetric splits carry most of the dense slides:

- **Label + content** — row-label column 240 wide at x=88, content from x=336.
  Used by every matrix and comparison table.
- **Chart + comments rail** — chart panel 1230 at x=88, commentary rail 484 at
  x=1348. The consulting "chart with a takeaway column" layout.

## Vertical rhythm inside a card

A content card at radius 20–22 with a 1px `#D5D5CA` border:

```
├── 8px    top accent bar (full card width) if the card is colour-coded
├── y=40   overline
├── y=?    title
├── divider 1px, full inner width
└── body
```

Inner padding is 40px on cards ≥560 wide, 32px on 418–562, 28px on 332, and
16–24px on chips. Do not go below 14px — text starts to touch the border.

## The legacy 128px grid

The first 71-slide deck used 128px margins, overline at y=104, title at y=144,
content from y=300, footer baseline y=962, and zero-padded two-digit page
numbers. It is kept in `tokens/tokens.json` as `slideGridLegacy128` so those
older build scripts stay readable. Do not start anything new on it.
