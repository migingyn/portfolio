/**
 * The ASCII character: an original lab-coated figure drawn from a small 2D rig,
 * rasterized to an offscreen canvas and converted to characters by brightness.
 *
 * It appears twice (DESIGN.md section 5): on the loading screen, where it cycles
 * through its pose frames and ends on its final pose, and afterwards as the
 * small corner character, which turns toward the dial and snaps a pose when the
 * section changes. It only draws when its pose changes; at rest it costs nothing.
 */

type Vec = { x: number; y: number };

interface Pose {
  hip: Vec;
  /** Torso lean in degrees; negative leans to the viewer's left. */
  lean: number;
  /** Extra head tilt on top of the lean. */
  head: number;
  handL: Vec;
  handR: Vec;
  /** 0..1: how far the right hand has moved onto the face. */
  toFace: number;
  footL: number;
  footR: number;
  /** 0..1 coat hem spread, and -1..1 sideways blow. */
  flare: number;
  sweep: number;
}

const IDLE: Pose = {
  hip: { x: 0, y: 46 }, lean: 0, head: 0,
  handL: { x: -12, y: 45 }, handR: { x: 12, y: 45 }, toFace: 0,
  footL: -5, footR: 5, flare: 0.12, sweep: 0,
};
const WINDUP: Pose = {
  hip: { x: 1, y: 41 }, lean: 7, head: 10,
  handL: { x: 4, y: 58 }, handR: { x: -3, y: 62 }, toFace: 0.35,
  footL: -6, footR: 7, flare: 0.02, sweep: -0.2,
};
const STRIKE: Pose = {
  hip: { x: 0, y: 45 }, lean: -13, head: -19,
  handL: { x: -40, y: 86 }, handR: { x: 0, y: 0 }, toFace: 1,
  footL: -13, footR: 12, flare: 1, sweep: 0.6,
};
const LAUGH: Pose = {
  ...STRIKE,
  hip: { x: 0, y: 45.6 }, lean: -14.5, head: -23,
  handL: { x: -41, y: 88 },
};
/** Turned toward something on the viewer's right or left. */
const LOOK_RIGHT: Pose = { ...IDLE, lean: 6, head: 14, handR: { x: 15, y: 50 }, sweep: 0.2 };
const LOOK_LEFT: Pose = { ...IDLE, lean: -6, head: -14, handL: { x: -15, y: 50 }, sweep: -0.2 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function mix(a: Pose, b: Pose, t: number): Pose {
  const v = (p: Vec, q: Vec) => ({ x: lerp(p.x, q.x, t), y: lerp(p.y, q.y, t) });
  return {
    hip: v(a.hip, b.hip), lean: lerp(a.lean, b.lean, t), head: lerp(a.head, b.head, t),
    handL: v(a.handL, b.handL), handR: v(a.handR, b.handR), toFace: lerp(a.toFace, b.toFace, t),
    footL: lerp(a.footL, b.footL, t), footR: lerp(a.footR, b.footR, t),
    flare: lerp(a.flare, b.flare, t), sweep: lerp(a.sweep, b.sweep, t),
  };
}

/** The loading screen's frames, held one after another like a symbol changing in place. */
const INTRO: Pose[] = [
  IDLE, IDLE, mix(IDLE, WINDUP, 0.5), WINDUP, WINDUP, mix(WINDUP, STRIKE, 0.55),
  STRIKE, LAUGH, STRIKE, LAUGH, STRIKE,
];
const INTRO_FRAME_MS = 165;

/** Two-bone IK: where the elbow or knee sits between a root and a target. */
function joint(root: Vec, target: Vec, l1: number, l2: number, bend: 1 | -1): { mid: Vec; end: Vec } {
  const dx = target.x - root.x;
  const dy = target.y - root.y;
  const d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(l1 - l2) + 0.01), l1 + l2 - 0.01);
  const base = Math.atan2(dy, dx);
  const inner = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const a = base + bend * inner;
  const mid = { x: root.x + Math.cos(a) * l1, y: root.y + Math.sin(a) * l1 };
  const reach = Math.hypot(target.x - mid.x, target.y - mid.y) || 1;
  return { mid, end: { x: mid.x + ((target.x - mid.x) / reach) * l2, y: mid.y + ((target.y - mid.y) / reach) * l2 } };
}

const TONE = { outline: 24, pants: 84, shirt: 110, shoe: 140, hair: 92, coatBack: 138, skin: 212, coatLit: 252, coatShade: 204, hand: 255 };
const gray = (v: number) => `rgb(${v},${v},${v})`;
const RAMP = " .:-=+*#%@";
/** Mask samples per cell edge. */
const SS = 3;
/** Character size on the canvas, in CSS pixels. */
const FONT_PX = 5;

export interface Character {
  /** Play the loading-screen frames once, ending on the final pose. */
  intro(onDone: () => void): void;
  /** A short pose, then back to rest. Used when the section changes. */
  snap(): void;
  /** Turn toward the viewer's right (1), left (-1), or back to rest (0). */
  look(direction: -1 | 0 | 1): void;
  /** Stand at rest. */
  rest(): void;
  /** Redraw in the page's current text colour. Used while the theme fades. */
  tint(): void;
  destroy(): void;
}

