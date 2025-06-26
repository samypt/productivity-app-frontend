import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { authFetch } from "./authFetch";
import { useInfiniteQuery } from "@tanstack/react-query";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
  url?: string;
  method?: Method;
  body?: unknown;
  headers?: Record<string, string>;
  skip?: boolean;
  queryKey?: string;
}

export function useFetchWithPagination<T = unknown>(
  options: FetchOptions = {},
  { limit, offset = 0 }: { limit: number; offset?: number }
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
  } = useInfiniteQuery({
    queryKey: [options.queryKey],
    queryFn: ({ pageParam }) =>
      authFetch<T>(token, navigate, {
        ...options,
        url: `${options.url}?limit=${limit}&offset=${pageParam}`,
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
  });

  return {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
