import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { makeDuck } from "../../kit/mix";
import { Blurred, Cam, Captions, type CapLine, Vignette } from "../../kit/Overlays";
import { type Look, lerpPose, PASSENGERS, type Pose, STAND, Stick, TURNED, walk, walkCycle, walkTo, HALE, YOU } from "../../kit/Stick";
import { C, FONT } from "../../kit/style";
import { budgetAt, eur, type HudState, num, type Purchase, PurchaseToasts, SP, spendFlash, SurvivalHud } from "../../kit/SurvivalHud";
import { Svg } from "../../sets/Sets";
import {
  Blueprint, BunkerWorld, type Build, ControlRoom, EquipRoom, GhostEchoDrone, Hospital, InsulationWall, LivingRoom, Pantry, Pit, ROOM,
  SilentFieldDevice, SoundRings, SPDefs, Street, WaterRoom,
} from "../../sets/Silence";
import w01 from "../../../public/captions/sp1-01.json";
import w02 from "../../../public/captions/sp1-02.json";
import w03 from "../../../public/captions/sp1-03.json";
import w04 from "../../../public/captions/sp1-04.json";
import w05 from "../../../public/captions/sp1-05.json";
import w06 from "../../../public/captions/sp1-06.json";
import w07 from "../../../public/captions/sp1-07.json";
import w08 from "../../../public/captions/sp1-08.json";
import w09 from "../../../public/captions/sp1-09.json";
import w10 from "../../../public/captions/sp1-10.json";
import w11 from "../../../public/captions/sp1-11.json";
import w12 from "../../../public/captions/sp1-12.json";
import w13 from "../../../public/captions/sp1-13.json";
import w14 from "../../../public/captions/sp1-14.json";
import w15 from "../../../public/captions/sp1-15.json";
import w16 from "../../../public/captions/sp1-16.json";
import w17 from "../../../public/captions/sp1-17.json";
import w18 from "../../../public/captions/sp1-18.json";
import w19 from "../../../public/captions/sp1-19.json";
import w20 from "../../../public/captions/sp1-20.json";
import w21 from "../../../public/captions/sp1-21.json";
import w22 from "../../../public/captions/sp1-22.json";
import w23 from "../../../public/captions/sp1-23.json";
import w24 from "../../../public/captions/sp1-24.json";
import w25 from "../../../public/captions/sp1-25.json";
import w26 from "../../../public/captions/sp1-26.json";
import w27 from "../../../public/captions/sp1-27.json";
import w28 from "../../../public/captions/sp1-28.json";

// ---------- timeline (stories/silence-protocol/ep01-lines.tsv) ----------
const WORDS: Caption[][] = [w01, w02, w03, w04, w05, w06, w07, w08, w09, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19, w20, w21, w22, w23, w24, w25, w26, w27, w28];
/** [voice frames, gap after] per line. Gaps: 3 inside a scene, 6 between scenes, holds for the montage end, the rule and the ending. */
const LEN: [number, number][] = [
  [131, 3], [83, 3], [64, 3], [66, 6], // S1
  [94, 3], [124, 3], [42, 6], // S2
  [77, 3], [85, 3], [50, 3], [92, 3], [132, 3], [51, 3], [120, 36], // S3
  [135, 3], [105, 3], [57, 3], [30, 6], // S4
  [129, 3], [115, 3], [53, 54], // S5 (+ rule card hold)
  [66, 3], [88, 3], [166, 3], [76, 3], [149, 3], [54, 3], [54, 30], // S6
];
const PRE = 8;
const START = LEN.reduce<number[]>((acc, [l, g], i) => [...acc, acc[i] + l + g], [PRE]);
export const SP1_TOTAL = START[LEN.length];
const st = (n: number) => START[n - 1];
const clean = (w: string) => w.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
/** Frame where word `word` (first match, prefix ok) of line n is spoken. */
const wf = (n: number, word: string) => {
  const ws = WORDS[n - 1];
  const i = ws.findIndex((w) => clean(w.text).startsWith(clean(word)));
  if (i < 0) throw new Error(`word ${word} not in line ${n}`);
  return st(n) + Math.round((ws[i].startMs / 1000) * 30);
};

