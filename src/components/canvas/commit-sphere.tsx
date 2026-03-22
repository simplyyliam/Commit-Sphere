import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useCommits } from "../../store/useCommits";

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

export default function CommitSphere() {
  const { commits } = useCommits();
  const pointsRef = useRef<THREE.Mesh>(null!);

  const points = useMemo(() => {
    const pts: number[] = [];
    const count = commits ?? 0;
    const radius = 5;
    const rng = mulberry32(0xC0FFEE + count);

    for (let i = 0; i < count; i++) {
      const u = rng();
      const v = rng();

      const theta = 2 * Math.PI * u; // Theta is looking left and right
      const phi = Math.acos(2 * v - 1); // Phi is looking up and down

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      pts.push(x, y, z);
    }

    return new Float32Array(pts);
  }, [commits]);

  useFrame(() => {
    if (!pointsRef.current) return;

    // pointsRef.current.rotation.x += 0.01;
    pointsRef.current.rotation.y += 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} />
    </points>
  );
}