"""Re-voice EXISTING lines without changing timing (used for EP01 v2: am_michael → af_heart; planned for the
EP01/EP02 re-voice with the official narrator, scripts/tts/narrator.json).

    python scripts/tts/match_lines.py <lines.tsv> --ref public/audio/voice --out /tmp/new     # voice = narrator

For each line, bisects the Kokoro speech rate so the trimmed length matches the reference WAV
(never longer than ref + 2.5 frames), then keeps the nearest speed whose take passes the Whisper word check.
Then: voiceover.mjs with a TEMP name (so public/captions/*.json — which drive cuts — stay untouched),
move the wav over the original, and run loudness_match.py.
"""
import argparse, subprocess
import numpy as np
import soundfile as sf
from common import asr, kokoro, lang, lines, norm, recognizer, span, voice_style

p = argparse.ArgumentParser()
p.add_argument("tsv"); p.add_argument("--voice", default="narrator"); p.add_argument("--ref", required=True); p.add_argument("--out", required=True)
a = p.parse_args()
k, r = kokoro(), recognizer()
style = voice_style(k, a.voice)
dur = lambda f: float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
gen = lambda say, sp: (lambda x: (x[0], x[1], span(x[0], x[1])))(k.create(say, voice=style, speed=float(sp), lang=lang(a.voice)))
for name, say, cap in lines(a.tsv):
    target = dur(f"{a.ref}/{name}.wav")
    lo, hi = 0.7, 2.0
    for _ in range(16):
        mid = (lo + hi) / 2
        if gen(say, mid)[2] > target: lo = mid
        else: hi = mid
    chosen = None
    for sp in [hi] + [hi + d for d in (0.002, -0.002, 0.004, -0.004, 0.007, -0.007, 0.01, -0.01, 0.015, -0.015, 0.02, -0.02)]:
        x, sr, L = gen(say, sp)
        if abs(L - target) > 2.5 / 30: continue
        h = asr(r, np.concatenate([np.zeros(1200, dtype=x.dtype), x]), sr)
        if norm(h) == norm(cap):
            chosen = (sp, x, L, h); break
    if chosen is None:
        x, sr, L = gen(say, hi); chosen = (hi, x, L, "CHECK BY EAR")
    sp, x, L, h = chosen
    sf.write(f"{a.out}/{name}.wav", np.concatenate([np.zeros(1200, dtype=x.dtype), x]), sr)
    print(f"{name} speed={sp:.4f} diff={(L - target) * 30:+.1f}f | {h}", flush=True)
