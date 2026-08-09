import type { NextConfig } from "next";
import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";
import { locales } from "./i18n/routing";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Non-default locales are served under a prefix, so old links have to be
// redirected for each of them as well as for the bare path.
const prefixes = ["", ...locales.map((locale) => `/${locale}`)];

const legacyPaths: { from: string; to: string }[] = [
  // The portfolio moved to /projects during the 2026 rework.
  { from: "/portfolio/:slug", to: "/projects/:slug" },
  { from: "/portfolio", to: "/projects" },
  // Services are now a section of the about page.
  { from: "/services", to: "/about#services" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Multiple lockfiles exist in the monorepo root; pin tracing to this app.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return prefixes.flatMap((prefix) =>
      legacyPaths.map(({ from, to }) => ({
        source: `${prefix}${from}`,
        destination: `${prefix}${to}`,
        permanent: true,
      })),
    );
  },
};

export default withNextIntl(nextConfig);
