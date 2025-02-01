import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth/login");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/summoner-list", req.url));
      }

      return null;
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  },
  {
    callbacks: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async authorized({ req, token }) {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path", "/editor/:path", "/login", "/register"],
};
