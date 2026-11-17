/**
 * Home's autumn scene, brought to life (DESIGN.md section 5, "Home scene").
 *
 * The loop: leaves fall from the two trees, the penguin carries them to a pile a
 * few at a time, steps back, runs and jumps in. The pile bursts, a gust carries
 * every leaf back to its tree while he naps where he landed, then he wakes and
 * the leaves start to fall again.
 *
 * The visitor can interfere twice. A pointer on the penguin makes him stop and
 * laugh for as long as it stays there. A click on the pile blows it apart, which
 * makes him sad before he starts over.
 *
 * The scene is drawn in a small world of its own: 220 units tall, 640 wide (360
 * on a phone), with the ground at the bottom edge. The penguin's behaviour is a
 * generator that is stepped once a frame, so each routine reads top to bottom.
 */

const HEIGHT = 220;
const GROUND = HEIGHT;
const CARRY = 6;
/** The mound, bottom row first. 36 leaves in all. */
const PILE_ROWS = [9, 8, 7, 6, 4, 2];

type Point = { x: number; y: number };
type Pose = Point & { r: number };
type LeafState = "tree" | "tween" | "carried" | "ground" | "pile" | "free";
type Eyes = "open" | "happy" | "closed" | "sad";
type Phase = "shed" | "gather" | "admire" | "jump" | "nap" | "wake" | "sad";

interface Leaf {
  el: SVGElement;
  tree: number;
  /** Its place in the crown, relative to the foot of its tree. */
  dx: number;
  dy: number;
  rot0: number;
  scale: number;
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  vr: number;
  state: LeafState;
  /** A tween in progress: where from, where to, and what the leaf becomes. */
  t: number;
  dur: number;
  delay: number;
  from: Pose;
  to: Pose;
  arc: number;
  sway: number;
  via?: [Point, Point];
  ease: (t: number) => number;
  then: LeafState;
  /** A free leaf that was blown lands on the ground; one from the burst waits for the wind. */
  lands: boolean;
  /** Its place in his arms or in the pile. */
  slot: number;
  drawn: string;
}

/** CSS cubic-bezier as a function, so the scene eases with the site's own curves. */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let u = t;
    for (let i = 0; i < 6; i++) {
      const x = ((ax * u + bx) * u + cx) * u - t;
      const slope = (3 * ax * u + 2 * bx) * u + cx;
      if (Math.abs(x) < 1e-4 || slope === 0) break;
      u -= x / slope;
    }
    return ((ay * u + by) * u + cy) * u;
  };
}

/** DESIGN.md `ease`, and the stronger in-out used for things that travel. */
const easeOut = bezier(0.23, 1, 0.32, 1);
const easeInOut = bezier(0.77, 0, 0.175, 1);
const linear = (t: number) => t;
/** Something falling: slow off the branch, then steady. */
const fall = (t: number) => t * (0.55 + 0.45 * t);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const between = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const fixed = (n: number) => Math.round(n * 10) / 10;

