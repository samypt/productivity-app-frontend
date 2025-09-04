import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./store/AuthProvider";
import MainLayout from "./components/layout/MainLayout";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Singup";
import Home from "./pages/Home";
import Teams from "./pages/Teams";
import { Toaster } from "sonner";
import TeamPage from "./pages/TeamPage";
import ProjectPage from "./pages/ProjectPage";
import MyCalendar from "./pages/MyCalendar";
import "./App.css";
import { GoogleCallback } from "./pages/GoogleCallback";
import UserSettingsPage from "./pages/UserSettingsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Signin />} />
          <Route path="/singup" element={<Signup />} />
          <Route path="/singup/:inviteToken" element={<Signup />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:id" element={<TeamPage />} />
            <Route
              path="/teams/:teamID/projects/:projectID"
              element={<ProjectPage />}
            />
            <Route path="/calendar" element={<MyCalendar />} />
            <Route path="/google/callback" element={<GoogleCallback />} />
            <Route path="/settings" element={<UserSettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
