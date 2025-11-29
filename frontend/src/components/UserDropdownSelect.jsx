import { useState } from "react";
import "./Styles/UserDropdown.css";

export default function UserDropdownSelect({ users, selected, onToggle }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="dropdown-container">
      <div className="dropdown-box" onClick={() => setOpen(!open)}>
        <span>Select Members</span>
        <span className="arrow">{open ? "▲" : "▼"}</span>
      </div>

      {/* Selected users chips */}
      <div className="selected-list">
        {selected.map(id => {
          const user = users.find(u => u.id === id);
          return (
            <span key={id} className="chip">
              {user.username}
              <button className="remove-btn" onClick={() => onToggle(id)}>×</button>
            </span>
          );
        })}
      </div>

      {open && (
        <div className="dropdown-menu">
          {users.map(u => (
            <div
              key={u.id}
              className={`dropdown-item ${selected.includes(u.id) ? "selected" : ""}`}
              onClick={() => onToggle(u.id)}
            >
              {u.username}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
