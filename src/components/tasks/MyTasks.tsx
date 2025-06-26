import React from "react";
import { components } from "../../types/api";
import { useFetchWithAuth } from "../../hooks";
import TaskComponent from "./TaskComponent";
import "./MyTasks.style.css";

type TasksData = {
  [fieldName: string]: components["schemas"]["TaskRead"][];
};

const MyTasks: React.FC = () => {
  const { data } = useFetchWithAuth<TasksData>("users/me/tasks");

  const list = data?.tasks?.map((task) => (
    <TaskComponent key={task.id} task={task} />
  ));

  return (
    <div className="my-tasks-container">
      <h2 className="my-tasks-title">My Tasks</h2>
      <ul className="tasks-list">
        {list?.length ? list : <p className="no-tasks">No tasks assigned</p>}
      </ul>
    </div>
  );
};

export default MyTasks;
