import React from "react";
import { AbsoluteFill } from "remotion";
import { Dog } from "../kit/Dog";
import { JUNE, STAND, Stick, StickDefs, TURNED, walk, YOU } from "../kit/Stick";
import { C, FONT } from "../kit/style";

/** 1280x640 repo / social banner, drawn with the same rig as the videos. `npx remotion still src/index.ts Banner assets/banner.png` */
export const Banner: React.FC = () => {
  const choice = (letter: string, text: string, color: string) => (
    <div style={{ display: "flex", alignItems: "center", height: 58, marginTop: 14, background: "#121212", border: `4px solid ${color}`, borderRadius: 10, boxShadow: `0 0 18px ${color}88`, width: 470 }}>
      <div style={{ width: 40, height: 44, marginLeft: 8, background: color, borderRadius: 5, color: C.ink, fontFamily: FONT.title, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>{letter}</div>
      <div style={{ marginLeft: 16, fontFamily: FONT.title, fontSize: 32, color: "white", letterSpacing: 1 }}>{text}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 72% 60%, #3a3226 0%, #17120d 70%)" }}>
      <svg viewBox="0 0 1280 640" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <StickDefs />
        <rect x={0} y={560} width={1280} height={80} fill="#0e0b08" />
        <ellipse cx={930} cy={300} rx={330} ry={240} fill="#ffd98a" opacity={0.07} />
        <Stick x={1225} floor={585} scale={0.46} facing={-1} look={TURNED[1]} pose={{ ...STAND, armF: [1.35, 0.1], armB: [1.25, 0.15], lean: 0.12 }} />
        <Stick x={1140} floor={590} scale={0.46} facing={-1} look={TURNED[0]} pose={{ ...STAND, armF: [1.4, 0.05], armB: [1.3, 0.1], lean: 0.1 }} />
        <Stick x={985} floor={595} scale={0.5} facing={-1} look={YOU} pose={walk(0.3, 1.1)} />
        <Stick x={885} floor={592} scale={0.48} facing={-1} look={JUNE} pose={walk(0.8, 1.1)} />
        <Dog x={1050} floor={598} scale={0.42} facing={-1} wag={0.6} />
      </svg>
      <div style={{ position: "absolute", left: 64, top: 70 }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 22, color: C.hudRed, letterSpacing: 4 }}>● CLAUDE CODE SKILL</div>
        <div style={{ fontFamily: FONT.title, fontSize: 112, color: "white", lineHeight: 1.02, marginTop: 10, textShadow: "0 6px 18px rgba(0,0,0,0.7)" }}>
          STICKMAN <span style={{ color: C.capYellow }}>SHORTS</span>
        </div>
        <div style={{ fontFamily: FONT.caption, fontWeight: 900, fontSize: 27, color: "white", marginTop: 8, maxWidth: 640, lineHeight: 1.25 }}>
          CLONE <span style={{ color: C.capYellow }}>ANY VIDEO FORMAT</span> WITH CLAUDE<br />FOR SHORTS, TIKTOK, REELS &amp; YOUTUBE
        </div>
        <div style={{ marginTop: 26 }}>
          {choice("A", "GIVE IT A STORY", C.alertRed)}
          {choice("B", "GIVE IT ANY VIDEO", C.optionGreen)}
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            {["EXPLAINERS", "TOP 10S", "STORIES", "QUIZZES", "LONG-FORM"].map((t) => (
              <div key={t} style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 15, color: "#c9c4b4", border: "2px solid #4a4238", borderRadius: 6, padding: "6px 10px", letterSpacing: 1 }}>{t}</div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
