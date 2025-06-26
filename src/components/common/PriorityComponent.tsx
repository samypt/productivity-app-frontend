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
  Urgent: "#EF4444", // Red 500
  High: "#F59E0B", // Amber 500
  Normal: "#6B7280", // Gray 500
  Low: "#3B82F6", // Blue 500
  "No Priority": "#9CA3AF", // Gray 400
};

interface PriorityFlagProps {
  priority: number;
  size?: string;
  strokeWidth?: string;
}

export function priorityFlag({
  priority,
  size = "16px",
  strokeWidth = "2",
}: PriorityFlagProps) {
  const label = PRIORITY_LABELS[priority - 1] || "No Priority";
  const color = priorityColors[label];
  const iconStyle = { width: size, height: size, color, strokeWidth };
  const baseClass = "status-icon";

  return (
    <div className="tooltip-wrapper">
      <Flag className={`${baseClass}`} style={iconStyle} />
      <span className="tooltip-text">{label}</span>
    </div>
  );
}
