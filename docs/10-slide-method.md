# Slide method

How a Cakewalk deck thinks, before it looks like Cakewalk.

Visual language is [01](01-foundations.md)–[04](04-conventions.md). Chart
construction is [07](07-chart-vocabulary.md). This document is the **argument**:
one question, a spine, an answer first, then proof.

Distilled from the best-practice guides in the two Slideworks templates this
library was rebuilt from (Business Case
`1tcjXDF-3XG0MILfwRmOdbeOKuVAVjb4rNTbRzz0mcIk`, GTM
`1ZA2PyT5bve_C5I1SI35i5yGte4aQX6lOmBTT2-gy7V8`). Those decks also live as
Figma 11–19 and 281–288. **Do not copy their chrome.** Keep the method; draw
in this language.

The agent loop that runs this method is [`/cakewalk-slides`](../skill/SKILL.md).
Framing questions: [`skill/references/framing-questions.md`](../skill/references/framing-questions.md).

---

## 1. One question

A deck answers **one well-defined question**. If you cannot write it in a
sentence, you do not have a deck yet — you have a topic pile.

| Kind of ask | The question the deck exists to answer |
|---|---|
| Decision / business case | What happens if we take this course of action? |
| New GTM / launch | How do we best launch and scale this product, across every function? |
| Existing GTM / growth | What should we focus on to find the next increment of growth? |
| Weekly / board update | What changed, and what decision do you need from us now? |

A business case is **not** a business plan (one project, internal, static, yes/no).
A GTM is **not** a product strategy (sell and to whom, not what we are building
and why). If the ask is the other document, say so and stop.

---

## 2. Audience before slides

Write these before a single title. They change what you keep, not just the cover.

1. **Ask** — what do you want in the room? A yes, a resource, a briefing they
   can take upstairs?
2. **Values** — which metrics do they already use (ROI, NPS, time-to-quote)?
   Measure the case in *their* units.
3. **Format** — one-page exec plus appendix, or every calculation on the wall?
   Senior rooms usually want the chosen option, not every discarded alternative.
4. **Risk** — how much uncertainty will they tolerate, and have you shown you
   considered it at that level?
5. **Gain** — what do *they* get if this ships?
6. **Decider** — who actually says yes, and what do they need to see?

A business case is a sales pitch. Keep it concise, exciting, and relevant to
those six answers. Double-check every number.

---

## 3. Pick a spine

### Decision spine — Situation / Complication / Resolution

The Business Case storyline. Three movements, then the plan that makes the
resolution believable.

| Movement | Question | Sections |
|---|---|---|
| **Situation** | Why should we do this? | Background. Burning platform. |
| **Complication** | What is the need, really? | Problem / opportunity and its drivers. |
| **Resolution** | What does it look like? | Vision, options (include do-nothing), recommended solution, benefits, cost / ROI. |
| **How we get there** | Can we actually do it? | Implementation, risks, governance, next steps. |

If stakeholders do not agree on the complication, they will reject every slide
after it. Do not skip the problem.

The executive summary **is** the SCR in one page: context, need, options
considered, the ask, the number, the next step. It must stand alone.

### Playbook spine — Analyze / Design / Deliver / Plan

The GTM storyline. Nine blocks that have to lock together, not nine essays.

| Phase | Question | Blocks |
|---|---|---|
| **Analyze** | Who are we targeting? | Point of departure. Markets. Customers. |
| **Design** | What are we selling, and why us? | Product. Competition. Pricing. |
| **Deliver** | How do we reach them and keep them? | Sales. Distribution. Marketing. Customer success. |
| **Plan** | What starts tomorrow? | Roadmap, owners, KPIs. |

New product: most blocks, because the machine does not exist yet.
Existing product: a few blocks — the growth levers — and a point of departure
that says what is already true.

A GTM that does not change how marketing, sales, and success work in lockstep
is a product one-pager with extra pages.

---

## 4. Pyramid — answer first

The recommendation is slide 1, not slide 14.

```
Answer / governing thought
  ├─ argument
  │    ├─ fact
  │    └─ fact
  └─ argument
       └─ fact
```

