# Export

The only export is an **editable PowerPoint** (`.pptx`) on Jonathan's machine.

```
~/Cakewalk/slides/
```

Override with `CAKEWALK_EXPORT_DIR` if that folder ever moves. Do not put
PowerPoints in this repo, in `~/cakewalk-slide-template/export/`, or in Google
as the first stop.

## What counts

| Allowed | Forbidden |
|---|---|
| Figma Slides **File → Export slides to → PPTX** | SVG of a slide |
| Structure: **convert all objects to editable PPTX equivalent** | PNG of a slide, as a deliverable |
| One `.pptx` in `~/Cakewalk/slides/` | Flatten-to-bitmap PPTX (pictures on slides) |
| | PDF, JPG, or a zip of images |
| | `python-pptx` / zip wrappers around PNG or SVG |

If the file is not an editable PowerPoint, **do not export**. Critique
screenshots (`get_screenshot`, `node.screenshot()`) stay diagnostic. They are
not a ship path.

## How — Figma does it; the agent does not

There is no PPTX in the Figma MCP or the Plugin API. `download_assets` is
`png | jpg | svg | pdf`. `exportAsync` is the same set. `use_figma` cannot
open the File menu. A Cloud Agent cannot write to Jonathan's Mac.

The path that exists:

1. Open the deck in Figma Slides (desktop app, so you pick the folder).
   Library file: `https://www.figma.com/slides/UtxFDFaTR9GDTRcqIOKlOy`.
2. Main menu → **File → Export slides to**.
3. File type: **PPTX**.
4. Content: all slides, or the selection.
5. Structure: **convert all objects to editable PPTX equivalent**.
   Never "flatten shapes and images into bitmap".
6. Export. Save as:

| Deck | Filename |
|---|---|
| Library template (`UtxFDFaTR9GDTRcqIOKlOy`) | `Cakewalk-Slide-Template.pptx` |
| Meeting pack | `YYYY-MM-DD-<slug>.pptx` |

Help article: [Export from Figma Slides](https://help.figma.com/hc/en-us/articles/24848334599447-Export-from-Figma-Slides).

## What the official export drops

Figma's own list. Say these out loud; do not paper over them with a PNG.

- **Gradient fills become solid.** The spectrum band will not survive as a
  gradient. That is still better than a picture of the band.
- **Missing fonts fall back** to PowerPoint's default. Plus Jakarta Sans and
  IBM Plex Mono must be installed on the machine that opens the `.pptx`.
- Live interactions and code blocks become images. Cakewalk decks almost
  never have those.

## What the agent does

1. Critique is go. If it was no-go, stop.
2. Read `export_to` on the brief / `decks/<slug>/STATE.md`. Default dest is
   `~/Cakewalk/slides/<filename>.pptx`.
3. Do **not** call `download_assets`, do **not** assemble a pptx from images,
   do **not** rclone a picture-deck into Drive.
4. Give Jonathan the six steps above, the exact save path, and the three
   losses. Then stop.
5. Record the path (and whether he confirmed the file landed) on the right
   `STATE.md`.

A local agent sitting on Jonathan's Mac still cannot fire the File menu.
Same steps. Same folder.

## Google is not export

Drive cannot write slide bodies. Opening the `.pptx` in Google Slides is a
later, optional conversion — only after the editable PowerPoint exists on
disk, and only if Jonathan asked. Never PNG-and-place into a Google deck.
