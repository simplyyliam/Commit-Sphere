import { Canvas } from "@react-three/fiber";
import CommitSphere from "./commit-sphere";



export default function CanvasLayer() {
    return (
        <Canvas>
            {/* Lights */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 2, 2]} />

            {/* Object */}
            <CommitSphere />
        </Canvas>
    );
}