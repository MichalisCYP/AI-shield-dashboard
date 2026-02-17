import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MonitoringLevelSliderProps {
  value: "high" | "low";
  onChange: (level: "high" | "low") => void;
  loading?: boolean;
}

export function MonitoringLevelSlider({
  value,
  onChange,
  loading,
}: MonitoringLevelSliderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="font-medium">Global Monitoring Level:</span>
      <Button
        variant={value === "high" ? "default" : "outline"}
        disabled={loading}
        onClick={() => onChange("high")}
      >
        High
      </Button>
      <Button
        variant={value === "low" ? "default" : "outline"}
        disabled={loading}
        onClick={() => onChange("low")}
      >
        Low
      </Button>
    </div>
  );
}
