import "./Styles/UserSelectList.css";

export default function UserSelectList({ users, selected, onToggle }) {
  return (
    <div className="user-select-list">
      {users.map((u) => (
        <label key={u.id} className="user-select-item">
          <input
            type="checkbox"
            checked={selected.includes(u.id)}
            onChange={() => onToggle(u.id)}
          />
          {u.username}
        </label>
      ))}
    </div>
  );
}
