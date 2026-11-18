# EP01 Production Sheet (frame-exact, extracted from source)

Composition **`SilenceProtocol-EP01`** · component `SilenceP1` · `src/stories/silence-protocol/SilenceP1.tsx`
Total **2,700 frames = 90.0 s** · `PRE = 8` · lines `stories/silence-protocol/ep01-lines.tsv` · voices `public/audio/voice/sp1-NN.wav`
· captions `public/captions/sp1-NN.json` (these JSONs drive cut and SFX timing via `wf()`; **never regenerate them**).

## Narration lines (start frame / timecode / voice frames / v2 Kokoro speed for `af_heart`)
| Line | Start | TC | Frames | Speed | Caption text |
|---|---|---|---|---|---|
| 01 | 8 | 0:00.27 | 131 | 1.0770 | In exactly 365 days, the world as you know it will end. |
| 02 | 142 | 0:04.73 | 83 | 1.3352 | A deadly virus will spread through the voices of infected people. |
| 03 | 228 | 0:07.60 | 64 | 1.3344 | Hearing just one word is enough to become infected. |
| 04 | 295 | 0:09.83 | 66 | 1.3350 | And once infected, your own voice becomes a weapon. |
| 05 | 367 | 0:12.23 | 94 | 1.3363 | But you have one advantage: you know exactly when the apocalypse will arrive. |
| 06 | 464 | 0:15.47 | 124 | 1.1982 | You have one year and one million euros to build the perfect survival shelter. |
| 07 | 591 | 0:19.70 | 42 | 1.3332 | And every single detail matters. |
| 08 | 639 | 0:21.30 | 77 | 1.3351 | First, you build an underground reinforced concrete bunker. |
| 09 | 719 | 0:23.97 | 85 | 1.2959 | Its walls feature multiple layers of acoustic insulation, |
| 10 | 807 | 0:26.90 | 50 | 1.3314 | the entrance has two reinforced doors, |
| 11 | 860 | 0:28.67 | 92 | 1.2597 | and even the ventilation system uses acoustic silencers. |
| 12 | 955 | 0:31.83 | 132 | 1.1680 | You install battery storage, a generator inside an isolated technical room, |
| 13 | 1090 | 0:36.33 | 51 | 1.3812 | water tanks and purification systems. |
| 14 | 1144 | 0:38.13 | 120 | 1.2002 | Inside, you stockpile medicine and enough food to survive for an entire year. |
| 15 | 1300 | 0:43.33 | 135 | 1.3351 | Now you have 365 days of food, 3,600 liters of drinking water |
| 16 | 1438 | 0:47.93 | 105 | 1.3355 | and another 12,000 liters of technical water that can be treated and filtered. |
| 17 | 1546 | 0:51.53 | 57 | 1.3339 | Your bunker is designed to keep you alive. |
| 18 | 1606 | 0:53.53 | 30 | 1.3433 | But you are not safe yet. |
| 19 | 1642 | 0:54.73 | 129 | 1.2040 | You have installed a system that automatically converts external voices into text. |
| 20 | 1774 | 0:59.13 | 115 | 1.3319 | This allows you to understand what is happening outside without actually hearing anyone. |
| 21 | 1892 | 1:03.07 | 53 | 1.3304 | But there is one rule you must never forget. |
| 22 | 1999 | 1:06.63 | 66 | 1.3329 | You have €260,000 left. |
| 23 | 2068 | 1:08.93 | 88 | 1.3341 | Enough to purchase one special piece of technology. But which one? |
| 24 | 2159 | 1:11.97 | 166 | 1.3360 | The Silent Field costs €225,000 and creates a zone of absolute silence for sixty seconds. |
| 25 | 2328 | 1:17.60 | 76 | 1.3338 | The Ghost Echo costs €220,000. |
| 26 | 2407 | 1:20.23 | 149 | 1.3355 | It's an autonomous drone capable of reproducing infected voices from a distance, attracting them away from you. |
| 27 | 2559 | 1:25.30 | 54 | 1.2404 | Which one would you choose? A or B? |
| 28 | 2616 | 1:27.20 | 54 | 1.3383 | Your decision will determine the next chapter. |

