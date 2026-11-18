---
name: token-optimizer
description: Working discipline for keeping context and token use low in this repo without lowering output quality. Use at the start of any session here, before exploring the repo, reading docs, launching subagents or running verbose commands, and when a session is getting long.
---

# Token optimizer

Quality comes first: if saving tokens would risk canon, approved assets or a correct render, read the file.

## Find, don't scan
- Start from what is already known: `CLAUDE.md` (auto-loaded), the canon pointer, `ASSET_REGISTRY.md`, the latest
  `PRODUCTION_SHEET.md`. Run `bash skills/episode-production/scripts/ep_status.sh` instead of listing directories.
- Locate before reading: `grep -n` / Glob for the symbol, then read only that range (`offset`/`limit`).
  Episode files are 800+ lines; read them whole only when copying them.
- Ignore `node_modules/`, `public/` binaries, `package-lock.json`, `out/`, FreshCo/Last Train code unless the task names them.
- Read a bible file only when the task touches its subject (map in the `episode-production` skill).

## Don't redo finished work
- Facts in a canon, production sheet or earlier turn are settled; don't re-derive or re-verify them.
- A command that already succeeded this session is not rerun "to be sure" unless files changed since.
- Keep the producer's decisions where they are recorded; don't reopen them.

## Scripts over reasoning
| Need | Deterministic tool |
|---|---|
| Session/repo status | `skills/episode-production/scripts/ep_status.sh` |
| Asset integrity | `sha256sum -c --quiet 03_MASTER_ASSETS/ASSET_CHECKSUMS.sha256` |
| Files an episode needs | `skills/render-qa/scripts/check_episode_assets.sh <N>` |
| Video specs, decode, loudness | `skills/render-qa/scripts/qa_video.sh <mp4>` |
| Narration words | `python scripts/tts/check_words.py <wavs>` |
| Line loudness | `python scripts/tts/loudness_match.py …` |
| Types | `npm run typecheck` |
Arithmetic (frames, money, durations) goes through a one-line `python3 -c` or the code, not in-head.

## Quiet commands
- Use `-v error` / `-hide_banner -nostats` on ffmpeg/ffprobe, `--log=error` on Remotion where output isn't needed,
  `| tail -n 20` on long logs, `git status --short`, `git log --oneline -5`.
- Render in the background and check the end of the log instead of streaming progress.
- Look at stills at `--scale=0.5`; use frame strips instead of many single stills.

## Subagents and replies
- Don't spawn subagents for anything a few greps or one script answers; each starts cold and re-reads the repo.
- Report results and decisions, not the steps taken; don't paste files back to the producer.
