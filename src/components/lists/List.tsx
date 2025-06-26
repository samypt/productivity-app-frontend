import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { components } from "../../types/api";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMutationFetch } from "../../hooks";
import { EditableTitle } from "../common";
import AddTaskForm from "../tasks/AddTaskForm";
import ListTable from "./ListTable";
import { TicketPlus, TicketX, Delete } from "lucide-react";
import "./List.style.css";

type TaskRead = components["schemas"]["TaskRead"];
type TaskCreate = components["schemas"]["TaskCreate"];
type ListRead = components["schemas"]["BoardListRead"];
type ListUpdate = components["schemas"]["BoardListUpdate"];

interface TaskTableProps {
  list: ListRead;
}

const List: React.FC<TaskTableProps> = ({ list }) => {
  // Create Task
  const addTask = useMutationFetch<TaskRead, TaskCreate>({
    url: `tasks/create`,
    method: "POST",
    queryKey: `tasklist${list.id}`,
  });
  const handleAddList = async (taskData: TaskCreate) => {
    addTask.mutate(taskData);
  };
  const { projectID } = useParams();
  const [isAddTaskOpen, setAddTaskOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [newTask, setNewTask] = useState<Omit<TaskCreate, "list_id">>({
    title: "",
    description: "",
    priority: 1,
    due_date: "",
    status: "todo",
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setAddTaskOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullTask: TaskCreate = { ...newTask, list_id: list.id };
    handleAddList(fullTask);
    setAddTaskOpen(false);
    setNewTask({
      title: "",
      description: "",
      priority: 1,
      due_date: "",
      status: "todo",
    });
  };

  // Update List
  const editTeam = useMutationFetch<ListRead, ListUpdate>({
    url: `lists/update/${list.id}`,
    method: "PUT",
    queryKey: `boards${projectID}`,
  });

  const handleEdit = async (name: string) => {
    const updatedBoard: ListUpdate = { name };
    editTeam.mutate(updatedBoard);
  };

  // Delete List

  const deleteList = useMutationFetch({
    url: `lists/delete/${list.id}`,
    method: "DELETE",
    queryKey: `boards${projectID}`,
  });
  const handleDeleteList = () => {
    deleteList.mutate();
  };

  return (
    <div className="task-list-container">
      <div className="list-header" onClick={handleToggle}>
        <EditableTitle initialTitle={list.name} onSave={handleEdit} />
        {list.position}
        {isOpen ? <ChevronDown /> : <ChevronUp />}
        <Delete
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteList();
          }}
        />
      </div>
      {isOpen && (
        <div className="list-content">
          <ListTable list={list} />

          <article>
            <button
              className="add-task-button"
              onClick={() => setAddTaskOpen((prev) => !prev)}
            >
              {isAddTaskOpen ? (
                <>
                  Close
                  <TicketX className="add-task-icon" />
                </>
              ) : (
                <>
                  Add Task
                  <TicketPlus className="add-task-icon" />
                </>
              )}
            </button>
          </article>
          {isAddTaskOpen && (
            <AddTaskForm
              task={newTask}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default List;
