import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Blurred, Cam, Captions, type CapLine, EndingCard, Hud, MostOfYouSaid, Vignette } from "../../kit/Overlays";
import { ELI, lerpPose, type Look, type Pose, RUTH, STAND, Stick, walkTo, YOU } from "../../kit/Stick";
import { C, FONT } from "../../kit/style";
import { Svg } from "../../sets/Sets";
import { Case } from "../../sets/Train";
import { BlastDoor, Corridor, ShelterHall, TF } from "../../sets/Tunnel";
import { CloseUp, SlotEyes, Standoff } from "./LastTrainP2B";
import w01 from "../../../public/captions/lt3b-01.json";
import w02 from "../../../public/captions/lt3b-02.json";
import w03 from "../../../public/captions/lt3b-03.json";
import w04 from "../../../public/captions/lt3b-04.json";
import w05 from "../../../public/captions/lt3b-05.json";
import w06 from "../../../public/captions/lt3b-06.json";
import w07 from "../../../public/captions/lt3b-07.json";
import w08 from "../../../public/captions/lt3b-08.json";
import w09 from "../../../public/captions/lt3b-09.json";
import w10 from "../../../public/captions/lt3b-10.json";
import w11 from "../../../public/captions/lt3b-11.json";
import w12 from "../../../public/captions/lt3b-12.json";
import w13 from "../../../public/captions/lt3b-13.json";
import w14 from "../../../public/captions/lt3b-14.json";
import w15 from "../../../public/captions/lt3b-15.json";
import w16 from "../../../public/captions/lt3b-16.json";
import w17 from "../../../public/captions/lt3b-17.json";
import w18 from "../../../public/captions/lt3b-18.json";
import w19 from "../../../public/captions/lt3b-19.json";

// ---------- timeline (ENDING 4 "The Truth" — rewritten twist, see script.md) ----------
const WORDS: Caption[][] = [w01, w02, w03, w04, w05, w06, w07, w08, w09, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19];
const LEN: [number, number][] = [
  [81, 28], [63, 10], [63, 12], [76, 6], [109, 10], [151, 30], [119, 24], [87, 12], [80, 8], [61, 10],
  [130, 6], [124, 20], [136, 10], [53, 30], [108, 8], [83, 6], [63, 30], [106, 24], [68, 45],
];
const START = LEN.reduce<number[]>((acc, [l, g], i) => [...acc, acc[i] + l + g], [0]);
export const LT3B_TOTAL = START[LEN.length];
const st = (n: number) => START[n - 1];
const wf = (n: number, i: number) => st(n) + Math.round((WORDS[n - 1][i].startMs / 1000) * 30);
const VOICE_VOL: Record<number, number> = { 5: 0.72, 17: 0.8 };

const YELLOW: string[][] = [
  ["TRUTH.", "TELL"], ["TRAIN,", "TEN"], ["GO", "STAYS"], ["RELIEVED."], ["EXACTLY", "CASE", "KIDS."],
  ["SHOVES", "SITTING"], ["FLASH.", "SHAKES."], ["PILLS.", "FORTY"], ["HUSBAND'S", "CASE."], ["TRUTH."],
  ["HOUR", "STRANGER", "BURNING"], ["CARD.", "SAVE", "MORE"], ["CAMERA,", "PHONE,", "ONE", "MORE"], ["DIES."], ["TWENTY-FOUR", "EMPTY."],
  ["HOODIE,", "NOTE."], ["SAFE.", "FIND"], ["TRUTH", "NEVER"], ["WHERE", "SEASON", "TWO."],
];
const CAPS: CapLine[] = WORDS.map((words, i) => ({ start: START[i], end: START[i + 1], words, yellow: YELLOW[i] }));

// ---------- story clock ----------
const FLASH = st(7) + 12;
const DAY2 = st(15);
const countdownAt = (f: number): { label: string; cd: number | null } => {
  if (f < st(2)) return { label: "IMPACT IN", cd: null };
  if (f < FLASH) return { label: "IMPACT IN", cd: interpolate(f, [st(2), FLASH], [105, 0]) };
  if (f < DAY2) return { label: "DOOR OPENS IN", cd: 86400 - interpolate(f, [FLASH, DAY2], [0, 2600]) };
  return { label: "", cd: null };
};
const clockAt = (f: number) => {
  if (f >= DAY2) return "3:04 AM";
  const c = countdownAt(f).cd;
  const secs = f < FLASH ? (3 * 60 + 3) * 60 - (c ?? 105) : (3 * 60 + 3) * 60 + interpolate(f, [FLASH, DAY2], [0, 2600]);
  const m = Math.floor(secs / 60);
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")} AM`;
};

