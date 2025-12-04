import { useState } from "react";
import "./Styles/UserDropdown.css";

export default function UserDropdownSelect({ users = [], selected = [], onToggle, loggedInUserId }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="dropdown-container">
      <div className="dropdown-box" onClick={() => setOpen(!open)}>
        <span>Select Members</span>
        <span className="arrow">{open ? "▲" : "▼"}</span>
      </div>

      <div className="selected-list">
        {selected.map(id => {
          const user = users.find(u => u?.id === id);
          if (!user) return null;
          return (
            <span key={id} className="chip">
              {user.username} {id === loggedInUserId ? "(You)" : ""}
              <button className="remove-btn" onClick={() => onToggle(id)}>×</button>
            </span>
          );
        })}
      </div>

      {open && (
        <div className="dropdown-menu">
          {users.map(u => {
            if (!u) return null;
            const isSelected = selected.includes(u.id);
            return (
              <div
                key={u.id}
                className={`dropdown-item ${isSelected ? "selected" : ""}`}
                onClick={() => onToggle(u.id)}
              >
                {u.username} {u.id === loggedInUserId ? "(You)" : ""}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
