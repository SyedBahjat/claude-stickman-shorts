"""Original synthesized drone + SFX for stick-figure shorts (no library audio, no copyright claims).

    python scripts/audio/decide_sfx.py [drone_seconds]

Writes public/audio/{music,sfx}/*.wav (44.1 kHz mono).
"""
import sys
import wave
from pathlib import Path

import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
ROOT = Path(__file__).resolve().parents[2] / "public/audio"
rng = np.random.default_rng(7)


def t(sec):
    return np.arange(int(sec * SR)) / SR


def lp(x, hz, order=4):
    return sosfilt(butter(order, hz, "low", fs=SR, output="sos"), x)


def hp(x, hz, order=4):
    return sosfilt(butter(order, hz, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=4):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def env(n, a=0.005, r=0.2):
    """Attack then exponential release, n samples."""
    e = np.exp(-np.arange(n) / SR / r)
    na = max(1, int(a * SR))
    e[:na] *= np.linspace(0, 1, na)
    return e


def noise(sec):
    return rng.standard_normal(int(sec * SR))


def reverb(x, wet=0.3, length=1.2):
    ir = noise(length) * np.exp(-t(length) / (length / 5))
    y = np.convolve(x, lp(ir, 5000))[: len(x) + int(length * SR)]
    y /= np.abs(y).max() + 1e-9
    out = np.zeros_like(y)
    out[: len(x)] += x / (np.abs(x).max() + 1e-9)
    return (1 - wet) * out + wet * y


def save(sub, name, x, peak=0.9):
    x = x / (np.abs(x).max() + 1e-9) * peak
    p = ROOT / sub / f"{name}.wav"
    p.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(p), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
    print("wrote", p.relative_to(ROOT.parents[2]))


def drone(sec):
    """Dark low pad: detuned saws at A1/E2 through a 180 Hz lowpass, slow swell + pulse."""
    x = t(sec)
    pad = sum(
        ((f * x) % 1.0 - 0.5) for f in (55.0, 55.4, 82.4, 54.6, 110.2)
    )
    pad = lp(pad, 180)
    swell = 0.75 + 0.25 * np.sin(2 * np.pi * 0.07 * x)
    pulse = 0.85 + 0.15 * np.sin(2 * np.pi * 0.5 * x) ** 8  # slow heartbeat-ish throb
    air = lp(noise(sec), 400) * 0.15
    y = (pad * swell * pulse + air)
    fade = np.minimum(1, np.minimum(x / 2, (sec - x) / 2))
    return y * fade


def sirens(sec):
    """Two distant air-raid sirens sweeping ~600-1000 Hz, detuned and out of phase."""
    x = t(sec)
    y = np.zeros_like(x)
    for period, phase, lo, hi in ((5.2, 0.0, 600, 980), (6.1, 2.1, 640, 1020)):
        sweep = 0.5 - 0.5 * np.cos(2 * np.pi * (x + phase) / period)
        f = lo + (hi - lo) * sweep
        ph = 2 * np.pi * np.cumsum(f) / SR
        y += np.sin(ph) + 0.3 * np.sin(2 * ph) + 0.12 * np.sin(3 * ph)
    y = bp(y, 400, 2500)
    y = reverb(y, wet=0.55, length=2.0)[: len(x)]
    fade = np.minimum(1, np.minimum(x / 1.5, (sec - x) / 3))
    return y * fade


def thump(freq=70, dur=0.35):
    x = t(dur)
    body = np.sin(2 * np.pi * freq * x * (1 - 0.4 * x)) * env(len(x), 0.002, 0.08)
    knock = lp(noise(dur), 900) * env(len(x), 0.001, 0.025)
    return body + 0.6 * knock


def place(total, events):
    y = np.zeros(int(total * SR))
    for at, clip, g in events:
        i = max(0, int(at * SR))
        n = min(len(clip), len(y) - i)
        y[i : i + n] += clip[:n] * g
    return y


def door_pound():
    return reverb(place(1.9, [(0.0, thump(), 1), (0.38, thump(66), 0.9), (0.74, thump(72), 1), (1.25, thump(64), 1.1)]), 0.25, 0.8)


def phone_buzz():
    def buzz(d):
        x = t(d)
        s = np.sign(np.sin(2 * np.pi * 150 * x)) * (1 + 0.3 * np.sin(2 * np.pi * 31 * x))
        return lp(s, 1200) * np.minimum(1, np.minimum(x / 0.01, (d - x) / 0.02))
    return place(1.0, [(0.0, buzz(0.32), 1), (0.45, buzz(0.32), 1)])


def ding():
    def tone(f, d):
        x = t(d)
        return (np.sin(2 * np.pi * f * x) + 0.25 * np.sin(2 * np.pi * 2 * f * x)) * env(len(x), 0.003, 0.25)
    return reverb(place(1.2, [(0, tone(1318.5, 0.9), 0.8), (0.12, tone(1760, 0.9), 0.7)]), 0.2, 0.6)


def tv_on():
    x = t(1.4)
    pop = lp(noise(1.4), 3000) * env(len(x), 0.001, 0.04)
    static = bp(noise(1.4), 1500, 7000) * env(len(x), 0.01, 0.25) * 0.5
    hum = (np.sin(2 * np.pi * 60 * x) + 0.5 * np.sin(2 * np.pi * 120 * x)) * np.minimum(1, x / 0.1) * np.minimum(1, (1.4 - x) / 0.4) * 0.25
    return pop + static + hum


def alert_beeps():
    """Emergency-broadcast style two-tone beeps (853 + 960 Hz)."""
    x = t(0.5)
    b = (np.sin(2 * np.pi * 853 * x) + np.sin(2 * np.pi * 960 * x)) * np.minimum(1, np.minimum(x / 0.01, (0.5 - x) / 0.01))
    return place(2.0, [(0, b, 1), (0.7, b, 1), (1.4, b, 0.001)])


def footsteps(n=10, gap=0.2):
    def step():
        d = 0.12
        x = t(d)
        return lp(noise(d), 2500) * env(len(x), 0.001, 0.02) + 0.5 * np.sin(2 * np.pi * 110 * x) * env(len(x), 0.001, 0.04)
    return reverb(place(n * gap + 0.4, [(i * gap + rng.uniform(-0.02, 0.02), step(), rng.uniform(0.7, 1)) for i in range(n)]), 0.3, 1.0)


def hatch():
    """Metal scrape into a heavy clang + latch."""
    d = 2.4
    x = t(d)
    scrape = bp(noise(d), 700, 3500) * (1 + 0.6 * np.sin(2 * np.pi * 23 * x)) * np.clip((x - 0.0) / 0.2, 0, 1) * np.clip((1.1 - x) / 0.2, 0, 1) * 0.35
    ct = t(1.3)
    clang = sum(np.sin(2 * np.pi * f * ct) * a for f, a in ((180, 1), (347, 0.6), (523, 0.45), (911, 0.3), (1460, 0.2))) * env(len(ct), 0.001, 0.35)
    clang[: int(0.5 * SR)] += thump(55, 0.5) * 1.2
    latch = lp(noise(0.08), 4000) * env(int(0.08 * SR), 0.001, 0.01)
    return reverb(place(d, [(0, scrape, 1), (1.05, clang, 1), (1.7, latch, 0.6)]), 0.35, 1.5)


def card_slam():
    d = 0.6
    x = t(d)
    whoosh = bp(noise(d), 200, 1500) * np.clip(x / 0.12, 0, 1) * np.clip((0.2 - x) / 0.08, 0, 1)
    hit = thump(90, 0.3) * 0.9
    paper = bp(noise(0.15), 1500, 6000) * env(int(0.15 * SR), 0.001, 0.03) * 0.5
    return place(d, [(0, whoosh, 0.5), (0.16, hit, 1), (0.16, paper, 1)])


def whoosh():
    d = 0.5
    x = t(d)
    n = noise(d)
    y = np.zeros_like(n)
    # crude sweeping band: mix three fixed bands with moving weights
    for lo, hi, c in ((150, 600, 0.0), (500, 1500, 0.5), (1200, 4000, 1.0)):
        w = np.exp(-((x / d - c) ** 2) / 0.08)
        y += bp(n, lo, hi) * w
    return y * np.sin(np.pi * x / d) ** 2


def heartbeat():
    return place(1.1, [(0, thump(48, 0.3), 1), (0.24, thump(44, 0.3), 0.7)])


def tick():
    d = 0.05
    return bp(noise(d), 2000, 6000) * env(int(d * SR), 0.0005, 0.008)


def sub_hit():
    """Low cinematic boom for reveals ('He knew.')."""
    d = 3.0
    x = t(d)
    y = np.sin(2 * np.pi * (45 * x - 6 * x * x)) * env(len(x), 0.005, 0.9) + lp(noise(d), 200) * env(len(x), 0.002, 0.5) * 0.5
    return reverb(y, 0.3, 2.0)


# ---------- Last Train set ----------
def train_rumble(sec=12.0):
    """Moving subway car: low wheel rumble + rail clacks every ~0.9 s (loops)."""
    x = t(sec)
    body = lp(noise(sec), 140) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.3 * x))
    whine = np.sin(2 * np.pi * 310 * x) * 0.04 + np.sin(2 * np.pi * 620 * x) * 0.015
    clacks = place(sec, [(i * 0.9 + 0.12 * (i % 2), thump(85, 0.18), 0.5) for i in range(int(sec / 0.9))])
    return body + whine + clacks


