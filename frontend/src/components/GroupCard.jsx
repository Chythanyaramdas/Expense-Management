import { Link } from "react-router-dom";
import "./Styles/GroupCard.css";

export default function GroupCard({ group, onDelete }) {
  return (
    <div className="group-card-wrapper">
      <Link to={`/group/${group.id}`} className="group-card">
        <div>{group.name}</div>
      </Link>

      {onDelete && (
        <button
          className="delete-btn"
          onClick={() => onDelete(group.id)}
        >
          Delete
        </button>
      )}
    </div>
  );
}
