import React from "react";
import { components } from "../../types/api";
import { usePastelColor } from "../../utils";
import { SettingsDropdown } from "../common";
import { ProjectInfoModal, ProjectEditModal } from "./modals";
import { Link } from "react-router-dom";
import { useDeleteProject, useUpdateProject } from "../../api/projects";
import "./ProjectComponent.style.css";

type Props = {
  project: components["schemas"]["ProjectRead"];
};

const ProjectComponent: React.FC<Props> = ({ project }) => {
  const [isInfoOpen, setInfoOpen] = React.useState<boolean>(false);
  const handleOpenInfo = () => setInfoOpen(true);
  const handleCloseInfo = () => setInfoOpen(false);
  // Edit project
  const [isEditOpen, setEditOpen] = React.useState<boolean>(false);
  const handleOpenEdit = () => setEditOpen(true);
  const handleCloseEdit = () => setEditOpen(false);

  const { updateProject } = useUpdateProject(project.id);

  // Delete Team
  const { deleteProject } = useDeleteProject(project.id);

  const bgColor = usePastelColor(project.name);
  return (
    <div className="project-card" style={{ backgroundColor: bgColor }}>
      <Link
        to={`/teams/${project.team_id}/projects/${project.id}`}
        className="card-link"
      />
      <div className="project-card-header">
        <h2 className="project-name">{project.name}</h2>
      </div>
      <p className="project-description">{project.description}</p>
      <SettingsDropdown
        onInfoClick={handleOpenInfo}
        onEditClick={handleOpenEdit}
        onDeleteClick={deleteProject}
        clickOutsideEnabled={!(isInfoOpen || isEditOpen)}
      />
      <ProjectEditModal
        project={project}
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        onSave={updateProject}
      />
      <ProjectInfoModal
        project={project}
        isOpen={isInfoOpen}
        onClose={handleCloseInfo}
      />
    </div>
  );
};

export default ProjectComponent;