const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
const lerp2 = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const SIT_FLOOR: Pose = { ...STAND, legF: [Math.PI / 2, 0.15], legB: [Math.PI / 2 - 0.15, 0.25], lean: -0.12, armF: [0.5, 0.6], armB: [0.3, 0.5] };
const KNEEL: Pose = { ...STAND, legF: [1.4, 2.4], legB: [0.2, 1.9], lean: 0.2 };
const KIDS: Look[] = [{ body: "#b8862f" }, { body: "#5f7f9a" }, { body: "#9a5f6f" }];
const VALE: Look = { body: "#6a6f78", glasses: true };
const Packet: React.FC = () => <rect x={-16} y={-12} width={32} height={24} rx={4} fill="#f6f4ee" stroke={C.ink} strokeWidth={3} />;

/** Folded grey hoodie on the floor. */
const Hoodie: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-90,0 L-80,-46 Q0,-62 80,-46 L90,0Z" fill="#4a4a4f" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-40,-50 Q0,-92 40,-50" fill="#3a3a3f" stroke={C.ink} strokeWidth={5} />
    <line x1={-70} y1={-20} x2={70} y2={-20} stroke="#3a3a3f" strokeWidth={4} />
  </g>
);

// ---------- shots ----------
const Handover: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const give = ramp(frame, 40, 56);
  const take = ramp(frame, 50, 62);
  const back = ramp(frame, 70, 86);
  const meet: [number, number] = [650, 1420];
  const eliHand = lerp2(lerp2([560, 1430], meet, give), [560, 1430], back);
  const youHand = lerp2(lerp2([750, 1430], meet, take), [745, 1430], back);
  const passed = frame >= 60;
  return (
    <Cam dur={dur} from={1.4} to={1.48} origin="58% 62%">
      <Svg>
        <BlastDoor eyes={0.4} />
        <Stick x={520} floor={TF.floor} look={ELI} pose={{ ...STAND, lean: 0.05 }} reach={{ handF: eliHand }} lookAt={0.8} holdF={passed ? undefined : <Case />} />
        <Stick x={790} floor={TF.floor} facing={-1} look={YOU} pose={STAND} reach={{ handF: youHand }} lookAt={0.7} holdF={passed ? <Case /> : undefined} />
      </Svg>
    </Cam>
  );
};

const ShovedIn: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const open = ramp(frame, 0, 20) * 0.3 * (1 - ramp(frame, 52, 72));
  const goIn = ramp(frame, 14, 44);
  const push = ramp(frame, 10, 24) * (1 - ramp(frame, 40, 56));
  const sit = ramp(frame, 96, 126);
  const eliPose = lerpPose({ ...STAND, armF: [1.3 * push, 0.1], lean: 0.12 * push }, SIT_FLOOR, sit);
  return (
    <Cam dur={dur} from={1.04} to={1.12} origin="50% 62%">
      <Svg>
        <BlastDoor open={open} slotLight={1} />
        <g opacity={1 - goIn}>
          <Stick x={760 - 260 * goIn} floor={TF.floor} facing={-1} look={YOU} pose={{ ...STAND, lean: 0.1 * goIn }} lookAt={0.6} holdF={<Case />} />
        </g>
        <Stick x={420} floor={TF.floor} look={ELI} pose={eliPose} lookAt={0.3 + 0.4 * sit} />
      </Svg>
    </Cam>
  );
};

const InsideFlash: React.FC<{ dur: number; flashAt: number }> = ({ dur, flashAt }) => {
  const frame = useCurrentFrame();
  const after = frame >= flashAt;
  const dim = after ? interpolate(frame - flashAt, [0, 4, 30], [0.2, 0.75, 0.45], { extrapolateRight: "clamp" }) : 0;
  const duck = after ? ramp(frame, flashAt, flashAt + 8) * (1 - ramp(frame, flashAt + 50, flashAt + 70)) : 0;
  return (
    <Cam dur={dur} from={1.05} to={1.12} origin="50% 65%" shake={after && frame - flashAt < 45 ? 22 : 0}>
      <Svg>
        <ShelterHall />
        <Stick x={560} floor={TF.floor} facing={-1} look={YOU} pose={lerpPose(STAND, { ...KNEEL, lean: 0.5 }, duck)} lookAt={0.2} holdF={<Case />} />
        <rect width={1080} height={1920} fill="#0b0806" opacity={dim} />
        {after
          ? Array.from({ length: 36 }).map((_, i) => (
              <circle key={i} cx={random(`sx${i}`) * 1080} cy={((frame - flashAt) * (5 + random(`sv${i}`) * 7) + random(`sy${i}`) * 300) % 1900} r={2 + random(`sr${i}`) * 4} fill="#cfc6ad" opacity={0.7} />
            ))
          : null}
      </Svg>
    </Cam>
  );
};