const YELLOW: string[][] = [
  ["365", "DAYS,", "END."], ["DEADLY", "VIRUS", "VOICES"], ["ONE", "WORD"], ["VOICE", "WEAPON."],
  ["ADVANTAGE:", "EXACTLY"], ["ONE", "YEAR", "MILLION", "EUROS"], ["EVERY", "DETAIL"],
  ["UNDERGROUND", "REINFORCED", "CONCRETE"], ["ACOUSTIC", "INSULATION,"], ["TWO", "DOORS,"], ["VENTILATION", "SILENCERS."], ["BATTERY", "GENERATOR", "ISOLATED"], ["WATER", "PURIFICATION"], ["MEDICINE", "FOOD", "ENTIRE", "YEAR."],
  ["365", "FOOD,", "3600", "DRINKING"], ["12000", "TECHNICAL", "FILTERED."], ["ALIVE."], ["NOT", "SAFE", "YET."],
  ["CONVERTS", "TEXT."], ["WITHOUT", "HEARING", "ANYONE."], ["ONE", "RULE", "NEVER", "FORGET."],
  ["260000"], ["ONE", "SPECIAL", "WHICH"], ["SILENT", "FIELD", "225000", "ABSOLUTE", "SILENCE", "SIXTY"], ["GHOST", "ECHO", "220000."], ["DRONE", "INFECTED", "VOICES", "AWAY"], ["A", "B?"], ["DECISION", "NEXT", "CHAPTER."],
].map((l) => l.map((w) => w.replace(/[^A-Z0-9'-]/g, "")));
const CAPS: CapLine[] = WORDS.map((words, i) => ({ start: START[i], end: START[i + 1], words, yellow: YELLOW[i] }));
const SPANS = LEN.map(([l], i) => [START[i], START[i] + l] as [number, number]);
const duck = makeDuck(SPANS, 0.32, 8);

// ---------- scene marks ----------
const S2 = st(5);
const S3 = st(8);
const S4 = st(15);
const S5 = st(19);
const RULE = wf(21, "FORGET") + 8;
const S6 = st(22);
const HUD_IN = st(7);

// ---------- purchases (EXACT budget: 1,000,000 − 740,000 = 260,000) ----------
const PURCH: Purchase[] = [
  { at: S3 + 2, item: "Land and excavation", cost: 100_000 },
  { at: wf(8, "REINFORCED"), item: "Reinforced concrete structure", cost: 170_000 },
  { at: st(9) + 4, item: "Acoustic insulation", cost: 110_000 },
  { at: st(10) + 2, item: "Double-entry airlock", cost: 35_000 },
  { at: wf(11, "VENTILATION"), item: "Ventilation and filtration", cost: 45_000 },
  { at: wf(12, "BATTERY"), item: "Batteries and electrical", cost: 75_000 },
  { at: wf(12, "GENERATOR"), item: "Generator + isolated room", cost: 35_000 },
  { at: st(13) + 2, item: "Water storage and purification", cost: 40_000 },
  { at: wf(14, "MEDICINE"), item: "Medical supplies", cost: 12_000 },
  { at: wf(14, "FOOD"), item: "Food supplies", cost: 18_000 },
  { at: wf(14, "ENTIRE"), item: "Surveillance systems", cost: 25_000 },
  { at: wf(14, "ENTIRE") + 15, item: "Furniture and security", cost: 25_000 },
  { at: wf(14, "ENTIRE") + 30, item: "Installation and contingency", cost: 50_000 },
];
const P = (item: string) => PURCH.find((p) => p.item.startsWith(item))!.at;
const FINAL_WIDE = wf(14, "ENTIRE");

const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const lerp2 = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** Bunker build state at an absolute frame: each system installs over ~1 s from its purchase. */
const buildAt = (f: number): Build => ({
  dig: lin(f, P("Land"), P("Reinforced") - 4),
  concrete: lin(f, P("Reinforced"), st(9) - 2),
  insul: lin(f, P("Acoustic"), P("Acoustic") + 60),
  airlock: lin(f, P("Double"), P("Double") + 44),
  vent: lin(f, P("Ventilation"), P("Ventilation") + 36),
  battery: lin(f, P("Batteries"), P("Batteries") + 36),
  gen: lin(f, P("Generator"), P("Generator") + 36),
  water: lin(f, P("Water"), P("Water") + 48),
  med: lin(f, P("Medical"), P("Medical") + 26),
  food: lin(f, P("Food"), P("Food") + 30),
  cams: lin(f, P("Surveillance"), P("Surveillance") + 18),
  furn: lin(f, P("Furniture"), P("Furniture") + 18),
  finish: lin(f, P("Installation"), P("Installation") + 18),
});

const hudAt = (f: number): HudState => {
  const water = P("Water");
  const food = P("Food");
  return {
    budget: budgetAt(1_000_000, PURCH, f),
    food: f < food ? null : 365 * lin(f, food, food + 20),
    drink: f < water ? null : 3600 * lin(f, water + 10, water + 34),
    tech: f < water ? null : 12000 * lin(f, water + 10, water + 40),
    days: 365,
  };
};

// ---------- poses ----------
const SEATED: Pose = { ...STAND, legF: [1.5, 1.55], legB: [1.42, 1.5], lean: 0.12, armF: [1.1, 0.5], armB: [0.9, 0.6] };
const zPose = (f: number, k: number): Pose => ({
  ...STAND,
  armF: [0.85 + 0.12 * Math.sin(f / 13 + k), 0.25],
  armB: [0.75 + 0.12 * Math.sin(f / 11 + k * 2), 0.3],
  lean: 0.16,
  headTilt: 0.3 * Math.sin(f / 29 + k * 1.7),
});
const infectedLook = (look: Look, t: number): Look => (t >= 1 ? { ...look, skin: "#8e9a86", blankEyes: true } : look);

/** World camera: frame world point (cx,cy) at zoom z, placed at screen (540, 860). */
const WorldCam: React.FC<{ cx: number; cy: number; z: number; children: React.ReactNode }> = ({ cx, cy, z, children }) => (
  <g transform={`translate(540,860) scale(${z}) translate(${-cx},${-cy})`}>{children}</g>
);

// =====================================================================================
// SCENE 1 — THE END IS COMING
// =====================================================================================
const Broadcast: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const tv = frame < 5 ? "normal" : frame < 13 ? "static" : "alert";
  const startle = ramp(frame, 6, 16);
  const pose: Pose = lerpPose(STAND, { ...STAND, lean: -0.08, armF: [0.35, 0.6], armB: [-0.2, 0.4], headTilt: -0.05 }, startle);
  return (
    <Cam dur={dur} from={1.02} to={1.14} origin="62% 45%" shake={frame > 12 && frame < 30 ? 6 : 0}>
      <Svg>
        <SPDefs />
        <LivingRoom tv={tv} />
        <Stick x={250} floor={1640} look={YOU} pose={pose} lookAt={0.9} />
        <rect width={1080} height={1920} fill="#ff2a1a" opacity={tv === "alert" ? 0.06 + 0.04 * Math.sin(frame / 3) : 0} />
      </Svg>
    </Cam>
  );
};

/** Big "365 DAYS UNTIL OUTBREAK" slam. */
const CountdownSlam: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = spring({ frame: frame - at, fps, config: { stiffness: 300, damping: 14 } });
  const g = random(`cg${Math.floor(frame / 3)}`) > 0.85 ? (random(`cgx${frame}`) - 0.5) * 18 : 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 210, width: "100%", textAlign: "center", transform: `translateX(${g}px) scale(${interpolate(s, [0, 1], [1.6, 1])})`, opacity: Math.min(1, s * 1.5) }}>
        <div style={{ fontFamily: FONT.title, fontSize: 300, lineHeight: 0.9, color: SP.red, textShadow: `0 0 40px rgba(239,75,60,0.6), 0 10px 0 #130f0b`, WebkitTextStroke: "6px #130f0b", paintOrder: "stroke fill" }}>365</div>
        <div style={{ fontFamily: FONT.title, fontSize: 64, letterSpacing: 8, color: "white", textShadow: "0 4px 12px rgba(0,0,0,0.9)" }}>DAYS UNTIL OUTBREAK</div>
      </div>
    </AbsoluteFill>
  );
};

/** City street: an infected person speaks; the red voice rings turn everyone they reach. */
const StreetPanic: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const src = 540;
  const people = [
    { x0: 330, dir: -1 as const, look: PASSENGERS[0] },
    { x0: 760, dir: 1 as const, look: PASSENGERS[1] },
    { x0: 160, dir: -1 as const, look: PASSENGERS[2] },
    { x0: 930, dir: 1 as const, look: PASSENGERS[3] },
  ];
  return (
    <Cam dur={dur} from={1.04} to={1.12} origin="50% 70%">
      <Svg>
        <SPDefs />
        <Street />
        <SoundRings x={src + 20} y={1170} t={t} max={520} width={10} />
        <Stick x={src} floor={1620} look={TURNED[0]} pose={zPose(frame, 0)} scale={0.9} />
        {people.map((p, i) => {
          const dist = Math.abs(p.x0 - src);
          const hit = 8 + dist / 14;
          const run = Math.min(frame, hit) * 7;
          const turned = frame >= hit;
          const x = p.x0 + p.dir * run;
          const w = walk(run / walkCycle(1.25, 0.9), 1.25);
          return <Stick key={i} x={x} floor={1620 + (i % 2) * 30} facing={p.dir} scale={0.9} look={infectedLook(p.look, turned ? 1 : 0)} pose={turned ? zPose(frame, i + 1) : { ...w, lean: 0.2 }} lookAt={0.8} />;
        })}
      </Svg>
    </Cam>
  );
};

/** Hospital: one word ("HELP") from an infected patient reaches the doctor. */
const OneWord: React.FC<{ dur: number; wordAt: number }> = ({ dur, wordAt }) => {
  const frame = useCurrentFrame();
  const say = frame - wordAt;
  const arrive = 16;
  const turned = say >= arrive;
  const bubble = say >= 0 ? Math.min(1, say / 5) : 0;
  return (
    <Cam dur={dur} from={1.08} to={1.18} origin="60% 60%">
      <Svg>
        <SPDefs />
        <Hospital />
        <Stick x={300} floor={1640} look={TURNED[2]} pose={zPose(frame, 3)} />
        <Stick x={700} floor={1640} facing={-1} look={infectedLook(HALE, turned ? 1 : 0)} pose={turned ? zPose(frame, 5) : lerpPose(STAND, { ...STAND, lean: -0.1, armF: [0.6, 0.9] }, ramp(say, 0, 10))} lookAt={0.7} />
        {say >= 0 && say < 30 ? (
          <path d={`M${390 + say * 14},1080 q30,60 0,120`} stroke="#ff3b2a" strokeWidth={14} fill="none" opacity={say < arrive ? 1 : 0} />
        ) : null}
        {bubble > 0 ? (
          <g transform={`translate(330,860) scale(${bubble})`}>
            <path d="M0,0 L250,0 Q270,0 270,20 L270,110 Q270,130 250,130 L70,130 L30,180 L40,130 L20,130 Q0,130 0,110Z" fill="#f2efe6" stroke={C.ink} strokeWidth={6} />
            <text x={135} y={95} textAnchor="middle" fontFamily={FONT.title} fontSize={84} fill={SP.red}>HELP</text>
          </g>
        ) : null}
        {turned && say < arrive + 6 ? <rect width={1080} height={1920} fill="#ff2a1a" opacity={0.25} /> : null}
      </Svg>
    </Cam>
  );
};

