import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";
const secret = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET ?? "dev-only-insecure-secret-change-me",
);

// Runs on the Edge runtime, so auth.ts (which uses next/headers) isn't reused here.
async function isAuthed(token: string | undefined) {
  if (!token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin/");
  const isLoginApi = pathname === "/api/admin/login";

  if (isLoginPage || isLoginApi) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const authed = await isAuthed(token);

  if (!authed) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
