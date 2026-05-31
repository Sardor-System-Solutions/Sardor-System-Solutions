import type { NextConfig } from "next";
import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Multiple lockfiles exist in the monorepo root; pin tracing to this app.
  outputFileTracingRoot: path.join(__dirname),
};

export default withNextIntl(nextConfig);
