import { components } from "../types/api";
import { useFetch, useMutationFetch } from "../hooks";
import { PATHS } from "./path";

type ProjectRead = components["schemas"]["ProjectRead"];
type ProjectUpdate = components["schemas"]["ProjectUpdate"];
type ProjectCreate = components["schemas"]["ProjectCreate"];
type TeamsProjects = {
  team: components["schemas"]["TeamRead"];
  projects: components["schemas"]["ProjectRead"][];
};

export function useUpdateProject(project_id: string) {
  const mutation = useMutationFetch<ProjectRead, ProjectUpdate>({
    url: PATHS.projects.update(project_id),
    method: "PUT",
    queryKey: ["projects"],
  });
  const updateProject = (updatedProjectData: ProjectUpdate) => {
    mutation.mutateAsync(updatedProjectData);
  };
  return { updateProject, ...mutation };
}

export function useDeleteProject(project_id: string) {
  const mutation = useMutationFetch<ProjectUpdate>({
    url: PATHS.projects.delete(project_id),
    method: "DELETE",
    queryKey: ["projects"],
  });
  const deleteProject = () => {
    mutation.mutateAsync();
  };
  return { deleteProject, ...mutation };
}

export function useFetchProjects(team_id: string) {
  const { data, error, refetch, isLoading } = useFetch<TeamsProjects>({
    url: PATHS.teams.teamProjects(team_id),
    queryKey: ["projects"],
  });
  return { data, error, refetch, isLoading };
}

export function useCreateProject() {
  const mutation = useMutationFetch<ProjectRead, ProjectCreate>({
    method: "POST",
    url: PATHS.projects.create,
    queryKey: ["projects"],
  });

  const createProject = async (updatedTeamData: ProjectCreate) => {
    mutation.mutate(updatedTeamData);
  };
  return { createProject, ...mutation };
}
