import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Dog } from "../../kit/Dog";
import { makeDuck } from "../../kit/mix";
import { Blurred, Cam, Captions, type CapLine, ChoiceCards, MostOfYouSaid, RuleCard, Vignette } from "../../kit/Overlays";
import { HALE, JUNE, lerpPose, MARCO, type Pose, STAND, Stick, TURNED, walk, walkCycle, WALT, YOU } from "../../kit/Stick";
import { DayTitle, ZombieHud } from "../../kit/ZombieHud";
import { Svg } from "../../sets/Sets";
import { Axe, BackRoom, Checkout, CoolerBag, DockDawn, Keys, Office, SF, StoreDefs, VAN_KEYS } from "../../sets/Store";
import w01 from "../../../public/captions/fc2-01.json";
import w02 from "../../../public/captions/fc2-02.json";
import w03 from "../../../public/captions/fc2-03.json";
import w04 from "../../../public/captions/fc2-04.json";
import w05 from "../../../public/captions/fc2-05.json";
import w06 from "../../../public/captions/fc2-06.json";
import w07 from "../../../public/captions/fc2-07.json";
import w08 from "../../../public/captions/fc2-08.json";
import w09 from "../../../public/captions/fc2-09.json";
import w10 from "../../../public/captions/fc2-10.json";
import w11 from "../../../public/captions/fc2-11.json";
import w12 from "../../../public/captions/fc2-12.json";
import w13 from "../../../public/captions/fc2-13.json";
import w14 from "../../../public/captions/fc2-14.json";
import w15 from "../../../public/captions/fc2-15.json";

// ---------- timeline (script.md PART 2, path B "put him outside") ----------
const WORDS: Caption[][] = [w01, w02, w03, w04, w05, w06, w07, w08, w09, w10, w11, w12, w13, w14, w15];
const LEN: [number, number][] = [
  [97, 28], [223, 8], [157, 20], [178, 10], [132, 8], [141, 12], [57, 8], [150, 16], [170, 8], [263, 12],
  [162, 20], [130, 10], [186, 10], [210, 40], [56, 45],
];
const START = LEN.reduce<number[]>((acc, [l, g], i) => [...acc, acc[i] + l + g], [0]);
export const FC2B_TOTAL = START[LEN.length];
const st = (n: number) => START[n - 1];
const wf = (n: number, i: number) => st(n) + Math.round((WORDS[n - 1][i].startMs / 1000) * 30);

const YELLOW: string[][] = [
  ["PUT", "OUTSIDE."], ["LOADING", "WON'T", "BAG."], ["DOWN.", "NOBODY"], ["TWO.", "THREE", "STUTTER."], ["DRY.", "MUSIC", "DIES."],
  ["HOLLIS", "STADIUM.", "FIFTY"], ["RADIO'S", "DEAD,"], ["FIFTY", "EVENTUALLY."], ["SUNRISE,", "BAG,", "VAN."], ["CRAWL", "HALE.", "FROZEN", "BARELY"],
  ["ANTIDOTE", "COLD.", "CURE."], ["SUN", "FASTER."], ["THIRTY", "TEN"], ["VAN", "NOW,", "WAIT", "NIGHT,"], ["PART", "THREE."],
];
const CAPS: CapLine[] = WORDS.map((words, i) => ({ start: START[i], end: START[i + 1], words, yellow: YELLOW[i] }));
/** Background beds duck under every spoken line (fixes "background noise too loud" from Part 1). */
const duck = makeDuck(LEN.map(([l], i) => [START[i], START[i] + l] as [number, number]), 0.3, 8);

const DAY2 = st(4);
const SUNRISE = st(9);
const clockAt = (f: number) => {
  const mins = f < DAY2 ? interpolate(f, [0, DAY2], [10, 22]) : f < SUNRISE ? interpolate(f, [DAY2, SUNRISE], [180, 205]) : interpolate(f, [SUNRISE, FC2B_TOTAL], [402, 455]);
  const m = Math.floor(mins);
  const h = Math.floor(m / 60);
  return `${h === 0 ? 12 : h}:${String(m % 60).padStart(2, "0")} AM`;
};

// ---------- helpers ----------
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
const lerp2 = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const KNEEL: Pose = { ...STAND, legF: [1.4, 2.4], legB: [0.2, 1.9], lean: 0.15 };
const zPose = (f: number, k: number, slow = 1): Pose => ({
  ...STAND,
  armF: [0.85 + 0.12 * Math.sin((f / 13) * slow + k), 0.25],
  armB: [0.75 + 0.12 * Math.sin((f / 11) * slow + k * 2), 0.3],
  lean: 0.16,
  headTilt: 0.32 * Math.sin((f / 29) * slow + k * 1.7),
});
const TURNED_HALE = { ...HALE, skin: "#8e9a86", blankEyes: true, glasses: true };

