# Storyline schema

An ordered list of claims **and their action titles**. Written after the brief,
before any library lookup. Method: [docs/10-slide-method.md](../../docs/10-slide-method.md).

```yaml
slug: board-gtm-sept-2026
spine: scr | gtm | custom
question:                                      # echo the brief
answer:                                        # the governing thought — pyramid tip
claims:
  - id: S1
    claim:                                     # a sentence they can agree or disagree with
    title:                                     # the action title / voice-over
    section:                                   # exec-summary | problem | markets | …
    job: cover | divider | evidence | decision | appendix
    must_land: true
    source:
    inferred: false
    notes:
```

Rules:

- `answer` is the recommendation in one sentence. It appears on the first
  content slide (exec summary), not after the proof.
- `title` is the voice-over, not a topic. `Market sizing` fails.
  `Our SOM of $56M is still mostly uncaptured` passes.
- A claim is a sentence. `GTM` is a topic.
  `Sales should own Engage and Quote & close` is a claim.
- **Title-only test:** read every `title` in order, ignore bodies. If the
  argument is not there, rewrite titles or cut claims. Do this before
  `cakewalk-cast`.
- Two-line test: if `title` cannot hold the message, the claim is two slides.
- `must_land: true` rows are cast first. Everything else is cuttable.
- Do not pick layouts here. Casting is the next agent.
- Default spines: `scr` (situation → complication → resolution → plan) or
  `gtm` (analyze → design → deliver → plan). See the method doc.
- If two claims need the same slide, they are one claim.

8–15 claims for a working session; fewer if the timebox is short. Cover,
agenda, and close are claims too.
