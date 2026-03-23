import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { api } from "../lib/api";
import { Payment, Student } from "../types";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useApi";
import { useAlert } from "../contexts/AlertContext";

export function PaymentsPage() {
  const { data: studentsData = [], loading: studentsLoading } = useApi<Student[]>("/students");
  const { data: paymentsData = [], loading: paymentsLoading, refetch: refetchPayments } = useApi<Payment[]>("/payments");
  const students = studentsData ?? [];
  const payments = paymentsData ?? [];
  const { success, error: showError } = useAlert();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  useEffect(() => {
    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [students]);

  const { values: form, loading: saving, handleChange, handleSubmit, reset } = useForm({
    initialValues: { student_id: selectedStudentId || 0, amount: 0, method: "card" },
    onSubmit: async (values) => {
      try {
        await api.post("/payments", values);
        success("Pago registrado exitosamente");
        reset();
        refetchPayments();
      } catch {
        showError("Error al registrar el pago");
      }
    },
  });

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
      <section>
        <PageHeader
          title="Cobranza y Pagos"
          subtitle="Registra pagos y lleva control de métodos de cobro y flujo financiero."
        />
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div className="spinner"></div>
          <p>Cargando pagos...</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <PageHeader
        title="Cobranza y Pagos"
        subtitle="Registra pagos y lleva control de métodos de cobro y flujo financiero."
      />

      <form className="card" onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
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
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
            <option value="cash">Efectivo</option>
          </select>
          <button type="submit" disabled={saving || students.length === 0 || form.amount <= 0}>
            {saving ? "Guardando..." : "Registrar pago"}
          </button>
        </div>
      </form>

      {rows.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
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
