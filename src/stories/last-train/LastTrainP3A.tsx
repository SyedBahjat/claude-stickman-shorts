import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Easing, Freeze, interpolate, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Blurred, Cam, Captions, type CapLine, EndingCard, Hud, MostOfYouSaid, Vignette } from "../../kit/Overlays";
import { Phone } from "../../kit/Props";
import { ELI, lerpPose, type Pose, RUTH, SOLDIER, STAND, Stick, YOU } from "../../kit/Stick";
import { C, FONT } from "../../kit/style";
import { Svg } from "../../sets/Sets";
import { Case } from "../../sets/Train";
import { BlastDoor, ShelterHall, TF } from "../../sets/Tunnel";
import { CloseUp, SlotEyes, Standoff, WallPhone } from "./LastTrainP2B";
import w01 from "../../../public/captions/lt3a-01.json";
import w02 from "../../../public/captions/lt3a-02.json";
import w03 from "../../../public/captions/lt3a-03.json";
import w04 from "../../../public/captions/lt3a-04.json";
import w05 from "../../../public/captions/lt3a-05.json";
import w06 from "../../../public/captions/lt3a-06.json";
import w07 from "../../../public/captions/lt3a-07.json";
import w08 from "../../../public/captions/lt3a-08.json";
import w09 from "../../../public/captions/lt3a-09.json";
import w10 from "../../../public/captions/lt3a-10.json";
import w11 from "../../../public/captions/lt3a-11.json";
import w12 from "../../../public/captions/lt3a-12.json";
import w13 from "../../../public/captions/lt3a-13.json";
import w14 from "../../../public/captions/lt3a-14.json";
import w15 from "../../../public/captions/lt3a-15.json";
import w16 from "../../../public/captions/lt3a-16.json";
import w17 from "../../../public/captions/lt3a-17.json";
import w18 from "../../../public/captions/lt3a-18.json";
import w19 from "../../../public/captions/lt3a-19.json";

// ---------- timeline (script.md PART 3BA — ENDING 3 "The Lie", plus the wall-phone payoff) ----------
const WORDS: Caption[][] = [w01, w02, w03, w04, w05, w06, w07, w08, w09, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19];
/** [voice frames, air after]. Line 8 is followed by the flash and real silence. */
const LEN: [number, number][] = [
  [62, 28], [90, 16], [93, 12], [72, 4], [69, 24], [50, 10], [125, 10], [73, 78], [93, 20], [85, 6],
  [64, 20], [111, 24], [83, 8], [88, 20], [69, 6], [129, 20], [80, 24], [122, 30], [153, 40],
];
const START = LEN.reduce<number[]>((acc, [l, g], i) => [...acc, acc[i] + l + g], [0]);
export const LT3A_TOTAL = START[LEN.length];
const st = (n: number) => START[n - 1];
const wf = (n: number, i: number) => st(n) + Math.round((WORDS[n - 1][i].startMs / 1000) * 30);
const VOICE_VOL: Record<number, number> = { 6: 1.1, 16: 1 };

const YELLOW: string[][] = [
  ["LIE", "HIM."], ["EYE", "FAMILY."], ["HUNDREDS", "CLEAN"], ["WOMAN", "STANDS"], ["WIFE.", "NO", "BROTHER."],
  ["OUT.", "BOTH"], ["THROWS", "CASE", "THEM."], ["FIVE", "OVER"], ["ALIVE.", "DOESN'T", "ANSWER."], ["NOTE"],
  ["CARD.", "SAVE", "ANYONE"], ["NEVER", "STRANGER", "CHANCE."], ["TWENTY-FOUR", "AGAIN."], ["FORTY", "CHILDREN"], ["ONE", "BAR"],
  ["CALLED", "UNDERGROUND.", "NAME."], ["ONE", "CALL.", "SISTER."], ["LIE", "FORTY", "SISTER."], ["TRUTH?", "TRUTH,", "FOLLOW"],
];
const CAPS: CapLine[] = WORDS.map((words, i) => ({ start: START[i], end: START[i + 1], words, yellow: YELLOW[i] }));

