import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { AppSyncProvider } from "../../store/AppSyncProvider";
import "./MainLayout.style.css";

export default function MainLayout() {
  return (
    <AppSyncProvider>
      <Topbar />
      <Sidebar />
      <div className="layout">
        <main className="page-content">
          <Outlet />
          <div id="modal-root" /> {/* To center modals in the layout*/}
        </main>
      </div>
    </AppSyncProvider>
  );
}
