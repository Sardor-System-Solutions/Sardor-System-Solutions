"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertial wheel scrolling on pointer devices.
 *
 * Deliberately narrow: it is skipped entirely on touch (native momentum
 * scrolling is better there) and under `prefers-reduced-motion`, and it leaves
 * anchor navigation to the browser. Nothing in the layout depends on it, so if
 * it never initialises the site simply scrolls normally.
 */
export function SmoothScroll() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!finePointer || reduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
