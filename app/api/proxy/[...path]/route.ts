// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL!;

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const cookieStore = await cookies();
  const { path } = await context.params;
  const accessToken = cookieStore.get("access_token")?.value;

  const backendPath = path.join("/");
  const url = new URL(request.url);
  const backendUrl = `${BACKEND_URL}/api/v1/${backendPath}${url.search}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  // ИСПРАВЛЕНИЕ: Проверяем, нужно ли вообще извлекать и передавать body
  let body: string | undefined = undefined;
  const method = request.method.toUpperCase();
  
  // DELETE, GET, HEAD обычно не имеют тела. 
  // Если мы попытаемся передать body в DELETE, Next.js fetch (undici) может упасть
  if (method !== "GET" && method !== "HEAD" && method !== "DELETE") {
    body = await request.text();
  }

  try {
    // Формируем параметры запроса
    const fetchOptions: RequestInit = {
      method,
      headers,
    };
    
    if (body) {
      fetchOptions.body = body;
    }

    const res = await fetch(backendUrl, fetchOptions);

    // Если ответ 204 No Content, возвращаем пустой ответ
    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error: any) {
    console.error("Proxy fetch error:", error);
    return new NextResponse(JSON.stringify({ detail: "Proxy error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
};
