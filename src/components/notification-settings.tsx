"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  getCurrentSubscription,
} from "@/lib/push-notifications";

export function NotificationSettings() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      const supported = isPushSupported();
      setIsSupported(supported);

      if (supported) {
        setPermission(getNotificationPermission());

        // Check if service worker is registered before trying to get subscription
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          const subscription = await getCurrentSubscription();
          setIsSubscribed(!!subscription);
        }
      }
      setIsLoading(false);
    }
    checkStatus();
  }, []);

  const handleToggle = async () => {
    setIsLoading(true);

    try {
      if (isSubscribed) {
        // Unsubscribe
        const success = await unsubscribeFromPush();
        if (success) {
          setIsSubscribed(false);
        }
      } else {
        // Request permission if needed
        if (permission !== "granted") {
          const newPermission = await requestNotificationPermission();
          setPermission(newPermission);
          if (newPermission !== "granted") {
            setIsLoading(false);
            return;
          }
        }

        // Subscribe
        const subscription = await subscribeToPush();
        setIsSubscribed(!!subscription);
      }
    } catch (error) {
      console.error("Failed to toggle notifications:", error);
    }

    setIsLoading(false);
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BellOff className="h-4 w-4" />
        <span>Push notifications not supported</span>
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BellOff className="h-4 w-4" />
        <span>Notifications blocked in browser settings</span>
      </div>
    );
  }

  return (
    <Button
      variant={isSubscribed ? "outline" : "default"}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isSubscribed ? (
        <Bell className="h-4 w-4" />
      ) : (
        <BellOff className="h-4 w-4" />
      )}
      {isLoading
        ? "Loading..."
        : isSubscribed
          ? "Notifications On"
          : "Enable Notifications"}
    </Button>
  );
}