const PillsToKids: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const kid = Math.min(2, Math.floor(frame / 30));
  const phase = (frame % 30) / 30;
  const reachT = Math.sin(Math.PI * Math.min(1, phase * 1.4));
  const targets: [number, number][] = [[360, 1420], [480, 1420], [600, 1420]];
  const hand = lerp2([720, 1470], targets[kid], reachT);
  return (
    <Cam dur={dur} from={1.25} to={1.32} origin="50% 72%">
      <Svg>
        <ShelterHall />
        {KIDS.map((k, i) => (
          <Stick key={i} x={300 + i * 120} floor={TF.floor} scale={0.62} look={k} pose={i < kid || (i === kid && phase > 0.6) ? { ...STAND, armF: [1.2, 0.6] } : STAND} lookAt={0.8} holdF={i < kid || (i === kid && phase > 0.6) ? <Packet /> : undefined} />
        ))}
        <Stick x={800} floor={TF.floor} facing={-1} look={YOU} pose={KNEEL} reach={{ handF: hand }} lookAt={0.6} holdF={<Packet />} />
        <g transform="translate(930,1560)"><Case /></g>
      </Svg>
    </Cam>
  );
};

const RuthTalks: React.FC<{ dur: number; close?: boolean }> = ({ dur, close }) => {
  const frame = useCurrentFrame();
  const approach = walkTo(200, 1, interpolate(frame, [0, 30], [0, close ? 0 : 230], { extrapolateRight: "clamp", easing: Easing.out(Easing.sin) }), 230, { amp: 0.85 });
  const x = close ? 430 : approach.x;
  return (
    <Cam dur={dur} from={close ? 1.55 : 1.2} to={close ? 1.62 : 1.26} origin={close ? "40% 58%" : "50% 62%"}>
      <Svg>
        <ShelterHall />
        <Stick x={x} floor={TF.floor} look={RUTH} pose={close ? { ...STAND, headTilt: 0.06 * Math.sin(frame / 16) } : approach.pose} lookAt={0.8} />
        <Stick x={720} floor={TF.floor} facing={-1} look={YOU} pose={STAND} lookAt={0.6} holdF={<Case />} />
      </Svg>
    </Cam>
  );
};

/** Sepia flashback: Eli drags Dr. Vale away from a burning car. */
const CarFlashback: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const drag = interpolate(frame, [0, dur], [0, 120]);
  // Vale lies on the road, head toward Eli, arms raised; Eli grips his wrists and hauls him from the fire.
  const feetX = 830 - drag;
  const grip: [number, number] = [feetX - 386, 1352];
  const flick = (i: number) => 1 + 0.12 * Math.sin(frame / 2 + i);
  return (
    <>
      <AbsoluteFill style={{ filter: "sepia(0.6) contrast(1.1)" }}>
        <Cam dur={dur} from={1.0} to={1.08}>
          <Svg bg="#1a1512">
            <rect width={1080} height={1920} fill="#1a1512" />
            <rect y={1500} width={1080} height={420} fill="#2c2824" />
            <line x1={0} y1={1640} x2={1080} y2={1640} stroke="#5a5448" strokeWidth={8} strokeDasharray="60 40" />
            <g transform="translate(700,1480) rotate(-12)">
              <rect x={-200} y={-120} width={400} height={130} rx={30} fill="#4b4f57" stroke={C.ink} strokeWidth={6} />
              <rect x={-120} y={-200} width={220} height={90} rx={20} fill="#4b4f57" stroke={C.ink} strokeWidth={6} />
              <circle cx={-120} cy={20} r={40} fill="#111" />
              <circle cx={130} cy={20} r={40} fill="#111" />
            </g>
            {[0, 1, 2, 3].map((i) => (
              <path key={i} transform={`translate(${640 + i * 50},1330) scale(${flick(i)})`} d="M0,0 C-40,-60 -10,-120 20,-190 C40,-110 70,-70 40,0Z" fill={i % 2 ? "#f2a33a" : "#e8622c"} opacity={0.9} />
            ))}
            <circle cx={720} cy={1260} r={420} fill="url(#warmPool)" opacity={0.8} />
            <g transform={`rotate(-80 ${feetX} ${TF.floor - 18})`}>
              <Stick x={feetX} floor={TF.floor - 18} look={VALE} pose={{ ...STAND, armF: [1.57, 0], armB: [1.5, 0] }} eyesClosed />
            </g>
            <Stick x={grip[0] - 175} floor={TF.floor} facing={1} look={ELI} pose={{ ...STAND, lean: -0.22, legF: [0.4, 0.35], legB: [-0.3, 0.1] }} reach={{ handF: grip, handB: [grip[0] - 6, grip[1] + 10] }} lookAt={0.8} />
          </Svg>
        </Cam>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0) 45%, rgba(255,240,220,0.45) 100%)" }} />
    </>
  );
};

