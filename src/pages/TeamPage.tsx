import React from "react";
import { useParams } from "react-router-dom";
import ProjectComponent from "../components/projects/ProjectComponent";
import { components } from "../types/api";
import { FilePlus2 } from "lucide-react";
import { ProjectCreateModal } from "../components/projects/modals";
import { useFetch, useMutationFetch } from "../hooks";
import "./TeamPage.style.css";

type TeamsProjects = {
  team: components["schemas"]["TeamRead"];
  projects: components["schemas"]["ProjectRead"][];
};
type ProjectRead = components["schemas"]["ProjectRead"];
type ProjectCreate = components["schemas"]["ProjectCreate"];

const TeamPage: React.FC = () => {
  const { id } = useParams();
  const [isCreateOpen, setIsCreateOpen] = React.useState<boolean>(false);
  const handleOpenCreate = () => setIsCreateOpen(true);
  const handleCloseCreate = () => setIsCreateOpen(false);
  // Get all the Projects of the Team
  const { data } = useFetch<TeamsProjects>({
    url: `team/${id}`,
    queryKey: "projects",
  });

  //  Create new team
  const createTeam = useMutationFetch<ProjectRead, ProjectCreate>({
    method: "POST",
    url: "project/create",
    queryKey: "projects",
  });

  const handleCreate = async (updatedTeamData: ProjectCreate) => {
    createTeam.mutate(updatedTeamData);
  };

  // Generate Project Component
  const list = data?.projects?.map((project) => (
    <ProjectComponent key={project.id} project={project} />
  ));

  return (
    <div className="project-container">
      <h1>{data?.team.name}</h1>
      <ul className="project-list">
        {list}
        <div className="card add-new-card" onClick={handleOpenCreate}>
          <FilePlus2 className="add" />
        </div>
      </ul>
      {data?.team.id && (
        <ProjectCreateModal
          team_id={data.team.id}
          isOpen={isCreateOpen}
          onClose={handleCloseCreate}
          onSave={handleCreate}
        />
      )}
    </div>
  );
};

export default TeamPage;
