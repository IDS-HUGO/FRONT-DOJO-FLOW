import { FormEvent, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { resetPassword } from "../lib/api";
import "../styles/landing-new.css";

export function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = useMemo(() => new URLSearchParams(location.search).get("token") || "", [location.search]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Token inválido o faltante");
      return;
    }

    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword(token, newPassword);
      setMessage(response.message);
      setTimeout(() => navigate("/login"), 1400);
    } catch {
      setError("No se pudo restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main login-page-shell" style={{ maxWidth: 520, margin: "4rem auto" }}>
      <section className="login-hero card surface-glass">
        <PageHeader
          title="Nueva contraseña"
          subtitle="Define una nueva contraseña para tu cuenta de DojoFlow."
        />
      </section>

      <form className="card login-card surface-glass" onSubmit={onSubmit}>
        <div style={{ marginBottom: "0.8rem" }}>
          <label>Nueva contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "0.8rem" }}>
          <label>Confirmar contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
        {message && <p style={{ color: "#1f2240" }}>{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Actualizar contraseña"}
        </button>
        <p style={{ marginTop: "0.8rem" }}>
          <Link to="/login">Volver al login</Link>
        </p>
      </form>
    </main>
  );
}
