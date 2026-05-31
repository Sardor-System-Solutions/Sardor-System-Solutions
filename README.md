# Sardor & Danila Systems (SDS) — Website

A premium, production-ready marketing site for SDS, a software development studio.
Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui,
Framer Motion, and next-intl. Dark, navy/blue visual language inspired by Linear,
Vercel, Stripe, and Resend.

## Tech stack

- **Framework**: Next.js 15 (App Router, React 19, RSC)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 + CSS-variable design tokens
- **UI**: shadcn/ui primitives (Radix UI)
- **Motion**: Framer Motion (subtle, reduced-motion aware)
- **Icons**: Lucide React
- **i18n**: next-intl with `[locale]` routing (English, Russian, Uzbek)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint (next lint)
npm run typecheck
```

## Project structure

```
app/
  [locale]/            # localized routes
    layout.tsx         # html/body, fonts, providers, navbar/footer
    page.tsx           # Home
    services/          # Services
    portfolio/         # Portfolio index
      [slug]/          # Case-study detail
    about/             # About
    contact/           # Contact
    opengraph-image.tsx
    not-found.tsx
  sitemap.ts  robots.ts
components/
  layout/    # navbar, footer, logo, container, section, page-hero, language-switcher
  sections/  # hero, services-overview, featured-projects, why-sds, process, testimonials, cta, contact-form
  ui/        # shadcn primitives
  motion/    # reveal/stagger wrappers
content/     # typed structural data (services, projects, process, values, team, tech)
i18n/        # routing, request, navigation config
lib/         # utils, site config, seo helpers
messages/    # en.json, ru.json, uz.json
```

## Content & i18n

All human-readable copy lives in `messages/{en,ru,uz}.json`, keyed to match the
structural data in `content/*.ts`. To edit copy, update the message catalogs.
To add/remove a project, service, etc., update the relevant module in `content/`
and add matching keys in each message catalog.

## Editable placeholders

- `lib/site.ts` — production URL (`https://sds.uz`) and email (`hello@sds.uz`).
  Update once the production domain/email are finalized.
- Portfolio case-study results contain realistic drafted metrics — replace with
  verified figures when available (`messages/*.json` → `Portfolio.projects.*.results`).
- Testimonials are intentionally placeholders until real client quotes are added
  (`components/sections/testimonials.tsx`).

## SEO

- Per-page metadata via the Metadata API + `generateMetadata`
- `hreflang` alternates for all locales, canonical URLs
- OpenGraph/Twitter cards with a generated OG image (`opengraph-image.tsx`)
- JSON-LD `Organization` + `BreadcrumbList`
- `sitemap.xml` and `robots.txt`
