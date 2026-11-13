/**
 * Loading-screen animation: an original lab-coated character snaps into a
 * dramatic "mad scientist" pose (one hand over the face, the other arm thrown
 * wide, coat flaring), drawn as ASCII. The figure is a small 2D rig rasterized
 * to an offscreen canvas each frame and converted to characters by brightness.
 */

export type AsciiStyle = "leaves" | "snow" | "rain" | "petals";

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

/** Seconds: hold idle, wind up, strike, then hold the pose and laugh. */
const T_WINDUP = 0.3;
const T_STRIKE = 0.75;
const T_POSED = 1.05;

const PARTICLES: Record<AsciiStyle, { glyphs: string; vx: [number, number]; vy: [number, number] }> = {
  leaves: { glyphs: "*%&~'\"", vx: [8, 18], vy: [1, 5] },
  snow: { glyphs: ".*+'", vx: [2, 6], vy: [2, 5] },
  rain: { glyphs: "|/'", vx: [3, 6], vy: [18, 26] },
  petals: { glyphs: "o*+'.", vx: [6, 14], vy: [1, 4] },
};

const RAMP = " .:-=+*#%@";
const FPS = 15;
const SS = 3;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const easeOutBack = (t: number) => 1 + 2.4 * (t - 1) ** 3 + 1.4 * (t - 1) ** 2;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function mix(a: Pose, b: Pose, t: number): Pose {
  const v = (p: Vec, q: Vec) => ({ x: lerp(p.x, q.x, t), y: lerp(p.y, q.y, t) });
  return {
    hip: v(a.hip, b.hip), lean: lerp(a.lean, b.lean, t), head: lerp(a.head, b.head, t),
    handL: v(a.handL, b.handL), handR: v(a.handR, b.handR), toFace: lerp(a.toFace, b.toFace, t),
    footL: lerp(a.footL, b.footL, t), footR: lerp(a.footR, b.footR, t),
    flare: lerp(a.flare, b.flare, t), sweep: lerp(a.sweep, b.sweep, t),
  };
}

function poseAt(t: number): Pose {
  if (t < T_WINDUP) return IDLE;
  if (t < T_STRIKE) return mix(IDLE, WINDUP, easeInOut((t - T_WINDUP) / (T_STRIKE - T_WINDUP)));
  if (t < T_POSED) return mix(WINDUP, STRIKE, easeOutBack((t - T_STRIKE) / (T_POSED - T_STRIKE)));
  // Laughing: shoulders bounce, head rocks, coat keeps fluttering.
  const laugh = t - T_POSED;
  const bounce = Math.abs(Math.sin(laugh * 11)) * 0.9;
  return {
    ...STRIKE,
    hip: { x: STRIKE.hip.x, y: STRIKE.hip.y + bounce * 0.5 },
    lean: STRIKE.lean - bounce * 1.2,
    head: STRIKE.head - bounce * 3,
    handL: { x: STRIKE.handL.x - bounce, y: STRIKE.handL.y + bounce * 1.5 },
  };
}

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

export interface AsciiPoseOptions {
  style: AsciiStyle;
  /** Called once when the animation has played through. */
  onDone?: () => void;
  /** Total seconds before onDone fires. */
  duration?: number;
}

