import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosClient";
import PageLayout from "../components/PageLayout";
import MemberList from "../components/MemberList";
import BalanceList from "../components/BalanceList";
import AddExpense from "../components/AddExpense";
import { toast } from "react-toastify";
import "./Styles/GroupDetails.css";
 
export default function GroupDetailsPage() {
  const { groupId } = useParams();
 
  const [group, setGroup] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [newMemberId, setNewMemberId] = useState("");
  const [username, setUsername] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [balances, setBalances] = useState({});
  const [settlements, setSettlements] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
 
  // NEW STATES for partial settlement
  const [showSettleBox, setShowSettleBox] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [partialAmount, setPartialAmount] = useState("");
 
  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: "🏠" },
    { label: "Create Group", path: "/create-group", icon: "➕" },
    { label: "Groups", path: "/groups", icon: "👥" },
    { label: "Activity", path: "/activity", icon: "📊" },
    { label: "Account", path: "/account", icon: "⚙️" },
    { label: "Logout", path: "/login", icon: "🚪", className: "logout" }
  ];
 
  /* ---------------- API CALLS ---------------- */
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
 
  const loadBalances = () => {
    axios.get(`/expense/balances/${groupId}`)
      .then(res => setBalances(res.data))
      .catch(() => toast.error("Failed to load balances"));
  };
 
  const loadSettlements = () => {
    axios.get(`/expense/settlements/${groupId}`)
      .then(res => setSettlements(res.data))
      .catch(() => toast.error("Failed to load settlements"));
  };
 
  useEffect(() => {
    axios.get("/users/me", { withCredentials: true })
      .then(res => setUsername(res.data.username))
      .catch(() => setUsername("User"));
 
    loadGroup();
    loadUsers();
    loadBalances();
    loadSettlements();
  }, []);
 
  /* --------------- MEMBER ACTIONS --------------- */
  const removeMember = (userId) => {
    axios.delete(`/group/${groupId}/removeUser/${userId}`)
      .then(() => {
        toast.success("Member removed");
        loadGroup();
        loadBalances();
        loadSettlements();
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
        loadBalances();
        loadSettlements();
      })
      .catch(() => toast.error("Error adding member"));
  };
 
  /* --------------- SETTLE ACTION (supports partial) --------------- */
  const settleUp = (payerId, receiverId, amount) => {
    axios.post("/settle", { groupId, payerId, receiverId, amount })
      .then(() => {
        toast.success("Settlement successful");
        loadBalances();
        loadSettlements();
      })
      .catch(() => toast.error("Error settling payment"));
  };
 
  /* -------------------- RENDER -------------------- */
  return (
    <PageLayout username={username} menuItems={menuItems}>
      <div className="group-details-wrapper">
 
        {!group ? (
          <h3>Loading group…</h3>
        ) : (
          <>
            <h1 className="group-title">{group.name}</h1>
 
            {/* PARTICIPANTS */}
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
 
            {/* ADD MEMBER */}
            <div className="card add-box">
              <h3>Add Member</h3>
              <select value={newMemberId} onChange={e => setNewMemberId(e.target.value)}>
                <option value="">Select user</option>
                {allUsers.filter(u => !group.members.some(m => m.id === u.id))
                  .map(user => <option key={user.id} value={user.id}>{user.username}</option>)}
              </select>
              <button onClick={addMember} className="primary-btn">+ Add Member</button>
            </div>
 
            {/* ADD EXPENSE */}
            <div className="card">
              {!showAddExpense ? (
                <button className="primary-btn" onClick={() => setShowAddExpense(true)}>+ Add Expense</button>
              ) : (
                <AddExpense
                  groupId={groupId}
                  onAdded={() => { loadBalances(); loadSettlements(); setShowAddExpense(false); }}
                  onClose={() => setShowAddExpense(false)}
                />
              )}
            </div>
 
            {/* BALANCES */}
            <div className="card">
              <h3>Group Balances</h3>
              <BalanceList balances={balances} members={group.members} />
            </div>
 
            {/* WHO OWES WHOM */}
            <div className="card">
              <h3>Who Owes Whom</h3>
 
              {settlements.length === 0 ? (
                <p>No pending settlements 🎉</p>
              ) : (
                settlements.map(s => (
                  <div key={`${s.payerId}-${s.receiverId}`} className="settlement-row">
                    {s.payerName} owes {s.receiverName} ₹{s.amount}
 
                    <button
                      className="settle-btn"
                      onClick={() => {
                        setSelectedSettlement(s);
                        setPartialAmount(s.amount);
                        setShowSettleBox(true);
                      }}
                    >
                      Settle
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
 
        {/* MODAL FOR PARTIAL SETTLEMENT */}
        {showSettleBox && (
          <div className="modal-backdrop">
            <div className="modal-box">
              <h3>Settle Payment</h3>
 
              <p>
                {selectedSettlement.payerName} → {selectedSettlement.receiverName}
              </p>
 
              <input
                type="number"
                value={partialAmount}
                min="1"
                max={selectedSettlement.amount}
                onChange={(e) => setPartialAmount(e.target.value)}
              />
 
              <div className="modal-actions">
                <button
                  className="primary-btn"
                  onClick={() => {
                    settleUp(
                      selectedSettlement.payerId,
                      selectedSettlement.receiverId,
                      parseFloat(partialAmount)
                    );
                    setShowSettleBox(false);
                  }}
                >
                  Confirm
                </button>
 
                <button className="secondary-btn" onClick={() => setShowSettleBox(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
 
      </div>
    </PageLayout>
  );
}