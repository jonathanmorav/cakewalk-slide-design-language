// ─────────────────────────────────────────────────────────────────────────────
// Cakewalk slide design language — helper preamble
//
// Paste this whole file at the top of every `use_figma` build script, then write
// slide code below it. It is deliberately one flat file with no imports: the
// Figma Plugin API sandbox has no module loader, and the MCP tool takes a single
// string of code.
//
// Call use_figma with skillNames: "figma-use,figma-use-slides".
//
// THE ONE RULE THAT MATTERS: every helper here appends the node to its parent
// BEFORE setting x/y. Newly created nodes in Slides are silently auto-parented
// at absolute (240,240); writing x/y first stores the value against that hidden
// origin and the node lands at (intended − 240, intended − 240). The bug is
// intermittent — a working test is not proof you are safe. Never "fix" it by
// adding 240 back. Keep the order.
// ─────────────────────────────────────────────────────────────────────────────

const PJS = 'Plus Jakarta Sans', MONO = 'IBM Plex Mono';

await Promise.all(
  ['ExtraBold', 'Bold', 'SemiBold', 'Medium', 'Regular'].map(st => figma.loadFontAsync({ family: PJS, style: st }))
    .concat(['SemiBold', 'Medium', 'Regular'].map(st => figma.loadFontAsync({ family: MONO, style: st })))
);

// ── Palette ──────────────────────────────────────────────────────────────────
// Hexes are verbatim from cakewalk-design. Style names have no spaces
// ("ExtraBold", not "Extra Bold") — that is Plus Jakarta Sans' convention and
// differs from Inter, which is the usual source of "unloaded font" errors.
const rgb = h => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const C = {
  ink: rgb('#1A1A2E'), inkEl: rgb('#22223A'), blue900: rgb('#102B49'), blue800: rgb('#1B487A'),
  white: rgb('#FFFFFF'), sidewalk: rgb('#F3F3F0'), cream: rgb('#FBF8F2'), blush: rgb('#F5DDD6'),
  coral: rgb('#E8735A'), coral600: rgb('#C5624D'), coral300: rgb('#EF9D8C'),
  coral100: rgb('#F8D5CE'), coral50: rgb('#FCEAE6'), coral800: rgb('#743A2D'),
  blue: rgb('#3590F3'), bandBlue: rgb('#5594FF'), blue100: rgb('#C2DEFB'),
  blue50: rgb('#E1EEFD'), blue300: rgb('#72B1F7'), blue600: rgb('#2D7ACF'),
  mint: rgb('#92E7E5'), bandMint: rgb('#4CE0C6'), mint100: rgb('#DEF8F7'),
  sunny: rgb('#FFD166'), sunny100: rgb('#FFF1D1'), sunny800: rgb('#806933'),
  green: rgb('#4CAF82'), green100: rgb('#C9E7DA'), green50: rgb('#E4F3EC'), green800: rgb('#265741'),
  purple: rgb('#8D63E0'), bandPurple: rgb('#9966FF'), purple50: rgb('#F0E9FB'),
  border: rgb('#D5D5CA'), divider: rgb('#A0A0B0'), muted: rgb('#70707F'), subtle: rgb('#737385'),
  caption: rgb('#6E6E80'), light: rgb('#9292A3'), dim: rgb('#B4B4C2'), danger: rgb('#DC2626'),
  grid: rgb('#3D3D55'), ghost: rgb('#E7E7E1'), grey: rgb('#DCDCD6'), navEl: rgb('#1A3A5C'),
};

// ── The spectrum band ────────────────────────────────────────────────────────
// Signature motif, inherited from the product's
// .cw-v2-bundle-analysis-reveal__stage-card-accent. The STOP ORDER IS FIXED.
// Vertical variants rotate the gradientTransform, never the stops.
const BAND = [
  { position: 0.00, color: { r: 0.298, g: 0.878, b: 0.776, a: 1 } },
  { position: 0.10, color: { r: 0.573, g: 0.906, b: 0.898, a: 1 } },
  { position: 0.24, color: { r: 0.333, g: 0.580, b: 1.000, a: 1 } },
  { position: 0.36, color: { r: 0.208, g: 0.565, b: 0.953, a: 1 } },
  { position: 0.50, color: { r: 1.000, g: 0.820, b: 0.400, a: 1 } },
  { position: 0.66, color: { r: 0.910, g: 0.451, b: 0.353, a: 1 } },
  { position: 0.82, color: { r: 0.600, g: 0.400, b: 1.000, a: 1 } },
  { position: 0.92, color: { r: 0.553, g: 0.388, b: 0.878, a: 1 } },
  { position: 1.00, color: { r: 0.298, g: 0.878, b: 0.776, a: 1 } },
];

