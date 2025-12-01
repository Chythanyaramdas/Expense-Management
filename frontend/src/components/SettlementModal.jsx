
import { useState } from "react";
import axios from "../api/axiosClient";
import { toast } from "react-toastify";
import "./Styles/Settlement.css";

export default function SettleModal({ groupId, payerId, receiverId, amount, onClose, onSettled }) {
  const [payAmount, setPayAmount] = useState(amount);

  const handleSettle = async () => {
    if (!payAmount || payAmount <= 0) return toast.warn("Enter valid amount");

    try {
      await axios.post(`/settle`, null, {
        params: { groupId, payerId, receiverId, amount: payAmount }
      });
      toast.success("Settlement successful!");
      onSettled(); // reload balances + settlements
    } catch (err) {
      toast.error("Failed to settle payment");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Settle Payment</h2>
        <p><strong>Payer:</strong> User #{payerId}</p>
        <p><strong>Receiver:</strong> User #{receiverId}</p>
        <input
          type="number"
          value={payAmount}
          onChange={(e) => setPayAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <div className="modal-actions">
          <button className="primary-btn" onClick={handleSettle}>Confirm</button>
          <button className="secondary-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
