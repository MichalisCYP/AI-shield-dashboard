import { Button } from "@/components/ui/button";

interface MonitoringLevelCellProps {
  value: "high" | "low";
  onChange: (level: "high" | "low") => void;
  loading?: boolean;
}

export function MonitoringLevelCell({
  value,
  onChange,
  loading,
}: MonitoringLevelCellProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={value === "high" ? "default" : "outline"}
        size="sm"
        disabled={loading}
        onClick={() => onChange("high")}
      >
        High
      </Button>
      <Button
        variant={value === "low" ? "default" : "outline"}
        size="sm"
        disabled={loading}
        onClick={() => onChange("low")}
      >
        Low
      </Button>
    </div>
  );
}
