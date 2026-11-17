"""Generate a NEW episode's narration lines (first pass), fastest clean take per line.

    python scripts/tts/generate_lines.py stories/silence-protocol/episodes/ep02/lines.tsv --voice af_heart --out /tmp/raw

For each line, tries speeds (fastest first) and keeps the first take Whisper transcribes word-for-word.
EP01 originally used speeds 1.35 → 1.0 (fast "urgent" pace; ~3.4 words/s). Then run, per line:
    node scripts/voiceover.mjs <name> "<spoken text>" --from <out>/<name>.wav --trim --loud -16
    python stories/silence-protocol/remap_captions.py <lines.tsv>      # captions show digits / €
"""
import argparse
import numpy as np
import soundfile as sf
from common import asr, kokoro, lang, lines, norm, recognizer

p = argparse.ArgumentParser()
p.add_argument("tsv"); p.add_argument("--voice", default="af_heart"); p.add_argument("--out", required=True)
p.add_argument("--speeds", default="1.35,1.3,1.25,1.2,1.1,1.0")
a = p.parse_args()
k, r = kokoro(), recognizer()
for name, say, cap in lines(a.tsv):
    best = None
    for sp in [float(s) for s in a.speeds.split(",")]:
        x, sr = k.create(say, voice=a.voice, speed=sp, lang=lang(a.voice))
        x = np.concatenate([np.zeros(int(0.05 * sr), dtype=x.dtype), x])
        h = asr(r, x, sr)
        ok = norm(h) == norm(cap)
        if ok or best is None:
            best = (sp, x, h, ok)
        if ok:
            break
    sf.write(f"{a.out}/{name}.wav", best[1], sr)
    print(name, best[0], "OK" if best[3] else "CHECK BY EAR", "|", best[2], flush=True)
