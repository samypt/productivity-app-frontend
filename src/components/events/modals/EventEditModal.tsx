import React, { useState } from "react";
import { components } from "../../../types/api";
import { Modal } from "../../modal/Modal";
import { UserList } from "../../users/UserList";
import { EventAssignModal } from "./EventAssignModal";
import { Users } from "lucide-react";
import { useAuth } from "../../../hooks";
import { generateGoogleCalendarURL } from "../../../utils/generateGoogleCalendarURL";
import { handleAddToAppleCalendar } from "../../../utils/handleAddToAppleCalendar";
import { isMacOS } from "../../../utils/isMacOS";
import "./EventEditModal.style.css";

type EventFull = components["schemas"]["EventFull"];
type EventRead = components["schemas"]["EventRead"];
type EditableEvent = Omit<EventRead, "created_at" | "created_by">;

interface Props {
  event: EventFull;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEvent: EditableEvent) => void;
}

// export const EventEditModal: React.FC<Props> = ({
//   event,
//   isOpen,
//   onClose,
//   onSave,
// }) => {
//   const { user } = useAuth();
//   const isMyEvent = event.created_by === user?.id;
//   const [title, setTitle] = useState(event.title || "");
//   const [description, setDescription] = useState(event.description || "");
//   const [startTime, setStartTime] = useState(
//     event.start_time?.slice(0, 16) || ""
//   ); // YYYY-MM-DDTHH:MM

//   const [endTime, setEndTime] = useState(event.end_time?.slice(0, 16) || "");
//   const [isModalOpen, setModalOpen] = useState<boolean>(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave({
//       id: event.id,
//       title,
//       description,
//       start_time: startTime,
//       end_time: endTime,
//       project_id: event.project_id,
//     });
//     onClose();
//   };

export const EventEditModal: React.FC<Props> = ({
  event,
  isOpen,
  onClose,
  onSave,
}) => {
  // ==============================
  // Auth / User Info
  // ==============================
  const { user } = useAuth();
  const isMyEvent = event.created_by === user?.id;

  // ==============================
  // Local State
  // ==============================
  const [title, setTitle] = useState(event.title || "");
  const [description, setDescription] = useState(event.description || "");
  const [startTime, setStartTime] = useState(
    event.start_time?.slice(0, 16) || ""
  ); // format: YYYY-MM-DDTHH:MM
  const [endTime, setEndTime] = useState(event.end_time?.slice(0, 16) || "");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  // ==============================
  // Handlers
  // ==============================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: event.id,
      title,
      description,
      start_time: startTime,
      end_time: endTime,
      project_id: event.project_id,
    });
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} enabled={!isModalOpen}>
        <form className="event-edit-form" onSubmit={handleSubmit}>
          <h2>Edit Event</h2>

          <div className="form-group">
            <label>Title</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={!isMyEvent}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="textarea"
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isMyEvent}
            />
          </div>

          <div className="form-inline">
            <div className="form-group">
              <label>Start Time</label>
              <input
                className="input"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                disabled={!isMyEvent}
              />
            </div>

            <div className="form-group">
              <label>End Time</label>
              <input
                className="input"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                disabled={!isMyEvent}
              />
            </div>
          </div>

          {isMyEvent && (
            <div className="modal-actions">
              <button type="submit" className="btn-save">
                Save Event
              </button>
            </div>
          )}
          <button
            className="google-calendar-btn"
            onClick={() =>
              window.open(generateGoogleCalendarURL(event), "_blank")
            }
          >
            Add to Google Calendar
          </button>
          <button
            className="google-calendar-btn"
            onClick={() => handleAddToAppleCalendar(event)}
          >
            {isMacOS() ? "Add to Apple Calendar" : "Download Event"}
          </button>
        </form>

        <div className="assign-section">
          <div className="assign-header">
            <h3>Participants</h3>
            <button className="assign-btn" onClick={() => setModalOpen(true)}>
              <Users size={20} />
              <span>{isMyEvent ? "Manage" : "View"}</span>
            </button>
          </div>
          <UserList members={event.members} avatarSize={32} />
        </div>
      </Modal>

      {isModalOpen && (
        <EventAssignModal
          event={event}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          enabledAssign={isMyEvent}
        />
      )}
    </>
  );
};
