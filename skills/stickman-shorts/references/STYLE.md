# STYLE: the exact look

Match `examples/videos/` and the stills in `assets/`. Don't "improve" the look: consistency is the brand.

## 1. Format

- **Vertical 9:16.** Values below are designed at 720 wide; we render **1080×1920 @ 30 fps**
  (scale every pixel value below by **1.5**; values given at 720 wide).
- Length **75–80 s** per part. Hard cuts every **2–6 s** (≈20 cuts per part).
- **Flat 2D vector** cartoon. No 3D, no textures except subtle wall noise. Built as
  **SVG inside Remotion** (React components), one component per set/prop/character.

## 2. Palette (`src/kit/style.ts`, token `C`)

| Token | Hex | Use |
| --- | --- | --- |
| `ink` | `#130f0b` | ALL outlines (characters + props), dot eyes |
| `skin` | `#ece8d3` | Heads, hands, "YOU" body |
| `olive` | `#83885a` (shade `#5f6440`) | Bunker man's jumpsuit, bunk beds, radio |
| `radioGreen` | `#465436` | Field radio body |
| `amber` | `#e2a748` | Radio dial, lit windows, warm lamp glow |
| `alertRed` | `#db483b` | "YOU" arm band, alerts, hatch ring, map circle, A-option |
| `tvRed` | `#c8241c` | NUCLEAR STRIKE screen fill |
| `capYellow` | `#ffc338` | Caption keywords, HUD countdown, "PART N" |
| `hudRed` | `#ec594a` | "● DAY 1" in HUD, rule-card label |
| `paper` | `#e4d4a8` | Rule notes, map paper |
| `bunkerWall` | `#605d52` (lit `#8d8a7b`) | Concrete bunker/basement |
| `night` | `#2f2122` → `#1c130d` | Bedroom wall / floor at night (dark maroon-brown) |
| `door` | `#462f21` | Wooden doors, furniture |
| `blanket` | `#284966` | Muted denim blue (blanket, coat) |
| `stairCream` | `#efe9d6` | Stairwell (bright, washed-out) |
| `tile` | `#d3d1bc` | Metro wall tiles |
| `signBlue` | `#28518b` | Station sign band |
| `momPurple` | `#8a5bb5` | Mom's tracksuit |
| `crowd` | `#2c3a40` | Silhouette crowd (dark teal-grey, no outlines) |
| `optionGreen` | `#3ecf6e` | B-option border/badge |

Everything is **muted and dark**; only red, yellow and the TV glow are saturated.

## 3. Characters (stick figures)

All characters share ONE rig; identity = body color + one accessory.

- **Head:** big circle, radius ≈ **0.30 × body height above hips**, fill `skin`,
  ink outline **5 px**. Two **black dot eyes** (r ≈ 4 px) side by side, slightly
  right of center when facing right. **No mouth, no nose, no ears.**
  Closed eyes = two small downward arcs (`︶ ︶`).
- **Body + limbs:** thick round-capped strokes (**~18 px** wide) with a **5 px ink
  outline** around them (draw ink stroke at width+10 underneath, then color stroke).
  Neck → torso is one straight segment. Arms and legs are two segments each (bend
  at elbow/knee), round joints, no hands/feet shapes — just rounded stroke ends.
