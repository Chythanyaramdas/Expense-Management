import { useEffect, useState } from "react";
import axios from "../api/axiosClient";
import PageLayout from "../components/PageLayout";
import UserDropdownSelect from "../components/UserDropdownSelect";
import { toast } from "react-toastify";
import "./Styles/CreateGroup.css";

export default function CreateGroup() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
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
      .then((res) => setUsername(res.data.username));

    axios.get("/users/all")
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Failed to load users"));
  }, []);

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const createGroup = () => {
    if (!name.trim()) return toast.warn("Enter a group name");
    if (selectedUsers.length === 0) return toast.warn("Select members");

    axios.post("/group/create", { name, userIds: selectedUsers })
      .then(() => {
        toast.success("Group created!");
        setName("");
        setSelectedUsers([]);
      })
      .catch(() => toast.error("Failed to create group"));
  };

  return (
    <PageLayout username={username} menuItems={menuItems}>
      <div className="create-group-container">
        <div className="create-group-card">
          <h2>Create New Group</h2>

          <label>Group Name</label>
          <input
            type="text"
            className="group-input"
            placeholder="Enter group name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <h3>Select Members</h3>
          <UserDropdownSelect
            users={users}
            selected={selectedUsers}
            onToggle={toggleUser}
          />

          <button className="create-btn" onClick={createGroup}>
            Create Group
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
