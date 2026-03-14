import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login'];

// Пути, которые не трогаем (статика, api routes)
const IGNORED_PREFIXES = ['/_next', '/favicon', '/api', '/icons', '/images'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Пропускаем статику и api-роуты
  if (IGNORED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('access_token')?.value;
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p);

  // Не авторизован + закрытый роут → на логин
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    // Сохраняем куда шёл пользователь, чтобы после логина вернуть
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Авторизован + открытый роут (/login) → на дашборд
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
