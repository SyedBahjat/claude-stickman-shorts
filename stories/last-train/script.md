# LAST TRAIN — a decide-series story (nuclear survival, original)

Logline: twelve minutes before a nuclear strike, your night train dies in a tunnel.
A conductor says stay. A stranger with a silver case says follow him. Your sister
is alone fourteen floors up with no basement. Every choice changes who lives.

Format: 7 videos, ~75–80 s each, vertical. 2 decisions, 4 endings. Viewers vote in
comments; we produce the winning branch, but every branch is written so we're
never blocked. Shot tables follow `STORY.md` (# | shot / action | voice | on screen | SFX).

```
PART 1  "Last Train" ──► A STAY ON THE TRAIN ──► PART 2A "The Vent" ──► A CLOSE THE VENT YOURSELF ──► PART 3AA  ENDING 1 "The Valve"      (everyone lives)
                    │                                              └─► B LET THE CONDUCTOR GO    ──► PART 3AB  ENDING 2 "The Conductor"  (she doesn't come back)
                    └──► B FOLLOW THE STRANGER ──► PART 2B "The Door" ──► A LIE FOR HIM           ──► PART 3BA  ENDING 3 "The Lie"        (dark: Eli dies)
                                                                   └─► B TELL THE TRUTH          ──► PART 3BB  ENDING 4 "The Truth"      (twist: Eli saved your sister)
```

**Planted clues (must appear on screen in Part 1/2):**
1. Eli **reads your phone screen** (he learns Nora's name) → pays off in Ending 4.
2. Sticker on his case: **PROPERTY OF CIVIL DEFENSE** → he stole the case to give it away (Endings 1, 3).
3. Keycard photo is **not his face** (Part 2B) → Ending 3 note explains it.
4. Red **wall phone** in corridor CD-7; Eli makes one short call (Part 2B) → Ending 4 payoff.
5. Steel door **CD-7** sits next to the vent valve (seen on Mags's tunnel diagram, Part 2A) → Ending 1 knock.

---

## Cast (looks follow the STYLE.md rig: body color + one accessory)

| Role | Look | Voice |
| --- | --- | --- |
| **YOU** | skin body, red forearm band | none (narrator speaks in 2nd person) |
| **MAGS** — conductor, 60s, 30 years on Line 4 | navy `#2f3e5c` uniform, peaked cap, flashlight, key ring | older woman, firm, warm grit |
| **ELI** — stranger, 30s, calm, secretive | charcoal `#4a4a4f` hoodie (hood down, hood rim behind head), silver case | young/middle male, quiet, low |
| **NORA** — your sister, 20s (phone/voice only until Ending 4 call) | teal `#4f8a8b`, ponytail | young woman, phone filter |
| **SOLDIER** — guard at Shelter 9 | dark olive + helmet, rifle | male, hard, clipped |
| **RUTH VALE** — doctor's wife (Ending 3) | grey `#8c8c94` cardigan, glasses, grey bun | older woman |
| Passengers | 7 crowd silhouettes in the carriage | — |

## Sets (new, build in `src/sets/`)

Train carriage interior (seats, poles, windows onto black tunnel, ceiling vents, cab door, emergency door crank) ·
Tunnel track bed (rails, cable trays, red emergency lamps, dust in light beams) · Tunnel wall with **VENT 4** red valve wheel + steel door **CD-7** ·
Corridor CD-7 (old civil-defense posters, buzzing tubes, red wall phone) · Blast door with slot window (Shelter 9) ·
Shelter 9 hall (rows of cots, hundreds of silhouettes, desk) · Line 4 route diagram (2D card) · Reuse: `Phone`, `RuleCard`, `ChoiceCards`, `Hud`.

## New SFX to synthesize

train rumble (loop) · brake screech · multi-phone alert chorus · door bang/crank + pneumatic hiss · crowd panic murmur ·
**flash/detonation + long rumble** · emergency-light buzz · vent hiss · mask breathing · metal valve strain/squeal ·
fan wind-down · keypad beeps + heavy lock clunk · rifle cock · blast-door hydraulic seal + boom · Geiger/dosimeter clicks · radio static (Mags's radio) · landline ring.

## Story clock

Alert at **2:51 AM**, impact **3:03 AM** (countdown 12:00, story time compressed for pace).
After impact the HUD right label changes per branch (see each part). Day 2 time skip shows `● DAY 2`.

---

## PART 1 — "Last Train"  (decision 1)

HUD: `DAY 1 · 2:51 AM · LINE 4 · TUNNEL` · countdown `IMPACT IN 12:00` appears at shot 4 · ends ≈ `9:20`.

| # | Shot / action | Voice | On screen | SFX |
| --- | --- | --- | --- | --- |
| 1 | Night carriage. YOU dozing, head on the window; tunnel lights streak past outside. Slow push. | NARRATOR: Imagine you're on the last train home, | — | train rumble loop |
| 2 | Phones light up red in every hand down the carriage, one after another. | NARRATOR: and every phone in the carriage screams at the same time. | red phone glows | alert chorus |
| 3 | Sparks under the wheels, lights flicker, everyone lurches forward. Hold 0.8 s. | NARRATOR: Then the train stops. Dead. In the middle of the tunnel. | — | brake screech, thud |
| 4 | POV phone: EMERGENCY ALERT "Missile launch detected. Seek shelter now." | NARRATOR: Missile launch detected. Impact in twelve minutes. | HUD countdown appears 12:00 | alert beeps; hold 1.0 s |
| 5 | Wide: passengers pound on the doors; a man jams fingers in the door seal. | NARRATOR: Nine strangers. One locked train. Somebody starts prying at the doors. | — | banging, panic murmur |
| 6 | Cab door bangs open; flashlight beam cuts the dark; MAGS steps in. | MAGS: Nobody touches those doors! | — | door slam |
| 7 | Medium on Mags, cap, keys, steady hand. | NARRATOR: The conductor. Thirty years on this line, and she isn't shaking. | — | — |
| 8 | Mags to YOU, pointing down. | MAGS: We're forty meters under the street. This is the safest place in the city. | RULE NUMBER ONE · **STAY UNDERGROUND** (at "safest") | card slam |
| 9 | POV phone buzzes; banner from **Nora**. | NARRATOR: Then your sister texts. / NORA: There's no basement in my building. What do I do? | banner "Nora: no basement in my building. what do I do??" | buzz, ding |
| 10 | Line 4 diagram: dot **YOU** in the tunnel, **NORA** nine stops away. | NARRATOR: Nine stops away. Fourteen floors up. Nowhere to hide. | route card; hold 0.6 s | heartbeat |
| 11 | Slow push on the last seat: ELI, grey hoodie, silver case on his knees, perfectly still, eyes on YOU. **Sticker on case: PROPERTY OF CIVIL DEFENSE** (clue 2). | NARRATOR: Only one passenger hasn't moved. Grey hoodie. Silver case. And he's watching you. | — | low drone swell |
| 12 | Eli stands, steps close, low voice. | ELI: There's a door two hundred meters back. A real shelter. Blast doors. Clean air. | — | — |
| 13 | He taps the case. | ELI: It seals at impact. I can't carry this alone. | — | — |
| 14 | Mags blocks the aisle with her arm. | MAGS: Nobody leaves this train. | — | — |
| 15 | Eli's eyes drop to YOUR phone screen (Nora's name visible), then back up (clue 1). | ELI: There's a phone line in there. You could call Nora. / NARRATOR: You never told him her name. | — | sub hit; hold 1.0 s |
| 16 | Eli at the emergency door, cranking the manual release; black tunnel beyond. | NARRATOR: He's already cranking the emergency door open. | HUD ≈ 9:30 | crank, pneumatic hiss |
| 17 | Three-way frame: Mags in warm light (left), Eli in the dark doorway (right), YOU between. | NARRATOR: Do you stay on the train with the conductor, or follow the stranger into the dark? | A **STAY ON THE TRAIN** · B **FOLLOW THE STRANGER** | whoosh ×2 |
| 18 | Hold the three-way frame. | NARRATOR: Follow for part two. | FOLLOW FOR PART 2 | card slam |

---

## PART 2A — "The Vent"  (chose STAY · decision 2)

HUD: `DAY 1 · 2:54 AM · LINE 4 · TUNNEL` · `IMPACT IN 9:00` → impact at shot 7 → label becomes `AIR SAFE FOR 60:00` at shot 13.

| # | Shot / action | Voice | On screen | SFX |
| --- | --- | --- | --- | --- |
| 1 | Last frame of Part 1 with both cards; B fades, A glows. | NARRATOR: Most of you said: stay on the train. | MOST OF YOU SAID + cards | whoosh |
| 2 | Eli in the doorway looks back once, then the tunnel swallows him; the door hisses shut. | NARRATOR: The stranger looks back once. Then the dark swallows him. | — | hiss, clunk |
| 3 | His seat: the peeled sticker left behind. | NARRATOR: He left something on his seat. A sticker from that case. | close-up sticker **PROPERTY OF CIVIL DEFENSE** | — |
| 4 | Mags walks the aisle; passengers drop to the floor. | MAGS: Everybody down. Face on the floor. Hands over your neck. | RULE NUMBER TWO · **FACE DOWN, MOUTH OPEN** | card slam |
| 5 | YOU on the floor, cheek to the grooved floor, mouth open. | NARRATOR: Mouth open, so the blast pressure doesn't burst your eardrums. | — | heartbeat |
| 6 | HUD countdown fills the frame: 0:03, 0:02, 0:01. | NARRATOR: Three. Two. One. | big countdown | tick ×3 |
| 7 | White flash floods the tunnel windows; the train rocks; ceiling lights pop; dust. 2 s, no voice. | — | white 3 frames, shake | **flash + rumble**, glass pops |
| 8 | Red emergency lights flicker on. | NARRATOR: Even forty meters down, the whole tunnel jumps. | — | emergency buzz |
| 9 | Phone: No Service. Last message from Nora on screen. | NARRATOR: Then silence. No sirens. No signal. / NORA: I'm going next door. They have a basement. I love you. | banner from Nora, then "No Service" | ding; hold 1.0 s |
| 10 | A hiss from the ceiling vents; grey dust drifting through the red light. | NARRATOR: Then you hear it. A hiss, from the ceiling vents. | — | vent hiss |
| 11 | Mags looks up; her face changes. | MAGS: The fans. They're pulling air from the street. | — | — |
| 12 | YOU look at the dust settling on your sleeve. | NARRATOR: Air from the street means fallout. | — | dosimeter-like crackle (subtle) |
| 13 | Mags's tunnel diagram: train, **VENT 4** valve 300 m down, steel door **CD-7** beside it (clue 5). | MAGS: There's a shutoff valve three hundred meters down. In an hour, this air makes us sick. | diagram card; HUD `AIR SAFE FOR 60:00` | — |
| 14 | Mags tries to stand; her leg is bleeding from the jolt. One gas mask in her hand. | NARRATOR: But her leg is bleeding. And there's only one gas mask. | — | — |
| 15 | Mags grips the mask, jaw set. | MAGS: Give me the mask. I know these tunnels. | — | — |
| 16 | YOU and Mags, the mask between you; dark tunnel behind. | NARRATOR: Do you walk into the dust yourself, or let the conductor go? | A **CLOSE THE VENT YOURSELF** · B **LET THE CONDUCTOR GO** | whoosh ×2 |
| 17 | Hold. | NARRATOR: Follow for part three. | FOLLOW FOR PART 3 | card slam |

---

## PART 2B — "The Door"  (chose FOLLOW · decision 2)

HUD: `DAY 1 · 2:54 AM · TUNNEL` → `CORRIDOR CD-7` · `IMPACT IN 9:00` → ends ≈ `1:40`.

| # | Shot / action | Voice | On screen | SFX |
| --- | --- | --- | --- | --- |
| 1 | Part 1 cards; A fades, B glows. | NARRATOR: Most of you said: follow the stranger. | MOST OF YOU SAID + cards | whoosh |
| 2 | YOU jump down onto the track bed; Mags shouting in the doorway behind. | NARRATOR: You jump down onto the tracks. Behind you, the conductor is still shouting. | — | gravel crunch, muffled shout |
| 3 | Eli walks fast along the rail, flashlight off; rats scatter. | NARRATOR: He walks fast. He doesn't even need the light. | — | footsteps, squeaks |
| 4 | Steel door in the tunnel wall: **CD-7 · AUTHORIZED ONLY**; he types the code without looking. | NARRATOR: A steel door in the tunnel wall. He types the code without looking. | keypad close-up | keypad beeps, lock clunk |
| 5 | Corridor: old civil-defense posters, buzzing tubes. He stops at a red **wall phone**, dials, says three words too quiet to hear, hangs up (clue 4). | NARRATOR: Halfway down, he stops at an old wall phone. One call. He won't say who. | — | tube buzz, receiver clack |
| 6 | Round blast door; eyes in the slot window; a rifle barrel. | SOLDIER: Stop. Card. | — | rifle cock |
| 7 | Eli opens the case: dosimeter, iodine packs, a keycard. Close on the photo: glasses, beard — **not Eli** (clue 3). | NARRATOR: Inside the case: radiation pills, and a keycard. The face on the card isn't his. | — | sub hit; hold 0.8 s |
| 8 | Soldier reads the card. | SOLDIER: This is Doctor Vale's card. Where is Doctor Vale? | — | — |
| 9 | Eli, steady. | ELI: My brother didn't make it. He gave me his place. | — | — |
| 10 | Soldier's eyes slide to YOU. | SOLDIER: And who is this? | HUD ≈ 2:30 | heartbeat |
| 11 | Soldier taps the door. | SOLDIER: One civilian per card. Not two. | — | — |
| 12 | Eli leans in, whispering. | ELI: Family is on the list. Say you're family. We both get in. | — | — |
| 13 | Close on YOU, the slot window's light across your face. | NARRATOR: You don't know Doctor Vale. You don't even know Eli. | HUD ≈ 1:45 | tick |
| 14 | Soldier, Eli, YOU, the door between. | NARRATOR: Do you lie for him, or tell the soldier the truth? | A **LIE FOR HIM** · B **TELL THE TRUTH** | whoosh ×2 |
| 15 | Hold. | NARRATOR: Follow for part three. | FOLLOW FOR PART 3 | card slam |

---

## PART 3AA — ENDING 1 "The Valve"  (STAY → CLOSE THE VENT YOURSELF)

HUD: `DAY 1 · 3:05 AM · TUNNEL` → `VENT 4` · `AIR SAFE FOR 52:00` → time skip `● DAY 2 · 3:04 AM`.

| # | Shot / action | Voice | On screen | SFX |
| --- | --- | --- | --- | --- |
| 1 | Part 2A cards; A wins. | NARRATOR: Most of you said: close the vent yourself. | MOST OF YOU SAID + cards | whoosh |
| 2 | Mask on, POV through the lens rim; dust falls like snow in the flashlight beam. | NARRATOR: Mask on. Every breath sounds like someone else's. | mask-rim vignette | mask breathing |
| 3 | YOU walk the rails, small in a huge black tunnel. | NARRATOR: Three hundred meters. In the dark, it feels like three miles. | — | footsteps, drips |
| 4 | Red valve wheel **VENT 4**; YOU pull; nothing. | NARRATOR: The valve wheel is rusted solid. | — | metal strain |
| 5 | Knocking from steel door **CD-7** beside you. | NARRATOR: Then something knocks. From inside the wall. | — | 3 knocks; hold 0.8 s |
| 6 | Door grinds open: ELI, bloodied, coughing. | ELI: They sealed it. I wasn't on the list. | — | heavy door |
| 7 | Both of you on the wheel; it shrieks and turns; hiss dies. | NARRATOR: Two pairs of hands. The wheel screams, and turns. | — | squeal, hiss stops |
| 8 | Eli's dosimeter clicking fast; he covers the screen. | ELI: Don't look at the number. | — | fast clicks |
| 9 | Back at the train: Mags blocks the door, points at your clothes. | MAGS: Outer clothes off. Bag them. Now. | RULE NUMBER THREE · **STRIP. SEAL. STAY.** | card slam |
| 10 | Clothes into a bin bag. | NARRATOR: Taking off your outer layer gets rid of most of the fallout dust. | — | plastic rustle |
| 11 | Eli opens the case for the passengers. | NARRATOR: Then Eli opens his case. Radiation pills. Enough for everyone. | — | — |
| 12 | Time skip; white rescue lights at the tunnel mouth; figures in suits. | NARRATOR: Twenty-four hours later, there are lights at the end of the tunnel. Real ones. | HUD `● DAY 2 · 3:04 AM` | distant voices |
| 13 | Phone: one bar; message from Nora. | NORA: I'm alive. Where are you? | banner | ding; hold 1.0 s |
| 14 | Ten silhouettes walking out into the light. | NARRATOR: Nine strangers went into that tunnel. Ten walked out. | **ENDING 1 OF 4 · THE VALVE** | music swell |
| 15 | Hold. | NARRATOR: Which ending did you get? Follow for the next story. | — | — |

## PART 3AB — ENDING 2 "The Conductor"  (STAY → LET THE CONDUCTOR GO)

HUD: `DAY 1 · 3:05 AM · LINE 4 · TUNNEL` · `AIR SAFE FOR 52:00` → time skip `● DAY 2`.

| # | Shot / action | Voice | On screen | SFX |
| --- | --- | --- | --- | --- |
| 1 | Part 2A cards; B wins. | NARRATOR: Most of you said: let the conductor go. | MOST OF YOU SAID + cards | whoosh |
| 2 | Mags straps on the mask, presses her radio into your hand. | MAGS: Channel two. If I don't answer, you keep them calm. | — | strap snap |
| 3 | She limps into the tunnel; her light shrinks to a dot. | NARRATOR: She limps into the dust. Her light gets smaller. And smaller. | — | uneven footsteps fading |
| 4 | Radio in your hand, static; HUD time jumps 3:14 → 3:24. | NARRATOR: Ten minutes. Nothing. Twenty. | — | radio static |
| 5 | The vent hiss stops; the fans wind down. | NARRATOR: Then the hiss stops. | — | fan wind-down; hold 0.8 s |
| 6 | Radio crackles. | MAGS: Valve's shut. Don't come looking for me. | — | radio crackle (radio filter on voice) |
| 7 | YOU press the button. | NARRATOR: You beg her to come back. She just laughs, softly. | — | — |
| 8 | Radio. | MAGS: Rule three, kid. Strip. Seal. Stay. Twenty-four hours. | RULE NUMBER THREE · **STRIP. SEAL. STAY.** | card slam |
| 9 | Night in the carriage; passengers share water; YOU with the radio against your ear. | NARRATOR: All night, you keep the radio against your ear. Just static. | — | static bed |
| 10 | Time skip; rescue team with lamps. | NARRATOR: Twenty-four hours later, the rescue team finds the valve closed. | HUD `● DAY 2` | distant voices |
| 11 | Close: her cap hanging on the wheel; her flashlight still on, lying in the dust. | NARRATOR: Her cap is hanging on the wheel. Her light is still on. | — | silence; hold 1.2 s |
| 12 | Phone: Nora alive. | NARRATOR: Your sister made it. Everyone on that train made it. | Nora banner "I'm alive" | ding |
| 13 | Empty driver's cab, her keys swinging. | NARRATOR: Thirty years on Line Four. Her last stop was the one she chose. | **ENDING 2 OF 4 · THE CONDUCTOR** | swell |
| 14 | Hold. | NARRATOR: Which ending did you get? Follow for the next story. | — | — |

## PART 3BA — ENDING 3 "The Lie"  (FOLLOW → LIE FOR HIM)

HUD: `DAY 1 · 3:01 AM · CORRIDOR CD-7` · `IMPACT IN 1:40` → impact → `DOOR OPENS IN 24:00:00` → `● DAY 2`.

| # | Shot / action | Voice | On screen | SFX |
| --- | --- | --- | --- | --- |
| 1 | Part 2B cards; A wins. | NARRATOR: Most of you said: lie for him. | MOST OF YOU SAID + cards | whoosh |
| 2 | YOU face the slot window. | NARRATOR: You look the soldier in the eye and say it. I'm family. | — | heartbeat |
| 3 | Long pause; wheel spins; door swings open on a vast hall of cots and people. | NARRATOR: The door opens. Hundreds of people. Lights. Clean air. | — | hydraulic hiss |
| 4 | A woman at the front desk stands up: glasses, grey bun, badge **R. VALE**. | NARRATOR: Then a woman at the front desk stands up. / RUTH: I'm Doctor Vale's wife. He has no brother. | — | sub hit; hold 1.0 s |
| 5 | Soldier swings the rifle. | SOLDIER: Out. Both of you. | HUD ≈ 0:40 | rifle |
| 6 | Shoved back; the door closing; Eli hurls the case through the gap. | NARRATOR: As the door closes, Eli throws the case inside. Not for himself. For them. | — | seal boom |
| 7 | Corridor; Eli drags YOU to the floor and covers your head. | NARRATOR: Five seconds. He throws himself over you. | HUD 0:05 | tick |
| 8 | Flash under the door seam; corridor lights explode; dust. 2 s. | — | white, shake | **flash + rumble** |
| 9 | Red emergency light. Eli doesn't move. | NARRATOR: When the dust settles, you're alive. Eli doesn't answer. | HUD `DOOR OPENS IN 24:00:00` | ringing ears; hold 1.2 s |
| 10 | His hand opens: a folded note in someone else's handwriting. | NARRATOR: In his hand, a note. / VALE'S NOTE (on screen): "Take my card. Save anyone you can." | note card | paper |
| 11 | Close on the note. | NARRATOR: Vale was never his brother. Vale was a stranger who gave him a chance. | — | — |
| 12 | Time skip; the blast door opens; Ruth Vale steps out holding the case, kneels. | RUTH: Those pills protected forty children last night. | HUD `● DAY 2` | door hiss |
| 13 | YOU beside Eli's still hand. | NARRATOR: Your lie nearly killed you both. His lie saved forty kids. | **ENDING 3 OF 4 · THE LIE** | low swell |
| 14 | Hold. | NARRATOR: Which ending did you get? Follow for the next story. | — | — |

## PART 3BB — ENDING 4 "The Truth"  (FOLLOW → TELL THE TRUTH)

HUD: `DAY 1 · 3:01 AM · CORRIDOR CD-7` · `IMPACT IN 1:40` → impact → `SHELTER 9` · `DOOR OPENS IN 24:00:00` → `● DAY 2`.

| # | Shot / action | Voice | On screen | SFX |
| --- | --- | --- | --- | --- |
| 1 | Part 2B cards; B wins. | NARRATOR: Most of you said: tell the truth. | MOST OF YOU SAID + cards | whoosh |
| 2 | YOU to the slot window. | NARRATOR: I met him on a train, ten minutes ago. The soldier doesn't blink. | — | — |
| 3 | Soldier. | SOLDIER: Then you go in. He stays out. | — | — |
| 4 | Eli smiles, relieved, and pushes the case into your arms. | ELI: Good. That's what I wanted. Give the pills to the kids. | — | — |
| 5 | Door cracks open; he shoves you through; it seals; through the slot he raises a hand. | NARRATOR: The last thing you see through the slot is him, waving. | HUD 0:12 | seal boom; hold 0.8 s |
| 6 | Inside: the hall shudders, lights dim, dust from the ceiling; hundreds of faces look up. | — | shake | **flash rumble (muffled)** |
| 7 | YOU hand out pill packets along the cots. | NARRATOR: You hand out his pills. Forty packets. Forty kids. | HUD `SHELTER 9 · DOOR OPENS IN 23:41:10` | — |
| 8 | Soldier leads YOU to a desk landline. | SOLDIER: One call. Make it count. | — | — |
| 9 | You dial; it rings, and rings. | NARRATOR: You dial your sister. It rings. And rings. | — | landline ring ×3 |
| 10 | Click. | NORA: Hello? Oh my God. You're alive! | — | line click; hold 0.6 s |
| 11 | Nora on the phone. | NORA: A man called me before it hit. He said, go next door, get underground. He knew my name. | — | — |
| 12 | Flashback still: Eli at the red wall phone (Part 2B shot 5). | NARRATOR: The wall phone. His one call. He used it on your sister. | flashback filter | sub hit; hold 1.0 s |
| 13 | Time skip; door opens on an empty corridor; his grey hoodie folded on the floor. | NARRATOR: Twenty-four hours later, the corridor is empty. Just his hoodie, folded on the floor. | HUD `● DAY 2` | door hiss |
| 14 | Close on the hoodie. | NARRATOR: The truth cost him the door. It bought your sister her life. | **ENDING 4 OF 4 · THE TRUTH** | swell |
| 15 | Hold. | NARRATOR: Where did Eli go? Follow for the next story. | — | — |

---

## Production notes

- Voice lines: one file per line, `decide-lasttrain-<part>-<nn>`; numbers spelled out (done above).
- Radio/phone voices (Nora, Mags on radio) get the phone filter from `AUDIO.md`.
- Every "Most of you said" opener reuses the previous part's last frame + cards.
- Keep YOU's red band visible in every shot; Eli's case always in hand until he gives it away.
- Check every contact with `reach`: hands on valve wheel, crank, case handle, rifle, landline, mask strap.

---

## Produced

- Part 1 → `LastTrain-P1` (`examples/videos/lasttrain-p1.mp4`). Viewers chose **B: FOLLOW THE STRANGER**.
- Part 2B → `LastTrain-P2B` (`examples/videos/lasttrain-p2b.mp4`). Viewers chose **A: LIE FOR HIM**.
- Part 3A, ENDING 3 "The Lie" → `LastTrain-P3A` (`examples/videos/lasttrain-p3a.mp4`).
- Bonus ENDING 4 "The Truth" → `LastTrain-P3B` (`examples/videos/lasttrain-p3b.mp4`), made because viewers commented TRUTH.
- Season 2 is written in `season2-script.md`.
