# FreshCo voices: the less-AI-sounding pipeline

The first story (Last Train) got comments that the voices "sound like AI". We measured why and built a better pipeline.

## Findings (same passage read by every option)

| Option | Pitch variation (semitones SD) | Same voice every line? |
| --- | --- | --- |
| OmniVoice preset + VoiceStudio's default **broadcast** effect | 3.2 | yes |
| Qwen3-TTS **voice design** (text brief) | 4.3–4.9 (most human) | **no**, identity drifts per line |
| **Chatterbox clone of a Qwen-designed take** | **3.6** | **yes** (±8 Hz) |
| OmniVoice clone of the same take | 4.5 | no (jumps 82 Hz) |
| Kokoro presets | 2.8–3.2 | yes (the common "faceless channel" sound) |

**Pipeline: design → clone → Chatterbox** (all inside VoiceStudio, free and local).
1. Design a voice with Qwen3-TTS VoiceDesign (`/v1/audio/speech` + `instructions`), keep the best 15–20 s take.
2. Save it as a clone profile (`POST /profiles`, `kind=clone`, `ref_audio`, `ref_text`).
3. Generate lines with Chatterbox and `effect_preset=raw` (never "broadcast"):
   `python scripts/audio/voice_takes.py stories/freshco/part2b-lines.tsv fc2 N=<narrator-id> M=<marco-id> --takes 3`
4. Voices that click a lot on Chatterbox (June did): generate them with the OmniVoice engine on the same clone profile.

## Cast (design briefs, so you can recreate each voice)

| Role | Brief given to the voice designer |
| --- | --- |
| Narrator | "an energetic American guy in his twenties, the kind of friend who tells wild stories, fast and expressive, a little amused at the absurd parts" |
| June | "sarcastic night-shift cashier, 20s" |
| Marco | "nervous store manager, 40s, talks too fast" |
| Walt | "gentle grandfather, 70s, slight rasp" |
| Dr. Hale | "raspy, exhausted scientist, 50s" |
| Radio | any clipped male voice + the radio filter in `AUDIO.md` |

Checks: each voice stays within ±25 Hz median pitch across lines (same person), every line transcribes correctly,
roles are clearly different from the narrator.

## Writing for a human sound

Contractions, fragments, a few "That's it." beats, ellipses for real pauses, no lists of four nouns, vary sentence
length, let the narrator react ("…and they just lose interest").
