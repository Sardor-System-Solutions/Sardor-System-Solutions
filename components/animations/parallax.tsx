"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Drifts its children a few pixels against the page as they pass through the
 * viewport. Deliberately small — enough to give a scene depth, never enough
 * to make the reader chase content.
 */
export function Parallax({
  children,
  className,
  /** Total travel in pixels across the whole pass. */
  distance = 48,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [distance / 2, -distance / 2],
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}
