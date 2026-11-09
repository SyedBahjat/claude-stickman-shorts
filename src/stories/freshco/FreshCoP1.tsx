import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Easing, interpolate, interpolateColors, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Dog } from "../../kit/Dog";
import { Blurred, Cam, Captions, type CapLine, ChoiceCards, RuleCard, Vignette } from "../../kit/Overlays";
import { HALE, JUNE, lerpPose, type Look, MARCO, type Pose, STAND, Stick, TURNED, walk, walkCycle, walkTo, WALT, YOU } from "../../kit/Stick";
import { C } from "../../kit/style";
import { DayTitle, ZombieHud } from "../../kit/ZombieHud";
import { Svg } from "../../sets/Sets";
import { BackRoom, Checkout, Clipboard, CoolerBag, Counter, FreezerAisle, PA_SPEAKER, PizzaBox, REGISTER_BUTTON, SF, StoreDefs } from "../../sets/Store";
import w01 from "../../../public/captions/fc1-01.json";
import w02 from "../../../public/captions/fc1-02.json";
import w03 from "../../../public/captions/fc1-03.json";
import w04 from "../../../public/captions/fc1-04.json";
import w05 from "../../../public/captions/fc1-05.json";
import w06 from "../../../public/captions/fc1-06.json";
import w07 from "../../../public/captions/fc1-07.json";
import w08 from "../../../public/captions/fc1-08.json";
import w09 from "../../../public/captions/fc1-09.json";
import w10 from "../../../public/captions/fc1-10.json";
import w11 from "../../../public/captions/fc1-11.json";
import w12 from "../../../public/captions/fc1-12.json";
import w13 from "../../../public/captions/fc1-13.json";
import w14 from "../../../public/captions/fc1-14.json";
import w15 from "../../../public/captions/fc1-15.json";
import w16 from "../../../public/captions/fc1-16.json";
import w17 from "../../../public/captions/fc1-17.json";

// ---------- timeline (stories/freshco/script.md, PART 1) ----------
const WORDS: Caption[][] = [w01, w02, w03, w04, w05, w06, w07, w08, w09, w10, w11, w12, w13, w14, w15, w16, w17];
const LEN: [number, number][] = [
  [98, 12], [204, 8], [151, 6], [140, 10], [100, 6], [90, 8], [135, 10], [172, 14], [100, 8], [177, 10],
  [145, 12], [124, 8], [113, 4], [161, 10], [110, 24], [101, 40], [53, 45],
];
const START = LEN.reduce<number[]>((acc, [l, g], i) => [...acc, acc[i] + l + g], [0]);
export const FC1_TOTAL = START[LEN.length];
const st = (n: number) => START[n - 1];
const wf = (n: number, i: number) => st(n) + Math.round((WORDS[n - 1][i].startMs / 1000) * 30);

const YELLOW: string[][] = [
  ["ONE.", "FROZEN", "PIZZA."], ["MIDNIGHT.", "DOG.", "EVERYONE."], ["DOORS", "LAB", "COAT"], ["PARKING", "PEOPLE.", "WALKING", "RIGHT."], ["LOCK", "NOW!"],
  ["SCREAM", "HARDER."], ["MUSIC", "LOUDER...", "LOSE", "INTEREST."], ["NOISE.", "AWFUL", "SONG", "HIDING"], ["SORRY.", "LOUD"], ["ICE", "CHEST.", "STOPS", "MOVING."],
  ["COLD.", "KEEP"], ["SHAKING", "SCRATCHING", "WRIST."], ["FREEZER.", "TURNS."], ["BACK.", "NOW.", "BITE."], ["BREATHING.", "LOOKING", "YOU."],
  ["FREEZER,", "OUTSIDE?"], ["PART", "TWO."],
];
const CAPS: CapLine[] = WORDS.map((words, i) => ({ start: START[i], end: START[i + 1], words, yellow: YELLOW[i] }));

const clockAt = (f: number) => {
  const m = Math.floor(interpolate(f, [0, FC1_TOTAL], [23 * 60 + 58, 24 * 60 + 5]));
  const h = Math.floor(m / 60) % 24;
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m % 60).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

