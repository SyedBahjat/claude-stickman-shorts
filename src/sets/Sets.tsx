import React from "react";
import { random, useCurrentFrame } from "remotion";
import { AlertScreen } from "../kit/Props";
import { StickDefs } from "../kit/Stick";
import { C, FONT } from "../kit/style";

/** Full-frame SVG wrapper with shared gradients. Children are set + characters. */
export const Svg: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = "#000" }) => (
  <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0, background: bg }}>
    <StickDefs />
    <defs>
      <linearGradient id="tubeGlow2" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#f6fbe8" stopOpacity={0.4} />
        <stop offset="1" stopColor="#f6fbe8" stopOpacity={0} />
      </linearGradient>
      <radialGradient id="warmPool">
        <stop offset="0" stopColor="#ffd98a" stopOpacity={0.5} />
        <stop offset="1" stopColor="#ffd98a" stopOpacity={0} />
      </radialGradient>
      <radialGradient id="redPool">
        <stop offset="0" stopColor="#ff3a24" stopOpacity={0.55} />
        <stop offset="1" stopColor="#ff3a24" stopOpacity={0} />
      </radialGradient>
      <radialGradient id="tvGlowInner">
        <stop offset="0.5" stopColor="#ff6a50" stopOpacity={0} />
        <stop offset="1" stopColor="#5a0d08" stopOpacity={0.55} />
      </radialGradient>
      <linearGradient id="bulbCone" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fff1c4" stopOpacity={0.42} />
        <stop offset="1" stopColor="#fff1c4" stopOpacity={0.04} />
      </linearGradient>
      <linearGradient id="nightSky" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#120e14" />
        <stop offset="0.6" stopColor="#2c1922" />
        <stop offset="1" stopColor="#5b2422" />
      </linearGradient>
    </defs>
    {children}
  </svg>
);

const ink = { stroke: C.ink, strokeWidth: 4.5, strokeLinejoin: "round" as const };

/** Night bedroom. `tv`: 0 = off, 1 = alert on. */
export const Bedroom: React.FC<{ tv?: number; tvCountdown?: string }> = ({ tv = 0, tvCountdown }) => {
  const frame = useCurrentFrame();
  const flick = tv > 0 ? 0.92 + 0.08 * random(`tv${Math.floor(frame / 2)}`) : 0;
  return (
    <g>
      <rect width={1080} height={1200} fill={C.nightWall} />
      {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={i * 200 + 60} y1={0} x2={i * 200 + 60} y2={1200} stroke="#271a1b" strokeWidth={6} />)}
      {/* window with red city glow */}
      <rect x={70} y={330} width={330} height={420} fill="url(#nightSky)" {...ink} />
      <path d="M70,690 L120,640 L150,660 L190,600 L240,630 L270,580 L320,640 L360,610 L400,650 L400,750 L70,750Z" fill="#1d1418" />
      <line x1={235} y1={330} x2={235} y2={750} {...ink} strokeWidth={10} />
      <line x1={70} y1={540} x2={400} y2={540} {...ink} strokeWidth={10} />
      <rect x={58} y={745} width={354} height={22} fill={C.door} {...ink} />
      {/* framed picture */}
      <rect x={560} y={300} width={160} height={120} fill="#3b4f6b" {...ink} strokeWidth={8} />
      <circle cx={640} cy={360} r={20} fill="#c9a86a" />
      {/* floor */}
      <rect y={1200} width={1080} height={720} fill={C.nightFloor} />
      {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={0} y1={1240 + i * 110} x2={1080} y2={1240 + i * 110} stroke="#120c08" strokeWidth={5} />)}
      {/* nightstand + clock */}
      <rect x={20} y={1100} width={130} height={170} fill={C.door} {...ink} />
      <rect x={34} y={1060} width={100} height={46} rx={6} fill="#141414" {...ink} strokeWidth={3} />
      <text x={84} y={1094} textAnchor="middle" fill="#ff4a3a" fontFamily={FONT.mono} fontWeight={800} fontSize={28}>3:12</text>
      {/* bed */}
      <rect x={150} y={980} width={34} height={320} fill={C.door} {...ink} />
      <rect x={170} y={1150} width={620} height={110} fill={C.door} {...ink} />
      <rect x={170} y={1090} width={620} height={70} rx={16} fill="#e8e3d2" {...ink} />
      <rect x={200} y={1050} width={150} height={60} rx={28} fill="#f3efe2" {...ink} />
      <rect x={770} y={1060} width={34} height={240} fill={C.door} {...ink} />
      {/* dresser + TV */}
      <rect x={830} y={1080} width={260} height={220} fill={C.doorDark} {...ink} />
      <line x1={830} y1={1190} x2={1090} y2={1190} {...ink} />
      <rect x={840} y={800} width={260} height={180} rx={8} fill="#191b1f" {...ink} strokeWidth={8} />
      <rect x={950} y={980} width={40} height={100} fill="#222" {...ink} />
      {tv > 0 ? (
        <g>
          <circle cx={950} cy={890} r={520} fill="url(#redPool)" opacity={0.9 * flick} />
          <AlertScreen x={852} y={812} w={236} h={156} flicker={flick} countdown={tvCountdown} />
        </g>
      ) : null}
      <circle cx={540} cy={700} r={700} fill="url(#warmPool)" opacity={0.12} />
    </g>
  );
};

