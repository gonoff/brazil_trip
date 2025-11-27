"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
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
import { Flight } from "@/types";
import { getUTCDateTimeLocal } from "@/lib/utils";

const flightSchema = z.object({
  airline: z.string().min(1, "Airline is required"),
  flightNumber: z.string().min(1, "Flight number is required"),
  departureCity: z.string().min(1, "Departure city is required"),
  arrivalCity: z.string().min(1, "Arrival city is required"),
  departureDatetime: z.string().min(1, "Departure date/time is required"),
  arrivalDatetime: z.string().min(1, "Arrival date/time is required"),
  confirmationNumber: z.string().optional(),
  price: z.string().optional(),
  notes: z.string().optional(),
});

type FlightFormValues = z.infer<typeof flightSchema>;

interface FlightFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FlightFormValues) => Promise<void>;
  flight?: Flight | null;
  isLoading?: boolean;
}

export function FlightForm({
  open,
  onOpenChange,
  onSubmit,
  flight,
  isLoading,
}: FlightFormProps) {
  const isEditing = !!flight;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FlightFormValues>({
    resolver: zodResolver(flightSchema),
    defaultValues: flight
      ? {
          airline: flight.airline,
          flightNumber: flight.flightNumber,
          departureCity: flight.departureCity,
          arrivalCity: flight.arrivalCity,
          departureDatetime: getUTCDateTimeLocal(flight.departureDatetime),
          arrivalDatetime: getUTCDateTimeLocal(flight.arrivalDatetime),
          confirmationNumber: flight.confirmationNumber || "",
          price: flight.price?.toString() || "",
          notes: flight.notes || "",
        }
      : {
          airline: "",
          flightNumber: "",
          departureCity: "",
          arrivalCity: "",
          departureDatetime: "",
          arrivalDatetime: "",
          confirmationNumber: "",
          price: "",
          notes: "",
        },
  });

  // Reset form when flight prop changes (for edit mode)
  useEffect(() => {
    if (flight) {
      reset({
        airline: flight.airline,
        flightNumber: flight.flightNumber,
        departureCity: flight.departureCity,
        arrivalCity: flight.arrivalCity,
        departureDatetime: getUTCDateTimeLocal(flight.departureDatetime),
        arrivalDatetime: getUTCDateTimeLocal(flight.arrivalDatetime),
        confirmationNumber: flight.confirmationNumber || "",
        price: flight.price?.toString() || "",
        notes: flight.notes || "",
      });
    } else {
      reset({
        airline: "",
        flightNumber: "",
        departureCity: "",
        arrivalCity: "",
        departureDatetime: "",
        arrivalDatetime: "",
        confirmationNumber: "",
        price: "",
        notes: "",
      });
    }
  }, [flight, reset]);

  const handleFormSubmit = async (data: FlightFormValues) => {
    await onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Flight" : "Add Flight"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="airline">Airline</Label>
              <Input id="airline" {...register("airline")} placeholder="LATAM" />
              {errors.airline && (
                <p className="text-sm text-destructive">{errors.airline.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="flightNumber">Flight Number</Label>
              <Input id="flightNumber" {...register("flightNumber")} placeholder="LA1234" />
              {errors.flightNumber && (
                <p className="text-sm text-destructive">{errors.flightNumber.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departureCity">From</Label>
              <Input id="departureCity" {...register("departureCity")} placeholder="São Paulo (GRU)" />
              {errors.departureCity && (
                <p className="text-sm text-destructive">{errors.departureCity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="arrivalCity">To</Label>
              <Input id="arrivalCity" {...register("arrivalCity")} placeholder="Rio de Janeiro (GIG)" />
              {errors.arrivalCity && (
                <p className="text-sm text-destructive">{errors.arrivalCity.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departureDatetime">Departure</Label>
              <Input
                id="departureDatetime"
                type="datetime-local"
                {...register("departureDatetime")}
              />
              {errors.departureDatetime && (
                <p className="text-sm text-destructive">{errors.departureDatetime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="arrivalDatetime">Arrival</Label>
              <Input
                id="arrivalDatetime"
                type="datetime-local"
                {...register("arrivalDatetime")}
              />
              {errors.arrivalDatetime && (
                <p className="text-sm text-destructive">{errors.arrivalDatetime.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="confirmationNumber">Confirmation #</Label>
              <Input
                id="confirmationNumber"
                {...register("confirmationNumber")}
                placeholder="ABC123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price")}
                placeholder="500.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Any additional notes..."
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
              {isLoading ? "Saving..." : isEditing ? "Update" : "Add Flight"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
