import { NextResponse } from "next/server";
import { AuthzError, searchCrm } from "@/lib/crm/repo";

/** Global CRM search. Guarded by the admin middleware and re-checked below. */
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";

  try {
    return NextResponse.json({ hits: await searchCrm(query) });
  } catch (error) {
    if (error instanceof AuthzError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ hits: [] });
  }
}
