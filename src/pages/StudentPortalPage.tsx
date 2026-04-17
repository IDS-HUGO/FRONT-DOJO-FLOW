import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { DataTable } from "../components/DataTable";
import { api, changePassword, getApiErrorMessage } from "../lib/api";
import { useApi, useForm } from "../hooks/useApi";
import { useAlert } from "../contexts/AlertContext";
import { PayPalCheckoutResponse, Payment, Student } from "../types";

export function StudentPortalPage() {
  const navigate = useNavigate();
  const { success, error: showError, warning } = useAlert();
  const location = useLocation();
  const { data: student, loading: loadingStudent } = useApi<Student>("/students/me");
  const { data: payments = [], loading: loadingPayments, refetch } = useApi<Payment[]>("/payments");
  const [paymentState, setPaymentState] = useState<"idle" | "loading" | "redirecting">("idle");

  const totalPaid = useMemo(
    () => payments.filter((p) => p.status === "approved").reduce((sum, payment) => sum + payment.amount, 0),
    [payments]
  );
  const pendingCount = useMemo(() => payments.filter((p) => p.status === "pending").length, [payments]);

  const rows = useMemo(
    () =>
      payments.map((payment) => [
        `$${payment.amount.toLocaleString("es-MX")}`,
        payment.status,
        payment.method,
        new Date(payment.payment_date).toLocaleDateString("es-MX"),
      ]),
    [payments]
  );

  // =========================
  // 🔹 FORMULARIO PAGO
  // =========================
  const { values: paymentForm, loading: submittingPayment, handleChange: handlePaymentChange, handleSubmit: submitPayment, reset: resetPaymentForm } = useForm({
    initialValues: {
      amount: 0,
      description: "Mensualidad dojo",
    },
    onSubmit: async (formValues) => {
      try {
        setPaymentState("loading");
        const { data } = await api.post<PayPalCheckoutResponse>(`/payments/checkout?amount=${Number(formValues.amount)}`);
        setPaymentState("redirecting");
        window.location.href = data.url;
      } catch (err) {
        setPaymentState("idle");
        showError(getApiErrorMessage(err, "No se pudo iniciar el checkout de PayPal"));
      }
    },
  });

  // =========================
  // 🔹 FORMULARIO CONTRASEÑA
  // =========================
  const {
    values: passwordForm,
    loading: changingPassword,
    handleChange: handlePasswordChange,
    handleSubmit: submitPasswordChange,
    reset: resetPasswordForm,
  } = useForm({
    initialValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    onSubmit: async (formValues) => {
      if (formValues.new_password.length < 8) {
        showError("La nueva contraseña debe tener al menos 8 caracteres");
        return;
      }
      if (formValues.new_password !== formValues.confirm_password) {
        showError("La nueva contraseña y su confirmación no coinciden");
        return;
      }
      try {
        const response = await changePassword(formValues.current_password, formValues.new_password);
        success(response.message);
        resetPasswordForm();
      } catch (err) {
        showError(getApiErrorMessage(err, "No fue posible cambiar la contraseña"));
      }
    },
  });

  // =========================
  // 🔹 CERRAR SESIÓN
  // =========================
  const handleLogout = async () => {
    try {
      localStorage.removeItem("access_token");
      success("Sesión cerrada correctamente");
      navigate("/login");
    } catch (err) {
      showError("Error al cerrar sesión");
    }
  };

  // =========================
  // 🔹 VERIFICACIÓN PAYPAL (return_url)
  // =========================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("token");

    if (!orderId) {
      return;
    }

    const verifyPayment = async () => {
      try {
        setPaymentState("loading");
        await api.post(`/payments/paypal/capture?order_id=${orderId}`);
        success("Pago aprobado correctamente");
        refetch();
      } catch (err) {
        showError(getApiErrorMessage(err, "No se pudo verificar el pago"));
      } finally {
        setPaymentState("idle");
        window.history.replaceState({}, document.title, location.pathname);
      }
    };

    verifyPayment();
  }, [location.pathname, location.search, refetch, showError, success]);

  // =========================
  // 🔹 CANCELACIÓN PAYPAL
  // =========================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cancelled = params.get("cancel");

    if (cancelled) {
      warning("Pago cancelado por el usuario en PayPal");
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.search, warning]);

  if (loadingStudent || loadingPayments) {
    return (
      <section className="page-shell">
        <PageHeader title="Portal del Alumno" subtitle="Consulta tu cuenta y realiza pagos en línea." />
        <div className="hero-empty surface-glass">
          <div className="spinner"></div>
          <p>Cargando tu información...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <PageHeader
        title="Portal del Alumno"
        subtitle={`Bienvenido${student ? `, ${student.full_name}` : ""}. Aquí puedes revisar y pagar tus mensualidades.`}
      />

      {/* =========================
          🔹 CARDS RESUMEN
          ========================= */}
      <div className="grid cols-3" style={{ marginBottom: "1.5rem" }}>
        <article className="card surface-glass">
          <h3 style={{ marginTop: 0 }}>Total pagado</h3>
          <p className="price" style={{ marginTop: 0 }}>${totalPaid.toLocaleString("es-MX")}</p>
        </article>
        <article className="card surface-glass">
          <h3 style={{ marginTop: 0 }}>Pagos pendientes</h3>
          <p className="price" style={{ marginTop: 0 }}>{pendingCount}</p>
        </article>
        <article className="card surface-glass">
          <h3 style={{ marginTop: 0 }}>Correo registrado</h3>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>{student?.email}</p>
        </article>
      </div>

      {/* =========================
          🔹 CONTENEDOR 2 COLUMNAS
          ========================= */}
      <div className="grid cols-2" style={{ gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* SECCIÓN PAGO */}
        <form className="card form-section surface-glass" onSubmit={submitPayment}>
          <h3 style={{ marginTop: 0 }}>💳 Pagar Mensualidad</h3>
          <div className="form-row">
            <input
              type="number"
              min={1}
              step="0.01"
              name="amount"
              value={paymentForm.amount}
              onChange={handlePaymentChange}
              required
              placeholder="Monto a pagar"
              disabled={submittingPayment || paymentState !== "idle"}
            />
          </div>
          <div className="form-row">
            <input
              name="description"
              value={paymentForm.description}
              onChange={handlePaymentChange}
              placeholder="Concepto"
              disabled={submittingPayment || paymentState !== "idle"}
            />
          </div>
          <button type="submit" disabled={submittingPayment || paymentState !== "idle" || Number(paymentForm.amount) <= 0}>
            {paymentState === "loading" && "Procesando..."}
            {paymentState === "redirecting" && "Redirigiendo..."}
            {paymentState === "idle" && "Pagar con PayPal"}
          </button>
        </form>

        {/* SECCIÓN SEGURIDAD */}
        <form className="card form-section surface-glass" onSubmit={submitPasswordChange}>
          <h3 style={{ marginTop: 0 }}>🔒 Cambiar Contraseña</h3>
          <div className="form-row">
            <input
              type="password"
              name="current_password"
              value={passwordForm.current_password}
              onChange={handlePasswordChange}
              placeholder="Contraseña actual"
              required
              disabled={changingPassword}
            />
          </div>
          <div className="form-row">
            <input
              type="password"
              name="new_password"
              value={passwordForm.new_password}
              onChange={handlePasswordChange}
              placeholder="Nueva contraseña"
              required
              disabled={changingPassword}
            />
          </div>
          <div className="form-row">
            <input
              type="password"
              name="confirm_password"
              value={passwordForm.confirm_password}
              onChange={handlePasswordChange}
              placeholder="Confirmar contraseña"
              required
              disabled={changingPassword}
            />
          </div>
          <button type="submit" disabled={changingPassword}>
            {changingPassword ? "Actualizando..." : "Cambiar Contraseña"}
          </button>
        </form>
      </div>

      {/* =========================
          🔹 BOTÓN CERRAR SESIÓN
          ========================= */}
      <button 
  onClick={handleLogout}
  style={{
    maxWidth: "300px",
    width: "100%",
    margin: "0 auto 1.5rem auto",
    display: "block",
    padding: "0.875rem",
    backgroundColor: "#ff6b6b",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
  }}

        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#ff5252";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#ff6b6b";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        🚪 Cerrar Sesión
      </button>

      {/* =========================
          🔹 TABLA HISTORIAL
          ========================= */}
      {rows.length === 0 ? (
        <div className="hero-empty surface-glass">
          <p>Aún no tienes pagos registrados.</p>
        </div>
      ) : (
        <DataTable
          headers={["Monto", "Estado", "Método", "Fecha"]}
          rows={rows}
          caption="Historial de Pagos"
          emptyMessage="Aún no tienes pagos registrados."
        />
      )}
    </section>
  );
}