# Teamly – Team Productivity App (Frontend)

**Teamly** is a collaborative productivity app designed to help teams manage projects, tasks, and schedules in one place. This repository contains the **frontend** of Teamly – a modern single-page web application built with React and TypeScript. It serves as the user-facing side of the platform, complementing the Teamly backend API in a full-stack portfolio project. The frontend features a sleek, startup-inspired UI that lets teams coordinate effortlessly, from dashboards and task boards to calendars and team management.

## Features

- **Interactive Team Dashboard:** A personalized dashboard gives users an at-a-glance view of their work. It displays recent **notifications**, assigned tasks, and upcoming events. The notification feed updates in real-time (via WebSockets) so you never miss team invitations or task updates. The dashboard also highlights “My Tasks” – tasks assigned to the logged-in user – and an agenda of upcoming events for the day or week.

- **Team & Project Management:** Organize work by teams and projects. Users can create new teams, invite members via email invite links, and manage team roles. Within each team, create multiple projects to categorize work streams. A Team page shows all projects in that team, each represented as a card with project name and description, and an option to add new projects. Projects can be edited or deleted via an in-app settings menu. This structure lets teams keep tasks organized by project while maintaining clear ownership and access control at the team level.

- **Kanban Boards & Tasks:** Every project contains **Kanban-style boards** for task management. Users can create boards (for example, for different workflows or sprints) and within each board define custom lists (columns). Tasks are represented as cards in these lists. You can add new lists or remove entire boards as needed. The interface supports drag-and-drop, allowing tasks to be moved between lists to update status or category in real time. Each task card shows its status (To Do, In Progress, Done), due date, and priority with color-coded labels. Clicking a task opens detailed information where you can add a description, adjust its status/priority, set a due date, and manage **assignees**. Tasks can be assigned to team members (multiple assignees supported) and are tracked across the app – the “My Tasks” section in the dashboard aggregates all tasks assigned to the current user. The board state is managed efficiently (with Zustand store) to enable smooth drag-drop and real-time UI updates when tasks are created, edited, or moved.

- **Calendar & Events:** Teamly includes a built-in calendar interface for scheduling and viewing events. Users can switch between a full **Calendar view** (monthly/weekly calendar UI) and a concise **Agenda view**. The Calendar (built on **react-big-calendar**) provides a visual timeline of events across teams, with support for drag-and-drop and resizing of events for scheduling changes. Events can span multiple days and include details like title, description, and participating team members. The Agenda view (accessible on the dashboard and project pages) shows upcoming events either for the day or week, with easy navigation controls and filtering. Team members can create events (e.g. meetings, deadlines) associated with specific projects and invite others. Each event card displays its date, time range, and attendees, and allows the creator to edit or delete the event. For convenience, Teamly can **sync with Google Calendar**: users can connect their Google account to import or export events with a single click. This ensures schedules stay up-to-date across platforms.

- **Real-Time Collaboration:** The app is built to feel responsive and live. It uses WebSocket connections for instant updates – for example, when you receive a new team invitation or a task is assigned, a notification appears immediately without needing a page refresh. A notification bell (with unread count) in the sidebar alerts users to new activity. The Notifications panel allows marking items as read and, in the case of team invitations, accepting or declining right in the UI. Teamly also provides instant feedback for actions via toasts (powered by Sonner) – e.g., successful task creation or errors – enhancing the interactive feel. Combined with an optimistic UI update approach (via React Query and Zustand), user actions feel instantaneous. 

- **Modern Design & UX:** The frontend features a clean, modern design with a focus on usability. It employs a responsive layout to work across desktops and tablets (adjusting the sidebar and panels accordingly). A consistent design system is used, including a customizable light/dark theme using CSS variables. Icons from **Lucide React** provide a crisp visual language for navigation and actions (e.g. team, dashboard, calendar icons in the sidebar, plus signs for adding content, etc.). Subtle animations (using Framer Motion) and hover effects give it a polished, app-like feel. Overall, the UI approach is to mimic a professional SaaS product – simple, intuitive, and engaging.

## Tech Stack

This frontend project is built with a modern web stack and tooling:

- **React 19 + TypeScript:** Core framework for building the UI as a single-page application. Written in TypeScript for type-safe code. Bootstrapped with Vite for fast dev server and bundling.
- **React Router v7:** Client-side routing for multi-page feel (login, dashboard, teams, projects, calendar, settings, etc.).
- **State Management:** Uses Context API (for auth and app-wide sync) and **Zustand** for granular state (particularly to manage board/task state efficiently).
- **TanStack React Query:** Simplifies data fetching and caching from the backend API. Custom hooks (e.g. `useFetch*`) wrap query logic for resources like tasks, projects, etc., ensuring the UI automatically updates with server data.
- **Styling:** Combination of modern CSS and utility-first approach. The app uses CSS modules and global variables for themes, and also includes Tailwind CSS (utility classes) for rapid styling in some areas. It supports a toggle-able dark mode and is designed to be responsive.  
- **UI Libraries:** 
  - *Lucide React* for iconography.
  - *React Big Calendar* for the full calendar view component.
  - *Dnd-kit* (and React DnD) for drag-and-drop functionality on Kanban boards.
  - *Framer Motion* for animations, and Sonner for toast notifications.
  - *Date-fns* for date manipulation and formatting.
- **WebSockets:** Utilizes the WebSocket API (with a custom hook) to subscribe to real-time events from the backend (e.g., notification stream). This keeps notifications and other live data in sync without polling.

## Getting Started

Follow these steps to run the Teamly frontend locally:

1. **Clone the Repository:**  
   ```bash
   git clone https://github.com/samypt/productivity-app-frontend.git
   cd productivity-app-frontend
   ```

2. **Install Dependencies:**  
   Make sure you have Node.js installed, then install project dependencies:  
   ```bash
   npm install
   ``` 

3. **Set Up Environment:**  
   Create a `.env` file in the project root (or use environment variables) to configure the API endpoints. At minimum, define:
   ```bash
   VITE_BASE_URL=<backend_api_base_url>
   VITE_WS_BASE_URL=<backend_websocket_url>
   ``` 
   - `VITE_BASE_URL` should point to the base URL of the Teamly backend API (e.g. `http://localhost:8000/`).  
   - `VITE_WS_BASE_URL` should point to the WebSocket endpoint of the backend (e.g. `ws://localhost:8000/`).

4. **Run the Development Server:**  
   Start the app in development mode with Vite:  
   ```bash
   npm run dev
   ```  
   This will launch the app on a local development server (by default at `http://localhost:5173`).

5. **Build for Production (optional):**  
   To create an optimized production build, run:  
   ```bash
   npm run build
   ```  
   This will output static files to the `dist/` directory, which can be deployed to any static hosting or served by a web server.

## Project Structure

Within the `src/` directory:
- **pages/** – High-level views (Dashboard, Teams, Project, Calendar, etc.).
- **components/** – Reusable UI elements organized by feature.
- **store/** – Zustand store for state management.
- **api/** – Custom React Query hooks for API calls.
- **utils/** – Helpers (e.g., date formatting, color generation).
- **hooks/** – Custom logic (e.g., WebSocket subscriptions, auth).

## Contributing

This project is part of a personal portfolio, but issues and pull requests are welcome. Fork the repo and make your changes.

## License

This project is open-source — see the [LICENSE](LICENSE) file for details.

---

*Teamly frontend is a showcase of a modern web app architecture. It demonstrates how a polished, full-featured React application can power team productivity with an intuitive UX and robust real-time capabilities. Be sure to also check out the Teamly backend repository to see the server-side implementation that works in tandem with this frontend.*
