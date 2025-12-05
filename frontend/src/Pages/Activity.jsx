import { useEffect, useState } from "react";
import axios from "../api/axiosClient";
import PageLayout from "../components/PageLayout";
import "./Styles/Activity.css";
import { toast } from "react-toastify";

export default function Activity() {
  const [activities, setActivities] = useState([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);

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
        setUserId(me.data.id);

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

  const clearAllActivities = () => {
    toast.info(
      <div style={{ textAlign: "center" }}>
        <p style={{ marginBottom: "10px" }}>Are you sure you want to clear all activity?</p>

        <button
          onClick={async () => {
            try {
              await axios.delete(`/activity/user/${userId}/clear`);
              setActivities([]);
              toast.dismiss();
              toast.success("Activity cleared successfully");
            } catch (err) {
              toast.dismiss();
              toast.error("Failed to clear activity");
            }
          }}
          style={{
            padding: "6px 12px",
            marginRight: "8px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Yes
        </button>

        <button
          onClick={() => toast.dismiss()}
          style={{
            padding: "6px 12px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        draggable: false,
        closeOnClick: false,
      }
    );
  };

  return (
    <PageLayout username={username} menuItems={menuItems}>
      <div className="activity-container">
        <h2>Recent Activity</h2>

        {activities.length > 0 && (
          <button className="clear-btn" onClick={clearAllActivities}>
            Clear All Activity
          </button>
        )}

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
