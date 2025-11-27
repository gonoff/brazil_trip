"use client";

import { useState } from "react";
import { useHotels, useCreateHotel, useUpdateHotel, useDeleteHotel } from "@/hooks/use-hotels";
import { HotelForm } from "@/components/hotels/hotel-form";
import { HotelCard } from "@/components/hotels/hotel-card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Building2 } from "lucide-react";
import { Hotel } from "@/types";
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

export default function HotelsPage() {
  const { data: hotels, isLoading, error } = useHotels();
  const createHotel = useCreateHotel();
  const updateHotel = useUpdateHotel();
  const deleteHotel = useDeleteHotel();

  const [formOpen, setFormOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleCreate = async (data: { name: string; checkInDate: string; checkOutDate: string; address?: string; city?: string; regionId?: string; confirmationNumber?: string; pricePerNight?: string; totalCost?: string; notes?: string }) => {
    await createHotel.mutateAsync({
      name: data.name,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      address: data.address,
      city: data.city,
      regionId: data.regionId ? parseInt(data.regionId, 10) : undefined,
      confirmationNumber: data.confirmationNumber,
      pricePerNight: data.pricePerNight ? parseFloat(data.pricePerNight) : undefined,
      totalCost: data.totalCost ? parseFloat(data.totalCost) : undefined,
      notes: data.notes,
    });
  };

  const handleUpdate = async (data: { name: string; checkInDate: string; checkOutDate: string; address?: string; city?: string; regionId?: string; confirmationNumber?: string; pricePerNight?: string; totalCost?: string; notes?: string }) => {
    if (!editingHotel) return;
    await updateHotel.mutateAsync({
      id: editingHotel.id,
      data: {
        name: data.name,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        address: data.address,
        city: data.city,
        regionId: data.regionId ? parseInt(data.regionId, 10) : undefined,
        confirmationNumber: data.confirmationNumber,
        pricePerNight: data.pricePerNight ? parseFloat(data.pricePerNight) : undefined,
        totalCost: data.totalCost ? parseFloat(data.totalCost) : undefined,
        notes: data.notes,
      },
    });
    setEditingHotel(null);
  };

  const handleDelete = async () => {
    if (deleteConfirmId === null) return;
    await deleteHotel.mutateAsync(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  const openEditForm = (hotel: Hotel) => {
    setEditingHotel(hotel);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load hotels</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hotels</h1>
          <p className="text-muted-foreground mt-1">
            Manage your accommodations
          </p>
        </div>

        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Hotel
        </Button>
      </div>

      {hotels && hotels.length > 0 ? (
        <div className="space-y-4">
          {hotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onEdit={() => openEditForm(hotel)}
              onDelete={() => setDeleteConfirmId(hotel.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No hotels yet</h3>
          <p className="text-muted-foreground mt-1">
            Add your first accommodation to get started
          </p>
          <Button onClick={() => setFormOpen(true)} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Hotel
          </Button>
        </div>
      )}

      {/* Create form */}
      <HotelForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
        isLoading={createHotel.isPending}
      />

      {/* Edit form */}
      <HotelForm
        open={!!editingHotel}
        onOpenChange={(open) => !open && setEditingHotel(null)}
        onSubmit={handleUpdate}
        hotel={editingHotel}
        isLoading={updateHotel.isPending}
      />

      {/* Delete confirmation */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hotel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this hotel? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
