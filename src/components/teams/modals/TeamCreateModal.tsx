import React, { useState } from "react";
import { components } from "../../../types/api";
import { Modal } from "../../modal/Modal";
import "./TeamCreateModal.style.css";

type TeamCreate = components["schemas"]["TeamCreate"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTeam: TeamCreate) => void;
}

export const TeamCreateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="team-create-modal">
        <h2 className="modal-title">Create Team</h2>
        <form onSubmit={handleSubmit} className="team-create-form">
          <label htmlFor="team-name">Team Name</label>
          <input
            id="team-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter team name"
          />

          <label htmlFor="team-description">Description</label>
          <textarea
            id="team-description"
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
