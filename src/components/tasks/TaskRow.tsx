import React from "react";
import { getStatus } from "../common/StatusComponent";
import { formatDate } from "../../utils";
import { priorityFlag } from "../common/PriorityComponent";
import { Eraser, SquarePen, GripVertical } from "lucide-react";
import { UserList } from "../users";
import { components } from "../../types/api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskFull = components["schemas"]["TaskFull"];

interface TaskRowProps {
  task: TaskFull;
  isLast?: boolean;
  setSelectedTask?: (task: TaskFull) => void;
  setIsEditModalOpen?: (isOpen: boolean) => void;
  handleDelete?: (taskId: string) => void;
  ref?: (node?: Element | null | undefined) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  isLast,
  ref,
  setSelectedTask,
  setIsEditModalOpen,
  handleDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.2 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="draggable-task-row"
    >
      <div
        className={`task-row` + (isLast ? " last-row" : "")}
        key={task.id}
        ref={isLast ? ref : undefined}
      >
        <div className="task-title" data-label="Title">
          <div className="task-title" data-label="Title">
            <span className="drag-handle" {...listeners}>
              <GripVertical size={16} />
            </span>
            <span className="task-title-text">{task.title}</span>
          </div>
        </div>

        <div className="task-assignees" data-label="Assignees">
          {task.members.length > 0 ? (
            <UserList members={task.members} avatarLength={5} avatarSize={28} />
          ) : (
            <span className="no-assignees">No Assignees</span>
          )}
        </div>

        <div className="task-priority" data-label="Priority">
          {priorityFlag({ priority: task.priority })}
        </div>

        <div className="task-status" data-label="Status">
          {getStatus({ status: task.status })}
        </div>

        <div className="task-due" data-label="Due Date">
          {formatDate(task.due_date)}
        </div>

        <div className="task-actions" data-label="Actions">
          <button
            type="button"
            aria-label="Edit Task"
            className="action-btn edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTask!(task);
              setIsEditModalOpen!(true);
            }}
          >
            <SquarePen size={18} />
          </button>
          <button
            type="button"
            aria-label="Delete Task"
            className="action-btn delete-btn"
            onClick={() => handleDelete?.(task.id)}
          >
            <Eraser size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskRow;
