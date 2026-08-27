# Per-deck STATE

Real decks do **not** live in the 593-slide template file. Copy this into
`decks/<slug>/STATE.md` the moment the Figma file exists.

```markdown
# <title>

mode: deck
slug: <slug>
fileKey:
url:
slides:
rows:
canonical: figma          # figma | google | dual
export_to:
audience:
decision:
question:
meeting:

## Storyline
<!-- claim id → Figma position, one row each -->

## Sources
<!-- brief source ids -->

## Open threads
<!-- judgements that still need Jonathan -->

## Export
<!-- dest URL, whether page numbers were stripped, PNG paths -->
```

The library file keeps the root [`STATE.md`](../../STATE.md). Do not append
meeting narrative there.
