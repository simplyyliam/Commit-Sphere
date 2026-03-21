import { useEffect, useState } from "react";
import { CanvasLayer } from "./components";
import axios from "axios";
import { useCommits } from "./store/useCommits";

export default function App() {
  const { commits, setCommits } = useCommits()
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const res = await axios.get("http://localhost:3000/commits");
        setCommits(res.data.totalCommits ?? 0);
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
            : commits !== null
              ? commits.toLocaleString()
              : "Counting commits..."}
        </span>
      </div>
    </div>
  );
}