If the reader needs ten slides to discover what you want, the storyline is
upside down. Facts support arguments; arguments support the answer. Never the
other way.

The title-only test (below) is how you check this without looking at the bodies.

---

## 5. Horizontal logic — the title-only test

Write every action title in order. Read **only** those titles.

- A reader should get the whole argument.
- If they cannot, the storyline is wrong — not the formatting.
- Topic titles fail the test (`Market sizing`). Voice-over titles pass
  (`Our SOM of $56M is still mostly uncaptured`).

The voice-over test: if you had to narrate the slide in one sentence, that
sentence *is* the title. Write it down. Do not decorate a topic.

---

## 6. Vertical logic — one message per slide

- One takeaway. If you cannot fit it in a two-line title, split the slide.
- Nothing on the slide that does not support that title. Nice extras go to the
  appendix or the trash.
- The body proves the title. The title does not announce the body.
- Coral (or the one visual highlight) marks the takeaway, not the chrome.

---

## 7. What / Why / How, every section

Before casting or drawing a section, write three lines:

| | |
|---|---|
| **What** | How many slides, and what they contain. |
| **Why** | What the section does to the reader (urgency, trust, permission to say yes). |
| **How** | The moves that make it true (start with why, include do-nothing, source the number). |

Then look up templates. A section without a Why is a table of contents entry.

The library already holds these as `guide` slides (Figma 11–19, 281–288, and
each section opener). Use them. Do not put a guide slide in a client deck.

Full question lists: [`framing-questions.md`](../skill/references/framing-questions.md).

---

## 8. Options and numbers

- Generate alternatives with the people who will live with them, then cut to
  the ones that hit the objectives **and** the audience's values.
- Always keep a **do-nothing** baseline unless there is truly one option
  (say so).
- Compare on criteria the room already believes (cost, risk, time, feasibility).
- Quantify what you can. Intangibles are allowed; they do not replace a number.
- Every numeral has a source the room trusts. Company-standard ROI / NPV / IRR /
  payback — do not invent a metric they do not use.
- Backup (assumptions, maths) lives in the appendix. The slide states the
  result.

---

## 9. The plan has to be startable tomorrow

A resolution without an implementation slide is a wish. Owners, dates, a
one-page action view, and a handful of KPIs the next meeting can score.
GTM plans are living — they take feedback from each function; they are not a
one-off PDF.

---

## 10. Critique checklists

Run these in `cakewalk-critique` before export. Content first, then Cakewalk
formatting — not Slideworks' 14/16 px rule.

### Content

- The objective is one sentence, and the deck achieves it.
- The executive summary stands alone and matches that objective.
- The spine is visible (SCR or Analyze / Design / Deliver / Plan).
- Every title is an action title.
- Titles-only tell the story.
- Every body supports its title.
- One message per slide (two-line title test).
- Options include do-nothing, or an explicit reason they do not.
- Every graph and number has a source.
- Every chart has axis titles / units.
- The ask and the next step are on a slide, not only in the speaker's head.
- There is an ending (decision, close, or thank-you) — the deck does not
  fall off a cliff.

### Formatting (Cakewalk)

- Eyebrow / section name matches the spine section.
- Printed page number === position (unless export-staging).
- Plus Jakarta Sans for prose, IBM Plex Mono for facts. Two sizes in the
  content area is the usual; do not improvise a third ramp.
- Coral once. Peer set = `coral / blue600 / mint`.
- Cards, alignment, and the 88px grid as in [02](02-grid.md) and [04](04-conventions.md).
- `validate.js` batch + deck is clean, or the exception is named.

---

## Where this sits in the loop

| Phase | What the method demands |
|---|---|
| `cakewalk-brief` | One question. Spine. The six audience answers. |
| `cakewalk-storyline` | Pyramid. Action titles. Title-only test before any lookup. |
| `cakewalk-cast` | What / Why / How per section, then library lookup. |
| `cakewalk-build` | Voice-over title, one message, coral on the takeaway. |
| `cakewalk-critique` | Both checklists. Fail the title-only test → storyline, not polish. |
