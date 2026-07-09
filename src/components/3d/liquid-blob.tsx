"use client";
import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * A "liquid metal" blob — a single sphere with custom shader material
 * that displaces its surface with noise and tints it with a moving
 * gradient. Disposal is handled by R3F's <primitive> cleanup.
 */
export function LiquidBlob({
  position = [0, 0, 0],
  scale = 1.6,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const mat = React.useRef<THREE.ShaderMaterial | null>(null);

  const material = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color("#22e6ff") },
        uColorB: { value: new THREE.Color("#a855f7") },
        uColorC: { value: new THREE.Color("#ff3df5") },
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float uTime;
        float hash(vec3 p) { return fract(sin(dot(p, vec3(13.07, 31.21, 17.93))) * 43758.54); }
        float noise(vec3 p) {
          vec3 i = floor(p); vec3 f = fract(p); f = f*f*(3.0-2.0*f);
          float n = mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),
                            mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
                        mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                            mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
          return n;
        }
        void main() {
          vNormal = normal;
          float t = uTime * 0.6;
          float d = noise(position * 1.8 + vec3(t, t * 0.7, -t * 0.5));
          d += 0.5 * noise(position * 4.0 + vec3(-t, t, t * 0.4));
          vec3 displaced = position + normal * (d - 0.5) * 0.4;
          vPos = displaced;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        void main() {
          vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
          float fres = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.5);
          float drift = sin(uTime * 0.4 + vPos.y * 2.0) * 0.5 + 0.5;
          vec3 col = mix(uColorA, uColorB, drift);
          col = mix(col, uColorC, fres * 0.9);
          vec3 baseLit = col * (0.5 + 0.5 * fres);
          gl_FragColor = vec4(baseLit, 0.95);
        }
      `,
    });
  }, []);

  // Keep mat.current pointing to the latest material so useFrame can update uTime.
  // Disposal is handled by R3F's <primitive object={material}> auto-cleanup.
  React.useEffect(() => {
    mat.current = material;
  }, [material]);

  useFrame((state) => {
    if (mat.current) mat.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh position={position} scale={scale}>
      <icosahedronGeometry args={[1, 32]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