/** Shelter security monitor showing the corridor camera (grayscale + scanlines). */
const DoorCamera: React.FC<{ dur: number; dead?: boolean }> = ({ dur, dead }) => {
  const frame = useCurrentFrame();
  const stand = ramp(frame, 8, 26);
  const dist = interpolate(frame, [26, 80], [0, 470], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const w = walkTo(200, 1, dist, 470, { amp: 0.95 });
  const lift = ramp(frame, 84, 96);
  const ear: [number, number] = [w.x + 20, 1150];
  const hand = lerp2([w.x + 30, 1430], lerp2([760, 1012], ear, lift), ramp(frame, 78, 86));
  const pose = frame < 26 ? lerpPose(SIT_FLOOR, STAND, stand) : w.pose;
  return (
    <>
      <Blurred px={18} dim={0.35}>
        <Svg>
          <ShelterHall />
        </Svg>
      </Blurred>
      <Cam dur={dur} from={1} to={1.05}>
        <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <rect x={150} y={420} width={780} height={1060} rx={40} fill="#26282a" stroke={C.ink} strokeWidth={10} />
          <rect x={190} y={460} width={700} height={920} fill="#0d0f10" />
          <text x={540} y={1440} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={26} fill="#8d9297">SHELTER 9 · SECURITY</text>
        </svg>
        <div style={{ position: "absolute", left: 190, top: 460, width: 700, height: 920, overflow: "hidden" }}>
          {dead ? (
            <svg viewBox="0 0 700 920" width="100%" height="100%">
              {Array.from({ length: 900 }).map((_, i) => (
                <rect key={i} x={random(`nx${i}-${frame}`) * 700} y={random(`ny${i}-${frame}`) * 920} width={8} height={4} fill={random(`nc${i}-${frame}`) > 0.5 ? "#d9d9d9" : "#555"} />
              ))}
              <rect x={190} y={420} width={320} height={80} fill="#000" />
              <text x={350} y={475} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={40} fill="white">NO SIGNAL</text>
            </svg>
          ) : (
            <div style={{ width: 1080, height: 1920, transform: "translate(-80px,-700px) scale(0.92)", transformOrigin: "top left", filter: "grayscale(1) contrast(1.25) brightness(0.85)" }}>
              <svg viewBox="0 0 1080 1920" width="1080" height="1920">
                <Corridor phoneX={760} handset={lift < 0.5} />
                <Stick x={frame < 26 ? 200 : w.x} floor={TF.floor} look={ELI} pose={pose} reach={frame >= 78 ? { handF: hand } : {}} lookAt={0.5} holdF={lift >= 0.5 ? <rect x={-20} y={-55} width={40} height={110} rx={16} fill="#2a2a2a" /> : undefined} />
              </svg>
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 2px, rgba(0,0,0,0) 2px 5px)" }} />
          <div style={{ position: "absolute", left: 20, top: 16, fontFamily: FONT.mono, fontWeight: 800, fontSize: 24, color: "#e6e6e6" }}>
            ● REC  CAM 2 · CD-7  03:{String(9 + Math.floor(frame / 30)).padStart(2, "0")}
          </div>
        </div>
      </Cam>
    </>
  );
};

const EmptyCorridor: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const black = 1 - ramp(frame, 0, 14);
  const open = ramp(frame, 18, 60);
  const step = walkTo(600, 1, interpolate(frame, [60, 100], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.sin) }), 200, { amp: 0.85 });
  return (
    <>
      <Cam dur={dur} from={1.04} to={1.12} origin="45% 66%">
        <Svg>
          <BlastDoor open={open} slotLight={0.3} />
          <Hoodie x={300} y={TF.floor} />
          {Array.from({ length: 6 }).map((_, i) => <ellipse key={i} cx={250 - i * 55} cy={TF.floor + 20 + (i % 2) * 18} rx={16} ry={7} fill="#2a2b28" />)}
          {open > 0.6 ? <Stick x={step.x} floor={TF.floor} facing={-1} look={YOU} pose={step.pose} lookAt={0.5} /> : null}
        </Svg>
      </Cam>
      <AbsoluteFill style={{ background: "black", opacity: black }} />
    </>
  );
};

