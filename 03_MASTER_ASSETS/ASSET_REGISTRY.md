# ASSET REGISTRY: SILENCE PROTOCOL

Original assets of the series. **Reuse these files; never regenerate a replacement for an existing asset.**
Integrity: `bible/ASSET_CHECKSUMS.sha256` (108 files, SHA-256). Verify any time:
```bash
sha256sum -c --quiet stories/silence-protocol/bible/ASSET_CHECKSUMS.sha256 && echo "originals intact"
```
(After a legitimate change to a shared file, regenerate the line and note it in that episode's CONTINUITY_UPDATES.)

## Code
| Path | Role | Shared? |
|---|---|---|
| `src/kit/SurvivalHud.tsx` | HUD, UI palette `SP`, money helpers, purchase toasts | series |
| `src/sets/Silence.tsx` | all series sets, bunker, gadgets, sound rings | series |
| `src/stories/silence-protocol/SilenceP1.tsx` | EP01 (read-only) | EP01 |
| `src/Root.tsx` | composition registry (`SilenceProtocol-EP01`) | engine |
| `src/kit/Stick.tsx`, `Overlays.tsx` (`Cam`, `Captions`, `Vignette`, `Blurred`, `MostOfYouSaid`), `style.ts` (`C`, `FONT`), `mix.ts` (`makeDuck`) | house engine (unchanged) | engine |
| `src/sets/Sets.tsx` (`Svg` wrapper) | house engine | engine |

## Tools
| Path | Role |
|---|---|
| `scripts/tts/setup_tts.sh` | installs kokoro-onnx 0.6.1 + sherpa-onnx 2.0.1, downloads Kokoro v1.0 + Whisper base.en to `$TTS_DIR` (default `~/.cache/silence-tts`) |
| `scripts/tts/generate_lines.py` | first-pass narration, fastest Whisper-verified take |
| `scripts/tts/match_lines.py` | re-voice existing lines keeping exact lengths |
| `scripts/tts/loudness_match.py` | per-line loudness (match reference or `--lufs -20`) |
| `scripts/tts/check_words.py` | Whisper transcription check |
| `scripts/voiceover.mjs`, `scripts/voice-trim.mjs` | house trim/de-click/gain + word-timed caption JSON |
| `stories/silence-protocol/remap_captions.py` | caption JSON spoken numbers → digits/€ |
| `scripts/audio/silence_audio.py` | series bed + `sp-*` SFX generator (imports helpers from `decide_sfx.py`) |
| `scripts/audio/decide_sfx.py`, `freshco_audio.py` | house SFX generators |

Model sources (not in git): Kokoro `https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/{kokoro-v1.0.onnx,voices-v1.0.bin}`;
Whisper `https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-base.en.tar.bz2`.
(Hugging Face is blocked in this cloud environment; GitHub releases work.)

## Audio
| Path | Notes |
|---|---|
| `public/audio/voice/sp1-01…28.wav` | EP01 narration v2 (`af_heart`), 24 kHz mono |
| `public/captions/sp1-01…28.json` | EP01 word timings (drive EP01's cut timeline) |
| `public/audio/music/sp-bed.wav` | series music bed (95 s) |
| `public/audio/music/drone.wav` | house drone |
| `public/audio/sfx/sp-*.wav` (21) | series SFX (see AUDIO_STYLE §3) |
| `public/audio/sfx/{sub-hit,card-slam,whoosh,sirens,murmur,heartbeat,tinnitus,footsteps,gravel-steps,light-buzz,blast-hum,fc-groan-1,fc-groans,fc-generator,fc-radio-static}.wav` | house SFX used by EP01 |

## Final renders (outside git!)
| File | SHA-256 |
|---|---|
| `out/SILENCE_PROTOCOL_EP01_THE_COUNTDOWN.mp4` (v2, approved, 49 MB) | `14a8fa0f55227a70afde10719da10f7797305f2aec5e768f8316c495ab07acf8` |
| `out/SILENCE_PROTOCOL_EP01_THE_COUNTDOWN_v1_original.mp4` | `4b4363efe6c232f34becbd190aa7a96ca00bb887e61267a95999b26946863fb4` |

`out/` is in `.gitignore`. These MP4s exist only where the producer saved them. Use them as the visual and audio
reference when continuity questions arise (e.g. extract frames with `ffmpeg -ss <t> -frames:v 1`).
