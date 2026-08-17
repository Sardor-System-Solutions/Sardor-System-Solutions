import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { routing } from "./i18n/routing";

/*
  One middleware, two jobs.

  - The public site needs next-intl's locale routing, otherwise `/` never
    resolves to a `[locale]` segment and every marketing page 404s.
  - /admin and /api/admin need the session guard.

  They are dispatched by path rather than layered, because next-intl would
  otherwise try to prefix the admin routes with a locale.
*/

const COOKIE_NAME = "admin_session";
const secret = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET ?? "dev-only-insecure-secret-change-me",
);

const intlMiddleware = createMiddleware(routing);

// Runs on the Edge runtime, so lib/auth.ts (which uses next/headers) isn't
// reused here.
async function isAuthed(token: string | undefined) {
  if (!token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

async function guardAdmin(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  if (isLoginPage || isLoginApi) return NextResponse.next();

  const authed = await isAuthed(req.cookies.get(COOKIE_NAME)?.value);
  if (authed) return NextResponse.next();

  if (pathname.startsWith("/api/admin/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return guardAdmin(req);
  }

  // Any other API route is left alone — it has no locale.
  if (pathname.startsWith("/api")) return NextResponse.next();

  return intlMiddleware(req);
}

export const config = {
  // Everything except Next internals and files with an extension. `/api` is
  // deliberately included so the admin API is guarded.
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
