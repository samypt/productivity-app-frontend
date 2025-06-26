import { toast } from "sonner";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
  url?: string;
  method?: Method;
  body?: unknown;
  headers?: Record<string, string>;
  skip?: boolean;
  queryKey?: string;
}

export async function authFetch<T>(
  token: string | null,
  navigate: (path: string) => void,
  options: FetchOptions
): Promise<T> {
  const response = await fetch(`https://127.0.0.1:8000/api/${options.url}`, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let result = null;
  if (response.status !== 204) {
    result = await response.json();
  }

  if ([401, 403].includes(response.status)) {
    navigate("/login");
    toast.error(result?.detail || "Unauthorized");
    throw new Error("Unauthorized");
  }

  if (response.status === 404) {
    toast.error(result?.detail || "Not found");
    throw new Error("Not found");
  }

  if (!response.ok) {
    toast.error(result?.detail || "Request failed");
    throw new Error(result?.detail || "Request failed");
  }

  return result ?? ({} as T);
}
