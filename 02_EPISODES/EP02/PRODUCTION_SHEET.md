# EP02 Production Sheet
Composition `SilenceProtocol-EP02` · component `SilenceP2` · `src/stories/silence-protocol/SilenceP2.tsx` ·
total **2,610 frames = 87.0 s** · PRE 8 · lines `02_EPISODES/EP02/lines.tsv` · voices `public/audio/voice/sp2-NN.wav` ·
captions `public/captions/sp2-NN.json` (drive the cut/SFX timeline via `wf()`; never regenerate them for this episode).

## Narration lines (start frame / TC / voice frames / gap after / Kokoro `af_heart` speed / caption)
| Line | Start | TC | Frames | Gap | Speed | Caption |
|---|---|---|---|---|---|---|
| 01 | 8 | 0:00.3 | 51 | 3 | 1.3 | Most of you chose the Silent Field. |
| 02 | 62 | 0:02.1 | 154 | 3 | 1.35 | €225,000. You have €35,000 left, and the device never leaves your side. |
| 03 | 219 | 0:07.3 | 69 | 16 | 1.35 | 60 seconds of absolute silence, ready when you need it. |
| 04 | 304 | 0:10.1 | 60 | 3 | 1.35 | You had 365 days to prepare. |
| 05 | 367 | 0:12.2 | 27 | 30 | 1.35 | Now, your time is up. |
| 06 | 424 | 0:14.1 | 78 | 30 | 1.3 | The doors are sealed. Up above, the world is still quiet. |
| 07 | 532 | 0:17.7 | 60 | 3 | 1.35 | The first infection was reported in a hospital. |
| 08 | 595 | 0:19.8 | 38 | 3 | 1.3 | A doctor leaned in to help. |
| 09 | 636 | 0:21.2 | 52 | 15 | 1.3 | Within hours, the outbreak had begun. |
| 10 | 703 | 0:23.4 | 60 | 16 | 1.35 | Ten voices became hundreds. Then thousands. |
| 11 | 779 | 0:26.0 | 62 | 3 | 1.35 | Seven days later, entire cities had gone silent. |
| 12 | 844 | 0:28.1 | 68 | 3 | 1.1 | The map turned red, one country at a time. |
| 13 | 915 | 0:30.5 | 58 | 9 | 1.3 | Airports closed. Hospitals overflowed. |
| 14 | 982 | 0:32.7 | 36 | 30 | 1.35 | Governments were losing control. |
| 15 | 1048 | 0:34.9 | 103 | 15 | 1.3 | Day 7 of the outbreak. Down in your bunker, the lights are still on. |
| 16 | 1166 | 0:38.9 | 130 | 16 | 1.3 | Then, the final government broadcast reaches your console. As always, you only read it. |
| 17 | 1312 | 0:43.7 | 101 | 3 | 1.35 | Never listen to unverified transmissions. Never respond to channel BLACK-7. |
| 18 | 1416 | 0:47.2 | 100 | 90 | 1.3 | The infected can reproduce familiar identities. Do not trust them. |
| 19 | 1606 | 0:53.5 | 65 | 30 | 1.35 | Then the broadcast dies, and you are alone with the warning. |
| 20 | 1701 | 0:56.7 | 61 | 40 | 1.3 | Minutes later, your console lights up again. |
| 21 | 1802 | 1:00.1 | 79 | 100 | 1.35 | Channel BLACK-7. The exact channel you were told never to answer. |
| 22 | 1981 | 1:06.0 | 61 | 3 | 1.35 | No name. No face. Only words on a screen. |
| 23 | 2045 | 1:08.2 | 33 | 20 | 1.35 | And the messages keep coming. |
| 24 | 2098 | 1:09.9 | 70 | 3 | 1.35 | The government warned you never to respond to this frequency. |
| 25 | 2171 | 1:12.4 | 35 | 3 | 1.35 | But someone is asking for help. |
| 26 | 2209 | 1:13.6 | 59 | 13 | 1.35 | Your Silent Field is still in your hand. Unused. |
| 27 | 2281 | 1:16.0 | 21 | 20 | 1.35 | What will you do? |
| 28 | 2322 | 1:17.4 | 70 | 6 | 1.35 | A: investigate BLACK-7 and try to find the source. |
| 29 | 2398 | 1:19.9 | 58 | 12 | 1.35 | B: disconnect BLACK-7 and protect your bunker. |
| 30 | 2468 | 1:22.3 | 67 | 75 | 1.3 | Comment A or B to decide your survival. |