/** Foreground blanket hump covering the sitting figure's legs. */
export const Blanket: React.FC = () => (
  <path d="M380,1150 C400,1040 520,1000 640,1050 C700,1080 740,1120 780,1150 L380,1150Z" fill={C.blanket} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
);

/** City at night: red sky, smoke, lit tower, traffic with ambulance. */
export const City: React.FC = () => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 6) % 2;
  const backs = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <g>
      <rect width={1080} height={1920} fill="url(#nightSky)" />
      {[[-0.35, 200], [0.25, 820]].map(([a, x], i) => (
        <polygon key={i} points={`${x},1300 ${x + Math.sin(a + 0.05 * Math.sin(frame / 25)) * 1400 - 60},0 ${x + Math.sin(a + 0.05 * Math.sin(frame / 25)) * 1400 + 60},0`} fill="#d9d2e8" opacity={0.08} />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={i} cx={random(`sx${i}`) * 1080 + Math.sin(frame / 40 + i) * 20} cy={900 + random(`sy${i}`) * 300 - frame * 0.4} r={120 + random(`sr${i}`) * 90} fill="#3a2530" opacity={0.75} />
      ))}
      {backs.map((i) => {
        const h = 300 + random(`bh${i}`) * 360;
        return (
          <g key={i}>
            <rect x={i * 140 - 20} y={1500 - h} width={150} height={h} fill="#231b20" {...ink} strokeWidth={3} />
            {Array.from({ length: 12 }).map((_, k) => (
              <rect key={k} x={i * 140 + (k % 3) * 40} y={1500 - h + 30 + Math.floor(k / 3) * 70} width={18} height={26} fill={random(`w${i}-${k}`) > 0.55 ? C.amber : "#1a1418"} opacity={0.85} />
            ))}
          </g>
        );
      })}
      {/* hero tower */}
      <rect x={380} y={420} width={320} height={1080} fill="#3a2a23" {...ink} strokeWidth={6} />
      <rect x={500} y={330} width={80} height={90} fill="#2b201b" {...ink} />
      {Array.from({ length: 13 }).map((_, row) =>
        [0, 1, 2, 3].map((col) => {
          const lit = random(`t${row}-${col}`) > 0.3;
          return (
            <g key={`${row}-${col}`}>
              <rect x={405 + col * 74} y={460 + row * 76} width={46} height={56} fill={lit ? C.amber : "#7da2c4"} {...ink} strokeWidth={3} />
              {lit && random(`p${row}-${col}`) > 0.75 ? <rect x={421 + col * 74} y={478 + row * 76} width={14} height={38} rx={7} fill="#2b1c14" /> : null}
            </g>
          );
        }),
      )}
      <rect x={490} y={1430} width={100} height={70} fill={C.amber} {...ink} />
      <rect x={0} y={1500} width={1080} height={420} fill="#151214" />
      <line x1={0} y1={1660} x2={1080} y2={1660} stroke="#3b3536" strokeWidth={6} strokeDasharray="40 30" />
      {[[60, "#7a2a28"], [260, "#4b5560"], [460, "#6d2622"], [640, "#3f4a5a"]].map(([x, col], i) => (
        <g key={i} transform={`translate(${Number(x) + ((frame * 1.2) % 40)},1560)`}>
          <rect width={150} height={50} rx={14} fill={String(col)} {...ink} strokeWidth={4} />
          <rect x={30} y={-30} width={80} height={36} rx={10} fill={String(col)} {...ink} strokeWidth={4} />
          <circle cx={30} cy={52} r={16} fill="#111" />
          <circle cx={120} cy={52} r={16} fill="#111" />
          <circle cx={150} cy={20} r={8} fill="#ff4a3a" />
        </g>
      ))}
      <g transform="translate(830,1520)">
        <rect width={200} height={90} rx={10} fill="#f2efe6" {...ink} strokeWidth={4} />
        <rect x={20} y={20} width={60} height={34} fill="#9fb4c8" />
        <rect x={110} y={34} width={50} height={14} fill={C.alertRed} />
        <rect x={127} y={18} width={14} height={46} fill={C.alertRed} />
        <rect x={60} y={-16} width={36} height={18} fill={blink ? "#ff3a2a" : "#3a6cff"} />
        <circle cx={78} cy={-8} r={70} fill={blink ? "#ff3a2a" : "#3a6cff"} opacity={0.25} />
        <circle cx={40} cy={92} r={18} fill="#111" />
        <circle cx={160} cy={92} r={18} fill="#111" />
      </g>
      {Array.from({ length: 20 }).map((_, i) => (
        <circle key={i} cx={(random(`ex${i}`) * 1080 + frame * 0.6) % 1080} cy={1500 - ((frame * (1 + random(`ev${i}`)) * 2 + random(`ey${i}`) * 1200) % 1200)} r={3} fill="#ff8a4a" opacity={0.7} />
      ))}
    </g>
  );
};

