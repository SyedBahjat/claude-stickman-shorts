"""Give each new line the same integrated loudness as the reference line (keeps the mix balance).

    python scripts/tts/loudness_match.py --ref /tmp/orig_voice --target public/audio/voice --prefix sp1- --count 28
    python scripts/tts/loudness_match.py --lufs -20 --target public/audio/voice --prefix sp2- --count 30   # new episode
--lufs: give every line the same fixed integrated loudness instead (EP01 narration averages -20 LUFS).
"""
import argparse, re, shutil, subprocess

p = argparse.ArgumentParser()
p.add_argument("--ref"); p.add_argument("--lufs", type=float); p.add_argument("--target", required=True); p.add_argument("--prefix", required=True); p.add_argument("--count", type=int, required=True)
a = p.parse_args()
lufs = lambda f: float(re.findall(r"I:\s+(-?[0-9.]+) LUFS", subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", f, "-af", "ebur128=framelog=quiet", "-f", "null", "-"], capture_output=True, text=True).stderr)[-1])
for i in range(1, a.count + 1):
    n = f"{a.prefix}{i:02d}.wav"
    g = (a.lufs if a.lufs is not None else lufs(f"{a.ref}/{n}")) - lufs(f"{a.target}/{n}")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{a.target}/{n}", "-af", f"volume={g:.2f}dB", "-ar", "24000", "-c:a", "pcm_s16le", "/tmp/_lm.wav"], check=True)
    shutil.move("/tmp/_lm.wav", f"{a.target}/{n}")
    print(n, f"{g:+.2f} dB")