// ---------- helpers ----------
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
const lerp2 = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const KNEEL: Pose = { ...STAND, legF: [1.4, 2.4], legB: [0.2, 1.9], lean: 0.15 };
const SIT_FLOOR: Pose = { ...STAND, legF: [Math.PI / 2, 0.15], legB: [Math.PI / 2 - 0.15, 0.25], lean: -0.15, armF: [0.5, 0.6], armB: [0.3, 0.5] };
/** Shambling idle for the Turned: heads loll, arms hang forward, slight sway. */
const zPose = (f: number, k: number, amp = 1): Pose => ({
  ...STAND,
  armF: [0.85 + 0.12 * Math.sin(f / 13 + k), 0.25],
  armB: [0.75 + 0.12 * Math.sin(f / 11 + k * 2), 0.3],
  lean: 0.14 + 0.04 * Math.sin(f / 17 + k) * amp,
  headTilt: 0.32 * Math.sin(f / 29 + k * 1.7) * amp,
});

type ZMode = "empty" | "still" | "turn" | "pound" | "drift";
const FAR = [80, 250, 470, 610, 990];
const MID = [170, 380, 880];
const NEAR = [230, 480, 760];
/** The Turned outside the glass. Far/mid rows are smaller (depth); near row only when they rush the glass. */
const Crowd: React.FC<{ f: number; mode: ZMode; driftT?: number; appear?: number }> = ({ f, mode, driftT = 0, appear = 1 }) => {
  if (mode === "empty") return null;
  const look = (k: number): Look => TURNED[k % TURNED.length];
  const turnT = mode === "turn" ? ramp(f, 4 + 0, 30) : mode === "still" ? 0 : 1;
  const drift = mode === "drift" ? driftT * 260 : 0;
  const row = (xs: number[], floor: number, scale: number, off: number) =>
    xs.map((x, i) => {
      const k = i + off;
      const lookAt = interpolate(turnT, [0, 1], [random(`zl${k}`) - 0.5, x < 545 ? 0.9 : -0.9]);
      const facing: 1 | -1 = mode === "drift" ? -1 : x < 545 ? 1 : -1;
      const dx = mode === "drift" ? -drift * (0.6 + random(`zd${k}`) * 0.6) : 0;
      const pose = mode === "drift" ? { ...zPose(f, k), ...walk(-dx / walkCycle(0.5, scale), 0.5), armF: [0.9, 0.25] as const, armB: [0.8, 0.3] as const, lean: 0.18 } : zPose(f, k);
      return <Stick key={k} x={x + dx} floor={floor} scale={scale} facing={facing} look={look(k)} pose={pose} lookAt={lookAt} />;
    });
  const pound = mode === "pound" ? 1 : 0;
  return (
    <g opacity={appear}>
      {row(FAR, SF.lot, 0.42, 0)}
      {row(MID, SF.lot + 95, 0.6, 10)}
      {pound
        ? NEAR.map((x, i) => {
            const hit = Math.max(0, Math.sin(f / 3.2 + i * 1.9)) * 34;
            return (
              <Stick
                key={`n${i}`} x={x} floor={SF.floor - 40} scale={0.82} facing={1} look={look(i + 3)} pose={zPose(f, i + 20, 0.4)} lookAt={0}
                reach={{ handF: [x + 70, 1080 + i * 30 + hit * 0.3], handB: [x - 50, 1110 + i * 25 - hit] }}
              />
            );
          })
        : null}
    </g>
  );
};

// ---------- shots ----------
const FrozenPizza: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Cam dur={dur} from={1.15} to={1.24} origin="45% 70%">
        <Svg>
          <StoreDefs />
          <FreezerAisle />
          <Stick x={520} floor={SF.floor} look={YOU} pose={{ ...STAND, armF: [1.0, 1.2], headTilt: 0.12 + 0.04 * Math.sin(frame / 12) }} lookAt={0.4} holdF={<PizzaBox />} />
        </Svg>
      </Cam>
      <DayTitle day={1} at={4} />
    </>
  );
};

