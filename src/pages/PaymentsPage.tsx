import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { DataTable } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { api, getApiErrorMessage } from "../lib/api";
import { Payment, Student } from "../types";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useApi";
import { useAlert } from "../contexts/AlertContext";

type PaymentState = "idle" | "creating" | "redirecting" | "capturing";

export function PaymentsPage() {
  const { data: studentsData = [], loading: studentsLoading } = useApi<Student[]>("/students");
  const { data: paymentsData = [], loading: paymentsLoading, refetch } = useApi<Payment[]>("/payments");

  const students = studentsData ?? [];
  const payments = paymentsData ?? [];

  const { success, error: showError, warning } = useAlert();
  const location = useLocation();

  const [paymentState, setPaymentState] = useState<PaymentState>("idle");

  const { values: form, handleChange, handleSubmit, setFieldValue } = useForm({
    initialValues: { student_id: 0, amount: 0, method: "paypal" },

    onSubmit: async (values) => {
      try {
        if (paymentState !== "idle") return;

        setPaymentState("creating");

        const { data } = await api.post(
          `/payments/checkout?provider=${values.method}&amount=${values.amount}`
        );

        setPaymentState("redirecting");

        window.location.href = data.url;
      } catch (err) {
        setPaymentState("idle");
        showError(getApiErrorMessage(err, "Error al iniciar el pago"));
      }
    },
  });

  // 🔹 Selección automática de alumno
  useEffect(() => {
    if (students.length > 0 && Number(form.student_id) === 0) {
      setFieldValue("student_id", students[0].id);
    }
  }, [students]);

  // =========================
  // 🔹 RETORNO PAYPAL (CAPTURE)
  // =========================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("token");

    if (!orderId) return;

    const capture = async () => {
      try {
        setPaymentState("capturing");

        await api.post(`/payments/paypal/capture?order_id=${orderId}`);

        success("Pago aprobado con PayPal");
        refetch();
      } catch (err) {
        showError(getApiErrorMessage(err, "Error al confirmar el pago"));
      } finally {
        setPaymentState("idle");
        window.history.replaceState({}, document.title, location.pathname);
      }
    };

    capture();
  }, [location.search]);

  // =========================
  // 🔹 RETORNO MERCADO PAGO
  // =========================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");

    if (!status) return;

    if (status === "approved") {
      success("Pago aprobado con Mercado Pago");
    } else if (status === "pending") {
      warning("Pago pendiente de confirmación");
    } else {
      showError("Pago rechazado o cancelado");
    }

    refetch();
    window.history.replaceState({}, document.title, location.pathname);
  }, [location.search]);

  // =========================
  // 🔹 CANCELACIÓN PAYPAL
  // =========================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cancelled = params.get("cancel");

    if (cancelled) {
      warning("Pago cancelado por el usuario");
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.search]);

  // =========================
  // 🔹 TABLA
  // =========================
  const rows = useMemo(
    () =>
      payments.map((p) => {
        const student = students.find((s) => s.id === p.student_id);

        return [
          student?.full_name ?? `#${p.student_id}`,
          `$${p.amount.toLocaleString("es-MX")}`,
          p.status,
          p.method,
          new Date(p.payment_date).toLocaleDateString("es-MX"),
        ];
      }),
    [payments, students]
  );

  const loading = studentsLoading || paymentsLoading;

  if (loading) {
    return (
      <section className="page-shell">
        <PageHeader title="Pagos" subtitle="Gestiona cobros y transacciones" />
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
        title="Pagos"
        subtitle="Historial de transacciones"
      />

      {/* 🔹 FORM */}
      

      {/* 🔹 ESTADO VISUAL */}
      {paymentState !== "idle" && (
        <div className="hero-empty surface-glass">
          {paymentState === "creating" && <p>Preparando pago...</p>}
          {paymentState === "redirecting" && <p>Redirigiendo a pasarela segura...</p>}
          {paymentState === "capturing" && <p>Confirmando pago...</p>}
        </div>
      )}

      {/* 🔹 TABLA */}
      {rows.length === 0 ? (
        <div className="hero-empty surface-glass">
          <p>No hay pagos registrados todavía.</p>
        </div>
      ) : (
        <DataTable
          headers={["Alumno", "Monto", "Estado", "Método", "Fecha"]}
          rows={rows}
          caption="Historial de pagos"
        />
      )}
    </section>
  );
}