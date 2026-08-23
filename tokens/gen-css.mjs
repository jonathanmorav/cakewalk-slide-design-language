// Regenerates tokens.css from tokens.json so the two cannot drift.
// Run: node tokens/gen-css.mjs
import fs from 'node:fs';
import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname);
const t = JSON.parse(fs.readFileSync(path.join(here, 'tokens.json'), 'utf8'));
const kebab = s => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

let out = `/* Cakewalk slide-deck brand tokens.
   GENERATED from tokens.json — run \`node tokens/gen-css.mjs\` after editing.
   Naming mirrors the product design system (--cw-v2-color-*) so these values can
   be dropped into a Cakewalk app without translation. */

:root {
  /* Core colour */
`;
for (const [k, v] of Object.entries(t.color)) out += `  --cw-v2-color-${kebab(k)}: ${v};\n`;
for (const [name, ramp] of Object.entries(t.ramp)) {
  out += `\n  /* ${name} ramp */\n`;
  for (const [step, v] of Object.entries(ramp)) out += `  --cw-v2-color-${name}-${step}: ${v};\n`;
}
out += `\n  /* Type */\n`;
out += `  --cw-font-sans: '${t.fontFamily.sans}', ${t.fontFamily.sansFallback};\n`;
out += `  --cw-font-mono: '${t.fontFamily.mono}', ${t.fontFamily.monoFallback};\n`;
out += `\n  /* Radius */\n`;
for (const [k, v] of Object.entries(t.radius)) out += `  --cw-radius-${k}: ${v}px;\n`;
out += `\n  /* Spacing */\n`;
for (const [k, v] of Object.entries(t.spacing)) out += `  --cw-space-${k}: ${v}px;\n`;
out += `\n  /* Signature spectrum band — stop order is fixed */\n  --cw-band: linear-gradient(90deg,\n`;
out += t.spectrumBand.stops.map(s => `    ${s.color} ${(s.position * 100).toFixed(0)}%`).join(',\n');
out += `\n  );\n}\n\n`;
out += `/* Slide-scale type ramp (1920×1080). Presentation scale, not the product UI\n   ramp — compare productType in tokens.json. */\n`;
for (const [k, v] of Object.entries(t.slideType)) {
  const fam = v.family === 'mono' ? 'var(--cw-font-mono)' : 'var(--cw-font-sans)';
  out += `.cw-slide-${kebab(k)} { font-family: ${fam}; font-size: ${v.size}px; line-height: ${v.lh}%; letter-spacing: ${v.ls / 100}em;`;
  if (v.textCase === 'UPPER') out += ' text-transform: uppercase;';
  out += ' }\n';
}
fs.writeFileSync(path.join(here, 'tokens.css'), out);
console.log(`tokens/tokens.css written — ${out.split('\n').length} lines`);
