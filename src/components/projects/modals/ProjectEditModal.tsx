import React, { useState } from "react";
import { components } from "../../../types/api";
import { Modal } from "../../modal/Modal";
import "./ProjectEditModal.style.css";

type Project = components["schemas"]["ProjectRead"];
type ProjectUpdate = components["schemas"]["ProjectUpdate"];

interface Props {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProject: ProjectUpdate) => void;
}

export const ProjectEditModal: React.FC<Props> = ({
  project,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState<string>(project.name);
  const [description, setDescription] = useState(project.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="project-edit-modal">
        <h2 className="modal-title">Edit Project</h2>
        <form onSubmit={handleSubmit} className="project-edit-form">
          <label htmlFor="project-name">Project Name</label>
          <input
            id="project-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter project name"
          />

          <label htmlFor="project-description">Description</label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Update description..."
          />

          <div className="modal-actions">
            <button type="submit" className="btn-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
