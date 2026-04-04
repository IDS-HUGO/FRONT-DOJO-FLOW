import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { DataTable } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { api, getApiErrorMessage } from "../lib/api";
import { PayPalCheckoutResponse, Payment, Student } from "../types";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useApi";
import { useAlert } from "../contexts/AlertContext";

export function PaymentsPage() {
  const { data: studentsData = [], loading: studentsLoading } = useApi<Student[]>("/students");
  const { data: paymentsData = [], loading: paymentsLoading, refetch: refetchPayments } = useApi<Payment[]>("/payments");
  const students = studentsData ?? [];
  const payments = paymentsData ?? [];
  const { success, error: showError, warning } = useAlert();
  const location = useLocation();

  const { values: form, loading: saving, handleChange, handleSubmit, reset, setFieldValue } = useForm({
    initialValues: { student_id: 0, amount: 0, method: "paypal" },
    onSubmit: async (values) => {
      try {
        if (values.method === "paypal") {
          const selectedStudent = students.find((s) => s.id === Number(values.student_id));
          const { data } = await api.post<PayPalCheckoutResponse>("/payments/checkout/paypal", {
            student_id: Number(values.student_id),
            amount: Number(values.amount),
            description: selectedStudent ? `Mensualidad - ${selectedStudent.full_name}` : "Mensualidad",
          });
          window.location.href = data.checkout_url;
          return;
        }

        await api.post("/payments", {
          student_id: Number(values.student_id),
          amount: Number(values.amount),
          method: values.method,
        });
        success("Pago registrado exitosamente");
        reset();
        if (students.length > 0) {
          setFieldValue("student_id", students[0].id);
        }
        refetchPayments();
      } catch (err) {
        showError(getApiErrorMessage(err, "Error al registrar el pago"));
      }
    },
  });

  useEffect(() => {
    if (students.length > 0 && Number(form.student_id) === 0) {
      setFieldValue("student_id", students[0].id);
    }
  }, [students, form.student_id, setFieldValue]);

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
          success("Pago aprobado en PayPal");
        } else if (data.status === "pending") {
          success("Pago en proceso de validación");
        } else {
          showError("El pago fue rechazado");
        }

        refetchPayments();
      } catch (err) {
        showError(getApiErrorMessage(err, "No se pudo verificar el pago de PayPal"));
      } finally {
        window.history.replaceState({}, document.title, location.pathname);
      }
    };

    void verifyPayment();
  }, [location.pathname, location.search, refetchPayments, showError, success, warning]);

  const rows = useMemo(
    () =>
      payments.map((payment) => {
        const student = students.find((s) => s.id === payment.student_id);
        return [
          student?.full_name ?? `#${payment.student_id}`,
          `$${payment.amount.toLocaleString("es-MX")}`,
          payment.status,
          payment.method,
          new Date(payment.payment_date).toLocaleDateString("es-MX"),
        ];
      }),
    [payments, students]
  );

  const loading = studentsLoading || paymentsLoading;

  if (loading) {
    return (
      <section className="page-shell">
        <PageHeader
          title="Cobranza y Pagos"
          subtitle="Registra pagos y lleva control de métodos de cobro y flujo financiero."
        />
        <div className="hero-empty surface-glass">
          <div className="spinner"></div>
          <p>Cargando pagos...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <PageHeader
        title="Cobranza y Pagos"
        subtitle="Registra pagos y lleva control de métodos de cobro y flujo financiero."
      />

      <form className="card form-section surface-glass" onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <div className="form-row">
          <select
            name="student_id"
            value={form.student_id}
            onChange={handleChange}
            disabled={saving}
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.full_name}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            placeholder="Monto"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            disabled={saving}
          />
        </div>
        <div className="form-row">
          <select
            name="method"
            value={form.method}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="paypal">PayPal (online)</option>
            <option value="transfer">Transferencia</option>
            <option value="cash">Efectivo</option>
          </select>
          <button type="submit" disabled={saving || students.length === 0 || form.amount <= 0}>
            {saving ? "Procesando..." : form.method === "paypal" ? "Pagar con PayPal" : "Registrar pago"}
          </button>
        </div>
      </form>

      {rows.length === 0 ? (
        <div className="hero-empty surface-glass">
          <p>No hay pagos registrados todavía.</p>
        </div>
      ) : (
        <DataTable
          headers={["Alumno", "Monto", "Estado", "Método", "Fecha"]}
          rows={rows}
          caption="Movimientos de cobranza"
          emptyMessage="No hay pagos registrados todavía."
        />
      )}
    </section>
  );
}
