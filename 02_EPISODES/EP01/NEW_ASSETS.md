# EP01: Newly introduced assets

Everything below was created for EP01 and is now a **permanent series asset** (reuse, don't recreate).

## Code
| Path | What |
|---|---|
| `src/kit/SurvivalHud.tsx` | series HUD, `SP` palette, `eur`/`num`, `budgetAt`, `spendFlash`, `PurchaseToasts` |
| `src/sets/Silence.tsx` | `SPDefs`, `SoundRings`, `LivingRoom`, `Hospital`, `Street`, `Pit`, `Blueprint`, `BunkerWorld` (+ `Build`, `EMPTY_BUILD`, `FULL_BUILD`, `ROOM`, `SURFACE`), `InsulationWall`, `Pantry`, `WaterRoom`, `ControlRoom`, `EquipRoom`, `SilentFieldDevice`, `GhostEchoDrone` |
| `src/stories/silence-protocol/SilenceP1.tsx` | EP01 episode (timeline, shots, local UI components, SFX cue list, mix) |
| `src/Root.tsx` | + `SilenceProtocol-EP01` composition (2 added lines) |
| `scripts/audio/silence_audio.py` | generator for `sp-bed` + all `sp-*` SFX |
| `scripts/tts/*` | narration toolchain (added during documentation; same logic that produced EP01's voice) |
| `stories/silence-protocol/remap_captions.py` | spoken numbers → digit captions |

## Audio
- Narration: `public/audio/voice/sp1-01.wav … sp1-28.wav` (v2, `af_heart`)
- Captions: `public/captions/sp1-01.json … sp1-28.json` (v1 timings, drive the cut timeline)
- Music: `public/audio/music/sp-bed.wav`
- SFX: `public/audio/sfx/sp-{static,ews,dig,pour,drill,doors,fan,power,water,stack,buy,count,type,glitch,riser,sting,field,rotor,echo-voice,platform,alarm}.wav`

## Docs
`stories/silence-protocol/{script.md, continuity.md, voices.md, ep01-lines.tsv}` (original working notes) and this
`episodes/ep01/` folder.

## Renders (NOT in git: `out/` is ignored)
`out/SILENCE_PROTOCOL_EP01_THE_COUNTDOWN.mp4` (v2 final) · `out/SILENCE_PROTOCOL_EP01_THE_COUNTDOWN_v1_original.mp4` · `out/raw.mp4` · `out/audio_v2.wav`
