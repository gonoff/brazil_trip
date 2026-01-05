import { NextResponse } from "next/server";
import { sendPushToAll, NotificationPayload } from "@/lib/web-push";

/**
 * POST /api/push/send
 * Send a push notification to all subscribers.
 *
 * Body: { title: string, body: string, url?: string }
 */
export async function POST(request: Request) {
  try {
    const payload: NotificationPayload = await request.json();

    if (!payload.title || !payload.body) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    const result = await sendPushToAll(payload);

    return NextResponse.json({
      success: true,
      sent: result.sent,
      failed: result.failed,
      errors: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (error) {
    console.error("Failed to send push notification:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send notification" },
      { status: 500 }
    );
  }
}
