# EPISODE 01: THE COUNTDOWN · CANON

Status: **COMPLETE** (v2 audio, approved). Verified against `src/stories/silence-protocol/SilenceP1.tsx`, the caption/voice
assets and the rendered MP4 (`SILENCE_PROTOCOL_EP01_THE_COUNTDOWN.mp4`: 1080×1920, 30 fps, 2,700 frames, 90.0 s).

This file is **cumulative**: it records the full story state at the end of EP01. EP02's CANON must start from this.

## 1. State at the end of EP01 (verified numbers)
| Item | Value | Where it is shown |
|---|---|---|
| Initial budget | **€1,000,000** | S2 "INITIAL BUDGET" counter; HUD from 0:19.7 |
| Spent on bunker + supplies | **€740,000** (13 purchases, table below) | toasts + FinalReceipt "TOTAL INVESTED €740,000" |
| Remaining budget | **€260,000** | HUD (amber, < €300k), "REMAINING €260,000", narration L22 |
| Food supply | **365 days** (1 person · 2,200 kcal/day) | HUD, BigStat 365-cell grid |
| Drinking (potable) water | **3,600 L** (≈ 10 L/day, sealed containers) | HUD, BigStat |
| Technical water | **12,000 L** in two 6,000 L tanks T-01/T-02; treatable, filterable, 3-stage purification | HUD, BigStat |
| Power | battery storage **96 %** ("STORAGE 96%", "POWER RESERVE 96 %") + generator | bunker, console |
| Countdown | **365 DAYS UNTIL OUTBREAK** (shown throughout; never decremented in EP01) | HUD, TV, slam |
| Day | **DAY 1 / 365** | resource console |
| Clock times shown | TV "CHANNEL 4 · 23:41"; transcripts 23:41:07, 23:41:12, 23:41:20, 23:41:31; final transcript **23:59:58** | |
| Bunker | complete: SUBLEVEL 1, −12 m, 9 rooms (see ENVIRONMENT_BIBLE) | |
| Rules | **RULE 01: IF YOU HEAR THEM, YOU ARE ALREADY ONE OF THEM.** | Rule card 1:04.8–1:06.6 |

### Purchases (exact, in on-screen order)
| # | Item (as on screen) | Cost | Budget after |
|---|---|---|---|
| 01 | Land and excavation | €100,000 | €900,000 |
| 02 | Reinforced concrete structure | €170,000 | €730,000 |
| 03 | Acoustic insulation | €110,000 | €620,000 |
| 04 | Double-entry airlock | €35,000 | €585,000 |
| 05 | Ventilation and filtration | €45,000 | €540,000 |
| 06 | Batteries and electrical | €75,000 | €465,000 |
| 07 | Generator + isolated room | €35,000 | €430,000 |
| 08 | Water storage and purification | €40,000 | €390,000 |
| 09 | Medical supplies | €12,000 | €378,000 |
| 10 | Food supplies | €18,000 | €360,000 |
| 11 | Surveillance systems | €25,000 | €335,000 |
| 12 | Furniture and security | €25,000 | €310,000 |
| 13 | Installation and contingency | €50,000 | **€260,000** |

## 2. Events of EP01 (in order)
1. An emergency broadcast interrupts TV: **365 DAYS UNTIL OUTBREAK**; ticker "VOICE-TRANSMITTED PATHOGEN · DO NOT
   LISTEN TO THE INFECTED · STAY INDOORS".
2. Images of the outbreak: a street crowd infected by one infected voice; a hospital (ICU FULL) doctor infected by the
   single word "HELP"; a chain reaction of voices.
3. You have one advantage: you know exactly when it arrives. One year, €1,000,000.
4. You enter an empty underground excavation site; a holographic blueprint ("PROJECT: SILENCE · SUBLEVEL 1") appears.
5. Construction montage: the 13 purchases above, each installed on screen.
6. Tour of resources: pantry (365 days), drinking water (3,600 L), technical tanks (12,000 L), resource console
   ("STATUS: SUSTAINABLE") → alarm: **"EXT MIC 01: VOICE DETECTED"**. "But you are not safe yet."
7. Surveillance room: external voices are converted to text only (speakers disabled). Transcript from outside:
   `hello?` · `is somebody down there?` · `please... just open the door.` · `let me in. LET ME IN.` A dark figure is visible
   on CAM 02 near the surface. → **RULE 01**.
8. Equipment room: €260,000 left, enough for ONE special technology. Two platforms light up.
9. **A: THE SILENT FIELD, €225,000:** 60 s zone of absolute silence (demo: blue dome, infected voices die at its edge).
10. **B: THE GHOST ECHO, €220,000:** autonomous drone that reproduces infected voices remotely (demo: it flies from
    the hatch, broadcasts, the infected follow it away).
11. Comparison: A leaves €35,000; B leaves €40,000; A + B = €445,000 (impossible).
12. Final: "Which one would you choose? A or B?", **COMMENT A OR B**, cliffhanger: EXT MIC 01 transcript at 23:59:58:
    **"WE KNOW YOU'RE DOWN THERE."**

## 3. Decisions
- **Gadget choice: UNRESOLVED.** Neither device was purchased. EP02 opens with the audience result.
  - If **A** wins: buy THE SILENT FIELD → budget **€35,000**.
  - If **B** wins: buy THE GHOST ECHO → budget **€40,000**.

## 4. Established facts the series must keep
- The virus rules (MASTER bible §2), Rule 01.
- Infected speech can be safely **read** as transcript text.
- The bunker has exactly the systems listed; there is one external mic (**EXT MIC 01**) and cameras CAM 01–09.
- The protagonist is alone (food is for 1 person), unnamed, silent, wears the red arm band.

## 5. Unresolved elements / open questions (for EP02+, decide deliberately)
1. **Who is outside?** Voices are transcribed at 23:41 on DAY 1 with "INFECTION RISK: HIGH" and a figure on CAM 02,
   yet the outbreak is "365 days" away. Infected already? Survivors? Something else?
2. **"WE know you're down there."** Who are "we"? Can the infected coordinate, deceive or read? (Not established.)
3. **Public knowledge vs. your advantage:** the TV broadcast shows the 365-day countdown to everyone, while narration
   says your advantage is knowing exactly when. Not reconciled on screen; one reading is that the broadcast and outbreak
   images are a flash-forward/premonition, but this was never stated.
4. **Time passed during construction:** the HUD stays at 365 days through the whole build ("one year to build").
   EP01 never shows the countdown moving; EP02 must choose how days advance (recommend: the countdown starts ticking
   from EP02 and the HUD `days` value decreases on screen).
5. How does YOU know the date? (Never explained.)
6. The €35k/€40k leftover after the choice: what it will buy.
