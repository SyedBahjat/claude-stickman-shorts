# COPY A REFERENCE: recreate any example video's format with your own story

Use this when the user gives an example video ("make it look exactly like this") instead of, or as well as, a script.
This is how the house style itself was built: study the example frame by frame and sound by sound, then rebuild
the **look, pacing, sound design and format** from scratch in this engine, with an **original story**.

Copy the format, never the content: no re-uploading their video, no reusing their story, characters' names,
lines, music or audio clips. Our art, voices and SFX are all made in this repo.

## 1. Break it down

```bash
python scripts/analyze_reference.py path/to/example.mp4          # → reference/<name>/
```

You get `report.md` (format, cut count, average shot length, loudness, palette, words per second), contact sheets
(one frame per second), the first frame of every shot, a palette swatch, a spectrogram, the soundtrack, and a
transcript if a Whisper server is running (VoiceStudio has one at `$TTS_URL/v1/audio/transcriptions`).

Look at every sheet and cut frame (Read the PNGs). Then zoom on details:

```bash
ffmpeg -ss 12.4 -i example.mp4 -frames:v 1 -vf scale=1080:-2 reference/<name>/detail-hud.png      # one frame
ffmpeg -ss 30 -t 4 -i example.mp4 -vn reference/<name>/clip-sfx.wav                              # one sound
```

## 2. Fill this checklist in `reference/<name>/notes.md`

| Area | Questions |
| --- | --- |
| Format | Aspect, length per part, cuts per part, average shot length, part structure |
| Palette | Background tones, outline colour, skin, accent colours (map each to a `C` token or add new ones) |
| Characters | Head size vs body, eyes/mouth, limb thickness, outline width, how identity is shown (colour + 1 accessory?) |
| Sets | Detail level vs characters, lighting (vignette, light pools), blur on close-ups |
| HUD | What's always on screen, where, which font, what changes (clock, day, countdown) |
| Captions | Font, case, size, position (% of height), words per page, keyword colour, animation |
| Cards | Rule notes, choice cards, title cards, endings: shape, colours, when they appear, how they animate |
| Camera | Push-ins, pans, shakes, cut style (hard cut / whoosh / flash) |
| Motion | Walk style, gesture amount, blinking, frame rate feel (smooth vs on twos) |
| Voice | Narrator gender/age/pace (words per second), character voices, filters (radio/phone) |
| Sound | Bed type (drone, music), each SFX and when it fires, loudness, silences |
| Story beats | Hook line, escalation, rules, twist, dilemma, question, CTA, how part 2 opens |

## 3. Map it onto the engine

- **Same as the house style?** Keep the kit, just adjust tokens in `src/kit/style.ts`.
- **Different look?** Change in this order, rendering a still after each step and comparing side by side with
  the reference frame: palette tokens → `Stick` proportions (`L` lengths, `LIMB_W`, `INK` in `Stick.tsx`) →
  face → caption style (`Captions` in `Overlays.tsx`) → HUD → cards → sets.
- **Different sounds?** Synthesize look-alikes in `scripts/audio/` (match pitch, length and envelope against the
  spectrogram), never copy their audio.
- Compare a still of yours next to the reference frame:
  `ffmpeg -i reference/<name>/cut-004.png -i out/f120.png -filter_complex "[0]scale=-2:960[a];[1]scale=-2:960[b];[a][b]hstack" out/compare.png`

Show the user the side-by-side before animating the whole part.

## 4. Write the story

Their format, our story: run `STORY.md` with the same beat timings you measured (hook length, where the rules
come, where the dilemma lands). Then follow `WORKFLOW.md`.
