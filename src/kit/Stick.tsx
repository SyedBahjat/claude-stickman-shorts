import React from "react";
import { C } from "./style";

/**
 * Stick-figure rig (flat SVG).
 * Angles in radians: 0 = hanging straight down, + = toward the facing direction.
 * Elbow/knee are relative bends: forearm = sh + el, shin = hip - knee.
 */
export type Limb = readonly [number, number];
export interface Pose {
  armF: Limb; // front arm (the RIGHT arm, carries the red band)
  armB: Limb;
  legF: Limb;
  legB: Limb;
  lean: number; // torso lean forward
  headTilt?: number;
}

export interface Look {
  body: string; // torso / limbs color
  limbs?: string; // arms color if different
  band?: boolean; // red forearm band (YOU)
  headlamp?: boolean;
  bun?: boolean;
  helmet?: boolean;
  cap?: string; // peaked uniform cap color
  hair?: string; // hair/bun color (default brown)
  glasses?: boolean;
  skin?: string; // head color (zombies: grey-green)
  blankEyes?: boolean; // white eyes, no pupils (zombies)
  shortHair?: string; // short hair cap color (June)
  tie?: string; // necktie color (Marco)
  flatCap?: string; // flat cap color (Walt)
  hearingAid?: boolean;
  hood?: string; // hoodie hood color (rim behind the head)
}

export const YOU: Look = { body: C.skin, band: true };
export const BUNKER_MAN: Look = { body: C.olive, headlamp: true };
export const MOM: Look = { body: C.momPurple, bun: true };
export const MAGS: Look = { body: "#2f3e5c", cap: "#232f47" };
export const ELI: Look = { body: "#4a4a4f", hood: "#3a3a3f" };
/** Background passengers: muted body colors, no accessories. */
export const RUTH: Look = { body: "#8c8c94", bun: true, hair: "#b9b6ae", glasses: true };
export const SOLDIER: Look = { body: "#4c5236", helmet: true };
export const JUNE: Look = { body: "#3f7a4a", shortHair: "#7a2e2a" };
export const MARCO: Look = { body: "#8fa9c2", tie: "#b3352b" };
export const WALT: Look = { body: "#cdbf9c", flatCap: "#6b5a44", hearingAid: true };
export const HALE: Look = { body: "#e4e9ec", glasses: true };
/** The Turned: grey-green skin, blank eyes, dull torn clothes (vary by index). */
export const TURNED: Look[] = ["#5d5a4f", "#4f5d66", "#6b4f4a", "#57604a", "#6a6358", "#4a4f5d"].map((body) => ({ body, skin: "#8e9a86", blankEyes: true }));
export const PASSENGERS: Look[] = ["#7a5a48", "#5f6f52", "#6b5f7a", "#8a7a5a", "#4f6670", "#7a4f4f"].map((body) => ({ body }));

const L = { thigh: 128, shin: 126, torso: 190, neck: 18, upper: 104, fore: 100, head: 68 };
const LIMB_W = 25;
const INK = 7;

export const STAND: Pose = { armF: [0.08, 0.05], armB: [-0.08, 0.05], legF: [0.06, 0], legB: [-0.06, 0], lean: 0 };

export const lerpPose = (a: Pose, b: Pose, t: number): Pose => {
  const m = (x: number, y: number) => x + (y - x) * t;
  const ml = (x: Limb, y: Limb): Limb => [m(x[0], y[0]), m(x[1], y[1])];
  return {
    armF: ml(a.armF, b.armF),
    armB: ml(a.armB, b.armB),
    legF: ml(a.legF, b.legF),
    legB: ml(a.legB, b.legB),
    lean: m(a.lean, b.lean),
    headTilt: m(a.headTilt ?? 0, b.headTilt ?? 0),
  };
};

const THIGH_SWING = 0.3; // rad at amp 1 — short, calm scissor steps calm and upright
const LEG_LEN = 254;

/**
 * Smooth walk cycle (phase in cycles). Legs stay nearly straight; only the leg swinging
 * forward softly bends its knee (peak at mid-swing), so the body glides instead of squatting.
 */
