import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { authFetch } from "./authFetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UploadOptions {
  url: string;
  method?: "POST" | "PUT";
  queryKey?: string;
}

export function useUploadImage<T = unknown>({
  url,
  method = "POST",
  queryKey,
}: UploadOptions) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<T, Error, FormData>({
    mutationFn: (formData: FormData) => {
      return authFetch<T>(token, navigate, {
        url,
        method,
        body: formData,
        // DO NOT set Content-Type here; browser sets correct multipart boundaries
      });
    },
    onSuccess: () => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
    },
    onError: (err) => {
      console.error("Image upload error:", err);
    },
  });
}
