import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { C, FONT } from "../kit/style";

/** SILENCE PROTOCOL sets (series-wide). Flat SVG, 1080x1920 viewBox, same ink language as the house style. */

const ink = { stroke: C.ink, strokeWidth: 4.5, strokeLinejoin: "round" as const };
const thin = { stroke: C.ink, strokeWidth: 2.5, strokeLinejoin: "round" as const };
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const sub = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export const SPDefs: React.FC = () => (
  <defs>
    <radialGradient id="spRed">
      <stop offset="0" stopColor="#ff2a1a" stopOpacity={0.6} />
      <stop offset="1" stopColor="#ff2a1a" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="spBlue">
      <stop offset="0" stopColor="#5fb4ff" stopOpacity={0.55} />
      <stop offset="1" stopColor="#5fb4ff" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="spGreen">
      <stop offset="0" stopColor="#58d68d" stopOpacity={0.55} />
      <stop offset="1" stopColor="#58d68d" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="spWarm">
      <stop offset="0" stopColor="#ffd98a" stopOpacity={0.55} />
      <stop offset="1" stopColor="#ffd98a" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="spDome">
      <stop offset="0.55" stopColor="#5fb4ff" stopOpacity={0.05} />
      <stop offset="0.92" stopColor="#5fb4ff" stopOpacity={0.35} />
      <stop offset="1" stopColor="#bfe2ff" stopOpacity={0.8} />
    </radialGradient>
    <linearGradient id="spBeamBlue" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#5fb4ff" stopOpacity={0} />
      <stop offset="1" stopColor="#5fb4ff" stopOpacity={0.45} />
    </linearGradient>
    <linearGradient id="spBeamGreen" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#58d68d" stopOpacity={0} />
      <stop offset="1" stopColor="#58d68d" stopOpacity={0.45} />
    </linearGradient>
    <linearGradient id="spWorkCone" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#fff1c4" stopOpacity={0.5} />
      <stop offset="1" stopColor="#fff1c4" stopOpacity={0} />
    </linearGradient>
    <linearGradient id="spSky" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#0b0809" />
      <stop offset="0.7" stopColor="#2a1214" />
      <stop offset="1" stopColor="#4a1a17" />
    </linearGradient>
    <linearGradient id="spWater" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#6fb0e8" />
      <stop offset="1" stopColor="#2d5f91" />
    </linearGradient>
  </defs>
);

