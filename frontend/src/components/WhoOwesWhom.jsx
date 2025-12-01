// src/components/settlement/WhoOwesWhom.jsx
import SettleUpButton from "./SettlementButton";

export default function WhoOwesWhom({ balances, members, groupId, onSettled }) {
  if (!balances || Object.keys(balances).length === 0) return <p>No pending settlements 🎉</p>;

  return (
    <div>
      {Object.keys(balances).map((debtorId) => {
        const creditors = balances[debtorId];
        return Object.keys(creditors).map((creditorId) => {
          const amount = creditors[creditorId];
          if (!amount || amount <= 0) return null;

          const debtor = members.find(m => m.id === parseInt(debtorId));
          const creditor = members.find(m => m.id === parseInt(creditorId));

          return (
            <div key={`${debtorId}-${creditorId}`} className="settlement-row">
              {debtor?.username} owes {creditor?.username} ₹{amount}
              <SettleUpButton
                groupId={groupId}
                payerId={debtor.id}
                receiverId={creditor.id}
                amount={amount}
                onSettled={onSettled}
              />
            </div>
          );
        });
      })}
    </div>
  );
}
