import React, { useState } from "react";
import { Modal } from "./Modal";
import { components } from "../../types/api";
import { useMutationFetch } from "../../hooks";
import "./InviteModal.style.css";

type Props = {
  isOpen: boolean;
  teamId: string;
  onClose: () => void;
};

type InviteRead = components["schemas"]["InviteRead"];
type InviteCreate = components["schemas"]["InviteCreate"];
type Role = components["schemas"]["Role"];

export const InviteModal: React.FC<Props> = ({ isOpen, teamId, onClose }) => {
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<Role>("editor");

  const createInvite = useMutationFetch<InviteRead, InviteCreate>({
    method: "POST",
    url: "invites",
    queryKey: `invites`,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createInvite.mutate({
      team_id: teamId,
      email,
      role,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="invite-modal-container">
        <h3 className="invite-modal-title">Invite People</h3>
        <form onSubmit={handleSubmit} className="invite-form">
          <label htmlFor="email-input">Invite by email</label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="user@example.com"
          />

          <label htmlFor="role-select">Choose a role</label>
          <select
            id="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            <option value="" disabled>
              Select role
            </option>
            <option value="owner">Owner</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>

          <div className="modal-actions">
            <button type="submit" className="btn-send-invite">
              Send Invite
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
