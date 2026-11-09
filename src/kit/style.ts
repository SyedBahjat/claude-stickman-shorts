import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";

/** Series palette (muted, dark, flat, see skills/stickman-shorts/references/STYLE.md). */
export const C = {
  ink: "#130f0b",
  skin: "#ece8d3",
  skinShade: "#cfcab3",
  olive: "#83885a",
  oliveDark: "#5f6440",
  radioGreen: "#465436",
  amber: "#e2a748",
  alertRed: "#db483b",
  tvRed: "#c8241c",
  capYellow: "#ffc338",
  hudRed: "#ec594a",
  paper: "#e4d4a8",
  bunkerWall: "#605d52",
  bunkerLit: "#8d8a7b",
  nightWall: "#2f2122",
  nightFloor: "#1c130d",
  door: "#462f21",
  doorDark: "#33221a",
  blanket: "#284966",
  stairCream: "#efe9d6",
  tile: "#d3d1bc",
  signBlue: "#28518b",
  momPurple: "#8a5bb5",
  crowd: "#2c3a40",
  optionGreen: "#3ecf6e",
  hair: "#5a3a26",
  steel: "#8f969b",
  water: "#5d93c9",
} as const;

export const FONT = {
  caption: loadMontserrat("normal", { weights: ["900"], subsets: ["latin"] }).fontFamily,
  title: loadAnton("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  mono: loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin"] }).fontFamily,
  hand: loadMarker("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
};

export const W = 1080;
export const H = 1920;
