"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CurrencyConverter } from "@/components/widgets/currency-converter";
import { SearchCommand } from "@/components/widgets/search-command";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

export function MobileHeader() {
  const { lock } = useAuth();
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
          <Button
            variant="ghost"
            size="icon"
            onClick={lock}
            title="Lock app"
            className="h-8 w-8"
          >
            <Lock className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
