import { CircleCheck, CircleDashed, CircleDotDashed } from "lucide-react";

import "./StatusComponent.style.css";

type Status = "todo" | "in_progress" | "done" | null;

interface GetStatusProps {
  status: Status;
  size?: string;
  strokeWidth?: string;
}

export const getStatus = ({
  status,
  size = "20px",
  strokeWidth = "2",
}: GetStatusProps) => {
  const iconStyle = {
    width: size,
    height: size,
    strokeWidth,
  };

  const commonProps = {
    style: iconStyle,
    className: "status-icon",
  };

  const statusMap = {
    todo: {
      icon: (
        <CircleDashed
          {...commonProps}
          style={{ ...iconStyle, color: "#6b7280" }}
        />
      ),
      label: "To Do",
    },
    in_progress: {
      icon: (
        <CircleDotDashed
          {...commonProps}
          style={{ ...iconStyle, color: "#f59e0b" }}
        />
      ),
      label: "In Progress",
    },
    done: {
      icon: (
        <CircleCheck
          {...commonProps}
          style={{ ...iconStyle, color: "#22c55e" }}
        />
      ),
      label: "Done",
    },
  };

  const current = status ? statusMap[status] : null;

  if (!current) return null;

  return (
    <div className="status-wrapper">
      {current.icon}
      <span className="status-label">{current.label}</span>
    </div>
  );
};
