import React from "react";
import { Link } from "react-router-dom";
import { components } from "../../types/api";
import { SettingsDropdown } from "../common";
import { TeamInfoModal, TeamEditModal } from "./modals";
import { usePastelColor } from "../../utils";
import { UserList } from "../users";
import "./TeamComponent.style.css";
import { useDeleteTeam, useUpdateTeam } from "../../api/teams";

type Props = {
  team: components["schemas"]["TeamFullInfo"];
};

const avatarLength: number = 3;
const avatarSize: number = 36;

const TeamComponent: React.FC<Props> = ({ team }) => {
  const [isInfoOpen, setInfoOpen] = React.useState<boolean>(false);
  const handleOpenInfo = () => setInfoOpen(true);
  const handleCloseInfo = () => setInfoOpen(false);
  // Edit team
  const [isEditOpen, setEditOpen] = React.useState<boolean>(false);
  const handleOpenEdit = () => setEditOpen(true);
  const handleCloseEdit = () => setEditOpen(false);

  const { updateTeam } = useUpdateTeam(team.id);

  // Delete Team

  const { deleteTeam } = useDeleteTeam(team.id);

  const bgColor = usePastelColor(team.name);
  return (
    <div className="team-card" style={{ backgroundColor: bgColor }}>
      <Link to={`/teams/${team.id}`} className="card-link" />
      <div className="team-card-header">
        <div className="team-info">
          <h2 className="team-name">{team.name}</h2>

          {team.membership && (
            <span className={`team-role ${team.membership.role} interactive`}>
              {team.membership.role?.toLocaleLowerCase()}
            </span>
          )}
        </div>
      </div>
      <p className="team-description">{team.description}</p>

      <div className="interactive">
        <UserList
          members={team.members}
          avatarLength={avatarLength}
          avatarSize={avatarSize}
        />
      </div>
      <SettingsDropdown
        onInfoClick={handleOpenInfo}
        onEditClick={handleOpenEdit}
        onDeleteClick={deleteTeam}
        clickOutsideEnabled={!(isInfoOpen || isEditOpen)}
        membership={team.membership?.role || undefined}
      />
      <TeamEditModal
        team={team}
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        onSave={updateTeam}
      />
      <TeamInfoModal
        team={team}
        isOpen={isInfoOpen}
        onClose={handleCloseInfo}
      />
    </div>
  );
};

export default TeamComponent;
