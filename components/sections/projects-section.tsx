"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal, EASE } from "@/components/animations/reveal";
import { ProjectShowcase } from "@/components/projects/project-showcase";
import { ProjectIndex } from "@/components/projects/project-index";
import type { Locale, Project } from "@/types/project";

/**
 * The centre of the site.
 *
 * The five strongest products are shown straight away; everything else — the
 * remaining SDS product and the team's Dotlabs-era work — unfolds in place
 * behind "show more". There is no separate projects route to navigate to.
 *
 * Data comes from the DB (via the server parent, see projects-section-data.tsx)
 * instead of the old hardcoded `data/projects.ts` import. `locale` is passed
 * down so ProjectShowcase / ProjectIndex can pick the right translation out
 * of each project's `i18n` field without their own useTranslations("Projects").
 */
export function ProjectsSection({
  locale,
  featuredProjects,
  productRest,
  commercialProjects,
}: {
  locale: Locale;
  featuredProjects: Project[];
  productRest: Project[];
  commercialProjects: Project[];
}) {
  const t = useTranslations("Work");
  const tCommercial = useTranslations("Commercial");
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = useState(false);

  return (
    <Section id="projects">
      <Container>
        <SectionHeading
          label={t("label")}
          title={t("title")}
          description={t("subtitle")}
        />

        <div className="mt-16 space-y-16 lg:mt-20 lg:space-y-24">
          {featuredProjects.map((project, i) => (
            <ProjectShowcase
              key={project.slug}
              project={project}
              locale={locale}
              index={i}
              priority={i === 0}
            />
          ))}

          <AnimatePresence initial={false}>
            {expanded ? (
              <motion.div
                key="more"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="space-y-16 lg:space-y-24"
              >
                {productRest.map((project, i) => (
                  <ProjectShowcase
                    key={project.slug}
                    project={project}
                    locale={locale}
                    index={featuredProjects.length + i}
                  />
                ))}

                {/* Dotlabs-era work, kept visually and verbally separate. */}
                <div className="border-t border-border-strong pt-12 lg:pt-16">
                  <Reveal>
                    <span className="label">{tCommercial("label")}</span>
                    <h3 className="display-3 mt-4 max-w-2xl text-balance">
                      {tCommercial("title")}
                    </h3>
                    <p className="mt-4 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {tCommercial("subtitle")}
                    </p>
                  </Reveal>

                  <div className="mt-10">
                    <ProjectIndex projects={commercialProjects} locale={locale} />
                  </div>

                  <Reveal>
                    <p className="mt-8 max-w-xl text-sm leading-relaxed text-subtle-foreground">
                      {tCommercial("disclaimer")}
                    </p>
                  </Reveal>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="mt-16 border-t border-border pt-8 lg:mt-20">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="group inline-flex items-center gap-2.5 text-[1.0625rem] font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
          >
            {expanded ? t("showLess") : t("showMore")}
            {expanded ? (
              <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-1" />
            ) : (
              <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-1" />
            )}
          </button>
        </div>
      </Container>
    </Section>
  );
}