/** The whole night crew at the checkout. */
const NightCrew: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const m = walkTo(1140, -1, interpolate(frame, [10, 110], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) }), 200, { amp: 0.85 });
  return (
    <Cam dur={dur} from={1.0} to={1.06} pan={[-30, 0]}>
      <Svg>
        <StoreDefs />
        <Checkout outside={<Crowd f={frame} mode="empty" />} />
        <Stick x={140} floor={SF.floor} look={JUNE} pose={{ ...STAND, armF: [0.9, 1.0] }} lookAt={0.6} />
        <Counter />
        <Stick x={440} floor={SF.floor} look={YOU} pose={{ ...STAND, armF: [1.0, 1.2] }} lookAt={0.5} holdF={<PizzaBox />} />
        <Stick x={650} floor={SF.floor} facing={-1} look={WALT} pose={{ ...STAND, armF: [0.5, 0.4] }} lookAt={0.7} />
        <Dog x={790} floor={SF.floor} facing={-1} wag={Math.sin(frame / 3) * 0.5} headTilt={0.1 * Math.sin(frame / 20)} />
        <Stick x={m.x} floor={SF.floor} facing={-1} look={MARCO} pose={{ ...m.pose, armF: [0.9, 1.3] }} lookAt={0.6} holdF={<Clipboard />} />
      </Svg>
    </Cam>
  );
};

const HaleArrives: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const door = ramp(frame, 0, 14);
  const step = ramp(frame, 12, 50);
  const fall = ramp(frame, 50, 66);
  const slump = ramp(frame, 66, 84);
  const pose = slump > 0 ? lerpPose(KNEEL, SIT_FLOOR, slump) : lerpPose({ ...walk(frame / 22, 0.7), lean: 0.3 }, KNEEL, fall);
  return (
    <Cam dur={dur} from={1.2} to={1.3} origin="52% 66%">
      <Svg>
        <StoreDefs />
        <Checkout door={door} outside={<Crowd f={frame} mode="empty" />} />
        <Stick x={560 + 260 * step} floor={SF.floor - 40 * (1 - step)} scale={0.85 + 0.15 * step} look={HALE} pose={pose} lookAt={0.2} holdF={<CoolerBag label={false} />} />
      </Svg>
    </Cam>
  );
};

const LotTurns: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Cam dur={dur} from={1.15} to={1.4} origin="50% 66%">
      <Svg>
        <StoreDefs />
        <Checkout door={1 - ramp(frame, 90, 110)} outside={<Crowd f={frame} mode="turn" appear={ramp(frame, 0, 30)} />} />
        <Stick x={820} floor={SF.floor} look={HALE} pose={SIT_FLOOR} lookAt={0.2} holdF={<CoolerBag label={false} />} />
      </Svg>
    </Cam>
  );
};

const LockDoors: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const total = 380;
  const m = walkTo(960, -1, interpolate(frame, [0, 34], [0, total], { extrapolateRight: "clamp", easing: Easing.out(Easing.sin) }), total, { amp: 1.25 });
  const lockT = ramp(frame, 30, 40);
  const press = ramp(frame, 0, 8) * (1 - ramp(frame, 20, 30));
  return (
    <Cam dur={dur} from={1.05} to={1.1} origin="50% 62%" shake={frame > 38 && frame < 46 ? 8 : 0}>
      <Svg>
        <StoreDefs />
        <Checkout door={1 - ramp(frame, 6, 24)} outside={<Crowd f={frame + 140} mode="turn" />} />
        <Stick x={150} floor={SF.floor} look={JUNE} pose={STAND} reach={{ handF: lerp2([200, 1440], REGISTER_BUTTON, press) }} lookAt={0.8} />
        <Counter />
        <Stick x={820} floor={SF.floor} look={HALE} pose={SIT_FLOOR} lookAt={-0.4} holdF={<CoolerBag label={false} />} />
        <Stick x={m.x} floor={SF.floor} facing={-1} look={MARCO} pose={{ ...m.pose, lean: 0.12 }} reach={lockT > 0 ? { handF: lerp2([m.x - 40, 1430], SF.lock, lockT) } : {}} lookAt={0.7} />
      </Svg>
    </Cam>
  );
};

