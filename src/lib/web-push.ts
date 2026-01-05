/**
 * Server-side web-push utilities for sending push notifications.
 */
import webpush from "web-push";
import { prisma } from "./db";

// Configure web-push with VAPID keys
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:example@example.com";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export interface NotificationPayload {
  title: string;
  body: string;
  url?: string;
  actions?: Array<{ action: string; title: string }>;
}

/**
 * Send a push notification to all subscribed users.
 * Returns the number of successful sends and any errors.
 */
export async function sendPushToAll(payload: NotificationPayload): Promise<{
  sent: number;
  failed: number;
  errors: string[];
}> {
  if (!vapidPublicKey || !vapidPrivateKey) {
    throw new Error("VAPID keys not configured");
  }

  const subscriptions = await prisma.pushSubscription.findMany();

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];
  const expiredEndpoints: string[] = [];

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify(payload)
        );
        sent++;
      } catch (error: unknown) {
        failed++;
        const webPushError = error as { statusCode?: number; message?: string };

        // If subscription is expired or invalid, mark for deletion
        if (webPushError.statusCode === 410 || webPushError.statusCode === 404) {
          expiredEndpoints.push(sub.endpoint);
        } else {
          errors.push(
            `Failed to send to ${sub.endpoint.slice(0, 50)}...: ${webPushError.message || "Unknown error"}`
          );
        }
      }
    })
  );

  // Clean up expired subscriptions
  if (expiredEndpoints.length > 0) {
    await prisma.pushSubscription.deleteMany({
      where: {
        endpoint: { in: expiredEndpoints },
      },
    });
  }

  return { sent, failed, errors };
}

/**
 * Send a push notification to a specific subscription.
 */
export async function sendPushToOne(
  endpoint: string,
  payload: NotificationPayload
): Promise<boolean> {
  if (!vapidPublicKey || !vapidPrivateKey) {
    throw new Error("VAPID keys not configured");
  }

  const subscription = await prisma.pushSubscription.findUnique({
    where: { endpoint },
  });

  if (!subscription) {
    return false;
  }

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      JSON.stringify(payload)
    );
    return true;
  } catch (error: unknown) {
    const webPushError = error as { statusCode?: number };

    // Clean up if expired
    if (webPushError.statusCode === 410 || webPushError.statusCode === 404) {
      await prisma.pushSubscription.delete({
        where: { endpoint },
      });
    }
    return false;
  }
}
