/**
 * SEC-08: Server-side proxy — hides real backend URL from browser.
 * Reads httpOnly access_token cookie and forwards requests to backend.
 */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL!;

async function handler(request: NextRequest, { params }: { params: { path: string[] } }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const backendPath = params.path.join("/");
  const url = new URL(request.url);
  const backendUrl = `${BACKEND_URL}/api/v1/${backendPath}${url.search}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let body: string | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.text();
  }

  const res = await fetch(backendUrl, {
    method: request.method,
    headers,
    body,
  });

  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };