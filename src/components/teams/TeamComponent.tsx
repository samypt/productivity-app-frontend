import React from "react";
import { Link } from "react-router-dom";
import { components } from "../../types/api";
import { SettingsDropdown } from "../common";
import { TeamInfoModal, TeamEditModal } from "./modals";
import { useMutationFetch } from "../../hooks";
import { getColorFromName } from "../../utils";
import { UserList } from "../users";
import "./TeamComponent.style.css";

type Props = {
  team: components["schemas"]["TeamFullInfo"];
};
type TeamUpdate = components["schemas"]["TeamUpdate"];
type TeamRead = components["schemas"]["TeamRead"];

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
  const editTeam = useMutationFetch<TeamRead, TeamUpdate>({
    url: `team/update/${team.id}`,
    method: "PUT",
    queryKey: "teams",
  });

  const handleEdit = async (updatedTeamData: TeamUpdate) => {
    editTeam.mutate(updatedTeamData);
  };

  // Delete Team

  const deleteTeam = useMutationFetch<TeamUpdate>({
    url: `team/delete/${team.id}`,
    method: "DELETE",
    queryKey: "teams",
  });
  const handleDelete = () => {
    deleteTeam.mutate();
  };

  const bgColor = getColorFromName(team.name);
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
        onDeleteClick={handleDelete}
        clickOutsideEnabled={!(isInfoOpen || isEditOpen)}
        membership={team.membership?.role || undefined}
      />
      <TeamEditModal
        team={team}
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        onSave={handleEdit}
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
