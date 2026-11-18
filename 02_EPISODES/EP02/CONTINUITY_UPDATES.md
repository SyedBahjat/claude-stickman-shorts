# EP02: Continuity updates

## Bible changes (file → what changed, why it is permanent)
- `MASTER_SERIES_BIBLE.md`: latest-canon pointer → EP02; snapshot after EP02; virus corollary: received transmissions are
  text only + the government's (unconfirmed) "familiar identities" claim; EP02 row in the document map.
- `TECHNOLOGY_BIBLE.md`: §4 Silent Field **bought**, portable/carried (scale 0.5), standby look, never activated; Ghost Echo
  not bought; new §6 Communications (console receives transmissions, BLACK-7, transcript/alert/degradation looks);
  new §7 shared UI file.
- `ENVIRONMENT_BIBLE.md`: §3b outbreak sets (`WorldMap`, `Airport`, `Hospital sign`, `Street lights`).
- `VISUAL_STYLE.md`: §9 HUD "OUTBREAK / DAY N", SlamTitle, vote opener colours, "ACQUIRED · PORTABLE" toast, final card variant.
- `AUDIO_STYLE.md`: EP02 narration note; §5 deteriorating-transmission and silent-text-beat conventions.
- `ASSET_REGISTRY.md`: EP02 code/voice/captions, `SilenceUI.tsx`, two house SFX first used.
- `CLAUDE.md`: step 2 now points at `02_EPISODES/EP02/EP02_CANON.md`.
- `ASSET_CHECKSUMS.sha256`: regenerated for the changed shared files and the new EP02 assets.
- Not changed: `CHARACTER_BIBLE.md` (no new character; Patient Zero = `TURNED[2]`, doctor = `HALE`, as in EP01),
  `PRODUCTION_RULES.md`.

## Canon changes vs EP01
- Budget €260,000 → **€35,000** (Silent Field €225,000).
- Countdown 365 → **0, preparation complete**; new counter **DAY 7 OF THE OUTBREAK**.
- Food 365 → **358 days**, drinking water 3,600 → **3,530 L** (7 days of consumption at the EP01 rates).
- New: Patient Zero (hospital), seven-day global collapse, government's final broadcast, prohibition of **BLACK-7**,
  incoming BLACK-7 transmission (sender unknown).

## Superseded facts
- "Pending vote: Silent Field vs Ghost Echo" → resolved (A). Marked *(superseded in EP02)* in MASTER.
- HUD "DAYS UNTIL OUTBREAK 365" → "OUTBREAK DAY 7" from EP02 onward.

## Flags for the producer (decisions taken to keep continuity; easy to revise)
1. **Name:** "Campo Muto" is shown and narrated as **THE SILENT FIELD** (EP01's on-screen name; English-only rule).
2. **Portable form:** EP01 only showed the SF-60 on a display platform (scale 1.05) plus a tiny blue handheld in the demo.
   EP02 carries the **same SF-60 component at scale 0.5** so it is recognisably the same gadget and plausibly portable.
3. **Receiving broadcasts:** no radio receiver was bought in EP01. EP02 treats the console (Surveillance systems) as able to
   receive transmissions, routed through the existing speech-to-text chain.
4. **Consumption:** HUD food/water drop by 7 days on DAY 7 (YOU sealed in at day 0). Not requested explicitly; done so the
   HUD does not contradict the passage of time.
5. **Extra narration and text:** the 20 narration lines not marked ★ in the script, plus the BLACK-7 lines "PLEASE ANSWER." and the cliffhanger
   "WHY AREN'T YOU ANSWERING?" were added so the episode matches EP01's density and ending format. The producer's own
   lines are verbatim (marked ★ in the script).
6. **EP01 open questions** (voices at EXT MIC 01 on DAY 1 of preparation, "WE KNOW YOU'RE DOWN THERE") are left untouched.
