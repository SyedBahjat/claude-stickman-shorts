import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { makeDuck } from "../../kit/mix";
import { Blurred, Cam, Captions, type CapLine, MostOfYouSaid, Vignette } from "../../kit/Overlays";
import { Chip, FlowChips, infectedLook, lerp2, lin, MonitorTranscript, ramp, SEATED, SlamTitle, SpecCard, type TLine, WorldCam, zPose } from "../../kit/SilenceUI";
import { HALE, lerpPose, PASSENGERS, type Pose, STAND, Stick, TURNED, walk, walkCycle, walkTo, YOU } from "../../kit/Stick";
import { FONT } from "../../kit/style";
import { budgetAt, type HudState, type Purchase, PurchaseToasts, SP, spendFlash, SurvivalHud } from "../../kit/SurvivalHud";
import { Svg } from "../../sets/Sets";
import { Airport, BunkerWorld, ControlRoom, EquipRoom, FULL_BUILD, GhostEchoDrone, Hospital, ROOM, SilentFieldDevice, SoundRings, SPDefs, Street, WorldMap } from "../../sets/Silence";
import w01 from "../../../public/captions/sp2-01.json";
import w02 from "../../../public/captions/sp2-02.json";
import w03 from "../../../public/captions/sp2-03.json";
import w04 from "../../../public/captions/sp2-04.json";
import w05 from "../../../public/captions/sp2-05.json";
import w06 from "../../../public/captions/sp2-06.json";
import w07 from "../../../public/captions/sp2-07.json";
import w08 from "../../../public/captions/sp2-08.json";
import w09 from "../../../public/captions/sp2-09.json";
import w10 from "../../../public/captions/sp2-10.json";
import w11 from "../../../public/captions/sp2-11.json";
import w12 from "../../../public/captions/sp2-12.json";
import w13 from "../../../public/captions/sp2-13.json";
import w14 from "../../../public/captions/sp2-14.json";
import w15 from "../../../public/captions/sp2-15.json";
import w16 from "../../../public/captions/sp2-16.json";
import w17 from "../../../public/captions/sp2-17.json";
import w18 from "../../../public/captions/sp2-18.json";
import w19 from "../../../public/captions/sp2-19.json";
import w20 from "../../../public/captions/sp2-20.json";
import w21 from "../../../public/captions/sp2-21.json";
import w22 from "../../../public/captions/sp2-22.json";
import w23 from "../../../public/captions/sp2-23.json";
import w24 from "../../../public/captions/sp2-24.json";
import w25 from "../../../public/captions/sp2-25.json";
import w26 from "../../../public/captions/sp2-26.json";
import w27 from "../../../public/captions/sp2-27.json";
import w28 from "../../../public/captions/sp2-28.json";
import w29 from "../../../public/captions/sp2-29.json";
import w30 from "../../../public/captions/sp2-30.json";

/**
 * SILENCE PROTOCOL · EPISODE 02 · THE FIRST CONTACT
 * Lines: 02_EPISODES/EP02/lines.tsv · voices public/audio/voice/sp2-NN.wav · captions public/captions/sp2-NN.json
 * Canon in: 02_EPISODES/EP01/CANON.md + vote result A (THE SILENT FIELD bought, budget €260,000 → €35,000).
 */

// ---------- timeline ----------
const WORDS: Caption[][] = [w01, w02, w03, w04, w05, w06, w07, w08, w09, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19, w20, w21, w22, w23, w24, w25, w26, w27, w28, w29, w30];
/** [voice frames, gap after]. 3 inside a scene, 6 between scenes, longer holds for slams, silent text beats and the ending. */
const LEN: [number, number][] = [
  [51, 3], [154, 3], [69, 16], // S0 vote resolution
  [60, 3], [27, 30], [78, 30], // S1 the last day (+ PREPARATION COMPLETE slam)
  [60, 3], [38, 3], [52, 15], [60, 16], // S2 patient zero
  [62, 3], [68, 3], [58, 9], [36, 30], [103, 15], // S3 global collapse → DAY 7
  [130, 16], [101, 3], [100, 90], [65, 30], // S4 the final broadcast (+ full message, signal lost, silence)
  [61, 40], [79, 100], [61, 3], [33, 20], // S5 the signal (+ INCOMING panel, silent BLACK-7 message)
  [70, 3], [35, 3], [59, 13], [21, 20], [70, 6], [58, 12], [67, 75], // S6 the choice (+ ending hold)
];
const PRE = 8;
const START = LEN.reduce<number[]>((acc, [l, g], i) => [...acc, acc[i] + l + g], [PRE]);
export const SP2_TOTAL = START[LEN.length];
const st = (n: number) => START[n - 1];
const clean = (w: string) => w.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
/** Frame where word `word` (first match, prefix ok) of line n is spoken. */
const wf = (n: number, word: string) => {
  const ws = WORDS[n - 1];
  const i = ws.findIndex((w) => clean(w.text).startsWith(clean(word)));
  if (i < 0) throw new Error(`word ${word} not in line ${n}`);
  return st(n) + Math.round((ws[i].startMs / 1000) * 30);
};
const end = (n: number) => st(n) + LEN[n - 1][0];

