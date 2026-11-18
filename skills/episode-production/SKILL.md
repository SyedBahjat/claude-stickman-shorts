---
name: episode-production
description: Produce the next SILENCE PROTOCOL episode (EP03+) or resume one in progress, reusing the approved pipeline, assets and templates. Use when the producer gives a vote result ("A won", "most chose B"), asks for the next episode, or asks to continue, fix or re-render an unfinished episode. Not for finished episodes (read-only) or other stories (use stickman-shorts).
---

# Episode production (SILENCE PROTOCOL)

This skill is a routing layer. The rules live in `CLAUDE.md` and `01_SERIES_BIBLE/`; the house engine in the
`stickman-shorts` skill. Don't restate them; read only what the step needs.

## 0. Orient (deterministic, ~20 lines of output)
```bash
bash skills/episode-production/scripts/ep_status.sh          # add --fetch to compare with GitHub
```
It prints branch/sync state, asset checksums, the canon pointer, episodes on disk, compositions, the next episode
number and whether the TTS toolchain is installed. Decide from it; don't re-explore the repo.

## 1. Read only what this episode needs
| Always | When relevant |
|---|---|
| `CLAUDE.md` (auto-loaded) | `CHARACTER_BIBLE` (new character/infected beat) · `ENVIRONMENT_BIBLE` (new place) |
| `01_SERIES_BIBLE/MASTER_SERIES_BIBLE.md` | `TECHNOLOGY_BIBLE` (gadgets) · `VISUAL_STYLE` (new visuals) |
| Latest canon (pointer in `CLAUDE.md` step 2) | `AUDIO_STYLE.md` (any audio work) · `03_MASTER_ASSETS/ASSET_REGISTRY.md` (before adding anything) |
| `01_SERIES_BIBLE/PRODUCTION_RULES.md` §3 (the pipeline) | Previous `PRODUCTION_SHEET.md` (timeline/SFX conventions) |

Old paths inside the docs → `04_PROJECT_FILES/PATH_MAP.md`. Read source files by section (`grep -n` then a ranged read),
never whole 800-line episode files unless you are copying them.

## 2. Pipeline (follow PRODUCTION_RULES §3 exactly; summary)
1. `cp -r 04_PROJECT_FILES/EPISODE_TEMPLATE 02_EPISODES/EPNN` → write `SCRIPT.md` + `lines.tsv`
   (`spN-NN<TAB>spoken, numbers in words<TAB>caption, digits/€`), ≈270–290 words. Open by resolving the vote,
   end on A/B + "COMMENT A OR B" + cliffhanger. **Get the producer's OK on script + A/B before voicing.**
2. Voice: `bash scripts/tts/setup_tts.sh` (once per container) → `generate_lines.py` → `voiceover.mjs --from … --trim --loud -16`
   → `loudness_match.py --lufs -20 --prefix spN- --count <n>` → `remap_captions.py` → `check_words.py` (must be word-exact).
3. Code: copy the previous `src/stories/silence-protocol/SilenceP<N-1>.tsx` to `SilenceP<N>.tsx`, replace `LEN`/`SHOTS`/
   `SFX`/beds, register `SilenceProtocol-EP0N` in `src/Root.tsx`, `npm run typecheck`.
4. Stills + frame strips at every beat, **look at them**, then render and master (commands in PRODUCTION_RULES §3.8–9).
5. QA with the `render-qa` skill.
6. Docs per `CLAUDE.md` "After finishing an episode"; refresh checksums; update the canon pointer.

## 3. Preservation rules (the ones most often broken)
- Approved = anything in a finished episode, any file in `ASSET_CHECKSUMS.sha256`, and any scene/line/take the producer
  approved in this episode. **Never regenerate, re-voice or re-render approved material without explicit authorization**;
  propose the change and wait.
- Reuse before creating: sets/gadgets in `src/sets/Silence.tsx`, HUD in `src/kit/SurvivalHud.tsx`, UI in
  `src/kit/SilenceUI.tsx`, existing `sp-*` and house SFX. A new sound = a new function in `scripts/audio/silence_audio.py`.
- Numbers continue from the latest canon exactly (budget, food, water, days); show every purchase.
- Audio-only fixes never re-render video (`--codec=wav` + mux, `AUDIO_STYLE.md` §4).
- Run `sha256sum -c --quiet 03_MASTER_ASSETS/ASSET_CHECKSUMS.sha256` before and after; a failure means stop and report.
- `out/` is git-ignored and dies with the container: tell the producer to download the MP4; commit only when asked.
