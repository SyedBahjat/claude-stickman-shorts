# AUDIO: voices, music, SFX, mix

Target: final mix about **−17 LUFS integrated**, the voice always the loudest thing, a bed always underneath,
SFX just under the voice. Everything except the voices is **synthesized in code**, so there are no library tracks
and no copyright or Content ID claims.

## 1. Voices

### Choosing a TTS

`scripts/voiceover.mjs` talks to any **OpenAI-compatible `POST /v1/audio/speech`** server, or takes a WAV you made
anywhere (`--from`).

| Option | Cost | Notes |
| --- | --- | --- |
| [VoiceStudio](https://github.com/debpalash/VoiceStudio) | free, local | Default (`TTS_URL=http://localhost:3900`). Bundles OmniVoice, Chatterbox, Qwen3-TTS, Kokoro, and a Whisper endpoint for checking words. 60 voice archetypes. |
| Any OpenAI-compatible server (Kokoro-FastAPI, openedai-speech, OpenAI) | free / paid | Set `TTS_URL`, `TTS_MODEL`, `TTS_API_KEY`. |
| ElevenLabs, your own mic, anything else | varies | Export a WAV, then `node scripts/voiceover.mjs <name> "<text>" --from take.wav --trim --loud -16`. |

### Roles

| Role | Sound |
| --- | --- |
| **NARRATOR** (second person, "you…") | Mid pitch, urgent, fast, a storyteller who reacts |
| **Each character** | Must be clearly different from the narrator (pitch or timbre). Pick by ear. |
| **Phone / radio / intercom** | Any voice + the radio filter below |

Write the chosen voice ids into `stories/<story>/voices.md` (ids are per machine, so also write the archetype
name or design brief so others can recreate it).

### Not sounding like AI (what we measured)

- Never use VoiceStudio's default `broadcast` effect preset: it flattens the voice into "AI radio". Use `raw`.
- Best result: design a voice with Qwen3-TTS (a text brief), save the best take as a **clone profile**, then
  generate every line with **Chatterbox** from that clone. Human pitch movement, same person every line.
- Voices that click on Chatterbox: render them with OmniVoice on the same clone profile.
- `stories/freshco/voices.md` has the measurements and the design briefs.

### Clean pipeline (fixes "shattered / glitching" voices)

- **Never** time-stretch (atempo), silence-squash (silenceremove), or dynamic `loudnorm` a voice line. They chop
  the harmonics into blocks and it sounds broken. Lines keep their natural length; a part can run 85–90 s.
- One line: `node scripts/voiceover.mjs <name> "<text>" --voice <id> --trim --loud -16`
  (edge trim → adeclick → one linear gain to −16 LUFS, peak ≤ −1 dBFS → word-timed captions).
- A whole part, best of 3 takes per line (VoiceStudio + Chatterbox):
  `python scripts/audio/voice_takes.py stories/<story>/part1-lines.tsv <prefix> N=<narrator-id> J=<id> --takes 3`
- **Check every line's words:**
  `curl -s $TTS_URL/v1/audio/transcriptions -F file=@public/audio/voice/<name>.wav -F model=whisper-1`.
  If a word is wrong, generate a few more takes or reword the line (engines are often deterministic per text).
- **Radio / phone voice:** `ffmpeg -i in.wav -af "highpass=f=300,lowpass=f=3200,acompressor,volume=1.3" out.wav`
  and lay `fc-radio-static` under it.
- Pace: ~2.6 words/s. Gaps of 0.2–0.4 s between lines; holds of 0.8–1.5 s after big beats (the threat, the reveal,
  the flash, the question).

## 2. Music bed

Not a melody: a **dark low drone** (sub pad 30–90 Hz + slow pulse), constant for the whole part. It drops to
near-silence for 1–2 s after a shock beat, then returns. Story-specific beds are allowed (FreshCo uses a cheerful
supermarket jingle on the PA that warps as the generator dies).

## 3. SFX (all in `public/audio/sfx/`)

Built by `npm run sfx` (`scripts/audio/decide_sfx.py` + `scripts/audio/freshco_audio.py`):

alert-beeps, alert-chorus, blast-hum, brake-screech, card-slam, crank, debris, detonation, ding, door-pound,
ending-swell, footsteps, gravel-steps, hatch, heartbeat, hydraulic, keypad, light-buzz, murmur, phone-buzz,
rat-squeaks, receiver, rifle-cock, seal-boom, sirens, sparkle, sparks, sub-hit, tick, tinnitus, train-rumble,
tv-on, whoosh, and the FreshCo set fc-bark, fc-door-chime, fc-feedback, fc-freezer-hum, fc-generator,
fc-glass-crack, fc-glass-thuds, fc-groan-1, fc-groans, fc-growl, fc-lock, fc-radio-static, fc-scuff, fc-shutter,
fc-wind. Music: drone, fc-jingle, fc-jingle-pa, fc-jingle-warped.

New sound? Add a function to a script in `scripts/audio/` (numpy + scipy synthesis, see the helpers `noise`, `bp`,
`env`, `reverb`, `thump`), run it, and ask the user to listen before the final render.

Card slam on every rule/choice card, whoosh on some hard cuts, time SFX to caption words with `wf(line, word)`.

## 4. Mix levels

- Voices: −16 LUFS each (`--loud -16`).
- Continuous beds (music, drone, hums, wind, crowd) sit **≤ −30 LUFS in pauses** and **duck under every spoken
  line**: `const duck = makeDuck(spans, 0.3)` from `src/kit/mix.ts`, then `volume={(f) => 0.1 * duck(f)}`.
- One-shots (slams, crashes, barks) can be louder but short. Never swell music under speech.
- Final: render, then `ffmpeg -i raw.mp4 -c:v copy -af loudnorm=I=-17:TP=-1.5:LRA=11 -c:a aac -b:a 192k out.mp4`.
- Verify: `ffmpeg -i out.mp4 -af ebur128=framelog=quiet -f null -` (≈ −17), and a voice-free slice ≈ −30.
