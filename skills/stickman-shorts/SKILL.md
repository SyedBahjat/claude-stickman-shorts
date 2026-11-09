---
name: stickman-shorts
description: Make and clone short-form and YouTube videos with Remotion and 2D animation. Built-in format is stick-figure "You Decide" story shorts (9:16 YouTube Shorts, TikTok, Instagram Reels) where viewers vote A or B and the next part follows the winning path. Also recreates ANY example video the user provides (explainers, top-N lists, story narrations, history/fact videos, quizzes, would-you-rather, skits, chat stories, kinetic text, whiteboard, horizontal long-form) by analyzing its cuts, pacing, palette, captions and sound, then rebuilding the format with original content. Covers scripts, stick-figure rig, sets, captions, natural TTS voices, copyright-free synthesized SFX and music, mixing and rendering in vertical, horizontal or square. Use for stickman/stick figure animation, "you decide" or choose-your-own-adventure shorts, the next part after a vote, faceless channel videos, or "make a video like this one".
---

# Stickman Shorts

Flat-2D animated videos built as SVG React components in Remotion, in any aspect ratio.

- **Built-in format:** vertical (1080×1920, 30 fps) stick-figure "You Decide" story shorts. Each part is ~75–90 s,
  told in second person ("you…"), ends on an A/B choice the audience votes on; the next part opens with
  "Most of you said…" and follows the winning path.
- **Any other format:** give it an example video and it rebuilds that format (layout, pacing, captions, sound)
  with original content. See `references/CLONE-ANY-VIDEO.md` and `references/FORMATS.md`.

## 0. Find or set up the engine

The engine is the Remotion project from https://github.com/SyedBahjat/claude-stickman-shorts.

- If the working directory has `src/kit/Stick.tsx`, you are in the engine. Use it.
- Otherwise ask where to create the project, then:
  `git clone https://github.com/SyedBahjat/claude-stickman-shorts <folder> && cd <folder> && npm install`
- Needs Node 18+, ffmpeg on PATH, Python 3 with `pip install -r requirements.txt` (numpy, scipy) for SFX and the
  reference analyzer, and a TTS (see `references/AUDIO.md`; VoiceStudio is free and local).
- Smoke test: `npx remotion still src/index.ts FreshCo-P2B out/test.png --frame=300`, then look at the PNG.

## 1. Pick the job

| The user wants… | Do this |
| --- | --- |
| A new series from an idea | Pitch 3 loglines → write the whole branching season in `stories/<story>/script.md` (`references/STORY.md`) → build Part 1 |
| The next part ("people chose B") | Read `stories/<story>/script.md` + `continuity.md`, build Part N for that path, open with `MostOfYouSaid` |
| To copy an example video (any type) | `references/CLONE-ANY-VIDEO.md`: analyze it, classify it, match the look and sound, write original content |
| A different kind of video (explainer, top-5, quiz, chat story, horizontal…) | `references/FORMATS.md` → start from `src/templates/Starter.tsx` (`--props='{"format":"horizontal"}'`) |
| To change voices / sound | `references/AUDIO.md` |

## 2. Build (details in `references/WORKFLOW.md`)

1. Shot sheet + lines TSV → user approves the script and the A/B options.
2. Voices: `node scripts/voiceover.mjs <name> "<line>" --voice <id> --trim --loud -16` (or `--from <wav>`).
   Transcribe every line to check the words.
3. Copy the closest episode in `src/stories/` (start from `src/stories/freshco/FreshCoP2B.tsx`), replace the
   timeline (`LEN`, `SHOTS`, `CAPS`, `SFX`), register it in `src/Root.tsx`, `npm run typecheck`.
4. Render stills at every key beat and frame strips of every moving shot. **Look at them** before rendering.
5. `npx remotion render src/index.ts <Id> out/raw.mp4 --concurrency=6`, then loudnorm to −17 LUFS.
6. Hand over the MP4 plus a title, description (with the A/B question and "comment A or B"), and hashtags
   for YouTube Shorts / TikTok / Reels.

## 3. Rules that matter most (for the house style; cloned formats follow the reference instead)

- **Look:** follow `references/STYLE.md` exactly: muted dark palette, ink outlines, dot eyes, no mouths,
  identity = body colour + one accessory, the viewer's character `YOU` always wears a red arm band.
- **Story:** second person, short sentences, numbered rules, a held reveal, a genuinely hard A/B choice.
- **Motion:** calm upright walks driven by distance (no foot sliding), hands touch things through `reach`
  targets that glide in, props in `holdF`/`holdB`, hard cuts with slow push-ins.
- **Voices:** never time-stretch or silence-squash lines (sounds shattered), never use a "broadcast" effect,
  characters sound clearly different from the narrator.
- **Mix:** voices −16 LUFS, beds ducked with `makeDuck`, final −17 LUFS. All SFX/music synthesized in
  `scripts/audio/`, so nothing gets copyright-claimed.
- **Before reporting:** look at the stills and strips; never auto-play audio on the user's machine.
- Don't bake "like and subscribe" asks into the video; put them in the description.

## References

- `references/STYLE.md`: palette, characters, sets, HUD, captions, cards, camera
- `references/STORY.md`: part structure, writing rules, shot sheet, branching
- `references/AUDIO.md`: TTS options, human-sounding voices, SFX list, mix levels
- `references/WORKFLOW.md`: code layout, rig API, motion rules, render + final checklist
- `references/CLONE-ANY-VIDEO.md`: recreate any example video's format
- `references/FORMATS.md`: beat structures and build notes for 12 common video formats
