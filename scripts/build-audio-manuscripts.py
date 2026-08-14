#!/usr/bin/env python3
"""Turn whisper JSON transcripts into timed read-along cue TypeScript modules."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TRANSCRIPTS = ROOT / ".cache/audiobook-takes/transcripts"
OUT_DIR = ROOT / "src/data/manuscripts"

TRACKS = [
    (0, "02_Introduction_acx_master"),
    (1, "03_Chapter_1_acx_master"),
    (2, "04_Chapter_2_acx_master"),
    (3, "05_Chapter_3_acx_master"),
    (4, "06_Chapter_4_acx_master"),
    (5, "07_Chapter_5_acx_master"),
    (6, "08_Chapter_6_acx_master"),
    (7, "09_Chapter_7_acx_master"),
    (8, "10_Chapter_8_acx_master"),
    (9, "11_Chapter_9_acx_master"),
]

NAME_FIXES = [
    (re.compile(r"\b[Ss]onika [Cc]ottman\b"), "Sonika Cottman"),
    (re.compile(r"\b[Ee]ckhart [Tt]olle\b"), "Eckhart Tolle"),
    (re.compile(r"\b[Dd]r\.?\s+[Jj]oe [Dd]ispenza\b"), "Dr. Joe Dispenza"),
    (re.compile(r"\b[Jj]oe [Dd]ispenza\b"), "Joe Dispenza"),
    (re.compile(r"\b[Ss]imon [Gg]olden\b"), "Simon Golden"),
    (re.compile(r"\b[Kk]ate [Ww]illiams\b"), "Kate Williams"),
    (re.compile(r"\b[Ee]yes [Cc]losed\b"), "Eyes Closed"),
    (re.compile(r"\bS\.\s*J\.\b"), "S.J."),
    (re.compile(r"\bNaya and S\.J\b"), "Naya and S.J."),
]

SENTENCE_SPLIT = re.compile(r"(?<=[.!?])\s+(?=[A-Z“\"'])")
MIN_CHARS = 42
MAX_CHARS = 280
KEEP_CAP = {
    "I",
    "I’m",
    "I’ve",
    "I’ll",
    "I’d",
    "Formless",
    "Sonika",
    "Naya",
    "Eckhart",
    "Tolle",
    "Joe",
    "Dispenza",
    "Simon",
    "Kate",
    "Williams",
    "Golden",
    "Cottman",
    "Eyes",
    "Closed",
    "S.J.",
    "God",
    "Buddha",
    "Christ",
}


def ms_to_sec(ms: int) -> float:
    return round(ms / 1000.0, 2)


def first_word(text: str) -> str:
    return re.split(r"\s+", text.strip(), maxsplit=1)[0]


def uncap_continuation(prev: str, current: str) -> str:
    if not current or re.search(r'[.!?…]["’”"]?$', prev.strip()):
        return current
    word = first_word(current)
    bare = re.sub(r"[^A-Za-z’\.]", "", word)
    if bare in KEEP_CAP:
        return current
    if current[0].isupper() and (len(current) == 1 or not current[1].isupper()):
        return current[0].lower() + current[1:]
    return current


def join_texts(parts: list[str]) -> str:
    if not parts:
        return ""
    text = parts[0].strip()
    for part in parts[1:]:
        piece = uncap_continuation(text, part.strip())
        text = f"{text} {piece}".strip()
    return clean_text(text)


def clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    text = text.replace("...", "…")
    for pattern, replacement in NAME_FIXES:
        text = pattern.sub(replacement, text)
    text = text.replace("'", "’")
    if text and text[0].islower():
        text = text[0].upper() + text[1:]
    return text


def load_segments(path: Path) -> list[dict]:
    data = json.loads(path.read_text())
    rows = []
    for item in data.get("transcription", []):
        text = re.sub(r"\s+", " ", (item.get("text") or "")).strip().replace("'", "’")
        if not text:
            continue
        offsets = item.get("offsets") or {}
        start = ms_to_sec(int(offsets.get("from", 0)))
        end = ms_to_sec(int(offsets.get("to", 0)))
        if end <= start:
            end = round(start + 0.4, 2)
        rows.append({"text": text, "start": start, "end": end})
    return rows


def split_segment(seg: dict) -> list[dict]:
    parts = [p.strip() for p in SENTENCE_SPLIT.split(seg["text"]) if p.strip()]
    if len(parts) <= 1:
        return [seg]
    duration = max(seg["end"] - seg["start"], 0.4)
    total = sum(max(len(p), 1) for p in parts)
    cursor = seg["start"]
    out = []
    for index, part in enumerate(parts):
        share = duration * (max(len(part), 1) / total)
        end = seg["end"] if index == len(parts) - 1 else round(cursor + share, 2)
        out.append({"text": part, "start": round(cursor, 2), "end": end})
        cursor = end
    return out


def should_flush(buffer: list[dict], nxt: dict | None) -> bool:
    text = " ".join(item["text"] for item in buffer)
    last = buffer[-1]["text"]
    complete = bool(re.search(r'[.!?…]["’"]?$', last))
    if len(text) >= MAX_CHARS and complete:
        return True
    if nxt is None:
        return True
    gap = nxt["start"] - buffer[-1]["end"]
    if gap >= 1.6 and complete:
        return True
    if complete and len(text) >= MIN_CHARS:
        merged = f"{text} {nxt['text']}"
        if len(merged) > MAX_CHARS:
            return True
        if nxt["text"][:1].isupper() and re.search(r'[.!?…]["’"]?$', last):
            return True
    return False


def merge_sentences(segments: list[dict]) -> list[dict]:
    flat: list[dict] = []
    for seg in segments:
        flat.extend(split_segment(seg))

    sentences: list[dict] = []
    buffer: list[dict] = []
    for index, seg in enumerate(flat):
        buffer.append(seg)
        nxt = flat[index + 1] if index + 1 < len(flat) else None
        if should_flush(buffer, nxt):
            sentences.append(
                {
                    "text": join_texts([item["text"] for item in buffer]),
                    "start": buffer[0]["start"],
                    "end": buffer[-1]["end"],
                }
            )
            buffer = []
    if buffer:
        sentences.append(
            {
                "text": join_texts([item["text"] for item in buffer]),
                "start": buffer[0]["start"],
                "end": buffer[-1]["end"],
            }
        )
    return [row for row in sentences if row["text"]]


def ts_module(chapter_id: int, cues: list[dict]) -> str:
    const_name = f"CHAPTER_{chapter_id}_CUES"
    lines = [
        "/** Whisper-timed read-along cues aligned to the published ACX master. */",
        "",
        f"export const {const_name}: Array<{{ text: string; start: number; end: number }}> = [",
    ]
    for cue in cues:
        text = json.dumps(cue["text"], ensure_ascii=False)
        lines.append("  {")
        lines.append(f"    text: {text},")
        lines.append(f"    start: {cue['start']},")
        lines.append(f"    end: {cue['end']},")
        lines.append("  },")
    lines.append("];")
    lines.append("")
    return "\n".join(lines)


def write_index(generated: dict[int, int]) -> None:
    imports = []
    entries = []
    for chapter_id in sorted(generated):
        imports.append(
            f"import {{ CHAPTER_{chapter_id}_CUES }} from '@/data/manuscripts/cues-{chapter_id}';"
        )
        entries.append(f"  {chapter_id}: sentences({chapter_id}, CHAPTER_{chapter_id}_CUES),")
    print("generated chapters:", generated)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    generated: dict[int, int] = {}
    missing: list[str] = []
    for chapter_id, stem in TRACKS:
        src = TRANSCRIPTS / f"{stem}.json"
        if not src.exists():
            missing.append(stem)
            continue
        cues = merge_sentences(load_segments(src))
        dest = OUT_DIR / f"cues-{chapter_id}.ts"
        dest.write_text(ts_module(chapter_id, cues))
        generated[chapter_id] = len(cues)
        print(f"ch{chapter_id}: {len(cues)} cues -> {dest.relative_to(ROOT)}")
    write_index(generated)
    if missing:
        print("waiting on:", ", ".join(missing))


if __name__ == "__main__":
    main()
