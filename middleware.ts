import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import path from "path";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ NextAuthのAPIルートは middleware の影響を受けないようにする
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuth = !!token;

  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // API と Next.js の静的ファイルはスキップ
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  if (!isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|api|_next/static|_next/image|favicon.ico).*)"],
};
