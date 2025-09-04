import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { components } from "../../types/api";
import { ChevronDown, ChevronUp } from "lucide-react";
import { EditableTitle } from "../common";
import AddTaskForm from "../tasks/AddTaskForm";
import ListTable from "./ListTable";
import { TicketPlus, TicketX, Delete } from "lucide-react";
import { useCreateTask } from "../../api/tasks";
import { useDeleteList, useUpdateList } from "../../api/lists";
import "./List.style.css";

type TaskCreate = components["schemas"]["TaskCreate"];
type ListRead = components["schemas"]["BoardListRead"];

interface TaskTableProps {
  list: ListRead;
}

const List: React.FC<TaskTableProps> = ({ list }) => {
  /* --------------------------------------------------------------------------
   * API HOOKS
   * -------------------------------------------------------------------------- */
  // Create Task: handles API call and optimistic UI update
  const { createTask: handleCreateTask } = useCreateTask(list.id);

  // Update List
  const { updateList: handleEdit } = useUpdateList(
    list.id,
    useParams().projectID!
  );

  // Delete List
  const { deleteList: handleDeleteList } = useDeleteList(
    list.id,
    useParams().projectID!
  );

  /* --------------------------------------------------------------------------
   * LOCAL STATE
   * -------------------------------------------------------------------------- */
  const [isAddTaskOpen, setAddTaskOpen] = useState<boolean>(false); // Add Task modal
  const [isOpen, setIsOpen] = useState<boolean>(true); // Toggle list collapse
  const [newTask, setNewTask] = useState<Omit<TaskCreate, "list_id">>({
    title: "",
    description: "",
    priority: 1,
    due_date: "",
    status: "todo",
  });

  /* --------------------------------------------------------------------------
   * HANDLERS
   * -------------------------------------------------------------------------- */
  // Toggle list open/close
  const handleToggle = () => {
    setIsOpen(!isOpen);
    setAddTaskOpen(false);
  };

  // Update new task form state
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // Submit new task
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullTask: TaskCreate = { ...newTask, list_id: list.id };
    handleCreateTask(fullTask);

    // Reset form
    setAddTaskOpen(false);
    setNewTask({
      title: "",
      description: "",
      priority: 1,
      due_date: "",
      status: "todo",
    });
  };

  return (
    <div className="task-list-container">
      <div className="list-header">
        <div className="list-title">
          <EditableTitle
            initialTitle={list.name}
            onSave={async (newTitle) => {
              await handleEdit({
                ...list,
                name: newTitle,
              });
            }}
          />
        </div>

        <div className="list-actions">
          {/* Show Add Task button only if list is open */}
          {isOpen && (
            <button
              className="add-task-button"
              onClick={() => setAddTaskOpen((prev) => !prev)}
              aria-expanded={isAddTaskOpen}
              aria-controls="add-task-form"
            >
              {isAddTaskOpen ? (
                <>
                  Close <TicketX className="add-task-icon" />
                </>
              ) : (
                <>
                  Add Task <TicketPlus className="add-task-icon" />
                </>
              )}
            </button>
          )}
          <button
            onClick={handleToggle}
            className="icon-btn"
            aria-label="Toggle List"
          >
            {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>

          <button
            onClick={handleDeleteList}
            className="icon-btn delete"
            aria-label="Delete List"
          >
            <Delete size={20} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="list-content">
          {isAddTaskOpen && (
            <AddTaskForm
              task={newTask}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
            />
          )}
          <ListTable list={list} />
        </div>
      )}
    </div>
  );
};

export default List;
