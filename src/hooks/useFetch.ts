import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { authFetch } from "./authFetch";
import { useQuery } from "@tanstack/react-query";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
  url?: string;
  method?: Method;
  body?: unknown;
  headers?: Record<string, string>;
  skip?: boolean;
  queryKey?: string;
}

export function useFetch<T = unknown>(options: FetchOptions = {}) {
  const { token } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, refetch, error } = useQuery<T>({
    queryKey: [options.queryKey ?? options.url],
    enabled: !options.skip,
    queryFn: () =>
      authFetch<T>(token, navigate, {
        ...options,
        method: options.method || "GET",
      }),

    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // Garbage collect after 5 minutes
    retryDelay: 1000, // Retry after 1 second
    retry: 1, // Retry once on failure
    placeholderData: (previousData) => previousData,
  });

  return { data, isLoading, refetch, error };
}
