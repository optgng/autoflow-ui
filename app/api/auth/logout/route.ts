import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set("access_token", "", { maxAge: 0, httpOnly: true, path: "/" });
  cookieStore.set("refresh_token", "", { maxAge: 0, httpOnly: true, path: "/" });
  return NextResponse.json({ ok: true });
}
