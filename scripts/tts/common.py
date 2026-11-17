"""Shared helpers for the SILENCE PROTOCOL narration toolchain (Kokoro TTS + Whisper word check)."""
import os, re
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


def lang(voice):
    return "en-us" if voice[0] == "a" else "en-gb"
