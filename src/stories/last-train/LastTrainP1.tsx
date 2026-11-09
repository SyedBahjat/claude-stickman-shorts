import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Blurred, Cam, Captions, type CapLine, ChoiceCards, Hud, RuleCard, Vignette } from "../../kit/Overlays";
import { Phone } from "../../kit/Props";
import { ELI, MAGS, PASSENGERS, type Pose, STAND, Stick, walkTo, YOU } from "../../kit/Stick";
import { Svg } from "../../sets/Sets";
import { Carriage, Case, crankHandle, Flashlight, HandPhone, RouteCard, T } from "../../sets/Train";
import w01 from "../../../public/captions/lt1-01.json";
import w02 from "../../../public/captions/lt1-02.json";
import w03 from "../../../public/captions/lt1-03.json";
import w04 from "../../../public/captions/lt1-04.json";
import w05 from "../../../public/captions/lt1-05.json";
import w06 from "../../../public/captions/lt1-06.json";
import w07 from "../../../public/captions/lt1-07.json";
import w08 from "../../../public/captions/lt1-08.json";
import w09 from "../../../public/captions/lt1-09.json";
import w10 from "../../../public/captions/lt1-10.json";
import w11 from "../../../public/captions/lt1-11.json";
import w12 from "../../../public/captions/lt1-12.json";
import w13 from "../../../public/captions/lt1-13.json";
import w14 from "../../../public/captions/lt1-14.json";
import w15 from "../../../public/captions/lt1-15.json";
import w16 from "../../../public/captions/lt1-16.json";
import w17 from "../../../public/captions/lt1-17.json";
import w18 from "../../../public/captions/lt1-18.json";
import w19 from "../../../public/captions/lt1-19.json";
import w20 from "../../../public/captions/lt1-20.json";

// ---------- timeline (see stories/last-train/script.md, PART 1) ----------
const WORDS: Caption[][] = [w01, w02, w03, w04, w05, w06, w07, w08, w09, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19, w20];
/** [voice frames, air after]: holds after the stop, the threat, the route, and the name reveal. */
const LEN: [number, number][] = [
  [61, 3], [97, 10], [92, 26], [91, 32], [119, 10], [62, 8], [106, 10], [127, 16], [58, 4], [80, 12],
  [93, 20], [137, 14], [143, 6], [83, 10], [53, 12], [93, 6], [60, 34], [81, 12], [138, 40], [53, 45],
];
const START = LEN.reduce<number[]>((acc, [l, g], i) => [...acc, acc[i] + l + g], [0]);
export const LT1_TOTAL = START[LEN.length];
const st = (n: number) => START[n - 1];
const wf = (n: number, i: number) => st(n) + Math.round((WORDS[n - 1][i].startMs / 1000) * 30);
const VOICE_VOL: Record<number, number> = { 10: 1, 13: 0.72, 14: 0.72, 16: 0.72 };

const YELLOW: string[][] = [
  ["LAST", "TRAIN"], ["EVERY", "PHONE", "SCREAMS"], ["STOPS.", "STOPS", "DEAD", "TUNNEL"], ["MISSILE", "TWELVE"], ["NINE", "LOCKED", "PRYING"],
  ["NOBODY"], ["CONDUCTOR", "THIRTY"], ["FORTY", "SAFEST"], ["SISTER"], ["BASEMENT"],
  ["NINE", "FOURTEEN", "NOWHERE"], ["HOODIE", "SILVER", "WATCHING"], ["DOOR", "SHELTER", "BLAST", "CLEAN"], ["SEALS", "IMPACT", "ALONE"], ["NOBODY", "LEAVES"],
  ["PHONE", "NORA"], ["NEVER", "NAME"], ["CRANKING"], ["STAY", "STRANGER", "DARK"], ["PART", "TWO"],
];
const CAPS: CapLine[] = WORDS.map((words, i) => ({ start: START[i], end: START[i + 1], words, yellow: YELLOW[i] }));

// ---------- story clock: alert 2:51, impact 3:03 ----------
const ALERT_AT = wf(4, 3); // "Impact"
const countdownAt = (f: number) => (f < ALERT_AT ? null : interpolate(f, [ALERT_AT, LT1_TOTAL], [720, 555]));
const clockAt = (f: number) => {
  const m = Math.floor(((3 * 60 + 3) * 60 - (countdownAt(f) ?? 720)) / 60);
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")} AM`;
};

