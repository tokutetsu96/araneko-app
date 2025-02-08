import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuth = !!token;
  const { pathname } = req.nextUrl;

  // 認証ページ (/auth/signin) では middleware をスキップ
  if (pathname.startsWith("/api/auth/login")) {
    return NextResponse.next();
  }

  // API と Next.js の静的ファイルはスキップ
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  // 認証されていない場合は /auth/signin にリダイレクト
  if (!isAuth) {
    return NextResponse.redirect(new URL("/api/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
