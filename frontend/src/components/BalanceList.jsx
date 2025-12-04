export default function BalanceList({ balances = {}, members = [], onRemoveUser }) {
  const getUser = (id) => members.find(m => m.id === Number(id));

  return (
    <div className="balance-box">
      {Object.entries(balances)
        .map(([userId, bal]) => {
          const user = getUser(userId);
          if (!user) return null; 

          return (
            <div key={userId} className="balance-row">
              <span>{user.username}: ₹{bal}</span>
              {bal === 0 && onRemoveUser && (
                <button className="remove-btn" onClick={() => onRemoveUser(user.id)}>
                  Remove
                </button>
              )}
            </div>
          );
        })}
    </div>
  );
}
