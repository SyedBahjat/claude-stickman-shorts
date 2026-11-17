"""Original synthesized music bed + SFX for SILENCE PROTOCOL (no library audio, no copyright claims).

    python scripts/audio/silence_audio.py

Reuses the helpers from decide_sfx.py. Writes public/audio/{music,sfx}/sp-*.wav (44.1 kHz mono).
"""
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from decide_sfx import SR, bp, env, hp, lp, noise, place, reverb, save, t, thump  # noqa: E402

rng = np.random.default_rng(11)


def fade(y, a=0.01, r=0.05):
    n = len(y)
    g = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na:
        g[:na] = np.linspace(0, 1, na)
    if nr:
        g[-nr:] *= np.linspace(1, 0, nr)
    return y * g


def bed(sec=95.0):
    """Dark cinematic pad: A minor cluster (A1, E2, C3, B3 ghost) with slow filter breathing,
    a sub pulse at 64 bpm and a faint high glassy tone. Constant level; the mix shapes it."""
    x = t(sec)
    pad = np.zeros_like(x)
    for f, g in ((55.0, 1.0), (82.4, 0.7), (130.8, 0.35), (164.8, 0.25), (246.9, 0.08)):
        for det in (-0.6, 0.0, 0.7):
            ph = rng.uniform(0, 2 * np.pi)
            pad += g * np.sign(np.sin(2 * np.pi * (f + det) * x + ph)) * 0.25 + g * np.sin(2 * np.pi * (f + det) * x + ph)
    breathe = 0.6 + 0.4 * np.sin(2 * np.pi * x / 11.0) ** 2
    pad = lp(pad, 420) * breathe
    beat = 60 / 64
    pulse = np.zeros_like(x)
    k = thump(46, 0.5)
    for i in range(int(sec / beat)):
        s = int(i * beat * SR)
        n = min(len(k), len(x) - s)
        pulse[s : s + n] += k[:n] * (1.0 if i % 2 == 0 else 0.55)
    glass = np.sin(2 * np.pi * 1760 * x + 3 * np.sin(2 * np.pi * 0.2 * x)) * (0.5 + 0.5 * np.sin(2 * np.pi * x / 17)) * 0.02
    air = lp(hp(noise(sec), 300), 1200) * 0.05
    y = pad / np.abs(pad).max() + 0.55 * pulse / np.abs(pulse).max() + glass + air
    return fade(reverb(y, 0.25, 2.5)[: len(x)], 2.0, 3.0)


def static_burst():
    """TV interruption: white-noise burst with 50 Hz buzz, choppy gate."""
    d = 0.9
    x = t(d)
    gate = (np.sin(2 * np.pi * 23 * x) > -0.3).astype(float)
    y = hp(noise(d), 800) * 0.6 * gate + np.sign(np.sin(2 * np.pi * 50 * x)) * 0.25
    return fade(y * env(len(x), 0.002, 0.5), 0.002, 0.08)


def ews():
    """Emergency broadcast attention tone (853 + 960 Hz), 2.2 s."""
    d = 2.2
    x = t(d)
    y = np.sin(2 * np.pi * 853 * x) + np.sin(2 * np.pi * 960 * x)
    return fade(y * 0.5, 0.01, 0.1)


def dig():
    """Excavation: deep engine growl, dirt scrapes and falling soil."""
    d = 2.2
    x = t(d)
    eng = lp(np.sign(np.sin(2 * np.pi * (38 + 4 * np.sin(2 * np.pi * 3 * x)) * x)), 300) * 0.6
    scrape = bp(noise(d), 300, 2500) * (0.5 + 0.5 * np.sin(2 * np.pi * 1.5 * x) ** 2) * 0.5
    soil = lp(noise(d), 900) * env(len(x), 0.3, 1.2) * 0.6
    return fade(eng + scrape + soil, 0.05, 0.4)


def pour():
    """Concrete pour: thick slurry rush + rebar clanks."""
    d = 2.0
    slurry = lp(noise(d), 500) * (0.7 + 0.3 * np.sin(2 * np.pi * 7 * t(d)))
    clank = lambda f: (np.sin(2 * np.pi * f * t(0.4)) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t(0.4))) * env(int(0.4 * SR), 0.001, 0.08)
    return fade(place(d, [(0, slurry, 0.7), (0.1, clank(820), 0.5), (0.5, clank(910), 0.4), (0.9, clank(760), 0.45)]), 0.05, 0.4)


def drill():
    """Two impact-driver bursts + panel thud (insulation going in)."""
    d = 1.6
    def burst(dd):
        x = t(dd)
        return (np.sign(np.sin(2 * np.pi * 180 * x)) * 0.4 + bp(noise(dd), 1500, 5000) * 0.4) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 28 * x)))
    return fade(place(d, [(0, burst(0.35), 0.6), (0.55, thump(110, 0.25), 0.9), (0.85, burst(0.4), 0.6)]), 0.005, 0.1)


