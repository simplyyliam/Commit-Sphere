import { useEffect } from "react";
import axios from "axios";
import { CanvasLayer } from "@/components";
import { useCommits } from "@/store";
import { getApiBase } from "@/lib";

export default function EmbedApp() {
  const { setCommits, setDays } = useCommits();
  const username = new URLSearchParams(window.location.search).get("user") || "simplyyliam";

  useEffect(() => {
    setCommits(0);
    setDays(null);
    
    axios
      .get(`${getApiBase()}/embed/${username}`)
      .then((res) => {
        const count =
          res.data.totalCommits ??
          res.data.totalContributions ??
          res.data.total ??
          0;
        setCommits(count);
        setDays(res.data.days ?? null);
      })
      .catch((err) => console.error("API Error:", err));
  }, [username, setCommits, setDays]);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black", overflow: "hidden" }}>
      <CanvasLayer />
    </div>
  );
}
