"""Best-of-N voice lines for VoiceStudio + Chatterbox (clean pipeline, no time-stretch).

    python scripts/audio/voice_takes.py <lines.tsv> <prefix> <role=profile ...> [--takes 3]

For each line: generate N raw takes (VoiceStudio /generate, engine mlx-audio, effect_preset=raw), score each for
CRACKS (isolated 2.5 ms broadband spikes — the "shattered/glitchy" sound; sibilants don't count), keep the
cleanest, then hand it to scripts/voiceover.mjs --from <wav> --trim --loud -16 for edge-trim, gentle de-click,
linear loudness and word-timed captions. Switches the app to Chatterbox and back to OmniVoice afterwards.
"""
import json
import os
import subprocess
import sys
import tempfile
import urllib.request
import wave
from pathlib import Path

import numpy as np

API = os.environ.get("TTS_URL", "http://localhost:3900")
ROOT = Path(__file__).resolve().parents[2]


def select(model: str | None) -> None:
    body = {"family": "tts", "backend_id": "mlx-audio", "model_id": model} if model else {"family": "tts", "backend_id": "omnivoice"}
    req = urllib.request.Request(f"{API}/engines/select", data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
    urllib.request.urlopen(req).read()


def generate(text: str, profile: str, out: Path) -> None:
    subprocess.run(["curl", "-s", "-X", "POST", f"{API}/generate", "-F", f"text={text}", "-F", f"profile_id={profile}",
                    "-F", "engine=mlx-audio", "-F", "effect_preset=raw", "-F", "language=English", "-o", str(out)], check=True)


def cracks(path: Path) -> float:
    """Isolated broadband spikes per second: 2.5 ms high-band frames far above their ±30 ms neighbourhood."""
    w = wave.open(str(path))
    sr = w.getframerate()
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float) / 32768
    hp = np.diff(x, prepend=0)  # crude high-pass: cracks are wideband, voice energy is mostly low
    n = int(sr * 0.0025)
    e = np.array([np.sum(hp[i : i + n] ** 2) for i in range(0, len(hp) - n, n)]) + 1e-10
    k = 12
    count = 0
    for i in range(k, len(e) - k):
        neigh = np.concatenate([e[i - k : i - 1], e[i + 2 : i + k]])
        if e[i] > 12 * np.median(neigh) and e[i] > 1e-4:
            count += 1
    clip = int((np.abs(x) > 0.985).sum())
    return count / (len(x) / sr) + clip * 0.5


def main() -> None:
    args = sys.argv[1:]
    takes = 3
    if "--takes" in args:
        i = args.index("--takes")
        takes = int(args[i + 1])
        del args[i : i + 2]
    tsv, prefix, *roles = args
    voice = dict(r.split("=") for r in roles)
    tmp = Path(tempfile.mkdtemp())
    select("chatterbox")
    try:
        for line in open(tsv):
            n, role, text = line.rstrip("\n").split("\t")
            if role not in voice:
                continue
            scored = []
            for t in range(takes):
                out = tmp / f"{prefix}-{n}-t{t}.wav"
                generate(text, voice[role], out)
                scored.append((cracks(out), out))
            scored.sort()
            best = scored[0]
            print(f"{prefix}-{n} {role} crack scores {[round(s, 1) for s, _ in scored]} -> keep {best[0]:.1f}", flush=True)
            subprocess.run(["node", str(ROOT / "scripts/voiceover.mjs"), f"{prefix}-{n}", text, "--from", str(best[1]), "--trim", "--loud", "-16"],
                           check=True, stdout=subprocess.DEVNULL)
    finally:
        select(None)


if __name__ == "__main__":
    main()
