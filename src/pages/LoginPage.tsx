import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { login } from "../lib/api";

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
      localStorage.setItem('user_email', username);
      
      // Redirect based on role
      if (username === 'owner@dojoflow.com') {
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
    <main className="main" style={{ maxWidth: 420, margin: "4rem auto" }}>
      <PageHeader
        title="Iniciar sesión"
        subtitle="Accede al panel administrativo de tu academia DojoFlow."
      />
      <form className="card" onSubmit={onSubmit}>
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
      </form>
    </main>
  );
}
