import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { forgotPassword } from "../lib/api";
import "../styles/landing-new.css";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);
      const response = await forgotPassword(email);
      setMessage(response.message);
    } catch {
      setError("No se pudo procesar la solicitud");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main login-page-shell" style={{ maxWidth: 520, margin: "4rem auto" }}>
      <section className="login-hero card surface-glass">
        <PageHeader
          title="Recuperar contraseña"
          subtitle="Te enviaremos un correo con enlace seguro para restablecer tu acceso."
        />
      </section>

      <form className="card login-card surface-glass" onSubmit={onSubmit}>
        <div style={{ marginBottom: "0.8rem" }}>
          <label>Correo de acceso</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu_correo@dojo.com"
          />
        </div>

        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
        {message && <p style={{ color: "#1f2240" }}>{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>
        <p style={{ marginTop: "0.8rem" }}>
          <Link to="/login">Volver al login</Link>
        </p>
      </form>
    </main>
  );
}