// ---------- poses ----------
const SIT: Pose = { armF: [0.55, 0.95], armB: [0.45, 1.0], legF: [1.52, 1.52], legB: [1.46, 1.5], lean: -0.04 };
const useSpr = (at = 0, stiffness = 260, damping = 16) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { stiffness, damping } });
};
/** Smooth 0→1 ramp between two local frames. */
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });

/** Background passengers: one seated at the far left, one standing at the pole (YOU and Eli placed per shot). */
const Passengers: React.FC<{ lurch?: number; phones?: number[]; look?: number }> = ({ lurch = 0, phones, look = 0.5 }) => (
  <>
    <Stick
      x={175} floor={T.floor} look={PASSENGERS[0]} lookAt={look}
      pose={phones ? { ...SIT, armF: [1.05, 1.35], lean: 0.05 + lurch * 0.3 } : { ...SIT, lean: -0.04 + lurch * 0.35 }}
      holdF={phones ? <HandPhone alert={phones[0]} /> : undefined}
    />
    <Stick
      x={590} floor={T.floor} facing={-1} look={PASSENGERS[1]} lookAt={look}
      pose={{ ...STAND, armF: phones ? [1.05, 1.35] : [0.2, 0.2], lean: -lurch * 0.25 }}
      reach={{ handB: [537, 1180] }}
      holdF={phones ? <HandPhone alert={phones[1]} /> : undefined}
    />
  </>
);
/** Eli seated with the case resting on his lap. */
const EliSeated: React.FC<{ lookAt?: number }> = ({ lookAt = 0.6 }) => (
  <Stick x={1000} floor={T.floor} facing={-1} look={ELI} pose={{ ...SIT, armF: [0.95, 0.6], armB: [0.9, 0.7] }} lookAt={lookAt} holdF={<g transform="translate(0,-70)"><Case /></g>} />
);
const PHONE_HOLD: Pose = { ...STAND, armF: [0.15, 1.85] };

// ---------- shots ----------
const Dozing: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Cam dur={dur} from={1.12} to={1.2} origin="40% 70%">
      <Svg>
        <Carriage travel={frame * 34} />
        <Passengers />
        <Stick x={400} floor={T.floor} look={YOU} pose={{ ...SIT, lean: -0.1, headTilt: -0.28 }} eyesClosed />
        <EliSeated />
      </Svg>
    </Cam>
  );
};

const PhonesLight: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const lit = (i: number) => ramp(frame, 4 + i * 7, 8 + i * 7);
  const wake = ramp(frame, 18, 26);
  return (
    <Cam dur={dur} from={1.04} to={1.1} origin="50% 70%">
      <Svg>
        <Carriage travel={(frame + 70) * 34} />
        <Passengers phones={[lit(0), lit(1)]} />
        <Stick x={400} floor={T.floor} look={YOU} pose={{ ...SIT, armF: [0.55 + 0.5 * wake, 0.95 + 0.4 * wake], lean: -0.1 + 0.12 * wake, headTilt: -0.28 * (1 - wake) }} eyesClosed={wake < 0.5} holdF={<HandPhone alert={lit(2)} />} />
        <EliSeated />
      </Svg>
    </Cam>
  );
};

const BrakeStop: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  // Train decelerates to a halt over ~1.6 s; everyone sways forward then settles back.
  const stopT = ramp(frame, 0, 48);
  const travel = (frame + 167) * 34 - 34 * 48 * stopT * stopT * 0.5 - Math.max(0, frame - 48) * 34 * 0.5;
  const sway = interpolate(frame, [0, 30, 52, 70], [0, 0.6, -0.15, 0], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const lights = frame < 20 ? 1 : frame < 60 ? 0.4 : 0.15;
  return (
    <Cam dur={dur} from={1} to={1.05} shake={frame > 40 && frame < 60 ? 14 : 0}>
      <Svg>
        <Carriage travel={travel} lights={lights} />
        <Passengers lurch={sway} look={0.6} />
        <Stick x={400} floor={T.floor} look={YOU} pose={{ ...SIT, armF: [1.0, 1.3], lean: sway * 0.35 }} lookAt={0.9} holdF={<HandPhone alert={1} />} />
        <EliSeated />
        {frame < 50 ? Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={160 + ((i * 97 + frame * 23) % 330)} cy={940 - ((i * 37 + frame * 9) % 60)} r={4} fill="#ffb347" />) : null}
      </Svg>
    </Cam>
  );
};

