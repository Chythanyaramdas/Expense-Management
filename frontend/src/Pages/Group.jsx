import { useEffect, useState } from "react";
import axios from "../api/axiosClient";
import PageLayout from "../components/PageLayout";
import GroupCard from "../components/GroupCard";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: "🏠" },
    { label: "Create Group", path: "/create-group", icon: "➕" },
    { label: "Groups", path: "/groups", icon: "👥" },
    { label: "Activity", path: "/activity", icon: "📊" },
    { label: "Account", path: "/account", icon: "⚙️" },
    { label: "Logout", path: "/login", icon: "🚪", className: "logout" },
  ];

  const fetchGroups = async (id) => {
    try {
      const res = await axios.get(`/group/user/${id}`, { withCredentials: true });
      setGroups(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load groups:", err);
    }
  };

  useEffect(() => {
    const fetchUserAndGroups = async () => {
      try {
        const meRes = await axios.get("/users/me", { withCredentials: true });
        const id = Number(meRes.data.id);
        setUsername(meRes.data.username);
        setUserId(id);

        fetchGroups(id); // fetch groups for logged-in user
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };
    fetchUserAndGroups();
  }, []);

  const handleDeleteGroup = async (groupId) => {
    try {
      await axios.delete(`/group/${groupId}`, { withCredentials: true });
      setGroups(groups.filter(g => g.id !== groupId));
    } catch (err) {
      alert(err.response?.data || "Failed to delete group");
    }
  };

  return (
    <PageLayout username={username} menuItems={menuItems}>
      <h2>Your Groups</h2>
      {groups.length === 0 ? (
        <p>No groups found</p>
      ) : (
        groups.map((g) => (
          <GroupCard key={g.id} group={g} onDelete={handleDeleteGroup} />
        ))
      )}
    </PageLayout>
  );
}
