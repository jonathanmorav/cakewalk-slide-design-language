#!/usr/bin/env python3
"""
Slide-text extractor for recreating a reference deck.

Workflow: open the source deck in Google Slides → File ▸ Download ▸ Plain text
→ save next to this script → run it to read any slide range.

The export separates slides with a line of dashes and encodes soft line breaks
inside a text box as the entity `&#11;`. Empty spans between separators are
layout artefacts, not slides, so they are dropped — after that the surviving
spans are in deck order and 1-based indexable, which is what makes
"source slide N" a reliable handle.

Lines the exporter prefixes with '#' came from the slide's title placeholder.
That is usually the action title, but not always: on a few slides the title
placeholder holds a short kicker ("Solution", "Plan") and the real action title
sits in a body box. Read both before deciding.

Usage:
    python3 extract.py dump.txt 45 71      # slides 45..71
    python3 extract.py dump.txt 45         # just slide 45
    python3 extract.py dump.txt --count    # how many slides the dump holds
"""
import sys

def load(path):
    parts = open(path, encoding='utf-8').read().split('-----')
    return [i for i, p in enumerate(parts) if p.strip()], parts

def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(1)
    path = sys.argv[1]
    idx, parts = load(path)
    if sys.argv[2] == '--count':
        print(f'{len(idx)} slides in {path}'); return
    a = int(sys.argv[2])
    b = int(sys.argv[3]) if len(sys.argv) > 3 else a
    for n in range(a, min(b, len(idx)) + 1):
        txt = parts[idx[n - 1]].replace('&#11;', '\n')
        print(f'########## SLIDE {n} ##########')
        print('\n'.join(l.rstrip() for l in txt.split('\n') if l.strip()))
        print()

if __name__ == '__main__':
    main()
