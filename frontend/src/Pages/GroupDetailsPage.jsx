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
  const [userId, setUserId] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [showMembers, setShowMembers] = useState(false);
  const [balances, setBalances] = useState({});
  const [settlements, setSettlements] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const [showSettleBox, setShowSettleBox] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [partialAmount, setPartialAmount] = useState("");

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
        setUsername(res.data.username);
        setUserId(res.data.id);
        setLoadingUser(false);
      })
      .catch(() => setLoadingUser(false));
  }, []);

  useEffect(() => {
    if (!userId) return;
    loadGroup();
    loadUsers();
    loadBalances();
    loadSettlements();
  }, [userId]);

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

  const removeMember = (memberId) => {
    if (!memberId) return toast.error("Invalid member ID");
    if (memberId === userId) return toast.warn("You cannot remove yourself");
    const userBalance = balances[memberId] || 0;
    if (userBalance !== 0) return toast.warn("Cannot remove user with pending balance");

    axios.delete(`/group/${groupId}/removeUser/${memberId}`)
      .then(() => {
        toast.success("Member removed");
        loadGroup();
        loadBalances();
        loadSettlements();
      })
      .catch(err => toast.error(err.response?.data || "Error removing member"));
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
      .catch(err => toast.error(err.response?.data || "Error adding member"));
  };

  const settleUp = (payerId, receiverId, amount) => {
    if (!payerId || !receiverId || !amount) return toast.error("Invalid settlement");

    axios.post("/settle", { groupId, payerId, receiverId, amount })
      .then(() => {
        toast.success("Settlement successful");
        loadBalances();
        loadSettlements();
      })
      .catch(err => toast.error(err.response?.data || "Error settling payment"));
  };

  if (loadingUser) return <h3>Loading user info…</h3>;

  return (
    <PageLayout username={username} menuItems={menuItems}>
      <div className="group-details-wrapper">
        {!group ? <h3>Loading group…</h3> : (
          <>
            <h1 className="group-title">{group.name}</h1>

            <div className="card">
              <div className="card-header" onClick={() => setShowMembers(!showMembers)}>
                <span>👥 View Participants</span>
                <span>{showMembers ? "▲" : "▼"}</span>
              </div>
              {showMembers && (
                <div className="card-body">
                  <MemberList
                    members={group.members.filter(m => m.id != null)}
                    balances={balances}
                    settlements={settlements}
                    onRemove={removeMember}
                  />
                </div>
              )}
            </div>

            <div className="card add-box">
              <h3>Add Member</h3>
              <select value={newMemberId} onChange={e => setNewMemberId(e.target.value)}>
                <option value="">Select user</option>
                {allUsers.filter(u => u.id != null && !group.members.some(m => m.id === u.id))
                  .map(user => <option key={user.id} value={user.id}>{user.username}</option>)}
              </select>
              <button onClick={addMember} className="primary-btn">+ Add Member</button>
            </div>

            <div className="card">
              {!showAddExpense ? (
                <button className="primary-btn" onClick={() => setShowAddExpense(true)}>+ Add Expense</button>
              ) : (
                <AddExpense
                  groupId={groupId}
                  onAdded={() => {
                    loadBalances();     
                    loadSettlements();  
                    setShowAddExpense(false);
                  }}
                  onClose={() => setShowAddExpense(false)}
                />
              )}
            </div>

            <div className="card">
              <h3>Group Balances</h3>
              <BalanceList
                balances={balances}
                members={group.members.filter(m => m.id != null)}
                onRemoveUser={removeMember}
              />
            </div>

            <div className="card">
              <h3>Who Owes Whom</h3>
              {settlements.length === 0 ? (
                <p>No pending settlements 🎉</p>
              ) : settlements.map(s => (
                <div key={`${s.payerId}-${s.receiverId}`} className="settlement-row">
                  <span>{s.payerName} owes {s.receiverName} ₹{s.amount}</span>
                  <button
                    className="remove-btn"
                    onClick={() => {
                      setSelectedSettlement(s);
                      setPartialAmount(s.amount);
                      setShowSettleBox(true);
                    }}
                  >Settle</button>
                </div>
              ))}
            </div>

            {showSettleBox && selectedSettlement && (
              <div className="modal-backdrop">
                <div className="modal-box">
                  <h3>Settle Payment</h3>
                  <p>{selectedSettlement.payerName} → {selectedSettlement.receiverName}</p>
                  <input
                    type="number"
                    value={partialAmount}
                    min="1"
                    max={selectedSettlement.amount}
                    onChange={e => setPartialAmount(e.target.value)}
                  />
                  <div className="modal-actions">
                    <button
                      className="primary-btn"
                      onClick={() => {
                        settleUp(selectedSettlement.payerId, selectedSettlement.receiverId, parseFloat(partialAmount));
                        setShowSettleBox(false);
                      }}
                    >Confirm</button>
                    <button className="secondary-btn" onClick={() => setShowSettleBox(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

          </>
        )}
      </div>
    </PageLayout>
  );
}
