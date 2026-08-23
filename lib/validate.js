// ─────────────────────────────────────────────────────────────────────────────
// Deck validator. Paste into use_figma.
//
// Effectively read-only: the only mutation is the title measurement, which clones
// a text node, reads its width and removes the clone. That clone sets
// textAutoResize, and ANY write to a text node requires its font to be loaded —
// hence the loadFontAsync block below. Without it the validator dies with
// "Cannot write to node with unloaded font".
//
// Two modes:
//   MODE = 'deck'   audit the whole file — run before you call a deck finished
//   MODE = 'batch'  audit just the slides you built — run after every batch
//
// `get_metadata` does NOT work on Slides files, so this is the only structural
// check available. Screenshots catch what geometry cannot; run this first because
// it is ~3s and free, then screenshot only what it flags.
// ─────────────────────────────────────────────────────────────────────────────

const MODE = 'deck';
const POSITIONS = [];            // batch mode: 1-based deck positions to check
const EXPECT_TOTAL = null;       // deck mode: set to assert an exact slide count

// Which grid the slides were built on. The footer slot and title origin differ,
// so checking 88px coordinates against a 128px deck reports every slide as
// "missing a page number".
const GRID = 'g88';             // 'g88' (current) | 'g128' (legacy)
const GRIDS = {
  g88:  { pageX: 1712, pageY: 990, titleX: 88,  titleY: 124, margin: 88 },
  g128: { pageX: 1672, pageY: 966, titleX: 128, titleY: 144, margin: 128 },
};
const g = GRIDS[GRID];
if (!g) throw new Error(`unknown GRID "${GRID}" — use 'g88' or 'g128'`);

// Required before the clone-measure below can touch any text node.
await Promise.all(
  ['ExtraBold', 'Bold', 'SemiBold', 'Medium', 'Regular'].map(st => figma.loadFontAsync({ family: 'Plus Jakarta Sans', style: st }))
    .concat(['SemiBold', 'Medium', 'Regular'].map(st => figma.loadFontAsync({ family: 'IBM Plex Mono', style: st })))
);

const OVERLAP_PX = 6, OVERFLOW_PX = 2, SLIDE_W = 1920, SLIDE_H = 1080;

function slidesOf(node) {
  const out = [];
  const walk = n => { for (const c of n.children) { if (c.type === 'SLIDE') out.push(c); else if (c.children) walk(c); } };
  walk(node); return out;
}
const grid = figma.currentPage.children.find(c => c.type === 'SLIDE_GRID');
const rows = grid.children.map((r, i) => ({ row: i, name: r.name, slides: slidesOf(r) }));
const all = []; rows.forEach(r => r.slides.forEach(s => all.push(s)));

const targets = MODE === 'batch'
  ? POSITIONS.map(p => { const s = all[p - 1]; if (!s) throw new Error(`position ${p} out of range — deck has ${all.length}`); return { pos: p, node: s }; })
  : all.map((s, i) => ({ pos: i + 1, node: s }));

const empty = [], badPage = [], noFooter = [], oob = [], overlaps = [], clipped = [], titleHits = [], unmeasured = [];

