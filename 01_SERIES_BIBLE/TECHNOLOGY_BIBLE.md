# TECHNOLOGY BIBLE: SILENCE PROTOCOL

## 1. Bunker systems (all purchased in EP01, all canon)
| System | Function (as shown) | Cost |
|---|---|---|
| Land and excavation | site + pit | €100,000 |
| Reinforced concrete structure | shell, rebar | €170,000 |
| Acoustic insulation | 3 layers on all outer walls (plus a decoupled panel on the close-up). **Purpose: keep external sound OUT.** | €110,000 |
| Double-entry airlock | **two reinforced doors**: ceiling hatch + side door | €35,000 |
| Ventilation and filtration | working air circulation with **acoustic silencers** on the duct; quiet fan ("SILENCED AIR · 18 dB"). Air in, noise blocked. | €45,000 |
| Batteries and electrical | 2 racks × 5 cells, "STORAGE 96%", console "POWER RESERVE 96 %" | €75,000 |
| Generator + isolated room | generator on anti-vibration spring mounts inside a double-walled technical room | €35,000 |
| Water storage and purification | 2 × 6,000 L technical tanks, filter line (3-stage purification), drinking-water jugs | €40,000 |
| Food supplies | 365 days, shelves A1–B3 | €18,000 |
| Medical supplies | med cabinet + supply boxes | €12,000 |
| Surveillance systems | 9 cameras (CAM 01–09, 2 visible poles on the surface), monitor wall, **EXT MIC 01** | €25,000 |
| Furniture and security | bunks, table, security locker | €25,000 |
| Installation and contingency | finishing, cabling | €50,000 |
| **TOTAL** | | **€740,000** |

Design principles (canon): insulation exists to stop outside sound entering; the bunker still breathes (ventilation
works); machines are quiet and vibration-isolated.

## 2. The Speech-to-Text system (EXT MIC 01): central mechanic
- External microphone → **SPEECH-TO-TEXT (processing)** → **SCREEN ONLY (speakers off)**.
- Audio is **never** played through speakers or headphones. UI shows "AUDIO PLAYBACK: DISABLED — TEXT ONLY" with a
  crossed-out speaker icon.
- Transcript format: `[HH:MM:SS] SPEAKER UNKNOWN · INFECTION RISK: HIGH` then `> text` (JetBrains Mono, typed at
  ~1.4 chars/frame, green block cursor `▌`).

## 3. The Survival HUD (permanent, every episode): `src/kit/SurvivalHud.tsx`
```tsx
<SurvivalHud state={{ budget, food, drink, tech, days }} show={0..1} mode="full"|"min" flash={0..1} alert={0..1} pulse={0..1} />
```
- Panel: left/right 30 px, top 34 px, `rgba(7,10,11,0.82)`, border 2 px `#25352d`, radius 10.
- Header: blinking red dot (15-frame blink) + **SILENCE PROTOCOL** (Anton 40, letter-spacing 5, "PROTOCOL" red
  `#ef4b3c`); right: "DAYS UNTIL OUTBREAK" + number (JetBrains Mono 800, 36 px, red).
- `mode="full"` adds 4 cells (widths 300/200/250/250): **AVAILABLE BUDGET** (green `#58d68d`; **amber `#e0b34a`
  below €300,000**; red flash while spending) · **FOOD** "365 DAYS" (green) · **DRINKING WATER** "3,600 L" (blue
  `#5fb4ff`) · **TECHNICAL WATER** "12,000 L" (`#7fa6b8`). `null` value = "—" dimmed (not stocked).
- `mode="min"` = header only (used in the EP01 cold open). `alert` = red border + jitter. `pulse` = slight scale.
- Helpers: `eur(n)` → "€260,000", `num(n)`, `budgetAt(start, purchases, frame)` (each purchase rolls down over 16
  frames after an 8-frame delay, ease-out cubic), `spendFlash`, `PurchaseToasts` (receipt under the HUD at top 262:
  "PURCHASE 0N/NN", "■ INSTALLED", item in Anton 40, "−€X" mono 38 red).
- **Hidden** only during Rule title cards.

## 4. Gadgets: the EP01 choice *(resolved in EP02: A bought)*
### A: THE SILENT FIELD · €225,000 (`SilentFieldDevice` in `src/sets/Silence.tsx`)
- Look: grey cylinder emitter, 3 glowing **blue rings** (`#5fb4ff`), translucent blue core on top, model label
  **"SF-60"**, blue halo. Displayed on platform A.
- Function: a **zone of absolute acoustic silence around its user for 60 seconds**; immediate personal protection.
- Visual: blue dome (`spDome` gradient, r ≈ 330 around YOU) with bright rim; red sound rings **vanish at the dome
  surface**; countdown badge above the dome from 60. Activation SFX `sp-field`.
