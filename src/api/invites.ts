import { useMutationFetch } from "../hooks";
import { components } from "../types/api";
import { PATHS } from "./path";

type InviteRead = components["schemas"]["InviteRead"];
type InviteCreate = components["schemas"]["InviteCreate"];
type InviteRespond = components["schemas"]["InviteRespond"];
type InviteStatus = components["schemas"]["InviteStatus"];

export function useInviteMember() {
  return useMutationFetch<InviteRead, InviteCreate>({
    method: "POST",
    url: "invites",
  });
}

export function useInviteRespond(object_id: string) {
  const mutation = useMutationFetch<InviteRead, InviteRespond>({
    method: "POST",
    url: PATHS.invites.respond(object_id),
    queryKey: ["notifications"],
  });
  const inviteRespond = (status: InviteStatus) => {
    mutation.mutateAsync({ status });
  };
  return { inviteRespond, ...mutation };
}
