"use client";
import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

/**
 * Mouse-parallax rig. Mutates a group ref's rotation (not the camera),
 * so it composes cleanly with scroll/orbit controls if added later.
 */
export function CameraRig({
  children,
  intensity = 0.4,
  damping = 0.18,
}: {
  children: React.ReactNode;
  intensity?: number;
  damping?: number;
}) {
  const group = React.useRef<THREE.Group>(null);
  const target = React.useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!group.current) return;
    target.current.x = state.pointer.y * intensity;
    target.current.y = -state.pointer.x * intensity;
    group.current.rotation.x += (target.current.x - group.current.rotation.x) * damping;
    group.current.rotation.y += (target.current.y - group.current.rotation.y) * damping;
  });

  return <group ref={group}>{children}</group>;
}

/** Subtle damped camera sway for sections without 3D controls. */
export function DriftingCamera({ amplitude = 0.6 }: { amplitude?: number }) {
  const { camera } = useThree();
  useFrame((state) => {
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.2) * amplitude;
    camera.position.y = Math.cos(state.clock.elapsedTime * 0.13) * amplitude * 0.4;
  });
  return null;
}
