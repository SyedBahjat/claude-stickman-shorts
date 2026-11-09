import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./style";

const S = 1.5;

/** Zombie-series HUD: DAY / time / place on the left, speaker + MUSIC ON/OFF on the right (Rule 1). */
export const ZombieHud: React.FC<{ day: number; time: string; place: string; music: boolean; extra?: string }> = ({ day, time, place, music, extra }) => {
  const frame = useCurrentFrame();
  const [hm, ampm] = time.split(" ");
  const pulse = music ? 1 : 0.55 + 0.45 * Math.abs(Math.sin(frame / 6));
  const col = music ? C.optionGreen : C.alertRed;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.mono, textShadow: "0 2px 8px rgba(0,0,0,0.75)", pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 30 * S, top: 44 * S }}>
        <div style={{ color: C.hudRed, fontSize: 11 * S, fontWeight: 800, letterSpacing: 2 * S }}>● DAY {day}</div>
        <div style={{ color: "white", fontSize: 27 * S, fontWeight: 700, lineHeight: 1.05 }}>
          {hm}
          <span style={{ fontSize: 12 * S, marginLeft: 6 * S }}>{ampm}</span>
        </div>
        <div style={{ color: "#c9c4b4", fontSize: 9 * S, fontWeight: 700, letterSpacing: 2 * S }}>{place}</div>
      </div>
      <div style={{ position: "absolute", right: 30 * S, top: 46 * S, textAlign: "right" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: `3px solid ${col}`, borderRadius: 10, padding: "6px 14px", background: "rgba(10,10,10,0.55)", opacity: pulse }}>
          <svg width={34} height={30} viewBox="0 0 34 30">
            <path d="M2,10 h8 l10,-8 v26 l-10,-8 h-8z" fill={col} />
            {music ? (
              <g fill="none" stroke={col} strokeWidth={3} strokeLinecap="round">
                <path d="M24,9 q4,6 0,12" />
                <path d="M28,5 q7,10 0,20" />
              </g>
            ) : (
              <path d="M24,9 l8,12 M32,9 l-8,12" stroke={col} strokeWidth={3} strokeLinecap="round" />
            )}
          </svg>
          <span style={{ color: col, fontSize: 14 * S, fontWeight: 800, letterSpacing: 2 }}>MUSIC {music ? "ON" : "OFF"}</span>
        </div>
        {extra ? <div style={{ color: C.capYellow, fontSize: 11 * S, fontWeight: 800, marginTop: 8 }}>{extra}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

/** Big tilted "DAY N" slam that pops in and fades after ~2 s. */
export const DayTitle: React.FC<{ day: number; at?: number }> = ({ day, at = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = spring({ frame: frame - at, fps, config: { stiffness: 260, damping: 12 } });
  const fade = interpolate(frame - at, [55, 70], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 520, transform: `scale(${s}) rotate(-5deg)`, opacity: fade, fontFamily: FONT.title, fontSize: 230, lineHeight: 1, color: "white", WebkitTextStroke: "14px #130f0b", paintOrder: "stroke fill", textShadow: "0 14px 0 #130f0b" }}>
        DAY <span style={{ color: C.capYellow }}>{day}</span>
      </div>
    </AbsoluteFill>
  );
};
