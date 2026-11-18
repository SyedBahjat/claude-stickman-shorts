import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { type Look, type Pose, STAND, Stick, YOU } from "./Stick";
import { FONT } from "./style";
import { SP } from "./SurvivalHud";

/**
 * SILENCE PROTOCOL: shared UI for EP02+.
 * These are COPIES of EP01-local components from `src/stories/silence-protocol/SilenceP1.tsx` (EP01 stays untouched),
 * parameterised where EP01 hard-coded text. Visual values (fonts, sizes, colours, springs, typing speed) are unchanged.
 */

export const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
export const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const lerp2 = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** EP01 seated pose (control-room chair, hip pinned at [245,1270]). */
export const SEATED: Pose = { ...STAND, legF: [1.5, 1.55], legB: [1.42, 1.5], lean: 0.12, armF: [1.1, 0.5], armB: [0.9, 0.6] };
/** EP01 infected pose. */
export const zPose = (f: number, k: number): Pose => ({
  ...STAND,
  armF: [0.85 + 0.12 * Math.sin(f / 13 + k), 0.25],
  armB: [0.75 + 0.12 * Math.sin(f / 11 + k * 2), 0.3],
  lean: 0.16,
  headTilt: 0.3 * Math.sin(f / 29 + k * 1.7),
});
export const infectedLook = (look: Look, t: number): Look => (t >= 1 ? { ...look, skin: "#8e9a86", blankEyes: true } : look);

/** EP01 world camera: frame world point (cx,cy) at zoom z, placed at screen (540, 860). */
export const WorldCam: React.FC<{ cx: number; cy: number; z: number; children: React.ReactNode }> = ({ cx, cy, z, children }) => (
  <g transform={`translate(540,860) scale(${z}) translate(${-cx},${-cy})`}>{children}</g>
);

