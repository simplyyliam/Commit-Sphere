import { useEffect, useState } from "react";
import { CanvasLayer } from "./components";
import axios from "axios";

export default function App() {
  const [totalCommits, setTotalCommits] = useState<number | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const res = await axios.get("http://localhost:3000/commits");
        setTotalCommits(res.data.totalCommits ?? 0);
      } catch (error) {
        setError(true);
        console.error("Fronted error fetching commits:", error);
      }
    };
    fetchCommits();
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <div className="absolute inset-0">
        <CanvasLayer />
      </div>
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-white text-2xl font-mono">
          {error
            ? "Error loading stats"
            : totalCommits !== null
              ? totalCommits.toLocaleString()
              : "Counting commits..."}
        </span>
      </div>
    </div>
  );
}
