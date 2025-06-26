import React from "react";
import TeamList from "../components/teams/TeamList";

const Teams: React.FC = () => {
  return (
    <div className="teams">
      <h1>Teams</h1>
      <TeamList />
    </div>
  );
};

export default Teams;