const YELLOW: string[][] = [
  ["SILENT", "FIELD."], ["225000.", "35000", "NEVER", "SIDE."], ["60", "SECONDS", "ABSOLUTE", "SILENCE,"],
  ["365", "DAYS"], ["TIME", "UP."], ["SEALED.", "QUIET."],
  ["FIRST", "INFECTION", "HOSPITAL."], ["DOCTOR", "HELP."], ["HOURS,", "OUTBREAK"], ["TEN", "HUNDREDS.", "THOUSANDS."],
  ["SEVEN", "DAYS", "SILENT."], ["RED,", "COUNTRY"], ["AIRPORTS", "HOSPITALS"], ["GOVERNMENTS", "CONTROL."], ["DAY", "7", "OUTBREAK.", "BUNKER,"],
  ["FINAL", "GOVERNMENT", "BROADCAST", "READ"], ["NEVER", "UNVERIFIED", "BLACK-7."], ["FAMILIAR", "IDENTITIES.", "TRUST"], ["DIES,", "ALONE", "WARNING."],
  ["CONSOLE", "AGAIN."], ["BLACK-7.", "NEVER", "ANSWER."], ["NAME.", "FACE.", "WORDS"], ["KEEP", "COMING."],
  ["NEVER", "RESPOND"], ["SOMEONE", "HELP."], ["SILENT", "FIELD", "UNUSED."], ["WHAT", "DO?"], ["A:", "INVESTIGATE", "SOURCE."], ["B:", "DISCONNECT", "PROTECT"], ["A", "B", "SURVIVAL."],
].map((l) => l.map((w) => w.replace(/[^A-Z0-9'-]/g, "")));
const CAPS: CapLine[] = WORDS.map((words, i) => ({ start: START[i], end: START[i + 1], words, yellow: YELLOW[i] }));
const SPANS = LEN.map(([l], i) => [START[i], START[i] + l] as [number, number]);
const duck = makeDuck(SPANS, 0.32, 8);

// ---------- scene marks ----------
const S1 = st(4);
const S2 = st(7);
const S3 = st(11);
const S4 = st(16);
const S5 = st(20);
const S6 = st(24);
const ZERO = wf(5, "UP"); // countdown hits 0 → PREPARATION COMPLETE
const DAY7 = wf(15, "DAY"); // new survival counter
const SAY = st(9) + 6; // Patient Zero's voice (red rings only)
const HOSP = wf(13, "HOSPITALS");
const GOV = wf(16, "AS"); // cut to the government transcript
const WARN1 = st(17);
const WARN2 = wf(17, "RESPOND") - 8;
const LOST = st(19) - 6; // signal dies
const INC = end(20) + 4; // INCOMING TRANSMISSION panel
const B7 = end(21) + 3; // BLACK-7 transcript
const B7_LINES = [8, 30, 62]; // PLEASE. / I KNOW YOU CAN SEE THIS. / THEY'RE OUTSIDE. (frames after B7)
const MORE = st(23) + 10; // PLEASE ANSWER.

// ---------- money + resources (canon: €260,000 − €225,000 = €35,000) ----------
const PURCH: Purchase[] = [{ at: st(2) + 2, item: "The Silent Field", cost: 225_000 }];
const GRAB = st(2) + 50; // YOU lifts the device off platform A
const easeIO = Easing.inOut(Easing.cubic);
/** 365 → 0 during "You had 365 days to prepare. Now, your time is up." */
const daysLeft = (f: number) => Math.round(365 * (1 - easeIO(lin(f, S1 + 6, ZERO))));
const hudAt = (f: number): HudState => {
  const eat = lin(f, DAY7 + 8, DAY7 + 32); // 7 days of consumption (1 person, ≈10 L/day drinking water)
  return { budget: budgetAt(260_000, PURCH, f), food: 365 - 7 * eat, drink: 3600 - 70 * eat, tech: 12000, days: f < S1 ? 365 : daysLeft(f) };
};

// ---------- the carried device (THE SILENT FIELD, SF-60, original component; standby = rings dim, never a dome) ----------
const SF_SCALE = 0.5;
const Carried: React.FC<{ on?: number; spin?: number }> = ({ on = 0.25, spin = 0 }) => (
  <g transform="translate(0,62)"><SilentFieldDevice x={0} y={0} scale={SF_SCALE} on={on} spin={spin} /></g>
);
/** YOU seated at the control-room desk (EP01 Surveillance framing) with the SF-60 resting in the back hand. */
const SeatedYou: React.FC<{ type?: number; startle?: number }> = ({ type = 0, startle = 0 }) => {
  const frame = useCurrentFrame();
  const pose = lerpPose(SEATED, { ...SEATED, lean: -0.02, headTilt: -0.12 }, startle);
  return (
    <Stick x={235} floor={1660} hip={[245, 1270]} look={YOU} pose={pose} lookAt={0.9}
      reach={{ handF: [452, 1168], handB: lerp2([400, 1240], [600, 1222], type) }} holdF={<Carried spin={frame / 10} />} />
  );
};

// =====================================================================================
// S0 — THE VOTE (Most of you chose A)
// =====================================================================================
const VoteOpen: React.FC<{ dur: number; decideAt: number }> = ({ dur, decideAt }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Blurred px={10} dim={0.4}>
        <Cam dur={dur} from={1.0} to={1.05} origin="50% 70%">
          <Svg>
            <SPDefs />
            <EquipRoom a={1} b={1 - 0.8 * ramp(frame, decideAt, decideAt + 10)} />
            <SilentFieldDevice x={280} y={1470} scale={SF_SCALE} on={1} spin={frame / 8} />
            <GhostEchoDrone x={800} y={1330} scale={0.6} on={frame < decideAt ? 1 : 0} />
          </Svg>
        </Cam>
      </Blurred>
      <MostOfYouSaid a="THE SILENT FIELD" b="THE GHOST ECHO" winner="A" decideAt={decideAt} colors={[SP.blue, SP.green]} />
    </>
  );
};

/** The purchase: platform B goes dark, YOU walks to platform A and lifts the SF-60. It is carried, not installed. */
const TakeDevice: React.FC<{ dur: number; grab: number }> = ({ dur, grab }) => {
  const frame = useCurrentFrame();
  const dist = 250 * ramp(frame, 0, grab - 12);
  const w = walkTo(700, -1, dist, 250, { amp: 0.85 });
  const held = frame >= grab;
  const reachT = ramp(frame, grab - 12, grab);
  const lift = ramp(frame, grab, grab + 18);
  const hand = held ? lerp2([300, 1418], [400, 1300], lift) : lerp2([w.x - 60, 1330], [300, 1418], reachT);
  return (
    <Cam dur={dur} from={1.02} to={1.1} origin="35% 75%">
      <Svg>
        <SPDefs />
        <EquipRoom a={1} b={0.08 + 0.92 * (1 - ramp(frame, 0, 14))} />
        <GhostEchoDrone x={800} y={1360} scale={0.6} on={0} />
        {held ? null : <SilentFieldDevice x={300} y={1480} scale={SF_SCALE} on={1} spin={frame / 8} />}
        <Stick x={w.x} floor={1700} facing={-1} look={YOU} pose={frame < grab - 12 ? w.pose : STAND} lookAt={0.7}
          reach={frame >= grab - 12 ? { handF: hand } : {}} holdF={held ? <Carried on={0.6} spin={frame / 8} /> : undefined} />
      </Svg>
    </Cam>
  );
};

const FieldReady: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Cam dur={dur} from={1.3} to={1.42} origin="50% 72%">
        <Svg>
          <SPDefs />
          <EquipRoom a={0.5} b={0.04} />
          <Stick x={540} floor={1700} look={YOU} pose={{ ...STAND, headTilt: 0.12 }} reach={{ handF: [600, 1290] }} holdF={<Carried on={0.3 + 0.1 * Math.sin(frame / 6)} spin={frame / 10} />} lookAt={0.6} />
        </Svg>
      </Cam>
      <SpecCard letter="A" name="THE SILENT FIELD" price="€225,000 · PURCHASED" lines={["60 SECONDS OF ABSOLUTE SILENCE", "PORTABLE · STATUS: NOT ACTIVATED"]} color={SP.blue} at={2} />
    </>
  );
};

// =====================================================================================
// S1 — THE LAST DAY
// =====================================================================================
const LastDay: React.FC<{ dur: number; zeroAt: number }> = ({ dur, zeroAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const done = frame >= zeroAt;
  const n = daysLeft(frame + S1);
  const pre = spring({ frame, fps, config: { stiffness: 260, damping: 18 } });
  return (
    <>
      <Cam dur={dur} from={1.0} to={1.1} origin="55% 45%" shake={done && frame - zeroAt < 20 ? 8 : 0}>
        <Svg>
          <SPDefs />
          <ControlRoom alarm={done ? 0.6 * (1 - ramp(frame, zeroAt + 10, zeroAt + 40)) : 0} figure={0} />
          <SeatedYou type={ramp(frame, 4, 16)} startle={done ? ramp(frame, zeroAt, zeroAt + 6) : 0} />
        </Svg>
      </Cam>
      {!done ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center", opacity: pre }}>
            <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 30, letterSpacing: 8, color: SP.mute }}>PREPARATION COUNTDOWN</div>
            <div style={{ fontFamily: FONT.title, fontSize: 300, lineHeight: 0.9, color: SP.red, textShadow: `0 0 40px rgba(239,75,60,0.6), 0 10px 0 #130f0b`, WebkitTextStroke: "6px #130f0b", paintOrder: "stroke fill" }}>{n}</div>
            <div style={{ fontFamily: FONT.title, fontSize: 64, letterSpacing: 8, color: "white", textShadow: "0 4px 12px rgba(0,0,0,0.9)" }}>DAYS REMAINING</div>
          </div>
        </AbsoluteFill>
      ) : null}
      <SlamTitle at={zeroAt} big="0" sub="PREPARATION COMPLETE" top={330} />
      {done && frame - zeroAt < 5 ? <AbsoluteFill style={{ background: "#ff2a1a", opacity: 0.25 }} /> : null}
    </>
  );
};

