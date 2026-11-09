import React from "react";
import { C } from "./style";

const GOLD = "#d9a441";
const GOLD_DARK = "#b8822c";

interface DogProps {
  x: number; // between the paws (px)
  floor: number;
  facing?: 1 | -1;
  scale?: number;
  phase?: number; // walk cycle (0 = standing still)
  walking?: boolean;
  wag?: number; // tail wag angle (radians), animate with sin(frame)
  bark?: number; // 0..1 mouth open
  headTilt?: number; // radians (curious tilt)
  crouch?: number; // 0..1 low, scared / growling posture
}

/** Biscuit: flat golden dog in the house style (ink outline, dot eye, red collar with tag). */
export const Dog: React.FC<DogProps> = ({ x, floor, facing = 1, scale = 1, phase = 0, walking = false, wag = 0, bark = 0, headTilt = 0, crouch = 0 }) => {
  const legLen = 70 - 18 * crouch;
  const bodyY = -legLen - 30;
  const swing = (k: number) => (walking ? Math.sin((phase + k) * Math.PI * 2) * 0.45 : 0);
  const leg = (hx: number, k: number) => {
    const a = swing(k);
    const fx = hx + Math.sin(a) * legLen;
    const fy = bodyY + 18 + Math.cos(a) * legLen;
    return (
      <g key={`${hx}${k}`}>
        <line x1={hx} y1={bodyY + 18} x2={fx} y2={Math.min(0, fy)} stroke={C.ink} strokeWidth={26} strokeLinecap="round" />
        <line x1={hx} y1={bodyY + 18} x2={fx} y2={Math.min(0, fy)} stroke={k % 1 === 0.5 ? GOLD_DARK : GOLD} strokeWidth={14} strokeLinecap="round" />
      </g>
    );
  };
  const headX = 92;
  const headY = bodyY - 40 + 10 * crouch;
  return (
    <g transform={`translate(${x},${floor}) scale(${scale * facing},${scale})`}>
      {/* back legs (far side) */}
      {leg(-52, 0.5)}
      {leg(52, 0)}
      {/* tail */}
      <g transform={`translate(-78,${bodyY - 6}) rotate(${-40 + (wag * 180) / Math.PI})`}>
        <path d="M0,0 Q-10,-40 6,-70" fill="none" stroke={C.ink} strokeWidth={22} strokeLinecap="round" />
        <path d="M0,0 Q-10,-40 6,-70" fill="none" stroke={GOLD} strokeWidth={10} strokeLinecap="round" />
      </g>
      {/* body */}
      <ellipse cx={0} cy={bodyY} rx={88} ry={38} fill={GOLD} stroke={C.ink} strokeWidth={7} />
      {/* near legs */}
      {leg(-38, 0)}
      {leg(66, 0.5)}
      {/* neck + head */}
      <g transform={`rotate(${(headTilt * 180) / Math.PI} ${headX} ${headY})`}>
        <path d={`M60,${bodyY - 18} L${headX - 10},${headY + 20}`} stroke={C.ink} strokeWidth={42} strokeLinecap="round" />
        <path d={`M60,${bodyY - 18} L${headX - 10},${headY + 20}`} stroke={GOLD} strokeWidth={28} strokeLinecap="round" />
        <rect x={headX - 34} y={headY + 18} width={34} height={12} rx={6} fill={C.alertRed} stroke={C.ink} strokeWidth={3} transform={`rotate(-30 ${headX - 17} ${headY + 24})`} />
        <circle cx={headX - 22} cy={headY + 40} r={7} fill="#e8c23a" stroke={C.ink} strokeWidth={2} />
        <circle cx={headX} cy={headY} r={36} fill={GOLD} stroke={C.ink} strokeWidth={7} />
        {/* snout (lower jaw opens when barking) */}
        <path d={`M${headX + 20},${headY - 4} q34,2 40,14 q-4,10 -38,10Z`} fill={GOLD} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
        <path d={`M${headX + 20},${headY + 18} q30,${6 + 18 * bark} 34,${4 + 22 * bark}`} fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        <circle cx={headX + 60} cy={headY + 8} r={7} fill={C.ink} />
        <circle cx={headX + 10} cy={headY - 10} r={5.5} fill={C.ink} />
        {/* floppy ear */}
        <path d={`M${headX - 18},${headY - 26} q-26,10 -20,52 q14,-6 22,-40Z`} fill={GOLD_DARK} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
      </g>
    </g>
  );
};
