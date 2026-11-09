"""FreshCo (zombie supermarket) original music + SFX. Synthesized, no samples.

    python scripts/audio/freshco_audio.py

Writes public/audio/{music,sfx}/fc-*.wav. Reuses helpers from decide_sfx.py.
"""
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from decide_sfx import SR, bp, env, hp, lp, noise, place, reverb, rng, save, t, thump  # noqa: E402

BPM = 112
BEAT = 60 / BPM


def note(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


def epiano(f: float, d: float) -> np.ndarray:
    x = t(d)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * 2 * f * x) + 0.1 * np.sin(2 * np.pi * 3 * f * x)) * env(len(x), 0.004, d * 0.45)


def glock(f: float, d: float = 0.6) -> np.ndarray:
    x = t(d)
    return sum(a * np.sin(2 * np.pi * f * m * x) for m, a in ((1, 1), (2.76, 0.4), (5.4, 0.2))) * env(len(x), 0.002, 0.22)


def jingle(loops: int = 2) -> np.ndarray:
    """Cheesy supermarket muzak: C-Am-F-G, comping e-piano, walking bass, shaker, glockenspiel hook."""
    chords = [(48, [60, 64, 67]), (45, [57, 60, 64]), (41, [57, 60, 65]), (43, [59, 62, 67])]
    hook = [(0, 76), (0.5, 79), (1, 81), (1.5, 79), (2, 76), (3, 74), (4, 72), (4.5, 74), (5, 76), (6, 79), (6.5, 76),
            (8, 77), (8.5, 76), (9, 74), (10, 72), (11, 74), (12, 71), (12.5, 72), (13, 74), (14, 79)]
    bar = 4 * BEAT
    total = loops * 4 * bar
    ev = []
    for L in range(loops):
        for ci, (root, tri) in enumerate(chords):
            t0 = (L * 4 + ci) * bar
            for b in (1, 3):
                for m in tri:
                    ev.append((t0 + b * BEAT, epiano(note(m), BEAT * 0.9), 0.18))
            for b, m in ((0, root), (1, root + 7), (2, root + 12), (3, root + 7)):
                ev.append((t0 + b * BEAT, lp(np.sign(np.sin(2 * np.pi * note(m - 12) * t(BEAT * 0.9))), 600) * env(int(BEAT * 0.9 * SR), 0.005, 0.25), 0.22))
            for k in range(8):
                ev.append((t0 + k * BEAT / 2, hp(noise(0.05), 6000) * env(int(0.05 * SR), 0.001, 0.015), 0.12 if k % 2 else 0.07))
            ev.append((t0, thump(70, 0.25), 0.35))
            ev.append((t0 + 2 * BEAT, thump(70, 0.25), 0.3))
        for beat, m in hook:
            ev.append((L * 4 * bar + beat * BEAT, glock(note(m)), 0.32))
    return place(total + 1.0, ev)[: int(total * SR)]


def pa(x: np.ndarray) -> np.ndarray:
    """Through cheap ceiling/outdoor speakers: band-limited, slightly crunchy, a bit of room."""
    y = bp(x, 350, 4200)
    y = np.tanh(y * 2.2) / np.tanh(2.2)
    return reverb(y, 0.25, 1.2)[: len(x)]


def door_chime() -> np.ndarray:
    return reverb(place(1.6, [(0, glock(note(88), 1.2), 1), (0.32, glock(note(84), 1.3), 1)]), 0.3, 1.0)


def groan(f0: float, d: float = 1.3) -> np.ndarray:
    """One zombie groan: rough low voice, slow wobble, mouth formant."""
    x = t(d)
    f = f0 * (1 + 0.08 * np.sin(2 * np.pi * 3.1 * x)) * (1 - 0.15 * x / d)
    ph = 2 * np.pi * np.cumsum(f) / SR
    src = ((ph / (2 * np.pi)) % 1.0 - 0.5) + 0.25 * noise(d)
    voc = bp(src, 280, 900) + 0.5 * bp(src, 1100, 1800)
    shape = np.sin(np.pi * np.clip(x / d, 0, 1)) ** 1.5
    return voc * shape


def groans(sec: float = 6.0, n: int = 9) -> np.ndarray:
    return reverb(place(sec, [(rng.uniform(0, sec - 1.4), groan(rng.uniform(80, 130), rng.uniform(1.0, 1.6)), rng.uniform(0.5, 1)) for _ in range(n)]), 0.45, 1.8)


def glass_thuds() -> np.ndarray:
    hit = lambda: place(0.3, [(0, thump(110, 0.3), 1), (0, bp(noise(0.12), 900, 5000) * env(int(0.12 * SR), 0.001, 0.03), 0.6)])
    return reverb(place(2.4, [(i * 0.27 + rng.uniform(-0.04, 0.04), hit(), rng.uniform(0.6, 1)) for i in range(8)]), 0.3, 1.0)


def glass_crack() -> np.ndarray:
    d = 0.9
    return place(d, [(i * 0.025, bp(noise(0.03), 3000, 11000) * env(int(0.03 * SR), 0.0003, 0.006), rng.uniform(0.3, 1)) for i in range(26)])


def bark() -> np.ndarray:
    def one(f0):
        d = 0.2
        x = t(d)
        f = f0 * (1.25 - 0.45 * x / d)
        ph = 2 * np.pi * np.cumsum(f) / SR
        src = ((ph / (2 * np.pi)) % 1.0 - 0.5) + 0.3 * noise(d)
        return (bp(src, 500, 2200) + 0.4 * bp(src, 2500, 4000)) * env(len(x), 0.004, 0.07)
    return reverb(place(1.0, [(0, one(420), 1), (0.32, one(390), 0.9)]), 0.25, 0.8)