// ── The 88px grid ────────────────────────────────────────────────────────────
const G = {
  W: 1920, H: 1080, M: 88, CW: 1744, RIGHT: 1832,
  overlineY: 88, titleY: 124,
  tick1: 214, tick2: 266, tickStep: 52, tickOffset: 38,
  content1: 252, content2: 304,
  sourceY: 944, footerLogoY: 986, pageNumY: 990,
};

// ── Primitives ───────────────────────────────────────────────────────────────
function addFrame(p, x, y, w, h, fill, radius, stroke, sw) {
  const f = figma.createFrame(); p.appendChild(f); f.resize(w, h);
  f.fills = fill ? [{ type: 'SOLID', color: fill }] : [];
  if (radius !== undefined) f.cornerRadius = radius;
  if (stroke) { f.strokes = [{ type: 'SOLID', color: stroke }]; f.strokeWeight = sw || 1; }
  f.clipsContent = false; f.x = x; f.y = y; return f;
}
// NOTE: addRect requires a fill. For an outline-only rectangle use addORect or a
// frame with a stroke — passing null here throws
// "in set_fills: Expected object, received null at [0].color", and because failed
// scripts are ATOMIC the whole batch silently applies nothing.
function addRect(p, x, y, w, h, fill, radius, opacity) {
  const r = figma.createRectangle(); p.appendChild(r); r.resize(w, h);
  r.fills = [{ type: 'SOLID', color: fill, opacity: opacity === undefined ? 1 : opacity }];
  if (radius !== undefined) r.cornerRadius = radius;
  r.x = x; r.y = y; return r;
}
function addORect(p, x, y, w, h, stroke, radius, dash, fill) {
  const r = figma.createRectangle(); p.appendChild(r); r.resize(w, h);
  r.fills = [{ type: 'SOLID', color: fill || C.white }];
  r.strokes = [{ type: 'SOLID', color: stroke }]; r.strokeWeight = 2;
  if (dash) r.dashPattern = dash;
  if (radius !== undefined) r.cornerRadius = radius;
  r.x = x; r.y = y; return r;
}
function addEll(p, cx, cy, d, fill, stroke, sw) {
  const e = figma.createEllipse(); p.appendChild(e); e.resize(d, d);
  e.fills = fill ? [{ type: 'SOLID', color: fill }] : [];
  if (stroke) { e.strokes = [{ type: 'SOLID', color: stroke }]; e.strokeWeight = sw || 1.5; }
  e.x = cx - d / 2; e.y = cy - d / 2; return e;
}
// Vector paths are strings. A trailing comma or a malformed command throws
// "Failed to convert path. Invalid command at ," and takes the whole batch with it.
function addPath(p, data, color, weight, dash) {
  const v = figma.createVector(); p.appendChild(v);
  v.vectorPaths = [{ windingRule: 'NONE', data }];
  v.fills = []; v.strokes = [{ type: 'SOLID', color }];
  v.strokeWeight = weight || 2; v.strokeCap = 'ROUND';
  if (dash) v.dashPattern = dash; return v;
}
function grad(p, x, y, w, h, c1, c2, radius) {
  const r = figma.createRectangle(); p.appendChild(r); r.resize(w, h);
  r.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: [[1, 0, 0], [0, 1, 0]],
    gradientStops: [{ position: 0, color: { ...c1, a: 1 } }, { position: 1, color: { ...c2, a: 1 } }] }];
  if (radius !== undefined) r.cornerRadius = radius;
  r.x = x; r.y = y; return r;
}
function band(p, x, y, w, h, vertical) {
  const r = figma.createRectangle(); p.appendChild(r); r.resize(w, h); r.name = 'Cakewalk Band';
  r.fills = [{ type: 'GRADIENT_LINEAR',
    gradientTransform: vertical ? [[0, 1, 0], [-1, 0, 1]] : [[1, 0, 0], [0, 1, 0]],
    gradientStops: BAND }];
  r.x = x; r.y = y; return r;
}
function scrim(p, x, y, w, h, color) {
  const r = figma.createRectangle(); p.appendChild(r); r.resize(w, h); r.name = 'Scrim';
  r.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: [[0, 1, 0], [-1, 0, 1]], gradientStops: [
    { position: 0, color: { ...color, a: 0 } },
    { position: 0.55, color: { ...color, a: 0.72 } },
    { position: 1, color: { ...color, a: 0.94 } }] }];
  r.x = x; r.y = y; return r;
}
function diamond(p, cx, cy, size, fill) {
  const r = addRect(p, cx - size / 2, cy - size / 2, size, size, fill, 3);
  r.rotation = 45; return r;
}

