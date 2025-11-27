import "./AuthForm.css";

export default function AuthForm({ title, form, onChange, onSubmit, buttonText }) {
  return (
    <div className="auth-page">  {/* Wrap the form in auth-page */}
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

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            className="auth-input"
          />

          <button type="submit" className="auth-button">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
