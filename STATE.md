# Deck state

The durable record of the live file. **Update this whenever the deck changes** — it is
the thing that makes picking this up again cheap, and the only place the live
structure is written down.

Last verified: 2026-08-27 · 587-593 clean (numbered); 583-586 batch-clean with page numbers omitted by design (see below).

## The file

```
Figma Slides   https://www.figma.com/slides/UtxFDFaTR9GDTRcqIOKlOy/Cakewalk-Slide-Template---Revamp
fileKey        UtxFDFaTR9GDTRcqIOKlOy
Slides         593        Rows (sections)  50
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
44  | 588- 588   |  1 | Points of entry
45  | 589- 589   |  1 | GTM swimlane
46  | 590- 590   |  1 | GTM distribution
47  | 591- 591   |  1 | State licensing
48  | 592- 592   |  1 | TPA licensing
49  | 593- 593   |  1 | Operating model
```

Slide 589 is the only **white-ground** slide in the operating set (588 and 587 are sidewalk);
that was an explicit request, not a drift.

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
       ~/cakewalk-slide-template/export/slide-588-points-of-entry.png            1920x1080
       ~/cakewalk-slide-template/export/slide-589-gtm-swimlane.png               1920x1080
       ~/cakewalk-slide-template/export/slide-590-gtm-distribution.png           1920x1080
       ~/cakewalk-slide-template/export/slide-591-state-licensing.png            1920x1080
       ~/cakewalk-slide-template/export/slide-592-tpa-licensing.png              1920x1080
       ~/cakewalk-slide-template/export/slide-593-operating-model.png            1920x1080
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

## Template library

The Google Slides file *Cakewalk Slide Template Book*
(`1MfXm8Oue_aOWF_qwXvlb1F2JU8xRobCWgnpwGdM3tho`, 637 slides) is the compiled
source of the two Slideworks templates plus a Cakewalk Strategy 2026 pack. It is
**not** in Figma order.

This repo indexes it so an agent can pick a type without screenshotting hundreds
of slides:

```
library/catalog.json     committed index (not the verbatim dump)
library/archetypes.md    same rows grouped by type
library/lookup.py        python3 library/lookup.py "scorecard KPI cockpit"
```

**Mapping:** on `business-case-template` and `gtm-template` rows, `printed` ===
Figma position (1–576). The Strategy 2026 pack reuses printed 4–47 — those are
not Figma 4–47. See [library/SOURCE.md](library/SOURCE.md).

Do not commit the raw Drive export. `library/dumps/` is gitignored.

## Reference material

The plain-text exports both templates were rebuilt from are **not** in this repo (they are
third-party source decks). They live in `~/cakewalk-slide-template/reference/`, and the
GTM dump was worked from a session scratchpad. If you need to re-derive a slide, re-export
from Google Slides — `lib/extract.py` reads that format. The Template Book's
committed form is the catalog above, not a second dump.

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
- **Three slides now say "points of entry", on three different axes.** Keep them distinct or
  the deck contradicts itself: the older *We have three points of entry* segments by
  **persona** (owner / benefits admin / channel partner); *Depending on the product area*
  segments by **our product area** (discover & buy / enroll / administer / renew & expand);
  slide 588 segments by **the prospect's current state** (greenfield / has-benefits-admin-pain
  / approaching-renewal). Only the last is observable from outside, which is why it is the
  one a targeting query can act on.
- **Slide 588 · signals were built and then cut.** A first version carried a third column of
  draft targeting signals derived from the decks (no plan in force · QuickBooks/BambooHR/Paychex;
  25-45 ee · medical + ancillary in force · not on a PEO; renewal date inside 90 days).
  Jonathan rejected the column. Do not reintroduce it without being asked. The signals are
  recorded here only so the derivation is not lost.
