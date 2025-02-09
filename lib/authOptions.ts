import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import nodemailer from "nodemailer";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
          throw new Error("メール送信に失敗しました");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.includes("/api/auth/callback/email")) {
        return `${baseUrl}/`;
      }
      return baseUrl;
    },

    async signIn({ user, account }) {
      console.log("🔍 signIn user:", user);
      console.log("🔍 signIn account:", account);

      if (!user.email) {
        console.error("❌ User email is missing");
        return false;
      }

      // ✅ `account` が null の場合をチェック
      if (!account) {
        console.error("❌ Account information is missing");
        return false;
      }

      // 既存のユーザーを取得
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        // 既存のユーザーがいる場合、そのユーザーの `Account` を確認
        const existingAccount = await prisma.account.findUnique({
          where: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        });

        if (!existingAccount) {
          console.log("🆕 既存のユーザーに Google アカウントをリンク");
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
            },
          });
        }
      } else {
        // 既存のユーザーがいない場合、新規作成
        console.log("🆕 新規ユーザーを作成:", user.email);
        const newUser = await prisma.user.create({
          data: {
            name: user.name ?? "",
            email: user.email,
            image: user.image ?? "",
          },
        });

        console.log("🔗 新規ユーザーに Google アカウントをリンク");
        await prisma.account.create({
          data: {
            userId: newUser.id,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            type: account.type,
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
          },
        });
      }

      return true;
    },

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
  },
  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_SECRET },
};