/** Chain reaction: each newly infected voice infects the next person. */
const ChainReaction: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const xs = [110, 280, 450, 620, 790, 960];
  const step = 9;
  return (
    <Cam dur={dur} from={1.0} to={1.1} origin="80% 60%">
      <Svg>
        <SPDefs />
        <Street fire={1.4} />
        {xs.map((x, i) => {
          const at = i * step;
          const turned = frame >= at;
          const look = infectedLook(PASSENGERS[i % PASSENGERS.length], turned ? 1 : 0);
          return (
            <g key={i}>
              {turned && i < xs.length - 1 ? <SoundRings x={x + 25} y={1210} t={(frame - at) / 30} n={2} max={220} dir={0} spread={1.4} width={9} /> : null}
              <Stick x={x} floor={1640 - (i % 2) * 24} scale={0.78} look={look} pose={turned ? zPose(frame, i) : { ...STAND, armF: [0.3, 1.2], armB: [-0.2, 1.1] }} lookAt={turned ? 0.2 : 0.9} />
            </g>
          );
        })}
      </Svg>
    </Cam>
  );
};

// =====================================================================================
// SCENE 2 — ONE MILLION EUROS
// =====================================================================================
const SiteArrive: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const dist = 520 * ramp(frame, 0, dur - 14);
  const w = walkTo(-80, 1, dist, 520, { amp: 0.85 });
  const look = frame > dur - 30 ? 0.5 + 0.4 * Math.sin(frame / 10) : 0.8;
  return (
    <Cam dur={dur} from={1.0} to={1.08} origin="40% 70%">
      <Svg>
        <SPDefs />
        <Pit />
        <Stick x={w.x} floor={1660} look={YOU} pose={w.pose} lookAt={look} />
      </Svg>
    </Cam>
  );
};

const BlueprintScene: React.FC<{ dur: number; budgetAt0: number; push?: boolean }> = ({ dur, budgetAt0, push }) => {
  const frame = useCurrentFrame();
  const raise = ramp(frame, 2, 18);
  const hand = lerp2([260, 1300], [330, 1010], raise);
  const bpT = push ? 1 : lin(frame, 4, 70);
  const cnt = push ? 1 : lin(frame, budgetAt0, budgetAt0 + 28);
  const pop = push ? 1 - ramp(frame, 4, 18) : ramp(frame, budgetAt0 - 4, budgetAt0 + 4);
  return (
    <>
      <Cam dur={dur} from={push ? 1.08 : 1.0} to={push ? 1.3 : 1.06} origin="60% 40%">
        <Svg>
          <SPDefs />
          <Pit />
          <Blueprint x={300} y={460} w={720} t={bpT} />
          <line x1={hand[0]} y1={hand[1]} x2={330} y2={990} stroke="#5fb4ff" strokeWidth={3} opacity={0.5 * raise} />
          <Stick x={200} floor={1660} look={YOU} pose={STAND} reach={{ handF: hand }} lookAt={0.6} />
        </Svg>
      </Cam>
      {pop > 0 ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 330, right: 40, top: 1040, opacity: pop, transform: `scale(${0.9 + 0.1 * pop})`, transformOrigin: "left center", background: "rgba(7,10,11,0.88)", border: `2px solid ${SP.green}`, borderRadius: 10, padding: "14px 24px", boxShadow: `0 0 30px rgba(88,214,141,0.25)` }}>
            <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: SP.mute }}>INITIAL BUDGET</div>
            <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 76, color: SP.green, lineHeight: 1.05, textShadow: "0 0 18px rgba(88,214,141,0.4)" }}>{eur(1_000_000 * Easing.out(Easing.cubic)(cnt))}</div>
          </div>
        </AbsoluteFill>
      ) : null}
    </>
  );
};

// =====================================================================================
// SCENE 3 — BUILD YOUR BUNKER (one progressive world, many camera set-ups)
// =====================================================================================
const BuildShot: React.FC<{ from: number; dur: number; cam: [number, number, number][]; you?: (f: number) => React.ReactNode; noise?: boolean; air?: boolean }> = ({ from, dur, cam, you, noise, air }) => {
  const frame = useCurrentFrame();
  const abs = from + frame;
  const t = Easing.inOut(Easing.sin)(Math.min(1, frame / Math.max(1, dur)));
  const seg = cam.length - 1;
  const k = Math.min(seg - 1, Math.floor(t * seg));
  const lt = t * seg - k;
  const [cx, cy, z] = cam[k].map((v, i) => v + (cam[k + 1][i] - v) * lt) as [number, number, number];
  return (
    <Svg bg="#0b0809">
      <SPDefs />
      <WorldCam cx={cx} cy={cy} z={z}>
        <BunkerWorld b={buildAt(abs)} noiseDemo={noise ? ramp(frame, 0, 10) : 0} airDemo={air ? ramp(frame, 10, 24) : 0} />
        {you ? you(frame) : null}
      </WorldCam>
    </Svg>
  );
};

const InsulShot: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = lin(frame, 0, dur);
  const reachT = ramp(frame, 30, 44);
  return (
    <Cam dur={dur} from={1.0} to={1.08} origin="40% 55%">
      <Svg>
        <SPDefs />
        <InsulationWall t={t} />
        <Stick x={800} floor={1660} facing={-1} look={YOU} pose={STAND} reach={reachT > 0 ? { handF: lerp2([740, 1290], [590, 1120], reachT), handB: lerp2([860, 1290], [590, 1210], reachT) } : {}} lookAt={0.8} />
      </Svg>
    </Cam>
  );
};

/** Small in-world YOU (scale 0.34) for the cut-away. */
const WY: React.FC<{ x: number; floor: number; facing?: 1 | -1; pose?: Pose; reach?: { handF?: [number, number]; handB?: [number, number] } }> = ({ x, floor, facing = 1, pose = STAND, reach }) => (
  <Stick x={x} floor={floor} scale={0.34} facing={facing} look={YOU} pose={pose} reach={reach} lookAt={0.7} />
);

/** End of the montage: the last three purchases stack up, then the total and the remaining budget. */
const FinalReceipt: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < FINAL_WIDE || frame >= S4) return null;
  const rows = PURCH.slice(10);
  const totAt = rows[2].at + 14;
  const row = (at: number) => lin(frame, at, at + 6);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 262, background: "rgba(7,10,11,0.92)", border: `2px solid ${SP.line}`, borderLeft: `8px solid ${SP.red}`, borderRadius: 8, padding: "10px 20px", fontFamily: FONT.mono, fontWeight: 800 }}>
        {rows.map((p, i) => (
          <div key={p.item} style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: SP.text, opacity: row(p.at), transform: `translateX(${(1 - row(p.at)) * 60}px)`, marginTop: i ? 6 : 0 }}>
            <span>{String(11 + i).padStart(2, "0")} {p.item.toUpperCase()}</span><span style={{ color: SP.red }}>−{eur(p.cost)}</span>
          </div>
        ))}
        <div style={{ opacity: row(totAt), borderTop: `2px solid ${SP.line}`, marginTop: 10, paddingTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, color: SP.text }}><span>TOTAL INVESTED</span><span style={{ color: SP.red }}>{eur(740_000)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 44, color: SP.green, marginTop: 4 }}><span>REMAINING</span><span>{eur(260_000)}</span></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================================
// SCENE 4 — YOUR SURVIVAL RESOURCES
// =====================================================================================
const BigStat: React.FC<{ label: string; value: string; sub?: string; color: string; at?: number; children?: React.ReactNode }> = ({ label, value, sub, color, at = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame < at ? 0 : spring({ frame: frame - at, fps, config: { stiffness: 260, damping: 18 } });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 50, right: 50, top: 290, transform: `translateY(${(1 - s) * -40}px)`, opacity: s, background: "rgba(7,10,11,0.86)", border: `2px solid ${color}`, borderRadius: 12, padding: "18px 28px", boxShadow: `0 0 34px ${color}44` }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: SP.mute }}>{label}</div>
        <div style={{ fontFamily: FONT.title, fontSize: 120, lineHeight: 1, color, textShadow: `0 0 20px ${color}66` }}>{value}</div>
        {sub ? <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: SP.text, marginTop: 6 }}>{sub}</div> : null}
        {children}
      </div>
    </AbsoluteFill>
  );
};

