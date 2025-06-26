import React from "react";
import { components } from "../../types/api";
import { getColorFromName } from "../../utils/getColorFromName";
import { useMutationFetch } from "../../hooks";
import { SettingsDropdown } from "../common";
import { ProjectInfoModal, ProjectEditModal } from "./modals";
import { Link } from "react-router-dom";
import "./ProjectComponent.style.css";

type Props = {
  project: components["schemas"]["ProjectRead"];
};

type ProjectRead = components["schemas"]["ProjectRead"];
type ProjectUpdate = components["schemas"]["ProjectUpdate"];

const ProjectComponent: React.FC<Props> = ({ project }) => {
  const [isInfoOpen, setInfoOpen] = React.useState<boolean>(false);
  const handleOpenInfo = () => setInfoOpen(true);
  const handleCloseInfo = () => setInfoOpen(false);
  // Edit project
  const [isEditOpen, setEditOpen] = React.useState<boolean>(false);
  const handleOpenEdit = () => setEditOpen(true);
  const handleCloseEdit = () => setEditOpen(false);
  const editTeam = useMutationFetch<ProjectRead, ProjectUpdate>({
    url: `project/update/${project.id}`,
    method: "PUT",
    queryKey: "projects",
  });
  const handleEdit = async (updatedProjectData: ProjectUpdate) => {
    editTeam.mutate(updatedProjectData);
  };

  // Delete Team

  const deleteTeam = useMutationFetch<ProjectUpdate>({
    url: `project/delete/${project.id}`,
    method: "DELETE",
    queryKey: "projects",
  });
  const handleDelete = () => {
    deleteTeam.mutate();
  };

  const bgColor = getColorFromName(project.name);
  return (
    <div className="project-card" style={{ backgroundColor: bgColor }}>
      <Link
        to={`/teams/${project.team_id}/projects/${project.id}`}
        className="card-link"
      />
      <div className="project-card-header">
        <h2 className="team-name">{project.name}</h2>
      </div>
      <p className="project-description">{project.description}</p>
      <SettingsDropdown
        onInfoClick={handleOpenInfo}
        onEditClick={handleOpenEdit}
        onDeleteClick={handleDelete}
        clickOutsideEnabled={!(isInfoOpen || isEditOpen)}
      />
      <ProjectEditModal
        project={project}
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        onSave={handleEdit}
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
