import React from "react";
import { components } from "../../types/api";
import "./AddTaskForm.style.css";

type Task = components["schemas"]["TaskCreate"];
type Props = {
  task: Omit<Task, "list_id">;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
};

const AddTaskForm: React.FC<Props> = ({ task, handleSubmit, handleChange }) => {
  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        name="title"
        value={task.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <textarea
        name="description"
        value={task.description ?? ""}
        onChange={handleChange}
        placeholder="Description"
      />
      <select name="priority" value={task.priority} onChange={handleChange}>
        <option value={1}>Urgent</option>
        <option value={2}>High</option>
        <option value={3}>Normal</option>
        <option value={4}>Low</option>
        <option value={5}>No Priority</option>
      </select>
      <select name="status" value={task.status ?? ""} onChange={handleChange}>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <input
        type="date"
        name="due_date"
        value={task.due_date}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTaskForm;
