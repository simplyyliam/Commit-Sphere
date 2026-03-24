import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ContributionDay } from "@/types/ContributionCommits";
import { useCommits } from "@/store";

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

export default function CommitSphere() {
  const { days, sphereColor } = useCommits();
  const pointsRef = useRef<THREE.Mesh>(null!);

  const colors = useMemo(() => {
    if (!days || days.length === 0) {
      return [];
    }

    const commitColors: THREE.Color[] = [];
    const maxCount = Math.max(
      ...days.map((d: ContributionDay) => d.contributionCount),
      1,
    );
   
    const baseColor = new THREE.Color(sphereColor);
    const tempColor = new THREE.Color(); // Reuse one object

    days.forEach((day) => {
      const brightness = 0.1 + 0.9 * (day.contributionCount / maxCount);
      tempColor.copy(baseColor).multiplyScalar(brightness);

      for (let i = 0; i < day.contributionCount; i++) {
        commitColors.push(tempColor.clone());
      }
    });
    return commitColors;
  }, [days,sphereColor]);

  const { points, colorsArray } = useMemo(() => {
    const pts: number[] = [];
    const cols: number[] = [];
    const count = colors.length;
    const radius = 2;
    const rng = mulberry32(0xc0ffee + count);

    for (let i = 0; i < count; i++) {
      const color = colors[i];
      const u = rng();
      const v = rng();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      pts.push(x, y, z);
      cols.push(color.r, color.g, color.b);
    }

    return {
      points: new Float32Array(pts),
      colorsArray: new Float32Array(cols),
    };
  }, [colors]);

  useFrame(() => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += 0.01;
  });

  if (!days || days.length === 0 || points.length === 0) {
    return null; // Don't render anything until data exists
  }
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
        <bufferAttribute attach="attributes-color" args={[colorsArray, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors />
    </points>
  );
}
