"use client";
import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  buildMorphBuffers,
  sampleTextPositions,
} from "@/lib/three-utils";

/**
 * GPU-driven particle cloud that morphs between "galaxy scatter" and the
 * "WaveHack" wordmark sampled from a canvas. Progress is tweened in the
 * vertex shader on the GPU — no per-frame CPU loops. Disposal is handled
 * by R3F's <primitive object={material}> auto-cleanup.
 */
export function ParticleWordmark({
  text = "WaveHack",
  count = 4800,
  delay = 0,
}: {
  text?: string;
  count?: number;
  delay?: number;
}) {
  const mat = React.useRef<THREE.ShaderMaterial | null>(null);
  const startTime = React.useRef<number | null>(null);

  const { start, target: targetPos, sizes, colors } = React.useMemo(() => {
    const textPositions = sampleTextPositions(text, {
      pixelSize: 320,
      width: 1400,
      height: 320,
      depth: 1.2,
    });
    const { start, target } = buildMorphBuffers(count, textPositions);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const palette = Math.random();
      if (palette < 0.45) {
        colors[i * 3 + 0] = 0.13; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1;
      } else if (palette < 0.85) {
        colors[i * 3 + 0] = 0.66; colors[i * 3 + 1] = 0.33; colors[i * 3 + 2] = 0.96;
      } else {
        colors[i * 3 + 0] = 1; colors[i * 3 + 1] = 0.24; colors[i * 3 + 2] = 0.96;
      }
      sizes[i] = 0.06 + Math.random() * 0.18;
    }
    return { start, target, colors, sizes };
  }, [text, count]);

  const material = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uPixel: { value: typeof window !== "undefined" ? window.innerHeight / 600 : 1 },
      },
      vertexShader: /* glsl */ `
        attribute vec3 target;
        attribute float size;
        varying float vProgress;
        uniform float uProgress;
        uniform float uTime;
        uniform float uPixel;
        void main() {
          vProgress = uProgress;
          vec3 p = mix(position, target, smoothstep(0.0, 1.0, uProgress));
          float drift = (1.0 - uProgress) * 0.4;
          p.x += sin(uTime * 0.3 + position.y * 0.3) * drift;
          p.y += cos(uTime * 0.4 + position.x * 0.3) * drift;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = size * uPixel * (300.0 / -mv.z);
          gl_PointSize = clamp(gl_PointSize, 1.0, 8.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vProgress;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float core = 1.0 - smoothstep(0.0, 0.5, d);
          float glow = 1.0 - smoothstep(0.2, 0.5, d);
          float alpha = (core * 0.95 + glow * 0.5);
          vec3 col = mix(vec3(0.66, 0.33, 0.96), vec3(0.13, 0.9, 1.0), sin(vProgress * 3.14) * 0.5 + 0.5);
          if (d > 0.5) discard;
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
  }, []);

  React.useEffect(() => {
    mat.current = material;
  }, [material]);

  useFrame((state) => {
    if (!material) return;
    const t = state.clock.elapsedTime - delay;
    if (startTime.current == null) startTime.current = state.clock.elapsedTime;
    const raw = Math.min(1, t / 4.5);
    const eased = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
    const base = 0.92 + 0.08 * eased;
    const breathe = Math.sin(state.clock.elapsedTime * 0.6) * 0.02;
    material.uniforms.uProgress.value = THREE.MathUtils.clamp(base + breathe, 0, 1);
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[start, 3]} />
        <bufferAttribute attach="attributes-target" args={[targetPos, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
}
