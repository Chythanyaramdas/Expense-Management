

export default function BalanceList({ balances, members }) {

  const getName = (id) => {
    const user = members.find(m => m.id == id);
    return user ? user.username : "Unknown User";
  };

  return (
    <div className="balance-box">
      {Object.entries(balances).map(([userId, bal]) => (
        <div key={userId} className="balance-row">
          {getName(userId)}: ₹{bal}
        </div>
      ))}
    </div>
  );
}

