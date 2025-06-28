import Link from "next/link";
import React from "react";
import { CustomIcon } from "../CustomIcon";
import { ThemeToggle } from "../ThemeToggle";

export function Header(p: { isLoggedIn: boolean; leftComponent: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 flex-1 items-center justify-between px-2 md:px-6">
        <div className="flex items-center gap-2">
          {p.leftComponent}

          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <CustomIcon iconName="Cloud" size="lg" />
            <span className="font-bold">
              <span className="hidden md:block">Pokkit Realtime Chat</span>
              <span className="block md:hidden">PRC</span>
            </span>
          </Link>
        </div>

        <nav className="flex items-center space-x-2">
          {p.isLoggedIn && <Link href="/log">Log</Link>}

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
