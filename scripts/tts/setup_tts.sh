#!/usr/bin/env bash
# SILENCE PROTOCOL narration toolchain (free, local, no API keys).
# Kokoro-82M ONNX (TTS) + Whisper base.en via sherpa-onnx (word check). Models are NOT in git (~535 MB).
# Usage: bash scripts/tts/setup_tts.sh      (models go to $TTS_DIR, default ~/.cache/silence-tts)
set -euo pipefail
TTS_DIR="${TTS_DIR:-$HOME/.cache/silence-tts}"
mkdir -p "$TTS_DIR" && cd "$TTS_DIR"
pip install -q kokoro-onnx==0.6.1 sherpa-onnx==2.0.1 soundfile scipy
[ -f kokoro-v1.0.onnx ] || curl -sSL -o kokoro-v1.0.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
[ -f voices-v1.0.bin ] || curl -sSL -o voices-v1.0.bin https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
if [ ! -d sherpa-onnx-whisper-base.en ]; then
  curl -sSL -o whisper.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-base.en.tar.bz2
  tar xjf whisper.tar.bz2 && rm whisper.tar.bz2
fi
ls -la "$TTS_DIR"
