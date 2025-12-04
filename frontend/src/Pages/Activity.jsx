import { useEffect, useState } from "react";
import axios from "../api/axiosClient";
import PageLayout from "../components/PageLayout";
import "./Styles/Activity.css";

export default function Activity() {
  const [activities, setActivities] = useState([]);
  const [username, setUsername] = useState("");

  const menuItems = [
    { label: "Dashboard", icon: "🏠", path: "/dashboard" },
    { label: "Create Group", icon: "➕", path: "/create-group" },
    { label: "Groups", icon: "👥", path: "/groups" },
    { label: "Activity", icon: "📊", path: "/activity" },
    { label: "Account", icon: "⚙️", path: "/account" },
    { label: "Logout", icon: "🚪", path: "/login", className: "logout" },
  ];

  useEffect(() => {
    const loadUser = async () => {
      try {
        const me = await axios.get("/users/me");
        setUsername(me.data.username);

        const activityRes = await axios.get(`/activity/user/${me.data.id}`);
        setActivities(activityRes.data);

      } catch (err) {
        if (err.response?.status === 401) {
          window.location.href = "/login";
        }
      }
    };
    loadUser();
  }, []);

  return (
    <PageLayout username={username} menuItems={menuItems}>
      <div className="activity-container">
        <h2>Recent Activity</h2>

        {activities.length === 0 ? (
          <p className="no-activity">No recent activity</p>
        ) : (
          <ul className="activity-list">
            {activities.map((a) => (
              <li key={a.id} className="activity-item">
                <div className="activity-time">
                  {new Date(a.timestamp).toLocaleString()}
                </div>
                <div className="activity-message">{a.message}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageLayout>
  );
}
