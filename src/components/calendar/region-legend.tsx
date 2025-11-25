"use client";

import { REGIONS, type RegionCode } from "@/lib/constants";

interface RegionLegendProps {
  regionDays?: Record<string, number>;
}

export function RegionLegend({ regionDays }: RegionLegendProps) {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg border border-border">
      <div className="text-sm font-medium text-muted-foreground w-full mb-2">
        Region Legend
      </div>
      {(Object.keys(REGIONS) as RegionCode[]).map((code) => {
        const region = REGIONS[code];
        const days = regionDays?.[code] || 0;

        return (
          <div key={code} className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded"
              style={{ backgroundColor: region.colorHex }}
            />
            <span className="text-sm">{region.name}</span>
            {regionDays && (
              <span className="text-xs text-muted-foreground">
                ({days} {days === 1 ? "day" : "days"})
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