def brake_screech():
    """Long metal-on-metal squeal falling in pitch, then the car settles."""
    d = 3.2
    x = t(d)
    f = 2400 - 900 * (x / d) + 60 * np.sin(2 * np.pi * 9 * x)
    ph = 2 * np.pi * np.cumsum(f) / SR
    squeal = (np.sin(ph) + 0.4 * np.sin(1.5 * ph)) * np.clip(x / 0.15, 0, 1) * np.clip((2.6 - x) / 0.5, 0, 1)
    grind = bp(noise(d), 300, 1800) * np.clip((2.6 - x) / 2.6, 0, 1) * 0.6
    return reverb(squeal * 0.5 + grind + place(d, [(2.55, thump(60, 0.6), 1.2)]), 0.3, 1.4)


def alert_chorus():
    """Many phones going off at once, staggered and detuned."""
    d = 3.5
    x = t(1.2)
    events = []
    for i in range(9):
        detune = 1 + (i - 4) * 0.012
        tone = (np.sin(2 * np.pi * 853 * detune * x) + np.sin(2 * np.pi * 960 * detune * x)) * (np.sin(2 * np.pi * 4 * x) > 0)
        events.append((i * 0.18, tone * np.clip((1.2 - x) / 0.1, 0, 1), 0.6 + 0.4 * ((i * 7) % 3) / 2))
    return reverb(place(d, events), 0.25, 1.0)