const AlertPhone: React.FC<{ countFrom: number }> = ({ countFrom }) => (
  <>
    <Blurred px={16} dim={0.45}>
      <Svg>
        <Carriage travel={9000} lights={0.15} />
      </Svg>
    </Blurred>
    <Phone
      time="2:51" count={3} buzzAt={0}
      alerts={[
        { who: "EMERGENCY ALERT", msg: "Missile launch detected.", time: "now", emergency: true },
        { who: "EMERGENCY ALERT", msg: "Seek shelter now.", time: "now", emergency: true },
        { who: "EMERGENCY ALERT", msg: "This is not a drill.", time: "now", emergency: true },
        { who: "Nora", msg: "are you on the train??", time: "2:49 AM" },
      ]}
    />
    <Sequence from={countFrom}>
      <BigCount />
    </Sequence>
  </>
);
const BigCount: React.FC = () => {
  const s = useSpr(0, 280, 14);
  return (
    <AbsoluteFill style={{ alignItems: "center", top: 1210 }}>
      <div style={{ transform: `scale(${s})`, background: "#c8241c", border: "6px solid #130f0b", borderRadius: 16, padding: "8px 34px", color: "#ffc338", fontFamily: "monospace", fontWeight: 800, fontSize: 92, boxShadow: "0 0 50px #ff3a2a88" }}>12:00</div>
    </AbsoluteFill>
  );
};

const Panic: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  // Pounder hits the left door window, pryer works the seam from the right; YOU stand back watching.
  const pound = (k: number) => Math.max(0, Math.sin(frame / 3.4 + k)) * 36;
  const pry = Math.sin(frame / 6) * 5;
  const lean = Math.sin(frame / 6) * 0.04;
  return (
    <Cam dur={dur} from={1.15} to={1.22} origin="55% 66%">
      <Svg>
        <Carriage travel={9000} lights={0.15} />
        <Stick x={175} floor={T.floor} look={PASSENGERS[0]} pose={{ ...SIT, armF: [0.9, 1.6], armB: [0.8, 1.6], lean: 0.3 }} lookAt={0.8} />
        <Stick x={300} floor={T.floor} look={YOU} pose={PHONE_HOLD} lookAt={0.9} holdF={<HandPhone alert={1} />} />
        <Stick x={470} floor={T.floor} look={PASSENGERS[3]} pose={{ ...STAND, lean: 0.08 }} reach={{ handF: [560 + pound(0) * 0.3, 760 + pound(0)], handB: [555, 840 + pound(1.7) * 0.6] }} lookAt={0.8} />
        <Stick x={740} floor={T.floor} facing={-1} look={PASSENGERS[1]} pose={{ ...STAND, legF: [0.22, 0.05], legB: [-0.25, 0], lean: 0.16 + lean }} reach={{ handF: [655, 1080 + pry], handB: [658, 1170 - pry] }} lookAt={0.8} />
        <EliSeated lookAt={0.2} />
      </Svg>
    </Cam>
  );
};

const MagsEnters: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const cab = ramp(frame, 0, 8);
  const w = walkTo(30, 1, interpolate(frame, [6, 50], [0, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.sin) }), 150, { amp: 0.85 });
  const freeze = ramp(frame, 4, 14);
  return (
    <Cam dur={dur} from={1.06} to={1.12} origin="35% 66%">
      <Svg>
        <Carriage travel={9000} lights={0.15} cab={cab} />
        <Stick x={740} floor={T.floor} facing={-1} look={PASSENGERS[1]} pose={{ ...STAND, lean: 0.16 * (1 - freeze) }} reach={{ handF: [655 + 60 * freeze, 1080 + 150 * freeze], handB: [658 + 70 * freeze, 1170 + 80 * freeze] }} lookAt={0.8} />
        <Stick x={540} floor={T.floor} facing={-1} look={YOU} pose={PHONE_HOLD} lookAt={0.7} holdF={<HandPhone alert={1} />} />
        <Stick x={w.x} floor={T.floor} look={MAGS} pose={{ ...w.pose, armF: [1.35, 0.2] }} lookAt={0.6} holdF={<Flashlight dir={-0.1} />} />
      </Svg>
    </Cam>
  );
};