/** Expanding sound-wave arcs (the virus). `t` = seconds-ish progress driver (frame/30). */
export const SoundRings: React.FC<{ x: number; y: number; t: number; color?: string; n?: number; max?: number; dir?: number; spread?: number; width?: number; opacity?: number }> = ({
  x, y, t, color = "#ff3b2a", n = 4, max = 420, dir = 0, spread = Math.PI * 2, width = 9, opacity = 1,
}) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const p = (t * 0.9 + i / n) % 1;
      const r = 30 + p * max;
      const op = (1 - p) * opacity;
      if (spread >= Math.PI * 2 - 0.01) return <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={width} opacity={op} />;
      const a0 = dir - spread / 2;
      const a1 = dir + spread / 2;
      return (
        <path key={i} d={`M${x + Math.cos(a0) * r},${y + Math.sin(a0) * r} A${r},${r} 0 0 1 ${x + Math.cos(a1) * r},${y + Math.sin(a1) * r}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" opacity={op} />
      );
    })}
  </g>
);

// ---------------------------------------------------------------- SCENE 1

/** Dark living room, big wall TV on the right. tv: "normal" | "static" | "alert". */
export const LivingRoom: React.FC<{ tv: "normal" | "static" | "alert"; days?: number }> = ({ tv, days = 365 }) => {
  const frame = useCurrentFrame();
  const flick = 0.85 + 0.15 * random(`lr${Math.floor(frame / 2)}`);
  const glow = tv === "alert" ? "url(#spRed)" : tv === "normal" ? "url(#spBlue)" : "url(#spWarm)";
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <g>
      <rect width={1080} height={1920} fill="#140f10" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={i} x1={i * 170 + 40} y1={0} x2={i * 170 + 40} y2={1330} stroke="#1c1516" strokeWidth={8} />)}
      {/* window with city glow */}
      <rect x={60} y={420} width={250} height={420} fill="url(#spSky)" {...ink} />
      <path d="M60,760 L100,720 L130,735 L160,690 L200,712 L240,660 L280,700 L310,690 L310,840 L60,840Z" fill="#0d0a0b" />
      <line x1={185} y1={420} x2={185} y2={840} {...ink} strokeWidth={9} />
      {/* TV */}
      <circle cx={760} cy={830} r={620} fill={glow} opacity={0.8 * flick} />
      <rect x={470} y={640} width={580} height={360} rx={10} fill="#0d0e10" {...ink} strokeWidth={8} />
      <g>
        <clipPath id="tvclip"><rect x={486} y={656} width={548} height={328} /></clipPath>
        <g clipPath="url(#tvclip)">
          {tv === "normal" ? (
            <g>
              {["#c9c94a", "#4ac9c9", "#4ac94a", "#c94ac9", "#c94a4a", "#4a4ac9", "#dcdcdc"].map((c, i) => <rect key={i} x={486 + i * 79} y={656} width={79} height={230} fill={c} opacity={0.75} />)}
              <rect x={486} y={886} width={548} height={98} fill="#1b1b1f" />
              <text x={760} y={950} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={34} fill="#ddd">CHANNEL 4 · 23:41</text>
            </g>
          ) : tv === "static" ? (
            Array.from({ length: 40 }).map((_, i) => <rect key={i} x={486} y={656 + i * 8.2} width={548} height={8.2} fill={random(`st${frame}-${i}`) > 0.5 ? "#d8d8d8" : "#2a2a2a"} opacity={0.4 + 0.6 * random(`so${frame}-${i}`)} />)
          ) : (
            <g opacity={flick}>
              <rect x={486} y={656} width={548} height={328} fill="#5e0d08" />
              <rect x={486} y={656} width={548} height={66} fill={blink ? "#e8332a" : "#b8261f"} />
              <text x={760} y={704} textAnchor="middle" fontFamily={FONT.title} fontSize={44} fill="white" letterSpacing={3}>EMERGENCY BROADCAST</text>
              <text x={760} y={830} textAnchor="middle" fontFamily={FONT.title} fontSize={120} fill="white">{days}</text>
              <text x={760} y={880} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={26} fill="#ffd0c8" letterSpacing={2}>DAYS UNTIL OUTBREAK</text>
              <rect x={486} y={920} width={548} height={64} fill="#1a0504" />
              <text x={760 - ((frame * 4) % 900) + 300} y={962} fontFamily={FONT.mono} fontWeight={800} fontSize={28} fill="#ffb3a8">VOICE-TRANSMITTED PATHOGEN · DO NOT LISTEN TO THE INFECTED · STAY INDOORS ·</text>
            </g>
          )}
          {Array.from({ length: 41 }).map((_, i) => <line key={i} x1={486} y1={656 + i * 8} x2={1034} y2={656 + i * 8} stroke="#000" strokeWidth={2} opacity={0.25} />)}
        </g>
      </g>
      <rect x={720} y={1000} width={80} height={70} fill="#1a1a1c" {...ink} />
      {/* floor */}
      <rect y={1330} width={1080} height={590} fill="#0f0b09" />
      <line x1={0} y1={1330} x2={1080} y2={1330} {...ink} strokeWidth={6} />
      {/* TV cabinet */}
      <rect x={560} y={1200} width={420} height={130} fill="#22180f" {...ink} />
      <line x1={770} y1={1200} x2={770} y2={1330} {...ink} />
      {/* sofa back (foreground left) */}
      <path d="M-20,1500 L-20,1380 Q-20,1340 30,1340 L330,1340 Q380,1340 380,1390 L380,1500Z" fill="#2b1f1d" {...ink} />
      <rect x={-20} y={1480} width={420} height={140} rx={20} fill="#3a2a26" {...ink} />
      <rect y={1620} width={1080} height={300} fill="#0c0907" />
    </g>
  );
};

/** Hospital ward under emergency lights. */
export const Hospital: React.FC<{ sign?: string }> = ({ sign = "ICU · FULL" }) => {
  const frame = useCurrentFrame();
  const rot = (frame / 30) * Math.PI * 1.4;
  return (
    <g>
      <rect width={1080} height={1920} fill="#1e2a2a" />
      {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={0} y={300 + i * 110} width={1080} height={4} fill="#243333" />)}
      <rect x={0} y={1080} width={1080} height={70} fill="#2c3d3b" />
      {/* sign */}
      <rect x={300} y={430} width={480} height={110} fill="#d8ddd2" {...ink} />
      <text x={540} y={507} textAnchor="middle" fontFamily={FONT.title} fontSize={62} fill={C.alertRed} letterSpacing={3}>{sign}</text>
      {/* rotating emergency light */}
      <rect x={510} y={300} width={60} height={34} rx={8} fill="#5a1410" {...ink} />
      <polygon points={`540,316 ${540 + Math.cos(rot) * 1200},${316 + Math.sin(rot) * 260 + 300} ${540 + Math.cos(rot + 0.35) * 1200},${316 + Math.sin(rot + 0.35) * 260 + 300}`} fill="#ff2a1a" opacity={0.18} />
      <circle cx={540} cy={316} r={300} fill="url(#spRed)" opacity={0.4 + 0.3 * Math.sin(frame / 3)} />
      {/* beds */}
      {[120, 820].map((x, i) => (
        <g key={x}>
          <rect x={x - 110} y={1400} width={260} height={30} fill="#d8ddd2" {...ink} />
          <rect x={x - 110} y={1360} width={260} height={46} rx={10} fill="#eef0e8" {...ink} />
          <line x1={x - 100} y1={1430} x2={x - 100} y2={1600} {...ink} strokeWidth={8} />
          <line x1={x + 140} y1={1430} x2={x + 140} y2={1600} {...ink} strokeWidth={8} />
          <rect x={x + 120} y={1180} width={14} height={300} fill="#9aa4a4" />
          <rect x={x + 96} y={1180} width={62} height={80} rx={10} fill="#bfe0e8" {...ink} strokeWidth={3} opacity={i ? 0.9 : 0.6} />
        </g>
      ))}
      <rect y={1600} width={1080} height={320} fill="#151c1c" />
      <line x1={0} y1={1600} x2={1080} y2={1600} {...ink} strokeWidth={6} />
    </g>
  );
};

/** Night street (simplified skyline, burning glow, abandoned cars). */
export const Street: React.FC<{ fire?: number; lights?: number }> = ({ fire = 1, lights = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <g>
      <rect width={1080} height={1920} fill="url(#spSky)" />
      {Array.from({ length: 9 }).map((_, i) => {
        const h = 380 + random(`sbh${i}`) * 520;
        return (
          <g key={i}>
            <rect x={i * 125 - 20} y={1480 - h} width={135} height={h} fill="#1a1215" {...thin} />
            {Array.from({ length: 14 }).map((_, k) => (
              <rect key={k} x={i * 125 + (k % 3) * 38} y={1480 - h + 30 + Math.floor(k / 3) * 66} width={16} height={24} fill={random(`sw${i}-${k}`) > 0.75 && random(`swl${i}-${k}`) < lights ? C.amber : "#120c0e"} opacity={0.8} />
            ))}
          </g>
        );
      })}
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={i} cx={random(`smx${i}`) * 1080 + Math.sin(frame / 40 + i) * 18} cy={800 + random(`smy${i}`) * 400 - frame * 0.5} r={110 + random(`smr${i}`) * 80} fill="#2f1a1c" opacity={0.7} />
      ))}
      <circle cx={880} cy={1400} r={420} fill="url(#spRed)" opacity={0.5 * fire * (0.85 + 0.15 * Math.sin(frame / 4))} />
      <rect x={0} y={1480} width={1080} height={440} fill="#110d0e" />
      <line x1={0} y1={1480} x2={1080} y2={1480} {...ink} strokeWidth={6} />
      <line x1={0} y1={1760} x2={1080} y2={1760} stroke="#2b2425" strokeWidth={6} strokeDasharray="50 40" />
      {/* abandoned car */}
      <g transform="translate(760,1560) rotate(-6)">
        <rect width={260} height={70} rx={16} fill="#3b2a2a" {...ink} />
        <rect x={50} y={-44} width={150} height={52} rx={12} fill="#3b2a2a" {...ink} />
        <rect x={70} y={-34} width={50} height={34} fill="#9fb4c8" opacity={0.4} />
        <circle cx={50} cy={74} r={22} fill="#111" />
        <circle cx={210} cy={74} r={22} fill="#111" />
      </g>
      {Array.from({ length: 22 }).map((_, i) => (
        <circle key={i} cx={(random(`ex${i}`) * 1080 + frame * 0.8) % 1080} cy={1480 - ((frame * (1 + random(`ev${i}`)) * 2 + random(`ey${i}`) * 1100) % 1100)} r={3} fill="#ff8a4a" opacity={0.75} />
      ))}
    </g>
  );
};

// ---------------------------------------------------------------- SCENE 2

/** Empty underground construction site: dirt walls, shoring, work lights. */
export const Pit: React.FC = () => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 30) * 0.02;
  return (
    <g>
      <rect width={1080} height={1920} fill="#2a1f17" />
      {Array.from({ length: 14 }).map((_, i) => (
        <path key={i} d={`M0,${330 + i * 95} Q270,${310 + i * 95 + random(`pl${i}`) * 40} 540,${330 + i * 95} T1080,${325 + i * 95}`} stroke="#33261c" strokeWidth={10} fill="none" />
      ))}
      {Array.from({ length: 40 }).map((_, i) => <ellipse key={i} cx={random(`rx${i}`) * 1080} cy={300 + random(`ry${i}`) * 1250} rx={8 + random(`rr${i}`) * 18} ry={6 + random(`rr${i}`) * 10} fill="#3d2e22" />)}
      {/* opening to sky at top */}
      <rect x={0} y={0} width={1080} height={300} fill="url(#spSky)" />
      <path d="M0,300 L180,270 L420,295 L700,265 L1080,300 L1080,330 L0,330Z" fill="#1c140e" />
      {/* timber shoring */}
      {[80, 1000].map((x) => (
        <g key={x}>
          <rect x={x - 22} y={300} width={44} height={1300} fill="#5a4129" {...ink} />
          {[520, 900, 1280].map((y) => <rect key={y} x={x < 540 ? x - 22 : x - 200} y={y} width={222} height={30} fill="#6b4e31" {...ink} />)}
        </g>
      ))}
      {/* excavator arm silhouette from above */}
      <g transform={`rotate(${(sway * 180) / Math.PI} 820 120)`}>
        <path d="M820,120 L700,430 L760,460" stroke="#d9a53a" strokeWidth={40} fill="none" strokeLinejoin="round" />
        <path d="M820,120 L700,430 L760,460" stroke={C.ink} strokeWidth={6} fill="none" />
        <path d="M730,450 L800,520 L840,470Z" fill="#c4932f" {...ink} />
      </g>
      {/* work lights */}
      {[260, 820].map((x, i) => (
        <g key={x}>
          <polygon points={`${x},640 ${x - 260},1640 ${x + 260},1640`} fill="url(#spWorkCone)" opacity={0.6 + 0.1 * Math.sin(frame / 5 + i)} />
          <line x1={x} y1={640} x2={x + (i ? 40 : -40)} y2={1640} stroke="#222" strokeWidth={10} />
          <rect x={x - 40} y={610} width={80} height={44} rx={6} fill="#e2c35a" {...ink} />
        </g>
      ))}
      {/* rebar bundle + cones */}
      <g transform="translate(640,1600)">
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={0} y1={-10 - i * 9} x2={330} y2={-30 - i * 9} stroke="#b4562e" strokeWidth={8} />)}
      </g>
      {[150, 940].map((x) => <polygon key={x} points={`${x},1660 ${x + 24},1590 ${x + 48},1660`} fill="#e86b2a" {...ink} />)}
      {/* floor */}
      <rect y={1660} width={1080} height={260} fill="#1d150f" />
      <line x1={0} y1={1660} x2={1080} y2={1660} {...ink} strokeWidth={6} />
      {[200, 560, 880].map((x) => <ellipse key={x} cx={x} cy={1700} rx={90} ry={12} fill="#2e2a2c" opacity={0.7} />)}
    </g>
  );
};

/** Holographic bunker blueprint (cross-section) drawing itself. `t` 0..1. */
export const Blueprint: React.FC<{ x: number; y: number; w: number; t: number }> = ({ x, y, w, t }) => {
  const frame = useCurrentFrame();
  const h = w * 0.72;
  const L = 4000;
  const draw = (a: number, b: number) => ({ strokeDasharray: L, strokeDashoffset: L * (1 - sub(t, a, b)) });
  const s = w / 900;
  const flick = 0.85 + 0.15 * random(`bp${Math.floor(frame / 2)}`);
  return (
    <g transform={`translate(${x},${y})`} opacity={clamp01(t * 4) * flick}>
      <rect width={w} height={h} fill="#0b2a4a" opacity={0.55} stroke="#5fb4ff" strokeWidth={3} />
      {Array.from({ length: 13 }).map((_, i) => <line key={i} x1={(i * w) / 12} y1={0} x2={(i * w) / 12} y2={h} stroke="#5fb4ff" strokeWidth={1} opacity={0.18} />)}
      {Array.from({ length: 10 }).map((_, i) => <line key={i} x1={0} y1={(i * h) / 9} x2={w} y2={(i * h) / 9} stroke="#5fb4ff" strokeWidth={1} opacity={0.18} />)}
      <g transform={`scale(${s})`} fill="none" stroke="#9fd2ff" strokeWidth={4}>
        <path d="M0,120 L900,120" style={draw(0, 0.2)} />
        <path d="M90,120 L90,40 L170,40 L170,120" style={draw(0.05, 0.25)} />
        <rect x={60} y={180} width={780} height={420} style={draw(0.1, 0.45)} />
        <rect x={76} y={196} width={748} height={388} strokeDasharray="10 8" opacity={sub(t, 0.35, 0.5)} />
        <path d="M60,320 L840,320 M60,460 L840,460" style={draw(0.3, 0.55)} />
        <path d="M250,180 L250,320 M560,180 L560,320 M420,320 L420,460 M620,320 L620,460 M300,460 L300,600 M560,460 L560,600" style={draw(0.4, 0.7)} />
        <path d="M120,120 L120,180" style={draw(0.5, 0.6)} />
        <path d="M760,180 L760,120 L800,120" style={draw(0.55, 0.7)} />
      </g>
      <g opacity={sub(t, 0.6, 0.85)} fontFamily={FONT.mono} fontWeight={800} fontSize={17 * s * 1.25} fill="#bfe2ff">
        <text x={20 * s} y={30 * s}>PROJECT: SILENCE · SUBLEVEL 1</text>
        <text x={100 * s} y={260 * s}>AIRLOCK</text>
        <text x={330 * s} y={260 * s}>COMMAND</text>
        <text x={620 * s} y={260 * s}>VENT</text>
        <text x={160 * s} y={400 * s}>LIVING</text>
        <text x={460 * s} y={400 * s}>MED</text>
        <text x={660 * s} y={400 * s}>FOOD</text>
        <text x={110 * s} y={540 * s}>POWER</text>
        <text x={360 * s} y={540 * s}>GENERATOR</text>
        <text x={640 * s} y={540 * s}>WATER</text>
        <text x={820 * s} y={150 * s} textAnchor="end">GROUND LEVEL</text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- SCENE 3: progressive bunker cut-away

export interface Build {
  dig: number; concrete: number; insul: number; airlock: number; vent: number; battery: number; gen: number;
  water: number; med: number; food: number; cams: number; furn: number; finish: number;
}
export const EMPTY_BUILD: Build = { dig: 0, concrete: 0, insul: 0, airlock: 0, vent: 0, battery: 0, gen: 0, water: 0, med: 0, food: 0, cams: 0, furn: 0, finish: 0 };
export const FULL_BUILD: Build = { dig: 1, concrete: 1, insul: 1, airlock: 1, vent: 1, battery: 1, gen: 1, water: 1, med: 1, food: 1, cams: 1, furn: 1, finish: 1 };

/** Room rectangles (world px) for camera framing and character placement. floor = y of the room floor. */
export const ROOM = {
  airlock: { x0: 102, x1: 322, y0: 632, y1: 866 },
  command: { x0: 336, x1: 690, y0: 632, y1: 866 },
  vent: { x0: 704, x1: 978, y0: 632, y1: 866 },
  living: { x0: 102, x1: 512, y0: 880, y1: 1116 },
  med: { x0: 526, x1: 690, y0: 880, y1: 1116 },
  pantry: { x0: 704, x1: 978, y0: 880, y1: 1116 },
  battery: { x0: 102, x1: 372, y0: 1130, y1: 1368 },
  gen: { x0: 386, x1: 634, y0: 1130, y1: 1368 },
  water: { x0: 648, x1: 978, y0: 1130, y1: 1368 },
} as const;
export const SURFACE = 520;

const drop = (p: number, h = 120) => (1 - ease(clamp01(p))) * -h;

/** The whole bunker as a cut-away, building itself from the `b` progress values. */
export const BunkerWorld: React.FC<{ b: Build; noiseDemo?: number; airDemo?: number }> = ({ b, noiseDemo = 0, airDemo = 0 }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const shellTop = 610;
  const shellBot = 1390;
  const pour = shellBot - (shellBot - shellTop + 10) * b.concrete;
  const lit = (v: number) => (b.finish > 0 ? 1 : clamp01(v * 3));
  const roomFill = b.concrete >= 1 ? "#58554c" : "#1b1410";
  const R = ROOM;
  const fan = frame * 0.5 * b.vent;
  const genShake = b.gen > 0.6 ? Math.sin(frame * 2.3) * 1.2 : 0;
  return (
    <g>
      {/* sky + skyline */}
      <rect x={-400} y={-600} width={1880} height={SURFACE + 600} fill="url(#spSky)" />
      {Array.from({ length: 12 }).map((_, i) => {
        const h = 120 + random(`wsk${i}`) * 260;
        return <rect key={i} x={-300 + i * 150} y={SURFACE - h} width={140} height={h} fill="#160f11" />;
      })}
      <circle cx={900} cy={SURFACE} r={400} fill="url(#spRed)" opacity={0.35} />
      {/* earth */}
      <rect x={-400} y={SURFACE} width={1880} height={1700} fill="#3a2a1d" />
      {Array.from({ length: 16 }).map((_, i) => (
        <path key={i} d={`M-400,${SURFACE + 60 + i * 80} Q300,${SURFACE + 40 + i * 80 + random(`el${i}`) * 50} 900,${SURFACE + 60 + i * 80} T1480,${SURFACE + 55 + i * 80}`} stroke="#33251a" strokeWidth={8} fill="none" />
      ))}
      {Array.from({ length: 50 }).map((_, i) => <ellipse key={i} cx={-300 + random(`erx${i}`) * 1680} cy={SURFACE + 40 + random(`ery${i}`) * 1400} rx={6 + random(`err${i}`) * 14} ry={5 + random(`err${i}`) * 8} fill="#4a3727" />)}
      <rect x={-400} y={SURFACE - 6} width={1880} height={16} fill="#2a3a22" />
      {/* excavated cavity */}
      <rect x={72} y={shellTop - 10} width={936} height={(shellBot - shellTop + 20) * b.dig} fill="#160f0b" />
      {b.dig > 0 && b.dig < 1 ? (
        <g>
          {Array.from({ length: 10 }).map((_, i) => {
            const p = ((t * 1.3 + i / 10) % 1);
            return <circle key={i} cx={300 + random(`dd${i}`) * 500} cy={shellTop + (shellBot - shellTop) * b.dig - p * 200} r={6 + random(`ds${i}`) * 8} fill="#5a4330" opacity={1 - p} />;
          })}
          <path d={`M940,${SURFACE - 40} L780,${shellTop + (shellBot - shellTop) * b.dig - 60}`} stroke="#d9a53a" strokeWidth={26} />
          <path d={`M760,${shellTop + (shellBot - shellTop) * b.dig - 80} l60,50 l30,-40z`} fill="#c4932f" {...thin} />
          <rect x={900} y={SURFACE - 90} width={150} height={80} rx={8} fill="#d9a53a" {...thin} />
        </g>
      ) : null}
      {/* shaft to surface + hut */}
      {b.concrete > 0 ? (
        <g opacity={clamp01(b.concrete * 2 - 1)}>
          <rect x={140} y={SURFACE - 70} width={130} height={shellTop - SURFACE + 90} fill="#6d6a60" {...thin} />
          <rect x={158} y={SURFACE - 60} width={94} height={shellTop - SURFACE + 60} fill="#2a2824" />
          {Array.from({ length: 5 }).map((_, i) => <line key={i} x1={170} y1={SURFACE - 40 + i * 24} x2={240} y2={SURFACE - 40 + i * 24} stroke="#9a9d98" strokeWidth={4} />)}
          <path d={`M120,${SURFACE - 70} L205,${SURFACE - 120} L290,${SURFACE - 70}Z`} fill="#4c4a43" {...thin} />
        </g>
      ) : null}
      {/* rebar during the pour */}
      {b.concrete > 0 && b.concrete < 1 ? (
        <g opacity={0.9}>
          {Array.from({ length: 24 }).map((_, i) => <line key={`v${i}`} x1={88 + i * 39} y1={shellTop} x2={88 + i * 39} y2={shellBot} stroke="#b4562e" strokeWidth={3} />)}
          {Array.from({ length: 20 }).map((_, i) => <line key={`h${i}`} x1={80} y1={shellTop + i * 40} x2={1000} y2={shellTop + i * 40} stroke="#b4562e" strokeWidth={3} />)}
        </g>
      ) : null}
      {/* concrete shell + walls, rising with the pour */}
      <clipPath id="pourClip"><rect x={60} y={pour} width={960} height={shellBot - pour + 20} /></clipPath>
      <g clipPath="url(#pourClip)">
        <rect x={80} y={shellTop} width={920} height={shellBot - shellTop} fill="#8d8a7b" {...ink} />
        {Object.values(R).map((r, i) => <rect key={i} x={r.x0} y={r.y0} width={r.x1 - r.x0} height={r.y1 - r.y0} fill={roomFill} />)}
        <rect x={80} y={shellTop} width={920} height={shellBot - shellTop} fill="none" {...ink} />
        {b.concrete < 1 ? <rect x={60} y={pour - 4} width={960} height={10} fill="#a9a597" /> : null}
      </g>
      {/* acoustic insulation lining (3 layers) */}
      {b.insul > 0 ? (
        <g>
          {[["#d8b24a", 0], ["#8a8f94", 7], ["#3c4044", 14]].map(([col, off], i) => {
            const o = Number(off);
            const p = clamp01(b.insul * 3 - i);
            const L = 2 * (920 - 2 * (22 + o)) + 2 * (780 - 2 * (22 + o));
            return (
              <rect key={i} x={102 - 22 + 22 + o - 0} y={shellTop + 22 + o} width={920 - 2 * (22 + o)} height={780 - 2 * (22 + o)} fill="none" stroke={String(col)} strokeWidth={7}
                strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
            );
          })}
        </g>
      ) : null}
      {/* room lighting pools (lit as each system goes in) */}
      {([
        ["airlock", b.airlock], ["command", b.cams], ["vent", b.vent], ["living", b.furn], ["med", b.med], ["pantry", b.food], ["battery", b.battery], ["gen", b.gen], ["water", b.water],
      ] as [keyof typeof ROOM, number][]).map(([k, v]) => {
        const r = R[k];
        const l = lit(v);
        return (
          <g key={k}>
            <ellipse cx={(r.x0 + r.x1) / 2} cy={r.y0 + 60} rx={(r.x1 - r.x0) * 0.7} ry={(r.y1 - r.y0) * 0.8} fill="url(#spWarm)" opacity={0.55 * l} />
            <rect x={(r.x0 + r.x1) / 2 - 22} y={r.y0 + 22} width={44} height={8} rx={4} fill={l > 0.5 ? "#fff3c8" : "#55524a"} />
          </g>
        );
      })}

      {/* ---- AIRLOCK: ceiling hatch (door 1) + side door (door 2) */}
      {b.concrete >= 1 ? (
        <g>
          <rect x={150} y={R.airlock.y0 + 18} width={8} height={R.airlock.y1 - R.airlock.y0 - 18} fill="#9a9d98" />
          <rect x={244} y={R.airlock.y0 + 18} width={8} height={R.airlock.y1 - R.airlock.y0 - 18} fill="#9a9d98" />
          {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={154} y1={R.airlock.y0 + 40 + i * 24} x2={248} y2={R.airlock.y0 + 40 + i * 24} stroke="#9a9d98" strokeWidth={4} />)}
        </g>
      ) : null}
      {b.airlock > 0 ? (
        <g>
          {/* door 1: hatch sliding shut over the shaft */}
          <g transform={`translate(${(1 - ease(sub(b.airlock, 0, 0.45))) * -130},0)`}>
            <rect x={140} y={R.airlock.y0 - 8} width={130} height={26} fill="#6b7076" {...thin} />
            <rect x={190} y={R.airlock.y0 - 4} width={30} height={18} fill={b.airlock > 0.45 ? "#58d68d" : C.alertRed} />
          </g>
          {/* door 2: heavy side door into command */}
          <g transform={`translate(0,${(1 - ease(sub(b.airlock, 0.5, 0.95))) * -240})`}>
            <rect x={296} y={R.airlock.y0 + 30} width={46} height={R.airlock.y1 - R.airlock.y0 - 30} rx={4} fill="#6b7076" {...thin} />
            {[0, 1, 2].map((i) => <circle key={i} cx={319} cy={R.airlock.y0 + 70 + i * 60} r={7} fill="#3c4044" />)}
            <circle cx={319} cy={R.airlock.y0 + 50} r={8} fill={b.airlock > 0.95 ? "#58d68d" : C.alertRed} />
          </g>
          <text x={212} y={R.airlock.y1 - 14} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={14} fill="#e0b34a" opacity={sub(b.airlock, 0.9, 1)}>AIRLOCK · 2 DOORS</text>
        </g>
      ) : null}

      {/* ---- COMMAND: monitors + desk (surveillance) */}
      {b.concrete >= 1 ? <rect x={R.command.x0 + 20} y={R.command.y1 - 70} width={250} height={14} fill="#4a3a2c" {...thin} /> : null}
      {b.cams > 0 ? (
        <g transform={`translate(0,${drop(b.cams * 2)})`}>
          {[0, 1, 2].map((i) => [0, 1].map((k) => (
            <g key={`${i}${k}`}>
              <rect x={R.command.x0 + 30 + i * 84} y={R.command.y0 + 50 + k * 60} width={76} height={52} fill="#0e1716" {...thin} />
              <rect x={R.command.x0 + 34 + i * 84} y={R.command.y0 + 54 + k * 60} width={68} height={44} fill={b.cams > 0.5 ? (i + k) % 2 ? "#2a4a3c" : "#33505a" : "#111"} />
            </g>
          )))}
          <circle cx={R.command.x0 + 40} cy={R.command.y0 + 40} r={5} fill={C.alertRed} opacity={Math.floor(frame / 10) % 2} />
        </g>
      ) : null}
      {b.cams > 0.4 ? (
        <g>
          {[620, 1000].map((x) => (
            <g key={x}>
              <line x1={x} y1={SURFACE} x2={x} y2={SURFACE - 120} stroke="#555" strokeWidth={8} />
              <rect x={x - 30} y={SURFACE - 140} width={44} height={26} rx={4} fill="#d8ddd2" {...thin} />
              <circle cx={x - 30} cy={SURFACE - 127} r={5} fill={C.alertRed} />
            </g>
          ))}
        </g>
      ) : null}

      {/* ---- VENT: duct to surface, silencer, quiet fan */}
      {b.vent > 0 ? (
        <g>
          <g opacity={clamp01(b.vent * 3)}>
            <rect x={880} y={SURFACE - 70} width={46} height={R.vent.y0 - SURFACE + 90} fill="#7d8389" {...thin} />
            <path d={`M860,${SURFACE - 70} L946,${SURFACE - 70} L926,${SURFACE - 100} L880,${SURFACE - 100}Z`} fill="#5f6469" {...thin} />
            {/* silencer box with baffles */}
            <rect x={860} y={SURFACE + 20} width={86} height={70} fill="#6d6a60" {...thin} />
            {[0, 1, 2, 3].map((i) => <line key={i} x1={868 + i * 20} y1={SURFACE + 26} x2={868 + i * 20} y2={SURFACE + 84} stroke="#d8b24a" strokeWidth={5} />)}
          </g>
          <g transform={`translate(0,${drop(b.vent * 1.6)})`}>
            <rect x={R.vent.x0 + 40} y={R.vent.y0 + 40} width={190} height={130} fill="#7d8389" {...thin} />
            <circle cx={R.vent.x0 + 110} cy={R.vent.y0 + 105} r={44} fill="#2f3337" {...thin} />
            {[0, 1, 2, 3].map((i) => {
              const a = fan + (i * Math.PI) / 2;
              return <path key={i} d={`M${R.vent.x0 + 110},${R.vent.y0 + 105} L${R.vent.x0 + 110 + Math.cos(a) * 38},${R.vent.y0 + 105 + Math.sin(a) * 38} L${R.vent.x0 + 110 + Math.cos(a + 0.5) * 34},${R.vent.y0 + 105 + Math.sin(a + 0.5) * 34}Z`} fill="#9aa1a8" />;
            })}
            <rect x={R.vent.x0 + 170} y={R.vent.y0 + 60} width={50} height={90} fill="#5f6469" {...thin} />
            {[0, 1, 2].map((i) => <line key={i} x1={R.vent.x0 + 176} y1={R.vent.y0 + 72 + i * 26} x2={R.vent.x0 + 214} y2={R.vent.y0 + 72 + i * 26} stroke="#d8b24a" strokeWidth={5} />)}
            <text x={R.vent.x0 + 135} y={R.vent.y0 + 195} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={13} fill="#e0b34a" opacity={sub(b.vent, 0.6, 1)}>SILENCED AIR · 18 dB</text>
          </g>
        </g>
      ) : null}
      {airDemo > 0 ? (
        <g opacity={airDemo}>
          {Array.from({ length: 14 }).map((_, i) => {
            const p = (t * 0.55 + i / 14) % 1;
            const y = SURFACE - 60 + p * (R.vent.y0 + 40 - SURFACE + 60);
            return <circle key={i} cx={903 + Math.sin(p * 9 + i) * 8} cy={y} r={6} fill="#9fe6ff" opacity={0.9 - 0.4 * p} />;
          })}
          {Array.from({ length: 3 }).map((_, i) => {
            const p = (t * 0.8 + i / 3) % 1;
            const r = 20 + p * 80;
            return <path key={`n${i}`} d={`M${903 - r},${SURFACE - 120 - p * 30} Q903,${SURFACE - 150 - p * 60} ${903 + r},${SURFACE - 120 - p * 30}`} stroke="#ff3b2a" strokeWidth={6} fill="none" opacity={(1 - p) * 0.9} />;
          })}
          <g transform={`translate(970,${SURFACE + 55})`}>
            <circle r={18} fill="#2a0e0b" stroke="#ff3b2a" strokeWidth={4} />
            <path d="M-9,-9 L9,9 M9,-9 L-9,9" stroke="#ff3b2a" strokeWidth={4} />
          </g>
        </g>
      ) : null}

      {/* ---- LIVING: bunk, table, locker (furniture & security) */}
      {b.furn > 0 ? (
        <g transform={`translate(0,${drop(b.furn * 1.5)})`}>
          <rect x={R.living.x0 + 30} y={R.living.y0 + 70} width={150} height={20} fill="#6b5a44" {...thin} />
          <rect x={R.living.x0 + 30} y={R.living.y1 - 70} width={150} height={20} fill="#6b5a44" {...thin} />
          <rect x={R.living.x0 + 40} y={R.living.y0 + 52} width={60} height={20} rx={8} fill="#ece6d4" {...thin} />
          <rect x={R.living.x0 + 40} y={R.living.y1 - 88} width={60} height={20} rx={8} fill="#ece6d4" {...thin} />
          <line x1={R.living.x0 + 34} y1={R.living.y0 + 70} x2={R.living.x0 + 34} y2={R.living.y1} stroke="#4a3a2c" strokeWidth={8} />
          <line x1={R.living.x0 + 176} y1={R.living.y0 + 70} x2={R.living.x0 + 176} y2={R.living.y1} stroke="#4a3a2c" strokeWidth={8} />
          <rect x={R.living.x0 + 250} y={R.living.y1 - 70} width={110} height={12} fill="#6b5a44" {...thin} />
          <line x1={R.living.x0 + 262} y1={R.living.y1 - 60} x2={R.living.x0 + 262} y2={R.living.y1} stroke="#4a3a2c" strokeWidth={6} />
          <line x1={R.living.x0 + 348} y1={R.living.y1 - 60} x2={R.living.x0 + 348} y2={R.living.y1} stroke="#4a3a2c" strokeWidth={6} />
          <rect x={R.living.x1 - 46} y={R.living.y0 + 60} width={36} height={R.living.y1 - R.living.y0 - 60} fill="#3c4a3e" {...thin} />
          <rect x={R.living.x1 - 40} y={R.living.y0 + 90} width={12} height={10} fill="#58d68d" />
        </g>
      ) : null}

      {/* ---- MED */}
      {b.med > 0 ? (
        <g>
          <rect x={R.med.x0 + 20} y={R.med.y0 + 40} width={124} height={R.med.y1 - R.med.y0 - 40} fill="#e8ebe4" {...thin} />
          <rect x={R.med.x0 + 70} y={R.med.y0 + 55} width={24} height={60} fill={C.alertRed} />
          <rect x={R.med.x0 + 52} y={R.med.y0 + 73} width={60} height={24} fill={C.alertRed} />
          {[0, 1, 2].map((row) => [0, 1, 2].map((c) => {
            const k = row * 3 + c;
            const p = clamp01(b.med * 9 - k);
            return <rect key={k} x={R.med.x0 + 30 + c * 38} y={R.med.y0 + 130 + row * 32 + drop(p, 60)} width={30} height={24} fill={k % 2 ? "#f2efe6" : "#d9e7f0"} {...thin} strokeWidth={2} opacity={p > 0 ? 1 : 0} />;
          }))}
        </g>
      ) : null}

      {/* ---- PANTRY: shelves filling with food */}
      {b.concrete >= 1 && (b.food > 0 || b.finish > 0) ? (
        <g>
          {[0, 1, 2, 3].map((s) => <rect key={s} x={R.pantry.x0 + 20} y={R.pantry.y0 + 60 + s * 50} width={234} height={8} fill="#4a3a2c" />)}
          {[0, 1, 2].map((s) => Array.from({ length: 9 }).map((_, c) => {
            const k = s * 9 + c;
            const p = clamp01(b.food * 27 - k * 0.9);
            const col = ["#d9b13a", C.alertRed, "#6e9a52", "#c97a3a"][(k * 7) % 4];
            return <rect key={k} x={R.pantry.x0 + 26 + c * 25} y={R.pantry.y0 + 70 + s * 50 + drop(p, 50) + 6} width={20} height={34} rx={3} fill={col} {...thin} strokeWidth={2} opacity={p > 0 ? 1 : 0} />;
          }))}
        </g>
      ) : null}

      {/* ---- BATTERIES */}
      {b.battery > 0 ? (
        <g>
          {[0, 1].map((rack) => (
            <g key={rack} transform={`translate(0,${drop(clamp01(b.battery * 2 - rack * 0.4), 100)})`}>
              <rect x={R.battery.x0 + 24 + rack * 120} y={R.battery.y0 + 40} width={100} height={R.battery.y1 - R.battery.y0 - 40} fill="#2f3337" {...thin} />
              {[0, 1, 2, 3, 4].map((i) => {
                const charge = clamp01(b.battery * 2.2 - 0.6 - i * 0.12);
                return (
                  <g key={i}>
                    <rect x={R.battery.x0 + 34 + rack * 120} y={R.battery.y0 + 52 + i * 36} width={80} height={28} rx={3} fill="#4a4f55" {...thin} strokeWidth={2} />
                    <rect x={R.battery.x0 + 38 + rack * 120} y={R.battery.y0 + 58 + i * 36} width={60 * charge} height={16} fill="#58d68d" />
                  </g>
                );
              })}
            </g>
          ))}
          <text x={(R.battery.x0 + R.battery.x1) / 2} y={R.battery.y0 + 34} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={13} fill="#58d68d" opacity={sub(b.battery, 0.6, 1)}>STORAGE 96%</text>
        </g>
      ) : null}

      {/* ---- GENERATOR inside an isolated technical room */}
      {b.gen > 0 ? (
        <g>
          <rect x={R.gen.x0 + 14} y={R.gen.y0 + 26} width={R.gen.x1 - R.gen.x0 - 28} height={R.gen.y1 - R.gen.y0 - 26} fill="#3a3c38" stroke="#d8b24a" strokeWidth={6} opacity={clamp01(b.gen * 3)} />
          <rect x={R.gen.x0 + 26} y={R.gen.y0 + 38} width={R.gen.x1 - R.gen.x0 - 52} height={R.gen.y1 - R.gen.y0 - 50} fill="none" stroke="#8a8f94" strokeWidth={4} strokeDasharray="10 6" opacity={clamp01(b.gen * 3 - 0.5)} />
          <g transform={`translate(${genShake},${drop(clamp01(b.gen * 1.8 - 0.4), 140)})`}>
            {[0, 1, 2].map((i) => <path key={i} d={`M${R.gen.x0 + 70 + i * 50},${R.gen.y1 - 12} l-8,-6 l16,-6 l-16,-6 l8,-6`} stroke="#9aa1a8" strokeWidth={3} fill="none" />)}
            <rect x={R.gen.x0 + 50} y={R.gen.y1 - 120} width={150} height={84} rx={8} fill="#d9a53a" {...thin} />
            <rect x={R.gen.x0 + 64} y={R.gen.y1 - 106} width={56} height={34} fill="#2a2824" />
            <circle cx={R.gen.x0 + 160} cy={R.gen.y1 - 78} r={20} fill="#5a4a2a" {...thin} />
            <path d={`M${R.gen.x0 + 180},${R.gen.y1 - 120} L${R.gen.x0 + 180},${R.gen.y0 + 26}`} stroke="#6d6a60" strokeWidth={14} />
          </g>
          <text x={(R.gen.x0 + R.gen.x1) / 2} y={R.gen.y0 + 22} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={13} fill="#e0b34a" opacity={sub(b.gen, 0.7, 1)}>ISOLATED · ANTI-VIBRATION</text>
        </g>
      ) : null}

      {/* ---- WATER: tanks filling + filter */}
      {b.water > 0 ? (
        <g>
          {[0, 1].map((k) => {
            const x = R.water.x0 + 24 + k * 120;
            const lvl = clamp01(b.water * 1.6 - 0.3 - k * 0.15);
            const h = R.water.y1 - R.water.y0 - 60;
            return (
              <g key={k} transform={`translate(0,${drop(clamp01(b.water * 3 - k * 0.3), 100)})`}>
                <rect x={x} y={R.water.y0 + 50} width={104} height={h} rx={24} fill="#22303a" {...thin} />
                <clipPath id={`wt${k}`}><rect x={x} y={R.water.y0 + 50} width={104} height={h} rx={24} /></clipPath>
                <rect clipPath={`url(#wt${k})`} x={x} y={R.water.y0 + 50 + h * (1 - lvl) + Math.sin(frame / 5 + k) * 2} width={104} height={h} fill="url(#spWater)" />
                <rect x={x} y={R.water.y0 + 50} width={104} height={h} rx={24} fill="none" {...thin} />
              </g>
            );
          })}
          <g opacity={clamp01(b.water * 2 - 0.6)}>
            <rect x={R.water.x1 - 70} y={R.water.y0 + 60} width={44} height={110} rx={10} fill="#d8ddd2" {...thin} />
            <rect x={R.water.x1 - 64} y={R.water.y0 + 74} width={32} height={20} fill="#5fb4ff" />
            {[0, 1, 2].map((i) => <rect key={i} x={R.water.x1 - 78 + i * 22} y={R.water.y1 - 52} width={18} height={40} rx={4} fill="#9fd2ff" {...thin} strokeWidth={2} />)}
          </g>
        </g>
      ) : null}

      {/* ---- finish: cable trays, stencils */}
      {b.finish > 0 ? (
        <g opacity={b.finish}>
          <text x={540} y={shellBot - 8} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={14} fill="#d8d4c4" letterSpacing={6}>SILENCE PROTOCOL · SUBLEVEL 1 · −12 M</text>
          {[R.airlock, R.command, R.vent].map((r, i) => <line key={i} x1={r.x0 + 4} y1={r.y0 + 8} x2={r.x1 - 4} y2={r.y0 + 8} stroke="#2a2824" strokeWidth={6} />)}
        </g>
      ) : null}

      {/* outside noise hitting the insulated wall (demo) */}
      {noiseDemo > 0 ? (
        <g opacity={noiseDemo}>
          {Array.from({ length: 4 }).map((_, i) => {
            const p = (t * 0.8 + i / 4) % 1;
            const x = -60 + p * 160;
            return <path key={i} d={`M${x},920 Q${x + 30},1000 ${x},1080`} stroke="#ff3b2a" strokeWidth={8} fill="none" opacity={(1 - p) * (x > 80 ? 0 : 1)} />;
          })}
          <g transform="translate(40,880)">
            <circle r={18} fill="#2a0e0b" stroke="#ff3b2a" strokeWidth={4} />
            <path d="M-9,-9 L9,9 M9,-9 L-9,9" stroke="#ff3b2a" strokeWidth={4} />
          </g>
        </g>
      ) : null}
    </g>
  );
};

