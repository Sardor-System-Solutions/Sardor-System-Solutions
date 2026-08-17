import { NextResponse } from "next/server";
import { authenticate, createSession } from "@/lib/auth";

/**
 * Sign in. The panel POSTs `{ login, password }` and shows `error` from the
 * body when the response isn't ok.
 *
 * This route is exempt from the middleware guard — it's how you get a session
 * in the first place.
 */
export async function POST(request: Request) {
  if (!process.env.ADMIN_LOGIN || !process.env.ADMIN_PASSWORD) {
    // Otherwise every attempt just fails as "wrong password", which is a
    // miserable thing to debug.
    return NextResponse.json(
      { error: "Вход не настроен: задайте ADMIN_LOGIN и ADMIN_PASSWORD." },
      { status: 500 },
    );
  }

  let login = "";
  let password = "";
  try {
    const body = await request.json();
    login = typeof body?.login === "string" ? body.login : "";
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Некорректный запрос." }, { status: 400 });
  }

  const user = await authenticate(login, password);
  if (!user) {
    return NextResponse.json(
      { error: "Неверный логин или пароль." },
      { status: 401 },
    );
  }

  // The session carries the role, so every server-side check can be made
  // without another read.
  await createSession(user);
  return NextResponse.json({ ok: true, role: user.role });
}
