# Audiobook Production Pipeline — Review & Optimization Plan

**Date:** 2026-08-01 · **Book:** Formless (Sonika Cottman) · **Reviewer:** Claude Code
**Skills used:** `audiobook-mastering`, `audible-final-qc` (Fulcrum atlas, Audiobook / ACX domain)

---

## 1. Current process (as found)

```
Room check (once,                 Site intake                    Sound engineer pass
 session start)                   ───────────                    ───────────────────
──────────────             →      AudioSendTakePage        →     .cache/audiobook-takes/
Calibration recording             (Supabase storage,              Phase 1  preflight (ffmpeg measure)
 establishes the room              600 MB cap, aup3/               Phase 1.5 editorial page
 baseline; the 10 track            broad MIME allowed)             Phase 2  restore (Audacity MCP:
 recordings then contain                                                     NR → click → HPF → comp)
 narration only (no per-                                          Phase 3  loudnorm 2-pass + limiter
 track room-tone head)                                                      → MP3 192k CBR mono
                                                                  Phase 4/5 post-flight + report
```

**Scope note:** the review below was validated on one track (Opening Credits). The final
deliverable is a **10-track batch**. Sections 4b and 4c below extend the plan for that.

Evidence: `01_Opening_Credits` processed end-to-end (`_preflight.wav` → `_restored.wav` →
`_loudnorm.wav` → `_acx_master.mp3`), ID3 tagged via `.venv-id3`, published to the
editorial page.

## 2. Measured results — Opening Credits master

| Metric | Measured | ACX requirement | Studio target | Verdict |
|--------|----------|-----------------|---------------|---------|
| RMS | −21.7 dBFS | −23 to −18 | −21 to −19 | ✅ pass (0.7 dB below studio band) |
| True peak | −3.7 dBFS | ≤ −3.0 | ≤ −3.5 | ✅ pass |
| LUFS / LRA | −20.3 / 4.2 LU | — | I=−20, LRA≤4 | ✅ on target |
| Noise floor (real silence region) | **−67.9 dB** | ≤ −60 | ≤ −65 | ✅ beats studio target |
| Head silence | **1.77 s** | 0.5–1 s | 0.75 s | ❌ too long |
| Tail silence | 2.6 s | 1–5 s | 2 s | ✅ pass |
| Format | MP3 192k CBR, 44.1 kHz, mono | same | same | ✅ pass |
| ID3 tags | title/artist/album/track/date/genre/composer complete | required | — | ✅ pass |

**Bottom line: the restoration + mastering chain is producing genuinely good audio.**
The −67.9 dB floor after noise reduction is studio-grade. The problems found are
process problems, not sound problems.

## 3. Findings

### F1 — BLOCKER: the final-QC gate false-fails correctly mastered files
`audible-final-qc/scripts/qc_report.py` measures "noise floor" as volumedetect over the
**first 30 seconds** of the master. That assumes the 30 s room-tone head is still present —
but a finished ACX master must have only a **0.5–1 s** head (the mastering skill trims it).
Result: it read −21.5 dB (narration) as "noise floor" and issued `✗ HOLD` on a file whose
true floor is −67.9 dB. **Every properly mastered chapter will false-fail this gate.**
The two skills in the pipeline contradict each other here.

### F2 — HIGH: lossy source slipped through intake
Take 2's original was **AAC m4a @ 150 kbps** — not the Audacity template. Mastering a lossy
source then encoding to MP3 stacks two generations of lossy artifacts. The template
(`Formless-Recording-Template.aup3`) exists and take 1 used it; the intake migrations
(broaden MIME → allow aup3 → 300 MB → 600 MB) show the door was progressively opened wide
enough that phone/Voice-Memos recordings can arrive. For a 43 s credits file it's survivable;
for 8 hours of chapters it caps your quality ceiling permanently.

### F3 — MEDIUM: no head/tail trim enforcement in Phase 3
Head silence is 1.77 s vs the 0.5–1 s ACX spec. The mastering chain has targets (0.75 s head,
2 s tail) but no explicit ffmpeg step that enforces them, so files not recorded on the
template (see F2) sail through untrimmed.

### F4 — LOW: QC tooling environment is fragmented
`qc_report.py` couldn't check ID3 tags (`mutagen not installed`) even though a working
`.venv-id3` with mutagen sits in the same folder. One venv should serve the whole pipeline.

### F5 — LOW: no per-session room baseline record
You ran a room test/calibration, but nothing stores its result. Each chapter's 0–30 s
noise profile is used (correct), but there's no baseline to compare against, so a
"different room day" (HVAC on, window open) is only discovered at mastering, not at intake.

### F6 — LOW: flat working folder
`.cache/audiobook-takes/` mixes originals, intermediates, masters, and a venv. Fine for one
file; painful for 20+ chapters.

## 4. Plan

### Phase A — Fix the QC gate (do first; blocks everything downstream)
1. Patch `qc_report.py` noise-floor logic: locate silence regions via
   `silencedetect=noise=-50dB:d=0.3` and measure `volumedetect` on the **head silence
   region** (and longest internal silences) instead of a blind first-30 s window.
2. Add a **head/tail duration check** to the script (head 0.5–1 s, tail 1–5 s) — it
   currently doesn't verify the one thing ACX's automated checker always measures.
