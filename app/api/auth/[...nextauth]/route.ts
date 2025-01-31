import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: User }) {
      try {
        // ユーザーが既に存在するか確認
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        // ユーザーがいなければ新規作成
        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name ?? "",
              email: user.email ?? "",
              image: user.image ?? "",
            },
          });
        }

        return true;
      } catch (error) {
        console.error("SignIn Error:", error);
        return false;
      }
    },
    async session({ session, user }) {
      if (session.user) {
        // セッションにユーザーIDを追加
        session.user.id = user.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
