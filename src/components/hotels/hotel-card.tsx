"use client";

import { format, differenceInDays } from "date-fns";
import { Hotel } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Edit, Trash2, MapPin, Calendar } from "lucide-react";
import { formatBRL, convertToUSD, formatUSD, formatUTCDate } from "@/lib/utils";
import { REGIONS, RegionCode } from "@/lib/constants";

interface HotelCardProps {
  hotel: Hotel;
  onEdit: () => void;
  onDelete: () => void;
  exchangeRate?: number;
}

export function HotelCard({ hotel, onEdit, onDelete, exchangeRate = 5.4 }: HotelCardProps) {
  // Use UTC dates to avoid timezone shift issues
  const checkInDate = new Date(hotel.checkInDate);
  const checkOutDate = new Date(hotel.checkOutDate);
  const checkInUTC = new Date(checkInDate.getUTCFullYear(), checkInDate.getUTCMonth(), checkInDate.getUTCDate());
  const checkOutUTC = new Date(checkOutDate.getUTCFullYear(), checkOutDate.getUTCMonth(), checkOutDate.getUTCDate());
  const nights = differenceInDays(checkOutUTC, checkInUTC);
  const regionCode = hotel.region?.code as RegionCode | undefined;
  const region = regionCode ? REGIONS[regionCode] : null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <Building2 className="h-5 w-5 text-accent" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{hotel.name}</span>
                {region && (
                  <Badge
                    style={{ backgroundColor: region.colorHex, color: "white" }}
                  >
                    {region.name}
                  </Badge>
                )}
              </div>

              {(hotel.city || hotel.address) && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {hotel.city}
                    {hotel.address && ` - ${hotel.address}`}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span>{formatUTCDate(hotel.checkInDate, "MMM d")} - {formatUTCDate(hotel.checkOutDate, "MMM d, yyyy")}</span>
                </div>
                <Badge variant="outline">{nights} {nights === 1 ? "night" : "nights"}</Badge>
              </div>

              {hotel.confirmationNumber && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Confirmation: </span>
                  <span className="font-mono">{hotel.confirmationNumber}</span>
                </div>
              )}

              <div className="flex gap-4 text-sm">
                {hotel.pricePerNight && (
                  <div>
                    <span className="text-muted-foreground">Per night: </span>
                    <span>{formatBRL(Number(hotel.pricePerNight))}</span>
                  </div>
                )}
                {hotel.totalCost && (
                  <div>
                    <span className="text-muted-foreground">Total: </span>
                    <span className="font-medium">{formatBRL(Number(hotel.totalCost))}</span>
                    <span className="text-muted-foreground ml-1">
                      (~{formatUSD(convertToUSD(Number(hotel.totalCost), exchangeRate))})
                    </span>
                  </div>
                )}
              </div>

              {hotel.notes && (
                <p className="text-sm text-muted-foreground mt-2">{hotel.notes}</p>
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
