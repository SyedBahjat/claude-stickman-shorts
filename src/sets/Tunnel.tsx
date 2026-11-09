import React from "react";
import { random, useCurrentFrame } from "remotion";
import { C, FONT } from "../kit/style";

/** Tunnel / corridor / blast-door sets for Last Train part 2B (1080×1920). */
export const TF = { floor: 1660, trainFloor: 1480 };
const ink = { stroke: C.ink, strokeWidth: 4.5, strokeLinejoin: "round" as const };

/** Dark subway tunnel, side view. `scroll` slides the wall for tracking shots. `train` draws the stopped car (right) with its open door. */
export const TunnelTrack: React.FC<{ scroll?: number; train?: boolean; trainX?: number }> = ({ scroll = 0, train, trainX = 600 }) => {
  const wrap = (x: number, span: number) => ((x % span) + span) % span;
  return (
    <g>
      <rect width={1080} height={1920} fill="#151413" />
      <path d="M-20,300 Q540,40 1100,300 L1100,1660 L-20,1660Z" fill="#23211e" />
      {Array.from({ length: 7 }).map((_, i) => {
        const x = wrap(i * 240 - scroll, 1680) - 300;
        return <rect key={i} x={x} y={220} width={26} height={1440} fill="#1a1917" />;
      })}
      {[520, 560, 600].map((y) => <line key={y} x1={0} y1={y} x2={1080} y2={y} stroke="#383530" strokeWidth={8} />)}
      {Array.from({ length: 3 }).map((_, i) => {
        const x = wrap(i * 620 + 200 - scroll, 1860) - 300;
        return (
          <g key={`l${i}`}>
            <circle cx={x} cy={430} r={260} fill="url(#redPool)" opacity={0.55} />
            <rect x={x - 26} y={418} width={52} height={22} rx={5} fill="#ff3a2a" {...ink} strokeWidth={3} />
          </g>
        );
      })}
      {/* ballast + rails */}
      <rect y={TF.floor} width={1080} height={260} fill="#2a2724" />
      {Array.from({ length: 60 }).map((_, i) => (
        <circle key={i} cx={wrap(random(`bx${i}`) * 1800 - scroll, 1800) - 300} cy={TF.floor + 30 + random(`by${i}`) * 220} r={4 + random(`br${i}`) * 5} fill="#3a3632" />
      ))}
      {Array.from({ length: 12 }).map((_, i) => <rect key={`s${i}`} x={wrap(i * 150 - scroll, 1800) - 300} y={TF.floor + 8} width={90} height={18} fill="#3d2f24" />)}
      <rect y={TF.floor - 6} width={1080} height={14} fill="#8a8d90" {...ink} strokeWidth={3} />
      {train ? (
        <g transform={`translate(${trainX - scroll},0)`}>
          <rect x={0} y={620} width={900} height={TF.trainFloor - 620 + 60} rx={30} fill="#a9a493" {...ink} />
          <rect x={60} y={720} width={190} height={260} rx={20} fill="#3a3326" {...ink} />
          <rect x={300} y={680} width={220} height={TF.trainFloor - 680} fill="#d9c79a" {...ink} />
          <rect x={300} y={680} width={220} height={TF.trainFloor - 680} fill="url(#warmPool)" />
          <rect x={560} y={720} width={190} height={260} rx={20} fill="#3a3326" {...ink} />
          <rect x={0} y={TF.trainFloor + 60} width={900} height={60} fill="#1b1a19" />
          <circle cx={410} cy={1300} r={420} fill="url(#warmPool)" opacity={0.5} />
        </g>
      ) : null}
    </g>
  );
};