/** Apartment hallway, door closed (shake = knock jitter px) or open (0..1). */
export const Hallway: React.FC<{ shake?: number; open?: number; num: string }> = ({ shake = 0, open = 0, num }) => (
  <g>
    <rect width={1080} height={1920} fill="#1d2133" />
    <rect y={1500} width={1080} height={420} fill="#1a120c" />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={0} y1={1540 + i * 100} x2={1080} y2={1540 + i * 100} stroke="#0f0a07" strokeWidth={5} />)}
    <rect x={150} y={640} width={430} height={870} fill="#0b0b10" {...ink} strokeWidth={8} />
    <ellipse cx={365} cy={1510} rx={260} ry={40} fill="url(#warmPool)" opacity={0.9} />
    <g transform={`translate(${shake},0) translate(150,0) scale(${1 - open * 0.78},1) translate(-150,0)`}>
      <rect x={160} y={650} width={410} height={860} fill={C.door} {...ink} strokeWidth={7} />
      <rect x={210} y={720} width={310} height={330} fill="none" {...ink} strokeWidth={5} />
      <rect x={210} y={1110} width={310} height={330} fill="none" {...ink} strokeWidth={5} />
      <rect x={315} y={790} width={100} height={56} fill="#b89545" {...ink} strokeWidth={3} />
      <text x={365} y={832} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={36} fill={C.ink}>{num}</text>
      <circle cx={365} cy={905} r={11} fill="none" {...ink} strokeWidth={5} />
      <circle cx={510} cy={1120} r={16} fill="#b89545" {...ink} strokeWidth={3} />
      <path d="M440,960 Q480,1000 520,960" fill="none" stroke="#b8b2a4" strokeWidth={5} strokeDasharray="10 8" />
    </g>
    <line x1={720} y1={720} x2={720} y2={770} stroke="#888" strokeWidth={6} />
    <path d="M720,770 C640,820 640,1050 650,1120 L790,1120 C800,1050 800,820 720,770Z" fill={C.blanket} {...ink} />
    <rect x={860} y={1180} width={140} height={320} fill={C.doorDark} {...ink} />
    <path d="M880,1080 L980,1080 L950,1180 L910,1180Z" fill="#c2a777" opacity={0.85} {...ink} strokeWidth={3} />
    <circle cx={930} cy={1150} r={260} fill="url(#warmPool)" opacity={0.35} />
  </g>
);

