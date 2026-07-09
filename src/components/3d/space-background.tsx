"use client";
import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { sphereRandom } from "@/lib/three-utils";

/**
 * A nebula background built from:
 *   1) an inverted Three.js sprite sphere with a procedural star/cloud shader
 *   2) a small starfield of instanced points for parallax
 *
 * Kept lightweight: no postprocessing in the background itself (avoid double bloom).
 */
export function SpaceBackground({
  density = 1200,
  hueShift = 0.0,
}: {
  density?: number;
  hueShift?: number;
}) {
  const starsRef = React.useRef<THREE.Points | null>(null);

  const { positions, colors, sizes } = React.useMemo(() => {
    const pos = new Float32Array(density * 3);
    const col = new Float32Array(density * 3);
    const sz = new Float32Array(density);
    for (let i = 0; i < density; i++) {
      const [x, y, z] = sphereRandom(40, 80);
      pos[i * 3 + 0] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      // mostly white with rare neon drifts
      const isNeon = Math.random() < 0.06;
      if (isNeon) {
        const choice = Math.random();
        col[i * 3 + 0] = choice < 0.33 ? 0.13 : choice < 0.66 ? 0.66 : 1;
        col[i * 3 + 1] = choice < 0.33 ? 0.9 : choice < 0.66 ? 0.33 : 0.24;
        col[i * 3 + 2] = choice < 0.33 ? 1 : choice < 0.66 ? 1 : 0.96;
      } else {
        const g = 0.7 + Math.random() * 0.3;
        col[i * 3 + 0] = g;
        col[i * 3 + 1] = g;
        col[i * 3 + 2] = g;
      }
      sz[i] = Math.random() < 0.02 ? 1.5 : 0.35 + Math.random() * 0.6;
    }
    return { positions: pos, colors: col, sizes: sz };
  }, [density]);

  const mat = React.useRef<THREE.ShaderMaterial | null>(null);

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.01;
    }
    if (mat.current) {
      mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const nebulaMaterial = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      uniforms: {
        uTime: { value: 0 },
        uHue: { value: hueShift },
      },
      vertexShader: /* glsl */ `
        varying vec3 vPos;
        void main() {
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec3 vPos;
        uniform float uTime;
        uniform float uHue;

        // hash + noise + fbm
        float hash(vec3 p) {
          return fract(sin(dot(p, vec3(11.13, 17.31, 19.97))) * 43758.5453);
        }
        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float n = mix(
            mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
            mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
            f.z);
          return n;
        }
        float fbm(vec3 p) {
          float a = 0.0; float w = 0.5;
          for (int i = 0; i < 5; i++) {
            a += w * noise(p); p *= 2.05; w *= 0.5;
          }
          return a;
        }
        void main() {
          vec3 dir = normalize(vPos);
          float t = uTime * 0.03;
          float n = fbm(dir * 1.7 + vec3(t));
          float n2 = fbm(dir * 3.7 - vec3(t * 0.7));
          float falloff = smoothstep(1.0, 0.0, length(dir.xy));
          // violet → cyan gradient
          vec3 col1 = vec3(0.66, 0.33, 0.96); // violet
          vec3 col2 = vec3(0.13, 0.9, 1.0);   // cyan
          vec3 col3 = vec3(1.0, 0.24, 0.96);  // magenta
          vec3 col = mix(col1, col2, n);
          col = mix(col, col3, n2 * 0.55);
          float a = (0.18 + 0.55 * smoothstep(0.45, 1.0, n)) * falloff;
          gl_FragColor = vec4(col, a);
        }
      `,
    });
  }, [hueShift]);

  // Attach the uniform-ref so useFrame can update time
  React.useEffect(() => {
    mat.current = nebulaMaterial;
  }, [nebulaMaterial]);

  return (
    <group>
      <mesh scale={[1, 1, 1]} frustumCulled={false}>
        <sphereGeometry args={[80, 64, 64]} />
        <primitive object={nebulaMaterial} attach="material" />
      </mesh>
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          size={0.6}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
