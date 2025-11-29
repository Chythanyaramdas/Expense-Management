import Sidebar from "../components/Sidebar";
import "./Styles/Dashboard.css";
import { useEffect, useState } from "react";
import axios from "../api/axiosClient";

function Dashboard() {
  const [username, setUsername] = useState("User");

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: "🏠" },
    { label: "Create Group", path: "/create-group", icon: "➕" },
    { label: "Groups", path: "/groups", icon: "👥" },
    { label: "Activity", path: "/activity", icon: "📊" },
    { label: "Account", path: "/account", icon: "⚙️" },
    { label: "Logout", path: "/login", icon: "🚪", className: "logout" },
  ];

  useEffect(() => {
    axios.get("/users/me", { withCredentials: true })
      .then(res => setUsername(res.data.username))
      .catch(err => console.log("Not logged in"));
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar username={username} menuItems={menuItems} />
      <div className="main-content">
        <h1>Welcome, {username} 👋</h1>
        <p>Select an option from the left menu.</p>
      </div>
    </div>
  );
}

export default Dashboard;
