# Working with Figma Slides through the Plugin API

Everything here is Slides-specific and differs from Design files. Load
`figma-use` and `figma-use-slides` and pass
`skillNames: "figma-use,figma-use-slides"` on every call.

## Hierarchy

```
PAGE
└── SLIDE_GRID          opaque — never touch .fills / layout
    └── SLIDE_ROW       opaque EXCEPT .name (this is how sections are named)
        └── MODULE       unnamed wrapper — you must recurse past it
            └── SLIDE    the only node that extends BaseFrameMixin
```

`row.children` yields MODULE nodes, not slides. Always recurse:

```js
function slidesOf(node) {
  const out = [];
  const walk = n => { for (const c of n.children) {
    if (c.type === 'SLIDE') out.push(c); else if (c.children) walk(c); } };
  walk(node); return out;
}
```

## Creating a section

```js
function newRow(name, count) {
  const grid = figma.currentPage.children.find(c => c.type === 'SLIDE_GRID');
  const i = grid.children.length;
  const row = figma.createSlideRow(i);
  row.name = name;                                   // sticks — unlike slide names
  for (let k = slidesOf(row).length; k < count; k++) figma.createSlide(i, k);
  const ns = slidesOf(row);
  if (ns.length !== count) throw new Error(`${name}: got ${ns.length}`);
  return ns;                                          // slide nodes, in order
}
```

`figma.getSlideGrid()` is **stale** immediately after creating slides in the same
call — that is why `newRow` traverses the row node it just made and returns the
nodes directly. Capture the returned ids; you will need them for later batches.

`figma.createPage()` throws in Slides. Use rows for structure.

## Addressing slides

| Handle | Durable? | Portable? |
|---|---|---|
| Slide layer name | **No** — Slides resets it to the ordinal | No |
| Node id | Yes | No — file-specific |
| Deck position (1-based) | Yes | Yes |

Use position. Within a build session, node ids returned from `newRow` are the
fastest handle; across sessions, position is the only reliable one.

Mapping source slide → deck position is worth making arithmetic. If a second deck
starts at position 271, define `const P = n => 270 + n;` once and every page
number in the batch is `P(sourceN)`.

## Sections

A row is a section. Names show up next to the row in the editor and in Presenter
View. Keep them short (1–3 words) and concrete; 2–5 sections is typical for a
normal deck, more for a long template. Prefix them when one file holds two decks
(`GTM · Markets`) so the two are separable at a glance.

## Speaker notes

`slide.speakerNotes` takes markdown — bullet lists and bold work; headings, code
blocks and links do not. Write them only when asked. Good notes complement the
slide (why the number moved, what question this prompts, timing cues), they do
not restate it.

## Output and limits

- `return` is the **only** output channel. `console.log` is never returned.
- `figma.notify()` throws "not implemented".
- `loadAllPagesAsync`, `setPluginData`, `createImageAsync` are unsupported.
- `get_metadata` does not work on Slides files — use a read-only script.
- Always return created/mutated node ids so the next call can reference them.
- `figma.currentPage` resets to the first page every call; the sandbox keeps no
  state between calls, so the preamble must be pasted each time.

## Screenshots

`await node.screenshot()` inline is cheaper than a separate `get_screenshot`
call. Take one after the first batch (to validate the visual system) and at
checkpoints — not per slide. Run `lib/validate.js` first; it is ~3s and tells you
which slides are worth looking at.
