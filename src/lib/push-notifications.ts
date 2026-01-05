/**
 * Client-side push notification utilities.
 * Handles permission requests, subscriptions, and unsubscriptions.
 */

/**
 * Converts a base64 URL-safe string to a Uint8Array.
 * Required for the applicationServerKey in push subscription.
 */
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}

/**
 * Wait for service worker to be ready with a timeout.
 */
async function waitForServiceWorker(timeoutMs: number = 5000): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) {
    return null;
  }

  // First check if there's already a registration
  const existingReg = await navigator.serviceWorker.getRegistration();
  if (existingReg?.active) {
    return existingReg;
  }

  // Wait for ready with timeout
  const timeoutPromise = new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), timeoutMs);
  });

  const readyPromise = navigator.serviceWorker.ready;

  return Promise.race([readyPromise, timeoutPromise]);
}

/**
 * Check if push notifications are supported in this browser.
 */
export function isPushSupported(): boolean {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

/**
 * Get the current notification permission status.
 */
export function getNotificationPermission(): NotificationPermission {
  if (!("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
}

/**
 * Request notification permission from the user.
 * Returns the permission status.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    console.warn("Notifications not supported");
    return "denied";
  }

  return await Notification.requestPermission();
}

/**
 * Subscribe to push notifications.
 * Returns the subscription if successful, null otherwise.
 */
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    console.warn("Push notifications not supported");
    return null;
  }

  try {
    const registration = await waitForServiceWorker(5000);

    if (!registration) {
      console.error("Service worker not available - make sure you're using HTTPS or localhost");
      return null;
    }

    // Get VAPID public key from server
    const response = await fetch("/api/push/vapid-public-key");
    if (!response.ok) {
      console.error("Failed to get VAPID public key");
      return null;
    }
    const { publicKey } = await response.json();

    if (!publicKey) {
      console.error("VAPID public key not configured on server");
      return null;
    }

    // Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    // Send subscription to server
    const saveResponse = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription.toJSON()),
    });

    if (!saveResponse.ok) {
      console.error("Failed to save subscription to server");
      // Unsubscribe since we couldn't save
      await subscription.unsubscribe();
      return null;
    }

    return subscription;
  } catch (error) {
    console.error("Failed to subscribe to push:", error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications.
 * Returns true if successful, false otherwise.
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushSupported()) {
    return false;
  }

  try {
    const registration = await waitForServiceWorker(5000);
    if (!registration) {
      return false;
    }

    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      // Tell server to delete subscription
      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });

      // Unsubscribe locally
      await subscription.unsubscribe();
    }

    return true;
  } catch (error) {
    console.error("Failed to unsubscribe from push:", error);
    return false;
  }
}

/**
 * Get the current push subscription if any.
 */
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    return null;
  }

  try {
    const registration = await waitForServiceWorker(3000);
    if (!registration) {
      return null;
    }
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error("Failed to get current subscription:", error);
    return null;
  }
}
