import type { Caption } from "@remotion/captions";
import React from "react";
import { AbsoluteFill, type CalculateMetadataFunction, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Cam, Captions, type CapLine, Vignette } from "../kit/Overlays";
import { STAND, Stick, StickDefs, walk, walkCycle, YOU } from "../kit/Stick";
import { C, FONT } from "../kit/style";

/**
 * Format-agnostic starter for cloning ANY video format (explainer, listicle, story, quiz, skit, kinetic text…).
 * Renders in vertical, horizontal or square: `--props='{"format":"horizontal"}'`.
 * Copy this file to src/stories/<name>/, replace SCENES and LINES, keep the pattern:
 * every scene is a function of its local frame, sized from useVideoConfig(), nothing hard-coded to 1080x1920.
 */
export type Format = "vertical" | "horizontal" | "square";
const SIZES: Record<Format, [number, number]> = { vertical: [1080, 1920], horizontal: [1920, 1080], square: [1080, 1080] };
export const starterMetadata: CalculateMetadataFunction<{ format: Format }> = ({ props }) => {
  const [width, height] = SIZES[props.format];
  return { width, height };
};

/** Captions without a voice file: evenly paced words (swap for the JSON from scripts/voiceover.mjs once you have audio). */
export const textCaptions = (text: string, wordsPerSec = 2.6): Caption[] =>
  text.split(/\s+/).map((w, i) => {
    const startMs = Math.round((i / wordsPerSec) * 1000);
    const endMs = Math.round(((i + 1) / wordsPerSec) * 1000);
    return { text: (i ? " " : "") + w, startMs, endMs, timestampMs: (startMs + endMs) / 2, confidence: null };
  });

const LINES = [
  { at: 0, text: "Give Claude any video you like.", yellow: ["VIDEO"] },
  { at: 90, text: "It studies the cuts, colours and sound.", yellow: ["CUTS", "COLOURS", "SOUND"] },
  { at: 195, text: "Then rebuilds the format with your story.", yellow: ["FORMAT", "STORY"] },
];
export const STARTER_TOTAL = 300;

/** SVG canvas in the composition's own pixel space, whatever the aspect ratio. */
const Canvas: React.FC<{ children?: React.ReactNode; bg?: string }> = ({ children, bg = "#1d1712" }) => {
  const { width, height } = useVideoConfig();
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ position: "absolute", inset: 0, background: bg }}>
      <StickDefs />
      {children}
    </svg>
  );
};

const Title: React.FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const s = spring({ frame, fps, config: { stiffness: 260, damping: 12 } });
  const size = Math.min(width, height) * 0.13;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: FONT.title, fontSize: size, color: "white", transform: `scale(${s}) rotate(-4deg)`, textAlign: "center", lineHeight: 1 }}>
        {text} <span style={{ color: C.capYellow }}>{accent}</span>
      </div>
    </AbsoluteFill>
  );
};

const WalkScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const scale = Math.min(width / 900, height / 1100); // big enough in every aspect
  const floor = height * 0.7; // captions sit at 74%, below the feet
  const x = interpolate(frame, [0, dur], [width * 0.2, width * 0.75]);
  return (
    <Cam dur={dur}>
      <Canvas>
        <rect x={0} y={floor} width={width} height={height - floor} fill="#0e0b08" />
        <Stick x={x} floor={floor} scale={scale} look={YOU} pose={walk((x - width * 0.2) / walkCycle(0.9, scale), 0.9)} />
      </Canvas>
    </Cam>
  );
};

const ListScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const items = ["Cuts & pacing", "Palette & type", "Voice & sound"];
  const size = Math.min(width, height) * 0.075;
  return (
    <AbsoluteFill style={{ background: "#1d1712", justifyContent: "center", paddingLeft: width * 0.12 }}>
      {items.map((t, i) => {
        const s = spring({ frame: frame - i * 18, fps, config: { stiffness: 300, damping: 15 } });
        return (
          <div key={t} style={{ fontFamily: FONT.title, fontSize: size, color: "white", opacity: s, transform: `translateX(${(1 - s) * -80}px)`, margin: `${size * 0.2}px 0` }}>
            <span style={{ color: C.capYellow }}>{i + 1}.</span> {t.toUpperCase()}
          </div>
        );
      })}
      <div style={{ position: "absolute", right: width * 0.08, bottom: height * 0.08 }}>
        <svg width={height * 0.3} height={height * 0.3} viewBox="0 0 400 400">
          <StickDefs />
          <Stick x={200} floor={390} scale={0.55} look={YOU} pose={{ ...STAND, armF: [2.4, 0.3] }} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

export const Starter: React.FC<{ format: Format }> = () => {
  const caps: CapLine[] = LINES.map((l, i) => ({ start: l.at, end: LINES[i + 1]?.at ?? STARTER_TOTAL, words: textCaptions(l.text), yellow: l.yellow }));
  return (
    <AbsoluteFill style={{ background: "black" }}>
      <Sequence durationInFrames={90}>
        <Canvas />
        <Title text="ANY" accent="VIDEO" />
      </Sequence>
      <Sequence from={90} durationInFrames={105}>
        <WalkScene dur={105} />
      </Sequence>
      <Sequence from={195}>
        <ListScene />
      </Sequence>
      <Vignette strength={0.5} />
      <Captions lines={caps} />
    </AbsoluteFill>
  );
};
