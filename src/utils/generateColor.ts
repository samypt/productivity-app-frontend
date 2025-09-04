export const getColor = (name: string = ""): string => {
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#22d3ee",
    "#f97316",
    "#14b8a6",
    "#6366f1",
    "#84cc16",
    "#eab308",
    "#06b6d4",
    "#d946ef",
    "#4ade80",
    "#0ea5e9",
    "#f43f5e",
    "#a855f7",
    "#7dd3fc",
    "#fcd34d",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
