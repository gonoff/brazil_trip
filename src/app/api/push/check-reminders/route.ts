import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPushToAll } from "@/lib/web-push";

/**
 * GET /api/push/check-reminders
 * Check for upcoming events and send reminder notifications.
 *
 * This endpoint should be called periodically (e.g., via cron job).
 * It checks for events happening today or tomorrow and sends reminders.
 *
 * Query params:
 * - secret: Optional secret key for securing the endpoint
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // Optional: Add a secret key check for security
  const expectedSecret = process.env.CRON_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setUTCDate(dayAfterTomorrow.getUTCDate() + 1);

    // Get events for today and tomorrow
    const upcomingEvents = await prisma.event.findMany({
      where: {
        calendarDay: {
          date: {
            gte: today,
            lt: dayAfterTomorrow,
          },
        },
      },
      include: {
        calendarDay: true,
      },
      orderBy: [
        { calendarDay: { date: "asc" } },
        { startTime: "asc" },
      ],
    });

    // Get flights for today and tomorrow
    const upcomingFlights = await prisma.flight.findMany({
      where: {
        departureDatetime: {
          gte: today,
          lt: dayAfterTomorrow,
        },
      },
      orderBy: { departureDatetime: "asc" },
    });

    // Get hotel check-ins for today and tomorrow
    const upcomingCheckins = await prisma.hotel.findMany({
      where: {
        checkInDate: {
          gte: today,
          lt: dayAfterTomorrow,
        },
      },
      orderBy: { checkInDate: "asc" },
    });

    const notifications: Array<{ title: string; body: string; url: string }> = [];

    // Events today
    const todayEvents = upcomingEvents.filter((e) => {
      const eventDate = new Date(e.calendarDay.date);
      return eventDate.getTime() === today.getTime();
    });

    if (todayEvents.length > 0) {
      notifications.push({
        title: "Events Today",
        body: todayEvents.length === 1
          ? todayEvents[0].title
          : `You have ${todayEvents.length} events scheduled today`,
        url: "/events",
      });
    }

    // Events tomorrow
    const tomorrowEvents = upcomingEvents.filter((e) => {
      const eventDate = new Date(e.calendarDay.date);
      return eventDate.getTime() === tomorrow.getTime();
    });

    if (tomorrowEvents.length > 0) {
      notifications.push({
        title: "Events Tomorrow",
        body: tomorrowEvents.length === 1
          ? tomorrowEvents[0].title
          : `You have ${tomorrowEvents.length} events scheduled tomorrow`,
        url: "/events",
      });
    }

    // Flights today
    const todayFlights = upcomingFlights.filter((f) => {
      const flightDate = new Date(f.departureDatetime);
      return flightDate.getUTCFullYear() === today.getUTCFullYear() &&
             flightDate.getUTCMonth() === today.getUTCMonth() &&
             flightDate.getUTCDate() === today.getUTCDate();
    });

    if (todayFlights.length > 0) {
      const flight = todayFlights[0];
      const depTime = new Date(flight.departureDatetime);
      const hours = depTime.getUTCHours();
      const minutes = depTime.getUTCMinutes();
      const timeStr = `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;

      notifications.push({
        title: "Flight Today!",
        body: `${flight.airline} ${flight.flightNumber}: ${flight.departureCity} → ${flight.arrivalCity} at ${timeStr}`,
        url: "/flights",
      });
    }

    // Flights tomorrow
    const tomorrowFlights = upcomingFlights.filter((f) => {
      const flightDate = new Date(f.departureDatetime);
      return flightDate.getUTCFullYear() === tomorrow.getUTCFullYear() &&
             flightDate.getUTCMonth() === tomorrow.getUTCMonth() &&
             flightDate.getUTCDate() === tomorrow.getUTCDate();
    });

    if (tomorrowFlights.length > 0) {
      const flight = tomorrowFlights[0];
      notifications.push({
        title: "Flight Tomorrow",
        body: `${flight.airline} ${flight.flightNumber}: ${flight.departureCity} → ${flight.arrivalCity}`,
        url: "/flights",
      });
    }

    // Hotel check-ins today
    const todayCheckins = upcomingCheckins.filter((h) => {
      const checkinDate = new Date(h.checkInDate);
      return checkinDate.getTime() === today.getTime();
    });

    if (todayCheckins.length > 0) {
      const hotel = todayCheckins[0];
      notifications.push({
        title: "Hotel Check-in Today",
        body: hotel.name,
        url: "/hotels",
      });
    }

    // Send all notifications
    const results = await Promise.all(
      notifications.map((notif) => sendPushToAll(notif))
    );

    const totalSent = results.reduce((sum, r) => sum + r.sent, 0);
    const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);

    return NextResponse.json({
      success: true,
      notificationsSent: notifications.length,
      totalDelivered: totalSent,
      totalFailed,
      notifications: notifications.map((n) => n.title),
    });
  } catch (error) {
    console.error("Failed to check reminders:", error);
    return NextResponse.json(
      { error: "Failed to check reminders" },
      { status: 500 }
    );
  }
}
