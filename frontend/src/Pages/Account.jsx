import { useState, useEffect } from "react";
import axios from "../api/axiosClient";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import "./Styles/Account.css";

export default function Account() {
  const [user, setUser] = useState({ id: "", username: "", password: "" });

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: "🏠" },
    { label: "Create Group", path: "/create-group", icon: "➕" },
    { label: "Groups", path: "/groups", icon: "👥" },
    { label: "Activity", path: "/activity", icon: "📊" },
    { label: "Account", path: "/account", icon: "⚙️" },
    { label: "Logout", path: "/login", icon: "🚪", className: "logout" },
  ];

  useEffect(() => {
    axios
      .get("/users/me", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => console.log("Not logged in"));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/users/${user.id}`, user, { withCredentials: true });

      toast.success("Profile updated successfully!", {
        position: "top-center",
        autoClose: 1500,
      });
    } catch (err) {
      toast.error("Update failed! Try again.", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  return (
    <div className="account-container">
      <Sidebar username={user.username || "User"} menuItems={menuItems} />

      <div className="account-content">
        <div className="account-card">
          <h2>Account Details</h2>

          <form className="account-form" onSubmit={(e) => e.preventDefault()}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              placeholder="Enter new username"
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />

            <button className="update-btn" onClick={handleUpdate}>
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
