import { useEffect, useState, useMemo } from 'react';
import { api } from '../lib/api';
import type { Schedule, Teacher } from '../types';
import { PageHeader } from '../components/PageHeader';
import { DataTable } from '../components/DataTable';
import { SearchFilter } from '../components/SearchFilter';
import { useApi } from '../hooks/useApi';
import { useForm } from '../hooks/useApi';
import { useAlert } from '../contexts/AlertContext';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export function SchedulesPage() {
  const { data: schedules = [], loading: schedulesLoading, refetch: refetchSchedules } = useApi<Schedule[]>('/schedules/');
  const { data: teachers = [], loading: teachersLoading } = useApi<Teacher[]>('/teachers/');
  const { success, error: showError } = useAlert();
  const [searchQuery, setSearchQuery] = useState('');

  const { values: formData, loading: saving, handleChange, handleSubmit, reset } = useForm({
    initialValues: {
      class_type: 'BJJ',
      day_of_week: 0,
      start_time: '18:00',
      end_time: '19:00',
      teacher_id: '',
      max_students: 15,
      active: true,
    },
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          teacher_id: values.teacher_id ? parseInt(values.teacher_id) : undefined,
        };
        await api.post('/schedules/', payload);
        success('Horario registrado exitosamente');
        reset();
        refetchSchedules();
      } catch {
        showError('Error al registrar el horario');
      }
    },
  });

  async function deleteSchedule(id: number) {
    if (!confirm('¿Eliminar horario de clase?')) return;
    try {
      await api.delete(`/schedules/${id}`);
      success('Horario eliminado exitosamente');
      refetchSchedules();
    } catch {
      showError('Error al eliminar el horario');
    }
  }

  const getTeacherName = (id?: number) => {
    if (!id) return '-';
    return teachers.find(t => t.id === id)?.name || '-';
  };

  const rows = useMemo(() =>
    schedules
      .filter(s => {
        const teacherName = getTeacherName(s.teacher_id).toLowerCase();
        const search = searchQuery.toLowerCase();
        return s.class_type.toLowerCase().includes(search) || 
               DAYS[s.day_of_week].toLowerCase().includes(search) ||
               teacherName.includes(search);
      })
      .map(s => [
        s.class_type,
        DAYS[s.day_of_week],
        `${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)}`,
        getTeacherName(s.teacher_id),
        `${s.max_students} alumnos`,
        <button key={s.id} onClick={() => deleteSchedule(s.id)} className="btn-secondary" style={{ fontSize: '0.875rem' }}>Eliminar</button>
      ]),
    [schedules, searchQuery, teachers]
  );

  const loading = schedulesLoading || teachersLoading;

  if (loading) {
    return (
      <div className="page">
        <PageHeader title="Horarios de Clases" subtitle="Gestión del calendario de clases" />
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div className="spinner"></div>
          <p>Cargando horarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader title="Horarios de Clases" subtitle="Gestión del calendario de clases" />

      <form onSubmit={handleSubmit} className="form-section card">
        <h3>Nuevo Horario</h3>
        <div className="form-grid">
          <select
            name="class_type"
            value={formData.class_type}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="BJJ">BJJ</option>
            <option value="MMA">MMA</option>
            <option value="Karate">Karate</option>
            <option value="TKD">TKD</option>
          </select>

          <select
            name="day_of_week"
            value={formData.day_of_week}
            onChange={handleChange}
            disabled={saving}
          >
            {DAYS.map((day, idx) => (
              <option key={idx} value={idx}>{day}</option>
            ))}
          </select>

          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            disabled={saving}
          />
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            disabled={saving}
          />

          <select
            name="teacher_id"
            value={formData.teacher_id}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="">Sin instructor asignado</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <input
            type="number"
            name="max_students"
            placeholder="Máximo de alumnos"
            value={formData.max_students}
            onChange={handleChange}
            min="5"
            disabled={saving}
          />

          <button type="submit" disabled={saving} className="btn-primary" style={{ gridColumn: 'span 2' }}>
            {saving ? 'Guardando...' : 'Agregar Horario'}
          </button>
        </div>
      </form>

      <SearchFilter
        placeholder="Buscar clase, día o instructor..."
        value={searchQuery}
        onSearch={setSearchQuery}
      />

      {rows.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>No hay horarios de clases registrados.</p>
        </div>
      ) : (
        <DataTable
          headers={['Tipo de Clase', 'Día', 'Horario', 'Instructor', 'Capacidad', 'Acción']}
          rows={rows}
          caption="Horarios de clases"
          emptyMessage="No hay horarios de clases registrados."
        />
      )}
    </div>
  );
}
