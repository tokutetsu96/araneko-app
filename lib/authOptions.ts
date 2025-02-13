import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import nodemailer from "nodemailer";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";

// PrismaClient のグローバルインスタンスを再利用
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();

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
          console.error("❌ メール送信エラー:", error);
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
      if (!user.email) {
        console.error("❌ User email is missing");
        return false;
      }
      if (!account) {
        console.error("❌ Account information is missing");
        return false;
      }

      try {
        // ユーザーとアカウントを **一括取得** してクエリを減らす
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: {
            accounts: true, // ユーザーに紐づくアカウントも取得
          },
        });

        if (existingUser) {
          // 既に同じ provider のアカウントがあるか確認
          const existingAccount = existingUser.accounts.find(
            (acc) => acc.provider === account.provider
          );

          if (!existingAccount) {
            // 既存のユーザーにはアカウントだけ追加
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
          // 新規ユーザー作成を一括処理 (トランザクション)
          await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
              data: {
                name: user.name ?? "",
                email: user.email ?? "",
                image: user.image ?? "",
              },
            });

            await tx.account.create({
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
          });
        }

        return true;
      } catch (error) {
        console.error("❌ signIn エラー:", error);
        return false;
      }
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
