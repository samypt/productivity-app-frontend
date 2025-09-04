import { toast } from "sonner";
// import { QueryKey } from "@tanstack/react-query";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
  url?: string;
  method?: Method;
  body?: unknown;
  headers?: Record<string, string>;
  skip?: boolean;
  // queryKey?: QueryKey;
}

export async function authFetch<T>(
  token: string | null,
  navigate: (path: string) => void,
  options: FetchOptions
): Promise<T> {
  if (options.skip) {
    console.log("Skipping fetch due to skip option");
    return {} as T;
  }

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  // Only add JSON content-type if it's not FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`https://127.0.0.1:8000/api/${options.url}`, {
    method: options.method || "GET",
    headers,
    body: isFormData
      ? (options.body as FormData)
      : options.body
      ? JSON.stringify(options.body)
      : undefined,
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
