# PATH MAP: where the SILENCE PROTOCOL docs live now

The documentation was reorganized into numbered top-level folders **without editing the documents**, so paths written
inside them still use the old locations. Translate with this table:

| Old path (as written inside the docs) | New path |
|---|---|
| `stories/silence-protocol/bible/MASTER_SERIES_BIBLE.md` (also `bible/…`) | `01_SERIES_BIBLE/MASTER_SERIES_BIBLE.md` |
| `bible/CHARACTER_BIBLE.md` | `01_SERIES_BIBLE/CHARACTER_BIBLE.md` |
| `bible/ENVIRONMENT_BIBLE.md` | `01_SERIES_BIBLE/ENVIRONMENT_BIBLE.md` |
| `bible/TECHNOLOGY_BIBLE.md` | `01_SERIES_BIBLE/TECHNOLOGY_BIBLE.md` |
| `bible/VISUAL_STYLE.md` | `01_SERIES_BIBLE/VISUAL_STYLE.md` |
| `bible/AUDIO_STYLE.md` | `01_SERIES_BIBLE/AUDIO_STYLE.md` |
| `bible/PRODUCTION_RULES.md` | `01_SERIES_BIBLE/PRODUCTION_RULES.md` |
| `bible/ASSET_REGISTRY.md` | `03_MASTER_ASSETS/ASSET_REGISTRY.md` |
| `bible/ASSET_CHECKSUMS.sha256` | `03_MASTER_ASSETS/ASSET_CHECKSUMS.sha256` |
| `episodes/ep01/{README,CANON,PRODUCTION_SHEET,NEW_ASSETS,CONTINUITY_UPDATES}.md` | `02_EPISODES/EP01/…` |
| `stories/silence-protocol/{script,continuity,voices}.md` (EP01 working notes) | `02_EPISODES/EP01/…` |
| `episodes/epNN/` (future episodes) | `02_EPISODES/EPNN/` (EP02 folder exists, empty) |
| `episodes/_template/` | `04_PROJECT_FILES/EPISODE_TEMPLATE/` |
| `stories/silence-protocol/README.md` | `04_PROJECT_FILES/SERIES_README.md` |

**Not moved** (production files with dependents): `stories/silence-protocol/ep01-lines.tsv` and
`stories/silence-protocol/remap_captions.py` (used by the narration/caption commands), all code in `src/`, `scripts/`,
all audio in `public/`. Also not moved: the engine's `README.md`/`CONTRIBUTING.md`, the stickman-shorts skill docs
(`skills/`, loaded by the skill system), and the FreshCo / Last Train story docs (referenced from their episode code).

New episode workflow with the new layout: `cp -r 04_PROJECT_FILES/EPISODE_TEMPLATE 02_EPISODES/EP02` (merge into the
existing empty folder); lines TSV may stay in `02_EPISODES/EPNN/lines.tsv`.
