import React from "react";
import "./AuthForm.css";

export default function AuthForm({ title, form, onChange, onSubmit, buttonText }) {
  return (
    <div className="auth-container">
      <h2>{title}</h2>

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={onChange}
        className="auth-input"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={onChange}
        className="auth-input"
      />

      <button onClick={onSubmit} className="auth-button">
        {buttonText}
      </button>
    </div>
  );
}
