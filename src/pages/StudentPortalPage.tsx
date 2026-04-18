import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { DataTable } from "../components/DataTable";
import { api, changePassword, getApiErrorMessage } from "../lib/api";
import { useApi, useForm } from "../hooks/useApi";
import { useAlert } from "../contexts/AlertContext";
import { MarketplaceItem, Payment, Student } from "../types";

export function StudentPortalPage() {
  const navigate = useNavigate();
  const { success, error: showError, warning } = useAlert();
  const location = useLocation();

  const { data: student, loading: loadingStudent } = useApi<Student>("/students/me");
  const { data: payments = [], loading: loadingPayments, refetch } = useApi<Payment[]>("/payments");
  const { data: marketplaceItems = [], loading: loadingMarketplace } = useApi<MarketplaceItem[]>("/marketplace");

  const [paymentState, setPaymentState] = useState<"idle" | "loading" | "redirecting">("idle");

  // =========================
  // 🔹 CORRECCIÓN DE STATUS
  // =========================
  const totalPaid = useMemo(
    () =>
      payments
        .filter((p) => p.status === "paid") // 🔥 antes "approved"
        .reduce((sum, payment) => sum + payment.amount, 0),
    [payments]
  );

  const pendingCount = useMemo(
    () => payments.filter((p) => p.status === "pending").length,
    [payments]
  );

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
  const { values: paymentForm, loading: submittingPayment, handleChange: handlePaymentChange, handleSubmit: submitPayment } = useForm({
    initialValues: {
      amount: 520,
      description: "Mensualidad dojo",
    },
    onSubmit: async (formValues) => {
      if (!student) {
        showError("No se pudo identificar al alumno autenticado");
        return;
      }

      await startPayPalCheckout(Number(formValues.amount), formValues.description, student.id);
    },
  });

  async function startPayPalCheckout(amount: number, description: string, studentId: number) {
    if (!Number.isFinite(amount) || amount <= 0) {
      showError("Ingresa un monto valido para continuar");
      return;
    }

    try {
      setPaymentState("loading");

      const successUrl = `${window.location.origin}/student`;
      const cancelUrl = `${window.location.origin}/student?cancel=true`;

      let data: any;

      try {
        const response = await api.post("/payments/checkout/paypal/me", {
          student_id: studentId,
          amount,
          description,
          success_url: successUrl,
          cancel_url: cancelUrl,
        });
        data = response.data;
      } catch (err) {
        // Backward compatibility for deployed APIs that do not expose /checkout/paypal/me yet.
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          try {
            const fallbackResponse = await api.post("/payments/checkout/paypal", {
              student_id: studentId,
              amount,
              description,
              success_url: successUrl,
              cancel_url: cancelUrl,
            });
            data = fallbackResponse.data;
          } catch (fallbackErr) {
            if (axios.isAxiosError(fallbackErr) && fallbackErr.response?.status === 404) {
              // Compatibility with currently deployed backend API.
              const legacyResponse = await api.post(`/payments/checkout?amount=${amount}`);
              data = legacyResponse.data;
            } else {
              throw fallbackErr;
            }
          }
        } else {
          throw err;
        }
      }

      const checkoutUrl = data?.checkout_url ?? data?.url;

      if (!checkoutUrl) {
        throw new Error("No se recibio URL de aprobacion de PayPal");
      }

      setPaymentState("redirecting");
      window.location.href = checkoutUrl;
    } catch (err) {
      setPaymentState("idle");
      showError(getApiErrorMessage(err, "No se pudo iniciar el checkout de PayPal"));
    }
  }

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
        const response = await changePassword(
          formValues.current_password,
          formValues.new_password
        );

        success(response.message);
        resetPasswordForm();
      } catch (err) {
        showError(getApiErrorMessage(err, "No fue posible cambiar la contraseña"));
      }
    },
  });

  // =========================
  // 🔹 LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("dojo_token");
    localStorage.removeItem("dojo_user_email");
    localStorage.removeItem("dojo_account_type");
    localStorage.removeItem("dojo_student_id");
    success("Sesión cerrada correctamente");
    navigate("/login");
  };

  // =========================
  // 🔹 PAYPAL RETURN
  // =========================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("token");

    if (!orderId) return;

    const verifyPayment = async () => {
      try {
        setPaymentState("loading");
        try {
          await api.post("/payments/paypal/verify", { order_id: orderId });
        } catch (err) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            await api.post(`/payments/paypal/capture?order_id=${orderId}`);
          } else {
            throw err;
          }
        }

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
  }, [location.search]);

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
  }, [location.search]);

  const activeMarketplaceItems = marketplaceItems.filter((item) => item.active && item.stock > 0);

  if (loadingStudent || loadingPayments || loadingMarketplace) {
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
        subtitle={`Bienvenido${student ? `, ${student.full_name}` : ""}.`}
      />

      <div className="grid cols-3" style={{ marginBottom: "1.5rem" }}>
        <article className="card surface-glass">
          <h3>Total pagado</h3>
          <p className="price">${totalPaid.toLocaleString("es-MX")}</p>
        </article>

        <article className="card surface-glass">
          <h3>Pagos pendientes</h3>
          <p className="price">{pendingCount}</p>
        </article>

        <article className="card surface-glass">
          <h3>Correo</h3>
          <p>{student?.email}</p>
        </article>
      </div>

      <form className="card form-section surface-glass" onSubmit={submitPayment} style={{ marginBottom: "1rem" }}>
        <div className="section-headline" style={{ marginBottom: "0.8rem" }}>
          <h3>Pagar mensualidad</h3>
          <span>Checkout PayPal</span>
        </div>
        <div className="form-row">
          <input
            type="number"
            min={1}
            step="0.01"
            name="amount"
            value={paymentForm.amount}
            onChange={handlePaymentChange}
            placeholder="Monto"
            disabled={submittingPayment || paymentState !== "idle"}
          />
          <input
            type="text"
            name="description"
            value={paymentForm.description}
            onChange={handlePaymentChange}
            placeholder="Descripcion del pago"
            disabled={submittingPayment || paymentState !== "idle"}
          />
        </div>
        <button type="submit" disabled={submittingPayment || paymentState !== "idle" || !student}>
          {paymentState === "loading"
            ? "Preparando checkout..."
            : paymentState === "redirecting"
            ? "Redirigiendo a PayPal..."
            : "Pagar mensualidad"}
        </button>
      </form>

      <section className="card surface-glass" style={{ marginBottom: "1rem" }}>
        <div className="section-headline" style={{ marginBottom: "0.8rem" }}>
          <h3>Marketplace</h3>
          <span>Compra directa con PayPal</span>
        </div>
        {activeMarketplaceItems.length === 0 ? (
          <p className="empty-inline">No hay productos disponibles en este momento.</p>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {activeMarketplaceItems.map((item) => (
              <div
                key={item.id}
                className="surface-glass"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  padding: "0.9rem",
                  borderRadius: "0.9rem",
                }}
              >
                <div>
                  <strong style={{ display: "block" }}>{item.name}</strong>
                  <small style={{ color: "var(--muted)" }}>
                    {item.category} · Stock: {item.stock}
                  </small>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <strong>${item.price.toLocaleString("es-MX")}</strong>
                  <button
                    type="button"
                    disabled={paymentState !== "idle" || !student}
                    onClick={() => {
                      if (!student) {
                        showError("No se pudo identificar al alumno autenticado");
                        return;
                      }

                      void startPayPalCheckout(
                        Number(item.price),
                        `Marketplace: ${item.name}`,
                        student.id
                      );
                    }}
                  >
                    Comprar con PayPal
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <button onClick={handleLogout}>Cerrar sesión</button>

      <DataTable
        headers={["Monto", "Estado", "Método", "Fecha"]}
        rows={rows}
      />
    </section>
  );
}