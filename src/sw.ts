/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

// Handle push notifications
self.addEventListener("push", (event) => {
  const pushEvent = event as ExtendableEvent & { data?: { json(): Record<string, unknown> } };
  if (pushEvent.data) {
    const data = pushEvent.data.json();
    const options = {
      body: data.body as string,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/",
      },
      actions: (data.actions as { action: string; title: string }[]) || [],
    };

    pushEvent.waitUntil(
      self.registration.showNotification(data.title as string, options)
    );
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  const notifEvent = event as ExtendableEvent & { notification: Notification };
  notifEvent.notification.close();
  const notifData = notifEvent.notification.data as { url?: string } | undefined;
  const url = notifData?.url || "/";

  notifEvent.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      // Check if there's already a window open with this URL
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return (client as WindowClient).focus();
        }
      }
      // If no window is open, open a new one
      return self.clients.openWindow(url);
    })
  );
});

serwist.addEventListeners();