const MagsTalks: React.FC<{ dur: number; point?: boolean; cardAt?: number }> = ({ dur, point, cardAt }) => {
  const frame = useCurrentFrame();
  const p = point ? ramp(frame, 20, 34) : 0;
  return (
    <>
      <Cam dur={dur} from={point ? 1.45 : 1.6} to={point ? 1.52 : 1.7} origin="18% 64%">
        <Svg>
          <Carriage travel={9000} lights={0.15} cab={1} />
          <Stick x={500} floor={T.floor} facing={-1} look={YOU} pose={PHONE_HOLD} lookAt={0.4} holdF={<HandPhone alert={1} />} />
          <Stick x={180} floor={T.floor} look={MAGS} pose={{ ...STAND, armF: [0.75 - 0.35 * p, 0.25], armB: [0.12 + 0.55 * p, 0.1 + 0.2 * p], headTilt: 0.06 * Math.sin(frame / 18) }} lookAt={0.7} holdF={<Flashlight dir={0.55 + 0.5 * p} />} />
        </Svg>
      </Cam>
      {cardAt != null ? <RuleCard label="RULE NUMBER ONE" text={["STAY", "UNDERGROUND"]} at={cardAt} /> : null}
    </>
  );
};

const NoraText: React.FC<{ bannerAt: number }> = ({ bannerAt }) => (
  <>
    <Blurred px={16} dim={0.45}>
      <Svg>
        <Carriage travel={9000} lights={0.15} cab={1} />
      </Svg>
    </Blurred>
    <Phone
      time="2:52" count={4} buzzAt={bannerAt}
      banner={{ who: "Nora", msg: ["No basement in my building.", "What do I do??"], at: bannerAt }}
      alerts={[
        { who: "EMERGENCY ALERT", msg: "Missile launch detected.", time: "2:51 AM", emergency: true },
        { who: "EMERGENCY ALERT", msg: "Seek shelter now.", time: "2:51 AM", emergency: true },
        { who: "Nora", msg: "are you on the train??", time: "2:49 AM" },
      ]}
    />
  </>
);

const Route: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Blurred px={18} dim={0.35}>
        <Svg>
          <Carriage travel={9000} lights={0.15} cab={1} />
        </Svg>
      </Blurred>
      <Cam dur={dur} from={1} to={1.06}>
        <RouteCard t={ramp(frame, 0, 40)} />
      </Cam>
    </>
  );
};

const EliWatching: React.FC<{ dur: number }> = ({ dur }) => (
  <Cam dur={dur} from={1.5} to={1.95} origin="90% 72%">
    <Svg>
      <Carriage travel={9000} lights={0.15} cab={1} />
      <circle cx={1000} cy={1300} r={260} fill="url(#warmPool)" opacity={0.6} />
      <EliSeated lookAt={0.1} />
    </Svg>
  </Cam>
);

const EliApproaches: React.FC<{ dur: number; tapAt: number }> = ({ dur, tapAt }) => {
  const frame = useCurrentFrame();
  const rise = ramp(frame, 0, 14);
  const total = 290;
  const dist = interpolate(frame, [14, 90], [0, total], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const w = walkTo(1000, -1, dist, total, { amp: 0.8 });
  const tap = frame > tapAt ? Math.max(0, Math.sin((frame - tapAt) / 2.5)) * 14 : 0;
  const pose: Pose = frame < 14 ? { ...SIT, legF: [1.52 * (1 - rise), 1.52 * (1 - rise)], legB: [1.46 * (1 - rise), 1.5 * (1 - rise)], lean: 0.2 * rise } : w.pose;
  return (
    <Cam dur={dur} from={1.25} to={1.32} origin="58% 66%">
      <Svg>
        <Carriage travel={9000} lights={0.15} cab={1} />
        <Stick x={400} floor={T.floor} look={YOU} pose={PHONE_HOLD} lookAt={0.6} holdF={<HandPhone alert={0.4} />} />
        <Stick x={w.x} floor={T.floor} facing={-1} look={ELI} pose={{ ...pose, armF: [0.12, 0.1] }} lookAt={0.3} holdF={<Case />} reach={frame > tapAt ? { handB: [w.x - 40, T.floor - 245 - tap] } : {}} />
      </Svg>
    </Cam>
  );
};

const MagsBlocks: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const total = 380;
  const w = walkTo(140, 1, interpolate(frame, [0, 34], [0, total], { extrapolateRight: "clamp", easing: Easing.out(Easing.sin) }), total, { amp: 1.1 });
  const arm = ramp(frame, 26, 36);
  return (
    <Cam dur={dur} from={1.2} to={1.26} origin="50% 66%">
      <Svg>
        <Carriage travel={9000} lights={0.15} cab={1} />
        <Stick x={w.x} floor={T.floor} look={MAGS} pose={{ ...w.pose, armF: [0.3 + 1.25 * arm, 0.05] }} lookAt={0.8} holdB={<Flashlight dir={0.9} />} />
        <Stick x={330} floor={T.floor} look={YOU} pose={PHONE_HOLD} lookAt={0.8} holdF={<HandPhone alert={0.4} />} />
        <Stick x={760} floor={T.floor} facing={-1} look={ELI} pose={{ ...STAND, armF: [0.12, 0.1] }} lookAt={0.5} holdF={<Case />} />
      </Svg>
    </Cam>
  );
};

