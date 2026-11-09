import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Blurred, Cam, Captions, type CapLine, ChoiceCards, Hud, MostOfYouSaid, Vignette } from "../../kit/Overlays";
import { Phone } from "../../kit/Props";
import { ELI, lerpPose, MAGS, type Pose, STAND, Stick, walk, walkCycle, walkTo, YOU } from "../../kit/Stick";
import { C } from "../../kit/style";
import { Svg } from "../../sets/Sets";
import { Carriage, Case, Flashlight, T } from "../../sets/Train";
import { BlastDoor, CaseOpen, Corridor, KEYPAD, SteelDoor, TF, TunnelTrack } from "../../sets/Tunnel";
import w01 from "../../../public/captions/lt2b-01.json";
import w02 from "../../../public/captions/lt2b-02.json";
import w03 from "../../../public/captions/lt2b-03.json";
import w04 from "../../../public/captions/lt2b-04.json";
import w05 from "../../../public/captions/lt2b-05.json";
import w06 from "../../../public/captions/lt2b-06.json";
import w07 from "../../../public/captions/lt2b-07.json";
import w08 from "../../../public/captions/lt2b-08.json";
import w09 from "../../../public/captions/lt2b-09.json";
import w10 from "../../../public/captions/lt2b-10.json";
import w11 from "../../../public/captions/lt2b-11.json";
import w12 from "../../../public/captions/lt2b-12.json";
import w13 from "../../../public/captions/lt2b-13.json";
import w14 from "../../../public/captions/lt2b-14.json";
import w15 from "../../../public/captions/lt2b-15.json";
import w17 from "../../../public/captions/lt2b-17.json";
import w18 from "../../../public/captions/lt2b-18.json";
import w19 from "../../../public/captions/lt2b-19.json";
import w20 from "../../../public/captions/lt2b-20.json";

// ---------- timeline (stories/last-train/script.md, PART 2B) ----------
/** Spoken order: [file id, caption words, air after, eli/soldier volume]. */
const LINES: [string, Caption[], number, number][] = [
  ["01", w01, 28, 1], ["02", w02, 8, 1], ["03", w03, 6, 1], ["17", w17, 10, 1], ["04", w04, 10, 1],
  ["05", w05, 12, 1], ["18", w18, 10, 1], ["06", w06, 10, 1], ["07", w07, 26, 1], ["08", w08, 8, 1],
  ["09", w09, 8, 0.72], ["19", w19, 14, 1], ["10", w10, 16, 1], ["11", w11, 8, 1], ["20", w20, 12, 1],
  ["12", w12, 12, 0.72], ["13", w13, 16, 1], ["14", w14, 40, 1], ["15", w15, 45, 1],
];
const LEN_FR: Record<string, number> = { "01": 64, "02": 122, "03": 79, "17": 103, "04": 111, "05": 116, "18": 65, "06": 47, "07": 133, "08": 92, "09": 88, "19": 61, "10": 50, "11": 64, "20": 138, "12": 101, "13": 85, "14": 84, "15": 48 };
const START = LINES.reduce<number[]>((acc, [id, , gap], i) => [...acc, acc[i] + LEN_FR[id] + gap], [0]);
export const LT2B_TOTAL = START[LINES.length];
/** Start frame of spoken line #k (1-based in LINES order). */
const st = (k: number) => START[k - 1];
const wf = (k: number, i: number) => st(k) + Math.round((LINES[k - 1][1][i].startMs / 1000) * 30);

