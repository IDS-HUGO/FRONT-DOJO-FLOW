import { useEffect, useState, useMemo } from 'react';
import { api } from '../lib/api';
import type { Schedule, Teacher, Student } from '../types';
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
  const { data: students = [], loading: studentsLoading } = useApi<Student[]>('/students');
  const { success, error: showError } = useAlert();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');

  const { values: formData, loading: saving, handleChange, handleSubmit, reset } = useForm({
    initialValues: {
      class_type: 'BJJ',
      day_of_week: 0,
      start_time: '18:00',
      end_time: '19:00',
      active: true,
    },
    onSubmit: async (values) => {
      try {
        await api.post('/schedules/', values);
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

  async function enrollStudent() {
    if (!selectedSchedule || !selectedStudentId) {
      showError('Selecciona un alumno');
      return;
    }
    try {
      await api.post(`/schedules/${selectedSchedule.id}/enroll-student`, {
        student_id: parseInt(selectedStudentId)
      });
      success('Alumno inscrito exitosamente');
      setShowEnrollModal(false);
      setSelectedStudentId('');
      refetchSchedules();
    } catch (err: any) {
      showError(err.response?.data?.detail || 'Error al inscribir el alumno');
    }
  }

  async function assignTeacher() {
    if (!selectedSchedule || !selectedTeacherId) {
      showError('Selecciona un instructor');
      return;
    }
    try {
      await api.post(`/schedules/${selectedSchedule.id}/assign-teacher`, {
        teacher_id: parseInt(selectedTeacherId)
      });
      success('Instructor asignado exitosamente');
      setShowTeacherModal(false);
      setSelectedTeacherId('');
      refetchSchedules();
    } catch (err: any) {
      showError(err.response?.data?.detail || 'Error al asignar instructor');
    }
  }

  async function unenrollStudent(scheduleId: number, studentId: number) {
    if (!confirm('¿Desinscribir alumno?')) return;
    try {
      await api.delete(`/schedules/${scheduleId}/unenroll-student/${studentId}`);
      success('Alumno desinscrito exitosamente');
      refetchSchedules();
    } catch {
      showError('Error al desinscribir el alumno');
    }
  }

  async function removeTeacher(scheduleId: number, teacherId: number) {
    if (!confirm('¿Remover instructor?')) return;
    try {
      await api.delete(`/schedules/${scheduleId}/remove-teacher/${teacherId}`);
      success('Instructor removido exitosamente');
      refetchSchedules();
    } catch {
      showError('Error al remover instructor');
    }
  }

  const rows = useMemo(() =>
    schedules
      .filter(s => {
        const search = searchQuery.toLowerCase();
        return s.class_type.toLowerCase().includes(search) || 
               DAYS[s.day_of_week].toLowerCase().includes(search);
      })
      .map(s => [
        s.class_type,
        DAYS[s.day_of_week],
        `${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)}`,
        `${s.students?.length || 0} / ${s.max_students}`,
        s.teachers?.map(t => t.name).join(', ') || 'Sin instructor',
        <button 
          key={`enroll-${s.id}`}
          onClick={() => {
            setSelectedSchedule(s);
            setShowEnrollModal(true);
          }} 
          className="btn-secondary"
          style={{ fontSize: '0.75rem' }}
        >
          + Alumno
        </button>,
        <button 
          key={`teacher-${s.id}`}
          onClick={() => {
            setSelectedSchedule(s);
            setShowTeacherModal(true);
          }} 
          className="btn-secondary"
          style={{ fontSize: '0.75rem' }}
        >
          + Instructor
        </button>,
        <button 
          key={`delete-${s.id}`}
          onClick={() => deleteSchedule(s.id)} 
          className="btn-secondary" 
          style={{ fontSize: '0.75rem', backgroundColor: '#ef4444' }}
        >
          🗑️
        </button>
      ]),
    [schedules, searchQuery]
  );

  const loading = schedulesLoading || teachersLoading || studentsLoading;

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

          <button type="submit" disabled={saving} className="btn-primary" style={{ gridColumn: 'span 2' }}>
            {saving ? 'Guardando...' : 'Agregar Horario'}
          </button>
        </div>
      </form>

      <SearchFilter
        placeholder="Buscar clase o día..."
        value={searchQuery}
        onSearch={setSearchQuery}
      />

      {rows.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>No hay horarios de clases registrados.</p>
        </div>
      ) : (
        <DataTable
          headers={['Tipo de Clase', 'Día', 'Horario', 'Alumnos', 'Instructor', '+ Alumno', '+ Instructor', 'Eliminar']}
          rows={rows}
          caption="Horarios de clases"
          emptyMessage="No hay horarios de clases registrados."
        />
      )}

      {/* Modal para inscribir alumno */}
      {showEnrollModal && selectedSchedule && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            minWidth: '400px'
          }}>
            <h3>Inscribir Alumno</h3>
            <p>Clase: <strong>{selectedSchedule.class_type}</strong> - {DAYS[selectedSchedule.day_of_week]}</p>
            
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            >
              <option value="">Selecciona un alumno...</option>
              {students
                .filter(s => !selectedSchedule.students?.some(st => st.id === s.id))
                .map(s => (
                  <option key={s.id} value={s.id}>{s.full_name}</option>
                ))
              }
            </select>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={enrollStudent}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                Inscribir
              </button>
              <button 
                onClick={() => setShowEnrollModal(false)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para asignar instructor */}
      {showTeacherModal && selectedSchedule && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            minWidth: '400px'
          }}>
            <h3>Asignar Instructor</h3>
            <p>Clase: <strong>{selectedSchedule.class_type}</strong> - {DAYS[selectedSchedule.day_of_week]}</p>
            
            <div style={{ marginBottom: '1rem' }}>
              <h4>Instructores asignados:</h4>
              {selectedSchedule.teachers && selectedSchedule.teachers.length > 0 ? (
                <ul>
                  {selectedSchedule.teachers.map(t => (
                    <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem' }}>
                      <span>{t.name}</span>
                      <button
                        onClick={() => removeTeacher(selectedSchedule.id, t.id)}
                        style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.25rem 0.5rem', cursor: 'pointer', borderRadius: '0.25rem' }}
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#999' }}>Sin instructores asignados</p>
              )}
            </div>

            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            >
              <option value="">Selecciona un instructor...</option>
              {teachers
                .filter(t => !selectedSchedule.teachers?.some(st => st.id === t.id))
                .map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))
              }
            </select>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={assignTeacher}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                Asignar
              </button>
              <button 
                onClick={() => setShowTeacherModal(false)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}