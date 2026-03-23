import { useState, useMemo } from 'react';
import { api } from '../lib/api';
import type { Teacher } from '../types';
import { PageHeader } from '../components/PageHeader';
import { DataTable } from '../components/DataTable';
import { SearchFilter } from '../components/SearchFilter';
import { useApi } from '../hooks/useApi';
import { useForm } from '../hooks/useApi';
import { useAlert } from '../contexts/AlertContext';

export function TeachersPage() {
  const { data: teachersData = [], loading, refetch } = useApi<Teacher[]>('/teachers/');
  const teachers = teachersData ?? [];
  const { success, error: showError } = useAlert();
  const [searchQuery, setSearchQuery] = useState('');

  const { values: formData, loading: saving, handleChange, handleSubmit, reset } = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      specialties: '',
      hourly_rate: 50,
      active: true,
    },
    onSubmit: async (values) => {
      try {
        await api.post('/teachers/', values);
        success('Instructor registrado exitosamente');
        reset();
        refetch();
      } catch {
        showError('Error al registrar el instructor');
      }
    },
  });

  async function deleteTeacher(id: number) {
    if (!confirm('¿Eliminar instructor?')) return;
    try {
      await api.delete(`/teachers/${id}`);
      success('Instructor eliminado exitosamente');
      refetch();
    } catch {
      showError('Error al eliminar el instructor');
    }
  }

  const rows = useMemo(() => 
    teachers
      .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.email.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(t => [
        t.name,
        t.email,
        t.phone || '-',
        t.specialties || '-',
        `$${t.hourly_rate}/hr`,
        <button key={t.id} onClick={() => deleteTeacher(t.id)} className="btn-secondary" style={{ fontSize: '0.875rem' }}>Eliminar</button>
      ]),
    [teachers, searchQuery]
  );

  if (loading) {
    return (
      <div className="page page-shell">
        <PageHeader title="Instructores" subtitle="Gestión de profesores y especialistas" />
        <div className="hero-empty surface-glass">
          <div className="spinner"></div>
          <p>Cargando instructores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-shell">
      <PageHeader title="Instructores" subtitle="Gestión de profesores y especialistas" />

      <form onSubmit={handleSubmit} className="form-section card surface-glass">
        <h3>Nuevo Instructor</h3>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Nombre completo"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={saving}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={saving}
            required
          />
          <input
            type="tel"
            placeholder="Teléfono (opcional)"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={saving}
          />
          <input
            type="text"
            placeholder="Especialidades (ej: BJJ,Karate)"
            name="specialties"
            value={formData.specialties}
            onChange={handleChange}
            disabled={saving}
          />
          <input
            type="number"
            placeholder="Valor por hora ($)"
            name="hourly_rate"
            value={formData.hourly_rate}
            onChange={handleChange}
            min="0"
            disabled={saving}
          />
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Guardando...' : 'Agregar Instructor'}
          </button>
        </div>
      </form>

      <SearchFilter
        placeholder="Buscar instructor por nombre o email..."
        value={searchQuery}
        onSearch={setSearchQuery}
      />

      {rows.length === 0 ? (
        <div className="hero-empty surface-glass">
          <p>No hay instructores registrados todavía.</p>
        </div>
      ) : (
        <DataTable
          headers={['Nombre', 'Email', 'Teléfono', 'Especialidades', 'Valor/Hora', 'Acción']}
          rows={rows}
          caption="Lista de instructores"
          emptyMessage="No hay instructores registrados todavía."
        />
      )}
    </div>
  );
}
