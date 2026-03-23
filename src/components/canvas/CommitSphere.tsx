import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import axios from "axios";
import { TOKEN_KEY } from "@/hooks/useAuth";
import type { ContributionDay } from "@/types/ContributionCommits";

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
  const [color, setColor] = useState<THREE.Color[]>([]);
  const token = localStorage.getItem(TOKEN_KEY);

  useEffect(() => {
    const fetchColor = async () => {
      const { data } = await axios.get("/commits", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!token) {
        console.error("No token found");
        return;
      }
      if (!data.days) {
        console.error("No days returned", data);
        return;
      }
      const commitColors: THREE.Color[] = [];
      const commitCounts: number[] = [];

      data.days.forEach((day: ContributionDay) => {
        if (day.contributionCount > 0) {
          commitColors.push(new THREE.Color(day.color));
          commitCounts.push(day.contributionCount);
        }
      });

      console.log("Days with commits (points to render):", commitColors.length);
      console.log(
        "Total commits (sum):",
        commitCounts.reduce((a, b) => a + b, 0),
      );
      setColor(commitColors);
      console.log("API RESPONSE:", data);
    };

    fetchColor();
  }, [token]);

  const pointsRef = useRef<THREE.Mesh>(null!);

  const { points, colors } = useMemo(() => {
    const pts: number[] = [];
    const cols: number[] = [];
    const count = color.length;
    const radius = 5;
    const rng = mulberry32(0xc0ffee + count);

    for (let i = 0; i < count; i++) {
      const day = color[i];
      const u = rng();
      const v = rng();

      const theta = 2 * Math.PI * u; // Theta is looking left and right
      const phi = Math.acos(2 * v - 1); // Phi is looking up and down

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      pts.push(x, y, z);
      cols.push(day.r, day.g, day.b);
    }

    return {
      points: new Float32Array(pts),
      colors: new Float32Array(cols),
    };
  }, [color]);

  useFrame(() => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y += 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors />
    </points>
  );
}