export const walk = (phase: number, amp = 1): Pose => {
  const a = phase * Math.PI * 2;
  const knee = (x: number) => 0.55 * amp * Math.max(0, Math.cos(x)) ** 2;
  return {
    legF: [THIGH_SWING * amp * Math.sin(a), knee(a)],
    legB: [THIGH_SWING * amp * Math.sin(a + Math.PI), knee(a + Math.PI)],
    armF: [-0.26 * amp * Math.sin(a), 0.18],
    armB: [0.26 * amp * Math.sin(a), 0.18],
    lean: 0.03 * amp,
  };
};

/** Ground distance covered by one walk cycle (two steps) — drive phase = distance / walkCycle(). */
export const walkCycle = (amp = 1, scale = 1) => 4 * LEG_LEN * Math.sin(THIGH_SWING * amp) * scale;

/**
 * Walk from x0 along dir, covering `dist` px. Amplitude eases to 0 over the last `settle` px
 * before `total` so the character comes to a natural stop with feet together.
 */
export const walkTo = (x0: number, dir: 1 | -1, dist: number, total: number, { amp = 1, scale = 1, settle = 70 } = {}) => {
  const fade = Math.max(0, Math.min(1, (total - dist) / settle));
  const a = amp * Math.sqrt(fade);
  return { x: x0 + dir * dist, pose: walk(dist / walkCycle(amp, scale), a) };
};

type P = [number, number];
const seg = (o: P, ang: number, len: number, f: number): P => [o[0] + Math.sin(ang) * len * f, o[1] + Math.cos(ang) * len];

/** Two-bone IK: joint placed so the chain end lands on t (clamped to reach). bend = +1 clockwise. */
const ik = (o: P, t: P, a: number, b: number, bend: number): P[] => {
  const dx = t[0] - o[0];
  const dy = t[1] - o[1];
  const d = Math.min(Math.hypot(dx, dy), a + b - 0.5);
  const base = Math.atan2(dy, dx);
  const alpha = Math.acos(Math.max(-1, Math.min(1, (a * a + d * d - b * b) / (2 * a * d))));
  const ang = base + bend * alpha;
  const j: P = [o[0] + Math.cos(ang) * a, o[1] + Math.sin(ang) * a];
  return [o, j, [o[0] + Math.cos(base) * d, o[1] + Math.sin(base) * d]];
};

/** Distance-driven walk phase so feet don't slide: one cycle ≈ 2 strides. */
export const strideCycles = (distancePx: number, scale = 1, amp = 1) => distancePx / (430 * scale * amp);

/** World-space contact targets (same coords as x/floor). */
export interface Reach {
  handF?: P;
  handB?: P;
  footF?: P;
  footB?: P;
}

interface StickProps {
  x: number; // feet center x (px)
  floor: number; // floor y (px) — feet are planted here
  hip?: P; // pin the hip in world px instead of floor-anchoring (climbing, crouching)
  scale?: number;
  facing?: 1 | -1;
  pose?: Pose;
  reach?: Reach;
  holdF?: React.ReactNode; // drawn at the front hand (local px, hand at 0,0)
  holdB?: React.ReactNode;
  look: Look;
  eyesClosed?: boolean;
  lookAt?: number; // -1..1 eye shift
  lampAngle?: number; // headlamp cone direction (0 = horizontal forward, + = down)
  hideLegs?: boolean;
}

