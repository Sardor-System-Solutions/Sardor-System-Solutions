"use client";

import type Lenis from "lenis";

/**
 * A single place that knows how to move the page.
 *
 * `SmoothScroll` registers the Lenis instance here when it starts (fine
 * pointers, motion allowed). Everything else calls `scrollToSection`, which
 * uses Lenis when it exists and falls back to the platform otherwise — so
 * navigation keeps working on touch, with reduced motion, and before hydration.
 */

let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Height of the fixed header, so a section never lands underneath it. */
export const HEADER_OFFSET = 96;

export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  if (lenis) {
    lenis.scrollTo(target, { offset: -HEADER_OFFSET });
    return;
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top =
    target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}

/**
 * Jump to a section named in the URL hash after arriving from another route,
 * once the page has laid out. Returns true when it handled a hash.
 */
export function scrollToHash() {
  const id = window.location.hash.replace("#", "");
  if (!id) return false;
  requestAnimationFrame(() => scrollToSection(id));
  return true;
}
