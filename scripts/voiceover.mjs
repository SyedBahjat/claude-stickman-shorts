#!/usr/bin/env node
/**
 * Make one voice line + word-timed captions for Remotion.
 *
 *   node scripts/voiceover.mjs <name> "<text>" --voice <voice-id>       # synthesize via a TTS server
 *   node scripts/voiceover.mjs <name> "<text>" --from take.wav          # bring your own audio (ElevenLabs, a mic, ...)
 *
 * Options:
 *   --voice <id>      voice / profile id on the TTS server (or env VOICE)
 *   --from <wav>      skip synthesis, use this audio file
 *   --engine <id>     VoiceStudio only: use its native /generate endpoint with this engine (e.g. omnivoice, mlx-audio)
 *   --trim            cut edge silence (keeps 40 ms lead, 80 ms tail)
 *   --loud <LUFS>     de-click + ONE linear gain to this loudness (use -16), peak capped at -1 dBFS
 *
 * TTS server: any OpenAI-compatible POST /v1/audio/speech endpoint.
 *   TTS_URL   (default http://localhost:3900 = VoiceStudio, free + local)
 *   TTS_MODEL (default tts-1)   TTS_API_KEY (optional, sent as Bearer token)
 *
 * Writes public/audio/voice/<name>.wav (24 kHz mono) and public/captions/<name>.json (@remotion/captions Caption[]).
 * Word timing is estimated: ffmpeg silencedetect finds speech regions, words are split across them by syllables.
 * Never time-stretch or silence-squash voice lines: it makes them sound shattered (see the skill's AUDIO.md).
 */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { trimVoice } from "./voice-trim.mjs";

const API = process.env.TTS_URL ?? process.env.VOICESTUDIO_URL ?? "http://localhost:3900";
const args = process.argv.slice(2);
const opt = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args.splice(i, 2)[1] : null;
};
const has = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 && Boolean(args.splice(i, 1));
};
const voice = opt("--voice") ?? process.env.VOICE;
const engine = opt("--engine");
const loudArg = opt("--loud");
const loudTarget = loudArg ? Number(loudArg) : null;
const fromWav = opt("--from");
const trim = has("--trim");
const [name, text] = args;
if (!name || !text || (!voice && !fromWav)) {
  console.error('usage: node scripts/voiceover.mjs <name> "<text>" (--voice <id> | --from <wav>) [--trim] [--loud -16]');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const wavPath = path.join(root, "public/audio/voice", `${name}.wav`);
const capPath = path.join(root, "public/captions", `${name}.json`);
mkdirSync(path.dirname(wavPath), { recursive: true });
mkdirSync(path.dirname(capPath), { recursive: true });

// 1. Synthesize (or take the given file).
if (fromWav) {
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", fromWav, "-ar", "24000", "-ac", "1", wavPath]);
} else {
  let res;
  try {
    if (engine) {
      const form = new FormData();
      form.append("text", text);
      form.append("profile_id", voice);
      form.append("engine", engine);
      form.append("effect_preset", "raw"); // never VoiceStudio's default "broadcast" preset: it sounds like AI radio
      form.append("language", "English");
      res = await fetch(`${API}/generate`, { method: "POST", body: form });
    } else {
      const headers = { "Content-Type": "application/json" };
      if (process.env.TTS_API_KEY) headers.Authorization = `Bearer ${process.env.TTS_API_KEY}`;
      res = await fetch(`${API}/v1/audio/speech`, {
        method: "POST",
        headers,
        body: JSON.stringify({ model: process.env.TTS_MODEL ?? "tts-1", voice, input: text, response_format: "wav" }),
      });
    }
  } catch (err) {
    console.error(`TTS server not reachable at ${API} (${err.message}). Start it, set TTS_URL, or pass --from <wav>.`);
    process.exit(1);
  }
  if (!res.ok) {
    console.error(`TTS failed (${res.status}): ${await res.text()}`);
    process.exit(1);
  }
  const raw = wavPath.replace(/\.wav$/, ".raw");
  writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-ar", "24000", "-ac", "1", wavPath]);
  execFileSync("rm", [raw]);
}
if (trim) trimVoice(name);
if (loudTarget) {
  // Clean loudness: gentle de-click, then ONE linear gain (no dynamic loudnorm, no limiter pumping).
  const tmp = wavPath.replace(/\.wav$/, ".tmp.wav");
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", wavPath, "-af", "adeclick", "-ar", "24000", tmp]);
  execFileSync("mv", [tmp, wavPath]);
  const stats = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", wavPath, "-af", "ebur128=framelog=quiet,astats=metadata=0", "-f", "null", "-"], { encoding: "utf8" }).stderr;
  const lufs = Number((stats.match(/I:\s*(-?[0-9.]+) LUFS/) ?? [])[1]);
  const peakDb = Number((stats.match(/Peak level dB:\s*(-?[0-9.]+)/) ?? [])[1]);
  if (Number.isFinite(lufs)) {
    const gain = Math.min(loudTarget - lufs, -1 - (Number.isFinite(peakDb) ? peakDb : -1));
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", wavPath, "-af", `volume=${gain.toFixed(2)}dB`, "-ar", "24000", tmp]);
    execFileSync("mv", [tmp, wavPath]);
  }
}


// 2. Speech regions from silencedetect.
const duration = Number(
  execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wavPath]).toString(),
);
// silencedetect logs to stderr; spawnSync captures it.
const stderr = spawnSync(
  "ffmpeg",
  ["-hide_banner", "-nostats", "-i", wavPath, "-af", "silencedetect=noise=-40dB:d=0.12", "-f", "null", "-"],
  { encoding: "utf8" },
).stderr;
const silences = [];
let open = null;
for (const m of stderr.matchAll(/silence_(start|end): ([0-9.]+)/g)) {
  if (m[1] === "start") open = Number(m[2]);
  else if (open !== null) {
    silences.push([open, Number(m[2])]);
    open = null;
  }
}
if (open !== null) silences.push([open, duration]);
let regions = [];
let cursor = 0;
for (const [s, e] of silences) {
  if (s > cursor) regions.push([cursor, s]);
  cursor = e;
}
if (cursor < duration) regions.push([cursor, duration]);
regions = regions.filter(([s, e]) => e - s >= 0.15);

