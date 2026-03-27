import { useAuth } from "@/hooks";
import { getApiBase } from "@/lib";
import { useCommits } from "@/store";
import axios from "axios";
import { motion } from "motion/react";
import { useEffect } from "react";

export default function Toolbar() {
  const { sphereColor, setSphereColor } = useCommits(); 
  const { setYears, displayYears, setDisplayYears, year } = useCommits()
  const { token } = useAuth();


  

  useEffect(() => {
    if (!token) {
      return;
    }
    const fetchYears = async () => {
      try {
        const res = await axios.get(`${getApiBase()}/commits`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data.allYears;
        if (!data) {
          console.warn("No years returned:", res.data);
          return;
        }

        setDisplayYears(data);
        console.log("Years:", data);
        console.log("DATA:", res.data);
      } catch (error) {
        console.log("Failed to fetch years", error);
      }
    };

    fetchYears();
  }, [token, setDisplayYears]);
  return (
    <div className="flex items-center justify-center gap-2.5 absolute bottom-5">
      <input
        type="color"
        className="rounded-2xl border-none p-0 outline-none shadow-none appearance-none
              [&::-webkit-color-swatch-wrapper]:p-0 
              [&::-webkit-color-swatch]:border-none 
              [&::-webkit-color-swatch]:rounded-full
              [&::-moz-color-swatch]:border-none 
              [&::-moz-color-swatch]:rounded-full"
        onChange={(e) => setSphereColor(e.target.value)}
        value={sphereColor}
      />
      <motion.select
        className="flex h-8 p-1.5 items-center justify-center bg-accent-foreground border border-muted-foreground rounded-lg text-accent text-sm"
        value={year ?? undefined}
        onChange={(e) => setYears(Number(e.target.value))}
      >
        {displayYears.map((y) => (
          <option 
          value={y} key={y}>{y}</option>
        ))}
      </motion.select>
    </div>
  );
}