// ── Text ─────────────────────────────────────────────────────────────────────
// lh and ls are PERCENT, matching the Plugin API unit — not px, not em.
// Pass `w` to get a fixed-width auto-height box (which is what you almost always
// want); omit it for an auto-width single line.
function T(p, o) {
  const t = figma.createText(); p.appendChild(t);
  t.fontName = { family: o.f || PJS, style: o.st || 'Regular' };
  t.fontSize = o.s || 21;
  if (o.lh) t.lineHeight = { unit: 'PERCENT', value: o.lh };
  if (o.ls !== undefined) t.letterSpacing = { unit: 'PERCENT', value: o.ls };
  if (o.upper) t.textCase = 'UPPER';
  if (o.ps) t.paragraphSpacing = o.ps;
  if (o.w) { t.textAutoResize = 'HEIGHT'; t.resize(o.w, 20); }
  t.characters = o.tx;
  t.fills = [{ type: 'SOLID', color: o.c || C.ink }];
  if (o.align) t.textAlignHorizontal = o.align;
  t.name = o.name || o.tx.slice(0, 24);
  t.x = o.x; t.y = o.y; return t;
}
// One text node with list options — never an ellipse plus a text node per row,
// which loses the hanging indent the moment a line wraps.
function bullets(p, o) {
  const t = T(p, o);
  t.setRangeListOptions(0, t.characters.length, { type: o.ordered ? 'ORDERED' : 'UNORDERED' });
  return t;
}

// ── Measurement ──────────────────────────────────────────────────────────────
// `text.height` on an auto-height TEXT node ALWAYS returns 20 in this
// environment, whatever the real rendered height. Never position anything from
// it. To get a true single-line width, clone the node, let it auto-size on both
// axes, read .width, and remove the clone.
function mw(t) {
  const c = t.clone(); t.parent.appendChild(c);
  c.textAutoResize = 'WIDTH_AND_HEIGHT';
  const w = c.width; c.remove(); return w;
}

// ── Brand marks ──────────────────────────────────────────────────────────────
// Two locked masters live at page level; clone and recolour rather than
// re-importing the SVG (whose clip path must be stripped first — see
// assets/SOURCE.md).
const WM = figma.currentPage.children.find(c => c.name === 'Cakewalk Wordmark (master)');
const MK = figma.currentPage.children.find(c => c.name === 'Cakewalk Mark (master)');
if (!WM || !MK) throw new Error('Logo masters missing at page level — import them first');
const WM_R = WM.width / WM.height, MK_R = MK.width / MK.height;

function logo(p, x, y, h, color) {
  const c = WM.clone(); p.appendChild(c); c.locked = false; c.resize(h * WM_R, h);
  c.findAllWithCriteria({ types: ['VECTOR'] }).forEach(v => v.fills = [{ type: 'SOLID', color }]);
  c.name = 'Cakewalk Wordmark'; c.x = x; c.y = y; return c;
}
function mark(p, x, y, h, color) {
  const c = MK.clone(); p.appendChild(c); c.locked = false; c.resize(h * MK_R, h);
  c.findAllWithCriteria({ types: ['VECTOR'] }).forEach(v => v.fills = [{ type: 'SOLID', color }]);
  c.name = 'Cakewalk Mark'; c.x = x; c.y = y; return c;
}