- **Slide 588 · the `Next` pill on Administer comes from the Horizon slide**, not from the
  brief: Figma 582 puts admin-first BOR in Horizon 2 ("volume once we can administer plans we
  did not sell"). If that sequencing changes, the pill changes.
- **Slide 589 · every lane span is a decision Jonathan made in an intake, not an inference.**
  Recorded so nobody "corrects" them: the axis is the account's journey in six stages
  (Target · Engage · Quote & close · Onboard & enroll · Administer · Renew & expand); scope is
  at scale; lane labels carry roles but deliberately **no headcount**; and the point is
  leverage. The four spans: **Growth owns Target + Engage end-to-end** (product-led nurture, so
  Sales never does outbound); **Sales owns Quote & close only**, as a single licensed
  producer role that both quotes and closes; **Product owns Onboard & enroll** with humans on
  exception; **Account management spans Onboard & enroll → Renew & expand** as Tier 2 / Tier 3
  exception work. Sales occupying one stage of six is the intended result — it is what makes
  the leverage argument geometric rather than asserted.
  **Updated 2026-08-26:** Sales now spans **Engage + Quote & close** (`span(1,2)`), overlapping
  Growth on Engage, on Jonathan's note that "there might be some overlap with sales on engage".
  Lane coverage is now Growth `Target·Engage`, Sales `Engage·Quote & close`, Account management
  `Onboard & enroll·Administer·Renew & expand`. Sales' copy dropped its forced newlines at the
  same time — the wider bar fits one line.
  **Resolved.** The action title is now "Growth, sales and account management / each own
  distinct moments across the benefits lifecycle." Pluralising *moments* makes it true of lanes
  that cover two or three stages, and "benefits lifecycle" names the domain rather than leaving
  "the lifecycle" abstract. The line break after *management* is explicit: line 1 is the
  subject, line 2 the claim. Longest line measures 1284px against a 1700px box, so it holds at
  two lines and the tick stays at y=266 — re-measure if the wording changes again.
- **Slide 593 · every structural choice came from a two-round intake, not inference.** Recorded
  so nobody "simplifies" them: **four lanes by layer** (Customer · Cakewalk team · Platform ·
  External); **seven stages** (Source · Enrich · Offer · Quote & close · Onboard & enroll ·
  Administer · Renew & expand — Enrich and Offer are stages in their own right, which is what
  makes it an operating model rather than a funnel); **target state at scale**, no live/planned
  status; **entry branches only** — the two motions converge and then the path is linear.
- **Slide 593 · automation is encoded as a 4px node rail, not a tag.** `blue600` = platform,
  `ink` = human, split (blue top half, ink bottom) = both. Applied **only to the Cakewalk team
  and Platform lanes** — the Customer and External lanes are not ours to automate, so marking
  them would be meaningless. The legend states this. Rails were chosen over text tags because
  24 nodes x a tag is visual noise, and 10px type would break the ramp.
- **Slide 593 · the empty cells are the point, not an omission.** The Customer lane has no node
  at Source or Enrich because those stages happen before the customer knows us; External has
  none at Enrich or Offer. The source line says so explicitly. Do not fill them.
- **Slide 593 · connectors only ever join ADJACENT lanes**, routed in the column gutters. A
  Platform→Customer link would have to cross the Cakewalk lane and cut through its nodes, so it
  is deliberately absent and left-to-right reading carries it. The coral elbows at Source→Enrich
  are the one coral moment: two motions merging on a single diamond at the platform.
- **Slides 591 and 592 are a deliberate pair** and share the same 11-column US tile grid,
  the same tile geometry (92x58, radius 10, 8px gutters), the same counts-as-legend rail and the
  same coral ring on the launch markets. Change one and change the other, or they stop reading
  as a set. 591 is **agency** licensing (from the sheet); 592 is **TPA** licensing (from
  Jonathan's list, 2026-08-26).
- **Slide 592 · TPA statuses are three, not four.** `Active` 25 (green) · `Not required *` 1
  (blue, New York only) · `Not active` 25 (sidewalk). New York's tile reads `NY*` and a cream
  note in the rail carries the reason: no TPA licence is required where claims are not handled.
  Do not fold NY into either Active or Not active — it is a third state of the world.
- **The two licensing footprints diverge, and no slide says so yet.** Cross-referencing 591 and
  592: **15 jurisdictions hold both** an agency licence and an active TPA licence (AR DE IN ID KS
  KY MT ND RI SD TN UT VT WI WV); **12 are agency-only** (CT DC IA LA ME MD MI MN NC OK PA SC);
  **10 are TPA-only** (AZ CA IL MA MO MS NE NM OH WA). Selling *and* administering needs both, so
  15 is arguably the real operating footprint. Flagged to Jonathan; a combined slide has not been
  requested.
- **Slide 591 · the licensing data is transcribed, and the build self-checks it.** Source is the
  Google Sheet `1gysxRGuNpo0ldV5KRSYmhvbXY0hWI6XsFNRf1C9Oehw` (Cakewalk Benefits Insurance
  Agency, LLC — Licenses by State, NPN 22297453). The build asserts three things and throws
  rather than drawing a wrong map: the tile grid holds exactly 51 entries, they are unique, and
  the computed status counts equal the sheet's own totals (**27 licensed · 2 accepted · 8 pending
  · 14 not started**). If the sheet changes, update `LICENSED` / `ACCEPTED` / `PENDING` and the
  assertion will catch any drift.
- **Slide 591 · the tile grid is a hand-built 11-column US layout**, per the map-substitute
  archetype in `docs/07-chart-vocabulary.md`. Rows are roughly geographic; the empty cell between
  WI and MI is Lake Michigan and should stay empty. DC is a tile, which is why the denominator is
  51 jurisdictions and not 50 states — the action title says "jurisdictions" for that reason.
- **Slide 591 · only status is shown, not licence detail.** Jonathan asked to drop the notes and
  expiration columns; I also left out **Original Issue, Number and Lines**, because per-state
  reference data cannot live on a map and "progress" means status. If those are wanted, they need
  a separate appendix table — flagged to him, not yet requested.
- **Slide 591 · coral rings mark the launch states** (TN · WI · AZ) — the one coral moment. The
  finding the slide exists to deliver is that AZ is the only launch state still pending, which
  matches the weekly review's "Arizona license still pending".
- **Slide 590 went through three structures. The third is right: DEFINITION first.**
  1. Two equal columns of mechanics — rejected: implied the arms are peers when they are on
     different clocks.
  2. A two-lane relative time axis with milestone diamonds — rejected: "too much focus on
     sequencing and preparedness which is important but probably secondary to defining the
     motions, what they do, and why they're there."
  3. **Current:** two columns, each running **name → one-line definition → What it does →
     Why it's there**, with the rationale named as an asset in `blue800` SemiBold 24
     (`Control and speed.` / `Reach and trust.`).
  **Sequencing is now off the slide entirely.** The `In build now · short cycle` mono lines were
  cut on review ("let's get rid of small text"). Timing lives on the roadmap, not here. Do not
  reintroduce it in any form.
- **Slide 590 · exact wording, all Jonathan's on review.** Motion A's definition is
  `Applying AI & engineering to build a GTM demand engine.` (he wrote "to creating"; the only
  change is the infinitive, and the `&` is his). Step 4 is `Scaled outbound`, step 5 is
  `Account based targeting` — previously "Mass outbound" and "Account-based marketing". Steps 4
  and 5 are SemiBold because they are outputs of the pipeline, not build steps.
- **Slide 590 · the two rationale blocks are y-aligned on purpose.** Both cards place the
  divider at 436, the `WHY IT'S THERE` label at 458, the asset name at 484 and its explanation
  at 524, regardless of how much content sits above. The `Control and speed.` / `Reach and
  trust.` contrast is the slide's spine and only reads as a pair when the two lines sit at the
  same height. Keep them locked if the copy above changes length.
- **Slide 590 · the asset contrast is the intellectual spine.** Motion A buys control and speed
  (we own the funnel, we iterate on our own clock); motion B buys reach and trust (access and
  credibility we cannot build one account at a time). The action title states exactly this. If
  the copy ever changes, keep the two assets distinct — that contrast is why the slide exists.
- **Slide 590 · what is Jonathan's and what is mine.** His: both motion definitions, the five
  pipeline steps, and the sequencing point. Mine: the action title, the two asset names and
  their explanations, the platform categories (lifted from the channel pipeline), and the
  partner-side benefits (lifted from the channel entry slide's column C).
- **Slide 590 · card height is tuned to the source line.** Cards are 606 tall ending at y=910,
  leaving 34px to the source line at 944. An earlier 626 left only 14px, which read as crowded.
  Lowest content sits at 597 (A) and 593 (B), so there is no room to grow the copy without
  re-tuning both.
- **Slide 589 · the product is NOT a lane and must not be put back on the axis.** It went
  through three rejected forms — full-width coral bar ("red looks off"), then an ink bar with a
  spectrum top rule ("don't think it should be that blue color"). The resolved design, in
  Jonathan's words, is a "clear background end to end shape with Cakewalk Product in the middle
  and the signature rainbow line as the border between the above axis and foundational platform
  layer". So:
    - The six stage headers and their gridlines **stop at the bottom of the third role lane**
      (`AXIS_BOTTOM`). The axis governs people only.
    - A **full-bleed spectrum band, 1920 x 8 at x=0**, is the boundary. This is the only
      full-bleed band in the operating set and it is deliberate — do not inset it to the 88px
      margin.
    - Below it: **no box, no fill.** `Cakewalk Product` in ExtraBold 46 centred on the full
      1920, capability list in mono 14 centred beneath. The white ground *is* the platform
      layer; boxing it destroys the idea.
  The slide therefore carries **no coral except the eyebrow**, which is chrome. Do not
  "restore" an accent to the product layer.
- **Slide 589 has no source line and no "at scale" text anywhere.** Both were removed on
  request. The eyebrow is plain `GTM organization`.
- **Slide 589's lockup is the wordmark standing in for a word, not a logo placement.**
  `Cakewalk` is the `Cakewalk Wordmark` master; `Product` is ExtraBold 46 text. They are
  optically matched by comparing **`absoluteRenderBounds`** — true glyph bounds — and scaling
  the wordmark so its visible height equals the text's (35px for both), then aligning visual
  tops. Do not guess a height ratio: the wordmark's node box carries slack, so `h = fontSize`
  or any fixed multiplier lands wrong.
  The **trademark glyph is deliberately removed from this one clone** — it was two isolated
  ~3px vectors at the top right, and a `™` sitting between the two words of a phrase reads as
  an artifact. The footer wordmark keeps its mark, so the slide still marks the trademark once.
  The removal is guarded to vectors `<=4px in both axes, in the top 20% and right 10%` — see
  pitfall 4; a looser filter destroys the logotype.
- **Slide 589 · lane copy uses explicit newlines, deliberately.** Sales reads
  `Answer questions,\nbuild trust,\nquote and close.` because auto-wrapping a four-verb phrase
  in a one-stage-wide bar produced a ragged short last line. `lineCount()` in the build takes
  `max(newlines, ceil(measured/boxWidth))` — measuring alone reports 1 line for a
  newline-broken string and mis-centres it.
- **Slide 589 · role titles are Jonathan's for Sales and Account management, mine for Growth.**
  `Licensed Account Executive` and `Account manager` were given directly. `GTM engineer ·
  Data analyst · Lifecycle marketer` is still my proposal and unconfirmed.
- **Slide 589 · Sales still spans only Quote & close, and that may want revisiting.** Jonathan's
  feedback was "it's not just quote and close — questions, build trust and confidence". That was
  applied to the *copy* (now "Answer questions, build trust, quote, close.") but not the *span*,
  because the intake explicitly put Engage with Growth end-to-end and limited Sales to inbound
  intent. If the intent was that the AE's work reaches back into Engage, widen the bar to
  `span(1, 2)` — the copy already describes a motion wider than one stage.
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
- **Google is ahead of Figma on wording, and nothing syncs it.** As of 2026-08-26 the deck
  *Cakewalk Weekly Review* (`1m-flIgIpjpNMaqbqdkyu_n4sOXhTcRJm8azTOPlnDpU`) carries hand-edited
  versions of slides built here: 587's headline ends "retain and expand the account" (Figma
  says "keep the account"), Growth's objective is "Build the funnel of prospective accounts",
  the `Needed to start` pill is gone, and the old entry slide's column C has been rewritten
  with real channel-partner copy (trust transfer · incremental partner revenue · reduced
  churn). Back-port before treating Figma as the source of truth.