/** Close-up of an insulated wall section: layers slide in one after another; red noise is stopped. */
export const InsulationWall: React.FC<{ t: number }> = ({ t }) => {
  const frame = useCurrentFrame();
  const layers: [string, string, number][] = [
    ["REINFORCED CONCRETE", "#8d8a7b", 140],
    ["ACOUSTIC FOAM", "#d8b24a", 90],
    ["MASS-LOADED BARRIER", "#5a5f64", 60],
    ["DECOUPLED PANEL", "#a9a597", 70],
  ];
  let x = 0;
  return (
    <g>
      <rect width={1080} height={1920} fill="#3a2a1d" />
      {Array.from({ length: 30 }).map((_, i) => <ellipse key={i} cx={random(`iwx${i}`) * 220} cy={300 + random(`iwy${i}`) * 1400} rx={10} ry={7} fill="#4a3727" />)}
      <rect x={220} y={0} width={860} height={1920} fill="#58554c" />
      <ellipse cx={760} cy={900} rx={560} ry={700} fill="url(#spWarm)" opacity={0.35} />
      {layers.map(([name, col, w], i) => {
        const p = ease(clamp01(t * 4.2 - i * 0.9));
        const lx = 220 + x;
        x += w;
        return (
          <g key={name} transform={`translate(0,${(1 - p) * -1500})`}>
            <rect x={lx} y={0} width={w} height={1920} fill={col} {...ink} />
            {i === 1 ? Array.from({ length: 30 }).map((_, k) => <path key={k} d={`M${lx + 8},${k * 64 + 300} q${w / 4},-24 ${w / 2 - 8},0 t${w / 2 - 8},0`} stroke="#b8922e" strokeWidth={5} fill="none" />) : null}
            <text transform={`translate(${lx + w / 2 + 10},${1300}) rotate(-90)`} fontFamily={FONT.mono} fontWeight={800} fontSize={26} fill={i === 2 ? "#e8e8e8" : C.ink} letterSpacing={3}>{name}</text>
          </g>
        );
      })}
      {/* noise from outside, stopped at the first layers */}
      {Array.from({ length: 5 }).map((_, i) => {
        const p = ((frame / 30) * 0.7 + i / 5) % 1;
        const nx = -40 + p * 420;
        const stop = 220 + 140 + 45;
        const op = nx < stop ? 1 : 0;
        return <path key={i} d={`M${nx},700 Q${nx + 60},900 ${nx},1100`} stroke="#ff3b2a" strokeWidth={14} fill="none" opacity={op * (1 - p * 0.5)} />;
      })}
      <g transform="translate(600,560)" opacity={clamp01(t * 3 - 2)}>
        <rect x={-10} y={-50} width={420} height={80} rx={10} fill="rgba(7,10,11,0.85)" stroke="#58d68d" strokeWidth={3} />
        <text x={200} y={2} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={30} fill="#58d68d">OUTSIDE NOISE: BLOCKED</text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- SCENE 4

/** Long pantry aisle: shelves packed with cans, jars and boxes. `scroll` pans the shelves. */
export const Pantry: React.FC<{ scroll?: number }> = ({ scroll = 0 }) => {
  const W = 2400;
  return (
    <g>
      <rect width={1080} height={1920} fill="#46443d" />
      <g transform={`translate(${-scroll},0)`}>
        {Array.from({ length: 6 }).map((_, u) => {
          const x0 = u * 420 + 20;
          return (
            <g key={u}>
              <rect x={x0} y={420} width={400} height={1240} fill="#3a2c20" {...ink} />
              {[0, 1, 2, 3, 4].map((s) => (
                <g key={s}>
                  <rect x={x0} y={600 + s * 210} width={400} height={20} fill="#2a1f16" {...thin} />
                  {Array.from({ length: 7 }).map((_, c) => {
                    const k = u * 100 + s * 10 + c;
                    const kind = Math.floor(random(`pk${k}`) * 4);
                    const col = ["#d9b13a", C.alertRed, "#6e9a52", "#c97a3a", "#8fa9c2"][Math.floor(random(`pc${k}`) * 5)];
                    const cx = x0 + 14 + c * 55;
                    const by = 600 + s * 210;
                    return kind === 0 ? (
                      <g key={c}><rect x={cx} y={by - 150} width={48} height={150} fill="#c9a86a" {...thin} /><rect x={cx + 6} y={by - 110} width={36} height={30} fill="#f0ead8" /></g>
                    ) : kind === 1 ? (
                      <g key={c}><rect x={cx + 2} y={by - 66} width={44} height={66} rx={5} fill={col} {...thin} /><rect x={cx + 2} y={by - 46} width={44} height={22} fill="#f0ead8" /><rect x={cx + 2} y={by - 136} width={44} height={66} rx={5} fill={col} {...thin} /><rect x={cx + 2} y={by - 116} width={44} height={22} fill="#f0ead8" /></g>
                    ) : kind === 2 ? (
                      <g key={c}><rect x={cx + 4} y={by - 100} width={40} height={100} rx={12} fill="#b9d6c4" {...thin} opacity={0.9} /><rect x={cx + 10} y={by - 112} width={28} height={14} fill="#6b5a44" {...thin} /></g>
                    ) : (
                      <g key={c}><rect x={cx} y={by - 120} width={50} height={120} fill={col} {...thin} /><text x={cx + 25} y={by - 50} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={14} fill="#130f0b">MRE</text></g>
                    );
                  })}
                </g>
              ))}
              <rect x={x0 + 150} y={1440} width={100} height={30} fill="#e0b34a" {...thin} />
              <text x={x0 + 200} y={1462} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={18} fill="#130f0b">{["A1", "A2", "A3", "B1", "B2", "B3"][u]}</text>
            </g>
          );
        })}
        <rect x={0} y={1660} width={W} height={300} fill="#2a2824" />
      </g>
      {Array.from({ length: 3 }).map((_, i) => <ellipse key={i} cx={180 + i * 360} cy={420} rx={300} ry={700} fill="url(#spWarm)" opacity={0.25} />)}
      <line x1={0} y1={1660} x2={1080} y2={1660} {...ink} strokeWidth={6} />
    </g>
  );
};

/** Water room: racks of drinking water jugs (left) and two huge technical tanks with filters. */
export const WaterRoom: React.FC<{ drink: number; tech: number; focus: "drink" | "tech" }> = ({ drink, tech, focus }) => {
  const frame = useCurrentFrame();
  return (
    <g>
      <rect width={1080} height={1920} fill="#3f4544" />
      {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={300 + i * 120} x2={1080} y2={300 + i * 120} stroke="#383d3c" strokeWidth={4} />)}
      {focus === "drink" ? (
        <g>
          {[0, 1, 2, 3].map((s) => (
            <g key={s}>
              <rect x={60} y={720 + s * 230} width={960} height={18} fill="#6b7076" {...thin} />
              {Array.from({ length: 10 }).map((_, c) => {
                const k = s * 10 + c;
                const on = drink * 40 > k;
                return on ? (
                  <g key={c}>
                    <rect x={80 + c * 93} y={720 + s * 230 - 170} width={80} height={170} rx={16} fill="#8cc4ee" {...thin} opacity={0.92} />
                    <rect x={104 + c * 93} y={720 + s * 230 - 190} width={32} height={24} fill="#2d5f91" {...thin} />
                    <rect x={80 + c * 93} y={720 + s * 230 - 110} width={80} height={36} fill="#e8f3fb" opacity={0.7} />
                  </g>
                ) : null;
              })}
            </g>
          ))}
          <rect x={60} y={1640} width={960} height={20} fill="#6b7076" />
        </g>
      ) : (
        <g>
          {[0, 1].map((k) => {
            const x = 90 + k * 470;
            const h = 1100;
            const lvl = tech;
            return (
              <g key={k}>
                <rect x={x} y={460} width={430} height={h} rx={70} fill="#22303a" {...ink} />
                <clipPath id={`tk${k}`}><rect x={x} y={460} width={430} height={h} rx={70} /></clipPath>
                <g clipPath={`url(#tk${k})`}>
                  <rect x={x} y={460 + h * (1 - lvl)} width={430} height={h} fill="url(#spWater)" />
                  <path d={`M${x},${460 + h * (1 - lvl)} ${Array.from({ length: 9 }).map((_, i) => `Q${x + i * 50 + 25},${460 + h * (1 - lvl) + Math.sin(frame / 6 + i) * 10} ${x + (i + 1) * 50},${460 + h * (1 - lvl)}`).join(" ")}`} stroke="#bfe2ff" strokeWidth={6} fill="none" />
                </g>
                <rect x={x} y={460} width={430} height={h} rx={70} fill="none" {...ink} strokeWidth={8} />
                {[0.25, 0.5, 0.75].map((m) => <line key={m} x1={x + 380} y1={460 + h * m} x2={x + 420} y2={460 + h * m} stroke="#e8e8e8" strokeWidth={5} />)}
                <text x={x + 215} y={560} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={30} fill="#d9e3dc">T-0{k + 1} · 6,000 L</text>
              </g>
            );
          })}
          {/* filter line */}
          <rect x={60} y={1600} width={960} height={36} fill="#7d8389" {...thin} />
          {[300, 540, 780].map((x) => <rect key={x} x={x - 40} y={1530} width={80} height={130} rx={14} fill="#d8ddd2" {...thin} />)}
          {Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={60 + (((frame * 6 + i * 96) % 960))} cy={1618} r={7} fill="#9fe6ff" />)}
        </g>
      )}
      <rect y={1660} width={1080} height={300} fill="#262a29" />
      <line x1={0} y1={1660} x2={1080} y2={1660} {...ink} strokeWidth={6} />
    </g>
  );
};

