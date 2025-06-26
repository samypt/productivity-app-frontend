import React, { useState } from "react";
import { useInView } from "react-intersection-observer";
import { useMutationFetch, useFetchWithPagination } from "../../hooks";
import { components } from "../../types/api";
import { getStatus } from "../common/StatusComponent";
import { formatDate } from "../../utils";
import { priorityFlag } from "../common/PriorityComponent";
import { Eraser, SquarePen } from "lucide-react";
import { TaskEditModal } from "../tasks/modals/TaskEditModal";
import { UserList } from "../users";
import "./ListTable.style.css";

type TaskList = components["schemas"]["TaskListFull"];
type ListRead = components["schemas"]["BoardListRead"];
type TaskRead = components["schemas"]["TaskRead"];
type TaskFull = components["schemas"]["TaskFull"];
type TaskUpdate = components["schemas"]["TaskUpdate"];

interface TaskTableProps {
  list: ListRead;
}

const ListTable: React.FC<TaskTableProps> = ({ list }) => {
  const [selectedTask, setSelectedTask] = useState<TaskFull | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit Task
  const editTask = useMutationFetch<TaskRead, TaskUpdate>({
    method: "PUT",
    queryKey: `tasklist${list.id}`,
  });

  const handleEdit = async (updatedTaskData: TaskRead) => {
    console.log("list rendered");
    editTask.mutate({
      title: updatedTaskData.title,
      description: updatedTaskData.description,
      status: updatedTaskData.status,
      priority: updatedTaskData.priority,
      due_date: updatedTaskData.due_date,
      list_id: updatedTaskData.list_id,
      url: `tasks/update/${updatedTaskData.id}`,
    });
  };

  // Delete List

  const deleteTask = useMutationFetch({
    method: "DELETE",
    queryKey: `tasklist${list.id}`,
  });

  // Get tasks
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });
  const LIMIT: number = 10;
  const OFFSET: number = 0;
  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useFetchWithPagination<TaskList>(
    {
      url: `tasks/list/${list.id}`,
      method: "GET",
      queryKey: `tasklist${list.id}`,
    },
    { limit: LIMIT, offset: OFFSET }
  );
  const allTasks = data?.pages.flatMap((page) => page.tasks) ?? [];
  const [tasks, setTasks] = useState<TaskFull[]>(allTasks);

  React.useEffect(() => {
    if (data) {
      const updatedTasks = data.pages.flatMap((page) => page.tasks);
      setTasks(updatedTasks);

      if (selectedTask) {
        const updated = updatedTasks.find((t) => t.id === selectedTask.id);
        if (updated) {
          setSelectedTask(updated);
        }
      }
    }
  }, [data]);

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className="task-list">
      <div className="task-header">
        <div>Title</div>
        <div>Assignees</div>
        <div>Priority</div>
        <div>Status</div>
        <div>Due Date</div>
        <div></div>
      </div>

      <div className="list-scroll-area">
        <div className="list-scroll-area-content">
          {tasks.map((task) => (
            <div className="task-row" key={task.id}>
              <div className="cell title">{task.title}</div>
              <div className="cell assignees">
                <UserList
                  members={task.members}
                  avatarLength={5}
                  avatarSize={28}
                />
              </div>
              <div className="cell center">
                {priorityFlag({ priority: task.priority, size: "28px" })}
              </div>
              <div className="cell center">
                {getStatus({ status: task.status, size: "28px" })}
              </div>
              <div className="cell center">{formatDate(task.due_date)}</div>
              <div className="cell center">
                <div className="icon-group">
                  <SquarePen
                    className="icon-button"
                    onClick={() => {
                      setSelectedTask(task);
                      setIsEditModalOpen(true);
                    }}
                  />
                  <Eraser
                    className="icon-button"
                    onClick={() =>
                      deleteTask.mutate({ url: `tasks/delete/${task.id}` })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <div ref={ref} />
          <div>{isFetchingNextPage && "Loading..."}</div>
        </div>
      </div>
      {selectedTask && (
        <TaskEditModal
          task={selectedTask}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
          onSave={(updatedTask) => {
            handleEdit(updatedTask);
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ListTable;