const KnowsName: React.FC<{ dur: number; upAt: number }> = ({ dur, upAt }) => {
  const frame = useCurrentFrame();
  const down = ramp(frame, 4, 16) * (1 - ramp(frame, upAt, upAt + 8));
  return (
    <Cam dur={dur} from={1.5} to={1.62} origin="53% 60%">
      <Svg>
        <Carriage travel={9000} lights={0.15} cab={1} />
        <Stick x={420} floor={T.floor} look={YOU} pose={{ ...STAND, armF: [0.9, 1.4] }} lookAt={0.7} holdF={<g><HandPhone alert={0} /><text x={0} y={-30} textAnchor="middle" fontSize={10} fontWeight={800} fill="white">NORA</text></g>} />
        <Stick x={680} floor={T.floor} facing={-1} look={ELI} pose={{ ...STAND, armF: [0.12, 0.1], lean: 0.1 * down, headTilt: 0.4 * down }} lookAt={0.3 - 0.3 * down} holdF={<Case />} />
      </Svg>
    </Cam>
  );
};

const Crank: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const turn = ramp(frame, 6, 60);
  const ang = -Math.PI / 2 + turn * Math.PI * 6;
  const door = ramp(frame, 50, 75);
  const h = crankHandle(ang);
  return (
    <Cam dur={dur} from={1.35} to={1.45} origin="70% 62%">
      <Svg>
        <Carriage travel={9000} lights={0.15} cab={1} crankAng={ang} door={door} />
        <Stick x={420} floor={T.floor} look={YOU} pose={PHONE_HOLD} lookAt={0.9} holdF={<HandPhone alert={0.4} />} />
        <Stick x={965} floor={T.floor} facing={-1} look={ELI} pose={{ ...STAND, lean: 0.16 }} reach={{ handF: h }} lookAt={0.5} holdB={<Case />} />
      </Svg>
    </Cam>
  );
};

const ThreeWay: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const glance = Math.sin(frame / 24);
  return (
    <Cam dur={dur} from={1.12} to={1.18} origin="45% 66%">
      <Svg>
        <Carriage travel={9000} lights={0.15} cab={1} door={1} />
        <circle cx={160} cy={1250} r={330} fill="url(#warmPool)" opacity={0.7} />
        <Stick x={170} floor={T.floor} look={MAGS} pose={{ ...STAND, armF: [0.7, 0.3] }} lookAt={0.7} holdF={<Flashlight dir={0.45} />} />
        <Stick x={410} floor={T.floor} look={YOU} pose={{ ...STAND, armF: [0.3, 0.4], headTilt: -0.05 * glance }} lookAt={0.85 * glance} />
        <Stick x={650} floor={T.floor} facing={-1} look={ELI} pose={{ ...STAND, armF: [0.12, 0.1] }} lookAt={0.4} holdF={<Case />} />
        <rect x={540} y={520} width={220} height={1120} fill="#000" opacity={0.35} />
      </Svg>
    </Cam>
  );
};

