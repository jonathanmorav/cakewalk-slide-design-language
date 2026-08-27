#!/usr/bin/env python3
"""Build library/catalog.json and library/archetypes.md from a Template Book dump.

Accepts any of:
  - Drive MCP download_file_content JSON ({id, title, mimeType, content: base64})
  - Decoded Drive text/plain export
  - Google Slides File ▸ Download ▸ Plain text (----- delimited; same as lib/extract.py)

The catalog is an index, not a dump. Bodies stay off disk except a few first_lines.
"""
from __future__ import annotations

import argparse
import base64
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DRIVE_ID = "1MfXm8Oue_aOWF_qwXvlb1F2JU8xRobCWgnpwGdM3tho"
FIGMA_FILE = "UtxFDFaTR9GDTRcqIOKlOy"
FIGMA_URL = f"https://www.figma.com/slides/{FIGMA_FILE}/Cakewalk-Slide-Template---Revamp"
DRIVE_URL = f"https://docs.google.com/presentation/d/{DRIVE_ID}/edit"

# Printed page → Figma 1–576 section. Copied from STATE.md rows 0–39.
SECTIONS = [
    (1, 10, "Cover and template overview"),
    (11, 19, "I. Best-practice guide"),
    (20, 27, "Front pages and content"),
    (28, 37, "Executive summary"),
    (38, 46, "Background and context"),
    (47, 68, "What is the problem / opportunity?"),
    (69, 81, "High-level solution and vision"),
    (82, 92, "Options analysis"),
    (93, 113, "Recommended solution · Solution details"),
    (114, 123, "Recommended solution · Benefits"),
    (124, 136, "Recommended solution · Costs and ROI"),
    (137, 154, "Implementation plan"),
    (155, 166, "Risks and mitigations"),
    (167, 180, "Governance and monitoring"),
    (181, 186, "Recommendations and next steps"),
    (187, 193, "Appendix"),
    (194, 218, "IIIa. Case — Project Rocketship"),
    (219, 248, "IIIb. Case — Lifting our employees"),
    (249, 262, "IIIc. Case example — EnergyCo"),
    (263, 270, "Appendix B — Checklist and best practices"),
    (271, 280, "GTM · Cover and template overview"),
    (281, 288, "GTM · I. Best-practice guide"),
    (289, 296, "GTM · Front pages and content"),
    (297, 300, "GTM · Executive summary"),
    (301, 314, "GTM · Point of departure"),
    (315, 341, "GTM · Markets"),
    (342, 363, "GTM · Customers"),
    (364, 381, "GTM · Product"),
    (382, 390, "GTM · Competition and demand"),
    (391, 411, "GTM · Pricing"),
    (412, 428, "GTM · Sales"),
    (429, 439, "GTM · Distribution and channels"),
    (440, 455, "GTM · Marketing"),
    (456, 464, "GTM · Customer success"),
    (465, 479, "GTM · Plan, KPIs, and monitoring"),
    (480, 498, "GTM · Case 1 — Heavy equipment platform"),
    (499, 519, "GTM · Case 2 — B2B SaaS player"),
    (520, 544, "GTM · Case 3 — Construction software"),
    (545, 568, "GTM · Case 4 — Professional services"),
    (569, 576, "GTM · Appendix — Checklist and best practices"),
]

STRATEGY_BOOKS = set(range(202, 216)) | set(range(500, 547))
NUM = re.compile(r"^\d{1,3}$")
CHROME_LINE = re.compile(r"^(footnote|source:)", re.I)


def section_for(printed: int | None, collection: str) -> str:
    if collection == "cakewalk-strategy-2026":
        return "Cakewalk Strategy 2026 (book extras)"
    if printed is None:
        return "Unparsed"
    for lo, hi, name in SECTIONS:
        if lo <= printed <= hi:
            return name
    return "Book extras (not in Figma 1–576)"


def collection_for(book: int, printed: int | None) -> str:
    if book in STRATEGY_BOOKS:
        return "cakewalk-strategy-2026"
    if printed is not None and 1 <= printed <= 270:
        return "business-case-template"
    if printed is not None and 271 <= printed <= 576:
        return "gtm-template"
    return "book-unmapped"


