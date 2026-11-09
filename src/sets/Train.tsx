import React from "react";
import { random, useCurrentFrame } from "remotion";
import { C, FONT } from "../kit/style";

/** Carriage layout (side cross-section, 1080×1920). */
export const T = {
  floor: 1640,
  seatTop: 1526, // cushion top — a seated Stick with floor=T.floor rests here
  door: { x0: 540, x1: 760, top: 520 },
  crank: { x: 795, y: 1150, r: 30 },
  cab: { x1: 125 },
  windows: [
    [140, 500],
    [800, 1065],
  ] as const,
  winTop: 600,
  winBot: 960,
};

const ink = { stroke: C.ink, strokeWidth: 4.5, strokeLinejoin: "round" as const };

/** Crank handle position for a given turn angle (radians). */
export const crankHandle = (ang: number): [number, number] => [T.crank.x + Math.cos(ang) * T.crank.r, T.crank.y + Math.sin(ang) * T.crank.r];

interface CarriageProps {
  travel: number; // px the train has moved (drives tunnel streaks); freeze it to stop
  lights?: number; // 1 = normal fluorescent, 0 = emergency only
  door?: number; // side door open 0..1
  cab?: number; // cab door open 0..1
  crankAng?: number;
}

/** Subway carriage interior. Everything outside the windows is the black tunnel. */
export const Carriage: React.FC<CarriageProps> = ({ travel, lights = 1, door = 0, cab = 0, crankAng = 0 }) => {
  const frame = useCurrentFrame();
  const { door: D } = T;
  const leaf = 110 * door;
  const tubeOn = lights > 0.5 || random(`flk${Math.floor(frame / 2)}`) < lights;
  return (
    <g>
      <defs>
        {T.windows.map(([a, b], i) => (
          <clipPath key={i} id={`win${i}`}>
            <rect x={a} y={T.winTop} width={b - a} height={T.winBot - T.winTop} rx={26} />
          </clipPath>
        ))}
        <linearGradient id="tubeGlow" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fffbe8" stopOpacity={0.35} />
          <stop offset="1" stopColor="#fffbe8" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* walls */}
      <rect width={1080} height={1920} fill="#cfc9b4" />
      <rect width={1080} height={500} fill="#b9b3a0" />
      <rect y={500} width={1080} height={70} fill="#2d3a4a" {...ink} />
      {[[150, "LINE 4"], [380, "MIND THE DOORS"], [830, "NIGHT SERVICE"]].map(([x, t]) => (
        <g key={String(x)}>
          <rect x={Number(x)} y={512} width={200} height={46} fill="#e9e3cf" {...ink} strokeWidth={3} />
          <text x={Number(x) + 100} y={543} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={18} fill={C.ink}>{t}</text>
        </g>
      ))}
      {/* windows with moving tunnel */}
      {T.windows.map(([a, b], i) => (
        <g key={i}>
          <rect x={a} y={T.winTop} width={b - a} height={T.winBot - T.winTop} rx={26} fill="#0b0d10" {...ink} strokeWidth={8} />
          <g clipPath={`url(#win${i})`}>
            {Array.from({ length: 10 }).map((_, k) => {
              const x = ((k * 260 - travel * 1.0) % 1300 + 1300) % 1300 - 110;
              return <rect key={k} x={x} y={T.winTop + 90 + (k % 3) * 70} width={travel > 0 ? 140 : 40} height={8} rx={4} fill={C.amber} opacity={0.75} />;
            })}
            {Array.from({ length: 3 }).map((_, k) => {
              const x = ((k * 520 - travel * 0.6) % 1560 + 1560) % 1560 - 200;
              return <rect key={`c${k}`} x={x} y={T.winTop + 300} width={260} height={10} fill="#262a30" />;
            })}
          </g>
          <line x1={a + 6} y1={T.winTop + 40} x2={b - 6} y2={T.winTop + 40} stroke="#ffffff" strokeOpacity={0.06} strokeWidth={20} />
        </g>
      ))}
      {/* lower wall + bench backs */}
      <rect y={960} width={1080} height={20} fill="#b4ad98" />
      {[[135, 520], [790, 1080]].map(([a, b]) => (
        <g key={a}>
          <rect x={a} y={1300} width={b - a} height={226} rx={18} fill="#3f6b7a" {...ink} />
          <rect x={a} y={T.seatTop} width={b - a} height={36} rx={12} fill="#4d7c8b" {...ink} />
          <rect x={a + 10} y={T.seatTop + 36} width={b - a - 20} height={T.floor - T.seatTop - 36} fill="#2d4c57" {...ink} />
        </g>
      ))}
      {/* floor */}
      <rect y={T.floor} width={1080} height={280} fill="#4d4740" />
      {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={0} y1={T.floor + 30 + i * 44} x2={1080} y2={T.floor + 30 + i * 44} stroke="#433e38" strokeWidth={4} />)}
      <line x1={0} y1={T.floor} x2={1080} y2={T.floor} {...ink} strokeWidth={6} />
      {/* side door: tunnel behind */}
      <rect x={D.x0} y={D.top} width={D.x1 - D.x0} height={T.floor - D.top} fill="#07080a" />
      <circle cx={(D.x0 + D.x1) / 2 + 30} cy={980} r={10} fill="#ff3a2a" opacity={door} />
      <circle cx={(D.x0 + D.x1) / 2 + 30} cy={980} r={90} fill="url(#redPool)" opacity={door * 0.7} />
      {[0, 1].map((s) => {
        const x = s === 0 ? D.x0 - leaf : (D.x0 + D.x1) / 2 + leaf;
        return (
          <g key={s}>
            <rect x={x} y={D.top} width={(D.x1 - D.x0) / 2} height={T.floor - D.top} fill="#a9a493" {...ink} />
            <rect x={x + 18} y={620} width={(D.x1 - D.x0) / 2 - 36} height={330} rx={10} fill="#0b0d10" {...ink} />
          </g>
        );
      })}
      {/* emergency release crank */}
      <rect x={T.crank.x - 22} y={T.crank.y - 90} width={44} height={150} rx={6} fill={C.alertRed} {...ink} strokeWidth={3} />
      <text x={T.crank.x} y={T.crank.y - 60} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={11} fill="white">EMERG</text>
      <circle cx={T.crank.x} cy={T.crank.y} r={T.crank.r} fill="#8a1d16" {...ink} strokeWidth={3} />
      <line x1={T.crank.x} y1={T.crank.y} x2={crankHandle(crankAng)[0]} y2={crankHandle(crankAng)[1]} stroke="#d9d4c4" strokeWidth={9} strokeLinecap="round" />
      {/* cab door (left end) */}
      <rect x={0} y={D.top} width={T.cab.x1} height={T.floor - D.top} fill="#101318" />
      <rect x={20} y={900} width={70} height={30} fill="#3bd16a" opacity={0.5 * cab} />
      <g transform={`translate(${-cab * 118},0)`}>
        <rect x={0} y={D.top} width={T.cab.x1} height={T.floor - D.top} fill="#9c9786" {...ink} />
        <rect x={22} y={640} width={80} height={140} rx={8} fill="#0b0d10" {...ink} strokeWidth={3} />
        <text x={62} y={840} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={14} fill={C.ink}>CREW</text>
      </g>
      {/* grab poles */}
      {[530, 775].map((x) => <rect key={x} x={x - 7} y={570} width={14} height={T.floor - 570} fill="#c9ccc8" {...ink} strokeWidth={3} />)}
      <rect x={130} y={430} width={950} height={12} fill="#c9ccc8" {...ink} strokeWidth={3} />
      {/* ceiling tubes */}
      {[[150, 500], [800, 1060]].map(([a, b]) => (
        <g key={a}>
          <rect x={a} y={470} width={b - a} height={22} rx={8} fill={tubeOn ? "#fffbe8" : "#6d6a60"} {...ink} strokeWidth={3} />
          {tubeOn ? <rect x={a - 40} y={492} width={b - a + 80} height={420} fill="url(#tubeGlow)" /> : null}
        </g>
      ))}
      {/* emergency red lamp */}
      <rect x={605} y={455} width={90} height={26} rx={6} fill={lights < 1 ? "#ff3a2a" : "#5a1f1a"} {...ink} strokeWidth={3} />
      {lights < 1 ? <circle cx={650} cy={470} r={520} fill="url(#redPool)" opacity={(1 - lights) * 0.6} /> : null}
      {/* overall dimming when the main lights die */}
      <rect width={1080} height={1920} fill="#0a0608" opacity={(1 - lights) * 0.5} />
    </g>
  );
};

