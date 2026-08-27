# Template library

A scannable index of the Cakewalk Slide Template Book, so an agent can pick an
existing slide type instead of inventing a layout.

The visual library already lives in the Figma file (`UtxFDFaTR9GDTRcqIOKlOy`,
positions 1–576). This folder is the **text index** of that library plus the
Google book's extras. Do not re-draw the book in Figma.

## When you are asked to create or design a slide

1. Read [`archetypes.md`](archetypes.md) if you already know the type
   (scorecard, 2×2, gantt, …).
2. Rank candidates:

   ```bash
   python3 library/lookup.py "pipeline conversion scorecard"
   python3 library/lookup.py --archetype gantt
   python3 library/lookup.py --section "GTM · Markets"
   ```

3. Take the top match. If it has a `figma_position`, screenshot that slide in
   the live file and use it as the visual reference.
4. Build in Cakewalk language (`lib/preamble.js`, 88px grid, sans/mono split).
   Same instructional intent; do not copy Slideworks chrome.
5. If the top match is a Strategy 2026 `example` with no Figma position, look
   up the same `--archetype` in the templates and screenshot *that*.

Placeholder copy in positions 1–576 stays verbatim. `[Insert segment]` is an
instruction to the next author.

## What is in here

| File | Commit? | What it is |
|---|---|---|
| `catalog.json` | yes | One row per indexed slide: title, archetype, section, Figma position, keywords, four `first_lines` |
| `archetypes.md` | yes | The same rows grouped by type — read this first |
| `lookup.py` | yes | Rank the catalog for an ask |
| `ingest.py` | yes | Rebuild the catalog from a Drive dump |
| `SOURCE.md` | yes | Drive id, Figma mapping, what must not be committed |
| `dumps/` | **no** | Local Drive JSON / decoded text. Gitignored. |

`catalog.json` is an index, not a dump. Full slide bodies stay out of the repo.

## Rebuild the catalog

```bash
# Drive MCP download_file_content → library/dumps/book.json
python3 library/ingest.py library/dumps/book.json

# or a decoded text/plain export
python3 library/ingest.py library/dumps/template-book.txt
```

Accepts Drive MCP JSON (base64 `content`), decoded Drive text, or a Google
Slides **File ▸ Download ▸ Plain text** dump (`-----` delimited).

## Mapping rule

The Google book is 637 slides in *book* order. The live Figma file is 593
slides in *deck* order. They are not the same sequence.

- **`printed` on a `business-case-template` or `gtm-template` row = Figma position**
  (1–576). That is the handle to screenshot.
- **`book` is only the Google book's index.** Do not treat it as a Figma position.
- **`cakewalk-strategy-2026`** is a Cakewalk-authored pack interleaved in the
  book. It reuses printed numbers 4–47. Those are **not** Figma 4–47.

## Collections

| `collection` | What | Figma? |
|---|---|---|
| `business-case-template` | Slideworks Business Case, rebuilt at Figma 1–270 | `printed` |
| `gtm-template` | Slideworks GTM, rebuilt at Figma 271–576 | `printed` |
| `cakewalk-strategy-2026` | Cakewalk Strategy 2026 pack in the Google book | no |