def door_clunk():
    """Two heavy airlock doors closing, one after the other."""
    one = lambda: place(0.9, [(0, thump(48, 0.6), 1.3), (0, bp(noise(0.2), 300, 3000) * env(int(0.2 * SR), 0.001, 0.05), 0.6), (0.25, thump(140, 0.15), 0.5)])
    return reverb(place(2.2, [(0, one(), 1), (0.9, one(), 1)]), 0.4, 1.6)


def fan():
    """Smooth ventilation fan spinning up, airy and quiet."""
    d = 2.2
    x = t(d)
    spin = np.clip(x / 0.8, 0, 1)
    whir = np.sin(2 * np.pi * np.cumsum(40 + 60 * spin) / SR) * 0.3
    air = bp(noise(d), 400, 3000) * spin * 0.5
    return fade(whir + air, 0.05, 0.5)


def power_up():
    """Battery bank power-up: rising whine + relay clicks + hum."""
    d = 1.8
    x = t(d)
    whine = np.sin(2 * np.pi * np.cumsum(200 + 900 * np.clip(x / 1.0, 0, 1)) / SR) * 0.25 * np.clip(x / 0.2, 0, 1)
    hum = (np.sin(2 * np.pi * 100 * x) + 0.4 * np.sin(2 * np.pi * 200 * x)) * np.clip((x - 0.8) / 0.3, 0, 1) * 0.35
    click = bp(noise(0.03), 2000, 8000) * env(int(0.03 * SR), 0.0005, 0.006)
    return fade(place(d, [(0, whine + hum, 1), (0.2, click, 0.8), (0.5, click, 0.8), (0.8, click, 0.8)]), 0.01, 0.4)


def water_fill():
    """Water rushing into a tank, low gurgle with bubbles."""
    d = 2.0
    x = t(d)
    rush = bp(noise(d), 200, 1400) * (0.8 + 0.2 * np.sin(2 * np.pi * 5 * x))
    bub = np.zeros_like(x)
    for _ in range(26):
        s = rng.uniform(0, d - 0.06)
        f = rng.uniform(300, 900)
        bb = np.sin(2 * np.pi * np.cumsum(np.linspace(f, f * 1.6, int(0.05 * SR))) / SR) * env(int(0.05 * SR), 0.002, 0.015)
        i = int(s * SR)
        bub[i : i + len(bb)] += bb * 0.4
    return fade(rush * 0.6 + bub, 0.1, 0.4)


def stack():
    """Cans and boxes being stacked on shelves."""
    can = lambda f: (np.sin(2 * np.pi * f * t(0.18)) + 0.6 * np.sin(2 * np.pi * f * 2.4 * t(0.18))) * env(int(0.18 * SR), 0.001, 0.04)
    ev = [(i * 0.17, can(rng.uniform(1300, 2100)), 0.4) for i in range(8)] + [(0.7, thump(130, 0.2), 0.6), (1.2, thump(120, 0.2), 0.6)]
    return fade(place(1.6, ev), 0.002, 0.1)


def buy():
    """Purchase confirmation: two quick digital blips + a bright chime."""
    blip = lambda f: np.sin(2 * np.pi * f * t(0.06)) * env(int(0.06 * SR), 0.001, 0.03)
    x = t(0.6)
    chime = (np.sin(2 * np.pi * 1568 * x) + 0.5 * np.sin(2 * np.pi * 2349 * x)) * env(len(x), 0.002, 0.18)
    return place(0.7, [(0, blip(1200), 0.5), (0.07, blip(1600), 0.5), (0.13, chime, 0.6)])


def count():
    """Rolling digital counter: fast ticks slowing down."""
    tk = bp(noise(0.02), 2500, 7000) * env(int(0.02 * SR), 0.0005, 0.004)
    times, at, gap = [], 0.0, 0.03
    while at < 0.9:
        times.append(at)
        at += gap
        gap *= 1.07
    return place(1.0, [(a, tk, 0.6) for a in times])


def typing():
    """Silent-ish terminal text printing (soft clicks), 2.5 s."""
    tk = bp(noise(0.015), 1800, 5000) * env(int(0.015 * SR), 0.0005, 0.004)
    ev, at = [], 0.0
    while at < 2.4:
        ev.append((at, tk, rng.uniform(0.3, 0.6)))
        at += rng.uniform(0.04, 0.11)
    return place(2.5, ev)


def glitch():
    """Digital glitch stutter."""
    d = 0.7
    y = np.zeros(int(d * SR))
    for i in range(9):
        s = int(rng.uniform(0, d - 0.06) * SR)
        f = rng.choice([110, 220, 440, 1760, 3520])
        seg = np.sign(np.sin(2 * np.pi * f * t(0.05))) * 0.5 + hp(noise(0.05), 3000) * 0.5
        y[s : s + len(seg)] += seg
    return fade(y, 0.002, 0.05)


