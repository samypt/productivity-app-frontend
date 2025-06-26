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
  size = "16px",
  strokeWidth = "2",
}: GetStatusProps) => {
  const iconStyle = { width: size, height: size, strokeWidth };
  const baseClass = "status-icon";

  if (status === "todo") {
    return (
      <div className="tooltip-wrapper">
        <CircleDashed className={`${baseClass} todo`} style={iconStyle} />
        <span className="tooltip-text">To Do</span>
      </div>
    );
  } else if (status === "in_progress") {
    return (
      <div className="tooltip-wrapper">
        <CircleDotDashed
          className={`${baseClass} in_progress`}
          style={iconStyle}
        />
        <span className="tooltip-text">In Progress</span>
      </div>
    );
  } else if (status === "done") {
    return (
      <div className="tooltip-wrapper">
        <CircleCheck className={`${baseClass} done`} style={iconStyle} />
        <span className="tooltip-text">Done</span>
      </div>
    );
  } else {
    return null;
  }
};
