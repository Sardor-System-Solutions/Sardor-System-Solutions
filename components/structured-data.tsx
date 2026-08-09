import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/site";

/**
 * Organization JSON-LD. The description is pulled from the locale's own
 * metadata so search engines see it in the language of the page.
 */
export async function OrganizationSchema() {
  const t = await getTranslations("Meta.home");

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: t("description"),
    email: siteConfig.contacts.email,
    telephone: siteConfig.contacts.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Samarkand",
      addressCountry: "UZ",
    },
    sameAs: [siteConfig.contacts.telegram, siteConfig.contacts.instagram],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