export const Stick: React.FC<StickProps> = ({
  x, floor, hip: hipWorld, scale = 1, facing = 1, pose = STAND, reach = {}, holdF, holdB, look, eyesClosed, lookAt = 0.5, lampAngle = 0.12, hideLegs,
}) => {
  const f = facing;
  // Hip at origin; compute feet, then lift so the lowest foot touches the floor (unless hip is pinned).
  const hip: P = [0, 0];
  const legPts = (lg: Limb) => {
    const knee = seg(hip, lg[0], L.thigh, f);
    return [hip, knee, seg(knee, lg[0] - lg[1], L.shin, f)] as P[];
  };
  const fkF = legPts(pose.legF);
  const fkB = legPts(pose.legB);
  const lowest = hipWorld ? 0 : Math.max(fkF[2][1], fkB[2][1]);
  const origin: P = hipWorld ?? [x, floor - lowest * scale];
  const local = (t: P): P => [(t[0] - origin[0]) / scale, (t[1] - origin[1]) / scale];
  const lF = reach.footF ? ik(hip, local(reach.footF), L.thigh, L.shin, -f) : fkF;
  const lB = reach.footB ? ik(hip, local(reach.footB), L.thigh, L.shin, -f) : fkB;
  const neck: P = [Math.sin(pose.lean) * L.torso * f, -Math.cos(pose.lean) * L.torso];
  const shoulder: P = [neck[0] - Math.sin(pose.lean) * 14 * f, neck[1] + 14];
  const armPts = (a: Limb) => {
    const el = seg(shoulder, a[0], L.upper, f);
    return [shoulder, el, seg(el, a[0] + a[1], L.fore, f)] as P[];
  };
  const aF = reach.handF ? ik(shoulder, local(reach.handF), L.upper, L.fore, f) : armPts(pose.armF);
  const aB = reach.handB ? ik(shoulder, local(reach.handB), L.upper, L.fore, f) : armPts(pose.armB);
  const tilt = pose.headTilt ?? 0;
  const head: P = [neck[0] + Math.sin(pose.lean + tilt) * (L.neck + L.head) * f, neck[1] - Math.cos(pose.lean + tilt) * (L.neck + L.head)];
  const r = L.head;
  const armColor = look.limbs ?? look.body;
  const d = (pts: P[]) => `M${pts.map((p) => p.join(",")).join("L")}`;

  const limb = (pts: P[], color: string, key: string, band = false) => {
    const [a, b, c] = pts;
    const bandA: P = [b[0] + (c[0] - b[0]) * 0.3, b[1] + (c[1] - b[1]) * 0.3];
    const bandB: P = [b[0] + (c[0] - b[0]) * 0.72, b[1] + (c[1] - b[1]) * 0.72];
    return (
      <g key={key}>
        <path d={d([a, b, c])} stroke={C.ink} strokeWidth={LIMB_W + INK * 2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d([a, b, c])} stroke={color} strokeWidth={LIMB_W} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {band ? <path d={d([bandA, bandB])} stroke={C.alertRed} strokeWidth={LIMB_W} strokeLinecap="round" /> : null}
      </g>
    );
  };

  const eyeDX = (lookAt * 0.22) * r * f;
  const lampDir = { x: Math.cos(lampAngle) * f, y: Math.sin(lampAngle) };
  const lampP: P = [head[0] + r * 0.82 * f, head[1] - r * 0.28];

  return (
    <g transform={`translate(${origin[0]},${origin[1]}) scale(${scale})`}>
      {look.headlamp ? (
        <polygon
          points={`${lampP[0]},${lampP[1] - 6} ${lampP[0] + (lampDir.x * 900 - lampDir.y * 260 * f)},${lampP[1] + lampDir.y * 900 - 260 * Math.cos(lampAngle)} ${lampP[0] + (lampDir.x * 900 + lampDir.y * 260 * f)},${lampP[1] + lampDir.y * 900 + 260 * Math.cos(lampAngle)} ${lampP[0]},${lampP[1] + 6}`}
          fill="url(#lampCone)"
          style={{ mixBlendMode: "screen" }}
        />
      ) : null}
      {holdB ? <g transform={`translate(${aB[2][0]},${aB[2][1]})`}>{holdB}</g> : null}
      {limb(aB, armColor, "aB")}
      {hideLegs ? null : limb(lB, look.body, "lB")}
      {limb([hip, [(hip[0] + neck[0]) / 2, (hip[1] + neck[1]) / 2], neck], look.body, "torso")}
      {hideLegs ? null : limb(lF, look.body, "lF")}
      {look.tie ? (
        <path d={`M${neck[0]},${neck[1] + 6} L${neck[0] - 9},${neck[1] + 30} L${neck[0] + (hip[0] - neck[0]) * 0.45},${neck[1] + (hip[1] - neck[1]) * 0.55} L${neck[0] + 9},${neck[1] + 30}Z`} fill={look.tie} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
      ) : null}
      <line x1={neck[0]} y1={neck[1]} x2={head[0]} y2={head[1]} stroke={C.ink} strokeWidth={LIMB_W + INK * 2} strokeLinecap="round" />
      <line x1={neck[0]} y1={neck[1]} x2={head[0]} y2={head[1]} stroke={look.body} strokeWidth={LIMB_W - 4} strokeLinecap="round" />
      {/* head */}
      {look.hood ? (
        <path d={`M${head[0] - r * 1.05 * f},${head[1] + r * 0.2} A${r * 1.12},${r * 1.12} 0 0 1 ${head[0] + r * 0.2 * f},${head[1] - r * 1.1} L${head[0] - r * 0.1 * f},${head[1] + r * 0.9}Z`} fill={look.hood} stroke={C.ink} strokeWidth={INK} strokeLinejoin="round" />
      ) : null}
      {look.bun ? <circle cx={head[0] - r * 0.15 * f} cy={head[1] - r * 1.02} r={r * 0.36} fill={look.hair ?? C.hair} stroke={C.ink} strokeWidth={INK} /> : null}
      <circle cx={head[0]} cy={head[1]} r={r} fill={look.skin ?? C.skin} stroke={C.ink} strokeWidth={INK} />
      {look.bun ? (
        <path d={`M${head[0] - r * 0.98},${head[1] - r * 0.05} A${r},${r} 0 0 1 ${head[0] + r * 0.98},${head[1] - r * 0.12} Q${head[0] + r * 0.2},${head[1] - r * 0.62} ${head[0] - r * 0.98},${head[1] - r * 0.05}Z`} fill={look.hair ?? C.hair} stroke={C.ink} strokeWidth={INK * 0.7} />
      ) : null}
      {look.cap ? (
        <g>
          <path d={`M${head[0] - r * 0.95},${head[1] - r * 0.38} L${head[0] - r * 0.85},${head[1] - r * 1.08} L${head[0] + r * 0.85},${head[1] - r * 1.08} L${head[0] + r * 0.95},${head[1] - r * 0.38}Z`} fill={look.cap} stroke={C.ink} strokeWidth={INK} strokeLinejoin="round" />
          <path d={`M${head[0] + r * 0.2 * f},${head[1] - r * 0.4} L${head[0] + r * 1.35 * f},${head[1] - r * 0.3}`} stroke={C.ink} strokeWidth={14} strokeLinecap="round" />
          <rect x={head[0] - r * 0.22} y={head[1] - r * 0.9} width={r * 0.44} height={r * 0.26} fill="#c9a24a" stroke={C.ink} strokeWidth={3} />
        </g>
      ) : null}
      {look.shortHair ? (
        <path d={`M${head[0] - r * 1.02},${head[1] + r * 0.05} A${r * 1.03},${r * 1.03} 0 0 1 ${head[0] + r * 1.02},${head[1] - r * 0.05} Q${head[0] + r * 0.55 * f},${head[1] - r * 0.55} ${head[0] - r * 0.2 * f},${head[1] - r * 0.45} Q${head[0] - r * 0.8 * f},${head[1] - r * 0.35} ${head[0] - r * 1.02},${head[1] + r * 0.05}Z`} fill={look.shortHair} stroke={C.ink} strokeWidth={INK * 0.8} strokeLinejoin="round" />
      ) : null}
      {look.flatCap ? (
        <g>
          <path d={`M${head[0] - r * 0.98},${head[1] - r * 0.3} Q${head[0] - r * 0.6},${head[1] - r * 1.18} ${head[0] + r * 0.7 * f},${head[1] - r * 0.9} L${head[0] + r * 1.3 * f},${head[1] - r * 0.45} L${head[0] + r * 0.9 * f},${head[1] - r * 0.35}Z`} fill={look.flatCap} stroke={C.ink} strokeWidth={INK} strokeLinejoin="round" />
        </g>
      ) : null}
      {look.hearingAid ? <circle cx={head[0] - r * 0.55 * f} cy={head[1] + r * 0.12} r={r * 0.13} fill="#d9b38c" stroke={C.ink} strokeWidth={3} /> : null}
      {look.helmet ? (
        <path d={`M${head[0] - r * 1.08},${head[1] - r * 0.08} A${r * 1.08},${r * 1.08} 0 0 1 ${head[0] + r * 1.08},${head[1] - r * 0.08}Z`} fill={C.oliveDark} stroke={C.ink} strokeWidth={INK} />
      ) : null}
      {eyesClosed ? (
        [-1, 1].map((s) => (
          <path key={s} d={`M${head[0] + eyeDX + s * r * 0.26 - 11},${head[1]} q11,10 22,0`} stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        ))
      ) : (
        look.blankEyes
          ? [-1, 1].map((s) => <circle key={s} cx={head[0] + eyeDX + s * r * 0.24} cy={head[1] + r * 0.02} r={r * 0.15} fill="#f4f6ec" stroke={C.ink} strokeWidth={4} />)
          : [-1, 1].map((s) => <circle key={s} cx={head[0] + eyeDX + s * r * 0.24} cy={head[1] + r * 0.02} r={r * 0.105} fill={C.ink} />)
      )}
      {look.glasses ? (
        <g>
          {[-1, 1].map((g) => <circle key={`g${g}`} cx={head[0] + eyeDX + g * r * 0.24} cy={head[1] + r * 0.02} r={r * 0.2} fill="none" stroke={C.ink} strokeWidth={5} />)}
          <line x1={head[0] + eyeDX - r * 0.04} y1={head[1]} x2={head[0] + eyeDX + r * 0.04} y2={head[1]} stroke={C.ink} strokeWidth={4} />
        </g>
      ) : null}
      {look.headlamp ? (
        <g>
          <path d={`M${head[0] - r * 0.99},${head[1] - r * 0.42} Q${head[0]},${head[1] - r * 0.62} ${head[0] + r * 0.99},${head[1] - r * 0.3}`} stroke="#1d1d1d" strokeWidth={15} fill="none" />
          <rect x={lampP[0] - 16} y={lampP[1] - 14} width={30} height={26} rx={6} fill="#2a2a2a" stroke={C.ink} strokeWidth={3} />
          <circle cx={lampP[0] + 6 * f} cy={lampP[1] - 1} r={10} fill="#fffbe8" />
          <circle cx={lampP[0] + 6 * f} cy={lampP[1] - 1} r={30} fill="url(#lampGlow)" />
        </g>
      ) : null}
      {holdF ? <g transform={`translate(${aF[2][0]},${aF[2][1]})`}>{holdF}</g> : null}
      {limb(aF, armColor, "aF", look.band)}
    </g>
  );
};

