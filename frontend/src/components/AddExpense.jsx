import React, { useEffect, useState } from "react";
import axios from "../api/axiosClient";
import { toast } from "react-toastify";
import "./Styles/AddExpense.css";

export default function AddExpense({ groupId, onAdded, onClose }) {
  const [members, setMembers] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidById, setPaidById] = useState("");
  const [participants, setParticipants] = useState([]);
  const [splitType, setSplitType] = useState("EQUAL");
  const [exactShares, setExactShares] = useState({});

  // Load group members
  useEffect(() => {
    axios.get(`/group/${groupId}`)
      .then(res => setMembers(res.data.members))
      .catch(() => toast.error("Failed to load members"));
  }, [groupId]);

  // Automatically add payer to participants
  useEffect(() => {
    if (paidById && !participants.includes(paidById)) {
      setParticipants(prev => [paidById, ...prev]);
      setExactShares(prev => ({ ...prev, [paidById]: prev[paidById] || Number(amount) || 0 }));
    }
  }, [paidById]);

  const addParticipant = (id) => {
    if (!participants.includes(id)) {
      setParticipants([...participants, id]);
      if (splitType === "EXACT") setExactShares(prev => ({ ...prev, [id]: 0 }));
    }
  };

  const removeParticipant = (id) => {
    if (id === paidById) {
      toast.warn("Payer must be a participant.");
      return;
    }
    setParticipants(participants.filter(p => p !== id));
    if (splitType === "EXACT") {
      const copy = { ...exactShares };
      delete copy[id];
      setExactShares(copy);
    }
  };

  const submitExpense = () => {
    if (!title || !amount || !paidById || participants.length === 0) {
      return toast.warn("Please fill all fields");
    }

    axios.post("/expense/add", {
      groupId,
      title,
      totalAmount: Number(amount),
      paidById,
      splitType,
      participantIds: participants,
      exactShares: splitType === "EXACT" ? exactShares : null
    })
      .then(() => {
        toast.success("Expense added!");
        onAdded(); // Refresh balances & settlements
        onClose();
      })
      .catch(() => toast.error("Failed to add expense"));
  };

  return (
    <div className="add-expense-form">
      <h3>Add Expense</h3>

      <input
        type="text"
        placeholder="Expense title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <input
        type="number"
        placeholder="Total amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <label>Paid By</label>
      <select value={paidById} onChange={e => setPaidById(Number(e.target.value))}>
        <option value="">Select user</option>
        {members.map(m => (
          <option key={m.id} value={m.id}>{m.username}</option>
        ))}
      </select>

      <label>Participants</label>
      <div className="participant-box">
        <select
          className="participant-dropdown"
          onChange={e => addParticipant(Number(e.target.value))}
        >
          <option value="">Select participant</option>
          {members.filter(m => !participants.includes(m.id)).map(m => (
            <option key={m.id} value={m.id}>{m.username}</option>
          ))}
        </select>

        <div className="participant-chips">
          {participants.map(id => {
            const user = members.find(u => u.id === id);
            return (
              <div key={id} className="chip">
                {user?.username}
                {id !== paidById && (
                  <button className="chip-remove" onClick={() => removeParticipant(id)}>×</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <label>Split Type</label>
      <div className="split-options">
        <label>
          <input
            type="radio"
            value="EQUAL"
            checked={splitType === "EQUAL"}
            onChange={() => setSplitType("EQUAL")}
          /> Equal
        </label>

        <label>
          <input
            type="radio"
            value="EXACT"
            checked={splitType === "EXACT"}
            onChange={() => setSplitType("EXACT")}
          /> Exact
        </label>
      </div>

      {splitType === "EXACT" && (
        <div className="exact-share-box">
          <h4>Enter exact shares</h4>
          {participants.map(id => {
            const user = members.find(u => u.id === id);
            return (
              <div key={id}>
                {user.username}:
                <input
                  type="number"
                  value={exactShares[id] || ""}
                  onChange={e =>
                    setExactShares({ ...exactShares, [id]: Number(e.target.value) })
                  }
                />
              </div>
            );
          })}
        </div>
      )}

      <button className="primary-btn" onClick={submitExpense}>Add Expense</button>
      <button className="secondary-btn" onClick={onClose}>Cancel</button>
    </div>
  );
}