- If bought: budget €260,000 → **€35,000**.
- **EP02: BOUGHT (audience vote A). Owned by YOU.** Producer's working name: "Campo Muto" (on screen always THE SILENT FIELD).
  - **Portable, hand-carried**, never installed in the bunker. Drawn with the original `SilentFieldDevice` at
    **`scale 0.5`** held in YOU's front hand (`SilenceP2.tsx` `Carried`: offset 62 px below the hand). Seated at the
    console, YOU holds it upright on the desk.
  - **Standby look** (not activated): `on ≈ 0.25–0.4`, rings dim and pulsing, **no dome**. The dome (`spDome`, r ≈ 330,
    countdown from 60, SFX `sp-field`) is shown **only** on a real activation.
  - Status after EP02: **never activated.** Single-use vs rechargeable: not established.

### B: THE GHOST ECHO · €220,000 (`GhostEchoDrone`)
- Look: dark grey quadcopter (2 visible arms/rotors), front **speaker array** with 7 green LEDs, green status light,
  green halo. Displayed on platform B.
- Function: **autonomous drone** that **reproduces infected voices remotely** to lure the infected away from you.
- Visual: green rings (`#58d68d`) from the drone; the infected turn and shamble after it, away from the hatch.
  SFX `sp-rotor`, broadcast = `sp-echo-voice` (wordless synthetic warble).
- If bought: budget €260,000 → **€40,000**.
- *(EP02: not bought.)*

**Mutually exclusive:** A + B = €445,000 > €260,000 (shown on screen as "A + B = €445,000 ✕ ONLY €260,000").

## 5. Interface components (EP01-local, defined in `src/stories/silence-protocol/SilenceP1.tsx`)
These are not exported. To reuse them in EP02+, **copy** them into a new file (e.g. `src/kit/SilenceUI.tsx`) and
import from there; **do not edit EP01's file**.
| Component | Look |
|---|---|
| `CountdownSlam` | giant red "365" (Anton 300, ink stroke 6) + "DAYS UNTIL OUTBREAK" (Anton 64), slams in with spring |
| `BigStat` | resource card at top 290: label (mono 26), value (Anton 120, colour), sub line, optional children (e.g. 365-cell food grid, 37 columns) |
| `ResourceConsole` | full "RESOURCE MANAGEMENT · DAY 1 / 365" table with bars; status box "STATUS: SUSTAINABLE" (green) or "⚠ EXT MIC 01: VOICE DETECTED" (red alert) |
| `Surveillance` flow chips | EXT MIC 01 (red) › SPEECH-TO-TEXT (amber) › SCREEN ONLY (green) |
| `Transcript` | full-screen monitor transcript (see §2) |
| `SilenceRule` | Rule title card (see `VISUAL_STYLE.md` §7) |
| `SpecCard` | product card: letter tile, name (Anton 66), price (mono 46), two "▸" spec lines |
| `Compare` | two columns A/B with price and "€35,000 LEFT" / "€40,000 LEFT" + red "A + B" warning |
| `FinalChoice` | final cards "A THE SILENT FIELD — €225,000" (blue) / "B THE GHOST ECHO — €220,000" (green), **COMMENT A OR B** (Anton 120), red transcript cliffhanger box |
| `FinalReceipt` | stacked last purchases + TOTAL INVESTED €740,000 / REMAINING €260,000 |

## 6. Communications (EP02)
- The command-room console also **receives transmissions** (government emergency broadcasts, radio channels). They follow
  the same chain as EXT MIC 01: shown with chips **GOV BROADCAST › SPEECH-TO-TEXT › SCREEN ONLY** and the transcript
  monitor with **AUDIO PLAYBACK: DISABLED — TEXT ONLY**. YOU never hears a transmission.
- Transcript header format for channels: `CHANNEL BLACK-7 · LIVE TRANSCRIPT` / `SOURCE: UNKNOWN`; line meta
  `[HH:MM:SS] CHANNEL BLACK-7 · SENDER UNKNOWN`. Government: `EMERGENCY BROADCAST · GOVERNMENT`, meta `[DAY 7 · HH:MM:SS] GOVERNMENT · FINAL BROADCAST`.
- Incoming alert panel (ResourceConsole look, alert state): **INCOMING TRANSMISSION · CHANNEL: BLACK-7 · SOURCE: UNKNOWN ·
  ⚠ WARNING: RESTRICTED CHANNEL**.
- Signal degradation look: red border + jitter, characters replaced by block glyphs `█▓▒░` (never other letters/digits),
  then NO SIGNAL.
- **Channel BLACK-7** (exact spelling, the only named channel): prohibited by the government's final broadcast (DAY 7).
  The government warning is kept on the console ("SAVED · GOVERNMENT WARNING").

## 7. Shared UI for EP02+
`src/kit/SilenceUI.tsx` holds copies of EP01's local UI (`SlamTitle`, `FlowChips`, `MonitorTranscript`, `SpecCard`, `Chip`,
`WorldCam`, `SEATED`, `zPose`, `infectedLook`). Use these instead of copying from `SilenceP1.tsx` again.
HUD counter after the preparation year: `SurvivalHud daysLabel="OUTBREAK" daysValue="DAY N"`.
