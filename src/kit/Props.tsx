import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./style";

export interface Alert {
  who: string;
  msg: string;
  time: string;
  emergency?: boolean;
}

/** POV phone held in two thumbs (right one has the red band). Lock screen with alert rows + optional text banner. */
export const Phone: React.FC<{ time: string; count: number; alerts: Alert[]; banner?: { who: string; msg: string[]; at: number }; buzzAt?: number }> = ({ time, count, alerts, banner, buzzAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { stiffness: 140, damping: 18 } });
  const buzz = buzzAt != null && frame >= buzzAt && frame < buzzAt + 24 ? Math.sin((frame - buzzAt) * 2.6) * 7 : 0;
  const bs = banner && frame >= banner.at ? spring({ frame: frame - banner.at, fps, config: { stiffness: 220, damping: 18 } }) : 0;
  const thumb = (x: number, rot: number, band: boolean) => (
    <g transform={`translate(${x},1400) rotate(${rot})`}>
      <rect x={-46} y={-40} width={92} height={420} rx={46} fill={C.skin} stroke={C.ink} strokeWidth={9} />
      {band ? <rect x={-41} y={150} width={82} height={44} fill={C.alertRed} /> : null}
    </g>
  );
  return (
    <AbsoluteFill style={{ transform: `translate(${buzz}px, ${interpolate(rise, [0, 1], [700, 0])}px)` }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <g transform="rotate(-3 540 960)">
          <rect x={250} y={290} width={580} height={1180} rx={78} fill="#16181c" stroke={C.ink} strokeWidth={10} />
          <rect x={272} y={312} width={536} height={1136} rx={60} fill="#22252b" />
          <text x={540} y={395} textAnchor="middle" fill="#9aa0a8" fontFamily={FONT.caption} fontWeight={900} fontSize={24}>Monday</text>
          <text x={540} y={545} textAnchor="middle" fill="white" fontFamily={FONT.title} fontSize={130}>{time}</text>
          <rect x={410} y={570} width={260} height={66} rx={33} fill={C.alertRed} />
          <text x={540} y={616} textAnchor="middle" fill="white" fontFamily={FONT.title} fontSize={42}>{count} ALERTS</text>
          {alerts.map((a, i) => (
            <g key={i} transform={`translate(296,${660 + i * 122})`}>
              <rect width={488} height={104} rx={18} fill="#2e3239" stroke={a.emergency ? C.alertRed : "none"} strokeWidth={4} />
              <text x={22} y={36} fill={a.emergency ? C.alertRed : "#c7ccd4"} fontFamily={FONT.caption} fontWeight={900} fontSize={17}>{a.who}</text>
              <text x={466} y={36} textAnchor="end" fill="#8a9099" fontFamily={FONT.caption} fontWeight={900} fontSize={16}>{a.time}</text>
              <text x={22} y={76} fill="white" fontFamily={FONT.caption} fontWeight={900} fontSize={25}>{a.msg}</text>
            </g>
          ))}
        </g>
        {thumb(250, 28, false)}
        {thumb(830, -28, true)}
      </svg>
      {bs > 0 && banner ? (
        <div
          style={{
            position: "absolute", left: 70, right: 70, top: 380, background: "#f6f6f4", borderRadius: 34, padding: "30px 38px", boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
            transform: `translateY(${interpolate(bs, [0, 1], [-260, 0])}px)`, opacity: bs, fontFamily: FONT.caption, fontWeight: 900,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 62, height: 62, borderRadius: 31, background: "#c9467a", color: "white", fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>{banner.who[0]}</div>
            <div>
              <div style={{ fontSize: 34, color: "#111" }}>{banner.who}</div>
              <div style={{ fontSize: 20, color: "#888" }}>Messages</div>
            </div>
          </div>
          {banner.msg.map((m) => (
            <div key={m} style={{ fontSize: 38, color: "#111", marginTop: 12 }}>{m}</div>
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Trefoil: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => {
  const blade = (a: number) => {
    const a1 = ((a - 30) * Math.PI) / 180;
    const a2 = ((a + 30) * Math.PI) / 180;
    const ri = r * 0.22;
    const p = (rr: number, aa: number) => `${cx + Math.cos(aa) * rr},${cy + Math.sin(aa) * rr}`;
    return `M${p(ri, a1)} L${p(r * 0.92, a1)} A${r * 0.92},${r * 0.92} 0 0 1 ${p(r * 0.92, a2)} L${p(ri, a2)} A${ri},${ri} 0 0 0 ${p(ri, a1)}Z`;
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#f2c230" stroke={C.ink} strokeWidth={8} />
      {[-90, 30, 150].map((a) => <path key={a} d={blade(a)} fill={C.ink} />)}
      <circle cx={cx} cy={cy} r={r * 0.15} fill={C.ink} />
    </g>
  );
};

/** NUCLEAR STRIKE TV screen content (fills its box). */
export const AlertScreen: React.FC<{ x: number; y: number; w: number; h: number; countdown?: string; flicker?: number }> = ({ x, y, w, h, countdown, flicker = 1 }) => (
  <g opacity={flicker}>
    <rect x={x} y={y} width={w} height={h} fill={C.tvRed} />
    <rect x={x} y={y} width={w} height={h} fill="url(#tvGlowInner)" />
    <Trefoil cx={x + w / 2} cy={y + h * 0.27} r={h * 0.15} />
    <text x={x + w / 2} y={y + h * 0.62} textAnchor="middle" fill="white" fontFamily={FONT.title} fontSize={h * 0.17} stroke={C.ink} strokeWidth={3} paintOrder="stroke">NUCLEAR STRIKE</text>
    {countdown ? <text x={x + w / 2} y={y + h * 0.86} textAnchor="middle" fill={C.capYellow} fontFamily={FONT.mono} fontWeight={800} fontSize={h * 0.15}>{countdown}</text> : null}
  </g>
);

/** City map pinned to the wall: grid, river, park, HERE, metro M, red circle drawn over `circleT` (0..1), route over `routeT`. */
export const WallMap: React.FC<{ circleT: number; routeT?: number; date: string }> = ({ circleT, routeT = 0, date }) => {
  const frame = useCurrentFrame();
  const circ = 2 * Math.PI * 330;
  const route = "M540,1060 L540,940 L700,940 L700,800 L770,800";
  const routeLen = 120 + 160 + 140 + 70;
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <rect x={60} y={520} width={960} height={900} fill={C.paper} stroke={C.ink} strokeWidth={10} />
      {Array.from({ length: 15 }).map((_, i) => <line key={`v${i}`} x1={60 + i * 64} y1={520} x2={60 + i * 64} y2={1420} stroke="#bfae86" strokeWidth={i % 3 === 0 ? 9 : 4} />)}
      {Array.from({ length: 14 }).map((_, i) => <line key={`h${i}`} x1={60} y1={520 + i * 64} x2={1020} y2={520 + i * 64} stroke="#bfae86" strokeWidth={i % 3 === 0 ? 9 : 4} />)}
      <path d="M60,1210 C260,1130 420,1290 640,1220 C820,1160 900,1200 1020,1150 L1020,1290 C900,1330 760,1300 620,1340 C400,1400 240,1290 60,1340Z" fill="#8fb4d4" opacity={0.85} />
      <rect x={260} y={760} width={170} height={110} fill="#a9c79a" opacity={0.8} />
      <rect x={522} y={1042} width={36} height={36} fill={C.ink} />
      <text x={540} y={1112} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={24} fill={C.ink}>HERE</text>
      <circle cx={790} cy={790} r={34} fill={C.signBlue} stroke="white" strokeWidth={6} />
      <text x={790} y={804} textAnchor="middle" fontFamily={FONT.title} fontSize={40} fill="white">M</text>
      {routeT > 0 ? (
        <g>
          <path d={route} fill="none" stroke="#2f5fb3" strokeWidth={12} strokeLinejoin="round" strokeDasharray={routeLen} strokeDashoffset={routeLen * (1 - routeT)} />
          <text x={560} y={910} fontFamily={FONT.mono} fontWeight={800} fontSize={30} fill="#2f5fb3" opacity={routeT}>6 MIN</text>
        </g>
      ) : null}
      <circle cx={540} cy={960} r={330} fill="none" stroke={C.alertRed} strokeWidth={14} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - circleT)} transform="rotate(-100 540 960)" />
      <text x={130} y={620} fontFamily={FONT.hand} fontSize={64} fill={C.alertRed} transform="rotate(-6 130 620)" opacity={interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) })}>{date}</text>
      <circle cx={540} cy={520} r={16} fill="#c79a3a" stroke={C.ink} strokeWidth={5} />
    </svg>
  );
};
