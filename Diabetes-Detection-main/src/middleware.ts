import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const protectedRoutes = ['/dashboard', '/analytics', '/chatbot'];
const publicRoutes = ['/login', '/signup', '/'];

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  const isPublicRoute = publicRoutes.includes(path);

  const sessionCookie = request.cookies.get('session')?.value;

  let session = null;

  if (sessionCookie) {
    session = await decrypt(sessionCookie);
  }

  const isUserLoggedIn = !!session?.userId;

  // 🚫 Not logged in → block protected routes
  if (isProtectedRoute && !isUserLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 🔁 Logged in → prevent access to login/signup
  if (isUserLoggedIn && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};