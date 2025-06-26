import MyEvents from "../components/events/MyEvents";
import NotificationList from "../components/notifications/NotificationList";
import MyTasks from "../components/tasks/MyTasks";
import "./Dashboard.style.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* <h1 className="dashboard-title">Dashboard</h1> */}
      <NotificationList />
      <div className="dashboard-grid">
        <MyTasks />
        <MyEvents />
      </div>
    </div>
  );
};

export default Dashboard;
