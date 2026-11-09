# WORKFLOW: building and rendering an episode

Stack: **Remotion 4** + **flat SVG React components**. Fonts from `@remotion/google-fonts` (Montserrat 900,
Anton, JetBrains Mono, Permanent Marker). Audio with `<Audio>` from `@remotion/media`.

## Layout

```
src/
  kit/      style.ts (palette C, fonts), Stick.tsx (rig + cast), Overlays.tsx (Hud, Captions, RuleCard,
            ChoiceCards, MostOfYouSaid, EndingCard, Cam, Vignette, Blurred), Props.tsx (Phone, AlertScreen,
            WallMap), ZombieHud.tsx, Dog.tsx, mix.ts (makeDuck)
  sets/     Sets.tsx (Bedroom, City, Hallway, Stairwell, BoilerRoom, Bunker…), Train.tsx, Tunnel.tsx, Store.tsx
  stories/<story>/<Story>P<N>.tsx     one file per part
  templates/Starter.tsx               any-aspect starter for non-"You Decide" formats (FORMATS.md)
  Root.tsx  registers every part as a 1080×1920, 30 fps <Composition>
stories/<story>/   script.md, continuity.md, voices.md, partN-lines.tsv
public/audio/{voice,sfx,music}/   public/captions/<line>.json
```

## Steps

1. **Script → shot sheet** (`STORY.md`). Get the user's OK on the story and the A/B options.
2. **Cast:** pick looks (`STYLE.md` §9) and voices (`AUDIO.md`). New look or set? Render a still and get approval.
3. **Voices:** generate every line, transcribe to check the words, note each line's frame count.
4. **Build the part** by copying the closest existing episode (`src/stories/freshco/FreshCoP2B.tsx` is the
   cleanest template) and replacing the timeline:
   - `LEN: [voiceFrames, gapAfter][]` per line → `START`, `st(n)` (line start), `wf(n, i)` (frame word i is spoken).
   - `SHOTS: { at, place, render(dur) }[]`: a hard cut per entry; each shot is a set + `Stick`s inside `<Cam>`.
   - `CAPS` from the caption JSONs + `YELLOW` keywords per line.
   - `SFX: [name, frame, volume][]`, beds multiplied by `duck(f)`.
   - `ChoiceCards` at the end, `MostOfYouSaid` at the start of parts ≥ 2.
5. **Register** the composition in `src/Root.tsx`, run `npm run typecheck`.
6. **Stills check:** `npx remotion still src/index.ts <Id> out/f<N>.png --frame=<N>` at the hook, every card,
   every contact moment and the choice. Look at each one.
7. **Motion check** with frame strips (below), then **render:**
   `npx remotion render src/index.ts <Id> out/raw.mp4 --concurrency=6` → loudnorm (`AUDIO.md` §4) → `ffprobe`.

## Rig essentials

```tsx
<Stick x={540} floor={1660} look={YOU} facing={1} pose={walk(phase, 0.9)}
       reach={{ handF: [700, 1300] }} holdF={<CoolerBag />} />
```

- Angles in radians, 0 = hanging down, + = toward the facing side. `armF` is the right arm (red band).
- `STAND`, `walk(phase, amp)`, `walkCycle(amp, scale)`, `walkTo(x0, dir, dist, total)`, `lerpPose(a, b, t)`.
- `reach` = world-space IK targets for `handF/handB/footF/footB`; `hip` pins the hip (crawl, climb, crouch).
- `holdF`/`holdB` draw a prop at the hand so it moves with it.

## Motion rules (learned the hard way)

- **Walking is smooth, calm and upright.** `phase = distance / walkCycle(amp)` so feet never slide, `walkTo` to
  ease into a stop. amp 0.75 calm, 0.9 normal, 1.25 hurrying. Never planted-foot squat walks (`gait`): jerky.
- **Every touch is a reach target** (handles, rungs, phones, cranks), never guessed arm angles.
- **Never snap a hand onto a target:** glide the reach point from rest to contact with an eased 0→1 value.
- **Held props** go in `holdF`/`holdB`.
- All motion from `useCurrentFrame()` with `interpolate`/`spring`; randomness only via `random(seed)`.
- Hard cuts only. Each shot gets a slow push-in (`<Cam from={1} to={1.06}>`).
- **Review moving shots as frame strips**, not single stills:
  `ffmpeg -ss <t> -i out/raw.mp4 -vf "select='not(mod(n\,6))',scale=270:-1,tile=8x1" -frames:v 1 strip.png`.
  Check feet on the floor, hands on their targets, no limbs through props, nobody hidden behind a card.
- Don't reveal a twist early: hide a crowd/creature until its line.

## Final checklist

- [ ] 1080×1920, 30 fps, 75–90 s, a hard cut every 2–6 s
- [ ] HUD on every frame; clock/day/place/countdown continue from the last part
- [ ] Captions word-synced, yellow keywords, nothing covering faces
- [ ] YOU has the red arm band in every shot
- [ ] Vignette + light pools; close-ups have a blurred background
- [ ] Every line transcribed and correct; no clipping; voices not time-stretched
- [ ] Beds ducked under speech; final ≈ −17 LUFS
- [ ] Opens with "Most of you said…" (parts ≥ 2), ends on the A/B question + FOLLOW FOR PART N
- [ ] Description includes the question and the engagement ask (not baked into the video)