- **Proportions:** tall and lanky. Head ≈ 1/5 of total height. Legs ≈ half the height.
- **Cast:**
  - **YOU** (viewer's avatar, 2nd-person hero): all `skin`, **red band on right
    forearm** (`alertRed`, ~45 px long). Always identifiable by the red band.
  - **Bunker man** ("the man from downstairs"): `olive` jumpsuit (torso+legs+arms),
    skin head, **black headband with headlamp** emitting a soft white light cone.
  - **Mom:** `momPurple` tracksuit, skin head, **brown hair bun** on top, brown hair.
  - **Soldier:** dark olive uniform + rounded green helmet.
  - **Crowd:** flat `crowd`-colored silhouettes, overlapping, no outline, no faces.
  - New characters: change body color + one accessory (hat, hair, bag). Nothing else.
- **POV hands:** when the viewer looks at a phone, two big skin "thumb" tubes
  (ink-outlined) come up from the bottom holding it; the right one has the red band.

## 4. Sets / backgrounds

More detailed than the characters, same flat style, **ink outlines 3 px**, shapes
with simple flat shading (one darker tone for shadow sides).
Seen sets: night bedroom (bed, nightstand clock, framed picture, window), city
skyline at night (lit amber windows, smoke, red sky glow, cars, ambulance), apartment
door "9C", bright stairwell (zig-zag stairs, red rail, big floor numbers 1/B, EXIT
sign), basement boiler room (hanging bulb, gauges, steel hatch + ladder), bunker
(concrete wall, shelf of water/cans/first-aid, bunk beds, field radio, red LED
countdown "24:00:00", vent fan, ladder up to hatch), map on wall, ops room with
monitors, metro station "CENTRAL" (tile wall, blue sign band, yellow platform edge).

- **Atmosphere is everything:** strong **vignette** (dark corners, ~60% black),
  **light pools** (radial gradients) from lamps/headlamp/TV, **headlamp cone** =
  white triangle, 25–35% opacity, soft edge.
- **Depth of field:** in close-ups (phone, radio, map) the background is the
  previous set **blurred (≈12 px)** and darkened. Use SVG/CSS blur filters.
- Dark scenes dominate. Bright stairwell/ops-room/metro scenes are washed-out
  cream with a soft white bloom at the edges.

## 5. HUD (always on screen, every frame)

Monospace (**JetBrains Mono**, bold). Top margin ≈ 7% , side margin ≈ 4%.
- **Top-left:** `● DAY 1` (hudRed, 11 px, tracking 2px) / big time `3:12` (white,
  26 px) + small `AM` / location line `FLOOR 9`, `BASEMENT`, `BUNKER · B2` (grey 9 px).
- **Top-right:** label `IMPACT IN` / `HATCH OPENS IN` (grey 9 px, right-aligned) and
  countdown `14:58` in **capYellow 20 px**, ticking down live (1 s per second of
  video, may jump on time skips). Appears once the threat is announced.
- The clock time jumps forward on story time skips ("Seven minutes later").

## 6. Captions (word-by-word)

- Font **Montserrat 900 (Black)**, UPPERCASE, white, **3 px black stroke**
  (`paint-order: stroke`) + soft dark shadow. Size ≈ **34 px** at 720 wide.
- Position: centered, baseline at **≈76% of height**. One line, max ~22 chars.
- Pages of **1–5 words**; each word **appears exactly when spoken** (text builds up
  word by word, then the page clears). No bounce, a tiny 3-frame scale 1.08→1 pop.
- **Keywords in `capYellow`** (nouns/verbs that carry the story: WAKE, CITY,
  DOOR, BASEMENT, FLASH, MOM, numbers). ~1–2 per page.

## 7. On-screen cards

- **Rule note** (`RULE NUMBER ONE` …): cream `paper` card, rotated **−4°**, ink
  border + drop shadow, small red mono label on top, then 2–3 lines of big
  **Anton** UPPERCASE black text ("NEVER LOOK AT THE FLASH"). Slams in (scale 1.3→1,
  6 frames) top-left, then shrinks into the corner and stays for the scene.
- **Phone UI:** dark lock screen (`Monday`, big time, red pill "23 ALERTS",
  notification rows; emergency rows have red borders). White iOS-style banner for
  texts (pink "M" avatar, name, message). Messages app = white screen, grey/blue
  bubbles, red "Not Delivered".
- **TV alert:** full red screen, yellow radiation trefoil, "NUCLEAR STRIKE" in
  Anton white, countdown in mono yellow.
- **Choice cards (end of every part):** two dark (`#121212`) rounded boxes, full
  width minus margins, at ≈74% and ≈79% height. Left square badge with letter
  (A = alertRed, B = optionGreen), **Anton/Bebas Neue** white text, border in the
  badge color with a soft glow. Above them **"FOLLOW FOR PART N"** in Anton, white
  with "PART N" yellow. Cards appear one by one as the narrator says each option.
- **"MOST OF YOU SAID"** opener (next part): same title style, both cards shown,
  then the losing card disappears and the winner zooms/glows.

## 8. Camera & motion

- 30 fps, **smooth** (not on twos). Every shot has a slow **push-in 1.00→1.06**
  or slow pan; some shots start with a fast **ease-out settle** (first ~0.5 s).
- **Hard cuts only.** No crossfades, no wipes.
- Characters: simple limb keyframes with ease-in-out (walk cycles, knocking, pulling
  hatch, crouch, hands over head). Small idle sway. Blinks every 2–4 s.
- **Flash:** full white frame for 2–3 frames, then everything dims + screen shake
  (8 px, decaying over 1 s) when "the bunker shakes".
- Big countdown/LED digits flicker slightly.

## 9. Built cast and HUD variants

- Looks in `src/kit/Stick.tsx`: `YOU`, `BUNKER_MAN`, `MOM`, `MAGS`, `ELI`, `RUTH`, `SOLDIER`, `JUNE`, `MARCO`,
  `WALT`, `HALE`, `TURNED[]` (zombies: grey-green skin, blank eyes), `PASSENGERS[]` (background people).
  A new character is one line: `{ body: "#hex", <one accessory> }` (accessories: `band`, `headlamp`, `bun`,
  `helmet`, `cap`, `hair`, `glasses`, `shortHair`, `tie`, `flatCap`, `hearingAid`, `hood`, `skin`, `blankEyes`).
- `Dog` (`src/kit/Dog.tsx`): walking, wagging, barking, head tilt, crouch.
- HUD: `Hud` (countdown style, "IMPACT IN 14:58") or `ZombieHud` (day, clock, place, MUSIC ON/OFF chip, extra
  line like "GENERATOR 12%"). Pick one per story and keep it for the whole season.
