"""Break down an example video so its format can be recreated with your own story.

    python scripts/analyze_reference.py <video.mp4> [out_dir]      (default out_dir: reference/<video-name>/)

Writes into out_dir:
  report.md        duration, size, fps, cut list + average shot length, loudness, palette, word pace
  sheet-NN.png     contact sheets (one frame per second, 6x4 tiles) to study layout, HUD, captions, cards
  cut-NNN.png      first frame of every shot
  palette.png      the 16 most-used colours as swatches (hex values in report.md)
  spectrogram.png  the audio, to spot music beds, drones and SFX
  audio.wav        the soundtrack (mono 24 kHz)
  transcript.txt   speech-to-text, if a Whisper-compatible server is reachable at $TTS_URL (VoiceStudio has one)

Only for studying format, pacing, colour and sound design. Never re-upload someone else's video, story or audio.
"""
import json
import os
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

import numpy as np


def run(*cmd: str) -> str:
    p = subprocess.run(cmd, capture_output=True, text=True)
    return p.stderr + p.stdout


def probe(video: Path) -> dict:
    out = subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", str(video)],
                         capture_output=True, text=True, check=True).stdout
    info = json.loads(out)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    num, den = (int(x) for x in v["r_frame_rate"].split("/"))
    return {"duration": float(info["format"]["duration"]), "width": v["width"], "height": v["height"], "fps": round(num / den, 2)}


def cuts(video: Path, out: Path) -> list[float]:
    log = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(video), "-vf", "select='gt(scene,0.25)',showinfo", "-vsync", "vfr",
                          str(out / "cut-%03d.png")], capture_output=True, text=True).stderr
    times: list[float] = []
    for t in (float(x) for x in re.findall(r"pts_time:([0-9.]+)", log)):
        if not times or t - times[-1] >= 0.5:  # ignore flicker / caption pops right after a cut
            times.append(t)
    return times


def palette(video: Path, out: Path, k: int = 16) -> list[tuple[str, float]]:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(video), "-vf", "fps=1,scale=96:-2", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                         capture_output=True, check=True).stdout
    px = np.frombuffer(raw, np.uint8).reshape(-1, 3)
    q = (px // 16).astype(np.int32)  # 16 levels per channel, then pick the most common bins
    keys = q[:, 0] * 256 + q[:, 1] * 16 + q[:, 2]
    bins, counts = np.unique(keys, return_counts=True)
    top = np.argsort(counts)[::-1][:k]
    result = []
    for i in top:
        members = px[keys == bins[i]].mean(axis=0).astype(int)
        result.append(("#%02x%02x%02x" % tuple(members), counts[i] / len(px)))
    swatch = "".join(f"color=c=0x{h[1:]}:s=80x80:d=1[c{i}];" for i, (h, _) in enumerate(result))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-filter_complex",
                    swatch + "".join(f"[c{i}]" for i in range(len(result))) + f"hstack=inputs={len(result)}", "-frames:v", "1",
                    str(out / "palette.png")], check=True)
    return result


def transcribe(wav: Path) -> str | None:
    url = os.environ.get("TTS_URL", "http://localhost:3900") + "/v1/audio/transcriptions"
    try:
        out = subprocess.run(["curl", "-sf", "-m", "300", url, "-F", f"file=@{wav}", "-F", "model=whisper-1", "-F", "response_format=json"],
                             capture_output=True, text=True, check=True).stdout
        return json.loads(out)["text"].strip()
    except (subprocess.CalledProcessError, json.JSONDecodeError, KeyError):
        return None


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    video = Path(sys.argv[1]).resolve()
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("reference") / re.sub(r"[^a-z0-9]+", "-", video.stem.lower()).strip("-")
    out.mkdir(parents=True, exist_ok=True)

    info = probe(video)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-vf", "fps=1,scale=240:-2,tile=6x4", str(out / "sheet-%02d.png")], check=True)
    times = cuts(video, out)
    shots = np.diff([0.0, *times, info["duration"]])
    pal = palette(video, out)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-vn", "-ac", "1", "-ar", "24000", str(out / "audio.wav")], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(out / "audio.wav"), "-lavfi", "showspectrumpic=s=1600x500:legend=1:stop=8000",
                    str(out / "spectrogram.png")], check=True)
    loud = re.search(r"I:\s*(-?[0-9.]+) LUFS", run("ffmpeg", "-hide_banner", "-nostats", "-i", str(video), "-vn", "-af", "ebur128=framelog=quiet", "-f", "null", "-"))
    text = transcribe(out / "audio.wav")
    if text:
        (out / "transcript.txt").write_text(text + "\n")

    words = len(text.split()) if text else 0
    lines = [
        f"# Reference breakdown: {video.name}",
        "",
        f"- **Format:** {info['width']}x{info['height']} @ {info['fps']} fps, {info['duration']:.1f} s",
        f"- **Cuts:** {len(times)} hard cuts, average shot {shots.mean():.1f} s (min {shots.min():.1f}, max {shots.max():.1f})",
        f"- **Loudness:** {loud.group(1) if loud else '?'} LUFS integrated",
        f"- **Speech:** {words} words, {words / info['duration']:.1f} words/s" if text else "- **Speech:** no transcript (start a Whisper-compatible server and set TTS_URL, or transcribe by hand)",
        "",
        "## Palette (most used first)",
        "",
        "| Hex | Share |",
        "| --- | --- |",
        *[f"| `{h}` | {share:.1%} |" for h, share in pal],
        "",
        "## Cut times (s)",
        "",
        ", ".join(f"{t:.1f}" for t in times) or "none detected",
        "",
        "## Next",
        "",
        "Open the sheets, cut frames, palette and spectrogram, then fill the checklist in",
        "`skills/stickman-shorts/references/COPY-A-REFERENCE.md`.",
    ]
    (out / "report.md").write_text("\n".join(lines) + "\n")
    print(f"wrote {out}/report.md ({len(times)} cuts, {len(pal)} colours, transcript {'yes' if text else 'no'})")


if __name__ == "__main__":
    main()
