import { interpolate } from "remotion";

/**
 * Dialogue ducking for background beds (music, drone, hums, crowd groans).
 * `spans` = [startFrame, endFrame] of every voice line. Returns a gain multiplier:
 * 1 in the gaps, `depth` while someone speaks, with short ramps so it breathes naturally.
 * Rule (skills/stickman-shorts/references/AUDIO.md, mix levels): continuous beds sit ≥14 dB under the voice AND duck under it.
 */
export const makeDuck = (spans: [number, number][], depth = 0.35, ramp = 8) => (f: number) => {
  let g = 1;
  for (const [a, b] of spans) {
    if (f < a - ramp || f > b + ramp) continue;
    const inT = interpolate(f, [a - ramp, a], [1, depth], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const outT = interpolate(f, [b, b + ramp], [depth, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    g = Math.min(g, Math.max(inT, outT));
  }
  return g;
};
