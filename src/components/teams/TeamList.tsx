import React from "react";
import { FilePlus2 } from "lucide-react";
import TeamComponent from "./TeamComponent";
import { TeamCreateModal } from "./modals";
import "./TeamList.style.css";
import { useCreateTeam, useFetchTeams } from "../../api/teams";

const TeamList: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = React.useState<boolean>(false);
  const handleOpenCreate = () => setIsCreateOpen(true);
  const handleCloseCreate = () => setIsCreateOpen(false);

  const { createTeam } = useCreateTeam();
  const { teams } = useFetchTeams();
  //  Create a list of teams
  const list = teams?.map((team) => (
    <TeamComponent key={team.id} team={team} />
  ));

  return (
    <div className="teams-container">
      <ul className="teams-list">
        {list}
        <div className="card add-new-card" onClick={handleOpenCreate}>
          <FilePlus2 className="add" />
        </div>
      </ul>
      <TeamCreateModal
        isOpen={isCreateOpen}
        onClose={handleCloseCreate}
        onSave={createTeam}
      />
    </div>
  );
};

export default TeamList;
