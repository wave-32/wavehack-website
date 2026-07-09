"use client";
import * as THREE from "three";

/** Uniform random point on a sphere shell radius [rMin, rMax]. */
export function sphereRandom(rMin = 1, rMax = 1): [number, number, number] {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = rMin + Math.random() * (rMax - rMin);
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);
  return [x, y, z];
}

/** Uniform random point inside a disc of given radius. Used for "galaxy" PLY textures. */
export function discRandom(radius = 8): [number, number, number] {
  const r = Math.sqrt(Math.random()) * radius;
  const a = Math.random() * Math.PI * 2;
  return [Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 1.5];
}

/** Sample pixel positions from a 2D canvas drawing of a word, returns a Float32Array of (x,y) pairs in NDC-ish space. */
export function sampleTextPositions(
  text: string,
  opts: { pixelSize?: number; width?: number; height?: number; depth?: number } = {},
): Float32Array {
  const { pixelSize = 220, width = 1024, height = 256, depth = 0 } = opts;
  const canvas = document.createElement("canvas");
  // Use 2x for crisper sampling
  const r = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const W = width * (r > 1 ? 1 : 1);
  const H = height;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return new Float32Array();
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${pixelSize}px "Space Grotesk", system-ui, sans-serif`;
  ctx.fillText(text, W / 2, H / 2 + pixelSize * 0.08);

  const img = ctx.getImageData(0, 0, W, H);
  const data = img.data;
  // Sample subset of opaque pixels
  const positions: number[] = [];
  const step = 4; // pixel step
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const idx = (y * W + x) * 4;
      const a = data[idx + 3];
      if (a > 128) {
        // map to a centered XY plane, scaled
        const px = (x - W / 2) / H;
        const py = -(y - H / 2) / H;
        positions.push(px * 12, py * 2.6, (Math.random() - 0.5) * depth);
      }
    }
  }
  return new Float32Array(positions);
}

/** Build pairs of (start, target) position buffers for a particle morph. */
export function buildMorphBuffers(
  count: number,
  targetPositions: Float32Array,
): {
  start: Float32Array;
  target: Float32Array;
} {
  const start = new Float32Array(count * 3);
  const target = new Float32Array(count * 3);
  const tLen = targetPositions.length / 3;
  for (let i = 0; i < count; i++) {
    // start: random "galaxy" position
    const [x, y, z] = sphereRandom(8, 18);
    start[i * 3 + 0] = x;
    start[i * 3 + 1] = y;
    start[i * 3 + 2] = z;
    // target: pick from sampled text points cyclically
    const ti = i % tLen;
    target[i * 3 + 0] = targetPositions[ti * 3 + 0] + (Math.random() - 0.5) * 0.05;
    target[i * 3 + 1] = targetPositions[ti * 3 + 1] + (Math.random() - 0.5) * 0.05;
    target[i * 3 + 2] = targetPositions[ti * 3 + 2] + (Math.random() - 0.5) * 0.2;
  }
  return { start, target };
}

/** Compute a static "galaxy" position for a star/particle. */
export function randomGalaxyPoint(spread = 14): THREE.Vector3 {
  const r = Math.pow(Math.random(), 0.6) * spread;
  const a = Math.random() * Math.PI * 2;
  const y = (Math.random() - 0.5) * 4;
  return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
}

/** easeInOutCubic */
export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
