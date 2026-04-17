import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { DataTable } from "../components/DataTable";
import { api, changePassword, getApiErrorMessage } from "../lib/api";
import { useApi, useForm } from "../hooks/useApi";
import { useAlert } from "../contexts/AlertContext";
import { Payment, Student } from "../types";

export function StudentPortalPage() {
  const navigate = useNavigate();
  const { success, error: showError, warning } = useAlert();
  const location = useLocation();

  const { data: student, loading: loadingStudent } = useApi<Student>("/students/me");
  const { data: payments = [], loading: loadingPayments, refetch } = useApi<Payment[]>("/payments");

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
  const {
    values: paymentForm,
    loading: submittingPayment,
    handleChange: handlePaymentChange,
    handleSubmit: submitPayment,
  } = useForm({
    initialValues: {
      amount: 0,
      description: "Mensualidad dojo",
    },
    onSubmit: async (formValues) => {
      try {
        setPaymentState("loading");

        const { data } = await api.post(
          `/payments/checkout?amount=${Number(formValues.amount)}`
        );

        setPaymentState("redirecting");

        // 🔥 CORRECCIÓN SEGURA
        if (data?.url) {
          window.location.href = data.url;
        } else {
          throw new Error("No se recibió URL de pago");
        }
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
    localStorage.removeItem("access_token");
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

      <button onClick={handleLogout}>Cerrar sesión</button>

      <DataTable
        headers={["Monto", "Estado", "Método", "Fecha"]}
        rows={rows}
      />
    </section>
  );
}