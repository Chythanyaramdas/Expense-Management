import { useEffect, useState } from "react";
import axios from "../api/axiosClient";
import PageLayout from "../components/PageLayout";
import { toast } from "react-toastify";
import "./Styles/CreateGroup.css";
import UserDropdownSelect from "../components/UserDropdownSelect";

export default function CreateGroup({ onGroupsUpdate }) {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

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
      .then(res => {
        if (!res.data || !res.data.id) throw new Error("Invalid user data");
        setUsername(res.data.username);
        setUserId(res.data.id);
        setSelectedUsers([res.data.id]);
        setLoadingUser(false);
      })
      .catch(() => {
        toast.error("Failed to get logged-in user");
        setLoadingUser(false);
      });

    axios.get("/users/all")
      .then(res => {
        const allUsers = Array.isArray(res.data) 
          ? res.data.filter(u => u && u.id && u.username) 
          : [];
        setUsers(allUsers);
      })
      .catch(() => toast.error("Failed to load users"));
  }, []);

  const toggleUser = (id) => {
    if (id === userId) return;
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const createGroup = async () => {
    if (!name.trim()) return toast.warn("Enter a group name");
    if (!userId) return toast.error("User ID not loaded yet");

    try {
      await axios.post("/group/create", { name, userIds: selectedUsers, creatorId: userId });
      toast.success("Group created!");
      setName("");
      setSelectedUsers([userId]);
      if (onGroupsUpdate) onGroupsUpdate();
    } catch (err) {
      toast.error(err.response?.data || "Failed to create group");
    }
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
            loggedInUserId={userId} 
          />

          <button
            className="create-btn"
            onClick={createGroup}
            disabled={loadingUser}
          >
            Create Group
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
