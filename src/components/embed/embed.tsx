import { useEffect } from "react";
import axios from "axios";
import CanvasLayer from "../canvas/canvasLayer";
import { useCommits } from "@/store/useCommits";
export default function EmbedApp() {
  const { setCommits } = useCommits();

  useEffect(() => {
    const username =
      new URLSearchParams(window.location.search).get("user") || "simplyyliam";

    axios
      .get(`${import.meta.env.VITE_BACKEND_API_BASE}/embed/${username}`)
      .then((res) => {
        console.log("SERVER DATA:", res.data);
        setCommits(res.data.totalCommits ?? res.data.totalContributions ?? 0);
      })
      .catch((err) => console.error(err));
  }, [setCommits]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#010101",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <CanvasLayer />
    </div>
  );
}
