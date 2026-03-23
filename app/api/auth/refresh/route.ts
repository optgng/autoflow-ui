import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!refreshToken) {
    return NextResponse.json({ detail: "No refresh token" }, { status: 401 });
  }
  const res = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) {
    const response = NextResponse.json({ detail: "Refresh failed" }, { status: 401 });
    response.cookies.set("access_token", "", { maxAge: 0, httpOnly: true, path: "/" });
    response.cookies.set("refresh_token", "", { maxAge: 0, httpOnly: true, path: "/" });
    return response;
  }
  const data = await res.json();
  const isProd = process.env.NODE_ENV === "production";
  const response = NextResponse.json({ ok: true });
  response.cookies.set("access_token", data.access_token, {
    httpOnly: true, secure: isProd, sameSite: "strict", maxAge: 60 * 60 * 24, path: "/",
  });
  return response;
}