// ---------- story clock ----------
const FLASH = st(8) + 73 + 10;
const DAY2 = st(13);
const countdownAt = (f: number): { label: string; cd: number | null } => {
  if (f < st(2)) return { label: "IMPACT IN", cd: null };
  if (f < FLASH) return { label: "IMPACT IN", cd: f < st(8) ? interpolate(f, [st(2), st(8)], [105, 5]) : interpolate(f, [st(8), FLASH], [5, 0]) };
  if (f < DAY2) return { label: "DOOR OPENS IN", cd: 86400 - interpolate(f, [FLASH, DAY2], [0, 2400]) };
  return { label: "", cd: null };
};
const clockAt = (f: number) => {
  if (f >= DAY2) return "3:04 AM";
  const c = countdownAt(f).cd;
  const secs = f < FLASH ? (3 * 60 + 3) * 60 - (c ?? 105) : (3 * 60 + 3) * 60 + interpolate(f, [FLASH, DAY2], [0, 2400]);
  const m = Math.floor(secs / 60);
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")} AM`;
};

const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
const CROUCH: Pose = { ...STAND, legF: [1.2, 2.2], legB: [0.8, 2.0], lean: 0.55, armF: [2.6, 1.6], armB: [2.5, 1.7] };
const COVER: Pose = { ...STAND, legF: [1.0, 1.9], legB: [0.5, 1.6], lean: 1.05, armF: [1.3, 0.3], armB: [1.1, 0.4] };
const Rifle: React.FC = () => <rect x={-20} y={-14} width={230} height={22} rx={4} fill="#1d1d1d" stroke={C.ink} strokeWidth={4} />;
/** Lying figure: a standing Stick rotated 90° about its feet, head to the right. */
const Lying: React.FC<{ x: number; y: number; look: typeof ELI }> = ({ x, y, look }) => (
  <g transform={`rotate(90 ${x} ${y})`}>
    <Stick x={x} floor={y} look={look} pose={{ ...STAND, armF: [0.3, 0.4], armB: [-0.2, 0.2] }} eyesClosed />
  </g>
);

// ---------- shots ----------
const DoorOpens: React.FC<{ dur: number; openAt: number }> = ({ dur, openAt }) => {
  const frame = useCurrentFrame();
  const open = ramp(frame, openAt, openAt + 40);
  return (
    <Cam dur={dur} from={1.0} to={1.12} origin="50% 58%">
      <Svg>
        <BlastDoor open={open} eyes={0} rifle={1 - open} />
        <Stick x={300} floor={TF.floor} look={ELI} pose={{ ...STAND, armF: [0.12, 0.1] }} lookAt={0.7} holdF={<Case />} />
        <Stick x={790} floor={TF.floor} facing={-1} look={YOU} pose={STAND} lookAt={0.5} />
      </Svg>
    </Cam>
  );
};

const RuthStands: React.FC<{ dur: number; riseAt: number }> = ({ dur, riseAt }) => {
  const frame = useCurrentFrame();
  const rise = ramp(frame, riseAt, riseAt + 14);
  const sit: Pose = { ...STAND, legF: [1.5, 1.5], legB: [1.45, 1.5], lean: -0.03 };
  return (
    <Cam dur={dur} from={1.0} to={1.3} origin="50% 70%">
      <Svg>
        <ShelterHall />
        <Stick x={540} floor={TF.floor - 40} facing={1} look={RUTH} pose={lerpPose(sit, STAND, rise)} lookAt={0} />
        <rect x={360} y={1440} width={360} height={220} fill="#6b5340" stroke={C.ink} strokeWidth={4.5} />
        <rect x={380} y={1420} width={320} height={26} fill="#7d6450" stroke={C.ink} strokeWidth={3} />
      </Svg>
    </Cam>
  );
};

const SoldierOut: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const step = ramp(frame, 0, 16);
  const back = ramp(frame, 8, 28);
  return (
    <Cam dur={dur} from={1.05} to={1.12} origin="50% 60%">
      <Svg>
        <BlastDoor open={1} />
        <Stick x={920 - 40 * step} floor={TF.floor} facing={-1} look={SOLDIER} pose={{ ...STAND, armF: [1.3, 0.05], armB: [1.1, 0.5] }} lookAt={0.6} holdF={<g transform="rotate(180)"><Rifle /></g>} />
        <Stick x={430 - 40 * back} floor={TF.floor} look={ELI} pose={{ ...STAND, armF: [0.12, 0.1], lean: -0.08 * back }} lookAt={0.7} holdF={<Case />} />
        <Stick x={250 - 40 * back} floor={TF.floor} look={YOU} pose={{ ...STAND, lean: -0.08 * back }} lookAt={0.7} />
      </Svg>
    </Cam>
  );
};

