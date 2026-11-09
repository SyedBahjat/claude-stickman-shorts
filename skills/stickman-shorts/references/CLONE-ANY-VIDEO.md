# CLONE ANY VIDEO: recreate an example video's format with your own content

Use this when the user gives an example video ("make one exactly like this"). It can be any type, not only
"You Decide" stories: explainers, top-10 lists, story narrations, history/fact videos, quizzes, would-you-rather,
skits, meme formats, kinetic-text quotes, whiteboard doodles, podcast-clip layouts, horizontal YouTube videos.

The house style itself was built this way: study the example frame by frame and sound by sound, then rebuild the
**look, pacing, layout, sound design and structure** from scratch in Remotion, with **original content**.

Copy the format, never the content: don't re-upload their video, and don't reuse their script, characters' names,
art, music or audio clips. Everything in the result is drawn, written, voiced and synthesized here.

## 1. Break it down

```bash
python scripts/analyze_reference.py path/to/example.mp4          # → reference/<name>/
```

You get `report.md` (resolution, fps, length, cut count, average shot length, loudness, palette with hex values,
words per second), contact sheets (one frame per second), the first frame of every shot, a palette swatch, a
spectrogram, the soundtrack, and a transcript if a Whisper server is running (`$TTS_URL/v1/audio/transcriptions`).

Look at every sheet and cut frame (Read the PNGs). Zoom on details:

```bash
ffmpeg -ss 12.4 -i example.mp4 -frames:v 1 reference/<name>/detail-01.png          # one exact frame
ffmpeg -ss 12 -t 2 -i example.mp4 -vf "fps=10,scale=270:-1,tile=10x2" -frames:v 1 reference/<name>/motion-01.png   # motion strip
ffmpeg -ss 30 -t 4 -i example.mp4 -vn reference/<name>/clip-01.wav                 # one sound
```

## 2. Classify it (write the answers in `reference/<name>/notes.md`)

| Question | Why it matters |
| --- | --- |
| Aspect + length? | Pick `format` (vertical / horizontal / square) and the timeline length |
| Format type? (see `FORMATS.md`) | Gives you the beat structure and the components to reuse |
| Visual style? flat 2D characters, stick figures, text only, icons + charts, doodle, collage, live footage, 3D | Decides what to reuse vs build |
| What's always on screen? | HUD, progress bar, logo, counters, a host character |
| Captions | Font, case, size, position, words per page, highlight colour, animation |
| Cards / titles / lower-thirds | Shape, colours, entry animation, when they appear |
| Camera + transitions | Push-ins, pans, zooms, shakes, cut style (hard cut, whoosh, flash, wipe) |
| Motion | Amount, easing, smooth vs on twos |
| Voice | Narrator type and pace, characters, filters; or no voice (music + text) |
| Sound | Music bed type, each SFX and when it fires, loudness, silences |
| Structure | Hook, beats and their timings, payoff, CTA, how a series continues |

### What can be rebuilt

- **Fully:** anything 2D and graphic: flat or stick characters, illustrated sets, icons, charts, maps, text
  animation, captions, UI mock-ups (phones, chats, browsers), whiteboard/doodle lines, collage of shapes.
- **As a stylized version:** live-action footage, photos, 3D renders. Rebuild the layout, pacing, text and sound
  with drawn scenes instead, and tell the user that's the trade-off. Never download or reuse their footage.
- If the user has their own footage or images, put them in `public/` and use `<OffthreadVideo>` / `<Img>`.

## 3. Build it

1. Start from `src/templates/Starter.tsx` (renders in any aspect; see its pattern: every scene sized from
   `useVideoConfig()`, `textCaptions()` for captions before you have audio). Copy it to `src/stories/<name>/`.
   For a "You Decide" story, start from `src/stories/freshco/FreshCoP2B.tsx` instead.
2. Map the style, rendering a still after each step and comparing it side by side with the reference frame:
   palette (`src/kit/style.ts` or a new palette object) → fonts (`@remotion/google-fonts`) → characters
   (reuse `Stick` and tweak `L`, `LIMB_W`, `INK`, or build a new SVG character) → captions (copy `Captions` and
   restyle) → on-screen elements → sets/backgrounds.
   ```bash
   ffmpeg -i reference/<name>/cut-004.png -i out/f120.png -filter_complex "[0]scale=-2:960[a];[1]scale=-2:960[b];[a][b]hstack" out/compare.png
   ```
3. **Show the user the side-by-side before animating the whole video.**
4. Write the new script with the same beat timings and words per second you measured.
5. Voices (`AUDIO.md`): match the reference's narrator type and pace with your own TTS voice.
6. Sounds: synthesize look-alikes in `scripts/audio/` (match pitch, length and envelope against the spectrogram).
   No-voice formats live on a music bed: synthesize one in the same script (start from `drone()` in `decide_sfx.py` and add a beat/melody with the `t`, `env`, `lp`, `reverb` helpers).
7. Register the composition in `src/Root.tsx` with the measured size and fps, render, loudnorm to the measured
   loudness (or −14 LUFS for music-led videos, −17 for narrated ones).
8. Final check: put your render and the reference side by side at 3–4 timestamps and compare cuts per minute,
   caption timing, colours and loudness. Fix and re-render before reporting.
