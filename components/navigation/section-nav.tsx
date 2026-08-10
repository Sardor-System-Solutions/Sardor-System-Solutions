"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { navSections } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { scrollToSection } from "@/lib/scroll";

/**
 * The section links, with an underline that travels between them.
 *
 * The indicator is a single element shared across items via `layoutId`, so
 * Framer moves it from the old position to the new one instead of fading one
 * out and another in.
 */
export function SectionNav({
  active,
  onNavigate,
  className,
  size = "sm",
}: {
  active: string | null;
  /** Called after a link is chosen — lets the mobile menu close itself. */
  onNavigate?: () => void;
  className?: string;
  size?: "sm" | "lg";
}) {
  const t = useTranslations("Nav");
  const reduced = useReducedMotion();

  return (
    <nav className={cn("flex items-center", className)}>
      {navSections.map((section) => {
        const isActive = active === section.id;

        return (
          <a
            key={section.key}
            href={`#${section.id}`}
            aria-current={isActive ? "true" : undefined}
            onClick={(event) => {
              // Keep the URL clean and drive the motion ourselves.
              event.preventDefault();
              scrollToSection(section.id);
              onNavigate?.();
            }}
            className={cn(
              "relative rounded-sm tracking-[-0.01em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
              size === "sm" ? "px-1 py-2 text-[0.9375rem]" : "py-3 text-2xl",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t(section.key)}
            {isActive ? (
              <motion.span
                layoutId="section-nav-indicator"
                className="absolute inset-x-0 -bottom-0.5 h-px bg-foreground"
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 38, mass: 0.6 }
                }
              />
            ) : null}
          </a>
        );
      })}
    </nav>
  );
}
