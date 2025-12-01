// src/components/settlement/SettleUpButton.jsx
import { useState } from "react";
import SettleModal from "./SettlementModal";

export default function SettleUpButton({ groupId, payerId, receiverId, amount, onSettled }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="primary-btn" onClick={() => setOpen(true)}>Settle Up</button>
      {open && (
        <SettleModal
          groupId={groupId}
          payerId={payerId}
          receiverId={receiverId}
          amount={amount}
          onClose={() => setOpen(false)}
          onSettled={() => {
            setOpen(false);
            onSettled();
          }}
        />
      )}
    </>
  );
}