const GlassPound: React.FC<{ dur: number; drift?: boolean }> = ({ dur, drift }) => {
  const frame = useCurrentFrame();
  const bark = drift ? 0 : Math.max(0, Math.sin(frame / 3.5));
  const back = drift ? 0 : ramp(frame, 4, 20);
  const driftT = drift ? ramp(frame, 20, dur) : 0;
  return (
    <Cam dur={dur} from={1.05} to={drift ? 1.0 : 1.12} origin="45% 60%" shake={!drift && frame % 14 < 3 ? 6 : 0}>
      <Svg>
        <StoreDefs />
        <Checkout cracks={drift ? 1 : ramp(frame, 10, 70)} outside={<Crowd f={frame} mode={drift && frame > 20 ? "drift" : "pound"} driftT={driftT} />} />
        <Stick x={200} floor={SF.floor} look={WALT} pose={{ ...STAND, lean: -0.08 * back }} reach={{ handF: [300, 1480] }} lookAt={0.8} />
        <line x1={300} y1={1480} x2={420} y2={1530} stroke="#b3352b" strokeWidth={6} />
        <Dog x={470} floor={SF.floor} wag={0} bark={bark} crouch={drift ? 0 : 0.6} headTilt={drift ? 0.25 * Math.sin(frame / 14) : -0.1} />
        <Stick x={900} floor={SF.floor} facing={-1} look={YOU} pose={{ ...STAND, lean: -0.12 * back, armF: [1.0, 1.3] }} lookAt={0.8} holdF={<PizzaBox />} />
      </Svg>
    </Cam>
  );
};

const JuneRule: React.FC<{ dur: number; cardAt: number }> = ({ dur, cardAt }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Cam dur={dur} from={1.55} to={1.65} origin="22% 64%">
        <Svg>
          <StoreDefs />
          <Checkout cracks={1} outside={<Crowd f={frame + 300} mode="drift" driftT={1} />} />
          <Stick x={170} floor={SF.floor} look={JUNE} pose={{ ...STAND, headTilt: 0.08 * Math.sin(frame / 15), armB: [0.4, 1.5] }} lookAt={0.9} />
          <Counter />
        </Svg>
      </Cam>
      <RuleCard label="RULE NUMBER ONE" text={["KEEP THE", "MUSIC ON"]} at={cardAt} />
    </>
  );
};

const HearingAid: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const w = walkTo(660, 1, interpolate(frame, [0, 40], [0, 170], { extrapolateRight: "clamp", easing: Easing.out(Easing.sin) }), 170, { amp: 0.7 });
  const squeal = frame > 34 && frame < 70;
  const tap = ramp(frame, 60, 70) * (1 - ramp(frame, 90, 100));
  return (
    <Cam dur={dur} from={1.35} to={1.42} origin="74% 52%">
      <Svg>
        <StoreDefs />
        <Checkout cracks={1} outside={<Crowd f={frame + 420} mode="drift" driftT={1} />} />
        <Stick x={w.x} floor={SF.floor} look={WALT} pose={{ ...w.pose, headTilt: squeal ? -0.1 : 0 }} reach={tap > 0 ? { handB: lerp2([w.x - 20, 1430], [w.x - 40, 1135], tap) } : {}} lookAt={0.5} />
        {squeal
          ? [0, 1, 2].map((k) => <path key={k} d={`M${w.x - 70 - k * 18},${1120 - k * 14} q-14,18 0,36`} stroke="#ffe066" strokeWidth={5} fill="none" opacity={0.5 + 0.5 * Math.sin(frame + k)} />)
          : null}
        <Dog x={940} floor={SF.floor} facing={-1} headTilt={squeal ? 0.45 : 0} wag={Math.sin(frame / 4) * 0.3} />
        <line x1={PA_SPEAKER[0]} y1={PA_SPEAKER[1] + 30} x2={PA_SPEAKER[0]} y2={PA_SPEAKER[1] + 30} />
      </Svg>
    </Cam>
  );
};