const YELLOW: string[][] = [
  ["FOLLOW", "STRANGER."], ["TRACKS.", "CONDUCTOR", "SHOUTING."], ["FAST.", "LIGHT."], ["SCURRIES", "FLINCH."], ["STEEL", "CODE"],
  ["PHONE.", "CALL.", "WHO."], ["FOUR"], ["STOP.", "CARD."], ["PILLS,", "KEYCARD.", "ISN'T", "HIS."], ["VALE'S", "VALE?"],
  ["BROTHER", "PLACE."], ["PRACTICED"], ["WHO"], ["ONE", "NOT", "TWO."], ["ZERO,", "SEALS.", "TWENTY-FOUR"],
  ["FAMILY", "BOTH"], ["DON'T", "ELI."], ["LIE", "TRUTH?"], ["PART", "THREE."],
];
const CAPS: CapLine[] = LINES.map(([, words], i) => ({ start: START[i], end: START[i + 1], words, yellow: YELLOW[i] }));

// ---------- story clock: 9:00 left at 2:54 → 4:00 at "four minutes" → ~1:40 at the choice ----------
const FOUR_AT = st(7);
const countdownAt = (f: number) => (f < st(2) ? null : f < FOUR_AT ? interpolate(f, [st(2), FOUR_AT], [540, 240]) : interpolate(f, [FOUR_AT, LT2B_TOTAL], [240, 100]));
const clockAt = (f: number) => {
  const m = Math.floor(((3 * 60 + 3) * 60 - (countdownAt(f) ?? 540)) / 60);
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")} AM`;
};

const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
const lerp2 = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const PHONE_HOLD: Pose = { ...STAND, armF: [0.15, 1.85] };
const SQUAT: Pose = { ...STAND, legF: [0.9, 1.5], legB: [0.5, 1.3], lean: 0.35 };
const Keycard: React.FC = () => (
  <g>
    <rect x={-34} y={-50} width={68} height={46} rx={6} fill="#f4f2ea" stroke={C.ink} strokeWidth={4} />
    <rect x={-34} y={-50} width={68} height={12} rx={6} fill={C.signBlue} />
  </g>
);
const Handset: React.FC = () => <rect x={-20} y={-55} width={40} height={110} rx={16} fill="#2a2a2a" stroke={C.ink} strokeWidth={4} />;
const PhoneLight: React.FC<{ dir: number }> = ({ dir }) => (
  <g>
    <g transform="scale(0.8)"><Flashlight dir={dir} /></g>
  </g>
);

// ---------- shots ----------
/** Opener background: the last frame of Part 1 (three-way in the carriage), blurred. */
const Part1Tail: React.FC = () => (
  <Blurred px={10} dim={0.5}>
    <Svg>
      <Carriage travel={9000} lights={0.15} cab={1} door={1} />
      <circle cx={160} cy={1250} r={330} fill="url(#warmPool)" opacity={0.7} />
      <Stick x={170} floor={T.floor} look={MAGS} pose={{ ...STAND, armF: [0.7, 0.3] }} lookAt={0.7} holdF={<Flashlight dir={0.45} />} />
      <Stick x={410} floor={T.floor} look={YOU} pose={{ ...STAND, armF: [0.3, 0.4] }} lookAt={0.6} />
      <Stick x={650} floor={T.floor} facing={-1} look={ELI} pose={{ ...STAND, armF: [0.12, 0.1] }} lookAt={0.4} holdF={<Case />} />
    </Svg>
  </Blurred>
);

const JumpDown: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, 10, 32);
  const air = Math.sin(Math.PI * t);
  const land = ramp(frame, 32, 46);
  const youDist = interpolate(frame, [46, dur], [0, 230], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const youWalk = walkTo(600, -1, youDist, 400, { amp: 0.9 });
  const youX = frame < 46 ? 760 - 160 * t : youWalk.x;
  const youFloor = frame < 32 ? 1480 + 180 * t - air * 110 : TF.floor;
  const youPose: Pose = frame < 32 ? lerpPose(STAND, SQUAT, air) : frame < 46 ? lerpPose(SQUAT, STAND, land) : youWalk.pose;
  const eli = walkTo(440, -1, frame * 3.2, 500, { amp: 0.9 });
  const wave = Math.sin(frame / 4);
  return (
    <Cam dur={dur} from={1.04} to={1.1} origin="55% 70%">
      <Svg>
        <TunnelTrack train trainX={380} />
        <Stick x={830} floor={1480} facing={-1} look={MAGS} pose={{ ...STAND, armF: [2.3 + 0.35 * wave, 0.6], lean: 0.08 }} lookAt={0.8} holdB={<Flashlight dir={Math.PI - 0.35} />} />
        <Stick x={eli.x} floor={TF.floor} facing={-1} look={ELI} pose={{ ...eli.pose, armF: [0.12, 0.1] }} lookAt={0.6} holdF={<Case />} />
        <Stick x={youX} floor={youFloor} facing={-1} look={YOU} pose={youPose} lookAt={0.6} />
      </Svg>
    </Cam>
  );
};

