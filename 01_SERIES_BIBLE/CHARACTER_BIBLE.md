# CHARACTER BIBLE: SILENCE PROTOCOL

All characters use the house stick-figure rig `Stick` from **`src/kit/Stick.tsx`** (unchanged engine file). Never
draw characters another way, never change the rig's proportions, never add mouths.

## Rig (exact, from `src/kit/Stick.tsx`)
| Part | Length (px at scale 1) |
|---|---|
| thigh / shin | 128 / 126 |
| torso | 190 |
| neck | 18 |
| upper arm / forearm | 104 / 100 |
| head radius | 68 (circle) |
| limb stroke | 25 px colour + 7 px ink (`#130f0b`) each side, round caps |

- Eyes: two **dot eyes** (`r = 0.105·head`, ink), shifted by `lookAt` (−1…1). **No mouth, no nose.**
- Angles in radians, 0 = hanging down, + = toward facing side. `armF` = the character's right arm.
- Feet are planted on `floor` (px); `hip` pins the hip for sitting/crouching; `reach` = world-space IK targets.
- Helpers: `STAND`, `walk(phase, amp)`, `walkCycle(amp, scale)`, `walkTo(x0, dir, dist, total, {amp})`, `lerpPose`.

## YOU: the protagonist (the viewer)
| | |
|---|---|
| Code | `YOU` from `src/kit/Stick.tsx`: `{ body: C.skin (#ece8d3), band: true }` |
| Identity mark | **Red arm band** (`#db483b`) on the right forearm (front arm). **In every shot.** |
| Name / gender / age | **Never stated.** The protagonist is "you". Do not name or gender them. |
| Speaks? | **Never.** YOU has no dialogue; the narrator tells YOUR story in second person. |
| Scales used in EP01 | 1.0 (standard full shots, floor 1640–1700) · 0.85 (tank room) · 0.34 (inside the bunker cut-away) · 2.1 (over-the-shoulder at monitor, `hideLegs`) |
| Typical poses | standing (`STAND`), calm walk (`walkTo`, amp 0.8–0.85), startle (lean −0.08, arms raised), reaching to install (reach target glide), seated at console (`SEATED`: legF [1.5,1.55], legB [1.42,1.5], lean 0.12, hip pinned at [245,1270]) |
| Behaviour | Calm, competent, methodical; looks around (`lookAt` oscillation) when entering a new space |

## The infected ("them")
| | |
|---|---|
| Code | `TURNED` array from `src/kit/Stick.tsx`: bodies `#5d5a4f #4f5d66 #6b4f4a #57604a #6a6358 #4a4f5d`, `skin: "#8e9a86"`, `blankEyes: true` |
| Converting a person | `infectedLook(look)` in `SilenceP1.tsx`: same body colour, skin → `#8e9a86`, blank eyes. Instant switch on the frame the red ring reaches them, plus a brief red flash (opacity 0.25, ~6 frames) in close shots. |
| Pose | `zPose(frame, k)` in `SilenceP1.tsx`: arms forward (0.85 / 0.75 rad) swaying (sin /13, /11), lean 0.16, head tilt sway ±0.3 |
| Walk | slow shamble: `walk(phase, 0.6)` with arms forward, lean 0.16 |
| Voice | Never audible. Drawn as **red rings** (`SoundRings`, `#ff3b2a`, width 8–14). Speech bubble only for a single word ("HELP"). |
| Behaviour (EP01) | Drawn toward voices (they follow the Ghost Echo's broadcast); stopped by the Silent Field's dome |

## Civilians / secondary figures (EP01, background only)
| Figure | Code | Notes |
|---|---|---|
| Street civilians | `PASSENGERS[0..5]` (`src/kit/Stick.tsx`) | flee with `walk(…,1.25)` lean 0.2, then turn |
| Doctor (hospital) | `HALE` (white body `#e4e9ec`, glasses) | infected by one word |
| Infected patient | `TURNED[2]` | says "HELP" |

No named characters exist yet. Any new recurring character needs: a body colour + **one** accessory (house rule
from `.claude/skills/stickman-shorts/references/STYLE.md`), an entry here, and a distinct voice (see `AUDIO_STYLE.md`).

## Dialogue conventions
- The **narrator** carries the story. Other voices only when a character genuinely speaks (news broadcast, radio,
  conversation), and **never** an infected voice.
- Infected / outside speech = **on-screen transcript text** (`EXT MIC 01 · LIVE TRANSCRIPT`), never audio.
