"use client";
import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * A glass-styled 3D card. Floats passively, springs into a specific
 * orientation toward the cursor while hovered.
 */
export function FloatingCard3D({
  position = [0, 0, 0],
  size = [3.2, 1.6, 0.05] as [number, number, number],
  hue = "#22e6ff",
}: {
  position?: [number, number, number];
  size?: [number, number, number];
  hue?: string;
}) {
  const group = React.useRef<THREE.Group>(null);
  const mat = React.useRef<THREE.MeshPhysicalMaterial | null>(null);
  const [hovered, setHovered] = React.useState(false);
  const baseY = position[1];

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y = baseY + Math.sin(t * 0.7 + position[0]) * 0.08;
    if (mat.current) mat.current.opacity = hovered ? 0.95 : 0.7;
    const target = hovered
      ? [state.pointer.y * 0.18, -state.pointer.x * 0.18]
      : [0, 0];
    group.current.rotation.x += (target[0] - group.current.rotation.x) * 0.1;
    group.current.rotation.y += (target[1] - group.current.rotation.y) * 0.1;
  });

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
    >
      <mesh>
        <boxGeometry args={size} />
        <meshPhysicalMaterial
          ref={mat}
          color={new THREE.Color("#0b1228")}
          metalness={0.2}
          roughness={0.2}
          transmission={0.4}
          opacity={0.7}
          transparent
          envMapIntensity={1}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, -size[2] / 2 - 0.001]}>
        <planeGeometry args={[size[0] + 0.06, size[1] + 0.06]} />
        <meshBasicMaterial color={new THREE.Color(hue)} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
