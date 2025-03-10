import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import nodemailer from "nodemailer";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

// Gmail の SMTP 設定
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// 本番環境かどうかを判定
const isProduction = process.env.NODE_ENV === "production";
const productionUrl =
  process.env.NEXTAUTH_URL || "https://araneko-app.vercel.app/";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
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
          console.error("❌ メール送信エラー:", error);
          throw new Error("メール送信に失敗しました");
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
  },
  cookies: {
    sessionToken: {
      name: `${isProduction ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        domain: isProduction
          ? "." + new URL(productionUrl).hostname
          : undefined,
      },
    },
    callbackUrl: {
      name: `${isProduction ? "__Secure-" : ""}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        domain: isProduction
          ? "." + new URL(productionUrl).hostname
          : undefined,
      },
    },
    csrfToken: {
      name: `${isProduction ? "__Secure-" : ""}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        domain: isProduction
          ? "." + new URL(productionUrl).hostname
          : undefined,
      },
    },
    pkceCodeVerifier: {
      name: `${isProduction ? "__Secure-" : ""}next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        maxAge: 900,
        domain: isProduction
          ? "." + new URL(productionUrl).hostname
          : undefined,
      },
    },
    state: {
      name: `${isProduction ? "__Secure-" : ""}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        maxAge: 900,
        domain: isProduction
          ? "." + new URL(productionUrl).hostname
          : undefined,
      },
    },
    nonce: {
      name: `${isProduction ? "__Secure-" : ""}next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        domain: isProduction
          ? "." + new URL(productionUrl).hostname
          : undefined,
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },

    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.includes("/api/auth/callback/email")) {
        return `${baseUrl}/`;
      }
      return baseUrl;
    },
  },
  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_SECRET },
};