Voice: Kokoro-82M `af_heart` (en-us), `generate_lines.py` default speeds (fastest Whisper-clean take), `voiceover.mjs --trim --loud -16`,
`loudness_match.py --lufs -20` (all 30 lines measure −20.0 LUFS), `remap_captions.py`, `check_words.py`: 30/30 word-exact
(line 10 transcribes "Ten" as "10"; two earlier phrasings of line 10 and one of line 13 were rejected by the check and rewritten).

## Scene marks
| Mark | Frame | TC |
|---|---|---|
| S0 vote (`MostOfYouSaid`, decide on "SILENT") | 0 | 0:00.0 |
| Purchase THE SILENT FIELD −€225,000 (toast; budget rolls f72–88) | 64 | 0:02.1 |
| YOU lifts the SF-60 (`GRAB`) | 112 | 0:03.7 |
| S1 the last day (countdown 365 → 0) | 304 | 0:10.1 |
| PREPARATION COMPLETE (`ZERO`) | ≈389 | 0:13.0 |
| S2 Patient Zero | 532 | 0:17.7 |
| Patient Zero's voice (`SAY`) / doctor infected | 642 / 656 | 0:21.4 |
| S3 global collapse | 779 | 0:26.0 |
| DAY 7 slam + HUD switch + consumption roll (`DAY7`) | 1048 | 0:34.9 |
| S4 final broadcast / transcript cut (`GOV`) | 1166 / ≈1237 | 0:38.9 |
| Signal lost (`LOST`) | 1600 | 0:53.3 |
| S5 the signal | 1701 | 0:56.7 |
| INCOMING TRANSMISSION panel (`INC`) | 1766 | 0:58.9 |
| BLACK-7 transcript (`B7`): PLEASE. / I KNOW… / THEY'RE OUTSIDE. | 1884 (+8/+30/+62) | 1:02.8 |
| S6 the choice | 2098 | 1:09.9 |
| Final cards | 2468 | 1:22.3 |
| Cliffhanger "WHY AREN'T YOU ANSWERING?" | 2566 | 1:25.5 |

## Shot list (hard cuts; see `SHOTS` in the source)
VoteOpen · TakeDevice · FieldReady · LastDay · Sealed · Ward (wide) · Ward (close) · Spread · CitySilent · MapShot · AirportShot ·
Overflow · DarkCity · Day7 · BroadcastIn · GovScreen · NoSignal · ConsoleWakes · IncomingPanel · B7Screen · Contrast · Unused ·
B7Screen (all typed) · Option A · Option B · FinalChoice.

## Purchases / resource changes
| Frame | Item | Cost | Budget after |
|---|---|---|---|
| 64 | The Silent Field (acquired, portable) | €225,000 | **€35,000** |
| 1056–1080 | 7 days consumed | food −7 days, drinking −70 L | food 358 days · drinking 3,530 L |

## Audio
No new audio files. SFX = existing series/house files × `SFX_GAIN 0.5623` (cue list `SFX` in the source).
Beds: `sp-bed` 0.22 base → 0.28 swell through the collapse → 0.04 after the signal dies → 0.22 for BLACK-7 → EP01 ending
(0.24 then 0.05 under the cliffhanger); `drone` 0.07; both × `makeDuck(SPANS, 0.32, 8)`.
Government broadcast instability: looping `fc-radio-static` 0.04 → 0.14 (× SFX_GAIN) until the signal dies, plus
`sp-static`, `sp-ews`, rising `sp-glitch` hits. No voice other than the narrator; no infected voice.
Master: `volume=-1.3dB,alimiter=limit=0.84:level=false:attack=2:release=50`, AAC 192 kb/s 48 kHz (AUDIO_STYLE §4).

## Versions
| Version | Change | File |
|---|---|---|
| v1 | first render; QC Whisper heard "Black Seven" (L17) as "Blacksmith" under the alarm + radio static | not kept |
| **v1.1 (current)** | audio only: `sp-alarm`/`sp-type` moved after L17, radio carrier ducked under narration; video stream bit-identical to v1 (MD5 `030159626473e45e644a948417462461`) | `out/SILENCE_PROTOCOL_EP02_THE_FIRST_CONTACT.mp4` · 44.5 MB · SHA-256 `e2ca01669d91eaa5b08ebbacfadb6744f5229f883a3ff46e539c09767ab2ed67` |

## QC (v1.1)
ffprobe: H.264 1080×1920, 30/1 fps, **2,610 frames, 87.0 s**; AAC 48 kHz 192 kb/s · full decode clean · **−18.8 LUFS integrated, −1.6 dBFS true peak** (EP01 v2: −18.1 / −1.9) ·
Whisper on 12 s chunks of the final mix: all 30 lines intelligible, "Black 7" heard each time · only the narrator's voice is audible.
