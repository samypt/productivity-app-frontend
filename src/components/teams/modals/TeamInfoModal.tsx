import { components } from "../../../types/api";
import { Modal } from "../../modal/Modal";
import "./TeamInfoModal.style.css";

type TeamFull = components["schemas"]["TeamFullInfo"];

interface Props {
  team: TeamFull;
  isOpen: boolean;
  onClose: () => void;
}

export const TeamInfoModal: React.FC<Props> = ({ team, isOpen, onClose }) => {
  const date = team.created_at ? new Date(team.created_at) : null;

  const formattedDate = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")} ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
    : "Unknown";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="team-info-modal">
        <h2 className="team-name">{team.name}</h2>
        <p className="team-role">
          Your role: <strong>{team.membership.role}</strong>
        </p>

        <div className="info-section">
          <label htmlFor="team-description">Description</label>
          <textarea
            id="team-description"
            value={team.description || ""}
            disabled
            className="readonly-textarea"
          />
        </div>

        <div className="modal-footer">
          <p className="created-at">Created: {formattedDate}</p>
        </div>
      </div>
    </Modal>
  );
};
