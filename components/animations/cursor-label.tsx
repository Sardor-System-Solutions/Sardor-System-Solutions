"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";

/**
 * A label that trails the pointer over interactive visuals.
 *
 * The native cursor is never hidden — this only adds a hint next to it, so
 * pointer affordances, text selection and accessibility all behave normally.
 * Opt an element in with `data-cursor="Смотреть"`; the attribute carries the
 * already-translated text.
 *
 * Runs only on fine pointers, and not at all under reduced motion.
 */
export function CursorLabel() {
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 600, damping: 45, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 600, damping: 45, mass: 0.35 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || reduced) return;

    setEnabled(true);

    let lastTarget: Element | null = null;

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);

      const target = event.target as Element | null;
      if (target === lastTarget) return;
      lastTarget = target;

      const hit = target?.closest?.("[data-cursor]");
      setLabel(hit?.getAttribute("data-cursor") ?? null);
    };

    const onLeave = () => setLabel(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-60 hidden lg:block"
      style={{ x: springX, y: springY }}
    >
      <AnimatePresence>
        {label ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute flex size-[86px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-primary-foreground"
          >
            {label}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
