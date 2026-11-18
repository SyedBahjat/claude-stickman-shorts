# PRODUCTION RULES: SILENCE PROTOCOL

## 1. Non-negotiables
1. **Read before you build:** `bible/MASTER_SERIES_BIBLE.md` → the latest `episodes/epNN/CANON.md` → the bible file(s)
   for whatever you touch.
2. **Never contradict canon** (numbers, rules, virus mechanics, bunker layout, what was bought).
3. **Never redesign** YOU, the infected, the bunker, the HUD, the gadgets, the typography or the audio identity without
   the producer's explicit permission. Reuse components; add new ones beside them.
4. **Never edit a finished episode's files** (`src/stories/silence-protocol/SilenceP1.tsx`, `public/audio/voice/sp1-*`,
   `public/captions/sp1-*`, `stories/silence-protocol/ep01-lines.tsv`, EP01 docs). Copy what you need.
5. English only. Second person. YOU never speaks. The audience is never made to hear an infected voice.
   **US audience:** natural American English everywhere (narration, captions, subtitles, on-screen text, episode
   info): American spelling, terminology, units in everyday speech and cultural references. No Italian content.
   The narrator is always the official voice `narrator` (`scripts/tts/narrator.json`, see `AUDIO_STYLE.md` §1); new
   episodes inherit it automatically and its settings never change without the producer's explicit authorization.
6. 9:16, 1080×1920, 30 fps, 85–90 s. End on an A/B choice with **COMMENT A OR B**; never auto-purchase the choice.
7. Money math must be exact and shown: every purchase shows item, −€cost, and the HUD budget rolling down.
8. No paid services/APIs/credits without the producer's authorization. All audio except narration is synthesized.
9. **Commit/push only when the producer authorizes it** (but warn them that uncommitted work dies with the container).
10. After each episode: write its `CANON.md`, `NEW_ASSETS.md`, `CONTINUITY_UPDATES.md`; update the bible only for
    new permanent facts.

## 2. Repository layout (Silence Protocol parts)
```
CLAUDE.md                                   permanent instructions (read first)
src/kit/SurvivalHud.tsx                     series HUD + purchase receipts (shared)
src/sets/Silence.tsx                        all series sets, bunker, gadgets (shared)
src/stories/silence-protocol/SilenceP<N>.tsx  one file per episode (EP01 = SilenceP1.tsx, composition SilenceProtocol-EP01)
src/Root.tsx                                registers compositions (1080x1920, 30 fps)
scripts/audio/silence_audio.py              series music bed + SFX generator
scripts/tts/                                narration toolchain (setup, generate, re-voice, loudness, word check)
stories/silence-protocol/remap_captions.py  spoken-number captions → digits/€
stories/silence-protocol/ep01-lines.tsv     EP01 narration lines (name · spoken · caption)
stories/silence-protocol/{script,continuity,voices}.md   EP01 original working notes (historical)
stories/silence-protocol/bible/             this bible
stories/silence-protocol/episodes/epNN/     per-episode canon + production docs
stories/silence-protocol/episodes/_template/  copy for each new episode
public/audio/{voice,sfx,music}/  public/captions/   assets (voice/captions prefixed sp<EP>-NN)
out/                                        renders (git-ignored!)
```

## 3. Episode pipeline (what EP01 actually used)
1. **Script** in `episodes/epNN/SCRIPT.md` + `episodes/epNN/lines.tsv` (name `sp<N>-NN`, spoken text with numbers in
   words, caption text with digits). Target ≈ 270–290 words for 85–90 s at the established pace.
2. **Voice:** `bash scripts/tts/setup_tts.sh` (once per container) →
   `python scripts/tts/common.py` (narrator check) → `python scripts/tts/generate_lines.py <lines.tsv> --out /tmp/raw` →
   per line `node scripts/voiceover.mjs sp<N>-NN "<spoken>" --from /tmp/raw/sp<N>-NN.wav --trim --loud -16` →
   `python scripts/tts/loudness_match.py --lufs -20 --target public/audio/voice --prefix sp<N>- --count <n>` →
   `python stories/silence-protocol/remap_captions.py <lines.tsv>` →
   `python scripts/tts/check_words.py public/audio/voice/sp<N>-*.wav`.
3. **Timeline:** in the new episode file, `LEN: [voiceFrames, gapAfter][]` from the trimmed WAV lengths
   (`ceil(seconds*30)`), gaps 3 frames within a scene, 6 between scenes, longer holds for rule cards (54), montage ends (36)
   and the ending (30); `PRE = 8`. `wf(line, "WORD")` gives the frame a word is spoken. Fit total ≤ 2,700 frames.
4. **Build** shots as `{ at, render(dur) }` with hard cuts; HUD/captions/vignette as top layers (copy EP01's structure).
5. **SFX/music:** reuse existing files; new sounds = new functions in `scripts/audio/silence_audio.py`.
6. `npm run typecheck`, register in `src/Root.tsx` as `SilenceProtocol-EP0N`.
7. **Look before render:** stills at every beat + frame strips (`ffmpeg … select='not(mod(n\,6))',tile=8x1`).
8. **Render** (this cloud container needs the pre-installed Chromium; Remotion's own download is blocked):
   ```bash
   npx remotion render src/index.ts SilenceProtocol-EP0N out/raw.mp4 --concurrency=4 --browser-executable=/opt/pw-browsers/chromium --chrome-mode=chrome-for-testing
   ```
   Stills: `npx remotion still src/index.ts <Id> out/f.png --frame=N --scale=0.5 --browser-executable=… --chrome-mode=chrome-for-testing`.
9. **Master:** `ffmpeg -i out/raw.mp4 -c:v copy -af "volume=-1.3dB,alimiter=limit=0.84:level=false:attack=2:release=50" -ar 48000 -c:a aac -b:a 192k -movflags +faststart out/SILENCE_PROTOCOL_EP0N_<TITLE>.mp4`
   (measure; aim ≈ −18 LUFS, peak ≤ −1.5 dBFS).
10. **Validate:** ffprobe (1080x1920, 30/1, frame count), full decode, ebur128 loudness, Whisper on 12 s chunks of the
    final mix, money math.

## 4. Export settings
Remotion 4.0.539, `remotion.config.ts`: JPEG frames, overwrite on. Codec H.264 (default), yuv420p, 30 fps. Audio AAC
192 kb/s 48 kHz. File name `SILENCE_PROTOCOL_EP<NN>_<TITLE_WITH_UNDERSCORES>.mp4`.

## 5. Final checklist (per episode)
- [ ] Opens resolving the previous vote (EP ≥ 02); numbers continue exactly from the previous CANON
- [ ] HUD on every frame except Rule cards; budget/food/water/days correct at every moment
- [ ] YOU has the red arm band in every shot; infected look/pose per CHARACTER_BIBLE
- [ ] New Silence Rule (if any) uses the Rule card look and the next number
- [ ] Every narration line Whisper-verified; captions show digits/€; yellow keywords
- [ ] SFX × `SFX_GAIN`; beds ducked; narration dominant; ≈ −18 LUFS
- [ ] 1080×1920, 30 fps, 85–90 s; ends on A/B + COMMENT A OR B + cliffhanger
- [ ] Episode docs written; bible updated only for permanent facts; ASSET_CHECKSUMS updated
