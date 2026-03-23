import { useEffect } from "react";
import axios from "axios";
import { CanvasLayer } from "@/components";
import { useCommits } from "@/store";

export default function EmbedApp() {
  const { setCommits } = useCommits();
  const username = new URLSearchParams(window.location.search).get("user") || "simplyyliam";

  useEffect(() => {
    setCommits(0); 

    const apiBase = import.meta.env.VITE_BACKEND_API_BASE || import.meta.env.VITE_API_BASE;
    
    axios
      .get(`${apiBase}/embed/${username}`)
      .then((res) => {
        const count = res.data.totalContributions ?? res.data.totalCommits ?? res.data.total ?? 0;
        setCommits(count);
      })
      .catch((err) => console.error("API Error:", err));
  }, [username, setCommits]);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black", overflow: "hidden" }}>
      <CanvasLayer />
    </div>
  );
}
