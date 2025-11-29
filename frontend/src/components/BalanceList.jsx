

export default function BalanceList({ balances }) {
  return (
    <div className="balance-box">
      {Object.entries(balances).map(([userId, bal]) => (
        <div key={userId} className="balance-row">
          User {userId}: ₹{bal}
        </div>
      ))}
    </div>
  );
}