export function mountLeafPile(stage: SVGSVGElement): () => void {
  const q = <T extends Element>(selector: string) => stage.querySelector<T>(selector)!;
  const all = <T extends Element>(selector: string) => [...stage.querySelectorAll<T>(selector)];

  const section = stage.closest<HTMLElement>("section");
  const main = stage.closest<HTMLElement>("main");
  const trees = all<SVGGElement>("[data-tree]");
  const penguin = q<SVGGElement>("[data-penguin]");
  const feet = all<SVGElement>("[data-foot]");
  const flippers = { back: q<SVGGElement>('[data-flipper="back"]'), front: q<SVGGElement>('[data-flipper="front"]') };
  const eyes = Object.fromEntries(all<SVGElement>("[data-eyes]").map((el) => [el.dataset.eyes, el])) as Record<Eyes, SVGElement>;
  const beak = q<SVGElement>("[data-beak]");
  const windLines = all<SVGPathElement>("[data-wind] path");
  const zzz = all<SVGTextElement>("[data-zzz] text");

  const compactQuery = window.matchMedia("(max-width: 479px)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const leaves: Leaf[] = all<SVGElement>("[data-leaves] path").map((el) => ({
    el,
    tree: Number(el.dataset.treeIndex),
    dx: Number(el.dataset.dx),
    dy: Number(el.dataset.dy),
    rot0: Number(el.dataset.rot),
    scale: Number(el.dataset.scale),
    x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0,
    state: "tree",
    t: 0, dur: 0, delay: 0,
    from: { x: 0, y: 0, r: 0 },
    to: { x: 0, y: 0, r: 0 },
    arc: 0, sway: 0, ease: linear, then: "tree",
    lands: false, slot: 0, drawn: "",
  }));

  /** The mound's places, relative to its centre on the ground, bottom row first. */
  const pileSlots: Pose[] = PILE_ROWS.flatMap((count, row) =>
    Array.from({ length: count }, (_, i) => ({
      x: ((i + 0.5) / count - 0.5) * count * 7.4 + between(-1.6, 1.6),
      y: -2.6 - row * 4.3 + between(-0.8, 0.8),
      r: between(-38, 38),
    })),
  );

  // The stage, which is narrower on a phone.
  let width = 640;
  let treeX = [140, 500];
  let pileX = 320;
  let compact = false;

  // The penguin. `y` is height above the ground (negative is up).
  const P = {
    x: 280, y: 0, dir: 1,
    /** Side-to-side rock about the feet, and a roll about the middle (90 is lying down). */
    rock: 0, roll: 0, lie: 0,
    sx: 1, sy: 1,
    /** How far the flippers have come round to hold something (0 at his sides, 1 in front). */
    hold: 0, flap: 0,
    step: 0,
    eyes: "open" as Eyes,
  };

  let phase: Phase = "shed";
  let routine: Generator<void> = life(false);
  let carried: Leaf[] = [];
  let pileCount = 0;
  let airborne = false;
  let asleep = false;

  let time = 0;
  /** The frame's length, read by the routine's helpers. */
  let dt = 0;
  let blinkAt = 3;
  let laughUntil = -1;
  let windAt = -10;
  const naps = zzz.map(() => -1);
  let napAt = 0;

  // The pointer, in page coordinates, and whether it is a mouse that can hover.
  let pointer: Point | null = null;
  let tapUntil = -1;
  let matrix: DOMMatrix | null = null;

  /* ---------- the world ---------- */

  const slotOf = (leaf: Leaf): Pose => ({
    x: treeX[leaf.tree]! + (leaf.tree ? -leaf.dx : leaf.dx),
    y: GROUND + leaf.dy,
    r: leaf.rot0,
  });

  const count = (state: LeafState) => leaves.reduce((n, leaf) => n + (leaf.state === state ? 1 : 0), 0);

  function send(leaf: Leaf, to: Pose, then: LeafState, options: Partial<Pick<Leaf, "dur" | "delay" | "arc" | "sway" | "via" | "ease">>) {
    leaf.state = "tween";
    leaf.t = 0;
    leaf.from = { x: leaf.x, y: leaf.y, r: leaf.r };
    leaf.to = to;
    leaf.then = then;
    leaf.dur = options.dur ?? 0.4;
    leaf.delay = options.delay ?? 0;
    leaf.arc = options.arc ?? 0;
    leaf.sway = options.sway ?? 0;
    leaf.via = options.via;
    leaf.ease = options.ease ?? easeOut;
  }

  /** Where a leaf rests on the ground: near its tree, clear of where the pile goes. */
  function groundSpot(x: number): Pose {
    let gx = clamp(x, 10, width - 10);
    if (Math.abs(gx - pileX) < 36) gx = pileX + (gx < pileX ? -36 : 36) - between(0, 8) * Math.sign(pileX - gx || 1);
    return { x: gx, y: GROUND - 2.4 - Math.random(), r: between(-28, 28) };
  }

  /** The trees let go: every leaf on a branch drifts down, a few at a time. */
  function shed() {
    const waiting = leaves.filter((leaf) => leaf.state === "tree").sort(() => Math.random() - 0.5);
    const reach = compact ? 56 : 68;
    waiting.forEach((leaf, i) => {
      const spot = groundSpot(treeX[leaf.tree]! + between(-reach, reach));
      spot.r += Math.random() < 0.5 ? 180 : 0;
      send(leaf, spot, "ground", { dur: between(2, 2.9), delay: i * 0.21 + between(0, 0.15), sway: between(7, 16), ease: fall });
    });
  }

  /** He lands: the pile goes up. */
  function burst() {
    for (const leaf of leaves) {
      if (leaf.state !== "pile" && !(leaf.state === "tween" && leaf.then === "pile")) continue;
      leaf.state = "free";
      leaf.lands = false;
      leaf.vx = between(-150, 150);
      leaf.vy = -between(190, 340);
      leaf.vr = between(-520, 520);
    }
    pileCount = 0;
  }

  /** The gust: every loose leaf rides a curve back to its place in a crown. */
  function gust() {
    windAt = time;
    for (const leaf of leaves) {
      if (leaf.state !== "free") continue;
      const home = slotOf(leaf);
      const toward = Math.sign(home.x - leaf.x) || 1;
      home.r += 360 * toward;
      send(leaf, home, "tree", {
        dur: between(1.5, 2.3),
        delay: between(0, 0.55),
        ease: easeInOut,
        via: [
          { x: leaf.x + toward * 30, y: leaf.y - between(30, 70) },
          { x: home.x - toward * between(30, 70), y: home.y - between(10, 46) },
        ],
      });
    }
  }

  /** A click on the pile: everything in it, and anything on its way there, scatters. */
  function blow(from: number) {
    for (const leaf of leaves) {
      const inPile = leaf.state === "pile" || (leaf.state === "tween" && (leaf.then === "pile" || leaf.then === "carried"));
      if (!inPile && leaf.state !== "carried") continue;
      const held = leaf.state === "carried" || leaf.then === "carried";
      leaf.state = "free";
      leaf.lands = true;
      const away = leaf.x === from ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(leaf.x - from);
      leaf.vx = held ? between(-50, 50) : away * between(110, 300);
      leaf.vy = held ? 0 : -between(40, 160);
      leaf.vr = between(-480, 480);
    }
    pileCount = 0;
    carried = [];
    routine = upset();
  }

  function stepLeaves(d: number) {
    for (const leaf of leaves) {
      if (leaf.state === "tween") {
        leaf.t += d;
        const k = leaf.ease(clamp((leaf.t - leaf.delay) / leaf.dur, 0, 1));
        // A leaf on its way to his arms follows him if he moves.
        const to = leaf.then === "carried" ? carryPose(leaf.slot) : leaf.to;
        if (leaf.via) {
          const [a, b] = leaf.via;
          const u = 1 - k;
          leaf.x = u * u * u * leaf.from.x + 3 * u * u * k * a.x + 3 * u * k * k * b.x + k * k * k * to.x;
          leaf.y = u * u * u * leaf.from.y + 3 * u * u * k * a.y + 3 * u * k * k * b.y + k * k * k * to.y;
        } else {
          leaf.x = lerp(leaf.from.x, to.x, k) + leaf.sway * Math.sin(k * Math.PI * 3 + leaf.slot) * (1 - k);
          leaf.y = lerp(leaf.from.y, to.y, k) - leaf.arc * 4 * k * (1 - k);
        }
        leaf.r = lerp(leaf.from.r, to.r, k) + leaf.sway * 2.2 * Math.sin(k * Math.PI * 3 + leaf.slot) * (1 - k);
        if (leaf.t >= leaf.delay + leaf.dur) leaf.state = leaf.then;
      } else if (leaf.state === "carried") {
        Object.assign(leaf, carryPose(leaf.slot));
      } else if (leaf.state === "free") {
        leaf.vy += 430 * d;
        leaf.vx *= 1 - Math.min(1, 1.3 * d);
        leaf.x += leaf.vx * d;
        leaf.y += leaf.vy * d;
        leaf.r += leaf.vr * d;
        if (leaf.x < 8 || leaf.x > width - 8) {
          leaf.x = clamp(leaf.x, 8, width - 8);
          leaf.vx *= -0.4;
        }
        const floor = GROUND - 2.6;
        if (leaf.y >= floor && leaf.vy > 0) {
          leaf.y = floor;
          leaf.vy = 0;
          leaf.vx *= 1 - Math.min(1, 7 * d);
          leaf.vr *= 1 - Math.min(1, 9 * d);
          if (leaf.lands && Math.abs(leaf.vx) < 6) leaf.state = "ground";
        }
      }
    }
  }

  /* ---------- the penguin's routines ---------- */

  function* wait(seconds: number): Generator<void> {
    for (let t = 0; t < seconds; t += dt) yield;
  }

  function* until(done: () => boolean): Generator<void> {
    while (!done()) yield;
  }

  function* tween(seconds: number, apply: (k: number) => void, ease = easeOut): Generator<void> {
    for (let t = 0; t < seconds; t += dt) {
      apply(ease(Math.min(1, t / seconds)));
      yield;
    }
    apply(1);
  }

  /** A waddle: he rocks from foot to foot and bobs as he goes. */
  function* walkTo(x: number, speed = 132): Generator<void> {
    const goal = clamp(x, 16, width - 16);
    if (Math.abs(goal - P.x) > 1) P.dir = goal > P.x ? 1 : -1;
    while (Math.abs(goal - P.x) > 0.5) {
      P.x += Math.sign(goal - P.x) * Math.min(Math.abs(goal - P.x), speed * dt);
      P.step += dt * (9 + speed * 0.035);
      P.rock = Math.sin(P.step) * 6;
      P.y = -Math.abs(Math.sin(P.step)) * 1.8;
      yield;
    }
    const rock = P.rock;
    const lift = P.y;
    yield* tween(0.12, (k) => {
      P.rock = rock * (1 - k);
      P.y = lift * (1 - k);
    });
  }

  /** Where the leaf in place `slot` of his arms is, on the stage. */
  function carryPose(slot: number): Pose {
    return {
      x: P.x + P.dir * (5 + ((slot % 3) - 1) * 5.5),
      y: GROUND + P.y + laughBob() - 20 - Math.floor(slot / 3) * 4.5,
      r: (slot % 2 ? 24 : -18) + slot * 9,
    };
  }

  function* gather(): Generator<void> {
    phase = "gather";
    for (;;) {
      const ground = leaves.filter((leaf) => leaf.state === "ground");
      if (!ground.length) {
        if (leaves.every((leaf) => leaf.state === "pile")) return;
        // Leaves are still on their way down: he waits, watching the nearest.
        const falling = leaves.filter((leaf) => leaf.state === "tween");
        if (falling.length && Math.abs(falling[0]!.x - P.x) > 12) P.dir = falling[0]!.x > P.x ? 1 : -1;
        yield;
        continue;
      }

      // The nearest leaf, and up to five more lying close to it.
      const near = ground.reduce((a, b) => (Math.abs(b.x - P.x) < Math.abs(a.x - P.x) ? b : a));
      const armful = ground
        .filter((leaf) => Math.abs(leaf.x - near.x) < 84)
        .sort((a, b) => Math.abs(a.x - near.x) - Math.abs(b.x - near.x))
        .slice(0, CARRY);
      yield* walkTo(armful.reduce((sum, leaf) => sum + leaf.x, 0) / armful.length);

      // Bend, scoop, stand.
      yield* tween(0.22, (k) => {
        P.roll = 15 * k;
        P.sy = 1 - 0.08 * k;
        P.hold = k;
      });
      carried = armful;
      armful.forEach((leaf, i) => {
        leaf.slot = i;
        send(leaf, carryPose(i), "carried", { dur: 0.26, delay: i * 0.05, arc: 9 });
      });
      yield* wait(0.3 + armful.length * 0.05);
      yield* tween(0.18, (k) => {
        P.roll = 15 * (1 - k);
        P.sy = 0.92 + 0.08 * k;
      });

      // Carry them to the nearer side of the pile and toss them on.
      const side = P.x < pileX ? -1 : 1;
      yield* walkTo(pileX + side * 27);
      P.dir = -side;
      yield* tween(0.16, (k) => {
        P.roll = 11 * k;
      });
      carried.forEach((leaf, i) => {
        const place = pileSlots[pileCount++ % pileSlots.length]!;
        send(leaf, { x: pileX + place.x, y: GROUND + place.y, r: place.r }, "pile", { dur: 0.46, delay: i * 0.045, arc: 16 });
      });
      carried = [];
      yield* tween(0.34, (k) => {
        P.roll = 11 * (1 - k);
        P.hold = 1 - k;
        P.flap = Math.sin(Math.PI * k) * 46;
      });
      yield* wait(0.22);
    }
  }

  function* admireAndJump(): Generator<void> {
    phase = "admire";
    const side = P.x < pileX ? -1 : 1;
    yield* walkTo(pileX + side * (compact ? 64 : 86));
    P.dir = -side;
    yield* wait(0.3);
    // Two small hops: he is pleased with it.
    for (let hop = 0; hop < 2; hop++) {
      yield* tween(0.3, (k) => {
        P.y = -9 * Math.sin(Math.PI * k);
        P.flap = 34 * Math.sin(Math.PI * k);
      }, linear);
    }
    yield* wait(0.22);
    // Crouch, run, leap.
    yield* tween(0.24, (k) => {
      P.sy = 1 - 0.14 * k;
      P.sx = 1 + 0.08 * k;
    });
    phase = "jump";
    P.sx = P.sy = 1;
    yield* walkTo(pileX + side * 40, 190);
    airborne = true;
    const from = P.x;
    yield* tween(0.6, (k) => {
      P.x = lerp(from, pileX, k);
      P.y = -44 * 4 * k * (1 - k);
      P.roll = 90 * k;
      P.lie = 10 * k;
      P.flap = 60 * Math.sin(Math.PI * k);
    }, linear);
    airborne = false;
    P.y = 0;
    burst();
    P.eyes = "happy";
    yield* tween(0.12, (k) => {
      P.sx = 1 - 0.12 * k;
      P.sy = 1 + 0.1 * k;
    });
    yield* tween(0.24, (k) => {
      P.sx = 0.88 + 0.12 * k;
      P.sy = 1.1 - 0.1 * k;
    });
  }

  function* nap(): Generator<void> {
    phase = "nap";
    yield* wait(0.75);
    gust();
    P.eyes = "closed";
    asleep = true;
    napAt = time + 0.5;
    yield* until(() => leaves.every((leaf) => leaf.state === "tree"));
    yield* wait(1.7);
  }

  function* wake(): Generator<void> {
    phase = "wake";
    asleep = false;
    P.eyes = "open";
    blinkAt = time + 0.25;
    yield* wait(0.55);
    yield* tween(0.44, (k) => {
      P.roll = 90 * (1 - k);
      P.lie = 10 * (1 - k);
      P.y = -9 * Math.sin(Math.PI * k);
    });
    // Where did they all go?
    yield* wait(0.4);
    P.dir = -P.dir;
    yield* wait(0.5);
    P.dir = -P.dir;
    yield* wait(0.4);
  }

  /** His pile was blown away. He slumps for a moment, then starts again. */
  function* upset(): Generator<void> {
    phase = "sad";
    airborne = false;
    asleep = false;
    const start = { ...P };
    P.dir = P.x < pileX ? 1 : -1;
    yield* tween(0.16, (k) => {
      P.y = -5 * Math.sin(Math.PI * k);
      P.rock = start.rock * (1 - k);
      P.sx = lerp(start.sx, 1, k);
    }, linear);
    P.eyes = "sad";
    yield* tween(0.42, (k) => {
      P.roll = lerp(start.roll, 10, k);
      P.sy = lerp(start.sy, 0.93, k);
      P.hold = start.hold * (1 - k);
      P.flap = start.flap * (1 - k);
    });
    // A long sigh.
    yield* tween(1.7, (k) => {
      P.sy = 0.93 - 0.04 * Math.sin(Math.PI * k);
    }, linear);
    yield* tween(0.3, (k) => {
      P.roll = 10 * (1 - k);
      P.sy = 0.93 + 0.07 * k;
    });
    P.eyes = "open";
    yield* life(true);
  }

  function* life(leavesAreDown: boolean): Generator<void> {
    for (let first = !leavesAreDown; ; first = true) {
      if (first) {
        phase = "shed";
        yield* wait(0.7);
        shed();
        yield* until(() => count("ground") >= 8);
      }
      yield* gather();
      yield* admireAndJump();
      yield* nap();
      yield* wake();
    }
  }

  /* ---------- the visitor ---------- */

  const laughing = () => time < laughUntil && !airborne;
  const laughBob = () => (laughing() ? -Math.abs(Math.sin(time * 16)) * 1.6 : 0);

  /** A page position, in stage units. */
  function toStage(client: Point): Point {
    matrix ??= stage.getScreenCTM();
    if (!matrix || !matrix.a) return { x: -999, y: -999 };
    return { x: (client.x - matrix.e) / matrix.a, y: (client.y - matrix.f) / matrix.d };
  }

  /** On his body: an oval a little larger than he is, upright or lying down. */
  const onPenguin = (at: Point) => {
    const lying = P.lie > 5;
    const dx = (at.x - P.x) / (lying ? 36 : 25);
    const dy = (at.y - (GROUND + P.y - (lying ? 14 : 32))) / (lying ? 25 : 35);
    return dx * dx + dy * dy < 1;
  };

  /** The pile can be blown only while it is standing and he is not already in the air. */
  const pileStands = () => pileCount >= 3 && (phase === "gather" || phase === "admire" || (phase === "jump" && !airborne));
  const onPile = (at: Point) => pileStands() && Math.abs(at.x - pileX) < 40 && at.y > GROUND - 40 && at.y < GROUND + 8;

  const frozen = () => document.hidden || !!main?.inert;

  function onPointerMove(event: PointerEvent) {
    pointer = event.pointerType === "touch" ? null : { x: event.clientX, y: event.clientY };
  }
  function onPointerGone() {
    pointer = null;
  }
  function onPointerDown(event: PointerEvent) {
    if (frozen() || (event.target as Element | null)?.closest("a, button, [role='dialog']")) return;
    const at = toStage({ x: event.clientX, y: event.clientY });
    // He often stands right beside his pile; a click on the pile is meant for the pile.
    if (onPile(at)) blow(at.x);
    else if (onPenguin(at) && event.pointerType === "touch") tapUntil = time + 1.6;
  }
  function onViewChange() {
    matrix = null;
  }

  /* ---------- drawing ---------- */

  function draw() {
    const laugh = laughing();
    const y = P.y + laughBob();
    const jiggle = laugh ? Math.sin(time * 32) * 0.03 : 0;
    penguin.setAttribute(
      "transform",
      `translate(${fixed(P.x)} ${fixed(GROUND + y + P.lie)}) scale(${P.dir} 1) rotate(${fixed(P.rock)}) ` +
        `rotate(${fixed(P.roll)} 0 -32) scale(${fixed(P.sx + jiggle)} ${fixed(P.sy - jiggle)})`,
    );

    // Flippers: at his sides, round in front to hold leaves, or flapping.
    const flap = P.flap + (laugh ? 16 + Math.sin(time * 22) * 14 : 0);
    flippers.back.setAttribute("transform", `rotate(${fixed(-P.hold * 52 + flap)} -19 -40)`);
    flippers.front.setAttribute("transform", `rotate(${fixed(P.hold * 52 - flap)} 19 -40)`);

    // Feet lift in turn while he walks.
    const stride = Math.sin(P.step);
    feet[0]!.setAttribute("transform", `translate(0 ${fixed(Math.min(0, stride) * 2)})`);
    feet[1]!.setAttribute("transform", `translate(0 ${fixed(Math.min(0, -stride) * 2)})`);

    const blinking = P.eyes === "open" && time > blinkAt && time < blinkAt + 0.13;
    const shown: Eyes = laugh ? "happy" : blinking ? "closed" : P.eyes;
    for (const [name, el] of Object.entries(eyes)) el.setAttribute("display", name === shown ? "inline" : "none");
    if (time > blinkAt + 0.13) blinkAt = time + between(2.4, 5);
    beak.setAttribute("ry", fixed(laugh ? 2.6 + Math.sin(time * 22) * 1 : 2).toString());

    for (const leaf of leaves) {
      const next = `translate(${fixed(leaf.x)} ${fixed(leaf.y)}) rotate(${fixed(leaf.r)}) scale(${leaf.scale})`;
      if (next !== leaf.drawn) leaf.el.setAttribute("transform", (leaf.drawn = next));
    }

    // The gust, as four faint lines that sweep from the pile toward the trees.
    windLines.forEach((line, i) => {
      const k = clamp((time - windAt - i * 0.09) / 1.1, 0, 1);
      const length = Number(line.dataset.length);
      line.style.opacity = String(fixed(Math.sin(Math.PI * k) * 0.55));
      line.setAttribute("stroke-dashoffset", fixed(length * 0.3 - k * length * 1.3).toString());
    });

    // Sleep: small z's drift up from his head.
    const dozing = asleep && !laugh;
    if (dozing && time > napAt) {
      const free = naps.findIndex((age) => age < 0);
      if (free >= 0) naps[free] = 0;
      napAt = time + 0.8;
    }
    zzz.forEach((z, i) => {
      const age = naps[i]!;
      if (age < 0 || age > 1.9 || !dozing) {
        naps[i] = -1;
        z.style.opacity = "0";
        return;
      }
      naps[i] = age + dt;
      z.setAttribute("x", fixed(P.x + P.dir * 26 + 4 + age * 9).toString());
      z.setAttribute("y", fixed(GROUND - 30 - age * 15).toString());
      z.style.opacity = String(fixed(Math.sin((Math.PI * age) / 1.9) * 0.9));
    });

    const mood = laugh ? "laughing" : P.eyes === "sad" ? "sad" : asleep ? "asleep" : "calm";
    if (stage.dataset.mood !== mood) stage.dataset.mood = mood;
    if (stage.dataset.phase !== phase) stage.dataset.phase = phase;
    if (stage.dataset.pile !== String(pileCount)) stage.dataset.pile = String(pileCount);
  }

  /** Fit the stage to the screen and put everything back at the start. */
  function arrange() {
    compact = compactQuery.matches;
    width = compact ? 360 : 640;
    treeX = compact ? [58, 302] : [140, 500];
    pileX = width / 2;
    matrix = null;
    stage.setAttribute("viewBox", `0 0 ${width} ${HEIGHT}`);
    trees.forEach((tree, i) => tree.setAttribute("transform", `translate(${treeX[i]} ${GROUND})${i ? " scale(-1 1)" : ""}`));

    windLines.forEach((line, i) => {
      const side = i < 2 ? -1 : 1;
      const tree = treeX[i < 2 ? 0 : 1]!;
      const lift = i % 2 ? 26 : 0;
      line.setAttribute(
        "d",
        `M${pileX + side * 8} ${GROUND - 36 - lift}C${pileX + side * 60} ${GROUND - 64 - lift} ` +
          `${tree - side * 70} ${GROUND - 86 - lift} ${tree - side * 12} ${GROUND - 132 - lift}`,
      );
      const length = line.getTotalLength();
      line.dataset.length = String(length);
      line.setAttribute("stroke-dasharray", `${fixed(length * 0.3)} ${fixed(length * 1.4)}`);
    });

    for (const leaf of leaves) {
      Object.assign(leaf, slotOf(leaf), { state: "tree", vx: 0, vy: 0, vr: 0 });
    }
    Object.assign(P, { x: pileX - (compact ? 34 : 44), y: 0, dir: 1, rock: 0, roll: 0, lie: 0, sx: 1, sy: 1, hold: 0, flap: 0, eyes: "open" });
    carried = [];
    pileCount = 0;
    airborne = asleep = false;
    naps.fill(-1);
    windAt = -10;
    routine = life(false);
  }

  /* ---------- running ---------- */

  let raf = 0;
  let last = 0;

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const elapsed = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (frozen()) return;
    dt = elapsed;
    time += dt;

    // A mouse resting on him, or a recent tap, keeps him laughing; he stays put while he does.
    const at = pointer && toStage(pointer);
    if ((at && onPenguin(at)) || time < tapUntil) laughUntil = time + 0.35;
    if (section) section.style.cursor = at && onPile(at) ? "pointer" : "";

    if (!laughing()) routine.next();
    stepLeaves(dt);
    draw();
  }

  arrange();
  draw();

  // Reduced motion: the resting picture, nothing else.
  if (reduced) return () => {};

  const listen = new AbortController();
  const { signal } = listen;
  window.addEventListener("pointermove", onPointerMove, { passive: true, signal });
  window.addEventListener("pointerdown", onPointerDown, { signal });
  window.addEventListener("blur", onPointerGone, { signal });
  document.documentElement.addEventListener("pointerleave", onPointerGone, { signal });
  window.addEventListener("resize", onViewChange, { passive: true, signal });
  window.addEventListener("scroll", onViewChange, { passive: true, signal });
  compactQuery.addEventListener("change", arrange, { signal });

  last = performance.now();
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    listen.abort();
    if (section) section.style.cursor = "";
  };
}
