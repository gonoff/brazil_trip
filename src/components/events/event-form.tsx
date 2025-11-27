"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event, CalendarDay } from "@/types";
import { format } from "date-fns";

// Format UTC date without timezone conversion
function formatUTCDate(date: Date | string, formatStr: string): string {
  const d = new Date(date);
  // Create a new date using UTC values to avoid timezone shift
  const utcDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return format(utcDate, formatStr);
}

const eventSchema = z.object({
  calendarDayId: z.string().min(1, "Date is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EventFormValues) => Promise<void>;
  event?: Event | null;
  calendarDays: CalendarDay[];
  isLoading?: boolean;
}

const EVENT_CATEGORIES = [
  "Sightseeing",
  "Restaurant",
  "Tour",
  "Transportation",
  "Meeting",
  "Other",
];

export function EventForm({
  open,
  onOpenChange,
  onSubmit,
  event,
  calendarDays,
  isLoading,
}: EventFormProps) {
  const isEditing = !!event;

  const formatTime = (time: string | null | undefined) => {
    if (!time) return "";
    try {
      const date = new Date(time);
      return format(date, "HH:mm");
    } catch {
      return time;
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          calendarDayId: event.calendarDayId.toString(),
          title: event.title,
          description: event.description || "",
          startTime: formatTime(event.startTime),
          endTime: formatTime(event.endTime),
          location: event.location || "",
          category: event.category || "",
        }
      : {
          calendarDayId: "",
          title: "",
          description: "",
          startTime: "",
          endTime: "",
          location: "",
          category: "",
        },
  });

  const calendarDayId = watch("calendarDayId");
  const category = watch("category");

  // Reset form when event prop changes (for editing)
  useEffect(() => {
    if (event) {
      reset({
        calendarDayId: event.calendarDayId.toString(),
        title: event.title,
        description: event.description || "",
        startTime: formatTime(event.startTime),
        endTime: formatTime(event.endTime),
        location: event.location || "",
        category: event.category || "",
      });
    } else {
      reset({
        calendarDayId: "",
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
        category: "",
      });
    }
  }, [event, reset]);

  const handleFormSubmit = async (data: EventFormValues) => {
    await onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Event" : "Add Event"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Visit Christ the Redeemer"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="calendarDayId">Date</Label>
            <Select
              value={calendarDayId}
              onValueChange={(value) => setValue("calendarDayId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                {calendarDays.map((day) => (
                  <SelectItem key={day.id} value={day.id.toString()}>
                    {formatUTCDate(day.date, "EEE, MMM d, yyyy")}
                    {day.region && ` - ${day.region.name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.calendarDayId && (
              <p className="text-sm text-destructive">
                {errors.calendarDayId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" type="time" {...register("startTime")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" type="time" {...register("endTime")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="Corcovado Mountain, Rio de Janeiro"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setValue("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Details about this event..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Update" : "Add Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
