import { Canvas } from "@react-three/fiber";
import CommitSphere from "./CommitSphere";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
export default function CanvasLayer() {
  return (
    <Canvas gl={{ toneMapping: THREE.ACESFilmicToneMapping }}>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
      <OrbitControls />
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 2, 2]} />
      <CommitSphere />
      <EffectComposer>
        <Bloom
          intensity={10}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.4}
        />
      </EffectComposer>
    </Canvas>
  );
}