def classify(title: str, body: list[str]) -> tuple[str, str, str]:
    """Return (archetype, role, when_to_use). Archetypes track docs/07-chart-vocabulary.md."""
    blob = f"{title}\n" + "\n".join(body)
    low = blob.lower()
    tlow = title.lower().strip()

    if "slideworks guide" in low or (
        "what" in tlow and "why" in tlow and "how" in tlow
    ):
        return "guide", "guide", "Author-facing how-to for the slides that follow. Do not put this in a client deck."
    if tlow in {"brand foundations", "brand assets"} or "image placeholder" in tlow:
        return "chrome", "chrome", "Theme / asset / image chrome. Not a content archetype."
    if (
        re.fullmatch(r"[IVX]{1,4}", title)
        or (
            re.match(r"^(\d{1,2}|[IVX]{1,4})\s+\S", title)
            and len(title) < 60
            and len(body) <= 2
        )
    ):
        return "divider", "chrome", "Section opener. Short numeral + section name, no body."
    if "template overview" in low or tlow in {"cover", "title"} or (
        "template" in tlow and ("cover" in tlow or "complete powerpoint" in low)
    ):
        return "cover", "chrome", "Deck cover or template-overview chrome."
    if "disclaimer" in tlow:
        return "notice", "chrome", "Legal / confidential notice. Keep it a single centered block."
    if "appendix: checklist" in low or (tlow.startswith("appendix") and "checklist" in low):
        return "checklist", "template", "Pre-read / workshop checklist."

    role = "example" if any(
        k in tlow for k in ("cakewalk benefits", "strategy 2026")
    ) else "case" if ("case study" in tlow or tlow.startswith("case ")) else "template"

    chart_map = [
        ("stacked column", "stacked-column"),
        ("grouped column", "grouped-column"),
        ("column chart", "column"),
        ("stacked bar", "stacked-bar"),
        ("grouped bar", "grouped-bar"),
        ("bar chart", "bar"),
        ("line graph", "line"),
        ("area chart", "area"),
        ("combo chart", "combo"),
        ("scatter plot", "scatter"),
        ("bubble chart", "bubble"),
        ("waterfall", "waterfall"),
        ("histogram", "histogram"),
        ("pie chart", "pie"),
        ("donut", "donut"),
        ("funnel", "funnel"),
        ("gauge", "gauge"),
        ("radar", "radar"),
        ("marimekko", "marimekko"),
        ("mekko", "marimekko"),
        ("gantt", "gantt"),
        ("org chart", "org"),
        ("organization chart", "org"),
    ]
    for needle, arch in chart_map:
        if needle in tlow or needle in low:
            return arch, role, f"Use the {arch} recipe in docs/07-chart-vocabulary.md."

    if (
        "2 x 2" in low or "2×2" in low or "2x2" in tlow
        or "positioning matrix" in low
        or "competitive landscape" in low
        or "quadrant" in low
        or (tlow.endswith("matrix") or " matrix" in tlow)
    ):
        return "matrix-2x2", role, "Four-quadrant 2×2. Keep the axis nouns; restyle the chrome."
    if "3 x 3" in low or "3×3" in low or "3x3" in tlow:
        return "matrix-3x3", role, "Nine-cell matrix. Same rule as 2×2 — axis nouns stay."
    if re.search(r"\bswot\b", low) or tlow == "swot":
        return "matrix-swot", role, "SWOT as a 2×2, not a bullet list."
    if tlow in {"prioritisation", "prioritization"}:
        return "matrix-3x3", role, "Nine-cell or heat prioritisation matrix."
    if "tam" in tlow and "sam" in tlow:
        return "nested-circles", role, "TAM / SAM / SOM nested circles or concentric bands."
    if "venn" in tlow:
        return "venn", role, "Overlapping-set argument."
    if tlow in {"value chain", "journey", "lifecycle"} or "value chain" in tlow:
        return "flow", role, "Left-to-right process. One verb per stage."
    if tlow in {"driver tree", "issue tree"} or "driver tree" in tlow:
        return "driver-tree", role, "Tree of drivers into one outcome number."
    if any(k in tlow for k in ("gantt", "timeline", "roadmap", "week 1", "implementation plan", "milestones")):
        return "gantt", role, "Dated plan. Swimlanes or milestone spine, not a bullet list of weeks."
    if tlow in {"scorecard", "kpi", "cockpit", "dashboard"} or any(
        k in tlow for k in ("scorecard", "kpi cockpit", "dashboard", "kpis and goals", "kpis")
    ) or "cockpit:" in low or "key performance indicator" in low:
        return "scorecard", role, "KPI cockpit. One number per cell; coral on the miss."
    if tlow in {"operating model", "who owns this"} or any(
        k in tlow for k in ("org chart", "operating model", "governance", "raci")
    ):
        return "org", role, "Who reports to whom, or who owns which decision."
    if any(k in tlow for k in ("risk", "raid", "assumption")):
        return "risk-table", role, "Named rows, owned, dated. Not a paragraph of risks."
    if tlow in {"agenda", "contents", "storyline"} or "agenda" in tlow:
        return "agenda", role, "Agenda / contents. One row per section, current row in coral."
    if any(k in tlow for k in ("table", "comparison", "versus", "vs.", "criteria", "segment attractiveness")):
        return "comparison-table", role, "Side-by-side criteria. Coral on the winning column or the miss."
    if any(k in tlow for k in ("quote", "testimonial", "voice of")):
        return "quote", role, "One quote, one attribution. No competing body."
    if any(k in tlow for k in ("funnel",)):
        return "funnel", role, "Conversion stages, widest at the top."
    if body and sum(1 for line in body if line.startswith("[Insert") or line.startswith("[")) >= 4:
        return "content-cards", role, "Card grid of placeholders. Keep the card count; restyle."
    if len(body) <= 2 and title:
        return "statement", role, "Single-statement slide. Title is the claim."

    return "content-cards", role, "Default content slide. Pick a tighter archetype if the ask names a chart."


