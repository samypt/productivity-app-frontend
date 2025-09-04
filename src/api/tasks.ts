import React from "react";
import { useBoardStore, Sort } from "../store/boards";
import { useFetch, useFetchWithPagination, useMutationFetch } from "../hooks";
import { components } from "../types/api";
import { PATHS } from "./path";

type TaskRead = components["schemas"]["TaskRead"];
type TaskUpdate = components["schemas"]["TaskUpdate"];
type TaskCreate = components["schemas"]["TaskCreate"];
type TaskLink = components["schemas"]["TaskMemberLink"];
type TaskFull = components["schemas"]["TaskFull"];
type TasksList = {
  [fieldName: string]: TaskRead[];
};

const LIMIT = 10;
const OFFSET = 0;

export function useFetchTasks(listId: string, sort: Sort) {
  const mergeTasks = useBoardStore((s) => s.mergeTasks);
  const setTasks = useBoardStore((s) => s.setTasks);
  const resetList = useBoardStore((s) => s.resetList);
  const setListMeta = useBoardStore((s) => s.setListMeta);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useFetchWithPagination<{ tasks: TaskFull[] }>(
    {
      url: PATHS.tasks.list(listId),
      method: "GET",
      queryKey: [`tasks`, listId, sort],
    },
    { limit: LIMIT, offset: OFFSET, sort_by: sort.key, sort_order: sort.order }
  );

  // Flatten all pages and store tasks
  React.useEffect(() => {
    if (data?.pages?.length) {
      const allTasks: TaskFull[] = data.pages.flatMap((p) => p.tasks);
      if (sort.key || sort.order) {
        // replace tasks if sorting is applied
        setTasks(listId, allTasks);
      } else {
        // otherwise merge
        mergeTasks(listId, allTasks);
      }
    }
  }, [data?.pages, listId, mergeTasks, setTasks, sort.key, sort.order]);

  // Store metadata
  React.useEffect(() => {
    setListMeta(listId, {
      hasNextPage,
      isFetchingNextPage,
      status,
      error,
      fetchNextPage,
    });
  }, [
    listId,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    fetchNextPage,
    setListMeta,
  ]);

  const refetchFromStart = async () => {
    resetList(listId, sort);
    await fetchNextPage();
  };

  return {
    fetchNextPage,
    refetchFromStart,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  };
}

export function useFetchUserTasks() {
  const { data, error, refetch, isLoading } = useFetch<TasksList>({
    url: PATHS.tasks.me,
    method: "GET",
    queryKey: [`my-tasks`],
  });
  const tasks = data?.tasks;
  return { tasks, error, refetch, isLoading };
}

export function useEditTask(listId: string) {
  const mutation = useMutationFetch<TaskRead, TaskUpdate>({
    method: "PUT",
    // queryKey: [`tasks`, listId], // comented out for optimistic update
  });
  const updateTaskInStore = useBoardStore((s) => s.updateTask);

  const editTask = (task: TaskRead) => {
    mutation.mutate({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      list_id: task.list_id,
      url: PATHS.tasks.update(task.id),
    });
    updateTaskInStore(listId, task);
  };

  return { editTask, ...mutation };
}

export function useDeleteTask(listId: string) {
  const mutation = useMutationFetch({
    method: "DELETE",
    // queryKey: [`tasks`, listId], // comented out for optimistic update
  });
  const deleteTaskFromStore = useBoardStore((s) => s.deleteTask);

  const deleteTask = (taskId: string) => {
    mutation.mutate({ url: PATHS.tasks.delete(taskId) });
    deleteTaskFromStore(listId, taskId);
  };

  return { deleteTask, ...mutation };
}

export function useCreateTask(listId: string) {
  const mutation = useMutationFetch<TaskRead, TaskCreate>({
    url: `tasks/create`,
    method: "POST",
    queryKey: [`tasks`, listId],
  });

  const createTask = async (taskData: TaskCreate) => {
    mutation.mutate(taskData);
  };

  return { createTask, ...mutation };
}

export function useMoveTask() {
  const mutation = useMutationFetch({
    method: "POST",
  });

  const moveTask = (taskId: string, targetListId: string) => {
    mutation.mutate({
      url: `tasks/move/${taskId}`, // dynamic URL here
      list_id: targetListId,
    });
  };

  return { moveTask, ...mutation };
}

export function useAssignTaskMember(task: TaskFull) {
  const mutation = useMutationFetch<TaskLink>({
    method: "POST",
    url: `tasks/assign/${task.id}`,
    queryKey: [`tasks`, task.list_id],
  });
  const assignMember = (member_id: string) => {
    mutation.mutate({ member_id });
  };
  return { assignMember, ...mutation };
}

export function useUnassignTaskMember(task: TaskFull) {
  const mutation = useMutationFetch<TaskLink>({
    method: "POST",
    url: `tasks/unassign/${task.id}`,
    queryKey: [`tasks`, task.list_id],
  });
  const unassignMember = (member_id: string) => {
    mutation.mutate({ member_id });
  };
  return { unassignMember, ...mutation };
}
