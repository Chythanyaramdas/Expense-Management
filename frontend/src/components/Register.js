import { useState } from "react";
import axios from "../api/axiosClient";
import "./Register.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
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

  const registerUser = async () => {
    if (form.username === "" || form.password === "") {
      setError("Username and password cannot be empty");
      return;
    }

    try {
      await axios.post("/users/register", form);

      alert("User registered successfully!");

      // Redirect to login page
      navigate("/login");

    } catch (error) {
      setError("Registration failed. User may already exist.");
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>

      {error && <p className="error">{error}</p>}

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        className="register-input"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="register-input"
      />

      <button onClick={registerUser} className="register-button">
        Register
      </button>
    </div>
  );
}

