import type { ReactNode } from "react";

/**
 * Pass-through root layout.
 *
 * `<html>` and `<body>` are rendered further down, by whichever branch knows
 * what document it needs: `app/[locale]/layout.tsx` for the public site (it
 * has the locale, so it can set `lang` and load the fonts) and
 * `app/admin/layout.tsx` for the admin panel.
 *
 * Rendering `<html>` here as well would nest two documents and break
 * hydration on every page.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
