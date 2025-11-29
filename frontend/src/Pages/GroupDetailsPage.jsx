import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosClient";
import PageLayout from "../components/PageLayout";
import MemberList from "../components/MemberList";
import BalanceList from "../components/BalanceList";
import { toast } from "react-toastify";
import "./Styles/GroupDetails.css";

export default function GroupDetails() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [newMemberId, setNewMemberId] = useState("");
  const [username, setUsername] = useState("");
  const [showMembers, setShowMembers] = useState(false);

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: "🏠" },
    { label: "Create Group", path: "/create-group", icon: "➕" },
    { label: "Groups", path: "/groups", icon: "👥" },
    { label: "Activity", path: "/activity", icon: "📊" },
    { label: "Account", path: "/account", icon: "⚙️" },
    { label: "Logout", path: "/login", icon: "🚪", className: "logout" },
  ];

  const loadGroup = () => {
    axios.get(`/group/${groupId}`)
      .then(res => setGroup(res.data))
      .catch(() => toast.error("Failed to load group"));
  };

  const loadUsers = () => {
    axios.get("/users/all")
      .then(res => setAllUsers(res.data))
      .catch(() => toast.error("Failed to load users"));
  };

  useEffect(() => {
    axios.get("/users/me", { withCredentials: true })
      .then(res => setUsername(res.data.username))
      .catch(() => setUsername("User"));

    loadGroup();
    loadUsers();
  }, []);

  const removeMember = (userId) => {
    axios.delete(`/group/${groupId}/removeUser/${userId}`)
      .then(() => {
        toast.success("Member removed");
        loadGroup();
      })
      .catch(() => toast.error("Error removing member"));
  };

  const addMember = () => {
    if (!newMemberId) return toast.warn("Please select a user");

    axios.post(`/group/${groupId}/addUser/${newMemberId}`)
      .then(() => {
        toast.success("Member added");
        setNewMemberId("");
        loadGroup();
      })
      .catch(() => toast.error("Error adding member"));
  };

  return (
    <PageLayout username={username} menuItems={menuItems}>
      <div className="group-details-wrapper">

        {!group ? (
          <h3>Loading group…</h3>
        ) : (
          <>
            {/* GROUP NAME */}
            <h1 className="group-title">{group.name}</h1>

            {/* PARTICIPANTS COLLAPSIBLE */}
            <div className="card">
              <div className="card-header" onClick={() => setShowMembers(!showMembers)}>
                <span>👥 View Participants</span>
                <span>{showMembers ? "▲" : "▼"}</span>
              </div>

              {showMembers && (
                <div className="card-body">
                  <MemberList members={group.members} onRemove={removeMember} />
                </div>
              )}
            </div>

            {/* ADD MEMBER BOX */}
            <div className="card add-box">
              <h3>Add Member</h3>

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

              <button onClick={addMember} className="primary-btn">
                Add Member
              </button>
            </div>

            {/* BALANCES */}
            <div className="card">
              <h3>Balances</h3>
              <BalanceList balances={group.balances} />
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
