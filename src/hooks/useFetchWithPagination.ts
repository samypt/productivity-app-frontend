import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { authFetch } from "./authFetch";
import { useInfiniteQuery, QueryKey } from "@tanstack/react-query";

type Method = "GET" | "POST" | "PUT" | "DELETE";
export type SortKey = "title" | "due_date" | "priority" | "status" | null;
export type Sort = { key: SortKey; order: "asc" | "desc" | null };

interface FetchOptions {
  url?: string;
  method?: Method;
  body?: unknown;
  headers?: Record<string, string>;
  skip?: boolean;
  queryKey?: QueryKey;
}

export function useFetchWithPagination<T = unknown>(
  options: FetchOptions = {},
  {
    limit,
    offset = 0,
    sort_by = null,
    sort_order = null,
  }: {
    limit: number;
    offset?: number;
    sort_by?: SortKey;
    sort_order?: Sort["order"];
  }
) {
  const { token } = useAuth();
  const navigate = useNavigate();

  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: options.queryKey ?? [options.url ?? "unknown"],
    queryFn: ({ pageParam }) =>
      authFetch<T>(token, navigate, {
        ...options,
        url: `${options.url}?limit=${limit}&offset=${pageParam}${
          sort_by && sort_order
            ? `&sort_by=${sort_by}&sort_order=${sort_order}`
            : ""
        }`,
        method: options.method || "GET",
      }),
    initialPageParam: offset,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || typeof lastPage !== "object") return undefined;

      const itemsArray = Object.values(lastPage).find((v) =>
        Array.isArray(v)
      ) as T[] | undefined;

      return itemsArray && itemsArray.length === limit
        ? offset + pages.length * limit
        : undefined;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // Garbage collect after 5 minutes
    retryDelay: 1000, // Retry after 1 second
    retry: 1, // Retry once on failure
    placeholderData: (previousData) => previousData,
  });

  return {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
}
