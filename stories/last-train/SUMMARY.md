# LAST TRAIN — Season 1 summary (what we made, how, and what we learned)

Status: **Season 1 complete and published** (YouTube @ForgottenEarthYT + Instagram @sticktales_tv).
Everything needed to re-render is in the repo (code, voice WAVs, captions, SFX). Watch the results in `examples/videos/`, or re-render any part with `npx remotion render src/index.ts <Id> out/<name>.mp4`.

## Episodes produced (viewer votes decided the path)

| Video | Composition | Length | Viewer choice that led here |
| --- | --- | --- | --- |
| Part 1 "Last Train" | `LastTrain-P1` | 72 s | — (ends: Stay on train / Follow the stranger) |
| Part 2 "The Door" | `LastTrain-P2B` | 65 s | **B: Follow the stranger** |
| Part 3 — Ending 3 "The Lie" | `LastTrain-P3A` | 70 s | **A: Lie for him** |
| Bonus — Ending 4 "The Truth" | `LastTrain-P3B` | 70 s | viewers commented **TRUTH** |

Unproduced but written: Part 2A "The Vent", Endings 1–2 (see `script.md`). Season 2 script: `season2-script.md`.
Canon going into Season 2 = **Ending 4** (Eli alive, missing; Nora safe).

## Story facts locked in by what aired

- YOU: red forearm band, never speaks; 2nd-person narration. Sister **Nora**, 14th floor, Eastgate (9 stops on Line 4).
- **Mags** (conductor, navy + cap, flashlight) stayed with the train. **Eli** (charcoal hoodie, whisper voice) carried Dr. Vale's
  civil-defense case (dosimeter, 40 iodine packets, keycard). **Dr. A. Vale** gave Eli his card after Eli pulled him from a burning
  car; Vale's wife **Ruth** (grey bun, glasses) is in Shelter 9. **Soldier** speaks through the blast-door intercom.
- Alert 2:51 AM, impact 3:03 AM. Eli made two calls from the red wall phone in corridor CD-7 (one before, one after impact).
  He left his folded hoodie + note "Your sister's safe. Go find her. — E."
- Rules shown: RULE 1 STAY UNDERGROUND (Mags). Endings 3/4 HUD labels: IMPACT IN → DOOR OPENS IN → DAY 2.

## Voices (VoiceStudio profile ids on this Mac)

VoiceStudio archetypes: Narrator = The Anchor · Mags = American Female Elderly Low · Eli = American Male Young Adult Low **Whisper** (mix at 0.72) · Nora = The Neighbor + phone filter · Soldier = The Ogre + intercom filter · Ruth = The Librarian · Dr. Vale = The Storyteller + soft echo.

## How each video was built (repeatable pipeline)

1. Lines in `partX-lines.tsv` → `node scripts/voiceover.mjs <id> "<text>" --voice <id>` → transcribe every line, reword if wrong.
2. Filters with ffmpeg (phone / intercom / distant / memory echo) — commands in `decide-series/AUDIO.md`.
3. Episode file `src/stories/last-train/LastTrainPX.tsx`: LINES/LEN table → START frames; `wf(line, word)` times
   every cue to a spoken word; SHOTS list; SFX list; HUD clock function; captions with yellow keywords.
4. Kit reused: `kit/Stick.tsx` (rig, looks, `walk`/`walkTo`, reach IK, holdF/holdB), `kit/Overlays.tsx` (Hud, Captions,
   RuleCard, ChoiceCards, MostOfYouSaid, EndingCard, Cam, Blurred, Vignette), `kit/Props.tsx` (Phone, AlertScreen, WallMap),
   sets in `sets/` (Train carriage, Tunnel, SteelDoor, Corridor, BlastDoor, ShelterHall, CaseOpen, RouteCard).
5. SFX are synthesized: `.venv/bin/python scripts/audio/decide_sfx.py` (≈40 effects incl. detonation, hydraulic door,
   ending swell). Drone bed throughout.
6. QA: stills of every shot (bundle once, `remotion still --scale=0.5`), frame strips of every moving shot, fix, then
   render + `loudnorm I=-17`.

## Lessons (do these by default next time)

- **Motion:** calm upright walk with short steps (`walk` + `walkTo`, phase from distance) (squat-walks read as jerky).
  Hands that touch things use `reach` targets and **glide** in; never snap. Stairs use the smooth slope.
- **Staging:** check every still for overlaps (arms through bodies, rifle into chests, heads touching, characters on top of
  someone lying down, cards covering faces). Keep phones held close to the chest.
- **Voices:** every character must sound clearly different from the narrator (pitch + timbre); the whisper voice blurs
  P/B ("pills" → "bills") — reword such lines. YOU is gender-neutral ("family", not "wife").
- **Story:** plant clues in Part 1/2 and pay them off in *every* branch; if two endings would share a twist, rewrite one.
  Openers use the "MOST OF YOU SAID" pattern; endings get an ENDING N OF 4 card + an engagement ask.
- **Engagement asks** go in the description/caption/pinned comment, not baked into an approved video.
- Length lands at 65–72 s with 15–20 lines; add short suspense lines if a part runs under ~60 s.
