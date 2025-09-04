import { components } from "../../types/api";
import { getColor } from "../../utils/generateColor";

type EventFull = components["schemas"]["EventFull"];

export type CalenderEvent = EventFull & {
  start_date: Date;
  end_date: Date;
};

export const CustomEvent = ({
  event,
  view,
}: {
  event: EventFull;
  view: string;
}) => {
  const teamColor = getColor(event.team.name);
  const projectColor = getColor(event.project.name);

  if (view === "month") {
    return (
      <div
        className="custom-event compact"
        title={`${event.title} → ${event.team.name} (${event.project.name})`}
      >
        <span className="color-dot" style={{ backgroundColor: teamColor }} />
        <span className="event-title">{`${event.title} → ${event.team.name} (${event.project.name})`}</span>
      </div>
    );
  }

  return (
    <div className="custom-event">
      <div className="event-line-top">
        <span className="color-dot" style={{ backgroundColor: teamColor }} />
        <span className="event-title">{event.title}</span>
      </div>
      <div className="event-line-bottom">
        <span className="event-team" style={{ color: teamColor }}>
          ↳ {event.team.name}
        </span>
        <span className="event-project" style={{ color: projectColor }}>
          ({event.project.name})
        </span>
      </div>
    </div>
  );
};