/** The bunker, sealed: pull back from the closed airlock to the whole cut-away and the quiet surface. */
const Sealed: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = Easing.inOut(Easing.sin)(Math.min(1, frame / dur));
  const cx = 215 + (540 - 215) * t;
  const cy = 730 + (960 - 730) * t;
  const z = 3.2 + (1.15 - 3.2) * t;
  return (
    <>
      <Svg bg="#0b0809">
        <SPDefs />
        <WorldCam cx={cx} cy={cy} z={z}>
          <BunkerWorld b={FULL_BUILD} />
          <Stick x={600} floor={ROOM.command.y1} scale={0.34} look={YOU} pose={STAND} lookAt={0.7} holdF={<Carried />} reach={{ handF: [620, ROOM.command.y1 - 80] }} />
        </WorldCam>
      </Svg>
      <Chip text="AIRLOCK SEALED · 2 DOORS LOCKED" color={SP.green} top={300} size={44} opacity={ramp(frame, 6, 14)} />
    </>
  );
};

// =====================================================================================
// S2 — PATIENT ZERO (no protagonist; the voice is drawn as red rings, never heard)
// =====================================================================================
/** Hospital isolation ward. `w0` = this shot's offset inside the ward timeline (frame 0 = S2). */
const Ward: React.FC<{ dur: number; w0: number; close?: boolean }> = ({ dur, w0, close }) => {
  const frame = useCurrentFrame();
  const w = w0 + frame;
  const lean = st(8) - S2 + 4;
  const say = SAY - S2;
  const hit = say + 14;
  const turned = w >= hit;
  const walkD = 400 * ramp(w, 0, 46);
  const dw = walkTo(150, 1, walkD, 400, { amp: 0.8 });
  const helpPose: Pose = lerpPose(w < 46 ? dw.pose : STAND, { ...STAND, lean: 0.26, armF: [1.2, 0.3], armB: [0.9, 0.4], headTilt: 0.15 }, ramp(w, lean, lean + 14));
  const recoil: Pose = lerpPose(helpPose, { ...STAND, lean: -0.1, armF: [0.4, 1.1], armB: [0.2, 1.0] }, ramp(w, say + 2, say + 10));
  const patientHead = [890, 1335] as const;
  return (
    <Cam dur={dur} from={close ? 1.45 : 1.04} to={close ? 1.55 : 1.12} origin={close ? "66% 68%" : "55% 65%"}>
      <Svg>
        <SPDefs />
        <Hospital sign="ISOLATION WARD" />
        {/* Patient Zero lying on the right bed (rig rotated 90°: head toward the pillow at the right) */}
        <g transform={`translate(800,1342) rotate(90)`}>
          <Stick x={0} floor={0} hip={[0, 0]} scale={0.42} look={TURNED[2]} pose={{ ...STAND, armF: [0.1 + 0.05 * Math.sin(w / 9), 0.1], headTilt: w >= say - 10 ? -0.5 * ramp(w, say - 10, say) : 0 }} lookAt={-0.6} />
        </g>
        <rect x={700} y={1350} width={180} height={34} rx={10} fill="#cfd8d4" stroke="#130f0b" strokeWidth={4} opacity={0.95} />
        {w >= say && w < say + 40 ? <SoundRings x={patientHead[0] - 20} y={patientHead[1] - 10} t={(w - say) / 30} n={3} max={340} dir={Math.PI} spread={1.5} width={10} /> : null}
        <Stick x={turned ? dw.x : dw.x} floor={1640} look={infectedLook(HALE, turned ? 1 : 0)} pose={turned ? zPose(w, 5) : w >= say ? recoil : helpPose} lookAt={0.8} />
        {turned && w < hit + 6 ? <rect width={1080} height={1920} fill="#ff2a1a" opacity={0.25} /> : null}
      </Svg>
    </Cam>
  );
};

/** One voice infects many: two rows of people, each newly infected voice reaches the next (EP01 chain-reaction language). */
const Spread: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const rows = [
    { y: 1600, s: 0.62, xs: [80, 230, 380, 530, 680, 830, 980] },
    { y: 1700, s: 0.72, xs: [150, 330, 510, 690, 870] },
  ];
  return (
    <Cam dur={dur} from={1.0} to={1.1} origin="30% 60%">
      <Svg>
        <SPDefs />
        <Street fire={1.4} />
        {rows.map((r, ri) =>
          r.xs.map((x, i) => {
            const at = (ri ? 4 : 0) + i * 6;
            const turned = frame >= at;
            const look = infectedLook(PASSENGERS[(i + ri * 3) % PASSENGERS.length], turned ? 1 : 0);
            return (
              <g key={`${ri}-${i}`}>
                {turned && i < r.xs.length - 1 ? <SoundRings x={x + 20} y={r.y - 420 * r.s} t={(frame - at) / 30} n={2} max={180} dir={0} spread={1.4} width={8} /> : null}
                <Stick x={x} floor={r.y} scale={r.s} look={look} pose={turned ? zPose(frame, i + ri) : { ...STAND, armF: [0.3, 1.2], armB: [-0.2, 1.1] }} lookAt={turned ? 0.2 : 0.9} />
              </g>
            );
          }),
        )}
      </Svg>
    </Cam>
  );
};

