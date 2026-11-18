# CLAUDE.md

This repo is a Remotion stick-figure shorts engine. Its main production is the series **SILENCE PROTOCOL**
(interactive horror/survival, "You Decide"). The series' memory lives in `01_SERIES_BIBLE/`, `02_EPISODES/`, `03_MASTER_ASSETS/` and `04_PROJECT_FILES/`
(docs still mention their old paths: translate with `04_PROJECT_FILES/PATH_MAP.md`). Never rely on
earlier chat history: the documents below are the source of truth.

## Before any SILENCE PROTOCOL work
1. Read `01_SERIES_BIBLE/MASTER_SERIES_BIBLE.md`, then the bible file(s) for what you will touch
   (`CHARACTER_BIBLE`, `ENVIRONMENT_BIBLE`, `TECHNOLOGY_BIBLE`, `VISUAL_STYLE`, `AUDIO_STYLE`, `PRODUCTION_RULES`; asset list `03_MASTER_ASSETS/ASSET_REGISTRY.md`).
2. Read the latest completed episode's canon: **`02_EPISODES/EP02/EP02_CANON.md`**
   (update this pointer after each episode).
3. When look or sound matters, inspect the references: the source components (`src/sets/Silence.tsx`,
   `src/kit/SurvivalHud.tsx`, the latest `src/stories/silence-protocol/SilenceP<N>.tsx`), stills rendered from them, the
   audio files, and the final MP4 if the producer provides it (`out/` is git-ignored).
4. Check originals are intact: `sha256sum -c --quiet 03_MASTER_ASSETS/ASSET_CHECKSUMS.sha256`.

## Rules
- **Reuse** existing assets and components (`ASSET_REGISTRY.md`). Never regenerate a replacement for an existing asset.
- **Never redesign** the bunker, environments, YOU, the infected, the HUD, gadgets, typography or audio identity
  without the producer's explicit permission. Never edit a finished episode's code, voice, captions or docs; copy instead.
- **Never contradict canon** (budget and supply numbers, virus rules, Silence Rules, what was bought or chosen).
- **English only** for scripts, narration, captions, UI and docs.
- **Second-person narration** ("you…"); YOU never speaks and has no name or gender; other voices only for a character
  who genuinely speaks; **an infected voice is never audible** (text or red rings only).
- Every episode ends on a mutually exclusive **A/B choice**, "COMMENT A OR B" and a cliffhanger; never auto-buy the
  choice. Episodes ≥ 02 open by resolving the vote.
- **9:16, 1080×1920, 30 fps, 85–90 s.**
- Narrator: Kokoro `af_heart` via `scripts/tts/` (setup: `bash scripts/tts/setup_tts.sh`). Every line is Whisper-verified.
  SFX × `SFX_GAIN 0.5623`. Master as in `01_SERIES_BIBLE/AUDIO_STYLE.md` §4.
- In this cloud container, render with `--browser-executable=/opt/pw-browsers/chromium --chrome-mode=chrome-for-testing`.
- No paid APIs or services without authorization. Commit/push only when the producer asks, but warn them that
  uncommitted work is lost when the container is reclaimed.

## After finishing an episode
Copy `04_PROJECT_FILES/EPISODE_TEMPLATE/` → `02_EPISODES/EPNN/` and fill in `CANON.md` (cumulative state),
`PRODUCTION_SHEET.md`, `NEW_ASSETS.md` and `CONTINUITY_UPDATES.md`. Update `01_SERIES_BIBLE/` only for genuinely new permanent
facts (never delete history), refresh `03_MASTER_ASSETS/ASSET_CHECKSUMS.sha256`, and point step 2 above at the new canon.

Other stories in this repo (FreshCo, Last Train) follow `.claude/skills/stickman-shorts/`. These rules apply to
SILENCE PROTOCOL.
