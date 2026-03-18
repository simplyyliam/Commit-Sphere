import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

export default function CommitSphere() {
  const pointsRef = useRef<THREE.Mesh>(null!);

  const [points] = useState(() => {
    const pts = [];
    const count = 2000;
    const radius = 5;

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();

      const theta = 2 * Math.PI * u; // Theta is looking left and right
      const phi = Math.acos(2 * v - 1); // Phi is looking up and down

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      console.log(`
        Theta: ${theta}
        Phi ${[phi]}
        XCord: ${x}
        YCord: ${y}
        ZCord: ${z}
        `);

      pts.push(x, y, z);
    }

    return new Float32Array(pts);
  });

  useFrame(() => {
    if (!pointsRef.current) return;

    // pointsRef.current.rotation.x += 0.01;
    pointsRef.current.rotation.y += 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          // count={points.length / 3}
          // array={points}
          // itemSize={3}
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} />
    </points>
  );
}
