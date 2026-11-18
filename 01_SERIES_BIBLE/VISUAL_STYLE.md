# VISUAL STYLE: SILENCE PROTOCOL

Base house style: `.claude/skills/stickman-shorts/references/STYLE.md` (flat 2D, ink outlines, dot eyes, no mouths).
SILENCE PROTOCOL adds the darker horror palette and survival UI below. Values are copied from the source files.

## 1. Frame
1080×1920 (9:16), 30 fps. Safe layout used in every EP01 shot:
| Zone | y range | Content |
|---|---|---|
| HUD | 34 – ~250 | `SurvivalHud` (full) |
| Cards / stats / receipts | 262 – ~700 | `PurchaseToasts` (262), `BigStat`, `SpecCard`, flow chips, choice header (≈290–300) |
| Action | ~450 – 1400 | characters and sets; `WorldCam` anchors subjects at y 860 |
| Captions | 74 % (≈1420) | word captions; **86 %** on the final choice shot |
| Floor lines | 1480 (street), 1560 (equipment room), 1600–1700 (interiors) | |

## 2. Palette
House palette `C` (`src/kit/style.ts`): ink `#130f0b`, skin `#ece8d3`, alertRed `#db483b`, capYellow `#ffc338`, amber
`#e2a748`, paper `#e4d4a8`, steel `#8f969b`, water `#5d93c9`.

Series UI palette `SP` (`src/kit/SurvivalHud.tsx`):
| Token | Hex | Use |
|---|---|---|
| green | `#58d68d` | healthy values, food, option **B**, "INSTALLED", REMAINING |
| greenDim | `#2f7a52` | idle monitor borders |
| red | `#ef4b3c` | PROTOCOL, countdown, costs (−€), alerts, Rule number |
| redDim | `#7a2219` | glows |
| blue | `#5fb4ff` | drinking water, blueprint, **option A / Silent Field** |
| panel | `rgba(7,10,11,0.82)` | all UI panels (0.86–0.92 for big cards) |
| line | `#25352d` | panel borders |
| text / mute | `#d9e3dc` / `#7f8f86` | values / labels |
| amber (budget < 300k, warnings) | `#e0b34a` | |
| technical water | `#7fa6b8` | |

Set colours: sky gradient `spSky` `#0b0809 → #2a1214 → #4a1a17`; earth `#3a2a1d`; concrete `#8d8a7b` / rooms
`#58554c`; living room `#140f10`; hospital `#1e2a2a`; control room `#1f2422`; equipment room `#0f1215`; insulation
yellow `#d8b24a`; generator yellow `#d9a53a`; water gradient `#6fb0e8 → #2d5f91`; virus red `#ff3b2a`; infected skin `#8e9a86`.

## 3. Typography (`FONT` in `src/kit/style.ts`, Google Fonts via `@remotion/google-fonts`)
| Font | Use |
|---|---|
| **Anton** 400 | titles, HUD "SILENCE PROTOCOL", item names, big numbers (365, stats), cards, Rule card lines, COMMENT A OR B |
| **Montserrat** 900 | captions only: 52.5 px white, 5.1 px black stroke, uppercase, ≤ 4 words / page, yellow `#ffc338` keywords |
| **JetBrains Mono** 800 (500/700) | all data/UI: labels, € values, transcripts, timestamps, badges |
| Permanent Marker | loaded by the kit, **not used** in this series |

Money is always `€` + comma thousands (`eur()`), e.g. **€260,000**. Volumes "3,600 L". Days "365 DAYS".

## 4. Lighting & atmosphere
- Global `<Vignette strength={0.7} />` on every frame.
- Light pools: `spWarm` (interiors), `spRed` (emergency, TV, fire), `spBlue` (Silent Field, platform A), `spGreen`
  (Ghost Echo, platform B, monitors). Work-light cones `spWorkCone`. Platform beams `spBeamBlue` / `spBeamGreen`.
- Flicker: `random(seed + Math.floor(frame/2..3))` → 0.85–1.0 opacity on TVs, screens, blueprint, LED.
- Scanlines on TV / monitors (2 px black lines every 8–9 px, 25 % opacity). Red pulsing overlay (≈0.06–0.12) for alerts.
- Glitch: random horizontal offset (±9–15 px) on 2-frame steps; RGB split (cyan/red copies ±10 px) on the Rule card.

## 5. Camera & cutting
- **Hard cuts** only (cut on caption lines/words). Every shot has a slow push-in `<Cam dur from to origin>`
  (`src/kit/Overlays.tsx`): typical 1.00→1.06…1.14; close-ups on platforms 1.75→1.9. Optional decaying `shake` (6–10) on
  shocks.
- Bunker shots use `WorldCam` key-frame paths (eased in/out sine) instead of `Cam`.
- Average shot length 2–6 s; montage purchases ≈1–3 s each.

## 6. Animation conventions (timings at 30 fps)
- Pops: `spring({stiffness: 260–320, damping: 14–18})`, scale 1.3–1.6 → 1.
- Counters: `Easing.out(Easing.cubic)` over 25–50 frames (budget 0→1,000,000 over 28; resources over 24–50).
- Purchases: install over ~18–60 frames from the purchase frame; objects drop in from above (`drop()` ease, 50–140 px),
  room light turns on, toast slides in from the right, budget rolls down 8 frames later over 16 frames with a red flash.
- Walking: `walkTo` (distance-driven, no foot sliding), amp 0.8–0.85 calm; reach targets glide in over 12–16 frames.
- Typing: ~1.4 characters/frame with green `▌` cursor.
- Sound rings: `SoundRings` progress `t = frame/30`, 2–4 rings, radius 30 → max (220–520).

## 7. The Rule title card (`SilenceRule` in `SilenceP1.tsx`)
Full-screen near-black `#050303`, pulsing red radial glow, 96 scanlines, faint red waveform crossed out by a thick red
line (bottom). Top (y 400): "THE SILENCE RULES" (mono 800, 34 px, spacing 14, `#c9c4b4`) → "RULE 01" (Anton 210, red,
glow) → red bar 520×6. Centre (y 760): rule text in white Anton 118, one line per phrase (EP01: "IF YOU HEAR THEM," /
"YOU ARE ALREADY" / "ONE OF THEM."), lines spring in 5 frames apart; random RGB-split glitch. HUD and captions hidden;
music cut to silence; `sp-sting` + `tinnitus`. Held ~1.9 s (56 frames in EP01).

## 8. Captions
Kit `Captions` (`src/kit/Overlays.tsx`), word-timed from `public/captions/<line>.json`; spoken numbers shown as digits
(`365`, `3,600`, `€260,000`) via `stories/silence-protocol/remap_captions.py`. Yellow keywords per line (`YELLOW` array).

## 9. Additions in EP02
- After the preparation year the HUD right block reads **OUTBREAK / DAY N** (was DAYS UNTIL OUTBREAK / 365…0).
- Big slams reuse the CountdownSlam look via `SlamTitle` (e.g. "0 · PREPARATION COMPLETE", "DAY 7 · OF THE OUTBREAK").
- Vote opener: `MostOfYouSaid` with `colors={[SP.blue, SP.green]}` (A blue / B green) over a blurred set.
- Purchase of a carried item: toast stamp "■ ACQUIRED · PORTABLE" (never "INSTALLED").
- Final card variant: "WHAT WOULD YOU DO?" (Anton 104) over the A/B cards, COMMENT A OR B, "TO DECIDE YOUR SURVIVAL"
  (Anton 64, yellow); captions low (86 %). Cliffhanger box as EP01.
