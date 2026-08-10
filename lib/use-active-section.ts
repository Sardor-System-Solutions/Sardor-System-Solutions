"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently being read.
 *
 * An IntersectionObserver watches a thin band across the middle of the
 * viewport; whichever section crosses it is the active one. That is stable
 * regardless of section height and needs no scroll-offset arithmetic.
 *
 * Two edges the band alone does not cover:
 * - the last section can be too short to ever reach the middle, so hitting the
 *   bottom of the page always selects it;
 * - before any section reaches the band (i.e. in the hero) nothing is active,
 *   which is correct — no nav item should be highlighted there.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A band from 45% to 50% down the viewport.
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    for (const el of elements) observer.observe(el);

    const onScroll = () => {
      const atTop = window.scrollY < 80;
      if (atTop) {
        setActive(null);
        return;
      }
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom) setActive(ids[ids.length - 1]);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}
