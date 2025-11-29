
import "./Styles/MemberList.css";

export default function MemberList({ members, onRemove }) {
  return (
    <div>
      {members.map(user => (
        <div key={user.id} className="member-row">
          <span>{user.username}</span>
          {onRemove && (
            <button className="remove-btn" onClick={() => onRemove(user.id)}>
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
