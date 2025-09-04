type PathFn<T extends string | number = string> = (id: T) => string;
type PathProjectEvents<T extends string | number = string> = (
  id: T,
  start_date: Date,
  end_date: Date
) => string;

type PathEvents = (start_date: Date, end_date: Date) => string;

interface BoardsPaths {
  root: string;
  detail: PathFn;
  update: PathFn;
  delete: PathFn;
  create: string;
}

interface UsersPaths {
  root: string;
  detail: PathFn;
  uploadAvatar: string;
  me: string;
}

interface EventsPaths {
  project: PathProjectEvents;
  user: PathEvents;
  me: string;
  calendar: PathEvents;
  create: string;
  update: PathFn;
  delete: PathFn;
  assign: PathFn;
  unassign: PathFn;
}

interface ListsPaths {
  create: string;
  update: PathFn;
  delete: PathFn;
}

interface TasksPaths {
  list: PathFn;
  me: string;
  create: string;
  update: PathFn;
  delete: PathFn;
  move: PathFn;
  assign: PathFn;
  unassign: PathFn;
}

interface TeamsPaths {
  root: string;
  create: string;
  update: PathFn;
  delete: PathFn;
  members: PathFn;
  teamProjects: PathFn;
}

interface ProjectsPaths {
  root: string;
  create: string;
  update: PathFn;
  delete: PathFn;
  // teamProjects: PathFn;
  projectBoards: PathFn;
}

interface InvitesPaths {
  root: string;
  respond: PathFn;
}

interface NotificationsPaths {
  root: string;
  respond: PathFn;
}

interface GoogleSyncPaths {
  sync: string;
}

interface AppPaths {
  boards: BoardsPaths;
  users: UsersPaths;
  events: EventsPaths;
  lists: ListsPaths;
  tasks: TasksPaths;
  teams: TeamsPaths;
  projects: ProjectsPaths;
  invites: InvitesPaths;
  notifications: NotificationsPaths;
  google: GoogleSyncPaths;
}

export const PATHS: AppPaths = {
  boards: {
    root: "/boards",
    detail: (id) => `/boards/${id}`,
    update: (id) => `boards/update/${id}`,
    delete: (id) => `boards/delete/${id}`,
    create: "boards/create",
  },
  users: {
    root: "/users",
    detail: (id) => `/users/${id}`,
    uploadAvatar: "users/upload-avatar",
    me: "/users/me",
  },
  events: {
    project: (projectId, start_date, end_date) =>
      `events/project/${projectId}?start_date=${start_date.toISOString()}&end_date=${end_date.toISOString()}`,
    user: (start_date, end_date) =>
      `events/me?start_date=${start_date.toISOString()}&end_date=${end_date.toISOString()}`,
    me: "/events/me",
    calendar: (start_date, end_date) =>
      `events/calendar?start_date=${start_date.toISOString()}&end_date=${end_date.toISOString()}`,
    create: "events/create/",
    update: (id) => `events/update/${id}`,
    delete: (id) => `events/delete/${id}`,
    assign: (id) => `events/assign/${id}`,
    unassign: (id) => `events/unassign/${id}`,
  },
  lists: {
    create: "lists/create/",
    update: (id) => `lists/update/${id}`,
    delete: (id) => `lists/delete/${id}`,
  },
  tasks: {
    list: (listId) => `tasks/list/${listId}`,
    me: "users/me/tasks",
    create: "/tasks/create",
    update: (id) => `tasks/update/${id}`,
    delete: (id) => `tasks/delete/${id}`,
    move: (id) => `/tasks/move/${id}`,
    assign: (id) => `/tasks/assign/${id}`,
    unassign: (id) => `/tasks/unassign/${id}`,
  },
  teams: {
    root: "users/me/teams",
    create: "team/create",
    update: (id) => `team/update/${id}`,
    delete: (id) => `team/delete/${id}`,
    members: (teamId) => `team/members/${teamId}`,
    teamProjects: (teamId) => `team/${teamId}`,
  },
  projects: {
    root: "/projects",
    create: "project/create",
    update: (id) => `project/update/${id}`,
    delete: (id) => `project/delete/${id}`,
    projectBoards: (projectId) => `project/${projectId}/boards`,
  },
  invites: {
    root: "invites",
    respond: (objectId) => `invites/${objectId}/respond`,
  },
  notifications: {
    root: "notifications",
    respond: (notificationId) => `notifications/${notificationId}/respond`,
  },
  google: {
    sync: "google/sync",
  },
};
