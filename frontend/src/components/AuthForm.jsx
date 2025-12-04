import "./AuthForm.css";
import { useState } from "react";

export default function AuthForm({ title, form, onChange, onSubmit, buttonText }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>{title}</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={onChange}
            className="auth-input"
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              className="auth-input password-input"
            />

          <span
    className="eye-icon"
    onClick={() => setShowPassword(!showPassword)}
    >
    {showPassword ? "👁️" : "👁‍🗨"}
    </span>

          </div>

          <button type="submit" className="auth-button">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
