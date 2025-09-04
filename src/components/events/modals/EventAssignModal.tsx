import React from "react";
import { useInView } from "react-intersection-observer";
import { Modal } from "../../modal/Modal";
import { components } from "../../../types/api";
import { useAuth } from "../../../hooks";
import { Avatar } from "../../users";
import { UserPlus, UserX } from "lucide-react";
import {
  useAssignEventMember,
  useUnassignEventMember,
} from "../../../api/events";
import { useFetchMembers } from "../../../api/members";
import "./EventAssignModal.style.css";

type EventFull = components["schemas"]["EventFull"];

interface Props {
  isOpen: boolean;
  event: EventFull;
  onClose: () => void;
  enabledAssign?: boolean;
}

export const EventAssignModal: React.FC<Props> = ({
  isOpen,
  event,
  onClose,
  enabledAssign,
}) => {
  // ------------------------------
  // Auth / Context
  // ------------------------------
  const { user } = useAuth();
  const teamId = event?.team.id;

  // ------------------------------
  // API hooks
  // ------------------------------
  const { assignMember } = useAssignEventMember(event);
  const { unassignMember } = useUnassignEventMember(event);

  const {
    members: allTeamMembers,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useFetchMembers(teamId, !enabledAssign);

  // ------------------------------
  // State & Intersection Observer
  // ------------------------------
  const { ref, inView } = useInView({ threshold: 0.5 });

  // ------------------------------
  // Effects
  // ------------------------------
  React.useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  // ------------------------------
  // Derived Data
  // ------------------------------
  const assigned = event.members;

  const unassigned =
    allTeamMembers?.filter(
      (u) => !assigned.some((member) => member.id === u.id)
    ) ?? [];
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="assign-modal_container">
        <div className="assign-modal_header">
          <h3>{enabledAssign ? "Assign People" : "Members"}</h3>

          {status === "pending" && (
            <p className="loading-text">Loading members...</p>
          )}
          {status === "error" && (
            <p className="error-text">Failed to load team members.</p>
          )}

          <div className="list-scroll-area">
            {assigned.length > 0 && (
              <div className="user-section">
                {enabledAssign && <h4 className="section-label">Assigned</h4>}
                {assigned.map((userInfo) => (
                  <div
                    className="user-row"
                    key={userInfo.id}
                    onClick={() =>
                      enabledAssign && unassignMember(userInfo.membership.id)
                    }
                  >
                    <div className="user-info">
                      <Avatar user={userInfo} />
                      <span className="user-name">
                        {user?.id === userInfo.id
                          ? "Me"
                          : `${userInfo.first_name} ${userInfo.last_name}`}
                      </span>
                    </div>
                    {enabledAssign && (
                      <div className="user-action">
                        <UserX />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {enabledAssign && assigned.length > 0 && unassigned.length > 0 && (
              <div className="divider" />
            )}

            {enabledAssign && unassigned.length > 0 && (
              <div className="user-section">
                <h4 className="section-label">Not Assigned</h4>
                {unassigned.map((userInfo) => (
                  <div
                    className="user-row"
                    key={userInfo.id}
                    onClick={() =>
                      enabledAssign && assignMember(userInfo.membership.id)
                    }
                  >
                    <div className="user-info">
                      <Avatar user={userInfo} />
                      <span className="user-name">
                        {user?.id === userInfo.id
                          ? "Me"
                          : `${userInfo.first_name} ${userInfo.last_name}`}
                      </span>
                    </div>
                    {enabledAssign && (
                      <div className="user-action">
                        <UserPlus />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {enabledAssign &&
              allTeamMembers.length === 0 &&
              status === "success" && (
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
