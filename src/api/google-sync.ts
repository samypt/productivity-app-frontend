import { useMutationFetch } from "../hooks";
import { PATHS } from "./path";

type GoogleSyncResponse = {
  message: string;
  calendarId: string;
  calendarHtmlLink: string;
  subscribeUrl: string;
  email: string;
};

export function useSendAccessTokenToBackend() {
  return useMutationFetch<GoogleSyncResponse, { accessToken: string }>({
    url: PATHS.google.sync,
    method: "POST",
    queryKey: ["google-sync"],
  });
}
