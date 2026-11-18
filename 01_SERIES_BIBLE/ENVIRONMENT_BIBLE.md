# ENVIRONMENT BIBLE: SILENCE PROTOCOL

All series sets live in **`src/sets/Silence.tsx`** (do not redesign; extend by adding new components). Every set is a
flat SVG `<g>` in a **1080×1920 viewBox**, drawn inside the house `Svg` wrapper (`src/sets/Sets.tsx`) with
`<SPDefs />` (series gradients) rendered once per SVG. Ink outline `#130f0b`, 4.5 px (`ink`) or 2.5 px (`thin`).

## 1. THE BUNKER (canonical): `BunkerWorld`
A single cut-away "dollhouse" world that **builds itself** from progress values (`Build`: `dig, concrete, insul,
airlock, vent, battery, gen, water, med, food, cams, furn, finish`, each 0…1). `FULL_BUILD` = the completed bunker
as it exists at the end of EP01. Use `<BunkerWorld b={FULL_BUILD} />` for any future wide/cut-away shot.

### Geometry (world px, same coordinates as the 1080×1920 frame at zoom 1)
| Element | Coordinates |
|---|---|
| Ground surface | **y = 520** (`SURFACE`), grass strip `#2a3a22`; sky above = `spSky` gradient + dark skyline + red glow at x 900 |
| Earth | `#3a2a1d` with wavy strata `#33251a` and pebbles `#4a3727` |
| Concrete shell | x **80–1000**, y **610–1390**, fill `#8d8a7b`, ink outline; rooms inside are bare concrete `#58554c` |
| Entrance | surface **hut** over a vertical **shaft** at x 140–270 (shaft interior x 158–252, ladder rungs), pitched roof `#4c4a43` |
| Ventilation stack | duct x 880–926 from inside the VENT room to above ground, mushroom cap; **underground silencer box** x 860–946, y 540–610 with 4 yellow baffles `#d8b24a` |
| Surface cameras | two poles at **x 620** and **x 1000**, 120 px high, white housings with red LEDs |
| Insulation lining | 3 coloured layers on the inner perimeter: foam `#d8b24a`, barrier `#8a8f94`, dark `#3c4044` (7 px each) |
| Stencil | "SILENCE PROTOCOL · SUBLEVEL 1 · −12 M" along the bottom slab; cable trays on the top row |

### Rooms (`ROOM` export; floors = `y1`)
| Row | Room | x0–x1 | y0–y1 | Contents when built |
|---|---|---|---|---|
| A | **airlock** | 102–322 | 632–866 | ladder from shaft; **door 1** = sliding ceiling hatch (status light red→green); **door 2** = heavy side door into command (3 bolts, status light); label "AIRLOCK · 2 DOORS" |
| A | **command** | 336–690 | 632–866 | 3×2 monitor wall, desk, blinking red REC dot |
| A | **vent** | 704–978 | 632–866 | quiet fan unit (spinning 4-blade fan) + inline silencer (yellow baffles); label "SILENCED AIR · 18 dB" |
| B | **living** | 102–512 | 880–1116 | bunk bed (2 bunks + pillows), table, green-lit security locker (right wall) |
| B | **med** | 526–690 | 880–1116 | white medical cabinet with red cross, 9 supply boxes |
| B | **pantry** | 704–978 | 880–1116 | 4 shelves, 27 cans/boxes (yellow/red/green/orange) |
| C | **battery** | 102–372 | 1130–1368 | 2 racks × 5 cells with green charge bars; label "STORAGE 96%" |
| C | **gen** | 386–634 | 1130–1368 | **isolated technical room**: yellow-outlined inner box + dashed second wall; yellow generator on spring mounts, exhaust pipe to ceiling; label "ISOLATED · ANTI-VIBRATION" |
| C | **water** | 648–978 | 1130–1368 | two blue tanks (animated level), filter unit, 3 drinking bottles |

Each room has a ceiling lamp + warm light pool that switches on when its system is installed.

### Camera on the bunker
`WorldCam` (in `SilenceP1.tsx`): `translate(540,860) scale(z) translate(-cx,-cy)`, i.e. world point (cx,cy) appears at
screen (540, **860**) so the subject sits between the HUD (top ~250 px) and captions (~1420 px).
EP01 framings: wide `[540, 1000, 1.15–1.24]`; airlock `[215, 720–740, 3.2–3.4]`; vent `[840–850, 700–760, 2.6–2.9]`;
battery `[237, 1240–1250, 3.2–3.4]`; generator `[510, 1240–1250, 3.1–3.4]`; water `[813, 1240–1250, 2.6–2.8]`;
med→pantry pan `[608→841, 1000, 3.0]`; final pull-back `[540, 1000, 1.7] → [540, 1010, 1.15]`.