3. Install mutagen for the QC script (or point it at `.venv-id3`).
4. Re-run the gate on the Opening Credits master to confirm `READY`.

### Phase B — Close the lossy-source door at intake
1. On upload (AudioSendTakePage / Supabase edge), probe the file and store
   `codec, sample_rate, bit_depth, channels, duration` as take metadata.
2. **Warn the author immediately** in the upload UI when the source is lossy (m4a/mp3/aac)
   or not 44.1 kHz: "This take will be accepted, but WAV or the Audacity template gives a
   noticeably better master." Accept-with-warning, don't hard-reject — takes are precious.
3. Make the template the default path: the download card links the `.aup3` template; add a
   one-line "always record into this project" instruction next to it.

### Phase C — Harden the mastering chain (Phase 3 additions)
1. Add an explicit **head/tail conform step** after loudnorm: trim/pad to 0.75 s head +
   2.0 s tail of room tone (use `silenceremove` + `apad`, padding with the chapter's own
   room-tone bed, never digital zero — ACX human review flags dead-zero silence).
2. Keep the existing chain untouched otherwise — the numbers prove it works
   (own-profile NR, 2:1 comp, 2-pass loudnorm I=−20/TP=−3.5, alimiter, 192k CBR).

### Phase D — Session room-check flow (replaces per-track room tone)

The room was calibrated **once at session start**; the 10 track recordings contain
narration only. This changes the noise-profile strategy, because the mastering skill's
default ("use each chapter's own 0–30 s room tone, never cross-apply profiles") assumes
a room-tone head that these tracks don't have.

**Deliberate deviation from the skill, and why it's safe here:** the never-cross-apply
rule exists because different rooms/sessions have different noise signatures. All tracks
from one calibrated session in one room share a signature — so the session baseline IS
the correct profile, provided each track is verified against it.

The flow:

1. **Register the room check.** Store the calibration recording as
   `takes/<session>/room-baseline.wav` plus `room-baseline.json` with its measured
   floor (volumedetect + astats). This is the session's noise-profile source.
2. **Per-track drift check (Phase 1 addition).** For each of the 10 tracks, find the
   longest internal silence (`silencedetect=noise=-50dB:d=0.5`) and measure its floor.
   Compare to baseline:
   - within 3 dB → use the **session baseline** as the Audacity NR profile
   - 3–6 dB drift → capture the NR profile from **that track's own silence regions**
     instead, and flag it in the report
   - > 6 dB drift → stop; conditions changed (HVAC, window, mic move) — review with
     the narrator before mastering, possible re-record
3. **Room tone bed for head/tail.** The Phase C conform step pads head (0.75 s) and
   tail (2 s) using audio cut from `room-baseline.wav` — never digital zero, and now
   never missing, since tracks have no head of their own.
4. If any track was recorded on a **different day**, treat it as its own session:
   it needs its own room check (or at minimum step 2's own-silence profile).

### Phase E — 10-track batch runbook
```
takes/<session>/
  room-baseline.wav + room-baseline.json    ← the room check (step D1)
  incoming/     ← 10 originals, immutable, never edited
  restored/     ← Phase 2 WAV output
  masters/      ← 01..10_*_acx_master.mp3 only
  qc/           ← qc_report output + listening-checklist sign-off
```

Batch order of operations:

1. **Pre-flight all 10 first** (Phase 1 + drift check) and build one table before
   touching Audacity — outliers are only visible against the other nine. One editorial
   assessment covers the batch.
2. Restore + master all tracks with identical chain settings (same NR strength for
   all baseline-matched tracks; per-track strength only for flagged drifters).
3. Run `audible-final-qc` on the **whole masters folder at once**, never per file —
   the cross-chapter consistency checks (RMS range ≤ 2.0 dB, noise-floor range ≤ 5 dB,
   LRA range ≤ 3 LU) are the main quality gate at 10 tracks. These catch what single-file
   checks can't: the level jumps and room changes listeners actually notice between tracks.
4. Verify batch metadata: ID3 track numbers 1–10 in listening order, consistent
   album/artist tags, consistent file naming, no file < 30 s (except credits), total
   runtime summed in the report.
5. **Perceptual listening checklist with the narrator** (the skill's ear-test list:
   room jumps between tracks, mouth noise, NR shimmer, pumping) → sign-off archived
   in `qc/` → upload.

**Consistency rule of thumb:** with 10 tracks, a single track that passes ACX but sits
2+ dB louder or noisier than its neighbors is the defect a human reviewer (and listener)
notices first. The batch QC verdict, not the per-file verdict, is the ship/no-ship call.

### Opening Credits specifically
The current master's sound is fine, but: re-record it into the Audacity template (it's 43 s —
two minutes of work) so the shipped version comes from a lossless source with correct head
room tone, then re-master. Use it as the end-to-end test of Phases A–C.

## 5. What NOT to change

- The Audacity-MCP restoration chain settings (NR strengths, 80 Hz HPF, 2:1 compression,
  de-ess by ear) — measured output validates them.
- The ffmpeg loudnorm targets (I=−20, TP=−3.5, LRA=4) — landed −20.3 LUFS / −21.7 RMS / −3.7 TP.
- The two-toolset split (Audacity restores, ffmpeg masters) — it's the right architecture
  and the reason the results are reproducible.