// ---------------------------------------------------------------- SCENE 5

/** Surveillance room: monitor wall (right), desk + chair; outside feed shows a figure at the hatch. */
export const ControlRoom: React.FC<{ alarm?: number; figure?: number }> = ({ alarm = 0, figure = 1 }) => {
  const frame = useCurrentFrame();
  const red = alarm * (0.5 + 0.5 * Math.sin(frame / 4));
  return (
    <g>
      <rect width={1080} height={1920} fill="#1f2422" />
      {Array.from({ length: 16 }).map((_, i) => <line key={i} x1={0} y1={260 + i * 90} x2={1080} y2={260 + i * 90} stroke="#252b29" strokeWidth={4} />)}
      {/* monitor wall */}
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => {
        const x = 330 + c * 240;
        const y = 560 + r * 170;
        const id = r * 3 + c;
        return (
          <g key={id}>
            <rect x={x} y={y} width={225} height={155} fill="#0b100f" {...ink} />
            <rect x={x + 8} y={y + 8} width={209} height={139} fill={id === 4 ? "#3a0f0c" : "#16241f"} />
            {id === 4 ? (
              <g>
                <text x={x + 112} y={y + 60} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={18} fill="#ff6a5a">EXT MIC 01</text>
                {Array.from({ length: 22 }).map((_, k) => {
                  const a = 6 + Math.abs(Math.sin(frame / 3 + k * 0.9)) * 34 * (0.4 + random(`wv${k}-${Math.floor(frame / 3)}`) * 0.6);
                  return <rect key={k} x={x + 18 + k * 9} y={y + 100 - a / 2} width={5} height={a} fill="#ff4a3a" />;
                })}
              </g>
            ) : (
              <g opacity={0.85}>
                <rect x={x + 8} y={y + 110} width={209} height={37} fill="#0f1a16" />
                <line x1={x + 8} y1={y + 110} x2={x + 217} y2={y + 95} stroke="#2f4a3e" strokeWidth={4} />
                {id === 1 && figure > 0 ? (
                  <g>
                    <rect x={x + 140} y={y + 60} width={40} height={50} fill="#4c5a52" />
                    <circle cx={x + 90 + Math.sin(frame / 40) * 4} cy={y + 58} r={10} fill="#0a0f0d" />
                    <rect x={x + 85 + Math.sin(frame / 40) * 4} y={y + 66} width={10} height={40} fill="#0a0f0d" />
                  </g>
                ) : null}
                <text x={x + 14} y={y + 26} fontFamily={FONT.mono} fontWeight={800} fontSize={14} fill="#7fd6a0">CAM 0{id + 1}</text>
                <circle cx={x + 205} cy={y + 20} r={5} fill={C.alertRed} opacity={Math.floor(frame / 12) % 2} />
              </g>
            )}
            {Array.from({ length: 16 }).map((_, k) => <line key={k} x1={x + 8} y1={y + 10 + k * 9} x2={x + 217} y2={y + 10 + k * 9} stroke="#000" strokeWidth={2} opacity={0.25} />)}
          </g>
        );
      }))}
      <ellipse cx={570} cy={830} rx={520} ry={420} fill="url(#spGreen)" opacity={0.18} />
      <ellipse cx={570} cy={830} rx={620} ry={520} fill="url(#spRed)" opacity={red} />
      {/* desk */}
      <rect x={220} y={1230} width={860} height={34} fill="#4a3a2c" {...ink} />
      <rect x={980} y={1264} width={40} height={396} fill="#3a2c20" {...ink} />
      <rect x={560} y={1150} width={200} height={80} rx={6} fill="#2a2f2c" {...ink} />
      {/* speaker icon, crossed out (playback disabled) */}
      <g transform="translate(860,1170)">
        <rect x={-6} y={-6} width={110} height={60} rx={8} fill="#0b100f" {...thin} />
        <path d="M10,12 L22,12 L36,0 L36,48 L22,36 L10,36Z" fill="#ff4a3a" />
        <path d="M52,8 L84,40 M84,8 L52,40" stroke="#ff4a3a" strokeWidth={6} strokeLinecap="round" />
      </g>
      {/* chair */}
      <rect x={140} y={1290} width={190} height={26} rx={8} fill="#2a2f2c" {...ink} />
      <rect x={110} y={1080} width={34} height={236} rx={10} fill="#2a2f2c" {...ink} />
      <line x1={235} y1={1316} x2={235} y2={1600} stroke={C.ink} strokeWidth={14} />
      <path d="M160,1620 L310,1620" stroke={C.ink} strokeWidth={14} strokeLinecap="round" />
      <rect y={1660} width={1080} height={300} fill="#151917" />
      <line x1={0} y1={1660} x2={1080} y2={1660} {...ink} strokeWidth={6} />
    </g>
  );
};

