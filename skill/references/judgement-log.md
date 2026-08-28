# Judgement log

Returned by `cakewalk-critique` and written to `decks/<slug>/JUDGEMENT.md`.
This is the audit trail `docs/08-recreating-a-deck.md` asks for — the calls a
reader cannot check from the slides alone.

```markdown
# Judgement · <slug>

## Inferences
| Slide | Claim | Because | Status |
|---|---|---|---|
| 3 | Buy → owners + partners | Slide 8 lists both, never maps them | propose |

## Groupings
Plain-text / transcript order was ambiguous. What we did:

- Slide 5: 12 pain points read **column-major** (three personas × four pains).

## Disputes
| Fact | Source A | Source B | Rule used |
|---|---|---|---|
| Win rate | Pocket 62% (service NPS, not win) | Zoom "about 40" | stop — not on the slide |

## Forbidden that were asked for
Numbers or claims the brief marked forbidden and that did not ship.

## Method ([docs/10-slide-method.md](../../docs/10-slide-method.md) §10)

Title-only test (pass / fail) — paste the titles in order if it failed.
One-message / two-line-title failures:
Pyramid (answer on slide 1, not slide 14):
Do-nothing / options:
Every number sourced:
Ask and next step are on a slide:

## Validate
`lib/validate.js` batch + deck: clean / not, and what was ignored on purpose
(e.g. export-staging slides with no page number).
```

Silent normalisation is the failure mode. If a call is not in this file, it
did not happen.