const FoodShot: React.FC<{ dur: number; countAt: number }> = ({ dur, countAt }) => {
  const frame = useCurrentFrame();
  const scroll = 520 * lin(frame, 0, dur);
  const youX = 360;
  const w = walk(scroll / walkCycle(0.8), 0.8);
  const days = Math.round(365 * Easing.out(Easing.cubic)(lin(frame, countAt, countAt + 30)));
  return (
    <>
      <Svg>
        <SPDefs />
        <Pantry scroll={scroll} />
        <Stick x={youX} floor={1660} look={YOU} pose={w} lookAt={0.5 + 0.3 * Math.sin(frame / 14)} />
      </Svg>
      <BigStat label="FOOD SUPPLY" value={`${days} DAYS`} sub="1 PERSON · 2,200 KCAL / DAY" color={SP.green} at={countAt - 4}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(37, 1fr)", gap: 3, marginTop: 12 }}>
          {Array.from({ length: 370 }).map((_, i) => (
            <div key={i} style={{ height: 12, background: i < days ? SP.green : "#16211b", opacity: i < 365 ? 1 : 0 }} />
          ))}
        </div>
      </BigStat>
    </>
  );
};

const DrinkShot: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const fill = lin(frame, 0, 26);
  const liters = 3600 * Easing.out(Easing.cubic)(lin(frame, 2, 30));
  return (
    <>
      <Cam dur={dur} from={1.0} to={1.06}>
        <Svg>
          <SPDefs />
          <WaterRoom drink={fill} tech={1} focus="drink" />
        </Svg>
      </Cam>
      <BigStat label="DRINKING WATER" value={`${num(liters)} L`} sub="≈ 10 L / DAY · SEALED CONTAINERS" color={SP.blue} />
    </>
  );
};

const TechShot: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const lvl = 0.15 + 0.85 * Easing.out(Easing.cubic)(lin(frame, 0, 50));
  const liters = 12000 * Easing.out(Easing.cubic)(lin(frame, 4, 50));
  return (
    <>
      <Cam dur={dur} from={1.0} to={1.08} origin="40% 60%">
        <Svg>
          <SPDefs />
          <WaterRoom drink={1} tech={lvl} focus="tech" />
          <Stick x={330} floor={1660} scale={0.85} look={YOU} pose={{ ...STAND, headTilt: -0.15 }} lookAt={0.9} />
        </Svg>
      </Cam>
      <BigStat label="TECHNICAL WATER" value={`${num(liters)} L`} sub="TREATABLE · FILTERABLE · 3-STAGE PURIFICATION" color="#7fa6b8" />
    </>
  );
};