// 3. Words + syllable weights.
const words = text.split(/\s+/).filter(Boolean);
const syl = (w) => {
  const s = w.toLowerCase().replace(/[^a-z]/g, "");
  if (!s) return 1;
  const groups = s.replace(/e$/, "").match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
};
const weights = words.map(syl);
const punct = words.map((w) => /[,.;:!?]$/.test(w));

// Partition words into contiguous groups, one per region (DP on rate evenness).
const k = Math.min(regions.length, words.length);
regions = regions.slice(0, k);
const prefix = [0];
for (const w of weights) prefix.push(prefix[prefix.length - 1] + w);
const total = prefix[prefix.length - 1];
const speech = regions.reduce((a, [s, e]) => a + (e - s), 0);
const meanRate = total / speech;
const cost = (i, j, r) => {
  const rate = (prefix[j] - prefix[i]) / (regions[r][1] - regions[r][0]);
  return (rate - meanRate) ** 2;
};
const INF = 1e18;
const dp = Array.from({ length: k + 1 }, () => Array(words.length + 1).fill(INF));
const back = Array.from({ length: k + 1 }, () => Array(words.length + 1).fill(-1));
dp[0][0] = 0;
for (let r = 1; r <= k; r++) {
  for (let j = r; j <= words.length; j++) {
    for (let i = r - 1; i < j; i++) {
      if (dp[r - 1][i] === INF) continue;
      const bonus = r < k && punct[j - 1] ? -0.5 : 0;
      const c = dp[r - 1][i] + cost(i, j, r - 1) + bonus;
      if (c < dp[r][j]) {
        dp[r][j] = c;
        back[r][j] = i;
      }
    }
  }
}
const cuts = [];
for (let r = k, j = words.length; r > 0; r--) {
  cuts.unshift([back[r][j], j]);
  j = back[r][j];
}

// 4. Spread words inside each region by syllables.
const captions = [];
cuts.forEach(([i, j], r) => {
  const [s, e] = regions[r];
  const w = prefix[j] - prefix[i];
  let t = s;
  for (let n = i; n < j; n++) {
    const d = ((e - s) * weights[n]) / w;
    captions.push({
      text: (captions.length ? " " : "") + words[n],
      startMs: Math.round(t * 1000),
      endMs: Math.round((t + d) * 1000),
      timestampMs: Math.round((t + d / 2) * 1000),
      confidence: null,
      ...(punct[n] && /[.!?]$/.test(words[n]) ? { pageBreakAfter: true } : {}),
    });
    t += d;
  }
});
writeFileSync(capPath, JSON.stringify(captions, null, 2) + "\n");

console.log(`audio    ${path.relative(root, wavPath)}  (${duration.toFixed(2)}s, voice ${voice ?? "file"})`);
console.log(`captions ${path.relative(root, capPath)}  (${captions.length} words, ${regions.length} speech regions)`);
console.log(`frames   ${Math.ceil(duration * 30)} @30fps`);
