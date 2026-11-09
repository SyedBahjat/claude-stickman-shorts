import React from "react";
import { random, useCurrentFrame } from "remotion";
import { C, FONT } from "../kit/style";

/** FreshCo supermarket sets (1080×1920). Characters stand on SF.floor. */
export const SF = { floor: 1660, lot: 1390, door: { x0: 410, x1: 690 }, lock: [550, 1300] as [number, number], speaker: [140, 700] as [number, number] };
const ink = { stroke: C.ink, strokeWidth: 4.5, strokeLinejoin: "round" as const };
const FC_GREEN = "#3f7a4a";
const FC_RED = "#c0392b";

const Tiles: React.FC<{ y?: number; tone?: [string, string] }> = ({ y = SF.floor, tone = ["#d9d4c3", "#c4bea9"] }) => (
  <g>
    <rect y={y} width={1080} height={1920 - y} fill={tone[0]} />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={i * 90} y={y} width={45} height={1920 - y} fill={tone[1]} opacity={0.5} />)}
    <line x1={0} y1={y} x2={1080} y2={y} {...ink} strokeWidth={6} />
  </g>
);

const Ceiling: React.FC<{ to?: number; on?: boolean }> = ({ to = 400, on = true }) => (
  <g>
    <rect width={1080} height={to} fill="#3a3d3f" />
    {[120, 600].map((x) => (
      <g key={x}>
        <rect x={x} y={to - 60} width={360} height={20} rx={8} fill={on ? "#f6f9ee" : "#6d6a60"} {...ink} strokeWidth={3} />
        {on ? <rect x={x - 60} y={to - 40} width={480} height={700} fill="url(#tubeGlow2)" /> : null}
      </g>
    ))}
  </g>
);

/** Frozen-food aisle: three lit glass freezer doors. */
export const FreezerAisle: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="#b9c4a8" />
    <Ceiling to={360} />
    <g transform="translate(540,410)">
      <rect x={-200} y={0} width={400} height={70} rx={10} fill={C.signBlue} {...ink} />
      <text x={0} y={48} textAnchor="middle" fontFamily={FONT.title} fontSize={46} fill="white">AISLE 7 · FROZEN</text>
    </g>
    <rect x={30} y={520} width={1020} height={1040} fill="#2c3135" {...ink} strokeWidth={8} />
    {[60, 380, 700].map((x, d) => (
      <g key={x}>
        <rect x={x} y={550} width={300} height={980} fill="#d7ecf5" {...ink} strokeWidth={5} />
        {[0, 1, 2, 3].map((s) => (
          <g key={s}>
            <rect x={x + 6} y={760 + s * 220} width={288} height={10} fill="#9fb3bd" />
            {[0, 1, 2].map((b) => (
              <rect key={b} x={x + 20 + b * 92} y={640 + s * 220} width={78} height={118} rx={4} fill={[FC_RED, "#e8b23a", "#3f6fa6", "#5f8f4a"][(s + b + d) % 4]} {...ink} strokeWidth={3} />
            ))}
          </g>
        ))}
        <rect x={x} y={550} width={300} height={980} fill="url(#frostEdge)" />
        <rect x={x + 262} y={900} width={14} height={260} rx={7} fill="#c9ccc8" {...ink} strokeWidth={3} />
      </g>
    ))}
    <rect x={30} y={1560} width={1020} height={100} fill="#1f2326" />
    <Tiles tone={["#dfe6e6", "#cad3d4"]} />
    <rect width={1080} height={1920} fill="#bcd8ff" opacity={0.08} />
  </g>
);

/** Outdoor ice merchandiser (cold → the Turned stall next to it). */
export const IceChest: React.FC<{ x: number; frost?: number }> = ({ x, frost = 0 }) => (
  <g transform={`translate(${x},0)`}>
    <rect x={0} y={1440} width={170} height={220} rx={8} fill="#e8f2f8" {...ink} />
    <rect x={10} y={1460} width={150} height={60} fill="#3f6fa6" />
    <text x={85} y={1505} textAnchor="middle" fontFamily={FONT.title} fontSize={48} fill="white">ICE</text>
    <circle cx={85} cy={1440} r={140 + 60 * frost} fill="url(#coldPool)" opacity={0.5 + 0.4 * frost} />
  </g>
);