def keywords_for(title: str, body: list[str], archetype: str, section: str) -> list[str]:
    stop = {
        "the", "and", "for", "with", "from", "that", "this", "your", "into", "are",
        "was", "were", "has", "have", "not", "but", "how", "why", "what", "when",
        "you", "our", "its", "can", "will", "use", "using", "insert",
    }
    words: list[str] = []
    for chunk in (title, " ".join(body[:4]), archetype.replace("-", " "), section):
        for w in re.findall(r"[A-Za-z][A-Za-z0-9%]{2,}", chunk.lower()):
            if w not in stop:
                words.append(w)
    seen: set[str] = set()
    out: list[str] = []
    for w in words:
        if w not in seen:
            seen.add(w)
            out.append(w)
        if len(out) >= 16:
            break
    return out


def _is_num(s: str) -> bool:
    return bool(NUM.match(s))


def _boundary(lines: list[str], i: int, last_book: int) -> tuple[str, int | None, int, int] | None:
    """Detect a slide separator starting at lines[i].

    Drive's text/plain export is usually `printed / book / blank`. Two variants
    fuse slides if we only look for that: a chrome line between printed and book
    (`95 / Footnote: … / 110 / blank`), and covers that carry only a book index
    (`500 / blank`).
    """
    n = len(lines)
    if i >= n or not _is_num(lines[i]):
        return None
    a = int(lines[i])

    if i + 1 < n and _is_num(lines[i + 1]) and (i + 2 >= n or lines[i + 2] == ""):
        book = int(lines[i + 1])
        nxt = i + 3 if i + 2 < n and lines[i + 2] == "" else i + 2
        return "pair", a, book, nxt

    if (
        i + 2 < n
        and lines[i + 1]
        and not _is_num(lines[i + 1])
        and CHROME_LINE.match(lines[i + 1])
        and _is_num(lines[i + 2])
        and (i + 3 >= n or lines[i + 3] == "")
    ):
        book = int(lines[i + 2])
        if last_book < book <= last_book + 5:
            nxt = i + 4 if i + 3 < n and lines[i + 3] == "" else i + 3
            return "sandwich", a, book, nxt

    if i + 1 < n and lines[i + 1] == "" and last_book < a <= last_book + 3 and a <= 700:
        return "book-only", None, a, i + 2

    return None


