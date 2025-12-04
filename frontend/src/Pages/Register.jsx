import AuthForm from "../components/AuthForm";
import { useState } from "react";
import axios from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerUser = async () => {
    if (!form.username || !form.password) {
      toast.error("Username and password cannot be empty");
      return;
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(form.password)) {
      toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special symbol."
      );
      return;
    }

    try {
      await axios.post("/users/register", form);

      toast.success("User registered successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      toast.error(err.response?.data || "Registration failed. Try again.");
    }
  };

  return (
    <AuthForm
      title="Register"
      form={form}
      onChange={handleChange}
      onSubmit={registerUser}
      buttonText="Register"
    />
  );
}