/** EP01 `CountdownSlam` look (Anton 300 red + Anton 64 white line), any text. */
export const SlamTitle: React.FC<{ at: number; big: string; sub: string; top?: number; color?: string; bigSize?: number }> = ({ at, big, sub, top = 210, color = SP.red, bigSize = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = spring({ frame: frame - at, fps, config: { stiffness: 300, damping: 14 } });
  const g = random(`cg${Math.floor(frame / 3)}`) > 0.85 ? (random(`cgx${frame}`) - 0.5) * 18 : 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top, width: "100%", textAlign: "center", transform: `translateX(${g}px) scale(${interpolate(s, [0, 1], [1.6, 1])})`, opacity: Math.min(1, s * 1.5) }}>
        <div style={{ fontFamily: FONT.title, fontSize: bigSize, lineHeight: 0.9, color, textShadow: `0 0 40px ${color}99, 0 10px 0 #130f0b`, WebkitTextStroke: "6px #130f0b", paintOrder: "stroke fill" }}>{big}</div>
        <div style={{ fontFamily: FONT.title, fontSize: 64, letterSpacing: 8, color: "white", textShadow: "0 4px 12px rgba(0,0,0,0.9)" }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

/** EP01 surveillance flow chips (EXT MIC 01 › SPEECH-TO-TEXT › SCREEN ONLY), any labels. */
export const FlowChips: React.FC<{ chips: [string, string, string][]; start?: number; step?: number }> = ({ chips, start = 20, step = 22 }) => {
  const frame = useCurrentFrame();
  const st = (i: number) => ramp(frame, start + i * step, start + 10 + i * step);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 290, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {chips.map(([a, b, col], i) => (
          <React.Fragment key={a}>
            <div style={{ opacity: st(i), transform: `scale(${0.8 + 0.2 * st(i)})`, background: "rgba(7,10,11,0.9)", border: `2px solid ${col}`, borderRadius: 10, padding: "12px 10px", width: 290, textAlign: "center" }}>
              <div style={{ fontFamily: FONT.title, fontSize: 34, whiteSpace: "nowrap", color: "white", letterSpacing: 1 }}>{a}</div>
              <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 18, color: col, letterSpacing: 2 }}>{b}</div>
            </div>
            {i < chips.length - 1 ? <div style={{ fontFamily: FONT.title, fontSize: 60, color: SP.mute, opacity: st(i + 1) }}>›</div> : null}
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** EP01 crossed-out speaker + "AUDIO PLAYBACK: DISABLED — TEXT ONLY" bar. */
export const PlaybackDisabled: React.FC = () => (
  <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", border: `2px solid ${SP.red}`, borderRadius: 8, fontFamily: FONT.mono, fontWeight: 800, fontSize: 24, color: SP.red }}>
    <svg width="44" height="34" viewBox="0 0 44 34"><path d="M2,10 L10,10 L20,2 L20,32 L10,24 L2,24Z" fill={SP.red} /><path d="M26,8 L40,26 M40,8 L26,26" stroke={SP.red} strokeWidth="4" strokeLinecap="round" /></svg>
    AUDIO PLAYBACK: DISABLED — TEXT ONLY
  </div>
);

export interface TLine { meta: string; text: string; at: number; color?: string; size?: number }

/**
 * EP01 `Transcript` monitor (full screen, typed at 1.4 chars/frame, green ▌ cursor, waveform, playback disabled),
 * with a configurable header and lines (each with its own start frame). `glitchAt` = red border + horizontal jitter;
 * `corrupt` 0..1 replaces characters with block glyphs (signal degradation; never digits or letters).
 */
export const MonitorTranscript: React.FC<{
  dur: number; title: string; right?: string; lines: TLine[]; glitchAt?: number; corrupt?: (f: number) => number; wave?: string; extra?: React.ReactNode; you?: boolean; cps?: number;
}> = ({ dur, title, right = "● REC", lines, glitchAt, corrupt, wave = "#5a1712", extra, you = true, cps = 1.4 }) => {
  const frame = useCurrentFrame();
  const glitch = glitchAt != null && frame >= glitchAt;
  const gx = glitch && random(`tg${Math.floor(frame / 2)}`) > 0.5 ? (random(`tgx${frame}`) - 0.5) * 30 : 0;
  const c = corrupt ? corrupt(frame) : 0;
  const mangle = (s: string, k: number) =>
    c <= 0 ? s : s.split("").map((ch, j) => (ch !== " " && random(`cr${k}-${j}-${Math.floor(frame / 3)}`) < c ? "█▓▒░"[Math.floor(random(`cg${k}-${j}-${frame}`) * 4)] : ch)).join("");
  return (
    <>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.06 * ramp(frame, 0, dur)})` }}>
        <AbsoluteFill style={{ background: "#040706" }}>
          <div style={{ position: "absolute", left: 40, right: 40, top: 290, bottom: 520, border: `3px solid ${glitch ? SP.red : SP.greenDim}`, borderRadius: 16, padding: "24px 30px", background: "#06100c", transform: `translateX(${gx}px)`, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: SP.mute }}>
              <span>{title}</span>
              <span style={{ color: SP.red }}>{right}</span>
            </div>
            <PlaybackDisabled />
            <div style={{ display: "flex", gap: 4, alignItems: "center", height: 80, marginTop: 14 }}>
              {Array.from({ length: 60 }).map((_, k) => {
                const a = 8 + Math.abs(Math.sin(frame / 3 + k * 0.7)) * 60 * (0.3 + random(`tw${k}-${Math.floor(frame / 3)}`) * 0.7) * (1 - 0.85 * c);
                return <div key={k} style={{ flex: 1, height: a, background: wave }} />;
              })}
            </div>
            {extra}
            {lines.map((l, i) => {
              if (frame < l.at) return null;
              const shown = Math.max(0, Math.min(l.text.length, Math.floor((frame - l.at) * cps)));
              const last = i === lines.length - 1 || frame < lines[i + 1].at;
              return (
                <div key={i} style={{ marginTop: 20, fontFamily: FONT.mono, fontWeight: 800 }}>
                  <div style={{ fontSize: 20, color: SP.mute, letterSpacing: 2 }}>{l.meta}</div>
                  <div style={{ fontSize: l.size ?? 50, color: l.color ?? "#cfe9d8", lineHeight: 1.15 }}>
                    &gt; {mangle(l.text.slice(0, shown), i)}
                    {last && (shown < l.text.length || Math.floor(frame / 8) % 2) ? <span style={{ color: SP.green }}>▌</span> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      {you ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
            <Stick x={60} floor={2500} scale={2.1} look={YOU} pose={{ ...STAND, lean: 0.08 }} lookAt={1} hideLegs />
          </svg>
        </AbsoluteFill>
      ) : null}
    </>
  );
};

/** EP01 `SpecCard` (letter tile, Anton 66 name, mono 46 sub, ▸ lines), slides in from the right. */
export const SpecCard: React.FC<{ letter: string; name: string; price: string; lines: string[]; color: string; at?: number }> = ({ letter, name, price, lines, color, at = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame < at ? 0 : spring({ frame: frame - at, fps, config: { stiffness: 260, damping: 17 } });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 290, transform: `translateX(${(1 - s) * 600}px)`, opacity: s, background: "rgba(6,9,12,0.9)", border: `3px solid ${color}`, borderRadius: 14, padding: "18px 26px", boxShadow: `0 0 40px ${color}44` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 92, height: 92, borderRadius: 10, background: color, color: "#0b0f12", fontFamily: FONT.title, fontSize: 78, display: "flex", alignItems: "center", justifyContent: "center" }}>{letter}</div>
          <div>
            <div style={{ fontFamily: FONT.title, fontSize: 66, color: "white", lineHeight: 1 }}>{name}</div>
            <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 46, color }}>{price}</div>
          </div>
        </div>
        {lines.map((l) => <div key={l} style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 25, color: SP.text, marginTop: 10, letterSpacing: 1 }}>▸ {l}</div>)}
      </div>
    </AbsoluteFill>
  );
};

/** Small EP01-style label chip (Anton on a dark panel, coloured border), e.g. "ZONE OF ABSOLUTE SILENCE · 60 S". */
export const Chip: React.FC<{ text: string; color: string; top?: number; opacity?: number; size?: number; textColor?: string }> = ({ text, color, top = 300, opacity = 1, size = 52, textColor }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", top, width: "100%", textAlign: "center", opacity }}>
      <div style={{ display: "inline-block", padding: "10px 26px", background: "rgba(6,9,12,0.88)", border: `2px solid ${color}`, borderRadius: 10, fontFamily: FONT.title, fontSize: size, letterSpacing: 3, color: textColor ?? color }}>{text}</div>
    </div>
  </AbsoluteFill>
);
