"use client";

import { useState } from "react";
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from "@/hooks/use-events";
import { useCalendarDays } from "@/hooks/use-calendar-days";
import { EventForm } from "@/components/events/event-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, CalendarCheck, Edit, Trash2, Clock, MapPin } from "lucide-react";
import { Event } from "@/types";
import { formatUTCDate } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { REGIONS, RegionCode } from "@/lib/constants";

export default function EventsPage() {
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: calendarDays, isLoading: daysLoading } = useCalendarDays();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleCreate = async (data: { calendarDayId: string; title: string; description?: string; startTime?: string; endTime?: string; location?: string; category?: string }) => {
    await createEvent.mutateAsync({
      ...data,
      calendarDayId: parseInt(data.calendarDayId, 10),
    });
  };

  const handleUpdate = async (data: { calendarDayId: string; title: string; description?: string; startTime?: string; endTime?: string; location?: string; category?: string }) => {
    if (!editingEvent) return;
    await updateEvent.mutateAsync({
      id: editingEvent.id,
      data: {
        ...data,
        calendarDayId: parseInt(data.calendarDayId, 10),
      },
    });
    setEditingEvent(null);
  };

  const handleDelete = async () => {
    if (deleteConfirmId === null) return;
    await deleteEvent.mutateAsync(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  const formatTime = (time: string | null) => {
    if (!time) return null;
    try {
      const date = new Date(time);
      // Use UTC to avoid timezone conversion issues
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const hours12 = hours % 12 || 12;
      return `${hours12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    } catch {
      return time;
    }
  };

  const isLoading = eventsLoading || daysLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Group events by date
  const eventsByDate = events?.reduce((acc, event) => {
    const dateKey = event.calendarDay
      ? formatUTCDate(event.calendarDay.date, "yyyy-MM-dd")
      : "unscheduled";
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const sortedDates = eventsByDate
    ? Object.keys(eventsByDate).sort()
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground mt-1">
            Schedule activities and things to do
          </p>
        </div>

        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {events && events.length > 0 ? (
        <div className="space-y-6">
          {sortedDates.map((dateKey) => {
            const dayEvents = eventsByDate![dateKey];
            const firstEvent = dayEvents[0];
            const calendarDay = firstEvent?.calendarDay;
            const regionCode = calendarDay?.region?.code as RegionCode | undefined;
            const region = regionCode ? REGIONS[regionCode] : null;

            return (
              <div key={dateKey}>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="font-semibold">
                    {calendarDay
                      ? formatUTCDate(calendarDay.date, "EEEE, MMMM d, yyyy")
                      : "Unscheduled"}
                  </h2>
                  {region && (
                    <Badge
                      style={{ backgroundColor: region.colorHex, color: "white" }}
                    >
                      {region.name}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <CalendarCheck className="h-5 w-5 text-primary" />
                            </div>

                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold">{event.title}</span>
                                {event.category && (
                                  <Badge variant="outline">{event.category}</Badge>
                                )}
                              </div>

                              {(event.startTime || event.endTime) && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3 shrink-0" />
                                  <span>
                                    {formatTime(event.startTime)}
                                    {event.endTime && ` - ${formatTime(event.endTime)}`}
                                  </span>
                                </div>
                              )}

                              {event.location && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3 shrink-0" />
                                  <span className="truncate">{event.location}</span>
                                </div>
                              )}

                              {event.description && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-1 self-end sm:self-start shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingEvent(event)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteConfirmId(event.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <CalendarCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No events yet</h3>
          <p className="text-muted-foreground mt-1">
            Schedule your first activity
          </p>
          <Button onClick={() => setFormOpen(true)} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      )}

      {/* Create form */}
      {calendarDays && (
        <EventForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleCreate}
          calendarDays={calendarDays}
          isLoading={createEvent.isPending}
        />
      )}

      {/* Edit form */}
      {calendarDays && (
        <EventForm
          open={!!editingEvent}
          onOpenChange={(open) => !open && setEditingEvent(null)}
          onSubmit={handleUpdate}
          event={editingEvent}
          calendarDays={calendarDays}
          isLoading={updateEvent.isPending}
        />
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
