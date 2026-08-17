# Sardor & Danila Systems (SDS) — Website

Marketing site for SDS: a team that builds digital products for business —
web platforms, SaaS, CRM/ERP, WMS, mobile apps and business automation.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui,
Framer Motion and next-intl.

## Design system

Light and editorial. Structure comes from hairline rules and a strict grid
rather than cards, shadows or gradients; typography carries the design.

- **Surface** — off-white (`#fbfbfa`) with `#f2f2ef` for alternating sections.
  Near-black is used deliberately and sparingly, as contrast: the closing CTA,
  the next-project hand-off and the footer.
- **Accent** — `#116bff`, sampled from the blue of the SDS logo. Used only for
  actions, links, hover states and small graphic marks.
- **Type** — [Onest](https://fonts.google.com/specimen/Onest) (variable, Latin +
  Cyrillic) for everything; JetBrains Mono is reserved for numerals — indices,
  step counters, table figures.
- **Scale** — fluid `display-0/1/2/3` and `lead` classes in `app/globals.css`,
  so composition holds at every width instead of snapping at breakpoints.
- **Motion** — fade, a short rise, stagger, and an image that uncovers itself,
  plus inertial scrolling (Lenis) and a pointer label over project visuals.
  Nothing rotates, nothing loops. Everything degrades under
  `prefers-reduced-motion`, and the pointer label and smooth scroll are skipped
  entirely on touch.

  When writing a new `whileInView` animation, make sure the initial and target
  states list **the same properties**. `useReducedMotion()` resolves to `false`
  during the server render and can flip after hydration; if the two states
  animate different properties, the target no longer clears what `initial`
  applied and the element stays invisible.

Tokens live as CSS variables in `app/globals.css` and are exposed to Tailwind
through `@theme inline`.

## Admin & CRM

The internal tool — sales CRM plus the site's CMS — lives at `/admin`.
Setup, roles and the day-to-day workflow are documented in
**[ADMIN.md](ADMIN.md)**.

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

The marketing site is a **single page** — hero, about, projects and contact are
sections of `/`, not routes. Case studies keep their own routes.

```
app/
  layout.tsx           # pass-through root layout (html/body live in [locale])
  [locale]/
    layout.tsx         # html/body, fonts, providers, header/footer
    template.tsx       # per-route enter transition
    page.tsx           # the whole one-page site
    projects/[slug]/   # case study (all nine projects)
    opengraph-image.tsx
    not-found.tsx
  not-found.tsx  sitemap.ts  robots.ts
components/
  animations/  # reveal, stagger, image reveal, draw-line, animated text,
               # smooth scroll, pointer label, parallax
  case-study/  # hero, narrative section, features, tech, gallery, next project
  hero/        # the hero's paired screenshots
  layout/      # container, section shell, footer
  navigation/  # header, section nav, mobile menu, wordmark, language switcher
  projects/    # showcase scene, index rows, visual, glyphs
  sections/    # hero, about, projects (+ show more), contact, contact form
  ui/          # button, input, textarea, label, sheet
data/          # projects, services, tech, navigation
types/         # project types
i18n/          # routing, request, navigation config
lib/           # utils, site config, seo helpers, scroll, active-section hook
messages/      # ru.json, en.json, uz.json — all copy
scripts/       # prepare-screenshots.py
assets/        # original captures, before cropping (not served)
```

### One-page navigation

`data/navigation.ts` lists the sections; the ids there are the anchors on the
page and what the header tracks.

- `lib/scroll.ts` is the only thing that moves the page. `SmoothScroll`
  registers the Lenis instance with it; `scrollToSection` uses Lenis when it
  exists and falls back to the platform otherwise, so navigation still works on
  touch, with reduced motion, and before hydration.
- `lib/use-active-section.ts` watches a thin band across the middle of the
  viewport with an IntersectionObserver — no scroll-offset arithmetic. Nothing
  is highlighted while the visitor is still in the hero, and hitting the bottom
  of the page always selects the last section.