const IceGag: React.FC<{ dur: number; stopAt: number }> = ({ dur, stopAt }) => {
  const frame = useCurrentFrame();
  const g = Math.min(frame, stopAt);
  const zx = 1120 - 2.6 * g;
  const frozen = frame >= stopAt;
  const frost = ramp(frame, stopAt, stopAt + 30);
  const z = TURNED[2];
  const look = { ...z, body: interpolateColors(frost, [0, 1], [z.body, "#a9c6d8"]), skin: interpolateColors(frost, [0, 1], [z.skin ?? "#8e9a86", "#c9e4f2"]) };
  return (
    <Cam dur={dur} from={1.3} to={1.36} origin="80% 70%">
      <Svg>
        <StoreDefs />
        <Checkout cracks={1} iceFrost={frost} outside={
          <g>
            <Crowd f={frame + 520} mode="drift" driftT={1} />
            <Stick x={zx} floor={SF.floor - 40} scale={0.8} facing={-1} look={look} pose={frozen ? { ...zPose(stopAt, 7), lean: 0.28 } : { ...zPose(frame, 7), ...walk(g / 30, 0.5), armF: [0.9, 0.25], lean: 0.2 }} lookAt={0} />
            <ellipse cx={zx} cy={1300} rx={110} ry={230} fill="url(#coldPool)" opacity={0.8 * frost} />
          </g>
        } />
      </Svg>
    </Cam>
  );
};

const BagHandoff: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const kneel = ramp(frame, 0, 16);
  const give = ramp(frame, 22, 40);
  const passed = frame >= 44;
  const meet: [number, number] = [640, 1505];
  const youHand = lerp2(lerp2([500, 1440], meet, give), [520, 1480], ramp(frame, 50, 66));
  const haleHand = lerp2([760, 1520], meet, give * (passed ? 1 - ramp(frame, 46, 60) : 1));
  return (
    <Cam dur={dur} from={1.5} to={1.58} origin="58% 72%">
      <Svg>
        <StoreDefs />
        <Checkout cracks={1} outside={<Crowd f={frame + 640} mode="drift" driftT={1} />} />
        <Stick x={790} floor={SF.floor} facing={-1} look={HALE} pose={SIT_FLOOR} reach={{ handF: haleHand }} lookAt={0} holdF={passed ? undefined : <CoolerBag />} />
        <Stick x={480} floor={SF.floor} look={YOU} pose={lerpPose(STAND, KNEEL, kneel)} reach={{ handF: youHand }} lookAt={0.7} holdF={passed ? <CoolerBag /> : undefined} />
      </Svg>
    </Cam>
  );
};

const Shaking: React.FC<{ dur: number; marcoAt: number }> = ({ dur, marcoAt }) => {
  const frame = useCurrentFrame();
  const jit = (random(`hj${frame}`) - 0.5) * 8;
  const grey = ramp(frame, 0, dur);
  const scratch = Math.sin(frame / 2.2) * 10;
  const look = { ...HALE, skin: interpolateColors(grey, [0, 1], [C.skin, "#c9d0bf"]) };
  return (
    <Cam dur={dur} from={1.15} to={1.24} origin="42% 66%">
      <Svg>
        <StoreDefs />
        <Checkout cracks={1} outside={<Crowd f={frame + 780} mode="drift" driftT={1} />} />
        <Stick x={840 + jit} floor={SF.floor} facing={-1} look={look} pose={{ ...SIT_FLOOR, headTilt: 0.2 }} lookAt={0} />
        <Stick x={450} floor={SF.floor} look={YOU} pose={KNEEL} lookAt={0.7} holdF={<CoolerBag />} />
        <Stick x={200} floor={SF.floor} look={MARCO} pose={{ ...STAND, lean: -0.08 * ramp(frame, marcoAt, marcoAt + 12) }} reach={frame >= marcoAt ? { handF: [250 + scratch, 1440], handB: [240, 1450] } : {}} lookAt={0.8} />
      </Svg>
    </Cam>
  );
};

