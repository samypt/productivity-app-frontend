import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
  method?: Method;
  body?: unknown;
  headers?: Record<string, string>;
  skip?: boolean; // if true, skip auto-fetch
}

export function useFetchWithAuth<T>(url?: string, options: FetchOptions = {}) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (newUrl?: string, overrideOptions?: FetchOptions) => {
    const finalOptions = {
      ...options,
      ...overrideOptions,
    };
    setLoading(true);
    try {
      const response = await fetch(
        "https://127.0.0.1:8000/api/" + (url ? url : newUrl),
        {
          method: finalOptions.method || "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...finalOptions.headers,
          },
          body: finalOptions.body
            ? JSON.stringify(finalOptions.body)
            : undefined,
        }
      );
      const result = await response.json();
      if (response.status === 401 || response.status === 403) {
        navigate("/login");
        toast.error(result.detail || "Unexpected error");
        return;
      }

      if (response.status === 404) {
        setData(null);
        setError(null);
        toast.error(result.detail || "Unexpected error");
        return;
      }

      if (response.ok) {
        setData(result);
        setError(null);
      } else {
        toast.error(result.detail || "Unexpected error");
        setError(`Unexpected error: ${response.statusText}`);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!options.skip) {
      fetchData();
    }
  }, [url, token]);

  return { data, error, loading, refetch: fetchData };
}
