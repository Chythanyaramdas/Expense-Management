import "../Pages/Styles/Sidebar.css";
import { NavLink } from "react-router-dom";

export default function Sidebar({ username, menuItems }) {
  return (
    <div className="sidebar">
      <h2 className="logo">Splitwise</h2>
      <p className="username">Hello, {username}</p>

      <div className="menu-items">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `menu-item ${item.className ? item.className : ""} ${isActive ? "active" : ""}`
            }
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
