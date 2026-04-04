import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { login } from "../lib/api";
import "../styles/landing-new.css";

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("owner@dojoflow.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await login(username, password);
      
      // Store user email for role checking
      localStorage.setItem('dojo_user_email', username);
      localStorage.setItem('user_email', username);
      
      // Redirect based on role
      if (response.account_type === "student") {
        navigate("/student");
      } else if (username === 'owner@dojoflow.com') {
        navigate("/admin");
      } else {
        navigate("/app");
      }
    } catch {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main login-page-shell" style={{ maxWidth: 520, margin: "4rem auto" }}>
      <section className="login-hero card surface-glass">
        <div className="login-hero-brand">
          <img src="/logos/LOGO.jpeg" alt="DojoFlow logo" className="logo-mark" />
          <div>
            <div className="brand-kicker">Acceso seguro</div>
            <h1 className="login-brand">DojoFlow</h1>
          </div>
        </div>
        <PageHeader
          title="Iniciar sesión"
          subtitle="Acceso para encargados e instructores del dojo."
        />
      </section>

      <form className="card login-card surface-glass" onSubmit={onSubmit}>
        <div style={{ marginBottom: "0.8rem" }}>
          <label>Usuario</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div style={{ marginBottom: "0.8rem" }}>
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Entrar"}
        </button>
        <p style={{ marginTop: "0.8rem" }}>
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </p>
        <p style={{ marginTop: "0.8rem" }}>
          ¿Eres alumno? <Link to="/student/login">Accede aquí</Link>
        </p>
      </form>
    </main>
  );
}
