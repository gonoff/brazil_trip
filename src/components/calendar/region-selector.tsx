"use client";

import { REGIONS, type RegionCode } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarDay } from "@/types";
import { X } from "lucide-react";

interface RegionSelectorProps {
  calendarDay: CalendarDay | null;
  date: Date;
  onSelectRegion: (regionCode: RegionCode | null) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function RegionSelector({
  calendarDay,
  date,
  onSelectRegion,
  open,
  onOpenChange,
  children,
}: RegionSelectorProps) {
  const currentRegionCode = calendarDay?.region?.code as RegionCode | undefined;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="start">
        <div className="space-y-3">
          <div className="font-medium text-sm">
            {format(date, "EEEE, MMMM d, yyyy")}
          </div>

          <div className="text-xs text-muted-foreground">
            Select a region for this day:
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(REGIONS) as RegionCode[]).map((code) => {
              const region = REGIONS[code];
              const isSelected = currentRegionCode === code;

              return (
                <Button
                  key={code}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onSelectRegion(code);
                    onOpenChange(false);
                  }}
                  className={cn(
                    "justify-start gap-2 h-auto py-2",
                    isSelected && "ring-2 ring-offset-1"
                  )}
                  style={{
                    borderColor: region.colorHex,
                    ...(isSelected && {
                      backgroundColor: region.colorHex,
                      color: "white",
                    }),
                  }}
                >
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: region.colorHex }}
                  />
                  <span className="text-xs truncate">{region.name}</span>
                </Button>
              );
            })}
          </div>

          {currentRegionCode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSelectRegion(null);
                onOpenChange(false);
              }}
              className="w-full text-muted-foreground"
            >
              <X className="h-4 w-4 mr-2" />
              Clear region
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
