import { useFetch, useMutationFetch } from "../hooks";
import { components } from "../types/api";
import { PATHS } from "./path";

type EventMemberLink = components["schemas"]["EventMemberLink"];
type EventFull = components["schemas"]["EventFull"];
type EventsData = {
  [fieldName: string]: components["schemas"]["EventFull"][];
};
type EventRead = components["schemas"]["EventRead"];
type EventUpdate = components["schemas"]["EventUpdate"];
type EventCreate = components["schemas"]["EventCreate"];

export function useFetchProjectEvents(
  projectID: string,
  startDate: Date,
  endDate: Date,
  skip: boolean
) {
  const queryKey = [
    "events",
    projectID,
    startDate.toISOString(),
    endDate.toISOString(),
  ];
  const { data, error, isLoading } = useFetch<EventsData>({
    url: PATHS.events.project(projectID, startDate, endDate),
    queryKey: queryKey,
    skip: skip,
  });
  return { data, error, isLoading };
}

export function useFetchUserEvents(
  startDate: Date,
  endDate: Date,
  skip: boolean
) {
  const queryKey = ["events", startDate.toISOString(), endDate.toISOString()];
  const { data, error, isLoading } = useFetch<EventsData>({
    url: PATHS.events.user(startDate, endDate),
    queryKey: queryKey,
    skip: skip,
  });
  return { data, error, isLoading };
}

export function useFetchCalendatEvents(startDate: Date, endDate: Date) {
  const queryKey = ["events", startDate.toISOString(), endDate.toISOString()];
  const { data, error, isLoading } = useFetch<EventsData>({
    url: PATHS.events.calendar(startDate, endDate),
    queryKey: queryKey,
  });
  const events: EventFull[] = (data?.events || []).map((e) => ({
    ...e,
  }));

  return { events, error, isLoading };
}

export function useDeleteEvent(projectID: string) {
  const mutation = useMutationFetch({
    method: "DELETE",
    queryKey: [`events`, projectID],
  });
  const deleteEvent = (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      mutation.mutate({
        url: PATHS.events.delete(eventId),
      });
    }
  };
  return { deleteEvent, ...mutation };
}

export function useUpdateEvent(projectID: string) {
  const mutation = useMutationFetch<EventRead, EventUpdate>({
    method: "PUT",
    queryKey: [`events`, projectID],
  });
  const updateEvent = (event: EventRead) => {
    return mutation.mutateAsync({
      title: event.title,
      description: event.description,
      start_time: event.start_time,
      end_time: event.end_time,
      project_id: event.project_id,
      url: PATHS.events.update(event.id),
    });
  };
  return { updateEvent, ...mutation };
}

export function useCreateEvent(projectID: string) {
  const mutation = useMutationFetch<EventRead, EventCreate>({
    url: PATHS.events.create,
    method: "POST",
    queryKey: [`events`, projectID],
  });

  const createEvent = (event: EventCreate) => {
    return mutation.mutateAsync(event);
  };
  return { createEvent, ...mutation };
}

export function useAssignEventMember(event: EventFull) {
  const mutation = useMutationFetch<EventMemberLink>({
    method: "POST",
    url: PATHS.events.assign(event.id),
    queryKey: [`events`, event.project_id],
  });
  const assignMember = (member_id: string) => {
    mutation.mutate({ member_id });
  };
  return { assignMember, ...mutation };
}

export function useUnassignEventMember(event: EventFull) {
  const mutation = useMutationFetch<EventMemberLink>({
    method: "POST",
    url: PATHS.events.unassign(event.id),
    queryKey: [`events`, event.project_id],
  });
  const unassignMember = (member_id: string) => {
    mutation.mutate({ member_id });
  };
  return { unassignMember, ...mutation };
}

export function useAgendaEvents(
  projectID: string | undefined,
  startDate: Date,
  endDate: Date
) {
  const projectEvents = useFetchProjectEvents(
    projectID ?? "",
    startDate,
    endDate,
    !projectID // skip if no projectID
  );
  const userEvents = useFetchUserEvents(startDate, endDate, !!projectID); // skip if projectID exists

  const deleteProjectEvent = useDeleteEvent(projectID ?? "");
  const updateProjectEvent = useUpdateEvent(projectID ?? "");
  const createProjectEvent = useCreateEvent(projectID ?? "");

  if (projectID) {
    return {
      data: projectEvents.data ?? { events: [] }, // normalize
      error: projectEvents.error,
      isLoading: projectEvents.isLoading,
      deleteEvent: deleteProjectEvent.deleteEvent,
      updateEvent: updateProjectEvent.updateEvent,
      createEvent: createProjectEvent.createEvent,
    };
  }

  return {
    data: userEvents.data ?? { events: [] }, // normalize
    error: userEvents.error,
    isLoading: userEvents.isLoading,
    deleteEvent: async () => {},
    updateEvent: async () => {},
    createEvent: async () => {},
  };
}
