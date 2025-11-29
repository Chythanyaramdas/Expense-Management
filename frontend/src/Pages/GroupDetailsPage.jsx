import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosClient";
import PageLayout from "../components/PageLayout";
import MemberList from "../components/MemberList";
import BalanceList from "../components/BalanceList";
import UserSelectList from "../components/UserSelectList";
import { toast } from "react-toastify";

export default function GroupDetails() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [newMemberId, setNewMemberId] = useState("");

  const username = localStorage.getItem("username");

  // Sidebar items
  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: "🏠" },
    { label: "Create Group", path: "/create-group", icon: "➕" },
    { label: "Groups", path: "/groups", icon: "👥" },
    { label: "Activity", path: "/activity", icon: "📊" },
    { label: "Account", path: "/account", icon: "⚙️" },
    { label: "Logout", path: "/login", icon: "🚪", className: "logout" },
  ];

  // Load group details
  const loadGroup = () => {
    axios
      .get(`/group/${groupId}`)
      .then((res) => setGroup(res.data))
      .catch(() => toast.error("Failed to load group"));
  };

  // Load all users (needed for adding new members)
  const loadUsers = () => {
    axios
      .get("/users/all") // Make sure this backend endpoint exists
      .then((res) => setAllUsers(res.data))
      .catch(() => toast.error("Failed to load users"));
  };

  useEffect(() => {
    loadGroup();
    loadUsers();
  }, []);

  // Remove member from group
  const removeMember = (userId) => {
    axios
      .delete(`/group/${groupId}/removeUser/${userId}`)
      .then(() => {
        toast.success("Member removed");
        loadGroup();
      })
      .catch(() => toast.error("Error removing member"));
  };

  // Add new member to group
  const addMember = () => {
    if (!newMemberId) {
      toast.warn("Please select a user");
      return;
    }

    axios
      .post(`/group/${groupId}/addUser/${newMemberId}`)
      .then(() => {
        toast.success("Member added");
        setNewMemberId("");
        loadGroup();
      })
      .catch(() => toast.error("Error adding member"));
  };

  return (
    <PageLayout username={username} menuItems={menuItems}>
      {!group ? (
        <h3>Loading group…</h3>
      ) : (
        <>
          <h2>{group.name}</h2>

          {/* MEMBERS SECTION */}
          <h3>Members</h3>
          <MemberList members={group.members} onRemove={removeMember} />

          {/* ADD USER */}
          <div className="add-member-box">
            <h4>Add New Member</h4>

            <select
              value={newMemberId}
              onChange={(e) => setNewMemberId(e.target.value)}
            >
              <option value="">Select user</option>
              {allUsers
                .filter((u) => !group.members.some((m) => m.id === u.id))
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
            </select>

            <button onClick={addMember} className="add-btn">
              Add Member
            </button>
          </div>

          {/* BALANCES */}
          <h3>Balances</h3>
          <BalanceList balances={group.balances} />
        </>
      )}
    </PageLayout>
  );
}