/** Steel door CD-7 in the tunnel wall with a keypad. `open` 0..1 swings it inward (dark gap). */
export const SteelDoor: React.FC<{ open?: number; pressed?: number }> = ({ open = 0, pressed = -1 }) => (
  <g>
    <rect x={300} y={880} width={330} height={TF.floor - 880} fill="#050506" {...ink} strokeWidth={8} />
    <rect x={300} y={880} width={330 * (1 - open * 0.85)} height={TF.floor - 880} fill="#5b5f62" {...ink} strokeWidth={6} />
    <rect x={330} y={930} width={Math.max(0, 270 * (1 - open * 0.85))} height={70} fill="#e8c23a" opacity={0.9} />
    {open < 0.4 ? (
      <g>
        <text x={465} y={980} textAnchor="middle" fontFamily={FONT.title} fontSize={52} fill={C.ink}>CD-7</text>
        <text x={465} y={1060} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={22} fill="#e8e4d6">AUTHORIZED ONLY</text>
        {[1180, 1420].map((y) => <rect key={y} x={318} y={y} width={30} height={60} rx={6} fill="#3a3d40" {...ink} strokeWidth={3} />)}
      </g>
    ) : null}
    <rect x={680} y={1090} width={110} height={170} rx={10} fill="#2a2c2e" {...ink} strokeWidth={4} />
    <rect x={695} y={1104} width={80} height={28} fill={open > 0 ? "#3bd16a" : "#203a28"} />
    {Array.from({ length: 9 }).map((_, k) => (
      <rect key={k} x={698 + (k % 3) * 26} y={1146 + Math.floor(k / 3) * 34} width={20} height={26} rx={3} fill={pressed === k ? "#ffe9a6" : "#8d9297"} />
    ))}
  </g>
);
export const KEYPAD = { x: 735, y: 1190 };

/** Civil-defense corridor, side view. `phoneX` places the red wall phone; `scroll` tracks. */
export const Corridor: React.FC<{ scroll?: number; phoneX?: number; handset?: boolean }> = ({ scroll = 0, phoneX = 640, handset = true }) => {
  const frame = useCurrentFrame();
  const wrap = (x: number, span: number) => ((x % span) + span) % span;
  return (
    <g>
      <rect width={1080} height={1920} fill="#bdbba5" />
      <rect y={1150} width={1080} height={510} fill="#7f8a6c" />
      <line x1={0} y1={1150} x2={1080} y2={1150} {...ink} strokeWidth={5} />
      <rect width={1080} height={420} fill="#8f8d7c" />
      {Array.from({ length: 3 }).map((_, i) => {
        const x = wrap(i * 560 + 120 - scroll, 1680) - 300;
        const on = random(`ct${i}-${Math.floor(frame / 3)}`) > (i === 1 ? 0.35 : 0.05);
        return (
          <g key={i}>
            <rect x={x} y={400} width={260} height={22} rx={8} fill={on ? "#f2f6e6" : "#6d6a60"} {...ink} strokeWidth={3} />
            {on ? <rect x={x - 60} y={422} width={380} height={600} fill="url(#tubeGlow2)" /> : null}
          </g>
        );
      })}
      {Array.from({ length: 2 }).map((_, i) => {
        const x = wrap(i * 840 + 260 - scroll, 1680) - 300;
        return (
          <g key={`p${i}`}>
            <rect x={x} y={640} width={220} height={300} fill="#e9dfb9" {...ink} />
            <circle cx={x + 110} cy={740} r={70} fill={C.ink} />
            {[0, 120, 240].map((a) => {
              const r = (a - 90) * (Math.PI / 180);
              const p = (rr: number, d: number) => `${x + 110 + Math.cos(r + d) * rr},${740 + Math.sin(r + d) * rr}`;
              return <polygon key={a} points={`${p(10, 0)} ${p(62, -0.5)} ${p(62, 0.5)}`} fill="#e8c23a" />;
            })}
            <text x={x + 110} y={872} textAnchor="middle" fontFamily={FONT.title} fontSize={40} fill={C.ink}>FALLOUT</text>
            <text x={x + 110} y={914} textAnchor="middle" fontFamily={FONT.title} fontSize={40} fill={C.ink}>SHELTER →</text>
          </g>
        );
      })}
      {/* red wall phone */}
      <g transform={`translate(${phoneX - scroll},0)`}>
        <rect x={-50} y={980} width={100} height={170} rx={10} fill="#a8261c" {...ink} />
        <path d="M0,1150 C-20,1250 30,1300 10,1380" fill="none" stroke={C.ink} strokeWidth={5} strokeDasharray={handset ? "0" : "0"} />
        {handset ? <rect x={-38} y={995} width={76} height={34} rx={14} fill="#2a2a2a" {...ink} strokeWidth={3} /> : null}
        {[0, 1, 2, 3, 4, 5].map((k) => <circle key={k} cx={-18 + (k % 3) * 18} cy={1060 + Math.floor(k / 3) * 24} r={6} fill="#e8e4d6" />)}
      </g>
      <rect y={TF.floor} width={1080} height={260} fill="#55524a" />
      <line x1={0} y1={TF.floor} x2={1080} y2={TF.floor} {...ink} strokeWidth={6} />
    </g>
  );
};
export const PHONE_HOOK_Y = 1012;

