"use client";

import { useState } from "react";
import { useFlights, useCreateFlight, useUpdateFlight, useDeleteFlight } from "@/hooks/use-flights";
import { FlightForm } from "@/components/flights/flight-form";
import { FlightCard } from "@/components/flights/flight-card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Plane } from "lucide-react";
import { Flight } from "@/types";
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

export default function FlightsPage() {
  const { data: flights, isLoading, error } = useFlights();
  const createFlight = useCreateFlight();
  const updateFlight = useUpdateFlight();
  const deleteFlight = useDeleteFlight();

  const [formOpen, setFormOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleCreate = async (data: { airline: string; flightNumber: string; departureCity: string; arrivalCity: string; departureDatetime: string; arrivalDatetime: string; confirmationNumber?: string; price?: string; notes?: string }) => {
    await createFlight.mutateAsync({
      ...data,
      price: data.price ? parseFloat(data.price) : undefined,
    });
  };

  const handleUpdate = async (data: { airline: string; flightNumber: string; departureCity: string; arrivalCity: string; departureDatetime: string; arrivalDatetime: string; confirmationNumber?: string; price?: string; notes?: string }) => {
    if (!editingFlight) return;
    await updateFlight.mutateAsync({
      id: editingFlight.id,
      data: {
        ...data,
        price: data.price ? parseFloat(data.price) : undefined,
      },
    });
    setEditingFlight(null);
  };

  const handleDelete = async () => {
    if (deleteConfirmId === null) return;
    await deleteFlight.mutateAsync(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  const openEditForm = (flight: Flight) => {
    setEditingFlight(flight);
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
        <p className="text-destructive">Failed to load flights</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Flights</h1>
          <p className="text-muted-foreground mt-1">
            Manage your flight bookings
          </p>
        </div>

        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Flight
        </Button>
      </div>

      {flights && flights.length > 0 ? (
        <div className="space-y-4">
          {flights.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              onEdit={() => openEditForm(flight)}
              onDelete={() => setDeleteConfirmId(flight.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <Plane className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No flights yet</h3>
          <p className="text-muted-foreground mt-1">
            Add your first flight to get started
          </p>
          <Button onClick={() => setFormOpen(true)} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Flight
          </Button>
        </div>
      )}

      {/* Create form */}
      <FlightForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
        isLoading={createFlight.isPending}
      />

      {/* Edit form */}
      <FlightForm
        open={!!editingFlight}
        onOpenChange={(open) => !open && setEditingFlight(null)}
        onSubmit={handleUpdate}
        flight={editingFlight}
        isLoading={updateFlight.isPending}
      />

      {/* Delete confirmation */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Flight</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this flight? This action cannot be undone.
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