// ── Slide chrome ─────────────────────────────────────────────────────────────
function footer(s, num, dark) {
  logo(s, G.M, G.footerLogoY, 24, dark ? C.white : C.ink);
  T(s, { tx: String(num), f: MONO, st: 'Medium', s: 15, ls: 8,
    c: dark ? C.light : C.caption, w: 120, align: 'RIGHT', x: 1712, y: G.pageNumY });
}
function OV(p, x, y, tx, c, w, sz) {
  return T(p, { tx, f: MONO, st: 'SemiBold', s: sz || 15, ls: 12, upper: true, c: c || C.coral, w, x, y });
}
function src(s, tx, x, w, y) {
  T(s, { tx, f: MONO, st: 'Regular', s: 14, ls: 6, c: C.light, w: w || 700, x: x || G.M, y: y || G.sourceY });
}

// head() draws the eyebrow + action title + spectrum tick, and RETURNS the y at
// which content should start. It measures the title by cloning it, so a title
// that wraps to two lines pushes the tick (and therefore all content) down
// instead of colliding with it. This one function removed the most common
// defect in the whole build.
function head(s, eyebrow, title, eyebrowColour) {
  OV(s, G.M, G.overlineY, eyebrow, eyebrowColour || C.coral, 1000);
  const t = T(s, { tx: title, st: 'Bold', s: 48, lh: 122, ls: -1.5, c: C.ink, w: G.CW, x: G.M, y: G.titleY });
  const lines = Math.max(1, Math.max(title.split('\n').length, Math.ceil(mw(t) / (G.CW - 44))));
  const tickY = G.tick1 + (lines - 1) * G.tickStep;
  band(s, G.M, tickY, 96, 6);
  return tickY + G.tickOffset;
}
// Shrink-to-fit variant, for the rare title that must stay on one line.
function titleFit(s, tx, boxW) {
  const W = boxW || G.CW;
  const t = T(s, { tx, st: 'Bold', s: 48, lh: 122, ls: -1.5, c: C.ink, w: W, x: G.M, y: G.titleY });
  if (mw(t) > W) { t.fontSize = 42; if (mw(t) > W) t.fontSize = 36; }
  return t;
}

// ── Components ───────────────────────────────────────────────────────────────
function pill(p, x, y, w, h, tx, fill, color, sz) {
  const f = addFrame(p, x, y, w, h, fill, Math.round(h / 2));
  T(f, { tx, f: MONO, st: 'SemiBold', s: sz || 12, ls: 4, upper: true, c: color, w, align: 'CENTER', x: 0, y: Math.round((h - 14) / 2) });
  return f;
}
function hdr(s, x, y, w, h, label, sz, align) {
  const f = addFrame(s, x, y, w, h, C.ink, 10);
  if (label) T(f, { tx: label, f: MONO, st: 'SemiBold', s: sz || 13, ls: 8, upper: true, lh: 140,
    c: C.white, w: w - 24, align, x: 12, y: Math.round((h - 18) / 2) });
  return f;
}
function chev(p, x, y, color, w) {
  return addPath(p, `M ${x} ${y} L ${x + 12} ${y + 10} L ${x} ${y + 20}`, color || C.dim, w || 2.5);
}
function dots(p, x, y, n, color, total) {
  for (let i = 0; i < (total || 5); i++) addRect(p, x + i * 20, y, 14, 14, i < n ? color : C.border, 4);
}
function badge(s, n, x, y) {
  const c = addFrame(s, x === undefined ? 1756 : x, y === undefined ? 88 : y, 56, 56, C.coral, 28);
  T(c, { tx: String(n), f: MONO, st: 'SemiBold', s: 22, ls: 2, c: C.white, w: 56, align: 'CENTER', x: 0, y: 16 });
  return c;
}

