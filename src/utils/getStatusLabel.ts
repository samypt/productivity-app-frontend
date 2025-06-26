import { components } from "../types/api";

type Status = components["schemas"]["TaskRead"]["status"];

import { Circle, Loader, CheckCircle, AlertCircle } from "lucide-react";

export const getStatusLabel = (status: Status) => {
  switch (status) {
    case "todo":
      return { Icon: Circle, color: "#9ca3af" };
    case "in_progress":
      return { Icon: Loader, color: "#facc15" };
    case "done":
      return { Icon: CheckCircle, color: "#34d399" };
    default:
      return { Icon: AlertCircle, color: "#f87171" };
  }
};
