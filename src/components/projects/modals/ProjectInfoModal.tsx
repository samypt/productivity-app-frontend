import { components } from "../../../types/api";
import { formatDateString } from "../../../utils";
import { Modal } from "../../modal/Modal";
import "./ProjectInfoModal.style.css";

type Project = components["schemas"]["ProjectRead"];

interface Props {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectInfoModal: React.FC<Props> = ({
  project,
  isOpen,
  onClose,
}) => {
  const date = project.created_at ? new Date(project.created_at) : null;
  const formattedDate = formatDateString(date);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="project-info-modal">
        <h2 className="modal-title">{project.name}</h2>
        <div className="info-block">
          <label htmlFor="project-description">Description</label>
          <textarea
            id="project-description"
            value={project.description || ""}
            disabled
          />
        </div>
        <div className="modal-actions">
          <p className="created-date">Created: {formattedDate}</p>
        </div>
      </div>
    </Modal>
  );
};
