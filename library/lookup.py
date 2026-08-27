#!/usr/bin/env python3
"""Rank Template Book slides for an ask.

    python3 library/lookup.py "pipeline conversion scorecard"
    python3 library/lookup.py --archetype gantt
    python3 library/lookup.py --section "GTM · Markets"
    python3 library/lookup.py --printed 115
    python3 library/lookup.py --json "2x2 competitive position"

Pick the top match, then screenshot that Figma position. Do not copy Slideworks
chrome — Cakewalk layout, same instructional intent. See library/README.md.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CATALOG = ROOT / "catalog.json"
STOP = {
    "the", "and", "for", "with", "from", "that", "this", "your", "into", "a",
    "an", "of", "to", "in", "on", "is", "it", "or", "as", "be", "we", "our",
}

# Ask-language → catalog archetype. "2x2" is never stored as a title.
ARCH_ALIASES = {
    "2x2": "matrix-2x2",
    "2by2": "matrix-2x2",
    "quadrant": "matrix-2x2",
    "matrix": "matrix-2x2",
    "swot": "matrix-swot",
    "scorecard": "scorecard",
    "kpi": "scorecard",
    "kpis": "scorecard",
    "cockpit": "scorecard",
    "gantt": "gantt",
    "roadmap": "gantt",
    "timeline": "gantt",
    "funnel": "funnel",
    "waterfall": "waterfall",
    "org": "org",
    "raci": "org",
    "agenda": "agenda",
    "checklist": "checklist",
    "ganttchart": "gantt",
}


def load() -> dict:
    if not CATALOG.exists():
        sys.exit(f"missing {CATALOG} — run python3 library/ingest.py <dump>")
    return json.loads(CATALOG.read_text(encoding="utf-8"))


def tokens(q: str) -> list[str]:
    return [w for w in re.findall(r"[a-z0-9][a-z0-9%]{1,}", q.lower()) if w not in STOP]


def score(entry: dict, query: str, qtoks: list[str]) -> int:
    title = entry["title"].lower()
    keys = {k.lower() for k in entry.get("keywords") or []}
    lines = " ".join(entry.get("first_lines") or []).lower()
    arch = entry.get("archetype", "").lower()
    section = entry.get("section", "").lower()
    blob = f"{title} {arch} {section} {lines}"

    s = 0
    if query and query.lower() in title:
        s += 24
    if query and query.lower() in blob:
        s += 6
    wanted = {ARCH_ALIASES[t] for t in qtoks if t in ARCH_ALIASES}
    if arch in wanted:
        s += 18
    for t in qtoks:
        if t == arch or t == arch.replace("-", "") or ARCH_ALIASES.get(t) == arch:
            s += 14
        elif t in keys:
            s += 8
        elif t in title.split() or t in title:
            s += 7
        elif t in section:
            s += 4
        elif t in lines:
            s += 3
    if query.isdigit():
        n = int(query)
        if entry.get("figma_position") == n or entry.get("printed") == n:
            s += 40
        if entry.get("book") == n:
            s += 30
    # Prefer a live Figma screenshot target, but never as a free pass.
    if s > 0 and entry.get("figma_position"):
        s += 2
    if s > 0 and entry.get("role") == "guide":
        s -= 1
    return s


def render(rows: list[tuple[int, dict]], source: dict) -> str:
    out = [
        f"{len(rows)} matches · Figma {source.get('figma_file')} · "
        f"book {source.get('drive_id')}",
        "",
        f"{'sc':>3}  {'pos':>5}  {'book':>4}  {'arch':<18} {'role':<8} title",
        "-" * 88,
    ]
    for sc, e in rows:
        pos = e["figma_position"] if e.get("figma_position") else "—"
        out.append(
            f"{sc:3}  {str(pos):>5}  {e['book']:4}  {e['archetype']:<18} {e['role']:<8} {e['title']}"
        )
    if rows:
        top = rows[0][1]
        out += [
            "",
            "Top match",
            f"  title:     {top['title']}",
            f"  archetype: {top['archetype']}  ({top['when_to_use']})",
            f"  section:   {top['section']}",
            f"  figma:     {top['figma_position'] or 'none — same-archetype template below, then screenshot that'}",
            f"  book:      {top['book']}  printed {top['printed']}",
        ]
        if top.get("first_lines"):
            preview = " | ".join(top["first_lines"][:3])
            out.append(f"  preview:   {preview[:160]}")
        if top.get("figma_position"):
            out.append(
                f"  next:      screenshot Figma position {top['figma_position']} "
                f"in {source.get('figma_file')}, then build in Cakewalk language"
            )
    return "\n".join(out)


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("query", nargs="*", help="Natural-language ask")
    p.add_argument("--archetype", help="Exact archetype filter (scorecard, gantt, matrix-2x2, …)")
    p.add_argument("--section", help="Substring match on STATE.md section name")
    p.add_argument("--role", help="template | case | guide | chrome | example")
    p.add_argument("--collection", help="business-case-template | gtm-template | cakewalk-strategy-2026")
    p.add_argument("--printed", type=int, help="Figma / printed page number")
    p.add_argument("--book", type=int, help="Google book index 1–637")
    p.add_argument("--limit", type=int, default=12)
    p.add_argument("--json", action="store_true")
    p.add_argument("--catalog", type=Path, default=CATALOG)
    args = p.parse_args()

    catalog = json.loads(args.catalog.read_text(encoding="utf-8")) if args.catalog != CATALOG else load()
    slides = catalog["slides"]
    query = " ".join(args.query).strip()
    qtoks = tokens(query)

    hits = []
    for e in slides:
        if args.archetype and e.get("archetype") != args.archetype:
            continue
        if args.section and args.section.lower() not in (e.get("section") or "").lower():
            continue
        if args.role and e.get("role") != args.role:
            continue
        if args.collection and e.get("collection") != args.collection:
            continue
        if args.printed is not None and e.get("printed") != args.printed and e.get("figma_position") != args.printed:
            continue
        if args.book is not None and e.get("book") != args.book:
            continue
        sc = score(e, query, qtoks) if (query or qtoks) else 1
        if query or qtoks:
            if sc <= 0:
                continue
        hits.append((sc, e))

    hits.sort(key=lambda pair: (-pair[0], pair[1]["figma_position"] is None, pair[1]["book"]))
    # De-dupe identical title+archetype+figma, keep best score.
    seen: set[tuple] = set()
    uniq: list[tuple[int, dict]] = []
    for sc, e in hits:
        key = (e["title"].lower(), e["archetype"], e.get("figma_position"))
        if key in seen:
            continue
        seen.add(key)
        uniq.append((sc, e))
        if len(uniq) >= args.limit:
            break

    if args.json:
        print(json.dumps({
            "query": query,
            "count": len(uniq),
            "matches": [{**e, "score": sc} for sc, e in uniq],
        }, indent=2))
        return
    if not uniq:
        print("No matches. Try a shorter ask, --archetype, or read library/archetypes.md")
        sys.exit(1)
    print(render(uniq, catalog.get("source") or {}))


if __name__ == "__main__":
    main()
