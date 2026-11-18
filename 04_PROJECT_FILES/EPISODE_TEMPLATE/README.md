# Episode template: copy this folder to `episodes/epNN/`

```bash
cp -r stories/silence-protocol/episodes/_template stories/silence-protocol/episodes/ep02
```
Then fill, in order:
1. `SCRIPT.md`: premise of the episode, vote resolution, scenes, narration, new rule, the A/B choice. Get producer approval.
2. `lines.tsv`: one row per narration line: `sp<N>-NN<TAB>spoken text (numbers in words)<TAB>caption text (digits, €)`.
3. Build `src/stories/silence-protocol/SilenceP<N>.tsx` (copy EP01's structure, never edit EP01), register `SilenceProtocol-EP0<N>` in `src/Root.tsx`.
4. `PRODUCTION_SHEET.md`: lines/frames/speeds, scene marks, shot list, purchase frames, versions.
5. After the final render is approved: `CANON.md` (cumulative state!), `NEW_ASSETS.md`, `CONTINUITY_UPDATES.md`;
   update `bible/` only for new permanent facts; update `bible/ASSET_CHECKSUMS.sha256`; point `CLAUDE.md` "latest canon" at this episode.
