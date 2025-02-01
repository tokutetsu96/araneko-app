"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation"; // 現在のパスを取得
import links from "../data/link";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { ThemeButton } from "./theme-button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname(); // 現在のページのパス

  return (
    <div className="w-full">
      {/* Main Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 relative">
            {/* メインナビを中央配置 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
              {links.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={index}
                    href={link.href}
                    className={`px-4 text-sm font-bold whitespace-nowrap ${
                      link.isBold
                        ? "px-8 text-xl font-extrabold"
                        : `underline-offset-4 decoration-2 ${
                            isActive
                              ? "underline decoration-4 decoration-blue-300"
                              : "no-underline hover:underline hover:decoration-4 decoration-blue-300 transition-all duration-500"
                          }`
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* ログインユーザー情報 & ログアウトボタン（右端） */}
            <div className="ml-auto flex items-center gap-4 relative">
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
                onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}
                className="px-4 py-2 rounded-md text-sm font-bold"
              >
                ログアウト
              </Button>

              <ThemeButton />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center ml-auto">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-800"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {links.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={index}
                    href={link.href}
                    className={`block px-3 py-2 text-sm font-medium ${
                      isActive ? "underline decoration-blue-500" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {session && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm font-bold">
                    {session?.user?.name}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}
                    className="w-full text-left px-3 py-2 text-sm font-medium bg-red-500 text-white rounded-md"
                  >
                    ログアウト
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
