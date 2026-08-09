import { setRequestLocale } from "next-intl/server";
import { HomeHero } from "@/components/hero/home-hero";
import { SelectedWork } from "@/components/sections/selected-work";
import { AboutPreview } from "@/components/sections/about-preview";
import { ServicesPreview } from "@/components/sections/services-preview";
import { CommercialExperience } from "@/components/sections/commercial-experience";
import { FinalCta } from "@/components/sections/final-cta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HomeHero />
      <SelectedWork />
      <AboutPreview />
      <ServicesPreview />
      <CommercialExperience />
      <FinalCta />
    </>
  );
}