/** Resource-management console (full screen). `alert` flips it to the red warning state. */
const ResourceConsole: React.FC<{ dur: number; alert?: boolean }> = ({ dur, alert }) => {
  const frame = useCurrentFrame();
  const red = alert ? ramp(frame, 2, 8) : 0;
  const flick = alert && random(`rc${Math.floor(frame / 3)}`) > 0.75 ? 0.6 : 1;
  const rows: [string, string, number, string][] = [
    ["FOOD SUPPLY", "365 DAYS", 1, SP.green],
    ["DRINKING WATER", "3,600 L", 1, SP.blue],
    ["TECHNICAL WATER", "12,000 L", 1, "#7fa6b8"],
    ["POWER RESERVE", "96 %", 0.96, SP.green],
    ["AVAILABLE BUDGET", "€260,000", 0.26, "#e0b34a"],
  ];
  const appear = (i: number) => (alert ? 1 : ramp(frame, 2 + i * 5, 10 + i * 5));
  return (
    <>
      <Blurred px={12} dim={0.4}>
        <Svg>
          <SPDefs />
          <ControlRoom alarm={red} />
        </Svg>
      </Blurred>
      <Cam dur={dur} from={1.0} to={alert ? 1.08 : 1.04} shake={alert ? 10 : 0}>
        <AbsoluteFill style={{ opacity: flick }}>
          <div style={{ position: "absolute", left: 50, right: 50, top: 300, bottom: 560, background: "rgba(5,9,8,0.92)", border: `3px solid ${red > 0.5 ? SP.red : SP.greenDim}`, borderRadius: 14, padding: "26px 34px", boxShadow: red > 0.5 ? `0 0 60px rgba(239,75,60,0.5)` : "0 0 40px rgba(88,214,141,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: SP.mute }}>
              <span>RESOURCE MANAGEMENT</span>
              <span>DAY 1 / 365</span>
            </div>
            {rows.map(([k, v, f, col], i) => (
              <div key={k} style={{ marginTop: 26, opacity: appear(i), transform: `translateX(${(1 - appear(i)) * 40}px)` }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontWeight: 800 }}>
                  <span style={{ fontSize: 30, color: SP.text }}>{k}</span>
                  <span style={{ fontSize: 40, color: col }}>{v}</span>
                </div>
                <div style={{ height: 14, background: "#121a16", borderRadius: 7, marginTop: 8 }}>
                  <div style={{ width: `${f * 100 * appear(i)}%`, height: "100%", background: col, borderRadius: 7 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 40, padding: "18px 22px", borderRadius: 10, background: red > 0.5 ? "rgba(239,75,60,0.18)" : "rgba(88,214,141,0.12)", border: `2px solid ${red > 0.5 ? SP.red : SP.green}`, fontFamily: FONT.title, fontSize: 64, letterSpacing: 3, color: red > 0.5 ? SP.red : SP.green, textAlign: "center" }}>
              {red > 0.5 ? "⚠ EXT MIC 01: VOICE DETECTED" : "STATUS: SUSTAINABLE"}
            </div>
          </div>
        </AbsoluteFill>
      </Cam>
      {red > 0 ? <AbsoluteFill style={{ background: "#ff2a1a", opacity: 0.12 * red * (0.5 + 0.5 * Math.sin(frame / 3)) }} /> : null}
    </>
  );
};

// =====================================================================================
// SCENE 5 — THE FIRST RULE
// =====================================================================================
const TRANSCRIPT: [string, string][] = [
  ["23:41:07", "hello?"],
  ["23:41:12", "is somebody down there?"],
  ["23:41:20", "please... just open the door."],
  ["23:41:31", "let me in. LET ME IN."],
];

const Surveillance: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const type = ramp(frame, 6, 18);
  const step = (i: number) => ramp(frame, 20 + i * 22, 30 + i * 22);
  return (
    <>
      <Cam dur={dur} from={1.0} to={1.1} origin="55% 45%">
        <Svg>
          <SPDefs />
          <ControlRoom />
          <Stick x={235} floor={1660} hip={[245, 1270]} look={YOU} pose={SEATED} reach={{ handF: lerp2([420, 1180], [600, 1222], type), handB: [560, 1226] }} lookAt={0.9} />
        </Svg>
      </Cam>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 290, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {[["EXT MIC 01", "VOICE DETECTED", SP.red], ["SPEECH-TO-TEXT", "PROCESSING", "#e0b34a"], ["SCREEN ONLY", "SPEAKERS OFF", SP.green]].map(([a, b, col], i) => (
            <React.Fragment key={a}>
              <div style={{ opacity: step(i), transform: `scale(${0.8 + 0.2 * step(i)})`, background: "rgba(7,10,11,0.9)", border: `2px solid ${col}`, borderRadius: 10, padding: "12px 10px", width: 290, textAlign: "center" }}>
                <div style={{ fontFamily: FONT.title, fontSize: 34, whiteSpace: "nowrap", color: "white", letterSpacing: 1 }}>{a}</div>
                <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 18, color: col, letterSpacing: 2 }}>{b}</div>
              </div>
              {i < 2 ? <div style={{ fontFamily: FONT.title, fontSize: 60, color: SP.mute, opacity: step(i + 1) }}>›</div> : null}
            </React.Fragment>
          ))}
        </div>
      </AbsoluteFill>
    </>
  );
};

/** Monitor close-up: transcript types out, never played as audio. */
const Transcript: React.FC<{ dur: number; lines: number; pre?: number; glitchAt?: number }> = ({ dur, lines, pre = 0, glitchAt }) => {
  const frame = useCurrentFrame();
  const glitch = glitchAt != null && frame >= glitchAt;
  const gx = glitch && random(`tg${Math.floor(frame / 2)}`) > 0.5 ? (random(`tgx${frame}`) - 0.5) * 30 : 0;
  const perLine = 26;
  return (
    <>
      <Cam dur={dur} from={1.0} to={1.06} shake={glitch ? 8 : 0}>
        <AbsoluteFill style={{ background: "#040706" }}>
          <div style={{ position: "absolute", left: 40, right: 40, top: 290, bottom: 520, border: `3px solid ${glitch ? SP.red : SP.greenDim}`, borderRadius: 16, padding: "24px 30px", background: "#06100c", transform: `translateX(${gx}px)`, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: SP.mute }}>
              <span>EXT MIC 01 · LIVE TRANSCRIPT</span>
              <span style={{ color: SP.red }}>● REC</span>
            </div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", border: `2px solid ${SP.red}`, borderRadius: 8, fontFamily: FONT.mono, fontWeight: 800, fontSize: 24, color: SP.red }}>
              <svg width="44" height="34" viewBox="0 0 44 34"><path d="M2,10 L10,10 L20,2 L20,32 L10,24 L2,24Z" fill={SP.red} /><path d="M26,8 L40,26 M40,8 L26,26" stroke={SP.red} strokeWidth="4" strokeLinecap="round" /></svg>
              AUDIO PLAYBACK: DISABLED — TEXT ONLY
            </div>
            <div style={{ display: "flex", gap: 4, alignItems: "center", height: 80, marginTop: 14 }}>
              {Array.from({ length: 60 }).map((_, k) => {
                const a = 8 + Math.abs(Math.sin(frame / 3 + k * 0.7)) * 60 * (0.3 + random(`tw${k}-${Math.floor(frame / 3)}`) * 0.7);
                return <div key={k} style={{ flex: 1, height: a, background: "#5a1712" }} />;
              })}
            </div>
            {TRANSCRIPT.slice(0, lines).map(([ts, text], i) => {
              const start = i < pre ? -999 : (i - pre) * perLine + 4;
              const shown = Math.max(0, Math.min(text.length, Math.floor((frame - start) * 1.4)));
              if (frame < start) return null;
              const last = i === lines - 1;
              return (
                <div key={i} style={{ marginTop: 22, fontFamily: FONT.mono, fontWeight: 800 }}>
                  <div style={{ fontSize: 20, color: SP.mute, letterSpacing: 2 }}>[{ts}] SPEAKER UNKNOWN · INFECTION RISK: HIGH</div>
                  <div style={{ fontSize: 50, color: last && glitch ? SP.red : "#cfe9d8", lineHeight: 1.15 }}>
                    &gt; {text.slice(0, shown)}
                    {shown < text.length || Math.floor(frame / 8) % 2 ? <span style={{ color: SP.green }}>▌</span> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Cam>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <Stick x={60} floor={2500} scale={2.1} look={YOU} pose={{ ...STAND, lean: 0.08 }} lookAt={1} hideLegs />
        </svg>
      </AbsoluteFill>
    </>
  );
};

/** THE SILENCE RULES — RULE 01 (horror title card, reusable look for later rules). */
const SilenceRule: React.FC<{ n: string; lines: string[] }> = ({ n, lines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 6, fps, config: { stiffness: 320, damping: 16 } });
  const g = random(`rg${Math.floor(frame / 2)}`) > 0.8;
  const off = g ? (random(`rgx${frame}`) - 0.5) * 24 : 0;
  const text = (dx: number, color: string, op: number) => (
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", transform: `translateX(${dx}px)`, opacity: op }}>
      {lines.map((l, i) => {
        const at = 10 + i * 5;
        const li = frame < at ? 0 : spring({ frame: frame - at, fps, config: { stiffness: 380, damping: 18 } });
        return <div key={l} style={{ fontFamily: FONT.title, fontSize: 118, lineHeight: 1.02, color, letterSpacing: 1, transform: `scale(${interpolate(li, [0, 1], [1.4, 1])})`, opacity: li }}>{l}</div>;
      })}
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#050303" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 45% at 50% 52%, rgba(160,20,12,${0.45 + 0.1 * Math.sin(frame / 4)}) 0%, rgba(0,0,0,0) 70%)` }} />
      {Array.from({ length: 96 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: i * 20, height: 2, background: "rgba(0,0,0,0.35)" }} />)}
      {/* crossed-out waveform */}
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
        {Array.from({ length: 50 }).map((_, k) => {
          const a = 20 + Math.abs(Math.sin(frame / 4 + k * 0.6)) * 200 * random(`rw${k}`);
          return <rect key={k} x={40 + k * 20.4} y={1500 - a / 2} width={10} height={a} fill="#7a1a12" />;
        })}
        <line x1={60} y1={1360} x2={1020} y2={1640} stroke={SP.red} strokeWidth={14} />
      </svg>
      <div style={{ position: "absolute", top: 400, width: "100%", textAlign: "center", opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.3, 1])})` }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 34, letterSpacing: 14, color: "#c9c4b4" }}>THE SILENCE RULES</div>
        <div style={{ fontFamily: FONT.title, fontSize: 210, lineHeight: 1, color: SP.red, textShadow: "0 0 40px rgba(239,75,60,0.55)", marginTop: 10 }}>RULE {n}</div>
        <div style={{ width: 520, height: 6, background: SP.red, margin: "18px auto 0" }} />
      </div>
      {g ? text(off + 10, "rgba(0,255,255,0.35)", 1) : null}
      {g ? text(off - 10, "rgba(255,0,60,0.45)", 1) : null}
      {text(off, "white", 1)}
    </AbsoluteFill>
  );
};

// =====================================================================================
// SCENE 6 — YOUR FIRST CHOICE
// =====================================================================================
const EquipEnter: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const dist = 620 * ramp(frame, 0, dur - 6);
  const w = walkTo(-80, 1, dist, 620, { amp: 0.85 });
  return (
    <Cam dur={dur} from={1.0} to={1.06} origin="50% 70%">
      <Svg>
        <SPDefs />
        <EquipRoom a={0.08} b={0.08} />
        <SilentFieldDevice x={280} y={1470} scale={1.05} on={0} />
        <GhostEchoDrone x={800} y={1360} scale={1.0} on={0} />
        <Stick x={w.x} floor={1700} look={YOU} pose={w.pose} lookAt={0.8} />
      </Svg>
    </Cam>
  );
};

const PlatformsOn: React.FC<{ dur: number; aAt: number; bAt: number }> = ({ dur, aAt, bAt }) => {
  const frame = useCurrentFrame();
  const a = ramp(frame, aAt, aAt + 10);
  const b = ramp(frame, bAt, bAt + 10);
  const facing: 1 | -1 = frame < bAt ? -1 : 1;
  return (
    <>
      <Cam dur={dur} from={1.04} to={1.1} origin="50% 70%">
        <Svg>
          <SPDefs />
          <EquipRoom a={a} b={b} />
          <SilentFieldDevice x={280} y={1470} scale={1.05} on={a} spin={frame / 10} />
          <GhostEchoDrone x={800} y={1360} scale={1.0} on={b} />
          <Stick x={540} floor={1700} facing={facing} look={YOU} pose={STAND} lookAt={0.9} />
        </Svg>
      </Cam>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center", opacity: ramp(frame, 4, 14) }}>
          <div style={{ display: "inline-block", padding: "12px 30px", background: "rgba(7,10,11,0.88)", border: `2px solid #e0b34a`, borderRadius: 10, fontFamily: FONT.title, fontSize: 56, letterSpacing: 4, color: "#e0b34a" }}>ONE PURCHASE ONLY</div>
        </div>
      </AbsoluteFill>
    </>
  );
};

const SpecCard: React.FC<{ letter: string; name: string; price: string; lines: string[]; color: string; at?: number }> = ({ letter, name, price, lines, color, at = 0 }) => {
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

const DeviceA: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Cam dur={dur} from={1.75} to={1.9} origin="22% 78%">
        <Svg>
          <SPDefs />
          <EquipRoom a={1} b={0.15} />
          <SilentFieldDevice x={280} y={1470} scale={1.05} on={1} spin={frame / 8} />
        </Svg>
      </Cam>
      <SpecCard letter="A" name="THE SILENT FIELD" price="€225,000" lines={["60 SECONDS OF ABSOLUTE SILENCE", "IMMEDIATE PERSONAL PROTECTION"]} color={SP.blue} at={2} />
    </>
  );
};

/** Silent Field demo: blue dome around YOU; infected voices die at its surface. */
const FieldDemo: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const r = 330 * Easing.out(Easing.back(1.4))(lin(frame, 6, 24));
  const cx = 540;
  const cy = 1430;
  const secs = Math.max(0, 60 - Math.floor(lin(frame, 24, dur) * 4));
  const zx = [Math.min(120 + frame * 1.6, cx - 400), Math.max(960 - frame * 1.6, cx + 400)];
  return (
    <>
      <Cam dur={dur} from={1.0} to={1.08} origin="50% 70%">
        <Svg>
          <SPDefs />
          <Street fire={0.8} />
          <mask id="domeMask">
            <rect width={1080} height={1920} fill="white" />
            <circle cx={cx} cy={cy} r={r} fill="black" />
          </mask>
          <g mask="url(#domeMask)">
            <SoundRings x={zx[0] + 30} y={1180} t={frame / 30} n={3} max={520} dir={0} spread={1.5} />
            <SoundRings x={zx[1] - 30} y={1180} t={frame / 30 + 0.3} n={3} max={520} dir={Math.PI} spread={1.5} />
          </g>
          <Stick x={zx[0]} floor={1640} look={TURNED[1]} pose={{ ...walk(frame / 40, 0.6), ...{ armF: [0.9, 0.3], armB: [0.8, 0.3] }, lean: 0.16 }} scale={0.9} />
          <Stick x={zx[1]} floor={1640} facing={-1} look={TURNED[3]} pose={{ ...walk(frame / 40 + 0.5, 0.6), ...{ armF: [0.9, 0.3], armB: [0.8, 0.3] }, lean: 0.16 }} scale={0.9} />
          <circle cx={cx} cy={cy} r={r} fill="url(#spDome)" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#bfe2ff" strokeWidth={5} opacity={0.6 + 0.4 * Math.sin(frame / 3)} />
          <Stick x={cx} floor={1640} look={YOU} pose={{ ...STAND, armF: [0.5, 0.9] }} holdF={<rect x={-14} y={-14} width={28} height={28} rx={6} fill="#5fb4ff" stroke={C.ink} strokeWidth={4} />} lookAt={0.6} />
          {r > 200 ? (
            <g>
              <circle cx={cx} cy={cy - r - 70} r={52} fill="rgba(6,9,12,0.9)" stroke="#5fb4ff" strokeWidth={5} />
              <text x={cx} y={cy - r - 54} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={44} fill="#bfe2ff">{secs}</text>
            </g>
          ) : null}
        </Svg>
      </Cam>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center", opacity: ramp(frame, 20, 30) }}>
          <div style={{ display: "inline-block", padding: "10px 26px", background: "rgba(6,9,12,0.88)", border: `2px solid ${SP.blue}`, borderRadius: 10, fontFamily: FONT.title, fontSize: 52, letterSpacing: 3, color: "#bfe2ff" }}>ZONE OF ABSOLUTE SILENCE · 60 S</div>
        </div>
      </AbsoluteFill>
    </>
  );
};