const NoteOnHoodie: React.FC<{ dur: number; textAt: number }> = ({ dur, textAt }) => {
  const frame = useCurrentFrame();
  const ink = ramp(frame, textAt, textAt + 24);
  return (
    <Cam dur={dur} from={1} to={1.07}>
      <Svg bg="#2a2b28">
        <rect width={1080} height={1920} fill="#33342f" />
        <Hoodie x={540} y={1650} s={4} />
        <g transform="translate(540,930) rotate(-5)">
          <rect x={-360} y={-230} width={720} height={460} fill="#efe6cf" stroke={C.ink} strokeWidth={8} />
          <g opacity={ink}>
            <text x={-300} y={-80} fontFamily={FONT.hand} fontSize={78} fill="#2b2f6b">Your sister's</text>
            <text x={-300} y={30} fontFamily={FONT.hand} fontSize={78} fill="#2b2f6b">safe. Go find her.</text>
            <text x={300} y={170} textAnchor="end" fontFamily={FONT.hand} fontSize={60} fill="#2b2f6b">— E.</text>
          </g>
        </g>
      </Svg>
    </Cam>
  );
};

const FinalTruth: React.FC<{ dur: number; cardAt: number }> = ({ dur, cardAt }) => (
  <>
    <Cam dur={dur} from={1.0} to={1.08} origin="45% 62%">
      <Svg>
        <BlastDoor open={1} slotLight={0.3} />
        {Array.from({ length: 7 }).map((_, i) => <ellipse key={i} cx={260 - i * 55} cy={TF.floor + 20 + (i % 2) * 18} rx={16} ry={7} fill="#2a2b28" />)}
        <Stick x={560} floor={TF.floor} facing={-1} look={YOU} pose={{ ...STAND, armF: [0.9, 1.3] }} lookAt={0.9} holdF={<rect x={-30} y={-46} width={60} height={42} fill="#efe6cf" stroke={C.ink} strokeWidth={3} />} />
      </Svg>
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.2)" }} />
    </Cam>
    <EndingCard n={4} name="THE TRUTH" at={cardAt} />
  </>
);

