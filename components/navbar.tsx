"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "ホーム", href: "/" },
    { name: "サモナーリスト", href: "/lol" },
    { name: "Tips", href: "/tips" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-visible">
      <div className="container flex h-14 items-center overflow-visible">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Araneko App</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4 overflow-visible">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