- The header's underline is one element shared across items via Framer's
  `layoutId`, so it travels between them instead of fading in and out.

Old routes (`/about`, `/projects`, `/contact`, `/portfolio`, `/services`)
permanently redirect to the matching anchor, for every locale.

## Content and languages

The site ships in three languages: **Russian (default), English and Uzbek**.
Russian is served unprefixed (`/`, `/projects/oson-uy`), the others under `/en` and
`/uz`. Adding a locale is a message file plus one entry in `i18n/routing.ts`.

All copy lives in `messages/{ru,en,uz}.json`, keyed to match the structural data
in `data/*.ts`. To edit wording, change the message catalogs; to add or remove a
project or service, update the module in `data/` and add matching keys to all
three.

Headlines are stored as `titleLines` arrays rather than one string, so each
language controls its own line breaks.

The three catalogs must stay key-for-key identical — a missing key throws at
render time rather than falling back. To check:

```bash
node -e "const f=n=>Object.keys(require('./messages/'+n+'.json'));console.log(f('ru').length,f('en').length,f('uz').length)"
```

Uzbek is written in Latin script using the proper `ʻ` (U+02BB) and `ʼ` (U+02BC)
characters rather than ASCII apostrophes — correct typography, and it keeps
clear of ICU MessageFormat's apostrophe escaping.

Product names and technology names stay in English in every locale.

### How the work is split

`data/projects.ts` separates two kinds of work, and the distinction is
deliberate:

- `kind: "product"` — products SDS builds and develops **as SDS**.
- `kind: "commercial"` — projects the team developed **as part of Dotlabs**.
  They are listed as team experience with the role held, their case study opens
  with an explicit context note, and the next-project chain never crosses from
  one kind into the other. They must never be presented as SDS clients.

Every project gets a case study, but the narrative sections are all optional:
`overview`, `challenge`, `solution`, `features` and `result` render only when
the message catalog has content for them, so a project we know less about gets
a shorter page instead of padded-out filler.

### Screenshots

Only real captures are used. `public/work/*.png` are the shipped images; the
originals are kept in `assets/screenshots/` and are never served.

Regenerate the shipped images with:

```bash
python3 scripts/prepare-screenshots.py
```

That script crops off the browser chrome, **blurs any region holding personal
data**, and writes WebP at 2000px wide (the three sources together are ~220 KB
rather than ~2 MB as PNG). The Oson Uy CRM capture is a real
developer's workspace, so its client column — names and phone numbers — is
redacted there. Any new capture containing personal data must get a redaction
box in `REDACTIONS` before it ships.

Projects without a capture fall back to an abstract line diagram
(`components/projects/project-glyph.tsx`) — schematic by design, so it can never
be mistaken for a real interface. Add a capture to `public/work/`, point `cover`
at it in `data/projects.ts`, and the card switches automatically. Extra captures
go in `images[]` and appear as the case study's PRODUCT section.

## Things to fill in

- `lib/site.ts` — production URL (`https://sds.uz`) and email (`hello@sds.uz`).
- `Project.technologies` in `data/projects.ts` is intentionally empty for every
  project. Fill it in and the case study's TECHNOLOGY section appears by itself;
  until then only the studio-level stack on the about page is stated, because we
  do not assert a per-project stack that has not been confirmed.
- `Project.year` is likewise empty — the meta row simply omits it.
- Nothing on the site asserts client counts, project counts, timelines or
  result metrics. Add them only with verified figures.

## SEO

- Per-page metadata via the Metadata API + `generateMetadata`
- Per-locale canonical URLs, full `hreflang` alternates and `x-default`
- OpenGraph/Twitter cards with a generated OG image (`opengraph-image.tsx`)
- JSON-LD `Organization` + `BreadcrumbList`
- `sitemap.xml` and `robots.txt`