for (const { pos, node: slide } of targets) {
  if (slide.children.length === 0) { empty.push(pos); continue; }

  // Page number must equal deck position. Keyed on the footer mono node's slot,
  // NOT on "the text at x=1712" alone — see the name-vs-position pitfall.
  const pn = slide.children.find(c => c.type === 'TEXT' && Math.abs(c.x - g.pageX) < 5 && Math.abs(c.y - g.pageY) < 5);
  if (!pn) badPage.push(`${pos}: missing`);
  // Legacy decks zero-pad to two digits.
  else if (pn.characters !== String(pos) && pn.characters !== String(pos).padStart(2, '0'))
    badPage.push(`${pos}: shows "${pn.characters}"`);

  // Filter by NAME. Filtering the footer wordmark by position alone (x === margin)
  // once matched a content frame and destroyed the logo's vector paths.
  if (!slide.children.some(c => c.name === 'Cakewalk Wordmark')) noFooter.push(pos);

  for (const c of slide.children) {
    // The bleeding brand mark is clipped off the slide edge by design.
    if (c.name === 'Cakewalk Mark') continue;
    if (c.x < -2 || c.y < -2 || c.x + c.width > SLIDE_W + 2 || c.y + c.height > SLIDE_H + 2)
      oob.push(`${pos} ${c.name} @${Math.round(c.x)},${Math.round(c.y)} ${Math.round(c.width)}x${Math.round(c.height)}`);
  }

  // Action title vs spectrum tick. This is the defect that recurs most: a title
  // that wraps to an unexpected second line lands on top of the 96x6 tick.
  // Measure the real single-line width by cloning — text.height is useless here.
  const t = slide.children.find(c => c.type === 'TEXT' && Math.abs(c.x - g.titleX) < 3 && Math.abs(c.y - g.titleY) < 3 && c.fontSize >= 36);
  const tick = slide.children.find(c => c.name === 'Cakewalk Band' && Math.abs(c.x - g.margin) < 3 && Math.abs(c.width - 96) < 3);
  if (t && tick) {
    let w1 = null;
    try {
      const cl = t.clone(); slide.appendChild(cl); cl.textAutoResize = 'WIDTH_AND_HEIGHT';
      w1 = cl.width; cl.remove();
    } catch (e) { unmeasured.push({ pos, why: String(e.message || e).slice(0, 90) }); }
    if (w1 !== null) {
      const lines = Math.max(t.characters.split('\n').length, Math.ceil(w1 / t.width));
      const bottom = g.titleY + lines * t.fontSize * 1.22;
      if (bottom > tick.y - 2)
        titleHits.push({ pos, size: t.fontSize, measured: Math.round(w1), box: Math.round(t.width), lines, bottom: Math.round(bottom), tickY: Math.round(tick.y) });
    }
  }

  if (MODE === 'batch') {
    const kids = slide.children.map(c => ({ name: c.name, type: c.type, x: c.x, y: c.y, w: c.width, h: c.height, node: c }));
    for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) {
      const a = kids[i], b = kids[j];
      if (/Cakewalk Mark|Cakewalk Band|Scrim/.test(a.name) || /Cakewalk Mark|Cakewalk Band|Scrim/.test(b.name)) continue;
      const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (ox >= OVERLAP_PX && oy >= OVERLAP_PX)
        overlaps.push({ pos, nodes: [a.name, b.name], ox: Math.round(ox), oy: Math.round(oy) });
    }
    for (const c of kids) {
      if (c.type !== 'FRAME') continue;
      for (const tx of c.node.findAllWithCriteria({ types: ['TEXT'] })) {
        const ab = tx.absoluteBoundingBox, pb = c.node.absoluteBoundingBox;
        if (!ab || !pb) continue;
        if (ab.x + ab.width > pb.x + pb.width + OVERFLOW_PX || ab.y + ab.height > pb.y + pb.height + OVERFLOW_PX)
          clipped.push({ pos, node: tx.name, parent: c.name });
      }
    }
  }
}

const countOK = EXPECT_TOTAL === null || all.length === EXPECT_TOTAL;
return {
  mode: MODE,
  grid: GRID,
  total: all.length,
  expected: EXPECT_TOTAL,
  countOK,
  rowCount: grid.children.length,
  sections: rows.map(r => ({ row: r.row, name: r.name, n: r.slides.length })),
  clean: countOK && !empty.length && !badPage.length && !noFooter.length && !oob.length && !overlaps.length && !clipped.length && !titleHits.length,
  empty,
  badPageNumbers: badPage.slice(0, 40), badPageCount: badPage.length,
  missingFooter: noFooter.slice(0, 40), missingFooterCount: noFooter.length,
  outOfBounds: oob.slice(0, 30), outOfBoundsCount: oob.length,
  titleTickCollisions: titleHits,
  titlesUnmeasured: unmeasured,
  overlaps: overlaps.slice(0, 30), overlapCount: overlaps.length,
  textClipped: clipped.slice(0, 30), textClippedCount: clipped.length,
};