def parse_drive_text(text: str) -> list[dict]:
    lines = text.replace("\r\n", "\n").split("\n")
    slides: list[dict] = []
    buf: list[str] = []
    i = 0
    n = len(lines)
    last_book = 0
    while i < n:
        boundary = _boundary(lines, i, last_book)
        if boundary:
            _kind, printed, book, nxt = boundary
            body_lines = [ln for ln in buf if ln != ""]
            title, rest = _title_and_rest(body_lines, book)
            slides.append({"book": book, "printed": printed, "title": title, "body": rest})
            last_book = book
            buf = []
            i = nxt
            continue
        buf.append(lines[i])
        i += 1
    return slides


def _title_and_rest(body_lines: list[str], book: int) -> tuple[str, list[str]]:
    if not body_lines:
        return f"(untitled book {book})", []
    title = body_lines[0]
    rest = body_lines[1:]
    if re.fullmatch(r"\d{1,2}", title) and rest:
        title = f"{title} {rest[0]}"
        rest = rest[1:]
    return title, rest


def parse_extract(text: str) -> list[dict]:
    """Google Slides File ▸ Download ▸ Plain text (lib/extract.py shape)."""
    slides: list[dict] = []
    chunks = re.split(r"\n-{5,}\n", text)
    for chunk in chunks:
        chunk = chunk.strip()
        if not chunk:
            continue
        raw = [ln.rstrip() for ln in chunk.split("\n")]
        title = ""
        printed = None
        body_start = 0
        if raw and raw[0].startswith("# "):
            title = raw[0][2:].strip()
            body_start = 1
            if len(raw) > 1 and re.match(r"^\d{1,3}$", raw[1].strip()):
                printed = int(raw[1].strip())
                body_start = 2
        body = [ln for ln in raw[body_start:] if ln.strip() and ln.strip() != "CAKEWALK"]
        if not title:
            title, body = _title_and_rest(body, len(slides) + 1)
        slides.append({
            "book": len(slides) + 1,
            "printed": printed,
            "title": title,
            "body": body,
        })
    return slides


def load_slides(path: Path) -> tuple[list[dict], str]:
    raw = path.read_text(encoding="utf-8")
    if path.suffix == ".json" or raw.lstrip().startswith("{"):
        payload = json.loads(raw)
        if isinstance(payload, dict) and "content" in payload:
            decoded = base64.b64decode(payload["content"]).decode("utf-8")
            return parse_drive_text(decoded), "drive-json"
        raise SystemExit("JSON input must be a Drive download_file_content payload with base64 content")
    if re.search(r"\n-{5,}\n", raw):
        return parse_extract(raw), "extract"
    return parse_drive_text(raw), "drive-text"


def to_entry(slide: dict) -> dict:
    title = slide["title"]
    body = slide["body"]
    printed = slide["printed"]
    book = slide["book"]
    collection = collection_for(book, printed)
    if collection == "cakewalk-strategy-2026":
        # Small printed numbers on the strategy pack collide with Figma 1–47.
        figma_position = None
    else:
        figma_position = printed if printed and 1 <= printed <= 576 else None
    archetype, role, when = classify(title, body)
    if collection == "cakewalk-strategy-2026" and role == "template":
        role = "example"
    section = section_for(printed, collection)
    placeholders = len(re.findall(
        r"\[(?:Insert |xx|YY|\.\.\.).*?\]",
        "\n".join([title, *body]),
        flags=re.I,
    ))
    return {
        "book": book,
        "printed": printed,
        "figma_position": figma_position,
        "figma_file": FIGMA_FILE if figma_position else None,
        "collection": collection,
        "title": title,
        "section": section,
        "archetype": archetype,
        "role": role,
        "when_to_use": when,
        "keywords": keywords_for(title, body, archetype, section),
        "placeholder_count": placeholders,
        "first_lines": body[:4],
        "drive_id": DRIVE_ID,
    }


