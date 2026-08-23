// ─────────────────────────────────────────────────────────────────────────────
// Read-only deck validator. Paste into use_figma; it creates and mutates nothing
// (the title measurement clones a node and removes it again).
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

const empty = [], badPage = [], noFooter = [], oob = [], overlaps = [], clipped = [], titleHits = [];

for (const { pos, node: slide } of targets) {
  if (slide.children.length === 0) { empty.push(pos); continue; }

  // Page number must equal deck position. Keyed on the footer mono node's slot,
  // NOT on "the text at x=1712" alone — see the name-vs-position pitfall.
  const pn = slide.children.find(c => c.type === 'TEXT' && Math.abs(c.x - 1712) < 5 && Math.abs(c.y - 990) < 5);
  if (!pn) badPage.push(`${pos}: missing`);
  else if (pn.characters !== String(pos)) badPage.push(`${pos}: shows "${pn.characters}"`);

  // Filter by NAME. Filtering the footer wordmark by position alone (x===88)
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
  const t = slide.children.find(c => c.type === 'TEXT' && Math.abs(c.x - 88) < 3 && Math.abs(c.y - 124) < 3 && c.fontSize >= 36);
  const tick = slide.children.find(c => c.name === 'Cakewalk Band' && Math.abs(c.x - 88) < 3 && Math.abs(c.width - 96) < 3);
  if (t && tick) {
    const cl = t.clone(); slide.appendChild(cl); cl.textAutoResize = 'WIDTH_AND_HEIGHT';
    const w1 = cl.width; cl.remove();
    const lines = Math.max(t.characters.split('\n').length, Math.ceil(w1 / t.width));
    const bottom = 124 + lines * t.fontSize * 1.22;
    if (bottom > tick.y - 2)
      titleHits.push({ pos, size: t.fontSize, measured: Math.round(w1), box: Math.round(t.width), lines, bottom: Math.round(bottom), tickY: Math.round(tick.y) });
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
  overlaps: overlaps.slice(0, 30), overlapCount: overlaps.length,
  textClipped: clipped.slice(0, 30), textClippedCount: clipped.length,
};