/** Tracking shot down the tunnel: both walk left, the wall scrolls past. */
const TunnelWalk: React.FC<{ dur: number; base: number; rats?: boolean }> = ({ dur, base, rats }) => {
  const frame = useCurrentFrame();
  const dist = (base + frame) * 4.4;
  const amp = 1.0;
  const ph = dist / walkCycle(amp);
  const flinch = rats ? ramp(frame, 26, 34) * (1 - ramp(frame, 48, 62)) : 0;
  return (
    <Cam dur={dur} from={rats ? 1.25 : 1.05} to={rats ? 1.32 : 1.1} origin={rats ? "55% 82%" : "50% 66%"}>
      <Svg>
        <TunnelTrack scroll={-dist} />
        <Stick x={380} floor={TF.floor} facing={-1} look={ELI} pose={{ ...walk(ph, amp), armF: [0.12, 0.1], lean: 0.05 }} lookAt={0.7} holdF={<Case />} />
        <Stick x={660} floor={TF.floor} facing={-1} look={YOU} pose={{ ...walk(ph + 0.5, amp * (1 - 0.7 * flinch)), armF: [0.6, 0.5], lean: 0.03 - 0.18 * flinch, headTilt: 0.3 * flinch }} lookAt={0.6} holdF={<PhoneLight dir={Math.PI - 0.25} />} />
        {rats
          ? [0, 1, 2].map((k) => {
              const rx = -80 + (frame - 22 - k * 5) * 26;
              if (rx < -100 || rx > 1200) return null;
              const ry = TF.floor + 40 + k * 28;
              return (
                <g key={k} transform={`translate(${rx},${ry})`}>
                  <path d="M-30,0 C-60,-6 -80,8 -100,0" stroke="#6a6460" strokeWidth={4} fill="none" />
                  <ellipse cx={0} cy={-8} rx={34} ry={16} fill="#5d5853" stroke={C.ink} strokeWidth={3} />
                  <circle cx={30} cy={-14} r={10} fill="#5d5853" stroke={C.ink} strokeWidth={3} />
                  <circle cx={35} cy={-16} r={2.5} fill={C.ink} />
                </g>
              );
            })
          : null}
      </Svg>
    </Cam>
  );
};

const KEYS = [0, 4, 8, 2, 6, 1];
const keyPos = (k: number): [number, number] => [698 + (k % 3) * 26 + 10, 1146 + Math.floor(k / 3) * 34 + 13];