const BackRoomPoint: React.FC<{ dur: number; who: "marco" | "june"; three?: boolean }> = ({ dur, who, three }) => {
  const frame = useCurrentFrame();
  const point = ramp(frame, 4, 14);
  // Marco stands at the freezer (left), June at the loading bay (right); YOU kneel with Hale in the middle.
  const marcoReach = who === "marco" && !three ? { handF: lerp2([330, 1430], [110, 1230], point) } : {};
  const juneReach = who === "june" && !three ? { handF: lerp2([910, 1430], [1075, 1230], point) } : {};
  return (
    <Cam dur={dur} from={three ? 1.0 : 1.18} to={three ? 1.05 : 1.25} origin={three ? "50% 60%" : who === "marco" ? "30% 62%" : "72% 62%"}>
      <Svg>
        <StoreDefs />
        <BackRoom />
        <Stick x={300} floor={SF.floor} facing={three ? 1 : -1} look={MARCO} pose={STAND} reach={marcoReach} lookAt={0.7} />
        <Stick x={440} floor={SF.floor} look={YOU} pose={KNEEL} lookAt={0.6} holdF={<CoolerBag />} />
        <Stick x={770} floor={SF.floor} facing={-1} look={HALE} pose={SIT_FLOOR} lookAt={0.3} />
        <Stick x={910} floor={SF.floor} facing={three ? -1 : 1} look={JUNE} pose={STAND} reach={juneReach} lookAt={0.7} />
        <Dog x={1010} floor={SF.floor} facing={-1} crouch={0.3} wag={0} scale={0.85} />
      </Svg>
    </Cam>
  );
};

const HaleClose: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const veins = ramp(frame, 0, dur);
  return (
    <>
      <Blurred px={16} dim={0.4}>
        <Svg>
          <StoreDefs />
          <BackRoom />
        </Svg>
      </Blurred>
      <Cam dur={dur} from={1} to={1.07} origin="50% 45%">
        <Svg bg="transparent">
          <Stick x={560} floor={2440} scale={2.6} facing={-1} look={{ ...HALE, skin: "#d3d8c8" }} pose={{ ...STAND, headTilt: 0.06 * Math.sin(frame / 10) }} lookAt={0} />
          {[0, 1, 2, 3].map((k) => (
            <path key={k} d={`M${520 + k * 26},1420 q${-10 + k * 6},-60 ${4 + k * 3},-110 q${8 + k * 4},-40 ${18 + k * 6},-70`} stroke="#5b4a6b" strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={260} strokeDashoffset={260 * (1 - veins)} opacity={0.75} />
          ))}
        </Svg>
      </Cam>
    </>
  );
};

// ---------- shot list ----------
interface Shot {
  at: number;
  place: string;
  render: (dur: number) => React.ReactNode;
}
const SHOTS: Shot[] = [
  { at: 0, place: "FRESHCO · AISLE 7", render: (d) => <FrozenPizza dur={d} /> },
  { at: st(2), place: "FRESHCO · CHECKOUT", render: (d) => <NightCrew dur={d} /> },
  { at: st(3), place: "FRESHCO · CHECKOUT", render: (d) => <HaleArrives dur={d} /> },
  { at: st(4), place: "FRESHCO · CHECKOUT", render: (d) => <LotTurns dur={d} /> },
  { at: st(5), place: "FRESHCO · CHECKOUT", render: (d) => <LockDoors dur={d} /> },
  { at: st(6), place: "FRESHCO · CHECKOUT", render: (d) => <GlassPound dur={d} /> },
  { at: st(7), place: "FRESHCO · CHECKOUT", render: (d) => <GlassPound dur={d} drift /> },
  { at: st(8), place: "FRESHCO · CHECKOUT", render: (d) => <JuneRule dur={d} cardAt={wf(8, 0) - st(8)} /> },
  { at: st(9), place: "FRESHCO · CHECKOUT", render: (d) => <HearingAid dur={d} /> },
  { at: st(10), place: "FRESHCO · CHECKOUT", render: (d) => <IceGag dur={d} stopAt={wf(10, 10) - st(10)} /> },
  { at: st(11), place: "FRESHCO · CHECKOUT", render: (d) => <BagHandoff dur={d} /> },
  { at: st(12), place: "FRESHCO · CHECKOUT", render: (d) => <Shaking dur={d} marcoAt={wf(12, 4) - st(12)} /> },
  { at: st(13), place: "FRESHCO · BACK ROOM", render: (d) => <BackRoomPoint dur={d} who="marco" /> },
  { at: st(14), place: "FRESHCO · BACK ROOM", render: (d) => <BackRoomPoint dur={d} who="june" /> },
  { at: st(15), place: "FRESHCO · BACK ROOM", render: (d) => <HaleClose dur={d} /> },
  { at: st(16), place: "FRESHCO · BACK ROOM", render: (d) => <BackRoomPoint dur={d} who="june" three /> },
];

