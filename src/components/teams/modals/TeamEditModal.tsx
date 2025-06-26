import React, { useState } from "react";
import { components } from "../../../types/api";
import { Modal } from "../../modal/Modal";
import { InviteModal } from "../../modal/InviteModal";
import { UserList } from "../../users";
import { UserRoundPlus } from "lucide-react";
import "./TeamEditModal.style.css";

type TeamFull = components["schemas"]["TeamFullInfo"];
type TeamUpdate = components["schemas"]["TeamUpdate"];

interface Props {
  team: TeamFull;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTeam: TeamUpdate) => void;
}

export const TeamEditModal: React.FC<Props> = ({
  team,
  isOpen,
  onClose,
  onSave,
}) => {
  const [description, setDescription] = useState<string | null | undefined>(
    team.description
  );
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ description });
    onClose();
  };

  const groupedMembers = {
    owners: team.members.filter((m) => m.membership.role === "owner"),
    editors: team.members.filter((m) => m.membership.role === "editor"),
    viewers: team.members.filter((m) => m.membership.role === "viewer"),
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} enabled={!isInviteOpen}>
        <div className="team-edit-modal">
          <h2 className="team-name">{team.name}</h2>

          <div className="members-container">
            {[
              { label: "Owners", members: groupedMembers.owners },
              { label: "Editors", members: groupedMembers.editors },
              { label: "Viewers", members: groupedMembers.viewers },
            ].map(({ label, members }) => (
              <div key={label} className="role-container">
                <h4>{label}</h4>
                {members.length > 0 ? (
                  <div className="userlist-wrapper">
                    <UserList members={members} avatarSize={32} />
                  </div>
                ) : (
                  <p className="empty-role-text">No members with this role.</p>
                )}
              </div>
            ))}
          </div>

          <button className="invite-btn" onClick={() => setIsInviteOpen(true)}>
            <UserRoundPlus size={18} />
            <span>Invite Member</span>
          </button>

          <form className="description-form" onSubmit={handleSubmit}>
            <label htmlFor="team-description">Description</label>
            <textarea
              id="team-description"
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a short team description..."
            />
            <div className="modal-actions">
              <button type="submit" className="btn-save">
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <InviteModal
        isOpen={isInviteOpen}
        teamId={team.id}
        onClose={() => setIsInviteOpen(false)}
      />
    </>
  );
};
