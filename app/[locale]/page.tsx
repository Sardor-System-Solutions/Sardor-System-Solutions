import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/types/project";
import {
  getProjects,
  commercialProjectsOf,
  productProjectsOf,
} from "@/lib/get-projects";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ContactSection } from "@/components/sections/contact-section";

/**
 * The whole site, minus the case studies: hero, about, projects, contact.
 * Section ids here are what the header's indicator tracks.
 *
 * Projects are read here, on the server, and handed to the (client) projects
 * section as props — it can't reach the store itself.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const resolved = (
    hasLocale(routing.locales, locale) ? locale : routing.defaultLocale
  ) as Locale;

  const projects = await getProjects();
  // Featured or not, every product is a card in the same grid now — the flag
  // only decides the order, so the strongest work is read first.
  const products = productProjectsOf(projects).sort(
    (a, b) => Number(b.featured) - Number(a.featured),
  );

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection
        locale={resolved}
        products={products}
        commercialProjects={commercialProjectsOf(projects)}
      />
      <ContactSection />
    </>
  );
}
