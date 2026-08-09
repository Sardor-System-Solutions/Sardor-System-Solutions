"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Page transition. `template.tsx` remounts on every navigation, so this runs
 * as an enter animation on each route without any router plumbing.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
