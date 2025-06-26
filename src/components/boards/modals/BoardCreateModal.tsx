import React, { useState } from "react";
import { components } from "../../../types/api";
import { Modal } from "../../modal/Modal";
import "./BoardCreateModal.style.css";

type BoardCreate = components["schemas"]["BoardCreate"];

interface Props {
  project_id: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTeam: BoardCreate) => void;
}

export const BoardCreateModal: React.FC<Props> = ({
  project_id,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState<string>("");
  const createdBoard: BoardCreate = {
    project_id,
    name,
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...createdBoard });
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="board-modal">
        <form onSubmit={handleSubmit} className="board-form">
          <label htmlFor="board-name" className="board-label">
            Board Name:
          </label>
          <input
            id="board-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="board-input"
            placeholder="Enter board name"
          />
          <div className="board-actions">
            <button type="submit" className="board-save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
