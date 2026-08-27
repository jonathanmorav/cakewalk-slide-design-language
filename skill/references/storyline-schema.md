# Storyline schema

An ordered list of claims. Written after the brief, before any library lookup.
8–15 claims for a working session; fewer if the timebox is short.

```yaml
slug: board-gtm-sept-2026
spine: situation | complication | resolution   # or a named agenda
question:                                      # echo the brief
claims:
  - id: S1
    claim:                                     # a sentence, not a topic
    job: cover | divider | evidence | decision | appendix
    must_land: true                            # drop this and the deck fails
    source:                                    # brief source id, or inferred
    inferred: false
    notes:
# …
```

Rules:

- A claim is a sentence a board member can agree or disagree with.
  `GTM` is a topic. `Sales should own Engage and Quote & close` is a claim.
- `must_land: true` rows are cast first. Everything else is cuttable.
- Do not pick layouts here. Casting is the next agent.
- Reuse the Business Case spine (situation → complication → resolution) unless
  the brief names a different agenda.
- If two claims need the same slide, they are one claim.
