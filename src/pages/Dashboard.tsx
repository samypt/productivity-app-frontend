import Agenda from "../components/events/Agenda";
import NotificationList from "../components/notifications/NotificationList";
import MyTasks from "../components/tasks/MyTasks";
import "./Dashboard.style.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <NotificationList />
      <div className="dashboard-grid">
        <MyTasks />
        <Agenda />
      </div>
    </div>
  );
};

export default Dashboard;