// ---------------------------------------------------------------- SCENE 6

/** Futuristic equipment room with two illuminated display platforms. a/b = light level 0..1. */
export const EquipRoom: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const frame = useCurrentFrame();
  const plat = (x: number, lvl: number, col: string, beam: string, pool: string, letter: string) => (
    <g>
      <ellipse cx={x} cy={1000} rx={360} ry={620} fill={`url(#${pool})`} opacity={0.6 * lvl} />
      <polygon points={`${x - 150},300 ${x + 150},300 ${x + 170},1440 ${x - 170},1440`} fill={`url(#${beam})`} opacity={lvl * (0.9 + 0.1 * Math.sin(frame / 7))} />
      <ellipse cx={x} cy={1470} rx={190} ry={44} fill="#1b2024" {...ink} />
      <rect x={x - 190} y={1470} width={380} height={70} fill="#1b2024" />
      <ellipse cx={x} cy={1540} rx={190} ry={44} fill="#121518" {...ink} />
      <line x1={x - 190} y1={1470} x2={x - 190} y2={1540} {...ink} />
      <line x1={x + 190} y1={1470} x2={x + 190} y2={1540} {...ink} />
      <ellipse cx={x} cy={1470} rx={170} ry={36} fill="none" stroke={col} strokeWidth={8} opacity={0.3 + 0.7 * lvl} />
      <rect x={x - 34} y={1505} width={68} height={30} rx={4} fill={col} opacity={0.25 + 0.75 * lvl} />
      <text x={x} y={1530} textAnchor="middle" fontFamily={FONT.title} fontSize={28} fill="#0b0f12">{letter}</text>
    </g>
  );
  return (
    <g>
      <rect width={1080} height={1920} fill="#0f1215" />
      {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={i * 130 - 20} y={260} width={110} height={1300} fill="#13171b" stroke="#1a1f24" strokeWidth={3} />)}
      {Array.from({ length: 9 }).map((_, i) => <rect key={`l${i}`} x={i * 130 + 30} y={300} width={10} height={1180} fill="#1f2a32" />)}
      <rect y={1560} width={1080} height={400} fill="#0b0d0f" />
      <line x1={0} y1={1560} x2={1080} y2={1560} stroke="#2a3138" strokeWidth={6} />
      {Array.from({ length: 8 }).map((_, i) => <line key={i} x1={540} y1={1560} x2={-400 + i * 270} y2={1920} stroke="#161a1e" strokeWidth={4} />)}
      {plat(280, a, "#5fb4ff", "spBeamBlue", "spBlue", "A")}
      {plat(800, b, "#58d68d", "spBeamGreen", "spGreen", "B")}
    </g>
  );
};