def crank():
    """Ratcheting manual door release + pneumatic hiss as the door gives."""
    d = 2.6
    clicks = [(i * 0.13, lp(noise(0.03), 5000) * env(int(0.03 * SR), 0.0005, 0.006), 1.0) for i in range(12)]
    x = t(1.0)
    hiss = bp(noise(1.0), 2500, 9000) * np.clip(x / 0.05, 0, 1) * np.exp(-x / 0.45)
    return reverb(place(d, clicks + [(1.6, hiss, 0.8), (1.6, thump(70, 0.4), 0.6)]), 0.25, 0.8)


def murmur(sec=4.0):
    """Panicked crowd under the voice: band-limited babble swells."""
    x = t(sec)
    babble = sum(bp(noise(sec), 250 + 90 * k, 900 + 120 * k) * (0.5 + 0.5 * np.sin(2 * np.pi * (0.7 + 0.3 * k) * x + k)) for k in range(5))
    return babble * np.minimum(1, np.minimum(x / 0.4, (sec - x) / 0.8))


def light_buzz():
    """Failing fluorescent tube: 100 Hz buzz with dropouts."""
    d = 1.6
    x = t(d)
    gate = (np.sin(2 * np.pi * 7 * x) + np.sin(2 * np.pi * 3.1 * x) > -0.3).astype(float)
    return (np.sign(np.sin(2 * np.pi * 100 * x)) * 0.3 + bp(noise(d), 2000, 6000) * 0.2) * lp(gate, 80) * np.minimum(1, (d - x) / 0.3)


