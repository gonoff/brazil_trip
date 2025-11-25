"use client";

import { format } from "date-fns";
import { Flight } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Edit, Trash2 } from "lucide-react";
import { formatBRL, convertToUSD, formatUSD } from "@/lib/utils";

interface FlightCardProps {
  flight: Flight;
  onEdit: () => void;
  onDelete: () => void;
  exchangeRate?: number;
}

export function FlightCard({ flight, onEdit, onDelete, exchangeRate = 5.4 }: FlightCardProps) {
  const departureDate = new Date(flight.departureDatetime);
  const arrivalDate = new Date(flight.arrivalDatetime);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Plane className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{flight.airline}</span>
                <Badge variant="outline">{flight.flightNumber}</Badge>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{flight.departureCity}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium">{flight.arrivalCity}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{format(departureDate, "MMM d, yyyy")}</span>
                <span>
                  {format(departureDate, "HH:mm")} - {format(arrivalDate, "HH:mm")}
                </span>
              </div>

              {flight.confirmationNumber && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Confirmation: </span>
                  <span className="font-mono">{flight.confirmationNumber}</span>
                </div>
              )}

              {flight.price && (
                <div className="text-sm">
                  <span className="font-medium">{formatBRL(Number(flight.price))}</span>
                  <span className="text-muted-foreground ml-1">
                    (~{formatUSD(convertToUSD(Number(flight.price), exchangeRate))})
                  </span>
                </div>
              )}

              {flight.notes && (
                <p className="text-sm text-muted-foreground mt-2">{flight.notes}</p>
              )}
            </div>
          </div>

          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
