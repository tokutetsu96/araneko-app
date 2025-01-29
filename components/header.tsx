"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import links from "../data/link";
import { Button } from "./ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="w-full">
      {/* Main Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={`px-4 text-sm font-bold ${
                    link.isBold ? "px-8 text-xl font-extrabold" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* ログインユーザー情報 & ログアウトボタン */}
            {session && (
              <div className="flex items-center gap-4 ml-auto">
                <span className="font-bold">{session.user?.name}</span>
                <Button
                  onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}
                  className="px-4 py-2 rounded-md text-sm font-bold"
                >
                  ログアウト
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
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
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="block px-3 py-2 text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
              {session && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm font-bold">
                    {session.user?.name}
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