/** Eli's silver case (hand at 0,0 holds the handle). */
export const Case: React.FC<{ sticker?: boolean }> = ({ sticker = true }) => (
  <g>
    <path d="M-22,0 v-16 h44 v16" fill="none" stroke="#7d8287" strokeWidth={8} />
    <rect x={-80} y={0} width={160} height={110} rx={10} fill="#c3c8cc" stroke={C.ink} strokeWidth={6} />
    <line x1={-80} y1={42} x2={80} y2={42} stroke="#8d9297" strokeWidth={4} />
    <rect x={-70} y={14} width={22} height={14} fill="#8d9297" />
    <rect x={48} y={14} width={22} height={14} fill="#8d9297" />
    {sticker ? (
      <g>
        <rect x={-52} y={56} width={104} height={40} fill="#e8c23a" stroke={C.ink} strokeWidth={3} />
        <text x={0} y={72} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={11} fill={C.ink}>PROPERTY OF</text>
        <text x={0} y={89} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={11} fill={C.ink}>CIVIL DEFENSE</text>
      </g>
    ) : null}
  </g>
);

/** Mags's flashlight with beam pointing along `dir` (radians, 0 = right). */
export const Flashlight: React.FC<{ dir?: number; on?: boolean }> = ({ dir = 0, on = true }) => (
  <g transform={`rotate(${(dir * 180) / Math.PI})`}>
    {on ? <polygon points="30,-8 700,-170 700,170 30,8" fill="url(#lampCone)" style={{ mixBlendMode: "screen" }} /> : null}
    <rect x={-14} y={-11} width={46} height={22} rx={5} fill="#2a2a2a" stroke={C.ink} strokeWidth={3} />
    <circle cx={32} cy={0} r={on ? 26 : 0} fill="url(#lampGlow)" />
  </g>
);

