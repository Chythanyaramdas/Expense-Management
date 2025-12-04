import AuthForm from "../components/AuthForm";
import { useState } from "react";
import axios from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loginUser = async () => {
    if (!form.username || !form.password) {
      toast.error("Username and password are required");
      return;
    }

    try {
      await axios.post("/users/login", form, { withCredentials: true });

      toast.success("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 100);

    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <AuthForm
      title="Login"
      form={form}
      onChange={handleChange}
      onSubmit={loginUser}
      buttonText="Login"
    />
  );
}