const DoorCode: React.FC<{ dur: number; pressAt: number }> = ({ dur, pressAt }) => {
  const frame = useCurrentFrame();
  const idx = Math.max(0, Math.min(KEYS.length - 1, Math.floor((frame - pressAt) / 5)));
  const active = frame >= pressAt && frame < pressAt + KEYS.length * 5 ? KEYS[idx] : -1;
  const tap = frame >= pressAt && frame < pressAt + KEYS.length * 5 ? Math.abs(Math.sin(((frame - pressAt) / 5) * Math.PI)) * 6 : 0;
  const reachIn = ramp(frame, pressAt - 14, pressAt - 2);
  const rest: [number, number] = [860, 1430];
  const target = active >= 0 ? keyPos(active) : keyPos(KEYS[KEYS.length - 1]);
  const hand = lerp2(rest, [target[0] + 6, target[1] + tap], reachIn * (1 - ramp(frame, pressAt + 40, pressAt + 52)));
  const open = ramp(frame, pressAt + 35, pressAt + 60);
  return (
    <Cam dur={dur} from={1.05} to={1.16} origin="62% 62%">
      <Svg>
        <TunnelTrack scroll={900} />
        <SteelDoor open={open} pressed={active} />
        <Stick x={900} floor={TF.floor} facing={-1} look={ELI} pose={{ ...STAND, lean: 0.06 }} reach={{ handF: hand }} lookAt={0.7} holdB={<Case />} />
        <Stick x={150} floor={TF.floor} look={YOU} pose={{ ...STAND, armF: [0.6, 0.5] }} lookAt={0.8} holdF={<PhoneLight dir={0.2} />} />
      </Svg>
    </Cam>
  );
};
const KEY_PRESS = 30;

export const WallPhone: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const eli = walkTo(120, 1, interpolate(frame, [0, 50], [0, 480], { extrapolateRight: "clamp", easing: Easing.out(Easing.sin) }), 480, { amp: 0.95 });
  const you = walkTo(-80, 1, interpolate(frame, [0, 60], [0, 330], { extrapolateRight: "clamp", easing: Easing.out(Easing.sin) }), 330, { amp: 0.9 });
  const hook: [number, number] = [700, 1012];
  const ear: [number, number] = [eli.x + 20, 1150];
  const rest: [number, number] = [eli.x + 30, 1430];
  const toHook = ramp(frame, 50, 58);
  const toEar = ramp(frame, 58, 67);
  const back = ramp(frame, 98, 106);
  const release = ramp(frame, 106, 114);
  let hand = lerp2(rest, hook, toHook);
  if (frame >= 58) hand = lerp2(hook, ear, toEar);
  if (frame >= 98) hand = lerp2(ear, hook, back);
  if (frame >= 106) hand = lerp2(hook, rest, release);
  const lifted = frame >= 58 && frame < 106;
  return (
    <Cam dur={dur} from={1.12} to={1.2} origin="55% 60%">
      <Svg>
        <Corridor phoneX={700} handset={!lifted} />
        <Stick x={you.x} floor={TF.floor} look={YOU} pose={you.pose} lookAt={0.7} />
        <Stick x={eli.x} floor={TF.floor} look={ELI} pose={{ ...eli.pose, headTilt: lifted ? 0.12 : 0 }} reach={{ handF: hand }} lookAt={lifted ? -0.2 : 0.6} holdF={lifted ? <Handset /> : undefined} holdB={<Case />} />
      </Svg>
    </Cam>
  );
};

const FourMinutes: React.FC = () => (
  <>
    <Blurred px={16} dim={0.4}>
      <Svg>
        <Corridor phoneX={700} />
      </Svg>
    </Blurred>
    <Phone
      time="2:59" count={4}
      alerts={[
        { who: "EMERGENCY ALERT", msg: "Impact in 4 minutes.", time: "now", emergency: true },
        { who: "Nora", msg: "please answer", time: "2:57 AM" },
        { who: "Nora", msg: "No basement in my building", time: "2:52 AM" },
        { who: "EMERGENCY ALERT", msg: "Missile launch detected.", time: "2:51 AM", emergency: true },
      ]}
      buzzAt={0}
    />
  </>
);

