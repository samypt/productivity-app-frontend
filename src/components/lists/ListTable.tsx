import React, { useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { components } from "../../types/api";
import { ChevronUp, ChevronDown } from "lucide-react";
import { TaskEditModal } from "../tasks/modals/TaskEditModal";
import { useDroppable } from "@dnd-kit/core";
import TaskRow from "../tasks/TaskRow";
import { useBoardStore, Sort } from "../../store/boards";
import { useDeleteTask, useEditTask, useFetchTasks } from "../../api/tasks";
import "./ListTable.style.css";

type ListRead = components["schemas"]["BoardListRead"];
type TaskFull = components["schemas"]["TaskFull"];
interface TaskTableProps {
  list: ListRead;
}

const ListTable: React.FC<TaskTableProps> = ({ list }) => {
  // --------------------------
  // Sorting state & logic
  // --------------------------
  // Tracks current sorting field and order for tasks
  const [sortBy, setSortBy] = useState<
    "title" | "due_date" | "priority" | "status" | null
  >(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const SORT = React.useMemo<Sort>(
    () => ({ key: sortBy, order: sortOrder }),
    [sortBy, sortOrder]
  );

  // Fetch tasks when sorting changes
  useFetchTasks(list.id, SORT);

  const renderSortIcon = (direction: "asc" | "desc" | null) =>
    direction === "asc" ? (
      <ChevronUp size={16} className="sort-icon" />
    ) : (
      <ChevronDown size={16} className="sort-icon" />
    );

  const handleSortClick = (
    field: "title" | "due_date" | "priority" | "status"
  ) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // --------------------------
  // Task selection & modals
  // --------------------------
  const [selectedTask, setSelectedTask] = useState<TaskFull | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // --------------------------
  // Drag & drop setup
  // --------------------------
  const { setNodeRef } = useDroppable({ id: list.id });

  // --------------------------
  // API: Edit & Delete Task
  // --------------------------
  const { editTask: handleEdit } = useEditTask(list.id);
  const { deleteTask: handleDelete } = useDeleteTask(list.id);

  // --------------------------
  // Infinite scroll setup
  // --------------------------
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: false });

  const listData = useBoardStore((s) => s.lists[list.id]);
  const tasks = useMemo(
    () => (listData?.flat ? listData.flat : []),
    [listData?.flat]
  );
  const fetchNextPage = listData?.fetchNextPage
    ? () => listData.fetchNextPage()
    : () => {};
  const hasNextPage = listData?.hasNextPage ?? false;
  const isFetchingNextPage = listData?.isFetchingNextPage ?? false;

  // Keep selected task updated with latest tasks
  React.useEffect(() => {
    if (selectedTask && tasks.length > 0) {
      const updated = tasks.find((t) => t.id === selectedTask.id);
      if (updated) setSelectedTask(updated);
    }
  }, [tasks, selectedTask]);

  // --------------------------
  // Infinite scroll effect
  // --------------------------
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // --------------------------
  // Scroll to top when sort changes
  // --------------------------
  const bodyRef = useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = 0;
    }
  }, [SORT]);

  return (
    <div ref={setNodeRef} className="draggable-list-table">
      <div className="task-list">
        <div className="task-list-header">
          <span
            className={`header-title sortable ${
              sortBy === "title" ? "active" : ""
            }`}
            onClick={() => handleSortClick("title")}
          >
            Title {sortBy === "title" && renderSortIcon(sortOrder)}
          </span>

          <span className="header-assignees">Assignees</span>

          <span
            className={`header-priority sortable ${
              sortBy === "priority" ? "active" : ""
            }`}
            onClick={() => handleSortClick("priority")}
          >
            Priority {sortBy === "priority" && renderSortIcon(sortOrder)}
          </span>

          <span
            className={`header-status sortable ${
              sortBy === "status" ? "active" : ""
            }`}
            onClick={() => handleSortClick("status")}
          >
            Status {sortBy === "status" && renderSortIcon(sortOrder)}
          </span>

          <span
            className={`header-due sortable ${
              sortBy === "due_date" ? "active" : ""
            }`}
            onClick={() => handleSortClick("due_date")}
          >
            Due Date {sortBy === "due_date" && renderSortIcon(sortOrder)}
          </span>

          <span className="header-actions" />
        </div>

        <div className="task-list-body" ref={bodyRef}>
          {tasks.map((task, index) => {
            const isLast = index === tasks.length - 1;
            return (
              <TaskRow
                key={task.id}
                task={task}
                isLast={isLast}
                ref={isLast ? ref : undefined}
                setSelectedTask={setSelectedTask}
                setIsEditModalOpen={setIsEditModalOpen}
                handleDelete={handleDelete}
              />
            );
          })}
          {isFetchingNextPage && (
            <p className="loading-text">Loading more tasks...</p>
          )}
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
    </div>
  );
};

export default ListTable;
