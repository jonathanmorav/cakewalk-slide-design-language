# Template Book source

## The Google file

```
https://docs.google.com/presentation/d/1MfXm8Oue_aOWF_qwXvlb1F2JU8xRobCWgnpwGdM3tho
id        1MfXm8Oue_aOWF_qwXvlb1F2JU8xRobCWgnpwGdM3tho
title     Cakewalk Slide Template Book
mime      application/vnd.google-apps.presentation
slides    637
```

It is the two Slideworks consulting templates (Business Case + GTM) compiled
into one Google Slides “book,” plus a Cakewalk Strategy 2026 pack and a few
repeats. It is **not** a second live deck and it is **not** in Figma order.

## The Figma file (visual source of truth)

```
https://www.figma.com/slides/UtxFDFaTR9GDTRcqIOKlOy/Cakewalk-Slide-Template---Revamp
fileKey   UtxFDFaTR9GDTRcqIOKlOy
```

Positions 1–576 are those same two templates, rebuilt in the Cakewalk language.
Printed page number === deck position. Screenshot here; do not rebuild the
Google book.

## What this repo holds

The catalog (`catalog.json`, `archetypes.md`) is a **text index** derived from a
Drive `text/plain` export. It is enough to pick a type. It is not enough to
recreate a slide — for that, screenshot the Figma position.

## What this repo does not hold

The raw export (~365 KB of verbatim Slideworks copy) stays out of git.

```
library/dumps/     gitignored local copies
```

Third-party source dumps for the original rebuild also live outside this repo
(`~/cakewalk-slide-template/reference/`). Same rule: do not commit them.

## Re-export

Drive MCP `download_file_content` with `exportMimeType: text/plain` returns JSON
`{ id, title, mimeType, content }` where `content` is base64. Save that as
`library/dumps/book.json` and run `python3 library/ingest.py` on it.

That export is **not** the same shape as Google Slides **File ▸ Download ▸
Plain text**. `lib/extract.py` reads the File-download form (`-----`
delimiters). `library/ingest.py` accepts both.

Known gaps in the Drive text export: a few slides are image-only or skipped and
do not appear as their own rows. Re-ingest after a new export; do not hand-edit
`catalog.json`.
