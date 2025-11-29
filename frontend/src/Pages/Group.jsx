import { useEffect, useState } from "react";
import axios from "../api/axiosClient";
import PageLayout from "../components/PageLayout";
import GroupCard from "../components/GroupCard";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [username, setUsername] = useState("");

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
      .then((res) => {
        setUsername(res.data.username);
        return axios.get(`/group/user/${res.data.id}`);
      })
      .then((res) => setGroups(res.data))
      .catch(() => console.log("Failed to load groups"));
  }, []);

  return (
    <PageLayout username={username} menuItems={menuItems}>
      <h2>Your Groups</h2>
      {groups.map((g) => (
        <GroupCard key={g.id} group={g} />
      ))}
    </PageLayout>
  );
}