const CaseThrow: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const close = ramp(frame, 22, 70);
  const throwT = ramp(frame, 8, 26);
  const flying = frame >= 12 && frame < 30;
  const p = Math.min(1, Math.max(0, (frame - 12) / 16));
  const cx = 520 + 300 * p;
  const cy = 1420 - 380 * Math.sin(Math.PI * p * 0.85) + 120 * p;
  const lower = ramp(frame, 34, 52);
  const arm: Pose = { ...STAND, armF: [0.2 + 2.0 * throwT * (1 - lower), 0.2], lean: 0.1 * throwT * (1 - lower) };
  return (
    <Cam dur={dur} from={1.04} to={1.1} origin="50% 60%">
      <Svg>
        <BlastDoor open={1 - close} />
        <Stick x={430} floor={TF.floor} look={ELI} pose={arm} lookAt={0.8} holdF={frame < 12 ? <Case /> : undefined} />
        <Stick x={230} floor={TF.floor} look={YOU} pose={STAND} lookAt={0.8} />
        {flying ? <g transform={`translate(${cx},${cy}) rotate(${p * 200})`}><Case /></g> : null}
      </Svg>
    </Cam>
  );
};

const TakeCover: React.FC<{ dur: number; flashAt: number }> = ({ dur, flashAt }) => {
  const frame = useCurrentFrame();
  const down = ramp(frame, 18, 34);
  const after = frame >= flashAt;
  const white = after ? interpolate(frame - flashAt, [0, 3, 18], [1, 1, 0], { extrapolateRight: "clamp" }) : 0;
  return (
    <>
      <Cam dur={dur} from={1.2} to={1.32} origin="45% 72%" shake={after && frame - flashAt < 40 ? 30 : 0}>
        <Svg>
          <BlastDoor slotLight={after ? 0 : 1} />
          <Stick x={560} floor={TF.floor} look={YOU} pose={lerpPose(STAND, CROUCH, down)} lookAt={0.3} />
          <Stick x={430 + 30 * down} floor={TF.floor} look={ELI} pose={lerpPose(STAND, COVER, down)} lookAt={0.8} />
          {after ? <rect width={1080} height={1920} fill="#1a0303" opacity={0.6} /> : null}
          {after ? <circle cx={540} cy={520} r={500} fill="url(#redPool)" opacity={0.5 + 0.2 * Math.sin(frame / 3)} /> : null}
          {after
            ? Array.from({ length: 40 }).map((_, i) => (
                <circle key={i} cx={random(`dx${i}`) * 1080} cy={((frame - flashAt) * (6 + random(`dv${i}`) * 8) + random(`dy${i}`) * 1900) % 1900} r={2 + random(`dr${i}`) * 4} fill="#b9b2a0" opacity={0.7} />
              ))
            : null}
        </Svg>
      </Cam>
      {white > 0 ? <AbsoluteFill style={{ background: "white", opacity: white }} /> : null}
    </>
  );
};

const Aftermath: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const sit = ramp(frame, 0, 26);
  const reach = ramp(frame, 40, 60);
  const kneel: Pose = { ...STAND, legF: [1.4, 2.4], legB: [0.2, 1.9], lean: 0.25 + 0.25 * reach, armB: [0.3, 0.3] };
  return (
    <Cam dur={dur} from={1.15} to={1.24} origin="55% 78%">
      <Svg>
        <BlastDoor slotLight={0} />
        <rect width={1080} height={1920} fill="#1a0303" opacity={0.6} />
        <circle cx={540} cy={520} r={520} fill="url(#redPool)" opacity={0.55} />
        <Lying x={110} y={TF.floor - 22} look={ELI} />
        <Stick x={960} floor={TF.floor} facing={-1} look={YOU} pose={lerpPose(CROUCH, kneel, sit)} lookAt={0.6} reach={reach > 0 ? { handF: [960 - (960 - 640) * reach, 1500 + 110 * reach] } : {}} />
        {Array.from({ length: 30 }).map((_, i) => (
          <circle key={i} cx={random(`ax${i}`) * 1080} cy={(frame * (2 + random(`av${i}`) * 3) + random(`ay${i}`) * 1900) % 1900} r={2 + random(`ar${i}`) * 3} fill="#b9b2a0" opacity={0.5} />
        ))}
      </Svg>
    </Cam>
  );
};

