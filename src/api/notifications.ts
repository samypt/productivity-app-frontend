import { components } from "../types/api";
import { useFetchWithPagination, useMutationFetch } from "../hooks";
import { PATHS } from "./path";

type NotificationRespond = components["schemas"]["NotificationRespond"];
type NotificationRead = components["schemas"]["NotificationRead"];
type NotificationList = components["schemas"]["NotificationList"];

export function useNotificationRespond(notification_id: string) {
  const mutation = useMutationFetch<NotificationRead, NotificationRespond>({
    method: "POST",
    url: PATHS.notifications.respond(notification_id),
    queryKey: ["notifications"],
  });
  const notificationRespond = (is_read: boolean) => {
    mutation.mutateAsync({ is_read });
  };
  return { notificationRespond, ...mutation };
}

const LIMIT: number = 10;
const OFFSET: number = 0;

export function useFetchNotifications() {
  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
  } = useFetchWithPagination<NotificationList>(
    {
      url: PATHS.notifications.root,
      method: "GET",
      queryKey: ["notifications"],
    },
    { limit: LIMIT, offset: OFFSET }
  );
  const notifications = data?.pages.flatMap((page) => page.notifications) ?? [];
  return {
    notifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    refetch,
  };
}