// ── Recurring full-slide layouts ─────────────────────────────────────────────
function divider(s, num, sectionTitle, index) {
  s.fills = [{ type: 'SOLID', color: C.ink }];
  T(s, { tx: String(index), st: 'ExtraBold', s: 400, lh: 100, ls: -4, c: C.inkEl, w: 520, align: 'RIGHT', x: 1240, y: 240 });
  band(s, 0, 0, 26, 1080, true);
  band(s, 114, 404, 96, 6);
  T(s, { tx: sectionTitle, st: 'ExtraBold', s: 88, lh: 106, ls: -2, c: C.white, w: 1300, x: 114, y: 446 });
  footer(s, num, true);
}
// The What / Why / How guide slide used by every section opener.
function guide(s, num, section, title, whatTx, whatH, whyTx, howTx, howSize, whatSize, whySize) {
  s.fills = [{ type: 'SOLID', color: C.cream }];
  OV(s, G.M, G.overlineY, section + ' · Slideworks guide', C.coral, 1300);
  T(s, { tx: title, st: 'Bold', s: 48, lh: 122, ls: -1.5, c: C.ink, w: 1500, x: G.M, y: G.titleY });
  band(s, G.M, G.tick1, 96, 6);
  { const c = addFrame(s, G.M, 250, 760, whatH, C.white, 22, C.border, 1);
    OV(c, 48, 44, 'What', C.blue800, 300);
    T(c, { tx: whatTx, s: whatSize || 26, lh: 148, c: C.inkEl, w: 664, x: 48, y: 96 }); }
  { const c = addFrame(s, G.M, 250 + whatH + 24, 760, 600 - whatH, C.white, 22, C.border, 1);
    OV(c, 48, 44, 'Why', C.blue800, 300);
    T(c, { tx: whyTx, s: whySize || 24, lh: 148, c: C.inkEl, w: 664, x: 48, y: 96 }); }
  band(s, 858, 250, 6, 624, true);
  const h = addFrame(s, 876, 250, 956, 624, C.coral50, 22, C.coral300, 1);
  OV(h, 48, 44, 'How', C.coral600, 300);
  bullets(h, { tx: howTx, s: howSize || 24, lh: 150, ps: 14, c: C.inkEl, w: 840, x: 48, y: 100 });
  footer(s, num);
}
// Dashed "drop an image/screenshot here" placeholder.
function ph(s, x, y, w, h, tx) {
  const f = addFrame(s, x, y, w, h, C.white, 14, C.dim, 1.5); f.dashPattern = [10, 8];
  if (tx) T(f, { tx, f: MONO, st: 'SemiBold', s: 13, ls: 4, c: C.light, w: w - 40, align: 'CENTER', x: 20, y: Math.round(h / 2) - 9 });
  return f;
}

// ── Deck structure ───────────────────────────────────────────────────────────
// The hierarchy is SLIDE_GRID > SLIDE_ROW > MODULE > SLIDE. Rows do not hold
// slides directly, so walking row.children yields MODULE nodes with no name —
// recurse instead. SLIDE_GRID and SLIDE_ROW are opaque: never touch .fills or
// layout on them. SLIDE_ROW.name IS settable, and that is how sections are named.
function slidesOf(node) {
  const out = [];
  const walk = n => { for (const c of n.children) { if (c.type === 'SLIDE') out.push(c); else if (c.children) walk(c); } };
  walk(node); return out;
}
// figma.getSlideGrid() is STALE immediately after creating slides in the same
// call. Traverse the live row node instead, which is what newRow returns.
function newRow(name, count) {
  const grid = figma.currentPage.children.find(c => c.type === 'SLIDE_GRID');
  const i = grid.children.length;
  const row = figma.createSlideRow(i);
  row.name = name;
  for (let k = slidesOf(row).length; k < count; k++) figma.createSlide(i, k);
  const ns = slidesOf(row);
  if (ns.length !== count) throw new Error(`${name}: expected ${count} slides, got ${ns.length}`);
  return ns;
}
// Address existing slides by DECK POSITION (1-based). Layer names are not
// durable — Figma Slides resets every slide's name to its ordinal. Node ids are
// durable but file-specific. Position is both durable and portable.
function allSlides() {
  const grid = figma.currentPage.children.find(c => c.type === 'SLIDE_GRID');
  const out = []; grid.children.forEach(r => slidesOf(r).forEach(s => out.push(s))); return out;
}
// Copy a slide's contents into another slide, preserving positions.
function cloneInto(srcSlide, tgtSlide) {
  tgtSlide.fills = srcSlide.fills;
  for (const ch of srcSlide.children) { const c = ch.clone(); tgtSlide.appendChild(c); c.x = ch.x; c.y = ch.y; }
  return tgtSlide;
}