/** Stairwell: bright cream (dark=false) or emergency-lit night (dark=true). Stair line: y = 1700 - (x-?)... see stairY. */
export const stairY = (x: number) => 1780 - x * 0.62;
export const Stairwell: React.FC<{ dark?: boolean; floorNum: string }> = ({ dark, floorNum }) => {
  const wall = dark ? "#2a2626" : C.stairCream;
  const line = dark ? "#1a1717" : "#d6ceb6";
  const steps = Array.from({ length: 20 });
  return (
    <g>
      <rect width={1080} height={1920} fill={wall} />
      {Array.from({ length: 22 }).map((_, i) => <line key={i} x1={0} y1={i * 90} x2={1080} y2={i * 90} stroke={line} strokeWidth={3} />)}
      <text x={80} y={600} fontFamily={FONT.title} fontSize={300} fill={dark ? "#3d3737" : "#ddd3b6"}>{floorNum}</text>
      <rect x={760} y={420} width={150} height={60} fill="#3f6b45" {...ink} strokeWidth={3} />
      <text x={835} y={463} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={32} fill="#e8f2e0">EXIT</text>
      <path d="M1080,520 L520,860 L520,890 L1080,550Z" fill={dark ? "#3a3434" : "#e3dccb"} {...ink} strokeWidth={3} />
      {/* main flight */}
      <path d={`M0,${stairY(0)} ${steps.map((_, i) => `L${i * 60 + 60},${stairY(i * 60)} L${i * 60 + 60},${stairY(i * 60 + 60)}`).join(" ")} L1200,1920 L0,1920Z`} fill={dark ? "#3b3535" : "#e6dfcc"} {...ink} strokeWidth={4} />
      {/* rail */}
      <line x1={0} y1={stairY(0) - 190} x2={1080} y2={stairY(1080) - 190} stroke={C.alertRed} strokeWidth={9} />
      {Array.from({ length: 10 }).map((_, i) => <line key={i} x1={i * 120 + 30} y1={stairY(i * 120 + 30) - 190} x2={i * 120 + 30} y2={stairY(i * 120 + 30)} stroke={dark ? "#6a3a36" : "#b9837b"} strokeWidth={5} />)}
      {dark ? (
        <g>
          <rect width={1080} height={1920} fill="#2a0806" opacity={0.25} />
          {[[150, 900], [880, 400]].map(([x, y], i) => (
            <g key={i}>
              <rect x={x - 25} y={y - 12} width={50} height={24} fill="#ff3a2a" />
              <circle cx={x} cy={y} r={240} fill="url(#redPool)" />
            </g>
          ))}
        </g>
      ) : null}
    </g>
  );
};

/** Basement boiler room with floor hatch. hatchOpen 0..1. */
export const BoilerRoom: React.FC<{ hatchOpen?: number }> = ({ hatchOpen = 0 }) => (
  <g>
    <rect width={1080} height={1920} fill={C.bunkerWall} />
    {Array.from({ length: 16 }).map((_, r) => <line key={r} x1={0} y1={300 + r * 80} x2={1080} y2={300 + r * 80} stroke="#555248" strokeWidth={3} />)}
    {Array.from({ length: 16 }).map((_, r) => Array.from({ length: 6 }).map((__, c) => <line key={`${r}-${c}`} x1={(c * 200 + (r % 2) * 100)} y1={300 + r * 80} x2={(c * 200 + (r % 2) * 100)} y2={380 + r * 80} stroke="#555248" strokeWidth={3} />))}
    <rect y={0} width={1080} height={300} fill="#45433b" />
    <rect y={280} width={1080} height={26} fill="#9c5a34" {...ink} strokeWidth={4} />
    <rect y={330} width={1080} height={16} fill="#7d7d76" {...ink} strokeWidth={3} />
    <line x1={540} y1={300} x2={540} y2={560} stroke={C.ink} strokeWidth={4} />
    <polygon points="510,580 570,580 860,1560 220,1560" fill="url(#bulbCone)" />
    <circle cx={540} cy={585} r={26} fill="#ffe7a6" stroke={C.ink} strokeWidth={4} />
    <circle cx={540} cy={585} r={140} fill="url(#warmPool)" />
    {/* boiler */}
    <rect x={-40} y={760} width={300} height={800} rx={40} fill="#6c6a62" {...ink} strokeWidth={6} />
    <circle cx={180} cy={860} r={50} fill="#e9e4d4" {...ink} strokeWidth={5} />
    <line x1={180} y1={860} x2={210} y2={830} stroke={C.alertRed} strokeWidth={5} />
    <rect x={40} y={1150} width={160} height={110} fill="#3d3a33" {...ink} />
    <rect x={60} y={1185} width={120} height={40} fill="#e27a32" opacity={0.85} />
    <rect y={1560} width={1080} height={360} fill="#4a473f" />
    <line x1={0} y1={1560} x2={1080} y2={1560} {...ink} strokeWidth={6} />
    {/* hatch hole + ladder */}
    <g opacity={hatchOpen > 0 ? 1 : 0}>
      <rect x={560} y={1580} width={260} height={120} fill="#0d0c0a" {...ink} />
      {[0, 1, 2].map((i) => <line key={i} x1={600} y1={1610 + i * 32} x2={780} y2={1610 + i * 32} stroke="#9a9a92" strokeWidth={7} />)}
      <line x1={600} y1={1580} x2={600} y2={1700} stroke="#9a9a92" strokeWidth={8} />
      <line x1={780} y1={1580} x2={780} y2={1700} stroke="#9a9a92" strokeWidth={8} />
    </g>
    <g transform={`translate(560,1590) rotate(${-hatchOpen * 68})`}>
      <rect x={0} y={-14} width={260} height={28} fill={C.steel} {...ink} />
      <rect x={205} y={-30} width={40} height={16} fill="#5a5f63" {...ink} strokeWidth={3} />
    </g>
  </g>
);

