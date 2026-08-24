# Formless local audio

Durable local files for the Formless audiobook.

- `*_acx_master.mp3` and `*_master_qc.json` — final ACX chapters
- `restoration/` — restored AIFF/WAV and extra NR passes (the files you would re-encode from)

Scratch stays in `.cache/audiobook-takes/`: source copies, `*_restored_full.wav`, `*_loudnorm.wav`, transcripts.

The studio catalog tracks masters through `STUDIO_LOCAL_ROOTS` in `src/data/audiobookStudioCatalog.ts`. Future runs:

```bash
python3 scripts/conform_and_master.py \
  --out-dir formless-web/.cache/audiobook-takes \
  --master-dir formless-web/masters \
  --restoration-dir formless-web/masters/restoration \
  ...
```
