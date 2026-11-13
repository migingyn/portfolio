/**
 * Seasonal ASCII visual: an optional large glyph (the season's kanji) drawn as a
 * shimmering character mask, with a style-specific drift of glyphs over it.
 * Monochrome silver by design (DESIGN.md: one accent element per viewport).
 * Runs at a low frame rate, pauses when the tab is hidden, and renders a single
 * still frame under prefers-reduced-motion.
 */

export type AsciiStyle = "leaves" | "snow" | "rain" | "petals";

interface StylePreset {
  glyphs: string;
  /** Cells per second, [min, max]. */
  vx: [number, number];
  vy: [number, number];
  /** Horizontal sway amplitude in cells. */
  sway: number;
  /** Relative particle count. */
  density: number;
}

const STYLES: Record<AsciiStyle, StylePreset> = {
  leaves: { glyphs: "*%&~'\",`", vx: [0.6, 2.2], vy: [1.2, 3], sway: 1.6, density: 1 },
  snow: { glyphs: ".*+'`", vx: [-0.4, 0.4], vy: [0.8, 2], sway: 0.8, density: 1.4 },
  rain: { glyphs: "|/!'", vx: [-1.5, -0.8], vy: [9, 14], sway: 0, density: 1.6 },
  petals: { glyphs: "o*+'.", vx: [-2, -0.6], vy: [0.8, 1.8], sway: 2, density: 1 },
};

const RAMP = " .:-=+*#%@";
const FPS = 12;
/** Mask samples per cell edge. */
const SAMPLES = 4;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  glyph: string;
  bright: boolean;
}

export interface AsciiFieldOptions {
  style: AsciiStyle;
  /** Large glyph to draw as a mask, e.g. "秋". */
  glyph?: string;
  /** Element whose box the glyph is centered in. Defaults to the canvas. */
  stage?: Element | null;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export function mountAsciiField(canvas: HTMLCanvasElement, options: AsciiFieldOptions): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const preset = STYLES[options.style] ?? STYLES.leaves;
  const tokens = getComputedStyle(document.documentElement);
  const color = (name: string) => tokens.getPropertyValue(name).trim();
  const palette = {
    low: color("--color-silver-600"),
    mid: color("--color-silver-500"),
    high: color("--color-silver-400"),
    bright: color("--color-silver-50"),
    cool: color("--color-periwinkle"),
  };
  const monoFamily = color("--font-mono") || "monospace";
  // The body face, not the display face: its lighter strokes stay legible at cell resolution.
  const glyphFamily = color("--font-body") || "sans-serif";
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  let width = 0;
  let height = 0;
  let cellW = 8;
  let cellH = 18;
  let cols = 0;
  let rows = 0;
  let fontPx = 14;
  let mask = new Float32Array(0);
  let particles: Particle[] = [];
  let frame = 0;
  let raf = 0;
  let last = 0;
  let disposed = false;

  function spawn(anywhere: boolean): Particle {
    return {
      x: rand(-4, cols + 4),
      y: anywhere ? rand(0, rows) : rand(-6, -1),
      vx: rand(...preset.vx),
      vy: rand(...preset.vy),
      phase: rand(0, Math.PI * 2),
      glyph: preset.glyphs[Math.floor(Math.random() * preset.glyphs.length)]!,
      bright: Math.random() < 0.7,
    };
  }

  function buildMask() {
    mask = new Float32Array(cols * rows);
    if (!options.glyph || !cols || !rows) return;

    const box = (options.stage ?? canvas).getBoundingClientRect();
    const origin = canvas.getBoundingClientRect();
    const stageW = box.width || width;
    const stageH = box.height || height;
    const size = Math.min(stageH * 0.78, (stageW * 0.86) / options.glyph.length, 680);
    if (size < 40) return;

    const off = document.createElement("canvas");
    off.width = cols * SAMPLES;
    off.height = rows * SAMPLES;
    const octx = off.getContext("2d", { willReadFrequently: true });
    if (!octx) return;
    octx.setTransform(SAMPLES / cellW, 0, 0, SAMPLES / cellH, 0, 0);
    octx.font = `400 ${size}px ${glyphFamily}`;
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillStyle = "#fff";
    octx.fillText(options.glyph, box.left - origin.left + stageW / 2, box.top - origin.top + stageH / 2);

    const { data } = octx.getImageData(0, 0, off.width, off.height);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let sum = 0;
        for (let sy = 0; sy < SAMPLES; sy++) {
          const rowStart = ((r * SAMPLES + sy) * off.width + c * SAMPLES) * 4;
          for (let sx = 0; sx < SAMPLES; sx++) sum += data[rowStart + sx * 4 + 3]!;
        }
        mask[r * cols + c] = sum / (SAMPLES * SAMPLES * 255);
      }
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    if (!width || !height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    fontPx = width < 768 ? 10 : 13;
    ctx!.font = `500 ${fontPx}px ${monoFamily}`;
    ctx!.textBaseline = "top";
    cellW = ctx!.measureText("M").width || fontPx * 0.6;
    cellH = Math.round(fontPx * 1.35);
    cols = Math.ceil(width / cellW);
    rows = Math.ceil(height / cellH);

    const count = Math.round(((cols * rows) / 110) * preset.density);
    particles = Array.from({ length: count }, () => spawn(true));
    buildMask();
    draw();
  }