const NoteShot: React.FC<{ dur: number; textAt: number }> = ({ dur, textAt }) => {
  const frame = useCurrentFrame();
  const unfold = ramp(frame, 6, 22);
  const ink = ramp(frame, textAt, textAt + 26);
  return (
    <Cam dur={dur} from={1} to={1.06}>
      <Svg bg="#120606">
        <circle cx={540} cy={900} r={700} fill="url(#redPool)" opacity={0.45} />
        <g transform={`translate(540,980) rotate(${-6 + 4 * unfold}) scale(${0.6 + 0.4 * unfold},${0.2 + 0.8 * unfold})`}>
          <rect x={-380} y={-260} width={760} height={520} fill="#efe6cf" stroke={C.ink} strokeWidth={8} />
          <line x1={-380} y1={0} x2={380} y2={0} stroke="#cbbf9f" strokeWidth={4} />
          <g opacity={ink}>
            <text x={-320} y={-120} fontFamily={FONT.hand} fontSize={74} fill="#2b2f6b">Take my card.</text>
            <text x={-320} y={0} fontFamily={FONT.hand} fontSize={74} fill="#2b2f6b">Save anyone</text>
            <text x={-320} y={110} fontFamily={FONT.hand} fontSize={74} fill="#2b2f6b">you can.</text>
            <text x={330} y={210} textAnchor="end" fontFamily={FONT.hand} fontSize={52} fill="#2b2f6b">— A. Vale</text>
          </g>
        </g>
        <g transform="translate(150,1700) rotate(-38)">
          <rect x={-60} y={-60} width={120} height={620} rx={60} fill={C.skin} stroke={C.ink} strokeWidth={10} />
          <rect x={-55} y={260} width={110} height={300} fill="#4a4a4f" />
        </g>
        <rect width={1080} height={1920} fill="#1a0303" opacity={0.25} />
      </Svg>
    </Cam>
  );
};

const YouGrieves: React.FC<{ dur: number }> = ({ dur }) => (
  <>
    <AbsoluteFill style={{ background: "#120606" }} />
    <Cam dur={dur} from={1} to={1.07} origin="50% 45%">
      <Svg bg="transparent">
        <circle cx={540} cy={700} r={600} fill="url(#redPool)" opacity={0.45} />
        <Stick x={560} floor={2440} scale={2.6} facing={-1} look={YOU} pose={{ ...STAND, headTilt: 0.18, lean: 0.06 }} lookAt={0.4} />
        <rect width={1080} height={1920} fill="#1a0303" opacity={0.3} />
      </Svg>
    </Cam>
  </>
);

const DoorAgain: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const black = 1 - ramp(frame, 0, 16);
  const open = ramp(frame, 24, 70);
  return (
    <>
      <Cam dur={dur} from={1.04} to={1.12} origin="50% 60%">
        <Svg>
          <BlastDoor open={open} slotLight={0.4} />
          <rect width={1080} height={1920} fill="#0d0b0a" opacity={0.35 * (1 - open)} />
          <Lying x={50} y={TF.floor - 22} look={ELI} />
          <Stick x={900} floor={TF.floor} facing={-1} look={YOU} pose={{ ...STAND, lean: 0.05 }} lookAt={0.6} />
        </Svg>
      </Cam>
      <AbsoluteFill style={{ background: "black", opacity: black }} />
    </>
  );
};

