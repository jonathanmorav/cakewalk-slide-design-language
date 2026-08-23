// ─────────────────────────────────────────────────────────────────────────────
// Re-derive every printed footer page number from actual deck position.
//
// Run this after ANY insert, delete or reorder. Page numbers are written as
// literal strings inside build scripts, so inserting one slide makes every
// number after it drift — and nothing in Figma notices.
//
// Keyed on the footer mono node's SLOT (x≈1712, y≈990), not on "a text node
// near the right edge": several layouts put right-aligned mono there too.
//
// Slides that carry no page number by design (some covers and dividers) are
// reported and left alone rather than silently given one.
// ─────────────────────────────────────────────────────────────────────────────

const MONO = 'IBM Plex Mono';
await figma.loadFontAsync({ family: MONO, style: 'Medium' });

// Set OFFSET when a deck's printed numbering does not start at 1 — e.g. two
// templates sharing one file, where deck 2 starts at position 271 but should
// print 1..306. OFFSET is subtracted from position.
const OFFSET = 0;
const DRY_RUN = true;   // flip to false to write

// Footer slot per grid, and whether that grid zero-pads to two digits.
const GRID = 'g88';    // 'g88' (current) | 'g128' (legacy)
const GRIDS = { g88: { x: 1712, y: 990, pad: 0 }, g128: { x: 1672, y: 966, pad: 2 } };
const g = GRIDS[GRID];
if (!g) throw new Error(`unknown GRID "${GRID}"`);

function slidesOf(node) {
  const out = [];
  const walk = n => { for (const c of n.children) { if (c.type === 'SLIDE') out.push(c); else if (c.children) walk(c); } };
  walk(node); return out;
}
const grid = figma.currentPage.children.find(c => c.type === 'SLIDE_GRID');
const all = []; grid.children.forEach(r => slidesOf(r).forEach(s => all.push(s)));

const changed = [], missing = [], ok = [];
all.forEach((s, i) => {
  const want = String(i + 1 - OFFSET).padStart(g.pad, '0');
  const pn = s.children.find(c => c.type === 'TEXT' && Math.abs(c.x - g.x) < 5 && Math.abs(c.y - g.y) < 5);
  if (!pn) { missing.push(i + 1); return; }
  if (pn.characters === want) { ok.push(i + 1); return; }
  changed.push({ pos: i + 1, from: pn.characters, to: want });
  if (!DRY_RUN) pn.characters = want;
});

return { dryRun: DRY_RUN, grid: GRID, total: all.length, offset: OFFSET,
  wouldChange: changed.length, changed: changed.slice(0, 60),
  noPageNumber: missing, alreadyCorrect: ok.length };