/** Round blast door with slot window (soldier's eyes) and rifle barrel. `eyes` -1..1 shifts his gaze. */
export const BlastDoor: React.FC<{ eyes?: number; rifle?: number; slotLight?: number; open?: number }> = ({ eyes = 0, rifle = 1, slotLight = 1, open = 0 }) => (
  <g>
    <rect width={1080} height={1920} fill="#474a45" />
    {Array.from({ length: 14 }).map((_, i) => <line key={i} x1={0} y1={300 + i * 100} x2={1080} y2={300 + i * 100} stroke="#3e413c" strokeWidth={4} />)}
    <rect x={40} y={260} width={1000} height={70} fill="#2d3a4a" {...ink} />
    <text x={540} y={310} textAnchor="middle" fontFamily={FONT.title} fontSize={52} fill="#e8e4d6">SHELTER 9 · CIVIL DEFENSE</text>
    <circle cx={540} cy={1100} r={470} fill="#3a3c3a" {...ink} strokeWidth={8} />
    {open > 0 ? (
      <g>
        <defs>
          <clipPath id="doorHole">
            <circle cx={540} cy={1100} r={420} />
          </clipPath>
        </defs>
        <g clipPath="url(#doorHole)">
          <ShelterHall />
        </g>
        <circle cx={540} cy={1100} r={420} fill="none" {...ink} strokeWidth={8} />
        <polygon points={`120,1100 960,1100 ${1080 + 300 * open},1920 ${-300 * open},1920`} fill="url(#warmPool)" opacity={0.5 * open} />
      </g>
    ) : null}
    <g transform={`translate(${open * 900},0)`}>
    <circle cx={540} cy={1100} r={420} fill="#7d8186" {...ink} strokeWidth={8} />
    {Array.from({ length: 16 }).map((_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return <circle key={i} cx={540 + Math.cos(a) * 380} cy={1100 + Math.sin(a) * 380} r={14} fill="#5d6166" {...ink} strokeWidth={3} />;
    })}
    <circle cx={540} cy={1250} r={110} fill="none" stroke="#4a4e52" strokeWidth={22} />
    {[0, 1, 2].map((k) => {
      const a = (k / 3) * Math.PI * 2 + 0.4;
      return <line key={k} x1={540} y1={1250} x2={540 + Math.cos(a) * 110} y2={1250 + Math.sin(a) * 110} stroke="#4a4e52" strokeWidth={18} strokeLinecap="round" />;
    })}
    {/* slot window */}
    <rect x={380} y={860} width={320} height={110} rx={10} fill="#0b0d10" {...ink} strokeWidth={6} />
    <g opacity={slotLight}>
      <rect x={390} y={870} width={300} height={90} fill="#d9c79a" opacity={0.35} />
      <path d="M430,870 Q540,840 650,870 L650,895 L430,895Z" fill={C.oliveDark} />
      <rect x={445} y={895} width={190} height={65} fill={C.skin} />
      <circle cx={515 + eyes * 30} cy={925} r={11} fill={C.ink} />
      <circle cx={565 + eyes * 30} cy={925} r={11} fill={C.ink} />
      <path d={`M${495 + eyes * 30},905 l40,6 M${585 + eyes * 30},905 l-40,6`} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
    </g>
    {/* gun port + rifle barrel */}
    <rect x={740} y={990} width={70} height={46} rx={8} fill="#0b0d10" {...ink} strokeWidth={4} />
    <rect x={810 - 150 * rifle} y={1004} width={150 * rifle + 10} height={18} fill="#1d1d1d" {...ink} strokeWidth={3} />
    </g>
    <circle cx={540} cy={915} r={420} fill="url(#warmPool)" opacity={0.25 * slotLight} />
    <rect y={TF.floor} width={1080} height={260} fill="#3a3c38" />
    <line x1={0} y1={TF.floor} x2={1080} y2={TF.floor} {...ink} strokeWidth={6} />
  </g>
);
export const SLOT = { x: 540, y: 915 };

