"use client";

import { useOnlineStatus } from "@/hooks/use-online-status";
import { WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Displays a banner when the user is offline.
 * Shows at the top of the page on mobile, below the header on desktop.
 */
export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] bg-destructive text-destructive-foreground",
        "flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium",
        "md:top-16" // Below header on desktop
      )}
    >
      <WifiOff className="h-4 w-4" />
      <span>You are offline. Viewing cached data. Editing is disabled.</span>
    </div>
  );
}
