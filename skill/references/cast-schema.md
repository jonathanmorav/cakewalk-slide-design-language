# Cast schema

Each storyline claim gets one library slide (or an explicit `rebuild`).
Written after the storyline, before Figma.

```yaml
slug: board-gtm-sept-2026
library_file: UtxFDFaTR9GDTRcqIOKlOy
rows:
  - claim_id: S1
    claim:
    archetype:               # from docs/07 or library/archetypes.md
    figma_position:          # 1–576, or null
    verb: clone | adapt | rebuild
    why:                     # one line — why this template, not a neighbour
    lookup:                  # the query that found it
```

How to pick:

```bash
python3 library/lookup.py "<claim>"
python3 library/lookup.py --archetype scorecard
```

Mapping reminders (`library/SOURCE.md`):

- `printed` on a `business-case-template` or `gtm-template` row **is** the
  Figma position.
- `cakewalk-strategy-2026` rows have **no** Figma position. Use them for type,
  then look up the same archetype in the templates and screenshot that.
- Never treat `book` as a Figma handle.

Verb:

| Verb | When |
|---|---|
| `clone` | Same Figma file, geometry stays, facts or title change |
| `adapt` | Same archetype, add/remove a column, restack, or retone |
| `rebuild` | New file (cannot clone across files), or the structure is wrong |

A new meeting file is almost always `rebuild`, using the library screenshot as
the visual reference. `clone` is for variants inside one file.