/** Dr. Vale's face for the keycard photo (beard + glasses — clearly not Eli). */
const ValeFace: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={C.skin} stroke={C.ink} strokeWidth={r * 0.08} />
    <path d={`M${x - r * 0.85},${y + r * 0.1} Q${x},${y + r * 1.35} ${x + r * 0.85},${y + r * 0.1} Q${x},${y + r * 0.6} ${x - r * 0.85},${y + r * 0.1}Z`} fill="#6b4a32" stroke={C.ink} strokeWidth={r * 0.05} />
    {[-1, 1].map((s) => <circle key={s} cx={x + s * r * 0.32} cy={y - r * 0.12} r={r * 0.22} fill="none" stroke={C.ink} strokeWidth={r * 0.07} />)}
    <line x1={x - r * 0.1} y1={y - r * 0.12} x2={x + r * 0.1} y2={y - r * 0.12} stroke={C.ink} strokeWidth={r * 0.06} />
    {[-1, 1].map((s) => <circle key={`e${s}`} cx={x + s * r * 0.32} cy={y - r * 0.12} r={r * 0.07} fill={C.ink} />)}
    <path d={`M${x - r * 0.9},${y - r * 0.45} Q${x},${y - r * 1.25} ${x + r * 0.9},${y - r * 0.45} Q${x},${y - r * 0.8} ${x - r * 0.9},${y - r * 0.45}Z`} fill="#6b4a32" />
  </g>
);

/** Open case close-up: dosimeter, iodine packs, keycard. `zoom` 0..1 pushes onto the card photo. */
export const CaseOpen: React.FC<{ zoom: number }> = ({ zoom }) => {
  const s = 1 + zoom * 1.6;
  const cx = 730;
  const cy = 1180;
  return (
    <g transform={`translate(${cx},${cy}) scale(${s}) translate(${-cx},${-cy})`}>
      <rect x={90} y={760} width={900} height={760} rx={30} fill="#c3c8cc" stroke={C.ink} strokeWidth={10} />
      <rect x={130} y={800} width={820} height={680} rx={16} fill="#2b2e33" />
      <rect x={170} y={850} width={260} height={200} rx={16} fill="#e8c23a" stroke={C.ink} strokeWidth={6} />
      <circle cx={300} cy={940} r={60} fill="#f2efe6" stroke={C.ink} strokeWidth={5} />
      <line x1={300} y1={940} x2={340} y2={905} stroke={C.alertRed} strokeWidth={6} />
      <text x={300} y={1030} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={22} fill={C.ink}>DOSIMETER</text>
      {[0, 1, 2].map((k) => (
        <g key={k} transform={`translate(${170 + k * 95},1100)`}>
          <rect width={80} height={330} rx={10} fill="#e9e6dc" stroke={C.ink} strokeWidth={5} />
          {Array.from({ length: 6 }).map((_, j) => <circle key={j} cx={40} cy={40 + j * 48} r={16} fill="#f6f4ee" stroke="#9aa0a8" strokeWidth={3} />)}
          <text x={40} y={318} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={15} fill={C.ink}>IODINE</text>
        </g>
      ))}
      <g>
        <rect x={520} y={1000} width={400} height={360} rx={18} fill="#f4f2ea" stroke={C.ink} strokeWidth={6} />
        <rect x={520} y={1000} width={400} height={60} rx={18} fill={C.signBlue} />
        <text x={720} y={1042} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={24} fill="white">CIVIL DEFENSE · L3</text>
        <rect x={545} y={1080} width={150} height={190} fill="#d8dde2" stroke={C.ink} strokeWidth={4} />
        <ValeFace x={620} y={1170} r={58} />
        <text x={715} y={1120} fontFamily={FONT.title} fontSize={36} fill={C.ink}>DR. A. VALE</text>
        <text x={715} y={1160} fontFamily={FONT.mono} fontWeight={800} fontSize={18} fill="#555">SHELTER 9</text>
        <text x={715} y={1190} fontFamily={FONT.mono} fontWeight={800} fontSize={18} fill="#555">ACCESS: +1</text>
        <rect x={715} y={1230} width={170} height={36} fill={C.ink} />
      </g>
    </g>
  );
};

