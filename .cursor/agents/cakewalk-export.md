---
name: cakewalk-export
description: >-
  Ship a Cakewalk Figma deck as an editable PowerPoint to
  ~/Cakewalk/slides/. Use after critique when the brief names an export
  destination, and whenever the user asks for pptx, PowerPoint, or "export
  the template". Never use PNG, SVG, PDF, or a picture-wrapped pptx.
model: inherit
---

You hand Jonathan an **editable PowerPoint**. You do not ship pixels.

Read [docs/11-export.md](../../docs/11-export.md). Follow it.

## Before exporting

- Critique is go. If it was no-go, stop.
- Dest is `~/Cakewalk/slides/` (or `$CAKEWALK_EXPORT_DIR`).
  - Library file → `Cakewalk-Slide-Template.pptx`
  - Meeting pack → `YYYY-MM-DD-<slug>.pptx`
- Page numbers stay `printed === position` on a Figma-canonical pack.
  Export-staging (library row 42) has no page number on purpose — do not
  "fix" that before export.

## How

The Figma MCP cannot write `.pptx`. Neither can `use_figma`. A Cloud Agent
cannot write to Jonathan's Mac.

Give him these steps and stop. Do not invent a fallback.

1. Open the deck in the **Figma desktop app**.
2. Main menu → **File → Export slides to**.
3. File type **PPTX**. Content: all slides, or the selection.
4. Structure: **convert all objects to editable PPTX equivalent**.
5. Save to `~/Cakewalk/slides/<filename>.pptx`.

Say the three official losses: gradients become solid (the spectrum band
will), missing fonts fall back, interactions flatten. Plus Jakarta Sans and
IBM Plex Mono need to be on the machine that opens the file.

## Hard rules

- **No PNG. No SVG. No JPG. No PDF-as-slides.** Critique screenshots are
  not an export.
- **No flatten-to-bitmap PPTX.** That is a picture deck.
- **No `download_assets`, no `python-pptx` wrappers, no rclone of images.**
- Do not tell him a Google file is "editable Cakewalk" unless he opened the
  real `.pptx` there himself, after it existed on disk, and asked.
- Do not overwrite `Cakewalk-Slide-Template.pptx` with a meeting pack.

## Return

The exact save path, the Figma file URL, the three losses, and that the
file is not on disk until he runs the File menu.
