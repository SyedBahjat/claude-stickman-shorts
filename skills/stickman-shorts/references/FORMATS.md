# FORMATS: common video types and how to build each

Every format below is built the same way: a timeline of shots (`<Sequence>`), voice lines with word-timed captions,
a music/SFX layer, rendered by Remotion. Start from `src/templates/Starter.tsx` unless noted.
Typical lengths: Shorts/Reels/TikTok 20–90 s vertical; YouTube long-form 3–12 min horizontal.

| Format | Beat structure | On screen | Reuse / build |
| --- | --- | --- | --- |
| **You Decide story** | hook → escalation → rules → twist → dilemma → A/B → follow | HUD, captions, rule cards, choice cards | Everything in `src/kit` + `src/sets`; template `FreshCoP2B.tsx` (`STORY.md`) |
| **Narrated story / "storytime"** | cold-open line → setup → 2–3 escalations → twist → punchline | characters acting each line, captions | `Stick`, sets, `Cam`, `Captions`; one shot per sentence |
| **Explainer** ("how X works") | question → simple answer → 3 steps with visuals → recap | labelled diagrams, arrows, icons, a host character pointing | SVG shapes + `Stick` with `reach` to point; animate `strokeDashoffset` for drawing lines |
| **Top-N / listicle** | hook ("5 things…") → N items counting down, each 5–12 s → best one last → CTA | big number badge, item title, illustration | `ListScene` pattern in `Starter.tsx`; a number card component |
| **History / "this actually happened"** | date + place hook → context → turning point → consequence → strange fact | map, date stamp, year counter, aged-paper palette | `WallMap`-style map, `RuleCard`-style paper notes, sepia palette |
| **Quiz / would-you-rather** | question → options → countdown 3-2-1 → answer/poll % → next | two big option cards, timer ring, percentage bars | `ChoiceCards` restyled, spring-animated bars |
| **Dialogue skit / meme** | setup line → reaction → escalation → punch → reaction shot | two characters, speech captions per speaker (colour per speaker) | `Stick` looks per role, distinct voices, quick cuts and zooms (`Cam`) |
| **Kinetic text / quote** | one line per beat, synced to music hits | big words flying in, shapes, colour flashes | Text components with `spring`; beat times from the music (no voice) |
| **Whiteboard / doodle** | narration while lines draw themselves | hand-drawn strokes revealing, a marker hand | SVG paths with `strokeDasharray` reveal, Permanent Marker font (`FONT.hand`) |
| **Chat / text-message story** | messages pop in one by one → twist message → reaction | phone UI, bubbles, typing dots, "Not Delivered" | `Phone` in `src/kit/Props.tsx`, message-bubble list |
| **Stats / comparison** | claim → data reveal → surprising contrast → takeaway | bar/line charts growing, counters ticking | SVG charts driven by `interpolate`; counters with `Math.round` |
| **Horizontal long-form** | intro hook (first 15 s) → chapters with title cards → outro | lower-thirds, chapter cards, b-roll scenes | Same kit at `format: "horizontal"`; one file per chapter, joined in a master composition |

## Rules that hold for every format

- First 1–2 seconds must hook: movement + a line that creates a question.
- A visual change at least every 2–4 s on Shorts (cut, zoom, new element), 4–8 s on long-form.
- Captions on by default for vertical video; keep them clear of faces and UI safe zones (top 10%, bottom 20%).
- One idea per shot; the picture shows what the voice says.
- End with the next action (follow / comment / part 2), but keep engagement asks in the description when the
  user prefers clean videos.
