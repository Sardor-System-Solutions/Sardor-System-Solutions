"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal } from "@/components/animations/reveal";
import { EASE } from "@/components/animations/reveal";
import { ProjectGlyph } from "@/components/projects/project-glyph";

/**
 * The five directions as an interactive list: pointing at a row swaps the
 * diagram beside it. On touch the diagram column is hidden and the rows are
 * plain links — no hover-only information.
 */
export function ServicesPreview() {
  const t = useTranslations("Services");
  const [active, setActive] = useState(0);

  return (
    <Section tone="soft" id="services">
      <Container>
        <SectionHeading
          label={t("label")}
          title={t("previewTitle")}
          aside={
            <Link
              href="/about#services"
              className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium"
            >
              {t("viewAll")}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          }
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          <ul className="lg:col-span-7">
            {services.map((service, i) => (
              <li key={service.id} className="border-t border-border-strong">
                <Link
                  href={`/about#${service.anchor}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex items-baseline gap-5 py-6 lg:py-7"
                >
                  <span
                    className={cn(
                      "num transition-colors duration-300",
                      active === i
                        ? "text-primary"
                        : "text-subtle-foreground",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span
                      className={cn(
                        "block text-[1.75rem] font-medium leading-tight tracking-[-0.03em] transition-transform duration-500 md:text-[2rem]",
                        active === i && "lg:translate-x-1.5",
                      )}
                    >
                      {t(`items.${service.id}.title`)}
                    </span>
                    <span className="mt-2 block text-[0.9375rem] text-muted-foreground">
                      {t(`items.${service.id}.summary`)}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 self-center text-subtle-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground" />
                </Link>
              </li>
            ))}
            <li className="border-t border-border-strong" aria-hidden />
          </ul>

          <Reveal className="hidden lg:col-span-4 lg:col-start-9 lg:block">
            <div className="sticky top-28 flex aspect-4/3 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
              <AnimatePresence mode="wait">
                <motion.div
                  key={services[active].id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="flex h-[52%] w-full items-center justify-center"
                >
                  <ProjectGlyph
                    id={services[active].glyph}
                    className="h-full"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