const RuthKneels: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const kneel = ramp(frame, 20, 40);
  const pose = lerpPose({ ...STAND, armF: [0.15, 0.1] }, { ...STAND, legF: [1.4, 2.4], legB: [0.2, 1.9], lean: 0.35, armF: [0.6, 0.3] }, kneel);
  return (
    <Cam dur={dur} from={1.1} to={1.18} origin="45% 72%">
      <Svg>
        <BlastDoor open={1} />
        <Lying x={50} y={TF.floor - 22} look={ELI} />
        <Stick x={830} floor={TF.floor} facing={-1} look={RUTH} pose={pose} lookAt={0.7} holdF={<Case sticker />} />
        <Stick x={960} floor={TF.floor} facing={-1} look={YOU} pose={STAND} lookAt={0.6} />
      </Svg>
    </Cam>
  );
};

const NoraCall: React.FC<{ bannerAt: number }> = ({ bannerAt }) => (
  <>
    <Blurred px={16} dim={0.45}>
      <Svg>
        <BlastDoor open={1} />
      </Svg>
    </Blurred>
    <Phone
      time="3:04" count={2} buzzAt={bannerAt}
      banner={{ who: "Nora", msg: ["A man called me before it hit.", "He knew my name."], at: bannerAt }}
      alerts={[{ who: "Nora", msg: "I'm alive. Where are you?", time: "now" }, { who: "EMERGENCY ALERT", msg: "Stay sheltered 24 hours.", time: "3:03 AM", emergency: true }]}
    />
  </>
);

const Flashback: React.FC<{ dur: number }> = ({ dur }) => (
  <>
    <AbsoluteFill style={{ filter: "grayscale(1) sepia(0.35) contrast(1.1) brightness(0.9)" }}>
      <Freeze frame={80}>
        <WallPhone dur={dur + 80} />
      </Freeze>
    </AbsoluteFill>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.55) 100%)" }} />
  </>
);

const FinalShot: React.FC<{ dur: number; cardAt: number }> = ({ dur, cardAt }) => (
  <>
    <Cam dur={dur} from={1.0} to={1.1} origin="50% 60%">
      <Svg>
        <BlastDoor open={1} />
        <Lying x={50} y={TF.floor - 22} look={ELI} />
        <Stick x={800} floor={TF.floor} facing={-1} look={RUTH} pose={{ ...STAND, armF: [0.15, 0.1] }} lookAt={0.6} holdF={<Case />} />
        <Stick x={975} floor={TF.floor} facing={-1} look={YOU} pose={{ ...STAND, headTilt: 0.12 }} lookAt={0.7} />
      </Svg>
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.25)" }} />
    </Cam>
    <EndingCard n={3} name="THE LIE" at={cardAt} />
  </>
);

