import React from "react";
import { useParams } from "react-router-dom";
import ProjectComponent from "../components/projects/ProjectComponent";
import { FilePlus2 } from "lucide-react";
import { ProjectCreateModal } from "../components/projects/modals";
import { useCreateProject, useFetchProjects } from "../api/projects";
import "./TeamPage.style.css";

const TeamPage: React.FC = () => {
  const { id } = useParams();
  const [isCreateOpen, setIsCreateOpen] = React.useState<boolean>(false);
  const handleOpenCreate = () => setIsCreateOpen(true);
  const handleCloseCreate = () => setIsCreateOpen(false);

  const { data } = useFetchProjects(id!);
  const { createProject } = useCreateProject();

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
          onSave={createProject}
        />
      )}
    </div>
  );
};

export default TeamPage;