/** THE SILENT FIELD device: compact emitter (cylinder core, blue rings). x,y = base center. */
export const SilentFieldDevice: React.FC<{ x: number; y: number; scale?: number; on?: number; spin?: number }> = ({ x, y, scale = 1, on = 1, spin = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <ellipse cx={0} cy={0} rx={110} ry={26} fill="#2b3238" {...ink} />
    <rect x={-80} y={-170} width={160} height={170} fill="#3b444c" />
    <line x1={-80} y1={-170} x2={-80} y2={0} {...ink} />
    <line x1={80} y1={-170} x2={80} y2={0} {...ink} />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={0} cy={-40 - i * 50} rx={84} ry={18} fill="none" stroke="#5fb4ff" strokeWidth={8} opacity={0.35 + 0.65 * on * (0.6 + 0.4 * Math.sin(spin * 3 + i))} />)}
    <ellipse cx={0} cy={-170} rx={80} ry={20} fill="#4a555e" {...ink} />
    <rect x={-22} y={-260} width={44} height={92} rx={18} fill="#bfe2ff" {...ink} opacity={0.4 + 0.6 * on} />
    <circle cx={0} cy={-264} r={70} fill="url(#spBlue)" opacity={on} />
    <rect x={-60} y={-120} width={36} height={14} fill="#0b0f12" />
    <text x={30} y={-106} fontFamily={FONT.mono} fontWeight={800} fontSize={14} fill="#bfe2ff" textAnchor="middle">SF-60</text>
  </g>
);

