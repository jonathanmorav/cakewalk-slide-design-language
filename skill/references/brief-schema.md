# Brief schema

The brief is the memo between sources and slides. Nothing in Figma is written
until this exists. Fill every field; write `unknown` rather than inventing.

```yaml
mode: deck                 # deck | template  — template briefs are rare
slug: board-gtm-sept-2026  # folder name under decks/
title: Board GTM · Sept 2026
audience:                  # who is in the room, and what they already believe
decision:                  # what must be true when the meeting ends
question:                  # the one question the deck answers
timebox:                   # minutes, including Q&A
date:                      # meeting date
canonical: figma           # figma | google | dual
export_to:                 # Drive/Slides URL, or none
sources:                   # every source the agent actually read
  - kind: pocket | gmail | zoom | drive | calendar | slack | conversation
    id:                    # thread id, meeting id, file id
    date:
    what:                  # one line — what this source contributed
claims_in:                 # facts the sources support, each with a source id
  - fact:
    source:
    as_of:
disputed:                  # same fact, two sources, they disagree
  - fact:
    a:
    b:
    rule: stop | show-both | prefer-X
inferences:                # calls the agent wants to make that no source states
  - claim:
    because:
    needs: propose         # always propose — never auto
forbidden:                 # numbers or claims the agent must not invent
tone:                      # e.g. board, weekly, customer, recruiting
open_questions:            # what the agent still needs from Jonathan
```

Rules:

- A numeral without a `sources` row does not ship.
- `disputed` is not averaged. Either stop, show both, or prefer a named source.
- `inferences` become the judgement log, not silent copy.
- Gmail / Pocket / Zoom / Drive are **inputs to this file**, not things that
  draw rectangles in Figma.
