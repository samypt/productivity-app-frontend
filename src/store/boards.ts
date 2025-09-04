import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { components } from "../types/api";

export type SortKey = "title" | "due_date" | "priority" | "status" | null;
export type Sort = { key: SortKey; order: "asc" | "desc" | null };
type TaskFull = components["schemas"]["TaskFull"];
type TaskUpdate = components["schemas"]["TaskUpdate"];

export type ListState = {
  sort: Sort;
  flat: TaskFull[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  status: "error" | "success" | "pending" | "idle";
  error: Error | null;
  fetchNextPage: () => void;
  refetchFromStart: () => void;
};

export type BoardState = {
  lists: Record<string, ListState>;
  initList: (listId: string, sort: Sort) => void;
  resetList: (listId: string, sort: Sort) => void;
  setTasks: (listId: string, tasks: TaskFull[]) => void;
  mergeTasks: (listId: string, tasks: TaskFull[]) => void;
  updateTask: (listId: string, task: TaskUpdate) => void;
  deleteTask: (listId: string, taskId: string) => void;
  setListMeta: (
    listId: string,
    meta: Partial<Omit<ListState, "flat" | "sort">>
  ) => void;
};

export const useBoardStore = create<BoardState>()(
  devtools((set, get) => ({
    lists: {},

    initList: (listId, sort) =>
      set((state) => ({
        lists: {
          ...state.lists,
          [listId]: {
            sort,
            flat: [],
            hasNextPage: false,
            isFetchingNextPage: false,
            status: "idle",
            error: null,
            fetchNextPage: () => {},
            refetchFromStart: () => {},
          },
        },
      })),

    resetList: (listId, sort) =>
      set((state) => ({
        lists: {
          ...state.lists,
          [listId]: {
            sort,
            flat: [],
            hasNextPage: false,
            isFetchingNextPage: false,
            status: "idle",
            error: null,
            fetchNextPage: () => {},
            refetchFromStart: () => {},
          },
        },
      })),

    setTasks: (listId, tasks) =>
      set((state) => {
        const L = state.lists[listId];
        if (!L) return state;
        return {
          lists: {
            ...state.lists,
            [listId]: {
              ...L,
              flat: tasks,
            },
          },
        };
      }),

    mergeTasks: (listId: string, newTasks: TaskFull[]) =>
      set((state) => {
        const L = state.lists[listId];
        if (!L) return state;

        // Create a map of existing tasks
        const existing = new Map(L.flat.map((t) => [t.id, t]));

        // Insert/update new tasks into the map
        newTasks.forEach((t) => {
          existing.set(t.id, { ...existing.get(t.id), ...t });
        });

        return {
          lists: {
            ...state.lists,
            [listId]: {
              ...L,
              flat: Array.from(existing.values()),
            },
          },
        };
      }),

    updateTask: (listId, task) =>
      set((state) => {
        const L = state.lists[listId];
        if (!L) return state;
        return {
          lists: {
            ...state.lists,
            [listId]: {
              ...L,
              flat: L.flat.map((t) => (t.id === task.id ? task : t)),
            },
          },
        };
      }),

    deleteTask: (listId, taskId) =>
      set((state) => {
        const L = state.lists[listId];
        if (!L) return state;
        return {
          lists: {
            ...state.lists,
            [listId]: {
              ...L,
              flat: L.flat.filter((t) => t.id !== taskId),
            },
          },
        };
      }),

    setListMeta: (listId, meta) =>
      set((state) => {
        const L = state.lists[listId];
        if (!L) return state;
        return {
          lists: {
            ...state.lists,
            [listId]: {
              ...L,
              ...meta,
            },
          },
        };
      }),

    moveTask: (oldListId: string, newListId: string, task: TaskFull) =>
      set((state) => {
        const oldList = state.lists[oldListId];
        const newList = state.lists[newListId];
        if (!oldList || !newList) return state;

        return {
          lists: {
            ...state.lists,
            [oldListId]: {
              ...oldList,
              flat: oldList.flat.filter((t) => t.id !== task.id),
            },
            [newListId]: {
              ...newList,
              flat: [...newList.flat, task],
            },
          },
        };
      }),
  }))
);
