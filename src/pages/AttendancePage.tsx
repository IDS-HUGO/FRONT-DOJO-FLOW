import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { api } from "../lib/api";
import { Attendance, Student } from "../types";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useApi";
import { useAlert } from "../contexts/AlertContext";

export function AttendancePage() {
  const { data: students = [], loading: studentsLoading } = useApi<Student[]>("/students");
  const { data: attendance = [], loading: attendanceLoading, refetch: refetchAttendance } = useApi<Attendance[]>("/attendance");
  const { success, error: showError } = useAlert();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  useEffect(() => {
    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [students]);

  const { values: form, loading: saving, handleChange, handleSubmit, reset } = useForm({
    initialValues: { student_id: selectedStudentId || 0, class_type: "BJJ" },
    onSubmit: async (values) => {
      try {
        await api.post("/attendance", values);
        success("Asistencia registrada exitosamente");
        reset();
        refetchAttendance();
      } catch {
        showError("Error al registrar la asistencia");
      }
    },
  });

  const rows = useMemo(
    () =>
      attendance.map((item) => {
        const student = students.find((s) => s.id === item.student_id);
        return [
          student?.full_name ?? `#${item.student_id}`,
          item.class_type,
          new Date(item.attended_at).toLocaleString("es-MX"),
        ];
      }),
    [attendance, students]
  );

  const loading = studentsLoading || attendanceLoading;

  if (loading) {
    return (
      <section>
        <PageHeader
          title="Control de Asistencias"
          subtitle="Registra asistencia por clase y visualiza el histórico operativo del dojo."
        />
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div className="spinner"></div>
          <p>Cargando asistencias...</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <PageHeader
        title="Control de Asistencias"
        subtitle="Registra asistencia por clase y visualiza el histórico operativo del dojo."
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
          <select
            name="class_type"
            value={form.class_type}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="BJJ">BJJ</option>
            <option value="MMA">MMA</option>
            <option value="Karate">Karate</option>
            <option value="TKD">TKD</option>
          </select>
        </div>
        <button type="submit" disabled={saving || students.length === 0}>
          {saving ? "Guardando..." : "Registrar asistencia"}
        </button>
      </form>

      {rows.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Todavía no hay asistencias registradas.</p>
        </div>
      ) : (
        <DataTable
          headers={["Alumno", "Clase", "Fecha"]}
          rows={rows}
          caption="Últimas asistencias registradas"
          emptyMessage="Todavía no hay asistencias registradas."
        />
      )}
    </section>
  );
}
