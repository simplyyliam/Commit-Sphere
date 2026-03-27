import { useEffect } from "react";
import axios from "axios";
import { CanvasLayer } from "@/components";
import { useCommits } from "@/store";
import { getApiBase } from "@/lib";

export default function EmbedApp() {
  const { setCommits, setDays, setSphereColor, setYears } = useCommits();
  const params = new URLSearchParams(window.location.search);
  const username = params.get("user") || "simplyyliam";
  const yearParam = params.get("year");
  const colorParam = params.get("color");

  useEffect(() => {
    const load = async () => {
      setCommits(0);
      setDays(null);

      const prefsRes = await axios.get(`${getApiBase()}/prefs/${username}`);
      const prefsYear =
        typeof prefsRes.data?.year === "number" ? prefsRes.data.year : undefined;
      const prefsColor =
        typeof prefsRes.data?.color === "string" ? prefsRes.data.color : undefined;

      const effectiveYear = yearParam ? Number(yearParam) : prefsYear;
      const effectiveColor = colorParam ?? prefsColor;

      if (effectiveYear) {
        setYears(effectiveYear);
      }
      if (effectiveColor && /^#([0-9a-fA-F]{6})$/.test(effectiveColor)) {
        setSphereColor(effectiveColor);
      }

      const url = `${getApiBase()}/embed/${username}${
        effectiveYear ? `?year=${effectiveYear}` : ""
      }`;

      const res = await axios.get(url);
      const count =
        res.data.totalCommits ??
        res.data.totalContributions ??
        res.data.total ??
        0;
      setCommits(count);
      setDays(res.data.days ?? null);
    };

    load().catch((err) => console.error("API Error:", err));
  }, [username, setCommits, setDays, setYears, yearParam, colorParam, setSphereColor]);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black", overflow: "hidden" }}>
      <CanvasLayer />
    </div>
  );
}
