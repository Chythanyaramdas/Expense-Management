import { Link } from "react-router-dom";
import ".//Styles/GroupCard.css";

export default function GroupCard({ group }) {
  return (
    <Link to={`/group/${group.id}`} className="group-card">
      <div>{group.name}</div>
    </Link>
  );
}
