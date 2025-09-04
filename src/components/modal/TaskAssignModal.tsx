import React from "react";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { Modal } from "./Modal";
import { components } from "../../types/api";
import { useAssignTaskMember, useUnassignTaskMember } from "../../api/tasks";
import { useFetchMembers } from "../../api/members";
import { Avatar } from "../users";
import { UserPlus, UserX } from "lucide-react";
import "./TaskAssignModal.style.css";

type TaskFull = components["schemas"]["TaskFull"];
type Props = {
  isOpen: boolean;
  task: TaskFull;
  // urlParam?: string; // Optional URL parameter for mutation
  onClose: () => void;
};

export const TaskAssignModal: React.FC<Props> = ({
  isOpen,
  task,
  // urlParam,
  onClose,
}) => {
  const { teamID } = useParams();
  if (!teamID) throw new Error("Team ID is required");

  const { assignMember: handleAssign } = useAssignTaskMember(task);
  const { unassignMember: handleUnassign } = useUnassignTaskMember(task);

  const { ref, inView } = useInView({ threshold: 0.5 });

  const {
    members: allTeamMembers,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useFetchMembers(teamID);

  React.useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const assigned = allTeamMembers.filter((user) =>
    task.members.some((member) => member.id === user.id)
  );

  const unassigned = allTeamMembers.filter(
    (user) => !task.members.some((member) => member.id === user.id)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="assign-modal_container">
        <div className="assign-modal_header">
          <h3>Assign People</h3>

          {status === "pending" && (
            <p className="loading-text">Loading members...</p>
          )}
          {status === "error" && (
            <p className="error-text">Failed to load team members.</p>
          )}

          <div className="list-scroll-area">
            {assigned.length > 0 && (
              <div className="user-section">
                <h4 className="section-label">Assigned</h4>
                {assigned.map((user) => (
                  <div
                    className="user-row"
                    key={user.id}
                    onClick={() => handleUnassign(user.membership.id)}
                  >
                    <div className="user-info">
                      <Avatar user={user} />
                      <span className="user-name">
                        {user.first_name} {user.last_name}
                      </span>
                    </div>
                    <div className="user-action">
                      <UserX />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {assigned.length > 0 && unassigned.length > 0 && (
              <div className="divider" />
            )}

            {unassigned.length > 0 && (
              <div className="user-section">
                <h4 className="section-label">Not Assigned</h4>
                {unassigned.map((user) => (
                  <div
                    className="user-row"
                    key={user.id}
                    onClick={() => handleAssign(user.membership.id)}
                  >
                    <div className="user-info">
                      <Avatar user={user} />
                      <span className="user-name">
                        {user.first_name} {user.last_name}
                      </span>
                    </div>
                    <div className="user-action">
                      <UserPlus />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {allTeamMembers.length === 0 && status === "success" && (
              <p className="empty-text">No members found in this team.</p>
            )}

            {hasNextPage && (
              <div ref={ref} className="load-more-trigger">
                {isFetchingNextPage ? "Loading more..." : ""}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
