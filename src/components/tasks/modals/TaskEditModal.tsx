import React, { useState } from "react";
import { components } from "../../../types/api";
import { Modal } from "../../modal/Modal";
import { TaskAssignModal } from "../../modal/TaskAssignModal";
import { UserList } from "../../users";
import { Users } from "lucide-react";
import "./TaskEditModal.style.css";

type TaskRead = components["schemas"]["TaskRead"];
type TaskFull = components["schemas"]["TaskFull"];
type TaskStatus = components["schemas"]["Status"];

interface Props {
  task: TaskFull;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: TaskRead) => void;
}

export const TaskEditModal: React.FC<Props> = ({
  task,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState<TaskStatus>(task.status || "todo");
  const [priority, setPriority] = useState(task.priority || 0);
  const [dueDate, setDueDate] = useState(task.due_date || "");
  const [isInviteOpen, setIsInviteOpen] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...task,
      title,
      description,
      status,
      priority,
      due_date: dueDate,
    });
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} enabled={!isInviteOpen}>
        <form className="task-edit-form" onSubmit={handleSubmit}>
          <h2>Edit Task</h2>

          <div className="form-group">
            <label>Title</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-inline">
            <div className="form-group">
              <label>Status</label>
              <select
                className="select"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <input
                className="input"
                type="number"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                min={0}
                max={5}
              />
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                className="input"
                type="date"
                value={dueDate?.split("T")[0] ?? ""}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-save">
              Save Task
            </button>
          </div>
        </form>

        <div className="assign-section">
          <div className="assign-header">
            <h3>Assignees</h3>
            <button
              className="assign-btn"
              onClick={() => setIsInviteOpen(true)}
            >
              <Users size={20} />
              <span>Manage</span>
            </button>
          </div>
          <UserList members={task.members} avatarSize={32} />
        </div>
      </Modal>

      {isInviteOpen && (
        <TaskAssignModal
          task={task}
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
        />
      )}
    </>
  );
};
