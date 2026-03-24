import { useEffect } from "react";
import axios from "axios";
import { CanvasLayer } from "@/components";
import { useCommits } from "@/store";
import { getApiBase } from "@/lib";

export default function EmbedApp() {
  const { setCommits, setDays } = useCommits();
  const username = new URLSearchParams(window.location.search).get("user") || "simplyyliam";
  const params = new URLSearchParams(window.location.search);
  const year = params.get("year");

  useEffect(() => {
    setCommits(0);
    setDays(null);
    const url = `${getApiBase()}/embed/${username}${year ? `?year=${year}` : ''}`;
    axios
      .get(url)
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
  }, [username, setCommits, setDays, year]);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black", overflow: "hidden" }}>
      <CanvasLayer />
    </div>
  );
}