/** THE GHOST ECHO drone: quadcopter with a speaker array. x,y = body center. */
export const GhostEchoDrone: React.FC<{ x: number; y: number; scale?: number; rotor?: number; on?: number; tilt?: number }> = ({ x, y, scale = 1, rotor = 0, on = 1, tilt = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${tilt}) scale(${scale})`}>
    {[-1, 1].map((s) => (
      <g key={s}>
        <line x1={0} y1={0} x2={s * 150} y2={-40} stroke={C.ink} strokeWidth={22} strokeLinecap="round" />
        <line x1={0} y1={0} x2={s * 150} y2={-40} stroke="#3b444c" strokeWidth={12} strokeLinecap="round" />
        <rect x={s * 150 - 10} y={-64} width={20} height={30} fill="#2b3238" {...thin} />
        <ellipse cx={s * 150} cy={-66} rx={rotor > 0.05 ? 95 : 80} ry={rotor > 0.05 ? 10 : 7} fill={rotor > 0.05 ? "rgba(200,220,230,0.35)" : "#8f969b"} stroke={C.ink} strokeWidth={rotor > 0.05 ? 0 : 3} />
        {rotor > 0.05 ? <line x1={s * 150 - 90 * Math.cos(rotor * 40)} y1={-66} x2={s * 150 + 90 * Math.cos(rotor * 40)} y2={-66} stroke="#c8d2d8" strokeWidth={5} opacity={0.7} /> : null}
      </g>
    ))}
    <path d="M-90,-20 Q-90,-60 -40,-60 L40,-60 Q90,-60 90,-20 L70,40 L-70,40Z" fill="#2b3238" {...ink} />
    <rect x={-60} y={-8} width={120} height={36} rx={10} fill="#11161a" {...thin} />
    {Array.from({ length: 7 }).map((_, i) => <circle key={i} cx={-48 + i * 16} cy={10} r={5} fill={on > 0.5 ? "#58d68d" : "#2a3a30"} />)}
    <circle cx={0} cy={-34} r={12} fill={on > 0.5 ? "#58d68d" : "#2a3a30"} {...thin} />
    <circle cx={0} cy={10} r={90} fill="url(#spGreen)" opacity={on * 0.7} />
  </g>
);

// ---------------------------------------------------------------- EP02: THE OUTBREAK (new sets, same palette/ink)

/** Rough continents on a 100x50 grid (equirectangular-ish), scaled ×10 into a 1000x500 map. */
const CONTINENTS: [number, number][][] = [
  [[5, 8], [14, 5], [28, 4], [35, 8], [32, 14], [27, 18], [24, 24], [20, 27], [17, 24], [12, 18], [6, 14]],
  [[34, 3], [40, 2], [41, 6], [36, 8]],
  [[24, 27], [30, 28], [35, 32], [33, 38], [29, 45], [27, 46], [26, 40], [24, 33]],
  [[45, 9], [52, 6], [56, 8], [55, 13], [50, 15], [46, 14]],
  [[45, 18], [55, 17], [60, 22], [59, 30], [55, 38], [51, 39], [48, 30], [44, 24]],
  [[55, 6], [70, 4], [88, 6], [95, 10], [90, 16], [84, 22], [78, 25], [72, 24], [66, 22], [60, 18], [56, 13]],
  [[80, 27], [86, 28], [84, 30]],
  [[80, 34], [89, 33], [92, 38], [88, 42], [81, 40]],
];
/** Infection clusters [x, y, appear-at (0..1 of spread)]: no single origin is marked (Patient Zero's location is not canon). */
const CLUSTERS: [number, number, number][] = [
  [50, 11, 0], [20, 12, 0.08], [75, 12, 0.1], [52, 9, 0.15], [27, 10, 0.2], [62, 14, 0.22], [85, 10, 0.25], [48, 20, 0.3], [30, 31, 0.33], [16, 16, 0.36],
  [70, 20, 0.4], [55, 28, 0.44], [86, 36, 0.47], [24, 20, 0.5], [80, 16, 0.53], [44, 12, 0.56], [66, 8, 0.6], [32, 40, 0.62], [52, 34, 0.65], [90, 8, 0.68],
  [12, 9, 0.7], [58, 20, 0.73], [76, 24, 0.76], [28, 36, 0.78], [47, 26, 0.8], [82, 28, 0.83], [38, 6, 0.86], [60, 10, 0.88], [22, 25, 0.9], [88, 40, 0.93],
];

/** Dark world map: red infection spreads with `spread` 0..1. x,y = top-left, w = width (height = w/2). */
export const WorldMap: React.FC<{ x: number; y: number; w: number; spread: number }> = ({ x, y, w, spread }) => {
  const frame = useCurrentFrame();
  const k = w / 1000;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      <rect width={1000} height={500} rx={14} fill="#0b0d0f" {...ink} strokeWidth={6} />
      {Array.from({ length: 9 }).map((_, i) => <line key={`v${i}`} x1={(i + 1) * 100} y1={0} x2={(i + 1) * 100} y2={500} stroke="#151a1d" strokeWidth={3} />)}
      {Array.from({ length: 4 }).map((_, i) => <line key={`h${i}`} x1={0} y1={(i + 1) * 100} x2={1000} y2={(i + 1) * 100} stroke="#151a1d" strokeWidth={3} />)}
      <clipPath id="wmClip"><rect width={1000} height={500} rx={14} /></clipPath>
      <g clipPath="url(#wmClip)">
        {CONTINENTS.map((c, i) => <polygon key={i} points={c.map(([a, b]) => `${a * 10},${b * 10}`).join(" ")} fill="#2a2f2c" stroke="#3d4642" strokeWidth={4} strokeLinejoin="round" />)}
        {CLUSTERS.map(([cx, cy, at], i) => {
          const g = clamp01((spread - at) / 0.25);
          if (g <= 0) return null;
          const pulse = 0.85 + 0.15 * Math.sin(frame / 4 + i);
          return (
            <g key={i}>
              <circle cx={cx * 10} cy={cy * 10} r={(30 + 90 * g) * pulse} fill="url(#spRed)" opacity={0.9} />
              <circle cx={cx * 10} cy={cy * 10} r={6 + 10 * g} fill="#ff3b2a" />
              {g < 1 ? <circle cx={cx * 10} cy={cy * 10} r={20 + 80 * g} fill="none" stroke="#ff3b2a" strokeWidth={4} opacity={1 - g} /> : null}
            </g>
          );
        })}
      </g>
      {Array.from({ length: 63 }).map((_, i) => <line key={`s${i}`} x1={0} y1={i * 8} x2={1000} y2={i * 8} stroke="#000" strokeWidth={2} opacity={0.2} />)}
    </g>
  );
};

/** Airport terminal at night: departures board (every flight CANCELLED), abandoned luggage. floor 1640. */
export const Airport: React.FC<{ t?: number }> = ({ t = 1 }) => {
  const frame = useCurrentFrame();
  const flights: [string, string, string][] = [
    ["SP 204", "LONDON", "07:40"], ["SP 318", "NEW YORK", "08:15"], ["SP 551", "TOKYO", "08:50"], ["SP 127", "CAIRO", "09:05"],
    ["SP 690", "SYDNEY", "09:30"], ["SP 442", "SAO PAULO", "10:10"], ["SP 873", "MUMBAI", "10:45"], ["SP 019", "TORONTO", "11:20"],
  ];
  const blink = Math.floor(frame / 9) % 2 === 0;
  return (
    <g>
      <rect width={1080} height={1920} fill="#121619" />
      {/* tall windows: dark runway, red glow */}
      {[0, 1, 2, 3].map((i) => <rect key={i} x={40 + i * 255} y={300} width={235} height={330} fill="url(#spSky)" {...thin} />)}
      <circle cx={880} cy={640} r={260} fill="url(#spRed)" opacity={0.45} />
      <rect x={40} y={560} width={1000} height={70} fill="#0d0a0b" />
      <rect x={0} y={630} width={1080} height={14} fill="#2a3036" />
      {/* departures board */}
      <rect x={70} y={700} width={940} height={600} rx={10} fill="#0a0c0d" {...ink} strokeWidth={8} />
      <text x={100} y={765} fontFamily={FONT.title} fontSize={52} fill="#e8e2c8" letterSpacing={4}>DEPARTURES</text>
      <text x={980} y={765} textAnchor="end" fontFamily={FONT.mono} fontWeight={800} fontSize={26} fill="#7f8f86">ALL GATES CLOSED</text>
      <line x1={90} y1={790} x2={990} y2={790} stroke="#25352d" strokeWidth={3} />
      {flights.map(([f, d, tm], i) => {
        const yy = 845 + i * 56;
        const on = clamp01(t * 10 - i);
        return (
          <g key={f}>
            <text x={100} y={yy} fontFamily={FONT.mono} fontWeight={800} fontSize={30} fill="#d9d2b0">{tm}</text>
            <text x={230} y={yy} fontFamily={FONT.mono} fontWeight={800} fontSize={30} fill="#d9d2b0">{f}</text>
            <text x={400} y={yy} fontFamily={FONT.mono} fontWeight={800} fontSize={30} fill="#d9d2b0">{d}</text>
            <rect x={760} y={yy - 32} width={220} height={42} fill={on > 0.5 ? (blink ? "#b8261f" : "#7a1a14") : "#1a2a22"} />
            <text x={870} y={yy - 2} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={26} fill="white">{on > 0.5 ? "CANCELLED" : "ON TIME"}</text>
          </g>
        );
      })}
      {Array.from({ length: 74 }).map((_, i) => <line key={i} x1={74} y1={704 + i * 8} x2={1006} y2={704 + i * 8} stroke="#000" strokeWidth={2} opacity={0.22} />)}
      {/* floor + abandoned luggage */}
      <rect y={1640} width={1080} height={280} fill="#0c0f11" />
      <line x1={0} y1={1640} x2={1080} y2={1640} {...ink} strokeWidth={6} />
      {Array.from({ length: 6 }).map((_, i) => <line key={`f${i}`} x1={540} y1={1640} x2={-300 + i * 340} y2={1920} stroke="#161b1e" strokeWidth={4} />)}
      <g transform="translate(150,1560) rotate(-8)">
        <rect width={110} height={80} rx={10} fill="#3b4a5a" {...ink} />
        <path d="M35,0 L35,-26 L75,-26 L75,0" fill="none" {...ink} strokeWidth={6} />
      </g>
      <g transform="translate(860,1600) rotate(78)">
        <rect width={90} height={60} rx={8} fill="#6b3b33" {...ink} />
      </g>
      <rect x={560} y={1600} width={70} height={40} rx={6} fill="#4a4a3a" {...ink} />
    </g>
  );
};