// ---------- shots ----------
const Part1Tail: React.FC = () => (
  <Blurred px={10} dim={0.5}>
    <Svg>
      <StoreDefs />
      <BackRoom />
      <Stick x={300} floor={SF.floor} look={MARCO} pose={STAND} lookAt={0.7} />
      <Stick x={440} floor={SF.floor} look={YOU} pose={KNEEL} lookAt={0.6} holdF={<CoolerBag />} />
      <Stick x={770} floor={SF.floor} facing={-1} look={HALE} pose={{ ...STAND, legF: [Math.PI / 2, 0.15], legB: [Math.PI / 2 - 0.15, 0.25], lean: -0.15 }} lookAt={0.3} />
      <Stick x={910} floor={SF.floor} facing={-1} look={JUNE} pose={STAND} lookAt={0.7} />
    </Svg>
  </Blurred>
);

/** Shutter up; Hale walks out into the dark clutching the bag. `close` brings it back down. */
const PutOutside: React.FC<{ dur: number; close?: boolean }> = ({ dur, close }) => {
  const frame = useCurrentFrame();
  const open = close ? 1 - ramp(frame, 0, 44) : ramp(frame, 8, 56);
  const out = close ? 1 : ramp(frame, 50, dur);
  const hx = 770 + 140 * out;
  const sad = close ? ramp(frame, 50, 80) : 0;
  const outside = (
    <g>
      <rect x={645} y={685} width={380} height={760} fill="#0f1726" />
      <rect x={720} y={1180} width={300} height={140} rx={20} fill="#2b3036" />
      <Stick x={hx} floor={SF.floor - 30 * out} scale={0.95 - 0.2 * out} look={{ ...HALE, skin: "#c9d0bf" }} pose={{ ...walk(out * 3, 0.6), lean: 0.2 }} lookAt={0.3} holdF={<CoolerBag />} />
    </g>
  );
  return (
    <Cam dur={dur} from={1.1} to={1.18} origin="60% 62%">
      <Svg>
        <StoreDefs />
        <BackRoom shutterOpen={open} outside={outside} />
        <Stick x={160} floor={SF.floor} look={JUNE} pose={STAND} lookAt={0.8} />
        <Stick x={370} floor={SF.floor} look={YOU} pose={{ ...STAND, headTilt: 0.2 * sad }} lookAt={0.8} />
        <Stick x={570} floor={SF.floor} look={WALT} pose={{ ...STAND, headTilt: 0.15 * sad }} lookAt={0.8} />
        <Dog x={470} floor={SF.floor} scale={0.62} crouch={0.4 + 0.4 * sad} headTilt={0.2 * sad} />
      </Svg>
    </Cam>
  );
};

/** Day 2, 3 AM: generator dying, lights flicker, June by the fuel gauge. */
const Generator: React.FC<{ dur: number; june?: boolean }> = ({ dur, june }) => {
  const frame = useCurrentFrame();
  const flick = random(`gf${Math.floor(frame / 3)}`) > 0.25;
  const point = june ? ramp(frame, 6, 18) : 0;
  return (
    <>
      <Cam dur={dur} from={june ? 1.35 : 1.15} to={june ? 1.42 : 1.22} origin="52% 76%">
        <Svg>
          <StoreDefs />
          <BackRoom generator={0.12} lights={flick} />
          <Stick x={380} floor={SF.floor} look={JUNE} pose={STAND} reach={point > 0 ? { handF: lerp2([420, 1430], [540, 1470], point) } : {}} lookAt={0.8} />
          <Stick x={780} floor={SF.floor} facing={-1} look={YOU} pose={STAND} lookAt={0.6} />
          {!flick ? <rect width={1080} height={1920} fill="#000" opacity={0.35} /> : null}
        </Svg>
      </Cam>
      {june ? null : <DayTitle day={2} at={2} />}
    </>
  );
};

