import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import axios from "axios";
import { TOKEN_KEY } from "@/hooks/useAuth";
import type { ContributionDay } from "@/types/ContributionCommits";
import { getApiBase } from "@/lib";

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
  const [colors, setColors] = useState<THREE.Color[]>([]);
  const token = localStorage.getItem(TOKEN_KEY);
  const pointsRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    const fetchCommits = async () => {
      if (!token) return console.error("No token found");

      const { data } = await axios.get(`${getApiBase()}/commits?year=2025`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data.days) return console.error("No days returned", data);

      // Expand each day into multiple commits
      const commitColors: THREE.Color[] = [];
      data.days.forEach((day: ContributionDay) => {
        for (let i = 0; i < day.contributionCount; i++) {
          const baseColor = new THREE.Color("#8157ff")
          const maxCount = Math.max(...data.days.map((d: ContributionDay) => d.contributionCount), 1)
          const brightness = 0.1 + 0.9 * (day.contributionCount / maxCount) 
          const color = baseColor.clone().multiplyScalar(brightness)
          commitColors.push(color);
        }
      });
      console.log("Total commits (points to render):", commitColors.length);
      setColors(commitColors);
    };

    fetchCommits();
  }, [token]);

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