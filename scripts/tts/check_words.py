"""Transcribe WAV/MP4 audio with local Whisper base.en (word check). Long files: pass 12 s chunks.

    python scripts/tts/check_words.py public/audio/voice/sp1-*.wav
"""
import subprocess, sys
import numpy as np
from common import asr, recognizer

r = recognizer()
for f in sys.argv[1:]:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout
    print(f.split("/")[-1], "|", asr(r, np.frombuffer(raw, dtype=np.float32), 16000))
