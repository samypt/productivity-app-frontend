import React, { useState } from "react";
import { components } from "../../../types/api";
import { Modal } from "../../modal/Modal";
import "./ProjectCreateModal.style.css";

type ProjectCreate = components["schemas"]["ProjectCreate"];

interface Props {
  team_id: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProject: ProjectCreate) => void;
}

export const ProjectCreateModal: React.FC<Props> = ({
  team_id,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ team_id, name, description });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="project-create-modal">
        <h2 className="modal-title">Create Project</h2>
        <form onSubmit={handleSubmit} className="project-create-form">
          <label htmlFor="project-name">Project Name</label>
          <input
            id="project-name"
            type="text"
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
            placeholder="Add a short description..."
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
