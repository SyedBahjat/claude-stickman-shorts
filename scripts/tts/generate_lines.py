"""Generate a NEW episode's narration lines (first pass), fastest clean take per line.

    python scripts/tts/generate_lines.py stories/silence-protocol/episodes/ep02/lines.tsv --out /tmp/raw          # voice = official narrator

Voice defaults to "narrator" (the official series narrator, scripts/tts/narrator.json) at its approved speed;
the approved retry speeds are tried in order until Whisper transcribes the take word-for-word. Never pass another
--voice or --speeds for series narration without the producer's authorization. Then run, per line:
    node scripts/voiceover.mjs <name> "<spoken text>" --from <out>/<name>.wav --trim --loud -16
    python stories/silence-protocol/remap_captions.py <lines.tsv>      # captions show digits / €
"""
import argparse
import numpy as np
import soundfile as sf
from common import asr, kokoro, lang, lines, narrator_config, norm, recognizer, voice_style

p = argparse.ArgumentParser()
p.add_argument("tsv"); p.add_argument("--voice", default="narrator"); p.add_argument("--out", required=True)
p.add_argument("--speeds", default=",".join(str(s) for s in narrator_config()["retry_speeds"]))
a = p.parse_args()
k, r = kokoro(), recognizer()
style = voice_style(k, a.voice)
for name, say, cap in lines(a.tsv):
    best = None
    for sp in [float(s) for s in a.speeds.split(",")]:
        x, sr = k.create(say, voice=style, speed=sp, lang=lang(a.voice))
        x = np.concatenate([np.zeros(int(0.05 * sr), dtype=x.dtype), x])
        h = asr(r, x, sr)
        ok = norm(h) == norm(cap)
        if ok or best is None:
            best = (sp, x, h, ok)
        if ok:
            break
    sf.write(f"{a.out}/{name}.wav", best[1], sr)
    print(name, best[0], "OK" if best[3] else "CHECK BY EAR", "|", best[2], flush=True)
