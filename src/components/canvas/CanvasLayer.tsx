import { Canvas } from "@react-three/fiber";
import CommitSphere from "./CommitSphere";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
export default function CanvasLayer() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
      <CommitSphere />
    </Canvas>
  );
}
