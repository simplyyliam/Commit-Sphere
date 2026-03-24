import { useEffect } from "react";
import axios from "axios";
import { CanvasLayer } from "@/components";
import { useCommits } from "@/store";
import { getApiBase } from "@/lib";

export default function EmbedApp() {
  const { setCommits } = useCommits();
  const username = new URLSearchParams(window.location.search).get("user") || "simplyyliam";

  useEffect(() => {
    setCommits(0); 
    
    axios
      .get(`${getApiBase()}/embed/${username}`)
      .then((res) => {
        const count = res.data.totalCommits ?? 0;
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
