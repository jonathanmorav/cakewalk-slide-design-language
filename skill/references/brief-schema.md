# Brief schema

The brief is the memo between sources and slides. Nothing in Figma is written
until this exists. Fill every field; write `unknown` rather than inventing.

Read [docs/10-slide-method.md](../../docs/10-slide-method.md) first. The
**one question**, the **spine**, and the **six audience answers** are not
optional — they are the brief.

```yaml
mode: deck                 # deck | template  — template briefs are rare
slug: board-gtm-sept-2026  # folder name under decks/
title: Board GTM · Sept 2026
kind: decision | playbook | weekly   # picks the spine
spine: scr | gtm | custom
question:                  # the one well-defined question the deck answers
decision:                  # what must be true when the meeting ends
audience:
  who:                     # who is in the room, and what they already believe
  ask:                     # yes / resource / briefing they can take upstairs
  values:                  # metrics they already use (ROI, NPS, time-to-quote)
  format:                  # one-pager + appendix, or every calculation
  risk:                    # how much uncertainty they will tolerate
  gain:                    # what they stand to get if this ships
  decider:                 # who actually says yes
timebox:                   # minutes, including Q&A
date:                      # meeting date
canonical: figma           # figma | google | dual
export_to:                 # Drive/Slides URL, or none
sources:                   # every source the agent actually read
  - kind: pocket | gmail | zoom | drive | calendar | slack | conversation
    id:
    date:
    what:
claims_in:
  - fact:
    source:
    as_of:
disputed:
  - fact:
    a:
    b:
    rule: stop | show-both | prefer-X
inferences:
  - claim:
    because:
    needs: propose
forbidden:
tone:
open_questions:
```

Rules:

- If `question` is a topic (`GTM`, `Q3 update`) and not a question, the brief
  is not done.
- `kind: decision` → spine `scr`. `kind: playbook` → spine `gtm`. Weekly
  borrows one of those; it does not invent a third.
- A numeral without a `sources` row does not ship.
- `disputed` is not averaged.
- `inferences` become the judgement log, not silent copy.
- Gmail / Pocket / Zoom / Drive are **inputs to this file**, not things that
  draw rectangles in Figma.
- Framing questions: [framing-questions.md](framing-questions.md).