const SeasonCta: React.FC = () => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [14, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1250, height: 120, background: "#121212", border: `5px solid ${C.capYellow}`, borderRadius: 14, boxShadow: `0 0 30px ${C.capYellow}88`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s})`, fontFamily: FONT.title, fontSize: 64, color: "white" }}>
        FOLLOW FOR <span style={{ color: C.capYellow, marginLeft: 18 }}>SEASON 2</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- shot list ----------
interface Shot {
  at: number;
  place: string;
  render: (dur: number) => React.ReactNode;
}
const SHOTS: Shot[] = [
  { at: 0, place: "SHELTER 9 · DOOR", render: (d) => (<><Blurred px={10} dim={0.5}><Standoff dur={d} /></Blurred><MostOfYouSaid title={["YOU ASKED FOR", "IT"]} a="LIE FOR HIM" b="TELL THE TRUTH" winner="B" decideAt={wf(1, 4)} /></>) },
  { at: st(2), place: "SHELTER 9 · DOOR", render: (d) => <CloseUp dur={d} who="you" band /> },
  { at: st(3), place: "SHELTER 9 · DOOR", render: (d) => <SlotEyes dur={d} /> },
  { at: st(4), place: "SHELTER 9 · DOOR", render: (d) => <CloseUp dur={d} who="eli" /> },
  { at: st(5), place: "SHELTER 9 · DOOR", render: (d) => <Handover dur={d} /> },
  { at: st(6), place: "SHELTER 9 · DOOR", render: (d) => <ShovedIn dur={d} /> },
  { at: st(7), place: "SHELTER 9", render: (d) => <InsideFlash dur={d} flashAt={FLASH - st(7)} /> },
  { at: st(8), place: "SHELTER 9", render: (d) => <PillsToKids dur={d} /> },
  { at: st(9), place: "SHELTER 9", render: (d) => <RuthTalks dur={d} /> },
  { at: st(11), place: "SHELTER 9", render: (d) => <RuthTalks dur={d} close /> },
  { at: wf(11, 7), place: "SHELTER 9", render: (d) => <CarFlashback dur={d} /> },
  { at: st(12), place: "SHELTER 9", render: (d) => <RuthTalks dur={d} close /> },
  { at: st(13), place: "SHELTER 9", render: (d) => <DoorCamera dur={d} /> },
  { at: st(14), place: "SHELTER 9", render: (d) => <DoorCamera dur={d} dead /> },
  { at: st(15), place: "CORRIDOR CD-7", render: (d) => <EmptyCorridor dur={d} /> },
  { at: st(16), place: "CORRIDOR CD-7", render: (d) => <NoteOnHoodie dur={d} textAt={st(17) - st(16) - 6} /> },
  { at: st(18), place: "CORRIDOR CD-7", render: (d) => <FinalTruth dur={d} cardAt={wf(18, 6) - st(18)} /> },
];

/** [file, frame, volume, optional max length] */
const SFX: [string, number, number, number?][] = [
  ["whoosh", wf(1, 4), 0.45], ["sparkle", wf(1, 4) + 6, 0.35], ["card-slam", wf(1, 4) + 6, 0.4],
  ["heartbeat", st(2), 0.4], ["blast-hum", st(3), 0.35], ["heartbeat", st(5) + 30, 0.35],
  ["hydraulic", st(6), 0.5, 40], ["seal-boom", st(6) + 52, 0.75], ["tick", st(6) + 90, 0.45], ["tick", st(6) + 120, 0.45], ["tick", st(6) + 150, 0.5],
  ["detonation", FLASH, 0.55], ["debris", FLASH + 15, 0.55], ["murmur", FLASH + 8, 0.45], ["murmur", st(8), 0.18],
  ["sub-hit", wf(11, 7), 0.45], ["light-buzz", st(13), 0.18], ["receiver", st(13) + 84, 0.45, 30], ["tv-on", st(14), 0.6],
  ["hydraulic", st(15) + 16, 0.55], ["whoosh", st(16), 0.2], ["heartbeat", st(17), 0.35],
  ["ending-swell", st(18) - 10, 0.55], ["card-slam", wf(18, 6), 0.5], ["card-slam", st(19) + 14, 0.4],
];

export const LastTrainP3B: React.FC = () => {
  const frame = useCurrentFrame();
  const shotIdx = SHOTS.findIndex((s, i) => frame >= s.at && (i === SHOTS.length - 1 || frame < SHOTS[i + 1].at));
  const cd = countdownAt(frame);
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {SHOTS.map((s, i) => {
        const end = i === SHOTS.length - 1 ? LT3B_TOTAL : SHOTS[i + 1].at;
        return (
          <Sequence key={i} from={s.at} durationInFrames={end - s.at}>
            {s.render(end - s.at)}
          </Sequence>
        );
      })}
      <Sequence from={st(19)}>
        <SeasonCta />
      </Sequence>
      <Vignette />
      <Hud time={clockAt(frame)} place={SHOTS[Math.max(0, shotIdx)].place} label={cd.label} countdown={cd.cd} day={frame >= DAY2 ? 2 : 1} />
      <Captions lines={CAPS} />

      {WORDS.map((_, i) => (
        <Sequence key={`v${i}`} from={START[i]}>
          <Audio src={staticFile(`audio/voice/lt3b-${String(i + 1).padStart(2, "0")}.wav`)} volume={VOICE_VOL[i + 1] ?? 1} />
        </Sequence>
      ))}
      <Audio
        src={staticFile("audio/music/drone.wav")}
        volume={(f) => interpolate(f, [0, 20, FLASH - 2, FLASH, FLASH + 40, FLASH + 100, st(18), st(18) + 40, LT3B_TOTAL - 30, LT3B_TOTAL], [0, 0.3, 0.3, 0.05, 0.05, 0.22, 0.22, 0.12, 0.12, 0], { extrapolateRight: "clamp" })}
      />
      {SFX.map(([name, at, vol, len], i) => (
        <Sequence key={`s${i}`} from={at} durationInFrames={len}>
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
