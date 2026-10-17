import type { ReactNode } from "react";

import type { FigureKey } from "@/content/types";

/**
 * Kindgerechte Yoga-Figuren als SVG im flachen YOGITIER®-Look.
 * Jede Pose wird aus wenigen Gelenkpunkten gezeichnet (Kopf, Rumpf, Arme, Beine),
 * dadurch bleiben alle Figuren stilistisch einheitlich und leicht erweiterbar.
 */

type Pt = [number, number];
type Face = "smile" | "grin" | "roar" | "sleep" | "puff";
type Facing = "front" | "left" | "right";
type HairStyle = "short" | "bob" | "pony" | "buns";

type Kid = { skin: string; hair: string; hairStyle: HairStyle; shirt: string; pants: string };

type Limb = { pts: Pt[]; layer?: "back" | "front"; foot?: -1 | 0 | 1; noEnd?: boolean };

type FigureDef = {
  kid: Kid;
  torso: [Pt, Pt];
  torsoWidth?: number;
  arms: Limb[];
  legs: Limb[];
  head: { at: Pt; r?: number; rot?: number; facing?: Facing; face?: Face; layer?: "under-arms" };
  ground?: boolean;
  behind?: ReactNode;
  front?: ReactNode;
  torsoDecor?: ReactNode;
  joinedHands?: Pt;
  /** Arme vor dem Bauch etwas dunkler, damit sie sich vom Shirt abheben */
  frontArmShade?: number;
};

const SKIN = { light: "#F6CDB0", medium: "#E2A982", deep: "#A9714E" };
const HAIR = { brown: "#6B4330", dark: "#2F2622", blond: "#E9C46A", auburn: "#A5512D" };
const INK = "#5A3218";
const CHEEK = "#F08C8C";

function shade(hex: string, amount = 0.14): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * (1 - amount));
  const g = Math.round(((n >> 8) & 255) * (1 - amount));
  const b = Math.round((n & 255) * (1 - amount));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

const pts = (p: Pt[]) => p.map(([x, y]) => `${x},${y}`).join(" ");

