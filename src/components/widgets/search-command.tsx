"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plane,
  Building2,
  CalendarCheck,
  Wallet,
  Search,
  Loader2,
  Calendar,
  Home,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useSearch, SearchResult, SearchResultType } from "@/hooks/use-search";
import { formatUTCDate } from "@/lib/utils";
import { format } from "date-fns";

const typeIcons: Record<SearchResultType, typeof Plane> = {
  flight: Plane,
  hotel: Building2,
  event: CalendarCheck,
  expense: Wallet,
};

const typeColors: Record<SearchResultType, string> = {
  flight: "text-accent",
  hotel: "text-accent",
  event: "text-[#8B6914]",
  expense: "text-[#B85C38]",
};

// Quick navigation items
const quickActions = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Calendar", icon: Calendar, href: "/calendar" },
  { name: "Flights", icon: Plane, href: "/flights" },
  { name: "Hotels", icon: Building2, href: "/hotels" },
  { name: "Expenses", icon: Wallet, href: "/expenses" },
  { name: "Events", icon: CalendarCheck, href: "/events" },
];

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { results, isLoading } = useSearch(query);
  const router = useRouter();

  // Keyboard shortcut to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<SearchResultType, SearchResult[]>);

  const typeLabels: Record<SearchResultType, string> = {
    flight: "Flights",
    hotel: "Hotels",
    event: "Events",
    expense: "Expenses",
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={() => setOpen(true)}
        aria-label="Search (Cmd+K)"
      >
        <Search className="h-5 w-5" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          placeholder="Search flights, hotels, events, expenses..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[400px]">
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && query.length >= 2 && results.length === 0 && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}

          {/* Search Results */}
          {!isLoading &&
            Object.entries(groupedResults).map(([type, items]) => (
              <CommandGroup key={type} heading={typeLabels[type as SearchResultType]}>
                {items.slice(0, 5).map((result) => {
                  const Icon = typeIcons[result.type];
                  return (
                    <CommandItem
                      key={`${result.type}-${result.id}`}
                      onSelect={() => handleSelect(result.href)}
                      className="flex items-center gap-3"
                    >
                      <Icon className={`h-4 w-4 ${typeColors[result.type]}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{result.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {result.subtitle}
                        </div>
                      </div>
                      {result.date && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {typeof result.date === "string"
                            ? formatUTCDate(new Date(result.date), "MMM d")
                            : format(result.date, "MMM d")}
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}

          {/* Quick Navigation (show when no query) */}
          {query.length < 2 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Quick Navigation">
                {quickActions.map((action) => (
                  <CommandItem
                    key={action.href}
                    onSelect={() => handleSelect(action.href)}
                    className="flex items-center gap-3"
                  >
                    <action.icon className="h-4 w-4" />
                    <span>{action.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
