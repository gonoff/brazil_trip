"use client";

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
import { Hotel } from "@/types";
import { REGIONS, RegionCode } from "@/lib/constants";
import { format } from "date-fns";

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
          checkInDate: format(new Date(hotel.checkInDate), "yyyy-MM-dd"),
          checkOutDate: format(new Date(hotel.checkOutDate), "yyyy-MM-dd"),
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerNight">Price/Night (R$)</Label>
              <Input
                id="pricePerNight"
                type="number"
                step="0.01"
                {...register("pricePerNight")}
                placeholder="350.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCost">Total Cost (R$)</Label>
              <Input
                id="totalCost"
                type="number"
                step="0.01"
                {...register("totalCost")}
                placeholder="1750.00"
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
              {isLoading ? "Saving..." : isEditing ? "Update" : "Add Hotel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
