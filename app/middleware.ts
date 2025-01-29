import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {

    if (!req.nextauth?.token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  },
  {
    pages: {
      signIn: "/auth/signin",
    },
  }
);

// // 認証が必要なページを指定
// export const config = {
//   matcher: ["/dashboard", "/profile"], // 例: /dashboard と /profile を保護
// };
