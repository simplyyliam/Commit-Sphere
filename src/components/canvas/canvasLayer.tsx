import { Canvas } from "@react-three/fiber";
import CommitSphere from "./commit-sphere";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";



export default function CanvasLayer() {
    return (
        <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75}/>
            <OrbitControls/>
            {/* Lights */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 2, 2]} />

            {/* Object */}
            <CommitSphere />
        </Canvas>
    );
}