"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation"; // 現在のパスを取得
import links from "../data/link";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { ThemeButton } from "./buttons/theme-button";

export default function Header() {
  const { data: session } = useSession();
  // 現在のページのパス
  const pathname = usePathname();

  return (
    <div className="w-full border-b">
      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16">
          {/* 左側のナビゲーション */}
          <div className="flex items-center space-x-6">
            {links
              .filter((link) => link.label !== "AraNeko APP") // リンク内のロゴを除外
              .map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={index}
                    href={link.href}
                    className={`px-4 text-sm font-bold whitespace-nowrap underline-offset-4 decoration-2 ${
                      isActive
                        ? "underline decoration-4 decoration-blue-300"
                        : "no-underline hover:underline hover:decoration-4 decoration-blue-300 transition-all duration-500"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
          </div>

          {/* 中央のロゴ */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-xl font-extrabold">
              <a href={"/"}>AraNeko APP</a>
            </h1>
          </div>

          {/* 右側のユーザー情報 & ログアウトボタン */}
          <div className="flex items-center gap-4">
            <Avatar className="w-10 h-10">
              {session?.user?.image && (
                <AvatarImage
                  src={session?.user?.image}
                  alt={session?.user?.name || ""}
                  className="rounded-full"
                />
              )}
            </Avatar>
            <Button
              onClick={() => signOut({ callbackUrl: "/api/auth/login" })}
              className="px-4 py-2 rounded-md text-sm font-bold"
            >
              ログアウト
            </Button>

            <ThemeButton />
          </div>
        </div>
      </nav>
    </div>
  );
}
