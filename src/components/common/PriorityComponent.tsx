import { Flag } from "lucide-react";

const PRIORITY_LABELS = [
  "Urgent",
  "High",
  "Normal",
  "Low",
  "No Priority",
] as const;
type PriorityLabel = (typeof PRIORITY_LABELS)[number];

const priorityColors: Record<PriorityLabel, string> = {
  Urgent: "#ef4444", // Red-500
  High: "#f59e0b", // Amber-500
  Normal: "#6b7280", // Gray-500
  Low: "#3b82f6", // Blue-500
  "No Priority": "#9ca3af", // Gray-400
};

interface PriorityFlagProps {
  priority: number;
  size?: string;
  strokeWidth?: string;
}

export function priorityFlag({
  priority,
  size = "20px",
  strokeWidth = "2",
}: PriorityFlagProps) {
  const label = PRIORITY_LABELS[priority - 1] || "No Priority";
  const color = priorityColors[label];

  return (
    <div className="priority-wrapper" title={label}>
      <Flag
        style={{
          width: size,
          height: size,
          strokeWidth,
          color,
        }}
        className="priority-icon"
      />
      {/* <span className="priority-label">{label}</span> */}
    </div>
  );
}
