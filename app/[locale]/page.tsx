import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { Technologies } from "@/components/sections/technologies";
import { ServicesOverview } from "@/components/sections/services-overview";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { WhySds } from "@/components/sections/why-sds";
import { Process } from "@/components/sections/process";
import { Testimonials } from "@/components/sections/testimonials";
import { Cta } from "@/components/sections/cta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Technologies />
      <ServicesOverview />
      <FeaturedProjects />
      <WhySds />
      <Process />
      <Testimonials />
      <Cta />
    </>
  );
}
