#!/usr/bin/env python3
"""Transcribe ACX masters with whisper-cli into a model-specific cache folder.

Default writes beside the existing base transcripts without overwriting them:
  .cache/audiobook-takes/transcripts-<model>/

Example:
  python3 scripts/transcribe-masters-whisper.py --model medium
"""

from __future__ import annotations

import argparse
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MASTERS = ROOT / "masters"
WHISPER_CACHE = ROOT / ".cache/whisper"
WHISPER_CLI = Path("/opt/homebrew/bin/whisper-cli")

# Listen-order narration tracks that become timed scripts.
TRACKS = [
    "01_Opening_Credits_2_acx_master",
    "02_Introduction_acx_master",
    "03_Chapter_1_acx_master",
    "04_Chapter_2_acx_master",
    "05_Chapter_3_acx_master",
    "06_Chapter_4_acx_master",
    "07_Chapter_5_acx_master",
    "08_Chapter_6_acx_master",
    "09_Chapter_7_acx_master",
    "10_Chapter_8_acx_master",
    "11_Chapter_9_acx_master",
    "12_Acknowledgments_acx_master",
]

MODEL_FILES = {
    "base": "ggml-base.en.bin",
    "medium": "ggml-medium.en.bin",
}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--model",
        choices=sorted(MODEL_FILES),
        default="medium",
        help="Whisper model size (English-only ggml).",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Re-transcribe even when JSON already exists.",
    )
    parser.add_argument(
        "--only",
        nargs="*",
        default=None,
        help="Optional stem substrings to limit which tracks run.",
    )
    args = parser.parse_args()

    model_path = WHISPER_CACHE / MODEL_FILES[args.model]
    if not model_path.is_file():
        print(f"missing model: {model_path}", file=sys.stderr)
        return 1
    if not WHISPER_CLI.is_file():
        print(f"missing whisper-cli: {WHISPER_CLI}", file=sys.stderr)
        return 1

    out_dir = ROOT / f".cache/audiobook-takes/transcripts-{args.model}"
    out_dir.mkdir(parents=True, exist_ok=True)

    stems = TRACKS
    if args.only:
        stems = [
            stem
            for stem in TRACKS
            if any(token.lower() in stem.lower() for token in args.only)
        ]
        if not stems:
            print("no tracks matched --only", file=sys.stderr)
            return 1

    started = time.time()
    for index, stem in enumerate(stems, start=1):
        src = MASTERS / f"{stem}.mp3"
        if not src.is_file():
            print(f"[{index}/{len(stems)}] missing audio: {src}", file=sys.stderr)
            continue
        dest_json = out_dir / f"{stem}.json"
        if dest_json.exists() and not args.force:
            print(f"[{index}/{len(stems)}] skip (exists): {dest_json.name}")
            continue

        out_base = out_dir / stem
        cmd = [
            str(WHISPER_CLI),
            "-m",
            str(model_path),
            "-f",
            str(src),
            "-l",
            "en",
            "-oj",
            "-osrt",
            "-of",
            str(out_base),
            "-np",
        ]
        print(f"[{index}/{len(stems)}] {stem} …", flush=True)
        t0 = time.time()
        proc = subprocess.run(cmd, check=False)
        elapsed = time.time() - t0
        if proc.returncode != 0:
            print(f"  failed ({proc.returncode}) after {elapsed:.1f}s", file=sys.stderr)
            return proc.returncode
        print(f"  ok in {elapsed:.1f}s → {dest_json.name}", flush=True)

    print(f"done in {time.time() - started:.1f}s → {out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
