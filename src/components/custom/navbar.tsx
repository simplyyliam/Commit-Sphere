
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Menu} from 'lucide-react';

interface navprops {
  Logout: () => void;
}

export default function Navbar({ Logout }: navprops) {
  const [expand, setExpand] = useState(false);

  return (
    <motion.div
      onClick={() => setExpand((prev) => !prev)}
      animate={{ height: expand ? "auto" : 60 }}
      whileTap={{ scale: 0.97 }}
      transition={{
        height: { type: "spring", stiffness: 180, damping: 22 },
        scale: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className="absolute top-2.5 z-10 flex flex-col w-100 p-1.5 bg-accent-foreground text-accent rounded-sm cursor-pointer overflow-hidden"
    >
      <div className="flex items-center justify-between pl-2.5 h-full">
        <Menu className="text-muted-foreground"/>
        <h1 className="pointer-events-none p-4 flex items-center justify-center w-full">Commit Sphere</h1>
      </div>
      <AnimatePresence initial={false}>
        {expand && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: 0.18,
              ease: "easeOut",
            }}
            whileHover={{ scale: 1 }}
            className="w-full"
          >
            <div
              className={`flex items-center justify-center text-sm p-4 w-full rounded-[0.9px] hover:bg-muted-foreground/15 transition-all`}
              onClick={Logout}
            >
              Sign out
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
