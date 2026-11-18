---
name: render-qa
description: Verify a rendered SILENCE PROTOCOL episode and its production files without regenerating anything. Checks resolution, frame rate, frame count and duration, decode errors, loudness and peak, missing voice/caption/SFX/music files, asset checksums, audio sync and narration words. Use after a render or master, before handing over or committing an episode, or when the producer asks to check a video.
---

# Render QA

Report only actionable problems. **Never re-render, re-voice or regenerate anything automatically**: list the fix
and wait for the producer.

## 1. Deterministic checks (run all; each prints PASS/FAIL lines only)
```bash
bash skills/render-qa/scripts/check_episode_assets.sh <N>          # before rendering, or when a render fails
bash skills/render-qa/scripts/qa_video.sh out/SILENCE_PROTOCOL_EP0N_<TITLE>.mp4
sha256sum -c --quiet 03_MASTER_ASSETS/ASSET_CHECKSUMS.sha256 && echo "assets OK"
```
`qa_video.sh` targets (from `CLAUDE.md` / PRODUCTION_RULES / AUDIO_STYLE): H.264 yuv420p 1080×1920, 30/1 fps,
85–90 s, frame count = duration × 30, AAC 48 kHz, clean full decode, ≈ −18 LUFS (−19.5…−17.0), true peak ≤ −1.5 dBFS.
Options: `--frames <expected>` (the composition total, e.g. `SP2_TOTAL`), `--min/--max <s>`.

## 2. Narration check (local Whisper, only after a mix change)
```bash
ffmpeg -v error -i <mp4> -f segment -segment_time 12 -ac 1 -ar 16000 /tmp/qa_%02d.wav
python scripts/tts/check_words.py /tmp/qa_*.wav
```
Compare with the episode's `lines.tsv` captions. A missed word under SFX = an audio-only fix (AUDIO_STYLE §4), not a
re-render. Needs `bash scripts/tts/setup_tts.sh` once per container.

## 3. Judgement checks (only what scripts can't do)
Look at a few frame strips (`ffmpeg … select='not(mod(n\,6))',scale=270:-1,tile=8x1`) at the vote open, each purchase,
the rule card and the final choice. Check against the PRODUCTION_RULES §5 checklist: HUD numbers match canon,
red arm band, captions word-synced and not covering faces, A/B + COMMENT A OR B + cliffhanger, no infected voice.

## 4. Report
One line per failure: what, where (frame/TC or file), the suggested fix. If everything passes, say so in one line with
the key numbers (duration, frames, LUFS, peak). Write passing QC numbers into the episode's `PRODUCTION_SHEET.md` only
when finishing that episode.