export function mountAsciiPose(canvas: HTMLCanvasElement, options: AsciiPoseOptions): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const tokens = getComputedStyle(document.documentElement);
  const color = (name: string) => tokens.getPropertyValue(name).trim();
  const palette = [color("--color-silver-600"), color("--color-silver-400"), color("--color-paper")];
  const accent = color("--color-accent");
  const forward = color("--color-forward");
  const family = color("--font-ascii") || "monospace";
  const preset = PARTICLES[options.style] ?? PARTICLES.leaves;
  const duration = options.duration ?? 3;

  const off = document.createElement("canvas");
  const octx = off.getContext("2d", { willReadFrequently: true })!;

  let width = 0;
  let height = 0;
  let cellW = 6;
  let cellH = 12;
  let cols = 0;
  let rows = 0;
  let fontPx = 11;
  let unit = 1; // px per figure unit
  let originX = 0;
  let groundY = 0;
  let particles: { x: number; y: number; vx: number; vy: number; g: string }[] = [];
  let laughs: { x: number; y: number; born: number }[] = [];
  let lastLaugh = 0;
  let raf = 0;
  let startedAt = 0;
  let lastFrame = 0;
  let finished = false;
  let disposed = false;

  const spawn = (anywhere: boolean) => ({
    x: anywhere ? rand(0, cols) : rand(-10, -1),
    y: rand(0, rows),
    vx: rand(...preset.vx),
    vy: rand(...preset.vy),
    g: preset.glyphs[Math.floor(Math.random() * preset.glyphs.length)]!,
  });

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    fontPx = width < 640 ? 7 : 9;
    ctx!.font = `${fontPx}px ${family}`;
    cellW = ctx!.measureText("M").width || fontPx * 0.6;
    cellH = Math.round(fontPx * 1.15);
    cols = Math.ceil(width / cellW);
    rows = Math.ceil(height / cellH);
    off.width = cols * SS;
    off.height = rows * SS;

    // The figure is about 100 units tall and, mid-pose, about 80 wide.
    unit = Math.min((height * 0.84) / 108, (width * 0.94) / 78);
    originX = width / 2 + unit * 9;
    groundY = height / 2 + unit * 52;
    particles = Array.from({ length: Math.round((cols * rows) / 140) }, () => spawn(true));
  }

  function drawFigure(pose: Pose, t: number) {
    const c = octx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = "#000";
    c.fillRect(0, 0, off.width, off.height);
    // Draw in screen pixels; the transform squeezes them onto the sample grid.
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

    // Coat hem: wider and blown sideways as the pose flares, with a moving ripple.
    const hemY = hip.y - 25;
    const hemHalf = 9.5 + 13 * pose.flare;
    const hemX = hip.x + pose.sweep * 15;
    const hem = (from: number, to: number, lift: number) =>
      Array.from({ length: 9 }, (_, i) => {
        const k = i / 8;
        const x = hemX + lerp(from, to, k) * hemHalf;
        return { x, y: hemY + lift + Math.sin(t * 9 + x * 0.45) * 1.8 * pose.flare };
      });

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

    // 4. The arm thrown wide, with a spread hand.
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

    // 6. The other arm crosses in front, hand spread over the face.
    limb([shoulderR, armR.mid, armR.end], 5.4, TONE.coatShade);
    if (pose.toFace > 0.5) {
      for (const spread of [-0.9, -0.45, 0, 0.45, 0.9]) {
        const a = Math.PI / 2 - headRad + spread;
        limb([armR.end, { x: armR.end.x + Math.cos(a) * 8, y: armR.end.y + Math.sin(a) * 8 }], 1.9, TONE.hand);
      }
    }
    blob(armR.end, 3.6, 3.6, TONE.hand);

    return { head };
  }

  function render(t: number) {
    if (!cols || !rows) return;
    const pose = poseAt(t);
    const { head } = drawFigure(pose, t);
    const { data } = octx.getImageData(0, 0, off.width, off.height);

    ctx!.clearRect(0, 0, width, height);
    ctx!.font = `${fontPx}px ${family}`;
    ctx!.textBaseline = "top";

    const batches: number[][] = [[], [], []];
    const filled = new Uint8Array(cols * rows);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let sum = 0;
        for (let sy = 0; sy < SS; sy++) {
          const row = ((r * SS + sy) * off.width + c * SS) * 4;
          for (let sx = 0; sx < SS; sx++) sum += data[row + sx * 4]!;
        }
        const level = Math.round((sum / (SS * SS * 255)) * (RAMP.length - 1));
        if (level < 1) continue;
        filled[r * cols + c] = 1;
        batches[level < 4 ? 0 : level < 7 ? 1 : 2]!.push(c, r, level);
      }
    }

    // Impact lines radiate from behind the figure when the pose lands.
    const sinceStrike = t - T_STRIKE - 0.1;
    if (sinceStrike > 0) {
      const cx = originX / cellW;
      const cy = (groundY - 52 * unit) / cellH;
      const inner = (unit * 54) / cellH + Math.max(0, 0.4 - sinceStrike) * 14;
      const strength = sinceStrike < 0.5 ? 1 : 0.55;
      ctx!.fillStyle = sinceStrike < 0.35 ? palette[1]! : palette[0]!;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (filled[r * cols + c]) continue;
          const dx = (c - cx) * (cellW / cellH);
          const dy = r - cy;
          const dist = Math.hypot(dx, dy);
          if (dist < inner) continue;
          const angle = Math.atan2(dy, dx);
          const ray = Math.floor(((angle + Math.PI) / (Math.PI * 2)) * 260);
          const seed = Math.sin(ray * 91.7 + Math.floor(t * 7) * 13.1) * 43758.5;
          const chance = seed - Math.floor(seed);
          // Each ray is a dashed streak that starts a little further out than its neighbors.
          if (chance > strength * 0.34 || dist < inner + chance * 40) continue;
          const dir = Math.abs(Math.cos(angle));
          const glyph = dir > 0.92 ? "-" : dir < 0.38 ? "|" : dx * dy > 0 ? "\\" : "/";
          ctx!.fillText(glyph, c * cellW, r * cellH);
        }
      }
    }

    batches.forEach((cells, i) => {
      ctx!.fillStyle = palette[i]!;
      for (let k = 0; k < cells.length; k += 3) {
        ctx!.fillText(RAMP[cells[k + 2]!]!, cells[k]! * cellW, cells[k + 1]! * cellH);
      }
    });

    // Season glyphs blow past in front of everything.
    ctx!.fillStyle = forward;
    for (const p of particles) {
      const c = Math.round(p.x);
      const r = Math.round(p.y);
      if (c < 0 || c >= cols || r < 0 || r >= rows) continue;
      ctx!.clearRect(c * cellW, r * cellH, cellW, cellH);
      ctx!.fillText(p.g, c * cellW, r * cellH);
    }

    // The laugh.
    if (t > T_POSED && t - lastLaugh > 0.22) {
      lastLaugh = t;
      laughs.push({ x: originX + (head.x + rand(6, 20)) * unit, y: groundY - (head.y + rand(2, 10)) * unit, born: t });
    }
    ctx!.fillStyle = accent;
    ctx!.font = `bold ${Math.round(fontPx * 1.6)}px ${family}`;
    laughs = laughs.filter((l) => t - l.born < 0.9);
    for (const l of laughs) {
      const age = t - l.born;
      ctx!.fillText("HA", l.x + age * unit * 14, l.y - age * unit * 20);
    }
  }

  function loop(now: number) {
    if (disposed) return;
    raf = requestAnimationFrame(loop);
    if (!startedAt) startedAt = now;
    if (now - lastFrame < 1000 / FPS) return;
    const dt = Math.min(0.2, (now - (lastFrame || now)) / 1000);
    lastFrame = now;
    const t = (now - startedAt) / 1000;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]!;
      const gust = t > T_STRIKE ? 2.2 : 1;
      p.x += p.vx * dt * gust;
      p.y += p.vy * dt;
      if (p.x > cols + 2 || p.y > rows + 2) particles[i] = spawn(false);
    }
    render(t);

    if (!finished && t >= duration) {
      finished = true;
      options.onDone?.();
    }
  }

  const onResize = () => resize();
  window.addEventListener("resize", onResize);
  resize();
  raf = requestAnimationFrame(loop);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
  };
}

