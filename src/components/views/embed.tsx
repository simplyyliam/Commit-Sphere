import { useEffect } from "react";
import axios from "axios";

import CanvasLayer from "../canvas/canvasLayer";
import { useCommits } from "@/store/useCommits";

export default function EmbedApp() {
  const { setCommits } = useCommits();
  const searchParams = new URLSearchParams(window.location.search);
  const username = searchParams.get("user") || "simplyyliam";

  useEffect(() => {
    const getApiBase = () => import.meta.env.VITE_BACKEND_API_BASE || "http://localhost:3000";

    const fetchCommits = async () => {
      try {
        const res = await axios.get(`${getApiBase()}/embed/${username}`);
        setCommits(res.data.total);
      } catch (err) {
        console.error("Failed to fetch commits for embed:", err);
      }
    };

    fetchCommits();
  }, [username, setCommits]);

  return (
    <div className="w-full h-full">
      <CanvasLayer />
    </div>
  );
}