/** Bunker interior: ladder to ceiling hatch, LED timer, shelf, bunks, radio. */
export const Bunker: React.FC<{ led?: string; lit?: number }> = ({ led = "24:00:00", lit = 1 }) => {
  const frame = useCurrentFrame();
  const flick = 0.85 + 0.15 * random(`led${Math.floor(frame / 3)}`);
  return (
    <g>
      <rect width={1080} height={1920} fill={C.bunkerWall} />
      {Array.from({ length: 18 }).map((_, r) => <line key={r} x1={0} y1={200 + r * 76} x2={1080} y2={200 + r * 76} stroke="#56534a" strokeWidth={3} />)}
      {Array.from({ length: 18 }).map((_, r) => Array.from({ length: 6 }).map((__, c) => <line key={`${r}-${c}`} x1={c * 190 + (r % 2) * 95} y1={200 + r * 76} x2={c * 190 + (r % 2) * 95} y2={276 + r * 76} stroke="#56534a" strokeWidth={3} />))}
      {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={random(`bx${i}`) * 1080} cy={220 + random(`by${i}`) * 1300} r={3 + random(`br${i}`) * 4} fill="#4d4a42" />)}
      <rect width={1080} height={200} fill="#3e3c35" />
      <circle cx={540} cy={700} r={760} fill="url(#warmPool)" opacity={0.35 * lit} />
      {/* ceiling hatch + ladder */}
      <ellipse cx={560} cy={205} rx={120} ry={22} fill={C.steel} {...ink} />
      <ellipse cx={560} cy={205} rx={70} ry={12} fill="none" stroke={C.alertRed} strokeWidth={6} />
      <line x1={480} y1={215} x2={480} y2={1580} stroke="#a7aaa6" strokeWidth={14} />
      <line x1={640} y1={215} x2={640} y2={1580} stroke="#a7aaa6" strokeWidth={14} />
      {Array.from({ length: 17 }).map((_, i) => <line key={i} x1={480} y1={280 + i * 78} x2={640} y2={280 + i * 78} stroke="#a7aaa6" strokeWidth={10} />)}
      {/* LED timer */}
      <rect x={720} y={520} width={300} height={100} rx={12} fill="#1e1b19" {...ink} strokeWidth={5} />
      <text x={870} y={591} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={52} fill="#ff4a3a" opacity={flick}>{led}</text>
      {/* vent fan */}
      <circle cx={970} cy={330} r={70} fill="#4a4842" {...ink} strokeWidth={6} />
      <path d="M925,285 L1015,375 M1015,285 L925,375" stroke={C.ink} strokeWidth={8} />
      {/* shelf (left) */}
      <rect x={-20} y={700} width={330} height={860} fill="#4a3a2c" {...ink} strokeWidth={5} />
      {[880, 1080, 1280].map((y) => <rect key={y} x={-20} y={y} width={330} height={16} fill="#2f251c" />)}
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={10 + i * 58} y={760} width={44} height={118} rx={10} fill={C.water} {...ink} strokeWidth={3} />)}
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={10 + i * 58} y={990} width={46} height={88} fill={i % 2 ? C.alertRed : "#d9b13a"} {...ink} strokeWidth={3} />)}
      <rect x={20} y={1150} width={120} height={120} fill="#f2efe6" {...ink} strokeWidth={3} />
      <rect x={65} y={1170} width={30} height={80} fill={C.alertRed} />
      <rect x={40} y={1195} width={80} height={30} fill={C.alertRed} />
      {/* bunks (right) */}
      <line x1={760} y1={760} x2={760} y2={1580} stroke="#3e3c35" strokeWidth={14} />
      <line x1={1070} y1={760} x2={1070} y2={1580} stroke="#3e3c35" strokeWidth={14} />
      {[900, 1340].map((y) => (
        <g key={y}>
          <rect x={750} y={y} width={340} height={46} fill={C.olive} {...ink} strokeWidth={4} />
          <rect x={780} y={y - 30} width={110} height={36} rx={16} fill="#ece6d4" {...ink} strokeWidth={3} />
        </g>
      ))}
      {/* radio desk */}
      <rect x={180} y={1460} width={260} height={18} fill="#4a3a2c" {...ink} strokeWidth={3} />
      <rect x={200} y={1350} width={200} height={110} rx={10} fill={C.radioGreen} {...ink} strokeWidth={4} />
      <rect x={220} y={1372} width={100} height={42} fill={C.amber} {...ink} strokeWidth={3} />
      <circle cx={360} cy={1395} r={18} fill="#2a2f24" {...ink} strokeWidth={3} />
      <rect y={1580} width={1080} height={340} fill="#3c3a33" />
      <line x1={0} y1={1580} x2={1080} y2={1580} {...ink} strokeWidth={6} />
    </g>
  );
};

