#!/usr/bin/env python3
"""Generate src/data/arcManuscriptChapters.ts from Formless_ARC_cleaned.txt."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / ".cache/manuscript-compare/Formless_ARC_cleaned.txt"
OUT = ROOT / "src/data/arcManuscriptChapters.ts"

ORDER = [13, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12]


def fix_drop_caps(lines: list[str]) -> list[str]:
    fixed: list[str] = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if (
            i + 1 < len(lines)
            and re.fullmatch(r"[A-Za-z]", line.strip())
            and lines[i + 1]
            and lines[i + 1][0].islower()
        ):
            fixed.append(line.strip() + lines[i + 1].lstrip())
            i += 2
            continue
        fixed.append(line)
        i += 1
    return fixed


def soft_wrap(text: str) -> str:
    paras = re.split(r"\n\s*\n", text)
    out: list[str] = []
    for para in paras:
        bits = [ln.strip() for ln in para.splitlines() if ln.strip()]
        out.append(" ".join(bits))
    return "\n\n".join(out)


def find_eq(lines: list[str], value: str) -> int:
    for idx, line in enumerate(lines):
        if line.strip() == value:
            return idx
    raise SystemExit(f"missing marker: {value}")


def find_startswith(lines: list[str], prefix: str) -> int:
    for idx, line in enumerate(lines):
        if line.startswith(prefix):
            return idx
    raise SystemExit(f"missing prefix: {prefix}")


def main() -> None:
    lines = fix_drop_caps(SRC.read_text(encoding="utf-8").splitlines())
    ded_i = find_startswith(lines, "Dedicated to my two greatest")
    contents_i = find_eq(lines, "Contents")
    intro_i = find_eq(lines, "INTRODUCTION")
    chapters = {n: find_eq(lines, f"CHAPTER {n}") for n in range(1, 10)}
    ack_i = find_eq(lines, "Acknowledgments")

    title = "\n".join(lines[0:4]).strip()
    opening = soft_wrap(f"{title}\n\n" + "\n".join(lines[ded_i:contents_i]).strip())
    intro = soft_wrap("\n".join(lines[intro_i : chapters[1]]).strip())

    by_id: dict[int, str] = {13: opening, 0: intro}
    for n in range(1, 10):
        end = chapters[n + 1] if n < 9 else ack_i
        by_id[n] = soft_wrap("\n".join(lines[chapters[n] : end]).strip())
    by_id[12] = soft_wrap("\n".join(lines[ack_i:]).strip())

    parts = [
        "/** ARC manuscript text by audio chapter id. Generated from Formless_ARC_cleaned.txt. */",
        "",
        "import type { AudioChapterId } from '@/data/audioBook';",
        "",
        "export const ARC_MANUSCRIPT_SOURCE =",
        "  'Formless Advance Reader Copy (cleaned text from ARC PDF)' as const;",
        "",
        "export const ARC_MANUSCRIPT_BY_CHAPTER: Record<AudioChapterId, string> = {",
    ]
    for chapter_id in ORDER:
        parts.append(f"  {chapter_id}: {json.dumps(by_id[chapter_id], ensure_ascii=False)},")
    parts.extend(
        [
            "};",
            "",
            "export function arcManuscriptForChapter(chapterId: number): string {",
            "  if (chapterId in ARC_MANUSCRIPT_BY_CHAPTER) {",
            "    return ARC_MANUSCRIPT_BY_CHAPTER[chapterId as AudioChapterId];",
            "  }",
            "  return '';",
            "}",
            "",
        ]
    )
    OUT.write_text("\n".join(parts), encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
