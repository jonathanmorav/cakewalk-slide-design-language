# Deck state

The durable record of the live file. **Update this whenever the deck changes** — it is
the thing that makes picking this up again cheap, and the only place the live
structure is written down.

Last verified: 2026-08-26 · 587 clean (numbered); 583-586 batch-clean with page numbers omitted by design (see below).

## The file

```
Figma Slides   https://www.figma.com/slides/UtxFDFaTR9GDTRcqIOKlOy/Cakewalk-Slide-Template---Revamp
fileKey        UtxFDFaTR9GDTRcqIOKlOy
Slides         587        Rows (sections)  44
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
| Export staging | 583–586 | Redesigns built **for another deck** (the Google Slides board deck). Page numbers deliberately omitted — see the exception below. |

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
42  | 583- 586   |  4 | Board deck · Sept 2 · GTM approach
43  | 587- 587   |  1 | GTM organization
```

Row 43 is a normal numbered slide — it prints `587` and keeps the invariant. It was built
for Figma, not for the Google board deck; if it ever needs to go there, drop the page
number first (see the row 42 exception) and re-export.

### Exception to the numbering invariant: row 42

Row 42 is an **export-staging** row. Its slides are redesigns of slides in the
Google Slides deck *Cakewalk Board of Directors Meeting - 9/2/2026*
(`1e0VCDfnEKlFanqXUiNSADM5iqvyzcyL4jCn7rSrINQc`), destined to be exported as
images and placed back into that deck — so a Figma page number would be wrong
wherever they land.

They therefore carry the footer wordmark but **no page number**, and
`lib/validate.js` reports them as `badPageNumbers: missing`. That finding is
expected. Do not "fix" it by numbering them 583/584, and do not run
`lib/renumber.js` over row 42.

Source mapping: Figma 583/584/585/586 = board-deck slides 8/9/10/11.

**Slides 585 and 586 do not carry the source deck's words.** Their source slides were
unconverted Slideworks construction filler, so the copy was re-derived from material
already in this deck. Every derivation, so a reader can audit it:

| Figma | Derivation |
|---|---|
| 585 | Pain points lifted verbatim from **Figma 581**'s real 3×4 matrix. Group names taken from board-deck slide 9 (`Small business owners` / `The person running benefits` / `Channel Partners`) rather than 581's later vocabulary (`Greenfield owner` / `Incumbent operator` / `Channel partner`), so slides 9 and 10 agree. The mapping between the two vocabularies is 1:1 and positional. |
| 585 | Overline changed from `TOP 5 PAIN POINTS…` to `TOP PAIN POINTS…` — there are four real pain points per group, not five, and padding to five would have meant inventing one. |
| 585 | The source's ranked rows 1–5 became ranked **columns** `01–04`, matching Figma 581's orientation. The ranking within a group is 581's order; treat it as an ordering, not a measured priority. |
| 586 | Product areas = the four lifecycle stages from board-deck slide 8 (`Buy` / `Enroll` / `Administer` / `Renew & Expand`), with each column's process steps also from slide 8. |
| 586 | **Buyer-to-area mapping is inferred, not sourced.** Slide 8 lists stakeholders and stages but never maps them. The call made: Buy → owners + partners; Enroll and Administer → the person running benefits + employees; Renew & Expand → owners + partners + carriers. This is the one judgement on these two slides that a reviewer should check first. |

### Export artifacts

```
PNGs   ~/cakewalk-slide-template/export/board-sept2/slide-{08,09,10,11}-*.png   1920x1080
       ~/cakewalk-slide-template/export/slide-587-gtm-organization.png           1920x1080
pptx   ~/cakewalk-slide-template/export/board-sept2/cakewalk-board-slides-08-11.pptx
Drive  "Cakewalk board slides 08-11 (Cakewalk design)"  (native Google Slides, My Drive root)
       1jiszTQrZeH-C8C0wG477Fukt0pma1rPd1hqyJ5Oy24g
```

Uploaded with `rclone copy <file> gdrive: --drive-import-formats pptx`, which converts to a
native Google Slides file on the way in. **`rclone` with a working `gdrive:` remote is the
only write path to Drive here** — the MCP Drive tool can only change a file's title and
folder, and pushing base64 through a tool call is enormous by comparison.

Do **not** palette-quantize these exports to save space. 128 colours halves the file and
visibly destroys the spectrum band — it breaks into flat chunks and the opening mint reads
as grey. Verified by cropping the tick and comparing. Ship 24-bit PNG.

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
- **Slide 587 · Sales is thinner than its peers by construction.** The brief gave Growth an
  explicit objective and Account management a hard 75/25 statistic; Sales got one clause and
  a parenthetical. Its panel carries `Close accounts.` plus a `Needed to start` pill and is
  visibly lighter than the other two. That asymmetry is the input, not a layout bug — do not
  pad it with invented copy. If Sales gets a real target, that panel is where it goes.
- **`mint100` pairs with `blue800`, not `mint800`.** Slide 585's group-C badge uses an
  improvised `mint800` (`#497472`) that is not in the documented triples in
  `docs/01-foundations.md`. Slide 587 uses the documented pairing. Worth reconciling 585 the
  next time its export is regenerated — it is a small tonal difference, not a visible defect.
- **Board deck slides 10 and 11 are unconverted Slideworks filler.** Their bodies are still
  construction-industry content from the source template — "Preconstruction",
  "Bid management 2.0", "Head of pre-construction", "Deliver projects on time and on
  budget". They were not rebuilt, because redesigning filler produces a beautiful wrong
  slide. Slide 9's column C carries the same problem in its five bullets
  ("Control time to completion", "Maintain commitment to quality") — those were kept
  verbatim as asked, and are flagged rather than invented over.
- **No Google Slides write path exists.** Drive's `update_file` covers title and parent only;
  there is no Slides API tool in this environment. Figma → Google is export-PNG-and-place,
  which flattens the slide to an image. Anything needing native editable Google Slides has
  to be rebuilt there by hand.
- **The board deck's own page numbers are wrong** — slides 8-11 print 527-530, inherited
  from the Slideworks template. Worth a renumber pass in Google before Sept 2.
