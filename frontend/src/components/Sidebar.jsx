import "../Pages/Styles/Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../api/axiosClient";

export default function Sidebar({ username, menuItems }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/users/logout", {}, { withCredentials: true });
      navigate("/login"); // redirect to login page
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="sidebar">
      <h2 className="logo">Splitwise</h2>
      <p className="username">Hello, {username}</p>

      <div className="menu-items">
        {menuItems.map((item, index) =>
          item.label === "Logout" ? (
            // 🔥 LOGOUT AS A BUTTON, NOT NAVLINK
            <button
              key={index}
              className={`menu-item logout ${item.className || ""}`}
              onClick={handleLogout}
            >
              {item.icon} {item.label}
            </button>
          ) : (
            // Normal menu items → NavLink
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `menu-item ${item.className || ""} ${isActive ? "active" : ""}`
              }
            >
              {item.icon} {item.label}
            </NavLink>
          )
        )}
      </div>
    </div>
  );
}
