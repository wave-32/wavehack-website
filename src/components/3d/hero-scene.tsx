"use client";
import { CameraRig } from "./camera-rig";
import { SpaceBackground } from "./space-background";
import { ParticleWordmark } from "./particle-wordmark";
import { LiquidBlob } from "./liquid-blob";
import { FloatingCard3D } from "./floating-card-3d";

/**
 * The hero scene. Mounted dynamically with ssr:false in the page.
 * Contains: nebula + starfield, particle wordmark morph, liquid blob
 * "sun", and 3 floating cards that respond to mouse motion.
 */
export default function HeroScene() {
  return (
    <>
      <SpaceBackground density={1500} hueShift={0.0} />
      <CameraRig intensity={0.45} damping={0.18}>
        <LiquidBlob position={[0, 0, -3]} scale={2.4} />
        <ParticleWordmark text="WaveHack" count={5200} />
        <FloatingCard3D
          position={[-4.4, 1.8, -1.2]}
          size={[2.4, 1.1, 0.05]}
          hue="#22e6ff"
        />
        <FloatingCard3D
          position={[4.4, -1.6, -1.2]}
          size={[2.4, 1.1, 0.05]}
          hue="#a855f7"
        />
        <FloatingCard3D
          position={[0, -2.4, -1]}
          size={[2.6, 1, 0.05]}
          hue="#ff3df5"
        />
      </CameraRig>
    </>
  );
}