/** Front of store: night parking lot behind a glass wall with automatic doors. `outside` = the Turned (drawn behind the glass). */
export const Checkout: React.FC<{ door?: number; cracks?: number; outside?: React.ReactNode; iceFrost?: number; day?: boolean }> = ({ door = 0, cracks = 0, outside, iceFrost = 0, day = false }) => {
  const frame = useCurrentFrame();
  const leaf = 135 * door;
  const flick = 0.9 + 0.1 * random(`lot${Math.floor(frame / 3)}`);
  return (
    <g>
      {/* outside: night lot */}
      <rect width={1080} height={1920} fill={day ? "#b9cfdf" : "#0f1624"} />
      <rect y={800} width={1080} height={600} fill={day ? "#a7bccc" : "#16202e"} />
      {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${i * 150 - 20},1000 q40,-60 80,0 q40,-50 70,0`} fill="#0b111b" />)}
      <rect y={SF.lot - 120} width={1080} height={1920} fill={day ? "#6b6e70" : "#232629"} />
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={i * 260 + 40} y1={SF.lot - 110} x2={i * 260 - 60} y2={SF.floor} stroke="#e8e4c8" strokeWidth={6} opacity={0.35} />)}
      {[[300, 0.95], [880, 1]].map(([x, o], i) => (
        <g key={i} opacity={Number(o) * flick}>
          <rect x={Number(x) - 6} y={560} width={12} height={760} fill="#2a2d30" />
          <rect x={Number(x) - 50} y={548} width={100} height={22} rx={6} fill="#f2e8b0" {...ink} strokeWidth={3} />
          <polygon points={`${Number(x) - 40},570 ${Number(x) + 40},570 ${Number(x) + 230},1330 ${Number(x) - 230},1330`} fill="#f2e8b0" opacity={0.12} />
        </g>
      ))}
      <g transform="translate(560,1180)">
        <rect width={420} height={190} rx={22} fill="#e9e6dc" {...ink} />
        <rect x={300} y={-60} width={120} height={120} rx={16} fill="#e9e6dc" {...ink} />
        <rect x={20} y={40} width={250} height={70} fill={FC_GREEN} />
        <text x={145} y={90} textAnchor="middle" fontFamily={FONT.title} fontSize={50} fill="white">FRESHCO</text>
        <circle cx={80} cy={192} r={30} fill="#111" />
        <circle cx={340} cy={192} r={30} fill="#111" />
      </g>
      {/* outdoor PA speaker pole (left) */}
      <rect x={SF.speaker[0] - 6} y={SF.speaker[1]} width={12} height={SF.lot - SF.speaker[1]} fill="#2a2d30" />
      <path d={`M${SF.speaker[0]},${SF.speaker[1] + 10} l60,-30 l0,80 l-60,-30Z`} fill="#8d9297" {...ink} strokeWidth={3} />
      <IceChest x={760} frost={iceFrost} />
      {outside}
      {/* outside reads darker/bluer through the glass; low knee wall hides outside feet */}
      <rect x={0} y={420} width={1080} height={SF.floor - 420} fill="#0b1426" opacity={day ? 0.12 : 0.32} />
      {[[0, SF.door.x0], [SF.door.x1, 1080]].map(([a, b]) => (
        <g key={a}>
          <rect x={a} y={1535} width={b - a} height={SF.floor - 1535} fill="#4a4d50" {...ink} strokeWidth={4} />
          <rect x={a} y={1535} width={b - a} height={14} fill="#6a6d70" />
        </g>
      ))}
      {/* glass wall */}
      <rect x={0} y={420} width={1080} height={SF.floor - 420} fill="#9fc3dc" opacity={0.13} />
      {[[60, 420], [860, 420]].map(([x, y], i) => <polygon key={i} points={`${x},${y + 80} ${x + 90},${y} ${x + 130},${y} ${x + 40},${y + 80}`} fill="white" opacity={0.07} />)}
      {[0, 205, SF.door.x0, SF.door.x1, 880, 1080].map((x) => <rect key={x} x={x - 9} y={420} width={18} height={SF.floor - 420} fill="#3b3f43" {...ink} strokeWidth={3} />)}
      <rect x={0} y={410} width={1080} height={30} fill="#3b3f43" {...ink} strokeWidth={3} />
      {/* automatic doors */}
      {[0, 1].map((s) => {
        const x = s === 0 ? SF.door.x0 - leaf : (SF.door.x0 + SF.door.x1) / 2 + leaf;
        return (
          <g key={s}>
            <rect x={x} y={500} width={(SF.door.x1 - SF.door.x0) / 2} height={SF.floor - 500} fill="#a9cbe0" opacity={0.18} {...ink} strokeWidth={5} />
            <rect x={x + (s === 0 ? 118 : 6) } y={1250} width={16} height={100} rx={4} fill="#9aa0a6" {...ink} strokeWidth={2} />
          </g>
        );
      })}
      <rect x={SF.door.x0} y={450} width={SF.door.x1 - SF.door.x0} height={44} fill={FC_GREEN} {...ink} strokeWidth={3} />
      <text x={(SF.door.x0 + SF.door.x1) / 2} y={482} textAnchor="middle" fontFamily={FONT.title} fontSize={34} fill="white">ENTRANCE</text>
      {/* cracks */}
      {cracks > 0
        ? [[300, 980], [790, 1060], [140, 1180]].map(([cx, cy], k) => (
            <g key={k} opacity={Math.min(1, cracks * 1.5 - k * 0.3)}>
              {Array.from({ length: 7 }).map((_, i) => {
                const a = (i / 7) * Math.PI * 2 + k;
                const len = 70 + 80 * random(`cr${k}${i}`) * cracks;
                return <path key={i} d={`M${cx},${cy} l${Math.cos(a) * len * 0.5},${Math.sin(a) * len * 0.5} l${Math.cos(a + 0.4) * len * 0.5},${Math.sin(a + 0.4) * len * 0.5}`} stroke="white" strokeWidth={3} fill="none" opacity={0.8} />;
              })}
            </g>
          ))
        : null}
      {/* inside ceiling + PA speaker */}
      <rect width={1080} height={410} fill="#3a3d3f" />
      <rect x={140} y={340} width={340} height={18} rx={8} fill="#f6f9ee" {...ink} strokeWidth={3} />
      <rect x={620} y={340} width={340} height={18} rx={8} fill="#f6f9ee" {...ink} strokeWidth={3} />
      <circle cx={860} cy={300} r={34} fill="#d6d3c8" {...ink} strokeWidth={4} />
      <circle cx={860} cy={300} r={18} fill="#8d9297" />
      <Tiles />
      <rect width={1080} height={1920} fill="#fff6dc" opacity={0.05} />
    </g>
  );
};
export const PA_SPEAKER: [number, number] = [860, 300];

/** Checkout counter (draw AFTER the cashier so it hides her legs). */
export const Counter: React.FC<{ x?: number }> = ({ x = 0 }) => (
  <g transform={`translate(${x},0)`}>
    <rect x={-10} y={1320} width={360} height={340} fill="#e9e6dc" {...ink} />
    <rect x={-10} y={1320} width={360} height={36} fill="#2a2d30" />
    <rect x={20} y={1365} width={300} height={22} fill={FC_GREEN} />
    <text x={170} y={1440} textAnchor="middle" fontFamily={FONT.title} fontSize={44} fill={FC_GREEN}>FRESHCO</text>
    <rect x={250} y={1210} width={90} height={110} rx={8} fill="#2a2d30" {...ink} strokeWidth={3} />
    <rect x={262} y={1224} width={66} height={44} fill="#7fd1a0" />
  </g>
);
export const REGISTER_BUTTON: [number, number] = [300, 1300];

/** Back room: walk-in freezer (left) and loading-bay shutter (right). */
export const BackRoom: React.FC<{ freezerGlow?: number; shutterOpen?: number; outside?: React.ReactNode; generator?: number; lights?: boolean }> = ({ freezerGlow = 1, shutterOpen = 0, outside, generator, lights = true }) => (
  <g>
    <rect width={1080} height={1920} fill="#6e6d66" />
    {Array.from({ length: 16 }).map((_, r) => <line key={r} x1={0} y1={300 + r * 85} x2={1080} y2={300 + r * 85} stroke="#5f5e58" strokeWidth={3} />)}
    <Ceiling to={300} on={lights} />
    {/* walk-in freezer */}
    <rect x={60} y={720} width={400} height={SF.floor - 720} fill="#a9b0b5" {...ink} strokeWidth={7} />
    <rect x={60} y={660} width={400} height={60} fill={C.signBlue} {...ink} />
    <text x={260} y={702} textAnchor="middle" fontFamily={FONT.title} fontSize={40} fill="white">WALK-IN FREEZER</text>
    <circle cx={260} cy={940} r={70} fill="#d7ecf5" {...ink} strokeWidth={6} />
    <circle cx={260} cy={940} r={70} fill="url(#frostEdge)" />
    <rect x={400} y={1150} width={40} height={140} rx={10} fill="#6b7075" {...ink} strokeWidth={3} />
    <ellipse cx={260} cy={SF.floor} rx={260} ry={40} fill="url(#coldPool)" opacity={0.7 * freezerGlow} />
    {/* loading bay */}
    <rect x={620} y={660} width={430} height={SF.floor - 660} fill="#e8c23a" {...ink} strokeWidth={6} />
    <rect x={645} y={685} width={380} height={SF.floor - 685} fill="#0c1220" />
    <svg x={645} y={685} width={380} height={SF.floor - 685} viewBox={`645 685 380 ${SF.floor - 685}`} overflow="hidden">
      <rect x={645} y={685} width={380} height={600} fill="#121b2b" />
      <rect x={645} y={1450} width={380} height={300} fill="#26292c" />
      {outside}
    </svg>
    <rect x={645} y={685} width={380} height={(SF.floor - 685) * (1 - shutterOpen)} fill="#5a5f63" />
    {Array.from({ length: 22 }).map((_, i) => (700 + i * 44 < 685 + (SF.floor - 685) * (1 - shutterOpen) ? <line key={i} x1={645} y1={700 + i * 44} x2={1025} y2={700 + i * 44} stroke="#474b4f" strokeWidth={6} /> : null))}
    <rect x={620} y={610} width={430} height={50} fill={C.ink} />
    <text x={835} y={647} textAnchor="middle" fontFamily={FONT.title} fontSize={40} fill="#e8c23a">LOADING BAY</text>
    {[[490, 1450], [540, 1560], [470, 1560]].map(([x, y], i) => <rect key={i} x={x} y={y} width={110} height={100} fill="#b58b5a" {...ink} strokeWidth={4} />)}
    {generator != null ? <Generator x={470} level={generator} /> : null}
    <Tiles tone={["#8a877c", "#7d7a70"]} />
  </g>
);

export const StoreDefs: React.FC = () => (
  <defs>
    <linearGradient id="frostEdge" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stopColor="white" stopOpacity={0.55} />
      <stop offset="0.35" stopColor="white" stopOpacity={0} />
      <stop offset="0.75" stopColor="white" stopOpacity={0} />
      <stop offset="1" stopColor="white" stopOpacity={0.5} />
    </linearGradient>
    <radialGradient id="coldPool">
      <stop offset="0" stopColor="#bfe6ff" stopOpacity={0.6} />
      <stop offset="1" stopColor="#bfe6ff" stopOpacity={0} />
    </radialGradient>
  </defs>
);

// ---------- props (hand at 0,0) ----------
export const PizzaBox: React.FC = () => (
  <g transform="rotate(-8)">
    <rect x={-70} y={-60} width={140} height={34} rx={4} fill={FC_RED} stroke={C.ink} strokeWidth={4} />
    <text x={0} y={-35} textAnchor="middle" fontFamily={FONT.title} fontSize={22} fill="white">PIZZA</text>
  </g>
);

export const CoolerBag: React.FC<{ label?: boolean }> = ({ label = true }) => (
  <g>
    <path d="M-30,0 v-14 h60 v14" fill="none" stroke="#333" strokeWidth={8} />
    <rect x={-80} y={0} width={160} height={120} rx={14} fill="#f2f2ee" stroke={C.ink} strokeWidth={6} />
    <rect x={-80} y={0} width={160} height={26} rx={10} fill="#3f6fa6" stroke={C.ink} strokeWidth={4} />
    {label ? (
      <g>
        <rect x={-66} y={40} width={132} height={64} fill="#e8c23a" stroke={C.ink} strokeWidth={3} />
        <text x={0} y={60} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={12} fill={C.ink}>HALEWORTH LABS</text>
        <text x={0} y={78} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={13} fill={FC_RED}>KEEP COLD</text>
        <text x={0} y={95} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={10} fill={C.ink}>DO NOT OPEN</text>
      </g>
    ) : null}
  </g>
);

export const Clipboard: React.FC = () => (
  <g transform="rotate(-10)">
    <rect x={-34} y={-70} width={68} height={90} rx={4} fill="#b58b5a" stroke={C.ink} strokeWidth={4} />
    <rect x={-26} y={-58} width={52} height={68} fill="#f6f4ee" />
    <rect x={-14} y={-76} width={28} height={12} rx={3} fill="#9aa0a6" stroke={C.ink} strokeWidth={2} />
  </g>
);

/** Diesel generator with a fuel gauge (level 0..1) and two empty cans. */
export const Generator: React.FC<{ x: number; level: number }> = ({ x, level }) => {
  const frame = useCurrentFrame();
  const shake = level > 0.02 ? Math.sin(frame * 1.7) * 2 : 0;
  return (
    <g transform={`translate(${x + shake},0)`}>
      <rect x={0} y={1400} width={200} height={260} rx={14} fill="#e8c23a" {...ink} />
      <rect x={20} y={1440} width={160} height={90} rx={8} fill="#3a3d40" {...ink} strokeWidth={3} />
      <rect x={30} y={1460} width={140} height={22} fill="#222" />
      <rect x={30} y={1460} width={140 * level} height={22} fill={level < 0.2 ? FC_RED : "#5fc96b"} />
      <text x={100} y={1515} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={18} fill="white">FUEL</text>
      <rect x={160} y={1340} width={20} height={60} fill="#555" {...ink} strokeWidth={3} />
      {level > 0.02 ? <circle cx={170} cy={1320 - (frame % 20) * 2} r={14 + (frame % 20)} fill="#9a9a9a" opacity={0.35 - (frame % 20) * 0.015} /> : null}
      {[-150, -90].map((dx) => (
        <g key={dx}>
          <rect x={dx} y={1560} width={50} height={100} rx={6} fill={FC_RED} {...ink} strokeWidth={3} />
          <rect x={dx + 10} y={1548} width={18} height={16} fill="#333" />
        </g>
      ))}
    </g>
  );
};

/** Manager's office: desk with the hidden radio, van keys, CCTV monitor, door on the left. */
export const Office: React.FC<{ door?: number; radioGlow?: number }> = ({ door = 0, radioGlow = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <g>
      <rect width={1080} height={1920} fill="#7d7461" />
      {Array.from({ length: 14 }).map((_, r) => <line key={r} x1={0} y1={360 + r * 95} x2={1080} y2={360 + r * 95} stroke="#6f6754" strokeWidth={3} />)}
      <rect width={1080} height={340} fill="#3a3d3f" />
      <rect x={380} y={300} width={320} height={18} rx={8} fill="#f6f9ee" {...ink} strokeWidth={3} />
      <rect x={0} y={640} width={170} height={SF.floor - 640} fill="#1b1b1b" />
      <rect x={0} y={640} width={170 * (1 - door)} height={SF.floor - 640} fill="#a07a52" {...ink} />
      <rect x={640} y={560} width={340} height={240} rx={12} fill="#1d2022" {...ink} />
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={656 + (k % 2) * 160} y={576 + Math.floor(k / 2) * 108} width={148} height={96} fill={random(`cc${k}${Math.floor(frame / 8)}`) > 0.1 ? "#40514a" : "#2a3330"} />
      ))}
      <text x={810} y={830} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={20} fill="#e8e4d6">CCTV</text>
      <rect x={300} y={1380} width={720} height={40} fill="#6b5340" {...ink} />
      <rect x={340} y={1420} width={40} height={240} fill="#5a4636" {...ink} strokeWidth={3} />
      <rect x={940} y={1420} width={40} height={240} fill="#5a4636" {...ink} strokeWidth={3} />
      <g transform="translate(560,1290)">
        <rect width={170} height={90} rx={10} fill="#465436" {...ink} />
        <rect x={14} y={14} width={90} height={34} fill={C.amber} opacity={0.6 + 0.4 * radioGlow} {...ink} strokeWidth={3} />
        <circle cx={135} cy={45} r={18} fill="#2a2f24" {...ink} strokeWidth={3} />
        <line x1={150} y1={0} x2={190} y2={-90} stroke={C.ink} strokeWidth={5} />
        <circle cx={60} cy={30} r={110} fill="url(#warmPool)" opacity={0.35 * radioGlow} />
      </g>
      <g transform="translate(820,1372)">
        <circle cx={0} cy={0} r={10} fill="none" stroke="#c9ccc8" strokeWidth={5} />
        <rect x={6} y={-6} width={36} height={12} rx={4} fill="#c9ccc8" {...ink} strokeWidth={2} />
        <rect x={-20} y={4} width={30} height={20} rx={4} fill={FC_GREEN} {...ink} strokeWidth={2} />
      </g>
      <Tiles tone={["#9a8f78", "#8d836d"]} />
    </g>
  );
};
export const VAN_KEYS: [number, number] = [830, 1372];

/** Outside the loading dock at dawn: store wall + shutter (left), frosty apron, delivery van (right). */
export const DockDawn: React.FC<{ children?: React.ReactNode; bag?: boolean }> = ({ children, bag = true }) => (
  <g>
    <rect width={1080} height={1920} fill="#d9c7b8" />
    <rect width={1080} height={900} fill="#b8c4d6" />
    <rect y={600} width={1080} height={300} fill="#e8b89a" opacity={0.7} />
    <circle cx={880} cy={880} r={90} fill="#ffe2b0" opacity={0.9} />
    <rect x={0} y={520} width={420} height={SF.floor - 520} fill="#8a8a82" {...ink} strokeWidth={6} />
    <rect x={60} y={760} width={300} height={SF.floor - 760} fill="#5a5f63" {...ink} strokeWidth={5} />
    {Array.from({ length: 18 }).map((_, i) => <line key={i} x1={60} y1={780 + i * 48} x2={360} y2={780 + i * 48} stroke="#474b4f" strokeWidth={5} />)}
    <rect x={0} y={480} width={420} height={50} fill={FC_GREEN} {...ink} strokeWidth={4} />
    <text x={210} y={516} textAnchor="middle" fontFamily={FONT.title} fontSize={34} fill="white">FRESHCO · DELIVERIES</text>
    <rect y={SF.floor} width={1080} height={260} fill="#8d9196" />
    {Array.from({ length: 70 }).map((_, i) => <circle key={i} cx={random(`fr${i}`) * 1080} cy={SF.floor + 10 + random(`fy${i}`) * 240} r={2 + random(`fs${i}`) * 3} fill="white" opacity={0.7} />)}
    <line x1={0} y1={SF.floor} x2={1080} y2={SF.floor} {...ink} strokeWidth={6} />
    <g transform="translate(560,1360)">
      <rect width={460} height={220} rx={24} fill="#e9e6dc" {...ink} />
      <rect x={330} y={-70} width={130} height={140} rx={18} fill="#e9e6dc" {...ink} />
      <rect x={350} y={-50} width={90} height={60} fill="#9fb4c8" {...ink} strokeWidth={3} />
      <rect x={30} y={50} width={270} height={80} fill={FC_GREEN} />
      <text x={165} y={108} textAnchor="middle" fontFamily={FONT.title} fontSize={56} fill="white">FRESHCO</text>
      <circle cx={90} cy={222} r={36} fill="#111" />
      <circle cx={380} cy={222} r={36} fill="#111" />
      {bag ? <g transform="translate(200,180) scale(0.7)"><CoolerBag /></g> : null}
    </g>
    {children}
  </g>
);

export const Keys: React.FC = () => (
  <g>
    <circle cx={0} cy={0} r={9} fill="none" stroke="#c9ccc8" strokeWidth={4} />
    <rect x={4} y={-5} width={30} height={10} rx={3} fill="#c9ccc8" stroke={C.ink} strokeWidth={2} />
    <rect x={-18} y={4} width={26} height={18} rx={4} fill={FC_GREEN} stroke={C.ink} strokeWidth={2} />
  </g>
);

export const Axe: React.FC = () => (
  <g transform="rotate(-60)">
    <rect x={-6} y={-150} width={12} height={170} rx={5} fill="#8a5a33" stroke={C.ink} strokeWidth={3} />
    <path d="M6,-150 l44,-10 l6,44 l-50,4Z" fill={FC_RED} stroke={C.ink} strokeWidth={4} />
  </g>
);
