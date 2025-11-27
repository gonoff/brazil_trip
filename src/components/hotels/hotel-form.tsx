"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { differenceInDays } from "date-fns";
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
import { Hotel } from "@/types";
import { REGIONS, RegionCode } from "@/lib/constants";
import { formatUTCDate } from "@/lib/utils";

const hotelSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  regionId: z.string().optional(),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  confirmationNumber: z.string().optional(),
  pricePerNight: z.string().optional(),
  totalCost: z.string().optional(),
  notes: z.string().optional(),
});

type HotelFormValues = z.infer<typeof hotelSchema>;

interface HotelFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: HotelFormValues) => Promise<void>;
  hotel?: Hotel | null;
  isLoading?: boolean;
}

export function HotelForm({
  open,
  onOpenChange,
  onSubmit,
  hotel,
  isLoading,
}: HotelFormProps) {
  const isEditing = !!hotel;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues: hotel
      ? {
          name: hotel.name,
          address: hotel.address || "",
          city: hotel.city || "",
          regionId: hotel.regionId?.toString() || "",
          checkInDate: formatUTCDate(hotel.checkInDate, "yyyy-MM-dd"),
          checkOutDate: formatUTCDate(hotel.checkOutDate, "yyyy-MM-dd"),
          confirmationNumber: hotel.confirmationNumber || "",
          pricePerNight: hotel.pricePerNight?.toString() || "",
          totalCost: hotel.totalCost?.toString() || "",
          notes: hotel.notes || "",
        }
      : {
          name: "",
          address: "",
          city: "",
          regionId: "",
          checkInDate: "",
          checkOutDate: "",
          confirmationNumber: "",
          pricePerNight: "",
          totalCost: "",
          notes: "",
        },
  });

  const regionId = watch("regionId");
  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");
  const pricePerNight = watch("pricePerNight");

  // Calculate number of nights
  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diff = differenceInDays(checkOut, checkIn);
    return diff > 0 ? diff : 0;
  }, [checkInDate, checkOutDate]);

  // Auto-calculate total cost when price per night or nights change
  useEffect(() => {
    if (pricePerNight && nights > 0) {
      const price = parseFloat(pricePerNight);
      if (!isNaN(price)) {
        const total = (price * nights).toFixed(2);
        setValue("totalCost", total);
      }
    }
  }, [pricePerNight, nights, setValue]);

  // Reset form when hotel prop changes (for editing)
  useEffect(() => {
    if (hotel) {
      reset({
        name: hotel.name,
        address: hotel.address || "",
        city: hotel.city || "",
        regionId: hotel.regionId?.toString() || "",
        checkInDate: formatUTCDate(hotel.checkInDate, "yyyy-MM-dd"),
        checkOutDate: formatUTCDate(hotel.checkOutDate, "yyyy-MM-dd"),
        confirmationNumber: hotel.confirmationNumber || "",
        pricePerNight: hotel.pricePerNight?.toString() || "",
        totalCost: hotel.totalCost?.toString() || "",
        notes: hotel.notes || "",
      });
    } else {
      reset({
        name: "",
        address: "",
        city: "",
        regionId: "",
        checkInDate: "",
        checkOutDate: "",
        confirmationNumber: "",
        pricePerNight: "",
        totalCost: "",
        notes: "",
      });
    }
  }, [hotel, reset]);

  const handleFormSubmit = async (data: HotelFormValues) => {
    await onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Hotel" : "Add Hotel"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Hotel Name</Label>
            <Input id="name" {...register("name")} placeholder="Hotel Fasano" />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} placeholder="São Paulo" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="regionId">Region</Label>
              <Select
                value={regionId}
                onValueChange={(value) => setValue("regionId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(REGIONS) as RegionCode[]).map((code) => (
                    <SelectItem key={code} value={code}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: REGIONS[code].colorHex }}
                        />
                        {REGIONS[code].name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} placeholder="Rua Vittorio Fasano, 88" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkInDate">Check-in</Label>
              <Input id="checkInDate" type="date" {...register("checkInDate")} />
              {errors.checkInDate && (
                <p className="text-sm text-destructive">{errors.checkInDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOutDate">Check-out</Label>
              <Input id="checkOutDate" type="date" {...register("checkOutDate")} />
              {errors.checkOutDate && (
                <p className="text-sm text-destructive">{errors.checkOutDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmationNumber">Confirmation #</Label>
            <Input
              id="confirmationNumber"
              {...register("confirmationNumber")}
              placeholder="CONF123456"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerNight">Price per Night (R$)</Label>
            <Input
              id="pricePerNight"
              type="number"
              step="0.01"
              {...register("pricePerNight")}
              placeholder="350.00"
            />
          </div>

          {nights > 0 && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {nights} {nights === 1 ? "night" : "nights"}
                  {pricePerNight && ` × R$ ${parseFloat(pricePerNight).toFixed(2)}`}
                </span>
                <span className="font-medium">
                  Total: R$ {watch("totalCost") || "0.00"}
                </span>
              </div>
            </div>
          )}

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
              {isLoading ? "Saving..." : isEditing ? "Update" : "Add Hotel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
