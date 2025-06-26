import React from "react";
import { components } from "../../types/api";
import { FilePlus2 } from "lucide-react";
import TeamComponent from "./TeamComponent";
import { TeamCreateModal } from "./modals";
import { useFetch, useMutationFetch } from "../../hooks";
import "./TeamList.style.css";

type TeamsData = {
  [fieldName: string]: components["schemas"]["TeamFullInfo"][];
};
type TeamCreate = components["schemas"]["TeamCreate"];
type TeamRead = components["schemas"]["TeamRead"];

const TeamList: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = React.useState<boolean>(false);
  const handleOpenCreate = () => setIsCreateOpen(true);
  const handleCloseCreate = () => setIsCreateOpen(false);

  //  Create new team
  const createTeam = useMutationFetch<TeamRead, TeamCreate>({
    method: "POST",
    url: "team/create",
    queryKey: "teams",
  });

  const handleCreate = async (updatedTeamData: TeamCreate) => {
    createTeam.mutate(updatedTeamData);
  };
  //  Get all my teams fetch
  const { data } = useFetch<TeamsData>({
    url: "users/me/teams",
    queryKey: "teams",
  });
  //  Create a list of teams
  const list = data?.teams?.map((team) => (
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
        onSave={handleCreate}
      />
    </div>
  );
};

export default TeamList;
