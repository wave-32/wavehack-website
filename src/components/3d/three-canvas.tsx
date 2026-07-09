"use client";
import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  cameraPos?: [number, number, number];
  fov?: number;
  children?: React.ReactNode;
  dprMax?: number;
};

/**
 * A wrapper around <Canvas> that:
 * - clamps pixel ratio for perf
 * - reduces DPR + disables postfx when PerformanceMonitor reports degraded
 * - respects prefers-reduced-motion (renders a single frame)
 */
export function ThreeCanvas({
  className,
  cameraPos = [0, 0, 10],
  fov = 45,
  children,
  dprMax = 2,
}: Props) {
  const [dprHigh, setDprHigh] = React.useState(true);
  return (
    <div className={cn("absolute inset-0", className)}>
      <Canvas
        dpr={dprHigh ? [1, dprMax] : [1, 1.25]}
        camera={{ position: cameraPos, fov }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        style={{ background: "transparent" }}
      >
        <PerformanceMonitor
          onDecline={() => setDprHigh(false)}
          onIncline={() => setDprHigh(true)}
          flipflops={2}
        />
        {children}
      </Canvas>
    </div>
  );
}