/** Inside Shelter 9: warm hall, bunks, hundreds of survivors, front desk (draw Ruth behind it per shot). */
export const ShelterHall: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="#d8cfae" />
    <rect width={1080} height={520} fill="#8f8670" />
    {[180, 540, 900].map((x) => (
      <g key={x}>
        <rect x={x - 130} y={500} width={260} height={20} rx={8} fill="#fff8e0" {...ink} strokeWidth={3} />
        <rect x={x - 200} y={520} width={400} height={500} fill="url(#tubeGlow2)" />
      </g>
    ))}
    {Array.from({ length: 5 }).map((_, i) => (
      <g key={i} transform={`translate(${i * 230 - 40},760)`}>
        <rect x={0} y={0} width={190} height={22} fill={C.olive} {...ink} strokeWidth={3} />
        <rect x={0} y={190} width={190} height={22} fill={C.olive} {...ink} strokeWidth={3} />
        <line x1={4} y1={0} x2={4} y2={420} stroke="#5d5848" strokeWidth={8} />
        <line x1={186} y1={0} x2={186} y2={420} stroke="#5d5848" strokeWidth={8} />
        <rect x={20} y={-26} width={60} height={28} rx={12} fill="#ece6d4" />
      </g>
    ))}
    {Array.from({ length: 34 }).map((_, i) => {
      const x = (i * 97 + (i % 3) * 31) % 1120 - 20;
      const kid = i % 4 === 0;
      const y = 1250 + (i % 3) * 90;
      const r = kid ? 26 : 36;
      const col = ["#5d6670", "#6f6658", "#4f5a5e", "#77706a"][i % 4];
      return (
        <g key={`p${i}`}>
          <rect x={x - r * 0.7} y={y} width={r * 1.4} height={kid ? 120 : 190} rx={r * 0.7} fill={col} />
          <circle cx={x} cy={y - r * 0.6} r={r} fill={col} />
        </g>
      );
    })}
    <rect x={360} y={1440} width={360} height={220} fill="#6b5340" {...ink} />
    <rect x={380} y={1420} width={320} height={26} fill="#7d6450" {...ink} strokeWidth={3} />
    <rect x={620} y={1360} width={14} height={60} fill="#2a2a2a" />
    <path d="M590,1360 L664,1360 L646,1320 L608,1320Z" fill={C.amber} {...ink} strokeWidth={3} />
    <circle cx={627} cy={1380} r={140} fill="url(#warmPool)" opacity={0.6} />
    <rect y={TF.floor} width={1080} height={260} fill="#a99f86" />
    <line x1={0} y1={TF.floor} x2={1080} y2={TF.floor} {...ink} strokeWidth={6} />
  </g>
);
