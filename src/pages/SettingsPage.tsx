import { useEffect } from "react";
import { PageHeader } from "../components/PageHeader";
import { api } from "../lib/api";
import { AcademyProfile } from "../types";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useApi";
import { useAlert } from "../contexts/AlertContext";

export function SettingsPage() {
  const { data: profile, loading, refetch } = useApi<AcademyProfile>("/academy-profile");
  const { success, error: showError } = useAlert();

  const { values: formData, loading: saving, handleChange, handleSubmit, setValues } = useForm({
    initialValues: profile || {
      dojo_name: "",
      owner_name: "",
      contact_email: "",
      contact_phone: "",
      city: "",
      timezone: "",
      currency: "MXN",
      id: 0,
      created_at: "",
      updated_at: "",
    },
    onSubmit: async (values) => {
      try {
        await api.put("/academy-profile", {
          dojo_name: values.dojo_name,
          owner_name: values.owner_name,
          contact_email: values.contact_email,
          contact_phone: values.contact_phone,
          city: values.city,
          timezone: values.timezone,
          currency: values.currency,
        });
        success("Configuración actualizada exitosamente");
        refetch();
      } catch {
        showError("Error al actualizar la configuración");
      }
    },
  });

  useEffect(() => {
    if (profile) {
      setValues(profile);
    }
  }, [profile, setValues]);

  function logout() {
    localStorage.removeItem("dojo_token");
    localStorage.removeItem("dojo_user_email");
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <section className="page-shell">
        <PageHeader
          title="Configuración"
          subtitle="Personaliza datos de la academia y parámetros operativos principales."
        />
        <div className="hero-empty surface-glass">
          <div className="spinner"></div>
          <p>Cargando configuración...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <PageHeader
        title="Configuración"
        subtitle="Personaliza datos de la academia y parámetros operativos principales."
      />

      <div className="settings-rail surface-glass">
        <div>
          <span className="executive-label">Academia activa</span>
          <strong>{formData.dojo_name || "Sin definir"}</strong>
        </div>
        <div>
          <span className="executive-label">Zona horaria</span>
          <strong>{formData.timezone || "No asignada"}</strong>
        </div>
        <div>
          <span className="executive-label">Moneda</span>
          <strong>{formData.currency}</strong>
        </div>
      </div>

      <form className="card form-section surface-glass" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            name="dojo_name"
            value={formData.dojo_name}
            onChange={handleChange}
            placeholder="Nombre del dojo"
            disabled={saving}
            required
          />
          <input
            name="owner_name"
            value={formData.owner_name}
            onChange={handleChange}
            placeholder="Propietario"
            disabled={saving}
            required
          />
        </div>
        <div className="form-row">
          <input
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
            placeholder="Correo de contacto"
            type="email"
            disabled={saving}
            required
          />
          <input
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
            placeholder="Teléfono"
            disabled={saving}
          />
        </div>
        <div className="form-row">
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Ciudad"
            disabled={saving}
          />
          <input
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            placeholder="Zona horaria (ej: America/Mexico_City)"
            disabled={saving}
          />
        </div>
        <div className="form-row">
          <input
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            placeholder="Moneda"
            disabled={saving}
          />
          <button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

        <button type="button" className="secondary danger-button" style={{ maxWidth: 220 }} onClick={logout}>
          Cerrar sesión
        </button>
      </form>
    </section>
  );
}