def riser():
    """Horror riser: noise + dissonant tones climbing into the rule card."""
    d = 2.2
    x = t(d)
    g = (x / d) ** 2
    tones = sum(np.sin(2 * np.pi * np.cumsum(f * (1 + 1.5 * (x / d) ** 2)) / SR) for f in (220, 233, 311))
    return fade((tones * 0.3 + hp(noise(d), 1500) * 0.5) * g, 0.01, 0.02)


def sting():
    """Rule card hit: sub boom + metallic dissonant scrape + ringing cluster."""
    d = 4.0
    x = t(d)
    cluster = sum(np.sin(2 * np.pi * f * x) for f in (311, 329.6, 466, 493.9, 987.8)) * env(len(x), 0.002, 1.2) * 0.25
    scrape = bp(noise(d), 2000, 6000) * env(len(x), 0.001, 0.4) * 0.4
    boom = thump(38, 1.6) * 1.4
    return reverb(place(d, [(0, boom, 1), (0, cluster + scrape, 1)]), 0.45, 2.5)[: int(d * SR)]


def field():
    """Silent Field: glassy rising shimmer, a soft low 'whump', then a muffled hollow tail."""
    d = 2.6
    x = t(d)
    rise = np.clip(x / 0.9, 0, 1)
    shimmer = sum(np.sin(2 * np.pi * np.cumsum(f * (0.6 + 0.6 * rise)) / SR) for f in (880, 1320, 1975)) * rise * (x < 1.0) * 0.25
    whump = place(d, [(0.95, thump(55, 1.2), 1.4)])
    tail = lp(noise(d), 300) * np.clip((x - 1.0) / 0.2, 0, 1) * np.exp(-(x - 1.0).clip(0) / 0.8) * 0.4
    return fade(reverb(shimmer + whump + tail, 0.35, 1.8)[: len(x)], 0.01, 0.3)


def rotor():
    """Ghost Echo drone: rotor buzz spinning up, holding, passing by."""
    d = 3.2
    x = t(d)
    spin = np.clip(x / 0.6, 0, 1)
    f = 95 + 40 * spin
    blade = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.25 + np.sin(2 * np.pi * np.cumsum(f * 2) / SR) * 0.3
    am = 0.75 + 0.25 * np.sin(2 * np.pi * 31 * x)
    air = bp(noise(d), 500, 4000) * 0.2
    return fade(lp(blade * am + air, 3500) * spin, 0.02, 0.6)


def echo_voice():
    """Artificial 'infected voice' broadcast from the drone: wordless formant warble, distant + metallic."""
    d = 2.6
    x = t(d)
    f0 = 118 + 25 * np.sin(2 * np.pi * 0.7 * x) + 8 * np.sin(2 * np.pi * 6 * x)
    src = np.zeros_like(x)
    ph = np.cumsum(f0) / SR
    for h in range(1, 30):
        src += np.sin(2 * np.pi * h * ph) / h
    vowel = np.sin(2 * np.pi * 1.3 * x)
    y = bp(src, 300, 900) * (0.6 + 0.4 * vowel) + bp(src, 1100, 2600) * (0.6 - 0.4 * vowel)
    syll = (np.sin(2 * np.pi * 3.1 * x) > -0.2).astype(float)
    y = lp(y * syll, 2400)
    return fade(reverb(y, 0.5, 1.5)[: len(x)], 0.05, 0.4)


def platform_on():
    """Display platform lighting up: relay clack + rising hum."""
    d = 1.4
    x = t(d)
    hum = (np.sin(2 * np.pi * 60 * x) + 0.5 * np.sin(2 * np.pi * 120 * x) + 0.2 * np.sin(2 * np.pi * 240 * x)) * np.clip(x / 0.4, 0, 1) * 0.4
    return fade(place(d, [(0, thump(160, 0.12), 0.9), (0.02, hum, 1)]), 0.002, 0.5)


def alarm():
    """Bunker proximity alarm: low two-tone pulse."""
    d = 2.0
    x = t(d)
    f = np.where((x * 2.5) % 1 < 0.5, 440, 392)
    y = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * ((x * 2.5) % 0.5 < 0.4)
    return fade(lp(y, 1800) * 0.5, 0.01, 0.2)


if __name__ == "__main__":
    save("music", "sp-bed", bed(), 0.8)
    for name, fn in [("sp-static", static_burst), ("sp-ews", ews), ("sp-dig", dig), ("sp-pour", pour), ("sp-drill", drill),
                     ("sp-doors", door_clunk), ("sp-fan", fan), ("sp-power", power_up), ("sp-water", water_fill),
                     ("sp-stack", stack), ("sp-buy", buy), ("sp-count", count), ("sp-type", typing), ("sp-glitch", glitch),
                     ("sp-riser", riser), ("sp-sting", sting), ("sp-field", field), ("sp-rotor", rotor),
                     ("sp-echo-voice", echo_voice), ("sp-platform", platform_on), ("sp-alarm", alarm)]:
        save("sfx", name, fn())
