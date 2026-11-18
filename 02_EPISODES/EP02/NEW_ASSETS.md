# EP02: Newly introduced assets

## Code (new)
| Path | What |
|---|---|
| `src/stories/silence-protocol/SilenceP2.tsx` | EP02 episode (timeline, shots, SFX cue list, mix). Composition `SilenceProtocol-EP02`. |
| `src/kit/SilenceUI.tsx` | **shared series UI** for EP02+: copies of EP01-local components (EP01 untouched), parameterised: `SlamTitle` (CountdownSlam look), `FlowChips`, `PlaybackDisabled`, `MonitorTranscript` (Transcript look + `corrupt` signal degradation), `SpecCard`, `Chip`, plus `WorldCam`, `SEATED`, `zPose`, `infectedLook`, `ramp`/`lin`/`lerp2` |
| `src/sets/Silence.tsx` → `WorldMap` | dark world map, red infection clusters spread with `spread` 0..1 (no single origin marked) |
| `src/sets/Silence.tsx` → `Airport` | night terminal, DEPARTURES board (rows flip to CANCELLED with `t`), abandoned luggage, floor 1640 |

## Changes to shared files (all optional props; defaults reproduce EP01 exactly)
| File | Change |
|---|---|
| `src/kit/SurvivalHud.tsx` | `SurvivalHud` + `daysLabel`, `daysValue` (EP02: "OUTBREAK" / "DAY 7"); `PurchaseToasts` + `stamp` (EP02: "■ ACQUIRED · PORTABLE") |
| `src/kit/Overlays.tsx` | `MostOfYouSaid` + `colors` (EP02: series A blue `#5fb4ff` / B green `#58d68d`, as the bible prescribes) |
| `src/sets/Silence.tsx` | `Street` + `lights` 0..1 (windows go dark); `Hospital` + `sign` (EP02: "ISOLATION WARD") |
| `src/Root.tsx` | + `SilenceProtocol-EP02` composition (2 lines) |

**EP01 regression check:** EP01 stills at frames 150, 700, 1250, 1700, 2650 were rendered before and after these changes;
decoded pixels are identical (MD5 of raw RGB).

## Audio
- Narration: `public/audio/voice/sp2-01.wav … sp2-30.wav` (Kokoro `af_heart`, 24 kHz mono, −20 LUFS each)
- No new SFX or music.

## Captions
`public/captions/sp2-01.json … sp2-30.json` (word timings; numbers remapped to digits/€; "Black Seven" → `BLACK-7`).

## Docs
`02_EPISODES/EP02/`: `EP02_SCRIPT.md`, `EP02_CANON.md`, `PRODUCTION_SHEET.md`, `NEW_ASSETS.md`, `CONTINUITY_UPDATES.md`, `README.md`, `lines.tsv`.

## Renders (out/, NOT in git)
`out/SILENCE_PROTOCOL_EP02_THE_FIRST_CONTACT.mp4` (final, mastered) · `out/ep02_raw.mp4` (unmastered render)
