import { useMemo, useState } from "react";
import { DataTable } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { SearchFilter } from "../components/SearchFilter";
import { api } from "../lib/api";
import { Student, StudentCreateResponse } from "../types";
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
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { values: form, loading: saving, handleChange, handleSubmit, reset } = useForm({
    initialValues: {
      full_name: "",
      email: "",
      phone: "",
    },
    onSubmit: async (values) => {
      try {
        // Validaciones básicas
        if (!values.full_name.trim()) {
          showError("El nombre es requerido");
          return;
        }
        if (!values.email.trim()) {
          showError("El correo es requerido");
          return;
        }
        if (!values.phone.trim()) {
          showError("El teléfono es requerido");
          return;
        }

        // Enviar SOLO los campos que espera el backend
        const { data } = await api.post<StudentCreateResponse>("/students", {
          full_name: values.full_name,
          email: values.email,
          phone: values.phone,
        });
        
        if (data.credentials_email_sent) {
          success("Alumno registrado y credenciales enviadas por Gmail");
        } else {
          success("Alumno registrado correctamente");
        }
        reset();
        refetch();
      } catch (err: any) {
        console.error("Error:", err);
        showError(err.response?.data?.detail || "Error al registrar el alumno");
      }
    },
  });

  // ✅ HANDLER PARA ELIMINAR
  const handleDeleteStudent = async (studentId: number, studentName: string) => {
    if (!window.confirm(`¿Está seguro que desea eliminar a ${studentName}?`)) {
      return;
    }

    setDeletingId(studentId);
    try {
      await api.delete(`/students/${studentId}`);
      success(`Alumno eliminado correctamente`);
      refetch();
    } catch (err: any) {
      showError(err.response?.data?.detail || "Error al eliminar el alumno");
    } finally {
      setDeletingId(null);
    }
  };

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
          student.phone || "-",
          student.active ? "Activo" : "Inactivo",
          new Date(student.created_at).toLocaleDateString("es-MX"),
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => handleDeleteStudent(student.id, student.full_name)}
              disabled={deletingId === student.id}
              style={{
                padding: "0.4rem 0.8rem",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "0.4rem",
                cursor: deletingId === student.id ? "not-allowed" : "pointer",
              }}
            >
              {deletingId === student.id ? "..." : "🗑️"}
            </button>
          </div>,
        ]),
    [students, searchQuery, deletingId]
  );

  if (loading) {
    return (
      <section className="page-shell">
        <PageHeader title="Gestión de Alumnos" subtitle="Registra estudiantes" />
        <div className="hero-empty surface-glass">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <PageHeader title="Gestión de Alumnos" subtitle="Registra estudiantes" />

      <form className="card form-section surface-glass" onSubmit={handleSubmit}>
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
          <input
            placeholder="Teléfono"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Agregar"}
          </button>
        </div>
      </form>

      <SearchFilter value={searchQuery} onSearch={setSearchQuery} />

      {rows.length === 0 ? (
        <div className="hero-empty surface-glass">
          <p>Sin alumnos registrados</p>
        </div>
      ) : (
        <DataTable
          headers={["Nombre", "Correo", "Teléfono", "Estado", "Alta", "Acciones"]}
          rows={rows}
        />
      )}
    </section>
  );
}