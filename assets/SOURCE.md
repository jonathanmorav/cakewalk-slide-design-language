# Logo asset provenance

## Source

`~/cakewalk-design/packages/ui/src/v2/assets/cakewalk-logo.svg` — the wordmark shipped by
`@cakewalk-benefits/ui`. Master viewBox `0 0 180.048 30.504`, aspect ratio 5.902439.

The repo's copy fills every path with `var(--fill-0, white)`, because the design system
renders it as a **CSS mask** and paints the colour with `background: currentColor` (see
`Logo.tsx` and `.cw-v2-logo` in `globals.css`). Those CSS variables mean nothing to Figma
or to a standalone SVG, so each file here has a literal fill.

## Files

| File | Purpose |
|---|---|
| `cakewalk-wordmark-ink.svg` | The exact file imported into Figma. Ink `#1A1A2E`. |
| `cakewalk-wordmark-white.svg` | For ink, coral and photographic grounds. |
| `cakewalk-wordmark-coral.svg` | The DS `orange` tone — coral `#E8735A`. |
| `cakewalk-wordmark-currentcolor.svg` | `fill="currentColor"` for inline HTML/JSX. |
| `cakewalk-mark-{ink,white,coral}.svg` | Icon-only mark. |
| `_cakewalk-wordmark-with-cliprect.svg` | **Do not use.** Kept as the cautionary case below. |

## The mark is a crop, not a separate drawing

The icon-only mark is the wordmark's leading glyph. These files carry the *same 14 paths*
as the wordmark with the viewBox narrowed to `0 0 28 30.504` — the renderer does the
cropping. That matches how the design system does it in CSS
(`mask: url(...) left center / auto 100% no-repeat`) and how the Figma master does it
(a 28-unit frame with `clipsContent: true`). Redrawing the glyph would let the three
implementations drift.

Crop width 28 is deliberate: the `c` occupies x `0.008 → 27.198`, and the `a` begins at
x `29.04`, so 28 clears the glyph without clipping a sliver of the next letter.

## Why the clip path had to be stripped

The original SVG wraps its paths in `clip-path="url(#clip0_0_4)"`, whose `<clipPath>`
holds a full-bounds `<rect width="180.048" height="30.504" fill="white"/>`.

Figma imports that rect as an ordinary vector inside the group. `figma.flatten()` then
unions it with the letterforms and the wordmark becomes **a solid filled block** — it
renders as a rectangle, not as type. The first import failed exactly this way.

The fix is to strip `clip-path` attributes and the `<defs>` block before importing, and
to skip `flatten()` entirely — keep the 14 paths as siblings inside the frame and give
each `constraints: {horizontal: SCALE, vertical: SCALE}` so the frame resizes cleanly.

Regenerate the clean file from the repo source with:

```bash
python3 - <<'PY'
import re, pathlib
s = pathlib.Path('/Users/jonathanmorav/cakewalk-design/packages/ui/src/v2/assets/cakewalk-logo.svg').read_text()
s = s.replace('var(--fill-0, white)', '#1A1A2E')
s = re.sub(r'\s*clip-path="url\(#[^"]+\)"', '', s)
s = re.sub(r'<defs>.*?</defs>', '', s, flags=re.S)
pathlib.Path('cakewalk-wordmark-ink.svg').write_text(s)
PY
```

## Clear space and sizing

Minimum clear space on all sides equals the cap height of the wordmark. Slide sizes in
use: 24px tall in footers, 34–40px on covers, 56px on the closing slide. Never stretch —
both the wordmark (5.9024:1) and the mark (0.9174:1) are fixed ratios.