/** Close-up of the supply shelf. */
export const ShelfClose: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill={C.bunkerWall} />
    <circle cx={540} cy={800} r={800} fill="url(#warmPool)" opacity={0.3} />
    <rect x={160} y={380} width={760} height={1240} fill="#4a3a2c" {...ink} strokeWidth={8} />
    {[640, 920, 1200].map((y) => <rect key={y} x={160} y={y} width={760} height={24} fill="#2f251c" {...ink} strokeWidth={4} />)}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <g key={i}>
        <rect x={200 + i * 116} y={430} width={86} height={210} rx={18} fill={C.water} {...ink} strokeWidth={5} />
        <rect x={225 + i * 116} y={410} width={36} height={28} fill="#3d6fa6" {...ink} strokeWidth={4} />
      </g>
    ))}
    {[0, 1, 2, 3, 4, 5].map((i) =>
      [0, 1].map((k) => (
        <g key={`${i}${k}`}>
          <rect x={200 + i * 116} y={700 + k * 110} width={90} height={104} fill={["#d9b13a", C.alertRed, "#6e9a52"][(i + k) % 3]} {...ink} strokeWidth={4} />
          <rect x={200 + i * 116} y={735 + k * 110} width={90} height={30} fill="#f0ead8" />
        </g>
      )),
    )}
    <rect x={210} y={990} width={190} height={190} fill="#f2efe6" {...ink} strokeWidth={5} />
    <rect x={285} y={1020} width={40} height={130} fill={C.alertRed} />
    <rect x={240} y={1065} width={130} height={40} fill={C.alertRed} />
    <rect x={460} y={1080} width={400} height={100} fill="none" stroke={C.amber} strokeWidth={6} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={478 + i * 54} y={1095} width={40} height={70} fill="none" stroke={C.amber} strokeWidth={5} />)}
    {[0, 1, 2, 3].map((i) => <rect key={i} x={190 + i * 180} y={1260} width={160} height={180} fill={C.olive} {...ink} strokeWidth={5} />)}
  </g>
);

/** Height of the stair tread under x (feet land on treads, not on the slope line). */
export const treadY = (x: number) => stairY(Math.floor(x / 60) * 60);
/** Nearest bunker ladder rung to y (rungs at 280 + 78·i). */
export const rungY = (y: number) => Math.round((y - 280) / 78) * 78 + 280;
const HATCH_MAX_DEG = 68;
/** World position of the boiler-room hatch handle for a given open amount (matches BoilerRoom). */
export const hatchHandle = (open: number): [number, number] => {
  const t = (-open * HATCH_MAX_DEG * Math.PI) / 180;
  const [lx, ly] = [225, -22];
  return [560 + lx * Math.cos(t) - ly * Math.sin(t), 1590 + lx * Math.sin(t) + ly * Math.cos(t)];
};
