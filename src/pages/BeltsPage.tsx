import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { api } from "../lib/api";
import { BeltProgress, Student } from "../types";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useApi";
import { useAlert } from "../contexts/AlertContext";

export function BeltsPage() {
  const { data: studentsData = [], loading: studentsLoading } = useApi<Student[]>("/students");
  const { data: beltsData = [], loading: beltsLoading, refetch: refetchBelts } = useApi<BeltProgress[]>("/belts");
  const students = studentsData ?? [];
  const belts = beltsData ?? [];
  const { success, error: showError } = useAlert();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  useEffect(() => {
    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [students]);

  const { values: form, loading: saving, handleChange, handleSubmit, reset } = useForm({
    initialValues: { student_id: selectedStudentId || 0, belt_name: "Cinta Blanca", exam_score: 0 },
    onSubmit: async (values) => {
      try {
        await api.post("/belts", values);
        success("Examen registrado exitosamente");
        reset();
        refetchBelts();
      } catch {
        showError("Error al registrar el examen");
      }
    },
  });

  const rows = useMemo(
    () =>
      belts.map((belt) => {
        const student = students.find((s) => s.id === belt.student_id);
        return [
          student?.full_name ?? `#${belt.student_id}`,
          belt.belt_name,
          `${belt.exam_score}`,
          belt.approved ? "Aprobado" : "Pendiente",
          new Date(belt.evaluated_at).toLocaleDateString("es-MX"),
        ];
      }),
    [belts, students]
  );

  const loading = studentsLoading || beltsLoading;

  if (loading) {
    return (
      <section>
        <PageHeader
          title="Grados y Exámenes"
          subtitle="Controla la progresión técnica y aprobación de cintas de tus alumnos."
        />
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div className="spinner"></div>
          <p>Cargando evaluaciones...</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <PageHeader
        title="Grados y Exámenes"
        subtitle="Controla la progresión técnica y aprobación de cintas de tus alumnos."
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
            name="belt_name"
            value={form.belt_name}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="Cinta Blanca">Cinta Blanca</option>
            <option value="Cinta Azul">Cinta Azul</option>
            <option value="Cinta Morada">Cinta Morada</option>
            <option value="Cinta Marrón">Cinta Marrón</option>
            <option value="Cinta Negra">Cinta Negra</option>
          </select>
        </div>
        <div className="form-row">
          <input
            type="number"
            min={0}
            max={100}
            placeholder="Puntaje (0-100)"
            name="exam_score"
            value={form.exam_score}
            onChange={handleChange}
            disabled={saving}
          />
          <button type="submit" disabled={saving || students.length === 0}>
            {saving ? "Guardando..." : "Registrar examen"}
          </button>
        </div>
      </form>

      {rows.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Sin exámenes registrados por ahora.</p>
        </div>
      ) : (
        <DataTable
          headers={["Alumno", "Grado", "Puntaje", "Estado", "Fecha"]}
          rows={rows}
          caption="Histórico de evaluaciones"
          emptyMessage="Sin exámenes registrados por ahora."
        />
      )}
    </section>
  );
}
