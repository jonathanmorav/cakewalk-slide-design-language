# Foundations — colour and type

Colour, radius and spacing are lifted verbatim from `cakewalk-design`
(`DESIGN.md` and `packages/ui/src/v2/styles/globals.css`). The type ramp is not:
the product ramp is UI-scale (32px display) and had to be rebuilt for a
1920×1080 canvas. Both live in `tokens/tokens.json` — `slideType` for slides,
`productType` kept alongside it purely for reference.

## Core colour

| Role | Token | Hex |
|---|---|---|
| Ink (dark ground) | `ink` | `#1A1A2E` |
| Ink elevated (mark on ink) | `inkEl` | `#22223A` |
| Sidewalk (default body ground) | `sidewalk` | `#F3F3F0` |
| Cream (notices, guide slides) | `cream` | `#FBF8F2` |
| White (cards) | `white` | `#FFFFFF` |
| Warm blush | `blush` | `#F5DDD6` |
| Coral (the accent) | `coral` | `#E8735A` |
| Border | `border` | `#D5D5CA` |
| Divider | `divider` | `#A0A0B0` |
| Text muted / caption / light / dim | `muted` `caption` `light` `dim` | `#70707F` `#6E6E80` `#9292A3` `#B4B4C2` |

## Ramps

Ten steps each, 50 → 900. Full values in `tokens/tokens.json`.

```
coral   #FCEAE6 #F8D5CE #F4B9AD #EF9D8C #EA816B #E8735A #C5624D #A2513F #743A2D #46231B
blue    #E1EEFD #C2DEFB #9AC8F9 #72B1F7 #499BF4 #3590F3 #2D7ACF #2565AA #1B487A #102B49
mint    #EFFBFB #DEF8F7 #C9F3F2 #B3EEED #9DE9E8 #92E7E5 #7CC4C3 #66A2A0 #497472 #2C4545
sunny   #FFF8E8 #FFF1D1 #FFE8B3 #FFDF94 #FFD675 #FFD166 #D9B257 #B39247 #806933 #4D3F1F
green   #E4F3EC #C9E7DA #A5D7C1 #82C7A8 #5EB78F #4CAF82 #41956F #357A5B #265741 #173427
purple  #F0E9FB #DBCAFF #C0A2FF #A579FD #8D63E0 #8D63E0 #7650C3 #603EA5 #4C2F88 #3A216B
```

Practical pairings, so tinted cards stay legible:

| Fill | Border | Text |
|---|---|---|
| `coral50` | `coral300` | `coral800` |
| `blue50` | `blue300` | `blue800` |
| `green50` | `green100` | `green800` |
| `sunny100` | `sunny` | `ink` or `sunny800` |
| `mint100` | `mint` | `blue800` |

For heat scales use one ramp, five steps: `blue50 → blue100 → blue300 → blue600
→ blue800`. Mixing hues in a single scale destroys the ordering.

## Type

Two families, and the split between them is the load-bearing decision.

**Plus Jakarta Sans** for everything a reader absorbs.
**IBM Plex Mono** for everything a reader *verifies* — dates, IDs, figures in
tables, sources, footnotes, overlines, axis labels, status pills.

That split is the strongest single signal that a slide is Cakewalk's. The mono is
doing semantic work, not decoration: if you set a source line in sans it stops
reading as provenance and starts reading as prose.

Style names have no spaces — `ExtraBold`, `SemiBold`. This is Plus Jakarta Sans'
convention and it differs from Inter (`Extra Bold`), which is the usual cause of
`Cannot write to node with unloaded font`.

### Slide ramp

`lh` and `ls` are **percentages**, matching the Figma Plugin API unit.

| Token | Family | Style | Size | lh | ls |
|---|---|---|---:|---:|---:|
| `coverTitle` | sans | ExtraBold | 116 | 104 | −2 |
| `sectionNumeral` | sans | ExtraBold | 400 | 100 | −4 |
| `sectionTitle` | sans | ExtraBold | 88 | 106 | −2 |
| `metricHero` | sans | ExtraBold | 200 | 100 | −4 |
| `metric` | sans | ExtraBold | 96 | 100 | −3 |
| `metricSmall` | sans | ExtraBold | 52 | 105 | −2 |
| `actionTitle` | sans | Bold | 48 | 122 | −1.5 |
| `lead` | sans | SemiBold | 34 | 132 | −1 |
| `cardTitle` | sans | SemiBold | 24 | 136 | 0 |
| `body` | sans | Regular | 24 | 148 | 0 |
| `bodySmall` | sans | Regular | 21 | 150 | 0 |
| `bodyTiny` | sans | Regular | 17 | 152 | 0 |
| `label` | sans | SemiBold | 17 | 140 | 0 |
| `overline` | **mono** | SemiBold | 15 | 140 | +12, UPPER |
| `data` | **mono** | Regular | 19 | 145 | 0 |
| `note` | **mono** | Regular | 15 | 148 | 0 |
| `footnote` | **mono** | Regular | 14 | 150 | +6 |

Hierarchy is dramatic, not polite. A cover title is 116px against 24px body.
Where a number *is* the argument, set it at 96–200px and give it room — a hero
stat at 40px is a wasted slide.

Below 11px, mono stops being legible on a projector. In very dense tables drop to
11px mono for cell values and keep row labels at 12–13px, but treat that as the
floor.

## Radii

| Use | Radius |
|---|---:|
| Callout | 26 |
| Content card | 20–22 |
| Tile | 18 |
| Table cell / small card | 8–14 |
| Chip | 6–10 |
| Bar (chart) | 4–8 |
| Pill | `height / 2` |

One border style deck-wide: 1px `#D5D5CA` plus the surface change. Never a heavy
outline — the tonal step does the work.
