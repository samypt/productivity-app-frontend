import { components } from "../../../types/api";
import { formatDateString } from "../../../utils";
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
  const formattedDate = formatDateString(date);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="team-info-modal">
        <h2 className="team-name1">{team.name}</h2>
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