  function draw() {
    if (!cols || !rows) return;
    ctx!.clearRect(0, 0, width, height);
    ctx!.font = `500 ${fontPx}px ${monoFamily}`;
    ctx!.textBaseline = "top";
    const t = frame / FPS;

    // Glyph mask, batched by color so fillStyle changes three times per frame.
    const batches: [string, number[]][] = [
      [palette.low, []],
      [palette.mid, []],
      [palette.high, []],
    ];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const coverage = mask[r * cols + c]!;
        if (coverage < 0.2) continue;
        const shimmer = 0.5 + 0.5 * Math.sin(t * 1.1 + c * 0.37 + r * 0.61 + Math.sin(c * 0.11 - t * 0.4) * 2);
        const level = Math.min(RAMP.length - 1, Math.round(coverage * (0.62 + 0.38 * shimmer) * (RAMP.length - 1)));
        if (level < 1) continue;
        batches[level < 4 ? 0 : level < 7 ? 1 : 2]![1].push(c, r, level);
      }
    }
    for (const [fill, cells] of batches) {
      ctx!.fillStyle = fill;
      for (let i = 0; i < cells.length; i += 3) {
        ctx!.fillText(RAMP[cells[i + 2]!]!, cells[i]! * cellW, cells[i + 1]! * cellH);
      }
    }

    // Drifting glyphs snap to the cell grid and replace whatever is under them.
    for (const p of particles) {
      const c = Math.round(p.x + Math.sin(t * 1.3 + p.phase) * preset.sway);
      const r = Math.round(p.y);
      if (c < 0 || c >= cols || r < 0 || r >= rows) continue;
      ctx!.clearRect(c * cellW, r * cellH, cellW, cellH);
      ctx!.fillStyle = p.bright ? palette.bright : palette.cool;
      ctx!.fillText(p.glyph, c * cellW, r * cellH);
    }
  }

  function step() {
    frame++;
    const dt = 1 / FPS;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]!;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.y > rows + 1 || p.x < -6 || p.x > cols + 6) particles[i] = spawn(false);
    }
    draw();
  }

  function loop(now: number) {
    if (disposed) return;
    raf = requestAnimationFrame(loop);
    if (now - last < 1000 / FPS) return;
    last = now;
    step();
  }

  function start() {
    cancelAnimationFrame(raf);
    if (disposed || motionQuery.matches || document.hidden) {
      draw();
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  let resizeTimer = 0;
  const observer = new ResizeObserver(() => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 100);
  });
  observer.observe(canvas);
  if (options.stage) observer.observe(options.stage);

  document.addEventListener("visibilitychange", start);
  motionQuery.addEventListener("change", start);

  resize();
  start();

  // The mask is first drawn with whatever font is available, then redrawn once
  // the glyph's face (its Japanese range loads on demand) is ready.
  const jpSheet = document.getElementById("fonts-jp") as HTMLLinkElement | null;
  const sheetReady =
    !jpSheet || jpSheet.media === "all"
      ? Promise.resolve()
      : new Promise<void>((resolve) => jpSheet.addEventListener("load", () => resolve(), { once: true }));
  sheetReady
    .then(() => Promise.all([
      document.fonts.load(`500 ${fontPx}px ${monoFamily}`),
      options.glyph ? document.fonts.load(`400 64px ${glyphFamily}`, options.glyph) : null,
    ]))
    .then(() => {
      if (!disposed) resize();
    })
    .catch(() => {});

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    window.clearTimeout(resizeTimer);
    observer.disconnect();
    document.removeEventListener("visibilitychange", start);
    motionQuery.removeEventListener("change", start);
  };
}