// ---------- shot list ----------
interface Shot {
  at: number;
  render: (dur: number) => React.ReactNode;
}
const SHOTS: Shot[] = [
  { at: 0, render: (d) => <Dozing dur={d} /> },
  { at: st(2), render: (d) => <PhonesLight dur={d} /> },
  { at: st(3), render: (d) => <BrakeStop dur={d} /> },
  { at: st(4), render: () => <AlertPhone countFrom={ALERT_AT - st(4)} /> },
  { at: st(5), render: (d) => <Panic dur={d} /> },
  { at: st(6), render: (d) => <MagsEnters dur={d} /> },
  { at: st(7), render: (d) => <MagsTalks dur={d} /> },
  { at: st(8), render: (d) => <MagsTalks dur={d} point cardAt={wf(8, 9) - st(8)} /> },
  { at: st(9), render: () => <NoraText bannerAt={wf(9, 3) - st(9)} /> },
  { at: st(11), render: (d) => <Route dur={d} /> },
  { at: st(12), render: (d) => <EliWatching dur={d} /> },
  { at: st(13), render: (d) => <EliApproaches dur={d} tapAt={st(14) - st(13) + 12} /> },
  { at: st(15), render: (d) => <MagsBlocks dur={d} /> },
  { at: st(16), render: (d) => <KnowsName dur={d} upAt={st(17) - st(16)} /> },
  { at: st(18), render: (d) => <Crank dur={d} /> },
  { at: st(19), render: (d) => <ThreeWay dur={d} /> },
];

const SFX: [string, number, number][] = [
  ["alert-chorus", st(2) + 4, 0.45], ["brake-screech", st(3), 0.55], ["sparks", st(3) + 6, 0.4], ["light-buzz", st(3) + 22, 0.35],
  ["alert-beeps", st(4), 0.3], ["phone-buzz", st(4), 0.4], ["card-slam", ALERT_AT, 0.4],
  ["murmur", st(5), 0.35], ["door-pound", st(5) + 20, 0.45], ["door-pound", st(5) + 60, 0.4],
  ["card-slam", st(6), 0.6], ["footsteps", st(6) + 6, 0.25], ["card-slam", wf(8, 9), 0.55],
  ["phone-buzz", wf(9, 3), 0.5], ["ding", wf(9, 3) + 4, 0.4], ["heartbeat", st(11), 0.4],
  ["heartbeat", st(12) + 10, 0.45], ["heartbeat", st(12) + 50, 0.45], ["footsteps", st(13) + 14, 0.2],
  ["sub-hit", st(17), 0.75], ["crank", st(18) + 4, 0.6], ["whoosh", wf(19, 2), 0.4], ["whoosh", wf(19, 10), 0.4], ["card-slam", st(20), 0.5],
];

export const LastTrainP1: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {SHOTS.map((s, i) => {
        const end = i === SHOTS.length - 1 ? LT1_TOTAL : SHOTS[i + 1].at;
        return (
          <Sequence key={i} from={s.at} durationInFrames={end - s.at}>
            {s.render(end - s.at)}
          </Sequence>
        );
      })}
      <Sequence from={st(19)}>
        <ChoiceCards a="STAY ON THE TRAIN" b="FOLLOW THE STRANGER" aAt={wf(19, 2) - st(19)} bAt={wf(19, 9) - st(19)} followAt={st(20) - st(19)} part={2} />
      </Sequence>
      <Vignette />
      <Hud time={clockAt(frame)} place="LINE 4 · TUNNEL" countdown={countdownAt(frame)} />
      <Captions lines={CAPS} lowFrom={wf(19, 2)} />

      {WORDS.map((_, i) => (
        <Sequence key={`v${i}`} from={START[i]}>
          <Audio src={staticFile(`audio/voice/lt1-${String(i + 1).padStart(2, "0")}.wav`)} volume={VOICE_VOL[i + 1] ?? 1} />
        </Sequence>
      ))}
      <Audio src={staticFile("audio/music/drone.wav")} volume={(f) => interpolate(f, [0, 30, LT1_TOTAL - 40, LT1_TOTAL], [0, 0.3, 0.3, 0], { extrapolateRight: "clamp" })} />
      <Sequence durationInFrames={st(3) + 60}>
        <Audio src={staticFile("audio/sfx/train-rumble.wav")} volume={(f) => interpolate(f, [0, 10, st(3), st(3) + 55], [0.3, 0.42, 0.42, 0], { extrapolateRight: "clamp" })} />
      </Sequence>
      {SFX.map(([name, at, vol], i) => (
        <Sequence key={`s${i}`} from={at}>
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
