import { useState } from "react";

type AuthMode = "login" | "register";

type AuthPanelProps = {
  loading: boolean;
  onLogin: (payload: { tenantId: string; email: string; password: string }) => Promise<void>;
  onRegister: (payload: { tenantId: string; name: string; email: string; password: string }) => Promise<void>;
  error: string;
};

const AuthPanel = ({ loading, onLogin, onRegister, error }: AuthPanelProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [tenantId, setTenantId] = useState("cloudgallery-dev");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === "login") {
      await onLogin({ tenantId, email, password });
      return;
    }
    await onRegister({ tenantId, name, email, password });
  };

  return (
    <section className="auth-panel surface-card">
      <div className="auth-panel__switch">
        <button className={`chip ${mode === "login" ? "chip--active" : ""}`} type="button" onClick={() => setMode("login")}>
          Login
        </button>
        <button
          className={`chip ${mode === "register" ? "chip--active" : ""}`}
          type="button"
          onClick={() => setMode("register")}
        >
          Register
        </button>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <label>
          Tenant ID
          <input value={tenantId} onChange={(event) => setTenantId(event.target.value)} required minLength={3} />
        </label>
        {mode === "register" && (
          <label>
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} />
          </label>
        )}
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
          />
        </label>
        {error ? <p className="status-line status-line--error">{error}</p> : null}
        <button className="btn btn--solid" type="submit" disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
    </section>
  );
};

export default AuthPanel;
