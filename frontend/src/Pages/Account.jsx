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

  // Load current user
  useEffect(() => {
    axios
      .get("/users/me", { withCredentials: true })
      .then((res) => setUser({ ...res.data, password: "" }))
      .catch(() => console.log("Not logged in"));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ⭐ FIXED update function (username-only update allowed)
  const handleUpdate = async () => {
    try {
      // Build payload
      const payload = {
        username: user.username,
      };

      // ⭐ Only include password if user typed something
      if (user.password && user.password.trim() !== "") {
        payload.password = user.password;
      }

      await axios.put(`/users/${user.id}`, payload, { withCredentials: true });

      toast.success("Profile updated successfully!", {
        position: "top-center",
        autoClose: 1500,
      });

      // Clear password field after update
      setUser((prev) => ({ ...prev, password: "" }));

    } catch (err) {
      toast.error(err.response?.data || "Update failed! Try again.", {
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

            <label>New Password (optional)</label>
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