// =====================================================================================
// S3 — GLOBAL COLLAPSE
// =====================================================================================
const CitySilent: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const zs = [{ x0: 120, s: 0.8, f: 1640 }, { x0: 430, s: 0.7, f: 1600 }, { x0: 980, s: 0.75, f: 1620 }];
  return (
    <Cam dur={dur} from={1.0} to={1.08} origin="50% 70%">
      <Svg>
        <SPDefs />
        <Street fire={1.2} lights={0.9 - 0.6 * lin(frame, 0, dur)} />
        {zs.map((z, i) => {
          const dir: 1 | -1 = i === 2 ? -1 : 1;
          const x = z.x0 + dir * frame * 1.3;
          return <Stick key={i} x={x} floor={z.f} scale={z.s} facing={dir} look={TURNED[i + 1]} pose={{ ...walk(x / walkCycle(0.6, z.s), 0.6), armF: [0.9, 0.3], armB: [0.8, 0.3], lean: 0.16 }} />;
        })}
      </Svg>
    </Cam>
  );
};

const MapShot: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = lin(frame, 0, dur - 6);
  const day = 1 + Math.min(6, Math.floor(t * 7));
  return (
    <>
      <Cam dur={dur} from={1.0} to={1.06} origin="50% 45%">
        <AbsoluteFill style={{ background: "#07090a" }}>
          <Svg bg="#07090a">
            <SPDefs />
            <WorldMap x={40} y={560} w={1000} spread={0.1 + 0.9 * t} />
          </Svg>
        </AbsoluteFill>
      </Cam>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center" }}>
          <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 30, letterSpacing: 8, color: SP.mute }}>GLOBAL INFECTION MAP</div>
          <div style={{ fontFamily: FONT.title, fontSize: 150, lineHeight: 1, color: SP.red, textShadow: "0 0 30px rgba(239,75,60,0.5)" }}>DAY {day}</div>
        </div>
      </AbsoluteFill>
    </>
  );
};

const AirportShot: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Cam dur={dur} from={1.0} to={1.08} origin="50% 55%">
      <Svg>
        <SPDefs />
        <Airport t={lin(frame, 0, 18)} />
        <Stick x={980 - frame * 1.2} floor={1640} scale={0.6} facing={-1} look={TURNED[4]} pose={{ ...walk(frame / 26, 0.6), armF: [0.9, 0.3], armB: [0.8, 0.3], lean: 0.16 }} />
      </Svg>
    </Cam>
  );
};

const Overflow: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Cam dur={dur} from={1.04} to={1.12} origin="50% 70%" shake={6}>
      <Svg>
        <SPDefs />
        <Hospital />
        {[180, 400, 640, 900].map((x, i) => (
          <Stick key={x} x={x} floor={1640 - (i % 2) * 20} scale={0.8} facing={i % 2 ? -1 : 1} look={i === 1 ? infectedLook(HALE, 1) : TURNED[i]} pose={zPose(frame, i)} />
        ))}
        <SoundRings x={420} y={1150} t={frame / 30} n={3} max={420} width={9} />
      </Svg>
    </Cam>
  );
};

/** Cities go dark; the emergency ticker (EP01 wording) flickers out. */
const DarkCity: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const out = lin(frame, 8, 46);
  const tick = frame < 48 ? (random(`dk${Math.floor(frame / 2)}`) > 0.15 * (1 + out * 4) ? 1 : 0.2) : 0;
  return (
    <>
      <Cam dur={dur} from={1.0} to={1.1} origin="50% 60%">
        <Svg>
          <SPDefs />
          <Street fire={1 - 0.75 * out} lights={0.35 * (1 - out)} />
        </Svg>
      </Cam>
      <AbsoluteFill style={{ pointerEvents: "none", opacity: tick }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 300, background: "rgba(20,4,3,0.9)", border: `3px solid ${SP.red}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ background: Math.floor(frame / 8) % 2 ? "#b8261f" : "#e8332a", fontFamily: FONT.title, fontSize: 48, letterSpacing: 3, color: "white", textAlign: "center", padding: "6px 0" }}>EMERGENCY BROADCAST</div>
          <div style={{ whiteSpace: "nowrap", fontFamily: FONT.mono, fontWeight: 800, fontSize: 30, color: "#ffb3a8", padding: "10px 0", transform: `translateX(${300 - ((frame * 6) % 1400)}px)` }}>
            VOICE-TRANSMITTED PATHOGEN · DO NOT LISTEN TO THE INFECTED · STAY INDOORS · VOICE-TRANSMITTED PATHOGEN ·
          </div>
        </div>
      </AbsoluteFill>
    </>
  );
};

/** Back to the bunker: DAY 7 OF THE OUTBREAK replaces the preparation countdown. */
const Day7: React.FC<{ dur: number; slamAt: number }> = ({ dur, slamAt }) => {
  const frame = useCurrentFrame();
  const t = Easing.inOut(Easing.sin)(Math.min(1, frame / dur));
  return (
    <>
      <Svg bg="#0b0809">
        <SPDefs />
        <WorldCam cx={540} cy={1000 - 10 * t} z={1.15 + 0.1 * t}>
          <BunkerWorld b={FULL_BUILD} />
          <Stick x={330} floor={ROOM.living.y1} scale={0.34} look={YOU} pose={STAND} lookAt={0.7} holdF={<Carried />} reach={{ handF: [350, ROOM.living.y1 - 80] }} />
        </WorldCam>
      </Svg>
      <SlamTitle at={slamAt} big="DAY 7" sub="OF THE OUTBREAK" top={300} bigSize={230} />
    </>
  );
};

// =====================================================================================
// S4 — THE FINAL BROADCAST (text only: playback disabled, as always)
// =====================================================================================
const BroadcastIn: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Cam dur={dur} from={1.0} to={1.1} origin="55% 45%">
        <Svg>
          <SPDefs />
          <ControlRoom alarm={0.25} figure={0} />
          <SeatedYou type={ramp(frame, 6, 18)} />
        </Svg>
      </Cam>
      <FlowChips chips={[["GOV BROADCAST", "INCOMING", SP.red], ["SPEECH-TO-TEXT", "PROCESSING", "#e0b34a"], ["SCREEN ONLY", "SPEAKERS OFF", SP.green]]} start={8} step={16} />
    </>
  );
};

const WarnBox: React.FC<{ text: string; at: number; big?: boolean }> = ({ text, at, big }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = spring({ frame: frame - at, fps, config: { stiffness: 300, damping: 16 } });
  return (
    <div style={{ marginTop: 14, padding: "10px 16px", border: `3px solid ${SP.red}`, borderRadius: 8, background: "rgba(239,75,60,0.16)", fontFamily: FONT.title, fontSize: big ? 50 : 42, letterSpacing: 1, color: "white", lineHeight: 1.05, transform: `scale(${interpolate(s, [0, 1], [1.25, 1])})`, transformOrigin: "left center", opacity: s }}>
      <span style={{ color: SP.red }}>⚠ </span>{text}
    </div>
  );
};

const GOV_LINES = (w2: number): TLine[] => [
  { meta: "[DAY 7 · 04:16:02] GOVERNMENT · FINAL BROADCAST", text: "IF YOU ARE RECEIVING THIS MESSAGE, DO NOT RESPOND TO ANY TRANSMISSION ORIGINATING FROM BLACK-7.", at: w2 + 10, size: 36 },
  { meta: "[04:16:09]", text: "THE INFECTED CAN REPRODUCE FAMILIAR IDENTITIES.", at: st(18) - GOV, size: 36 },
  { meta: "[04:16:13]", text: "DO NOT TRUST THEM.", at: wf(18, "DO") - GOV, size: 44, color: "#ffd0c8" },
];

const GovScreen: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const w1 = WARN1 - GOV;
  const w2 = WARN2 - GOV;
  const unstable = end(18) - GOV;
  return (
    <MonitorTranscript dur={dur} title="EMERGENCY BROADCAST · GOVERNMENT" right="● LIVE" lines={GOV_LINES(w2)} cps={2.2}
      glitchAt={unstable} corrupt={(f) => 0.55 * lin(f, unstable + 20, dur)} wave="#5a3a12"
      extra={<><WarnBox text="NEVER LISTEN TO UNVERIFIED TRANSMISSIONS." at={w1} /><WarnBox text="NEVER RESPOND TO CHANNEL BLACK-7." at={w2} big /></>} />
  );
};

/** Signal lost; the saved warning stays on screen. */
const NoSignal: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const burst = frame < 8;
  return (
    <>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.05 * ramp(frame, 0, dur)})` }}>
        <AbsoluteFill style={{ background: "#040706" }}>
          <div style={{ position: "absolute", left: 40, right: 40, top: 290, bottom: 520, border: `3px solid ${SP.greenDim}`, borderRadius: 16, background: "#050807", overflow: "hidden" }}>
            {burst ? Array.from({ length: 70 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: i * 16, height: 16, background: random(`ns${frame}-${i}`) > 0.5 ? "#cfcfcf" : "#1a1a1a", opacity: 0.6 }} />) : null}
            <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center", fontFamily: FONT.title, fontSize: 110, letterSpacing: 6, color: "#3d4a44" }}>NO SIGNAL</div>
            <div style={{ position: "absolute", top: 430, width: "100%", textAlign: "center", fontFamily: FONT.mono, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: SP.mute }}>GOVERNMENT CHANNEL · TRANSMISSION ENDED</div>
            <div style={{ position: "absolute", left: 30, right: 30, top: 620, padding: "14px 18px", border: `3px solid ${SP.red}`, borderRadius: 8, background: "rgba(239,75,60,0.12)" }}>
              <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 20, letterSpacing: 2, color: SP.red }}>SAVED · GOVERNMENT WARNING</div>
              <div style={{ fontFamily: FONT.title, fontSize: 48, color: "white", lineHeight: 1.05, marginTop: 4 }}>NEVER RESPOND TO CHANNEL BLACK-7.</div>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <Stick x={60} floor={2500} scale={2.1} look={YOU} pose={{ ...STAND, lean: 0.08 }} lookAt={1} hideLegs />
        </svg>
      </AbsoluteFill>
    </>
  );
};

