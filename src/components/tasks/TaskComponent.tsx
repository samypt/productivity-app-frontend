import React from "react";
import { components } from "../../types/api";
import { formatDate } from "../../utils";
import { getStatusLabel } from "../../utils/getStatusLabel";
import {
  CircleDot,
  Clock,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
} from "lucide-react";
import "./TaskComponent.style.css";

type Task = components["schemas"]["TaskRead"];

type Props = {
  task: Task;
};

const getPriorityLabel = (priority?: number | null) => {
  switch (priority) {
    case 5:
      return { label: "Urgent", color: "#dc2626" }; // Red-600
    case 4:
      return { label: "High", color: "#ef4444" }; // Red-500
    case 3:
      return { label: "Normal", color: "#fbbf24" }; // Amber-400
    case 2:
      return { label: "Low", color: "#22c55e" }; // Green-500
    default:
      return { label: "No priority", color: "#6b7280" }; // Gray-500
  }
};

const TaskComponent: React.FC<Props> = ({ task }) => {
  const status = getStatusLabel(task.status);
  const priority = getPriorityLabel(task.priority);
  const formattedDate = formatDate(task.due_date);

  const StatusIcon = (() => {
    switch (task.status) {
      case "todo":
        return CircleDot;
      case "in_progress":
        return Clock;
      case "done":
        return CheckCircle2;
      default:
        return AlertCircle;
    }
  })();
  return (
    <div className="task-container">
      <div className="task-main">
        <div className="task-header">
          <StatusIcon className={`status-icon ${status}`} size={20} />
          <h3 className="task-title">{task.title}</h3>
        </div>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>

      <div className="task-meta">
        {task.due_date && (
          <div className="task-due">
            <CalendarDays size={16} />
            <span>{formattedDate}</span>
          </div>
        )}
        <div
          className="task-priority"
          style={{ backgroundColor: priority.color }}
        >
          {priority.label}
        </div>
      </div>
    </div>
  );
};

export default TaskComponent;