const DeviceB: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const spin = lin(frame, 4, 20);
  const lift = Easing.inOut(Easing.sin)(lin(frame, 18, dur));
  return (
    <>
      <Cam dur={dur} from={1.75} to={1.85} origin="76% 72%">
        <Svg>
          <SPDefs />
          <EquipRoom a={0.15} b={1} />
          <GhostEchoDrone x={800} y={1360 - 260 * lift} scale={1.0} rotor={spin > 0 ? frame / 30 : 0} on={1} tilt={Math.sin(frame / 9) * 3 * lift} />
        </Svg>
      </Cam>
      <SpecCard letter="B" name="THE GHOST ECHO" price="€220,000" lines={["AUTONOMOUS DRONE · VOICE DECOY", "LURES THE INFECTED FROM A DISTANCE"]} color={SP.green} at={2} />
    </>
  );
};

/** Ghost Echo demo: the drone leaves the hatch and broadcasts; the infected follow it away. */
const EchoDemo: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const fly = Easing.inOut(Easing.sin)(lin(frame, 0, dur * 0.8));
  const dx = 180 + 760 * fly;
  const dy = 980 - 260 * Math.sin(Math.PI * Math.min(1, fly * 1.3)) * 0.6;
  const zs = [250, 380, 520, 640, 760];
  const lure = lin(frame, 30, dur);
  return (
    <Cam dur={dur} from={1.0} to={1.05} origin="60% 60%">
      <Svg>
        <SPDefs />
        <Street fire={0.6} />
        {/* the bunker hatch at street level */}
        <g transform="translate(60,1480)">
          <rect x={0} y={-80} width={180} height={80} fill="#4c4a43" stroke={C.ink} strokeWidth={5} />
          <path d="M-20,-80 L90,-140 L200,-80Z" fill="#3a3833" stroke={C.ink} strokeWidth={5} />
          <rect x={60} y={-60} width={60} height={60} fill="#1a1a1a" />
          <text x={90} y={-96} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={18} fill={SP.red}>YOU</text>
        </g>
        {frame > 10 ? <SoundRings x={dx} y={dy} t={frame / 30} color="#58d68d" n={4} max={460} width={8} opacity={0.9} /> : null}
        {zs.map((x0, i) => {
          const goal = 560 + i * 110;
          const x = x0 + (goal - x0) * lure * (0.7 + 0.3 * random(`zl${i}`));
          const moving = lure > 0 && lure < 1;
          return (
            <Stick key={i} x={x} floor={1640 - (i % 2) * 26} scale={0.8} facing={lure > 0 ? 1 : -1} look={TURNED[i % TURNED.length]}
              pose={moving ? { ...walk(x / walkCycle(0.6, 0.8), 0.6), armF: [0.9, 0.3], armB: [0.8, 0.3], lean: 0.16, headTilt: -0.2 } : zPose(frame, i)} />
          );
        })}
        <GhostEchoDrone x={dx} y={dy} scale={0.45} rotor={frame / 30} on={1} tilt={6 * Math.sin(frame / 12) + 8 * (1 - fly)} />
      </Svg>
    </Cam>
  );
};

const Compare: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const col = (i: number) => ramp(frame, 2 + i * 6, 12 + i * 6);
  const both = ramp(frame, 22, 32);
  return (
    <>
      <Cam dur={dur} from={1.0} to={1.05} origin="50% 70%">
        <Svg>
          <SPDefs />
          <EquipRoom a={1} b={1} />
          <SilentFieldDevice x={280} y={1470} scale={1.05} on={1} spin={frame / 8} />
          <GhostEchoDrone x={800} y={1330 + Math.sin(frame / 10) * 10} scale={1.0} rotor={frame / 30} on={1} />
          <Stick x={540} floor={1700} facing={Math.floor(frame / 30) % 2 ? 1 : -1} look={YOU} pose={STAND} lookAt={0.9} />
        </Svg>
      </Cam>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 30, right: 30, top: 290, display: "flex", gap: 20 }}>
          {[["A", "THE SILENT FIELD", "€225,000", "€35,000 LEFT", SP.blue], ["B", "THE GHOST ECHO", "€220,000", "€40,000 LEFT", SP.green]].map(([l, n, p, left, c], i) => (
            <div key={l} style={{ flex: 1, opacity: col(i), transform: `translateY(${(1 - col(i)) * -30}px)`, background: "rgba(6,9,12,0.9)", border: `3px solid ${c}`, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontFamily: FONT.title, fontSize: 70, color: c, lineHeight: 1 }}>{l}</div>
              <div style={{ fontFamily: FONT.title, fontSize: 40, color: "white" }}>{n}</div>
              <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 38, color: c }}>{p}</div>
              <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 24, color: SP.text, marginTop: 6 }}>{left}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 640, opacity: both, textAlign: "center", background: "rgba(40,6,4,0.88)", border: `2px solid ${SP.red}`, borderRadius: 10, padding: "10px 0", fontFamily: FONT.mono, fontWeight: 800, fontSize: 30, color: SP.red }}>
          A + B = €445,000 ✕ ONLY €260,000
        </div>
      </AbsoluteFill>
    </>
  );
};

