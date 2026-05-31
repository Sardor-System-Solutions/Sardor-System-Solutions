export const siteConfig = {
  name: "Sardor & Danila Systems",
  shortName: "SDS",
  url: "https://sds.uz",
  domain: "sds.uz",
  // Update once the production domain is live.
  description:
    "Sardor & Danila Systems is a software development studio building web platforms, mobile apps, CRM systems, dashboards, and business automation.",
  contacts: {
    telegram: "https://t.me/sardor_danila_systems",
    instagram: "https://www.instagram.com/sardor_danila_systems/",
    phone: "+998883928811",
    phoneHref: "tel:+998883928811",
    email: "hello@sds.uz",
    emailHref: "mailto:hello@sds.uz",
  },
  location: "Tashkent, Uzbekistan",
} as const;

export type NavKey = "services" | "portfolio" | "about" | "contact";

export const navItems: { key: NavKey; href: string }[] = [
  { key: "services", href: "/services" },
  { key: "portfolio", href: "/portfolio" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];
