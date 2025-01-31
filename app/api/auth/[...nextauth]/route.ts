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
    async session({ session }) {
      if (session.user?.email) {
        const existingUser = await prisma.user.findUnique({
          // GoogleのemailでSupabaseのidを取得
          where: { email: session.user.email },
        });

        if (existingUser) {
          // SupabaseのIDに置き換え
          session.user.id = existingUser.id;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