def sparks():
    d = 1.2
    return place(d, [(i * 0.07, bp(noise(0.04), 3000, 9000) * env(int(0.04 * SR), 0.0005, 0.01), 0.5 + 0.5 * (i % 3) / 2) for i in range(14)])


# ---------- Last Train part 2B ----------
def gravel_steps(n=12, gap=0.32):
    """Footsteps crunching on track ballast."""
    def step():
        d = 0.22
        return bp(noise(d), 600, 5000) * env(int(d * SR), 0.003, 0.05) + lp(noise(d), 300) * env(int(d * SR), 0.002, 0.03) * 0.6
    return reverb(place(n * gap + 0.5, [(i * gap + 0.02 * (i % 3), step(), 0.7 + 0.3 * ((i * 5) % 3) / 2) for i in range(n)]), 0.35, 1.2)


def rat_squeaks():
    d = 1.4
    def sq(f):
        x = t(0.09)
        return np.sin(2 * np.pi * (f + 1800 * x) * x) * env(len(x), 0.004, 0.03)
    return reverb(place(d, [(0.0, sq(3200), 1), (0.16, sq(3600), 0.8), (0.5, sq(3000), 0.7), (0.62, sq(3900), 0.6), (0.9, gravel_steps(3, 0.08)[: int(0.4 * SR)], 0.4)]), 0.4, 1.0)


def keypad():
    """Six keypad beeps then a heavy lock clunk."""
    x = t(0.09)
    beep = lambda f: np.sin(2 * np.pi * f * x) * np.clip((0.09 - x) / 0.01, 0, 1) * np.clip(x / 0.004, 0, 1)
    tones = [1209, 1336, 1477, 1209, 1336, 1477]
    events = [(i * 0.16, beep(f), 0.6) for i, f in enumerate(tones)]
    events += [(1.15, thump(60, 0.5), 1.4), (1.15, bp(noise(0.12), 800, 4000) * env(int(0.12 * SR), 0.001, 0.03), 0.8)]
    return reverb(place(2.0, events), 0.3, 1.0)


def receiver():
    """Old phone handset lifted, rotary-ish clicks, put back down."""
    clack = lambda: lp(noise(0.06), 3000) * env(int(0.06 * SR), 0.001, 0.012)
    events = [(0.0, clack(), 1)] + [(0.35 + i * 0.07, clack(), 0.35) for i in range(7)] + [(2.6, clack(), 1.1), (2.62, thump(110, 0.2), 0.5)]
    return reverb(place(3.0, events), 0.25, 0.8)


def rifle_cock():
    d = 0.8
    slide = bp(noise(0.12), 1500, 7000) * env(int(0.12 * SR), 0.002, 0.03)
    snap = bp(noise(0.05), 2500, 9000) * env(int(0.05 * SR), 0.0005, 0.008)
    return reverb(place(d, [(0.0, slide, 0.8), (0.18, snap, 1.2), (0.2, thump(160, 0.12), 0.5)]), 0.3, 0.8)


def blast_hum(sec=6.0):
    """Deep machine hum behind the blast door."""
    x = t(sec)
    y = np.sin(2 * np.pi * 50 * x) + 0.5 * np.sin(2 * np.pi * 100 * x) + 0.2 * np.sin(2 * np.pi * 150 * x)
    return lp(y + lp(noise(sec), 200) * 0.6, 400) * np.minimum(1, np.minimum(x / 0.8, (sec - x) / 0.8))


def sparkle():
    """Bright burst for the winning choice card."""
    d = 1.0
    x = t(d)
    tones = sum(np.sin(2 * np.pi * f * x) * np.exp(-x / (0.25 + 0.05 * k)) for k, f in enumerate([1568, 2093, 2637, 3136]))
    return reverb(tones * np.clip(x / 0.005, 0, 1) + bp(noise(d), 4000, 10000) * np.exp(-x / 0.12) * 0.4, 0.3, 1.0)


