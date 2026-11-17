import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./style";

/**
 * SILENCE PROTOCOL: permanent survival HUD (reusable across every episode of the series).
 * Dark glass panel, restrained red/green indicators. Values are plain numbers; pass null for
 * a resource that is not stocked yet (shows "—").
 */
export const SP = {
  green: "#58d68d",
  greenDim: "#2f7a52",
  red: "#ef4b3c",
  redDim: "#7a2219",
  blue: "#5fb4ff",
  panel: "rgba(7,10,11,0.82)",
  line: "#25352d",
  text: "#d9e3dc",
  mute: "#7f8f86",
} as const;

export const eur = (n: number) => "€" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const num = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export interface HudState {
  budget: number | null;
  food: number | null; // days
  drink: number | null; // liters
  tech: number | null; // liters
  days: number; // days until outbreak
}

const Cell: React.FC<{ label: string; value: string; fill: number; color: string; flash?: number; dim?: boolean; w: number }> = ({ label, value, fill, color, flash = 0, dim, w }) => (
  <div style={{ width: w, padding: "10px 12px 10px", borderLeft: `3px solid ${dim ? SP.line : color}`, background: flash > 0 ? `rgba(239,75,60,${0.28 * flash})` : "transparent" }}>
    <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 15, letterSpacing: 1.5, color: SP.mute, whiteSpace: "nowrap" }}>{label}</div>
    <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 31, color: dim ? "#4d5a53" : flash > 0.2 ? SP.red : SP.text, marginTop: 2, whiteSpace: "nowrap" }}>{value}</div>
    <div style={{ height: 6, marginTop: 7, background: "#121a16", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ width: `${Math.max(0, Math.min(1, fill)) * 100}%`, height: "100%", background: color, opacity: dim ? 0.2 : 0.9 }} />
    </div>
  </div>
);

export const SurvivalHud: React.FC<{ state: HudState; show?: number; mode?: "full" | "min"; flash?: number; alert?: number; pulse?: number }> = ({
  state, show = 1, mode = "full", flash = 0, alert = 0, pulse = 0,
}) => {
  const frame = useCurrentFrame();
  if (show <= 0) return null;
  const blink = Math.floor(frame / 15) % 2 === 0;
  const y = interpolate(show, [0, 1], [-260, 0]);
  const jitter = alert > 0 && random(`hj${Math.floor(frame / 2)}`) > 0.7 ? (random(`hx${frame}`) - 0.5) * 8 * alert : 0;
  const { budget, food, drink, tech, days } = state;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", left: 30, right: 30, top: 34, transform: `translate(${jitter}px, ${y}px)`, opacity: Math.min(1, show * 1.5),
          background: SP.panel, border: `2px solid ${alert > 0 ? SP.red : SP.line}`, borderRadius: 10, boxShadow: `0 8px 30px rgba(0,0,0,0.6)${alert > 0 ? `, 0 0 30px rgba(239,75,60,${0.5 * alert})` : ""}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px 10px", borderBottom: mode === "full" ? `2px solid ${SP.line}` : "none" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: SP.red, opacity: blink ? 1 : 0.25, boxShadow: `0 0 12px ${SP.red}`, marginRight: 14 }} />
            <div style={{ fontFamily: FONT.title, fontSize: 40, letterSpacing: 5, color: "white", lineHeight: 1 }}>
              SILENCE <span style={{ color: SP.red }}>PROTOCOL</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 14, letterSpacing: 2, color: SP.mute }}>DAYS UNTIL OUTBREAK</div>
            <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 36, color: SP.red, lineHeight: 1, textShadow: `0 0 14px ${SP.redDim}` }}>{days}</div>
          </div>
        </div>
        {mode === "full" ? (
          <div style={{ display: "flex", padding: "4px 8px 8px", transform: `scale(${1 + 0.03 * pulse})`, transformOrigin: "left center" }}>
            <Cell w={300} label="AVAILABLE BUDGET" value={budget == null ? "—" : eur(budget)} fill={budget == null ? 0 : budget / 1_000_000} color={budget != null && budget < 300_000 ? "#e0b34a" : SP.green} flash={flash} dim={budget == null} />
            <Cell w={200} label="FOOD" value={food == null ? "—" : `${num(food)} DAYS`} fill={food == null ? 0 : food / 365} color={SP.green} dim={food == null} />
            <Cell w={250} label="DRINKING WATER" value={drink == null ? "—" : `${num(drink)} L`} fill={drink == null ? 0 : drink / 3600} color={SP.blue} dim={drink == null} />
            <Cell w={250} label="TECHNICAL WATER" value={tech == null ? "—" : `${num(tech)} L`} fill={tech == null ? 0 : tech / 12000} color={"#7fa6b8"} dim={tech == null} />
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export interface Purchase {
  at: number; // absolute frame
  item: string;
  cost: number;
}

/** Budget after the purchases made by `frame` (each one rolls down over `roll` frames). */
export const budgetAt = (start: number, purchases: Purchase[], frame: number, delay = 8, roll = 16) =>
  start - purchases.reduce((acc, p) => acc + p.cost * interpolate(frame, [p.at + delay, p.at + delay + roll], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }), 0);

/** Red flash on the budget cell while a purchase is rolling down. */
export const spendFlash = (purchases: Purchase[], frame: number) =>
  purchases.reduce((m, p) => Math.max(m, interpolate(frame, [p.at + 6, p.at + 10, p.at + 30], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), 0);

/** Purchase receipt toast under the HUD: slides in, shows item + −€cost, then shrinks toward the budget. */
export const PurchaseToasts: React.FC<{ purchases: Purchase[]; top?: number }> = ({ purchases, top = 262 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const idx = purchases.findIndex((p, i) => frame >= p.at && (i === purchases.length - 1 || frame < purchases[i + 1].at));
  if (idx < 0) return null;
  const p = purchases[idx];
  const next = idx < purchases.length - 1 ? purchases[idx + 1].at : Infinity;
  const life = Math.min(54, next - p.at);
  const age = frame - p.at;
  if (age > life) return null;
  const s = spring({ frame: age, fps, config: { stiffness: 260, damping: 18 } });
  const out = interpolate(age, [life - 8, life], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(s, [0, 1], [700, 0]);
  const stamp = interpolate(age, [5, 11], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", left: 30, top, width: 640, transform: `translate(${x}px, ${-60 * out}px) scale(${1 - 0.35 * out})`, transformOrigin: "left top", opacity: 1 - out,
          background: "rgba(7,10,11,0.9)", border: `2px solid ${SP.line}`, borderLeft: `8px solid ${SP.red}`, borderRadius: 8, padding: "12px 18px", boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontWeight: 800, fontSize: 15, letterSpacing: 2, color: SP.mute }}>
          <span>PURCHASE {String(idx + 1).padStart(2, "0")}/{purchases.length}</span>
          <span style={{ color: SP.green, opacity: stamp }}>■ INSTALLED</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
          <div style={{ fontFamily: FONT.title, fontSize: 40, color: "white", letterSpacing: 1, lineHeight: 1.05, maxWidth: 380 }}>{p.item.toUpperCase()}</div>
          <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 38, color: SP.red, whiteSpace: "nowrap", flexShrink: 0, marginLeft: 12 }}>−{eur(p.cost)}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