/** Marco's office: secretly listening to the radio; June bursts in. */
const OfficeScene: React.FC<{ dur: number; burst?: boolean; keys?: boolean }> = ({ dur, burst, keys }) => {
  const frame = useCurrentFrame();
  const door = burst ? ramp(frame, 0, 8) : keys ? 1 : 0;
  const hunch: Pose = { ...STAND, lean: 0.45, armF: [1.2, 0.6], armB: [1.1, 0.7] };
  const caught: Pose = { ...STAND, lean: -0.05, armF: [0.9, 1.6], armB: [0.8, 1.7] };
  const marcoPose = burst || keys ? lerpPose(hunch, caught, burst ? ramp(frame, 4, 14) : 1) : hunch;
  const glint = keys ? 0.5 + 0.5 * Math.sin(frame / 3) : 0;
  return (
    <Cam dur={dur} from={keys ? 1.35 : 1.12} to={keys ? 1.45 : 1.2} origin={keys ? "70% 72%" : "50% 70%"} shake={burst && frame < 8 ? 10 : 0}>
      <Svg>
        <StoreDefs />
        <Office door={door} />
        <Stick x={520} floor={SF.floor} look={MARCO} pose={marcoPose} lookAt={burst || keys ? -0.7 : 0.9} />
        {burst || keys ? <Stick x={240} floor={SF.floor} look={JUNE} pose={{ ...STAND, armB: [0.5, 1.6], armF: [0.4, 1.7] }} lookAt={0.9} /> : null}
        {keys ? <circle cx={VAN_KEYS[0]} cy={VAN_KEYS[1]} r={40 + 20 * glint} fill="url(#warmPool)" opacity={0.9} /> : null}
      </Svg>
    </Cam>
  );
};

/** Dawn outside the loading dock: the bag under the van, turned Hale frozen-slow beside it. */
const DawnBag: React.FC<{ dur: number; crawl?: boolean; cardAt?: number }> = ({ dur, crawl, cardAt }) => {
  const frame = useCurrentFrame();
  const slow = 0.25;
  // YOU crawl from the shutter to the van, grab the bag, and back off.
  const go = crawl ? ramp(frame, 10, 150) : 0;
  const back = crawl ? ramp(frame, 175, 230) : 0;
  const x = 260 + 470 * go - 380 * back;
  const sw = Math.sin(frame / 5);
  const hip: [number, number] = [x, SF.floor - 115];
  const reachBag = crawl ? ramp(frame, 150, 168) * (1 - ramp(frame, 172, 180)) : 0;
  const hasBag = crawl && frame >= 170;
  const turn = crawl ? ramp(frame, 60, 220) : 0;
  return (
    <>
      <Cam dur={dur} from={crawl ? 1.05 : 1.15} to={crawl ? 1.12 : 1.3} origin={crawl ? "55% 74%" : "70% 78%"}>
        <Svg>
          <StoreDefs />
          <DockDawn bag={!hasBag}>
            <Stick x={980} floor={SF.floor} facing={-1} look={{ ...TURNED_HALE, body: "#cfd8de" }} pose={{ ...zPose(frame, 3, slow), armF: [0.85 + 0.7 * turn, 0.2], lean: 0.18 }} lookAt={0.3 * turn} />
            <ellipse cx={980} cy={1350} rx={100} ry={240} fill="#dff3ff" opacity={0.25} />
            {crawl ? (
              <Stick
                x={0} floor={0} hip={hip} facing={back > 0 ? -1 : 1} look={YOU} pose={{ ...STAND, lean: 1.2, headTilt: -0.6 }} lookAt={0.8}
                reach={{
                  handF: reachBag > 0 ? lerp2([x + 140, SF.floor - 6], [800, 1590], reachBag) : [x + (back > 0 ? -140 : 140) + 20 * sw, SF.floor - 6],
                  handB: [x + (back > 0 ? -110 : 110) - 20 * sw, SF.floor - 6],
                  footF: [x + (back > 0 ? 130 : -130), SF.floor - 6],
                  footB: [x + (back > 0 ? 170 : -170), SF.floor - 6],
                }}
                holdF={hasBag ? <g transform="scale(0.7)"><CoolerBag /></g> : undefined}
              />
            ) : null}
          </DockDawn>
          <rect width={1080} height={1920} fill="#ffe2c0" opacity={0.08} />
        </Svg>
      </Cam>
      {cardAt != null ? <RuleCard label="RULE NUMBER TWO" text={["COLD", "SLOWS THEM"]} at={cardAt} /> : null}
    </>
  );
};

const ReadLabel: React.FC<{ dur: number }> = ({ dur }) => (
  <Cam dur={dur} from={1.45} to={1.6} origin="45% 72%">
    <Svg>
      <StoreDefs />
      <BackRoom generator={0.08} />
      <Stick x={460} floor={SF.floor} look={JUNE} pose={{ ...STAND, armF: [1.1, 1.0], headTilt: 0.25 }} lookAt={0.3} holdF={<CoolerBag />} />
      <Stick x={700} floor={SF.floor} facing={-1} look={YOU} pose={STAND} lookAt={0.6} />
    </Svg>
  </Cam>
);

