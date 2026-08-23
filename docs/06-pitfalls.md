# Pitfalls

Every one of these cost real time on the 576-slide build. They are ordered by how
much damage they do if you hit them cold.

---

### 1. Append before positioning — always

Newly created nodes in Slides are silently auto-parented at absolute (240, 240).
Setting `x`/`y` before the final `appendChild` stores the value against that
hidden origin, so the node lands at (intended − 240, intended − 240).

The bug is **intermittent** — some frames in the same script escape it, so a
working test is not proof you are safe.

```js
// WRONG
const f = figma.createFrame(); f.x = 88; f.y = 252; slide.appendChild(f);
// RIGHT
const f = figma.createFrame(); slide.appendChild(f); f.resize(w, h); f.x = 88; f.y = 252;
```

Never compensate by adding 240 back — that produces worse output on the retry.
Every helper in `lib/preamble.js` enforces the order, so use them.

---

### 2. Failed scripts are atomic

If a `use_figma` script throws anywhere, **nothing** is applied. A 400-line batch
that builds five slides and dies on the last vector path leaves the file
untouched — which is good, but it means the error message is your only signal.

Read it, fix the one line, re-run the whole batch. Do not retry verbatim, and do
not start bisecting the script into smaller calls: the failure is almost always a
single malformed value.

The two that actually happened:

- `in set_vectorPaths: Failed to convert path. Invalid command at ,` — a path
  string ended `' 632,'`. A stray comma.
- `in set_fills: Expected object, received null at [0].color` — `addRect(..., null)`
  for an outline-only rectangle. `addRect` requires a fill; use `addORect` or a
  frame with a stroke.

---

### 3. `text.height` always returns 20

On an auto-height TEXT node, `.height` returns 20 regardless of the real rendered
height. Verified by returning measured heights for a whole slide: all 20.

So you cannot lay out vertically from measured text. Two ways out:

**Clone-measure** for a true single-line width:

```js
function mw(t) {
  const c = t.clone(); t.parent.appendChild(c);
  c.textAutoResize = 'WIDTH_AND_HEIGHT';
  const w = c.width; c.remove(); return w;
}
```

**Explicit position constants** when several blocks stack in one card. This is
what fixed the Business Model Canvas slide, where captions were landing on top of
body text:

```js
const OFF = { 'Key Partners': 146, 'Key Activities': 128, 'Key Resources': 128, 'Value Propositions': 180 };
```

Character-count heuristics are not good enough on their own — they flagged eight
candidate wrapped titles when only three had actually wrapped.

---

### 4. Filter nodes by name, not position alone

A patch loop written as `if (n.type !== 'FRAME' || Math.abs(n.x - 88) > 3) continue`
matched the **footer wordmark** at (88, 986) and overwrote its vector paths,
destroying the logo on that slide.

`x === 88` is the left margin: content frames, the tick, the source line and the
footer logo all live there. Always add the name:

```js
if (n.name === 'Cakewalk Wordmark') continue;
```

Same applies in reverse — when you *want* the footer, key on the name or on the
full slot (x ≈ 1712 **and** y ≈ 990), not on one coordinate.

---

### 5. `figma.getSlideGrid()` is stale after creating slides

Immediately after `figma.createSlide()` in the same call, `getSlideGrid()` still
returns the old structure. Traverse the live row node instead:

```js
function slidesOf(node) {
  const out = [];
  const walk = n => { for (const c of n.children) {
    if (c.type === 'SLIDE') out.push(c); else if (c.children) walk(c); } };
  walk(node); return out;
}
```

Note the hierarchy: **SLIDE_GRID > SLIDE_ROW > MODULE > SLIDE**. Rows do not hold
slides directly, so `row.children` yields MODULE nodes with no `.name` — you must
recurse.

---

### 6. Slide layer names are not durable

Figma Slides owns that field and resets every slide's name to its ordinal
("1", "2", …). Writing them is wasted work.

- **Node ids** are durable but file-specific.
- **Deck position** (1-based) is both durable and portable.

Address slides by position. `SLIDE_ROW.name` *is* settable and is how sections get
their names — that one sticks.

---

### 7. `SLIDE_GRID` and `SLIDE_ROW` are opaque

Do not read or write `.fills`, `.effects` or layout properties on them. Only
`SLIDE` extends `BaseFrameMixin`. The single exception is `SLIDE_ROW.name`.

Also: `figma.createPage()` throws in Slides — it is a Design-file API. Use the
slide grid for structure.

---

### 8. Page numbers drift silently

Footer numbers are literal strings in build scripts. Insert one slide and every
number after it is wrong, and nothing in Figma notices.

Run `lib/renumber.js` (dry-run first) after any insert, delete or reorder. It
re-derives every number from actual position and reports slides that carry no
number by design rather than inventing one.

Inserting the reference deck's own front matter at the front, then renumbering
once, is what made `deck position === source slide number` hold across 270
slides — which removed drift risk from every subsequent batch.

---

### 9. `get_metadata` does not work on Slides files

It only supports the `figma` (Design) editor type. Your only structural check is
a read-only `use_figma` script — that is what `lib/validate.js` is. Run it after
every batch (~3s, free), and screenshot only what it flags.

---

### 10. Title wraps collide with the tick

The recurring visual defect. A title you expected on one line wraps to two and
lands on the 96×6 spectrum tick.

Do not solve it per-slide. Use `head()`, which clone-measures the title, derives
the line count, drops the tick 52px per extra line, and returns the content y.
`lib/validate.js` re-checks the whole deck for it.

For the rare title that must stay on one line, `titleFit()` steps 48 → 42 → 36.

---

### 11. Batch size and rate limits

The Figma MCP server capped out once mid-build. The cap follows the **file's
team**, not your seat — a different file in another team kept working.

Build **4–6 slides per call**. One call per slide burns the budget on overhead;
much larger batches make an atomic failure expensive to re-run. Paste the
preamble at the top of every call — the sandbox does not persist state between
calls, and `figma.currentPage` resets to the first page each time.

---

### 12. Things that are simply not available

- `figma.notify()` throws "not implemented".
- `console.log()` output is never returned — `return` is the only output channel.
- `loadAllPagesAsync`, `setPluginData`, `createImageAsync` are unsupported.
- Rotation on text is fragile; for a vertical axis label prefer a horizontal
  label plus an arrow, or a gradient bar with the label above it.

---

### 13. Where reference-deck text loses information

A plain-text export flattens z-order into reading order. On complex slides the
labels and their values arrive interleaved or out of sequence, and you have to
infer the grouping.

Three concrete cases from the GTM build:

- A seven-metric cockpit table where only two rows had values — assigning them
  to the right metrics is a judgement call.
- Fifteen pain points across three customer groups — row-major or column-major is
  not recoverable from the dump.
- Six touchpoint stages where only four carried a trailing `…`.

Keep the wording verbatim and make the grouping call explicitly, then **tell the
reader you made it**. Do not quietly normalise.