## 2. Close-up bunker sets (same bunker, interior close-ups)
| Component | What it shows | Key details |
|---|---|---|
| `InsulationWall({t})` | cross-section of the bunker wall | 4 layers slide in: REINFORCED CONCRETE `#8d8a7b` 140 px · ACOUSTIC FOAM `#d8b24a` 90 · MASS-LOADED BARRIER `#5a5f64` 60 · DECOUPLED PANEL `#a9a597` 70 (from x 220); red noise waves stopped at the foam; badge "OUTSIDE NOISE: BLOCKED" |
| `Pantry({scroll})` | long food aisle | 6 shelf units 400 px wide (labels A1, A2, A3, B1, B2, B3), 5 shelves each; boxes, stacked cans, jars, "MRE" boxes; floor 1660; scroll pans 0→520 |
| `WaterRoom({drink, tech, focus})` | `focus:"drink"`: 4 shelves × 10 blue drinking jugs · `focus:"tech"`: two huge tanks **T-01 · 6,000 L** and **T-02 · 6,000 L**, filter line with 3 cartridges and moving droplets | floor 1660 |
| `ControlRoom({alarm, figure})` | surveillance room | 3×3 monitor wall at x 330–1035, y 560–1045: CAM 01–09, centre screen (index 4) = **EXT MIC 01** red waveform; CAM 02 shows a dark figure outside; desk y 1230; keyboard; **crossed-out speaker icon** (playback disabled); office chair at x 110–330; `alarm` = pulsing red |
| `EquipRoom({a, b})` | futuristic equipment room | dark panelled wall, perspective floor at y 1560; **platform A at x 280 (blue)**, **platform B at x 800 (green)**, each a disc (rx 190) with light beam + letter plate |

## 3. Outside / Scene-1 sets
| Component | Use |
|---|---|
| `LivingRoom({tv})` | dark room, window with red city glow, wall TV (x 470–1050, y 640–1000). `tv: "normal"` colour bars "CHANNEL 4 · 23:41" → `"static"` → `"alert"`: **EMERGENCY BROADCAST / 365 / DAYS UNTIL OUTBREAK** + scrolling ticker "VOICE-TRANSMITTED PATHOGEN · DO NOT LISTEN TO THE INFECTED · STAY INDOORS". Sofa foreground left. |
| `Hospital()` | ward, sign **"ICU · FULL"**, rotating red emergency beacon, 2 beds with IV stands, floor 1600 |
| `Street({fire})` | night city: `spSky` gradient, 9 tower silhouettes with sparse amber windows, drifting smoke, red fire glow at x 880, street from y 1480, dashed lane, abandoned car, rising embers. Used for outbreak, Silent Field demo, Ghost Echo demo. |
| `Pit()` | underground **construction site** (EP01 S2): dirt strata, sky opening at top, timber shoring at x 80/1000, yellow excavator arm swinging, 2 work lights with light cones, rebar bundle, traffic cones, floor 1660 |
| `Blueprint({x,y,w,t})` | holographic blue blueprint that draws itself: "PROJECT: SILENCE · SUBLEVEL 1", rooms labelled AIRLOCK, COMMAND, VENT, LIVING, MED, FOOD, POWER, GENERATOR, WATER, "GROUND LEVEL" |
| EchoDemo hatch (inline in `SilenceP1.tsx`) | street-level bunker hatch hut at x 60–240, y 1400–1480 labelled **"YOU"** in red |

## 3b. Outbreak sets (added in EP02, `src/sets/Silence.tsx`)
| Component | Use |
|---|---|
| `Hospital({sign})` | same ward; `sign` default "ICU · FULL"; EP02 Patient Zero uses "ISOLATION WARD" (patient lying in the right bed: rig rotated 90°, scale 0.42, hip at (800,1342)) |
| `Street({fire, lights})` | `lights` 0..1 switches the tower windows off (cities going dark); default 1 = EP01 look |
| `WorldMap({x,y,w,spread})` | dark world map (1000×500 at w 1000), grid, scanlines, red infection clusters on every continent growing with `spread`; **no single origin marked** |
| `Airport({t})` | night terminal, tall windows with red glow, DEPARTURES board (8 flights flip to blinking CANCELLED with `t`), "ALL GATES CLOSED", abandoned luggage, floor 1640 |

## 4. Rules for environments
- **Reuse** these components; never redraw the bunker. New rooms/areas = new components in `Silence.tsx` that match
  this palette and line weight, plus an entry here.
- Damage/state changes (e.g. a broken door, lower water) are new **props** on the existing component, not copies.
- Lighting: every interior has a warm pool (`spWarm`); emergencies add `spRed` pools / red overlay; outside = `spSky` +
  red fire glow. Global `Vignette strength={0.7}` on every frame.