export function mountCharacter(canvas: HTMLCanvasElement): Character {
  const ctx = canvas.getContext("2d")!;
  const style = getComputedStyle(document.documentElement);
  const readInk = () => style.getPropertyValue("--color-text").trim() || "#f2f0ea";
  let ink = readInk();
  const family = style.getPropertyValue("--font-ascii").trim() || "monospace";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  const size = canvas.clientWidth || 120;
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = Math.round(size * dpr);
  canvas.height = Math.round(size * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.font = `${FONT_PX}px ${family}`;
  ctx.textBaseline = "top";
  ctx.fillStyle = ink;

  const cellW = ctx.measureText("M").width || FONT_PX * 0.6;
  const cellH = FONT_PX * 1.2;
  const cols = Math.ceil(size / cellW);
  const rows = Math.ceil(size / cellH);
  // The figure is about 100 units tall and, mid-pose, about 78 wide.
  const unit = size / 110;
  const originX = size / 2 + unit * 9;
  const groundY = size - unit * 3;

  const off = document.createElement("canvas");
  off.width = cols * SS;
  off.height = rows * SS;
  const octx = off.getContext("2d", { willReadFrequently: true })!;

  let current: Pose = IDLE;
  let timers: number[] = [];
  const clear = () => {
    timers.forEach((t) => window.clearTimeout(t));
    timers = [];
  };
  const later = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

  function rasterize(pose: Pose) {
    const c = octx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = "#000";
    c.fillRect(0, 0, off.width, off.height);
    // Draw in CSS pixels; the transform squeezes them onto the sample grid.
    c.setTransform(SS / cellW, 0, 0, SS / cellH, 0, 0);
    c.lineCap = "round";
    c.lineJoin = "round";

    const P = (v: Vec): [number, number] => [originX + v.x * unit, groundY - v.y * unit];
    const path = (points: Vec[], fill: number) => {
      c.beginPath();
      points.forEach((p, i) => (i ? c.lineTo(...P(p)) : c.moveTo(...P(p))));
      c.closePath();
      c.fillStyle = gray(fill);
      c.fill();
    };
    const limb = (points: Vec[], w: number, tone: number, outline = true) => {
      for (const [lw, tn] of outline ? [[w + 2.4, TONE.outline], [w, tone]] : [[w, tone]]) {
        c.beginPath();
        points.forEach((p, i) => (i ? c.lineTo(...P(p)) : c.moveTo(...P(p))));
        c.lineWidth = lw! * unit;
        c.strokeStyle = gray(tn!);
        c.stroke();
      }
    };
    const blob = (center: Vec, rx: number, ry: number, tone: number, tilt = 0) => {
      c.beginPath();
      c.ellipse(...P(center), rx * unit, ry * unit, tilt, 0, Math.PI * 2);
      c.fillStyle = gray(tone);
      c.fill();
    };

    const rad = (pose.lean * Math.PI) / 180;
    const up = { x: Math.sin(rad), y: Math.cos(rad) };
    const side = { x: Math.cos(rad), y: -Math.sin(rad) };
    const at = (base: Vec, along: number, across: number): Vec => ({
      x: base.x + up.x * along + side.x * across,
      y: base.y + up.y * along + side.y * across,
    });

    const hip = pose.hip;
    const chest = at(hip, 27, 0);
    const shoulderL = at(chest, -1, -9.5);
    const shoulderR = at(chest, -1, 9.5);
    const headRad = ((pose.lean + pose.head) * Math.PI) / 180;
    const neck = at(chest, 3, 0);
    const head = { x: neck.x + Math.sin(headRad) * 8.2, y: neck.y + Math.cos(headRad) * 8.2 };

    const handRTarget = {
      x: lerp(pose.handR.x, head.x + 1.5, pose.toFace),
      y: lerp(pose.handR.y, head.y - 2.5, pose.toFace),
    };
    const armL = joint(shoulderL, pose.handL, 15, 15, 1);
    const armR = joint(shoulderR, handRTarget, 15, 15, -1);
    const legL = joint({ x: hip.x - 4.5, y: hip.y }, { x: pose.footL, y: 2 }, 23, 23, -1);
    const legR = joint({ x: hip.x + 4.5, y: hip.y }, { x: pose.footR, y: 2 }, 23, 23, 1);

    // Coat hem: wider and blown sideways as the pose flares.
    const hemY = hip.y - 25;
    const hemHalf = 9.5 + 13 * pose.flare;
    const hemX = hip.x + pose.sweep * 15;
    const hem = (from: number, to: number, lift: number) =>
      Array.from({ length: 9 }, (_, i) => ({ x: hemX + lerp(from, to, i / 8) * hemHalf, y: hemY + lift }));

    // 1. Back of the coat, seen when it flares.
    path([at(chest, 0, -9), at(chest, 0, 9), ...hem(1.12, -1.12, 3.5 * pose.flare)], TONE.coatBack);

    // 2. Legs and shoes.
    limb([{ x: hip.x - 4.5, y: hip.y }, legL.mid, legL.end], 6.2, TONE.pants);
    limb([{ x: hip.x + 4.5, y: hip.y }, legR.mid, legR.end], 6.2, TONE.pants);
    blob({ x: legL.end.x - 1.5, y: 1.6 }, 4.6, 2.2, TONE.shoe);
    blob({ x: legR.end.x + 1.5, y: 1.6 }, 4.6, 2.2, TONE.shoe);

    // 3. Shirt, then the two front panels of the open coat over it.
    path([at(chest, 1, -5), at(chest, 1, 5), at(hip, 2, 6), at(hip, 2, -6)], TONE.shirt);
    const gap = 0.1 + 0.2 * pose.flare;
    path([at(chest, 2.5, -3), shoulderL, at(shoulderL, -2, -2.5), ...hem(-1, -gap, 0), at(hip, 8, -1.2)], TONE.coatLit);
    path([at(chest, 2.5, 3), shoulderR, at(shoulderR, -2, 2.5), ...hem(1, gap, 0), at(hip, 8, 1.2)], TONE.coatShade);

    // 4. The arm on the viewer's left, with a spread hand.
    limb([shoulderL, armL.mid, armL.end], 5.4, TONE.coatLit);
    const reach = Math.atan2(armL.end.y - armL.mid.y, armL.end.x - armL.mid.x);
    for (const spread of [-0.7, -0.35, 0, 0.35, 0.7]) {
      const tip = { x: armL.end.x + Math.cos(reach + spread) * 5.5, y: armL.end.y + Math.sin(reach + spread) * 5.5 };
      limb([armL.end, tip], 1.5, TONE.hand, false);
    }
    blob(armL.end, 3, 3, TONE.hand);

    // 5. Head: neck, face, then spiky hair with a fringe.
    limb([chest, neck], 3.8, TONE.skin, false);
    blob(head, 6.6, 7.8, TONE.skin, -headRad);
    const local = (dx: number, dy: number): Vec => ({
      x: head.x + dx * Math.cos(headRad) + dy * Math.sin(headRad),
      y: head.y - dx * Math.sin(headRad) + dy * Math.cos(headRad),
    });
    const spikes: Vec[] = [];
    for (let i = 0; i <= 14; i++) {
      const a = Math.PI * (1.08 - (i / 14) * 1.16);
      const r = i % 2 ? 12.4 : 7.2;
      spikes.push(local(Math.cos(a) * r * 0.92, 1.2 + Math.sin(a) * r));
    }
    path([...spikes, local(6.8, 0.5), local(3.4, 3.4), local(1.2, 0.6), local(-1.4, 3.6), local(-4, 0.4), local(-6.8, 1)], TONE.hair);

    // 6. The other arm; when it reaches the face, the hand spreads over it.
    limb([shoulderR, armR.mid, armR.end], 5.4, TONE.coatShade);
    if (pose.toFace > 0.5) {
      for (const spread of [-0.9, -0.45, 0, 0.45, 0.9]) {
        const a = Math.PI / 2 - headRad + spread;
        limb([armR.end, { x: armR.end.x + Math.cos(a) * 8, y: armR.end.y + Math.sin(a) * 8 }], 1.9, TONE.hand);
      }
    }
    blob(armR.end, 3.6, 3.6, TONE.hand);
  }

  function draw(pose: Pose) {
    current = pose;
    rasterize(pose);
    const { data } = octx.getImageData(0, 0, off.width, off.height);
    ctx.clearRect(0, 0, size, size);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let sum = 0;
        for (let sy = 0; sy < SS; sy++) {
          const row = ((r * SS + sy) * off.width + c * SS) * 4;
          for (let sx = 0; sx < SS; sx++) sum += data[row + sx * 4]!;
        }
        const level = Math.round((sum / (SS * SS * 255)) * (RAMP.length - 1));
        if (level > 0) ctx.fillText(RAMP[level]!, c * cellW, r * cellH);
      }
    }
  }

  /** Move to a pose in a few quick held frames, the way the loading screen does. */
  function go(target: Pose, steps = 3, frameMs = 55) {
    clear();
    if (reduced.matches) return;
    const from = current;
    for (let i = 1; i <= steps; i++) later(i * frameMs, () => draw(mix(from, target, i / steps)));
  }

  draw(IDLE);

  return {
    intro(onDone) {
      clear();
      INTRO.forEach((pose, i) => later(i * INTRO_FRAME_MS, () => draw(pose)));
      later(INTRO.length * INTRO_FRAME_MS + 180, onDone);
    },
    snap() {
      if (reduced.matches) return;
      go(STRIKE, 2, 50);
      later(300, () => go(IDLE, 2, 50));
    },
    look(direction) {
      go(direction > 0 ? LOOK_RIGHT : direction < 0 ? LOOK_LEFT : IDLE, 2, 50);
    },
    rest() {
      clear();
      draw(IDLE);
    },
    tint() {
      const next = readInk();
      if (next === ink) return;
      ink = next;
      ctx.fillStyle = ink;
      draw(current);
    },
    destroy: clear,
  };
}
