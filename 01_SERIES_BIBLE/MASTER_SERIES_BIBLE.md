# SILENCE PROTOCOL: Master Series Bible

> This is the series' permanent memory. It describes the production **as it actually exists** in this repository after
> Episode 01 (verified against the source files and the rendered MP4). If a document and the code disagree, the
> **code + rendered EP01 are the truth**; fix the document.

## 1. Identity

| | |
|---|---|
| Series title | **SILENCE PROTOCOL** |
| Format | Interactive "You Decide" horror/survival short. Each episode ends on an **A/B choice** the audience votes on in the comments; the next episode follows the winning option. |
| Genre | Cinematic horror · survival · apocalypse · interactive storytelling |
| Language | **English only**: narration, captions, UI, on-screen text, file content |
| Narration | **Second person** ("you…"). The viewer IS the protagonist. Never first person, never a named hero speaking. |
| Look | Cinematic minimalist **stick-figure** animation (flat SVG in Remotion), dark atmospheric sets, red emergency light, restrained green/red survival UI |
| Format | Vertical **9:16, 1080×1920, 30 fps**, H.264 + AAC, **85–90 s** per episode (EP01 = 90.0 s, 2,700 frames) |
| Engine | This repo: Remotion 4.0.539 + React SVG kit (`src/kit`, `src/sets`), house style from `.claude/skills/stickman-shorts/` |

## 2. Premise (canon)

In exactly 365 days a deadly **voice-transmitted virus** will end the world. You know the exact date. You have **one
year and €1,000,000** to build the perfect survival shelter. Episode 01 builds the bunker and ends on the first
technology choice.

### The virus: fixed rules (never contradict)
1. An infected person speaks.
2. Anyone who **hears** an infected person's voice becomes infected.
3. Once infected, that person transmits the virus through **their own voice**.
4. **No physical contact** is necessary.
5. Hearing **even a single word** is enough.

Corollaries established on screen in EP01:
- **Reading is safe.** Infected speech converted to **text** does not infect (the bunker's speech-to-text system).
- Infected people are visualized with **grey-green skin (#8e9a86) and blank white eyes**; their voice is drawn as
  **red sound-wave rings** (#ff3b2a). Infection is instant on contact with the rings.
- The audience **never hears** an infected human voice.
- (EP02) Every **received transmission** (radio, government broadcast, channels) also goes through speech-to-text and is
  shown as text only. The government **claims** the infected "can reproduce familiar identities" (unconfirmed in-story). Infected speech appears only as text or as red rings.
  (The Ghost Echo drone's "artificial infected voice" is a **wordless synthesized warble**, never real words.)

### The Silence Rules (numbered, permanent, one or more per episode)
| # | Rule | Introduced |
|---|---|---|
| **RULE 01** | **IF YOU HEAR THEM, YOU ARE ALREADY ONE OF THEM.** | EP01 |

New rules continue the numbering (RULE 02, 03…) with the same title-card look (`VISUAL_STYLE.md` §7).

## 3. Current state of the story → read the latest canon
The authoritative, cumulative state (budget, supplies, countdown, bunker contents, open questions) lives in the
**latest completed episode's** `episodes/epNN/CANON.md`. As of now: **`02_EPISODES/EP02/EP02_CANON.md`**.

Snapshot after EP01 (verified):
- Budget **€260,000** (from €1,000,000 − €740,000).
- Food **365 days** · Drinking water **3,600 L** · Technical water **12,000 L** · Countdown **365 days**.
- **Pending audience vote:** A, THE SILENT FIELD (€225,000), or B, THE GHOST ECHO (€220,000). Neither is purchased.
  *(superseded in EP02: A won)*

Snapshot after EP02 (verified):
- THE SILENT FIELD bought → budget **€35,000**; carried by YOU, **never activated**.
- Preparation over (countdown 0); **DAY 7 OF THE OUTBREAK**. Food **358 days** · drinking **3,530 L** · technical **12,000 L**.
- Government's final order: **NEVER RESPOND TO CHANNEL BLACK-7**. An unknown sender is now transmitting on BLACK-7.
- **Pending audience vote:** A, INVESTIGATE BLACK-7, or B, DISCONNECT BLACK-7 (no cost).

## 4. Episode structure (established by EP01)
1. **Hook (0–12 s):** immediate shock image + the stakes.
2. **Setup:** the advantage / resources.
3. **Build or act:** satisfying, quantified progress (purchases, resource counters, HUD updates).
4. **Status:** resource interface; the turn ("But you are not safe yet.").
5. **Rule beat:** a new Silence Rule title card (held in silence ~2 s).
6. **Choice:** two mutually exclusive options, each with a cinematic reveal + demo, a cost comparison, final
   cards **A — NAME — €PRICE / B — NAME — €PRICE**, **COMMENT A OR B**, and a horror cliffhanger in the last ~1.5 s.

Episodes ≥ 02 should open by resolving the vote. The kit has `MostOfYouSaid` (`src/kit/Overlays.tsx`) for this; restyle
only colours if needed (series A = blue `#5fb4ff`, B = green `#58d68d`).

## 5. Document map
| Document | Contents |
|---|---|
| `bible/CHARACTER_BIBLE.md` | YOU, the infected, civilians; rig proportions, looks, poses |
| `bible/ENVIRONMENT_BIBLE.md` | The bunker (exact layout + coordinates), every set, file paths |
| `bible/TECHNOLOGY_BIBLE.md` | Bunker systems, HUD, interfaces, gadgets (Silent Field, Ghost Echo) |
| `bible/VISUAL_STYLE.md` | Palette, typography, lighting, camera, animation timing, captions |
| `bible/AUDIO_STYLE.md` | Narrator voice + TTS settings, SFX list, music, mix & mastering numbers |
| `bible/PRODUCTION_RULES.md` | Pipeline, commands, render/export settings, do/don't rules, checklists |
| `bible/ASSET_REGISTRY.md` | Every original asset path (code, audio, captions, docs, tools) + checksums file |
| `02_EPISODES/EP02/` | EP02 canon (`EP02_CANON.md`), script (`EP02_SCRIPT.md`), production sheet, new assets, continuity updates |
| `episodes/ep01/` | EP01 canon, production sheet (frame-exact timeline), new assets, continuity updates |
| `episodes/_template/` | Copy this folder for every new episode |

## 6. Change policy for this bible
- Update the bible **only** for genuinely new **permanent** information (a new recurring set, character, gadget,
  rule, palette entry, audio convention). Episode-specific facts go in that episode's folder.
- Never delete history; mark superseded items `(superseded in EPnn)` and add the new one.
- Every bible change is recorded in the episode's `CONTINUITY_UPDATES.md`.
