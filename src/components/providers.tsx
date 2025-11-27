"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useState, useEffect } from "react";
import { createIDBPersister } from "@/lib/query-persister";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 1000 * 60 * 60 * 24, // 24 hours for persistence
            refetchOnWindowFocus: false,
            retry: (failureCount) => {
              // Don't retry if offline
              if (typeof navigator !== "undefined" && !navigator.onLine) {
                return false;
              }
              return failureCount < 3;
            },
          },
          mutations: {
            retry: false, // Don't retry mutations offline
          },
        },
      })
  );

  const [persister, setPersister] = useState<ReturnType<typeof createIDBPersister> | null>(null);

  useEffect(() => {
    // Only create persister on client side
    setPersister(createIDBPersister());
  }, []);

  // During SSR/build or before persister is ready, use regular QueryClientProvider
  if (!persister) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        buster: "v1", // Change to invalidate cache on major updates
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