// =====================================================================================
// S5 — THE SIGNAL (BLACK-7)
// =====================================================================================
const ConsoleWakes: React.FC<{ dur: number; litAt: number }> = ({ dur, litAt }) => {
  const frame = useCurrentFrame();
  const lit = frame >= litAt ? 1 : 0;
  return (
    <Cam dur={dur} from={1.0} to={1.1} origin="55% 45%" shake={lit && frame - litAt < 16 ? 8 : 0}>
      <Svg>
        <SPDefs />
        <ControlRoom alarm={lit} figure={0} />
        <SeatedYou startle={ramp(frame, litAt, litAt + 6)} />
      </Svg>
      {lit ? <AbsoluteFill style={{ background: "#ff2a1a", opacity: 0.08 + 0.05 * Math.sin(frame / 3) }} /> : null}
    </Cam>
  );
};

/** EP01 ResourceConsole look, alert state: INCOMING TRANSMISSION · CHANNEL: BLACK-7 · SOURCE: UNKNOWN · RESTRICTED. */
const IncomingPanel: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const flick = random(`ip${Math.floor(frame / 3)}`) > 0.8 ? 0.65 : 1;
  const row = (i: number) => ramp(frame, 4 + i * 7, 12 + i * 7);
  const blink = Math.floor(frame / 8) % 2 === 0;
  const rows: [string, string, string][] = [["CHANNEL", "BLACK-7", "white"], ["SOURCE", "UNKNOWN", "#e0b34a"]];
  return (
    <>
      <Blurred px={12} dim={0.4}>
        <Svg>
          <SPDefs />
          <ControlRoom alarm={1} figure={0} />
        </Svg>
      </Blurred>
      <Cam dur={dur} from={1.0} to={1.08} shake={10}>
        <AbsoluteFill style={{ opacity: flick }}>
          <div style={{ position: "absolute", left: 50, right: 50, top: 300, background: "rgba(5,9,8,0.92)", border: `3px solid ${SP.red}`, borderRadius: 14, padding: "26px 34px", boxShadow: "0 0 60px rgba(239,75,60,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: SP.mute }}>
              <span>COMMS CONSOLE</span>
              <span>DAY 7 · 04:31</span>
            </div>
            <div style={{ marginTop: 18, fontFamily: FONT.title, fontSize: 84, letterSpacing: 3, color: blink ? SP.red : "#a8352a", textAlign: "center", lineHeight: 1 }}>INCOMING TRANSMISSION</div>
            {rows.map(([k, v, col], i) => (
              <div key={k} style={{ marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: row(i), transform: `translateX(${(1 - row(i)) * 40}px)`, borderBottom: `2px solid ${SP.line}`, paddingBottom: 10 }}>
                <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 34, color: SP.mute, letterSpacing: 3 }}>{k}:</span>
                <span style={{ fontFamily: FONT.title, fontSize: i === 0 ? 120 : 76, color: col, lineHeight: 1 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 26, opacity: row(2), padding: "16px 22px", borderRadius: 10, background: "rgba(239,75,60,0.18)", border: `2px solid ${SP.red}`, fontFamily: FONT.title, fontSize: 58, letterSpacing: 2, color: SP.red, textAlign: "center" }}>
              ⚠ WARNING: RESTRICTED CHANNEL
            </div>
            <div style={{ marginTop: 16, opacity: row(4), fontFamily: FONT.mono, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: "#ffb3a8", textAlign: "center" }}>
              GOVERNMENT ORDER: NEVER RESPOND TO CHANNEL BLACK-7
            </div>
          </div>
        </AbsoluteFill>
      </Cam>
      <AbsoluteFill style={{ background: "#ff2a1a", opacity: 0.1 * (0.5 + 0.5 * Math.sin(frame / 3)), pointerEvents: "none" }} />
    </>
  );
};

const B7_TEXT: [string, string][] = [
  ["[04:31:12] CHANNEL BLACK-7 · SENDER UNKNOWN", "PLEASE."],
  ["[04:31:15] CHANNEL BLACK-7 · SENDER UNKNOWN", "I KNOW YOU CAN SEE THIS."],
  ["[04:31:19] CHANNEL BLACK-7 · SENDER UNKNOWN", "THEY'RE OUTSIDE."],
  ["[04:31:48] CHANNEL BLACK-7 · SENDER UNKNOWN", "PLEASE ANSWER."],
];
/** The BLACK-7 transcript. `t0` = absolute frame this shot starts (line timings are absolute). `all` = show everything already typed. */
const B7Screen: React.FC<{ dur: number; t0: number; all?: boolean }> = ({ dur, t0, all }) => {
  const ats = [...B7_LINES.map((a) => B7 + a), MORE];
  const lines: TLine[] = B7_TEXT.map(([meta, text], i) => ({ meta, text, at: all ? -999 : ats[i] - t0 }));
  return (
    <MonitorTranscript dur={dur} title="CHANNEL BLACK-7 · LIVE TRANSCRIPT" right="SOURCE: UNKNOWN" lines={lines}
      extra={<div style={{ marginTop: 12, fontFamily: FONT.mono, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: "#ffb3a8" }}>⚠ RESTRICTED CHANNEL · GOVERNMENT ORDER: DO NOT RESPOND</div>} />
  );
};

// =====================================================================================
// S6 — THE CHOICE
// =====================================================================================
const Contrast: React.FC<{ dur: number; helpAt: number }> = ({ dur, helpAt }) => {
  const frame = useCurrentFrame();
  const top = ramp(frame, 2, 10);
  const bot = ramp(frame, 8, 16);
  const help = ramp(frame, helpAt, helpAt + 8);
  const glow = help * (0.6 + 0.4 * Math.sin(frame / 4));
  return (
    <>
      <Blurred px={10} dim={0.35}>
        <Svg>
          <SPDefs />
          <ControlRoom alarm={0.5} figure={0} />
        </Svg>
      </Blurred>
      <Cam dur={dur} from={1.0} to={1.05} origin="50% 40%">
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 40, right: 40, top: 290, opacity: top * (1 - 0.35 * help), transform: `translateY(${(1 - top) * -30}px)`, background: "rgba(20,4,3,0.92)", border: `3px solid ${SP.red}`, borderRadius: 12, padding: "16px 24px" }}>
            <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: SP.red }}>GOVERNMENT · FINAL BROADCAST · SAVED</div>
            <div style={{ fontFamily: FONT.title, fontSize: 64, color: "white", lineHeight: 1.05, marginTop: 6 }}>NEVER RESPOND TO CHANNEL BLACK-7.</div>
          </div>
          <div style={{ position: "absolute", top: 520, width: "100%", textAlign: "center", fontFamily: FONT.title, fontSize: 60, color: SP.mute, opacity: bot }}>VS</div>
          <div style={{ position: "absolute", left: 40, right: 40, top: 610, opacity: bot, transform: `translateY(${(1 - bot) * 30}px) scale(${1 + 0.03 * help})`, background: "#06100c", border: `3px solid ${help > 0.5 ? SP.green : SP.greenDim}`, borderRadius: 12, padding: "16px 24px", boxShadow: `0 0 ${50 * glow}px rgba(88,214,141,0.45)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: SP.mute }}>
              <span>CHANNEL BLACK-7 · LIVE</span><span style={{ color: SP.red }}>SOURCE: UNKNOWN</span>
            </div>
            {["PLEASE.", "I KNOW YOU CAN SEE THIS.", "THEY'RE OUTSIDE.", "PLEASE ANSWER."].map((l, i) => (
              <div key={l} style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 44, color: "#cfe9d8", lineHeight: 1.2, marginTop: i ? 4 : 10 }}>&gt; {l}{i === 3 && Math.floor(frame / 8) % 2 ? <span style={{ color: SP.green }}>▌</span> : null}</div>
            ))}
          </div>
        </AbsoluteFill>
      </Cam>
    </>
  );
};

/** The Silent Field, still unused: close on YOU and the device (standby, no dome). */
const Unused: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Cam dur={dur} from={1.35} to={1.6} origin="26% 68%">
        <Svg>
          <SPDefs />
          <ControlRoom alarm={0.35} figure={0} />
          <SeatedYou />
        </Svg>
      </Cam>
      <Chip text="THE SILENT FIELD · 60 S · UNUSED" color={SP.blue} textColor="#bfe2ff" top={300} size={50} opacity={ramp(frame, 4, 12)} />
    </>
  );
};

const Option: React.FC<{ dur: number; letter: "A" | "B" }> = ({ dur, letter }) => {
  const frame = useCurrentFrame();
  const a = letter === "A";
  const col = a ? SP.blue : SP.green;
  return (
    <>
      <Cam dur={dur} from={1.12} to={1.22} origin={a ? "62% 40%" : "75% 62%"}>
        <Svg>
          <SPDefs />
          <ControlRoom alarm={0.3} figure={0} />
          <SeatedYou />
          <ellipse cx={a ? 670 : 860} cy={a ? 800 : 1180} rx={420} ry={360} fill={`url(#${a ? "spBlue" : "spGreen"})`} opacity={0.55 + 0.15 * Math.sin(frame / 5)} />
          {a ? <line x1={330 + ((frame * 14) % 705)} y1={560} x2={330 + ((frame * 14) % 705)} y2={1045} stroke={SP.blue} strokeWidth={6} opacity={0.7} /> : null}
        </Svg>
      </Cam>
      <SpecCard letter={letter} name={a ? "INVESTIGATE" : "DISCONNECT"} price="CHANNEL BLACK-7" color={col} at={2}
        lines={a ? ["IGNORE THE GOVERNMENT WARNING", "TRY TO FIND THE SOURCE OF BLACK-7"] : ["FOLLOW THE GOVERNMENT'S INSTRUCTIONS", "CUT BLACK-7 · PROTECT THE BUNKER"]} />
    </>
  );
};

/** Final beat: WHAT WOULD YOU DO? + A/B cards + COMMENT A OR B; then BLACK-7 writes again. */
const FinalChoice: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (at: number) => (frame < at ? 0 : spring({ frame: frame - at, fps, config: { stiffness: 280, damping: 15 } }));
  const msgAt = dur - 44;
  const msg = "WHY AREN'T YOU ANSWERING?";
  const shown = Math.max(0, Math.min(msg.length, Math.floor((frame - msgAt) * 1.6)));
  const glitch = frame >= msgAt && random(`fg${Math.floor(frame / 2)}`) > 0.6;
  const card = (letter: string, name: string, color: string, top: number, at: number) => {
    const s = pop(at);
    return (
      <div style={{ position: "absolute", left: 50, right: 50, top, height: 128, transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`, opacity: s, background: "#0b0e11", border: `5px solid ${color}`, borderRadius: 14, boxShadow: `0 0 30px ${color}88`, display: "flex", alignItems: "center" }}>
        <div style={{ width: 92, height: 98, marginLeft: 14, background: color, borderRadius: 8, color: "#0b0f12", fontFamily: FONT.title, fontSize: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>{letter}</div>
        <div style={{ marginLeft: 22, fontFamily: FONT.title, fontSize: 54, color: "white", letterSpacing: 1 }}>{name} <span style={{ color: SP.mute }}>—</span> <span style={{ color }}>BLACK-7</span></div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Blurred px={10} dim={0.35}>
        <Svg>
          <SPDefs />
          <ControlRoom alarm={frame >= msgAt ? 1 : 0.3} figure={0} />
        </Svg>
      </Blurred>
      <div style={{ position: "absolute", top: 590, width: "100%", textAlign: "center", transform: `scale(${pop(0)})`, fontFamily: FONT.title, fontSize: 104, color: "white", textShadow: "0 8px 20px rgba(0,0,0,0.9)" }}>WHAT WOULD YOU DO?</div>
      {card("A", "INVESTIGATE", SP.blue, 760, 4)}
      {card("B", "DISCONNECT", SP.green, 920, 10)}
      <div style={{ position: "absolute", top: 1090, width: "100%", textAlign: "center", transform: `scale(${pop(18)})`, fontFamily: FONT.title, fontSize: 120, color: "white", textShadow: "0 8px 20px rgba(0,0,0,0.9)" }}>
        COMMENT <span style={{ color: SP.blue }}>A</span> OR <span style={{ color: SP.green }}>B</span>
      </div>
      <div style={{ position: "absolute", top: 1240, width: "100%", textAlign: "center", transform: `scale(${pop(24)})`, fontFamily: FONT.title, fontSize: 64, letterSpacing: 4, color: "#ffc338", textShadow: "0 6px 16px rgba(0,0,0,0.9)" }}>TO DECIDE YOUR SURVIVAL</div>
      {frame >= msgAt ? (
        <div style={{ position: "absolute", left: 40, right: 40, top: 290, transform: `translateX(${glitch ? (random(`fgx${frame}`) - 0.5) * 26 : 0}px)`, background: "rgba(20,4,3,0.92)", border: `3px solid ${SP.red}`, borderRadius: 12, padding: "16px 24px", boxShadow: "0 0 50px rgba(239,75,60,0.5)" }}>
          <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: SP.red }}>CHANNEL BLACK-7 · TRANSCRIPT · SOURCE: UNKNOWN</div>
          <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 52, color: "white", lineHeight: 1.15, marginTop: 6 }}>&gt; {msg.slice(0, shown)}<span style={{ color: SP.red }}>▌</span></div>
        </div>
      ) : null}
      {frame >= msgAt && frame < msgAt + 4 ? <AbsoluteFill style={{ background: "#ff2a1a", opacity: 0.3 }} /> : null}
    </AbsoluteFill>
  );
};

// =====================================================================================
// SHOT LIST (hard cuts)
// =====================================================================================
interface Shot { at: number; render: (dur: number) => React.ReactNode }
const SHOTS: Shot[] = [
  // S0 — vote resolution
  { at: 0, render: (d) => <VoteOpen dur={d} decideAt={wf(1, "SILENT")} /> },
  { at: st(2), render: (d) => <TakeDevice dur={d} grab={GRAB - st(2)} /> },
  { at: st(3), render: (d) => <FieldReady dur={d} /> },
  // S1 — the last day
  { at: S1, render: (d) => <LastDay dur={d} zeroAt={ZERO - S1} /> },
  { at: st(6), render: (d) => <Sealed dur={d} /> },
  // S2 — patient zero
  { at: S2, render: (d) => <Ward dur={d} w0={0} /> },
  { at: st(9), render: (d) => <Ward dur={d} w0={st(9) - S2} close /> },
  { at: st(10), render: (d) => <Spread dur={d} /> },
  // S3 — global collapse
  { at: S3, render: (d) => <CitySilent dur={d} /> },
  { at: st(12), render: (d) => <MapShot dur={d} /> },
  { at: st(13), render: (d) => <AirportShot dur={d} /> },
  { at: HOSP, render: (d) => <Overflow dur={d} /> },
  { at: st(14), render: (d) => <DarkCity dur={d} /> },
  { at: st(15), render: (d) => <Day7 dur={d} slamAt={DAY7 - st(15)} /> },
  // S4 — the final broadcast
  { at: S4, render: (d) => <BroadcastIn dur={d} /> },
  { at: GOV, render: (d) => <GovScreen dur={d} /> },
  { at: LOST, render: (d) => <NoSignal dur={d} /> },
  // S5 — the signal
  { at: S5, render: (d) => <ConsoleWakes dur={d} litAt={wf(20, "LIGHTS") - S5} /> },
  { at: INC, render: (d) => <IncomingPanel dur={d} /> },
  { at: B7, render: (d) => <B7Screen dur={d} t0={B7} /> },
  // S6 — the choice
  { at: S6, render: (d) => <Contrast dur={d} helpAt={st(25) - S6} /> },
  { at: st(26), render: (d) => <Unused dur={d} /> },
  { at: st(27), render: (d) => <B7Screen dur={d} t0={st(27)} all /> },
  { at: st(28), render: (d) => <Option dur={d} letter="A" /> },
  { at: st(29), render: (d) => <Option dur={d} letter="B" /> },
  { at: st(30), render: (d) => <FinalChoice dur={d} /> },
];

// =====================================================================================
// AUDIO (EP01 conventions: SFX × SFX_GAIN, beds ducked under every line)
// =====================================================================================
const SFX_GAIN = 0.5623;
/** [file, frame, volume, optional max frames] */
const SFX: [string, number, number, number?][] = [
  // S0
  ["card-slam", 5, 0.25], ["card-slam", 10, 0.25], ["sub-hit", wf(1, "SILENT") + 6, 0.35], ["sp-platform", st(2) + 2, 0.35],
  ["footsteps", st(2) + 4, 0.2, GRAB - st(2) - 10], ["sp-buy", PURCH[0].at + 6, 0.3], ["sp-count", PURCH[0].at + 8, 0.3], ["sp-power", GRAB, 0.18],
  ["whoosh", st(3) - 3, 0.25], ["sp-platform", st(3) + 2, 0.25],
  // S1
  ["whoosh", S1 - 3, 0.25], ["sp-type", S1 + 4, 0.15, 30], ["sp-count", S1 + 8, 0.3], ["sp-count", S1 + 38, 0.3], ["sp-count", S1 + 68, 0.3],
  ["sub-hit", ZERO, 0.5], ["card-slam", ZERO, 0.3], ["sp-alarm", ZERO + 2, 0.25], ["sp-glitch", ZERO, 0.25],
  ["sp-doors", st(6) + 2, 0.45], ["light-buzz", st(6), 0.08, LEN[5][0] + LEN[5][1]],
  // S2
  ["whoosh", S2 - 4, 0.3], ["footsteps", S2 + 2, 0.16, 46], ["heartbeat", st(8), 0.4], ["heartbeat", st(9), 0.4],
  ["sp-glitch", SAY + 14, 0.3], ["sub-hit", SAY + 14, 0.4], ["fc-groan-1", SAY + 22, 0.2],
  ["whoosh", st(10) - 4, 0.3], ["fc-groans", st(10), 0.18, LEN[9][0] + 10], ["sp-glitch", st(10) + 20, 0.2], ["murmur", st(10), 0.12, LEN[9][0]],
  // S3 — progressively more chaotic
  ["whoosh", S3 - 4, 0.3], ["sirens", S3, 0.14, st(15) - S3 - 20], ["fc-groans", S3 + 10, 0.15, 60],
  ["whoosh", st(12) - 3, 0.25], ["sp-count", st(12) + 4, 0.25], ["sp-glitch", st(12) + 30, 0.18],
  ["whoosh", st(13) - 3, 0.25], ["ding", st(13) + 2, 0.18], ["sp-glitch", st(13) + 12, 0.2],
  ["whoosh", HOSP - 3, 0.25], ["fc-groans", HOSP, 0.2, 40], ["sp-glitch", HOSP + 8, 0.25],
  ["sp-static", st(14), 0.3], ["sp-ews", st(14) + 4, 0.1, 44], ["sp-glitch", st(14) + 40, 0.3],
  ["sub-hit", DAY7, 0.5], ["card-slam", DAY7, 0.3], ["sp-count", DAY7 + 8, 0.25], ["blast-hum", st(15), 0.08, LEN[14][0]],
  // S4 — the broadcast deteriorates (radio bed below + glitches)
  ["sp-static", S4 + 2, 0.3], ["sp-ews", S4 + 6, 0.12, 50], ["sp-type", GOV, 0.2], ["sp-alarm", end(17) + 2, 0.18], ["sp-type", end(17) + 4, 0.2],
  ["sp-glitch", end(18) - 10, 0.25], ["sp-glitch", end(18) + 30, 0.3], ["sp-glitch", end(18) + 60, 0.35], ["sp-static", end(18) + 70, 0.3],
  ["sp-static", LOST, 0.45], ["sub-hit", LOST, 0.4], ["tinnitus", LOST + 6, 0.1, 100],
  // S5 — the signal
  ["sp-alarm", wf(20, "LIGHTS"), 0.3], ["sp-glitch", wf(20, "LIGHTS"), 0.3], ["sub-hit", INC, 0.45], ["alert-beeps", INC + 2, 0.15], ["sp-glitch", INC + 30, 0.25],
  ["heartbeat", B7, 0.35], ["sp-type", B7 + B7_LINES[0], 0.22, 14], ["sp-type", B7 + B7_LINES[1], 0.22, 24], ["sp-type", B7 + B7_LINES[2], 0.22, 18], ["heartbeat", B7 + 40, 0.35], ["heartbeat", B7 + 75, 0.35],
  ["sp-type", MORE, 0.2, 14], ["sp-glitch", MORE + 14, 0.2],
  // S6 — the choice
  ["whoosh", S6 - 3, 0.25], ["card-slam", S6 + 2, 0.25], ["card-slam", S6 + 8, 0.25], ["heartbeat", st(25), 0.3],
  ["whoosh", st(26) - 3, 0.25], ["sp-platform", st(26) + 4, 0.2], ["whoosh", st(27) - 3, 0.2], ["heartbeat", st(27), 0.35],
  ["whoosh", st(28) - 3, 0.25], ["sp-platform", st(28) + 2, 0.35], ["whoosh", st(29) - 3, 0.25], ["sp-platform", st(29) + 2, 0.35],
  ["card-slam", st(30) + 4, 0.3], ["card-slam", st(30) + 10, 0.3], ["sub-hit", st(30) + 18, 0.35],
  ["sp-glitch", SP2_TOTAL - 44, 0.4], ["sp-sting", SP2_TOTAL - 44, 0.45],
];

/** Bed: tense, swells through the collapse, drops to near silence after the broadcast dies, back for the signal; EP01 ending. */
const bedLevel = (f: number) => {
  const base = interpolate(f, [0, 20, S3, st(14) + 30, LOST - 2, LOST, S5 - 6, S5 + 30, SP2_TOTAL - 50, SP2_TOTAL - 44, SP2_TOTAL], [0, 0.22, 0.22, 0.28, 0.24, 0.04, 0.04, 0.22, 0.24, 0.05, 0], {
    extrapolateRight: "clamp",
  });
  return base * duck(f);
};
/** Government radio carrier: rises as the signal degrades, cut when it dies. */
const radioLevel = (f: number) => interpolate(f, [S4, S4 + 10, end(18), LOST - 1, LOST], [0, 0.04, 0.06, 0.14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * SFX_GAIN * duck(f);

export const SilenceP2: React.FC = () => {
  const frame = useCurrentFrame();
  const after7 = frame >= DAY7;
  const alert = frame >= INC && frame < S6 ? 1 : 0;
  const pulse = interpolate(frame, [DAY7, DAY7 + 10, DAY7 + 30], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {SHOTS.map((s, i) => {
        const e = i === SHOTS.length - 1 ? SP2_TOTAL : SHOTS[i + 1].at;
        return (
          <Sequence key={i} from={s.at} durationInFrames={e - s.at}>
            {s.render(e - s.at)}
          </Sequence>
        );
      })}
      <Vignette strength={0.7} />
      <SurvivalHud state={hudAt(frame)} mode="full" flash={spendFlash(PURCH, frame)} alert={alert} pulse={pulse}
        daysLabel={after7 ? "OUTBREAK" : undefined} daysValue={after7 ? "DAY 7" : undefined} />
      <PurchaseToasts purchases={PURCH} stamp="■ ACQUIRED · PORTABLE" />
      <Captions lines={CAPS} lowFrom={st(30)} />

      {WORDS.map((_, i) => (
        <Sequence key={`v${i}`} from={START[i]}>
          <Audio src={staticFile(`audio/voice/sp2-${String(i + 1).padStart(2, "0")}.wav`)} />
        </Sequence>
      ))}
      <Audio src={staticFile("audio/music/sp-bed.wav")} volume={bedLevel} />
      <Audio src={staticFile("audio/music/drone.wav")} volume={(f) => interpolate(f, [0, 30, SP2_TOTAL - 30, SP2_TOTAL], [0, 0.07, 0.07, 0], { extrapolateRight: "clamp" }) * duck(f)} />
      <Sequence from={S4} durationInFrames={LOST - S4}>
        <Audio src={staticFile("audio/sfx/fc-radio-static.wav")} loop volume={(f) => radioLevel(f + S4)} />
      </Sequence>
      {SFX.map(([name, at, vol, len], i) => (
        <Sequence key={`s${i}`} from={Math.max(0, at)} durationInFrames={len}>
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol * SFX_GAIN} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