const DoorStop: React.FC<{ dur: number; stopAt: number }> = ({ dur, stopAt }) => {
  const frame = useCurrentFrame();
  const eli = walkTo(1060, -1, interpolate(frame, [0, 30], [0, 300], { extrapolateRight: "clamp", easing: Easing.out(Easing.sin) }), 300, { amp: 0.95 });
  const you = walkTo(1220, -1, interpolate(frame, [0, 36], [0, 300], { extrapolateRight: "clamp", easing: Easing.out(Easing.sin) }), 300, { amp: 0.9 });
  return (
    <Cam dur={dur} from={1.0} to={1.06} origin="50% 55%">
      <Svg>
        <BlastDoor rifle={ramp(frame, stopAt, stopAt + 8)} eyes={0.3} />
        <Stick x={eli.x} floor={TF.floor} facing={-1} look={ELI} pose={{ ...eli.pose, armF: [0.12, 0.1] }} lookAt={0.6} holdF={<Case />} />
        <Stick x={you.x} floor={TF.floor} facing={-1} look={YOU} pose={you.pose} lookAt={0.6} />
      </Svg>
    </Cam>
  );
};

const CaseShot: React.FC<{ zoomAt: number }> = ({ zoomAt }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Blurred px={16} dim={0.35}>
        <Svg>
          <BlastDoor />
        </Svg>
      </Blurred>
      <Svg bg="transparent">
        <CaseOpen zoom={interpolate(frame, [zoomAt, zoomAt + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) })} />
      </Svg>
    </>
  );
};

const CardToSlot: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const up = ramp(frame, 0, 14);
  const hand = lerp2([700, 1430], [600, 1010], up);
  return (
    <Cam dur={dur} from={1.35} to={1.45} origin="52% 52%">
      <Svg>
        <BlastDoor eyes={-0.3 * up} />
        <Stick x={720} floor={TF.floor} facing={-1} look={ELI} pose={{ ...STAND, lean: 0.04 }} reach={{ handF: hand }} lookAt={0.5} holdF={<Keycard />} holdB={<Case />} />
      </Svg>
    </Cam>
  );
};

export const CloseUp: React.FC<{ dur: number; who: "eli" | "you"; band?: boolean }> = ({ dur, who, band }) => {
  const frame = useCurrentFrame();
  const nod = Math.sin(frame / 14) * 0.05;
  return (
    <>
      <Blurred px={16} dim={0.4}>
        <Svg>
          <BlastDoor />
        </Svg>
      </Blurred>
      <Cam dur={dur} from={1} to={1.06} origin="50% 45%">
        <Svg bg="transparent">
          {who === "eli" ? (
            <Stick x={560} floor={2440} scale={2.6} facing={-1} look={ELI} pose={{ ...STAND, headTilt: nod }} lookAt={0.2} />
          ) : (
            <Stick x={560} floor={2440} scale={2.6} facing={-1} look={YOU} pose={{ ...STAND, headTilt: nod * 0.5 }} lookAt={band ? 0.1 : 0.8} />
          )}
          {band ? <rect x={0} y={1035} width={1080} height={72} fill="#ffe7a6" opacity={0.25} /> : null}
        </Svg>
      </Cam>
    </>
  );
};

