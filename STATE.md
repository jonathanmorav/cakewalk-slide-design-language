# Deck state

The durable record of the live file. **Update this whenever the deck changes** — it is
the thing that makes picking this up again cheap, and the only place the live
structure is written down.

Last verified: 2026-08-26 · `clean: true` on a full-deck validate.

## The file

```
Figma Slides   https://www.figma.com/slides/UtxFDFaTR9GDTRcqIOKlOy/Cakewalk-Slide-Template---Revamp
fileKey        UtxFDFaTR9GDTRcqIOKlOy
Slides         582        Rows (sections)  42
Grid           88px       (see docs/02-grid.md)
Logo masters   4:8   Cakewalk Wordmark (master)   ratio 5.902439
               4:27  Cakewalk Mark (master)       ratio 0.917912
```

Node ids are file-specific. If you fork the file, re-resolve the masters by name —
`lib/preamble.js` already does.

## Invariant

**Printed page number === deck position**, for all 582 slides. The validator checks it and
`lib/renumber.js` restores it. Appending at the end preserves it for free; inserting
anywhere else does not.

## Three classes of content

| Class | Positions | What it is |
|---|---|---|
| Recreated template | 1–576 | Two Slideworks consulting templates rebuilt in this language. **Placeholder copy is deliberate and verbatim** — `[Insert segment]` is an instruction to the next author. Do not "fill in" or paraphrase. |
| Operating slide | 577 | Channel partner pipeline. Category placeholders (`[Payroll platform]`), real structure. |
| Operating deck | 578–582 | Board GTM · Sept 2026. Real copy, no placeholders. |

## Section map

```
row |  positions | n  | name
----+------------+----+---------------------------------------------
 0  |   1-  10   | 10 | Cover and template overview
 1  |  11-  19   |  9 | I. Best-practice guide
 2  |  20-  27   |  8 | Front pages and content
 3  |  28-  37   | 10 | Executive summary
 4  |  38-  46   |  9 | Background and context
 5  |  47-  68   | 22 | What is the problem / opportunity?
 6  |  69-  81   | 13 | High-level solution and vision
 7  |  82-  92   | 11 | Options analysis
 8  |  93- 113   | 21 | Recommended solution · Solution details
 9  | 114- 123   | 10 | Recommended solution · Benefits
10  | 124- 136   | 13 | Recommended solution · Costs and ROI
11  | 137- 154   | 18 | Implementation plan
12  | 155- 166   | 12 | Risks and mitigations
13  | 167- 180   | 14 | Governance and monitoring
14  | 181- 186   |  6 | Recommendations and next steps
15  | 187- 193   |  7 | Appendix
16  | 194- 218   | 25 | IIIa. Case — Project Rocketship
17  | 219- 248   | 30 | IIIb. Case — Lifting our employees
18  | 249- 262   | 14 | IIIc. Case example — EnergyCo
19  | 263- 270   |  8 | Appendix B — Checklist and best practices
----+------------+----+--- Business Case template ends at 270 --------
20  | 271- 280   | 10 | GTM · Cover and template overview
21  | 281- 288   |  8 | GTM · I. Best-practice guide
22  | 289- 296   |  8 | GTM · Front pages and content
23  | 297- 300   |  4 | GTM · Executive summary
24  | 301- 314   | 14 | GTM · Point of departure
25  | 315- 341   | 27 | GTM · Markets
26  | 342- 363   | 22 | GTM · Customers
27  | 364- 381   | 18 | GTM · Product
28  | 382- 390   |  9 | GTM · Competition and demand
29  | 391- 411   | 21 | GTM · Pricing
30  | 412- 428   | 17 | GTM · Sales
31  | 429- 439   | 11 | GTM · Distribution and channels
32  | 440- 455   | 16 | GTM · Marketing
33  | 456- 464   |  9 | GTM · Customer success
34  | 465- 479   | 15 | GTM · Plan, KPIs, and monitoring
35  | 480- 498   | 19 | GTM · Case 1 — Heavy equipment platform
36  | 499- 519   | 21 | GTM · Case 2 — B2B SaaS player
37  | 520- 544   | 25 | GTM · Case 3 — Construction software
38  | 545- 568   | 24 | GTM · Case 4 — Professional services
39  | 569- 576   |  8 | GTM · Appendix — Checklist and best practices
----+------------+----+--- GTM template ends at 576 -----------------
40  | 577- 577   |  1 | Partnerships
41  | 578- 582   |  5 | Board GTM · Sept 2026
```

Source-slide mapping for the templates: Business Case `position === source n`;
GTM `position = 270 + n`.

## Reference material

The plain-text exports both templates were rebuilt from are **not** in this repo (they are
third-party source decks). They live in `~/cakewalk-slide-template/reference/`, and the
GTM dump was worked from a session scratchpad. If you need to re-derive a slide, re-export
from Google Slides — `lib/extract.py` reads that format.

## Open threads

- **Numbering across two templates.** Page numbers run 1–582 continuously, so GTM source
  slide 1 prints 271. Jonathan was offered a per-deck restart (each template numbered from
  1) and has not asked for it. `lib/renumber.js` has an `OFFSET` for exactly this.
- **`~/cakewalk-slide-template` carries two grids.** `_preamble.js` is the legacy 128px one,
  bound to `build.sh` and `fragments/b04..b24`; `_preamble-88.js` is a copy of this repo's
  `lib/preamble.js`. Never edit the legacy one to the current grid.
- **Slide 577 · "Exec PO"** was read as the executive owner (a person) rather than a
  purchase order. If that is wrong the column becomes a Yes/No pill.
- **Slide 580** deliberately removed A's visual primacy — the title frames the three entry
  paths as alternatives. Restore emphasis if greenfield owner really is the priority.
