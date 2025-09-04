import { useFetchWithPagination } from "../hooks";
import { components } from "../types/api";
import { PATHS } from "./path";

type UserList = components["schemas"]["UserList"];

const LIMIT = 10;
const OFFSET = 0;

export function useFetchMembers(teamId: string, skip?: boolean) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    status,
  } = useFetchWithPagination<UserList>(
    {
      url: PATHS.teams.members(teamId),
      method: "GET",
      queryKey: [`members`, teamId],
      skip: skip ?? false,
    },
    { limit: LIMIT, offset: OFFSET }
  );

  const members = data?.pages.flatMap((page) => page.users) ?? [];

  return {
    members,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    status,
  };
}