export const SlotEyes: React.FC<{ dur: number; toYou?: boolean }> = ({ dur, toYou }) => {
  const frame = useCurrentFrame();
  return (
    <Cam dur={dur} from={2.4} to={2.6} origin="50% 47.5%">
      <Svg>
        <BlastDoor eyes={toYou ? interpolate(frame, [6, 16], [-0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0} />
      </Svg>
    </Cam>
  );
};

const DoorWide: React.FC<{ dur: number; tapRifle?: boolean; beacon?: boolean }> = ({ dur, tapRifle, beacon }) => {
  const frame = useCurrentFrame();
  const rifle = tapRifle ? 1 - 0.18 * Math.max(0, Math.sin(frame / 3)) * (frame < 24 ? 1 : 0) : 1;
  const pulse = beacon ? 0.5 + 0.5 * Math.sin(frame / 4) : 0;
  return (
    <Cam dur={dur} from={1.02} to={1.1} origin="50% 55%">
      <Svg>
        <BlastDoor rifle={rifle} eyes={0.5} />
        {beacon ? (
          <g>
            <circle cx={540} cy={560} r={34} fill="#ff3a2a" stroke={C.ink} strokeWidth={5} />
            <circle cx={540} cy={560} r={360} fill="url(#redPool)" opacity={pulse} />
          </g>
        ) : null}
        <Stick x={720} floor={TF.floor} facing={-1} look={ELI} pose={{ ...STAND, armF: [0.12, 0.1] }} lookAt={0.5} holdF={<Case />} />
        <Stick x={930} floor={TF.floor} facing={-1} look={YOU} pose={STAND} lookAt={0.5} />
      </Svg>
    </Cam>
  );
};

const Whisper: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const lean = ramp(frame, 0, 12);
  return (
    <Cam dur={dur} from={1.55} to={1.62} origin="62% 58%">
      <Svg>
        <BlastDoor eyes={0.6} />
        <Stick x={570} floor={TF.floor} look={ELI} pose={{ ...STAND, armF: [0.12, 0.1], lean: 0.2 * lean, headTilt: 0.22 * lean }} lookAt={0.8} holdF={<Case />} />
        <Stick x={830} floor={TF.floor} facing={-1} look={YOU} pose={STAND} lookAt={0.6} />
      </Svg>
    </Cam>
  );
};

export const Standoff: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Cam dur={dur} from={1.04} to={1.1} origin="50% 55%">
      <Svg>
        <BlastDoor eyes={Math.sin(frame / 20)} />
        <Stick x={300} floor={TF.floor} look={ELI} pose={{ ...STAND, armF: [0.12, 0.1] }} lookAt={0.7} holdF={<Case />} />
        <Stick x={790} floor={TF.floor} facing={-1} look={YOU} pose={STAND} lookAt={0.7} />
      </Svg>
    </Cam>
  );
};

// ---------- shot list ----------
interface Shot {
  at: number;
  place: string;
  render: (dur: number) => React.ReactNode;
}
const SHOTS: Shot[] = [
  { at: 0, place: "LINE 4 · TUNNEL", render: () => (<><Part1Tail /><MostOfYouSaid a="STAY ON THE TRAIN" b="FOLLOW THE STRANGER" winner="B" decideAt={wf(1, 4)} /></>) },
  { at: st(2), place: "LINE 4 · TUNNEL", render: (d) => <JumpDown dur={d} /> },
  { at: st(3), place: "LINE 4 · TUNNEL", render: (d) => <TunnelWalk dur={d} base={0} /> },
  { at: st(4), place: "LINE 4 · TUNNEL", render: (d) => <TunnelWalk dur={d} base={st(4) - st(3)} rats /> },
  { at: st(5), place: "TUNNEL · DOOR CD-7", render: (d) => <DoorCode dur={d} pressAt={KEY_PRESS} /> },
  { at: st(6), place: "CORRIDOR CD-7", render: (d) => <WallPhone dur={d} /> },
  { at: st(7), place: "CORRIDOR CD-7", render: () => <FourMinutes /> },
  { at: st(8), place: "SHELTER 9 · DOOR", render: (d) => <DoorStop dur={d} stopAt={wf(8, 0) - st(8)} /> },
  { at: st(9), place: "SHELTER 9 · DOOR", render: () => <CaseShot zoomAt={wf(9, 8) - st(9)} /> },
  { at: st(10), place: "SHELTER 9 · DOOR", render: (d) => <CardToSlot dur={d} /> },
  { at: st(11), place: "SHELTER 9 · DOOR", render: (d) => <CloseUp dur={d} who="eli" /> },
  { at: st(12), place: "SHELTER 9 · DOOR", render: (d) => <CloseUp dur={d} who="you" /> },
  { at: st(13), place: "SHELTER 9 · DOOR", render: (d) => <SlotEyes dur={d} toYou /> },
  { at: st(14), place: "SHELTER 9 · DOOR", render: (d) => <DoorWide dur={d} tapRifle /> },
  { at: st(15), place: "SHELTER 9 · DOOR", render: (d) => <DoorWide dur={d} beacon /> },
  { at: st(16), place: "SHELTER 9 · DOOR", render: (d) => <Whisper dur={d} /> },
  { at: st(17), place: "SHELTER 9 · DOOR", render: (d) => <CloseUp dur={d} who="you" band /> },
  { at: st(18), place: "SHELTER 9 · DOOR", render: (d) => <Standoff dur={d} /> },
];

