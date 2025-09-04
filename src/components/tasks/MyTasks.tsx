import React from "react";
import TaskComponent from "./TaskComponent";
import { useFetchUserTasks } from "../../api/tasks";
import "./MyTasks.style.css";

const MyTasks: React.FC = () => {
  const { tasks } = useFetchUserTasks();
  const list = tasks?.map((task) => (
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
