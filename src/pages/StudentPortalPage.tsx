import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { DataTable } from "../components/DataTable";
import { api, changePassword, getApiErrorMessage } from "../lib/api";
import { useApi, useForm } from "../hooks/useApi";
import { useAlert } from "../contexts/AlertContext";
import { PayPalCheckoutResponse, Payment, Student } from "../types";

export function StudentPortalPage() {
  const { success, error: showError, warning } = useAlert();
  const location = useLocation();
  const { data: student, loading: loadingStudent } = useApi<Student>("/students/me");
  const { data: payments = [], loading: loadingPayments, refetch } = useApi<Payment[]>("/payments");

  const totalPaid = useMemo(
    () => payments.filter((p) => p.status === "paid").reduce((sum, payment) => sum + payment.amount, 0),
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

  const { values, loading: submitting, handleChange, handleSubmit, reset } = useForm({
    initialValues: {
      amount: 0,
      description: "Mensualidad dojo",
    },
    onSubmit: async (formValues) => {
      try {
        const { data } = await api.post<PayPalCheckoutResponse>("/payments/checkout/paypal/me", {
          student_id: 0,
          amount: Number(formValues.amount),
          description: formValues.description,
          success_url: `${window.location.origin}/student`,
          cancel_url: `${window.location.origin}/student`,
        });
        window.location.href = data.checkout_url;
      } catch (err) {
        showError(getApiErrorMessage(err, "No se pudo iniciar el checkout de PayPal"));
      }
    },
  });

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("token");
    const payerId = params.get("PayerID");

    if (!orderId) {
      return;
    }

    if (!payerId) {
      warning("Pago cancelado por el usuario en PayPal");
      window.history.replaceState({}, document.title, location.pathname);
      return;
    }

    const verifyPayment = async () => {
      try {
        const { data } = await api.post<Payment>("/payments/paypal/verify", {
          order_id: orderId,
        });

        if (data.status === "paid") {
          success("Pago aprobado correctamente");
        } else if (data.status === "pending") {
          success("Pago recibido, pendiente de confirmación");
        } else {
          showError("Pago rechazado");
        }

        refetch();
      } catch (err) {
        showError(getApiErrorMessage(err, "No se pudo verificar el pago"));
      } finally {
        window.history.replaceState({}, document.title, location.pathname);
      }
    };

    void verifyPayment();
  }, [location.pathname, location.search, refetch, showError, success, warning]);

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

      <div className="grid cols-3" style={{ marginBottom: "1rem" }}>
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
          <p style={{ margin: 0 }}>{student?.email}</p>
        </article>
      </div>

      <form className="card form-section surface-glass" onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>Pagar mensualidad</h3>
        <div className="form-row">
          <input
            type="number"
            min={1}
            step="0.01"
            name="amount"
            value={values.amount}
            onChange={handleChange}
            required
            placeholder="Monto a pagar"
            disabled={submitting}
          />
          <input
            name="description"
            value={values.description}
            onChange={handleChange}
            placeholder="Concepto"
            disabled={submitting}
          />
        </div>
        <button type="submit" disabled={submitting || Number(values.amount) <= 0}>
          {submitting ? "Procesando..." : "Pagar con PayPal"}
        </button>
      </form>

      <form className="card form-section surface-glass" onSubmit={submitPasswordChange} style={{ marginBottom: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>Seguridad de cuenta</h3>
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
            placeholder="Confirmar nueva contraseña"
            required
            disabled={changingPassword}
          />
          <button type="submit" disabled={changingPassword}>
            {changingPassword ? "Actualizando..." : "Cambiar contraseña"}
          </button>
        </div>
      </form>

      {rows.length === 0 ? (
        <div className="hero-empty surface-glass">
          <p>Aún no tienes pagos registrados.</p>
        </div>
      ) : (
        <DataTable
          headers={["Monto", "Estado", "Método", "Fecha"]}
          rows={rows}
          caption="Historial de pagos"
          emptyMessage="Aún no tienes pagos registrados."
        />
      )}
    </section>
  );
}