/** [file, frame, volume, optional max length in frames] */
const SFX: [string, number, number, number?][] = [
  ["whoosh", wf(1, 4), 0.45], ["sparkle", wf(1, 4) + 6, 0.35], ["card-slam", wf(1, 4) + 6, 0.4],
  ["gravel-steps", st(2) + 30, 0.45], ["gravel-steps", st(3), 0.4], ["gravel-steps", st(4), 0.35], ["rat-squeaks", st(4) + 22, 0.5],
  ["keypad", st(5) + KEY_PRESS, 0.55], ["footsteps", st(6), 0.25], ["light-buzz", st(6) + 10, 0.25], ["receiver", st(6) + 58, 0.5, 38], ["tick", st(6) + 100, 0.7],
  ["phone-buzz", st(7), 0.45], ["tick", st(7) + 20, 0.4], ["tick", st(7) + 50, 0.4],
  ["blast-hum", st(8), 0.4], ["rifle-cock", wf(8, 0), 0.6], ["sub-hit", wf(9, 13), 0.7], ["blast-hum", st(10), 0.35],
  ["heartbeat", st(12), 0.4], ["heartbeat", st(13) + 4, 0.45], ["rifle-cock", st(14), 0.45], ["alert-beeps", st(15) + 10, 0.2],
  ["heartbeat", st(16) + 20, 0.4], ["tick", st(17), 0.4], ["tick", st(17) + 30, 0.4],
  ["whoosh", wf(18, 2), 0.4], ["whoosh", wf(18, 7), 0.4], ["card-slam", st(19), 0.5],
];

export const LastTrainP2B: React.FC = () => {
  const frame = useCurrentFrame();
  const shotIdx = SHOTS.findIndex((s, i) => frame >= s.at && (i === SHOTS.length - 1 || frame < SHOTS[i + 1].at));
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {SHOTS.map((s, i) => {
        const end = i === SHOTS.length - 1 ? LT2B_TOTAL : SHOTS[i + 1].at;
        return (
          <Sequence key={i} from={s.at} durationInFrames={end - s.at}>
            {s.render(end - s.at)}
          </Sequence>
        );
      })}
      <Sequence from={st(18)}>
        <ChoiceCards a="LIE FOR HIM" b="TELL THE TRUTH" aAt={wf(18, 2) - st(18)} bAt={wf(18, 7) - st(18)} followAt={st(19) - st(18)} part={3} />
      </Sequence>
      <Vignette />
      <Hud time={clockAt(frame)} place={SHOTS[Math.max(0, shotIdx)].place} countdown={countdownAt(frame)} />
      <Captions lines={CAPS} lowFrom={wf(18, 2)} />

      {LINES.map(([id, , , vol], i) => (
        <Sequence key={`v${i}`} from={START[i]}>
          <Audio src={staticFile(`audio/voice/lt2b-${id}.wav`)} volume={vol} />
        </Sequence>
      ))}
      <Sequence from={st(2) + 4}>
        <Audio src={staticFile("audio/voice/lt2b-16.wav")} volume={0.5} />
      </Sequence>
      <Audio src={staticFile("audio/music/drone.wav")} volume={(f) => interpolate(f, [0, 20, LT2B_TOTAL - 40, LT2B_TOTAL], [0, 0.3, 0.3, 0], { extrapolateRight: "clamp" })} />
      {SFX.map(([name, at, vol, len], i) => (
        <Sequence key={`s${i}`} from={at} durationInFrames={len}>
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
