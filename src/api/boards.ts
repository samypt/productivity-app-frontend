import { useFetchWithPagination, useMutationFetch } from "../hooks";
import { components } from "../types/api";
import { PATHS } from "./path";

type Boards = components["schemas"]["AllBoardsLists"];
type BoardCreate = components["schemas"]["BoardCreate"];
type BoardRead = components["schemas"]["BoardRead"];
type BoardUpdate = components["schemas"]["BoardUpdate"];

const LIMIT: number = 4;
const OFFSET: number = 0;

export function useFetchBoards(projectId: string) {
  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useFetchWithPagination<Boards>(
    {
      url: PATHS.projects.projectBoards(projectId),
      method: "GET",
      queryKey: [`boards`, projectId],
    },
    { limit: LIMIT, offset: OFFSET }
  );
  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  };
}

export function useEditBoard(boardId: string, projectId: string) {
  const mutation = useMutationFetch<BoardRead, BoardUpdate>({
    url: PATHS.boards.update(boardId),
    method: "PUT",
    queryKey: [`boards`, projectId],
  });

  const editBoard = (board: BoardUpdate) => {
    return mutation.mutateAsync(board);
  };

  return { editBoard, ...mutation };
}

export function useDeleteBoard(boardId: string, projectId: string) {
  const mutation = useMutationFetch({
    url: PATHS.boards.delete(boardId),
    method: "DELETE",
    queryKey: [`boards`, projectId],
  });

  const deleteBoard = () => {
    return mutation.mutateAsync();
  };

  return { deleteBoard, ...mutation };
}

export function useCreateBoard(projectId: string) {
  const mutation = useMutationFetch<BoardRead, BoardCreate>({
    url: PATHS.boards.create,
    method: "POST",
    queryKey: [`boards`, projectId],
  });

  const createBoard = (board: BoardCreate) => {
    return mutation.mutateAsync(board);
  };

  return { createBoard, ...mutation };
}
