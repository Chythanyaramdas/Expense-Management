import Sidebar from "../components/Sidebar";
import "./Styles/Dashboard.css";

function Dashboard() {
  // ✅ Get logged-in username from localStorage
  const username = localStorage.getItem("username") || "User";

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: "🏠" },
    { label: "Create Group", path: "/create-group", icon: "➕" },
    { label: "Groups", path: "/groups", icon: "👥" },
    { label: "Activity", path: "/activity", icon: "📊" },
    { label: "Account", path: "/account", icon: "⚙️" },
    { 
      label: "Logout", 
      path: "/login", 
      icon: "🚪", 
      className: "logout",
      onClick: () => localStorage.removeItem("username") // clear username on logout
    },
  ];

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
