"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { CurrencyConverter } from "@/components/widgets/currency-converter";
import { SearchCommand } from "@/components/widgets/search-command";

export function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-12 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">🇧🇷</span>
          </div>
          <span className="font-bold text-base">Brazil Trip</span>
        </Link>

        <div className="flex items-center gap-1">
          <SearchCommand />
          <CurrencyConverter />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
