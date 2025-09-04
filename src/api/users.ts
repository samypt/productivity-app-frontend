import { useFetch } from "../hooks";
import { useUploadImage } from "../hooks/useUploadImage";
import { components } from "../types/api";
import { PATHS } from "./path";

type User = components["schemas"]["UserPublic"];

export function useUploadAvatar() {
  const uploadAvatar = useUploadImage<{ avatar_url: string }>({
    url: PATHS.users.uploadAvatar,
    method: "POST",
    queryKey: "userProfile",
  });
  return { ...uploadAvatar };
}

export function useLoadUserData() {
  const { data, error, refetch, isLoading } = useFetch<User>({
    url: PATHS.users.me,
    queryKey: ["userProfile"],
  });
  return { data, error, refetch, isLoading };
}