`LEN` gaps after each line: 3 within scenes; 6 after lines 4, 7, 18; 36 after 14 (montage end); 54 after 21 (Rule card);
30 after 28 (ending hold).

## Scene marks
| Mark | Frame | TC |
|---|---|---|
| S1 THE END IS COMING | 0 | 0:00.00 |
| S2 ONE MILLION (`S2`) | 367 | 0:12.23 |
| HUD full slides in (`HUD_IN`) | 591 | 0:19.70 |
| S3 BUILD (`S3`) | 639 | 0:21.30 |
| Final wide + last 3 purchases (`FINAL_WIDE`) | 1247 | 0:41.57 |
| S4 RESOURCES (`S4`) | 1300 | 0:43.33 |
| S5 FIRST RULE (`S5`) | 1642 | 0:54.73 |
| RULE 01 card (`RULE`) | 1943 | 1:04.77 |
| S6 FIRST CHOICE (`S6`) | 1999 | 1:06.63 |
| Cliffhanger transcript | 2656 | 1:28.53 |

## Shot list (hard cuts)
| From | Shot (component) |
|---|---|
| 0 | `Broadcast` (LivingRoom TV normal→static→alert) + `CountdownSlam` at f32 ("365") |
| 142 | `StreetPanic` |
| 228 | `OneWord` (hospital, "HELP") |
| 295 | `ChainReaction` |
| 367 | `SiteArrive` (Pit, YOU walks in) |
| 464 | `BlueprintScene` (blueprint + INITIAL BUDGET at f506) |
| 591 | `BlueprintScene push` (HUD in) |
| 639 | `BuildShot` wide (excavation) |
| 677 | `BuildShot` wide (concrete pour) |
| 719 | `InsulShot` (InsulationWall) |
| 807 | `BuildShot` airlock |
| 860 | `BuildShot` vent (air demo) |
| 967 | `BuildShot` batteries |
| 1011 | `BuildShot` generator |
| 1090 | `BuildShot` water |
| 1144 | `BuildShot` med → pantry pan |
| 1247 | `BuildShot` final pull-back + `FinalReceipt` |
| 1300 | `FoodShot` (Pantry walk, food grid) |
| 1377 | `DrinkShot` |
| 1438 | `TechShot` |
| 1546 | `ResourceConsole` |
| 1606 | `ResourceConsole alert` |
| 1642 | `Surveillance` (ControlRoom, YOU seated) |
| 1774 | `Transcript` (3 lines) |
| 1892 | `Transcript` (line 4 + glitch) |
| 1943 | `SilenceRule` RULE 01 |
| 1999 | `EquipEnter` |
| 2068 | `PlatformsOn` (A on at f2094, B at f2144) |
| 2159 | `DeviceA` + SpecCard |
| 2202 | `FieldDemo` |
| 2328 | `DeviceB` + SpecCard |
| 2407 | `EchoDemo` |
| 2559 | `Compare` |
| 2616 | `FinalChoice` |

## Purchase frames
f641 Land · f677 Concrete · f723 Insulation · f809 Airlock · f881 Ventilation · f971 Batteries · f1013 Generator ·
f1092 Water · f1170 Medical · f1213 Food · f1247 Surveillance · f1262 Furniture · f1277 Installation.

## Audio
SFX cue list = the `SFX` array in `SilenceP1.tsx` (≈95 cues; volumes × `SFX_GAIN 0.5623`). Beds: `sp-bed` via
`bedLevel`, `drone.wav` 0.07; both × `makeDuck(SPANS, 0.32, 8)`.

## Versions
| Version | Change | Final file |
|---|---|---|
| v1 | first render; narrator `am_michael`; master loudnorm −17 LUFS | `out/SILENCE_PROTOCOL_EP01_THE_COUNTDOWN_v1_original.mp4` |
| **v2 (current, approved)** | narrator → `af_heart` (same timing ±1.3 frames, per-line loudness matched to v1); SFX −5 dB; master static −1.3 dB + limiter; **video stream bit-identical to v1** (MD5 `389c67711c317714a74a8ede630cdc63`) | `out/SILENCE_PROTOCOL_EP01_THE_COUNTDOWN.mp4` (−18.1 LUFS) |
