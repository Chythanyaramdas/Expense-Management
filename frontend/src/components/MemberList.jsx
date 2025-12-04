export default function MemberList({ members = [], balances = {}, settlements = [], onRemove }) {
  return (
    <div>
      {members.map(user => {
        if (!user?.id) return null;
        const userBalance = balances[user.id] || 0;
        const hasPending = settlements.some(s => s.payerId === user.id || s.receiverId === user.id);
        return (
          <div key={user.id} className="member-row">
            <span>{user.username}</span>
            {onRemove && userBalance === 0 && !hasPending && (
              <button className="remove-btn" onClick={() => onRemove(user.id)}>Remove</button>
            )}
          </div>
        );
      })}
    </div>
  );
}
