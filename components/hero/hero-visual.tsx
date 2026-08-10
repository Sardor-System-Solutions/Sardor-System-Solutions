"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Container } from "@/components/layout/container";
import { RevealImage } from "@/components/animations/reveal";

/**
 * Two real screenshots of the Oson Uy ecosystem — the public platform and the
 * developer's CRM. No abstract shapes: the products are the argument.
 *
 * The pair leans a few pixels toward the pointer and drifts on scroll. Both
 * effects are small, and both are dropped under reduced motion.
 */
export function HeroVisual() {
  const t = useTranslations("Hero");
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], [26, -26]);

  // Pointer lean, normalised to roughly ±8px.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const leanX = useSpring(pointerX, { stiffness: 120, damping: 24, mass: 0.5 });
  const leanY = useSpring(pointerY, { stiffness: 120, damping: 24, mass: 0.5 });

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 16);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 16);
  }

  function onPointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <Container className="mt-16 sm:mt-20 lg:mt-24">
      <div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="grid gap-8 md:grid-cols-12 md:gap-6"
      >
        <motion.figure
          className="md:col-span-7"
          style={reduced ? undefined : { x: leanX, y: leanY }}
        >
          <RevealImage>
            <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-surface">
              <Image
                src="/work/oson-uy.webp"
                alt={t("showcaseAltOne")}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 58vw"
                className="object-cover object-top"
              />
            </div>
          </RevealImage>
          <figcaption className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="h-px w-6 bg-border-strong" aria-hidden />
            {t("showcaseCaptionOne")}
          </figcaption>
        </motion.figure>

        <motion.figure
          className="md:col-span-5 md:pt-16"
          style={reduced ? undefined : { y: drift }}
        >
          <RevealImage delay={0.12}>
            <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-surface">
              <Image
                src="/work/dashboard.webp"
                alt={t("showcaseAltTwo")}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-top"
              />
            </div>
          </RevealImage>
          <figcaption className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="h-px w-6 bg-border-strong" aria-hidden />
            {t("showcaseCaptionTwo")}
          </figcaption>
        </motion.figure>
      </div>
    </Container>
  );
}