/** Gradient defs the rig needs; render once inside every <svg> that holds Sticks. */
export const StickDefs: React.FC = () => (
  <defs>
    <radialGradient id="lampGlow">
      <stop offset="0" stopColor="#fffbe8" stopOpacity={0.9} />
      <stop offset="1" stopColor="#fffbe8" stopOpacity={0} />
    </radialGradient>
    <linearGradient id="lampCone" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor="#fffbe8" stopOpacity={0.55} />
      <stop offset="1" stopColor="#fffbe8" stopOpacity={0} />
    </linearGradient>
  </defs>
);

/**
 * Planted-foot gait: feet stay fixed on the ground while the body passes over them,
 * then swing to the next plant. Works on slopes/stairs via `ground(x)`.
 * Returns pinned hip + foot targets for <Stick hip reach>.
 */
export const gait = (
  x0: number, dir: 1 | -1, dist: number, ground: (x: number) => number,
  { stride = 150, lift = 26, scale = 1, hipH = 236 }: { stride?: number; lift?: number; scale?: number; hipH?: number } = {},
) => {
  const S = stride * 2 * scale;
  const foot = (d: number): [number, number] => {
    const k = Math.floor(d);
    const c = d - k;
    const swing = c < 0.5 ? 0 : (c - 0.5) * 2;
    const ease = swing * swing * (3 - 2 * swing);
    const pos = (k + 0.25 + ease) * S;
    const fx = x0 + dir * pos;
    return [fx, ground(fx) - Math.sin(Math.PI * swing) * lift * scale];
  };
  const d = dist / S;
  const a = foot(d);
  const b = foot(d + 0.5);
  const hx = x0 + dir * dist;
  const bob = Math.abs(Math.sin(d * Math.PI * 2)) * 8 * scale;
  const hy = Math.min(ground(a[0]), ground(b[0]), ground(hx)) - hipH * scale + bob;
  return { hip: [hx, hy] as [number, number], footF: a, footB: b, phase: d };
};
