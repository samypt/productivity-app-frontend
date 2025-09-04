import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { authFetch } from "./authFetch";
import { useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
  url?: string;
  method?: Method;
  body?: unknown;
  headers?: Record<string, string>;
  skip?: boolean;
  queryKey?: QueryKey;
}

export function useMutationFetch<T = unknown, V = Record<string, unknown>>(
  options: FetchOptions = {}
) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<T, Error, (V & { url?: string }) | void>({
    mutationFn: (params?: (V & { url?: string }) | void) => {
      const { url, ...body } = params || {};

      return authFetch<T>(token, navigate, {
        ...options,
        url: url || options.url,
        body: Object.keys(body).length > 0 ? body : undefined, // Only pass body if it has content
        method: options.method || "POST",
      });
    },
    onSuccess: () => {
      if (options.queryKey) {
        queryClient.invalidateQueries({
          queryKey: options.queryKey ?? [options.url ?? "unknown"],
        });
      }
    },
    onError: (err) => {
      console.error("Mutation error:", err);
    },
  });
}