/** Final beat: choice cards + COMMENT A OR B; then the transcript speaks to YOU. */
const FinalChoice: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (at: number) => (frame < at ? 0 : spring({ frame: frame - at, fps, config: { stiffness: 280, damping: 15 } }));
  const msgAt = dur - 44;
  const msg = "WE KNOW YOU'RE DOWN THERE.";
  const shown = Math.max(0, Math.min(msg.length, Math.floor((frame - msgAt) * 1.6)));
  const glitch = frame >= msgAt && random(`fg${Math.floor(frame / 2)}`) > 0.6;
  const card = (letter: string, name: string, price: string, color: string, top: number, at: number) => {
    const s = pop(at);
    return (
      <div style={{ position: "absolute", left: 50, right: 50, top, height: 128, transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`, opacity: s, background: "#0b0e11", border: `5px solid ${color}`, borderRadius: 14, boxShadow: `0 0 30px ${color}88`, display: "flex", alignItems: "center" }}>
        <div style={{ width: 92, height: 98, marginLeft: 14, background: color, borderRadius: 8, color: "#0b0f12", fontFamily: FONT.title, fontSize: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>{letter}</div>
        <div style={{ marginLeft: 22, fontFamily: FONT.title, fontSize: 54, color: "white", letterSpacing: 1 }}>{name} <span style={{ color: SP.mute }}>—</span> <span style={{ color }}>{price}</span></div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Blurred px={10} dim={0.35}>
        <Svg>
          <SPDefs />
          <ControlRoom alarm={frame >= msgAt ? 1 : 0} />
        </Svg>
      </Blurred>
      {card("A", "THE SILENT FIELD", "€225,000", SP.blue, 760, 2)}
      {card("B", "THE GHOST ECHO", "€220,000", SP.green, 920, 8)}
      <div style={{ position: "absolute", top: 1100, width: "100%", textAlign: "center", transform: `scale(${pop(16)})`, fontFamily: FONT.title, fontSize: 120, color: "white", textShadow: "0 8px 20px rgba(0,0,0,0.9)" }}>
        COMMENT <span style={{ color: SP.blue }}>A</span> OR <span style={{ color: SP.green }}>B</span>
      </div>
      {frame >= msgAt ? (
        <div style={{ position: "absolute", left: 40, right: 40, top: 290, transform: `translateX(${glitch ? (random(`fgx${frame}`) - 0.5) * 26 : 0}px)`, background: "rgba(20,4,3,0.92)", border: `3px solid ${SP.red}`, borderRadius: 12, padding: "16px 24px", boxShadow: "0 0 50px rgba(239,75,60,0.5)" }}>
          <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: SP.red }}>EXT MIC 01 · TRANSCRIPT · 23:59:58</div>
          <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 52, color: "white", lineHeight: 1.15, marginTop: 6 }}>&gt; {msg.slice(0, shown)}<span style={{ color: SP.red }}>▌</span></div>
        </div>
      ) : null}
      {frame >= msgAt && frame < msgAt + 4 ? <AbsoluteFill style={{ background: "#ff2a1a", opacity: 0.3 }} /> : null}
    </AbsoluteFill>
  );
};

// =====================================================================================
// SHOT LIST
// =====================================================================================
interface Shot { at: number; render: (dur: number) => React.ReactNode }
const R = ROOM;
const SHOTS: Shot[] = [
  // S1
  { at: 0, render: (d) => <><Broadcast dur={d} /><CountdownSlam at={wf(1, "365") - 0} /></> },
  { at: st(2), render: (d) => <StreetPanic dur={d} /> },
  { at: st(3), render: (d) => <OneWord dur={d} wordAt={wf(3, "ONE") - st(3)} /> },
  { at: st(4), render: (d) => <ChainReaction dur={d} /> },
  // S2
  { at: S2, render: (d) => <SiteArrive dur={d} /> },
  { at: st(6), render: (d) => <BlueprintScene dur={d} budgetAt0={wf(6, "MILLION") - st(6)} /> },
  { at: st(7), render: (d) => <BlueprintScene dur={d} budgetAt0={0} push /> },
  // S3 — montage on one world
  { at: S3, render: (d) => <BuildShot from={S3} dur={d} cam={[[540, 1000, 1.15], [540, 990, 1.18]]} /> },
  { at: P("Reinforced"), render: (d) => <BuildShot from={P("Reinforced")} dur={d} cam={[[540, 990, 1.18], [540, 1000, 1.24]]} /> },
  { at: st(9), render: (d) => <InsulShot dur={d} /> },
  {
    at: st(10), render: (d) => <BuildShot from={st(10)} dur={d} cam={[[215, 720, 3.2], [215, 740, 3.4]]}
      you={(f) => <WY x={200} floor={R.airlock.y1} facing={f < 26 ? -1 : 1} pose={{ ...STAND, headTilt: f < 26 ? -0.4 : 0 }} />} />,
  },
  {
    at: st(11), render: (d) => <BuildShot from={st(11)} dur={d} air cam={[[840, 760, 2.6], [850, 700, 2.9]]}
      you={(f) => <WY x={760} floor={R.vent.y1} pose={{ ...STAND, headTilt: -0.2 }} reach={{ handF: lerp2([780, 820], [R.vent.x0 + 40, R.vent.y0 + 150], ramp(f, 4, 18)) }} />} />,
  },
  {
    at: wf(12, "BATTERY") - 4, render: (d) => <BuildShot from={wf(12, "BATTERY") - 4} dur={d} cam={[[237, 1250, 3.2], [237, 1240, 3.4]]}
      you={(f) => <WY x={350} floor={R.battery.y1} facing={-1} reach={{ handF: lerp2([360, 1320], [300, 1250], ramp(f, 6, 20)) }} />} />,
  },
  { at: P("Generator") - 2, render: (d) => <BuildShot from={P("Generator") - 2} dur={d} cam={[[510, 1250, 3.1], [510, 1240, 3.4]]} /> },
  {
    at: st(13), render: (d) => <BuildShot from={st(13)} dur={d} cam={[[813, 1250, 2.6], [813, 1240, 2.8]]}
      you={(f) => <WY x={955} floor={R.water.y1} facing={-1} pose={{ ...STAND, headTilt: -0.2 }} />} />,
  },
  {
    at: st(14), render: (d) => <BuildShot from={st(14)} dur={d} cam={[[608, 1000, 3.0], [700, 1000, 3.0], [841, 1000, 3.0]]}
      you={(f) => <WY x={950} floor={R.pantry.y1} facing={-1} reach={{ handF: lerp2([930, 1060], [900, 990], 0.5 + 0.5 * Math.sin(f / 6)) }} />} />,
  },
  {
    at: FINAL_WIDE, render: (d) => <BuildShot from={FINAL_WIDE} dur={d} cam={[[540, 1000, 1.7], [540, 1010, 1.15]]}
      you={() => <WY x={330} floor={R.living.y1} />} />,
  },
  // S4
  { at: S4, render: (d) => <FoodShot dur={d} countAt={wf(15, "365") - S4} /> },
  { at: wf(15, "3600"), render: (d) => <DrinkShot dur={d} /> },
  { at: st(16), render: (d) => <TechShot dur={d} /> },
  { at: st(17), render: (d) => <ResourceConsole dur={d} /> },
  { at: st(18), render: (d) => <ResourceConsole dur={d} alert /> },
  // S5
  { at: S5, render: (d) => <Surveillance dur={d} /> },
  { at: st(20), render: (d) => <Transcript dur={d} lines={3} /> },
  { at: st(21), render: (d) => <Transcript dur={d} lines={4} pre={3} glitchAt={22} /> },
  { at: RULE, render: () => <SilenceRule n="01" lines={["IF YOU HEAR THEM,", "YOU ARE ALREADY", "ONE OF THEM."]} /> },
  // S6
  { at: S6, render: (d) => <EquipEnter dur={d} /> },
  { at: st(23), render: (d) => <PlatformsOn dur={d} aAt={wf(23, "SPECIAL") - st(23)} bAt={wf(23, "WHICH") - st(23)} /> },
  { at: st(24), render: (d) => <DeviceA dur={d} /> },
  { at: wf(24, "CREATES"), render: (d) => <FieldDemo dur={d} /> },
  { at: st(25), render: (d) => <DeviceB dur={d} /> },
  { at: st(26), render: (d) => <EchoDemo dur={d} /> },
  { at: st(27), render: (d) => <Compare dur={d} /> },
  { at: st(28), render: (d) => <FinalChoice dur={d} /> },
];

// =====================================================================================
// AUDIO
// =====================================================================================
/** All one-shot / ambience SFX sit 5 dB lower than first mix (10^(-5/20)); music beds are separate. */
const SFX_GAIN = 0.5623;
/** [file, frame, volume, optional max frames] */
const SFX: [string, number, number, number?][] = [
  // S1
  ["sp-static", 3, 0.35], ["sp-ews", 12, 0.12, 60], ["sub-hit", wf(1, "365"), 0.5], ["card-slam", wf(1, "365"), 0.3],
  ["whoosh", st(2) - 4, 0.3], ["sirens", st(2), 0.12, LEN[1][0] + 70], ["murmur", st(2), 0.12, LEN[1][0]], ["fc-groan-1", st(2) + 20, 0.2],
  ["whoosh", st(3) - 4, 0.3], ["heartbeat", st(3) + 4, 0.4], ["sp-glitch", wf(3, "ONE") + 14, 0.25], ["fc-groans", st(4), 0.18, LEN[3][0]],
  ["sp-glitch", st(4) + 20, 0.2], ["sub-hit", wf(4, "WEAPON"), 0.45],
  // S2
  ["gravel-steps", S2 + 2, 0.3, LEN[4][0]], ["light-buzz", S2, 0.08, LEN[4][0] + LEN[5][0]], ["sp-power", st(6) + 4, 0.18], ["sp-count", wf(6, "MILLION"), 0.35],
  ["card-slam", wf(6, "MILLION") + 2, 0.25], ["whoosh", HUD_IN, 0.3], ["sp-buy", HUD_IN + 8, 0.25],
  // S3 — purchase blip on every item + the install sound
  ...PURCH.map((p) => ["sp-buy", p.at + 6, 0.3] as [string, number, number]),
  ["sp-dig", P("Land"), 0.4], ["sp-pour", P("Reinforced"), 0.45], ["sp-drill", P("Acoustic") + 10, 0.35], ["sp-drill", P("Acoustic") + 40, 0.3],
  ["sp-doors", P("Double") + 12, 0.45], ["sp-fan", P("Ventilation") + 4, 0.35], ["sp-power", P("Batteries") + 4, 0.3], ["fc-generator", P("Generator") + 6, 0.3, 50],
  ["sp-water", P("Water") + 4, 0.35], ["sp-stack", P("Medical") + 2, 0.3], ["sp-stack", P("Food") + 2, 0.35], ["sp-power", P("Surveillance") + 2, 0.2],
  ["sp-drill", P("Furniture") + 2, 0.2], ["light-buzz", P("Installation") + 4, 0.15, 30], ["card-slam", P("Installation") + 14, 0.3],
  ["whoosh", st(9) - 3, 0.25], ["whoosh", st(11) - 3, 0.2], ["whoosh", st(13) - 3, 0.2], ["whoosh", FINAL_WIDE - 3, 0.25],
  // S4
  ["footsteps", S4 + 4, 0.22, 80], ["sp-count", wf(15, "365"), 0.3], ["sp-water", wf(15, "3600"), 0.2], ["sp-count", wf(15, "3600") + 2, 0.25],
  ["sp-water", st(16), 0.3], ["sp-count", st(16) + 4, 0.25], ["sp-type", st(17), 0.15, 40], ["sp-alarm", st(18), 0.3], ["sub-hit", st(18), 0.4], ["sp-glitch", st(18) + 2, 0.3],
  // S5
  ["sp-type", S5 + 8, 0.18], ["fc-radio-static", S5 + 20, 0.05, 90], ["sp-type", st(20), 0.22], ["sp-type", st(20) + 70, 0.2],
  ["sp-type", st(21), 0.22], ["sp-glitch", st(21) + 22, 0.35], ["sp-riser", RULE - 48, 0.25], ["sp-sting", RULE, 0.6], ["tinnitus", RULE + 4, 0.12, 50],
  // S6
  ["footsteps", S6 + 2, 0.25, LEN[21][0]], ["blast-hum", S6, 0.1, LEN[21][0] + LEN[22][0]], ["sp-platform", wf(23, "SPECIAL"), 0.4], ["sp-platform", wf(23, "WHICH"), 0.4],
  ["whoosh", st(24) - 3, 0.25], ["sp-field", wf(24, "CREATES") + 4, 0.5], ["fc-groans", wf(24, "CREATES"), 0.12, 80],
  ["whoosh", st(25) - 3, 0.25], ["sp-rotor", st(25) + 4, 0.3], ["sp-rotor", st(26), 0.25], ["sp-echo-voice", st(26) + 14, 0.13], ["sp-echo-voice", st(26) + 90, 0.11], ["fc-groans", st(26) + 30, 0.12, 110],
  ["card-slam", st(27) + 2, 0.25], ["card-slam", st(27) + 8, 0.25], ["sp-glitch", st(27) + 22, 0.25],
  ["card-slam", st(28) + 2, 0.3], ["card-slam", st(28) + 8, 0.3], ["sub-hit", st(28) + 16, 0.35],
  ["sp-glitch", SP1_TOTAL - 44, 0.4], ["sp-sting", SP1_TOTAL - 44, 0.45],
];

/** Music bed level: tense under S1-S4, swells in gaps, cut to silence on the rule card, back for the choice. */
const bedLevel = (f: number) => {
  const base = interpolate(f, [0, 20, RULE - 50, RULE - 2, RULE, S6 - 6, S6 + 20, SP1_TOTAL - 50, SP1_TOTAL - 44, SP1_TOTAL], [0, 0.22, 0.22, 0.3, 0, 0, 0.22, 0.24, 0.05, 0], {
    extrapolateRight: "clamp",
  });
  return base * duck(f);
};

export const SilenceP1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inRule = frame >= RULE && frame < S6;
  const hudShow = inRule ? 0 : frame < HUD_IN ? 1 : spring({ frame: frame - HUD_IN, fps, config: { stiffness: 140, damping: 18 } });
  const hudMode = frame < HUD_IN ? "min" : "full";
  const alert = frame >= st(18) && frame < RULE ? 1 : 0;
  const pulse = frame >= S6 ? interpolate(frame, [S6 + 10, S6 + 20, S6 + 40], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {SHOTS.map((s, i) => {
        const end = i === SHOTS.length - 1 ? SP1_TOTAL : SHOTS[i + 1].at;
        return (
          <Sequence key={i} from={s.at} durationInFrames={end - s.at}>
            {s.render(end - s.at)}
          </Sequence>
        );
      })}
      <Vignette strength={0.7} />
      <SurvivalHud state={hudAt(frame)} show={hudShow} mode={hudMode} flash={spendFlash(PURCH, frame)} alert={alert} pulse={pulse} />
      <PurchaseToasts purchases={PURCH.slice(0, 10)} />
      <FinalReceipt />
      {inRule ? null : <Captions lines={CAPS} lowFrom={st(28)} />}

      {WORDS.map((_, i) => (
        <Sequence key={`v${i}`} from={START[i]}>
          <Audio src={staticFile(`audio/voice/sp1-${String(i + 1).padStart(2, "0")}.wav`)} />
        </Sequence>
      ))}
      <Audio src={staticFile("audio/music/sp-bed.wav")} volume={bedLevel} />
      <Audio src={staticFile("audio/music/drone.wav")} volume={(f) => interpolate(f, [0, 30, RULE - 1, RULE, S6, S6 + 30, SP1_TOTAL - 30, SP1_TOTAL], [0, 0.07, 0.07, 0, 0, 0.07, 0.07, 0], { extrapolateRight: "clamp" }) * duck(f)} />
      {SFX.map(([name, at, vol, len], i) => (
        <Sequence key={`s${i}`} from={Math.max(0, at)} durationInFrames={len}>
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol * SFX_GAIN} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

