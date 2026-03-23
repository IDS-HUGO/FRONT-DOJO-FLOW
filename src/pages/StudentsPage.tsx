import { useMemo, useState } from "react";
import { DataTable } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { SearchFilter } from "../components/SearchFilter";
import { api } from "../lib/api";
import { Student } from "../types";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useApi";
import { useAlert } from "../contexts/AlertContext";

export function StudentsPage() {
  // Data fetching
  const { data: studentsData = [], loading, refetch } = useApi<Student[]>("/students");
  const students: Student[] = studentsData || [];
  
  // Form and alerts
  const { success, error: showError } = useAlert();
  const [searchQuery, setSearchQuery] = useState("");

  const { values: form, loading: saving, handleChange, handleSubmit, reset } = useForm({
    initialValues: { full_name: "", email: "", phone: "" },
    onSubmit: async (values) => {
      try {
        await api.post("/students", values);
        success("Alumno registrado exitosamente");
        reset();
        refetch();
      } catch {
        showError("Error al registrar el alumno");
      }
    },
  });

  // Filtered and formatted rows
  const rows: (string | React.ReactNode)[][] = useMemo(
    () =>
      students
        .filter(
          (student) =>
            student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((student) => [
          student.full_name,
          student.email,
          student.phone,
          student.active ? "Activo" : "Inactivo",
          new Date(student.created_at).toLocaleDateString("es-MX"),
        ]),
    [students, searchQuery]
  );

  if (loading) {
    return (
      <section className="page-shell">
        <PageHeader
          title="Gestión de Alumnos"
          subtitle="Registra y consulta el padrón activo de estudiantes de tu academia."
        />
        <div className="hero-empty surface-glass">
          <div className="spinner"></div>
          <p>Cargando alumnos...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <PageHeader
        title="Gestión de Alumnos"
        subtitle="Registra y consulta el padrón activo de estudiantes de tu academia."
      />

      <form className="card form-section surface-glass" onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <div className="form-row">
          <input
            placeholder="Nombre completo"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="Correo"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <input
            placeholder="Teléfono"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Agregar alumno"}
          </button>
        </div>
      </form>

      <SearchFilter
        placeholder="Buscar alumno por nombre o email..."
        value={searchQuery}
        onSearch={setSearchQuery}
      />

      {rows.length === 0 ? (
        <div className="hero-empty surface-glass">
          <p>Aún no hay alumnos registrados.</p>
        </div>
      ) : (
        <DataTable
          headers={["Nombre", "Correo", "Teléfono", "Estado", "Alta"]}
          rows={rows}
          caption="Listado de alumnos registrados"
          emptyMessage="Aún no hay alumnos registrados."
        />
      )}
    </section>
  );
}