/** Small phone held in a hand; screen glows red when `alert`. */
export const HandPhone: React.FC<{ alert?: number }> = ({ alert = 0 }) => (
  <g>
    {alert > 0 ? <circle cx={0} cy={-26} r={90} fill="url(#redPool)" opacity={alert} /> : null}
    <rect x={-16} y={-58} width={32} height={58} rx={6} fill="#16181c" stroke={C.ink} strokeWidth={3} />
    <rect x={-12} y={-53} width={24} height={46} rx={3} fill={alert > 0 ? "#e2382a" : "#2b2f36"} opacity={alert > 0 ? 0.6 + 0.4 * alert : 1} />
  </g>
);

/** Line 4 route card: you in the tunnel, Nora nine stops away. `t` reveals the route 0..1. */
export const RouteCard: React.FC<{ t: number }> = ({ t }) => {
  const frame = useCurrentFrame();
  const stops = Array.from({ length: 10 }, (_, i) => [140 + i * 88, 960 + Math.sin(i * 0.7) * 60] as const);
  const pulse = 1 + 0.25 * Math.sin(frame / 4);
  const shown = Math.floor(t * 10);
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <rect x={60} y={620} width={960} height={700} rx={20} fill="#1d2430" stroke={C.ink} strokeWidth={10} />
      <rect x={60} y={620} width={960} height={90} rx={20} fill="#2d3a4a" />
      <text x={110} y={682} fontFamily={FONT.title} fontSize={58} fill="white">LINE 4</text>
            <polyline points={stops.map((s) => s.join(",")).join(" ")} fill="none" stroke={C.amber} strokeWidth={16} strokeLinejoin="round" />
      {stops.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 9 ? 22 : 14} fill={i <= shown ? "white" : "#55606e"} stroke={C.ink} strokeWidth={5} />
      ))}
      <circle cx={(stops[0][0] + stops[1][0]) / 2} cy={(stops[0][1] + stops[1][1]) / 2} r={18 * pulse} fill={C.alertRed} stroke="white" strokeWidth={5} />
      <text x={(stops[0][0] + stops[1][0]) / 2} y={(stops[0][1] + stops[1][1]) / 2 + 70} textAnchor="middle" fontFamily={FONT.title} fontSize={44} fill={C.alertRed}>YOU</text>
      {t > 0.95 ? (
        <g>
          <rect x={stops[9][0] - 40} y={stops[9][1] - 230} width={80} height={170} fill="#6a6f78" stroke={C.ink} strokeWidth={5} />
          {Array.from({ length: 6 }).map((_, k) => <rect key={k} x={stops[9][0] - 26 + (k % 2) * 30} y={stops[9][1] - 215 + Math.floor(k / 2) * 50} width={20} height={26} fill={k === 0 ? C.capYellow : "#3a3f48"} />)}
          <text x={stops[9][0] - 60} y={stops[9][1] - 150} textAnchor="end" fontFamily={FONT.title} fontSize={48} fill={C.capYellow}>NORA · 14F</text>
          <text x={stops[9][0]} y={stops[9][1] + 70} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={22} fill="#9fb0c4">EASTGATE</text>
        </g>
      ) : null}
      <text x={540} y={1270} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={28} fill="#9fb0c4">9 STOPS · NO BASEMENT</text>
    </svg>
  );
};
