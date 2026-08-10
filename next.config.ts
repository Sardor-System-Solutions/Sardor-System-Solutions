import type { NextConfig } from "next";
import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";
import { locales } from "./i18n/routing";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Non-default locales are served under a prefix, so old links have to be
// redirected for each of them as well as for the bare path.
const prefixes = ["", ...locales.map((locale) => `/${locale}`)];

const legacyPaths: { from: string; to: string }[] = [
  // Case studies kept their own routes through the rework.
  { from: "/portfolio/:slug", to: "/projects/:slug" },
  // Everything else is now a section of the one-page site. `/projects` is an
  // exact match, so it never shadows `/projects/:slug`.
  { from: "/portfolio", to: "/#projects" },
  { from: "/projects", to: "/#projects" },
  { from: "/about", to: "/#about" },
  { from: "/contact", to: "/#contact" },
  { from: "/services", to: "/#about" },
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
