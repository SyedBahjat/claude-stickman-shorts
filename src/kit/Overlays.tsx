import type { Caption } from "@remotion/captions";
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./style";

const S = 1.5; // values designed at 720 wide → 1080 wide

/** Top HUD: day/time/location left, countdown right. Countdown is in seconds (ticks down live). */
export const Hud: React.FC<{ time: string; place: string; label?: string; countdown?: number | null; day?: number }> = ({ time, place, label = "IMPACT IN", countdown, day = 1 }) => {
  const [hm, ampm] = time.split(" ");
  const cd = countdown == null ? null : Math.max(0, countdown);
  const fmt = cd == null ? "" : cd >= 3600
    ? `${Math.floor(cd / 3600)}:${String(Math.floor((cd % 3600) / 60)).padStart(2, "0")}:${String(Math.floor(cd % 60)).padStart(2, "0")}`
    : `${Math.floor(cd / 60)}:${String(Math.floor(cd % 60)).padStart(2, "0")}`;
  const shadow = "0 2px 8px rgba(0,0,0,0.7)";
  return (
    <AbsoluteFill style={{ fontFamily: FONT.mono, textShadow: shadow, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 30 * S, top: 44 * S }}>
        <div style={{ color: C.hudRed, fontSize: 11 * S, fontWeight: 800, letterSpacing: 2 * S }}>● DAY {day}</div>
        <div style={{ color: "white", fontSize: 27 * S, fontWeight: 700, lineHeight: 1.05 }}>
          {hm}
          <span style={{ fontSize: 12 * S, marginLeft: 6 * S }}>{ampm}</span>
        </div>
        <div style={{ color: "#c9c4b4", fontSize: 9 * S, fontWeight: 700, letterSpacing: 2 * S }}>{place}</div>
      </div>
      {cd == null ? null : (
        <div style={{ position: "absolute", right: 30 * S, top: 44 * S, textAlign: "right" }}>
          <div style={{ color: "#c9c4b4", fontSize: 9 * S, fontWeight: 700, letterSpacing: 2 * S }}>{label}</div>
          <div style={{ color: C.capYellow, fontSize: 20 * S, fontWeight: 700 }}>{fmt}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export interface CapLine {
  start: number; // absolute frame the line's audio starts
  end: number; // last frame captions may stay up
  words: Caption[];
  yellow: string[]; // keywords (uppercase, no punctuation)
}

const clean = (w: string) => w.trim().toUpperCase().replace(/[^A-Z0-9'-]/g, "");

/** Word-by-word captions: pages of ≤4 words, break on punctuation. */
export const Captions: React.FC<{ lines: CapLine[]; lowFrom?: number }> = ({ lines, lowFrom = Infinity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = lines.find((l) => frame >= l.start && frame < l.end);
  if (!line) return null;
  const top = frame >= lowFrom ? 86 : 74;
  const words = line.words.map((w) => ({ text: w.text.trim(), at: line.start + Math.round((w.startMs / 1000) * fps) }));
  const pages: (typeof words)[] = [];
  let cur: typeof words = [];
  for (const w of words) {
    cur.push(w);
    const chars = cur.map((c) => c.text).join(" ").length;
    if (/[.,?!:]$/.test(w.text) || cur.length >= 4 || chars > 17) {
      pages.push(cur);
      cur = [];
    }
  }
  if (cur.length) pages.push(cur);
  const page = [...pages].reverse().find((p) => frame >= p[0].at);
  if (!page) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", top: `${top}%`, width: "100%", textAlign: "center", fontFamily: FONT.caption, fontWeight: 900,
          fontSize: 35 * S, letterSpacing: 0.5, color: "white", WebkitTextStroke: `${3.4 * S}px #000`, paintOrder: "stroke fill",
          textShadow: "0 4px 10px rgba(0,0,0,0.6)", padding: "0 40px", lineHeight: 1.15,
        }}
      >
        {page.filter((w) => frame >= w.at).map((w, i) => {
          return (
            <span key={i} style={{ display: "inline-block", margin: "0 0.16em", color: line.yellow.includes(clean(w.text)) ? C.capYellow : "white" }}>
              {w.text.toUpperCase()}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Taped paper rule note. Slams in at `at` (frame within sequence), parks top-left. */
export const RuleCard: React.FC<{ label: string; text: string[]; at?: number; big?: boolean }> = ({ label, text, at = 0, big = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = spring({ frame: frame - at, fps, config: { stiffness: 320, damping: 16 } });
  const scale = interpolate(s, [0, 1], [1.5, 1]);
  const park = big ? interpolate(frame - at, [40, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }) : 1;
  const size = interpolate(park, [0, 1], [1, 0.62]);
  const x = interpolate(park, [0, 1], [150, 40]);
  const y = interpolate(park, [0, 1], [330, 300]);
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, transformOrigin: "top left", transform: `scale(${scale * size}) rotate(-4deg)`,
        background: C.paper, border: `5px solid ${C.ink}`, boxShadow: "10px 12px 0 rgba(0,0,0,0.45)", padding: "22px 34px 26px", opacity: Math.min(1, s * 2),
      }}
    >
      <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 20, letterSpacing: 4, color: C.alertRed }}>{label}</div>
      {text.map((t) => (
        <div key={t} style={{ fontFamily: FONT.title, fontSize: 104, lineHeight: 0.98, color: C.ink }}>{t}</div>
      ))}
      <div style={{ position: "absolute", left: -30, top: 40, width: 18, height: 18, background: C.alertRed }} />
    </div>
  );
};

/** End-of-part A/B choice cards + optional FOLLOW FOR PART N title. Frames relative to sequence. */
export const ChoiceCards: React.FC<{ a: string; b: string; aAt: number; bAt: number; followAt?: number; part: number }> = ({ a, b, aAt, bAt, followAt, part }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = (letter: string, text: string, color: string, at: number, top: number) => {
    if (frame < at) return null;
    const s = spring({ frame: frame - at, fps, config: { stiffness: 300, damping: 15 } });
    return (
      <div
        style={{
          position: "absolute", left: 60, right: 60, top, height: 112, background: "#121212", border: `5px solid ${color}`, borderRadius: 14,
          boxShadow: `0 0 26px ${color}88`, display: "flex", alignItems: "center", transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`, opacity: s,
        }}
      >
        <div style={{ width: 70, height: 84, marginLeft: 14, background: color, borderRadius: 6, color: C.ink, fontFamily: FONT.title, fontSize: 66, display: "flex", alignItems: "center", justifyContent: "center" }}>{letter}</div>
        <div style={{ marginLeft: 26, fontFamily: FONT.title, fontSize: 62, color: "white", letterSpacing: 1 }}>{text}</div>
      </div>
    );
  };
  const fs = followAt == null || frame < followAt ? 0 : spring({ frame: frame - followAt, fps, config: { stiffness: 260, damping: 13 } });
  return (
    <AbsoluteFill>
      {card("A", a, C.alertRed, aAt, 1180)}
      {card("B", b, C.optionGreen, bAt, 1318)}
      {fs > 0 ? (
        <div style={{ position: "absolute", top: 1030, width: "100%", textAlign: "center", fontFamily: FONT.title, fontSize: 104, color: "white", transform: `scale(${fs})`, textShadow: "0 6px 16px rgba(0,0,0,0.8)" }}>
          FOLLOW FOR <span style={{ color: C.capYellow }}>PART {part}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** Slow push-in camera (+ optional decaying shake). `origin` in % of frame. */
export const Cam: React.FC<{ dur: number; from?: number; to?: number; origin?: string; pan?: [number, number]; shake?: number; children: React.ReactNode }> = ({
  dur, from = 1, to = 1.06, origin = "50% 50%", pan = [0, 0], shake = 0, children,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, dur], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const sc = from + (to - from) * t;
  const sx = shake ? (random(`sx${frame}`) - 0.5) * shake * Math.exp(-frame / 20) : 0;
  const sy = shake ? (random(`sy${frame}`) - 0.5) * shake * Math.exp(-frame / 20) : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${pan[0] * t + sx}px,${pan[1] * t + sy}px) scale(${sc})`, transformOrigin: origin }}>{children}</AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.75 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 62% at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${strength}) 100%)`, pointerEvents: "none" }} />
);

/** Blurred, darkened background for close-ups (depth of field). */
export const Blurred: React.FC<{ px?: number; dim?: number; children: React.ReactNode }> = ({ px = 14, dim = 0.55, children }) => (
  <AbsoluteFill style={{ filter: `blur(${px}px) brightness(${dim})`, transform: "scale(1.08)" }}>{children}</AbsoluteFill>
);

/**
 * "MOST OF YOU SAID" opener (opens every part after Part 1).
 * Title pops, cards A/B slide in (upper half), at `decideAt` the losing card greys out and
 * tumbles off the bottom while the winner slides to center, grows, glows and throws sparks.
 */
export const MostOfYouSaid: React.FC<{ a: string; b: string; winner: "A" | "B"; decideAt: number; title?: [string, string] }> = ({ a, b, winner, decideAt, title: words = ["MOST OF YOU", "SAID"] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (at: number, k = 280, d = 15) => (frame < at ? 0 : spring({ frame: frame - at, fps, config: { stiffness: k, damping: d } }));
  const title = pop(2, 300, 13);
  const grey = interpolate(frame, [decideAt, decideAt + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fall = Math.max(0, frame - decideAt - 6);
  const win = pop(decideAt + 6, 220, 14);
  const TOP_A = 610;
  const TOP_B = 745;
  const MID = (TOP_A + TOP_B) / 2;
  const card = (letter: "A" | "B", text: string, color: string, top: number, inAt: number) => {
    const isWinner = letter === winner;
    const s = pop(inAt, 300, 16);
    if (s <= 0) return null;
    const y = isWinner ? top + (MID - top) * win : top + 0.9 * fall * fall;
    const rot = isWinner ? 0 : (letter === "A" ? 1 : -1) * Math.min(14, fall * 1.4);
    const scale = isWinner ? 1 + 0.07 * win : 1;
    const c = !isWinner && grey > 0 ? "#6b6b6b" : color;
    const op = isWinner ? s : s * (1 - Math.min(1, fall / 26));
    return (
      <div
        key={letter}
        style={{
          position: "absolute", left: 60, right: 60, top: y, height: 112, background: "#121212", border: `5px solid ${c}`, borderRadius: 14,
          boxShadow: isWinner ? `0 0 ${26 + 40 * win}px ${color}${win > 0 ? "cc" : "88"}` : `0 0 18px ${c}55`, display: "flex", alignItems: "center",
          transform: `translateY(${(1 - s) * 30}px) rotate(${rot}deg) scale(${scale})`, opacity: op,
        }}
      >
        <div style={{ width: 70, height: 84, marginLeft: 14, background: c, borderRadius: 6, color: C.ink, fontFamily: FONT.title, fontSize: 66, display: "flex", alignItems: "center", justifyContent: "center" }}>{letter}</div>
        <div style={{ marginLeft: 26, fontFamily: FONT.title, fontSize: 62, color: !isWinner && grey > 0 ? "#9a9a9a" : "white", letterSpacing: 1 }}>{text}</div>
      </div>
    );
  };
  const winColor = winner === "A" ? C.alertRed : C.optionGreen;
  const sparkT = frame - decideAt - 6;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 420, width: "100%", textAlign: "center", fontFamily: FONT.title, fontSize: 118, color: "white", transform: `scale(${title})`, textShadow: "0 6px 16px rgba(0,0,0,0.8)" }}>
        {words[0]} <span style={{ color: C.capYellow }}>{words[1]}</span>
      </div>
      {card("A", a, C.alertRed, TOP_A, 5)}
      {card("B", b, C.optionGreen, TOP_B, 10)}
      {sparkT > 0 && sparkT < 30
        ? Array.from({ length: 26 }).map((_, i) => {
            const ang = random(`spa${i}`) * Math.PI * 2;
            const sp = 9 + random(`sps${i}`) * 14;
            const x = 540 + Math.cos(ang) * sp * sparkT;
            const yy = MID + 56 + Math.sin(ang) * sp * sparkT * 0.6 + 0.35 * sparkT * sparkT;
            return <div key={i} style={{ position: "absolute", left: x, top: yy, width: 10, height: 18, background: i % 3 ? winColor : C.capYellow, transform: `rotate(${ang * 57}deg)`, opacity: 1 - sparkT / 30 }} />;
          })
        : null}
    </AbsoluteFill>
  );
};

/** Finale title: "ENDING N OF 4" + big name, tilted, pops in at `at`. */
export const EndingCard: React.FC<{ n: number; name: string; at?: number }> = ({ n, name, at = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = spring({ frame: frame - at, fps, config: { stiffness: 240, damping: 13 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 560, textAlign: "center", transform: `scale(${s}) rotate(-4deg)` }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.capYellow, textShadow: "0 3px 10px rgba(0,0,0,0.8)" }}>ENDING {n} OF 4</div>
        <div style={{ fontFamily: FONT.title, fontSize: 190, lineHeight: 1, color: "white", WebkitTextStroke: "12px #130f0b", paintOrder: "stroke fill", textShadow: "0 12px 0 #130f0b" }}>{name}</div>
      </div>
    </AbsoluteFill>
  );
};
