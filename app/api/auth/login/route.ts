/**
 * Server-side auth handler — sets httpOnly cookies.
 * Access token is NEVER sent to client JavaScript.
 */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL; // server-side only, not NEXT_PUBLIC_

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json(error, { status: res.status });
  }

  const data = await res.json();
  const { tokens, user } = data;
  const cookieStore = await cookies();

  const response = NextResponse.json({
    // SEC-05: only non-sensitive user fields sent to client
    user: {
      username: user.username,
      full_name: user.full_name,
      initials: (user.full_name ?? user.username ?? "AF")
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    },
  });

  const isProd = process.env.NODE_ENV === "production";
  cookieStore.set("access_token", tokens.access_token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24h
    path: "/",
  });
  cookieStore.set("refresh_token", tokens.refresh_token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7d
    path: "/",
  });
  
  const username = user?.username || "User";
  const full_name = user?.fullname || user?.full_name || username;

  const initials = full_name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return NextResponse.json({ 
    user: { 
      username, 
      full_name,
      initials
    } 
  });  
}
