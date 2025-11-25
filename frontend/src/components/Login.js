import { useState } from "react";
import axios from "../api/axiosClient";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const loginUser = async () => {
    if (form.username === "" || form.password === "") {
      setError("Username and password are required");
      return;
    }

    try {
      const response = await axios.post("/users/login", form);

      if (response.data === "Login successful") {
        alert("Login successful!");

        // Redirect to dashboard or home
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Login failed. Try again.");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {error && <p className="login-error">{error}</p>}

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        className="login-input"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="login-input"
      />

      <button onClick={loginUser} className="login-button">
        Login
      </button>
    </div>
  );
}