def write_archetypes(entries: list[dict], path: Path) -> None:
    by_arch: dict[str, list[dict]] = defaultdict(list)
    for e in entries:
        by_arch[e["archetype"]].append(e)

    lines = [
        "# Template archetypes",
        "",
        "Read this first when you already know the slide type. Each row is one Template Book slide.",
        f"`printed` / a bare number is the Figma position in `{FIGMA_FILE}` for the two Slideworks templates (pages 1–576).",
        "Cakewalk Strategy 2026 extras have no Figma position — use them for type, then look up the same archetype in the templates and screenshot that.",
        "",
        "```",
        'python3 library/lookup.py "<ask>"',
        "python3 library/lookup.py --archetype scorecard",
        "```",
        "",
        f"Source: [Cakewalk Slide Template Book]({DRIVE_URL}) · {len(entries)} indexed slides.",
        "",
    ]
    for arch in sorted(by_arch, key=lambda a: (-len(by_arch[a]), a)):
        group = by_arch[arch]
        lines.append(f"## {arch} ({len(group)})")
        lines.append("")
        seen: set[str] = set()
        shown = 0
        # Prefer rows that point at a live Figma slide.
        ordered = sorted(group, key=lambda e: (e["figma_position"] is None, e["book"]))
        for e in ordered:
            key = e["title"].lower()
            if key in seen:
                continue
            seen.add(key)
            pos = e["figma_position"] if e["figma_position"] else f"book {e['book']}"
            lines.append(f"- **{pos}** · {e['title']} — {e['when_to_use']}")
            shown += 1
            if shown >= 24:
                extra = len(group) - shown
                if extra > 0:
                    lines.append(f"- … more in this type. `python3 library/lookup.py --archetype {arch}`")
                break
        lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="Drive JSON, decoded text, or ----- extract")
    parser.add_argument("--out", type=Path, default=ROOT / "catalog.json")
    parser.add_argument("--archetypes", type=Path, default=ROOT / "archetypes.md")
    args = parser.parse_args()

    slides, source = load_slides(args.input)
    entries = [to_entry(s) for s in slides]
    books = [e["book"] for e in entries]
    expected = set(range(1, (max(books) if books else 0) + 1))
    missing = sorted(expected - set(books))

    catalog = {
        "version": 1,
        "source": {
            "kind": source,
            "drive_id": DRIVE_ID,
            "drive_url": DRIVE_URL,
            "title": "Cakewalk Slide Template Book",
            "figma_file": FIGMA_FILE,
            "figma_url": FIGMA_URL,
            "note": (
                "The Google book compiles the 576-slide Slideworks pair plus a Cakewalk "
                "Strategy 2026 pack, in book order. Map to the live Figma file with printed "
                "page number on business-case-template and gtm-template rows only — the "
                "strategy pack reuses printed 4–47 and is not in Figma 1–576."
            ),
        },
        "stats": {
            "indexed": len(entries),
            "missing_book_indices": missing,
            "collections": dict(Counter(e["collection"] for e in entries)),
            "archetypes": dict(Counter(e["archetype"] for e in entries)),
            "roles": dict(Counter(e["role"] for e in entries)),
        },
        "slides": entries,
    }
    args.out.write_text(json.dumps(catalog, indent=2) + "\n", encoding="utf-8")
    write_archetypes(entries, args.archetypes)
    print(f"wrote {args.out} ({len(entries)} slides, source={source})")
    print(f"wrote {args.archetypes}")
    print("collections", catalog["stats"]["collections"])
    print("roles", catalog["stats"]["roles"])
    top = Counter(e["archetype"] for e in entries).most_common(12)
    print("top archetypes", dict(top))
    if missing:
        print(f"missing book indices: {missing}")


if __name__ == "__main__":
    main()