function LimbPath({ limb, color, width, skin, kind }: { limb: Limb; color: string; width: number; skin: string; kind: "arm" | "leg" }) {
  const end = limb.pts[limb.pts.length - 1];
  return (
    <g>
      <polyline points={pts(limb.pts)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      {!limb.noEnd &&
        (kind === "arm" ? (
          <circle cx={end[0]} cy={end[1]} r={6.6} fill={skin} />
        ) : (
          <ellipse cx={end[0] + (limb.foot ?? 0) * 4} cy={end[1] + 1} rx={8.5} ry={5.2} fill={skin} />
        ))}
    </g>
  );
}

function hairParts(r: number, style: HairStyle, color: string, facing: Facing): { behind: ReactNode; cap: ReactNode } {
  const R = r + 1.8;
  const extras: ReactNode[] = [];
  if (style === "bob") {
    if (facing !== "right") extras.push(<ellipse key="bl" cx={-r + 3} cy={r * 0.32} rx={6.5} ry={11} fill={color} />);
    if (facing !== "left") extras.push(<ellipse key="br" cx={r - 3} cy={r * 0.32} rx={6.5} ry={11} fill={color} />);
  }
  if (style === "pony") {
    const side = facing === "left" ? 1 : facing === "right" ? -1 : 1;
    extras.push(<ellipse key="p" cx={side * (r + 3)} cy={-4} rx={7} ry={12} fill={color} transform={`rotate(${side * 24} ${side * (r + 3)} -4)`} />);
  }
  if (style === "buns") {
    extras.push(<circle key="b1" cx={-11} cy={-r + 1} r={7.5} fill={color} />);
    extras.push(<circle key="b2" cx={11} cy={-r + 1} r={7.5} fill={color} />);
  }

  let cap: string;
  if (facing === "front") {
    cap = `M ${-R} 3 A ${R} ${R} 0 1 1 ${R} 3 C ${r * 0.55} ${-r * 0.42} ${-r * 0.55} ${-r * 0.42} ${-R} 3 Z`;
  } else {
    const s = facing === "right" ? 1 : -1;
    // Haare bedecken Oberkopf und Hinterkopf, Gesicht zeigt in Blickrichtung
    cap = `M ${s * r * 0.62} ${-r * 0.8} A ${R} ${R} 0 0 ${s === 1 ? 0 : 1} ${-s * r * 0.92} ${r * 0.5} Q ${-s * r * 0.15} ${-r * 0.05} ${s * r * 0.62} ${-r * 0.8} Z`;
  }
  return { behind: <g>{extras}</g>, cap: <path d={cap} fill={color} /> };
}

function FaceFeatures({ r, facing, face }: { r: number; facing: Facing; face: Face }) {
  const dx = facing === "front" ? 0 : facing === "right" ? r * 0.42 : -r * 0.42;
  const eyeGap = facing === "front" ? 6.5 : 4.2;
  const eyes =
    face === "sleep" ? (
      <g stroke={INK} strokeWidth={2} strokeLinecap="round" fill="none">
        <path d={`M ${dx - eyeGap - 3} 2 q 3 3 6 0`} />
        <path d={`M ${dx + eyeGap - 3} 2 q 3 3 6 0`} />
      </g>
    ) : (
      <g fill={INK}>
        <circle cx={dx - eyeGap} cy={2} r={face === "roar" ? 2.6 : 2.2} />
        <circle cx={dx + eyeGap} cy={2} r={face === "roar" ? 2.6 : 2.2} />
      </g>
    );
  const cheekR = face === "puff" ? 5.6 : 3.6;
  const cheeks = (
    <g fill={CHEEK} opacity={0.55}>
      <circle cx={dx - eyeGap - 4} cy={9} r={cheekR} />
      <circle cx={dx + eyeGap + 4} cy={9} r={cheekR} />
    </g>
  );
  let mouth: ReactNode;
  switch (face) {
    case "roar":
      mouth = (
        <g>
          <ellipse cx={dx} cy={11.5} rx={5.4} ry={6.4} fill="#7A2E1E" />
          <ellipse cx={dx} cy={15} rx={3.6} ry={3} fill="#F07F8E" />
        </g>
      );
      break;
    case "grin":
      mouth = <path d={`M ${dx - 6} 8.5 Q ${dx} 16 ${dx + 6} 8.5 Z`} fill="#7A2E1E" />;
      break;
    case "puff":
      mouth = <circle cx={dx} cy={11} r={2.4} fill="#7A2E1E" />;
      break;
    default:
      mouth = <path d={`M ${dx - 4.5} 9 Q ${dx} 13 ${dx + 4.5} 9`} stroke={INK} strokeWidth={2.2} strokeLinecap="round" fill="none" />;
  }
  return (
    <>
      {cheeks}
      {eyes}
      {mouth}
    </>
  );
}

function Head({ def, kid }: { def: FigureDef["head"]; kid: Kid }) {
  const r = def.r ?? 19;
  const facing = def.facing ?? "front";
  const face = def.face ?? "smile";
  const [x, y] = def.at;
  const hair = hairParts(r, kid.hairStyle, kid.hair, facing);
  return (
    <g transform={`translate(${x} ${y}) rotate(${def.rot ?? 0})`}>
      {/* Zopf & Dutt liegen hinter dem Kopf */}
      {hair.behind}
      <circle r={r} fill={kid.skin} />
      {facing !== "front" && <circle cx={facing === "right" ? -r * 0.18 : r * 0.18} cy={2} r={4.2} fill={shade(kid.skin, 0.08)} />}
      {hair.cap}
      <FaceFeatures r={r} facing={facing} face={face} />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Dekorationen
// ---------------------------------------------------------------------------

function Sparkle({ x, y, s = 1, color = "#F1C84B" }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <path
      d={`M ${x} ${y - 7 * s} Q ${x + 1.2 * s} ${y - 1.2 * s} ${x + 7 * s} ${y} Q ${x + 1.2 * s} ${y + 1.2 * s} ${x} ${y + 7 * s} Q ${x - 1.2 * s} ${y + 1.2 * s} ${x - 7 * s} ${y} Q ${x - 1.2 * s} ${y - 1.2 * s} ${x} ${y - 7 * s} Z`}
      fill={color}
    />
  );
}

function Snowflake({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g stroke="#9DB8D6" strokeWidth={1.8 * s} strokeLinecap="round" opacity={0.8}>
      <line x1={x - 5 * s} y1={y} x2={x + 5 * s} y2={y} />
      <line x1={x - 2.5 * s} y1={y - 4.3 * s} x2={x + 2.5 * s} y2={y + 4.3 * s} />
      <line x1={x - 2.5 * s} y1={y + 4.3 * s} x2={x + 2.5 * s} y2={y - 4.3 * s} />
    </g>
  );
}

function Zs({ x, y }: { x: number; y: number }) {
  return (
    <g fill="none" stroke="#A99BF0" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M ${x} ${y} h 9 l -9 9 h 9`} />
      <path d={`M ${x + 14} ${y - 14} h 6 l -6 6 h 6`} opacity={0.7} />
    </g>
  );
}

function MotionArcs({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  const s = flip ? -1 : 1;
  return (
    <g fill="none" stroke="#C9B6A3" strokeWidth={2.4} strokeLinecap="round">
      <path d={`M ${x} ${y - 8} q ${s * 6} 8 0 16`} />
      <path d={`M ${x + s * 7} ${y - 12} q ${s * 8} 12 0 24`} opacity={0.6} />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Figuren
// ---------------------------------------------------------------------------

const standingLegs = (spread = 0): Limb[] => [
  { pts: [[93, 122], [93 - spread * 0.5, 152], [92 - spread, 181]], foot: -1 },
  { pts: [[107, 122], [107 + spread * 0.5, 152], [108 + spread, 181]], foot: 1 },
];

const FIGURES: Record<FigureKey, FigureDef> = {
  berg: {
    kid: { skin: SKIN.light, hair: HAIR.brown, hairStyle: "short", shirt: "#F2A541", pants: "#A6A3D2" },
    torso: [[100, 72], [100, 114]],
    arms: [{ pts: [[88, 78], [77, 101], [72, 124]] }, { pts: [[112, 78], [123, 101], [128, 124]] }],
    legs: standingLegs(),
    head: { at: [100, 44] },
    behind: <path d="M 22 186 L 62 112 L 84 140 L 118 70 L 178 186 Z" fill="#000" opacity={0.045} />,
  },
  stern: {
    kid: { skin: SKIN.medium, hair: HAIR.dark, hairStyle: "pony", shirt: "#E9879E", pants: "#487270" },
    torso: [[100, 72], [100, 114]],
    arms: [{ pts: [[88, 78], [64, 62], [40, 46]] }, { pts: [[112, 78], [136, 62], [160, 46]] }],
    legs: [
      { pts: [[94, 122], [76, 151], [60, 181]], foot: -1 },
      { pts: [[106, 122], [124, 151], [140, 181]], foot: 1 },
    ],
    head: { at: [100, 44], face: "grin" },
    front: (
      <>
        <Sparkle x={30} y={30} s={0.9} />
        <Sparkle x={172} y={32} s={0.8} />
        <Sparkle x={160} y={12} s={0.5} />
      </>
    ),
  },
  baum: {
    kid: { skin: SKIN.deep, hair: HAIR.dark, hairStyle: "buns", shirt: "#487270", pants: "#E8961E" },
    torso: [[100, 74], [100, 114]],
    arms: [{ pts: [[88, 78], [77, 50], [72, 20]] }, { pts: [[112, 78], [123, 50], [128, 20]] }],
    legs: [
      { pts: [[96, 122], [96, 152], [96, 181]], foot: 0 },
      { pts: [[106, 122], [132, 141], [101, 152]], noEnd: true },
    ],
    head: { at: [100, 46] },
    front: (
      <>
        <ellipse cx={101} cy={152} rx={6} ry={4.5} fill={SKIN.deep} />
        <ellipse cx={64} cy={18} rx={7} ry={4} fill="#8CC084" transform="rotate(-30 64 18)" />
        <ellipse cx={80} cy={8} rx={7} ry={4} fill="#6E9A63" transform="rotate(30 80 8)" />
        <ellipse cx={136} cy={18} rx={7} ry={4} fill="#8CC084" transform="rotate(30 136 18)" />
        <ellipse cx={120} cy={8} rx={7} ry={4} fill="#6E9A63" transform="rotate(-30 120 8)" />
      </>
    ),
  },
  loewe: {
    kid: { skin: SKIN.light, hair: HAIR.blond, hairStyle: "bob", shirt: "#F2A541", pants: "#A8714F" },
    torso: [[100, 100], [100, 140]],
    arms: [
      { pts: [[88, 106], [80, 134], [80, 160]], layer: "front" },
      { pts: [[112, 106], [120, 134], [120, 160]], layer: "front" },
    ],
    legs: [],
    head: { at: [100, 70], face: "roar" },
    frontArmShade: 0.1,
    behind: (
      <>
        <ellipse cx={66} cy={180} rx={9} ry={5} fill={SKIN.light} />
        <ellipse cx={134} cy={180} rx={9} ry={5} fill={SKIN.light} />
        <line x1={78} y1={166} x2={122} y2={166} stroke="#A8714F" strokeWidth={30} strokeLinecap="round" />
      </>
    ),
    front: (
      <>
        <MotionArcs x={72} y={70} flip />
        <MotionArcs x={128} y={70} />
      </>
    ),
  },
  baer: {
    kid: { skin: SKIN.medium, hair: HAIR.dark, hairStyle: "short", shirt: "#A8714F", pants: "#A6A3D2" },
    torso: [[76, 124], [118, 106]],
    arms: [
      { pts: [[72, 128], [64, 154], [56, 180]], layer: "back" },
      { pts: [[80, 130], [74, 156], [68, 180]], layer: "front" },
    ],
    legs: [
      { pts: [[114, 110], [134, 142], [144, 181]], foot: 1, layer: "back" },
      { pts: [[120, 112], [142, 144], [156, 181]], foot: 1, layer: "front" },
    ],
    head: { at: [52, 112], facing: "left", rot: -8 },
  },
  elefant: {
    kid: { skin: SKIN.light, hair: HAIR.auburn, hairStyle: "pony", shirt: "#9CCFDB", pants: "#A6A3D2" },
    torso: [[100, 72], [100, 114]],
    arms: [
      { pts: [[89, 80], [94, 112], [99, 146]], layer: "front", noEnd: true },
      { pts: [[111, 80], [106, 112], [101, 146]], layer: "front", noEnd: true },
    ],
    legs: [
      { pts: [[94, 122], [83, 152], [74, 181]], foot: -1 },
      { pts: [[106, 122], [117, 152], [126, 181]], foot: 1 },
    ],
    head: { at: [100, 44] },
    joinedHands: [100, 150],
    frontArmShade: 0.13,
    front: (
      <>
        <MotionArcs x={80} y={152} flip />
        <MotionArcs x={120} y={152} />
      </>
    ),
  },
  einhorn: {
    kid: { skin: SKIN.deep, hair: HAIR.dark, hairStyle: "buns", shirt: "#A6A3D2", pants: "#E9879E" },
    torso: [[96, 100], [100, 140]],
    arms: [
      { pts: [[98, 104], [110, 70], [115, 34]], layer: "front", noEnd: true },
      { pts: [[103, 106], [115, 72], [119, 34]], layer: "front", noEnd: true },
    ],
    legs: [
      { pts: [[96, 146], [66, 178], [34, 181]], noEnd: true, layer: "back" },
      { pts: [[102, 146], [134, 148], [136, 181]], foot: 1, layer: "front" },
    ],
    head: { at: [90, 78], facing: "right", rot: -6 },
    joinedHands: [117, 32],
    behind: (
      <>
        <ellipse cx={34} cy={181} rx={8} ry={4.5} fill={SKIN.deep} />
      </>
    ),
    front: (
      <>
        <path d="M 111 28 L 123 28 L 117 2 Z" fill="#F1C84B" />
        <path d="M 113 20 L 121 18 M 114 12 L 120 11" stroke="#E8961E" strokeWidth={1.6} strokeLinecap="round" />
        <Sparkle x={140} y={14} s={0.7} color="#E9879E" />
        <Sparkle x={96} y={12} s={0.55} color="#A99BF0" />
        <Sparkle x={150} y={44} s={0.45} />
      </>
    ),
  },
  leopard: {
    kid: { skin: SKIN.medium, hair: HAIR.brown, hairStyle: "short", shirt: "#F2A541", pants: "#487270" },
    torso: [[64, 140], [110, 98]],
    arms: [
      { pts: [[60, 144], [52, 162], [44, 180]], layer: "back" },
      { pts: [[68, 146], [60, 164], [54, 180]], layer: "front" },
    ],
    legs: [
      { pts: [[108, 102], [122, 142], [132, 181]], foot: 1, layer: "back" },
      { pts: [[114, 98], [146, 78], [176, 58]], layer: "front", noEnd: true },
    ],
    head: { at: [44, 128], facing: "left", rot: -14, r: 18 },
    torsoDecor: (
      <g fill="#8A4B2C" opacity={0.75}>
        <circle cx={80} cy={124} r={3} />
        <circle cx={92} cy={112} r={2.6} />
        <circle cx={98} cy={122} r={2.2} />
        <circle cx={74} cy={134} r={2} />
      </g>
    ),
    front: <ellipse cx={178} cy={57} rx={8} ry={5} fill={SKIN.medium} transform="rotate(-34 178 57)" />,
  },
  dino: {
    kid: { skin: SKIN.light, hair: HAIR.blond, hairStyle: "short", shirt: "#7BAF6E", pants: "#487270" },
    torso: [[100, 80], [100, 120]],
    arms: [{ pts: [[88, 86], [63, 86], [38, 86]] }, { pts: [[112, 86], [137, 86], [162, 86]] }],
    legs: [
      { pts: [[93, 128], [68, 154], [46, 181]], foot: -1 },
      { pts: [[107, 128], [138, 148], [150, 181]], foot: 1 },
    ],
    head: { at: [100, 52], facing: "right" },
    behind: (
      <g fill="#6E9A63">
        <path d="M 86 36 L 92 22 L 98 34 Z" />
        <path d="M 96 32 L 103 16 L 110 31 Z" />
        <path d="M 107 34 L 114 22 L 118 37 Z" />
      </g>
    ),
  },
  fuchs: {
    kid: { skin: SKIN.light, hair: HAIR.auburn, hairStyle: "bob", shirt: "#F67528", pants: "#A8714F" },
    torso: [[76, 154], [122, 160]],
    torsoWidth: 34,
    arms: [
      { pts: [[120, 162], [146, 172], [172, 178]], layer: "back" },
      { pts: [[126, 166], [152, 176], [180, 181]], layer: "front" },
    ],
    legs: [
      { pts: [[74, 164], [114, 178], [62, 181]], layer: "back", noEnd: true },
      { pts: [[78, 168], [120, 181], [68, 183]], layer: "front", noEnd: true },
    ],
    head: { at: [141, 161], facing: "right", rot: 52, r: 18 },
    behind: (
      <>
        <path d="M 66 150 C 44 150 30 132 34 112 C 46 124 58 128 70 140 Z" fill="#F67528" />
        <path d="M 34 112 C 33 120 36 126 42 130 C 40 122 38 116 34 112 Z" fill="#FFF7EE" />
      </>
    ),
  },
  schlange: {
    kid: { skin: SKIN.deep, hair: HAIR.dark, hairStyle: "short", shirt: "#8CC084", pants: "#A6A3D2" },
    torso: [[96, 168], [134, 134]],
    arms: [
      { pts: [[130, 140], [133, 160], [136, 180]], layer: "back" },
      { pts: [[138, 142], [142, 162], [146, 180]], layer: "front" },
    ],
    legs: [
      { pts: [[90, 170], [56, 175], [24, 178]], layer: "back", noEnd: true },
      { pts: [[94, 174], [60, 179], [28, 182]], layer: "back", noEnd: true },
    ],
    head: { at: [150, 110], facing: "right", rot: -10 },
    front: (
      <g fill="none" stroke="#8CC084" strokeWidth={2.4} strokeLinecap="round">
        <path d="M 172 112 q 4 -4 8 0 t 8 0" />
        <path d="M 174 122 q 4 -4 8 0 t 8 0" opacity={0.6} />
      </g>
    ),
  },
  bruecke: {
    kid: { skin: SKIN.medium, hair: HAIR.dark, hairStyle: "pony", shirt: "#9CCFDB", pants: "#E8961E" },
    torso: [[54, 170], [110, 134]],
    arms: [
      { pts: [[54, 176], [78, 181], [100, 182]], layer: "back" },
    ],
    legs: [
      { pts: [[108, 136], [144, 128], [148, 181]], foot: 1, layer: "back" },
      { pts: [[114, 138], [152, 132], [156, 182]], foot: 1, layer: "front" },
    ],
    head: { at: [32, 168], facing: "right", rot: -90 },
  },
  boot: {
    kid: { skin: SKIN.light, hair: HAIR.brown, hairStyle: "buns", shirt: "#E9879E", pants: "#9CCFDB" },
    torso: [[78, 122], [98, 162]],
    arms: [
      { pts: [[80, 128], [106, 126], [132, 124]], layer: "front" },
    ],
    legs: [
      { pts: [[98, 166], [128, 130], [156, 136]], layer: "back", foot: 1 },
      { pts: [[102, 168], [134, 134], [162, 140]], layer: "front", foot: 1 },
    ],
    head: { at: [66, 98], facing: "right", rot: -8 },
    ground: false,
    behind: (
      <g fill="none" stroke="#9CCFDB" strokeWidth={3} strokeLinecap="round">
        <path d="M 40 184 q 10 -6 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0" />
        <path d="M 54 194 q 10 -6 20 0 t 20 0 t 20 0 t 20 0 t 20 0" opacity={0.5} />
      </g>
    ),
  },
  seestern: {
    kid: { skin: SKIN.medium, hair: HAIR.blond, hairStyle: "bob", shirt: "#A6A3D2", pants: "#E9879E" },
    torso: [[56, 170], [112, 172]],
    arms: [{ pts: [[58, 176], [80, 181], [102, 183]], layer: "front" }],
    legs: [
      { pts: [[114, 170], [146, 174], [178, 176]], foot: 1, layer: "back" },
      { pts: [[116, 176], [148, 180], [180, 182]], foot: 1, layer: "front" },
    ],
    head: { at: [34, 166], facing: "right", rot: -90, face: "sleep" },
    front: <Zs x={58} y={128} />,
  },
  tannenbaum: {
    kid: { skin: SKIN.light, hair: HAIR.brown, hairStyle: "pony", shirt: "#5E9C6A", pants: "#A8714F" },
    torso: [[100, 74], [100, 114]],
    arms: [{ pts: [[88, 80], [67, 102], [47, 126]] }, { pts: [[112, 80], [133, 102], [153, 126]] }],
    legs: [
      { pts: [[96, 122], [96, 152], [96, 181]], foot: -1 },
      { pts: [[104, 122], [104, 152], [104, 181]], foot: 1 },
    ],
    head: { at: [100, 46], face: "grin" },
    front: (
      <>
        <path d="M 100 4 L 104 14 L 115 14 L 106 20 L 110 31 L 100 24 L 90 31 L 94 20 L 85 14 L 96 14 Z" fill="#F1C84B" />
        <circle cx={47} cy={136} r={5} fill="#E0612A" />
        <circle cx={70} cy={112} r={4} fill="#7B9BBB" />
        <circle cx={130} cy={112} r={4} fill="#F1C84B" />
        <circle cx={153} cy={136} r={5} fill="#E9879E" />
      </>
    ),
  },
  schneemann: {
    kid: { skin: SKIN.deep, hair: HAIR.dark, hairStyle: "short", shirt: "#DCE9F5", pants: "#A6A3D2" },
    torso: [[100, 74], [100, 114]],
    torsoWidth: 36,
    arms: [
      { pts: [[88, 80], [66, 98], [92, 114]], layer: "front" },
      { pts: [[112, 80], [134, 98], [108, 114]], layer: "front" },
    ],
    legs: standingLegs(4),
    head: { at: [100, 46], face: "puff" },
    frontArmShade: 0.12,
    torsoDecor: (
      <g fill="#5A3218">
        <circle cx={100} cy={84} r={2.4} />
        <circle cx={100} cy={96} r={2.4} />
      </g>
    ),
    front: (
      <>
        <path d="M 82 68 Q 100 76 118 68" stroke="#E0612A" strokeWidth={7} strokeLinecap="round" fill="none" />
        <path d="M 112 70 L 120 90" stroke="#E0612A" strokeWidth={6} strokeLinecap="round" />
        <rect x={84} y={24} width={32} height={6} rx={3} fill="#2F2622" />
        <rect x={89} y={6} width={22} height={20} rx={3} fill="#2F2622" />
        <rect x={89} y={19} width={22} height={4} fill="#E0612A" />
        <Snowflake x={36} y={40} />
        <Snowflake x={166} y={56} s={0.8} />
        <Snowflake x={152} y={22} s={0.6} />
        <Snowflake x={44} y={96} s={0.7} />
      </>
    ),
  },
  rentier: {
    kid: { skin: SKIN.medium, hair: HAIR.dark, hairStyle: "short", shirt: "#A8714F", pants: "#487270" },
    torso: [[100, 76], [100, 116]],
    arms: [
      { pts: [[88, 82], [66, 62], [80, 30]], layer: "back" },
      { pts: [[112, 82], [134, 62], [120, 30]], layer: "back" },
    ],
    legs: [
      { pts: [[93, 124], [82, 150], [90, 181]], foot: -1 },
      { pts: [[107, 124], [118, 150], [110, 181]], foot: 1 },
    ],
    head: { at: [100, 48] },
    behind: (
      <g stroke="#8A5A3C" strokeWidth={4} strokeLinecap="round" fill="none">
        <path d="M 78 26 L 70 8 M 74 17 L 62 14 M 72 12 L 76 2" />
        <path d="M 122 26 L 130 8 M 126 17 L 138 14 M 128 12 L 124 2" />
      </g>
    ),
    front: <circle cx={100} cy={52} r={4.6} fill="#E0612A" />,
  },
  schneeengel: {
    kid: { skin: SKIN.light, hair: HAIR.auburn, hairStyle: "bob", shirt: "#E9879E", pants: "#A6A3D2" },
    torso: [[100, 76], [100, 116]],
    arms: [{ pts: [[88, 82], [62, 58], [38, 34]] }, { pts: [[112, 82], [138, 58], [162, 34]] }],
    legs: [
      { pts: [[94, 124], [80, 152], [66, 180]], foot: -1 },
      { pts: [[106, 124], [120, 152], [134, 180]], foot: 1 },
    ],
    head: { at: [100, 48], face: "sleep" },
    ground: false,
    behind: (
      <g fill="#FFFFFF" opacity={0.9}>
        <path d="M 96 86 C 70 70 30 40 26 26 C 22 50 44 90 92 104 Z" />
        <path d="M 104 86 C 130 70 170 40 174 26 C 178 50 156 90 108 104 Z" />
        <path d="M 92 126 C 74 150 60 176 58 188 L 142 188 C 140 176 126 150 108 126 Z" opacity={0.85} />
      </g>
    ),
    front: (
      <>
        <Snowflake x={30} y={120} />
        <Snowflake x={170} y={110} s={0.85} />
        <Snowflake x={160} y={170} s={0.65} />
        <Snowflake x={40} y={168} s={0.7} />
      </>
    ),
  },
  paeckchen: {
    kid: { skin: SKIN.medium, hair: HAIR.dark, hairStyle: "buns", shirt: "#E9879E", pants: "#487270" },
    torso: [[76, 154], [122, 160]],
    torsoWidth: 34,
    arms: [{ pts: [[84, 166], [100, 176], [112, 180]], layer: "front" }],
    legs: [
      { pts: [[74, 164], [114, 178], [62, 181]], layer: "back", noEnd: true },
      { pts: [[78, 168], [120, 181], [68, 183]], layer: "front", noEnd: true },
    ],
    head: { at: [141, 161], facing: "right", rot: 52, r: 18 },
    torsoDecor: (
      <g>
        <circle cx={86} cy={150} r={2} fill="#fff" opacity={0.8} />
        <circle cx={108} cy={150} r={2} fill="#fff" opacity={0.8} />
        <circle cx={118} cy={162} r={2} fill="#fff" opacity={0.8} />
        <path d="M 99 140 L 97 174" stroke="#E0612A" strokeWidth={6} />
      </g>
    ),
    front: (
      <g fill="#E0612A">
        <path d="M 98 140 C 86 126 78 128 80 136 C 82 142 92 142 98 140 Z" />
        <path d="M 98 140 C 110 126 118 128 116 136 C 114 142 104 142 98 140 Z" />
        <circle cx={98} cy={140} r={4} />
      </g>
    ),
  },
};

export function KidFigure({ figure, className, title }: { figure: FigureKey; className?: string; title?: string }) {
  const def = FIGURES[figure];
  const { kid } = def;
  const armW = 11.5;
  const legW = 13.5;
  const torsoW = def.torsoWidth ?? 32;
  const back = (l: Limb) => (l.layer ?? "back") === "back";
  // In Seitenansichten (es gibt vordere UND hintere Gliedmaßen) wird die hintere Seite abgedunkelt.
  const sideLegs = def.legs.some(back) && def.legs.some((l) => !back(l));
  const sideArms = def.arms.some(back) && def.arms.some((l) => !back(l));
  const backLeg = sideLegs ? shade(kid.pants, 0.16) : kid.pants;
  const backArm = sideArms ? shade(kid.shirt, 0.16) : kid.shirt;
  const frontArm = def.frontArmShade ? shade(kid.shirt, def.frontArmShade) : kid.shirt;

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      {title && <title>{title}</title>}
      {def.ground !== false && <ellipse cx={100} cy={187} rx={74} ry={6} fill="#7A4A28" opacity={0.1} />}
      {def.behind}
      {def.legs.filter(back).map((l, i) => (
        <LimbPath key={`lb${i}`} limb={l} color={backLeg} width={legW} skin={kid.skin} kind="leg" />
      ))}
      {def.arms.filter(back).map((l, i) => (
        <LimbPath key={`ab${i}`} limb={l} color={backArm} width={armW} skin={kid.skin} kind="arm" />
      ))}
      <line
        x1={def.torso[0][0]}
        y1={def.torso[0][1]}
        x2={def.torso[1][0]}
        y2={def.torso[1][1]}
        stroke={kid.shirt}
        strokeWidth={torsoW}
        strokeLinecap="round"
      />
      {def.torsoDecor}
      {def.legs.filter((l) => !back(l)).map((l, i) => (
        <LimbPath key={`lf${i}`} limb={l} color={kid.pants} width={legW} skin={kid.skin} kind="leg" />
      ))}
      <Head def={def.head} kid={kid} />
      {def.arms.filter((l) => !back(l)).map((l, i) => (
        <LimbPath key={`af${i}`} limb={l} color={frontArm} width={armW} skin={kid.skin} kind="arm" />
      ))}
      {def.joinedHands && <circle cx={def.joinedHands[0]} cy={def.joinedHands[1]} r={8} fill={kid.skin} />}
      {def.front}
    </svg>
  );
}