/** Daylight through the glass: the Turned are warmer and faster now. */
const Daylight: React.FC<{ dur: number; three?: boolean }> = ({ dur, three }) => {
  const frame = useCurrentFrame();
  const zs = [120, 300, 470, 650, 1000];
  const outside = (
    <g>
      {zs.map((x0, i) => {
        const dist = (frame * (3.2 + random(`dz${i}`) * 2) + i * 200) % 1300;
        const x = x0 + (i % 2 ? dist : -dist) * 0.25;
        const jit = (random(`dj${i}${Math.floor(frame / 2)}`) - 0.5) * 0.25;
        return <Stick key={i} x={((x % 1200) + 1200) % 1200 - 60} floor={SF.lot + (i % 2) * 90} scale={i % 2 ? 0.6 : 0.42} facing={i % 2 ? 1 : -1} look={TURNED[i % TURNED.length]} pose={{ ...zPose(frame * 1.6, i), ...walk(dist / walkCycle(0.8, 0.5), 0.8), armF: [1.1, 0.2], lean: 0.25 + jit }} lookAt={0} />;
      })}
    </g>
  );
  return (
    <Cam dur={dur} from={three ? 1.0 : 1.2} to={three ? 1.05 : 1.3} origin="50% 66%">
      <Svg>
        <StoreDefs />
        <Checkout day cracks={1} outside={outside} />
        {three ? (
          <g>
            <Stick x={110} floor={SF.floor} look={MARCO} pose={{ ...STAND, armF: [0.9, 1.3] }} lookAt={0.8} holdF={<Keys />} />
            <Stick x={330} floor={SF.floor} look={JUNE} pose={{ ...STAND, armF: [0.1, 0.1] }} lookAt={0.8} holdF={<g transform="rotate(150)"><Axe /></g>} />
            <Stick x={560} floor={SF.floor} look={YOU} pose={{ ...STAND, armF: [0.08, 0.05] }} lookAt={0.8} holdF={<g transform="scale(0.8)"><CoolerBag /></g>} />
            <Stick x={790} floor={SF.floor} facing={-1} look={WALT} pose={{ ...STAND, armF: [0.35, 0.2] }} lookAt={-0.6} />
            <Dog x={960} floor={SF.floor} facing={-1} scale={0.8} wag={0} crouch={0.3} />
          </g>
        ) : null}
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
  { at: 0, place: "FRESHCO · BACK ROOM", render: () => (<><Part1Tail /><MostOfYouSaid a="LOCK HIM IN THE FREEZER" b="PUT HIM OUTSIDE" winner="B" decideAt={wf(1, 5)} /></>) },
  { at: st(2), place: "FRESHCO · LOADING BAY", render: (d) => <PutOutside dur={d} /> },
  { at: st(3), place: "FRESHCO · LOADING BAY", render: (d) => <PutOutside dur={d} close /> },
  { at: st(4), place: "FRESHCO · BACK ROOM", render: (d) => <Generator dur={d} /> },
  { at: st(5), place: "FRESHCO · BACK ROOM", render: (d) => <Generator dur={d} june /> },
  { at: st(6), place: "FRESHCO · OFFICE", render: (d) => <OfficeScene dur={d} /> },
  { at: st(7), place: "FRESHCO · OFFICE", render: (d) => <OfficeScene dur={d} burst /> },
  { at: st(8), place: "FRESHCO · OFFICE", render: (d) => <OfficeScene dur={d} keys /> },
  { at: st(9), place: "FRESHCO · LOADING DOCK", render: (d) => <DawnBag dur={d} /> },
  { at: st(10), place: "FRESHCO · LOADING DOCK", render: (d) => <DawnBag dur={d} crawl cardAt={wf(10, 15) - st(10)} /> },
  { at: st(11), place: "FRESHCO · BACK ROOM", render: (d) => <ReadLabel dur={d} /> },
  { at: st(12), place: "FRESHCO · CHECKOUT", render: (d) => <Daylight dur={d} /> },
  { at: st(13), place: "FRESHCO · CHECKOUT", render: (d) => <Daylight dur={d} three /> },
];

/** [file, frame, volume, optional max length] — one-shot hits; continuous beds are ducked below. */
const SFX: [string, number, number, number?][] = [
  ["whoosh", wf(1, 5), 0.4], ["sparkle", wf(1, 5) + 6, 0.3], ["card-slam", wf(1, 5) + 6, 0.35],
  ["fc-shutter", st(2) + 8, 0.45], ["fc-shutter", st(3), 0.45], ["fc-generator", st(4) + 10, 0.35], ["fc-generator", st(5) + 40, 0.3],
  ["fc-lock", st(7), 0.55], ["sub-hit", wf(8, 8), 0.35], ["fc-scuff", st(10) + 20, 0.4], ["fc-scuff", st(10) + 90, 0.4],
  ["heartbeat", st(10) + 40, 0.35], ["fc-groan-1", st(10) + 70, 0.25], ["card-slam", wf(10, 15), 0.45], ["sub-hit", wf(11, 10), 0.4],
  ["fc-groans", st(12) + 10, 0.25], ["whoosh", wf(14, 2), 0.35], ["whoosh", wf(14, 8), 0.35], ["card-slam", st(15), 0.45],
];
const JINGLE_LOOP = 514;
/** Music: clean jingle on Day 1, warped/stuttering jingle once the generator is dying, faint outdoors at dawn. */
const jingleLevel = (f: number) =>
  (f < DAY2 ? interpolate(f, [0, 20, st(2), st(2) + 20], [0, 0.1, 0.1, 0.06], { extrapolateRight: "clamp" }) : f < SUNRISE ? 0 : f < st(11) ? 0.04 : 0.08) * duck(f);
const warpedLevel = (f: number) => (f >= DAY2 && f < SUNRISE ? 0.12 : f >= st(11) ? 0.08 : 0) * duck(f);

export const FreshCoP2B: React.FC = () => {
  const frame = useCurrentFrame();
  const shotIdx = SHOTS.findIndex((s, i) => frame >= s.at && (i === SHOTS.length - 1 || frame < SHOTS[i + 1].at));
  const gen = frame >= DAY2 ? Math.round(interpolate(frame, [DAY2, FC2B_TOTAL], [12, 4])) : null;
  const stutter = frame >= DAY2 && random(`st${Math.floor(frame / 9)}`) < 0.2;
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {SHOTS.map((s, i) => {
        const end = i === SHOTS.length - 1 ? FC2B_TOTAL : SHOTS[i + 1].at;
        return (
          <Sequence key={i} from={s.at} durationInFrames={end - s.at}>
            {s.render(end - s.at)}
          </Sequence>
        );
      })}
      <Sequence from={st(13)}>
        <ChoiceCards a="RUN FOR THE VAN NOW" b="WAIT FOR NIGHT" aAt={wf(14, 2) - st(13)} bAt={wf(14, 8) - st(13)} followAt={st(15) - st(13)} part={3} />
      </Sequence>
      <Vignette strength={0.6} />
      <ZombieHud day={frame >= DAY2 ? 2 : 1} time={clockAt(frame)} place={SHOTS[Math.max(0, shotIdx)].place} music={!stutter} extra={gen != null ? `GENERATOR ${gen}%` : undefined} />
      <Captions lines={CAPS} lowFrom={wf(14, 2)} />

      {WORDS.map((_, i) => (
        <Sequence key={`v${i}`} from={START[i]}>
          <Audio src={staticFile(`audio/voice/fc2-${String(i + 1).padStart(2, "0")}.wav`)} />
        </Sequence>
      ))}
      <Sequence from={st(6)} durationInFrames={LEN[5][0] + 10}>
        <Audio src={staticFile("audio/sfx/fc-radio-static.wav")} volume={0.12} />
      </Sequence>
      {Array.from({ length: Math.ceil(FC2B_TOTAL / JINGLE_LOOP) }).map((_, i) => (
        <Sequence key={`j${i}`} from={i * JINGLE_LOOP} durationInFrames={JINGLE_LOOP}>
          <Audio src={staticFile("audio/music/fc-jingle-pa.wav")} volume={(f) => jingleLevel(f + i * JINGLE_LOOP)} />
          <Audio src={staticFile("audio/music/fc-jingle-warped.wav")} volume={(f) => warpedLevel(f + i * JINGLE_LOOP)} />
        </Sequence>
      ))}
      <Sequence from={SUNRISE} durationInFrames={st(11) - SUNRISE}>
        <Audio src={staticFile("audio/sfx/fc-wind.wav")} volume={(f) => 0.18 * duck(f + SUNRISE)} />
      </Sequence>
      <Audio src={staticFile("audio/music/drone.wav")} volume={(f) => interpolate(f, [0, 30, FC2B_TOTAL - 30, FC2B_TOTAL], [0, 0.1, 0.1, 0], { extrapolateRight: "clamp" }) * duck(f)} />
      {SFX.map(([name, at, vol, len], i) => (
        <Sequence key={`s${i}`} from={at} durationInFrames={len}>
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