def growl() -> np.ndarray:
    d = 1.4
    x = t(d)
    rough = (1 + 0.6 * np.sin(2 * np.pi * 28 * x)) * bp(noise(d), 120, 700)
    return rough * np.clip(x / 0.15, 0, 1) * np.clip((d - x) / 0.3, 0, 1)


def feedback_squeal() -> np.ndarray:
    d = 1.3
    x = t(d)
    y = np.sin(2 * np.pi * (3100 + 40 * np.sin(2 * np.pi * 6 * x)) * x)
    return y * np.clip(x / 0.5, 0, 1) ** 2 * np.clip((d - x) / 0.12, 0, 1) * 0.6


def lock_clunk() -> np.ndarray:
    return reverb(place(0.8, [(0, bp(noise(0.05), 1500, 6000) * env(int(0.05 * SR), 0.0005, 0.01), 0.8), (0.05, thump(90, 0.3), 1)]), 0.25, 0.8)


def freezer_hum(sec: float = 8.0) -> np.ndarray:
    x = t(sec)
    return (np.sin(2 * np.pi * 60 * x) * 0.4 + np.sin(2 * np.pi * 120 * x) * 0.2 + lp(noise(sec), 300) * 0.5) * np.minimum(1, np.minimum(x / 0.5, (sec - x) / 0.5))


# ---------- Part 2 ----------
def warped(x: np.ndarray) -> np.ndarray:
    """Dying-generator version of the jingle: pitch sags and wobbles, with stutter dropouts."""
    n = len(x)
    tt = np.arange(n) / SR
    rate = 0.93 + 0.05 * np.sin(2 * np.pi * 0.35 * tt) + 0.02 * np.sin(2 * np.pi * 3.1 * tt)
    pos = np.cumsum(rate)
    pos = pos[pos < n - 1]
    y = np.interp(pos, np.arange(n), x)
    gate = np.ones_like(y)
    for st0 in np.arange(1.5, len(y) / SR, 2.3):
        a, b = int(st0 * SR), int((st0 + 0.18) * SR)
        gate[a:b] = 0.05
    return lp(y * lp(gate, 40), 3500)


def radio_static(sec: float = 6.0) -> np.ndarray:
    x = t(sec)
    hiss = bp(noise(sec), 1000, 5000) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.7 * x))
    crackle = place(sec, [(rng.uniform(0, sec - 0.05), bp(noise(0.03), 2000, 8000) * env(int(0.03 * SR), 0.0005, 0.006), rng.uniform(0.5, 1.4)) for _ in range(40)])
    return (hiss * 0.5 + crackle) * np.minimum(1, np.minimum(x / 0.2, (sec - x) / 0.3))


def generator_cough() -> np.ndarray:
    d = 3.0
    x = t(d)
    rpm = 22 * np.clip(1 - x / 2.6, 0.05, 1) * (1 + 0.25 * np.sin(2 * np.pi * 1.7 * x))
    ph = 2 * np.pi * np.cumsum(rpm) / SR
    engine = lp(np.sign(np.sin(ph)) * (0.6 + 0.4 * noise(d)), 300)
    return reverb(engine * np.clip((2.8 - x) / 0.4, 0, 1), 0.25, 1.0)


def shutter(up: bool = True) -> np.ndarray:
    d = 2.2
    x = t(d)
    clacks = place(d, [(i * 0.07, bp(noise(0.05), 600, 4000) * env(int(0.05 * SR), 0.001, 0.02), 0.5 + 0.3 * (i % 2)) for i in range(28)])
    rumble = lp(noise(d), 250) * 0.6
    y = (clacks + rumble) * np.clip(x / 0.1, 0, 1) * np.clip((2.0 - x) / 0.2, 0, 1)
    return reverb(y + place(d, [(2.0, thump(60, 0.4), 1.0)]), 0.3, 1.2)


def wind(sec: float = 10.0) -> np.ndarray:
    x = t(sec)
    return bp(noise(sec), 200, 1400) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.13 * x) ** 2) * np.minimum(1, np.minimum(x / 1.0, (sec - x) / 1.0))


def scuff() -> np.ndarray:
    return place(2.0, [(i * 0.42, bp(noise(0.25), 300, 3000) * env(int(0.25 * SR), 0.03, 0.08), 0.8) for i in range(4)])


if __name__ == "__main__":
    j = jingle(2)
    save("music", "fc-jingle", j, 0.8)
    save("music", "fc-jingle-pa", pa(j), 0.8)
    for name, fn in [("fc-door-chime", door_chime), ("fc-groans", groans), ("fc-glass-thuds", glass_thuds), ("fc-glass-crack", glass_crack),
                     ("fc-bark", bark), ("fc-growl", growl), ("fc-feedback", feedback_squeal), ("fc-lock", lock_clunk), ("fc-freezer-hum", freezer_hum)]:
        save("sfx", name, fn())
    save("sfx", "fc-groan-1", groan(95, 1.5))
    save("music", "fc-jingle-warped", warped(pa(j)), 0.8)
    for name, fn in [("fc-radio-static", radio_static), ("fc-generator", generator_cough), ("fc-shutter", shutter), ("fc-wind", wind), ("fc-scuff", scuff)]:
        save("sfx", name, fn())
