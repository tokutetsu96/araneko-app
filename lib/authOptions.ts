import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import nodemailer from "nodemailer";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

if (
  !process.env.NEXTAUTH_SECRET ||
  !process.env.EMAIL_SERVER ||
  !process.env.EMAIL_FROM
) {
  throw new Error("Missing environment variables for authentication");
}

// Gmail の SMTP 設定
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier: email, url }) {
        if (!email) {
          throw new Error("メールアドレスが取得できませんでした");
        }

        try {
          await transporter.sendMail({
            from: `"No Reply" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: "ログインリンク",
            html: `
              <p>以下のリンクをクリックしてログインしてください:</p>
              <p><a href="${url}">${url}</a></p>
            `,
          });
        } catch (error) {
          throw new Error("メール送信に失敗しました");
        }
      },
    }),
  ],
  pages: {
    signIn: "/api/auth/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log("🔀 リダイレクト先:", url);
      if (url.includes("/api/auth/callback/email")) {
        return `${baseUrl}/`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async signIn({ user }) {
      try {
        // DB にユーザーが存在するか確認
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          console.log("🆕 新規ユーザーを作成:", user.email);
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
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.id = dbUser.id;
        }
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_SECRET },
};