const TruthCta: React.FC = () => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [20, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1250, height: 120, background: "#121212", border: `5px solid ${C.optionGreen}`, borderRadius: 14, boxShadow: `0 0 30px ${C.optionGreen}99`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s})`, fontFamily: FONT.title, fontSize: 66, color: "white" }}>
        COMMENT <span style={{ color: C.optionGreen, marginLeft: 18 }}>"TRUTH"</span>
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
  { at: 0, place: "SHELTER 9 · DOOR", render: (d) => (<><Blurred px={10} dim={0.5}><Standoff dur={d} /></Blurred><MostOfYouSaid a="LIE FOR HIM" b="TELL THE TRUTH" winner="A" decideAt={wf(1, 4)} /></>) },
  { at: st(2), place: "SHELTER 9 · DOOR", render: (d) => <CloseUp dur={d} who="you" band /> },
  { at: st(3), place: "SHELTER 9 · DOOR", render: (d) => <DoorOpens dur={d} openAt={wf(3, 1) - st(3)} /> },
  { at: st(4), place: "SHELTER 9", render: (d) => <RuthStands dur={d} riseAt={wf(4, 7) - st(4)} /> },
  { at: st(6), place: "SHELTER 9 · DOOR", render: (d) => <SoldierOut dur={d} /> },
  { at: st(7), place: "SHELTER 9 · DOOR", render: (d) => <CaseThrow dur={d} /> },
  { at: st(8), place: "CORRIDOR CD-7", render: (d) => <TakeCover dur={d} flashAt={FLASH - st(8)} /> },
  { at: st(9), place: "CORRIDOR CD-7", render: (d) => <Aftermath dur={d} /> },
  { at: st(10), place: "CORRIDOR CD-7", render: (d) => <NoteShot dur={d} textAt={st(11) - st(10) - 6} /> },
  { at: st(12), place: "CORRIDOR CD-7", render: (d) => <YouGrieves dur={d} /> },
  { at: st(13), place: "SHELTER 9 · DOOR", render: (d) => <DoorAgain dur={d} /> },
  { at: st(14), place: "SHELTER 9 · DOOR", render: (d) => <RuthKneels dur={d} /> },
  { at: st(15), place: "SHELTER 9 · DOOR", render: () => <NoraCall bannerAt={wf(15, 4) - st(15)} /> },
  { at: st(17), place: "SHELTER 9 · DOOR", render: (d) => <Flashback dur={d} /> },
  { at: st(18), place: "SHELTER 9 · DOOR", render: (d) => <FinalShot dur={d} cardAt={wf(18, 7) - st(18)} /> },
];

/** [file, frame, volume, optional max length] */
const SFX: [string, number, number, number?][] = [
  ["whoosh", wf(1, 4), 0.45], ["sparkle", wf(1, 4) + 6, 0.35], ["card-slam", wf(1, 4) + 6, 0.4],
  ["heartbeat", st(2), 0.4], ["hydraulic", wf(3, 1) - 8, 0.6], ["murmur", wf(3, 1) + 20, 0.3], ["murmur", st(4), 0.22],
  ["sub-hit", wf(5, 6), 0.75], ["rifle-cock", st(6) + 4, 0.6], ["whoosh", st(7) + 12, 0.45], ["seal-boom", st(7) + 66, 0.8],
  ["tick", st(8), 0.45], ["tick", st(8) + 30, 0.45], ["tick", st(8) + 60, 0.5], ["heartbeat", st(8) + 10, 0.5],
  ["detonation", FLASH, 1], ["debris", FLASH + 25, 0.5], ["tinnitus", FLASH + 40, 0.2], ["debris", st(9) + 10, 0.25],
  ["whoosh", st(10) + 6, 0.2], ["hydraulic", st(13) + 18, 0.55], ["murmur", st(13) + 60, 0.2],
  ["phone-buzz", wf(15, 4), 0.5], ["ding", wf(15, 4) + 4, 0.4], ["sub-hit", st(17), 0.5],
  ["ending-swell", st(18) - 10, 0.55], ["card-slam", wf(18, 7), 0.5], ["card-slam", st(19) + 20, 0.4],
];

export const LastTrainP3A: React.FC = () => {
  const frame = useCurrentFrame();
  const shotIdx = SHOTS.findIndex((s, i) => frame >= s.at && (i === SHOTS.length - 1 || frame < SHOTS[i + 1].at));
  const cd = countdownAt(frame);
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {SHOTS.map((s, i) => {
        const end = i === SHOTS.length - 1 ? LT3A_TOTAL : SHOTS[i + 1].at;
        return (
          <Sequence key={i} from={s.at} durationInFrames={end - s.at}>
            {s.render(end - s.at)}
          </Sequence>
        );
      })}
      <Sequence from={st(19)}>
        <TruthCta />
      </Sequence>
      <Vignette />
      <Hud time={clockAt(frame)} place={SHOTS[Math.max(0, shotIdx)].place} label={cd.label} countdown={cd.cd} day={frame >= DAY2 ? 2 : 1} />
      <Captions lines={CAPS} />

      {WORDS.map((_, i) => (
        <Sequence key={`v${i}`} from={START[i]}>
          <Audio src={staticFile(`audio/voice/lt3a-${String(i + 1).padStart(2, "0")}.wav`)} volume={VOICE_VOL[i + 1] ?? 1} />
        </Sequence>
      ))}
      <Audio
        src={staticFile("audio/music/drone.wav")}
        volume={(f) => interpolate(f, [0, 20, FLASH - 2, FLASH, FLASH + 50, FLASH + 110, st(18), st(18) + 40, LT3A_TOTAL - 30, LT3A_TOTAL], [0, 0.3, 0.3, 0, 0, 0.22, 0.22, 0.12, 0.12, 0], { extrapolateRight: "clamp" })}
      />
      {SFX.map(([name, at, vol, len], i) => (
        <Sequence key={`s${i}`} from={at} durationInFrames={len}>
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