/** [file, frame, volume, optional max length] */
const SFX: [string, number, number, number?][] = [
  ["fc-door-chime", st(3), 0.55], ["fc-groan-1", st(3) + 50, 0.35], ["fc-groans", st(4), 0.4],
  ["fc-lock", st(5) + 38, 0.7], ["fc-groans", st(6), 0.55], ["fc-glass-thuds", st(6) + 4, 0.6], ["fc-glass-crack", st(6) + 34, 0.5],
  ["fc-bark", st(6) + 8, 0.5], ["fc-bark", st(6) + 50, 0.45], ["fc-growl", st(7), 0.3],
  ["card-slam", wf(8, 0), 0.5], ["fc-feedback", st(9) + 34, 0.4], ["fc-groan-1", st(10) + 10, 0.3], ["tick", wf(10, 10), 0.5],
  ["heartbeat", st(11), 0.35], ["sub-hit", wf(12, 5), 0.5], ["fc-freezer-hum", st(13), 0.25], ["heartbeat", st(15), 0.45],
  ["whoosh", wf(16, 2), 0.4], ["whoosh", wf(16, 8), 0.4], ["card-slam", st(17), 0.5],
];
const JINGLE_LOOP = 514;
/** Jingle level over the whole episode: under the voices, swells at "the store music gets louder", quieter in the back room. */
const jingleLevel = (f: number) =>
  interpolate(f, [0, 20, st(7), wf(7, 3), wf(7, 10) + 30, st(8) + 20, st(13) - 10, st(13) + 10, FC1_TOTAL - 30, FC1_TOTAL], [0, 0.16, 0.16, 0.5, 0.5, 0.18, 0.18, 0.07, 0.07, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const FreshCoP1: React.FC = () => {
  const frame = useCurrentFrame();
  const shotIdx = SHOTS.findIndex((s, i) => frame >= s.at && (i === SHOTS.length - 1 || frame < SHOTS[i + 1].at));
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {SHOTS.map((s, i) => {
        const end = i === SHOTS.length - 1 ? FC1_TOTAL : SHOTS[i + 1].at;
        return (
          <Sequence key={i} from={s.at} durationInFrames={end - s.at}>
            {s.render(end - s.at)}
          </Sequence>
        );
      })}
      <Sequence from={st(16)}>
        <ChoiceCards a="LOCK HIM IN THE FREEZER" b="PUT HIM OUTSIDE" aAt={wf(16, 2) - st(16)} bAt={wf(16, 8) - st(16)} followAt={st(17) - st(16)} part={2} />
      </Sequence>
      <Vignette strength={0.6} />
      <ZombieHud day={1} time={clockAt(frame)} place={SHOTS[Math.max(0, shotIdx)].place} music />
      <Captions lines={CAPS} lowFrom={wf(16, 2)} />

      {WORDS.map((_, i) => (
        <Sequence key={`v${i}`} from={START[i]}>
          <Audio src={staticFile(`audio/voice/fc1-${String(i + 1).padStart(2, "0")}.wav`)} />
        </Sequence>
      ))}
      {/* Store PA jingle: always on (Rule 1). Swells when it saves them (line 7), dips in the back room. */}
      {Array.from({ length: Math.ceil(FC1_TOTAL / JINGLE_LOOP) }).map((_, i) => (
        <Sequence key={`j${i}`} from={i * JINGLE_LOOP} durationInFrames={JINGLE_LOOP}>
          <Audio src={staticFile("audio/music/fc-jingle-pa.wav")} volume={(f) => jingleLevel(f + i * JINGLE_LOOP)} />
        </Sequence>
      ))}
      <Audio src={staticFile("audio/music/drone.wav")} volume={(f) => interpolate(f, [0, st(3), st(3) + 30, FC1_TOTAL - 30, FC1_TOTAL], [0, 0, 0.14, 0.14, 0], { extrapolateRight: "clamp" })} />
      {SFX.map(([name, at, vol, len], i) => (
        <Sequence key={`s${i}`} from={at} durationInFrames={len}>
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
