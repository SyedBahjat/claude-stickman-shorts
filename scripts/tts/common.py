"""Shared helpers for the SILENCE PROTOCOL narration toolchain (Kokoro TTS + Whisper word check).

The official series narrator is defined ONLY in scripts/tts/narrator.json and is used through the voice id
"narrator" (generate_lines.py / match_lines.py default). Check the install and config:
    python scripts/tts/common.py
"""
import hashlib, json, os, re
import numpy as np
import scipy.signal as ss

TTS_DIR = os.environ.get("TTS_DIR", os.path.expanduser("~/.cache/silence-tts"))
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))


def kokoro():
    from kokoro_onnx import Kokoro
    return Kokoro(f"{TTS_DIR}/kokoro-v1.0.onnx", f"{TTS_DIR}/voices-v1.0.bin")


def recognizer():
    import sherpa_onnx
    d = f"{TTS_DIR}/sherpa-onnx-whisper-base.en/"
    return sherpa_onnx.OfflineRecognizer.from_whisper(encoder=d + "base.en-encoder.onnx", decoder=d + "base.en-decoder.onnx", tokens=d + "base.en-tokens.txt", num_threads=4)


def asr(r, a, sr):
    a = ss.resample_poly(a, 16000, sr).astype("float32")
    s = r.create_stream()
    s.accept_waveform(16000, a)
    r.decode_stream(s)
    return s.result.text.strip()


def norm(t):
    """Normalize for comparing a transcript with the caption text (numbers/currency tolerant)."""
    t = t.lower().replace("sixty", "60").replace("€", "").replace(",", "").replace("euros", "").replace("$", "")
    return re.sub(r"[^a-z0-9 ]", " ", t).split()


def span(a, sr):
    """Length after scripts/voice-trim.mjs trimming: speech bounds at -40 dB + 0.12 s pads."""
    idx = np.where(np.abs(a) > 10 ** (-40 / 20) * np.abs(a).max() / 0.9)[0]
    return (idx[-1] - idx[0]) / sr + 0.12


def lines(tsv):
    """ep lines TSV: name <TAB> spoken text (numbers as words) <TAB> caption text (365, €260,000)."""
    for row in open(tsv, encoding="utf8").read().splitlines():
        if row.strip():
            yield row.split("\t")


NARRATOR_JSON = os.path.join(ROOT, "scripts", "tts", "narrator.json")


def narrator_config():
    return json.load(open(NARRATOR_JSON, encoding="utf8"))


def voice_style(k, voice):
    """Resolve a voice id for Kokoro.create(voice=...). "narrator" -> the official blend, verified against its hash."""
    if voice != "narrator":
        return voice
    c = narrator_config()
    style = sum(b["weight"] * k.get_voice_style(b["voice"]) for b in c["blend"])
    got = hashlib.sha256(np.asarray(style, dtype=np.float32).tobytes()).hexdigest()
    if got != c["style_sha256"]:
        raise SystemExit(f"narrator voice mismatch ({got}): wrong voices file or edited narrator.json. Do not render.")
    return style


def lang(voice):
    if voice == "narrator":
        return narrator_config()["lang"]
    return "en-us" if voice[0] == "a" else "en-gb"


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


if __name__ == "__main__":
    c = narrator_config()
    ok = True
    for key in ("model", "voices"):
        f = f"{TTS_DIR}/{c[key + '_file']}"
        good = os.path.exists(f) and sha256_file(f) == c[key + "_sha256"]
        ok &= good
        print(f"{c[key + '_file']:18s} {'OK' if good else 'MISSING OR DIFFERENT (run scripts/tts/setup_tts.sh)'}")
    if ok:
        voice_style(kokoro(), "narrator")
        mix = " + ".join("%s*%s" % (b["weight"], b["voice"]) for b in c["blend"])
        print(f"narrator style      OK  {mix}, lang {c['lang']}, speed {c['speed']}")
    raise SystemExit(0 if ok else 1)
