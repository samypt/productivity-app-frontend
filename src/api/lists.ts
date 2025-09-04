import { useMutationFetch } from "../hooks";
import { components } from "../types/api";
import { PATHS } from "./path";

type ListRead = components["schemas"]["BoardListRead"];
type ListCreate = components["schemas"]["BoardListCreate"];

export function useCreateList(projectId: string) {
  const mutation = useMutationFetch<ListRead, ListCreate>({
    url: PATHS.lists.create,
    method: "POST",
    queryKey: [`boards`, projectId],
  });

  const createList = (list: ListCreate) => {
    return mutation.mutateAsync(list);
  };

  return { createList, ...mutation };
}

export function useUpdateList(listId: string, projectID: string) {
  const mutation = useMutationFetch<ListRead, ListCreate>({
    url: PATHS.lists.update(listId),
    method: "PUT",
    queryKey: [`boards`, projectID],
  });

  const updateList = (list: ListCreate) => {
    return mutation.mutateAsync(list);
  };

  return { updateList, ...mutation };
}

export function useDeleteList(listId: string, projectID: string) {
  const mutation = useMutationFetch({
    url: PATHS.lists.delete(listId),
    method: "DELETE",
    queryKey: [`boards`, projectID],
  });

  const deleteList = () => {
    return mutation.mutateAsync();
  };

  return { deleteList, ...mutation };
}