# ---------- Last Train part 3 ----------
def detonation():
    """Distant nuclear blast felt underground: white-noise crack, huge sub boom, 5 s rolling rumble."""
    d = 7.0
    x = t(d)
    crack = bp(noise(d), 800, 6000) * np.exp(-x / 0.25) * 0.7
    boom = np.sin(2 * np.pi * (38 * x - 2.2 * x * x)) * np.exp(-x / 2.2)
    rumble = lp(noise(d), 90) * 2.2 * np.exp(-x / 2.8) * np.clip(x / 0.05, 0, 1)
    return reverb(crack + boom + rumble, 0.35, 2.5)


def debris():
    """Dust and small chunks raining from the ceiling."""
    d = 3.0
    events = [(random_t, bp(noise(0.05), 1500, 8000) * env(int(0.05 * SR), 0.0005, 0.012), amp) for random_t, amp in zip(rng.uniform(0, 2.6, 40), rng.uniform(0.2, 1, 40))]
    hiss = bp(noise(d), 2000, 9000) * np.exp(-t(d) / 1.2) * 0.25
    return place(d, events) + hiss


def tinnitus():
    """Post-blast ear ringing: pure high tone fading in then out."""
    d = 4.0
    x = t(d)
    return np.sin(2 * np.pi * 4200 * x) * np.clip(x / 0.3, 0, 1) * np.clip((d - x) / 2.0, 0, 1) * 0.5


def hydraulic():
    """Blast door unlocking: deep clunks then long pneumatic hiss and grinding swing."""
    d = 3.0
    x = t(d)
    hiss = bp(noise(d), 1200, 7000) * np.clip((x - 0.5) / 0.1, 0, 1) * np.exp(-np.maximum(0, x - 0.5) / 1.0)
    grind = bp(noise(d), 120, 600) * np.clip((x - 0.8) / 0.4, 0, 1) * np.clip((2.8 - x) / 0.5, 0, 1) * 0.8
    return reverb(place(d, [(0, thump(55, 0.5), 1.2), (0.25, thump(60, 0.5), 1.0)]) + hiss * 0.6 + grind, 0.35, 1.5)


def seal_boom():
    """Blast door slamming shut and locking."""
    d = 2.5
    return reverb(place(d, [(0, thump(42, 1.0), 1.6), (0, bp(noise(0.3), 200, 2000) * env(int(0.3 * SR), 0.001, 0.08), 0.8), (0.55, thump(70, 0.4), 0.9)]), 0.45, 2.0)


def ending_swell(sec=9.0):
    """Soft minor-to-major pad swell for the ending card (D minor -> F major)."""
    x = t(sec)
    def chord(fs, a, b):
        g = np.clip((x - a) / 1.5, 0, 1) * np.clip((b - x) / 1.5, 0, 1)
        return sum(np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * 2 * f * x) for f in fs) * g
    y = chord([146.8, 174.6, 220.0], 0, 5.0) + chord([174.6, 220.0, 261.6, 349.2], 3.5, sec)
    return reverb(lp(y, 2500), 0.5, 3.0)


if __name__ == "__main__":
    drone_sec = float(sys.argv[1]) if len(sys.argv) > 1 else 90
    save("music", "drone", drone(drone_sec), 0.8)
    save("sfx", "sirens", sirens(48))
    save("sfx", "train-rumble", train_rumble())
    save("sfx", "murmur", murmur())
    for name, fn in [("door-pound", door_pound), ("phone-buzz", phone_buzz), ("ding", ding), ("tv-on", tv_on),
                     ("alert-beeps", alert_beeps), ("footsteps", footsteps), ("hatch", hatch), ("card-slam", card_slam),
                     ("whoosh", whoosh), ("heartbeat", heartbeat), ("tick", tick), ("sub-hit", sub_hit),
                     ("brake-screech", brake_screech), ("alert-chorus", alert_chorus), ("crank", crank),
                     ("light-buzz", light_buzz), ("sparks", sparks), ("gravel-steps", gravel_steps), ("rat-squeaks", rat_squeaks),
                     ("keypad", keypad), ("receiver", receiver), ("rifle-cock", rifle_cock), ("blast-hum", blast_hum), ("sparkle", sparkle), ("detonation", detonation), ("debris", debris),
                     ("tinnitus", tinnitus), ("hydraulic", hydraulic), ("seal-boom", seal_boom), ("ending-swell", ending_swell)]:
        save("sfx", name, fn())
