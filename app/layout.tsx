import type { ReactNode } from "react";

/**
 * Pass-through root layout.
 *
 * `<html>` and `<body>` are rendered by `app/[locale]/layout.tsx`, which is
 * where the locale is known. Next.js still requires a root layout to exist so
 * that `app/not-found.tsx` — the fallback for paths the locale middleware
 * never sees — has something to render inside.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
