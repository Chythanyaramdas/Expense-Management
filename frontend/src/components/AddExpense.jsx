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

  /* -------------------- LOAD MEMBERS -------------------- */
  useEffect(() => {
    axios.get(`/group/${groupId}`)
      .then(res => setMembers(res.data.members))
      .catch(() => toast.error("Failed to load members"));
  }, [groupId]);

  /* ------------------- AUTO ADD PAYER -------------------- */
  useEffect(() => {
    if (paidById && !participants.includes(paidById)) {
      setParticipants((prev) => [...prev, paidById]);
    }
  }, [paidById]);

  /* ---------------------- SELECT PARTICIPANT ---------------------- */
  const addParticipant = (id) => {
    if (!participants.includes(id)) {
      setParticipants([...participants, id]);
    }
  };

  const removeParticipant = (id) => {
    if (id === paidById) {
      toast.warn("Payer must be a participant.");
      return;
    }
    setParticipants(participants.filter(p => p !== id));
  };

  /* ----------------------- SUBMIT ----------------------- */
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
        onAdded();
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
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="number"
        placeholder="Total amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Paid By */}
      <label>Paid By</label>
      <select
        value={paidById}
        onChange={(e) => setPaidById(Number(e.target.value))}
      >
        <option value="">Select user</option>
        {members.map(m => (
          <option key={m.id} value={m.id}>{m.username}</option>
        ))}
      </select>

      {/* PARTICIPANT DROPDOWN + CHIPS */}
      <label>Participants</label>
      <div className="participant-box">

        {/* Dropdown to add */}
        <select
          className="participant-dropdown"
          onChange={(e) => addParticipant(Number(e.target.value))}
        >
          <option value="">Select participant</option>
          {members
            .filter(m => !participants.includes(m.id))
            .map(m => (
              <option key={m.id} value={m.id}>
                {m.username}
              </option>
            ))}
        </select>

        {/* Chips */}
        <div className="participant-chips">
          {participants.map(id => {
            const user = members.find(u => u.id === id);
            return (
              <div key={id} className="chip">
                {user?.username}
                {id !== paidById && (
                  <button
                    className="chip-remove"
                    onClick={() => removeParticipant(id)}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SPLIT TYPE */}
      <label>Split Type</label>
      <div className="split-options">
        <label>
          <input
            type="radio"
            value="EQUAL"
            checked={splitType === "EQUAL"}
            onChange={() => setSplitType("EQUAL")}
          />
          Equal
        </label>

        <label>
          <input
            type="radio"
            value="EXACT"
            checked={splitType === "EXACT"}
            onChange={() => setSplitType("EXACT")}
          />
          Exact
        </label>
      </div>

      {/* EXACT SHARES */}
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
                  onChange={(e) =>
                    setExactShares({
                      ...exactShares,
                      [id]: Number(e.target.value)
                    })
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
