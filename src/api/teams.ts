import { components } from "../types/api";
import { useFetch, useMutationFetch } from "../hooks";
import { PATHS } from "./path";

type TeamsData = {
  [fieldName: string]: components["schemas"]["TeamFullInfo"][];
};
type TeamCreate = components["schemas"]["TeamCreate"];
type TeamRead = components["schemas"]["TeamRead"];
type TeamUpdate = components["schemas"]["TeamUpdate"];

export function useCreateTeam() {
  const mutation = useMutationFetch<TeamRead, TeamCreate>({
    method: "POST",
    url: PATHS.teams.create,
    queryKey: ["teams"],
  });
  const createTeam = (updatedTeamData: TeamCreate) => {
    mutation.mutateAsync(updatedTeamData);
  };
  return { createTeam, ...mutation };
}

export function useFetchTeams() {
  const { data, error, isLoading, refetch } = useFetch<TeamsData>({
    url: PATHS.teams.root,
    queryKey: ["teams"],
  });
  const teams = data?.teams;
  return { teams, error, isLoading, refetch };
}

export function useUpdateTeam(team_id: string) {
  const mutation = useMutationFetch<TeamRead, TeamUpdate>({
    url: PATHS.teams.update(team_id),
    method: "PUT",
    queryKey: ["teams"],
  });
  const updateTeam = (updatedTeamData: TeamUpdate) => {
    mutation.mutateAsync(updatedTeamData);
  };
  return { updateTeam, ...mutation };
}

export function useDeleteTeam(team_id: string) {
  const mutation = useMutationFetch({
    url: PATHS.teams.delete(team_id),
    method: "DELETE",
    queryKey: ["teams"],
  });
  const deleteTeam = () => {
    mutation.mutateAsync();
  };
  return { deleteTeam, ...mutation };
}
