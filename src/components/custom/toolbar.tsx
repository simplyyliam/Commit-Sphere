import { useCommits } from "@/store";
import { motion } from "motion/react";

export default function Toolbar() {
  const { sphereColor, setSphereColor } = useCommits();

  return (
    <div className="flex items-center justify-center absolute bottom-5">
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
      <motion.div className="flex h-8 p-1.5 items-center justify-center bg-accent-foreground border border-muted-foreground rounded-lg text-accent text-sm">
        asd
      </motion.div>
    </div>
  );
}
