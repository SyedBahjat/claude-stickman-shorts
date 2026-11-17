# Voices
- NARRATOR (v2, current): Kokoro-82M (open weights, local ONNX via kokoro-onnx), voice `af_heart`.
  Each line is synthesized at the Kokoro speech rate (≈1.08–1.38) whose trimmed length matches the v1 line
  within ±1.3 frames, verified word-for-word with local Whisper base.en, then gain-matched per line to the v1 loudness.
  No time-stretching. Caption JSONs (which drive cuts/SFX timing) are unchanged from v1.
- NARRATOR (v1, replaced): Kokoro `am_michael`.
- Pipeline: `kokoro → scripts/voiceover.mjs --from <wav> --trim --loud -16` (temporary name so captions are untouched)
  → per-line gain to the v1 loudness.
- Mix: SFX at `SFX_GAIN = 0.5623` (−5 dB vs v1); music beds unchanged. Master: static −1.3 dB + limiter at −1.5 dBFS.
- No other character voices in EP01.
