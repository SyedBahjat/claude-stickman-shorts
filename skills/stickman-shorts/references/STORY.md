# STORY: script format

The user brings the idea or the full script. Your job is to fit it to this format. If they only give a topic,
pitch 3 loglines first and let them pick.

## One part (~75–90 s, ~180–220 words)

1. **Hook (0–5 s).** Part 1: "Imagine you wake up and…" / "You're the last one in the store when…".
   Later parts: **"Most of you said: <winning option>."** (`MostOfYouSaid` opener, both cards, winner kept).
2. **Escalation (5–20 s).** Concrete sensory details and numbers ("23 alerts", "impact in 15 minutes").
   Start the HUD countdown or clock.
3. **Character / twist beats (20–60 s).** A helper with a secret, **numbered rules** on rule cards
   ("Rule one: never look at the flash."), a reveal held in silence ("He knew." / "That was me.").
4. **Dilemma (60–74 s).** An emotional pull against the safe choice, under time pressure.
5. **Question (74–78 s).** "Do you **A** or **B**?" → two choice cards.
6. **CTA (last 2 s).** "Follow for part N." Title "FOLLOW FOR PART N".

## Writing rules

- **Second person, present tense:** "you", "your mom", "he pulls…". The viewer is the hero (`YOU`, red arm band).
- Short sentences, 3–10 words. Fragments are fine. One idea per caption page.
- Characters speak their own lines in their own voice (narrator never does accents).
- Both options must be genuinely hard. Option text ≤ 20 chars, UPPERCASE on the cards.
- Every part ends on the choice; the next part opens with the result. Endings get an `EndingCard`
  ("ENDING 3 OF 4: THE LIE").
- Sound human: contractions, a few "That's it." beats, ellipses for real pauses, the narrator reacts.
- Keep continuity (day, clock, place, countdown, props someone carries, who is alive) in
  `stories/<story>/continuity.md`.
- Plan the branches up front: write every part and path in `stories/<story>/script.md` before building
  Part 1, so foreshadowing pays off whichever option wins.
- Engagement asks ("comment SEASON 2") go in the upload description, not into the video.

## Shot sheet (fill before building, get the user's OK)

```
PART 2B — <story>
HUD start: DAY 1 · 3:12 AM · FLOOR 9 · countdown IMPACT IN 15:00 (from shot 5)
# | set / staging                      | on screen                  | VO role: line                    | SFX
1 | last frame of Part 1, blurred      | MOST OF YOU SAID, A/B      | NARRATOR: Most of you said: ...  | whoosh, sparkle
2 | stairwell, YOU runs down           | HUD place = STAIRWELL      | NARRATOR: You take the stairs.   | footsteps
```

Also write `stories/<story>/partN-lines.tsv` (`NN<TAB>ROLE<TAB>line`) for batch voice generation.

## Examples in this repo

- `stories/last-train/`: Season 1 (subway blackout + nuclear strike), 4 parts, 2 endings, Season 2 written.
- `stories/freshco/`: zombie outbreak in a supermarket, Parts 1 and 2B.
