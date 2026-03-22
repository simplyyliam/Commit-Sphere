import { useEffect } from "react";
import axios from "axios";
import CanvasLayer from "../canvas/canvasLayer";
import { useCommits } from "@/store/useCommits";
export default function EmbedApp() {
  const { setCommits } = useCommits();

  useEffect(() => {
    const username = new URLSearchParams(window.location.search).get("user") || "simplyyliam";

    axios.get(`${import.meta.env.VITE_BACKEND_API_BASE}/embed/${username}`)
      .then(res => setCommits(res.data.total))
      .catch(err => console.error(err));
  }, [setCommits]);

  return <CanvasLayer />;
}